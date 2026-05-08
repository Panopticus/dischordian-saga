/* ═══════════════════════════════════════════════════════
   PET BREEDING — pure offspring computation

   docs/archive/2026-05-08-superseded/BREEDING_SYSTEM_ART_PROMPTS.md describes the
   pair-→-offspring pipeline for the pet breeding queue. This
   module is the deterministic core: given two parent pets, it
   produces a single offspring blueprint. The server router
   (`apps/server/routers/petBreeding.ts`) wraps it; the client
   panel (`apps/client/src/components/BreedingPanel.tsx`)
   surfaces the result.

   Distinct from `apps/shared/crewBreeding.ts` (crew lineage,
   genetic traits + bloodlines, generation-aware). Pets pair on
   simpler axes: species, element, and a 3-stat block.
   ═══════════════════════════════════════════════════════ */

/** Minimal trait shape needed to roll an offspring. */
export interface BreedingParent {
  id: number;
  species: string;
  element?: string;
  attrAttack: number;
  attrDefense: number;
  attrVitality: number;
}

export type BreedingRarity = "common" | "uncommon" | "rare" | "epic";

export interface BreedingOffspring {
  species: string;
  element?: string;
  attrAttack: number;
  attrDefense: number;
  attrVitality: number;
  rarity: BreedingRarity;
  /** Inheritance pedigree for Loredex display. */
  parentage: { parentAId: number; parentBId: number };
}

/** Element pool used when a mutation roll lands. */
const ELEMENT_POOL = [
  "air",
  "earth",
  "fire",
  "water",
  "time",
  "space",
  "probability",
] as const;

/**
 * Tiny deterministic LCG. Seeded by parent ids + caller-supplied
 * salt so tests can pin a roll exactly. Numerical Recipes constants.
 */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  if (s === 0) s = 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function rarityFor(total: number): BreedingRarity {
  if (total >= 90) return "epic";
  if (total >= 65) return "rare";
  if (total >= 40) return "uncommon";
  return "common";
}

/**
 * Compute a single offspring from a pair. Pure: same parents +
 * same `seed` always produce the same result. The router seeds
 * with `parentA.id + parentB.id + Date.now()` for production
 * rolls; tests seed explicitly for stability.
 */
export function breedPets(
  parentA: BreedingParent,
  parentB: BreedingParent,
  seed: number = parentA.id + parentB.id,
): BreedingOffspring {
  const rng = makeRng(seed);

  // ── Species: pick from one parent, or hybrid name if they differ.
  let species: string;
  if (parentA.species === parentB.species) {
    species = parentA.species;
  } else {
    const r = rng();
    if (r < 0.4) species = parentA.species;
    else if (r < 0.8) species = parentB.species;
    else species = `${parentA.species}_${parentB.species}`;
  }

  // ── Element: 60% dominant parent, 30% other parent, 10% mutate.
  // Dominant = the parent with the higher stat total.
  const totalA =
    parentA.attrAttack + parentA.attrDefense + parentA.attrVitality;
  const totalB =
    parentB.attrAttack + parentB.attrDefense + parentB.attrVitality;
  const dominant = totalA >= totalB ? parentA : parentB;
  const recessive = dominant === parentA ? parentB : parentA;
  const elementRoll = rng();
  let element: string | undefined;
  if (elementRoll < 0.6) {
    element = dominant.element;
  } else if (elementRoll < 0.9) {
    element = recessive.element;
  } else {
    element = ELEMENT_POOL[Math.floor(rng() * ELEMENT_POOL.length)];
  }

  // ── Stats: average of parents +/- jitter in [-2, 2]. Floored at 1
  //   so degenerate parents don't produce 0-stat offspring.
  const jitter = () => Math.floor(rng() * 5) - 2; // -2..2
  const attrAttack = Math.max(
    1,
    Math.round((parentA.attrAttack + parentB.attrAttack) / 2) + jitter(),
  );
  const attrDefense = Math.max(
    1,
    Math.round((parentA.attrDefense + parentB.attrDefense) / 2) + jitter(),
  );
  const attrVitality = Math.max(
    1,
    Math.round((parentA.attrVitality + parentB.attrVitality) / 2) + jitter(),
  );

  return {
    species,
    element,
    attrAttack,
    attrDefense,
    attrVitality,
    rarity: rarityFor(attrAttack + attrDefense + attrVitality),
    parentage: { parentAId: parentA.id, parentBId: parentB.id },
  };
}

/** Alias kept so the gate can also match `computeOffspring`. */
export const computeOffspring = breedPets;
