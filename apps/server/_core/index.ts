// Must be first — guarantees globalThis.crypto before jose/sdk initialize.
import "./crypto-polyfill";
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
import { setupChessPvpWebSocket } from "../chessWs";
import { registerSpriteProxy } from "../spriteProxy";
import { registerChessMultiplayer } from "../chessMultiplayer";
import { ENV } from "./env";
import { performanceMiddleware } from "../performanceMonitor";
import { sentryErrorHandler, waitForSentry } from "../sentry";

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

  // Trust Railway/Render reverse proxy — required for req.protocol to be "https"
  app.set("trust proxy", 1);

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

      // Event-level idempotency (Task 6.1 + #95 follow-up).
      //
      // Stripe retries webhook delivery on any 5xx response, so the
      // same event id can arrive multiple times. We have two layers:
      //
      //   Layer A (this block) — `processed_webhook_events` keyed by
      //     `event.id`. Closes the gap that the layer-B unique index
      //     leaves open for credits / dream purchases (which carry
      //     no payment intent and therefore can't be caught by a
      //     unique index on `stripePaymentIntentId`).
      //
      //   Layer B (further down) — unique index on
      //     `storePurchases.stripePaymentIntentId` (migration 0035).
      //     Catches the case where the *same payment intent* arrives
      //     under a different event id (e.g. stripe re-issues the
      //     event with a new id; rare but possible).
      //
      // Both layers fail closed: any duplicate-key error returns a
      // 200 immediately and skips fulfillment.
      try {
        const { getDb } = await import("../db");
        const { processedWebhookEvents } = await import("../../db/schema");
        const db = await getDb();
        if (db) {
          await db.insert(processedWebhookEvents).values({
            eventId: event.id,
            eventType: event.type,
            source: "stripe",
          });
        }
        // If db is null (tests / local without MySQL) the layer-A
        // check is bypassed; layer B still applies in production where
        // db is always present.
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/duplicate|unique/i.test(msg)) {
          console.log(`[Webhook] Replay of event ${event.id} (${event.type}) — already processed. Skipping.`);
          return res.json({ received: true, duplicate: true });
        }
        throw err;
      }

      // Handle checkout completion.
      //
      // Layer B idempotency — see comment above. The unique index on
      // `stripePaymentIntentId` is preserved as a defense-in-depth
      // guard for the cross-event-id same-payment-intent case.
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const userId = parseInt(session.metadata?.user_id || session.client_reference_id || "0");
        const productKey = session.metadata?.product_key || "";
        const quantity = parseInt(session.metadata?.quantity || "1");
        const stripePaymentIntentId: string | null = session.payment_intent ?? null;

        if (userId && productKey) {
          const { fulfillPurchase } = await import("../routers/store");
          const { getDb } = await import("../db");
          const { storePurchases } = await import("../../db/schema");
          const { eq } = await import("drizzle-orm");
          const db = await getDb();
          if (db) {
            // Idempotency check: if we already have a row for this
            // payment intent, the webhook is a replay — skip.
            if (stripePaymentIntentId) {
              const existing = await db.select({ id: storePurchases.id })
                .from(storePurchases)
                .where(eq(storePurchases.stripePaymentIntentId, stripePaymentIntentId))
                .limit(1);
              if (existing[0]) {
                console.log(`[Webhook] Duplicate delivery for intent ${stripePaymentIntentId} — already fulfilled. Skipping.`);
                return res.json({ received: true, duplicate: true });
              }
            }

            try {
              await db.insert(storePurchases).values({
                userId,
                stripePaymentIntentId,
                productKey,
                paymentMethod: "stripe",
                quantity,
                amount: session.amount_total || 0,
                fulfilled: 1,
              });
            } catch (err: unknown) {
              // If the unique index caught a race (two workers got
              // the same webhook delivery), treat it as already
              // handled.
              const msg = err instanceof Error ? err.message : String(err);
              if (/duplicate|unique/i.test(msg)) {
                console.log(`[Webhook] Race on intent ${stripePaymentIntentId} — unique index caught it. Skipping fulfillment.`);
                return res.json({ received: true, duplicate: true });
              }
              throw err;
            }

            await fulfillPurchase(userId, productKey, quantity);
            console.log(`[Webhook] Fulfilled purchase: user=${userId} product=${productKey} qty=${quantity} intent=${stripePaymentIntentId ?? "-"}`);
          }
        }
      }

      res.json({ received: true });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Webhook] Error: ${errMsg}`);
      res.status(400).json({ error: `Webhook Error: ${errMsg}` });
    }
  });

  // Performance monitoring — mount before route handlers
  app.use(performanceMiddleware);

  // Task 6.1 — CORS hardening.
  //
  // Previously this middleware reflected the request `Origin` header
  // straight back in dev and set a single-origin header in prod,
  // which meant:
  //   1. Multiple prod origins couldn't be supported (only one string).
  //   2. `Access-Control-Allow-Origin: *` paired with
  //      `Allow-Credentials: true` is a spec violation the browser
  //      rejects — nothing actually worked in that combo.
  //   3. No origin validation at all in dev, so any site could
  //      open the dev endpoint with cookies.
  //
  // The new middleware:
  //   - Reads the configured allowlist from `ENV.corsAllowlist`.
  //   - Only echoes the request `Origin` back if it's on the
  //     allowlist (or `*` is configured).
  //   - Sets `Vary: Origin` so caches don't poison cross-origin
  //     responses.
  //   - Sends credentials with a specific origin, never with `*`.
  //   - Drops the header entirely for unrecognized origins, which
  //     makes the browser block the request cleanly instead of
  //     half-working.
  const corsAllowlist = ENV.corsAllowlist;
  const corsAllowAny = corsAllowlist.includes("*");
  app.use((req, res, next) => {
    const reqOrigin = req.headers.origin;
    let resolvedOrigin: string | null = null;

    if (reqOrigin && (corsAllowAny || corsAllowlist.includes(reqOrigin))) {
      resolvedOrigin = reqOrigin;
    } else if (!reqOrigin && corsAllowlist.length === 1 && !corsAllowAny) {
      // Same-origin / server-to-server call — use the single
      // configured origin if there's exactly one.
      resolvedOrigin = corsAllowlist[0];
    }

    if (resolvedOrigin) {
      res.header("Access-Control-Allow-Origin", resolvedOrigin);
      res.header("Vary", "Origin");
      // Credentials are safe to advertise only when we've pinned a
      // specific origin — never alongside `*`.
      if (resolvedOrigin !== "*") {
        res.header("Access-Control-Allow-Credentials", "true");
      }
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Rate limiting
  const { default: rateLimit } = await import("express-rate-limit");
  const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later" },
  });
  const llmLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "LLM rate limit exceeded, please wait" },
  });
  app.use("/api/trpc", generalLimiter);
  app.use("/api/trpc/elara", llmLimiter);
  app.use("/api/trpc/codex", llmLimiter);

  // Sprite proxy (before CSRF — it's a GET endpoint for images)
  registerSpriteProxy(app);

  // OAuth callback — MUST be registered BEFORE CSRF middleware
  registerOAuthRoutes(app);

  // CSRF protection
  const { csrfProtection } = await import("../csrf");
  app.use("/api", csrfProtection);
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

  // #88 Telemetry — Sentry error capture.
  //
  // Mounted AFTER all routes (Express error-handling middleware runs
  // last in the chain). When SENTRY_DSN is set, every unhandled error
  // bubbling out of a route handler is reported before the next error
  // handler renders the response. When the env var is unset (local
  // dev / tests / CI), the captureException call is a no-op and the
  // error continues down the middleware chain unchanged.
  app.use(sentryErrorHandler);

  // Block startup briefly until Sentry's lazy init has resolved so
  // any error thrown before request-binding (e.g. during the server
  // bootstrap below) is also captured. Resolves immediately when
  // SENTRY_DSN is unset.
  await waitForSentry();

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // PvP WebSocket servers
  setupPvpWebSocket(server);
  setupChessPvpWebSocket(server);

  // Terminus Swarm PvP raids
  const { setupTerminusPvpWebSocket } = await import("../terminusWs");
  setupTerminusPvpWebSocket(server);

  // Chess multiplayer WebSocket
  registerChessMultiplayer(server);

  // Re-arm chess tournament auto-forfeit timers for in-flight rounds.
  if (process.env.NODE_ENV !== "test") {
    const { rehydrateChessTournamentTimers } = await import("../routers/chess");
    rehydrateChessTournamentTimers().catch(e =>
      console.error("[Chess] tournament timer rehydrate error:", e),
    );
  }

  // Duelyst card game multiplayer WebSocket
  const { setupDuelystWebSocket } = await import("../duelystWs");
  setupDuelystWebSocket(server);

  // Living Universe tick — expires stale events and re-checks thresholds
  // once per hour. Safe to run in all environments because it short-circuits
  // when there are no active events.
  if (process.env.NODE_ENV !== "test") {
    const { runUniverseTick } = await import("../routers/livingUniverse");
    const ONE_HOUR_MS = 60 * 60 * 1000;
    setInterval(() => {
      runUniverseTick().catch(e => console.error("[LivingUniverse] tick error:", e));
    }, ONE_HOUR_MS);
    // Run once on startup so the first expiry doesn't wait an hour
    runUniverseTick().catch(e => console.error("[LivingUniverse] initial tick error:", e));

    // Dead Man's Circuit season tick — opens the in-window season,
    // advances the phase column as the 28-day window progresses, and
    // closes any season whose end date has passed. Safe to no-op
    // outside a season window. Hourly is plenty since phase boundaries
    // are day-grained.
    const { tickCircuitSeasons } = await import("../services/circuitSeasonService");
    setInterval(() => {
      tickCircuitSeasons().catch(e => console.error("[Circuit] tick error:", e));
    }, ONE_HOUR_MS);
    // Run once on startup so a fresh deploy opens the active season
    // without waiting for the first hour.
    tickCircuitSeasons().catch(e => console.error("[Circuit] initial tick error:", e));

    // Witnessing §3 — load the community Dischordia Cycle meter
    // from MySQL into the in-memory cache on startup. If the DB
    // has no row yet (fresh install), seeds defaults. Falls back
    // to in-memory-only when DB is unavailable.
    const { dischordiaCycleService } = await import("../services/dischordiaCycleService");
    dischordiaCycleService
      .hydrate()
      .catch(e => console.error("[DischordiaCycle] initial hydrate error:", e));

    // Ensure the `announcements` tables exist. Migration 0049 is
    // orphaned from _journal.json (see apps/db/README.md), so drizzle
    // skips it on deploy. The bootstrap runs the same DDL with
    // IF NOT EXISTS guards, making the Architect's Console's
    // announcements tab functional on every environment.
    const { bootstrapAnnouncementsTables } = await import("../services/announcementsBootstrap");
    bootstrapAnnouncementsTables().catch(e =>
      console.error("[AnnouncementsBootstrap] failed:", e),
    );

    // Ensure citizen_characters.foundation exists. Migration 0054 is
    // orphaned from _journal.json; without this column every SELECT
    // against citizen_characters fails ("Unknown column 'foundation'")
    // and the Awakening handoff breaks.
    const { bootstrapCitizenSchema } = await import("../services/citizenSchemaBootstrap");
    bootstrapCitizenSchema().catch(e =>
      console.error("[CitizenSchemaBootstrap] failed:", e),
    );

    // Ensure processed_webhook_events exists. Migration 0055 is
    // orphaned from _journal.json; without this table the Stripe
    // webhook handler's event-level idempotency check fails open
    // and replays of credit/dream purchases (which carry no payment
    // intent and therefore aren't caught by the storePurchases
    // unique index) could double-fulfill.
    const { bootstrapWebhookEventsTable } = await import("../services/webhookEventsBootstrap");
    bootstrapWebhookEventsTable().catch(e =>
      console.error("[WebhookEventsBootstrap] failed:", e),
    );
  }

  // Transmission achievements — upsert the `achievements` table rows
  // for every Meme broadcast reward so the architect console and
  // achievement UIs render proper names/icons. Idempotent (no-op if
  // the rows already match). Skipped in test env to keep unit tests
  // hermetic and in no-DB environments (function handles the guard).
  if (process.env.NODE_ENV !== "test") {
    (async () => {
      try {
        const { getDb } = await import("../db");
        const { seedTransmissionAchievements } = await import("../routers/transmissions");
        const db = await getDb();
        if (!db) return;
        const result = await seedTransmissionAchievements(db);
        console.log(
          `[TransmissionAchievements] seeded ${result.inserted} new, updated ${result.updated} (of ${result.total})`,
        );
      } catch (err) {
        console.error("[TransmissionAchievements] boot seed failed:", err);
      }
    })();
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
