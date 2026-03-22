/**
 * TOWER DEFENSE & RAIDING SYSTEM
 * ───────────────────────────────
 * Clash of Clans-style base defense and raiding mechanics.
 * Players place towers on their station/capital grid to defend against raids.
 * Players can raid other stations/capitals for resources.
 *
 * RPG INTEGRATION:
 * - Class Mastery: Each class unlocks unique tower types and raid units
 * - Species Traits: Passive tower/unit stat bonuses
 * - Citizen Talents: Unlock special towers, abilities, and raid perks
 * - Civil Skills: Tactics improves tower AI, Leadership boosts raid troops
 * - Prestige Classes: Unlock ultimate towers and raid abilities
 * - Elemental Combos: Adjacent towers of compatible elements create combo effects
 * - Companion Synergies: Companions provide defense/offense auras during raids
 * - Achievement Traits: Passive bonuses to tower damage, raid loot, etc.
 */

import type { CharacterClass } from "./classMastery";

/* ═══════════════════════════════════════════════════════
   TOWER DEFINITIONS — Defensive structures
   ═══════════════════════════════════════════════════════ */

export type TowerCategory = "basic" | "class" | "elemental" | "prestige" | "ultimate";

export interface TowerDef {
  key: string;
  name: string;
  description: string;
  category: TowerCategory;
  icon: string;
  color: string;
  /** Base stats at level 1 */
  baseDamage: number;
  baseRange: number; // grid tiles
  baseFireRate: number; // attacks per minute
  baseHp: number;
  /** Max level */
  maxLevel: number;
  /** Damage scaling per level */
  damagePerLevel: number;
  /** Cost to build */
  baseCost: Record<string, number>;
  costMultiplier: number;
  /** Element for synergy */
  element?: string;
  /** Special ability */
  specialAbility?: { name: string; description: string; cooldown: number };
  /** Class requirement */
  requiredClass?: CharacterClass;
  requiredClassRank?: number;
  /** Prestige requirement */
  requiredPrestige?: string;
  /** Civil skill requirement */
  requiredCivilSkill?: { skill: string; level: number };
  /** Grid size */
  gridSize: [number, number];
}

