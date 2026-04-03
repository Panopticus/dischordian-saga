/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM — Base Persistence, Upgrades, Traps,
   Barricades, and PvP Raid System

   Inspired by Clash of Clans' core loop:
   - Build/upgrade base (time-gated, speed up with premium)
   - Defend against waves (PvE) and raids (PvP)
   - Attack other players' bases for resources
   - Shield system prevents grief spirals
   - Star rating on attacks
   ═══════════════════════════════════════════════════════ */
import type {
  GridCell, TurretInstance, GameResources, Vec2, TurretDef,
} from "./types";

/* ─── BASE LAYOUT PERSISTENCE ─── */

export interface SavedBase {
  id: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  turrets: SavedTurret[];
  barricades: Vec2[];
  traps: SavedTrap[];
  resourceNodes: Vec2[];
  corePosition: Vec2;
  spawnPoints: Vec2[];
  /** Ark Commander Level — determines max turrets, barricades, trap slots */
  commanderLevel: number;
  /** Total resources invested in this base */
  totalInvested: GameResources;
  /** Base "weight" for PvP matchmaking (sum of all defense values) */
  defenseWeight: number;
}

export interface SavedTurret {
  type: string;
  row: number;
  col: number;
  level: number;
  upgradeCompleteAt?: number; // timestamp when upgrade finishes (0 = ready)
}

/* ─── TURRET UPGRADE SYSTEM ─── */

export interface UpgradeDef {
  level: number;
  cost: { salvage: number; viralIchor?: number; neuralCores?: number };
  /** Time in seconds to complete upgrade (0 = instant at level 1) */
  buildTime: number;
  /** Stat multipliers at this level */
  damageMultiplier: number;
  healthMultiplier: number;
  rangeBonus: number; // additional tiles
}

/** Upgrade paths per turret level (applies to all turret types) */
export const UPGRADE_LEVELS: UpgradeDef[] = [
  { level: 1, cost: { salvage: 0 }, buildTime: 0, damageMultiplier: 1.0, healthMultiplier: 1.0, rangeBonus: 0 },
  { level: 2, cost: { salvage: 100, viralIchor: 10 }, buildTime: 60, damageMultiplier: 1.3, healthMultiplier: 1.2, rangeBonus: 0 },
  { level: 3, cost: { salvage: 250, viralIchor: 30 }, buildTime: 300, damageMultiplier: 1.6, healthMultiplier: 1.5, rangeBonus: 0.5 },
  { level: 4, cost: { salvage: 500, viralIchor: 60, neuralCores: 5 }, buildTime: 900, damageMultiplier: 2.0, healthMultiplier: 1.8, rangeBonus: 0.5 },
  { level: 5, cost: { salvage: 1000, viralIchor: 120, neuralCores: 15 }, buildTime: 3600, damageMultiplier: 2.5, healthMultiplier: 2.2, rangeBonus: 1.0 },
  { level: 6, cost: { salvage: 2000, viralIchor: 250, neuralCores: 30 }, buildTime: 7200, damageMultiplier: 3.0, healthMultiplier: 2.5, rangeBonus: 1.0 },
];

/** Commander level determines base capacity */
export interface CommanderLevelDef {
  level: number;
  maxTurrets: number;
  maxBarricades: number;
  maxTraps: number;
  upgradeCost: { salvage: number; neuralCores: number; voidCrystals?: number };
  upgradeTime: number; // seconds
}

