import { describe, expect, it } from "vitest";
import {
  CONVERGENCE_SEAT_GOODBYE_LINES,
  allGoodbyesHeard,
  getConvergenceGoodbyeLines,
} from "./convergenceSeatGoodbye";
import { DIPLOMACY_TABLE_SEATS } from "./bridgeDiplomacyTable";

describe("convergenceSeatGoodbye", () => {
  it("ships one goodbye line for every diplomacy-table seat", () => {
    expect(CONVERGENCE_SEAT_GOODBYE_LINES).toHaveLength(
      DIPLOMACY_TABLE_SEATS.length,
    );
  });

  it("every goodbye references a real NPC from the diplomacy table", () => {
    const validIds = new Set(DIPLOMACY_TABLE_SEATS.map((s) => s.npcId));
    for (const g of CONVERGENCE_SEAT_GOODBYE_LINES) {
      expect(validIds.has(g.npcId), `unknown NPC ${g.npcId}`).toBe(true);
    }
  });

  it("lines are sorted by seat order (canonical procession)", () => {
    const orders = CONVERGENCE_SEAT_GOODBYE_LINES.map((g) => g.order);
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
  });

  it("every line is a substantive single utterance", () => {
    for (const g of CONVERGENCE_SEAT_GOODBYE_LINES) {
      expect(g.line.trim().length).toBeGreaterThan(20);
      expect(g.speakerName.trim().length).toBeGreaterThan(0);
    }
  });

  it("goodbye metFlags match the diplomacy table source of truth", () => {
    const tableMeta = new Map(
      DIPLOMACY_TABLE_SEATS.map((s) => [s.npcId, s.metFlag]),
    );
    for (const g of CONVERGENCE_SEAT_GOODBYE_LINES) {
      expect(g.metFlag).toBe(tableMeta.get(g.npcId));
    }
  });

  describe("getConvergenceGoodbyeLines", () => {
    it("returns no lines on a fresh save", () => {
      expect(getConvergenceGoodbyeLines(new Set())).toEqual([]);
    });

    it("returns only the lines whose metFlag is set", () => {
      const flags = new Set([
        "prelude_cryo_bay_entered", // Elara
        "human_life_celebration_seen", // Human
      ]);
      const lines = getConvergenceGoodbyeLines(flags);
      expect(lines.map((l) => l.npcId)).toEqual(["elara", "the_human"]);
    });

    it("returns lines in canonical order regardless of flag-set order", () => {
      const flags = new Set([
        "human_life_celebration_seen", // Human (order 3)
        "prelude_cryo_bay_entered", // Elara (order 2)
      ]);
      expect(
        getConvergenceGoodbyeLines(flags).map((l) => l.order),
      ).toEqual([2, 3]);
    });
  });

  describe("allGoodbyesHeard", () => {
    it("returns false on a fresh save", () => {
      expect(allGoodbyesHeard(new Set())).toBe(false);
    });

    it("returns true once every metFlag is set", () => {
      const flags = new Set(
        DIPLOMACY_TABLE_SEATS.map((s) => s.metFlag),
      );
      expect(allGoodbyesHeard(flags)).toBe(true);
    });

    it("returns false when one chair is missing", () => {
      const flags = new Set(
        DIPLOMACY_TABLE_SEATS.map((s) => s.metFlag),
      );
      flags.delete(DIPLOMACY_TABLE_SEATS[3].metFlag);
      expect(allGoodbyesHeard(flags)).toBe(false);
    });
  });
});