export const TOWERS: TowerDef[] = [
  /* ─── BASIC TOWERS (available to all) ─── */
  {
    key: "laser_turret",
    name: "Laser Turret",
    description: "Standard energy weapon. Fast fire rate, moderate damage.",
    category: "basic", icon: "Zap", color: "#3b82f6",
    baseDamage: 15, baseRange: 3, baseFireRate: 30, baseHp: 200,
    maxLevel: 10, damagePerLevel: 5,
    baseCost: { credits: 100, alloy: 20 }, costMultiplier: 1.3,
    element: "lightning", gridSize: [1, 1],
  },
  {
    key: "missile_launcher",
    name: "Missile Launcher",
    description: "Slow but devastating. Area damage on impact.",
    category: "basic", icon: "Rocket", color: "#ef4444",
    baseDamage: 40, baseRange: 4, baseFireRate: 10, baseHp: 300,
    maxLevel: 10, damagePerLevel: 12,
    baseCost: { credits: 200, alloy: 40 }, costMultiplier: 1.4,
    element: "fire",
    specialAbility: { name: "Cluster Bomb", description: "Every 5th shot splits into 3 projectiles", cooldown: 30 },
    gridSize: [1, 1],
  },
  {
    key: "barrier_wall",
    name: "Barrier Wall",
    description: "Blocks raider movement. High HP, no damage.",
    category: "basic", icon: "Square", color: "#6b7280",
    baseDamage: 0, baseRange: 0, baseFireRate: 0, baseHp: 500,
    maxLevel: 10, damagePerLevel: 0,
    baseCost: { credits: 50, alloy: 15 }, costMultiplier: 1.2,
    gridSize: [1, 1],
  },
  {
    key: "healing_pylon",
    name: "Healing Pylon",
    description: "Repairs nearby towers over time.",
    category: "basic", icon: "Heart", color: "#10b981",
    baseDamage: 0, baseRange: 2, baseFireRate: 0, baseHp: 150,
    maxLevel: 8, damagePerLevel: 0,
    baseCost: { credits: 150, crystal: 20, biomass: 15 }, costMultiplier: 1.4,
    element: "nature",
    specialAbility: { name: "Regeneration Pulse", description: "Heals all towers in range for 10% HP", cooldown: 60 },
    gridSize: [1, 1],
  },

  /* ─── CLASS TOWERS ─── */
  {
    key: "artillery_cannon",
    name: "Artillery Cannon",
    description: "Soldier-exclusive. Massive damage, huge range. The backbone of military defense.",
    category: "class", icon: "Target", color: "#dc2626",
    baseDamage: 80, baseRange: 6, baseFireRate: 6, baseHp: 400,
    maxLevel: 10, damagePerLevel: 20,
    baseCost: { credits: 400, alloy: 80 }, costMultiplier: 1.5,
    element: "fire",
    specialAbility: { name: "Bombardment", description: "3-second barrage dealing 5x damage to area", cooldown: 90 },
    requiredClass: "soldier", requiredClassRank: 2, gridSize: [2, 2],
  },
  {
    key: "tesla_coil",
    name: "Tesla Coil",
    description: "Engineer-exclusive. Chain lightning jumps between nearby enemies.",
    category: "class", icon: "Zap", color: "#f59e0b",
    baseDamage: 25, baseRange: 3, baseFireRate: 20, baseHp: 250,
    maxLevel: 10, damagePerLevel: 8,
    baseCost: { credits: 350, alloy: 40, crystal: 40 }, costMultiplier: 1.5,
    element: "lightning",
    specialAbility: { name: "Chain Lightning", description: "Damage chains to 3 additional targets at 50% damage", cooldown: 15 },
    requiredClass: "engineer", requiredClassRank: 2, gridSize: [1, 1],
  },
  {
    key: "oracle_spire",
    name: "Oracle Spire",
    description: "Oracle-exclusive. Reveals cloaked units and slows enemies in range.",
    category: "class", icon: "Eye", color: "#8b5cf6",
    baseDamage: 10, baseRange: 5, baseFireRate: 15, baseHp: 200,
    maxLevel: 8, damagePerLevel: 4,
    baseCost: { credits: 300, crystal: 60 }, costMultiplier: 1.5,
    element: "light",
    specialAbility: { name: "Prescience", description: "Reveals all cloaked units for 10 seconds", cooldown: 45 },
    requiredClass: "oracle", requiredClassRank: 2, gridSize: [1, 1],
  },
  {
    key: "shadow_trap",
    name: "Shadow Trap",
    description: "Spy-exclusive. Invisible until triggered. Massive burst damage.",
    category: "class", icon: "AlertTriangle", color: "#6366f1",
    baseDamage: 120, baseRange: 1, baseFireRate: 0, baseHp: 50,
    maxLevel: 8, damagePerLevel: 30,
    baseCost: { credits: 200, dark_matter: 30 }, costMultiplier: 1.4,
    element: "shadow",
    specialAbility: { name: "Ambush", description: "Invisible until enemy enters range, then detonates", cooldown: 0 },
    requiredClass: "spy", requiredClassRank: 1, gridSize: [1, 1],
  },
  {
    key: "venom_spire",
    name: "Venom Spire",
    description: "Assassin-exclusive. Applies poison that deals damage over time.",
    category: "class", icon: "Skull", color: "#10b981",
    baseDamage: 8, baseRange: 3, baseFireRate: 20, baseHp: 180,
    maxLevel: 8, damagePerLevel: 3,
    baseCost: { credits: 250, dark_matter: 20, biomass: 20 }, costMultiplier: 1.4,
    element: "nature",
    specialAbility: { name: "Neurotoxin", description: "Poison damage increased by 200% for 5 seconds", cooldown: 30 },
    requiredClass: "assassin", requiredClassRank: 2, gridSize: [1, 1],
  },

  /* ─── ELEMENTAL TOWERS ─── */
  {
    key: "inferno_tower",
    name: "Inferno Tower",
    description: "Deals increasing damage the longer it targets an enemy. Fire element.",
    category: "elemental", icon: "Flame", color: "#ef4444",
    baseDamage: 5, baseRange: 3, baseFireRate: 60, baseHp: 300,
    maxLevel: 8, damagePerLevel: 2,
    baseCost: { credits: 300, alloy: 30, crystal: 30 }, costMultiplier: 1.5,
    element: "fire",
    specialAbility: { name: "Escalating Heat", description: "Damage increases 10% per second on same target", cooldown: 0 },
    requiredCivilSkill: { skill: "tactics", level: 3 }, gridSize: [1, 1],
  },
  {
    key: "void_rift",
    name: "Void Rift",
    description: "Tears open a dimensional rift that pulls enemies toward it. Void element.",
    category: "elemental", icon: "Orbit", color: "#06b6d4",
    baseDamage: 20, baseRange: 4, baseFireRate: 12, baseHp: 200,
    maxLevel: 8, damagePerLevel: 6,
    baseCost: { credits: 350, void_essence: 40, crystal: 20 }, costMultiplier: 1.6,
    element: "void",
    specialAbility: { name: "Gravity Well", description: "Pulls all enemies in range 1 tile closer", cooldown: 20 },
    requiredCivilSkill: { skill: "perception", level: 4 }, gridSize: [2, 2],
  },
  {
    key: "shadow_obelisk",
    name: "Shadow Obelisk",
    description: "Weakens enemies in range, reducing their damage. Shadow element.",
    category: "elemental", icon: "Moon", color: "#475569",
    baseDamage: 12, baseRange: 3, baseFireRate: 15, baseHp: 250,
    maxLevel: 8, damagePerLevel: 4,
    baseCost: { credits: 280, dark_matter: 35 }, costMultiplier: 1.5,
    element: "shadow",
    specialAbility: { name: "Enervation", description: "Reduces enemy damage by 25% in range", cooldown: 0 },
    requiredCivilSkill: { skill: "espionage", level: 3 }, gridSize: [1, 1],
  },

  /* ─── PRESTIGE TOWERS ─── */
  {
    key: "temporal_disruptor",
    name: "Temporal Disruptor",
    description: "Chronomancer-exclusive. Freezes enemies in time for 3 seconds.",
    category: "prestige", icon: "Timer", color: "#8b5cf6",
    baseDamage: 30, baseRange: 4, baseFireRate: 8, baseHp: 350,
    maxLevel: 5, damagePerLevel: 10,
    baseCost: { credits: 1000, crystal: 100, void_essence: 80 }, costMultiplier: 2.0,
    element: "void",
    specialAbility: { name: "Time Stop", description: "Freezes all enemies in range for 3 seconds", cooldown: 60 },
    requiredPrestige: "chronomancer", gridSize: [2, 2],
  },
  {
    key: "warlord_bastion",
    name: "Warlord's Bastion",
    description: "Warlord-exclusive. Buffs all nearby towers with +25% damage.",
    category: "prestige", icon: "Shield", color: "#dc2626",
    baseDamage: 50, baseRange: 5, baseFireRate: 12, baseHp: 600,
    maxLevel: 5, damagePerLevel: 15,
    baseCost: { credits: 1200, alloy: 150, dark_matter: 50 }, costMultiplier: 2.0,
    element: "fire",
    specialAbility: { name: "Rally Cry", description: "All towers in range gain +25% damage for 10s", cooldown: 45 },
    requiredPrestige: "warlord", gridSize: [2, 2],
  },
  {
    key: "shadow_nexus",
    name: "Shadow Nexus",
    description: "Shadow Broker-exclusive. Steals resources from raiders on kill.",
    category: "prestige", icon: "EyeOff", color: "#475569",
    baseDamage: 35, baseRange: 3, baseFireRate: 18, baseHp: 280,
    maxLevel: 5, damagePerLevel: 10,
    baseCost: { credits: 1000, dark_matter: 120, alloy: 60 }, costMultiplier: 2.0,
    element: "shadow",
    specialAbility: { name: "Resource Drain", description: "Each kill steals 5% of raider's carried loot", cooldown: 0 },
    requiredPrestige: "shadow_broker", gridSize: [2, 2],
  },
];