export const COMMANDER_LEVELS: CommanderLevelDef[] = [
  { level: 1, maxTurrets: 6, maxBarricades: 10, maxTraps: 2, upgradeCost: { salvage: 0, neuralCores: 0 }, upgradeTime: 0 },
  { level: 2, maxTurrets: 10, maxBarricades: 20, maxTraps: 4, upgradeCost: { salvage: 500, neuralCores: 5 }, upgradeTime: 300 },
  { level: 3, maxTurrets: 15, maxBarricades: 35, maxTraps: 6, upgradeCost: { salvage: 1500, neuralCores: 15 }, upgradeTime: 1800 },
  { level: 4, maxTurrets: 20, maxBarricades: 50, maxTraps: 8, upgradeCost: { salvage: 3000, neuralCores: 30, voidCrystals: 5 }, upgradeTime: 7200 },
  { level: 5, maxTurrets: 28, maxBarricades: 70, maxTraps: 12, upgradeCost: { salvage: 6000, neuralCores: 60, voidCrystals: 15 }, upgradeTime: 14400 },
  { level: 6, maxTurrets: 36, maxBarricades: 90, maxTraps: 16, upgradeCost: { salvage: 12000, neuralCores: 100, voidCrystals: 30 }, upgradeTime: 28800 },
];

/* ─── BARRICADES (WALLS) ─── */

export interface BarricadeDef {
  name: string;
  health: number;
  cost: { salvage: number };
  description: string;
  color: string;
}

export const BARRICADES: Record<string, BarricadeDef> = {
  hull_plate: {
    name: "Hull Plate",
    health: 200,
    cost: { salvage: 25 },
    description: "Salvaged Ark hull plating. Creates impassable barriers that enemies must walk around.",
    color: "#4a4a5a",
  },
  reinforced_wall: {
    name: "Reinforced Wall",
    health: 500,
    cost: { salvage: 75 },
    description: "Double-layered hull plate with internal bracing. Extremely durable.",
    color: "#6a6a7a",
  },
  energy_fence: {
    name: "Energy Fence",
    health: 150,
    cost: { salvage: 50 },
    description: "Electrified barrier that damages enemies that attack it (10 damage per hit).",
    color: "#4488cc",
  },
};

/* ─── HIDDEN TRAPS (invisible to PvP attackers) ─── */

export interface TrapDef {
  id: string;
  name: string;
  description: string;
  triggerRadius: number;  // tiles
  effect: TrapEffect;
  cost: { salvage: number; viralIchor?: number };
  rearmCost: { salvage: number }; // cost to rearm after triggered
  oneShot: boolean; // true = destroyed after trigger, false = rearms
  color: string;
}

export type TrapEffect =
  | { type: "damage"; amount: number; radius: number }
  | { type: "slow"; duration: number; radius: number }
  | { type: "stun"; duration: number; radius: number }
  | { type: "spring"; launchDistance: number } // pushes enemies back
  | { type: "seeking"; damage: number; targetCount: number; targetType: "ground" | "air" };

export interface SavedTrap {
  type: string;
  row: number;
  col: number;
  armed: boolean;
}

export const TRAPS: Record<string, TrapDef> = {
  proximity_mine: {
    id: "proximity_mine",
    name: "Proximity Mine",
    description: "Explodes when enemies walk over it. High damage, single use.",
    triggerRadius: 0.5,
    effect: { type: "damage", amount: 80, radius: 1.5 },
    cost: { salvage: 50 },
    rearmCost: { salvage: 25 },
    oneShot: true,
    color: "#ff4444",
  },
  cryo_trap: {
    id: "cryo_trap",
    name: "Cryo Trap",
    description: "Flash-freezes nearby enemies. Reusable with cooldown.",
    triggerRadius: 1,
    effect: { type: "slow", duration: 300, radius: 2 },
    cost: { salvage: 60, viralIchor: 5 },
    rearmCost: { salvage: 20 },
    oneShot: false,
    color: "#88ddff",
  },
  emp_trap: {
    id: "emp_trap",
    name: "EMP Trap",
    description: "Electromagnetic pulse stuns all nearby enemies. Single use.",
    triggerRadius: 1,
    effect: { type: "stun", duration: 180, radius: 2.5 },
    cost: { salvage: 80, viralIchor: 10 },
    rearmCost: { salvage: 40 },
    oneShot: true,
    color: "#ffdd44",
  },
  repulsor_plate: {
    id: "repulsor_plate",
    name: "Repulsor Plate",
    description: "Gravity pulse launches enemies backward. Reusable.",
    triggerRadius: 0.5,
    effect: { type: "spring", launchDistance: 4 },
    cost: { salvage: 70 },
    rearmCost: { salvage: 30 },
    oneShot: false,
    color: "#44ff88",
  },
  seeking_mine: {
    id: "seeking_mine",
    name: "Seeking Air Mine",
    description: "Launches tracking projectiles at flying enemies. Single use, devastating to air.",
    triggerRadius: 2,
    effect: { type: "seeking", damage: 120, targetCount: 3, targetType: "air" },
    cost: { salvage: 100, viralIchor: 15 },
    rearmCost: { salvage: 50 },
    oneShot: true,
    color: "#ff8844",
  },
};

