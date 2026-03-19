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
  nftLevelMultiplier,
  type CitizenData,
  type PotentialNftData,
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

const LOW_LEVEL_NFT: PotentialNftData = {
  tokenId: 1,
  level: 5,
  nftClass: "Spy",
  weapon: "Blade",
  specie: "DeMagi",
  claimCount: 1,
};

const HIGH_LEVEL_NFT: PotentialNftData = {
  tokenId: 42,
  level: 80,
  nftClass: "Oracle",
  weapon: "Staff",
  specie: "Quarchon",
  claimCount: 4,
};

const MAX_NFT: PotentialNftData = {
  tokenId: 100,
  level: 100,
  nftClass: "Assassin",
  weapon: "Dagger",
  specie: "Ne-Yon",
  claimCount: 10,
};

/* ═══════════════════════════════════════════════════════
   1. NFT LEVEL MULTIPLIER
   ═══════════════════════════════════════════════════════ */
describe("nftLevelMultiplier", () => {
  it("returns 1.0 for null/undefined NFT", () => {
    expect(nftLevelMultiplier(null)).toBe(1.0);
    expect(nftLevelMultiplier(undefined)).toBe(1.0);
  });

  it("returns 1.0+ for low-level NFT", () => {
    const mult = nftLevelMultiplier(LOW_LEVEL_NFT);
    expect(mult).toBeGreaterThan(1.0);
    expect(mult).toBeLessThan(1.15);
  });

  it("returns higher multiplier for high-level NFT", () => {
    const low = nftLevelMultiplier(LOW_LEVEL_NFT);
    const high = nftLevelMultiplier(HIGH_LEVEL_NFT);
    expect(high).toBeGreaterThan(low);
  });

  it("caps at ~1.6 for max level + max claims", () => {
    const mult = nftLevelMultiplier(MAX_NFT);
    expect(mult).toBeGreaterThanOrEqual(1.4);
    expect(mult).toBeLessThanOrEqual(1.7);
  });

  it("claim count adds bonus", () => {
    const single = nftLevelMultiplier({ ...LOW_LEVEL_NFT, claimCount: 1 });
    const multi = nftLevelMultiplier({ ...LOW_LEVEL_NFT, claimCount: 5 });
    expect(multi).toBeGreaterThan(single);
  });
});