/* ═══════════════════════════════════════════════════════
   RAID UNITS — Troops for attacking other bases
   ═══════════════════════════════════════════════════════ */

export interface RaidUnit {
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  baseHp: number;
  baseDamage: number;
  moveSpeed: number; // tiles per second
  targetPriority: "nearest" | "weakest" | "strongest" | "resource";
  /** Cost per unit */
  cost: Record<string, number>;
  /** Training time in seconds */
  trainTime: number;
  /** Class requirement */
  requiredClass?: CharacterClass;
  requiredClassRank?: number;
  /** Special ability */
  specialAbility?: string;
}

export const RAID_UNITS: RaidUnit[] = [
  {
    key: "grunt",
    name: "Grunt",
    description: "Basic infantry. Cheap and expendable.",
    icon: "User", color: "#6b7280",
    baseHp: 100, baseDamage: 10, moveSpeed: 1.0, targetPriority: "nearest",
    cost: { credits: 20 }, trainTime: 5,
  },
  {
    key: "heavy",
    name: "Heavy",
    description: "Armored unit. Slow but tanky. Soldier class boosts HP.",
    icon: "Shield", color: "#dc2626",
    baseHp: 300, baseDamage: 15, moveSpeed: 0.6, targetPriority: "strongest",
    cost: { credits: 60, alloy: 10 }, trainTime: 15,
    requiredClass: "soldier", requiredClassRank: 1,
  },
  {
    key: "saboteur",
    name: "Saboteur",
    description: "Cloaked unit that targets resource buildings. Spy class extends cloak.",
    icon: "EyeOff", color: "#6366f1",
    baseHp: 80, baseDamage: 25, moveSpeed: 1.5, targetPriority: "resource",
    cost: { credits: 80, dark_matter: 5 }, trainTime: 20,
    requiredClass: "spy", requiredClassRank: 1,
    specialAbility: "Cloaked for first 10 seconds",
  },
  {
    key: "engineer_drone",
    name: "Engineer Drone",
    description: "Disables towers temporarily. Engineer class extends disable duration.",
    icon: "Cpu", color: "#f59e0b",
    baseHp: 60, baseDamage: 5, moveSpeed: 1.2, targetPriority: "nearest",
    cost: { credits: 100, crystal: 10 }, trainTime: 25,
    requiredClass: "engineer", requiredClassRank: 2,
    specialAbility: "Disables target tower for 5 seconds",
  },
  {
    key: "berserker",
    name: "Berserker",
    description: "Deals more damage as HP drops. Assassin class boosts crit chance.",
    icon: "Swords", color: "#ef4444",
    baseHp: 150, baseDamage: 20, moveSpeed: 1.3, targetPriority: "nearest",
    cost: { credits: 70, alloy: 8 }, trainTime: 12,
    requiredClass: "assassin", requiredClassRank: 1,
    specialAbility: "Damage increases by 50% below 30% HP",
  },
  {
    key: "healer",
    name: "Medic",
    description: "Heals nearby raid units. Oracle class boosts heal amount.",
    icon: "Heart", color: "#10b981",
    baseHp: 80, baseDamage: 0, moveSpeed: 0.8, targetPriority: "weakest",
    cost: { credits: 90, biomass: 10 }, trainTime: 18,
    requiredClass: "oracle", requiredClassRank: 1,
    specialAbility: "Heals nearest ally for 15 HP/sec",
  },
  {
    key: "siege_engine",
    name: "Siege Engine",
    description: "Massive unit that deals huge damage to buildings. Very slow.",
    icon: "Truck", color: "#a16207",
    baseHp: 500, baseDamage: 60, moveSpeed: 0.3, targetPriority: "strongest",
    cost: { credits: 200, alloy: 30, crystal: 15 }, trainTime: 40,
    requiredClass: "soldier", requiredClassRank: 3,
    specialAbility: "Deals 3x damage to buildings",
  },
];

