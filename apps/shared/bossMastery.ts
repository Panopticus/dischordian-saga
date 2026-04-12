/**
 * BOSS MASTERY SYSTEM
 * ══════════════════════════════════════════════════════════
 * Mastery levels per boss, exclusive cosmetics, mastery leaderboard.
 */

export interface BossMasteryLevel {
  level: number;
  killsRequired: number;
  reward: { type: "cosmetic" | "title" | "card" | "dream" | "xp"; key: string; amount: number };
  label: string;
}

export interface BossMasteryDef {
  bossKey: string;
  bossName: string;
  icon: string;
  color: string;
  maxLevel: number;
  levels: BossMasteryLevel[];
}

export const BOSS_MASTERY_DEFS: BossMasteryDef[] = [
  {
    bossKey: "panopticon_sentinel",
    bossName: "Panopticon Sentinel",
    icon: "Eye",
    color: "#ef4444",
    maxLevel: 10,
    levels: [
      { level: 1, killsRequired: 1, reward: { type: "xp", key: "xp", amount: 500 }, label: "First Blood" },
      { level: 2, killsRequired: 3, reward: { type: "dream", key: "dream", amount: 25 }, label: "Sentinel Hunter" },
      { level: 3, killsRequired: 5, reward: { type: "cosmetic", key: "sentinel_slayer_badge", amount: 1 }, label: "Sentinel Slayer" },
      { level: 5, killsRequired: 10, reward: { type: "title", key: "panopticon_breaker", amount: 1 }, label: "Panopticon Breaker" },
      { level: 7, killsRequired: 25, reward: { type: "cosmetic", key: "sentinel_armor_skin", amount: 1 }, label: "Sentinel Armor" },
      { level: 10, killsRequired: 50, reward: { type: "card", key: "sentinel_master_card", amount: 1 }, label: "Sentinel Master" },
    ],
  },
  {
    bossKey: "chrono_wyrm",
    bossName: "Chrono Wyrm",
    icon: "Timer",
    color: "#0ea5e9",
    maxLevel: 10,
    levels: [
      { level: 1, killsRequired: 1, reward: { type: "xp", key: "xp", amount: 500 }, label: "Time Touched" },
      { level: 2, killsRequired: 3, reward: { type: "dream", key: "dream", amount: 25 }, label: "Wyrm Hunter" },
      { level: 3, killsRequired: 5, reward: { type: "cosmetic", key: "chrono_scales_badge", amount: 1 }, label: "Chrono Scales" },
      { level: 5, killsRequired: 10, reward: { type: "title", key: "time_breaker", amount: 1 }, label: "Time Breaker" },
      { level: 7, killsRequired: 25, reward: { type: "cosmetic", key: "wyrm_rider_skin", amount: 1 }, label: "Wyrm Rider" },
      { level: 10, killsRequired: 50, reward: { type: "card", key: "wyrm_master_card", amount: 1 }, label: "Wyrm Master" },
    ],
  },
  {
    bossKey: "void_leviathan",
    bossName: "Void Leviathan",
    icon: "Skull",
    color: "#6d28d9",
    maxLevel: 10,
    levels: [
      { level: 1, killsRequired: 1, reward: { type: "xp", key: "xp", amount: 600 }, label: "Void Touched" },
      { level: 2, killsRequired: 3, reward: { type: "dream", key: "dream", amount: 30 }, label: "Void Hunter" },
      { level: 3, killsRequired: 5, reward: { type: "cosmetic", key: "void_mark_badge", amount: 1 }, label: "Void Mark" },
      { level: 5, killsRequired: 10, reward: { type: "title", key: "void_conqueror", amount: 1 }, label: "Void Conqueror" },
      { level: 7, killsRequired: 25, reward: { type: "cosmetic", key: "leviathan_cloak_skin", amount: 1 }, label: "Leviathan Cloak" },
      { level: 10, killsRequired: 50, reward: { type: "card", key: "leviathan_master_card", amount: 1 }, label: "Leviathan Master" },
    ],
  },
  {
    bossKey: "shadow_colossus",
    bossName: "Shadow Colossus",
    icon: "Mountain",
    color: "#1e1b4b",
    maxLevel: 10,
    levels: [
      { level: 1, killsRequired: 1, reward: { type: "xp", key: "xp", amount: 550 }, label: "Shadow Touched" },
      { level: 2, killsRequired: 3, reward: { type: "dream", key: "dream", amount: 28 }, label: "Colossus Hunter" },
      { level: 3, killsRequired: 5, reward: { type: "cosmetic", key: "shadow_mark_badge", amount: 1 }, label: "Shadow Mark" },
      { level: 5, killsRequired: 10, reward: { type: "title", key: "shadow_slayer", amount: 1 }, label: "Shadow Slayer" },
      { level: 7, killsRequired: 25, reward: { type: "cosmetic", key: "colossus_armor_skin", amount: 1 }, label: "Colossus Armor" },
      { level: 10, killsRequired: 50, reward: { type: "card", key: "colossus_master_card", amount: 1 }, label: "Colossus Master" },
    ],
  },
];

export function getBossMasteryLevel(kills: number, bossKey: string): number {
  const def = BOSS_MASTERY_DEFS.find(b => b.bossKey === bossKey);
  if (!def) return 0;
  let level = 0;
  for (const ml of def.levels) {
    if (kills >= ml.killsRequired) level = ml.level;
  }
  return level;
}

export function getNextMasteryReward(kills: number, bossKey: string): BossMasteryLevel | null {
  const def = BOSS_MASTERY_DEFS.find(b => b.bossKey === bossKey);
  if (!def) return null;
  for (const ml of def.levels) {
    if (kills < ml.killsRequired) return ml;
  }
  return null;
}
