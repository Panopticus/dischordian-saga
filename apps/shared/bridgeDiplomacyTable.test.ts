import { describe, expect, it } from "vitest";
import {
  DIPLOMACY_TABLE_SEATS,
  DIPLOMACY_TABLE_TOTAL_SEATS,
  diplomacyTableFull,
  getDiplomacyTableSeats,
} from "./bridgeDiplomacyTable";

describe("bridgeDiplomacyTable", () => {
  it("declares fifteen earnable seats (excluding the Captain's empty seat 1)", () => {
    expect(DIPLOMACY_TABLE_TOTAL_SEATS).toBe(15);
    expect(DIPLOMACY_TABLE_SEATS).toHaveLength(15);
  });

  it("seat positions start at 2 (Captain's chair is seat 1, intentionally empty)", () => {
    const positions = DIPLOMACY_TABLE_SEATS.map((s) => s.seatPosition);
    expect(Math.min(...positions)).toBe(2);
  });

  it("seat positions are unique across all NPCs", () => {
    const positions = DIPLOMACY_TABLE_SEATS.map((s) => s.seatPosition);
    expect(new Set(positions).size).toBe(positions.length);
  });

  it("metFlags are unique across all NPCs", () => {
    const flags = DIPLOMACY_TABLE_SEATS.map((s) => s.metFlag);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("every seat carries non-empty display data", () => {
    for (const seat of DIPLOMACY_TABLE_SEATS) {
      expect(seat.npcId.trim().length).toBeGreaterThan(0);
      expect(seat.displayName.trim().length).toBeGreaterThan(0);
      expect(seat.firstMet.trim().length).toBeGreaterThan(0);
    }
  });

  describe("getDiplomacyTableSeats", () => {
    it("returns no seats on a fresh save", () => {
      expect(getDiplomacyTableSeats(new Set())).toEqual([]);
    });

    it("returns Elara's seat after the cryo bay is entered", () => {
      const seats = getDiplomacyTableSeats(new Set(["prelude_cryo_bay_entered"]));
      expect(seats.map((s) => s.npcId)).toEqual(["elara"]);
    });

    it("returns the cumulative met set, sorted by seat position", () => {
      const seats = getDiplomacyTableSeats(
        new Set([
          "prelude_beat_h_inbox_first_open", // Locke (seat 4)
          "human_life_celebration_seen", // Human (seat 3)
          "prelude_cryo_bay_entered", // Elara (seat 2)
        ]),
      );
      expect(seats.map((s) => s.npcId)).toEqual(["elara", "the_human", "adjudicator_locke"]);
    });
  });

  describe("diplomacyTableFull", () => {
    it("returns false on a fresh save", () => {
      expect(diplomacyTableFull(new Set())).toBe(false);
    });

    it("returns true once every metFlag is set", () => {
      const flags = new Set(DIPLOMACY_TABLE_SEATS.map((s) => s.metFlag));
      expect(diplomacyTableFull(flags)).toBe(true);
    });

    it("returns false when a single seat is missing", () => {
      const flags = new Set(DIPLOMACY_TABLE_SEATS.map((s) => s.metFlag));
      flags.delete("malkia_enigma" === "malkia_enigma" ? DIPLOMACY_TABLE_SEATS[14].metFlag : "");
      expect(diplomacyTableFull(flags)).toBe(false);
    });
  });
});
