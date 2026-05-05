/**
 * Audit follow-up #3 — every lord ships an encounter prologue +
 * epilogue alongside its loreSummary. The status field still reflects
 * the engine-side (cards / VO) integration tier; this test pins the
 * narrative-side coverage so a regression that drops a prologue is
 * caught before it ships.
 */
import { describe, it, expect } from "vitest";
import { HIERARCHY_LORDS, lordsForAct } from "./hierarchyOfTheDamned";

describe("hierarchyOfTheDamned — encounter prose coverage", () => {
  it("every lord has a non-empty encounterPrologue", () => {
    for (const lord of HIERARCHY_LORDS) {
      expect(lord.encounterPrologue.trim().length).toBeGreaterThan(0);
    }
  });

  it("every lord has a non-empty encounterEpilogue", () => {
    for (const lord of HIERARCHY_LORDS) {
      expect(lord.encounterEpilogue.trim().length).toBeGreaterThan(0);
    }
  });

  it("prologue + epilogue are at least 200 chars (no one-liners)", () => {
    for (const lord of HIERARCHY_LORDS) {
      expect(lord.encounterPrologue.length).toBeGreaterThanOrEqual(200);
      expect(lord.encounterEpilogue.length).toBeGreaterThanOrEqual(200);
    }
  });

  it("status mix: 1 fully_implemented, 3 stub_with_reactions, 0 lore_only", () => {
    const counts = { fully_implemented: 0, stub_with_reactions: 0, lore_only: 0 };
    for (const lord of HIERARCHY_LORDS) counts[lord.status]++;
    expect(counts).toEqual({
      fully_implemented: 1,
      stub_with_reactions: 3,
      lore_only: 0,
    });
  });

  it("lordsForAct(7) includes every lord (filter sanity)", () => {
    const act7 = lordsForAct(7);
    expect(act7.map((l) => l.id).sort()).toEqual(
      HIERARCHY_LORDS.map((l) => l.id).sort(),
    );
  });
});
