/* ═══════════════════════════════════════════════════════
   LOOT TABLES — RNG drop system for materials from gameplay
   
   Determines what materials drop from:
   - Fight Arena wins (combat drops)
   - Trade Empire port visits (trade materials)
   - Card sacrifice (card essence)
   - Ark exploration (exploration materials)
   ═══════════════════════════════════════════════════════ */

export interface LootDrop {
  materialId: string;
  quantity: number;
}

export interface LootTableEntry {
  materialId: string;
  weight: number;       // Relative probability weight
  minQty: number;
  maxQty: number;
}

/* ── COMBAT DROP TABLES (by difficulty) ── */

const COMBAT_LOOT_EASY: LootTableEntry[] = [
  { materialId: "battle_shard", weight: 80, minQty: 1, maxQty: 2 },
  { materialId: "champions_mark", weight: 10, minQty: 1, maxQty: 1 },
  { materialId: "iron_ore", weight: 10, minQty: 1, maxQty: 1 },
];

const COMBAT_LOOT_NORMAL: LootTableEntry[] = [
  { materialId: "battle_shard", weight: 60, minQty: 1, maxQty: 3 },
  { materialId: "champions_mark", weight: 20, minQty: 1, maxQty: 1 },
  { materialId: "void_catalyst", weight: 8, minQty: 1, maxQty: 1 },
  { materialId: "iron_ore", weight: 8, minQty: 1, maxQty: 2 },
  { materialId: "crystal_shard", weight: 4, minQty: 1, maxQty: 1 },
];

const COMBAT_LOOT_HARD: LootTableEntry[] = [
  { materialId: "battle_shard", weight: 40, minQty: 2, maxQty: 4 },
  { materialId: "champions_mark", weight: 25, minQty: 1, maxQty: 2 },
  { materialId: "void_catalyst", weight: 18, minQty: 1, maxQty: 1 },
  { materialId: "architects_tear", weight: 5, minQty: 1, maxQty: 1 },
  { materialId: "crystal_shard", weight: 8, minQty: 1, maxQty: 2 },
  { materialId: "stardust", weight: 4, minQty: 1, maxQty: 2 },
];

const COMBAT_LOOT_LEGENDARY: LootTableEntry[] = [
  { materialId: "battle_shard", weight: 25, minQty: 3, maxQty: 5 },
  { materialId: "champions_mark", weight: 25, minQty: 1, maxQty: 3 },
  { materialId: "void_catalyst", weight: 22, minQty: 1, maxQty: 2 },
  { materialId: "architects_tear", weight: 15, minQty: 1, maxQty: 1 },
  { materialId: "void_metal", weight: 8, minQty: 1, maxQty: 1 },
  { materialId: "quantum_flux", weight: 5, minQty: 1, maxQty: 1 },
];

const COMBAT_LOOT_PERFECT_BONUS: LootTableEntry[] = [
  { materialId: "champions_mark", weight: 40, minQty: 1, maxQty: 2 },
  { materialId: "void_catalyst", weight: 30, minQty: 1, maxQty: 1 },
  { materialId: "architects_tear", weight: 20, minQty: 1, maxQty: 1 },
  { materialId: "soul_fragment", weight: 10, minQty: 1, maxQty: 1 },
];

export const COMBAT_LOOT_TABLES: Record<string, LootTableEntry[]> = {
  easy: COMBAT_LOOT_EASY,
  normal: COMBAT_LOOT_NORMAL,
  hard: COMBAT_LOOT_HARD,
  legendary: COMBAT_LOOT_LEGENDARY,
  story: COMBAT_LOOT_NORMAL,
  perfect_bonus: COMBAT_LOOT_PERFECT_BONUS,
};

/* ── TRADE EMPIRE PORT LOOT TABLES ── */

const TRADE_LOOT_COMMON_PORT: LootTableEntry[] = [
  { materialId: "iron_ore", weight: 40, minQty: 2, maxQty: 5 },
  { materialId: "stardust", weight: 35, minQty: 1, maxQty: 3 },
  { materialId: "crystal_shard", weight: 20, minQty: 1, maxQty: 2 },
  { materialId: "ark_fragment", weight: 5, minQty: 1, maxQty: 1 },
];

const TRADE_LOOT_RARE_PORT: LootTableEntry[] = [
  { materialId: "crystal_shard", weight: 30, minQty: 2, maxQty: 4 },
  { materialId: "void_metal", weight: 25, minQty: 1, maxQty: 2 },
  { materialId: "quantum_flux", weight: 20, minQty: 1, maxQty: 1 },
  { materialId: "stardust", weight: 15, minQty: 2, maxQty: 4 },
  { materialId: "dream_crystal", weight: 10, minQty: 1, maxQty: 1 },
];

const TRADE_LOOT_LEGENDARY_PORT: LootTableEntry[] = [
  { materialId: "void_metal", weight: 25, minQty: 2, maxQty: 3 },
  { materialId: "quantum_flux", weight: 25, minQty: 1, maxQty: 2 },
  { materialId: "dream_crystal", weight: 20, minQty: 1, maxQty: 1 },
  { materialId: "crystal_shard", weight: 15, minQty: 2, maxQty: 5 },
  { materialId: "soul_fragment", weight: 10, minQty: 1, maxQty: 1 },
  { materialId: "architects_tear", weight: 5, minQty: 1, maxQty: 1 },
];