/* ═══════════════════════════════════════════════════════
   2. CARD GAME BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveCardGameBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveCardGameBonuses(null, null);
    expect(b.hpBonus).toBe(0);
    expect(b.influenceBonus).toBe(0);
    expect(b.energyBonus).toBe(0);
    expect(b.globalAttackBonus).toBe(0);
    expect(b.globalHealthBonus).toBe(0);
    expect(b.breakdown).toHaveLength(0);
  });

  it("DeMagi gets HP bonus", () => {
    const b = resolveCardGameBonuses(DEMAGI_ENGINEER, null);
    expect(b.hpBonus).toBeGreaterThan(0);
  });

  it("Quarchon gets attack bonus", () => {
    const b = resolveCardGameBonuses(QUARCHON_ASSASSIN, null);
    expect(b.globalAttackBonus).toBeGreaterThan(0);
  });

  it("Ne-Yon gets energy bonus", () => {
    const b = resolveCardGameBonuses(NEYON_ORACLE, null);
    expect(b.energyBonus).toBeGreaterThan(0);
  });

  it("element affinity is set from citizen element", () => {
    const b = resolveCardGameBonuses(DEMAGI_ENGINEER, null);
    expect(b.elementAffinity).toBe("earth");
  });

  it("NFT multiplier scales bonuses", () => {
    const without = resolveCardGameBonuses(DEMAGI_SOLDIER, null);
    const withNft = resolveCardGameBonuses(DEMAGI_SOLDIER, HIGH_LEVEL_NFT);
    expect(withNft.hpBonus).toBeGreaterThan(without.hpBonus);
    expect(withNft.globalAttackBonus).toBeGreaterThanOrEqual(without.globalAttackBonus);
  });

  it("high attack attribute increases globalAttackBonus", () => {
    const low = resolveCardGameBonuses({ ...DEMAGI_ENGINEER, attrAttack: 1 }, null);
    const high = resolveCardGameBonuses({ ...DEMAGI_ENGINEER, attrAttack: 5 }, null);
    expect(high.globalAttackBonus).toBeGreaterThan(low.globalAttackBonus);
  });

  it("breakdown has entries for each bonus source", () => {
    const b = resolveCardGameBonuses(DEMAGI_SOLDIER, HIGH_LEVEL_NFT);
    expect(b.breakdown.length).toBeGreaterThan(0);
    const sources = b.breakdown.map(e => e.source);
    // Should have species, class, and NFT entries
    expect(sources.some(s => s.toLowerCase().includes("species") || s.toLowerCase().includes("demagi"))).toBe(true);
  });

  it("costReductionChance is between 0 and 1", () => {
    const b = resolveCardGameBonuses(QUARCHON_ASSASSIN, MAX_NFT);
    expect(b.costReductionChance).toBeGreaterThanOrEqual(0);
    expect(b.costReductionChance).toBeLessThanOrEqual(1);
  });
});

/* ═══════════════════════════════════════════════════════
   3. TRADE EMPIRE BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveTradeEmpireBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveTradeEmpireBonuses(null, null);
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
    const b = resolveTradeEmpireBonuses(DEMAGI_ENGINEER, null);
    expect(b.shieldDamageReduction).toBeGreaterThan(0);
  });

  it("Quarchon gets combat power bonus", () => {
    const b = resolveTradeEmpireBonuses(QUARCHON_ASSASSIN, null);
    expect(b.combatPowerBonus).toBeGreaterThan(0);
  });

  it("Ne-Yon gets scan range bonus", () => {
    const b = resolveTradeEmpireBonuses(NEYON_SPY, null);
    expect(b.scanRangeBonus).toBeGreaterThan(0);
  });

  it("Engineer class gets trade price discount", () => {
    const b = resolveTradeEmpireBonuses(DEMAGI_ENGINEER, null);
    expect(b.tradePriceDiscount).toBeGreaterThan(0);
  });

  it("high defense attribute increases shieldDamageReduction", () => {
    const low = resolveTradeEmpireBonuses({ ...DEMAGI_ENGINEER, attrDefense: 1 }, null);
    const high = resolveTradeEmpireBonuses({ ...DEMAGI_ENGINEER, attrDefense: 5 }, null);
    expect(high.shieldDamageReduction).toBeGreaterThan(low.shieldDamageReduction);
  });

  it("NFT multiplier scales bonuses", () => {
    const without = resolveTradeEmpireBonuses(QUARCHON_ASSASSIN, null);
    const withNft = resolveTradeEmpireBonuses(QUARCHON_ASSASSIN, HIGH_LEVEL_NFT);
    expect(withNft.combatPowerBonus).toBeGreaterThan(without.combatPowerBonus);
  });

  it("tradePriceDiscount stays below 1", () => {
    const b = resolveTradeEmpireBonuses(DEMAGI_SOLDIER, MAX_NFT);
    expect(b.tradePriceDiscount).toBeLessThan(1);
  });

  it("hazardResistance stays below 1", () => {
    const b = resolveTradeEmpireBonuses(DEMAGI_SOLDIER, MAX_NFT);
    expect(b.hazardResistance).toBeLessThan(1);
  });
});

/* ═══════════════════════════════════════════════════════
   4. FIGHT GAME BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveFightGameBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveFightGameBonuses(null, null);
    expect(b.attackBonus).toBe(0);
    expect(b.defenseBonus).toBe(0);
    expect(b.hpBonus).toBe(0);
    expect(b.speedBonus).toBe(0);
  });

  it("DeMagi gets HP bonus", () => {
    const b = resolveFightGameBonuses(DEMAGI_ENGINEER, null);
    expect(b.hpBonus).toBeGreaterThan(0);
  });

  it("Quarchon gets attack bonus", () => {
    const b = resolveFightGameBonuses(QUARCHON_ASSASSIN, null);
    expect(b.attackBonus).toBeGreaterThan(0);
  });

  it("Ne-Yon gets HP bonus from species + vitality", () => {
    const b = resolveFightGameBonuses(NEYON_ORACLE, null);
    expect(b.hpBonus).toBeGreaterThan(0);
  });

  it("Soldier class gets attack + defense", () => {
    const b = resolveFightGameBonuses(DEMAGI_SOLDIER, null);
    expect(b.attackBonus).toBeGreaterThan(0);
    expect(b.defenseBonus).toBeGreaterThan(0);
  });

  it("Assassin class gets attack + speed", () => {
    const b = resolveFightGameBonuses(QUARCHON_ASSASSIN, null);
    expect(b.attackBonus).toBeGreaterThan(0);
    expect(b.speedBonus).toBeGreaterThan(0);
  });

  it("high attack attribute increases attackBonus", () => {
    const low = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, attrAttack: 1 }, null);
    const high = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, attrAttack: 5 }, null);
    expect(high.attackBonus).toBeGreaterThan(low.attackBonus);
  });

  it("NFT multiplier scales bonuses", () => {
    const without = resolveFightGameBonuses(DEMAGI_SOLDIER, null);
    const withNft = resolveFightGameBonuses(DEMAGI_SOLDIER, HIGH_LEVEL_NFT);
    expect(withNft.attackBonus).toBeGreaterThan(without.attackBonus);
    expect(withNft.hpBonus).toBeGreaterThan(without.hpBonus);
  });

  it("breakdown includes species, class, and attribute entries", () => {
    const b = resolveFightGameBonuses(DEMAGI_SOLDIER, HIGH_LEVEL_NFT);
    expect(b.breakdown.length).toBeGreaterThan(2);
  });
});

/* ═══════════════════════════════════════════════════════
   5. CRAFTING BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveCraftingBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveCraftingBonuses(null, null);
    expect(b.successRateBonus).toBe(0);
    expect(b.bonusOutputChance).toBe(0);
    expect(b.dreamCostReduction).toBe(0);
  });

  it("Engineer class gets success rate bonus", () => {
    const b = resolveCraftingBonuses(DEMAGI_ENGINEER, null);
    expect(b.successRateBonus).toBeGreaterThan(0);
  });

  it("NFT multiplier scales crafting bonuses", () => {
    const without = resolveCraftingBonuses(DEMAGI_ENGINEER, null);
    const withNft = resolveCraftingBonuses(DEMAGI_ENGINEER, HIGH_LEVEL_NFT);
    expect(withNft.successRateBonus).toBeGreaterThan(without.successRateBonus);
  });

  it("successRateBonus stays below 1", () => {
    const b = resolveCraftingBonuses(DEMAGI_SOLDIER, MAX_NFT);
    expect(b.successRateBonus).toBeLessThan(1);
  });

  it("breakdown has entries", () => {
    const b = resolveCraftingBonuses(NEYON_ORACLE, LOW_LEVEL_NFT);
    expect(b.breakdown.length).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════
   6. EXPLORATION BONUSES
   ═══════════════════════════════════════════════════════ */
