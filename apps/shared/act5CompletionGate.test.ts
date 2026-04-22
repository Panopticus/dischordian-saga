import { describe, it, expect } from "vitest";
import {
  ACT_5_COMPLETION_REQUIRED_FLAGS,
  deriveAct5CompletionStatus,
  isAct5Complete,
} from "./act5CompletionGate";
import { RECRUITMENT_THRESHOLDS } from "./armyRecruitment";

const ALL_REQUIRED = {
  slideshow_act_5_map_intro_complete: true,
  act_5_map_revealed: true,
  cades_m7_complete: true,
};

/** Build an array of N distinct mission ids so the recruitment
 *  helper reports `count === N`. */
function missions(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `mission_${i}`);
}

describe("deriveAct5CompletionStatus — baseline", () => {
  it("reports nothing met on empty inputs", () => {
    const s = deriveAct5CompletionStatus({ narrativeAct: 5, flags: {} });
    expect(s.requiredMet).toBe(0);
    expect(s.recruitmentCount).toBe(0);
    expect(s.recruitmentThresholdMet).toBe(false);
    expect(s.readyToFire).toBe(false);
  });

  it("tolerates undefined flags + missions", () => {
    const s = deriveAct5CompletionStatus({
      narrativeAct: undefined,
      flags: undefined,
    });
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct5CompletionStatus — readyToFire", () => {
  it("fires when all required flags + recruitment threshold + Act 5", () => {
    const s = deriveAct5CompletionStatus({
      narrativeAct: 5,
      flags: ALL_REQUIRED,
      armyRecruitmentMissionsCompleted: missions(RECRUITMENT_THRESHOLDS.act6),
    });
    expect(s.allConditionsMet).toBe(true);
    expect(s.readyToFire).toBe(true);
  });

  it("does NOT fire when narrativeAct < 5", () => {
    const s = deriveAct5CompletionStatus({
      narrativeAct: 4,
      flags: ALL_REQUIRED,
      armyRecruitmentMissionsCompleted: missions(10),
    });
    expect(s.allConditionsMet).toBe(true);
    expect(s.readyToFire).toBe(false);
  });

  it("does NOT re-fire once act_5_complete is set", () => {
    const s = deriveAct5CompletionStatus({
      narrativeAct: 5,
      flags: { ...ALL_REQUIRED, act_5_complete: true },
      armyRecruitmentMissionsCompleted: missions(10),
    });
    expect(s.alreadyComplete).toBe(true);
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct5CompletionStatus — per-required-flag gating", () => {
  for (const flag of ACT_5_COMPLETION_REQUIRED_FLAGS) {
    it(`does NOT fire when ${flag} is missing`, () => {
      const partial = { ...ALL_REQUIRED, [flag]: false };
      const s = deriveAct5CompletionStatus({
        narrativeAct: 5,
        flags: partial,
        armyRecruitmentMissionsCompleted: missions(10),
      });
      expect(s.requiredFlagStatus[flag]).toBe(false);
      expect(s.readyToFire).toBe(false);
    });
  }
});

describe("deriveAct5CompletionStatus — recruitment threshold", () => {
  it("does NOT fire when recruitment count is below Act 6 threshold", () => {
    const s = deriveAct5CompletionStatus({
      narrativeAct: 5,
      flags: ALL_REQUIRED,
      armyRecruitmentMissionsCompleted: missions(RECRUITMENT_THRESHOLDS.act6 - 1),
    });
    expect(s.recruitmentThresholdMet).toBe(false);
    expect(s.readyToFire).toBe(false);
  });

  it("fires exactly at the threshold", () => {
    const s = deriveAct5CompletionStatus({
      narrativeAct: 5,
      flags: ALL_REQUIRED,
      armyRecruitmentMissionsCompleted: missions(RECRUITMENT_THRESHOLDS.act6),
    });
    expect(s.recruitmentThresholdMet).toBe(true);
    expect(s.readyToFire).toBe(true);
  });

  it("reports the current count and threshold for UI", () => {
    const s = deriveAct5CompletionStatus({
      narrativeAct: 5,
      flags: {},
      armyRecruitmentMissionsCompleted: missions(3),
    });
    expect(s.recruitmentCount).toBe(3);
    expect(s.recruitmentThreshold).toBe(RECRUITMENT_THRESHOLDS.act6);
  });
});

describe("isAct5Complete", () => {
  it("reads act_5_complete directly", () => {
    expect(isAct5Complete({ act_5_complete: true })).toBe(true);
    expect(isAct5Complete({})).toBe(false);
    expect(isAct5Complete(undefined)).toBe(false);
  });
});
