/* ═══════════════════════════════════════════════════════
   CHARACTER BONUSES INTEGRATION TESTS
   Verifies that all 9 game system resolvers return
   correct bonus structures for all species/class combos.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  resolveCardGameBonuses,
  resolveTradeEmpireBonuses,
  resolveFightGameBonuses,
  resolveCraftingBonuses,
  resolveExplorationBonuses,
  resolveChessBonuses,
  resolveGuildWarBonuses,
  resolveQuestBonuses,
  resolveMarketBonuses,
  type CitizenData,
} from "../shared/citizenTraits";

/* ─── TEST FIXTURES ─── */

const SPECIES = ["demagi", "quarchon", "neyon"] as const;
const CLASSES = ["engineer", "oracle", "assassin", "soldier", "spy"] as const;
const ELEMENTS = ["earth", "fire", "water", "air", "space", "time", "probability", "reality"] as const;

function makeCitizen(overrides: Partial<CitizenData> = {}): CitizenData {
  return {
    species: "demagi",
    characterClass: "oracle",
    alignment: "order",
    element: "fire",
    attrAttack: 3,
    attrDefense: 3,
    attrVitality: 3,
    classLevel: 1,
    level: 5,
    ...overrides,
  } as CitizenData;
}

/* ═══ CARD GAME BONUSES ═══ */

describe("resolveCardGameBonuses", () => {
  it("returns valid bonus structure for all species/class combos", () => {
    for (const species of SPECIES) {
      for (const cls of CLASSES) {
        const citizen = makeCitizen({ species, characterClass: cls });
        const result = resolveCardGameBonuses(citizen);

        expect(result).toBeDefined();
        expect(typeof result.hpBonus).toBe("number");
        expect(typeof result.influenceBonus).toBe("number");
        expect(typeof result.energyBonus).toBe("number");
        expect(typeof result.globalAttackBonus).toBe("number");
        expect(typeof result.globalHealthBonus).toBe("number");
        expect(typeof result.elementAffinity).toBe("string");
        expect(typeof result.extraDrawEveryNTurns).toBe("number");
        expect(typeof result.costReductionChance).toBe("number");
        expect(result.costReductionChance).toBeGreaterThanOrEqual(0);
        expect(result.costReductionChance).toBeLessThanOrEqual(1);
        expect(Array.isArray(result.breakdown)).toBe(true);
      }
    }
  });

  it("DeMagi gets HP bonus from species", () => {
    const citizen = makeCitizen({ species: "demagi" });
    const result = resolveCardGameBonuses(citizen);
    expect(result.hpBonus).toBeGreaterThan(0);
  });

  it("returns defaults for null citizen", () => {
    const result = resolveCardGameBonuses(null);
    expect(result.hpBonus).toBe(0);
    expect(result.influenceBonus).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });
});

/* ═══ FIGHT GAME BONUSES ═══ */

describe("resolveFightGameBonuses", () => {
  it("returns valid bonus structure for all species/class combos", () => {
    for (const species of SPECIES) {
      for (const cls of CLASSES) {
        const citizen = makeCitizen({ species, characterClass: cls });
        const result = resolveFightGameBonuses(citizen);

        expect(result).toBeDefined();
        expect(typeof result.attackBonus).toBe("number");
        expect(typeof result.defenseBonus).toBe("number");
        expect(typeof result.hpBonus).toBe("number");
        expect(typeof result.speedBonus).toBe("number");
        expect(typeof result.critChanceBonus).toBe("number");
        expect(typeof result.counterBonus).toBe("number");
        expect(typeof result.xpMultiplier).toBe("number");
        expect(typeof result.dreamMultiplier).toBe("number");
        expect(result.critChanceBonus).toBeGreaterThanOrEqual(0);
        expect(result.critChanceBonus).toBeLessThanOrEqual(1);
        expect(Array.isArray(result.breakdown)).toBe(true);
      }
    }
  });

  it("Soldier class gets attack bonus", () => {
    const citizen = makeCitizen({ characterClass: "soldier" });
    const result = resolveFightGameBonuses(citizen);
    expect(result.attackBonus).toBeGreaterThan(0);
  });

  it("Assassin class gets speed and attack bonuses", () => {
    const citizen = makeCitizen({ characterClass: "assassin" });
    const result = resolveFightGameBonuses(citizen);
    // Assassin is fast and deadly — check speed or attack is boosted
    expect(result.speedBonus + result.attackBonus + result.critChanceBonus).toBeGreaterThan(0);
  });
});

/* ═══ CHESS BONUSES ═══ */

