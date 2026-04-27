/**
 * Set codes — formal identifier for which expansion / release a card
 * belongs to.
 *
 * The S1_MEMOIR base set ships with the 609 cards art-prompted in
 * PR #227. S2_HIERARCHY (Hierarchy of the Damned) is the first
 * expansion, ~84 cards, design pending. ACT_EXCLUSIVES is the home
 * set for Act-pack-exclusive cards that are gated by narrative
 * progress rather than by a numbered release.
 *
 * Card definition files do NOT need to declare `setCode` — the
 * registry loader (cards/loader.ts) backfills it from the card id's
 * prefix at startup. Cards prefixed `s1_*` resolve to "S1_MEMOIR";
 * future `s2_*` cards resolve to "S2_HIERARCHY"; `act{1..7}_*` cards
 * resolve to "ACT_EXCLUSIVES".
 *
 * Set codes are referenced by Format.allowedSets (formats/standard.ts)
 * to gate which cards are legal in a given play mode.
 */

export type SetCode = "S1_MEMOIR" | "S2_HIERARCHY" | "ACT_EXCLUSIVES";

export const SET_CODES = {
  S1_MEMOIR: "S1_MEMOIR",
  S2_HIERARCHY: "S2_HIERARCHY",
  ACT_EXCLUSIVES: "ACT_EXCLUSIVES",
} as const satisfies Record<SetCode, SetCode>;

const SET_CODE_VALUES: ReadonlyArray<SetCode> = [
  "S1_MEMOIR",
  "S2_HIERARCHY",
  "ACT_EXCLUSIVES",
];

export function isSetCode(value: unknown): value is SetCode {
  return (
    typeof value === "string" &&
    (SET_CODE_VALUES as readonly string[]).includes(value)
  );
}

/**
 * Derive a set code from a card's id prefix. This is the fallback
 * the loader applies when a card definition omits `setCode`. New
 * sets MUST be added here AND to the SetCode type union above.
 *
 *   "s1_char_001"        → "S1_MEMOIR"
 *   "s1_imprint_elara"   → "S1_MEMOIR"
 *   "s2_hierarchy_ceo"   → "S2_HIERARCHY"
 *   "act3_offer_card"    → "ACT_EXCLUSIVES"
 *
 * Anything that doesn't match (including legacy ids and the
 * `gen_*` general prefix) defaults to "S1_MEMOIR" — the conservative
 * choice that keeps existing content in the base set without forcing
 * a per-file edit across the 449 definition files.
 */
export function deriveSetCode(id: string): SetCode {
  if (id.startsWith("s2_")) return "S2_HIERARCHY";
  if (/^act[1-7]_/.test(id)) return "ACT_EXCLUSIVES";
  return "S1_MEMOIR";
}

/**
 * Resolve the effective set code for a card definition. Honors an
 * explicit `setCode` field if present; otherwise derives from the id.
 * Use this from validation / format-checking code so behavior is
 * consistent whether the card came through the registry (which
 * backfills) or is being compared raw (e.g. test fixtures).
 */
export function setCodeOf(def: { id: string; setCode?: SetCode }): SetCode {
  return def.setCode ?? deriveSetCode(def.id);
}
