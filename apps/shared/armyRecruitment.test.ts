import { describe, it, expect } from "vitest";
import {
  RECRUITMENT_THRESHOLDS,
  addCompletedRecruitmentMission,
  getRecruitmentMissionCount,
  hasReachedAct6Threshold,
  hasReachedAct7Threshold,
} from "./armyRecruitment";

describe("armyRecruitment — RECRUITMENT_THRESHOLDS", () => {
  it("Act 6 requires 5 completed missions", () => {
    expect(RECRUITMENT_THRESHOLDS.act6).toBe(5);
  });

  it("Act 7 requires 15 completed missions", () => {
    expect(RECRUITMENT_THRESHOLDS.act7).toBe(15);
  });

  it("thresholds are monotonically increasing (Act 6 before Act 7)", () => {
    expect(RECRUITMENT_THRESHOLDS.act6).toBeLessThan(RECRUITMENT_THRESHOLDS.act7);
  });
});

describe("armyRecruitment — addCompletedRecruitmentMission", () => {
  it("appends a new mission id", () => {
    const next = addCompletedRecruitmentMission([], "mission-a");
    expect(next).toEqual(["mission-a"]);
  });

  it("preserves existing entries when appending", () => {
    const next = addCompletedRecruitmentMission(
      ["mission-a", "mission-b"],
      "mission-c",
    );
    expect(next).toEqual(["mission-a", "mission-b", "mission-c"]);
  });

  it("is idempotent on duplicate ids", () => {
    const next = addCompletedRecruitmentMission(
      ["mission-a", "mission-b"],
      "mission-a",
    );
    expect(next).toEqual(["mission-a", "mission-b"]);
  });

  it("returns a new array (does not mutate input)", () => {
    const input = ["mission-a"];
    const next = addCompletedRecruitmentMission(input, "mission-b");
    expect(next).not.toBe(input);
    expect(input).toEqual(["mission-a"]);
  });

  it("returns a copy even when the id is a duplicate (callers never share identity with input)", () => {
    const input = ["mission-a"];
    const next = addCompletedRecruitmentMission(input, "mission-a");
    expect(next).not.toBe(input);
    expect(next).toEqual(["mission-a"]);
  });

  it("ignores empty/falsy mission ids", () => {
    const input = ["mission-a"];
    expect(addCompletedRecruitmentMission(input, "")).toEqual(["mission-a"]);
  });
});

describe("armyRecruitment — getRecruitmentMissionCount", () => {
  it("returns list length", () => {
    expect(
      getRecruitmentMissionCount({
        armyRecruitmentMissionsCompleted: ["a", "b", "c"],
      }),
    ).toBe(3);
  });

  it("handles empty array", () => {
    expect(
      getRecruitmentMissionCount({ armyRecruitmentMissionsCompleted: [] }),
    ).toBe(0);
  });

  it("handles missing/null/undefined without throwing", () => {
    expect(getRecruitmentMissionCount({})).toBe(0);
    expect(
      getRecruitmentMissionCount({ armyRecruitmentMissionsCompleted: null }),
    ).toBe(0);
  });
});

describe("armyRecruitment — threshold predicates", () => {
  it("Act 6 threshold fires at 5", () => {
    expect(hasReachedAct6Threshold(4)).toBe(false);
    expect(hasReachedAct6Threshold(5)).toBe(true);
    expect(hasReachedAct6Threshold(20)).toBe(true);
  });

  it("Act 7 threshold fires at 15", () => {
    expect(hasReachedAct7Threshold(14)).toBe(false);
    expect(hasReachedAct7Threshold(15)).toBe(true);
    expect(hasReachedAct7Threshold(100)).toBe(true);
  });

  it("Act 7 passing implies Act 6 passing", () => {
    // Structural guarantee — if the numbers are ever reordered
    // this catches the drift.
    for (const n of [0, 5, 10, 15, 20]) {
      if (hasReachedAct7Threshold(n)) {
        expect(hasReachedAct6Threshold(n)).toBe(true);
      }
    }
  });
});
