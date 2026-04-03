/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM — Enemy & Turret Definitions
   All enemy types, turret types, wave compositions,
   and map layouts for the tower defense game.
   ═══════════════════════════════════════════════════════ */
import type { EnemyDef, TurretDef, WaveDef, MapDef } from "./types";

/* ─── TURRET DEFINITIONS ─── */

export const TURRETS: Record<string, TurretDef> = {
  pulse_cannon: {
    type: "pulse_cannon",
    name: "Pulse Cannon",
    description: "Standard Ark defense turret. Reliable single-target damage.",
    lore: "Every Inception Ark carries hundreds of these automated sentries. Most were offline when the crash happened.",
    cost: { salvage: 50 },
    damage: 15,
    range: 3,
    fireRate: 2,
    health: 100,
    color: "#4488ff",
    tier: 1,
  },
  arc_emitter: {
    type: "arc_emitter",
    name: "Arc Emitter",
    description: "Chain lightning that jumps between nearby enemies. Great vs swarms.",
    lore: "Repurposed from the Ark's electrical grid. The discharge arcs between infected targets with terrifying efficiency.",
    cost: { salvage: 120, viralIchor: 10 },
    damage: 8,
    range: 2.5,
    fireRate: 1.5,
    health: 80,
    special: "Lightning chains to 3 nearby enemies",
    color: "#44ddff",
    tier: 1,
  },
  cryo_array: {
    type: "cryo_array",
    name: "Cryo Array",
    description: "Slows all enemies in range. Essential for controlling fast swarms.",
    lore: "The life support cooling system, overclocked to flash-freeze the air around incoming threats.",
    cost: { salvage: 80, viralIchor: 5 },
    damage: 5,
    range: 2,
    fireRate: 1,
    health: 90,
    special: "Slows enemies by 50% for 3 seconds",
    color: "#88ddff",
    tier: 1,
  },
  flame_projector: {
    type: "flame_projector",
    name: "Flame Projector",
    description: "Cone of fire that damages all enemies in area. Burns persist.",
    lore: "Engine exhaust redirected through emergency vents. The heat melts even the toughest chitin.",
    cost: { salvage: 150, viralIchor: 15 },
    damage: 10,
    range: 2,
    fireRate: 3,
    health: 70,
    special: "Area damage + burn DOT (5 dmg/sec for 3 sec)",
    color: "#ff6622",
    tier: 2,
  },
  missile_battery: {
    type: "missile_battery",
    name: "Missile Battery",
    description: "Long-range heavy hitter. Slow reload but devastating impact.",
    lore: "The Ark's dormant weapons array, partially restored. Each missile is hand-loaded from salvaged ordnance.",
    cost: { salvage: 200, viralIchor: 20, neuralCores: 2 },
    damage: 80,
    range: 5,
    fireRate: 0.5,
    health: 120,
    special: "Splash damage in 1-tile radius",
    color: "#ff4444",
    tier: 2,
  },
  shield_pylon: {
    type: "shield_pylon",
    name: "Shield Pylon",
    description: "Projects a shield that reduces damage to nearby turrets by 30%.",
    lore: "Fragment of the Ark's main shield generator. Can only cover a small area but makes defenses much more resilient.",
    cost: { salvage: 180, viralIchor: 25 },
    damage: 0,
    range: 2.5,
    fireRate: 0,
    health: 150,
    special: "Nearby turrets take 30% less damage",
    color: "#44ff88",
    tier: 2,
  },
  emp_mine: {
    type: "emp_mine",
    name: "EMP Mine Field",
    description: "Stuns all enemies that enter its zone for 2 seconds.",
    lore: "Emergency countermeasures designed for close-quarters defense. The electromagnetic pulse disrupts the Thought Virus's neural control signals.",
    cost: { salvage: 100, viralIchor: 10, neuralCores: 1 },
    damage: 20,
    range: 1.5,
    fireRate: 0.3,
    health: 60,
    special: "Stuns enemies for 2 seconds (120 frames)",
    color: "#ffdd44",
    tier: 2,
  },
  nanite_swarm: {
    type: "nanite_swarm",
    name: "Nanite Swarm",
    description: "Repair drones that heal nearby turrets over time.",
    lore: "The Ark's automated repair system, one of the few systems that survived the crash intact. The nanites prioritize the most damaged structures.",
    cost: { salvage: 250, viralIchor: 30, neuralCores: 5 },
    damage: 0,
    range: 3,
    fireRate: 0,
    health: 100,
    special: "Heals nearby turrets for 5 HP/sec",
    color: "#88ff44",
    tier: 3,
  },
};

