/* ═══════════════════════════════════════════════════════
   PHASE 33 TESTS — Universal Character Trait Integration
   Tests the unified trait resolver and its integration
   into every game system.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  resolveCardGameBonuses,
  resolveTradeEmpireBonuses,
  resolveFightGameBonuses,
  resolveCraftingBonuses,
  resolveExplorationBonuses,
  type CitizenData,
} from "../shared/citizenTraits";

/* ─── Test Fixtures ─── */
const DEMAGI_ENGINEER: CitizenData = {
  species: "demagi",
  characterClass: "engineer",
  alignment: "order",
  element: "earth",
  attrAttack: 3,
  attrDefense: 4,
  attrVitality: 5,
  classLevel: 5,
  level: 10,
};

const QUARCHON_ASSASSIN: CitizenData = {
  species: "quarchon",
  characterClass: "assassin",
  alignment: "chaos",
  element: "fire",
  attrAttack: 5,
  attrDefense: 2,
  attrVitality: 3,
  classLevel: 3,
  level: 7,
};

const NEYON_ORACLE: CitizenData = {
  species: "neyon",
  characterClass: "oracle",
  alignment: "order",
  element: "time",
  attrAttack: 2,
  attrDefense: 3,
  attrVitality: 4,
  classLevel: 8,
  level: 15,
};

const DEMAGI_SOLDIER: CitizenData = {
  species: "demagi",
  characterClass: "soldier",
  alignment: "chaos",
  element: "space",
  attrAttack: 5,
  attrDefense: 5,
  attrVitality: 5,
  classLevel: 10,
  level: 20,
};

const NEYON_SPY: CitizenData = {
  species: "neyon",
  characterClass: "spy",
  alignment: "chaos",
  element: "probability",
  attrAttack: 4,
  attrDefense: 3,
  attrVitality: 2,
  classLevel: 6,
  level: 12,
};

