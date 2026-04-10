/* ═══════════════════════════════════════════════════════
   PLAYER STATE REPOSITORY — Typed, versioned, atomic
   ───────────────────────────────────────────────────────
   Single source of truth for the PlayerSaveV1 blob on the
   client. Wraps localStorage with:

     • schema validation via shared/playerSave.ts (Zod)
     • versioning + forward-migration scaffold
     • an in-memory cache so hot-path reads don't hit the
       parser on every call
     • a typed field-level update API so callers don't need
       to know which storage key they belong to
     • atomic batched writes via a microtask flush, so a
       burst of updates produces one localStorage write and
       one emitted change event

   This module does NOT replace lib/storage.ts — that file
   keeps the generic typed get/set surface for transient /
   UI-only state (theme tokens, radio playlist, etc.). This
   module is specifically for the player save: the stuff the
   audit (§1A) flagged as "will be lost on device switch."

   Known next step: write a server-side loader that hydrates
   this cache from userProgress.gameData on login and a
   debounced sync that pushes changes back to the server.
   That's tracked as a separate piece — the scaffolding here
   is deliberately local-first so it can be adopted
   incrementally without a big bang migration.
   ═══════════════════════════════════════════════════════ */
import {
  playerSaveV1Schema,
  parsePlayerSave,
  migratePlayerSave,
  emptyPlayerSave,
  type PlayerSaveV1,
} from "@shared/playerSave";

const STORAGE_KEY = "ds:player_save_v1";

type Listener = (save: PlayerSaveV1) => void;
const listeners = new Set<Listener>();

/* ─── In-memory cache + lazy load ─────────────────────── */

let cache: PlayerSaveV1 | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readFromStorage(): PlayerSaveV1 {
  if (!isBrowser()) return emptyPlayerSave();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyPlayerSave();
    const parsed = JSON.parse(raw) as unknown;
    const migrated = migratePlayerSave(parsed);
    return migrated ?? emptyPlayerSave();
  } catch {
    // Corrupt save — fall back to empty rather than crashing the app.
    // A caller that cares (e.g. error boundary) can inspect
    // localStorage directly to decide whether to offer a backup / reset.
    return emptyPlayerSave();
  }
}

function ensureLoaded(): PlayerSaveV1 {
  if (cache == null) {
    cache = readFromStorage();
  }
  return cache;
}

/* ─── Batched writes ──────────────────────────────────── */

let dirty = false;
let flushScheduled = false;

function scheduleFlush(): void {
  if (flushScheduled || !isBrowser()) return;
  flushScheduled = true;
  // Microtask so a burst of updateX() calls in one handler coalesces.
  queueMicrotask(() => {
    flushScheduled = false;
    if (!dirty || !cache) return;
    dirty = false;
    try {
      const toWrite: PlayerSaveV1 = { ...cache, updatedAt: Date.now() };
      cache = toWrite;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toWrite));
      for (const fn of listeners) {
        try { fn(toWrite); } catch { /* listener error shouldn't break the write */ }
      }
    } catch (err) {
      // Quota exceeded or similar — re-flag dirty so a later write may retry.
      if (err instanceof DOMException && err.name === "QuotaExceededError") {
        console.warn("[playerStateRepository] Quota exceeded — save deferred.");
      }
      dirty = true;
    }
  });
}

/* ─── Public API ──────────────────────────────────────── */

/** Read the full player save (cached). */
export function getPlayerSave(): PlayerSaveV1 {
  return ensureLoaded();
}

/** Subscribe to save changes. Returns an unsubscribe function. */
export function subscribePlayerSave(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Apply a partial update to the player save. The updater receives
 * the current save and must return the next save. Use this for
 * cross-field consistency (e.g. updating both discovery + counters).
 *
 * Example:
 *   updatePlayerSave((s) => ({
 *     ...s,
 *     battleStats: { ...s.battleStats, won: s.battleStats.won + 1 },
 *   }));
 */
export function updatePlayerSave(
  updater: (current: PlayerSaveV1) => PlayerSaveV1,
): void {
  const current = ensureLoaded();
  const next = updater(current);
  // Re-validate through Zod so callers can't write out-of-schema values.
  const validated = parsePlayerSave(next);
  if (!validated) {
    console.warn("[playerStateRepository] Rejected invalid update (schema mismatch)");
    return;
  }
  cache = validated;
  dirty = true;
  scheduleFlush();
}

/**
 * Typed field-level update. Cleaner than updatePlayerSave for the
 * common case of "set one sub-object."
 *
 * Example:
 *   setPlayerSaveField("battleStats", { won: 3, played: 5 });
 */
export function setPlayerSaveField<K extends keyof PlayerSaveV1>(
  key: K,
  value: PlayerSaveV1[K],
): void {
  updatePlayerSave((s) => ({ ...s, [key]: value }));
}

/** Typed field-level read. */
export function getPlayerSaveField<K extends keyof PlayerSaveV1>(
  key: K,
): PlayerSaveV1[K] {
  return ensureLoaded()[key];
}

/**
 * Replace the entire save — used when hydrating from the server on
 * login, or when migrating from scattered legacy keys in one shot.
 * The input is Zod-validated; malformed data falls back to empty.
 */
export function replacePlayerSave(input: unknown): PlayerSaveV1 {
  const parsed = parsePlayerSave(input) ?? emptyPlayerSave();
  cache = parsed;
  dirty = true;
  scheduleFlush();
  return parsed;
}

/**
 * Reset the save to empty (account wipe / new character).
 * The caller is expected to confirm intent — this will not prompt.
 */
export function resetPlayerSave(): void {
  cache = emptyPlayerSave();
  dirty = true;
  scheduleFlush();
}

/**
 * Test-only escape hatch so unit tests can start from a known state.
 * Does NOT touch localStorage — tests that want a persistent reset
 * should clear localStorage themselves.
 */
export function __resetPlayerSaveCache(): void {
  cache = null;
  dirty = false;
  flushScheduled = false;
  listeners.clear();
}

/**
 * Validate an arbitrary payload against the schema without touching
 * the cache. Useful for server-to-client sync where you want to know
 * whether an incoming payload is safe to apply.
 */
export function isValidPlayerSave(input: unknown): boolean {
  return playerSaveV1Schema.safeParse(input).success;
}