describe("resolveExplorationBonuses", () => {
  it("returns zero bonuses for null citizen", () => {
    const b = resolveExplorationBonuses(null, null);
    expect(b.discoveryXpBonus).toBe(0);
    expect(b.hiddenItemChance).toBe(0);
    expect(b.extraPuzzleHints).toBe(0);
    expect(b.easterEggBonus).toBe(0);
    expect(b.dreamBonus).toBe(0);
    expect(b.rarityUpgradeChance).toBe(0);
  });

  it("DeMagi gets dream bonus", () => {
    const b = resolveExplorationBonuses(DEMAGI_ENGINEER, null);
    expect(b.dreamBonus).toBeGreaterThan(0);
  });

  it("Quarchon gets rarity upgrade chance", () => {
    const b = resolveExplorationBonuses(QUARCHON_ASSASSIN, null);
    expect(b.rarityUpgradeChance).toBeGreaterThan(0);
  });

  it("Ne-Yon gets both dream and rarity", () => {
    const b = resolveExplorationBonuses(NEYON_ORACLE, null);
    expect(b.dreamBonus).toBeGreaterThan(0);
    expect(b.rarityUpgradeChance).toBeGreaterThan(0);
  });

  it("Oracle class gets extra dream bonus", () => {
    const oracle = resolveExplorationBonuses(NEYON_ORACLE, null);
    const spy = resolveExplorationBonuses(NEYON_SPY, null);
    expect(oracle.dreamBonus).toBeGreaterThan(spy.dreamBonus);
  });

  it("Spy class gets extra rarity upgrade", () => {
    const spy = resolveExplorationBonuses(NEYON_SPY, null);
    expect(spy.rarityUpgradeChance).toBeGreaterThan(0);
  });

  it("citizen level increases dream bonus", () => {
    const low = resolveExplorationBonuses({ ...DEMAGI_ENGINEER, level: 1 }, null);
    const high = resolveExplorationBonuses({ ...DEMAGI_ENGINEER, level: 20 }, null);
    expect(high.dreamBonus).toBeGreaterThan(low.dreamBonus);
  });

  it("NFT multiplier scales exploration bonuses", () => {
    const without = resolveExplorationBonuses(DEMAGI_ENGINEER, null);
    const withNft = resolveExplorationBonuses(DEMAGI_ENGINEER, HIGH_LEVEL_NFT);
    expect(withNft.discoveryXpBonus).toBeGreaterThan(without.discoveryXpBonus);
    expect(withNft.dreamBonus).toBeGreaterThan(without.dreamBonus);
  });

  it("rarityUpgradeChance capped at 0.5", () => {
    const b = resolveExplorationBonuses(QUARCHON_ASSASSIN, MAX_NFT);
    expect(b.rarityUpgradeChance).toBeLessThanOrEqual(0.5);
  });
});