/* ═══════════════════════════════════════════════════════
   TOWER ELEMENTAL SYNERGIES — Adjacent tower combos
   ═══════════════════════════════════════════════════════ */

export interface TowerSynergy {
  elements: [string, string];
  name: string;
  effect: string;
  damageBonus: number;
  specialEffect?: string;
}

export const TOWER_SYNERGIES: TowerSynergy[] = [
  {
    elements: ["fire", "lightning"],
    name: "Plasma Storm",
    effect: "+20% damage, attacks chain to 1 additional target",
    damageBonus: 0.20,
    specialEffect: "chain_1",
  },
  {
    elements: ["shadow", "void"],
    name: "Dimensional Rift",
    effect: "+15% damage, enemies slowed by 30%",
    damageBonus: 0.15,
    specialEffect: "slow_30",
  },
  {
    elements: ["fire", "nature"],
    name: "Wildfire",
    effect: "+25% damage, applies burning DOT",
    damageBonus: 0.25,
    specialEffect: "burn_dot",
  },
  {
    elements: ["lightning", "void"],
    name: "Quantum Discharge",
    effect: "+18% damage, chance to stun for 1 second",
    damageBonus: 0.18,
    specialEffect: "stun_1s",
  },
  {
    elements: ["shadow", "nature"],
    name: "Toxic Mist",
    effect: "+15% damage, reduces enemy healing by 50%",
    damageBonus: 0.15,
    specialEffect: "anti_heal_50",
  },
  {
    elements: ["light", "fire"],
    name: "Solar Flare",
    effect: "+22% damage, blinds enemies reducing accuracy",
    damageBonus: 0.22,
    specialEffect: "blind",
  },
];

