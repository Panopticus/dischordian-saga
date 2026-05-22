import { describe, it, expect } from "vitest";
import {
  PREPARATION_MISSION_IDS,
  PREPARATION_MISSIONS,
  DEFAULT_PLAYER_PREPARATION_STATE,
  isPreparationMissionId,
  canStartMission,
  nextAvailableMission,
  applyMissionPatch,
  resolveMission,
  deriveAvailability,
  type PlayerPreparationState,
  type MissionEvaluation,
} from "./registry";

describe("PREPARATION_MISSIONS registry", () => {
  it("has exactly 5 missions, one per November week", () => {
    expect(PREPARATION_MISSION_IDS.length).toBe(5);
    const weeks = PREPARATION_MISSION_IDS.map((id) => PREPARATION_MISSIONS[id].week);
    expect(weeks).toEqual([1, 2, 3, 4, 5]);
  });

  it("every mission's prerequisites reference real mission ids", () => {
    for (const id of PREPARATION_MISSION_IDS) {
      const def = PREPARATION_MISSIONS[id];
      for (const prereq of def.prerequisites) {
        expect(PREPARATION_MISSIONS[prereq]).toBeDefined();
      }
    }
  });

  it("prerequisite chain is linear: each mission requires the prior week's mission", () => {
    expect(PREPARATION_MISSIONS.salvage.prerequisites).toEqual([]);
    expect(PREPARATION_MISSIONS.reverse_trial.prerequisites).toEqual(["salvage"]);
    expect(PREPARATION_MISSIONS.tribunal_elara.prerequisites).toEqual(["reverse_trial"]);
    expect(PREPARATION_MISSIONS.the_question.prerequisites).toEqual(["tribunal_elara"]);
    expect(PREPARATION_MISSIONS.bidding_war.prerequisites).toEqual(["the_question"]);
  });

  it("isPreparationMissionId narrows correctly", () => {
    expect(isPreparationMissionId("salvage")).toBe(true);
    expect(isPreparationMissionId("nonexistent")).toBe(false);
  });
});

describe("DEFAULT_PLAYER_PREPARATION_STATE", () => {
  it("opens with only the salvage mission available", () => {
    const s = DEFAULT_PLAYER_PREPARATION_STATE;
    expect(s.missionStatus.salvage).toBe("available");
    expect(s.missionStatus.reverse_trial).toBe("locked");
    expect(s.missionStatus.tribunal_elara).toBe("locked");
    expect(s.missionStatus.the_question).toBe("locked");
    expect(s.missionStatus.bidding_war).toBe("locked");
  });

  it("has baseline buff slots: hand=5, weight=1.0, no buffs active", () => {
    const s = DEFAULT_PLAYER_PREPARATION_STATE;
    expect(s.witnessHandSize).toBe(5);
    expect(s.filedBuff).toBe(false);
    expect(s.elaraConfessionVisibility).toBe(false);
    expect(s.humanConfessionWeight).toBe(1.0);
    expect(s.factionMultipliers).toEqual({});
    expect(s.recoveredBurntCardIds).toEqual([]);
    expect(s.pledgedCardIds).toEqual([]);
  });
});

