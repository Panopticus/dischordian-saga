import { describe, it, expect } from "vitest";
import {
  generateDailyDecision,
  computeDeathProbability,
  rollForDeath,
  TRIAL_LENGTH_DAYS,
  DEATH_GRACE_DAYS,
  DEATH_PROBABILITY_BASE,
} from "./celebrationTrial";

describe("celebrationTrial", () => {
  describe("constants", () => {
    it("trial is 28 days", () => {
      expect(TRIAL_LENGTH_DAYS).toBe(28);
    });
    it("grace is 2 days", () => {
      expect(DEATH_GRACE_DAYS).toBe(2);
    });
  });

  describe("computeDeathProbability", () => {
    it("returns 0 when within grace period", () => {
      expect(computeDeathProbability(0)).toBe(0);
      expect(computeDeathProbability(1)).toBe(0);
      expect(computeDeathProbability(2)).toBe(0);
    });

    it("returns base probability at 3 missed days (1 past grace)", () => {
      const p = computeDeathProbability(3);
      expect(p).toBeGreaterThanOrEqual(DEATH_PROBABILITY_BASE);
      expect(p).toBeLessThanOrEqual(1);
    });

    it("increases with each additional missed day", () => {
      const p3 = computeDeathProbability(3);
      const p4 = computeDeathProbability(4);
      const p5 = computeDeathProbability(5);
      expect(p4).toBeGreaterThan(p3);
      expect(p5).toBeGreaterThan(p4);
    });

    it("caps at 1.0", () => {
      expect(computeDeathProbability(100)).toBe(1);
    });

    it("adds currentDayChance to missed-day probability", () => {
      const withHazard = computeDeathProbability(0, 0.2);
      expect(withHazard).toBe(0.2);
    });
  });

  describe("rollForDeath", () => {
    it("returns boolean", () => {
      expect(typeof rollForDeath(0, 0)).toBe("boolean");
    });

    it("never triggers death when probability is 0", () => {
      for (let i = 0; i < 100; i++) {
        expect(rollForDeath(0, 0)).toBe(false);
      }
    });

    it("always triggers death when probability is 1", () => {
      for (let i = 0; i < 100; i++) {
        expect(rollForDeath(100, 1)).toBe(true);
      }
    });
  });

  describe("generateDailyDecision", () => {
    it("returns a decision with prompt + options", () => {
      const d = generateDailyDecision(1);
      expect(d.prompt).toBeTruthy();
      expect(d.options).toBeInstanceOf(Array);
      expect(d.options.length).toBeGreaterThanOrEqual(2);
      expect(d.mascoteerId).toBeTruthy();
    });

    it("each option has outcome deltas", () => {
      const d = generateDailyDecision(5);
      for (const opt of d.options) {
        expect(opt.id).toBeTruthy();
        expect(opt.label).toBeTruthy();
        expect(opt.description).toBeTruthy();
        expect(opt.outcome.bondDelta).toBeTypeOf("number");
        expect(opt.outcome.corruptionDelta).toBeTypeOf("number");
        expect(opt.outcome.moralityDelta).toBeTypeOf("number");
        expect(opt.outcome.resultFlavor).toBeTruthy();
      }
    });

    it("is deterministic for same day + seed", () => {
      const d1 = generateDailyDecision(5, 42);
      const d2 = generateDailyDecision(5, 42);
      expect(d1.mascoteerId).toBe(d2.mascoteerId);
      expect(d1.options[0].id).toBe(d2.options[0].id);
    });

    it("different days produce different decisions (usually)", () => {
      const d1 = generateDailyDecision(1, 42);
      const d10 = generateDailyDecision(10, 42);
      // Not strictly guaranteed but probabilistically almost always different
      const allSame = d1.mascoteerId === d10.mascoteerId && d1.options[0].id === d10.options[0].id;
      expect(allSame).toBe(false);
    });

    it("day number matches input", () => {
      const d = generateDailyDecision(15);
      expect(d.day).toBe(15);
    });
  });
});