/* ═══════════════════════════════════════════════════════
   RPG BONUS RESOLVERS — How character builds affect TD
   ═══════════════════════════════════════════════════════ */

export interface TowerDefenseBonuses {
  towerDamageMultiplier: number;
  towerHpMultiplier: number;
  towerRangeBonus: number;
  raidUnitHpMultiplier: number;
  raidUnitDamageMultiplier: number;
  raidLootMultiplier: number;
  maxTowerSlots: number;
  maxRaidUnits: number;
  sources: { source: string; label: string }[];
}

export function resolveTowerDefenseBonuses(opts: {
  characterClass?: string;
  classRank?: number;
  species?: string;
  civilSkills?: Record<string, number>;
  talents?: string[];
  prestigeClass?: string;
  prestigeRank?: number;
  achievementTraits?: string[];
  companionIds?: string[];
}): TowerDefenseBonuses {
  const b: TowerDefenseBonuses = {
    towerDamageMultiplier: 1.0,
    towerHpMultiplier: 1.0,
    towerRangeBonus: 0,
    raidUnitHpMultiplier: 1.0,
    raidUnitDamageMultiplier: 1.0,
    raidLootMultiplier: 1.0,
    maxTowerSlots: 10,
    maxRaidUnits: 20,
    sources: [],
  };

  // CLASS BONUSES
  const classMap: Record<string, () => void> = {
    soldier: () => {
      b.towerDamageMultiplier += 0.05 * (opts.classRank || 0);
      b.raidUnitHpMultiplier += 0.05 * (opts.classRank || 0);
      b.maxRaidUnits += 2 * (opts.classRank || 0);
      b.sources.push({ source: "Soldier", label: `+${5 * (opts.classRank || 0)}% tower dmg, +${5 * (opts.classRank || 0)}% unit HP, +${2 * (opts.classRank || 0)} raid units` });
    },
    engineer: () => {
      b.towerHpMultiplier += 0.08 * (opts.classRank || 0);
      b.towerRangeBonus += Math.floor((opts.classRank || 0) / 2);
      b.maxTowerSlots += (opts.classRank || 0);
      b.sources.push({ source: "Engineer", label: `+${8 * (opts.classRank || 0)}% tower HP, +${Math.floor((opts.classRank || 0) / 2)} range, +${opts.classRank || 0} tower slots` });
    },
    oracle: () => {
      b.towerRangeBonus += 1;
      b.towerDamageMultiplier += 0.03 * (opts.classRank || 0);
      b.sources.push({ source: "Oracle", label: `+1 tower range, +${3 * (opts.classRank || 0)}% tower dmg` });
    },
    spy: () => {
      b.raidUnitDamageMultiplier += 0.06 * (opts.classRank || 0);
      b.raidLootMultiplier += 0.04 * (opts.classRank || 0);
      b.sources.push({ source: "Spy", label: `+${6 * (opts.classRank || 0)}% raid dmg, +${4 * (opts.classRank || 0)}% loot` });
    },
    assassin: () => {
      b.raidUnitDamageMultiplier += 0.08 * (opts.classRank || 0);
      b.sources.push({ source: "Assassin", label: `+${8 * (opts.classRank || 0)}% raid unit damage` });
    },
  };
  if (opts.characterClass && classMap[opts.characterClass]) classMap[opts.characterClass]();

  // SPECIES BONUSES
  const speciesMap: Record<string, () => void> = {
    demagi: () => { b.towerHpMultiplier += 0.10; b.raidUnitHpMultiplier += 0.10; b.sources.push({ source: "Demagi", label: "+10% tower & unit HP" }); },
    quarchon: () => { b.towerDamageMultiplier += 0.08; b.towerHpMultiplier += 0.12; b.sources.push({ source: "Quarchon", label: "+8% tower dmg, +12% tower HP" }); },
    neyon: () => { b.raidLootMultiplier += 0.15; b.raidUnitDamageMultiplier += 0.05; b.sources.push({ source: "Neyon", label: "+15% raid loot, +5% raid dmg" }); },
    human: () => { b.maxTowerSlots += 2; b.maxRaidUnits += 5; b.sources.push({ source: "Human", label: "+2 tower slots, +5 raid units (adaptability)" }); },
    synthetic: () => { b.towerDamageMultiplier += 0.10; b.raidUnitDamageMultiplier += 0.10; b.sources.push({ source: "Synthetic", label: "+10% all damage (optimization)" }); },
  };
  if (opts.species && speciesMap[opts.species]) speciesMap[opts.species]();

  // CIVIL SKILL BONUSES
  if (opts.civilSkills) {
    const tactics = opts.civilSkills["tactics"] || 0;
    if (tactics >= 2) {
      b.towerDamageMultiplier += 0.02 * tactics;
      b.sources.push({ source: "Tactics Skill", label: `+${2 * tactics}% tower damage from tactical planning` });
    }
    const leadership = opts.civilSkills["leadership"] || 0;
    if (leadership >= 2) {
      b.maxRaidUnits += leadership;
      b.raidUnitHpMultiplier += 0.01 * leadership;
      b.sources.push({ source: "Leadership Skill", label: `+${leadership} raid units, +${leadership}% unit HP` });
    }
    const endurance = opts.civilSkills["endurance"] || 0;
    if (endurance >= 3) {
      b.towerHpMultiplier += 0.02 * endurance;
      b.sources.push({ source: "Endurance Skill", label: `+${2 * endurance}% tower HP` });
    }
  }

  // TALENT BONUSES
  if (opts.talents) {
    if (opts.talents.includes("war_veteran")) {
      b.towerDamageMultiplier += 0.15;
      b.maxRaidUnits += 10;
      b.sources.push({ source: "War Veteran", label: "+15% tower dmg, +10 raid units" });
    }
    if (opts.talents.includes("battle_hardened")) {
      b.towerHpMultiplier += 0.15;
      b.raidUnitHpMultiplier += 0.15;
      b.sources.push({ source: "Battle Hardened", label: "+15% all HP" });
    }
    if (opts.talents.includes("iron_constitution")) {
      b.towerHpMultiplier += 0.10;
      b.sources.push({ source: "Iron Constitution", label: "+10% tower HP" });
    }
    if (opts.talents.includes("scavenger")) {
      b.raidLootMultiplier += 0.15;
      b.sources.push({ source: "Scavenger", label: "+15% raid loot" });
    }
    if (opts.talents.includes("transcendence")) {
      b.towerDamageMultiplier += 0.10;
      b.raidUnitDamageMultiplier += 0.10;
      b.raidLootMultiplier += 0.10;
      b.sources.push({ source: "Transcendence", label: "+10% all TD bonuses" });
    }
  }

  // PRESTIGE BONUSES
  if (opts.prestigeClass && opts.prestigeRank) {
    const pr = opts.prestigeRank;
    if (opts.prestigeClass === "warlord") {
      b.towerDamageMultiplier += 0.10 * pr;
      b.maxRaidUnits += 5 * pr;
      b.sources.push({ source: "Warlord Prestige", label: `+${10 * pr}% tower dmg, +${5 * pr} raid units` });
    }
    if (opts.prestigeClass === "technomancer") {
      b.maxTowerSlots += 2 * pr;
      b.towerRangeBonus += pr;
      b.sources.push({ source: "Technomancer Prestige", label: `+${2 * pr} tower slots, +${pr} range` });
    }
    if (opts.prestigeClass === "shadow_broker") {
      b.raidLootMultiplier += 0.15 * pr;
      b.sources.push({ source: "Shadow Broker Prestige", label: `+${15 * pr}% raid loot` });
    }
  }

  // ACHIEVEMENT TRAIT BONUSES
  if (opts.achievementTraits) {
    if (opts.achievementTraits.includes("iron_fortress")) {
      b.towerHpMultiplier += 0.20;
      b.towerDamageMultiplier += 0.10;
      b.sources.push({ source: "Iron Fortress", label: "+20% tower HP, +10% tower dmg" });
    }
    if (opts.achievementTraits.includes("raid_master")) {
      b.raidUnitDamageMultiplier += 0.20;
      b.raidLootMultiplier += 0.20;
      b.sources.push({ source: "Raid Master", label: "+20% raid dmg & loot" });
    }
  }

  // COMPANION AURA BONUSES
  if (opts.companionIds && opts.companionIds.length > 0) {
    b.towerDamageMultiplier += 0.03 * opts.companionIds.length;
    b.raidUnitHpMultiplier += 0.03 * opts.companionIds.length;
    b.sources.push({ source: "Companion Auras", label: `+${3 * opts.companionIds.length}% tower dmg & unit HP from ${opts.companionIds.length} companions` });
  }

  return b;
}

