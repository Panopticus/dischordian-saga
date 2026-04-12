import { describe, it, expect } from "vitest";
import {
  shouldTriggerBreakingPoint,
  resolveBreakingPoint,
  getBreakingPointPrompt,
  DEFAULT_BREAKING_POINT,
  BREAKING_POINT_OPTIONS,
  type BreakingPointState,
  type TriggerContext,
} from "./breakingPoint";

const baseContext: TriggerContext = {
  elaraTrust: 50,
  humanTrust: 50,
  moralityScore: 0,
  hasWitnessedFirstThreshold: true,
  corruptionLevel: 0,
  currentEpoch: 1,
};

describe("breakingPoint", () => {
  describe("shouldTriggerBreakingPoint", () => {
    it("does not trigger if already triggered", () => {
      const state: BreakingPointState = { triggered: true, chosen: null, triggeredAt: 0 };
      expect(shouldTriggerBreakingPoint(state, baseContext)).toBe(false);
    });

    it("does not trigger before first Threshold", () => {
      const ctx = { ...baseContext, hasWitnessedFirstThreshold: false };
      expect(shouldTriggerBreakingPoint(DEFAULT_BREAKING_POINT, ctx)).toBe(false);
    });

    it("triggers on trust divergence — Elara dominant", () => {
      const ctx = { ...baseContext, elaraTrust: 70, humanTrust: 30 };
      expect(shouldTriggerBreakingPoint(DEFAULT_BREAKING_POINT, ctx)).toBe(true);
    });

    it("triggers on trust divergence — Human dominant", () => {
      const ctx = { ...baseContext, elaraTrust: 30, humanTrust: 70 };
      expect(shouldTriggerBreakingPoint(DEFAULT_BREAKING_POINT, ctx)).toBe(true);
    });

    it("triggers on high corruption + Human trust", () => {
      const ctx = { ...baseContext, corruptionLevel: 2, humanTrust: 60 };
      expect(shouldTriggerBreakingPoint(DEFAULT_BREAKING_POINT, ctx)).toBe(true);
    });

    it("does not trigger when balanced", () => {
      const ctx = { ...baseContext, elaraTrust: 55, humanTrust: 50, corruptionLevel: 0 };
      expect(shouldTriggerBreakingPoint(DEFAULT_BREAKING_POINT, ctx)).toBe(false);
    });
  });

  describe("resolveBreakingPoint", () => {
    it("save_elara removes Human and locks Elara bond", () => {
      const outcome = resolveBreakingPoint("save_elara");
      expect(outcome.remainingCompanion).toBe("elara");
      expect(outcome.lostCompanion).toBe("human");
      expect(outcome.elaraTrustOverride).toBe(100);
      expect(outcome.humanTrustOverride).toBe(0);
      expect(outcome.moralityShift).toBeGreaterThan(0);
      expect(outcome.flags).toContain("breaking_point_chose_elara");
      expect(outcome.flags).toContain("human_severed");
    });

    it("save_human removes Elara and locks Human bond", () => {
      const outcome = resolveBreakingPoint("save_human");
      expect(outcome.remainingCompanion).toBe("human");
      expect(outcome.lostCompanion).toBe("elara");
      expect(outcome.humanTrustOverride).toBe(100);
      expect(outcome.elaraTrustOverride).toBe(0);
      expect(outcome.moralityShift).toBeLessThan(0);
      expect(outcome.flags).toContain("breaking_point_chose_human");
      expect(outcome.flags).toContain("elara_severed");
    });

    it("refuse keeps both but damages trust", () => {
      const outcome = resolveBreakingPoint("refuse");
      expect(outcome.remainingCompanion).toBe("neither");
      expect(outcome.lostCompanion).toBeNull();
      expect(outcome.elaraTrustOverride).toBe(40);
      expect(outcome.humanTrustOverride).toBe(40);
      expect(outcome.flags).toContain("breaking_point_refused");
    });

    it("all outcomes include an epilogue consequence", () => {
      for (const choice of ["save_elara", "save_human", "refuse"] as const) {
        const outcome = resolveBreakingPoint(choice);
        expect(outcome.epilogueConsequence.length).toBeGreaterThan(50);
      }
    });
  });

  describe("prompt + options", () => {
    it("prompt varies based on dominant companion", () => {
      const elaraDominant = getBreakingPointPrompt({ ...baseContext, elaraTrust: 70, humanTrust: 30 });
      const humanDominant = getBreakingPointPrompt({ ...baseContext, elaraTrust: 30, humanTrust: 70 });
      expect(elaraDominant).not.toBe(humanDominant);
    });

    it("has 3 options all marked legendary rarity", () => {
      expect(BREAKING_POINT_OPTIONS).toHaveLength(3);
      for (const opt of BREAKING_POINT_OPTIONS) {
        expect(opt.rarity).toBe("legendary");
        expect(opt.label).toBeTruthy();
        expect(opt.description).toBeTruthy();
      }
    });
  });
});
