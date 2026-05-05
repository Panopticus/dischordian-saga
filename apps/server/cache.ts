/* ═══════════════════════════════════════════════════════
   CACHE — in-memory LRU OR Redis depending on env.

   The public API (`get / set / del / flush`) is async and
   identical for both backends. Switch backends by setting
   `REDIS_URL` (e.g. `redis://default:pw@host:6379`). With
   `REDIS_URL` unset the in-memory LRU is used — this is the
   default for local dev / tests / cold start.

   Why dual-backend:
     - Single-process: the LRU is faster and has zero ops cost.
     - Multi-instance: the LRU diverges per-instance; Redis is the
       only correct option once we horizontally scale.

   The Redis client is loaded lazily via dynamic import so the
   `redis` npm package is *optional* — the bundle doesn't pay for
   it on local dev. CI installs the dep when REDIS_URL is set.
   ═══════════════════════════════════════════════════════ */

import { logger } from "./logger";

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ENTRIES = 10_000;

interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number;
}

interface CacheBackend {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  flush(): Promise<void>;
  /** Diagnostic */
  kind: "memory" | "redis";
}

/* ─── In-memory backend (default) ─────────────────────── */

function createMemoryBackend(): CacheBackend {
  const store = new Map<string, CacheEntry>();

  function evictIfNeeded() {
    if (store.size <= MAX_ENTRIES) return;
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }

  function pruneExpired() {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.expiresAt <= now) store.delete(key);
    }
  }

  setInterval(pruneExpired, 60_000);

  return {
    kind: "memory",
    async get<T>(key: string): Promise<T | null> {
      const entry = store.get(key);
      if (!entry) return null;
      if (entry.expiresAt <= Date.now()) {
        store.delete(key);
        return null;
      }
      // LRU: move to end on access.
      store.delete(key);
      store.set(key, entry);
      return entry.value as T;
    },
    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
      const ttlMs = (ttlSeconds ?? DEFAULT_TTL_MS / 1000) * 1000;
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      evictIfNeeded();
    },
    async del(key: string): Promise<void> {
      store.delete(key);
    },
    async flush(): Promise<void> {
      store.clear();
    },
  };
}

/* ─── Redis backend (lazy-loaded) ─────────────────────── */

interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, ttl?: number): Promise<unknown>;
  setex(key: string, ttl: number, value: string): Promise<unknown>;
  del(key: string): Promise<unknown>;
  flushdb(): Promise<unknown>;
  on(event: string, cb: (e: unknown) => void): unknown;
}

async function createRedisBackend(url: string): Promise<CacheBackend | null> {
  let redis: RedisLike;
  try {
    // ioredis exposes a default-export class. Dynamic import keeps
    // it out of the bundle when REDIS_URL is unset. The package is
    // OPTIONAL — if it's not installed locally the import throws and
    // we fall back. The static import name is computed so TypeScript
    // doesn't try to resolve it at compile time.
    const importRedis = new Function("name", "return import(name)") as (
      name: string,
    ) => Promise<{ default?: new (url: string) => RedisLike }>;
    const mod = await importRedis("ioredis").catch(() => null);
    if (!mod?.default) {
      logger.warn("[Cache] REDIS_URL set but `ioredis` not installed; falling back to in-memory");
      return null;
    }
    redis = new mod.default(url);
    redis.on("error", (e) => {
      logger.warn("[Cache] Redis error", { error: e instanceof Error ? e.message : String(e) });
    });
  } catch (err) {
    logger.warn("[Cache] Redis init failed; falling back to in-memory", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }

  return {
    kind: "redis",
    async get<T>(key: string): Promise<T | null> {
      const raw = await redis.get(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
      const ttl = ttlSeconds ?? Math.floor(DEFAULT_TTL_MS / 1000);
      await redis.setex(key, ttl, JSON.stringify(value));
    },
    async del(key: string): Promise<void> {
      await redis.del(key);
    },
    async flush(): Promise<void> {
      await redis.flushdb();
    },
  };
}

/* ─── Backend selection ───────────────────────────────── */

let backend: CacheBackend = createMemoryBackend();

(async () => {
  const url = process.env.REDIS_URL;
  if (!url) return;
  const redis = await createRedisBackend(url);
  if (redis) {
    backend = redis;
    logger.info("[Cache] using Redis backend");
  }
})();

/* ─── Public API (matches the original module) ────────── */

export async function get<T = unknown>(key: string): Promise<T | null> {
  return backend.get<T>(key);
}

export async function set<T = unknown>(
  key: string,
  value: T,
  ttlSeconds?: number,
): Promise<void> {
  return backend.set(key, value, ttlSeconds);
}

export async function del(key: string): Promise<void> {
  return backend.del(key);
}

export async function flush(): Promise<void> {
  return backend.flush();
}

export const cache = { get, set, del, flush } as const;

/** Diagnostic — useful from a /admin/health endpoint. */
export function getCacheKind(): "memory" | "redis" {
  return backend.kind;
}
