/* ═══════════════════════════════════════════════════════
   SCHEMATICS — acquisition paths + eligibility filter

   Per plan §G.7 there are three — and only three — ways a
   schematic enters the player's inventory:

     1. Reward drops (act bosses, Ark events, rare pod finds).
     2. Trade Empire deals (rep + materials, creation-choice gated).
     3. Shop rotations (one random eligible schematic per week).

   Mythic originals are NOT in any of the three paths — they
   ship as one-of-one story artifacts in apps/shared/inventorMythics.ts
   (co-authored with the Act narrative team; out of scope here).

   This module is pure data + a pure eligibility filter. The
   drop tables live elsewhere (arkEventHandler.ts,
   tcg-core/story/encounter.ts); those call into here when
   they want to offer a schematic to the current operative.
   ═══════════════════════════════════════════════════════ */

import {
  getAllSetIds,
  getSetDef,
  type SetCategory,
} from "./suitSets";
import type { SchematicId } from "./suitRecipes";
import type { ClassKey, ElementKey } from "./earnedLoadouts";
import type { FoundationKey, StarterSpecies } from "./starterLoadout";

export type AcquisitionPath = "drop" | "trade" | "shop";

export interface SchematicDef {
  id: SchematicId;
  setId: string;
  category: SetCategory;
  /** Which of the three canonical paths can surface this schematic. */
  paths: readonly AcquisitionPath[];
}

/* ─── Derivation ─── */

/**
 * Every set ships with a schematic on all three paths by default.
 * Individual acts can revoke a path for a specific set by editing
 * the override table below; this keeps the roster / schematic list
 * exhaustive and the defaults sensible.
 */
const ALL_PATHS: readonly AcquisitionPath[] = ["drop", "trade", "shop"];

const PATH_OVERRIDES: Readonly<Record<string, readonly AcquisitionPath[]>> = {
  // Foundation sets are deeply story-bound; the Trade Empire does
  // not carry them. (Drops + shop rotations only.)
  "the-mourners-coat": ["drop", "shop"],
  "the-first-chassis": ["drop", "shop"],
};

function deriveSchematics(): readonly SchematicDef[] {
  return getAllSetIds().map((setId) => ({
    id: `schematic:${setId}` as SchematicId,
    setId,
    category: getSetDef(setId).category,
    paths: PATH_OVERRIDES[setId] ?? ALL_PATHS,
  }));
}

export const SCHEMATICS: readonly SchematicDef[] = deriveSchematics();

const BY_ID = new Map<string, SchematicDef>(
  SCHEMATICS.map((s) => [s.id, s] as const),
);

export function getSchematic(id: SchematicId): SchematicDef {
  const s = BY_ID.get(id);
  if (!s) throw new Error(`[schematics] unknown schematic id: ${id}`);
  return s;
}

/* ─── Eligibility ─── */

/** The four axes of a creation loadout. */
export interface OperativeIdentity {
  species: StarterSpecies;
  characterClass: ClassKey;
  element: ElementKey;
  foundation: FoundationKey;
}

/**
 * Per plan §G.7: "Players can *only* request schematics for sets
 * matching their creation choices." This is the canonical filter.
 *
 * A set matches if the operative's creation axis aligns with the
 * set's category:
 *   - class sets       → operative.characterClass === set-class
 *   - species sets     → operative.species === set-species
 *   - element sets     → operative.element === set-element
 *   - foundation sets  → operative.foundation → "humanity" or "machine"
 *
 * Foundation sets have a small wrinkle: humanity → the-mourners-coat,
 * machine → the-first-chassis. No cross-foundation trade (until the
 * mid-late-game "Indexed to the Inventor" reputation unlocks it;
 * that gate is enforced by the Trade Empire router, not here).
 */
export function isSchematicEligibleForOperative(
  schematic: SchematicDef,
  op: OperativeIdentity,
): boolean {
  switch (schematic.category) {
    case "class":
      return schematic.setId.includes(op.characterClass) ||
        CLASS_SET_IDS_BY_CLASS[op.characterClass] === schematic.setId;
    case "species":
      return SPECIES_SET_IDS_BY_SPECIES[op.species] === schematic.setId;
    case "element":
      return ELEMENT_SET_IDS_BY_ELEMENT[op.element] === schematic.setId;
    case "foundation":
      return FOUNDATION_SET_IDS_BY_FOUNDATION[op.foundation] === schematic.setId;
  }
}

/** All schematics an operative could currently earn (via any path). */
export function listEligibleSchematics(
  op: OperativeIdentity,
): readonly SchematicDef[] {
  return SCHEMATICS.filter((s) => isSchematicEligibleForOperative(s, op));
}

/* ─── Identity → set-id tables ─── */
/* Authored explicitly instead of pattern-matched on set-id strings so
   a typo in a roster rename fails loudly here, not silently at runtime. */

const CLASS_SET_IDS_BY_CLASS: Readonly<Record<ClassKey, string>> = {
  oracle: "regalia-of-the-seeing-stylus",
  engineer: "pressure-loom-harness",
  assassin: "black-crepe-weave",
  soldier: "bulwark-of-the-eighth-column",
  spy: "low-profile-tailoring",
};

const SPECIES_SET_IDS_BY_SPECIES: Readonly<
  Record<Exclude<StarterSpecies, "human">, string>
> & { human?: string } = {
  demagi: "arcane-rune-regalia",
  quarchon: "clockwork-exoframe",
  neyon: "hybrid-vein-panoply",
};

const ELEMENT_SET_IDS_BY_ELEMENT: Readonly<Record<ElementKey, string>> = {
  earth: "geomancers-stratum",
  fire: "ember-bellows-array",
  water: "tide-engine-carapace",
  air: "aetheric-dirigible-rig",
  space: "void-sextant-ensemble",
  time: "chronometer-livery",
  probability: "dicewrights-motley",
  reality: "null-weaver-mantle",
};

const FOUNDATION_SET_IDS_BY_FOUNDATION: Readonly<
  Record<FoundationKey, string>
> = {
  humanity: "the-mourners-coat",
  machine: "the-first-chassis",
};
