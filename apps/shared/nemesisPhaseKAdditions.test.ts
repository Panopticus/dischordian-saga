/* Tests for additional Phase K helpers across multiple files:
   - K1.1: pickNextPlanKindWeighted (nemesisPlans.ts)
   - K2:   GLOBAL_ACTIVE_PLAN_CEILING + canSpawnAdditionalPlan
           + decidePromotion (nemesisPlans.ts)
   - K8.1: evaluateRecruitEligibility + rollRecruit
           (nemesisRecruitEligibility.ts) */
import { describe, expect, it } from "vitest";
import {
  pickNextPlanKindWeighted,
  GLOBAL_ACTIVE_PLAN_CEILING,
  canSpawnAdditionalPlan,
  decidePromotion,
  PROMOTION_THRESHOLD_PLAN_SUCCESSES,
  type NemesisPlanKind,
} from "./nemesisPlans";
import {
  evaluateRecruitEligibility,
  rollRecruit,
  BASE_RECRUIT_RATE,
  APPRENTICE_BETRAYAL_RECRUIT_RATE,
  RECRUIT_RATE_CEILING,
} from "./nemesisRecruitEligibility";

describe("pickNextPlanKindWeighted (K1.1)", () => {
  it("returns null for empty eligibleKinds", () => {
    expect(
      pickNextPlanKindWeighted({
        eligibleKinds: [],
        archetypeWeights: {},
        rng01: 0.5,
      }),
    ).toBeNull();
  });

  it("uniform-weighted: rng=0 picks first, rng=0.99 picks last", () => {
    const kinds: NemesisPlanKind[] = ["trade_route_sabotage", "casino_odds_rigging", "hub_smear_campaign"];
    const first = pickNextPlanKindWeighted({ eligibleKinds: kinds, archetypeWeights: {}, rng01: 0 });
    const last = pickNextPlanKindWeighted({ eligibleKinds: kinds, archetypeWeights: {}, rng01: 0.99 });
    expect(first).toBe("trade_route_sabotage");
    expect(last).toBe("hub_smear_campaign");
  });

  it("heavily-weighted preference dominates the distribution", () => {
    const kinds: NemesisPlanKind[] = ["trade_route_sabotage", "casino_odds_rigging"];
    // weights: trade=10, casino=1 → trade should be picked at rng < 10/11 ≈ 0.91
    const out = pickNextPlanKindWeighted({
      eligibleKinds: kinds,
      archetypeWeights: { trade_route_sabotage: 10 },
      rng01: 0.5,
    });
    expect(out).toBe("trade_route_sabotage");
  });

  it("zero-weight kind is never picked when others have positive weight", () => {
    const kinds: NemesisPlanKind[] = ["trade_route_sabotage", "casino_odds_rigging"];
    // trade=0, casino=1 → all RNG values should pick casino
    for (let r = 0; r < 1; r += 0.1) {
      const out = pickNextPlanKindWeighted({
        eligibleKinds: kinds,
        archetypeWeights: { trade_route_sabotage: 0 },
        rng01: r,
      });
      expect(out).toBe("casino_odds_rigging");
    }
  });
});

describe("Global plan ceiling + canSpawnAdditionalPlan (K2)", () => {
  it("ceiling is 12", () => {
    expect(GLOBAL_ACTIVE_PLAN_CEILING).toBe(12);
  });
  it("returns true under the ceiling", () => {
    expect(canSpawnAdditionalPlan(11)).toBe(true);
  });
  it("returns false at or above the ceiling", () => {
    expect(canSpawnAdditionalPlan(12)).toBe(false);
    expect(canSpawnAdditionalPlan(15)).toBe(false);
  });
});

describe("decidePromotion (K2 lieutenant promotion)", () => {
  it("does not promote when no Nemesis meets the success threshold", () => {
    const decision = decidePromotion([
      { nemesisId: "n1", rank: 3, planSuccessCount: 1, isLieutenant: false, retired: false },
      { nemesisId: "n2", rank: 2, planSuccessCount: 0, isLieutenant: false, retired: false },
    ]);
    expect(decision.promote).toBe(false);
  });

  it("promotes the most-successful Nemesis when threshold is met", () => {
    const decision = decidePromotion([
      { nemesisId: "n1", rank: 5, planSuccessCount: 1, isLieutenant: false, retired: false },
      { nemesisId: "n2", rank: 3, planSuccessCount: PROMOTION_THRESHOLD_PLAN_SUCCESSES, isLieutenant: false, retired: false },
    ]);
    expect(decision.promote).toBe(true);
    expect(decision.candidateNemesisId).toBe("n2");
    expect(decision.underNemesisId).toBe("n1"); // n1 has higher rank
  });

  it("doesn't pick a retired Nemesis as either candidate or commander", () => {
    const decision = decidePromotion([
      { nemesisId: "n1", rank: 5, planSuccessCount: 5, isLieutenant: false, retired: true },
      { nemesisId: "n2", rank: 3, planSuccessCount: 4, isLieutenant: false, retired: false },
      { nemesisId: "n3", rank: 4, planSuccessCount: 0, isLieutenant: false, retired: false },
    ]);
    expect(decision.promote).toBe(true);
    expect(decision.candidateNemesisId).toBe("n2");
    expect(decision.underNemesisId).toBe("n3");
  });

  it("does not promote when there's no commander to serve under", () => {
    const decision = decidePromotion([
      { nemesisId: "solo", rank: 5, planSuccessCount: 10, isLieutenant: false, retired: false },
    ]);
    expect(decision.promote).toBe(false);
  });

  it("doesn't re-promote an existing lieutenant", () => {
    const decision = decidePromotion([
      { nemesisId: "n1", rank: 5, planSuccessCount: 0, isLieutenant: false, retired: false },
      { nemesisId: "lt", rank: 3, planSuccessCount: 10, isLieutenant: true, retired: false },
    ]);
    expect(decision.promote).toBe(false);
  });
});