/* ─── ENEMY DEFINITIONS ─── */

export const ENEMIES: Record<string, EnemyDef> = {
  undead_grub: {
    type: "undead_grub",
    name: "Undead Grub",
    description: "Reanimated larvae of the Terminus hive. Weak alone, deadly in swarms.",
    tier: 1, health: 30, speed: 1.2, damage: 3, attackSpeed: 1, armor: 0, flying: false,
    special: [],
    reward: { salvage: 5 },
    color: "#88aa44", size: 0.6,
  },
  plague_ant: {
    type: "plague_ant",
    name: "Plague Ant",
    description: "Infected soldier caste. Leaves a corrosive trail that damages turrets.",
    tier: 2, health: 60, speed: 1.0, damage: 5, attackSpeed: 1, armor: 2, flying: false,
    special: [{ type: "poison_trail", damagePerSec: 3, duration: 180 }],
    reward: { salvage: 10, viralIchor: 1 },
    color: "#66aa22", size: 0.7,
  },
  infected_spore: {
    type: "infected_spore",
    name: "Infected Spore",
    description: "Airborne viral delivery system. Explodes on death, spreading infection.",
    tier: 2, health: 25, speed: 0.8, damage: 2, attackSpeed: 0.5, armor: 0, flying: true,
    special: [{ type: "explode_on_death", radius: 1.5, damage: 20 }],
    reward: { salvage: 8, viralIchor: 2 },
    color: "#44cc44", size: 0.5,
  },
  corrupt_mantis: {
    type: "corrupt_mantis",
    name: "Corrupt Mantis",
    description: "Lightning-fast hunter. Erratic movement makes it hard to target.",
    tier: 3, health: 80, speed: 2.0, damage: 8, attackSpeed: 2, armor: 0, flying: false,
    special: [{ type: "dodge", chance: 0.25 }],
    reward: { salvage: 15, viralIchor: 3 },
    color: "#22cc88", size: 0.8,
  },
  rot_crawler: {
    type: "rot_crawler",
    name: "Rot Crawler",
    description: "Heavily armored siege beast. Slow but incredibly tough.",
    tier: 3, health: 200, speed: 0.5, damage: 12, attackSpeed: 0.5, armor: 10, flying: false,
    special: [{ type: "armor", reduction: 10 }],
    reward: { salvage: 20, viralIchor: 5 },
    color: "#886633", size: 1.2,
  },
  venom_wasp: {
    type: "venom_wasp",
    name: "Venom Wasp",
    description: "Fast aerial striker. Dives past ground defenses.",
    tier: 3, health: 50, speed: 2.5, damage: 10, attackSpeed: 1.5, armor: 0, flying: true,
    special: [],
    reward: { salvage: 12, viralIchor: 3 },
    color: "#ddaa22", size: 0.7,
  },
  bile_hulk: {
    type: "bile_hulk",
    name: "Bile Hulk",
    description: "Bloated monstrosity. Explodes violently when killed, damaging everything nearby.",
    tier: 4, health: 300, speed: 0.4, damage: 15, attackSpeed: 0.5, armor: 5, flying: false,
    special: [{ type: "area_death", radius: 2, damage: 50 }],
    reward: { salvage: 30, viralIchor: 8, neuralCores: 1 },
    color: "#558822", size: 1.5,
  },
  infected_reaper: {
    type: "infected_reaper",
    name: "Infected Reaper",
    description: "Elite combat form. Heavy armor and scything claws that hit multiple turrets.",
    tier: 4, health: 250, speed: 0.8, damage: 20, attackSpeed: 1, armor: 8, flying: false,
    special: [
      { type: "armor", reduction: 8 },
      { type: "cleave", range: 1, damage: 10 },
    ],
    reward: { salvage: 25, viralIchor: 10, neuralCores: 2 },
    color: "#cc2244", size: 1.3,
  },
  neural_parasite: {
    type: "neural_parasite",
    name: "Neural Parasite",
    description: "Psionic horror. Disables turrets with thought-virus tendrils.",
    tier: 4, health: 100, speed: 1.0, damage: 5, attackSpeed: 0.5, armor: 0, flying: true,
    special: [{ type: "disable_turret", duration: 180, range: 2 }],
    reward: { salvage: 20, viralIchor: 12, neuralCores: 3 },
    color: "#aa44dd", size: 0.9,
  },
  swarm_queen: {
    type: "swarm_queen",
    name: "Swarm Queen",
    description: "Hive matriarch. Continuously spawns Undead Grubs as she advances.",
    tier: 5, health: 400, speed: 0.6, damage: 10, attackSpeed: 0.5, armor: 5, flying: false,
    special: [{ type: "spawn_minions", count: 3, minionType: "undead_grub", interval: 300 }],
    reward: { salvage: 50, viralIchor: 20, neuralCores: 5 },
    color: "#dd44aa", size: 1.4,
  },
  hive_tyrant: {
    type: "hive_tyrant",
    name: "Hive Tyrant",
    description: "Apex predator of the Terminus Swarm. Regenerates, immune to control effects, summons reinforcements.",
    tier: 6, health: 800, speed: 0.5, damage: 30, attackSpeed: 1, armor: 12, flying: false,
    special: [
      { type: "regenerate", hpPerSec: 10 },
      { type: "immune_slow" },
      { type: "spawn_minions", count: 2, minionType: "corrupt_mantis", interval: 600 },
      { type: "summon_on_damage", threshold: 0.5, minionType: "plague_ant", count: 4 },
    ],
    reward: { salvage: 100, viralIchor: 50, neuralCores: 10, voidCrystals: 2 },
    color: "#ff2244", size: 2.0,
  },
  source_avatar: {
    type: "source_avatar",
    name: "Avatar of The Source",
    description: "A fragment of The Source itself, given terrible form. Patient Zero's corruption made manifest.",
    tier: 7, health: 2000, speed: 0.3, damage: 50, attackSpeed: 0.5, armor: 20, flying: false,
    special: [
      { type: "regenerate", hpPerSec: 20 },
      { type: "immune_slow" },
      { type: "spawn_minions", count: 3, minionType: "infected_reaper", interval: 900 },
      { type: "disable_turret", duration: 120, range: 3 },
      { type: "area_death", radius: 3, damage: 100 },
    ],
    reward: { salvage: 500, viralIchor: 200, neuralCores: 50, voidCrystals: 10 },
    color: "#ff0044", size: 2.5,
  },
};

