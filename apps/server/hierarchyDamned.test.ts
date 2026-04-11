import { describe, expect, it } from "vitest";
import {
  DEFAULT_PROGRESS,
  DISCHORDIAN_ACHIEVEMENTS,
} from "../shared/gamification";

describe("Hierarchy of the Damned — Gamification Integration", () => {
  describe("DEFAULT_PROGRESS demon fields", () => {
    it("has demonKills initialized to 0", () => {
      expect(DEFAULT_PROGRESS.demonKills).toBe(0);
    });

    it("has hierarchyExplored initialized to false", () => {
      expect(DEFAULT_PROGRESS.hierarchyExplored).toBe(false);
    });

    it("has demonCardsCollected initialized to 0", () => {
      expect(DEFAULT_PROGRESS.demonCardsCollected).toBe(0);
    });
  });

  describe("Demon achievements exist", () => {
    it("has demon-slayer-1 achievement", () => {
      const ach = DISCHORDIAN_ACHIEVEMENTS.find(a => a.achievementId === "demon-slayer-1");
      expect(ach).toBeTruthy();
      expect(ach!.name).toBe("Demon Slayer");
      expect(ach!.condition.type).toBe("demon_kills");
      expect(ach!.condition.count).toBe(1);
      expect(ach!.tier).toBe("silver");
    });

    it("has demon-slayer-10 achievement", () => {
      const ach = DISCHORDIAN_ACHIEVEMENTS.find(a => a.achievementId === "demon-slayer-10");
      expect(ach).toBeTruthy();
      expect(ach!.name).toBe("Blood Weave Breaker");
      expect(ach!.condition.type).toBe("demon_kills");
      expect(ach!.condition.count).toBe(10);
      expect(ach!.tier).toBe("gold");
    });

    it("has demon-slayer-50 achievement", () => {
      const ach = DISCHORDIAN_ACHIEVEMENTS.find(a => a.achievementId === "demon-slayer-50");
      expect(ach).toBeTruthy();
      expect(ach!.name).toBe("Hierarchy's Bane");
      expect(ach!.condition.type).toBe("demon_kills");
      expect(ach!.condition.count).toBe(50);
      expect(ach!.tier).toBe("platinum");
    });

    it("has hierarchy-explorer achievement", () => {
      const ach = DISCHORDIAN_ACHIEVEMENTS.find(a => a.achievementId === "hierarchy-explorer");
      expect(ach).toBeTruthy();
      expect(ach!.name).toBe("Know Thy Enemy");
      expect(ach!.condition.type).toBe("hierarchy_explored");
      expect(ach!.tier).toBe("bronze");
    });

    it("has demon-card-collector achievement", () => {
      const ach = DISCHORDIAN_ACHIEVEMENTS.find(a => a.achievementId === "demon-card-collector");
      expect(ach).toBeTruthy();
      expect(ach!.name).toBe("Soul Collector");
      expect(ach!.condition.type).toBe("demon_cards");
      expect(ach!.condition.count).toBe(5);
      expect(ach!.tier).toBe("silver");
    });

    it("has demon-card-all achievement", () => {
      const ach = DISCHORDIAN_ACHIEVEMENTS.find(a => a.achievementId === "demon-card-all");
      expect(ach).toBeTruthy();
      expect(ach!.name).toBe("Master of the Damned");
      expect(ach!.condition.type).toBe("demon_cards");
      expect(ach!.condition.count).toBe(10);
      expect(ach!.tier).toBe("legendary");
    });
  });

  describe("All demon achievements have valid structure", () => {
    const demonAchievements = DISCHORDIAN_ACHIEVEMENTS.filter(
      a => a.achievementId.startsWith("demon-") || a.achievementId === "hierarchy-explorer"
    );

    it("has exactly 6 demon-related achievements", () => {
      expect(demonAchievements.length).toBe(6);
    });

    it("all demon achievements have unique IDs", () => {
      const ids = demonAchievements.map(a => a.achievementId);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all demon achievements have positive rewards", () => {
      for (const ach of demonAchievements) {
        expect(ach.xpReward + ach.pointsReward).toBeGreaterThan(0);
      }
    });

    it("all demon achievements have valid categories", () => {
      for (const ach of demonAchievements) {
        expect(["explore", "watch", "fight", "discover", "collect", "social", "master"]).toContain(ach.category);
      }
    });

    it("all demon achievements have valid tiers", () => {
      for (const ach of demonAchievements) {
        expect(["bronze", "silver", "gold", "platinum", "legendary"]).toContain(ach.tier);
      }
    });
  });

  describe("Total achievements integrity", () => {
    it("all achievement IDs remain unique after adding demon achievements", () => {
      const ids = DISCHORDIAN_ACHIEVEMENTS.map(a => a.achievementId);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("has at least 26 achievements total (20 original + 6 demon)", () => {
      expect(DISCHORDIAN_ACHIEVEMENTS.length).toBeGreaterThanOrEqual(26);
    });
  });
});