describe("evaluateRecruitEligibility (K8.1)", () => {
  it("base rate is 8% when apprentice has not betrayed", () => {
    const r = evaluateRecruitEligibility({
      playerArchetype: "ghost",
      nemesisArchetype: "ghost",
      hasApprenticeBetrayed: false,
      mercyFlagsAtHighGrudge: 0,
      politicianTicDecodedCount: 0,
    });
    // Ghost vs Ghost: recruit affinity is 9 (≥8), so ×1.5 applies.
    // base 0.08 × 1.5 = 0.12
    expect(r.baseRate).toBe(BASE_RECRUIT_RATE);
    expect(r.modifiers.archetypeCompatibilityBonus).toBe(1.5);
    expect(r.finalRate).toBeCloseTo(0.12);
  });

  it("base rate is 35% when apprentice HAS betrayed", () => {
    const r = evaluateRecruitEligibility({
      playerArchetype: "scholar",
      nemesisArchetype: "scholar",
      hasApprenticeBetrayed: true,
      mercyFlagsAtHighGrudge: 0,
      politicianTicDecodedCount: 0,
    });
    expect(r.baseRate).toBe(APPRENTICE_BETRAYAL_RECRUIT_RATE);
    // Scholar vs Scholar: affinity 9 → ×1.5. 0.35 × 1.5 = 0.525
    expect(r.finalRate).toBeCloseTo(0.525);
  });

  it("max-modifier path caps at the ceiling (60%)", () => {
    const r = evaluateRecruitEligibility({
      playerArchetype: "heretic",
      nemesisArchetype: "heretic", // affinity 9 → ×1.5
      hasApprenticeBetrayed: true, // base 0.35
      mercyFlagsAtHighGrudge: 5, // ≥3 → ×2.0
      politicianTicDecodedCount: 8, // ≥6 → ×1.2
    });
    // 0.35 × 1.5 × 2.0 × 1.2 = 1.26 → capped to 0.60
    expect(r.finalRate).toBe(RECRUIT_RATE_CEILING);
    expect(r.rationale).toContain("capped");
  });

  it("low-compatibility pairing doesn't apply the compat bonus", () => {
    const r = evaluateRecruitEligibility({
      playerArchetype: "zealot",
      nemesisArchetype: "ghost", // ghost-vs-zealot has low affinity (default 3)
      hasApprenticeBetrayed: false,
      mercyFlagsAtHighGrudge: 0,
      politicianTicDecodedCount: 0,
    });
    expect(r.modifiers.archetypeCompatibilityBonus).toBe(1.0);
    expect(r.finalRate).toBe(BASE_RECRUIT_RATE);
  });

  it("rationale string includes all the inputs and final rate", () => {
    const r = evaluateRecruitEligibility({
      playerArchetype: "jester",
      nemesisArchetype: "ghost",
      hasApprenticeBetrayed: false,
      mercyFlagsAtHighGrudge: 1,
      politicianTicDecodedCount: 2,
    });
    expect(r.rationale).toMatch(/base=0\.08/);
    expect(r.rationale).toMatch(/compat=/);
    expect(r.rationale).toMatch(/mercy=/);
    expect(r.rationale).toMatch(/tics=/);
  });
});

describe("rollRecruit (K8.2 hook)", () => {
  it("succeeds when rng < finalRate", () => {
    const r = evaluateRecruitEligibility({
      playerArchetype: "heretic",
      nemesisArchetype: "heretic",
      hasApprenticeBetrayed: true,
      mercyFlagsAtHighGrudge: 5,
      politicianTicDecodedCount: 8,
    });
    expect(rollRecruit(r, 0.3)).toBe(true);
  });

  it("fails when rng >= finalRate", () => {
    const r = evaluateRecruitEligibility({
      playerArchetype: "ghost",
      nemesisArchetype: "ghost",
      hasApprenticeBetrayed: false,
      mercyFlagsAtHighGrudge: 0,
      politicianTicDecodedCount: 0,
    });
    expect(rollRecruit(r, 0.99)).toBe(false);
  });
});