/* ─── WAVE DEFINITIONS ─── */

export const WAVES: WaveDef[] = [
  // Wave 1: Introduction
  {
    waveNumber: 1,
    spawns: [{ enemyType: "undead_grub", count: 8, delayBetween: 30, startDelay: 60 }],
    reward: { salvage: 30 },
    narrative: "Motion detected on the Ark's perimeter sensors. Small contacts — lots of them. The Terminus Swarm has found you.",
    bossWave: false,
  },
  // Wave 2: More grubs + ants
  {
    waveNumber: 2,
    spawns: [
      { enemyType: "undead_grub", count: 12, delayBetween: 25, startDelay: 30 },
      { enemyType: "plague_ant", count: 3, delayBetween: 60, startDelay: 180 },
    ],
    reward: { salvage: 50, viralIchor: 5 },
    narrative: "Larger forms approaching. The ants leave a corrosive trail — keep turrets away from their path.",
    bossWave: false,
  },
  // Wave 3: Introduce flying
  {
    waveNumber: 3,
    spawns: [
      { enemyType: "undead_grub", count: 10, delayBetween: 20, startDelay: 0 },
      { enemyType: "infected_spore", count: 5, delayBetween: 45, startDelay: 120 },
    ],
    reward: { salvage: 60, viralIchor: 8 },
    narrative: "Airborne contacts! The spores float over ground defenses. You'll need turrets that can hit flying targets.",
    bossWave: false,
  },
  // Wave 4: Speed threat
  {
    waveNumber: 4,
    spawns: [
      { enemyType: "plague_ant", count: 6, delayBetween: 40, startDelay: 0 },
      { enemyType: "corrupt_mantis", count: 4, delayBetween: 50, startDelay: 120 },
    ],
    reward: { salvage: 80, viralIchor: 12 },
    narrative: "Fast movers detected — the Mantis variants. They're hard to hit. Slow them down with cryo arrays.",
    bossWave: false,
  },
  // Wave 5: Mini boss — first heavy
  {
    waveNumber: 5,
    spawns: [
      { enemyType: "undead_grub", count: 15, delayBetween: 15, startDelay: 0 },
      { enemyType: "rot_crawler", count: 2, delayBetween: 120, startDelay: 60 },
      { enemyType: "venom_wasp", count: 3, delayBetween: 60, startDelay: 200 },
    ],
    reward: { salvage: 120, viralIchor: 20, neuralCores: 2 },
    narrative: "Heavy contacts emerging from the hive tunnels. Those Rot Crawlers have thick armor — you'll need firepower.",
    bossWave: false,
  },
  // Wave 6
  {
    waveNumber: 6,
    spawns: [
      { enemyType: "plague_ant", count: 8, delayBetween: 30, startDelay: 0 },
      { enemyType: "corrupt_mantis", count: 6, delayBetween: 40, startDelay: 60 },
      { enemyType: "infected_spore", count: 8, delayBetween: 30, startDelay: 120 },
    ],
    reward: { salvage: 100, viralIchor: 25 },
    bossWave: false,
  },
  // Wave 7: Introduce tier 4
  {
    waveNumber: 7,
    spawns: [
      { enemyType: "rot_crawler", count: 3, delayBetween: 90, startDelay: 0 },
      { enemyType: "bile_hulk", count: 1, delayBetween: 0, startDelay: 180 },
      { enemyType: "undead_grub", count: 20, delayBetween: 10, startDelay: 60 },
    ],
    reward: { salvage: 150, viralIchor: 30, neuralCores: 3 },
    narrative: "A Bile Hulk has been sighted. When it dies, it EXPLODES. Keep your turrets clear of its death zone.",
    bossWave: false,
  },
  // Wave 8
  {
    waveNumber: 8,
    spawns: [
      { enemyType: "infected_reaper", count: 2, delayBetween: 120, startDelay: 0 },
      { enemyType: "neural_parasite", count: 2, delayBetween: 90, startDelay: 60 },
      { enemyType: "corrupt_mantis", count: 6, delayBetween: 30, startDelay: 120 },
    ],
    reward: { salvage: 180, viralIchor: 40, neuralCores: 5 },
    narrative: "Reapers. They cleave through defenses with those scything arms. And the Neural Parasites can disable your turrets.",
    bossWave: false,
  },
  // Wave 9
  {
    waveNumber: 9,
    spawns: [
      { enemyType: "infected_reaper", count: 3, delayBetween: 90, startDelay: 0 },
      { enemyType: "bile_hulk", count: 2, delayBetween: 120, startDelay: 60 },
      { enemyType: "venom_wasp", count: 8, delayBetween: 20, startDelay: 120 },
      { enemyType: "plague_ant", count: 10, delayBetween: 20, startDelay: 0 },
    ],
    reward: { salvage: 200, viralIchor: 50, neuralCores: 8 },
    bossWave: false,
  },
  // Wave 10: BOSS — Hive Tyrant
  {
    waveNumber: 10,
    spawns: [
      { enemyType: "undead_grub", count: 20, delayBetween: 10, startDelay: 0 },
      { enemyType: "infected_reaper", count: 2, delayBetween: 120, startDelay: 60 },
      { enemyType: "hive_tyrant", count: 1, delayBetween: 0, startDelay: 300 },
    ],
    reward: { salvage: 300, viralIchor: 100, neuralCores: 15, voidCrystals: 3 },
    narrative: "The ground is trembling. Something massive is emerging from the hive. A Hive Tyrant — apex predator of the Terminus Swarm. This is what killed the first wave of Potentials.",
    bossWave: true,
  },
  // Wave 15: Swarm Queen
  {
    waveNumber: 15,
    spawns: [
      { enemyType: "swarm_queen", count: 1, delayBetween: 0, startDelay: 120 },
      { enemyType: "infected_reaper", count: 4, delayBetween: 90, startDelay: 0 },
      { enemyType: "bile_hulk", count: 3, delayBetween: 120, startDelay: 60 },
      { enemyType: "neural_parasite", count: 4, delayBetween: 60, startDelay: 180 },
    ],
    reward: { salvage: 500, viralIchor: 200, neuralCores: 30, voidCrystals: 5 },
    narrative: "A Swarm Queen. She births new horrors as she moves. Cut her down before she reaches the core — or you'll be overwhelmed.",
    bossWave: true,
  },
  // Wave 20: Avatar of The Source
  {
    waveNumber: 20,
    spawns: [
      { enemyType: "hive_tyrant", count: 2, delayBetween: 300, startDelay: 0 },
      { enemyType: "source_avatar", count: 1, delayBetween: 0, startDelay: 600 },
    ],
    reward: { salvage: 1000, viralIchor: 500, neuralCores: 100, voidCrystals: 20 },
    narrative: "No... it can't be. That signal — it's HIM. The Source. Kael. Patient Zero. A fragment of his consciousness has taken physical form. Everything we've fought was just his swarm. This... this is the plague itself.",
    bossWave: true,
  },
];