/* ═══════════════════════════════════════════════════════
   7. CROSS-SYSTEM CONSISTENCY
   ═══════════════════════════════════════════════════════ */
describe("Cross-system trait consistency", () => {
  it("all resolvers return breakdown arrays", () => {
    const citizen = DEMAGI_SOLDIER;
    const nft = HIGH_LEVEL_NFT;
    expect(resolveCardGameBonuses(citizen, nft).breakdown).toBeInstanceOf(Array);
    expect(resolveTradeEmpireBonuses(citizen, nft).breakdown).toBeInstanceOf(Array);
    expect(resolveFightGameBonuses(citizen, nft).breakdown).toBeInstanceOf(Array);
    expect(resolveCraftingBonuses(citizen, nft).breakdown).toBeInstanceOf(Array);
    expect(resolveExplorationBonuses(citizen, nft).breakdown).toBeInstanceOf(Array);
  });

  it("all resolvers handle null citizen gracefully", () => {
    expect(() => resolveCardGameBonuses(null, HIGH_LEVEL_NFT)).not.toThrow();
    expect(() => resolveTradeEmpireBonuses(null, HIGH_LEVEL_NFT)).not.toThrow();
    expect(() => resolveFightGameBonuses(null, HIGH_LEVEL_NFT)).not.toThrow();
    expect(() => resolveCraftingBonuses(null, HIGH_LEVEL_NFT)).not.toThrow();
    expect(() => resolveExplorationBonuses(null, HIGH_LEVEL_NFT)).not.toThrow();
  });

  it("all resolvers handle null NFT gracefully", () => {
    expect(() => resolveCardGameBonuses(DEMAGI_SOLDIER, null)).not.toThrow();
    expect(() => resolveTradeEmpireBonuses(DEMAGI_SOLDIER, null)).not.toThrow();
    expect(() => resolveFightGameBonuses(DEMAGI_SOLDIER, null)).not.toThrow();
    expect(() => resolveCraftingBonuses(DEMAGI_SOLDIER, null)).not.toThrow();
    expect(() => resolveExplorationBonuses(DEMAGI_SOLDIER, null)).not.toThrow();
  });

  it("all resolvers handle both null gracefully", () => {
    expect(() => resolveCardGameBonuses(null, null)).not.toThrow();
    expect(() => resolveTradeEmpireBonuses(null, null)).not.toThrow();
    expect(() => resolveFightGameBonuses(null, null)).not.toThrow();
    expect(() => resolveCraftingBonuses(null, null)).not.toThrow();
    expect(() => resolveExplorationBonuses(null, null)).not.toThrow();
  });

  it("species choice creates meaningfully different builds", () => {
    const demagi = resolveCardGameBonuses(DEMAGI_ENGINEER, null);
    const quarchon = resolveCardGameBonuses({ ...DEMAGI_ENGINEER, species: "quarchon" }, null);
    const neyon = resolveCardGameBonuses({ ...DEMAGI_ENGINEER, species: "neyon" }, null);
    // They should NOT all be identical
    const hps = [demagi.hpBonus, quarchon.hpBonus, neyon.hpBonus];
    const attacks = [demagi.globalAttackBonus, quarchon.globalAttackBonus, neyon.globalAttackBonus];
    expect(new Set(hps).size).toBeGreaterThan(1);
    expect(new Set(attacks).size).toBeGreaterThan(1);
  });

  it("class choice creates meaningfully different builds", () => {
    const engineer = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, characterClass: "engineer" }, null);
    const assassin = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, characterClass: "assassin" }, null);
    const soldier = resolveFightGameBonuses({ ...DEMAGI_ENGINEER, characterClass: "soldier" }, null);
    // Assassin should have more attack than engineer
    expect(assassin.attackBonus).toBeGreaterThan(engineer.attackBonus);
    // Soldier should have more defense than assassin
    expect(soldier.defenseBonus).toBeGreaterThan(assassin.defenseBonus);
  });

  it("max-level citizen + max NFT gives significant but not game-breaking bonuses", () => {
    const maxCitizen: CitizenData = {
      species: "demagi", characterClass: "soldier", alignment: "order",
      element: "earth", attrAttack: 5, attrDefense: 5, attrVitality: 5,
      classLevel: 10, level: 50,
    };
    const fight = resolveFightGameBonuses(maxCitizen, MAX_NFT);
    // Should be significant but not more than base fighter stats (which are 80-120)
    expect(fight.attackBonus).toBeGreaterThan(5);
    expect(fight.attackBonus).toBeLessThan(100);
    expect(fight.hpBonus).toBeGreaterThan(10);
    expect(fight.hpBonus).toBeLessThan(200);
  });
});

