/* ═══════════════════════════════════════════════════════
   EQUIPMENT STATE — Global equipment management
   Persists equipped items, calculates stat bonuses,
   and provides bonuses to all game engines.

   BG3-style: equipment affects everything, accessible everywhere.
   ═══════════════════════════════════════════════════════ */

export type EquipmentSlot = "helm" | "armor" | "weapon" | "secondary" | "accessory" | "consumable";

export interface EquippedItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: string;
  stats: { atk?: number; def?: number; hp?: number; speed?: number };
  /** Which game modes this item provides bonuses to */
  gameBonuses?: Array<{ game: string; stat: string; value: number; percent: boolean }>;
  imageUrl?: string;
}

export interface EquipmentStats {
  totalAtk: number;
  totalDef: number;
  totalHp: number;
  totalSpeed: number;
}

/* ─── PERSISTENCE ─── */

const STORAGE_KEY = "equipped_items";

export function getEquippedItems(): Record<EquipmentSlot, EquippedItem | null> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return { helm: null, armor: null, weapon: null, secondary: null, accessory: null, consumable: null };
}

export function equipItem(slot: EquipmentSlot, item: EquippedItem | null): void {
  const equipped = getEquippedItems();
  equipped[slot] = item;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(equipped));
  // Dispatch event so all listening components update
  window.dispatchEvent(new CustomEvent("equipment-changed", { detail: equipped }));
}

export function unequipSlot(slot: EquipmentSlot): void {
  equipItem(slot, null);
}

/* ─── STAT CALCULATION ─── */

export function calculateTotalStats(): EquipmentStats {
  const equipped = getEquippedItems();
  let totalAtk = 0, totalDef = 0, totalHp = 0, totalSpeed = 0;

  for (const item of Object.values(equipped)) {
    if (!item) continue;
    totalAtk += item.stats.atk || 0;
    totalDef += item.stats.def || 0;
    totalHp += item.stats.hp || 0;
    totalSpeed += item.stats.speed || 0;
  }

  return { totalAtk, totalDef, totalHp, totalSpeed };
}

/**
 * Get equipment bonuses for a specific game mode.
 * Combines equipment stat bonuses + any game-specific bonuses.
 */
export function getEquipmentGameBonuses(game: string): Map<string, number> {
  const equipped = getEquippedItems();
  const bonuses = new Map<string, number>();

  // Base stat bonuses apply to relevant games
  const stats = calculateTotalStats();

  switch (game) {
    case "fight":
      bonuses.set("damage", stats.totalAtk * 2); // +2% damage per ATK
      bonuses.set("defense", stats.totalDef * 2); // +2% defense per DEF
      bonuses.set("hp", stats.totalHp * 5);       // +5 HP per HP stat
      break;
    case "dischordia":
      bonuses.set("unit_power", Math.floor(stats.totalAtk / 3)); // +1 power per 3 ATK
      bonuses.set("unit_health", Math.floor(stats.totalDef / 3)); // +1 health per 3 DEF
      break;
    case "terminus":
      bonuses.set("turret_damage", stats.totalAtk); // +1% per ATK
      bonuses.set("core_hp", stats.totalDef * 3);   // +3% per DEF
      break;
    case "chess":
      bonuses.set("time_bonus", stats.totalSpeed * 5); // +5s per speed
      break;
    case "trade_empire":
      bonuses.set("mission_speed", stats.totalSpeed); // +1% per speed
      bonuses.set("fleet_combat", stats.totalAtk);    // +1% per ATK
      break;
  }

  // Add game-specific bonuses from individual items
  for (const item of Object.values(equipped)) {
    if (!item?.gameBonuses) continue;
    for (const bonus of item.gameBonuses) {
      if (bonus.game === game || bonus.game === "all") {
        const current = bonuses.get(bonus.stat) || 0;
        bonuses.set(bonus.stat, current + bonus.value);
      }
    }
  }

  return bonuses;
}

/* ─── QUICK ACCESS WIDGET ─── */

/**
 * Returns a summary for the floating equipment indicator.
 * Shows equipped item count and total stat bonuses.
 */
export function getEquipmentSummary(): { equipped: number; total: number; stats: EquipmentStats } {
  const items = getEquippedItems();
  const equipped = Object.values(items).filter(i => i !== null).length;
  return { equipped, total: 6, stats: calculateTotalStats() };
}
