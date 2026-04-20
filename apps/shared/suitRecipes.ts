/* ═══════════════════════════════════════════════════════
   SUIT RECIPES — schematic → piece graph (plan §G.9)

   Data-driven recipe registry. A recipe is how a schematic
   becomes a crafted piece — it declares inputs, the bench
   the craft runs on, the base success chance, and the
   real-time craft duration.

   Per plan §G.9:
     - Mythic is NOT craftable (story-artifact only).
     - Recipe id format: `<setId>:<rarity>:<slot>`.
     - Schematic id format: `schematic:<setId>`  (possessing
       one unlocks every rarity of that set's recipes).

   The recipe graph is derived deterministically from the
   18-set roster × 5 craftable rarities × 10 slots = 900
   recipes. Per-set tuning lives in SET_CRAFT_TUNING so the
   roster stays the single source of truth.
   ═══════════════════════════════════════════════════════ */

import {
  getAllSetIds,
  isCraftableRarity,
  type Rarity,
  type SuitSlot,
} from "./suitSets";
import { RARITY_ORDER, SUIT_SLOT_ORDER } from "./suitArtPrompts";

export type SuitRecipeId = `${string}:${Rarity}:${SuitSlot}`;

export type SchematicId = `schematic:${string}`;

export type MaterialId =
  // Universal
  | "brass-plate"
  | "thread-of-null"
  // Element-keyed essences
  | "earth-essence"
  | "fire-essence"
  | "water-essence"
  | "air-essence"
  | "space-essence"
  | "time-essence"
  | "probability-essence"
  | "reality-essence";

/** Benches available for crafting — per plan §G.9. */
export type CraftBench = "inventors-bench" | "forge" | "loom" | "chronolab";

export interface SuitRecipe {
  id: SuitRecipeId;
  setId: string;
  slot: SuitSlot;
  rarity: Rarity;
  schematicRequired: SchematicId;
  inputs: ReadonlyArray<{ materialId: MaterialId; count: number }>;
  bench: CraftBench;
  baseSuccessPct: number;
  craftSeconds: number;
}

/* ─── Per-rarity cost/time shape ─── */

interface RarityCost {
  brass: number;
  essence: number;
  thread: number;
  successPct: number;
  craftSeconds: number;
}

const RARITY_COST: Record<Rarity, RarityCost> = {
  common: { brass: 2, essence: 0, thread: 0, successPct: 95, craftSeconds: 30 },
  uncommon: { brass: 3, essence: 1, thread: 0, successPct: 88, craftSeconds: 90 },
  rare: { brass: 5, essence: 2, thread: 0, successPct: 78, craftSeconds: 240 },
  epic: { brass: 8, essence: 4, thread: 1, successPct: 68, craftSeconds: 720 },
  legendary: { brass: 12, essence: 8, thread: 3, successPct: 60, craftSeconds: 1800 },
  // Mythic is NOT craftable — included here only so TS exhaustiveness
  // checks hold; the filter in derivation drops it before recipes emit.
  mythic: { brass: 0, essence: 0, thread: 0, successPct: 0, craftSeconds: 0 },
};

/* ─── Per-set tuning ─── */

interface SetTuning {
  bench: CraftBench;
  /** Element-essence material used for this set (defaults to reality-essence). */
  elementEssence: MaterialId;
}

/**
 * Heuristic tuning — class sets use the Inventor's Bench, element
 * sets use their element's resonant bench, species sets use the
 * forge, foundation sets use the Mourner's loom or Machine forge.
 * Fine-tuning lives in this table so the derivation stays simple.
 */
