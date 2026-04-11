/* ═══════════════════════════════════════════════════════
   SERVER-SIDE LOOT DROPS — Shared by routers (fight, ark,
   trade empire) so material drops are computed and persisted
   on the server, not just in the client's local state.

   This file mirrors the structure of client/src/data/lootTables.ts
   but lives in /shared so server code can import it without
   crossing the client boundary. Keep the two in sync if you
   add or rebalance material drops.
   ═══════════════════════════════════════════════════════ */

export interface LootDrop {
  materialId: string;
  quantity: number;
}

export interface LootTableEntry {
  materialId: string;
  weight: number;
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

const COMBAT_LOOT_NIGHTMARE: LootTableEntry[] = [
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

const COMBAT_TABLES: Record<string, LootTableEntry[]> = {
  easy: COMBAT_LOOT_EASY,
  normal: COMBAT_LOOT_NORMAL,
  hard: COMBAT_LOOT_HARD,
  nightmare: COMBAT_LOOT_NIGHTMARE,
  legendary: COMBAT_LOOT_NIGHTMARE,
};

/* ── EXPLORATION (Ark room first-visit drops) ── */

const EXPLORATION_LOOT: LootTableEntry[] = [
  { materialId: "ark_fragment", weight: 40, minQty: 1, maxQty: 2 },
  { materialId: "stardust", weight: 25, minQty: 1, maxQty: 3 },
  { materialId: "dream_crystal", weight: 15, minQty: 1, maxQty: 1 },
  { materialId: "crystal_shard", weight: 12, minQty: 1, maxQty: 2 },
  { materialId: "iron_ore", weight: 8, minQty: 1, maxQty: 2 },
];

/* ── TRADE EMPIRE PORT BONUS LOOT (on top of mission rewards) ── */

const TRADE_LOOT: LootTableEntry[] = [
  { materialId: "iron_ore", weight: 35, minQty: 1, maxQty: 3 },
  { materialId: "stardust", weight: 30, minQty: 1, maxQty: 2 },
  { materialId: "crystal_shard", weight: 20, minQty: 1, maxQty: 2 },
  { materialId: "void_metal", weight: 10, minQty: 1, maxQty: 1 },
  { materialId: "quantum_flux", weight: 5, minQty: 1, maxQty: 1 },
];

/* ── CORE RNG ── */

export function rollLootTable(
  table: LootTableEntry[],
  rng: () => number = Math.random,
): LootDrop | null {
  if (table.length === 0) return null;
  const totalWeight = table.reduce((sum, e) => sum + e.weight, 0);
  let roll = rng() * totalWeight;
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) {
      const range = entry.maxQty - entry.minQty + 1;
      const quantity = entry.minQty + Math.floor(rng() * range);
      return { materialId: entry.materialId, quantity };
    }
  }
  const fallback = table[0];
  return { materialId: fallback.materialId, quantity: fallback.minQty };
}

export function rollMultipleDrops(
  table: LootTableEntry[],
  count: number,
  rng: () => number = Math.random,
): LootDrop[] {
  const merged: Record<string, number> = {};
  for (let i = 0; i < count; i++) {
    const drop = rollLootTable(table, rng);
    if (drop) merged[drop.materialId] = (merged[drop.materialId] ?? 0) + drop.quantity;
  }
  return Object.entries(merged).map(([materialId, quantity]) => ({ materialId, quantity }));
}

/**
 * Returns combat material drops for a fight win on the server side.
 * Mirrors client/src/data/lootTables.ts:getCombatDrops.
 *
 * @param difficulty   easy / normal / hard / nightmare / legendary
 * @param isPerfect    perfect win bonus roll
 * @param winStreak    +20% qty per 5-streak block
 */
export function rollCombatDrops(
  difficulty: string,
  isPerfect: boolean,
  winStreak: number = 0,
  rng: () => number = Math.random,
): LootDrop[] {
  const table = COMBAT_TABLES[difficulty] ?? COMBAT_TABLES.normal;
  const baseRolls = difficulty === "easy" ? 1
    : difficulty === "nightmare" || difficulty === "legendary" ? 3
    : 2;
  const drops = rollMultipleDrops(table, baseRolls, rng);

  if (isPerfect) {
    const bonus = rollMultipleDrops(COMBAT_LOOT_PERFECT_BONUS, 1, rng);
    for (const bd of bonus) {
      const existing = drops.find(d => d.materialId === bd.materialId);
      if (existing) existing.quantity += bd.quantity;
      else drops.push(bd);
    }
  }

  if (winStreak >= 5) {
    const mult = 1 + Math.floor(winStreak / 5) * 0.2;
    for (const drop of drops) {
      drop.quantity = Math.ceil(drop.quantity * mult);
    }
  }

  return drops;
}

/** Single roll from the exploration table (used on first room visit). */
export function rollExplorationDrops(rng: () => number = Math.random): LootDrop[] {
  return rollMultipleDrops(EXPLORATION_LOOT, 1, rng);
}

/** Bonus material drop from completing a Trade Empire mission. */
export function rollTradeEmpireDrops(
  bonusRolls: number = 1,
  rng: () => number = Math.random,
): LootDrop[] {
  return rollMultipleDrops(TRADE_LOOT, bonusRolls, rng);
}

/** Convert a list of LootDrops into a flat materialId → qty map. */
export function dropsToMaterialMap(drops: LootDrop[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of drops) {
    out[d.materialId] = (out[d.materialId] ?? 0) + d.quantity;
  }
  return out;
}
