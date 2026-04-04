/* ═══════════════════════════════════════════════════════
   CARD SHARDS — Duplicate Card Conversion System

   Duplicate cards convert into shards based on rarity.
   Shards upgrade card stats, awaken hidden abilities,
   or craft specific cards from the collection.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface ShardConversion {
  cardId: string;
  cardName: string;
  rarity: CardRarity;
  shardsAwarded: number;
  convertedAt: number; // epoch ms
}

export interface CardUpgrade {
  cardId: string;
  stat: "ATK" | "DEF" | "HP";
  previousValue: number;
  newValue: number;
  shardsCost: number;
  upgradeLevel: number;
  maxUpgradeLevel: number;
}

export interface AwakenedAbility {
  cardId: string;
  abilityName: string;
  description: string;
  abilityType: "passive" | "active" | "triggered";
  unlockCost: number; // always 50 shards
  unlockedAt: number; // epoch ms
}

export interface CraftableCard {
  cardId: string;
  cardName: string;
  rarity: CardRarity;
  shardCost: number;
  requiredPlayerLevel: number;
  prerequisiteCardIds: string[];
}

export interface ShardWallet {
  totalShards: number;
  lifetimeShardsEarned: number;
  lifetimeShardsSpent: number;
  conversionHistory: ShardConversion[];
}

/* ─── CONSTANTS ─── */

const SHARD_VALUES: Record<CardRarity, number> = {
  common: 1,
  uncommon: 3,
  rare: 10,
  epic: 25,
  legendary: 50,
};

const SHARDS_PER_UPGRADE = 5;
const AWAKEN_COST = 50;
const MAX_UPGRADE_LEVEL = 10;

const CRAFT_COSTS: Record<CardRarity, number> = {
  common: 5,
  uncommon: 15,
  rare: 40,
  epic: 100,
  legendary: 250,
};

/* ─── FUNCTIONS ─── */

export function convertToShards(
  cardId: string,
  cardName: string,
  rarity: CardRarity,
  wallet: ShardWallet,
): ShardConversion {
  const shardsAwarded = SHARD_VALUES[rarity];
  const conversion: ShardConversion = {
    cardId,
    cardName,
    rarity,
    shardsAwarded,
    convertedAt: Date.now(),
  };
  wallet.totalShards += shardsAwarded;
  wallet.lifetimeShardsEarned += shardsAwarded;
  wallet.conversionHistory.push(conversion);
  return conversion;
}

export function getShardCost(
  action: "upgrade" | "awaken" | "craft",
  rarity?: CardRarity,
): number {
  if (action === "upgrade") return SHARDS_PER_UPGRADE;
  if (action === "awaken") return AWAKEN_COST;
  if (action === "craft" && rarity) return CRAFT_COSTS[rarity];
  return 0;
}

export function upgradeCard(
  cardId: string,
  stat: "ATK" | "DEF" | "HP",
  currentValue: number,
  currentLevel: number,
  wallet: ShardWallet,
): CardUpgrade | null {
  if (currentLevel >= MAX_UPGRADE_LEVEL) return null;
  if (wallet.totalShards < SHARDS_PER_UPGRADE) return null;

  wallet.totalShards -= SHARDS_PER_UPGRADE;
  wallet.lifetimeShardsSpent += SHARDS_PER_UPGRADE;

  return {
    cardId,
    stat,
    previousValue: currentValue,
    newValue: currentValue + 1,
    shardsCost: SHARDS_PER_UPGRADE,
    upgradeLevel: currentLevel + 1,
    maxUpgradeLevel: MAX_UPGRADE_LEVEL,
  };
}

export function awakenCard(
  cardId: string,
  abilityName: string,
  description: string,
  abilityType: AwakenedAbility["abilityType"],
  wallet: ShardWallet,
): AwakenedAbility | null {
  if (wallet.totalShards < AWAKEN_COST) return null;

  wallet.totalShards -= AWAKEN_COST;
  wallet.lifetimeShardsSpent += AWAKEN_COST;

  return {
    cardId,
    abilityName,
    description,
    abilityType,
    unlockCost: AWAKEN_COST,
    unlockedAt: Date.now(),
  };
}
