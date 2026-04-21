import { describe, expect, it } from "vitest";
import {
  classroomDepthToClimbRank,
  climbRankToClassroomDepth,
  climbTierClearedFlag,
  climbTierCompanionTrigger,
} from "./act2ClimbBridge";

describe("climbRankToClassroomDepth", () => {
  it("returns 0 when nothing cleared (rank -1)", () => {
    expect(climbRankToClassroomDepth(-1)).toBe(0);
  });
  it("maps Climb Tier 0 cleared → classroom depth 1", () => {
    expect(climbRankToClassroomDepth(0)).toBe(1);
  });
  it("maps Climb Tier 1 cleared → classroom depth 3", () => {
    expect(climbRankToClassroomDepth(1)).toBe(3);
  });
  it("maps Climb Tier 2 cleared → classroom depth 5", () => {
    expect(climbRankToClassroomDepth(2)).toBe(5);
  });
  it("maps Climb Tier 3 cleared → classroom depth 8", () => {
    expect(climbRankToClassroomDepth(3)).toBe(8);
  });
  it("clamps ranks above 3 to depth 8", () => {
    expect(climbRankToClassroomDepth(99)).toBe(8);
  });
});

describe("classroomDepthToClimbRank", () => {
  it("round-trips every canonical ZEPHYR_9_CLASSROOM depth", () => {
    expect(classroomDepthToClimbRank(0)).toBe(-1);
    expect(classroomDepthToClimbRank(1)).toBe(0);
    expect(classroomDepthToClimbRank(3)).toBe(1);
    expect(classroomDepthToClimbRank(5)).toBe(2);
    expect(classroomDepthToClimbRank(8)).toBe(3);
  });
  it("picks the highest rank the depth covers", () => {
    // Depth 4 is between tier-3 (rank 1) and tier-5 (rank 2).
    expect(classroomDepthToClimbRank(4)).toBe(1);
    expect(classroomDepthToClimbRank(7)).toBe(2);
  });
});

describe("climbTierCompanionTrigger / climbTierClearedFlag", () => {
  it("returns canonical strings for ranks 0–3", () => {
    expect(climbTierCompanionTrigger(0)).toBe("chess_climb_tier_0_won");
    expect(climbTierCompanionTrigger(3)).toBe("chess_climb_tier_3_won");
    expect(climbTierClearedFlag(0)).toBe("chess_climb_tier_0_cleared");
    expect(climbTierClearedFlag(3)).toBe("chess_climb_tier_3_cleared");
  });
  it("returns null for out-of-range ranks", () => {
    expect(climbTierCompanionTrigger(-1)).toBeNull();
    expect(climbTierCompanionTrigger(4)).toBeNull();
    expect(climbTierClearedFlag(-1)).toBeNull();
    expect(climbTierClearedFlag(4)).toBeNull();
  });
});