export const TRADE_LOOT_TABLES: Record<string, LootTableEntry[]> = {
  common: TRADE_LOOT_COMMON_PORT,
  rare: TRADE_LOOT_RARE_PORT,
  legendary: TRADE_LOOT_LEGENDARY_PORT,
};

/* ── CARD SACRIFICE TABLES ── */

export interface CardSacrificeResult {
  materialId: string;
  quantity: number;
}

/** Returns materials from sacrificing a card based on its rarity */
export function getCardSacrificeRewards(cardRarity: string): CardSacrificeResult[] {
  const rewards: CardSacrificeResult[] = [];
  
  // Base essence from any card
  rewards.push({ materialId: "card_essence", quantity: cardRarity === "common" ? 1 : cardRarity === "uncommon" ? 2 : 3 });
  
  // Bonus materials by rarity
  switch (cardRarity) {
    case "uncommon":
      rewards.push({ materialId: "card_essence", quantity: 1 });
      if (Math.random() < 0.3) rewards.push({ materialId: "stardust", quantity: 1 });
      break;
    case "rare":
      rewards.push({ materialId: "rare_essence", quantity: 1 });
      if (Math.random() < 0.4) rewards.push({ materialId: "crystal_shard", quantity: 1 });
      break;
    case "epic":
      rewards.push({ materialId: "rare_essence", quantity: 2 });
      rewards.push({ materialId: "legendary_essence", quantity: 1 });
      if (Math.random() < 0.3) rewards.push({ materialId: "soul_fragment", quantity: 1 });
      break;
    case "legendary":
      rewards.push({ materialId: "legendary_essence", quantity: 2 });
      rewards.push({ materialId: "soul_fragment", quantity: 1 });
      if (Math.random() < 0.5) rewards.push({ materialId: "dream_crystal", quantity: 1 });
      break;
  }
  
  return rewards;
}

/* ── EXPLORATION DROP TABLES ── */

const EXPLORATION_LOOT: LootTableEntry[] = [
  { materialId: "ark_fragment", weight: 40, minQty: 1, maxQty: 2 },
  { materialId: "stardust", weight: 25, minQty: 1, maxQty: 3 },
  { materialId: "dream_crystal", weight: 15, minQty: 1, maxQty: 1 },
  { materialId: "crystal_shard", weight: 12, minQty: 1, maxQty: 2 },
  { materialId: "iron_ore", weight: 8, minQty: 1, maxQty: 2 },
];

export const EXPLORATION_LOOT_TABLE = EXPLORATION_LOOT;

/* ── CORE RNG ENGINE ── */

/** Roll a single drop from a loot table */
export function rollLootTable(table: LootTableEntry[]): LootDrop | null {
  if (table.length === 0) return null;
  
  const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;
  
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) {
      const quantity = entry.minQty + Math.floor(Math.random() * (entry.maxQty - entry.minQty + 1));
      return { materialId: entry.materialId, quantity };
    }
  }
  
  // Fallback to first entry
  const fallback = table[0];
  return { materialId: fallback.materialId, quantity: fallback.minQty };
}

/** Roll multiple drops from a loot table (with possible duplicates merged) */
export function rollMultipleDrops(table: LootTableEntry[], count: number): LootDrop[] {
  const drops: Record<string, number> = {};
  
  for (let i = 0; i < count; i++) {
    const drop = rollLootTable(table);
    if (drop) {
      drops[drop.materialId] = (drops[drop.materialId] || 0) + drop.quantity;
    }
  }
  
  return Object.entries(drops).map(([materialId, quantity]) => ({ materialId, quantity }));
}

/** Get combat drops for a fight win */
export function getCombatDrops(difficulty: string, isPerfect: boolean, winStreak: number = 0): LootDrop[] {
  const table = COMBAT_LOOT_TABLES[difficulty] || COMBAT_LOOT_TABLES.normal;
  
  // Base drops: 1-2 rolls depending on difficulty
  const baseRolls = difficulty === "easy" ? 1 : difficulty === "legendary" ? 3 : 2;
  const drops = rollMultipleDrops(table, baseRolls);
  
  // Perfect win bonus: extra roll from bonus table
  if (isPerfect) {
    const bonusDrops = rollMultipleDrops(COMBAT_LOOT_TABLES.perfect_bonus, 1);
    for (const bd of bonusDrops) {
      const existing = drops.find(d => d.materialId === bd.materialId);
      if (existing) {
        existing.quantity += bd.quantity;
      } else {
        drops.push(bd);
      }
    }
  }
  
  // Win streak bonus: extra quantity on all drops every 5 wins
  if (winStreak >= 5) {
    const streakMultiplier = 1 + Math.floor(winStreak / 5) * 0.2;
    for (const drop of drops) {
      drop.quantity = Math.ceil(drop.quantity * streakMultiplier);
    }
  }
  
  return drops;
}

/** Get trade port drops */
export function getTradePortDrops(portTier: "common" | "rare" | "legendary"): LootDrop[] {
  const table = TRADE_LOOT_TABLES[portTier] || TRADE_LOOT_TABLES.common;
  const rolls = portTier === "common" ? 1 : portTier === "rare" ? 2 : 3;
  return rollMultipleDrops(table, rolls);
}

/** Get exploration drops when discovering a new room */
export function getExplorationDrops(): LootDrop[] {
  return rollMultipleDrops(EXPLORATION_LOOT_TABLE, 1);
}
