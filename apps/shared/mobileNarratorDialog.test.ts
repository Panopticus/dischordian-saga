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

  describe("dialog matrix expansion coverage", () => {
    it("Bridge has a devoted-tier line for both narrators", () => {
      expect(pickNarratorLine("bridge", "elara", 80)?.tier).toBe("D");
      expect(pickNarratorLine("bridge", "the_human", 80)?.tier).toBe("D");
    });

    it("Archives unlocks progressively by tier", () => {
      expect(pickNarratorLine("archives", "elara", 0)?.tier).toBe("F");
      expect(pickNarratorLine("archives", "elara", 20)?.tier).toBe("P");
      expect(pickNarratorLine("archives", "elara", 40)?.tier).toBe("H");
      expect(pickNarratorLine("archives", "the_human", 40)?.tier).toBe("H");
    });

    it("Observation Deck has functional AND honest lines", () => {
      const lines = listAvailableLines("observation_deck", "elara", 100);
      expect(lines.map((l) => l.tier).sort()).toContain("F");
      expect(lines.map((l) => l.tier).sort()).toContain("H");
    });

    it("Memorial Corridor unlocks a vulnerable-tier line at bond 60", () => {
      expect(pickNarratorLine("memorial_corridor", "elara", 60)?.tier).toBe("V");
      expect(pickNarratorLine("memorial_corridor", "the_human", 60)?.tier).toBe("V");
    });

    it("Trade Hub has F/P/H tiers for both narrators", () => {
      expect(pickNarratorLine("trade_hub", "elara", 0)?.tier).toBe("F");
      expect(pickNarratorLine("trade_hub", "elara", 20)?.tier).toBe("P");
      expect(pickNarratorLine("trade_hub", "elara", 40)?.tier).toBe("H");
      expect(pickNarratorLine("trade_hub", "the_human", 40)?.tier).toBe("H");
    });

    it("Trophy Room has F/P/H tiers for both narrators", () => {
      expect(pickNarratorLine("trophy_room", "elara", 40)?.tier).toBe("H");
      expect(pickNarratorLine("trophy_room", "the_human", 40)?.tier).toBe("H");
    });

    it("Captain's Quarters has F/P/H tiers for both narrators", () => {
      expect(pickNarratorLine("captains_quarters", "elara", 40)?.tier).toBe("H");
      expect(pickNarratorLine("captains_quarters", "the_human", 40)?.tier).toBe("H");
    });

    it("every canonicalized ship room has at least F-tier lines for both narrators", () => {
      // Memorial Corridor is intentionally omitted — per §1.5 it
      // unlocks at trust 40, so its lines are gated to tier H.
      // Pet Garden is also trust-gated per §2.5 but currently has
      // F-tier lines so we include it.
      const fTierRooms: Array<keyof typeof NARRATOR_DIALOG> = [
        "bridge",
        "cryo_bay",
        "medical_bay",
        "comms_array",
        "observation_deck",
        "armory",
        "engineering",
        "archives",
        "cargo_bay",
        "pet_garden",
        "trade_hub",
        "trophy_room",
        "captains_quarters",
      ];
      for (const room of fTierRooms) {
        expect(pickNarratorLine(room, "elara", 0), `Elara F in ${room}`).not.toBeNull();
        expect(pickNarratorLine(room, "the_human", 0), `Human F in ${room}`).not.toBeNull();
      }
    });

    it("Memorial Corridor is trust-gated: no F-tier content", () => {
      // §1.5 — the corridor unlocks at bond 40 with both narrators.
      expect(pickNarratorLine("memorial_corridor", "elara", 0)).toBeNull();
      expect(pickNarratorLine("memorial_corridor", "the_human", 0)).toBeNull();
      expect(pickNarratorLine("memorial_corridor", "elara", 40)?.tier).toBe("H");
    });
  });

  describe("beat-aware line selection (§2.7)", () => {
    it("fires the Archives opener line when the beat flag is active", () => {
      const activeBeats = new Set(["engineer_hook_active_opener"]);
      const line = pickNarratorLine("archives", "the_human", 0, activeBeats);
      expect(line).not.toBeNull();
      expect(line!.text).toContain("She means the Engineer");
      expect(line!.beatFlag).toBe("engineer_hook_active_opener");
    });

    it("does NOT fire the opener line when the flag is inactive", () => {
      const line = pickNarratorLine("archives", "the_human", 0);
      expect(line).not.toBeNull();
      expect(line!.text).not.toContain("She means the Engineer");
    });

    it("beat-tagged line beats a higher-tier untagged line at the same bond", () => {
      // At bond 40, the H-tier Shadow Tongue line is available.
      // The beat line is F-tier but the beat flag is active, so
      // it should win.
      const activeBeats = new Set(["engineer_hook_active_opener"]);
      const line = pickNarratorLine("archives", "the_human", 40, activeBeats);
      expect(line!.text).toContain("She means the Engineer");
    });

    it("beat lines don't leak into normal listAvailableLines", () => {
      // Without an active beat, the opener line stays out of the
      // normal selection even though bond is 100.
      const line = pickNarratorLine("archives", "the_human", 100);
      expect(line!.text).not.toContain("She means the Engineer");
    });

    it("unrelated beat flags don't trigger the opener", () => {
      const line = pickNarratorLine(
        "archives",
        "the_human",
        0,
        new Set(["narrator_beat_1_interference"]),
      );
      expect(line!.text).not.toContain("She means the Engineer");
    });
  });
});
