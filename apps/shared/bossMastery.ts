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

  /* ═══ Act 1 TCG named bosses ═══
     Threshold curves are deliberately shallower than the
     fight-arena bosses because named-boss encounters are
     canonically not grindable — the player meets each one a
     handful of times across a full run, not dozens of times
     per session. Level-3 cosmetic + level-5 title + level-7
     cosmetic is all the player will realistically reach. */
  {
    bossKey: "act1_warlord_zero",
    bossName: "Warlord Zero",
    icon: "Swords",
    color: "#d97706",
    maxLevel: 5,
    levels: [
      { level: 1, killsRequired: 1, reward: { type: "xp", key: "xp", amount: 400 }, label: "Three Moves Met" },
      { level: 2, killsRequired: 2, reward: { type: "dream", key: "dream", amount: 20 }, label: "Nexon Veteran" },
      { level: 3, killsRequired: 3, reward: { type: "cosmetic", key: "warlord_badge", amount: 1 }, label: "Arithmetic Broken" },
      { level: 4, killsRequired: 5, reward: { type: "title", key: "warlord_breaker", amount: 1 }, label: "Warlord Breaker" },
      { level: 5, killsRequired: 10, reward: { type: "cosmetic", key: "warlord_banner", amount: 1 }, label: "Banner of Nexon" },
    ],
  },
  {
    bossKey: "act1_programmer",
    bossName: "The Programmer",
    icon: "Heart",
    color: "#0ea5e9",
    maxLevel: 5,
    levels: [
      { level: 1, killsRequired: 1, reward: { type: "xp", key: "xp", amount: 400 }, label: "Gift Witnessed" },
      { level: 2, killsRequired: 2, reward: { type: "dream", key: "dream", amount: 20 }, label: "Bench Returner" },
      { level: 3, killsRequired: 3, reward: { type: "cosmetic", key: "programmer_badge", amount: 1 }, label: "Programmer's Friend" },
      { level: 4, killsRequired: 5, reward: { type: "title", key: "gift_carrier", amount: 1 }, label: "Carrier of the Gift" },
      { level: 5, killsRequired: 10, reward: { type: "cosmetic", key: "programmer_card_back", amount: 1 }, label: "Cedar & Steel" },
    ],
  },
  {
    bossKey: "act1_game_master",
    bossName: "The Game Master",
    icon: "Gavel",
    color: "#dc2626",
    maxLevel: 5,
    levels: [
      { level: 1, killsRequired: 1, reward: { type: "xp", key: "xp", amount: 450 }, label: "Box Opened" },
      { level: 2, killsRequired: 2, reward: { type: "dream", key: "dream", amount: 25 }, label: "Public Record" },
      { level: 3, killsRequired: 3, reward: { type: "cosmetic", key: "game_master_badge", amount: 1 }, label: "Prosecutor Humbled" },
      { level: 4, killsRequired: 5, reward: { type: "title", key: "game_master_outwitted", amount: 1 }, label: "The Public Witness" },
      { level: 5, killsRequired: 10, reward: { type: "cosmetic", key: "game_master_gavel_skin", amount: 1 }, label: "Broken Gavel" },
    ],
  },
  {
    bossKey: "act1_authority",
    bossName: "The Authority",
    icon: "Scale",
    color: "#1e40af",
    maxLevel: 5,
    levels: [
      { level: 1, killsRequired: 1, reward: { type: "xp", key: "xp", amount: 600 }, label: "Trial Survived" },
      { level: 2, killsRequired: 2, reward: { type: "dream", key: "dream", amount: 30 }, label: "Ten Phases" },
      { level: 3, killsRequired: 3, reward: { type: "cosmetic", key: "authority_badge", amount: 1 }, label: "Verdict Overturned" },
      { level: 4, killsRequired: 5, reward: { type: "title", key: "authority_acquitted", amount: 1 }, label: "The Acquitted" },
      { level: 5, killsRequired: 10, reward: { type: "cosmetic", key: "authority_robe_skin", amount: 1 }, label: "Robe of the Acquitted" },
    ],
  },
  {
    bossKey: "act1_seer",
    bossName: "The Seer",
    icon: "Eye",
    color: "#7c3aed",
    maxLevel: 3,
    levels: [
      /* The Seer's winnable path is canonically rare — scripted
         loss is the default; defeat requires the burnt-card
         placeholder in the player's deck. Thresholds reflect
         that: one defeat already earns the cosmetic. */
      { level: 1, killsRequired: 1, reward: { type: "cosmetic", key: "seer_badge", amount: 1 }, label: "Prophecy Broken" },
      { level: 2, killsRequired: 3, reward: { type: "title", key: "seer_defeated", amount: 1 }, label: "Staff on the Bench" },
      { level: 3, killsRequired: 5, reward: { type: "cosmetic", key: "seer_staff_skin", amount: 1 }, label: "Staff Reclaimed" },
    ],
  },
];

/**
 * Map an Act 1 encounter id (from `story/chapters.ts`) to its
 * canonical boss-mastery key. Returns null for non-named
 * encounters (sparring chapters), which correctly skip the
 * mastery-record call on match end.
 */
export const ACT_1_ENCOUNTER_TO_BOSS_KEY: Readonly<Record<string, string>> = Object.freeze({
  ch_warlord_zero_first: "act1_warlord_zero",
  ch_programmer_gift: "act1_programmer",
  ch_game_master: "act1_game_master",
  ch_authority_trial: "act1_authority",
  ch_seer_visit: "act1_seer",
});

export function bossMasteryKeyForEncounter(encounterId: string): string | null {
  return ACT_1_ENCOUNTER_TO_BOSS_KEY[encounterId] ?? null;
}

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
