import { describe, it, expect } from "vitest";
import {
  emptyMissionState,
  eventsFromMission,
  emptyCrucibleMeters,
  applyEventsToMeters,
  isGoodEndingReached,
  isBadEndingReached,
} from "..";

function closedMission(targetId: string, outcome: "killed" | "spared" | "escaped" | "lycos_died") {
  const state = emptyMissionState("m1", 42, targetId, 1700000000000);
  return { ...state, step: "aftermath" as const, outcome, endedAt: 1700000000001 };
}

describe("wolfHunt — livingUniverseHooks", () => {
  it("returns empty when mission is not terminal", () => {
    const state = emptyMissionState("m1", 42, "general_caedryn_volk", 1);
    expect(eventsFromMission(state)).toEqual([]);
  });

  it("kill on a lieutenant emits both league_member_killed AND lord_lieutenant_defeated", () => {
    const evts = eventsFromMission(closedMission("general_caedryn_volk", "killed"));
    const kinds = evts.map((e) => e.kind);
    expect(kinds).toContain("league_member_killed");
    expect(kinds).toContain("lord_lieutenant_defeated");
  });

  it("kill drains league_strength and hierarchy_influence", () => {
    const evts = eventsFromMission(closedMission("general_caedryn_volk", "killed"));
    const next = applyEventsToMeters(emptyCrucibleMeters(), evts);
    expect(next.league_strength).toBeLessThan(1);
    expect(next.hierarchy_influence).toBeLessThan(1);
  });

  it("escape raises release_pressure", () => {
    const evts = eventsFromMission(closedMission("general_caedryn_volk", "escaped"));
    const next = applyEventsToMeters(emptyCrucibleMeters(), evts);
    expect(next.release_pressure).toBeGreaterThan(0);
  });

  it("good-ending threshold is reached at league_strength <= 0.05", () => {
    expect(isGoodEndingReached({ league_strength: 0.05, hierarchy_influence: 0, release_pressure: 0 })).toBe(true);
    expect(isGoodEndingReached({ league_strength: 0.06, hierarchy_influence: 0, release_pressure: 0 })).toBe(false);
  });

  it("bad-ending threshold is reached at release_pressure >= 0.95", () => {
    expect(isBadEndingReached({ league_strength: 1, hierarchy_influence: 1, release_pressure: 0.95 })).toBe(true);
    expect(isBadEndingReached({ league_strength: 1, hierarchy_influence: 1, release_pressure: 0.94 })).toBe(false);
  });

  it("meters clamp into [0, 1]", () => {
    // Drive league_strength below 0 with many kills.
    const m = { league_strength: 0.01, hierarchy_influence: 0.01, release_pressure: 0.5 };
    const evts = [
      ...eventsFromMission(closedMission("general_caedryn_volk", "killed")),
      ...eventsFromMission(closedMission("auditor_mireille_yom", "killed")),
    ];
    const next = applyEventsToMeters(m, evts);
    expect(next.league_strength).toBeGreaterThanOrEqual(0);
    expect(next.league_strength).toBeLessThanOrEqual(1);
  });
});
