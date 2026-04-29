import { describe, expect, it } from "vitest";

import {
  STARTER_CLASS_LIST,
  STARTER_ELEMENT_LIST,
  STARTER_FOUNDATION_LIST,
  STARTER_PERMUTATION_COUNT,
  STARTER_SPECIES_LIST,
  resolveStarterLoadout,
} from "./starterLoadout";

/**
 * Plan §G.2: 5 classes × 4 species-or-human × 8 elements × 2
 * foundations = 320 starter permutations. The paper doll must never
 * boot with an empty base mask or suit, so these tests enforce:
 *   1. Every one of the 320 inputs yields a valid pair.
 *   2. The pair is unique enough to distinguish the creation choices
 *      in both directions (so a runtime compositor can identify which
 *      sculpt/motif/cut/element to render).
 *   3. The function is pure.
 */
describe("resolveStarterLoadout", () => {
  it("declares the full 320-permutation grid", () => {
    expect(STARTER_PERMUTATION_COUNT).toBe(320);
    expect(
      STARTER_SPECIES_LIST.length *
        STARTER_CLASS_LIST.length *
        STARTER_ELEMENT_LIST.length *
        STARTER_FOUNDATION_LIST.length,
    ).toBe(320);
  });

  it("returns a well-formed baseMaskId and baseSuitId for every permutation", () => {
    let count = 0;
    const masks = new Set<string>();
    const suits = new Set<string>();
    for (const species of STARTER_SPECIES_LIST) {
      for (const characterClass of STARTER_CLASS_LIST) {
        for (const element of STARTER_ELEMENT_LIST) {
          for (const foundation of STARTER_FOUNDATION_LIST) {
            const loadout = resolveStarterLoadout({
              species,
              characterClass,
              element,
              foundation,
            });
            expect(loadout.baseMaskId).toMatch(/^mask:/);
            expect(loadout.baseSuitId).toMatch(/^suit:/);
            masks.add(loadout.baseMaskId);
            suits.add(loadout.baseSuitId);
            count++;
          }
        }
      }
    }
    expect(count).toBe(320);

    // Masks vary by (class, species) — 5 × 4 = 20 distinct. Foundation
    // is intentionally not encoded in the mask id (no per-foundation
    // mask art pipeline today; the renderer routes via class-cut).
    expect(masks.size).toBe(20);
    // Suits vary by (class, element) — 5 × 8 = 40 distinct.
    expect(suits.size).toBe(40);
  });

  it("bakes the class cut into the mask id so it shares an identity with the suit", () => {
    const oracle = resolveStarterLoadout({
      species: "demagi",
      characterClass: "oracle",
      element: "fire",
      foundation: "humanity",
    });
    const soldier = resolveStarterLoadout({
      species: "demagi",
      characterClass: "soldier",
      element: "fire",
      foundation: "humanity",
    });
    expect(oracle.baseMaskId).toContain("long-coat-over-cuirass");
    expect(oracle.baseSuitId).toContain("long-coat-over-cuirass");
    expect(soldier.baseMaskId).toContain("plated-harness");
    expect(soldier.baseSuitId).toContain("plated-harness");
  });

  it("ignores foundation when emitting the mask id (visual cohesion > foundation distinction)", () => {
    const humanity = resolveStarterLoadout({
      species: "demagi",
      characterClass: "oracle",
      element: "fire",
      foundation: "humanity",
    }).baseMaskId;
    const machine = resolveStarterLoadout({
      species: "demagi",
      characterClass: "oracle",
      element: "fire",
      foundation: "machine",
    }).baseMaskId;
    expect(humanity).toBe(machine);
  });

  it("bakes class cut + element into the suit id", () => {
    const oracleFire = resolveStarterLoadout({
      species: "neyon",
      characterClass: "oracle",
      element: "fire",
      foundation: "humanity",
    }).baseSuitId;
    const soldierTime = resolveStarterLoadout({
      species: "neyon",
      characterClass: "soldier",
      element: "time",
      foundation: "humanity",
    }).baseSuitId;
    expect(oracleFire).toContain("long-coat-over-cuirass");
    expect(oracleFire).toContain("fire");
    expect(soldierTime).toContain("plated-harness");
    expect(soldierTime).toContain("time");
  });

  it("is pure (same input → identical output)", () => {
    const a = resolveStarterLoadout({
      species: "quarchon",
      characterClass: "spy",
      element: "probability",
      foundation: "machine",
    });
    const b = resolveStarterLoadout({
      species: "quarchon",
      characterClass: "spy",
      element: "probability",
      foundation: "machine",
    });
    expect(a).toEqual(b);
  });

  it("each (class, species) pair produces a unique mask id", () => {
    const seen = new Set<string>();
    for (const characterClass of STARTER_CLASS_LIST) {
      for (const species of STARTER_SPECIES_LIST) {
        const { baseMaskId } = resolveStarterLoadout({
          species,
          characterClass,
          element: "earth",
          foundation: "humanity",
        });
        expect(seen.has(baseMaskId)).toBe(false);
        seen.add(baseMaskId);
      }
    }
    // 5 classes × 4 species motifs = 20 distinct masks.
    expect(seen.size).toBe(20);
  });
});