describe("canStartMission + nextAvailableMission — ordering", () => {
  it("only salvage is startable at the beginning", () => {
    const s = DEFAULT_PLAYER_PREPARATION_STATE;
    expect(canStartMission("salvage", s)).toBe(true);
    expect(canStartMission("reverse_trial", s)).toBe(false);
    expect(canStartMission("the_question", s)).toBe(false);
    expect(nextAvailableMission(s)).toBe("salvage");
  });

  it("passing salvage unlocks reverse_trial, not later weeks", () => {
    const after = resolveMission(DEFAULT_PLAYER_PREPARATION_STATE, "salvage", {
      passed: true,
      reason: "ok",
    });
    expect(after.missionStatus.salvage).toBe("passed");
    expect(after.missionStatus.reverse_trial).toBe("available");
    expect(after.missionStatus.tribunal_elara).toBe("locked");
    expect(nextAvailableMission(after)).toBe("reverse_trial");
  });

  it("failing salvage still consumes the slot — reverse_trial stays locked", () => {
    const after = resolveMission(DEFAULT_PLAYER_PREPARATION_STATE, "salvage", {
      passed: false,
      reason: "missed too many recoveries",
    });
    expect(after.missionStatus.salvage).toBe("failed");
    expect(after.missionStatus.reverse_trial).toBe("locked");
    expect(nextAvailableMission(after)).toBeNull();
  });

  it("trying to resolve an unavailable mission throws", () => {
    expect(() =>
      resolveMission(DEFAULT_PLAYER_PREPARATION_STATE, "the_question", {
        passed: true,
        reason: "x",
      }),
    ).toThrow(/not startable/);
  });

  it("re-resolving a passed mission throws — single attempt rule", () => {
    let s = resolveMission(DEFAULT_PLAYER_PREPARATION_STATE, "salvage", {
      passed: true,
      reason: "ok",
    });
    expect(() => resolveMission(s, "salvage", { passed: true, reason: "retry" })).toThrow(
      /not startable/,
    );
  });

  it("deriveAvailability: a terminal state is sticky", () => {
    const status = {
      salvage: "failed" as const,
      reverse_trial: "locked" as const,
      tribunal_elara: "locked" as const,
      the_question: "locked" as const,
      bidding_war: "locked" as const,
    };
    expect(deriveAvailability("salvage", status)).toBe("failed");
    expect(deriveAvailability("reverse_trial", status)).toBe("locked");
  });
});

/* ─── PATCH APPLICATION ─── */

describe("applyMissionPatch — reward semantics", () => {
  const start = DEFAULT_PLAYER_PREPARATION_STATE;

  it("witnessHandSize reward adds to baseline", () => {
    const next = applyMissionPatch(start, { witnessHandSize: 2 }, "reward");
    expect(next.witnessHandSize).toBe(7);
  });

  it("boolean rewards OR with the current value", () => {
    const next = applyMissionPatch(start, { filedBuff: true }, "reward");
    expect(next.filedBuff).toBe(true);
    const again = applyMissionPatch(next, { filedBuff: true }, "reward");
    expect(again.filedBuff).toBe(true);
  });

  it("factionMultipliers reward multiplies (capped to 1.0 baseline)", () => {
    const next = applyMissionPatch(
      start,
      { factionMultipliers: { resistance: 1.5, hierarchy: 1.2 } },
      "reward",
    );
    expect(next.factionMultipliers.resistance).toBeCloseTo(1.5);
    expect(next.factionMultipliers.hierarchy).toBeCloseTo(1.2);
  });

  it("recoveredBurntCardIds reward appends without dupes", () => {
    const a = applyMissionPatch(
      start,
      { recoveredBurntCardIds: ["wraith_calder", "akai_shi"] },
      "reward",
    );
    expect(a.recoveredBurntCardIds).toEqual(["wraith_calder", "akai_shi"]);
    const b = applyMissionPatch(
      a,
      { recoveredBurntCardIds: ["akai_shi", "lycos"] },
      "reward",
    );
    expect(b.recoveredBurntCardIds).toEqual(["wraith_calder", "akai_shi", "lycos"]);
  });

  it("pledgedCardIds reward appends without dupes", () => {
    const a = applyMissionPatch(
      start,
      { pledgedCardIds: ["c1", "c2"] },
      "reward",
    );
    expect(a.pledgedCardIds).toEqual(["c1", "c2"]);
  });

  it("does not mutate the input state", () => {
    const before = JSON.stringify(start);
    applyMissionPatch(start, { witnessHandSize: 5 }, "reward");
    expect(JSON.stringify(start)).toBe(before);
  });
});

