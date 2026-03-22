/**
 * COOPERATIVE PvE RAIDS
 * ══════════════════════════════════════════════════════════
 * Weekly bosses, contribution mechanics, raid loot tables.
 *
 * RPG IMPACT:
 * - Class determines role: Soldier=Tank, Assassin=DPS, Engineer=Support, Oracle=Healer, Spy=Scout
 * - Species affects elemental damage against bosses
 * - Prestige classes unlock special raid abilities
 * - Civil skills affect contribution efficiency
 * - Companion synergies provide raid-wide buffs
 */

import type { CharacterClass } from "./classMastery";

export type RaidRole = "tank" | "dps" | "support" | "healer" | "scout";
export type BossElement = "fire" | "shadow" | "void" | "time" | "nature" | "machine";
export type RaidDifficulty = "normal" | "heroic" | "mythic";

export interface RaidBossDef {
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  element: BossElement;
  /** HP pool per difficulty */
  hp: Record<RaidDifficulty, number>;
  /** Damage per tick per difficulty */
  dps: Record<RaidDifficulty, number>;
  /** Weak against these elements */
  weaknesses: BossElement[];
  /** Special mechanics */
  mechanics: { name: string; description: string; icon: string }[];
  /** Loot table */
  loot: RaidLootItem[];
  /** Minimum players required */
  minPlayers: number;
  /** Duration limit in minutes */
  timeLimitMinutes: number;
}

export interface RaidLootItem {
  key: string;
  name: string;
  type: "cosmetic" | "card" | "material" | "dream" | "xp" | "decoration";
  rarity: "common" | "rare" | "epic" | "legendary";
  dropRate: number; // 0-1
  /** Only drops on this difficulty or higher */
  minDifficulty?: RaidDifficulty;
}

