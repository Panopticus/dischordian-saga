/* ═══════════════════════════════════════════════════════
   PET SPECIES → TRAIT MAP

   Maps pet species IDs (from playerPets.species) to the
   trait values used by `companionTraitThresholds.ts`. Pets
   participate in the same party-wide synergy system as
   Eidolons and citizen companions: if you field two pets
   that share an element or faction, Bronze/Silver/Gold
   tiers activate.

   Each species has at most one value per trait axis
   (element/species/faction/class). Unknown species return
   an empty trait set — they still battle, they just don't
   contribute to synergy thresholds.

   CANON (petOriginCanon.ts): a species is not an arbitrary
   stat block — it is the stable shape a consciousness-imprint
   (Matrix of Dreams) settles into. The species keys here are
   the pet identity space, disjoint from the crew Companions.
   ═══════════════════════════════════════════════════════ */

import type { PartyMemberTraits } from "./companionTraitThresholds";

export interface PetSpeciesTraitSet {
  element?: string;
  species?: string;
  faction?: string;
  combatClass?: string;
}

/** Canonical trait map for every starter/known pet species. */
export const PET_SPECIES_TRAITS: Record<string, PetSpeciesTraitSet> = {
  holographic_fox: {
    element: "air",        // light-kin, elusive — cyclone thematic
    species: "neyon",      // liminal bridge, between-worlds
    faction: "dreamer",
    combatClass: "envoy",
  },
  data_serpent: {
    element: "probability",
    species: "construct",
    faction: "architect",
    combatClass: "scholar",
  },
  temporal_kitten: {
    element: "time",
    species: "neyon",
    faction: "dreamer",
    combatClass: "mystic",
  },
  glyph_moth: {
    element: "air",
    species: "quarchon",
    faction: "dreamer",
    combatClass: "scholar",
  },
  flicker_imp: {
    element: "fire",
    species: "voltari",
    faction: "insurgency",
    combatClass: "rogue",
  },
  gilt_beetle: {
    element: "earth",
    species: "construct",
    faction: "architect",
    combatClass: "soldier",
  },
  spore_fungus: {
    element: "water",
    species: "demagi",
    faction: "insurgency",
    combatClass: "mystic",
  },
  void_crawler: {
    element: "space",
    species: "quarchon",
    faction: "insurgency",
    combatClass: "rogue",
  },
};

/** Short alias map for raw pet IDs (when species isn't loaded). */
export const PET_ID_TO_SPECIES: Record<string, string> = {
  lux: "holographic_fox",
  cipher: "data_serpent",
  echo: "temporal_kitten",
  glyph: "glyph_moth",
  flicker: "flicker_imp",
  gilt: "gilt_beetle",
  spore: "spore_fungus",
};

export function getTraitsForSpecies(species: string): PetSpeciesTraitSet {
  return PET_SPECIES_TRAITS[species] ?? {};
}

export function getTraitsForPetId(petId: string): PetSpeciesTraitSet {
  const species = PET_ID_TO_SPECIES[petId];
  if (species) return getTraitsForSpecies(species);
  return {};
}

/**
 * Convert a list of pets (from `playerPets` rows or the roster query) to
 * `PartyMemberTraits` objects suitable for `computeActiveTraits`.
 * Only pets passed in contribute — the caller decides which pets are
 * "fielded" (all roster, or a subset for a specific fight).
 */
export interface PetLike {
  petId: string;
  name: string;
  species: string;
}

export function petsToPartyTraits(pets: PetLike[]): PartyMemberTraits[] {
  return pets.map((p) => {
    const traits = getTraitsForSpecies(p.species);
    return {
      id: p.petId,
      name: p.name,
      element: traits.element,
      species: traits.species,
      faction: traits.faction,
      combatClass: traits.combatClass,
    };
  });
}
