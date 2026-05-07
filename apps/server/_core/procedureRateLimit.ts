/**
 * H6 — Per-procedure rate limit middleware factory.
 *
 * The global per-IP bucket on /api (apps/server/ipRateLimit.ts)
 * catches floods, but the highest-abuse-risk mutations (Stripe
 * checkout, deck-save autosaves, auth bootstrapping) need tighter
 * bucketing keyed on `userId` (with IP fallback for unauth flows).
 *
 * In-memory token bucket:
 *   key       = ctx.user?.id ?? ctx.req.ip ?? "anon"
 *   capacity  = `max` (refilled fully every `windowMs`)
 *   refill    = `max / windowMs` tokens per ms (continuous)
 *
 * On exhaustion: TRPCError({ code: "TOO_MANY_REQUESTS", … }).
 *
 * Single-process by design. When the server scales horizontally,
 * the Map<string, Bucket> must move to Redis (or a similar
 * shared-store backend). The contract this middleware exposes
 * — `procedureRateLimit({ windowMs, max })` returning a tRPC
 * middleware — is stable; only the storage swap.
 *
 * Usage:
 *
 *   import { procedureRateLimit } from "../_core/procedureRateLimit";
 *
 *   createCheckout: protectedProcedure
 *     .use(procedureRateLimit({ windowMs: 300_000, max: 2 }))
 *     .mutation(async ({ ctx, input }) => { … }),
 */
import { TRPCError } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create();

interface Bucket {
  /** Tokens currently in the bucket (float). */
  tokens: number;
  /** Last refill timestamp in ms. */
  lastRefill: number;
}

interface RateLimitOpts {
  /** Window in milliseconds over which `max` tokens accumulate. */
  windowMs: number;
  /** Capacity / max-burst tokens. */
  max: number;
  /**
   * Override the default key derivation. Defaults to
   * `ctx.user?.id ?? ctx.req?.ip ?? "anon"`. Useful for tests +
   * for procedures that want stricter IP-only keying.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyFor?: (ctx: any) => string;
}

/**
 * Module-scoped store keyed by `<windowMs>:<max>:<key>` so multiple
 * procedures with different limits don't share a bucket. Keeping
 * the store at module scope means it persists for the process
 * lifetime — buckets only release entries when the GC sweeps them
 * after no further references; in practice the keyspace is
 * bounded by active-user-count * procedure-count and stays small.
 *
 * Exported for tests via {@link _resetForTests}.
 */
const buckets = new Map<string, Bucket>();

/**
 * Test-only — clears the in-memory bucket store. Production code
 * has no reason to call this.
 */
export function _resetForTests(): void {
  buckets.clear();
}

/**
 * Pluggable clock for tests. Production reads Date.now(); the
 * test suite swaps in a fake clock to assert refill semantics
 * deterministically without sleeping.
 */
let nowImpl: () => number = () => Date.now();
export function _setClockForTests(impl: () => number): void {
  nowImpl = impl;
}
export function _restoreClock(): void {
  nowImpl = () => Date.now();
}

/**
 * Build a tRPC middleware that throws TOO_MANY_REQUESTS when the
 * caller has burned through their bucket.
 */
export function procedureRateLimit(opts: RateLimitOpts) {
  const { windowMs, max } = opts;
  const refillPerMs = max / windowMs;
  return t.middleware(async ({ ctx, next }) => {
    const key = (opts.keyFor ?? defaultKey)(ctx);
    const bucketKey = `${windowMs}:${max}:${key}`;
    const now = nowImpl();
    const existing = buckets.get(bucketKey);
    const bucket: Bucket = existing ?? { tokens: max, lastRefill: now };
    if (existing) {
      const elapsed = Math.max(0, now - existing.lastRefill);
      bucket.tokens = Math.min(max, bucket.tokens + elapsed * refillPerMs);
      bucket.lastRefill = now;
    }
    if (bucket.tokens < 1) {
      // Cache state before throwing so the next call sees the
      // accumulated drift on the same bucket.
      buckets.set(bucketKey, bucket);
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message:
          `Rate limit exceeded for this procedure (${max} per ${windowMs}ms). ` +
          "Try again in a moment.",
      });
    }
    bucket.tokens -= 1;
    buckets.set(bucketKey, bucket);
    return next();
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function defaultKey(ctx: any): string {
  if (ctx?.user?.id != null) return String(ctx.user.id);
  // tRPC's express adapter exposes the underlying req as `ctx.req`.
  // Fall back to "anon" when neither is available (test contexts,
  // batch requests with no per-request scope).
  const ip = ctx?.req?.ip;
  return ip ?? "anon";
}
