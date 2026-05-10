import { describe, expect, it } from "vitest";
import {
  HUMAN_REVEAL_BRANCH_RESOLVED_FLAG,
  humanRevealSeenFlag,
  humanRevealTriggerFlag,
  pickHumanRevealBranchToFire,
} from "@/hooks/useHumanRevealTrigger";

describe("pickHumanRevealBranchToFire", () => {
  it("returns null pre-Act-6 even with branch flags set", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 5,
        flags: { breaking_point_chose_elara: true },
      }),
    ).toBeNull();
  });

  it("fires fragment when act 6+ AND breaking_point_chose_elara", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 6,
        flags: { breaking_point_chose_elara: true },
      }),
    ).toBe("fragment");
  });

  it("fires full when act 6+ AND breaking_point_chose_human", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 7,
        flags: { breaking_point_chose_human: true },
      }),
    ).toBe("full");
  });

  it("fires ghost when act 6+ AND breaking_point_refused", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 6,
        flags: { breaking_point_refused: true },
      }),
    ).toBe("ghost");
  });

  it("convergence wins over breaking-point flags when in Act 6+", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 6,
        flags: {
          living_universe_event_convergence_threshold_active: true,
          breaking_point_chose_elara: true,
        },
      }),
    ).toBe("convergence");
  });

  it("act_6_started flag also gates Act 6+ even if narrativeAct field stale", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 0,
        flags: {
          act_6_started: true,
          breaking_point_chose_elara: true,
        },
      }),
    ).toBe("fragment");
  });

  it("returns null when human_reveal_branch_resolved is set", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 7,
        flags: {
          [HUMAN_REVEAL_BRANCH_RESOLVED_FLAG]: true,
          breaking_point_chose_elara: true,
        },
      }),
    ).toBeNull();
  });

  it("returns null when any branch's seen flag is set", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 7,
        flags: {
          [humanRevealSeenFlag("ghost")]: true,
          breaking_point_chose_elara: true,
        },
      }),
    ).toBeNull();
  });

  it("returns null when the trigger is already set (no redundant re-fires)", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 7,
        flags: {
          breaking_point_chose_elara: true,
          [humanRevealTriggerFlag("fragment")]: true,
        },
      }),
    ).toBeNull();
  });

  it("returns null when no gating flags are set", () => {
    expect(
      pickHumanRevealBranchToFire({
        narrativeAct: 7,
        flags: {},
      }),
    ).toBeNull();
  });

  it("flag-name conventions round-trip", () => {
    expect(humanRevealTriggerFlag("convergence")).toBe(
      "cutscene_human_reveal_convergence_triggered",
    );
    expect(humanRevealSeenFlag("ghost")).toBe(
      "cutscene_human_reveal_ghost_seen",
    );
  });
});
