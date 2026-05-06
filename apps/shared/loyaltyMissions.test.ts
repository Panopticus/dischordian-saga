import { describe, it, expect } from "vitest";
import {
  LOYALTY_MISSIONS,
  activeStage,
  getLoyaltyMission,
  isLoyaltyComplete,
  stageStatus,
} from "./loyaltyMissions";

describe("LOYALTY_MISSIONS — invariants", () => {
  it("ships at least 3 seed missions", () => {
    expect(LOYALTY_MISSIONS.length).toBeGreaterThanOrEqual(3);
  });

  it("every chain has exactly one final stage matching its loyaltyFlag", () => {
    for (const m of LOYALTY_MISSIONS) {
      const last = m.stages[m.stages.length - 1];
      expect(last.completionFlag).toBe(m.loyaltyFlag);
    }
  });

  it("stages are 1-indexed in declaration order", () => {
    for (const m of LOYALTY_MISSIONS) {
      m.stages.forEach((s, i) => expect(s.index).toBe(i + 1));
    }
  });
});

describe("stageStatus", () => {
  const locke = getLoyaltyMission("adjudicator_locke")!;
  const stage1 = locke.stages[0];

  it("locked when bond not met", () => {
    expect(stageStatus(stage1, { flags: { trade_empire_unlocked: true }, bondLevel: 5 })).toBe("locked");
  });

  it("locked when required flags not met", () => {
    expect(stageStatus(stage1, { flags: {}, bondLevel: 50 })).toBe("locked");
  });

  it("available when all gates met and not yet complete", () => {
    expect(
      stageStatus(stage1, { flags: { trade_empire_unlocked: true }, bondLevel: 50 }),
    ).toBe("available");
  });

  it("complete once the completion flag is set", () => {
    expect(
      stageStatus(stage1, {
        flags: { trade_empire_unlocked: true, loyalty_locke_stage_1: true },
        bondLevel: 50,
      }),
    ).toBe("complete");
  });
});

describe("activeStage", () => {
  const locke = getLoyaltyMission("adjudicator_locke")!;

  it("returns the first available stage", () => {
    const out = activeStage(locke, {
      flags: { trade_empire_unlocked: true },
      bondLevel: 50,
    });
    expect(out?.id).toBe("locke_1_inquiry");
  });

  it("advances to stage 2 once stage 1 is complete", () => {
    const out = activeStage(locke, {
      flags: { trade_empire_unlocked: true, loyalty_locke_stage_1: true },
      bondLevel: 50,
    });
    expect(out?.id).toBe("locke_2_meeting");
  });

  it("returns null once chain is fully complete", () => {
    const out = activeStage(locke, {
      flags: {
        trade_empire_unlocked: true,
        loyalty_locke_stage_1: true,
        loyalty_locke_stage_2: true,
        loyalty_locke_complete: true,
      },
      bondLevel: 50,
    });
    expect(out).toBeNull();
  });
});

describe("isLoyaltyComplete", () => {
  it("true when the loyalty flag is set", () => {
    expect(isLoyaltyComplete("adjudicator_locke", { loyalty_locke_complete: true })).toBe(true);
  });

  it("false otherwise", () => {
    expect(isLoyaltyComplete("adjudicator_locke", {})).toBe(false);
  });
});