describe("applyMissionPatch — penalty semantics", () => {
  it("humanConfessionWeight penalty replaces, not multiplies", () => {
    const s: PlayerPreparationState = {
      ...DEFAULT_PLAYER_PREPARATION_STATE,
      humanConfessionWeight: 1.0,
    };
    const next = applyMissionPatch(s, { humanConfessionWeight: 0.75 }, "penalty");
    expect(next.humanConfessionWeight).toBeCloseTo(0.75);
  });

  it("factionMultipliers penalty replaces per faction", () => {
    const s: PlayerPreparationState = {
      ...DEFAULT_PLAYER_PREPARATION_STATE,
      factionMultipliers: { resistance: 1.5 },
    };
    const next = applyMissionPatch(
      s,
      { factionMultipliers: { resistance: 1.0 } },
      "penalty",
    );
    expect(next.factionMultipliers.resistance).toBe(1.0);
  });
});

/* ─── END-TO-END RESOLUTION ─── */

describe("resolveMission — end to end", () => {
  it("pass: applies rewards and marks status passed", () => {
    const evaluation: MissionEvaluation = {
      passed: true,
      reason: "Recovered 3 of 5 burnt cards.",
      rewards: {
        witnessHandSize: 3,
        recoveredBurntCardIds: ["wraith_calder", "akai_shi", "lycos"],
      },
    };
    const after = resolveMission(DEFAULT_PLAYER_PREPARATION_STATE, "salvage", evaluation);
    expect(after.missionStatus.salvage).toBe("passed");
    expect(after.witnessHandSize).toBe(8);
    expect(after.recoveredBurntCardIds).toEqual(["wraith_calder", "akai_shi", "lycos"]);
    expect(after.missionStatus.reverse_trial).toBe("available");
  });

  it("fail: applies penalties and marks status failed", () => {
    const evaluation: MissionEvaluation = {
      passed: false,
      reason: "Recovered only 1 of 5.",
      penalties: { witnessHandSize: 3 }, // -2 from baseline: penalty replaces
    };
    const after = resolveMission(DEFAULT_PLAYER_PREPARATION_STATE, "salvage", evaluation);
    expect(after.missionStatus.salvage).toBe("failed");
    expect(after.witnessHandSize).toBe(3);
    // Downstream missions stay locked since salvage didn't pass.
    expect(after.missionStatus.reverse_trial).toBe("locked");
  });

  it("the full 5-mission pass chain unlocks each subsequent mission", () => {
    let s = DEFAULT_PLAYER_PREPARATION_STATE;
    const passes: Array<[Parameters<typeof resolveMission>[1], MissionEvaluation]> = [
      ["salvage", { passed: true, reason: "ok", rewards: { witnessHandSize: 1 } }],
      ["reverse_trial", { passed: true, reason: "ok", rewards: { filedBuff: true } }],
      [
        "tribunal_elara",
        { passed: true, reason: "ok", rewards: { elaraConfessionVisibility: true } },
      ],
      [
        "the_question",
        { passed: true, reason: "ok", rewards: { humanConfessionWeight: 1.5 } },
      ],
      [
        "bidding_war",
        {
          passed: true,
          reason: "ok",
          rewards: { factionMultipliers: { resistance: 1.4 } },
        },
      ],
    ];
    for (const [id, ev] of passes) {
      s = resolveMission(s, id, ev);
    }
    // All five passed.
    for (const id of PREPARATION_MISSION_IDS) {
      expect(s.missionStatus[id]).toBe("passed");
    }
    // Aggregate buff profile matches the plan.
    expect(s.witnessHandSize).toBe(6);
    expect(s.filedBuff).toBe(true);
    expect(s.elaraConfessionVisibility).toBe(true);
    expect(s.humanConfessionWeight).toBe(1.5);
    expect(s.factionMultipliers.resistance).toBeCloseTo(1.4);
    expect(nextAvailableMission(s)).toBeNull();
  });
});