/* ═══════════════════════════════════════════════════════
   RAID RESULT CALCULATION
   ═══════════════════════════════════════════════════════ */

export interface RaidResult {
  success: boolean;
  starsEarned: 0 | 1 | 2 | 3;
  damageDealt: number;
  lootStolen: Record<string, number>;
  unitsLost: number;
  towersDestroyed: number;
  xpEarned: number;
  trophiesGained: number;
}

/**
 * Calculate raid stars based on destruction percentage.
 */
export function calculateRaidStars(destructionPercent: number): 0 | 1 | 2 | 3 {
  if (destructionPercent >= 100) return 3;
  if (destructionPercent >= 50) return 2;
  if (destructionPercent >= 25) return 1;
  return 0;
}

/**
 * Calculate loot stolen based on destruction and bonuses.
 */
export function calculateRaidLoot(
  defenderResources: Record<string, number>,
  destructionPercent: number,
  lootMultiplier: number
): Record<string, number> {
  const loot: Record<string, number> = {};
  const baseStealPercent = Math.min(destructionPercent / 100, 1) * 0.20; // max 20% of defender resources
  for (const [resource, amount] of Object.entries(defenderResources)) {
    loot[resource] = Math.floor(amount * baseStealPercent * lootMultiplier);
  }
  return loot;
}