/* ─── PVP RAID SYSTEM ─── */

export interface RaidResult {
  attackerId: string;
  defenderId: string;
  stars: 0 | 1 | 2 | 3;
  destructionPercent: number;
  lootStolen: GameResources;
  trophyChange: number;
  duration: number; // seconds
  replay?: RaidReplayFrame[];
}

/** Star calculation for PvP raids:
 * 1★ = Survived 60 seconds (attacker deployed troops)
 * 2★ = Core undamaged (defender's core still has >0 HP)
 * 3★ = All turrets destroyed
 * Note: This is from the ATTACKER's perspective attacking defender's base
 */
export function calculateStars(
  coreDestroyed: boolean,
  turretsDestroyedPercent: number,
  attackDuration: number,
): 0 | 1 | 2 | 3 {
  if (coreDestroyed) return 3; // Perfect attack
  if (turretsDestroyedPercent >= 50) return 2; // Majority destroyed
  if (attackDuration >= 60) return 1; // Managed to engage
  return 0; // Failed raid
}

/** Loot calculation — attackers steal a percentage of defender's resources */
export function calculateLoot(
  defenderResources: GameResources,
  stars: number,
  trophyDifference: number,
): GameResources {
  // Base steal rate: 10-20% depending on stars
  const baseRate = 0.05 + stars * 0.05;
  // Trophy bonus: higher trophy opponents give more loot
  const trophyBonus = Math.max(0, trophyDifference * 0.001);
  const rate = Math.min(0.25, baseRate + trophyBonus); // Cap at 25%

  return {
    salvage: Math.floor(defenderResources.salvage * rate),
    viralIchor: Math.floor(defenderResources.viralIchor * rate),
    neuralCores: Math.floor(defenderResources.neuralCores * rate * 0.5), // Cores harder to steal
    voidCrystals: 0, // Void crystals can't be stolen (too precious)
  };
}

/** Trophy change calculation (Elo-style) */
export function calculateTrophyChange(
  attackerTrophies: number,
  defenderTrophies: number,
  stars: number,
): { attackerChange: number; defenderChange: number } {
  const expected = 1 / (1 + Math.pow(10, (defenderTrophies - attackerTrophies) / 400));
  const result = stars >= 2 ? 1 : stars === 1 ? 0.5 : 0;
  const k = 30;
  const change = Math.round(k * (result - expected));

  return {
    attackerChange: change,
    defenderChange: -change,
  };
}

/* ─── SHIELD SYSTEM ─── */

export interface ShieldStatus {
  active: boolean;
  expiresAt: number; // timestamp
  type: "attack" | "purchase" | "none";
}

/** Shield duration based on destruction percentage */
export function getShieldDuration(destructionPercent: number): number {
  if (destructionPercent >= 90) return 16 * 3600; // 16 hours
  if (destructionPercent >= 60) return 14 * 3600; // 14 hours
  if (destructionPercent >= 30) return 12 * 3600; // 12 hours
  return 0; // No shield if less than 30% destroyed
}

/* ─── TROPHY LEAGUES ─── */

export interface LeagueDef {
  name: string;
  minTrophies: number;
  color: string;
  icon: string;
  lootBonus: GameResources; // bonus per successful defense
}

