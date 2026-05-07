import { describe, expect, it } from "vitest";
import {
  BLOOD_CLASSIFICATIONS,
  CRYSTAL_YIELD_PER_CYCLE,
  PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY,
  isAdvocateBodyUnlocked,
  projectCrystalYield,
  type BloodClassification,
} from "./bloodClassification";

describe("blood classification", () => {
  it("ships exactly seven canonical classifications", () => {
    expect(BLOOD_CLASSIFICATIONS).toHaveLength(7);
    expect(new Set(BLOOD_CLASSIFICATIONS)).toEqual(
      new Set([
        "PURE",
        "HYBRID",
        "DEMONIC",
        "ADVOCATE",
        "SAMSARA",
        "NAMED",
        "UNKNOWN",
      ]),
    );
  });

  it("crystal yield matrix has an entry for every classification", () => {
    for (const c of BLOOD_CLASSIFICATIONS) {
      expect(CRYSTAL_YIELD_PER_CYCLE[c]).toBeGreaterThan(0);
    }
  });

  it("ADVOCATE yields the most per cycle (the bloodline is the densest)", () => {
    const max = Math.max(
      ...BLOOD_CLASSIFICATIONS.map((c) => CRYSTAL_YIELD_PER_CYCLE[c]),
    );
    expect(CRYSTAL_YIELD_PER_CYCLE.ADVOCATE).toBe(max);
  });

  it("PURE yields the least per cycle (clean bloodline, low refinement density)", () => {
    const min = Math.min(
      ...BLOOD_CLASSIFICATIONS.map((c) => CRYSTAL_YIELD_PER_CYCLE[c]),
    );
    expect(CRYSTAL_YIELD_PER_CYCLE.PURE).toBe(min);
  });

  it("crystal-yield matrix is frozen", () => {
    expect(Object.isFrozen(CRYSTAL_YIELD_PER_CYCLE)).toBe(true);
  });

  it("projectCrystalYield multiplies yield by floor(cycles)", () => {
    expect(projectCrystalYield("DEMONIC", 4)).toBe(36);
    expect(projectCrystalYield("PURE", 10)).toBe(10);
    expect(projectCrystalYield("ADVOCATE", 4.7)).toBe(48); // floor of 4.7 = 4
    expect(projectCrystalYield("HYBRID", 0)).toBe(0);
    expect(projectCrystalYield("NAMED", -3)).toBe(0);
  });

  it("Season-2 Advocate-body coordinates unlock at 5+ PURE generations", () => {
    expect(PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY).toBe(5);
    expect(isAdvocateBodyUnlocked(0)).toBe(false);
    expect(isAdvocateBodyUnlocked(4)).toBe(false);
    expect(isAdvocateBodyUnlocked(5)).toBe(true);
    expect(isAdvocateBodyUnlocked(7)).toBe(true);
  });

  it("BloodClassification union type is keyed on the constant array", () => {
    // Trivial compile-time check — if BLOOD_CLASSIFICATIONS lost a
    // member, this assignment would fail to type-check.
    const sample: BloodClassification = "ADVOCATE";
    expect(BLOOD_CLASSIFICATIONS).toContain(sample);
  });
});
