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
import { ACTS_1_2_CLUE_LORE, getClueLore } from "./clueLore";

const ACT_1_2_BOARD_KEYS = new Set(["first_memory", "inheritance_ledger"]);

describe("clueLore — Acts 1+2 coverage", () => {
  it("every Acts 1-2 acceptedClue has a body-text entry", () => {
    const missing: string[] = [];
    for (const board of CONSPIRACY_BOARDS) {
      if (!ACT_1_2_BOARD_KEYS.has(board.boardKey)) continue;
      for (const clueId of board.acceptedClues) {
        if (!getClueLore(clueId)) missing.push(clueId);
      }
    }
    expect(missing).toEqual([]);
  });

  it("registry is exactly 10 entries (5 per board)", () => {
    expect(ACTS_1_2_CLUE_LORE.length).toBe(10);
  });

  it("every clue lore has body text + an in-fiction source", () => {
    for (const c of ACTS_1_2_CLUE_LORE) {
      expect(c.body.trim().length).toBeGreaterThan(0);
      expect(c.source.trim().length).toBeGreaterThan(0);
    }
  });

  it("every clue lore loredex anchor uses the existing entity_<n> id pattern", () => {
    for (const c of ACTS_1_2_CLUE_LORE) {
      for (const id of c.loredexEntityIds ?? []) {
        expect(id).toMatch(/^entity_\d+$/);
      }
    }
  });

  it("getClueLore returns undefined for unknown ids (Acts 3-7 are label-only)", () => {
    expect(getClueLore("clue_warlord_first_speech")).toBeUndefined();
    expect(getClueLore("not_a_real_clue")).toBeUndefined();
  });
});