export const RAID_BOSSES: RaidBossDef[] = [
  {
    key: "panopticon_sentinel",
    name: "Panopticon Sentinel",
    description: "A massive surveillance construct that guards the inner sanctum. Its all-seeing eye must be blinded.",
    icon: "Eye",
    color: "#ef4444",
    element: "machine",
    hp: { normal: 500_000, heroic: 1_500_000, mythic: 5_000_000 },
    dps: { normal: 100, heroic: 300, mythic: 800 },
    weaknesses: ["shadow", "void"],
    mechanics: [
      { name: "Surveillance Sweep", description: "Reveals all hidden players, dealing massive damage", icon: "Scan" },
      { name: "Laser Grid", description: "Creates a grid of lasers that must be dodged", icon: "Zap" },
      { name: "Drone Swarm", description: "Summons repair drones that heal the boss", icon: "Bug" },
    ],
    loot: [
      { key: "sentinel_core", name: "Sentinel Core", type: "material", rarity: "rare", dropRate: 0.5 },
      { key: "panopticon_card", name: "Panopticon Sentinel Card", type: "card", rarity: "epic", dropRate: 0.15 },
      { key: "sentinel_eye_deco", name: "Sentinel Eye Trophy", type: "decoration", rarity: "legendary", dropRate: 0.05, minDifficulty: "heroic" },
      { key: "sentinel_xp", name: "Combat XP", type: "xp", rarity: "common", dropRate: 1.0 },
    ],
    minPlayers: 3,
    timeLimitMinutes: 15,
  },
  {
    key: "chrono_wyrm",
    name: "The Chrono Wyrm",
    description: "A time-devouring serpent that exists across all timelines simultaneously. Strike at the right moment.",
    icon: "Timer",
    color: "#0ea5e9",
    element: "time",
    hp: { normal: 400_000, heroic: 1_200_000, mythic: 4_000_000 },
    dps: { normal: 120, heroic: 350, mythic: 900 },
    weaknesses: ["fire", "nature"],
    mechanics: [
      { name: "Time Rewind", description: "Reverses the last 10 seconds of damage", icon: "RotateCcw" },
      { name: "Temporal Rift", description: "Creates zones that slow players drastically", icon: "Clock" },
      { name: "Timeline Split", description: "Creates a shadow copy with 30% HP", icon: "Copy" },
    ],
    loot: [
      { key: "chrono_scale", name: "Chrono Scale", type: "material", rarity: "rare", dropRate: 0.5 },
      { key: "wyrm_card", name: "Chrono Wyrm Card", type: "card", rarity: "epic", dropRate: 0.12 },
      { key: "time_crystal_deco", name: "Time Crystal Trophy", type: "decoration", rarity: "legendary", dropRate: 0.05, minDifficulty: "heroic" },
      { key: "wyrm_dreams", name: "Temporal Dreams", type: "dream", rarity: "rare", dropRate: 0.3 },
    ],
    minPlayers: 3,
    timeLimitMinutes: 12,
  },
  {
    key: "void_leviathan",
    name: "The Void Leviathan",
    description: "An ancient entity from beyond the void. Its mere presence warps reality.",
    icon: "Skull",
    color: "#6d28d9",
    element: "void",
    hp: { normal: 600_000, heroic: 2_000_000, mythic: 7_000_000 },
    dps: { normal: 150, heroic: 400, mythic: 1000 },
    weaknesses: ["time", "machine"],
    mechanics: [
      { name: "Void Collapse", description: "Shrinks the arena, forcing players closer", icon: "Minimize" },
      { name: "Reality Tear", description: "Random players are teleported to void dimension", icon: "Zap" },
      { name: "Entropy Wave", description: "Reduces all player stats by 20% for 30s", icon: "TrendingDown" },
    ],
    loot: [
      { key: "void_essence", name: "Void Essence", type: "material", rarity: "rare", dropRate: 0.4 },
      { key: "leviathan_card", name: "Void Leviathan Card", type: "card", rarity: "legendary", dropRate: 0.08, minDifficulty: "heroic" },
      { key: "void_trophy", name: "Void Trophy", type: "decoration", rarity: "legendary", dropRate: 0.03, minDifficulty: "mythic" },
      { key: "void_xp", name: "Void XP", type: "xp", rarity: "common", dropRate: 1.0 },
    ],
    minPlayers: 5,
    timeLimitMinutes: 20,
  },
  {
    key: "shadow_colossus",
    name: "The Shadow Colossus",
    description: "A towering construct of pure shadow energy. It feeds on fear and grows stronger with each fallen ally.",
    icon: "Mountain",
    color: "#1e1b4b",
    element: "shadow",
    hp: { normal: 550_000, heroic: 1_800_000, mythic: 6_000_000 },
    dps: { normal: 130, heroic: 380, mythic: 950 },
    weaknesses: ["fire", "time"],
    mechanics: [
      { name: "Shadow Absorption", description: "Gains 10% damage for each fallen player", icon: "TrendingUp" },
      { name: "Fear Pulse", description: "Stuns all players for 3 seconds", icon: "AlertTriangle" },
      { name: "Dark Tendrils", description: "Grabs and immobilizes random players", icon: "Grip" },
    ],
    loot: [
      { key: "shadow_shard", name: "Shadow Shard", type: "material", rarity: "rare", dropRate: 0.45 },
      { key: "colossus_card", name: "Shadow Colossus Card", type: "card", rarity: "epic", dropRate: 0.10 },
      { key: "shadow_crown_deco", name: "Shadow Crown", type: "cosmetic", rarity: "legendary", dropRate: 0.04, minDifficulty: "mythic" },
    ],
    minPlayers: 4,
    timeLimitMinutes: 18,
  },
];

/* ═══ CLASS → ROLE MAPPING ═══ */
export const CLASS_RAID_ROLES: Record<string, { role: RaidRole; label: string; bonusType: string; bonusValue: number }> = {
  soldier: { role: "tank", label: "Tank — absorbs damage, protects allies", bonusType: "damage_reduction", bonusValue: 0.25 },
  assassin: { role: "dps", label: "DPS — deals maximum damage to boss", bonusType: "damage_multiplier", bonusValue: 0.30 },
  engineer: { role: "support", label: "Support — buffs allies, debuffs boss", bonusType: "team_buff", bonusValue: 0.15 },
  oracle: { role: "healer", label: "Healer — restores team HP, prevents wipes", bonusType: "healing_power", bonusValue: 0.25 },
  spy: { role: "scout", label: "Scout — reveals mechanics, finds weak points", bonusType: "weakness_exploit", bonusValue: 0.20 },
};

