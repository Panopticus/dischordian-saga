/* ═══════════════════════════════════════════════════════
   STORAGE UTILITY — Typed, versioned localStorage wrapper

   Replaces raw localStorage calls with:
   - Type-safe get/set with JSON serialization
   - Schema versioning (auto-migration on version bump)
   - Namespaced keys to avoid collisions
   - Graceful error handling (quota exceeded, SSR)
   - Storage event listeners for cross-tab sync
   ═══════════════════════════════════════════════════════ */

const NAMESPACE = "ds";
const VERSION_KEY = `${NAMESPACE}:__version__`;
const CURRENT_VERSION = 1;

/** Namespaced key */
function nsKey(key: string): string {
  return `${NAMESPACE}:${key}`;
}

/** Safe check for localStorage availability */
function isAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, "1");
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

const available = isAvailable();

/** Get a typed value from localStorage */
export function storageGet<T>(key: string, fallback: T): T {
  if (!available) return fallback;
  try {
    const raw = localStorage.getItem(nsKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Set a typed value in localStorage */
export function storageSet<T>(key: string, value: T): boolean {
  if (!available) return false;
  try {
    localStorage.setItem(nsKey(key), JSON.stringify(value));
    return true;
  } catch (e) {
    // Handle QuotaExceededError
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn(`[Storage] Quota exceeded writing ${key}`);
    }
    return false;
  }
}

/** Remove a key from localStorage */
export function storageRemove(key: string): void {
  if (!available) return;
  localStorage.removeItem(nsKey(key));
}

/** Check if a key exists */
export function storageHas(key: string): boolean {
  if (!available) return false;
  return localStorage.getItem(nsKey(key)) !== null;
}

/** Get all keys matching a prefix */
export function storageKeys(prefix?: string): string[] {
  if (!available) return [];
  const keys: string[] = [];
  const fullPrefix = prefix ? nsKey(prefix) : `${NAMESPACE}:`;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(fullPrefix)) {
      keys.push(key.slice(`${NAMESPACE}:`.length));
    }
  }
  return keys;
}

/** Get total storage usage in bytes (approximate) */
export function storageUsage(): number {
  if (!available) return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      total += key.length + (localStorage.getItem(key)?.length ?? 0);
    }
  }
  return total * 2; // UTF-16 = 2 bytes per char
}

/* ─── VERSIONING / MIGRATION ─── */

/** Run migrations when version changes */
export function checkStorageVersion(): void {
  if (!available) return;
  const stored = parseInt(localStorage.getItem(VERSION_KEY) || "0", 10);
  if (stored < CURRENT_VERSION) {
    // Run migrations for each version step
    // v0 → v1: Initial version, no migration needed (just stamp)
    localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
    console.log(`[Storage] Migrated from v${stored} to v${CURRENT_VERSION}`);
  }
}

// Run version check on module load
checkStorageVersion();