export const LEAGUES: LeagueDef[] = [
  { name: "Salvager", minTrophies: 0, color: "#8b6914", icon: "🔧", lootBonus: { salvage: 10, viralIchor: 0, neuralCores: 0, voidCrystals: 0 } },
  { name: "Scavenger", minTrophies: 400, color: "#c0c0c0", icon: "🛡️", lootBonus: { salvage: 25, viralIchor: 2, neuralCores: 0, voidCrystals: 0 } },
  { name: "Defender", minTrophies: 800, color: "#ffd700", icon: "⚔️", lootBonus: { salvage: 50, viralIchor: 5, neuralCores: 1, voidCrystals: 0 } },
  { name: "Sentinel", minTrophies: 1200, color: "#00bcd4", icon: "🏰", lootBonus: { salvage: 100, viralIchor: 10, neuralCores: 2, voidCrystals: 0 } },
  { name: "Warden", minTrophies: 1600, color: "#9c27b0", icon: "🔮", lootBonus: { salvage: 150, viralIchor: 20, neuralCores: 3, voidCrystals: 1 } },
  { name: "Commander", minTrophies: 2000, color: "#ff5722", icon: "🔥", lootBonus: { salvage: 250, viralIchor: 30, neuralCores: 5, voidCrystals: 2 } },
  { name: "Ark Marshal", minTrophies: 2500, color: "#e91e63", icon: "👑", lootBonus: { salvage: 400, viralIchor: 50, neuralCores: 10, voidCrystals: 3 } },
];

export function getLeague(trophies: number): LeagueDef {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (trophies >= LEAGUES[i].minTrophies) return LEAGUES[i];
  }
  return LEAGUES[0];
}

/* ─── ARK COMMANDER PASS (Season Pass / $5 Monetization) ─── */

export interface SeasonPassTier {
  tier: number;
  pointsRequired: number;
  freeReward: PassReward;
  premiumReward: PassReward;
}

export interface PassReward {
  salvage?: number;
  viralIchor?: number;
  neuralCores?: number;
  voidCrystals?: number;
  dream?: number;
  cardPack?: string;
  turretSkin?: string;
  title?: string;
  speedBoost?: number; // hours of 2x upgrade speed
}

export const ARK_COMMANDER_PASS: SeasonPassTier[] = [
  { tier: 1, pointsRequired: 0, freeReward: { salvage: 100 }, premiumReward: { salvage: 300, speedBoost: 1 } },
  { tier: 2, pointsRequired: 100, freeReward: { viralIchor: 10 }, premiumReward: { viralIchor: 30, dream: 20 } },
  { tier: 3, pointsRequired: 250, freeReward: { salvage: 200 }, premiumReward: { salvage: 500, cardPack: "season1" } },
  { tier: 4, pointsRequired: 450, freeReward: { neuralCores: 2 }, premiumReward: { neuralCores: 8, speedBoost: 2 } },
  { tier: 5, pointsRequired: 700, freeReward: { salvage: 300, dream: 10 }, premiumReward: { salvage: 800, dream: 50, turretSkin: "neon_pulse" } },
  { tier: 6, pointsRequired: 1000, freeReward: { viralIchor: 20 }, premiumReward: { viralIchor: 60, neuralCores: 5 } },
  { tier: 7, pointsRequired: 1400, freeReward: { salvage: 400 }, premiumReward: { salvage: 1000, voidCrystals: 2, speedBoost: 4 } },
  { tier: 8, pointsRequired: 1900, freeReward: { neuralCores: 3, dream: 20 }, premiumReward: { neuralCores: 12, dream: 100, cardPack: "season2" } },
  { tier: 9, pointsRequired: 2500, freeReward: { voidCrystals: 1 }, premiumReward: { voidCrystals: 5, turretSkin: "void_emitter" } },
  { tier: 10, pointsRequired: 3200, freeReward: { salvage: 500, dream: 30 }, premiumReward: { salvage: 2000, dream: 200, voidCrystals: 10, title: "Ark Commander", turretSkin: "source_infused" } },
];

