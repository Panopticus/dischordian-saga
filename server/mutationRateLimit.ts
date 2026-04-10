/* ═══════════════════════════════════════════════════════
   MUTATION RATE LIMITER — Per-user token bucket
   ───────────────────────────────────────────────────────
   Mirrors the wsRateLimit token-bucket design but exposes
   a plain `take()` function so the trpc layer can wrap it
   in a middleware without this module depending on trpc.

   Rate-limit individual mutations prone to abuse: DMs,
   friend requests, reports, guild applies, etc.

   This is an in-process limiter — fine for a single
   Railway instance. When scaling horizontally, swap the
   Map for a Redis-backed counter and keep the same API.
   ═══════════════════════════════════════════════════════ */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitConfig {
  /** Stable identifier for the bucket namespace, e.g. "dm.send" */
  key: string;
  /** Max burst: most tokens in the bucket at once */
  maxTokens: number;
  /** Tokens added per refill interval */
  refillRate: number;
  /** Refill interval in ms (default 1s) */
  refillIntervalMs?: number;
}

/**
 * Attempt to take one token from this config's bucket for the given user.
 * Returns true if allowed, false if rate-limited.
 */
export function takeRateLimitToken(
  cfg: RateLimitConfig,
  userId: number | string,
): boolean {
  const bucketKey = `${cfg.key}:${userId}`;
  const now = Date.now();
  const interval = cfg.refillIntervalMs ?? 1_000;

  let bucket = buckets.get(bucketKey);
  if (!bucket) {
    bucket = { tokens: cfg.maxTokens, lastRefill: now };
    buckets.set(bucketKey, bucket);
  }

  const elapsed = now - bucket.lastRefill;
  if (elapsed >= interval) {
    const refills = Math.floor(elapsed / interval);
    bucket.tokens = Math.min(
      cfg.maxTokens,
      bucket.tokens + refills * cfg.refillRate,
    );
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) return false;
  bucket.tokens -= 1;
  return true;
}

/* Periodic GC so idle users don't leak memory. */
const GC_INTERVAL_MS = 5 * 60 * 1000;
const IDLE_AFTER_MS = 10 * 60 * 1000;
const gcTimer = setInterval(() => {
  const cutoff = Date.now() - IDLE_AFTER_MS;
  for (const [key, bucket] of buckets) {
    if (bucket.lastRefill < cutoff) buckets.delete(key);
  }
}, GC_INTERVAL_MS);
// Allow the process to exit cleanly during tests / shutdown
if (typeof gcTimer.unref === "function") gcTimer.unref();

/** Test-only helper — clear all buckets between cases. */
export function __resetRateLimitBuckets(): void {
  buckets.clear();
}