// Generate intermediate waves for gaps (11-14, 16-19)
export function getWaveForNumber(waveNum: number): WaveDef {
  const defined = WAVES.find(w => w.waveNumber === waveNum);
  if (defined) return defined;

  // Generate procedural wave
  const tier = Math.min(6, Math.floor(waveNum / 3) + 1);
  const enemyTypes: EnemyType[] = [];
  if (tier >= 1) enemyTypes.push("undead_grub", "plague_ant");
  if (tier >= 2) enemyTypes.push("infected_spore", "corrupt_mantis");
  if (tier >= 3) enemyTypes.push("rot_crawler", "venom_wasp");
  if (tier >= 4) enemyTypes.push("bile_hulk", "infected_reaper");
  if (tier >= 5) enemyTypes.push("neural_parasite");

  const spawns = enemyTypes.slice(-4).map((type, i) => ({
    enemyType: type,
    count: Math.floor(3 + waveNum * 0.8 + Math.random() * 3),
    delayBetween: Math.max(10, 40 - waveNum),
    startDelay: i * 90,
  }));

  return {
    waveNumber: waveNum,
    spawns,
    reward: {
      salvage: 50 + waveNum * 20,
      viralIchor: Math.floor(waveNum * 5),
      neuralCores: waveNum >= 5 ? Math.floor(waveNum - 3) : 0,
      voidCrystals: waveNum >= 10 ? Math.floor((waveNum - 8) * 0.5) : 0,
    },
    bossWave: false,
  };
}

