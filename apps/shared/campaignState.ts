/**
 * Campaign state — persistent player-choice flags.
 *
 * Holds data that outlives a single match (the engine's GameState is
 * per-match; campaign flags are per-player-save). Currently small: one
 * field, `lightDarkAlignment`, set by the §5.8.1 ChoicePillarLightDark
 * UI after the Authority trial resolves.
 *
 * Persistence: localStorage by default; tests inject an in-memory
 * storage via the optional `storage` parameter. When the real
 * save-state backend lands, these helpers move behind a proper API;
 * the export signatures here stay stable.
 *
 * Spec: docs/production/act1/authority-trial-phase-mechanic.md §5
 *   "§5.8.1 Light/Dark choice interaction" — the flag is written by
 *   the player's pillar pick, NOT by the trial verdict (the two are
 *   separate state writes per spec §5). All four outcome × alignment
 *   combinations are canon-safe and fully authored through Acts 2+.
 */

/**
 * The §5.8.1 alignment values.
 *
 *   "light"  — the player commits to carrying what the Engineer died
 *              for, regardless of whether the Authority overturns or
 *              passes sentence
 *   "dark"   — the player lets the Engineer's thought die uncarried,
 *              regardless of verdict
 *   null    — the choice has not been made yet (pre-§5.8.1 state)
 */
export type LightDarkAlignment = "light" | "dark";

/**
 * Storage abstraction. Lets tests substitute an in-memory map while
 * production uses window.localStorage. Methods mirror the subset of
 * the Web Storage API these helpers actually use.
 */
export interface LightDarkStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

const STORAGE_KEY = "dischordia_campaign_light_dark_alignment";

/** Build a LightDarkStorage backed by window.localStorage, or return
 *  null in SSR / node contexts where no persistent storage exists. */
function defaultStorage(): LightDarkStorage | null {
  if (
    typeof window === "undefined" ||
    typeof window.localStorage === "undefined"
  ) {
    return null;
  }
  return {
    get: (k) => window.localStorage.getItem(k),
    set: (k, v) => window.localStorage.setItem(k, v),
    remove: (k) => window.localStorage.removeItem(k),
  };
}

/**
 * Read the current alignment. Returns null if the player has not yet
 * made the §5.8.1 choice (including every pre-§5.8 game state) or if
 * no storage is available (SSR / node tests without injection).
 */
export function getLightDarkAlignment(
  storage: LightDarkStorage | null = defaultStorage(),
): LightDarkAlignment | null {
  if (!storage) return null;
  const raw = storage.get(STORAGE_KEY);
  if (raw === "light" || raw === "dark") return raw;
  return null;
}

/**
 * Write the alignment. Spec §5 positions this as "the canonical
 * alignment moment of the entire game" — call it exactly once per
 * playthrough, from ChoicePillarLightDark's click handler.
 *
 * No-op when no storage is available. Setting a different value
 * overwrites — the spec does not gate re-pick at the schema level,
 * though the UI should (the pillar pick moment is one-shot per
 * spec).
 */
export function setLightDarkAlignment(
  alignment: LightDarkAlignment,
  storage: LightDarkStorage | null = defaultStorage(),
): void {
  if (!storage) return;
  storage.set(STORAGE_KEY, alignment);
}

/**
 * Clear the alignment. Test helper + new-game-start. Production UI
 * should not expose a "reset alignment" control — per spec §5 the
 * choice is permanent within a playthrough.
 */
export function clearLightDarkAlignment(
  storage: LightDarkStorage | null = defaultStorage(),
): void {
  if (!storage) return;
  storage.remove(STORAGE_KEY);
}

/**
 * In-memory storage factory for tests. Returns a fresh LightDarkStorage
 * with no persistence across instances.
 */
export function inMemoryStorage(): LightDarkStorage {
  const map = new Map<string, string>();
  return {
    get: (k) => map.get(k) ?? null,
    set: (k, v) => {
      map.set(k, v);
    },
    remove: (k) => {
      map.delete(k);
    },
  };
}

/* ═══════════════════════════════════════════════════════
   §5.6 Programmer gift — persistent accept/decline flag.

   Parallels Light/Dark: one boolean-valued flag per playthrough,
   written by the ChoicePillarProgrammerGift pick, read by Acts 2+
   codex variants. Three values:

     true  — player accepted the deliberate throw
     false — player declined and kept fighting
     null  — the choice has not been presented yet (pre-§5.6) or
             the player never reached a §5.6 match

   The engine's ProgrammerGiftState covers the in-match lifecycle;
   this flag is the persistence / cross-act channel.
   ═══════════════════════════════════════════════════════ */

const GIFT_STORAGE_KEY = "dischordia_campaign_programmer_gift_accepted";

/**
 * Read the stored gift resolution. Returns:
 *   true  — previously accepted
 *   false — previously declined
 *   null  — never presented or storage unavailable
 */
export function getProgrammerGiftAccepted(
  storage: LightDarkStorage | null = defaultStorage(),
): boolean | null {
  if (!storage) return null;
  const raw = storage.get(GIFT_STORAGE_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
}

/**
 * Write the gift resolution. Called exactly once per playthrough
 * from ChoicePillarProgrammerGift's click handler. No-op when no
 * storage is available.
 */
export function setProgrammerGiftAccepted(
  accepted: boolean,
  storage: LightDarkStorage | null = defaultStorage(),
): void {
  if (!storage) return;
  storage.set(GIFT_STORAGE_KEY, accepted ? "true" : "false");
}

/**
 * Clear the stored gift resolution. Test helper + new-game-start.
 * Production UI should not expose a reset control — the choice is
 * permanent within a playthrough.
 */
export function clearProgrammerGiftAccepted(
  storage: LightDarkStorage | null = defaultStorage(),
): void {
  if (!storage) return;
  storage.remove(GIFT_STORAGE_KEY);
}