/* ═══════════════════════════════════════════════════════
   1. CARD GAME BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveCardGameBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveCardGameBonuses(null);
    expect(b.hpBonus).toBe(0);
    expect(b.influenceBonus).toBe(0);
    expect(b.energyBonus).toBe(0);
    expect(b.globalAttackBonus).toBe(0);
    expect(b.globalHealthBonus).toBe(0);
    expect(b.breakdown).toHaveLength(0);
  });

  it("DeMagi gets HP bonus", () => {
    const b = resolveCardGameBonuses(DEMAGI_ENGINEER);
    expect(b.hpBonus).toBeGreaterThan(0);
  });

  it("Quarchon gets attack bonus", () => {
    const b = resolveCardGameBonuses(QUARCHON_ASSASSIN);
    expect(b.globalAttackBonus).toBeGreaterThan(0);
  });

  it("Ne-Yon gets energy bonus", () => {
    const b = resolveCardGameBonuses(NEYON_ORACLE);
    expect(b.energyBonus).toBeGreaterThan(0);
  });

  it("element affinity is set from citizen element", () => {
    const b = resolveCardGameBonuses(DEMAGI_ENGINEER);
    expect(b.elementAffinity).toBe("earth");
  });

  it("high attack attribute increases globalAttackBonus", () => {
    const low = resolveCardGameBonuses({ ...DEMAGI_ENGINEER, attrAttack: 1 });
    const high = resolveCardGameBonuses({ ...DEMAGI_ENGINEER, attrAttack: 5 });
    expect(high.globalAttackBonus).toBeGreaterThan(low.globalAttackBonus);
  });

  it("breakdown has entries for each bonus source", () => {
    const b = resolveCardGameBonuses(DEMAGI_SOLDIER);
    expect(b.breakdown.length).toBeGreaterThan(0);
    const sources = b.breakdown.map(e => e.source);
    expect(sources.some(s => s.toLowerCase().includes("species") || s.toLowerCase().includes("demagi"))).toBe(true);
  });

  it("costReductionChance is between 0 and 1", () => {
    const b = resolveCardGameBonuses(QUARCHON_ASSASSIN);
    expect(b.costReductionChance).toBeGreaterThanOrEqual(0);
    expect(b.costReductionChance).toBeLessThanOrEqual(1);
  });
});

/* ═══════════════════════════════════════════════════════
   2. TRADE EMPIRE BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveTradeEmpireBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveTradeEmpireBonuses(null);
    expect(b.combatPowerBonus).toBe(0);
    expect(b.tradePriceDiscount).toBe(0);
    expect(b.tradeCreditsBonus).toBe(0);
    expect(b.scanRangeBonus).toBe(0);
    expect(b.shieldDamageReduction).toBe(0);
    expect(b.hazardResistance).toBe(0);
    expect(b.cardDropRateBonus).toBe(0);
    expect(b.xpBonus).toBe(0);
  });

  it("DeMagi gets shield damage reduction", () => {
    const b = resolveTradeEmpireBonuses(DEMAGI_ENGINEER);
    expect(b.shieldDamageReduction).toBeGreaterThan(0);
  });

  it("Quarchon gets combat power bonus", () => {
    const b = resolveTradeEmpireBonuses(QUARCHON_ASSASSIN);
    expect(b.combatPowerBonus).toBeGreaterThan(0);
  });

  it("Ne-Yon gets scan range bonus", () => {
    const b = resolveTradeEmpireBonuses(NEYON_SPY);
    expect(b.scanRangeBonus).toBeGreaterThan(0);
  });

  it("Engineer class gets trade price discount", () => {
    const b = resolveTradeEmpireBonuses(DEMAGI_ENGINEER);
    expect(b.tradePriceDiscount).toBeGreaterThan(0);
  });

  it("high defense attribute increases shieldDamageReduction", () => {
    const low = resolveTradeEmpireBonuses({ ...DEMAGI_ENGINEER, attrDefense: 1 });
    const high = resolveTradeEmpireBonuses({ ...DEMAGI_ENGINEER, attrDefense: 5 });
    expect(high.shieldDamageReduction).toBeGreaterThan(low.shieldDamageReduction);
  });

  it("tradePriceDiscount stays below 1", () => {
    const b = resolveTradeEmpireBonuses(DEMAGI_SOLDIER);
    expect(b.tradePriceDiscount).toBeLessThan(1);
  });

  it("hazardResistance stays below 1", () => {
    const b = resolveTradeEmpireBonuses(DEMAGI_SOLDIER);
    expect(b.hazardResistance).toBeLessThan(1);
  });
});

/* ═══════════════════════════════════════════════════════
   3. FIGHT GAME BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveFightGameBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveFightGameBonuses(null);
    expect(b.attackBonus).toBe(0);
    expect(b.defenseBonus).toBe(0);
    expect(b.hpBonus).toBe(0);
    expect(b.speedBonus).toBe(0);
  });

  it("DeMagi gets HP bonus", () => {
    const b = resolveFightGameBonuses(DEMAGI_ENGINEER);
    expect(b.hpBonus).toBeGreaterThan(0);
  });

  it("Quarchon gets attack bonus", () => {
    const b = resolveFightGameBonuses(QUARCHON_ASSASSIN);
    expect(b.attackBonus).toBeGreaterThan(0);
  });

  it("Ne-Yon gets HP bonus from species + vitality", () => {
    const b = resolveFightGameBonuses(NEYON_ORACLE);
    expect(b.hpBonus).toBeGreaterThan(0);
  });

  it("Soldier class gets attack + defense", () => {
    const b = resolveFightGameBonuses(DEMAGI_SOLDIER);
    expect(b.attackBonus).toBeGreaterThan(0);
    expect(b.defenseBonus).toBeGreaterThan(0);
  });

  it("Assassin class gets attack + speed", () => {
    const b = resolveFightGameBonuses(QUARCHON_ASSASSIN);
    expect(b.attackBonus).toBeGreaterThan(0);
    expect(b.speedBonus).toBeGreaterThan(0);
  });

  it("high attack attribute increases attackBonus", () => {
    const low = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, attrAttack: 1 });
    const high = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, attrAttack: 5 });
    expect(high.attackBonus).toBeGreaterThan(low.attackBonus);
  });

  it("breakdown includes species, class, and attribute entries", () => {
    const b = resolveFightGameBonuses(DEMAGI_SOLDIER);
    expect(b.breakdown.length).toBeGreaterThan(2);
  });
});

/* ═══════════════════════════════════════════════════════
   4. CRAFTING BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveCraftingBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveCraftingBonuses(null);
    expect(b.successRateBonus).toBe(0);
    expect(b.bonusOutputChance).toBe(0);
    expect(b.dreamCostReduction).toBe(0);
  });

  it("Engineer class gets success rate bonus", () => {
    const b = resolveCraftingBonuses(DEMAGI_ENGINEER);
    expect(b.successRateBonus).toBeGreaterThan(0);
  });

  it("successRateBonus stays below 1", () => {
    const b = resolveCraftingBonuses(DEMAGI_SOLDIER);
    expect(b.successRateBonus).toBeLessThan(1);
  });

  it("breakdown has entries", () => {
    const b = resolveCraftingBonuses(NEYON_ORACLE);
    expect(b.breakdown.length).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════
   5. EXPLORATION BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveExplorationBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveExplorationBonuses(null);
    expect(b.discoveryXpBonus).toBe(0);
    expect(b.hiddenItemChance).toBe(0);
    expect(b.extraPuzzleHints).toBe(0);
    expect(b.easterEggBonus).toBe(0);
    expect(b.dreamBonus).toBe(0);
    expect(b.rarityUpgradeChance).toBe(0);
  });

  it("DeMagi gets dream bonus", () => {
    const b = resolveExplorationBonuses(DEMAGI_ENGINEER);
    expect(b.dreamBonus).toBeGreaterThan(0);
  });

  it("Quarchon gets rarity upgrade chance", () => {
    const b = resolveExplorationBonuses(QUARCHON_ASSASSIN);
    expect(b.rarityUpgradeChance).toBeGreaterThan(0);
  });

  it("Ne-Yon gets both dream and rarity", () => {
    const b = resolveExplorationBonuses(NEYON_ORACLE);
    expect(b.dreamBonus).toBeGreaterThan(0);
    expect(b.rarityUpgradeChance).toBeGreaterThan(0);
  });

  it("Oracle class gets extra dream bonus", () => {
    const oracle = resolveExplorationBonuses(NEYON_ORACLE);
    const spy = resolveExplorationBonuses(NEYON_SPY);
    expect(oracle.dreamBonus).toBeGreaterThan(spy.dreamBonus);
  });

  it("Spy class gets extra rarity upgrade", () => {
    const spy = resolveExplorationBonuses(NEYON_SPY);
    expect(spy.rarityUpgradeChance).toBeGreaterThan(0);
  });

  it("citizen level increases dream bonus", () => {
    const low = resolveExplorationBonuses({ ...DEMAGI_ENGINEER, level: 1 });
    const high = resolveExplorationBonuses({ ...DEMAGI_ENGINEER, level: 20 });
    expect(high.dreamBonus).toBeGreaterThan(low.dreamBonus);
  });
});

/* ═══════════════════════════════════════════════════════
   6. CROSS-SYSTEM CONSISTENCY
   ═══════════════════════════════════════════════════════ */