describe("resolveChessBonuses", () => {
  it("returns valid bonus structure for all species/class combos", () => {
    for (const species of SPECIES) {
      for (const cls of CLASSES) {
        const citizen = makeCitizen({ species, characterClass: cls });
        const result = resolveChessBonuses(citizen);

        expect(result).toBeDefined();
        expect(typeof result.timeBonus).toBe("number");
        expect(result.timeBonus).toBeGreaterThanOrEqual(0);
        expect(typeof result.rewardMultiplier).toBe("number");
        expect(result.rewardMultiplier).toBeGreaterThanOrEqual(1);
        expect(typeof result.openingAffinity).toBe("string");
        expect(result.openingAffinity.length).toBeGreaterThan(0);
        expect(typeof result.xpMultiplier).toBe("number");
        expect(typeof result.dreamMultiplier).toBe("number");
        expect(Array.isArray(result.breakdown)).toBe(true);
      }
    }
  });

  it("Oracle class gets time bonus and reward multiplier", () => {
    const citizen = makeCitizen({ characterClass: "oracle" });
    const result = resolveChessBonuses(citizen);
    expect(result.timeBonus).toBeGreaterThan(0);
    expect(result.rewardMultiplier).toBeGreaterThan(1);
  });

  it("Spy class gets tricky opening affinity", () => {
    const citizen = makeCitizen({ characterClass: "spy" });
    const result = resolveChessBonuses(citizen);
    expect(result.openingAffinity).toBe("tricky");
  });

  it("returns defaults for null citizen", () => {
    const result = resolveChessBonuses(null);
    expect(result.timeBonus).toBe(0);
    expect(result.rewardMultiplier).toBe(1);
    expect(result.openingAffinity).toBe("balanced");
  });
});

/* ═══ TRADE EMPIRE BONUSES ═══ */

describe("resolveTradeEmpireBonuses", () => {
  it("returns valid bonus structure for all species/class combos", () => {
    for (const species of SPECIES) {
      for (const cls of CLASSES) {
        const citizen = makeCitizen({ species, characterClass: cls });
        const result = resolveTradeEmpireBonuses(citizen);

        expect(result).toBeDefined();
        expect(typeof result.combatPowerBonus).toBe("number");
        expect(typeof result.shieldDamageReduction).toBe("number");
        expect(typeof result.tradePriceDiscount).toBe("number");
        expect(typeof result.tradeCreditsBonus).toBe("number");
        expect(typeof result.hazardResistance).toBe("number");
        expect(typeof result.bonusTurns).toBe("number");
        expect(typeof result.scanRangeBonus).toBe("number");
        expect(typeof result.colonyIncomeMultiplier).toBe("number");
        expect(Array.isArray(result.breakdown)).toBe(true);
      }
    }
  });

  it("Engineer class gets trade empire bonuses", () => {
    const citizen = makeCitizen({ characterClass: "engineer" });
    const result = resolveTradeEmpireBonuses(citizen);
    // Engineer should have some trade advantage — check combined bonuses
    const totalBonus = result.combatPowerBonus + result.tradeCreditsBonus +
      result.scanRangeBonus + result.bonusTurns + (result.colonyIncomeMultiplier - 1);
    expect(totalBonus).toBeGreaterThan(0);
  });
});

/* ═══ CRAFTING BONUSES ═══ */

describe("resolveCraftingBonuses", () => {
  it("returns valid bonus structure", () => {
    for (const cls of CLASSES) {
      const citizen = makeCitizen({ characterClass: cls });
      const result = resolveCraftingBonuses(citizen);

      expect(result).toBeDefined();
      expect(typeof result.successRateBonus).toBe("number");
      expect(typeof result.dreamCostReduction).toBe("number");
      expect(typeof result.materialPreserveChance).toBe("number");
      expect(typeof result.bonusOutputChance).toBe("number");
      expect(result.successRateBonus).toBeGreaterThanOrEqual(0);
      expect(result.successRateBonus).toBeLessThanOrEqual(1);
      expect(Array.isArray(result.breakdown)).toBe(true);
    }
  });

  it("Engineer class gets highest crafting success bonus", () => {
    const engineer = makeCitizen({ characterClass: "engineer" });
    const soldier = makeCitizen({ characterClass: "soldier" });
    const engResult = resolveCraftingBonuses(engineer);
    const solResult = resolveCraftingBonuses(soldier);
    expect(engResult.successRateBonus).toBeGreaterThan(solResult.successRateBonus);
  });
});

/* ═══ EXPLORATION BONUSES ═══ */

