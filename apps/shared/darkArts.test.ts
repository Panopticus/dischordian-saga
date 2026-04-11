import { describe, it, expect } from "vitest";
import {
  getDarkTier,
  canAffordPurge,
  DARK_TIERS,
  PURGE_RITUALS,
} from "./darkArts";

describe("darkArts", () => {
  describe("getDarkTier", () => {
    it("returns 5 distinct tiers covering 0-100", () => {
      expect(DARK_TIERS).toHaveLength(5);
    });

    it("clean at 0-24", () => {
      expect(getDarkTier(0).id).toBe("clean");
      expect(getDarkTier(24).id).toBe("clean");
    });

    it("tainted at 25-49", () => {
      expect(getDarkTier(25).id).toBe("tainted");
      expect(getDarkTier(49).id).toBe("tainted");
    });

    it("corrupted at 50-74", () => {
      expect(getDarkTier(50).id).toBe("corrupted");
      expect(getDarkTier(74).id).toBe("corrupted");
    });

    it("consumed at 75-99", () => {
      expect(getDarkTier(75).id).toBe("consumed");
      expect(getDarkTier(99).id).toBe("consumed");
    });

    it("enemy at 100", () => {
      expect(getDarkTier(100).id).toBe("enemy");
    });

    it("clamps to clean at negative values", () => {
      expect(getDarkTier(-50).id).toBe("clean");
    });

    it("each tier has penalties and bonuses", () => {
      for (const tier of DARK_TIERS) {
        expect(tier.description).toBeTruthy();
        expect(tier.color).toBeTruthy();
        expect(Array.isArray(tier.penalties)).toBe(true);
        expect(Array.isArray(tier.bonuses)).toBe(true);
      }
    });

    it("higher tiers have more extreme penalties AND bonuses", () => {
      const clean = DARK_TIERS[0];
      const enemy = DARK_TIERS[4];
      expect(enemy.penalties.length).toBeGreaterThan(clean.penalties.length);
      expect(enemy.bonuses.length).toBeGreaterThan(clean.bonuses.length);
    });
  });

  describe("purge rituals", () => {
    it("has 4 rituals", () => {
      expect(PURGE_RITUALS).toHaveLength(4);
    });

    it("each ritual has cost + requirement + sacrifice", () => {
      for (const r of PURGE_RITUALS) {
        expect(r.corruptionReduction).toBeGreaterThan(0);
        expect(r.cost.dream).toBeGreaterThanOrEqual(0);
        expect(r.cost.xp).toBeGreaterThanOrEqual(0);
        expect(r.requires).toBeTruthy();
        expect(r.sacrifice).toBeTruthy();
      }
    });

    it("rituals ordered by corruption reduction (ascending)", () => {
      for (let i = 1; i < PURGE_RITUALS.length; i++) {
        expect(PURGE_RITUALS[i].corruptionReduction).toBeGreaterThanOrEqual(
          PURGE_RITUALS[i - 1].corruptionReduction,
        );
      }
    });

    it("ultimate purge (Architect's Audit) removes 100 corruption", () => {
      const audit = PURGE_RITUALS.find(r => r.id === "architects_audit");
      expect(audit).toBeTruthy();
      expect(audit!.corruptionReduction).toBe(100);
    });

    it("canAffordPurge checks both dream AND xp", () => {
      const ritual = PURGE_RITUALS[0]; // 50 Dream, 500 XP
      expect(canAffordPurge(ritual, 50, 500)).toBe(true);
      expect(canAffordPurge(ritual, 49, 500)).toBe(false);
      expect(canAffordPurge(ritual, 50, 499)).toBe(false);
      expect(canAffordPurge(ritual, 100, 1000)).toBe(true);
    });
  });
});