describe("Cross-system trait consistency", () => {
  it("all resolvers return breakdown arrays", () => {
    const citizen = DEMAGI_SOLDIER;
    expect(resolveCardGameBonuses(citizen).breakdown).toBeInstanceOf(Array);
    expect(resolveTradeEmpireBonuses(citizen).breakdown).toBeInstanceOf(Array);
    expect(resolveFightGameBonuses(citizen).breakdown).toBeInstanceOf(Array);
    expect(resolveCraftingBonuses(citizen).breakdown).toBeInstanceOf(Array);
    expect(resolveExplorationBonuses(citizen).breakdown).toBeInstanceOf(Array);
  });

  it("all resolvers handle null citizen gracefully", () => {
    expect(() => resolveCardGameBonuses(null)).not.toThrow();
    expect(() => resolveTradeEmpireBonuses(null)).not.toThrow();
    expect(() => resolveFightGameBonuses(null)).not.toThrow();
    expect(() => resolveCraftingBonuses(null)).not.toThrow();
    expect(() => resolveExplorationBonuses(null)).not.toThrow();
  });

  it("species choice creates meaningfully different builds", () => {
    const demagi = resolveCardGameBonuses(DEMAGI_ENGINEER);
    const quarchon = resolveCardGameBonuses({ ...DEMAGI_ENGINEER, species: "quarchon" });
    const neyon = resolveCardGameBonuses({ ...DEMAGI_ENGINEER, species: "neyon" });
    const hps = [demagi.hpBonus, quarchon.hpBonus, neyon.hpBonus];
    const attacks = [demagi.globalAttackBonus, quarchon.globalAttackBonus, neyon.globalAttackBonus];
    expect(new Set(hps).size).toBeGreaterThan(1);
    expect(new Set(attacks).size).toBeGreaterThan(1);
  });

  it("class choice creates meaningfully different builds", () => {
    const engineer = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, characterClass: "engineer" });
    const assassin = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, characterClass: "assassin" });
    const soldier = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, characterClass: "soldier" });
    expect(assassin.attackBonus).toBeGreaterThan(engineer.attackBonus);
    expect(soldier.defenseBonus).toBeGreaterThan(assassin.defenseBonus);
  });

  it("max-level citizen gives significant but not game-breaking bonuses", () => {
    const maxCitizen: CitizenData = {
      species: "demagi", characterClass: "soldier", alignment: "order",
      element: "earth", attrAttack: 5, attrDefense: 5, attrVitality: 5,
      classLevel: 10, level: 50,
    };
    const fight = resolveFightGameBonuses(maxCitizen);
    expect(fight.attackBonus).toBeGreaterThan(5);
    expect(fight.attackBonus).toBeLessThan(100);
    expect(fight.hpBonus).toBeGreaterThan(10);
    expect(fight.hpBonus).toBeLessThan(200);
  });
});

