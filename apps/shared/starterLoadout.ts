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
//
// Phase C migration: StarterSpecies is the canonical
// `starterPlayable` subset of SPECIES_REGISTRY in
// apps/shared/species/registry.ts. The compile-time invariant
// below asserts subset-ness; runtime tests in
// apps/shared/species/__tests__/registry.test.ts check the two
// stay aligned.
import type { SpeciesKey as CanonicalSpeciesKey } from "./species/registry";
export type StarterSpecies = "demagi" | "quarchon" | "neyon" | "human";
const _starterIsRegistrySubset: StarterSpecies extends CanonicalSpeciesKey ? true : false = true;
void _starterIsRegistrySubset;

export interface StarterLoadout {
  baseMaskId: string;
  baseSuitId: string;
}

/* ─── Class-cut roster ─── */

/**
 * Class cut → Inventor-catalog set id. Used for both the suit sentinel
 * and the mask sentinel so the paper doll reads as one cohesive identity
 * instead of stitching a species mask onto an unrelated class suit.
 *
 *   oracle   → long-coat-over-cuirass / regalia-of-the-seeing-stylus
 *   engineer → segmented-workshop-rig / pressure-loom-harness
 *   assassin → ribbed-chitin-weave    / black-crepe-weave
 *   soldier  → plated-harness         / bulwark-of-the-eighth-column
 *   spy      → tailored-underskin     / low-profile-tailoring
 *
 * Exported so the client paper-doll resolver can route starter sentinels
 * through the same table — a parity test is kept on this single source.
 */
export const CLASS_CUTS: Record<ClassKey, string> = {
  oracle: "long-coat-over-cuirass",
  engineer: "segmented-workshop-rig",
  assassin: "ribbed-chitin-weave",
  soldier: "plated-harness",
  spy: "tailored-underskin",
};

/** Class-cut → catalog set id. Companion to CLASS_CUTS — given a cut id
 *  (the middle segment of a `mask:<cut>:<motif>` or `suit:<cut>:<element>`
 *  sentinel), returns the Inventor set whose head/chest/arms/legs PNGs
 *  the renderer should fetch. */
export const CLASS_CUT_TO_SET_ID: Record<string, string> = {
  "long-coat-over-cuirass": "regalia-of-the-seeing-stylus",
  "segmented-workshop-rig": "pressure-loom-harness",
  "ribbed-chitin-weave": "black-crepe-weave",
  "plated-harness": "bulwark-of-the-eighth-column",
  "tailored-underskin": "low-profile-tailoring",
};

/* ─── Mask resolution ─── */

/**
 * Mask cut comes from class (so it shares an identity with the suit);
 * motif comes from species (engraving, paint, glyph overlay).
 * Asset id format: `mask:<class-cut>:<motif>`. Foundation is preserved
 * on the StarterLoadout caller's options but no longer baked into the
 * artId — there is no per-foundation mask art pipeline today, and the
 * renderer routes strictly through class-cut → class set.
 */
function resolveBaseMaskId(
  characterClass: ClassKey,
  species: StarterSpecies,
): string {
  return `mask:${CLASS_CUTS[characterClass]}:${species}`;
}

/* ─── Suit resolution ─── */

/**
 * Suit cut comes from class; palette+glow comes from element.
 * Asset id format: `suit:<class-cut>:<element>`.
 */
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
    baseMaskId: resolveBaseMaskId(opts.characterClass, opts.species),
    baseSuitId: resolveBaseSuitId(opts.characterClass, opts.element),
  };
}

/** Inventor-catalog set id keyed off the starter's class cut. The
 *  paper-doll loadout builder uses this to populate the full base-set
 *  slot list (head, chest, arms, gloves, legs, belt, feet) from one
 *  cohesive set instead of two unrelated identities. */
export function classSetId(characterClass: ClassKey): string {
  return CLASS_CUT_TO_SET_ID[CLASS_CUTS[characterClass]];
}

/** Inventor-catalog set id keyed off the operative's species. Used as
 *  the paper doll's "base set race" layer — drawn under the class
 *  armor so the BG3-style sheet reads as race body in species kit
 *  with class plate over the top. Humans use the Mourner's Coat
 *  foundation set (the canonical "human" Inventor set). */
const SPECIES_TO_INVENTOR_SET: Record<StarterSpecies, string> = {
  human: "the-mourners-coat",
  demagi: "arcane-rune-regalia",
  quarchon: "clockwork-exoframe",
  neyon: "hybrid-vein-panoply",
};

export function speciesSetId(species: StarterSpecies): string {
  return SPECIES_TO_INVENTOR_SET[species];
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
