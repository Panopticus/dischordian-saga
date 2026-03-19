import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { setupPvpWebSocket } from "../pvpWs";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Stripe webhook MUST be registered BEFORE express.json() for signature verification
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeKey || !webhookSecret) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey);
      const sig = req.headers["stripe-signature"] as string;
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

      // Handle checkout completion
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const userId = parseInt(session.metadata?.user_id || session.client_reference_id || "0");
        const productKey = session.metadata?.product_key || "";
        const quantity = parseInt(session.metadata?.quantity || "1");

        if (userId && productKey) {
          const { fulfillPurchase } = await import("../routers/store");
          const { getDb } = await import("../db");
          const { storePurchases } = await import("../../drizzle/schema");
          const db = await getDb();
          if (db) {
            await db.insert(storePurchases).values({
              userId,
              stripePaymentIntentId: session.payment_intent || null,
              productKey,
              paymentMethod: "stripe",
              quantity,
              amount: session.amount_total || 0,
              fulfilled: 1,
            });
            await fulfillPurchase(userId, productKey, quantity);
            console.log(`[Webhook] Fulfilled purchase: user=${userId} product=${productKey} qty=${quantity}`);
          }
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error(`[Webhook] Error: ${err.message}`);
      res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // PvP WebSocket server
  setupPvpWebSocket(server);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
