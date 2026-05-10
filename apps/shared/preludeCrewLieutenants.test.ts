import { describe, expect, it } from "vitest";
import {
  ALL_LIEUTENANTS,
  MISSION_LIEUTENANT_BY_ID,
  allLieutenantMissionsComplete,
  getMissionLieutenant,
} from "./preludeCrewLieutenants";

describe("preludeCrewLieutenants", () => {
  it("ships exactly five lieutenants (Patch, Zephyr-9, Little One, Iron Lion, Locke)", () => {
    expect(ALL_LIEUTENANTS).toHaveLength(5);
    const ids = ALL_LIEUTENANTS.map((l) => l.id);
    expect(ids).toEqual([
      "patch",
      "zephyr_9",
      "little_one",
      "iron_lion",
      "adjudicator_locke",
    ]);
  });

  it("assigns the five lieutenants to the first-encounter missions", () => {
    const map = MISSION_LIEUTENANT_BY_ID;
    expect(map["mission-1-1"].id).toBe("patch");
    expect(map["mission-1-2"].id).toBe("zephyr_9");
    expect(map["mission-1-3"].id).toBe("little_one");
    expect(map["mission-1-4"].id).toBe("iron_lion");
    expect(map["mission-2-1"].id).toBe("adjudicator_locke");
    expect(Object.keys(map)).toHaveLength(5);
  });

  it("every lieutenant carries a non-trivial briefing and mission framing", () => {
    for (const lt of ALL_LIEUTENANTS) {
      expect(lt.displayName.trim().length).toBeGreaterThan(0);
      expect(lt.firstMet.trim().length).toBeGreaterThan(0);
      expect(lt.patronBriefing.trim().length).toBeGreaterThan(60);
      expect(lt.missionFraming.trim().length).toBeGreaterThan(40);
    }
  });

  it("getMissionLieutenant returns the correct lieutenant for a known mission", () => {
    expect(getMissionLieutenant("mission-1-1")?.id).toBe("patch");
    expect(getMissionLieutenant("mission-2-1")?.id).toBe("adjudicator_locke");
  });

  it("getMissionLieutenant returns undefined for a non-lieutenant mission", () => {
    expect(getMissionLieutenant("mission-3-1")).toBeUndefined();
    expect(getMissionLieutenant("nonexistent-mission")).toBeUndefined();
  });

  describe("allLieutenantMissionsComplete", () => {
    it("returns false when none have been cleared", () => {
      expect(allLieutenantMissionsComplete([])).toBe(false);
    });

    it("returns false when only some have been cleared", () => {
      expect(
        allLieutenantMissionsComplete(["mission-1-1", "mission-1-2", "mission-1-3"]),
      ).toBe(false);
    });

    it("returns true once all five have been cleared (extra missions OK)", () => {
      expect(
        allLieutenantMissionsComplete([
          "mission-1-1",
          "mission-1-2",
          "mission-1-3",
          "mission-1-4",
          "mission-2-1",
          "mission-3-1", // extra; should still pass
        ]),
      ).toBe(true);
    });
  });
});
