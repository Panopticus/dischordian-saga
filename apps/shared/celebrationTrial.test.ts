import { describe, it, expect } from "vitest";
import {
  generateDailyDecision,
  computeDeathProbability,
  rollForDeath,
  computeTrialPacing,
  summarizeTrial,
  trialToCombatBuff,
  MASCOTEER_DECISIONS,
  DAY_MS,
  TRIAL_LENGTH_DAYS,
  DEATH_GRACE_DAYS,
  DEATH_PROBABILITY_BASE,
  type TrialHistoryEntry,
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

  describe("MASCOTEER_DECISIONS coverage", () => {
    const EXPECTED_MASCOTEERS = [
      "the_conductor", "mr_unblink", "little_corey", "vernon", "minnie",
      "wanda_wee", "senator_sprout", "wayne", "gary", "thazu",
      "the_prince", "the_seeker_child",
    ];

    it("has all 12 canonical Mascoteers", () => {
      for (const id of EXPECTED_MASCOTEERS) {
        expect(MASCOTEER_DECISIONS[id]).toBeDefined();
      }
      expect(Object.keys(MASCOTEER_DECISIONS).sort()).toEqual([...EXPECTED_MASCOTEERS].sort());
    });

    it("each Mascoteer has at least 2 decisions so the 28-day trial doesn't loop on one prompt", () => {
      for (const [id, decisions] of Object.entries(MASCOTEER_DECISIONS)) {
        expect(decisions.length, `${id} decision count`).toBeGreaterThanOrEqual(2);
      }
    });

    it("every decision option has 3 options with outcome deltas", () => {
      for (const [id, decisions] of Object.entries(MASCOTEER_DECISIONS)) {
        for (const d of decisions) {
          expect(d.options.length, `${id}/${d.id} option count`).toBe(3);
          for (const opt of d.options) {
            expect(opt.id).toBeTruthy();
            expect(opt.label).toBeTruthy();
            expect(opt.description).toBeTruthy();
            expect(opt.outcome.resultFlavor).toBeTruthy();
          }
        }
      }
    });
  });

  describe("computeTrialPacing", () => {
    it("returns day 1 on the day of recruitment", () => {
      const recruited = 1_000_000_000;
      const p = computeTrialPacing(recruited, 1, recruited);
      expect(p.expectedDay).toBe(1);
      expect(p.missedDays).toBe(0);
      expect(p.graduatedByTime).toBe(false);
    });

    it("advances one expected day per real day", () => {
      const recruited = 1_000_000_000;
      const p = computeTrialPacing(recruited, 1, recruited + 3 * DAY_MS);
      expect(p.expectedDay).toBe(4);
      expect(p.missedDays).toBe(3);
    });

    it("caps expectedDay at TRIAL_LENGTH_DAYS + 1 and flags graduation", () => {
      const recruited = 1_000_000_000;
      const p = computeTrialPacing(recruited, 1, recruited + 500 * DAY_MS);
      expect(p.expectedDay).toBe(TRIAL_LENGTH_DAYS + 1);
      expect(p.graduatedByTime).toBe(true);
    });

    it("never reports negative missed days when ahead of schedule", () => {
      const recruited = 1_000_000_000;
      const p = computeTrialPacing(recruited, 5, recruited + 1 * DAY_MS);
      expect(p.missedDays).toBe(0);
    });
  });

  describe("summarizeTrial", () => {
    const mk = (over: Partial<TrialHistoryEntry> = {}): TrialHistoryEntry => ({
      day: 1, mascoteerId: "the_conductor", decisionId: "conductor_1", optionId: "follow_tradition",
      bondDelta: 0, corruptionDelta: 0, moralityDelta: 0, ...over,
    });

    it("returns zeros for empty history", () => {
      const s = summarizeTrial([]);
      expect(s.totalBond).toBe(0);
      expect(s.totalCorruption).toBe(0);
      expect(s.totalMorality).toBe(0);
      expect(s.daysResolved).toBe(0);
      expect(s.avgBond).toBe(0);
      expect(s.favoredMascoteers).toEqual([]);
    });

    it("sums deltas and averages bond across resolved days", () => {
      const s = summarizeTrial([
        mk({ bondDelta: 4, corruptionDelta: 1, moralityDelta: 2 }),
        mk({ bondDelta: 6, corruptionDelta: -1, moralityDelta: 3 }),
      ]);
      expect(s.totalBond).toBe(10);
      expect(s.totalCorruption).toBe(0);
      expect(s.totalMorality).toBe(5);
      expect(s.avgBond).toBe(5);
      expect(s.daysResolved).toBe(2);
    });

    it("computes goodnessScore near 1 for righteous paths", () => {
      const s = summarizeTrial([
        mk({ moralityDelta: 5, corruptionDelta: -2 }),
        mk({ moralityDelta: 5, corruptionDelta: -2 }),
      ]);
      expect(s.goodnessScore).toBeGreaterThan(0.5);
    });

    it("computes goodnessScore near 0 for corrupted paths", () => {
      const s = summarizeTrial([
        mk({ moralityDelta: -5, corruptionDelta: 5 }),
        mk({ moralityDelta: -5, corruptionDelta: 5 }),
      ]);
      expect(s.goodnessScore).toBeLessThan(0.5);
    });

    it("sorts favoredMascoteers by cumulative bond descending", () => {
      const s = summarizeTrial([
        mk({ mascoteerId: "vernon", bondDelta: 2 }),
        mk({ mascoteerId: "the_prince", bondDelta: 10 }),
        mk({ mascoteerId: "the_prince", bondDelta: 5 }),
        mk({ mascoteerId: "mr_unblink", bondDelta: -3 }),
      ]);
      expect(s.favoredMascoteers).toEqual(["the_prince", "vernon"]);
      expect(s.mascoteerBond.the_prince).toBe(15);
    });
  });

  describe("trialToCombatBuff", () => {
    it("emits light alignment for high-morality runs", () => {
      const s = summarizeTrial(Array.from({ length: 14 }, () => ({
        day: 1, mascoteerId: "the_seeker_child", decisionId: "d", optionId: "o",
        bondDelta: 5, corruptionDelta: 0, moralityDelta: 5,
      })));
      const buff = trialToCombatBuff(s);
      expect(buff.alignment).toBe("light");
      expect(buff.attackBonus).toBeGreaterThan(0);
    });

    it("emits dark alignment for high-corruption runs", () => {
      const s = summarizeTrial(Array.from({ length: 14 }, () => ({
        day: 1, mascoteerId: "mr_unblink", decisionId: "d", optionId: "o",
        bondDelta: 3, corruptionDelta: 5, moralityDelta: -5,
      })));
      const buff = trialToCombatBuff(s);
      expect(buff.alignment).toBe("dark");
    });

    it("clamps attack bonus to the [-10, 25] range", () => {
      const s = summarizeTrial([{
        day: 1, mascoteerId: "x", decisionId: "d", optionId: "o",
        bondDelta: 9999, corruptionDelta: 0, moralityDelta: 0,
      }]);
      expect(trialToCombatBuff(s).attackBonus).toBe(25);
    });
  });
});
