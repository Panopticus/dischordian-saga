/* ═══════════════════════════════════════════════════════
   IN-MEMORY LRU CACHE WITH TTL
   Drop-in replacement interface for Redis. Swap the
   implementation for ioredis when ready — the exported
   API (get / set / del / flush) stays the same.
   ═══════════════════════════════════════════════════════ */

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ENTRIES = 10_000;

interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry>();

/** Evict the oldest entry when the cache exceeds MAX_ENTRIES. */
function evictIfNeeded() {
  if (store.size <= MAX_ENTRIES) return;
  // Map iteration order is insertion order — first key is oldest
  const oldest = store.keys().next().value;
  if (oldest !== undefined) store.delete(oldest);
}

/** Remove expired entries. Called lazily on reads and periodically. */
function pruneExpired() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}

// Periodic cleanup every 60 seconds
setInterval(pruneExpired, 60_000);

/* ─── PUBLIC API ─── */

/**
 * Retrieve a cached value. Returns `null` if the key is missing or expired.
 */
export async function get<T = unknown>(key: string): Promise<T | null> {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  // Move to end to maintain LRU order
  store.delete(key);
  store.set(key, entry);
  return entry.value as T;
}

/**
 * Store a value under `key` with an optional TTL (in seconds).
 * Defaults to 5 minutes.
 */
export async function set<T = unknown>(
  key: string,
  value: T,
  ttlSeconds?: number,
): Promise<void> {
  const ttlMs = (ttlSeconds ?? DEFAULT_TTL_MS / 1000) * 1000;
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  evictIfNeeded();
}

/**
 * Delete a single key from the cache.
 */
export async function del(key: string): Promise<void> {
  store.delete(key);
}

/**
 * Remove all entries from the cache.
 */
export async function flush(): Promise<void> {
  store.clear();
}

export const cache = { get, set, del, flush } as const;
