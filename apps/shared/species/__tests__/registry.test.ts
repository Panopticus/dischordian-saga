// apps/shared/species/__tests__/registry.test.ts

import { describe, it, expect } from "vitest";
import {
  allSpeciesKeys,
  getSpecies,
  isKnownSpeciesKey,
  SPECIES_REGISTRY,
  starterSpeciesKeys,
  validateSpeciesRegistry,
} from "../registry";

describe("Species registry — Phase C", () => {
  it("registry passes validation", () => {
    expect(validateSpeciesRegistry()).toEqual([]);
  });

  it("every key matches its embedded speciesKey", () => {
    for (const [k, def] of Object.entries(SPECIES_REGISTRY)) {
      expect(def.speciesKey).toBe(k);
    }
  });

  it("isKnownSpeciesKey classifies real and fake keys", () => {
    expect(isKnownSpeciesKey("demagi")).toBe(true);
    expect(isKnownSpeciesKey("quarchon")).toBe(true);
    expect(isKnownSpeciesKey("not_a_species")).toBe(false);
  });

  it("getSpecies resolves canonical keys", () => {
    expect(getSpecies("demagi").name).toBe("DeMagi");
    expect(getSpecies("neyon").name).toBe("Ne-Yon");
  });

  it("allSpeciesKeys returns unique keys", () => {
    const keys = allSpeciesKeys();
    expect(keys.length).toBe(new Set(keys).size);
  });

  it("starterSpeciesKeys includes the canonical four", () => {
    const starter = starterSpeciesKeys();
    expect(starter).toContain("demagi");
    expect(starter).toContain("quarchon");
    expect(starter).toContain("neyon");
    expect(starter).toContain("human");
  });

  it("voltari, iron_lion, and construct are NOT starterPlayable", () => {
    const starter = starterSpeciesKeys();
    expect(starter).not.toContain("voltari");
    expect(starter).not.toContain("iron_lion");
    expect(starter).not.toContain("construct");
  });

  it("contested-greeting keys exist for the canonical three", () => {
    expect(getSpecies("demagi").contestedGreetingKey).toBe("atarion_greeting_demagi");
    expect(getSpecies("quarchon").contestedGreetingKey).toBe("atarion_greeting_quarchon");
    expect(getSpecies("neyon").contestedGreetingKey).toBe("atarion_greeting_neyon");
  });
});
