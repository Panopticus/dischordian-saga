import { describe, expect, it } from "vitest";

import { ROOM_TIER_THRESHOLDS, getRoomTier } from "./roomTier";

describe("roomTier", () => {
  it("returns 0 for an unknown room id", () => {
    expect(getRoomTier("not-a-real-room", { narrativeFlags: {} })).toBe(0);
  });

  it("returns 0 when no threshold flags are set", () => {
    expect(getRoomTier("cryo-bay", { narrativeFlags: {} })).toBe(0);
  });

  it("advances to tier 1 when only the tier1 flag is set", () => {
    expect(
      getRoomTier("cryo-bay", {
        narrativeFlags: { cryo_mystery_first_clue_found: true },
      }),
    ).toBe(1);
  });

  it("advances to tier 2 when tier2 flag is set (regardless of tier1)", () => {
    expect(
      getRoomTier("cryo-bay", {
        narrativeFlags: { cryo_mystery_victim_identified: true },
      }),
    ).toBe(2);
  });

  it("advances to tier 3 when tier3 flag is set", () => {
    expect(
      getRoomTier("cryo-bay", {
        narrativeFlags: { cryo_case_marked_open: true },
      }),
    ).toBe(3);
  });

  it("picks the highest tier when multiple flags are set", () => {
    expect(
      getRoomTier("cryo-bay", {
        narrativeFlags: {
          cryo_mystery_first_clue_found: true,
          cryo_mystery_victim_identified: true,
          cryo_case_marked_open: true,
        },
      }),
    ).toBe(3);
  });

  it("declares thresholds for the four showcase rooms", () => {
    for (const roomId of ["cryo-bay", "medical-bay", "bridge", "engineering"]) {
      expect(ROOM_TIER_THRESHOLDS[roomId]).toBeDefined();
      expect(ROOM_TIER_THRESHOLDS[roomId].tier1).toBeTruthy();
      expect(ROOM_TIER_THRESHOLDS[roomId].tier2).toBeTruthy();
      expect(ROOM_TIER_THRESHOLDS[roomId].tier3).toBeTruthy();
    }
  });

  it("medical bay tier 1 lifts on the first clue flag", () => {
    expect(
      getRoomTier("medical-bay", {
        narrativeFlags: { medbay_first_clue_found: true },
      }),
    ).toBe(1);
  });

  it("medical bay tier 2 lifts when the device is awakened (existing flag)", () => {
    expect(
      getRoomTier("medical-bay", {
        narrativeFlags: { medbay_device_awakened: true },
      }),
    ).toBe(2);
  });

  it("bridge tier 2 lifts when the existing nav-calibration flag fires", () => {
    expect(
      getRoomTier("bridge", {
        narrativeFlags: { fast_travel_unlocked: true },
      }),
    ).toBe(2);
  });
});