/** Premium pass benefits (active when purchased) */
export const PREMIUM_PASS_BENEFITS = {
  upgradeSpeedBonus: 0.2,    // 20% faster turret upgrades
  waveSpeedBonus: 0.1,       // 10% faster wave completion
  lootBonus: 0.15,           // 15% more resources from waves
  extraTrapSlots: 2,         // +2 trap slots
  dailyFreePack: true,       // Free card pack daily
  exclusiveBarricadeSkin: "commander_wall",
  exclusiveTurretSkins: ["neon_pulse", "void_emitter", "source_infused"],
};

/* ─── REPLAY SYSTEM ─── */

export interface RaidReplayFrame {
  timestamp: number;
  events: ReplayEvent[];
}

export type ReplayEvent =
  | { type: "enemy_spawn"; enemyType: string; x: number; y: number }
  | { type: "enemy_move"; enemyId: string; x: number; y: number }
  | { type: "turret_fire"; turretId: string; targetId: string }
  | { type: "enemy_death"; enemyId: string; x: number; y: number }
  | { type: "turret_destroyed"; turretId: string }
  | { type: "trap_triggered"; trapId: string }
  | { type: "core_damage"; amount: number }
  | { type: "core_destroyed" };

/* ═══════════════════════════════════════════════════════
   GUILD INTEGRATION — Terminus Swarm connects to the
   existing Syndicate (guild) system. No separate clan
   needed — guilds ARE the Ark flotillas.

   How it integrates:
   - Syndicate World = your guild's crashed Ark base
   - Guild War Points earned from TD wave completions and kills
   - PvP raids target rival guilds' syndicate world defenses
   - Resources can be donated to guild treasury
   - Guild-level turret blueprints shared via donation system
   - Guild wars include Terminus Swarm as a contribution source
   ═══════════════════════════════════════════════════════ */

/** Guild war point values for Terminus Swarm activities */
export const GUILD_WAR_POINTS = {
  wave_completed: 15,       // Per wave survived
  boss_killed: 50,          // Per boss wave completed
  source_avatar_killed: 200, // Defeating The Source's Avatar
  kills_100: 10,            // Per 100 enemies killed
  pvp_raid_star: 30,        // Per star earned in PvP raid
  pvp_defense_success: 25,  // Successfully defending your base
  turret_donated: 5,        // Donating a turret blueprint to a guildmate
};

/** Guild bonus tiers for Terminus Swarm based on guild level */
export const GUILD_TD_BONUSES: Record<number, GuildTDBonus> = {
  1: { waveRewardBonus: 0, maxSharedTurrets: 0, description: "No Terminus bonuses" },
  2: { waveRewardBonus: 0.05, maxSharedTurrets: 1, description: "+5% wave loot, 1 shared turret slot" },
  3: { waveRewardBonus: 0.08, maxSharedTurrets: 2, description: "+8% wave loot, 2 shared turret slots" },
  4: { waveRewardBonus: 0.10, maxSharedTurrets: 3, description: "+10% wave loot, 3 shared turret slots" },
  5: { waveRewardBonus: 0.12, maxSharedTurrets: 3, description: "+12% wave loot, guild turret skin" },
  6: { waveRewardBonus: 0.15, maxSharedTurrets: 4, description: "+15% wave loot, 4 shared turrets" },
  7: { waveRewardBonus: 0.18, maxSharedTurrets: 4, description: "+18% wave loot, raid shield extension" },
  8: { waveRewardBonus: 0.20, maxSharedTurrets: 5, description: "+20% wave loot, 5 shared turrets" },
  9: { waveRewardBonus: 0.22, maxSharedTurrets: 5, description: "+22% wave loot, exclusive guild emblem" },
  10: { waveRewardBonus: 0.25, maxSharedTurrets: 6, description: "+25% wave loot, 6 shared turrets, guild leaderboard badge" },
};

export interface GuildTDBonus {
  /** Percentage bonus to all wave resource rewards */
  waveRewardBonus: number;
  /** Number of turret blueprints guildmates can place in your base */
  maxSharedTurrets: number;
  /** Description for UI display */
  description: string;
}

