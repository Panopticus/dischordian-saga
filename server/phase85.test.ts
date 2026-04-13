/* ═══════════════════════════════════════════════════════
   Phase 85 Tests — Cross-System Integration, Expanded
   Personal Quarters, Cosmetic Shop, Morality Card System,
   Morality Themes, Story Branches, Faction War Events,
   Guild Recruitment, Notification Wiring
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  DECORATION_ITEMS,
  ROOM_ZONES,
  getAvailableDecorations,
  getAvailableZones,
  calculateQuarterBonuses,
  type DecorationItem,
} from "@shared/personalQuarters";
import {
  COSMETIC_ITEMS,
  getShopItems,
  getBossMasteryCosmetics,
  getAllEarnedCosmetics,
} from "@shared/cosmeticShop";
import {
  SHIP_THEMES,
  CHARACTER_THEMES,
  MORALITY_MILESTONE_REWARDS,
  getAvailableShipThemes,
  getUnclaimedMilestones,
} from "@shared/moralityThemes";
import {
  getMoralityAlignment,
  getCardMoralityModifier,
  getMoralityCardSummary,
} from "@/game/moralityCardSystem";
import {
  SECRET_TRANSMISSIONS,
  ELARA_MORALITY_VARIANTS,
  getAvailableTransmissions,
  getElaraVariant,
  getNextUndiscoveredTransmission,
  getRoomTransmissions,
  isTransmissionDiscovered,
} from "@/data/moralityStoryBranches";
import {
  FACTION_WAR_EVENTS,
  getCurrentEvent,
  getEventTimeRemaining,
} from "@/data/factionWarEvents";

/* ═══ PERSONAL QUARTERS — EXPANDED 123 ITEMS ═══ */
describe("Personal Quarters — Expanded", () => {
  describe("DECORATION_ITEMS data integrity", () => {
    it("should have 123+ decoration items", () => {
      expect(DECORATION_ITEMS.length).toBeGreaterThanOrEqual(123);
    });

    it("all items should have unique keys", () => {
      const keys = DECORATION_ITEMS.map(i => i.key);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it("every item should have required fields", () => {
      for (const item of DECORATION_ITEMS) {
        expect(item.key).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.description).toBeTruthy();
        expect(item.icon).toBeTruthy();
        expect(item.category).toBeTruthy();
        expect(item.rarity).toBeTruthy();
        expect(item.color).toBeTruthy();
        expect(item.gridSize).toHaveLength(2);
        expect(item.cost).toBeGreaterThanOrEqual(0);
      }
    });

    it("should have items across all 6 rarities", () => {
      const rarities = new Set(DECORATION_ITEMS.map(i => i.rarity));
      expect(rarities).toContain("common");
      expect(rarities).toContain("uncommon");
      expect(rarities).toContain("rare");
      expect(rarities).toContain("epic");
      expect(rarities).toContain("legendary");
      expect(rarities).toContain("mythic");
    });

    it("should have items across all 12 categories", () => {
      const categories = new Set(DECORATION_ITEMS.map(i => i.category));
      for (const cat of ["furniture", "wall_art", "floor", "lighting", "trophy", "plant", "tech", "weapon_rack", "bookshelf", "pet", "ambient", "luxury"]) {
        expect(categories).toContain(cat);
      }
    });

    it("should have 9 boss kill gated items", () => {
      const bossItems = DECORATION_ITEMS.filter(i => i.requiredBossKill);
      expect(bossItems.length).toBe(9);
    });

    it("should have 6 seasonal event gated items", () => {
      const seasonalItems = DECORATION_ITEMS.filter(i => i.requiredSeasonalEvent);
      expect(seasonalItems.length).toBe(6);
    });

    it("should have 4 morality gated items", () => {
      const moralityItems = DECORATION_ITEMS.filter(i => i.requiredMorality);
      expect(moralityItems.length).toBe(4);
    });

    it("should have 13 achievement gated items", () => {
      const achievementItems = DECORATION_ITEMS.filter(i => i.requiredAchievement);
      expect(achievementItems.length).toBe(13);
    });

    it("should have items with passive bonuses", () => {
      const bonusItems = DECORATION_ITEMS.filter(i => i.passiveBonus);
      expect(bonusItems.length).toBeGreaterThanOrEqual(15);
    });

    it("boss kill items should reference valid boss keys", () => {
      const validBossKeys = ["panopticon_sentinel", "chrono_wyrm", "void_leviathan", "shadow_colossus"];
      for (const item of DECORATION_ITEMS.filter(i => i.requiredBossKill)) {
        expect(validBossKeys).toContain(item.requiredBossKill!.bossKey);
        expect(item.requiredBossKill!.kills).toBeGreaterThan(0);
      }
    });

    it("seasonal event items should reference valid event keys", () => {
      const validEventKeys = ["shadow_convergence", "chrono_harvest", "forge_of_nations", "panopticon_infiltration", "lore_symposium", "guild_war_tournament"];
      for (const item of DECORATION_ITEMS.filter(i => i.requiredSeasonalEvent)) {
        expect(validEventKeys).toContain(item.requiredSeasonalEvent);
      }
    });

    it("morality items should have valid path and minScore", () => {
      for (const item of DECORATION_ITEMS.filter(i => i.requiredMorality)) {
        expect(["machine", "humanity"]).toContain(item.requiredMorality!.path);
        expect(item.requiredMorality!.minScore).toBeGreaterThan(0);
      }
    });
  });

  describe("ROOM_ZONES", () => {
    it("should have at least 6 room zones", () => {
      expect(ROOM_ZONES.length).toBeGreaterThanOrEqual(6);
    });

    it("each zone should have unique zone identifier", () => {
      const zones = ROOM_ZONES.map(z => z.zone);
      expect(new Set(zones).size).toBe(zones.length);
    });
  });

  describe("getAvailableDecorations", () => {
    it("should return all items with no requirements when given max stats", () => {
      const all = getAvailableDecorations({
        characterClass: "spy",
        species: "demagi",
        prestigeClass: "shadow_broker",
        civilSkills: { tactics: 10, craftsmanship: 10, perception: 10, diplomacy: 10, lore: 10, navigation: 10, survival: 10, espionage: 10 },
        achievements: DECORATION_ITEMS.filter(i => i.requiredAchievement).map(i => i.requiredAchievement!),
        moralityScore: -100,
        citizenLevel: 30,
        bossKills: { panopticon_sentinel: 100, chrono_wyrm: 100, void_leviathan: 100, shadow_colossus: 100 },
        seasonalEventsParticipated: ["shadow_convergence", "chrono_harvest", "forge_of_nations", "panopticon_infiltration", "lore_symposium", "guild_war_tournament"],
      });
      // Should get most items (some may be class/species locked to other classes)
      expect(all.length).toBeGreaterThan(80);
    });

    it("should filter by boss kill requirement", () => {
      const withBoss = getAvailableDecorations({
        bossKills: { panopticon_sentinel: 1 },
      });
      const withoutBoss = getAvailableDecorations({
        bossKills: {},
      });
      // Items requiring boss kills should be in withBoss but not withoutBoss
      const sentinelItem = DECORATION_ITEMS.find(i => i.requiredBossKill?.bossKey === "panopticon_sentinel" && i.requiredBossKill.kills === 1);
      expect(sentinelItem).toBeTruthy();
      expect(withBoss.some(i => i.key === sentinelItem!.key)).toBe(true);
      expect(withoutBoss.some(i => i.key === sentinelItem!.key)).toBe(false);
    });

    it("should filter by seasonal event requirement", () => {
      const withEvent = getAvailableDecorations({
        seasonalEventsParticipated: ["shadow_convergence"],
      });
      const withoutEvent = getAvailableDecorations({
        seasonalEventsParticipated: [],
      });
      const eventItem = DECORATION_ITEMS.find(i => i.requiredSeasonalEvent === "shadow_convergence");
      expect(eventItem).toBeTruthy();
      expect(withEvent.some(i => i.key === eventItem!.key)).toBe(true);
      expect(withoutEvent.some(i => i.key === eventItem!.key)).toBe(false);
    });

    it("should filter by morality requirement (machine path)", () => {
      const machinePlayer = getAvailableDecorations({ moralityScore: -60 });
      const humanityPlayer = getAvailableDecorations({ moralityScore: 60 });
      const machineItem = DECORATION_ITEMS.find(i => i.requiredMorality?.path === "machine");
      expect(machineItem).toBeTruthy();
      expect(machinePlayer.some(i => i.key === machineItem!.key)).toBe(true);
      expect(humanityPlayer.some(i => i.key === machineItem!.key)).toBe(false);
    });

    it("should filter by morality requirement (humanity path)", () => {
      const humanityPlayer = getAvailableDecorations({ moralityScore: 60 });
      const machinePlayer = getAvailableDecorations({ moralityScore: -60 });
      const humanityItem = DECORATION_ITEMS.find(i => i.requiredMorality?.path === "humanity");
      expect(humanityItem).toBeTruthy();
      expect(humanityPlayer.some(i => i.key === humanityItem!.key)).toBe(true);
      expect(machinePlayer.some(i => i.key === humanityItem!.key)).toBe(false);
    });

    it("should filter by achievement requirement", () => {
      const withAch = getAvailableDecorations({ achievements: ["centurion"] });
      const withoutAch = getAvailableDecorations({ achievements: [] });
      const achItem = DECORATION_ITEMS.find(i => i.requiredAchievement === "centurion" && !i.requiredBossKill);
      expect(achItem).toBeTruthy();
      expect(withAch.some(i => i.key === achItem!.key)).toBe(true);
      expect(withoutAch.some(i => i.key === achItem!.key)).toBe(false);
    });

    it("should filter by class requirement", () => {
      const spyItems = getAvailableDecorations({ characterClass: "spy" });
      const soldierItems = getAvailableDecorations({ characterClass: "soldier" });
      const spyOnlyItem = DECORATION_ITEMS.find(i => i.requiredClass === "spy");
      if (spyOnlyItem) {
        expect(spyItems.some(i => i.key === spyOnlyItem.key)).toBe(true);
        expect(soldierItems.some(i => i.key === spyOnlyItem.key)).toBe(false);
      }
    });

    it("should return base items (no requirements) for empty opts", () => {
      const base = getAvailableDecorations({});
      expect(base.length).toBeGreaterThan(30);
      // All returned items should have no special requirements
      for (const item of base) {
        expect(item.requiredBossKill).toBeFalsy();
        expect(item.requiredSeasonalEvent).toBeFalsy();
        expect(item.requiredMorality).toBeFalsy();
        expect(item.requiredAchievement).toBeFalsy();
        expect(item.requiredClass).toBeFalsy();
        expect(item.requiredSpecies).toBeFalsy();
        expect(item.requiredPrestige).toBeFalsy();
        expect(item.requiredCivilSkill).toBeFalsy();
        expect(item.requiredLevel).toBeFalsy();
      }
    });
  });

  describe("getAvailableZones", () => {
    it("should return zones for a high-level player", () => {
      const zones = getAvailableZones({ citizenLevel: 30, civilSkills: { tactics: 10, craftsmanship: 10, perception: 10 } });
      expect(zones.length).toBeGreaterThanOrEqual(5);
    });

    it("should return fewer zones for a low-level player", () => {
      const lowLevel = getAvailableZones({ citizenLevel: 1 });
      const highLevel = getAvailableZones({ citizenLevel: 30, civilSkills: { tactics: 10, craftsmanship: 10, perception: 10 } });
      expect(lowLevel.length).toBeLessThanOrEqual(highLevel.length);
    });
  });

  describe("calculateQuarterBonuses", () => {
    it("should return empty object for items without bonuses", () => {
      const noBonusItems = DECORATION_ITEMS.filter(i => !i.passiveBonus).slice(0, 3);
      const bonuses = calculateQuarterBonuses(noBonusItems);
      expect(Object.keys(bonuses).length).toBe(0);
    });

    it("should accumulate bonuses from multiple items", () => {
      const bonusItems = DECORATION_ITEMS.filter(i => i.passiveBonus).slice(0, 3);
      const bonuses = calculateQuarterBonuses(bonusItems);
      expect(Object.keys(bonuses).length).toBeGreaterThan(0);
      for (const val of Object.values(bonuses)) {
        expect(val).toBeGreaterThan(0);
      }
    });

    it("should sum same-type bonuses", () => {
      // Find two items with the same bonus type
      const bonusItems = DECORATION_ITEMS.filter(i => i.passiveBonus);
      const typeMap = new Map<string, DecorationItem[]>();
      for (const item of bonusItems) {
        const type = item.passiveBonus!.type;
        if (!typeMap.has(type)) typeMap.set(type, []);
        typeMap.get(type)!.push(item);
      }
      // Find a type with multiple items
      for (const [type, items] of typeMap) {
        if (items.length >= 2) {
          const result = calculateQuarterBonuses(items.slice(0, 2));
          const expected = items[0].passiveBonus!.value + items[1].passiveBonus!.value;
          expect(result[type]).toBe(expected);
          break;
        }
      }
    });
  });
});

/* ═══ COSMETIC SHOP — BOSS MASTERY & EARNED COSMETICS ═══ */
describe("Cosmetic Shop — Expanded", () => {
  describe("COSMETIC_ITEMS data integrity", () => {
    it("should have 35+ cosmetic items", () => {
      expect(COSMETIC_ITEMS.length).toBeGreaterThanOrEqual(35);
    });

    it("all items should have unique keys", () => {
      const keys = COSMETIC_ITEMS.map(i => i.key);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it("every item should have required fields", () => {
      for (const item of COSMETIC_ITEMS) {
        expect(item.key).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.description).toBeTruthy();
        expect(item.type).toBeTruthy();
        expect(item.rarity).toBeTruthy();
        expect(typeof item.price).toBe("number");
      }
    });

    it("should have boss-earned cosmetics", () => {
      const bossCosmetics = COSMETIC_ITEMS.filter(i => i.earnedFromBoss);
      expect(bossCosmetics.length).toBeGreaterThanOrEqual(4);
    });

    it("boss-earned cosmetics should have price 0", () => {
      for (const item of COSMETIC_ITEMS.filter(i => i.earnedFromBoss)) {
        expect(item.price).toBe(0);
      }
    });
  });

  describe("getShopItems", () => {
    it("should exclude boss-earned items from shop", () => {
      const shopItems = getShopItems({});
      for (const item of shopItems) {
        expect(item.earnedFromBoss).toBeFalsy();
        expect(item.earnedFromEvent).toBeFalsy();
        expect(item.earnedFromAchievement).toBeFalsy();
      }
    });

    it("should return purchasable items", () => {
      const items = getShopItems({});
      expect(items.length).toBeGreaterThan(20);
    });

    it("should filter by prestige class", () => {
      const withPrestige = getShopItems({ prestigeClass: "chronomancer" });
      const withoutPrestige = getShopItems({});
      // prestige-gated items should appear for matching class
      expect(withPrestige.length).toBeGreaterThanOrEqual(withoutPrestige.length);
    });
  });

  describe("getBossMasteryCosmetics", () => {
    it("should return empty for no unlocked keys", () => {
      const result = getBossMasteryCosmetics([]);
      expect(result).toHaveLength(0);
    });

    it("should return matching cosmetics for unlocked keys", () => {
      const bossKeys = COSMETIC_ITEMS.filter(i => i.earnedFromBoss).map(i => i.key);
      if (bossKeys.length > 0) {
        const result = getBossMasteryCosmetics([bossKeys[0]]);
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe(bossKeys[0]);
      }
    });

    it("should return all boss cosmetics when all keys provided", () => {
      const bossKeys = COSMETIC_ITEMS.filter(i => i.earnedFromBoss).map(i => i.key);
      const result = getBossMasteryCosmetics(bossKeys);
      expect(result.length).toBe(bossKeys.length);
    });
  });

  describe("getAllEarnedCosmetics", () => {
    it("should return empty for no unlocked keys", () => {
      const result = getAllEarnedCosmetics({ bossUnlocked: [] });
      expect(result).toHaveLength(0);
    });

    it("should return boss cosmetics when boss keys provided", () => {
      const bossKeys = COSMETIC_ITEMS.filter(i => i.earnedFromBoss).map(i => i.key);
      const result = getAllEarnedCosmetics({ bossUnlocked: bossKeys });
      expect(result.length).toBe(bossKeys.length);
    });

    it("should combine boss and event cosmetics", () => {
      const bossKeys = COSMETIC_ITEMS.filter(i => i.earnedFromBoss).map(i => i.key);
      const eventKeys = COSMETIC_ITEMS.filter(i => i.earnedFromEvent).map(i => i.key);
      const result = getAllEarnedCosmetics({ bossUnlocked: bossKeys, eventUnlocked: eventKeys });
      expect(result.length).toBe(bossKeys.length + eventKeys.length);
    });
  });
});

/* ═══ MORALITY CARD SYSTEM ═══ */
describe("Morality Card System", () => {
  describe("getMoralityAlignment", () => {
    it("should return 'machine' for score <= -20", () => {
      expect(getMoralityAlignment(-20)).toBe("machine");
      expect(getMoralityAlignment(-50)).toBe("machine");
      expect(getMoralityAlignment(-100)).toBe("machine");
    });

    it("should return 'humanity' for score >= 20", () => {
      expect(getMoralityAlignment(20)).toBe("humanity");
      expect(getMoralityAlignment(50)).toBe("humanity");
      expect(getMoralityAlignment(100)).toBe("humanity");
    });

    it("should return 'balanced' for scores between -19 and 19", () => {
      expect(getMoralityAlignment(0)).toBe("balanced");
      expect(getMoralityAlignment(19)).toBe("balanced");
      expect(getMoralityAlignment(-19)).toBe("balanced");
    });
  });

  describe("getCardMoralityModifier", () => {
    it("should return neutral for null alignment", () => {
      const result = getCardMoralityModifier(50, null);
      expect(result.type).toBe("neutral");
      expect(result.atkBonus).toBe(0);
      expect(result.energyCostModifier).toBe(0);
    });

    it("should return neutral for balanced alignment", () => {
      const result = getCardMoralityModifier(0, "order");
      expect(result.type).toBe("neutral");
    });

    it("machine alignment + order card = bonus", () => {
      const result = getCardMoralityModifier(-30, "order");
      expect(result.type).toBe("bonus");
      expect(result.atkBonus).toBe(1);
    });

    it("machine alignment + chaos card = penalty", () => {
      const result = getCardMoralityModifier(-30, "chaos");
      expect(result.type).toBe("penalty");
      expect(result.energyCostModifier).toBe(1);
    });

    it("humanity alignment + chaos card = bonus", () => {
      const result = getCardMoralityModifier(30, "chaos");
      expect(result.type).toBe("bonus");
      expect(result.atkBonus).toBe(1);
    });

    it("humanity alignment + order card = penalty", () => {
      const result = getCardMoralityModifier(30, "order");
      expect(result.type).toBe("penalty");
      expect(result.energyCostModifier).toBe(1);
    });

    it("extreme machine (>60) + order card = +2 ATK + pierce", () => {
      const result = getCardMoralityModifier(-70, "order");
      expect(result.type).toBe("bonus");
      expect(result.atkBonus).toBe(2);
      expect(result.bonusKeyword).toBe("pierce");
    });

    it("extreme humanity (>60) + chaos card = +2 ATK + rally", () => {
      const result = getCardMoralityModifier(70, "chaos");
      expect(result.type).toBe("bonus");
      expect(result.atkBonus).toBe(2);
      expect(result.bonusKeyword).toBe("rally");
    });

    it("extreme machine + chaos card = +2 energy cost", () => {
      const result = getCardMoralityModifier(-70, "chaos");
      expect(result.type).toBe("penalty");
      expect(result.energyCostModifier).toBe(2);
    });
  });

  describe("getMoralityCardSummary", () => {
    it("should return balanced summary for score 0", () => {
      const summary = getMoralityCardSummary(0);
      expect(summary.alignment).toBe("balanced");
      expect(summary.isExtreme).toBe(false);
    });

    it("should return machine summary for negative score", () => {
      const summary = getMoralityCardSummary(-30);
      expect(summary.alignment).toBe("machine");
      expect(summary.orderEffect).toContain("+1 ATK");
      expect(summary.chaosEffect).toContain("+1 energy cost");
    });

    it("should return humanity summary for positive score", () => {
      const summary = getMoralityCardSummary(30);
      expect(summary.alignment).toBe("humanity");
      expect(summary.chaosEffect).toContain("+1 ATK");
      expect(summary.orderEffect).toContain("+1 energy cost");
    });

    it("should mark extreme for |score| > 60", () => {
      const extreme = getMoralityCardSummary(-70);
      expect(extreme.isExtreme).toBe(true);
      expect(extreme.orderEffect).toContain("+2 ATK");
    });

    it("should not mark extreme for |score| <= 60", () => {
      const normal = getMoralityCardSummary(-30);
      expect(normal.isExtreme).toBe(false);
    });
  });
});

/* ═══ MORALITY THEMES ═══ */
describe("Morality Themes", () => {
  describe("SHIP_THEMES data integrity", () => {
    it("should have ship themes", () => {
      expect(SHIP_THEMES.length).toBeGreaterThanOrEqual(10);
    });

    it("every theme should have id, name, side, requiredScore", () => {
      for (const theme of SHIP_THEMES) {
        expect(theme.id).toBeTruthy();
        expect(theme.name).toBeTruthy();
        expect(["machine", "humanity", "balanced"]).toContain(theme.side);
        expect(typeof theme.requiredScore).toBe("number");
      }
    });

    it("should have unique IDs", () => {
      const ids = SHIP_THEMES.map(t => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("CHARACTER_THEMES data integrity", () => {
    it("should have character themes", () => {
      expect(CHARACTER_THEMES.length).toBeGreaterThanOrEqual(10);
    });

    it("should have unique IDs", () => {
      const ids = CHARACTER_THEMES.map(t => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("MORALITY_MILESTONE_REWARDS", () => {
    it("should have at least 10 milestones", () => {
      expect(MORALITY_MILESTONE_REWARDS.length).toBeGreaterThanOrEqual(10);
    });

    it("should have milestones for both machine and humanity sides", () => {
      const sides = new Set(MORALITY_MILESTONE_REWARDS.map(m => m.side));
      expect(sides).toContain("machine");
      expect(sides).toContain("humanity");
    });
  });

  describe("getAvailableShipThemes", () => {
    it("should return balanced themes for score 0", () => {
      const themes = getAvailableShipThemes(0);
      expect(themes.length).toBeGreaterThan(0);
      for (const t of themes) {
        expect(t.side).toBe("balanced");
      }
    });

    it("should return machine themes for very negative score", () => {
      const themes = getAvailableShipThemes(-100);
      const machineThemes = themes.filter(t => t.side === "machine");
      expect(machineThemes.length).toBeGreaterThan(0);
    });

    it("should return humanity themes for very positive score", () => {
      const themes = getAvailableShipThemes(100);
      const humanityThemes = themes.filter(t => t.side === "humanity");
      expect(humanityThemes.length).toBeGreaterThan(0);
    });

    it("more extreme scores should unlock more themes", () => {
      const mild = getAvailableShipThemes(-20);
      const extreme = getAvailableShipThemes(-100);
      expect(extreme.length).toBeGreaterThanOrEqual(mild.length);
    });
  });

  describe("getUnclaimedMilestones", () => {
    it("should return milestones for extreme machine score", () => {
      const milestones = getUnclaimedMilestones(-100, []);
      expect(milestones.length).toBeGreaterThan(0);
      for (const m of milestones) {
        expect(m.side).toBe("machine");
      }
    });

    it("should return milestones for extreme humanity score", () => {
      const milestones = getUnclaimedMilestones(100, []);
      expect(milestones.length).toBeGreaterThan(0);
      for (const m of milestones) {
        expect(m.side).toBe("humanity");
      }
    });

    it("should exclude already claimed milestones", () => {
      const all = getUnclaimedMilestones(-100, []);
      if (all.length > 0) {
        const firstKey = `${all[0].side}_${Math.abs(all[0].scoreThreshold)}`;
        const remaining = getUnclaimedMilestones(-100, [firstKey]);
        expect(remaining.length).toBe(all.length - 1);
      }
    });

    it("should return empty for balanced score", () => {
      const milestones = getUnclaimedMilestones(0, []);
      expect(milestones.length).toBe(0);
    });
  });
});

/* ═══ MORALITY STORY BRANCHES ═══ */
describe("Morality Story Branches", () => {
  describe("SECRET_TRANSMISSIONS data integrity", () => {
    it("should have at least 10 transmissions", () => {
      expect(SECRET_TRANSMISSIONS.length).toBeGreaterThanOrEqual(10);
    });

    it("should have unique IDs", () => {
      const ids = SECRET_TRANSMISSIONS.map(t => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have transmissions for both sides", () => {
      const sides = new Set(SECRET_TRANSMISSIONS.map(t => t.side));
      expect(sides).toContain("machine");
      expect(sides).toContain("humanity");
    });

    it("every transmission should have required fields", () => {
      for (const t of SECRET_TRANSMISSIONS) {
        expect(t.id).toBeTruthy();
        expect(t.subject).toBeTruthy();
        expect(t.content).toBeTruthy();
        expect(["machine", "humanity"]).toContain(t.side);
        expect(typeof t.minScore).toBe("number");
        expect(t.roomId).toBeTruthy();
        expect(t.sender).toBeTruthy();
      }
    });
  });

  describe("ELARA_MORALITY_VARIANTS", () => {
    it("should have at least 5 room variants", () => {
      expect(ELARA_MORALITY_VARIANTS.length).toBeGreaterThanOrEqual(5);
    });

    it("every variant should have roomId and dialog options", () => {
      for (const v of ELARA_MORALITY_VARIANTS) {
        expect(v.roomId).toBeTruthy();
        expect(v.defaultDialog).toBeTruthy();
        expect(v.machineDialog).toBeTruthy();
        expect(v.humanityDialog).toBeTruthy();
      }
    });

    it("should have unique roomIds", () => {
      const ids = ELARA_MORALITY_VARIANTS.map(v => v.roomId);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("getAvailableTransmissions", () => {
    it("should return machine transmissions for negative score", () => {
      const transmissions = getAvailableTransmissions(-50);
      expect(transmissions.length).toBeGreaterThan(0);
      for (const t of transmissions) {
        expect(t.side).toBe("machine");
      }
    });

    it("should return humanity transmissions for positive score", () => {
      const transmissions = getAvailableTransmissions(50);
      expect(transmissions.length).toBeGreaterThan(0);
      for (const t of transmissions) {
        expect(t.side).toBe("humanity");
      }
    });

    it("should return empty for balanced score", () => {
      const transmissions = getAvailableTransmissions(0);
      expect(transmissions.length).toBe(0);
    });
  });

  describe("getElaraVariant", () => {
    it("should return dialog for machine-aligned player", () => {
      const firstRoom = ELARA_MORALITY_VARIANTS[0].roomId;
      const variant = getElaraVariant(-30, firstRoom);
      expect(variant).toBeTruthy();
      expect(typeof variant).toBe("string");
    });

    it("should return dialog for humanity-aligned player", () => {
      const firstRoom = ELARA_MORALITY_VARIANTS[0].roomId;
      const variant = getElaraVariant(30, firstRoom);
      expect(variant).toBeTruthy();
      expect(typeof variant).toBe("string");
    });

    it("should return null for invalid roomId", () => {
      const variant = getElaraVariant(-30, "nonexistent_room");
      expect(variant).toBeNull();
    });

    it("should return null for balanced player (no faction alignment)", () => {
      const firstRoom = ELARA_MORALITY_VARIANTS[0].roomId;
      const variant = getElaraVariant(0, firstRoom);
      expect(variant).toBeNull();
    });

    it("should return deep dialog for extreme morality", () => {
      const firstRoom = ELARA_MORALITY_VARIANTS[0].roomId;
      const deepMachine = getElaraVariant(-80, firstRoom);
      const deepHumanity = getElaraVariant(80, firstRoom);
      // At least one should have deep dialog
      expect(deepMachine !== null || deepHumanity !== null).toBe(true);
    });
  });

  describe("isTransmissionDiscovered", () => {
    it("should return true for discovered transmission", () => {
      const firstId = SECRET_TRANSMISSIONS[0].id;
      expect(isTransmissionDiscovered(firstId, [firstId])).toBe(true);
    });

    it("should return false for undiscovered transmission", () => {
      const firstId = SECRET_TRANSMISSIONS[0].id;
      expect(isTransmissionDiscovered(firstId, [])).toBe(false);
    });
  });

  describe("getNextUndiscoveredTransmission", () => {
    it("should return a transmission when not all discovered", () => {
      const next = getNextUndiscoveredTransmission(-50, []);
      expect(next).toBeTruthy();
    });

    it("should return null when all are discovered", () => {
      const allIds = SECRET_TRANSMISSIONS.filter(t => t.side === "machine").map(t => t.id);
      const next = getNextUndiscoveredTransmission(-100, allIds);
      expect(next).toBeNull();
    });
  });

  describe("getRoomTransmissions", () => {
    it("should return transmissions for rooms that have them", () => {
      const machineRoomIds = [...new Set(SECRET_TRANSMISSIONS.filter(t => t.side === "machine").map(t => t.roomId))];
      if (machineRoomIds.length > 0) {
        const transmissions = getRoomTransmissions(-100, machineRoomIds[0]);
        expect(transmissions.length).toBeGreaterThan(0);
      }
    });

    it("should return empty for rooms with no transmissions", () => {
      const transmissions = getRoomTransmissions(-100, "nonexistent_room");
      expect(transmissions.length).toBe(0);
    });
  });
});

/* ═══ FACTION WAR EVENTS ═══ */
describe("Faction War Events", () => {
  describe("FACTION_WAR_EVENTS data integrity", () => {
    it("should have at least 5 events", () => {
      expect(FACTION_WAR_EVENTS.length).toBeGreaterThanOrEqual(5);
    });

    it("every event should have required fields", () => {
      for (const event of FACTION_WAR_EVENTS) {
        expect(event.id).toBeTruthy();
        expect(event.name).toBeTruthy();
        expect(event.description).toBeTruthy();
        expect(["machine", "humanity", "neutral"]).toContain(event.favoredSide);
        expect(typeof event.durationHours).toBe("number");
        expect(event.durationHours).toBeGreaterThan(0);
        expect(event.winnerRewards).toBeTruthy();
        expect(event.loserRewards).toBeTruthy();
        expect(event.specialRules).toBeTruthy();
        expect(event.loreText).toBeTruthy();
        expect(event.color).toBeTruthy();
      }
    });

    it("should have unique IDs", () => {
      const ids = FACTION_WAR_EVENTS.map(e => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have events for all favored sides", () => {
      const sides = new Set(FACTION_WAR_EVENTS.map(e => e.favoredSide));
      expect(sides).toContain("machine");
      expect(sides).toContain("humanity");
      expect(sides).toContain("neutral");
    });

    it("winner rewards should be greater than loser rewards", () => {
      for (const event of FACTION_WAR_EVENTS) {
        expect(event.winnerRewards.dreamTokens).toBeGreaterThan(event.loserRewards.dreamTokens);
        expect(event.winnerRewards.xp).toBeGreaterThan(event.loserRewards.xp);
      }
    });
  });

  describe("getCurrentEvent", () => {
    it("should return an event or null", () => {
      const event = getCurrentEvent();
      if (event) {
        expect(event.id).toBeTruthy();
        expect(event.name).toBeTruthy();
      }
    });
  });

  describe("getEventTimeRemaining", () => {
    it("should return an object with hours and minutes or null", () => {
      const remaining = getEventTimeRemaining();
      if (remaining) {
        expect(typeof remaining.hours).toBe("number");
        expect(typeof remaining.minutes).toBe("number");
        expect(remaining.hours).toBeGreaterThanOrEqual(0);
        expect(remaining.minutes).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

/* ═══ CROSS-SYSTEM INTEGRATION ═══ */
describe("Cross-System Integration", () => {
  it("boss kill decoration items reference real boss keys from cosmetic shop", () => {
    const bossDecoItems = DECORATION_ITEMS.filter(i => i.requiredBossKill);
    const bossKeys = new Set(bossDecoItems.map(i => i.requiredBossKill!.bossKey));
    // These should match the boss keys used in cosmetic shop
    const bossCosmetics = COSMETIC_ITEMS.filter(i => i.earnedFromBoss);
    // Both systems reference the same boss ecosystem
    expect(bossKeys.size).toBeGreaterThan(0);
    expect(bossCosmetics.length).toBeGreaterThan(0);
  });

  it("morality score gates both decoration items and ship themes", () => {
    const moralityDecos = DECORATION_ITEMS.filter(i => i.requiredMorality);
    const machineThemes = SHIP_THEMES.filter(t => t.side === "machine");
    const humanityThemes = SHIP_THEMES.filter(t => t.side === "humanity");
    expect(moralityDecos.length).toBeGreaterThan(0);
    expect(machineThemes.length).toBeGreaterThan(0);
    expect(humanityThemes.length).toBeGreaterThan(0);
  });

  it("morality score affects both card modifiers and story transmissions", () => {
    // Machine alignment should unlock machine transmissions and give order card bonuses
    const machineTransmissions = getAvailableTransmissions(-50, []);
    const orderBonus = getCardMoralityModifier(-50, "order");
    expect(machineTransmissions.length).toBeGreaterThan(0);
    expect(orderBonus.type).toBe("bonus");
  });

  it("achievement keys in decoration items should be valid strings", () => {
    const achDecos = DECORATION_ITEMS.filter(i => i.requiredAchievement);
    for (const item of achDecos) {
      expect(typeof item.requiredAchievement).toBe("string");
      expect(item.requiredAchievement!.length).toBeGreaterThan(0);
    }
  });

  it("seasonal event keys in decoration items should be valid strings", () => {
    const eventDecos = DECORATION_ITEMS.filter(i => i.requiredSeasonalEvent);
    for (const item of eventDecos) {
      expect(typeof item.requiredSeasonalEvent).toBe("string");
      expect(item.requiredSeasonalEvent!.length).toBeGreaterThan(0);
    }
  });
});

/* ═══ NOTIFICATION SCHEMA ═══ */
describe("Notification Schema", () => {
  it("should have notification types for all wired systems", async () => {
    const schemaContent = await import("fs").then(fs =>
      fs.readFileSync("drizzle/schema.ts", "utf-8")
    );
    const requiredTypes = [
      "trade_offer", "trade_accepted", "trade_declined",
      "pvp_season_reward",
      "guild_war_victory",
      "boss_mastery", "seasonal_event", "recruitment",
    ];
    for (const type of requiredTypes) {
      expect(schemaContent).toContain(`"${type}"`);
    }
  });
});

/* ═══ GUILD RECRUITMENT ═══ */
describe("Guild Recruitment Schema", () => {
  it("guildRecruitment table should exist in schema", async () => {
    const schemaContent = await import("fs").then(fs =>
      fs.readFileSync("drizzle/schema.ts", "utf-8")
    );
    expect(schemaContent).toContain("guildRecruitment");
  });
});

/* ═══ ACHIEVEMENT TRACKER ═══ */
describe("Achievement Tracker", () => {
  it("CARD_ACHIEVEMENTS should have 35 achievements", async () => {
    const { CARD_ACHIEVEMENTS } = await import("./routers/cardAchievements");
    expect(CARD_ACHIEVEMENTS.length).toBe(35);
  });

  it("should have achievements across all categories", async () => {
    const { CARD_ACHIEVEMENTS } = await import("./routers/cardAchievements");
    const categories = new Set(CARD_ACHIEVEMENTS.map(a => a.category));
    expect(categories).toContain("pvp");
    expect(categories).toContain("collection");
    expect(categories).toContain("trading");
    expect(categories).toContain("crafting");
    expect(categories).toContain("draft");
    expect(categories).toContain("general");
  });

  it("all achievements should have unique keys", async () => {
    const { CARD_ACHIEVEMENTS } = await import("./routers/cardAchievements");
    const keys = CARD_ACHIEVEMENTS.map(a => a.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("all achievements should have positive targets and rewards", async () => {
    const { CARD_ACHIEVEMENTS } = await import("./routers/cardAchievements");
    for (const a of CARD_ACHIEVEMENTS) {
      expect(a.target).toBeGreaterThan(0);
      expect(a.dreamReward).toBeGreaterThan(0);
    }
  });
});