describe("resolveExplorationBonuses", () => {
  it("returns valid bonus structure", () => {
    for (const cls of CLASSES) {
      const citizen = makeCitizen({ characterClass: cls });
      const result = resolveExplorationBonuses(citizen);

      expect(result).toBeDefined();
      expect(typeof result.discoveryXpBonus).toBe("number");
      expect(typeof result.hiddenItemChance).toBe("number");
      expect(typeof result.extraPuzzleHints).toBe("number");
      expect(typeof result.easterEggBonus).toBe("number");
      expect(typeof result.dreamBonus).toBe("number");
      expect(typeof result.rarityUpgradeChance).toBe("number");
      expect(Array.isArray(result.breakdown)).toBe(true);
    }
  });
});

/* ═══ GUILD WAR BONUSES ═══ */

describe("resolveGuildWarBonuses", () => {
  it("returns valid bonus structure for all species/class combos", () => {
    for (const species of SPECIES) {
      for (const cls of CLASSES) {
        const citizen = makeCitizen({ species, characterClass: cls });
        const result = resolveGuildWarBonuses(citizen);

        expect(result).toBeDefined();
        expect(typeof result.warPointMultiplier).toBe("number");
        expect(result.warPointMultiplier).toBeGreaterThanOrEqual(1);
        expect(typeof result.captureSpeedMultiplier).toBe("number");
        expect(typeof result.sabotageMultiplier).toBe("number");
        expect(typeof result.reinforceMultiplier).toBe("number");
        expect(typeof result.elementTerritoryBonus).toBe("number");
        expect(Array.isArray(result.boostedTerritories)).toBe(true);
        expect(Array.isArray(result.breakdown)).toBe(true);
      }
    }
  });

  it("Assassin class gets sabotage bonus", () => {
    const citizen = makeCitizen({ characterClass: "assassin" });
    const result = resolveGuildWarBonuses(citizen);
    expect(result.sabotageMultiplier).toBeGreaterThan(1);
  });

  it("Engineer class gets reinforce bonus", () => {
    const citizen = makeCitizen({ characterClass: "engineer" });
    const result = resolveGuildWarBonuses(citizen);
    expect(result.reinforceMultiplier).toBeGreaterThan(1);
  });

  it("fire element boosts fire-aligned territories", () => {
    const citizen = makeCitizen({ element: "fire" });
    const result = resolveGuildWarBonuses(citizen);
    expect(result.boostedTerritories.length).toBeGreaterThan(0);
    expect(result.elementTerritoryBonus).toBeGreaterThan(0);
  });

  it("returns defaults for null citizen", () => {
    const result = resolveGuildWarBonuses(null);
    expect(result.warPointMultiplier).toBe(1);
    expect(result.captureSpeedMultiplier).toBe(1);
    expect(result.boostedTerritories).toHaveLength(0);
  });
});

/* ═══ QUEST BONUSES ═══ */

describe("resolveQuestBonuses", () => {
  it("returns valid bonus structure for all classes", () => {
    for (const cls of CLASSES) {
      const citizen = makeCitizen({ characterClass: cls });
      const result = resolveQuestBonuses(citizen);

      expect(result).toBeDefined();
      expect(typeof result.rewardMultiplier).toBe("number");
      expect(result.rewardMultiplier).toBeGreaterThanOrEqual(1);
      expect(typeof result.battlePassXpMultiplier).toBe("number");
      expect(typeof result.dailyQuestSlots).toBe("number");
      expect(typeof result.completionXpBonus).toBe("number");
      expect(typeof result.bonusRewardChance).toBe("number");
      expect(result.bonusRewardChance).toBeGreaterThanOrEqual(0);
      expect(result.bonusRewardChance).toBeLessThanOrEqual(1);
      expect(Array.isArray(result.breakdown)).toBe(true);
    }
  });

  it("Oracle class gets highest quest reward multiplier", () => {
    const oracle = makeCitizen({ characterClass: "oracle" });
    const soldier = makeCitizen({ characterClass: "soldier" });
    const oracleResult = resolveQuestBonuses(oracle);
    const soldierResult = resolveQuestBonuses(soldier);
    expect(oracleResult.rewardMultiplier).toBeGreaterThan(soldierResult.rewardMultiplier);
  });

  it("Oracle class gets extra daily quest slot", () => {
    const citizen = makeCitizen({ characterClass: "oracle" });
    const result = resolveQuestBonuses(citizen);
    expect(result.dailyQuestSlots).toBeGreaterThan(0);
  });

  it("returns defaults for null citizen", () => {
    const result = resolveQuestBonuses(null);
    expect(result.rewardMultiplier).toBe(1);
    expect(result.battlePassXpMultiplier).toBe(1);
    expect(result.dailyQuestSlots).toBe(0);
  });
});

/* ═══ MARKET BONUSES ═══ */