/* ═══════════════════════════════════════════════════════
   7. ROUTER INTEGRATION VERIFICATION
   ═══════════════════════════════════════════════════════ */
describe("Router integration verification", () => {
  it("tradeWars router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("fetchCitizenData");
    expect(content).toContain("resolveTradeEmpireBonuses");
  });

  it("cardGame router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/cardGame.ts", "utf-8");
    expect(content).toContain("fetchCitizenData");
    expect(content).toContain("resolveCardGameBonuses");
  });

  it("crafting router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/crafting.ts", "utf-8");
    expect(content).toContain("fetchCitizenData");
    expect(content).toContain("resolveCraftingBonuses");
  });

  it("contentReward router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/contentReward.ts", "utf-8");
    expect(content).toContain("resolveExplorationBonuses");
  });

  it("fightLeaderboard router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/fightLeaderboard.ts", "utf-8");
    expect(content).toContain("resolveFightGameBonuses");
  });

  it("citizen router has getAllTraitBonuses endpoint", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/citizen.ts", "utf-8");
    expect(content).toContain("getAllTraitBonuses");
    expect(content).toContain("getPlayerTraitBonuses");
  });

  it("FightPage.tsx uses citizen fight bonuses", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/client/src/pages/FightPage.tsx", "utf-8");
    expect(content).toContain("citizenFightBonuses");
    expect(content).toContain("getAllTraitBonuses");
  });

  it("tradeWars combat uses trait-boosted player power", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("tb.combatPowerBonus");
    expect(content).toContain("tb.shieldDamageReduction");
    expect(content).toContain("tb.cardDropRateBonus");
  });

  it("tradeWars trade uses trait-based price discount", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("tradeTb.tradePriceDiscount");
    expect(content).toContain("discountedPrice");
  });

  it("tradeWars scan uses trait-based scan range bonus", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("scanTb.scanRangeBonus");
  });

  it("tradeWars hazard uses trait-based hazard resistance", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("hazardTb.hazardResistance");
  });

  it("crafting uses trait-boosted success rate", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/crafting.ts", "utf-8");
    expect(content).toContain("craftTb.successRateBonus");
    expect(content).toContain("boostedRate");
  });

  it("contentReward uses trait-boosted Dream and rarity", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/contentReward.ts", "utf-8");
    expect(content).toContain("exploreTb.dreamBonus");
    expect(content).toContain("exploreTb.rarityUpgradeChance");
  });

  it("fightLeaderboard uses trait-adjusted K-factor", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("apps/server/routers/fightLeaderboard.ts", "utf-8");
    expect(content).toContain("adjustedK");
    expect(content).toContain("traitKBonus");
  });
});
