/**
 * `userProgress.gameData` persistence discipline.
 *
 * Closes two audit findings (docs/audits/2026-05-16-integration-playability,
 * Persistence F7 + F3):
 *
 *  - F7: the blob had no version field anywhere, so a future shape
 *    change was an undetectable silent migration. Every write now
 *    stamps `schemaVersion`.
 *  - F3: `gamification.saveProgress` did a whole-blob client-
 *    authoritative overwrite, racing the server-side writers that own
 *    sub-keys of the same column (`entitlementService.setEntitlement`
 *    → `gameData.entitlements`, `mysteryService` JSON_SET →
 *    `gameData.narrativeFlags`). A routine client autosave landing
 *    after a Stripe entitlement grant permanently erased the paid
 *    entitlement. The client is never the source of truth for these
 *    namespaces; `mergeClientGameData` always takes them from the DB.
 */

export const GAME_DATA_SCHEMA_VERSION = 1;

/**
 * Sub-keys of `gameData` that are written exclusively by server paths.
 * A client `saveProgress` blob never authors these — they are always
 * carried over from the server-side row, never from the client.
 *
 *  - `entitlements`            → entitlementService.setEntitlement (paid SKUs)
 *  - `narrativeFlags`          → mysteryService / conspiracyService JSON_SET
 *  - `completedMysteryEpisodes`→ mysteryService close path (mirrored set)
 */
export const SERVER_AUTHORITATIVE_GAME_DATA_KEYS = [
  "entitlements",
  "narrativeFlags",
  "completedMysteryEpisodes",
] as const;

type AnyRecord = Record<string, unknown>;

/**
 * Merge a client-supplied `gameData` blob over the server-of-record
 * blob without letting the client clobber server-authoritative
 * namespaces, and stamp the current schema version.
 *
 * Rules:
 *  - client owns every non-authoritative key (gameplay scratch).
 *  - for each server-authoritative key: the DB value wins; if the DB
 *    has no value the key is dropped entirely (the client may never
 *    *create* an entitlement / server flag set).
 *  - `schemaVersion` is always (re)written to the current version.
 */
export function mergeClientGameData(
  serverBlob: AnyRecord | null | undefined,
  clientBlob: AnyRecord | null | undefined,
): AnyRecord {
  const server: AnyRecord = serverBlob ?? {};
  const client: AnyRecord = clientBlob ?? {};

  const merged: AnyRecord = { ...client };

  for (const key of SERVER_AUTHORITATIVE_GAME_DATA_KEYS) {
    if (key in server) {
      merged[key] = server[key];
    } else {
      delete merged[key];
    }
  }

  merged.schemaVersion = GAME_DATA_SCHEMA_VERSION;
  return merged;
}