/**
 * Get towers available to a player based on RPG stats.
 */
export function getAvailableTowers(opts: {
  characterClass?: string;
  classRank?: number;
  prestigeClass?: string;
  civilSkills?: Record<string, number>;
}): TowerDef[] {
  return TOWERS.filter(t => {
    if (t.requiredClass && t.requiredClass !== opts.characterClass) return false;
    if (t.requiredClassRank && (opts.classRank || 0) < t.requiredClassRank) return false;
    if (t.requiredPrestige && t.requiredPrestige !== opts.prestigeClass) return false;
    if (t.requiredCivilSkill) {
      const level = opts.civilSkills?.[t.requiredCivilSkill.skill] || 0;
      if (level < t.requiredCivilSkill.level) return false;
    }
    return true;
  });
}

/**
 * Get raid units available to a player.
 */
export function getAvailableRaidUnits(opts: {
  characterClass?: string;
  classRank?: number;
}): RaidUnit[] {
  return RAID_UNITS.filter(u => {
    if (u.requiredClass && u.requiredClass !== opts.characterClass) return false;
    if (u.requiredClassRank && (opts.classRank || 0) < u.requiredClassRank) return false;
    return true;
  });
}

/**
 * Check for tower synergies on the grid.
 */
export function checkTowerSynergies(towerElements: string[]): TowerSynergy[] {
  const active: TowerSynergy[] = [];
  const elementSet = new Set(towerElements);
  for (const synergy of TOWER_SYNERGIES) {
    if (elementSet.has(synergy.elements[0]) && elementSet.has(synergy.elements[1])) {
      active.push(synergy);
    }
  }
  return active;
}
