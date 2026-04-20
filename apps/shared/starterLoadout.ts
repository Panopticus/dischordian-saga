/* ═══════════════════════════════════════════════════════
   STARTER LOADOUT RESOLVER (plan §G.2)

   Pure data module. At character creation time the game
   picks a deterministic Base Mask + Base Suit keyed to the
   player's choices so the paper doll is never empty.

   Mask sculpt = foundation (Human Mask vs Machine Head).
   Mask motif = species (engraving, paint, glyph overlay).
   Suit cut = class (Oracle long-coat-over-cuirass, etc).
   Suit palette + glow = element.

   5 × 4 × 8 × 2 = 320 valid permutations. The test file
   snapshots all 320 to prevent silent drift.
   ═══════════════════════════════════════════════════════ */

import type { ClassKey, ElementKey } from "./earnedLoadouts";

// Foundation is new for §G.2 — not yet on citizenCharacters; the
// creation flow adds it as the "Humanity / Machine" choice that
// renders after alignment. Until the DB column lands, callers pass
// a resolved value at runtime (default: "humanity").
export type FoundationKey = "humanity" | "machine";

// Species here includes `human` (Mourner's-Coat foundation set),
// widening the earnedLoadouts.SpeciesKey which tracks only the
// three in-game species. The distinction lives because a human
// operative can still carry one of the three species decals on
// their mask (per plan: mask motif is keyed by species).
export type StarterSpecies = "demagi" | "quarchon" | "neyon" | "human";

export interface StarterLoadout {
  baseMaskId: string;
  baseSuitId: string;
}

/* ─── Mask resolution ─── */

/**
 * Mask sculpt comes from foundation; motif comes from species.
 * Asset id format: `mask:<sculpt>:<motif>`.
 */
function resolveBaseMaskId(
  foundation: FoundationKey,
  species: StarterSpecies,
): string {
  const sculpt = foundation === "humanity" ? "human-mask" : "machine-head";
  // Humans carrying the Human foundation get the human motif; others
  // get their species motif. This keeps a machine-foundation Ne-Yon
  // readable as Ne-Yon (hybrid-vein etching on the chrome skull).
  return `mask:${sculpt}:${species}`;
}

/* ─── Suit resolution ─── */

/**
 * Suit cut comes from class; palette+glow comes from element.
 * Asset id format: `suit:<class-cut>:<element>`.
 * The class-cut mapping matches plan §G.2:
 *   oracle   → long-coat-over-cuirass
 *   engineer → segmented-workshop-rig
 *   assassin → ribbed-chitin-weave
 *   soldier  → plated-harness
 *   spy      → tailored-underskin
 */
const CLASS_CUTS: Record<ClassKey, string> = {
  oracle: "long-coat-over-cuirass",
  engineer: "segmented-workshop-rig",
  assassin: "ribbed-chitin-weave",
  soldier: "plated-harness",
  spy: "tailored-underskin",
};

function resolveBaseSuitId(
  characterClass: ClassKey,
  element: ElementKey,
): string {
  return `suit:${CLASS_CUTS[characterClass]}:${element}`;
}

/**
 * Deterministic starter-loadout picker. Pure — same input always
 * yields the same (base-mask, base-suit) tuple.
 */
export function resolveStarterLoadout(opts: {
  species: StarterSpecies;
  characterClass: ClassKey;
  element: ElementKey;
  foundation: FoundationKey;
}): StarterLoadout {
  return {
    baseMaskId: resolveBaseMaskId(opts.foundation, opts.species),
    baseSuitId: resolveBaseSuitId(opts.characterClass, opts.element),
  };
}

/* ─── Enumerator helpers (used by the snapshot test) ─── */

export const STARTER_SPECIES_LIST: readonly StarterSpecies[] = [
  "demagi",
  "quarchon",
  "neyon",
  "human",
] as const;

export const STARTER_CLASS_LIST: readonly ClassKey[] = [
  "engineer",
  "oracle",
  "assassin",
  "soldier",
  "spy",
] as const;

export const STARTER_ELEMENT_LIST: readonly ElementKey[] = [
  "earth",
  "fire",
  "water",
  "air",
  "space",
  "time",
  "probability",
  "reality",
] as const;

export const STARTER_FOUNDATION_LIST: readonly FoundationKey[] = [
  "humanity",
  "machine",
] as const;

/** Total valid permutations = 4 × 5 × 8 × 2 = 320. */
export const STARTER_PERMUTATION_COUNT =
  STARTER_SPECIES_LIST.length *
  STARTER_CLASS_LIST.length *
  STARTER_ELEMENT_LIST.length *
  STARTER_FOUNDATION_LIST.length;
