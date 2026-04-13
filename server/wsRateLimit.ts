/* ═══════════════════════════════════════════════════════
   WEBSOCKET RATE LIMITING + RECONNECTION SUPPORT

   Per-user message rate limiting for all WS game servers.
   Prevents DDoS and message flooding while allowing
   reconnection with state recovery grace period.
   ═══════════════════════════════════════════════════════ */
import type { WebSocket } from "ws";

/* ─── PER-USER RATE LIMITER ─── */

interface RateBucket {
  tokens: number;
  lastRefill: number;
}

const rateBuckets = new Map<string, RateBucket>();

const RATE_CONFIG = {
  maxTokens: 30,        // Max burst: 30 messages
  refillRate: 10,       // Refill 10 tokens per second
  refillIntervalMs: 1000,
};

/** Returns true if the message should be allowed, false if rate-limited */
export function checkWsRateLimit(userId: string | number): boolean {
  const key = String(userId);
  const now = Date.now();
  let bucket = rateBuckets.get(key);

  if (!bucket) {
    bucket = { tokens: RATE_CONFIG.maxTokens, lastRefill: now };
    rateBuckets.set(key, bucket);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  if (elapsed >= RATE_CONFIG.refillIntervalMs) {
    const refills = Math.floor(elapsed / RATE_CONFIG.refillIntervalMs);
    bucket.tokens = Math.min(RATE_CONFIG.maxTokens, bucket.tokens + refills * RATE_CONFIG.refillRate);
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) return false;

  bucket.tokens--;
  return true;
}

/** Send rate limit error to a WebSocket client */
export function sendRateLimitError(ws: WebSocket): void {
  try {
    ws.send(JSON.stringify({ type: "RATE_LIMITED", message: "Too many messages — slow down" }));
  } catch { /* client may have disconnected */ }
}

// Cleanup stale buckets every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - 300_000;
  for (const [key, bucket] of rateBuckets) {
    if (bucket.lastRefill < cutoff) rateBuckets.delete(key);
  }
}, 300_000);

/* ─── RECONNECTION GRACE PERIOD ─── */

interface DisconnectedSession {
  userId: number | string;
  matchId: string;
  disconnectedAt: number;
  state: unknown; // Game-specific state snapshot
}

const disconnectedSessions = new Map<string, DisconnectedSession>();
const GRACE_PERIOD_MS = 30_000; // 30 seconds to reconnect

/** Store a session for potential reconnection */
export function storeDisconnectedSession(userId: number | string, matchId: string, state: unknown): void {
  disconnectedSessions.set(String(userId), {
    userId, matchId, disconnectedAt: Date.now(), state,
  });
}

/** Attempt to recover a disconnected session. Returns state if within grace period. */
export function recoverSession(userId: number | string): DisconnectedSession | null {
  const key = String(userId);
  const session = disconnectedSessions.get(key);
  if (!session) return null;
  if (Date.now() - session.disconnectedAt > GRACE_PERIOD_MS) {
    disconnectedSessions.delete(key);
    return null; // Grace period expired
  }
  disconnectedSessions.delete(key);
  return session;
}

// Cleanup expired sessions every 60 seconds
setInterval(() => {
  const cutoff = Date.now() - GRACE_PERIOD_MS;
  for (const [key, session] of disconnectedSessions) {
    if (session.disconnectedAt < cutoff) disconnectedSessions.delete(key);
  }
}, 60_000);