describe("resolveMarketBonuses", () => {
  it("returns valid bonus structure for all classes", () => {
    for (const cls of CLASSES) {
      const citizen = makeCitizen({ characterClass: cls });
      const result = resolveMarketBonuses(citizen);

      expect(result).toBeDefined();
      expect(typeof result.taxReduction).toBe("number");
      expect(result.taxReduction).toBeGreaterThan(0);
      expect(result.taxReduction).toBeLessThanOrEqual(1);
      expect(typeof result.listingSlots).toBe("number");
      expect(typeof result.marketIntel).toBe("boolean");
      expect(typeof result.buyDiscount).toBe("number");
      expect(typeof result.sellBonus).toBe("number");
      expect(Array.isArray(result.breakdown)).toBe(true);
    }
  });

  it("Spy class gets market intel", () => {
    const citizen = makeCitizen({ characterClass: "spy" });
    const result = resolveMarketBonuses(citizen);
    expect(result.marketIntel).toBe(true);
  });

  it("Engineer class gets listing slots", () => {
    const citizen = makeCitizen({ characterClass: "engineer" });
    const result = resolveMarketBonuses(citizen);
    expect(result.listingSlots).toBeGreaterThan(0);
  });

  it("returns defaults for null citizen", () => {
    const result = resolveMarketBonuses(null);
    expect(result.taxReduction).toBe(1);
    expect(result.listingSlots).toBe(0);
    expect(result.marketIntel).toBe(false);
  });
});

/* ═══ CROSS-SYSTEM CONSISTENCY ═══ */

describe("Cross-system consistency", () => {
  it("all resolvers handle null citizen gracefully", () => {
    expect(() => resolveCardGameBonuses(null)).not.toThrow();
    expect(() => resolveTradeEmpireBonuses(null)).not.toThrow();
    expect(() => resolveFightGameBonuses(null)).not.toThrow();
    expect(() => resolveCraftingBonuses(null)).not.toThrow();
    expect(() => resolveExplorationBonuses(null)).not.toThrow();
    expect(() => resolveChessBonuses(null)).not.toThrow();
    expect(() => resolveGuildWarBonuses(null)).not.toThrow();
    expect(() => resolveQuestBonuses(null)).not.toThrow();
    expect(() => resolveMarketBonuses(null)).not.toThrow();
  });

  it("every class has unique strengths across systems", () => {
    // Each class should be best at something
    const results = CLASSES.map(cls => ({
      cls,
      chess: resolveChessBonuses(makeCitizen({ characterClass: cls })),
      fight: resolveFightGameBonuses(makeCitizen({ characterClass: cls })),
      craft: resolveCraftingBonuses(makeCitizen({ characterClass: cls })),
      quest: resolveQuestBonuses(makeCitizen({ characterClass: cls })),
      market: resolveMarketBonuses(makeCitizen({ characterClass: cls })),
      guildWar: resolveGuildWarBonuses(makeCitizen({ characterClass: cls })),
    }));

    // Engineer should be best at crafting
    const engineerCraft = results.find(r => r.cls === "engineer")!.craft.successRateBonus;
    const otherCrafts = results.filter(r => r.cls !== "engineer").map(r => r.craft.successRateBonus);
    expect(engineerCraft).toBeGreaterThanOrEqual(Math.max(...otherCrafts));

    // Oracle should be best at quest rewards
    const oracleQuest = results.find(r => r.cls === "oracle")!.quest.rewardMultiplier;
    const otherQuests = results.filter(r => r.cls !== "oracle").map(r => r.quest.rewardMultiplier);
    expect(oracleQuest).toBeGreaterThanOrEqual(Math.max(...otherQuests));

    // Assassin should have strong sabotage
    const assassinSab = results.find(r => r.cls === "assassin")!.guildWar.sabotageMultiplier;
    expect(assassinSab).toBeGreaterThan(1);

    // Spy should have market intel
    const spyMarket = results.find(r => r.cls === "spy")!.market.marketIntel;
    expect(spyMarket).toBe(true);
  });

  it("all breakdown arrays contain source and effect strings", () => {
    const citizen = makeCitizen();
    const resolvers = [
      resolveCardGameBonuses, resolveTradeEmpireBonuses, resolveFightGameBonuses,
      resolveCraftingBonuses, resolveExplorationBonuses, resolveChessBonuses,
      resolveGuildWarBonuses, resolveQuestBonuses, resolveMarketBonuses,
    ];

    for (const resolver of resolvers) {
      const result = resolver(citizen);
      for (const item of result.breakdown) {
        expect(typeof item.source).toBe("string");
        expect(typeof item.effect).toBe("string");
        expect(item.source.length).toBeGreaterThan(0);
        expect(item.effect.length).toBeGreaterThan(0);
      }
    }
  });
});
