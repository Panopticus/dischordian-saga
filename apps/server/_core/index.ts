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
import { securityHeaders } from "./securityHeaders";
import { performanceMiddleware } from "../performanceMonitor";
import { sentryErrorHandler, waitForSentry } from "../sentry";
import { waitForOTel } from "../otel";
import { metricsHandler } from "../metrics";
import { sql } from "drizzle-orm";
import { publicIpRateLimit } from "../ipRateLimit";

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
        } else if (process.env.NODE_ENV === "production") {
          // Fail-closed in prod: if the DB is missing, layer-A
          // idempotency cannot run. Returning 5xx asks Stripe to retry
          // (it will, with backoff) rather than silently letting a
          // non-checkout event slip past with no replay guard.
          console.error("[Webhook] DB unavailable in production; refusing to process without idempotency layer A");
          return res.status(503).json({ error: "service_unavailable_db_required" });
        }
        // In non-prod with a missing db, both layers are bypassed —
        // acceptable for local dev where Stripe isn't actually firing.
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
        // Narrow the discriminated-union event payload by checking
        // event.type — at this point TS knows event.data.object is a
        // Stripe.Checkout.Session, no `as any` needed. Pull only the
        // fields we use rather than relying on a wide cast.
        const session = event.data.object;
        const userId = parseInt(
          session.metadata?.user_id ||
            (typeof session.client_reference_id === "string"
              ? session.client_reference_id
              : "") ||
            "0",
        );
        const productKey = session.metadata?.product_key || "";
        const quantity = parseInt(session.metadata?.quantity || "1");
        const stripePaymentIntentId: string | null =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null);

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

            // Use the Stripe payment intent id as the fulfilment
            // ledger key so a webhook retry on the same intent is a
            // no-op via the unique-key idempotency check inside
            // fulfillPurchase. For the rare (and pre-Migration-0035)
            // case where the intent id is missing, synthesise one
            // from the session id so we still get an audit row.
            const fulfillmentLedgerId =
              stripePaymentIntentId ?? `stripe-session:${session.id}`;
            const fulfilResult = await fulfillPurchase(
              userId,
              productKey,
              quantity,
              fulfillmentLedgerId,
            );
            console.log(
              `[Webhook] Fulfilled purchase: user=${userId} product=${productKey} qty=${quantity} intent=${stripePaymentIntentId ?? "-"}` +
                (fulfilResult.alreadyFulfilled ? " (idempotent skip)" : ""),
            );
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

  // Security headers — CSP, HSTS, XFO, nosniff, etc.
  app.use(securityHeaders({ isProduction: ENV.isProduction }));

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
  // Auth endpoints — covers OAuth start/callback and refresh-token
  // rotation. Real users hit these a handful of times per session;
  // 30/min per IP is comfortably above that and well below what's
  // useful for brute-forcing or refresh-token-stuffing.
  const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many auth requests, please try again later" },
  });
  app.use("/api/trpc", generalLimiter);
  app.use("/api/trpc/elara", llmLimiter);
  app.use("/api/trpc/codex", llmLimiter);
  app.use("/api/oauth", authLimiter);
  app.use("/api/refresh", authLimiter);

  // Sprite proxy (before CSRF — it's a GET endpoint for images)
  registerSpriteProxy(app);

  // D2 — Prometheus metrics endpoint. Mounted before per-IP rate
  // limiting because scrapers come from a known address (and gated
  // by METRICS_SCRAPE_TOKEN when set). Returns Prometheus-format
  // exposition for default Node metrics + tRPC histograms + WS /
  // currency counters.
  app.get("/metrics", metricsHandler);

  // /api/health — Railway healthcheck + CI readiness probe.
  // Mounted BEFORE per-IP rate limit and CSRF so that orchestrators
  // and CI can hit it without ceremony. Returns 200 only if the
  // process is alive AND the DB ping succeeds (so a stale-static
  // SPA doesn't fool railway into thinking the server is healthy
  // when Express has actually crashed).
  app.get("/api/health", async (req, res) => {
    const out: { ok: boolean; uptimeSec: number; dbPing?: boolean; sentryReady?: boolean; otelReady?: boolean } = {
      ok: true,
      uptimeSec: Math.floor(process.uptime()),
    };
    try {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (db) {
        await db.execute(sql`SELECT 1`);
        out.dbPing = true;
      } else {
        out.dbPing = false;
        out.ok = false;
      }
    } catch {
      out.dbPing = false;
      out.ok = false;
    }
    try {
      const Sentry = await import("@sentry/node");
      out.sentryReady = !!Sentry.getClient();
    } catch {
      out.sentryReady = false;
    }
    out.otelReady = !!(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
    res.status(out.ok ? 200 : 503).json(out);
  });

  // D3 — Per-IP token-bucket rate limit on every unauthenticated
  // surface (everything not gated by the OAuth callback or the
  // protectedProcedure auth check). Uses the existing
  // express-rate-limit dep with sensible defaults; the WS
  // wsRateLimit module covers WS-specific bursts post-auth.
  app.use("/api", publicIpRateLimit);

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

  // Same pattern for OpenTelemetry (#88). Init resolves immediately
  // when OTEL_ENABLED!=1 or the OTLP endpoint isn't configured. When
  // it does load, every tRPC handler wrapped in `withSpan` starts
  // exporting traces from the first request.
  await waitForOTel();

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // PvP WebSocket servers
  setupPvpWebSocket(server);
  setupChessPvpWebSocket(server);

  // T10 — CADES real-time PvP signaling. Stateless WebRTC SDP/ICE
  // relay between two peers in a `match_id` room. The Godot side
  // (games/cades-fps/autoloads/MultiplayerBridge.gd) handles the
  // actual peer-connection lifecycle; this only brokers handshakes.
  const { setupCadesSignalingWebSocket } = await import("../cadesSignalingWs");
  setupCadesSignalingWebSocket(server);

  // T13 — Co-op match runner poller. Watches coop_card_sessions for
  // pending rows and registers per-session runner state. The pvpWs
  // layer reads the runner table when a party member connects with
  // `?coop=<sessionId>` to spawn the underlying 1v1 match instance.
  if (process.env.NODE_ENV !== "test") {
    const { startCoopRunnerPoller } = await import("../coopMatchRunner");
    startCoopRunnerPoller();
  }

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

    // Tier 2A — one-shot competitive ratings backfill from legacy
    // per-gameType tables. Idempotent via marker row; subsequent
    // boots are no-ops. Doesn't block startup; fires async.
    const { runCompetitiveRatingsBackfillOnce } = await import("../services/competitiveRatingsBackfillService");
    runCompetitiveRatingsBackfillOnce().catch(e => console.error("[Competitive] Backfill error:", e));

    // Tier 1 — one-shot legacy userProgress.title → userCosmeticLoadout
    // backfill so existing equipped titles survive the migration.
    const { runLegacyTitleBackfillOnce } = await import("../services/legacyTitleBackfillService");
    runLegacyTitleBackfillOnce().catch(e => console.error("[LegacyTitle] Backfill error:", e));

    // Tier 4 — Guild quest reset tick. Resets daily / weekly / seasonal
    // quest progress rows that crossed their respective anchor.
    // Idempotent on the resetAt comparison so frequent ticks are safe.
    const { runQuestResetTick } = await import("../services/guildQuestService");
    setInterval(() => {
      runQuestResetTick().catch(e => console.error("[GuildQuests] tick error:", e));
    }, ONE_HOUR_MS);
    runQuestResetTick().catch(e => console.error("[GuildQuests] initial tick error:", e));

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

    // Yearly event scheduler — activates Foundation Day / Severance /
    // Mechronis Festival / Memorial Day on their anchor dates, closes
    // them after durationDays, prunes the ripple ledger. Hourly is
    // plenty: anchor + duration is day-grained and the activation pass
    // is unique-key-guarded against double-fire.
    const { yearlyEventScheduler } = await import("../services/yearlyEventScheduler");
    setInterval(() => {
      yearlyEventScheduler.tick().catch(e => console.error("[Yearly] tick error:", e));
    }, ONE_HOUR_MS);
    yearlyEventScheduler.tick().catch(e => console.error("[Yearly] initial tick error:", e));

    // Mystery Engine — hydrate the in-memory dynamic registry
    // from persisted mystery_seeds rows. Runs once on startup
    // before the closure cron, so any vote-spawned mysteries
    // compiled in prior server lifetimes are immediately
    // openable. Idempotent (compile is deterministic) so a
    // half-completed boot is safe to retry.
    const { bootstrapMysteryRegistry } = await import("../services/mysteryRegistryBootstrap");
    bootstrapMysteryRegistry().catch(e =>
      console.error("[MysteryRegistryBootstrap] failed:", e),
    );

    // Trade Empire season tick — drives the political season clock
    // and per-user agenda ticks. Phase 6 of the items-matter / GoT
    // arc. Idempotent (compares wall-clock to persisted state); 5-min
    // interval is plenty since phase boundaries are wall-hour grained
    // and agenda ticks are wall-day grained.
    const FIVE_MIN_MS = 5 * 60 * 1000;
    const { runSeasonTick } = await import("../services/seasonTickService");
    setInterval(() => {
      runSeasonTick().catch(e => console.error("[SeasonTick] tick error:", e));
    }, FIVE_MIN_MS);
    // Run once on startup so a fresh deploy initialises the season
    // clock row without waiting five minutes.
    runSeasonTick().catch(e => console.error("[SeasonTick] initial tick error:", e));

    // Mystery Engine closure tick — picks expired epoch_vote_tallies
    // (expiresAt <= now AND isClosed = 0), writes the winning option,
    // and compiles a MysterySeed → MysteryDefinition for downstream
    // case opening. See apps/server/services/mysteryClosureCron.ts +
    // docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10. Hourly is
    // sufficient — vote durations are 72h / 7d / 30d so an hour of
    // post-expiry latency is invisible to players.
    const { runMysteryClosure } = await import("../services/mysteryClosureCron");
    setInterval(() => {
      runMysteryClosure().catch(e => console.error("[MysteryClosure] tick error:", e));
    }, ONE_HOUR_MS);
    runMysteryClosure().catch(e => console.error("[MysteryClosure] initial tick error:", e));

    // Data-retention sweeps (docs/legal/RETENTION_POLICY.md). Hourly
    // tick: hard-deletes soft-deleted accounts past their 30-day
    // grace, purges guild_chat older than 90 days, and analytics_events
    // older than 24 months. Each function is idempotent and
    // fire-and-forget (best-effort logged on failure).
    const { runRetentionTick } = await import("../services/retentionService");
    setInterval(() => {
      runRetentionTick().catch(e => console.error("[Retention] tick error:", e));
    }, ONE_HOUR_MS);
    runRetentionTick().catch(e => console.error("[Retention] initial tick error:", e));

    // Faction-reputation decay (docs/operations/TRADE_DIPLOMACY.md
    // §"Decay"). Bleeds every non-zero faction reputation toward 0 by
    // 1 unit per tick so a one-time max-out doesn't grant permanent
    // trade discounts. Idempotent; fire-and-forget.
    const { runFactionReputationDecayTick } = await import(
      "../services/factionReputationService"
    );
    setInterval(() => {
      runFactionReputationDecayTick().catch(e =>
        console.error("[FactionReputation] decay tick error:", e),
      );
    }, ONE_HOUR_MS);
    runFactionReputationDecayTick().catch(e =>
      console.error("[FactionReputation] initial decay error:", e),
    );

    // Phase D.5 — Trade route saturation decay. Bleeds the per-sector
    // oversupply meter back toward zero (5 pts/hr) so an idle route
    // recovers from a price crash. Bumps happen at trade-completion
    // sites in tradeEmpire.ts (completeMission + recordRouteRun). See
    // schema doc-comment at apps/db/schema.ts:6974 (audit-allow:
    // pending-feature Phase D.5) and the consumer service at
    // apps/server/services/tradeRouteSaturationService.ts.
    const { decaySaturation } = await import(
      "../services/tradeRouteSaturationService"
    );
    setInterval(() => {
      decaySaturation().catch(e =>
        console.error("[TradeRouteSaturation] decay tick error:", e),
      );
    }, ONE_HOUR_MS);
    decaySaturation().catch(e =>
      console.error("[TradeRouteSaturation] initial decay error:", e),
    );

    // Phase D.5 — Research race tick. Pending rows whose deadlineMs
    // has elapsed are resolved as `rival_won` and the player gets a
    // notification. See schema doc-comment at apps/db/schema.ts:6993
    // and the consumer service at
    // apps/server/services/tradeResearchRaceService.ts.
    const { tickResearchRaces } = await import(
      "../services/tradeResearchRaceService"
    );
    setInterval(() => {
      tickResearchRaces().catch(e =>
        console.error("[TradeResearchRace] tick error:", e),
      );
    }, ONE_HOUR_MS);
    tickResearchRaces().catch(e =>
      console.error("[TradeResearchRace] initial tick error:", e),
    );

    // Phase D.5 — Convergence climax doom-clock tick. Opens the
    // climax window when convergence ≥ 100 and auto-resolves it 72h
    // later if the player misses their choice. See schema doc-comment
    // at apps/db/schema.ts:7048 and the consumer service at
    // apps/server/services/convergenceClimaxService.ts.
    const { tickConvergenceClimax } = await import(
      "../services/convergenceClimaxService"
    );
    setInterval(() => {
      tickConvergenceClimax().catch(e =>
        console.error("[ConvergenceClimax] tick error:", e),
      );
    }, ONE_HOUR_MS);
    tickConvergenceClimax().catch(e =>
      console.error("[ConvergenceClimax] initial tick error:", e),
    );

    // NARRATIVE_ARCHITECTURE.md §0 — Global Light/Dark alignment meter.
    // SUMs character-sheet morality + pressureEvents (moralityHumanity /
    // moralityMachine) into the singleton row at global_alignment.id=1.
    // Read by Hierarchy invasion cadence, Architect-Triggered Events,
    // Soul Stones drop rates, and the GlobalAlignmentMeter component.
    // Hourly is plenty — the meter shifts on the order of days, and the
    // try/catch ensures a stuck recompute never kills the other ticks.
    const { recomputeGlobalAlignment } = await import(
      "../services/globalAlignmentService"
    );
    setInterval(() => {
      recomputeGlobalAlignment().catch(e =>
        console.error("[GlobalAlignment] recompute tick error:", e),
      );
    }, ONE_HOUR_MS);
    recomputeGlobalAlignment().catch(e =>
      console.error("[GlobalAlignment] initial recompute error:", e),
    );

    // Soul Stones — weekly soft-cap reset. Per
    // docs/design/SOUL_STONES_SYSTEM.md §1.2, combat-source drops
    // are capped at 15 stones per week per player. The reset job
    // zeroes `weeklyCollected` and bumps `weekResetAt` on any row
    // that's been past the one-week boundary. Hourly tick is fine —
    // the test is "weekResetAt < now - 1w" so the granularity is
    // the player's first eligible tick after the boundary.
    const { tickSoulStoneWeeklyResets } = await import(
      "../services/soulStonesService"
    );
    setInterval(() => {
      tickSoulStoneWeeklyResets().catch(e =>
        console.error("[SoulStones] weekly reset tick error:", e),
      );
    }, ONE_HOUR_MS);
    tickSoulStoneWeeklyResets().catch(e =>
      console.error("[SoulStones] initial weekly reset error:", e),
    );

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

    // chat_reports table is new on the moderation branch; no
    // drizzle migration ships with it yet, so bootstrap on startup
    // until the next journal reconciliation. Without this, fresh-DB
    // deploys 404 the moderator queue endpoints.
    const { bootstrapChatReportsTable } = await import("../services/chatReportsBootstrap");
    bootstrapChatReportsTable().catch(e =>
      console.error("[ChatReportsBootstrap] failed:", e),
    );

    // purchase_grants ledger — atomic-fulfilment idempotency guard.
    // Without it, the unique-key check that prevents duplicate
    // webhook fulfilment falls back to per-row 404s and the user
    // can be double-granted on retry. New table; bootstrap until
    // the next journal reconciliation.
    const { bootstrapPurchaseGrantsTable } = await import("../services/purchaseGrantsBootstrap");
    bootstrapPurchaseGrantsTable().catch(e =>
      console.error("[PurchaseGrantsBootstrap] failed:", e),
    );

    // dreamer_awareness silent-counter substrate. New table on the
    // dual-faction-recruitment branch; no drizzle migration ships
    // with it yet. Without this, fresh-DB deploys would lose the
    // dreamer-aware tagging path entirely (tag fires would silently
    // drop in the service's no-DB safe branch).
    const { bootstrapDreamerAwarenessTable } = await import(
      "../services/dreamerAwarenessBootstrap"
    );
    bootstrapDreamerAwarenessTable().catch((e) =>
      console.error("[DreamerAwarenessBootstrap] failed:", e),
    );

    // Unified Roster — crew_members column extensions + 5 new tables
    // for Resurrection Protocols, Hellbox restoration, apprentice gift
    // log + romance arc + personal-quest progress, and NPC world-death
    // state. New schema on the unified-roster branch; the journal flow
    // is mid-cutover, so we bootstrap until the next reconciliation.
    const { bootstrapUnifiedRosterTables } = await import(
      "../services/unifiedRosterBootstrap"
    );
    bootstrapUnifiedRosterTables().catch((e) =>
      console.error("[UnifiedRosterBootstrap] failed:", e),
    );

    // World-weave tables — yearly_events / yearly_event_participation /
    // ripple_events / memorial_inscriptions. Schema is in apps/db/schema.ts
    // but no drizzle migration ships yet (journal drift); same idempotent
    // DDL pattern as announcementsBootstrap.
    const { bootstrapWorldWeaveTables } = await import(
      "../services/worldWeaveBootstrap"
    );
    bootstrapWorldWeaveTables().catch((e) =>
      console.error("[WorldWeaveBootstrap] failed:", e),
    );

    // npc_memory table (NPC depth #6). Schema in apps/db/schema.ts;
    // idempotent CREATE TABLE IF NOT EXISTS pattern. See
    // apps/shared/npcs/memoryEvents.ts for event-key registry.
    const { bootstrapNpcMemoryTable } = await import(
      "../services/npcMemoryBootstrap"
    );
    bootstrapNpcMemoryTable().catch((e) =>
      console.error("[NpcMemoryBootstrap] failed:", e),
    );

    // shadow_tongue_redactions table (NPC depth #13). Per-player
    // Loredex redaction state. See apps/shared/universe/shadowTongue.ts
    // for the redaction policy module.
    const { bootstrapShadowTongueRedactionsTable } = await import(
      "../services/shadowTongueRedactionsBootstrap"
    );
    bootstrapShadowTongueRedactionsTable().catch((e) =>
      console.error("[ShadowTongueRedactionsBootstrap] failed:", e),
    );

    // tick_events table (NPC depth #12 — "what happened while you
    // were away" log). See apps/shared/universe/tickEvents.ts for
    // the typed event payloads.
    const { bootstrapTickEventsTable } = await import(
      "../services/tickEventsBootstrap"
    );
    bootstrapTickEventsTable().catch((e) =>
      console.error("[TickEventsBootstrap] failed:", e),
    );

    // Ensure citizen_characters.foundation exists. Migration 0054 is
    // orphaned from _journal.json; without this column every SELECT
    // against citizen_characters fails ("Unknown column 'foundation'")
    // and the Awakening handoff breaks.
    const { bootstrapCitizenSchema } = await import("../services/citizenSchemaBootstrap");
    bootstrapCitizenSchema().catch(e =>
      console.error("[CitizenSchemaBootstrap] failed:", e),
    );

    // audit/16 GA4 + GA2 — casino harm-reduction columns
    // (dailyLost, dailyVoidCasesOpened) on casino_state. The schema
    // declares them ahead of any journaled migration; production
    // tables built before audit/16 are missing them and the daily-
    // reset path fails with "Unknown column" on the next casino
    // visit.
    const { bootstrapCasinoHarmReductionColumns } = await import(
      "../services/casinoHarmReductionColumnsBootstrap"
    );
    bootstrapCasinoHarmReductionColumns().catch((e) =>
      console.error("[CasinoHarmReductionColumnsBootstrap] failed:", e),
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

    // Ensure user_agreements exists (migration 0063). New table for
    // GDPR Art. 7 demonstrable-consent recording. Required by
    // routers/account.ts (acceptAgreement / getAgreementStatus).
    const { bootstrapUserAgreementsTable } = await import("../services/userAgreementsBootstrap");
    bootstrapUserAgreementsTable().catch(e =>
      console.error("[UserAgreementsBootstrap] failed:", e),
    );

    // Stat-sanity CHECK constraints (migration 0064). Defense-in-depth
    // on top of the application-level conditional UPDATEs from G4 —
    // any code path that bypasses the routers still can't write a
    // negative balance. Idempotent: ALTER+CHECK that's already
    // present is logged as "skipped".
    const { bootstrapStatSanityConstraints } = await import("../services/statSanityBootstrap");
    bootstrapStatSanityConstraints().catch(e =>
      console.error("[StatSanityBootstrap] failed:", e),
    );

    // Ensure user_two_factor exists (migration 0065). Required by
    // the 2FA enrollment / verification router.
    const { bootstrapUserTwoFactorTable } = await import("../services/userTwoFactorBootstrap");
    bootstrapUserTwoFactorTable().catch(e =>
      console.error("[UserTwoFactorBootstrap] failed:", e),
    );

    // Ensure user_sessions exists (migration 0066). Required by the
    // sessions router (list/revoke active devices).
    const { bootstrapUserSessionsTable } = await import("../services/userSessionsBootstrap");
    bootstrapUserSessionsTable().catch(e =>
      console.error("[UserSessionsBootstrap] failed:", e),
    );

    // G16/G17 — indexes + FKs (migration 0067). Idempotent.
    const { bootstrapIndexesAndFks } = await import("../services/indexesFksBootstrap");
    bootstrapIndexesAndFks().catch(e =>
      console.error("[IndexesFksBootstrap] failed:", e),
    );

    // user_blocks (migration 0068).
    const { bootstrapUserBlocksTable } = await import("../services/userBlocksBootstrap");
    bootstrapUserBlocksTable().catch(e =>
      console.error("[UserBlocksBootstrap] failed:", e),
    );

    // support_impersonation_grants (migration 0069).
    const { bootstrapSupportImpersonationTable } = await import("../services/supportImpersonationBootstrap");
    bootstrapSupportImpersonationTable().catch(e =>
      console.error("[SupportImpersonationBootstrap] failed:", e),
    );

    // G27 — users cohort columns (migration 0070). Backfills
    // signupWeek for legacy rows.
    const { bootstrapCohortColumns } = await import("../services/cohortColumnsBootstrap");
    bootstrapCohortColumns().catch(e =>
      console.error("[CohortColumnsBootstrap] failed:", e),
    );

    // audit/15.R4 — users age-verification columns. Schema declares
    // dateOfBirth / ageVerificationCountry / ageVerifiedAt but no
    // journaled migration ships them, so the OAuth upsert errors with
    // "Unknown column" on first login until this bootstrap runs.
    const { bootstrapAgeVerificationColumns } = await import("../services/ageVerificationColumnsBootstrap");
    bootstrapAgeVerificationColumns().catch(e =>
      console.error("[AgeVerificationColumnsBootstrap] failed:", e),
    );

    // Ensure pvp_ratings exists (#7). Migration 0058 is orphaned
    // from _journal.json; without this table the pvpRanking router
    // throws on every read/write. Failure surface is "MMR badge +
    // leaderboard unavailable"; rest of the game is unaffected.
    const { bootstrapPvpRatingsTable } = await import("../services/pvpRatingsBootstrap");
    bootstrapPvpRatingsTable().catch(e =>
      console.error("[PvpRatingsBootstrap] failed:", e),
    );

    // Ensure game_replays.shareToken exists. Migration 0056 is
    // orphaned from _journal.json; without this column saveReplay
    // can't generate share-links and getReplayByToken silently 404s.
    // The legacy by-id lookup keeps working either way.
    const { bootstrapReplayShareToken, bootstrapReplayMatchId } = await import(
      "../services/replaysBootstrap"
    );
    bootstrapReplayShareToken().catch(e =>
      console.error("[ReplaysBootstrap] failed:", e),
    );

    // Ensure game_replays.matchId exists (migration 0057). Required by
    // the verification job (#92) — the engine mints card-instance ids
    // via `makeCardInstance(matchId, counter, …)`, so a reconstructed
    // GameState rebuilt from a different matchId hashes differently
    // even when every action replays identically. Failure surface:
    // verifyReplay returns {ok:false, reason:"matchId not stored"} for
    // legacy rows; saveReplay / getReplay are unaffected.
    bootstrapReplayMatchId().catch(e =>
      console.error("[ReplaysBootstrap matchId] failed:", e),
    );

    // Ensure dream_balance.difficultyModifier exists. Migration 0058
    // is orphaned from _journal.json; without this column every read
    // of dream_balance (including myDreamBalance and the encounter
    // builder's boss-difficulty hook) fails with "Unknown column".
    const { bootstrapDreamBalanceDifficultyModifier } = await import(
      "../services/dreamBalanceBootstrap"
    );
    bootstrapDreamBalanceDifficultyModifier().catch(e =>
      console.error("[DreamBalanceBootstrap] failed:", e),
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

  // Graceful shutdown — drain in-flight requests + WebSocket connections,
  // flush Sentry/OTel, then exit. Railway sends SIGTERM on every redeploy
  // (with a 30s grace window). Without this, in-flight Stripe webhooks,
  // PvP/chess match ticks, and tRPC requests get killed mid-flight.
  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[shutdown] ${signal} received — draining…`);
    const closed = new Promise<void>((resolve) => {
      server.close((err) => {
        if (err) console.error("[shutdown] server.close error:", err);
        resolve();
      });
    });
    // Bound the wait so the platform's SIGKILL doesn't preempt us.
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 25_000));
    await Promise.race([closed, timeout]);
    try {
      const Sentry = await import("@sentry/node");
      await Sentry.close(2_000);
    } catch (err) {
      console.error("[shutdown] Sentry.close failed:", err);
    }
    try {
      // shutdownOTel is optional — older otel.ts revisions don't export
      // it. Cast through unknown so TS doesn't complain about an absent
      // member; runtime check guards execution.
      const otelMod = (await import("../otel")) as unknown as {
        shutdownOTel?: () => Promise<void>;
      };
      if (typeof otelMod.shutdownOTel === "function") {
        await otelMod.shutdownOTel();
      }
    } catch (err) {
      void err;
    }
    console.log("[shutdown] done");
    process.exit(0);
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

startServer().catch(console.error);