/* ─── MAP DEFINITIONS ─── */

export const MAPS: MapDef[] = [
  {
    name: "Ark #25 — Landing Bay",
    description: "The shattered landing bay of Inception Ark #25. The main entrance is breached.",
    width: 16,
    height: 10,
    spawnPoints: [{ x: 0, y: 2 }, { x: 0, y: 7 }],
    corePosition: { x: 15, y: 5 },
    blockedTiles: [
      // Wreckage blocking some paths
      { x: 3, y: 0 }, { x: 3, y: 1 },
      { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 11, y: 2 }, { x: 11, y: 3 },
      { x: 11, y: 7 }, { x: 11, y: 8 },
    ],
    lore: "The first Inception Arks crashed on Terminus centuries ago. Ark #25 was one of the last to fall — its landing bay still partially intact, but the hull breach has let the Swarm in.",
  },
  {
    name: "Ark #25 — Corridor B",
    description: "Deep interior corridors. Narrow choke points but limited build space.",
    width: 20,
    height: 8,
    spawnPoints: [{ x: 0, y: 4 }],
    corePosition: { x: 19, y: 4 },
    blockedTiles: [
      { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 6 }, { x: 4, y: 7 },
      { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 },
      { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 6 }, { x: 12, y: 7 },
      { x: 16, y: 3 }, { x: 16, y: 4 },
    ],
    lore: "The interior corridors of the Ark are labyrinthine. The Swarm has burrowed through walls, creating new entry points.",
  },
];
