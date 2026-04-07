import Redis from "ioredis";

let _redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!_redis && process.env.REDIS_URL) {
    try {
      _redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });
      _redis.connect().catch((err) => {
        console.warn("[Redis] Connection failed:", err.message);
        _redis = null;
      });
    } catch (error) {
      console.warn("[Redis] Init failed:", error);
      _redis = null;
    }
  }
  return _redis;
}

/**
 * Cache-aside helper: returns cached value or calls fetcher and caches result.
 * Falls back to fetcher directly if Redis is unavailable.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const redis = getRedis();
  if (!redis) return fetcher();

  try {
    const hit = await redis.get(key);
    if (hit) return JSON.parse(hit) as T;
  } catch {
    // Redis read failure — fall through to fetcher
  }

  const data = await fetcher();

  try {
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch {
    // Redis write failure — non-critical
  }

  return data;
}

/** Invalidate a cache key or pattern */
export async function invalidateCache(pattern: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    if (pattern.includes("*")) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) await redis.del(...keys);
    } else {
      await redis.del(pattern);
    }
  } catch {
    // Non-critical
  }
}