/**
 * Turret Blueprint Donation
 * Guild members can donate turret blueprints that appear as placeable
 * turrets in other members' Terminus Swarm bases. These turrets are
 * temporary (last until the base is raided or reset) but don't cost
 * the recipient any resources to place.
 */
export interface TurretDonation {
  donorId: number;
  donorName: string;
  turretType: string;
  turretLevel: number;
  expiresAt: number; // timestamp — donated turrets expire after 24h
}

/**
 * Calculate guild war points earned from a Terminus Swarm session.
 * Called at the end of each game to report to the guild war system.
 */
export function calculateGuildWarContribution(
  wavesCompleted: number,
  bossesKilled: number,
  totalKills: number,
  sourceAvatarKilled: boolean,
): number {
  let points = 0;
  points += wavesCompleted * GUILD_WAR_POINTS.wave_completed;
  points += bossesKilled * GUILD_WAR_POINTS.boss_killed;
  if (sourceAvatarKilled) points += GUILD_WAR_POINTS.source_avatar_killed;
  points += Math.floor(totalKills / 100) * GUILD_WAR_POINTS.kills_100;
  return points;
}

/**
 * Apply guild wave reward bonus to base resources earned.
 */
export function applyGuildBonus(
  resources: { salvage: number; viralIchor: number; neuralCores: number; voidCrystals: number },
  guildLevel: number,
): { salvage: number; viralIchor: number; neuralCores: number; voidCrystals: number } {
  const bonus = GUILD_TD_BONUSES[guildLevel] || GUILD_TD_BONUSES[1];
  const mult = 1 + bonus.waveRewardBonus;
  return {
    salvage: Math.floor(resources.salvage * mult),
    viralIchor: Math.floor(resources.viralIchor * mult),
    neuralCores: Math.floor(resources.neuralCores * mult),
    voidCrystals: resources.voidCrystals, // Void crystals not affected by guild bonus
  };
}

/**
 * Syndicate World ↔ Terminus Swarm bridge
 *
 * The guild's Syndicate World IS the crashed Ark in Terminus Swarm.
 * Syndicate buildings map to TD defenses:
 *   - Plasma Turret → Pulse Cannon
 *   - Shield Generator → Shield Pylon
 *   - Shadow Mine → EMP Mine Field
 *   - Void Wall → Barricade
 *   - Nexus Cannon → Missile Battery (ultimate)
 *   - Barracks → spawns temporary defensive units
 *   - Command Center → increases max turret slots
 *
 * When a guild member plays Terminus Swarm, their syndicate world's
 * buildings provide passive bonuses to their TD base.
 */
export const SYNDICATE_TD_MAPPING: Record<string, SyndicateTDEffect> = {
  plasma_turret: { type: "free_turret", turretType: "pulse_cannon", description: "Provides a free Pulse Cannon" },
  shield_generator: { type: "free_turret", turretType: "shield_pylon", description: "Provides a free Shield Pylon" },
  shadow_mine: { type: "free_trap", trapType: "emp_trap", description: "Provides a free EMP Trap" },
  void_wall: { type: "extra_barricades", count: 5, description: "+5 barricade capacity" },
  nexus_cannon: { type: "free_turret", turretType: "missile_battery", description: "Provides a free Missile Battery" },
  barracks: { type: "core_hp_bonus", percent: 10, description: "+10% Ark core HP per level" },
  command_center: { type: "extra_turret_slots", count: 2, description: "+2 turret slots per level" },
  trade_hub: { type: "resource_bonus", percent: 5, description: "+5% resource drops per level" },
};

export type SyndicateTDEffect =
  | { type: "free_turret"; turretType: string; description: string }
  | { type: "free_trap"; trapType: string; description: string }
  | { type: "extra_barricades"; count: number; description: string }
  | { type: "extra_turret_slots"; count: number; description: string }
  | { type: "core_hp_bonus"; percent: number; description: string }
  | { type: "resource_bonus"; percent: number; description: string };
