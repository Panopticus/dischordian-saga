/**
 * Conspiracy Boards / Witnessing Discovery Race tests.
 *
 * Pure-data + drop-table validation. Server-side solve flow is
 * exercised by the e2e suite; these tests verify the static
 * registry consistency and clue-drop math.
 */
import { describe, it, expect } from "vitest";
import {
  CONSPIRACY_BOARDS,
  getConspiracyBoard,
  getAllAcceptedClueKeys,
  getBoardsForClue,
} from "./definitions";
import { rollClueDrop, validateDropTables, DROP_TABLES } from "./clueDrops";

describe("conspiracy board registry integrity", () => {
  it("every boardKey is unique", () => {
    const seen = new Set<string>();
    for (const b of CONSPIRACY_BOARDS) {
      expect(seen.has(b.boardKey)).toBe(false);
      seen.add(b.boardKey);
    }
  });

  it("getConspiracyBoard round-trips", () => {
    for (const b of CONSPIRACY_BOARDS) {
      expect(getConspiracyBoard(b.boardKey)).toBe(b);
    }
  });

  it("cluesRequired equals the length of acceptedClues", () => {
    for (const b of CONSPIRACY_BOARDS) {
      expect(b.cluesRequired).toBe(b.acceptedClues.length);
    }
  });

  it("acceptedClues lists are unique within a board", () => {
    for (const b of CONSPIRACY_BOARDS) {
      const set = new Set(b.acceptedClues);
      expect(set.size).toBe(b.acceptedClues.length);
    }
  });

  it("getBoardsForClue returns boards that actually accept the clue", () => {
    for (const clue of getAllAcceptedClueKeys()) {
      const boards = getBoardsForClue(clue);
      expect(boards.length).toBeGreaterThan(0);
      for (const b of boards) {
        expect(b.acceptedClues).toContain(clue);
      }
    }
  });
});

describe("drop tables", () => {
  it("every clue in every drop pool maps to at least one board", () => {
    const orphans = validateDropTables();
    expect(orphans).toEqual([]);
  });

  it("rollClueDrop respects deterministic RNG", () => {
    // RNG that always returns 0 → drops first item from pool.
    const alwaysZero = () => 0;
    for (const table of DROP_TABLES) {
      const drop = rollClueDrop(table.source, alwaysZero);
      expect(drop).toBe(table.pool[0]);
    }
  });

  it("rollClueDrop returns null when RNG > dropRate", () => {
    // RNG that always returns 0.99 → above all drop rates < 1.
    const alwaysHigh = () => 0.99;
    for (const table of DROP_TABLES) {
      if (table.dropRate < 0.99) {
        expect(rollClueDrop(table.source, alwaysHigh)).toBeNull();
      }
    }
  });

  it("drop rates are in [0, 1]", () => {
    for (const table of DROP_TABLES) {
      expect(table.dropRate).toBeGreaterThanOrEqual(0);
      expect(table.dropRate).toBeLessThanOrEqual(1);
    }
  });

  it("every gameType-clue source has a non-empty pool", () => {
    for (const table of DROP_TABLES) {
      expect(table.pool.length).toBeGreaterThan(0);
    }
  });
});

describe("conspiracy ↔ titles integration", () => {
  it("at least one board has factionAlignment set (drives pressureService)", () => {
    expect(CONSPIRACY_BOARDS.some((b) => !!b.factionAlignment)).toBe(true);
  });

  it("each board's revealFlag (if set) follows the secret_act_N_revealed pattern", () => {
    for (const b of CONSPIRACY_BOARDS) {
      if (b.revealFlag) {
        expect(b.revealFlag).toMatch(/^secret_act_[1-7]_revealed$/);
      }
    }
  });
});
