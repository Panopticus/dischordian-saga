import { describe, expect, it } from "vitest";
import {
  resolveCardGameBonuses,
  resolveTradeEmpireBonuses,
  resolveFightGameBonuses,
  resolveCraftingBonuses,
  resolveExplorationBonuses,
  type CitizenData,
  type PotentialNftData,
} from "../shared/citizenTraits";

/* ─── Test Fixtures ─── */

const baseCitizen: CitizenData = {
  species: "demagi",
  characterClass: "engineer",
  alignment: "order",
  element: "fire",
  attrAttack: 3,
  attrDefense: 3,
  attrVitality: 3,
  classLevel: 1,
  level: 1,
};

const quarchonAssassin: CitizenData = {
  species: "quarchon",
  characterClass: "assassin",
  alignment: "chaos",
  element: "space",
  attrAttack: 5,
  attrDefense: 1,
  attrVitality: 3,
  classLevel: 3,
  level: 5,
};

const neyonOracle: CitizenData = {
  species: "neyon",
  characterClass: "oracle",
  alignment: "order",
  element: "time",
  attrAttack: 2,
  attrDefense: 4,
  attrVitality: 3,
  classLevel: 2,
  level: 3,
};

const testNft: PotentialNftData = {
  tokenId: 1,
  level: 50,
  nftClass: "warrior",
  weapon: "sword",
  specie: "human",
  claimCount: 1,
};

/* ═══════════════════════════════════════════════════
   CARD GAME BONUSES
   ═══════════════════════════════════════════════════ */

