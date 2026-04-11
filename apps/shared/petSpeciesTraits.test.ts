import { describe, it, expect } from "vitest";
import {
  PET_SPECIES_TRAITS,
  PET_ID_TO_SPECIES,
  getTraitsForSpecies,
  getTraitsForPetId,
  petsToPartyTraits,
} from "./petSpeciesTraits";
import {
  computeActiveTraits,
  resolvePartyBonuses,
  aggregateMultipliers,
} from "./companionTraitThresholds";

describe("petSpeciesTraits", () => {
  describe("trait maps", () => {
    it("exports a trait set for every starter species", () => {
      const expected = [
        "holographic_fox",
        "data_serpent",
        "temporal_kitten",
        "glyph_moth",
        "flicker_imp",
        "gilt_beetle",
        "spore_fungus",
      ];
      for (const s of expected) {
        expect(PET_SPECIES_TRAITS[s]).toBeDefined();
        const t = PET_SPECIES_TRAITS[s];
        // Every starter should contribute something on at least one axis
        expect(Boolean(t.element || t.species || t.faction || t.combatClass)).toBe(true);
      }
    });

    it("maps canonical pet IDs to species", () => {
      expect(PET_ID_TO_SPECIES.lux).toBe("holographic_fox");
      expect(PET_ID_TO_SPECIES.cipher).toBe("data_serpent");
      expect(PET_ID_TO_SPECIES.echo).toBe("temporal_kitten");
    });

    it("returns empty traits for unknown species", () => {
      expect(getTraitsForSpecies("does_not_exist")).toEqual({});
    });

    it("resolves traits by petId via the alias map", () => {
      expect(getTraitsForPetId("lux").element).toBe("air");
      expect(getTraitsForPetId("echo").element).toBe("time");
      expect(getTraitsForPetId("unknown")).toEqual({});
    });
  });

  describe("petsToPartyTraits", () => {
    it("converts a roster into PartyMemberTraits", () => {
      const party = petsToPartyTraits([
        { petId: "lux", name: "Lux", species: "holographic_fox" },
        { petId: "echo", name: "Echo", species: "temporal_kitten" },
      ]);
      expect(party).toHaveLength(2);
      expect(party[0]).toMatchObject({ id: "lux", name: "Lux", element: "air" });
      expect(party[1]).toMatchObject({ id: "echo", name: "Echo", element: "time" });
    });

    it("keeps unknown species but omits trait values", () => {
      const party = petsToPartyTraits([
        { petId: "ghost", name: "Ghost", species: "phantom_strain" },
      ]);
      expect(party[0].element).toBeUndefined();
      expect(party[0].faction).toBeUndefined();
    });
  });

  describe("party synergy integration", () => {
    it("two dreamer-faction pets activate a Bronze threshold", () => {
      const party = petsToPartyTraits([
        { petId: "lux", name: "Lux", species: "holographic_fox" },
        { petId: "echo", name: "Echo", species: "temporal_kitten" },
      ]);
      const active = computeActiveTraits(party);
      // Both share faction=dreamer → "Dreamer's Chorus" Bronze at count=2
      const dreamer = active.find((t) => t.trait.traitValue === "dreamer" && t.trait.traitType === "faction");
      expect(dreamer).toBeDefined();
      expect(dreamer?.matchCount).toBe(2);
      expect(dreamer?.activeThreshold?.tierName).toBe("Bronze");
    });

    it("resolvePartyBonuses returns improvise_damage for dreamer party", () => {
      const party = petsToPartyTraits([
        { petId: "lux", name: "Lux", species: "holographic_fox" },
        { petId: "echo", name: "Echo", species: "temporal_kitten" },
      ]);
      const bonuses = resolvePartyBonuses(party);
      const multipliers = aggregateMultipliers(bonuses);
      expect(multipliers.improvise_damage).toBeGreaterThanOrEqual(1.15);
    });

    it("single pet returns no active threshold", () => {
      const party = petsToPartyTraits([
        { petId: "lux", name: "Lux", species: "holographic_fox" },
      ]);
      const active = computeActiveTraits(party);
      // Below threshold-1 filter — nothing returned
      expect(active).toHaveLength(0);
    });
  });
});
