/**
 * Per-IP rate limit on unauthenticated Express surfaces.
 *
 * Pre-auth gate: protects every `/api/*` route including tRPC
 * `publicProcedure` calls (login bootstrap, doom-scroll feed, public
 * pack-preview, etc.) from a single IP burning through the entire
 * request budget. The existing per-user WebSocket bucket
 * (`apps/server/wsRateLimit.ts`) only fires post-auth, so this
 * middleware is the layer that catches enumeration / botnet bursts
 * before identity is established.
 *
 * Defaults:
 *   window: 60 seconds
 *   max:    600 requests per IP per window
 *   skip:   /api/health and /api/stripe/webhook
 *
 * The window is intentionally generous — legitimate clients can
 * dispatch dozens of tRPC calls per page load, especially during
 * cold-start hydration. Tighter limits go on individual procedures
 * via per-procedure middleware (not yet implemented; tracked).
 */
import rateLimit from "express-rate-limit";

export const PUBLIC_IP_RATE_LIMIT_WINDOW_MS = 60_000;
export const PUBLIC_IP_RATE_LIMIT_MAX = 600;

export const publicIpRateLimit = rateLimit({
  windowMs: PUBLIC_IP_RATE_LIMIT_WINDOW_MS,
  max: PUBLIC_IP_RATE_LIMIT_MAX,
  // Use the configured `trust proxy` setting so we get the upstream
  // client IP, not the load balancer's. The Express app already calls
  // `app.set("trust proxy", 1)` for Railway / Render.
  // express-rate-limit reads from `req.ip` which respects the trust
  // proxy chain.
  standardHeaders: true,
  legacyHeaders: false,
  // Health checks and Stripe's webhook IPs vary widely and are
  // their own DDoS targets only in degenerate scenarios; keep them
  // outside the default budget.
  skip: (req) => req.path === "/health" || req.path.startsWith("/stripe/webhook"),
  message: {
    error: "rate_limit_exceeded",
    detail:
      "Too many requests from your IP. Try again in a minute.",
  },
});