/* ═══════════════════════════════════════════════════════
   8. ROUTER INTEGRATION VERIFICATION
   ═══════════════════════════════════════════════════════ */
describe("Router integration verification", () => {
  it("tradeWars router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("fetchCitizenData");
    expect(content).toContain("fetchPotentialNftData");
    expect(content).toContain("resolveTradeEmpireBonuses");
  });

  it("cardGame router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/cardGame.ts", "utf-8");
    expect(content).toContain("fetchCitizenData");
    expect(content).toContain("resolveCardGameBonuses");
  });

  it("crafting router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/crafting.ts", "utf-8");
    expect(content).toContain("fetchCitizenData");
    expect(content).toContain("resolveCraftingBonuses");
  });

  it("contentReward router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/contentReward.ts", "utf-8");
    expect(content).toContain("resolveExplorationBonuses");
    expect(content).toContain("nftLevelMultiplier");
  });

  it("fightLeaderboard router imports trait resolver", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/fightLeaderboard.ts", "utf-8");
    expect(content).toContain("resolveFightGameBonuses");
    expect(content).toContain("nftLevelMultiplier");
  });

  it("nft router has getAllTraitBonuses endpoint", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/nft.ts", "utf-8");
    expect(content).toContain("getAllTraitBonuses");
    expect(content).toContain("getPlayerTraitBonuses");
  });

  it("FightPage.tsx uses citizen fight bonuses", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/FightPage.tsx", "utf-8");
    expect(content).toContain("citizenFightBonuses");
    expect(content).toContain("getAllTraitBonuses");
  });

  it("tradeWars combat uses trait-boosted player power", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("tb.combatPowerBonus");
    expect(content).toContain("tb.shieldDamageReduction");
    expect(content).toContain("tb.cardDropRateBonus");
  });

  it("tradeWars trade uses trait-based price discount", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("tradeTb.tradePriceDiscount");
    expect(content).toContain("discountedPrice");
  });

  it("tradeWars scan uses trait-based scan range bonus", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("scanTb.scanRangeBonus");
  });

  it("tradeWars hazard uses trait-based hazard resistance", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/tradeWars.ts", "utf-8");
    expect(content).toContain("hazardTb.hazardResistance");
  });

  it("crafting uses trait-boosted success rate", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/crafting.ts", "utf-8");
    expect(content).toContain("craftTb.successRateBonus");
    expect(content).toContain("boostedRate");
  });

  it("contentReward uses trait-boosted Dream and rarity", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/contentReward.ts", "utf-8");
    expect(content).toContain("exploreTb.dreamBonus");
    expect(content).toContain("exploreTb.rarityUpgradeChance");
    expect(content).toContain("nftMult");
  });

  it("fightLeaderboard uses trait-adjusted K-factor", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers/fightLeaderboard.ts", "utf-8");
    expect(content).toContain("adjustedK");
    expect(content).toContain("traitKBonus");
  });
});