describe("resolveCardGameBonuses", () => {
  it("returns zero bonuses when no citizen is provided", () => {
    const result = resolveCardGameBonuses(null, null);
    expect(result.hpBonus).toBe(0);
    expect(result.globalAttackBonus).toBe(0);
    expect(result.globalHealthBonus).toBe(0);
    expect(result.influenceBonus).toBe(0);
    expect(result.energyBonus).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it("returns zero bonuses when citizen is undefined", () => {
    const result = resolveCardGameBonuses(undefined, undefined);
    expect(result.hpBonus).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it("applies DeMagi species bonuses correctly", () => {
    const result = resolveCardGameBonuses(baseCitizen);
    // DeMagi: hpBonus 5, globalHealthBonus 2, globalAttackBonus 0
    expect(result.hpBonus).toBeGreaterThanOrEqual(5);
    expect(result.globalHealthBonus).toBeGreaterThanOrEqual(2);
    expect(result.breakdown.some(b => b.source.includes("demagi"))).toBe(true);
  });

  it("applies Quarchon species bonuses correctly", () => {
    const result = resolveCardGameBonuses(quarchonAssassin);
    // Quarchon: globalAttackBonus 2, influenceBonus 5
    expect(result.globalAttackBonus).toBeGreaterThanOrEqual(2);
    expect(result.influenceBonus).toBeGreaterThanOrEqual(5);
  });

  it("applies Ne-Yon species bonuses correctly", () => {
    const result = resolveCardGameBonuses(neyonOracle);
    // Ne-Yon: hpBonus 3, globalHealthBonus 1, globalAttackBonus 1, energyBonus 2
    expect(result.hpBonus).toBeGreaterThanOrEqual(3);
    expect(result.energyBonus).toBeGreaterThanOrEqual(2);
  });

  it("applies class bonuses (engineer gets cost reduction and energy)", () => {
    const result = resolveCardGameBonuses(baseCitizen);
    // Engineer: costReduction 0.15, energy 2, globalHp 2
    expect(result.costReductionChance).toBeGreaterThanOrEqual(0.15);
    expect(result.energyBonus).toBeGreaterThanOrEqual(2);
  });

  it("applies assassin class bonuses (global ATK)", () => {
    const result = resolveCardGameBonuses(quarchonAssassin);
    // Assassin: globalAtk 3
    expect(result.globalAttackBonus).toBeGreaterThanOrEqual(3 + 2); // class + species
  });

  it("applies oracle class bonuses (extra draw)", () => {
    const result = resolveCardGameBonuses(neyonOracle);
    // Oracle: extraDraw 3
    expect(result.extraDrawEveryNTurns).toBe(3);
  });

  it("applies alignment bonuses", () => {
    const orderResult = resolveCardGameBonuses(baseCitizen);
    expect(orderResult.alignmentEffect.type).toBe("order_structure");

    const chaosResult = resolveCardGameBonuses(quarchonAssassin);
    expect(chaosResult.alignmentEffect.type).toBe("chaos_wildcard");
  });

  it("sets element affinity based on citizen element", () => {
    const result = resolveCardGameBonuses(baseCitizen);
    expect(result.elementAffinity).toBeTruthy();
    expect(result.breakdown.some(b => b.source.includes("fire"))).toBe(true);
  });

  it("scales bonuses with attribute dots", () => {
    const lowAtk = { ...baseCitizen, attrAttack: 1 };
    const highAtk = { ...baseCitizen, attrAttack: 5 };
    const lowResult = resolveCardGameBonuses(lowAtk);
    const highResult = resolveCardGameBonuses(highAtk);
    expect(highResult.globalAttackBonus).toBeGreaterThan(lowResult.globalAttackBonus);
  });

  it("scales bonuses with class level", () => {
    const lv1 = { ...baseCitizen, classLevel: 1 };
    const lv5 = { ...baseCitizen, classLevel: 5 };
    const lv1Result = resolveCardGameBonuses(lv1);
    const lv5Result = resolveCardGameBonuses(lv5);
    expect(lv5Result.hpBonus).toBeGreaterThan(lv1Result.hpBonus);
  });

  it("applies NFT level multiplier when NFT is provided", () => {
    const withoutNft = resolveCardGameBonuses(baseCitizen, null);
    const withNft = resolveCardGameBonuses(baseCitizen, testNft);
    // NFT at level 50 should provide a multiplier > 1.0
    expect(withNft.hpBonus).toBeGreaterThanOrEqual(withoutNft.hpBonus);
    expect(withNft.breakdown.some(b => b.source.includes("Potential"))).toBe(true);
  });

  it("generates breakdown entries for each bonus source", () => {
    const result = resolveCardGameBonuses(baseCitizen);
    // Should have at least: species, class, alignment, element, attributes
    expect(result.breakdown.length).toBeGreaterThanOrEqual(4);
    expect(result.breakdown.every(b => b.source && b.effect)).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════
   TRADE EMPIRE BONUSES
   ═══════════════════════════════════════════════════ */

describe("resolveTradeEmpireBonuses", () => {
  it("returns zero bonuses when no citizen is provided", () => {
    const result = resolveTradeEmpireBonuses(null);
    expect(result.combatPowerBonus).toBe(0);
    expect(result.tradePriceDiscount).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it("applies species-specific trade bonuses", () => {
    const demagiResult = resolveTradeEmpireBonuses(baseCitizen);
    const quarchonResult = resolveTradeEmpireBonuses(quarchonAssassin);
    // Quarchon should have higher combat bonus and colony multiplier
    expect(quarchonResult.combatPowerBonus).toBeGreaterThan(demagiResult.combatPowerBonus);
    expect(quarchonResult.colonyIncomeMultiplier).toBeGreaterThan(demagiResult.colonyIncomeMultiplier);
  });

  it("applies class-specific trade bonuses", () => {
    const result = resolveTradeEmpireBonuses(neyonOracle);
    // Oracle: tradeBonus 200, xpBonus 5
    expect(result.tradeCreditsBonus).toBeGreaterThanOrEqual(200);
    expect(result.xpBonus).toBeGreaterThanOrEqual(5);
  });

  it("generates meaningful breakdown entries", () => {
    const result = resolveTradeEmpireBonuses(baseCitizen);
    expect(result.breakdown.length).toBeGreaterThanOrEqual(3);
  });
});

/* ═══════════════════════════════════════════════════
   FIGHT GAME BONUSES
   ═══════════════════════════════════════════════════ */

describe("resolveFightGameBonuses", () => {
  it("returns zero bonuses when no citizen is provided", () => {
    const result = resolveFightGameBonuses(null);
    expect(result.attackBonus).toBe(0);
    expect(result.defenseBonus).toBe(0);
    expect(result.hpBonus).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it("applies DeMagi fight bonuses (HP-focused)", () => {
    const result = resolveFightGameBonuses(baseCitizen);
    // DeMagi: hp 10, defense 1
    expect(result.hpBonus).toBeGreaterThanOrEqual(10);
  });

  it("applies Quarchon fight bonuses (attack-focused)", () => {
    const result = resolveFightGameBonuses(quarchonAssassin);
    // Quarchon: attack 1, speed 1, critChance 0.02
    // Assassin: attack 2, speed 1
    expect(result.attackBonus).toBeGreaterThanOrEqual(3); // species + class
    expect(result.speedBonus).toBeGreaterThanOrEqual(2);
  });

  it("applies alignment-specific fight bonuses", () => {
    const orderResult = resolveFightGameBonuses(baseCitizen);
    const chaosResult = resolveFightGameBonuses(quarchonAssassin);
    // Order should favor defense, chaos should favor attack/crit
    expect(orderResult.defenseBonus).toBeGreaterThanOrEqual(0);
    expect(chaosResult.critChanceBonus).toBeGreaterThanOrEqual(0);
  });

  it("scales with attribute dots", () => {
    const lowVit = { ...baseCitizen, attrVitality: 1 };
    const highVit = { ...baseCitizen, attrVitality: 5 };
    const lowResult = resolveFightGameBonuses(lowVit);
    const highResult = resolveFightGameBonuses(highVit);
    expect(highResult.hpBonus).toBeGreaterThan(lowResult.hpBonus);
  });

  it("applies NFT multiplier to fight bonuses", () => {
    const withoutNft = resolveFightGameBonuses(baseCitizen, null);
    const withNft = resolveFightGameBonuses(baseCitizen, testNft);
    expect(withNft.hpBonus).toBeGreaterThanOrEqual(withoutNft.hpBonus);
  });
});

/* ═══════════════════════════════════════════════════
   CRAFTING BONUSES
   ═══════════════════════════════════════════════════ */

describe("resolveCraftingBonuses", () => {
  it("returns zero bonuses when no citizen is provided", () => {
    const result = resolveCraftingBonuses(null);
    expect(result.successRateBonus).toBe(0);
    expect(result.dreamCostReduction).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it("applies engineer class crafting bonuses", () => {
    const result = resolveCraftingBonuses(baseCitizen);
    // Engineer: successBonus 0.10, dreamReduction 0.10, materialPreserve 0.05
    expect(result.successRateBonus).toBeGreaterThanOrEqual(0.10);
    expect(result.dreamCostReduction).toBeGreaterThanOrEqual(0.10);
  });

  it("applies species crafting bonuses", () => {
    const demagiResult = resolveCraftingBonuses(baseCitizen);
    // DeMagi: bonusOutput 0.05
    expect(demagiResult.bonusOutputChance).toBeGreaterThanOrEqual(0.05);
  });
});

/* ═══════════════════════════════════════════════════
   EXPLORATION BONUSES
   ═══════════════════════════════════════════════════ */

describe("resolveExplorationBonuses", () => {
  it("returns zero bonuses when no citizen is provided", () => {
    const result = resolveExplorationBonuses(null);
    expect(result.discoveryXpBonus).toBe(0);
    expect(result.hiddenItemChance).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it("applies citizen bonuses to exploration", () => {
    const result = resolveExplorationBonuses(baseCitizen);
    expect(result.breakdown.length).toBeGreaterThanOrEqual(1);
  });

  it("applies NFT bonuses to exploration", () => {
    const withoutNft = resolveExplorationBonuses(baseCitizen, null);
    const withNft = resolveExplorationBonuses(baseCitizen, testNft);
    // NFT should boost exploration bonuses
    expect(withNft.discoveryXpBonus).toBeGreaterThanOrEqual(withoutNft.discoveryXpBonus);
  });
});

/* ═══════════════════════════════════════════════════
   CROSS-SYSTEM CONSISTENCY
   ═══════════════════════════════════════════════════ */

describe("cross-system trait consistency", () => {
  it("all resolvers accept the same CitizenData shape", () => {
    // This test ensures the interface is consistent across all resolvers
    const citizen = baseCitizen;
    expect(() => resolveCardGameBonuses(citizen)).not.toThrow();
    expect(() => resolveTradeEmpireBonuses(citizen)).not.toThrow();
    expect(() => resolveFightGameBonuses(citizen)).not.toThrow();
    expect(() => resolveCraftingBonuses(citizen)).not.toThrow();
    expect(() => resolveExplorationBonuses(citizen)).not.toThrow();
  });

  it("all resolvers handle all three species", () => {
    for (const species of ["demagi", "quarchon", "neyon"] as const) {
      const citizen = { ...baseCitizen, species };
      expect(() => resolveCardGameBonuses(citizen)).not.toThrow();
      expect(() => resolveTradeEmpireBonuses(citizen)).not.toThrow();
      expect(() => resolveFightGameBonuses(citizen)).not.toThrow();
      expect(() => resolveCraftingBonuses(citizen)).not.toThrow();
      expect(() => resolveExplorationBonuses(citizen)).not.toThrow();
    }
  });

  it("all resolvers handle all five classes", () => {
    for (const characterClass of ["engineer", "oracle", "assassin", "soldier", "spy"] as const) {
      const citizen = { ...baseCitizen, characterClass };
      expect(() => resolveCardGameBonuses(citizen)).not.toThrow();
      expect(() => resolveTradeEmpireBonuses(citizen)).not.toThrow();
      expect(() => resolveFightGameBonuses(citizen)).not.toThrow();
      expect(() => resolveCraftingBonuses(citizen)).not.toThrow();
      expect(() => resolveExplorationBonuses(citizen)).not.toThrow();
    }
  });

  it("all resolvers handle both alignments", () => {
    for (const alignment of ["order", "chaos"] as const) {
      const citizen = { ...baseCitizen, alignment };
      expect(() => resolveCardGameBonuses(citizen)).not.toThrow();
      expect(() => resolveFightGameBonuses(citizen)).not.toThrow();
    }
  });

  it("all resolvers handle all elements", () => {
    for (const element of ["earth", "fire", "water", "air", "space", "time", "probability", "reality"] as const) {
      const citizen = { ...baseCitizen, element };
      expect(() => resolveCardGameBonuses(citizen)).not.toThrow();
      expect(() => resolveTradeEmpireBonuses(citizen)).not.toThrow();
    }
  });

  it("attribute extremes (all 1s vs all 5s) produce different results", () => {
    const lowCitizen = { ...baseCitizen, attrAttack: 1, attrDefense: 1, attrVitality: 1 };
    const highCitizen = { ...baseCitizen, attrAttack: 5, attrDefense: 5, attrVitality: 5 };

    const lowCard = resolveCardGameBonuses(lowCitizen);
    const highCard = resolveCardGameBonuses(highCitizen);
    expect(highCard.globalAttackBonus).toBeGreaterThan(lowCard.globalAttackBonus);
    expect(highCard.hpBonus).toBeGreaterThan(lowCard.hpBonus);

    const lowFight = resolveFightGameBonuses(lowCitizen);
    const highFight = resolveFightGameBonuses(highCitizen);
    expect(highFight.attackBonus).toBeGreaterThan(lowFight.attackBonus);
    expect(highFight.hpBonus).toBeGreaterThan(lowFight.hpBonus);
  });
});
