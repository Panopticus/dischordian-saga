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

describe("Species registry — Phase C migration invariants", () => {
  // Phase C migration: the narrower string-literal types in
  // earnedLoadouts.ts (SpeciesKey) and starterLoadout.ts
  // (StarterSpecies) must remain proper subsets of the canonical
  // registry. Compile-time assertions live alongside the types;
  // these runtime tests verify the same invariants from the
  // registry side.
  it("the earned-loadout subset (demagi/quarchon/neyon) all exist in registry", () => {
    expect(isKnownSpeciesKey("demagi")).toBe(true);
    expect(isKnownSpeciesKey("quarchon")).toBe(true);
    expect(isKnownSpeciesKey("neyon")).toBe(true);
  });

  it("the starter-loadout subset (+ human) all exist in registry", () => {
    for (const k of ["demagi", "quarchon", "neyon", "human"]) {
      expect(isKnownSpeciesKey(k)).toBe(true);
    }
  });

  it("starterSpeciesKeys is a superset of the StarterSpecies union", () => {
    const starter = starterSpeciesKeys();
    for (const k of ["demagi", "quarchon", "neyon", "human"]) {
      expect(starter).toContain(k);
    }
  });

  it("all canonical species in syndicateWorlds bonuses exist in registry", () => {
    // From apps/shared/syndicateWorlds.ts:SPECIES_CAPITAL_BONUSES.
    // "synthetic" is a gameplay-only label that maps to multiple
    // registry species; it is intentionally not asserted here.
    for (const k of ["demagi", "quarchon", "neyon", "human"]) {
      expect(isKnownSpeciesKey(k)).toBe(true);
    }
  });
});