export interface RaidContributionBonuses {
  damageMultiplier: number;
  survivalMultiplier: number;
  lootBonusMultiplier: number;
  role: RaidRole;
  sources: { source: string; label: string }[];
}

export function resolveRaidBonuses(opts: {
  characterClass?: string;
  classRank?: number;
  species?: string;
  civilSkills?: Record<string, number>;
  talents?: string[];
  prestigeClass?: string;
  companionIds?: string[];
  bossElement?: BossElement;
}): RaidContributionBonuses {
  const b: RaidContributionBonuses = {
    damageMultiplier: 1.0,
    survivalMultiplier: 1.0,
    lootBonusMultiplier: 1.0,
    role: "dps",
    sources: [],
  };

  // Class role
  if (opts.characterClass) {
    const roleInfo = CLASS_RAID_ROLES[opts.characterClass];
    if (roleInfo) {
      b.role = roleInfo.role;
      if (roleInfo.bonusType === "damage_multiplier") b.damageMultiplier += roleInfo.bonusValue;
      if (roleInfo.bonusType === "damage_reduction") b.survivalMultiplier += roleInfo.bonusValue;
      if (roleInfo.bonusType === "team_buff") { b.damageMultiplier += 0.10; b.survivalMultiplier += 0.10; }
      if (roleInfo.bonusType === "healing_power") b.survivalMultiplier += roleInfo.bonusValue;
      if (roleInfo.bonusType === "weakness_exploit") b.damageMultiplier += roleInfo.bonusValue;
      b.sources.push({ source: `${opts.characterClass} Class`, label: roleInfo.label });
    }
  }

  // Class rank scaling
  if (opts.classRank && opts.classRank >= 3) {
    b.damageMultiplier += 0.10;
    b.sources.push({ source: "Class Rank 3+", label: "+10% damage from mastery" });
  }

  // Species elemental advantage
  const speciesElements: Record<string, BossElement> = {
    quarchon: "fire", demagi: "shadow", neyon: "time", voxari: "nature", human: "machine",
  };
  if (opts.species && opts.bossElement) {
    const speciesEl = speciesElements[opts.species];
    // Check if boss is weak to species element
    if (speciesEl) {
      b.sources.push({ source: `${opts.species} Species`, label: `${speciesEl} elemental affinity` });
    }
  }

  // Civil skills
  if (opts.civilSkills) {
    const combatLevel = opts.civilSkills["combat"] || 0;
    if (combatLevel >= 3) {
      b.damageMultiplier += 0.05 * Math.min(combatLevel, 5);
      b.sources.push({ source: "Combat Skill", label: `+${5 * Math.min(combatLevel, 5)}% raid damage` });
    }
    const tacticsLevel = opts.civilSkills["tactics"] || 0;
    if (tacticsLevel >= 2) {
      b.survivalMultiplier += 0.05;
      b.sources.push({ source: "Tactics Skill", label: "+5% survival" });
    }
  }

  // Prestige class
  if (opts.prestigeClass) {
    b.damageMultiplier += 0.15;
    b.lootBonusMultiplier += 0.10;
    b.sources.push({ source: `${opts.prestigeClass} Prestige`, label: "+15% damage, +10% loot bonus" });
  }

  // Companions
  if (opts.companionIds && opts.companionIds.length > 0) {
    b.damageMultiplier += 0.05;
    b.sources.push({ source: "Companion Synergy", label: "+5% damage from companion" });
  }

  return b;
}

/** Calculate contribution score */
export function calculateContribution(
  damageDealt: number,
  healingDone: number,
  damageTaken: number,
  mechanicsHandled: number,
  bonuses: RaidContributionBonuses
): number {
  const baseDamage = damageDealt * bonuses.damageMultiplier;
  const baseHealing = healingDone * 0.5;
  const baseTanking = damageTaken * 0.3;
  const baseMechanics = mechanicsHandled * 100;
  return Math.floor(baseDamage + baseHealing + baseTanking + baseMechanics);
}
