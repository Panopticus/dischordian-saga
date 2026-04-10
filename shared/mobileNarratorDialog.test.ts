import { describe, it, expect } from "vitest";
import {
  listAvailableLines,
  NARRATOR_DIALOG,
  pickNarratorLine,
  TRUST_TIER_MIN_BOND,
} from "./mobileNarratorDialog";
import type { NarratorRoomId } from "./mobileNarrator";

describe("mobileNarratorDialog", () => {
  describe("structural invariants", () => {
    it("every room with entries has both narrators declared", () => {
      for (const [roomId, set] of Object.entries(NARRATOR_DIALOG)) {
        expect(set.roomId).toBe(roomId);
        expect(set.elara).toBeDefined();
        expect(set.the_human).toBeDefined();
      }
    });

    it("every line uses a valid trust tier", () => {
      const valid = new Set(["F", "P", "H", "V", "D"]);
      for (const set of Object.values(NARRATOR_DIALOG)) {
        for (const line of [...set.elara, ...set.the_human]) {
          expect(valid.has(line.tier)).toBe(true);
          expect(line.text.length).toBeGreaterThan(0);
        }
      }
    });

    it("tier thresholds are monotonic", () => {
      expect(TRUST_TIER_MIN_BOND.F).toBeLessThan(TRUST_TIER_MIN_BOND.P);
      expect(TRUST_TIER_MIN_BOND.P).toBeLessThan(TRUST_TIER_MIN_BOND.H);
      expect(TRUST_TIER_MIN_BOND.H).toBeLessThan(TRUST_TIER_MIN_BOND.V);
      expect(TRUST_TIER_MIN_BOND.V).toBeLessThan(TRUST_TIER_MIN_BOND.D);
    });
  });

  describe("pickNarratorLine", () => {
    it("returns a functional line at bond 0", () => {
      const line = pickNarratorLine("bridge", "elara", 0);
      expect(line?.tier).toBe("F");
      expect(line?.text).toContain("chair warm");
    });

    it("returns the vulnerable line once bond hits 60", () => {
      const line = pickNarratorLine("bridge", "elara", 60);
      expect(line?.tier).toBe("V");
      expect(line?.text).toContain("curtains");
    });

    it("skips tiers that the player hasn't earned", () => {
      // Medical Bay Elara has F and V lines. Bond 40 should still
      // return F because V requires 60.
      const line = pickNarratorLine("medical_bay", "elara", 40);
      expect(line?.tier).toBe("F");
    });

    it("returns null for a room with no dialog set", () => {
      // Cast to satisfy the type checker — the function must handle
      // unknown room ids defensively.
      const line = pickNarratorLine("unknown" as NarratorRoomId, "elara", 100);
      expect(line).toBeNull();
    });

    it("picks The Human's honest tier line on Observation Deck", () => {
      const line = pickNarratorLine("observation_deck", "the_human", 100);
      expect(line?.tier).toBe("H");
      expect(line?.text).toContain("earned the sector");
    });

    it("memorial_corridor is gated behind honest tier", () => {
      expect(pickNarratorLine("memorial_corridor", "elara", 0)).toBeNull();
      expect(pickNarratorLine("memorial_corridor", "elara", 39)).toBeNull();
      expect(pickNarratorLine("memorial_corridor", "elara", 40)?.tier).toBe("H");
    });
  });

  describe("listAvailableLines", () => {
    it("cumulative — honest tier also exposes functional lines", () => {
      const lines = listAvailableLines("engineering", "elara", 40);
      expect(lines.map((l) => l.tier)).toContain("F");
      expect(lines.map((l) => l.tier)).toContain("H");
    });

    it("returns empty for a room the narrator hasn't been written for", () => {
      const lines = listAvailableLines("unknown" as NarratorRoomId, "elara", 100);
      expect(lines).toEqual([]);
    });

    it("Cargo Bay has the burnt tarot thread verbatim", () => {
      const lines = listAvailableLines("cargo_bay", "elara", 0);
      expect(lines.some((l) => l.text.includes("tarot card"))).toBe(true);
    });
  });
});
