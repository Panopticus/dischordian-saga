/* ═══════════════════════════════════════════════════════
   REDIS-BACKED RATE LIMIT STORE
   Pluggable store for express-rate-limit that uses Redis
   when REDIS_URL is configured, or falls back to in-memory.
   Enables rate limiting that works across multiple server
   instances (horizontal scaling).
   ═══════════════════════════════════════════════════════ */

import type { Store, IncrementResponse, Options } from "express-rate-limit";

/**
 * Creates a rate limit store backed by Redis (via simple HTTP-like commands).
 * Uses the native `ioredis`-compatible interface if available,
 * otherwise falls back to a plain Map (single-process).
 */
export async function createRateLimitStore(windowMs: number): Promise<Store | undefined> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.log("[RateLimit] No REDIS_URL — using in-memory store (single-process only)");
    return undefined; // Let express-rate-limit use its default MemoryStore
  }

  try {
    const Redis = (await import("ioredis")).default;
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    await client.connect();
    console.log("[RateLimit] Redis store connected");

    return new RedisStore(client, windowMs);
  } catch (err) {
    console.warn("[RateLimit] Redis unavailable — falling back to in-memory store:", err);
    return undefined;
  }
}

/**
 * Redis-backed store for express-rate-limit.
 * Uses INCR + PEXPIRE for atomic counter management.
 */
class RedisStore implements Store {
  private client: import("ioredis").default;
  private windowMs: number;
  private prefix = "rl:";

  constructor(client: import("ioredis").default, windowMs: number) {
    this.client = client;
    this.windowMs = windowMs;
  }

  async increment(key: string): Promise<IncrementResponse> {
    const redisKey = this.prefix + key;
    const results = await this.client
      .multi()
      .incr(redisKey)
      .pttl(redisKey)
      .exec();

    const totalHits = (results?.[0]?.[1] as number) || 1;
    const ttl = (results?.[1]?.[1] as number) || -1;

    // Set expiry on first hit (TTL will be -1 if key is new)
    if (ttl === -1 || ttl === -2) {
      await this.client.pexpire(redisKey, this.windowMs);
    }

    return {
      totalHits,
      resetTime: new Date(Date.now() + (ttl > 0 ? ttl : this.windowMs)),
    };
  }

  async decrement(key: string): Promise<void> {
    await this.client.decr(this.prefix + key);
  }

  async resetKey(key: string): Promise<void> {
    await this.client.del(this.prefix + key);
  }

  async resetAll(): Promise<void> {
    // Scan and delete all rate limit keys
    let cursor = "0";
    do {
      const [nextCursor, keys] = await this.client.scan(cursor, "MATCH", this.prefix + "*", "COUNT", 100);
      cursor = nextCursor;
      if (keys.length > 0) await this.client.del(...keys);
    } while (cursor !== "0");
  }

  // Required by express-rate-limit v7+ Store interface
  init?(options: Options): void {
    // No-op — Redis handles its own lifecycle
  }
}
