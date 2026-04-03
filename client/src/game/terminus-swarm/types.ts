/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM — Type Definitions
   Tower defense game set on the rogue planet Terminus.
   Players defend crashed Inception Arks against the
   Thought Virus-infected Terminus Swarm.
   ═══════════════════════════════════════════════════════ */

/** Grid tile types */
export type TileType = "empty" | "path" | "turret" | "blocked" | "spawn" | "core";

/** Grid cell */
export interface GridCell {
  row: number;
  col: number;
  type: TileType;
  turretId?: string;
}

/** 2D position */
export interface Vec2 {
  x: number;
  y: number;
}

/* ─── TURRETS ─── */

export type TurretType =
  | "pulse_cannon"    // Basic single-target
  | "arc_emitter"     // Chain lightning
  | "cryo_array"      // Slow enemies
  | "flame_projector" // Area DOT
  | "missile_battery" // Long range heavy
  | "shield_pylon"    // Buffs nearby turrets
  | "emp_mine"        // Stun field
  | "nanite_swarm";   // Auto-repair nearby turrets

export interface TurretDef {
  type: TurretType;
  name: string;
  description: string;
  lore: string;
  cost: { salvage: number; viralIchor?: number; neuralCores?: number };
  damage: number;
  range: number;        // in grid tiles
  fireRate: number;     // shots per second
  health: number;
  special?: string;     // special ability description
  color: string;        // hex color for rendering
  upgradeCost?: { salvage: number; viralIchor?: number };
  tier: 1 | 2 | 3;     // unlock tier
}

export interface TurretInstance {
  id: string;
  def: TurretDef;
  row: number;
  col: number;
  health: number;
  maxHealth: number;
  level: number;
  cooldown: number;      // frames until next shot
  target: string | null; // enemy id being targeted
  kills: number;
  totalDamage: number;
}

/* ─── ENEMIES ─── */

export type EnemyType =
  | "undead_grub"       // Tier 1: swarm fodder
  | "plague_ant"        // Tier 2: poison trail
  | "infected_spore"    // Tier 2: flying, explodes on death
  | "corrupt_mantis"    // Tier 3: fast, dodges
  | "rot_crawler"       // Tier 3: armored, slow
  | "venom_wasp"        // Tier 3: flying, fast
  | "bile_hulk"         // Tier 4: massive HP, area damage on death
  | "infected_reaper"   // Tier 4: armored, cleaves turrets
  | "neural_parasite"   // Tier 4: disables turrets temporarily
  | "swarm_queen"       // Tier 5: spawns minions
  | "hive_tyrant"       // Boss: regenerates, immune to slow, summons
  | "source_avatar";    // Final boss: all abilities

export interface EnemyDef {
  type: EnemyType;
  name: string;
  description: string;
  tier: number;
  health: number;
  speed: number;         // tiles per second
  damage: number;        // damage to turrets per hit
  attackSpeed: number;   // hits per second on turrets
  armor: number;         // flat damage reduction
  flying: boolean;
  special: EnemySpecial[];
  reward: { salvage: number; viralIchor?: number; neuralCores?: number; voidCrystals?: number };
  color: string;
  size: number;          // render scale multiplier
}

export type EnemySpecial =
  | { type: "poison_trail"; damagePerSec: number; duration: number }
  | { type: "explode_on_death"; radius: number; damage: number }
  | { type: "dodge"; chance: number }
  | { type: "armor"; reduction: number }
  | { type: "cleave"; range: number; damage: number }
  | { type: "spawn_minions"; count: number; minionType: EnemyType; interval: number }
  | { type: "regenerate"; hpPerSec: number }
  | { type: "disable_turret"; duration: number; range: number }
  | { type: "immune_slow" }
  | { type: "area_death"; radius: number; damage: number }
  | { type: "summon_on_damage"; threshold: number; minionType: EnemyType; count: number };

export interface EnemyInstance {
  id: string;
  def: EnemyDef;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  path: Vec2[];
  pathIndex: number;
  speed: number;           // current speed (can be modified by slow)
  slowTimer: number;       // frames remaining on slow effect
  stunTimer: number;       // frames remaining on stun
  attackTarget: string | null; // turret id being attacked
  attackCooldown: number;
  alive: boolean;
}

/* ─── PROJECTILES ─── */

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetId: string;
  damage: number;
  speed: number;
  type: "bullet" | "missile" | "lightning" | "frost" | "flame";
  color: string;
}

/* ─── WAVE SYSTEM ─── */

export interface WaveSpawn {
  enemyType: EnemyType;
  count: number;
  delayBetween: number;  // frames between each spawn
  startDelay: number;    // frames before this group starts spawning
}

export interface WaveDef {
  waveNumber: number;
  spawns: WaveSpawn[];
  reward: { salvage: number; viralIchor?: number; neuralCores?: number; voidCrystals?: number };
  narrative?: string;    // story text to show before wave
  bossWave: boolean;
}

/* ─── GAME STATE ─── */

export interface GameResources {
  salvage: number;
  viralIchor: number;
  neuralCores: number;
  voidCrystals: number;
}

export type GamePhase = "setup" | "wave" | "intermission" | "boss" | "victory" | "defeat";

export interface TerminusGameState {
  grid: GridCell[][];
  gridWidth: number;
  gridHeight: number;
  turrets: Map<string, TurretInstance>;
  enemies: Map<string, EnemyInstance>;
  projectiles: Projectile[];
  resources: GameResources;
  wave: number;
  phase: GamePhase;
  coreHealth: number;
  coreMaxHealth: number;
  spawnPoints: Vec2[];
  corePosition: Vec2;
  score: number;
  kills: number;
  frameCount: number;
}

/* ─── MAP DEFINITIONS ─── */

export interface MapDef {
  name: string;
  description: string;
  width: number;
  height: number;
  spawnPoints: Vec2[];
  corePosition: Vec2;
  blockedTiles: Vec2[];  // pre-blocked tiles (terrain)
  lore: string;
}

/* ─── CONVEYOR / AUTOMATION ─── */

export type ConveyorDirection = "up" | "down" | "left" | "right";

export interface ConveyorBelt {
  id: string;
  row: number;
  col: number;
  direction: ConveyorDirection;
  carrying: string | null; // resource type being transported
}

export interface ResourceNode {
  id: string;
  row: number;
  col: number;
  resourceType: keyof GameResources;
  yieldPerWave: number;
}
