/* ═══════════════════════════════════════════════════════
   SHARED EQUIPMENT STATS — Minimal stat lookup for server-side
   game bonus calculations. Mirrors client equipmentData.ts stats.
   ═══════════════════════════════════════════════════════ */

/** Minimal stat record for server-side lookups */
export interface EquipStats {
  atk?: number;
  def?: number;
  hp?: number;
  speed?: number;
}

/** Equipment ID → stats mapping (mirrors client/src/data/equipmentData.ts) */
export const EQUIPMENT_STATS: Record<string, EquipStats> = {
  // Starting gear
  diamond_pick_axe: { atk: 3 },
  repair_kit: { hp: 10 },
  shield_generator: { def: 2 },
  crossbow: { atk: 4 },
  invisibility_potion: { speed: 2 },
  random_power_potion: { atk: 1, def: 1, hp: 5 },
  poison_blade: { atk: 5 },
  throwing_knives: { atk: 2 },
  smoke_bomb: { speed: 3 },
  plasma_sword: { atk: 4, def: 1 },
  energy_shield: { def: 3 },
  stim_pack: { hp: 15, speed: 1 },
  silenced_pistol: { atk: 3, speed: 1 },
  cloaking_device: { speed: 3 },
  emp_grenade: { atk: 2, def: 1 },
  // Uncommon craftable
  void_helm: { def: 2, hp: 5 },
  circuit_vest: { def: 3, hp: 10 },
  data_lens: { speed: 2, atk: 1 },
  phase_blade: { atk: 6 },
  // Rare craftable
  panopticon_visor: { def: 4, hp: 10, speed: 1 },
  dreamweave_plate: { def: 6, hp: 20 },
  architects_gauntlet: { atk: 8, def: 2 },
  probability_ring: { atk: 3, speed: 3 },
  neural_disruptor: { atk: 5, speed: 2 },
  // Epic craftable
  crown_of_echoes: { def: 6, hp: 15, atk: 3 },
  void_sentinel_plate: { def: 10, hp: 30 },
  dreamers_edge: { atk: 12, speed: 2 },
  source_fragment: { atk: 5, def: 5, hp: 10, speed: 2 },
  // Legendary
  architects_crown: { def: 10, hp: 25, atk: 5, speed: 3 },
  dreamers_mantle: { def: 15, hp: 50, speed: 5 },
  iron_lions_mace: { atk: 18, def: 5 },
  enigmas_paradox: { atk: 8, def: 8, hp: 20, speed: 5 },
  // Combat drops
  scrap_helm: { def: 1 },
  arena_vest: { def: 2, hp: 5 },
  fighters_band: { atk: 1, speed: 1 },
  collectors_blade: { atk: 7 },
  warlords_pauldron: { def: 4, hp: 8 },
  oracle_eye: { def: 3, speed: 3, atk: 2 },
  void_shard_ring: { atk: 4, def: 2, speed: 2 },
  // Shop
  traders_helm: { def: 1, speed: 1 },
  merchants_coat: { def: 3, hp: 8, speed: 1 },
  fortune_charm: { speed: 3, hp: 5 },
};

/**
 * Calculate total equipment stats from a gear mapping (slot → itemId).
 * Works on both server and client.
 */
export function calculateGearStats(gear: Record<string, unknown> | null | undefined): {
  totalAtk: number; totalDef: number; totalHp: number; totalSpeed: number;
} {
  const result = { totalAtk: 0, totalDef: 0, totalHp: 0, totalSpeed: 0 };
  if (!gear) return result;

  for (const itemId of Object.values(gear)) {
    if (typeof itemId !== "string") continue;
    const stats = EQUIPMENT_STATS[itemId];
    if (!stats) continue;
    result.totalAtk += stats.atk || 0;
    result.totalDef += stats.def || 0;
    result.totalHp += stats.hp || 0;
    result.totalSpeed += stats.speed || 0;
  }

  return result;
}