const SET_TUNING: Readonly<Record<string, SetTuning>> = {
  // Class sets → Inventor's Bench
  "regalia-of-the-seeing-stylus": { bench: "inventors-bench", elementEssence: "reality-essence" },
  "pressure-loom-harness": { bench: "inventors-bench", elementEssence: "time-essence" },
  "black-crepe-weave": { bench: "loom", elementEssence: "reality-essence" },
  "bulwark-of-the-eighth-column": { bench: "forge", elementEssence: "earth-essence" },
  "low-profile-tailoring": { bench: "loom", elementEssence: "probability-essence" },
  // Species sets → the bench that fits the species
  "arcane-rune-regalia": { bench: "inventors-bench", elementEssence: "reality-essence" },
  "clockwork-exoframe": { bench: "forge", elementEssence: "time-essence" },
  "hybrid-vein-panoply": { bench: "inventors-bench", elementEssence: "reality-essence" },
  // Element sets → element-resonant bench + matching essence
  "geomancers-stratum": { bench: "forge", elementEssence: "earth-essence" },
  "ember-bellows-array": { bench: "forge", elementEssence: "fire-essence" },
  "tide-engine-carapace": { bench: "forge", elementEssence: "water-essence" },
  "aetheric-dirigible-rig": { bench: "loom", elementEssence: "air-essence" },
  "void-sextant-ensemble": { bench: "chronolab", elementEssence: "space-essence" },
  "chronometer-livery": { bench: "chronolab", elementEssence: "time-essence" },
  "dicewrights-motley": { bench: "chronolab", elementEssence: "probability-essence" },
  "null-weaver-mantle": { bench: "loom", elementEssence: "reality-essence" },
  // Foundation sets
  "the-mourners-coat": { bench: "loom", elementEssence: "reality-essence" },
  "the-first-chassis": { bench: "forge", elementEssence: "time-essence" },
};

function tuningFor(setId: string): SetTuning {
  return SET_TUNING[setId] ?? {
    bench: "inventors-bench",
    elementEssence: "reality-essence",
  };
}

function schematicIdFor(setId: string): SchematicId {
  return `schematic:${setId}` as SchematicId;
}

function recipeIdFor(
  setId: string,
  rarity: Rarity,
  slot: SuitSlot,
): SuitRecipeId {
  return `${setId}:${rarity}:${slot}` as SuitRecipeId;
}

/* ─── Derivation ─── */

function deriveRecipes(): readonly SuitRecipe[] {
  const out: SuitRecipe[] = [];
  for (const setId of getAllSetIds()) {
    const tuning = tuningFor(setId);
    for (const rarity of RARITY_ORDER) {
      if (!isCraftableRarity(rarity)) continue;
      const cost = RARITY_COST[rarity];
      for (const slot of SUIT_SLOT_ORDER) {
        const inputs: SuitRecipe["inputs"] = [
          { materialId: "brass-plate", count: cost.brass },
          ...(cost.essence > 0
            ? [{ materialId: tuning.elementEssence, count: cost.essence }]
            : []),
          ...(cost.thread > 0
            ? [{ materialId: "thread-of-null" as MaterialId, count: cost.thread }]
            : []),
        ];
        out.push({
          id: recipeIdFor(setId, rarity, slot),
          setId,
          slot,
          rarity,
          schematicRequired: schematicIdFor(setId),
          inputs,
          bench: tuning.bench,
          baseSuccessPct: cost.successPct,
          craftSeconds: cost.craftSeconds,
        });
      }
    }
  }
  return out;
}

export const SUIT_RECIPES: readonly SuitRecipe[] = deriveRecipes();

/* ─── Accessors ─── */

const BY_ID = new Map<string, SuitRecipe>(
  SUIT_RECIPES.map((r) => [r.id, r] as const),
);

export function getRecipe(id: SuitRecipeId): SuitRecipe {
  const r = BY_ID.get(id);
  if (!r) throw new Error(`[suitRecipes] unknown recipe id: ${id}`);
  return r;
}

export function getRecipesForSet(setId: string): readonly SuitRecipe[] {
  return SUIT_RECIPES.filter((r) => r.setId === setId);
}

export function getRecipesRequiringSchematic(
  schematicId: SchematicId,
): readonly SuitRecipe[] {
  return SUIT_RECIPES.filter((r) => r.schematicRequired === schematicId);
}
