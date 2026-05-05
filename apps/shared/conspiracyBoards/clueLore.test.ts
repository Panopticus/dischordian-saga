/**
 * Phase K (B3) — clue lore registry consistency.
 *
 * Pins that every clue id in the Acts 1+2 boards' acceptedClues
 * arrays has a body-text entry in clueLore.ts. The board definitions
 * test (conspiracyBoards.test.ts) verifies the IDs themselves; this
 * test verifies the lore is wired all the way through.
 */
import { describe, it, expect } from "vitest";
import { CONSPIRACY_BOARDS } from "./definitions";
import { ACTS_1_2_CLUE_LORE, ALL_CLUE_LORE, getClueLore } from "./clueLore";

describe("clueLore — full Acts 1-7 coverage", () => {
  it("every clue id on every conspiracy board has a body-text entry", () => {
    const missing: string[] = [];
    for (const board of CONSPIRACY_BOARDS) {
      for (const clueId of board.acceptedClues) {
        if (!getClueLore(clueId)) missing.push(clueId);
      }
    }
    expect(missing).toEqual([]);
  });

  it("Acts 1-2 sub-registry is exactly 10 entries (5 per board, kept for backward compat)", () => {
    expect(ACTS_1_2_CLUE_LORE.length).toBe(10);
  });

  it("ALL_CLUE_LORE registry covers every clue across the 7 boards", () => {
    const totalAcceptedClues = CONSPIRACY_BOARDS.reduce(
      (n, b) => n + b.acceptedClues.length,
      0,
    );
    // Defensive: catch the case where the same clueId appears on
    // multiple boards. ALL_CLUE_LORE is keyed by id so duplicates
    // would NOT make this assertion fail, but the missing-coverage
    // check above would. Pin the count anyway.
    expect(ALL_CLUE_LORE.length).toBe(totalAcceptedClues);
  });

  it("every clue lore has body text + an in-fiction source", () => {
    for (const c of ALL_CLUE_LORE) {
      expect(c.body.trim().length).toBeGreaterThan(0);
      expect(c.source.trim().length).toBeGreaterThan(0);
    }
  });

  it("every clue lore loredex anchor uses the existing entity_<n> id pattern", () => {
    for (const c of ALL_CLUE_LORE) {
      for (const id of c.loredexEntityIds ?? []) {
        expect(id).toMatch(/^entity_\d+$/);
      }
    }
  });

  it("getClueLore returns undefined for unknown ids", () => {
    expect(getClueLore("not_a_real_clue")).toBeUndefined();
  });
});
