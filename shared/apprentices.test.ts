import { describe, it, expect } from "vitest";
import {
  generateApprentice,
  getArchetypeDef,
  getRarityTier,
  getActiveLoyaltyBonus,
  computeDailyCorruption,
  willBetray,
  isCorrupted,
  ARCHETYPES,
  RARITY_TIERS,
  type Apprentice,
  type Rarity,
} from "./apprentices";

describe("apprentices", () => {
  describe("generateApprentice", () => {
    it("creates an apprentice with a unique id", () => {
      const a = generateApprentice();
      const b = generateApprentice();
      expect(a.id).not.toBe(b.id);
      expect(a.id).toMatch(/^apprentice-\d+-\d+$/);
    });

    it("sets default stage to 'recruited' and alive true", () => {
      const a = generateApprentice();
      expect(a.stage).toBe("recruited");
      expect(a.alive).toBe(true);
      expect(a.trialDay).toBe(0);
      expect(a.missedDays).toBe(0);
      expect(a.bond).toBe(0);
    });

    it("honours forceArchetype option", () => {
      const a = generateApprentice({ forceArchetype: "zealot" });
      expect(a.archetype).toBe("zealot");
    });

    it("honours forceRarity option", () => {
      const a = generateApprentice({ forceRarity: "mythic" });
      expect(a.rarity).toBe("mythic");
    });

    it("honours name option", () => {
      const a = generateApprentice({ name: "Custom Name" });
      expect(a.name).toBe("Custom Name");
    });

    it("generates a backstory string", () => {
      const a = generateApprentice();
      expect(a.backstory.length).toBeGreaterThan(20);
    });

    it("applies rarity statBonus to all stats", () => {
      const common = generateApprentice({ forceRarity: "common" });
      const mythic = generateApprentice({ forceArchetype: common.archetype, forceRarity: "mythic" });
      // Mythic gets +25 to all stats vs common's +0
      // Variance is 0-2 per stat (class modifier) and 0-2 (random), so mythic strength should be ~23-29 higher than common
      const statSum = (a: Apprentice) =>
        a.stats.strength + a.stats.intelligence + a.stats.agility + a.stats.charisma;
      expect(statSum(mythic)).toBeGreaterThan(statSum(common));
    });

    it("produces evil apprentices at roughly 8% rate", () => {
      const sample = Array.from({ length: 500 }, () => generateApprentice());
      const evilCount = sample.filter(a => a.evilFromStart).length;
      // Expect 8% = 40 of 500 ± sampling variance
      expect(evilCount).toBeGreaterThan(15);
      expect(evilCount).toBeLessThan(80);
    });

    it("evil apprentices start with hidden corruption 10-25", () => {
      const sample = Array.from({ length: 200 }, () => generateApprentice());
      const evilOnes = sample.filter(a => a.evilFromStart);
      for (const a of evilOnes) {
        expect(a.corruption).toBeGreaterThanOrEqual(10);
        expect(a.corruption).toBeLessThanOrEqual(25);
        expect(a.hiddenMotive).toBeTruthy();
      }
    });

    it("non-evil apprentices start with 0 corruption", () => {
      const sample = Array.from({ length: 200 }, () => generateApprentice());
      const cleanOnes = sample.filter(a => !a.evilFromStart);
      for (const a of cleanOnes) {
        expect(a.corruption).toBe(0);
      }
    });
  });

  describe("getArchetypeDef", () => {
    it("returns archetype def for each of the 12 archetypes", () => {
      expect(ARCHETYPES).toHaveLength(12);
      for (const a of ARCHETYPES) {
        expect(getArchetypeDef(a.id)).toBe(a);
      }
    });

    it("throws on unknown archetype", () => {
      expect(() => getArchetypeDef("invalid" as any)).toThrow();
    });

    it("each archetype has all required fields", () => {
      for (const a of ARCHETYPES) {
        expect(a.name).toBeTruthy();
        expect(a.title).toBeTruthy();
        expect(a.personality).toBeTruthy();
        expect(a.voiceDirection).toBeTruthy();
        expect(a.primaryStat).toMatch(/^(strength|intelligence|agility|charisma)$/);
        expect(a.corruptionRisk).toBeGreaterThanOrEqual(0);
        expect(a.corruptionRisk).toBeLessThanOrEqual(1);
        expect(a.loyaltyBonus).toBeTruthy();
        expect(a.breakingPoint).toBeTruthy();
      }
    });
  });

  describe("getRarityTier", () => {
    it("returns each of the 5 rarity tiers", () => {
      expect(RARITY_TIERS).toHaveLength(5);
      expect(getRarityTier("common").name).toBe("Common");
      expect(getRarityTier("uncommon").name).toBe("Uncommon");
      expect(getRarityTier("rare").name).toBe("Rare");
      expect(getRarityTier("epic").name).toBe("Epic");
      expect(getRarityTier("mythic").name).toBe("Mythic");
    });

    it("weights sum to 100", () => {
      const totalWeight = RARITY_TIERS.reduce((s, t) => s + t.weight, 0);
      expect(totalWeight).toBe(100);
    });

    it("mythic has highest statBonus and loyaltyMultiplier", () => {
      const common = getRarityTier("common");
      const mythic = getRarityTier("mythic");
      expect(mythic.statBonus).toBeGreaterThan(common.statBonus);
      expect(mythic.loyaltyMultiplier).toBeGreaterThan(common.loyaltyMultiplier);
    });
  });

  describe("getActiveLoyaltyBonus", () => {
    const baseApp: Apprentice = {
      id: "a1", name: "Test", archetype: "zealot", gender: "female", race: "human",
      combatClass: "soldier", rarity: "common",
      stats: { strength: 10, intelligence: 10, agility: 10, charisma: 10 },
      bond: 0, corruption: 0, stage: "recruited", trialDay: 0, recruitedAt: 0,
      backstory: "", missedDays: 0, alive: true, evilFromStart: false,
    };

    it("returns null for recruited/training stages", () => {
      expect(getActiveLoyaltyBonus({ ...baseApp, stage: "recruited", bond: 90 })).toBeNull();
      expect(getActiveLoyaltyBonus({ ...baseApp, stage: "training", bond: 90 })).toBeNull();
    });

    it("returns null when bond < 40", () => {
      expect(getActiveLoyaltyBonus({ ...baseApp, stage: "companion", bond: 39 })).toBeNull();
    });

    it("returns null when corruption >= 50", () => {
      expect(getActiveLoyaltyBonus({ ...baseApp, stage: "companion", bond: 80, corruption: 50 })).toBeNull();
    });

    it("returns scaled bonus when loyal", () => {
      const bonus = getActiveLoyaltyBonus({ ...baseApp, stage: "companion", bond: 80, corruption: 0 });
      expect(bonus).not.toBeNull();
      expect(bonus?.target).toBe("faction_rep_gain"); // Zealot's bonus
      expect(bonus?.value).toBe(0.25 * 1.0); // common multiplier = 1.0
    });

    it("mythic scales loyalty bonus 2x", () => {
      const common = getActiveLoyaltyBonus({ ...baseApp, rarity: "common", stage: "companion", bond: 80 });
      const mythic = getActiveLoyaltyBonus({ ...baseApp, rarity: "mythic", stage: "companion", bond: 80 });
      expect(mythic!.value).toBe(common!.value * 2.0);
    });
  });

  describe("computeDailyCorruption", () => {
    const baseApp: Apprentice = {
      id: "a1", name: "Test", archetype: "zealot", gender: "female", race: "human",
      combatClass: "soldier", rarity: "common",
      stats: { strength: 10, intelligence: 10, agility: 10, charisma: 10 },
      bond: 0, corruption: 0, stage: "training", trialDay: 1, recruitedAt: 0,
      backstory: "", missedDays: 0, alive: true, evilFromStart: false,
    };

    it("0 morality pressure = low baseline corruption", () => {
      const c = computeDailyCorruption({ ...baseApp, evilFromStart: false }, 0);
      expect(c).toBe(0);
    });

    it("high morality distance increases corruption", () => {
      // Zealot has corruptionRisk 0.7
      const c = computeDailyCorruption({ ...baseApp, evilFromStart: false }, 100);
      expect(c).toBeGreaterThan(0);
    });

    it("evil apprentices always gain corruption", () => {
      const c = computeDailyCorruption({ ...baseApp, evilFromStart: true }, 0);
      expect(c).toBeGreaterThanOrEqual(1.5);
    });

    it("high bond protects low-risk archetypes", () => {
      // Artisan has corruptionRisk 0.2 (low)
      const artisan = { ...baseApp, archetype: "artisan" as const, bond: 100 };
      const noBond = { ...baseApp, archetype: "artisan" as const, bond: 0 };
      const cBonded = computeDailyCorruption(artisan, 100);
      const cUnbonded = computeDailyCorruption(noBond, 100);
      expect(cBonded).toBeLessThan(cUnbonded);
    });
  });

  describe("betrayal flags", () => {
    const baseApp: Apprentice = {
      id: "a1", name: "Test", archetype: "zealot", gender: "female", race: "human",
      combatClass: "soldier", rarity: "common",
      stats: { strength: 10, intelligence: 10, agility: 10, charisma: 10 },
      bond: 0, corruption: 0, stage: "companion", trialDay: 0, recruitedAt: 0,
      backstory: "", missedDays: 0, alive: true, evilFromStart: false,
    };

    it("willBetray triggers at 80+ corruption", () => {
      expect(willBetray({ ...baseApp, corruption: 79 })).toBe(false);
      expect(willBetray({ ...baseApp, corruption: 80 })).toBe(true);
      expect(willBetray({ ...baseApp, corruption: 100 })).toBe(true);
    });

    it("isCorrupted triggers at 100 corruption", () => {
      expect(isCorrupted({ ...baseApp, corruption: 99 })).toBe(false);
      expect(isCorrupted({ ...baseApp, corruption: 100 })).toBe(true);
    });
  });
});
