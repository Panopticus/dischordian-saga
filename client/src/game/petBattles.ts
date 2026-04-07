/* ═══════════════════════════════════════════════════════
   PET BATTLES — Spectator-format pet combat in The Arena

   Watch your pets fight other pets. Text + card-based combat
   with short cinematic moments. Like Pokemon battles crossed
   with watching gladiators from the stands.

   Takes place in: The Collector's Arena (on the Game Master's World)
   Your pet fights, you watch and occasionally input commands.
   Victory trains your pet. Defeat injures it.

   Death is possible in the Arena. The stakes are real.
   ═══════════════════════════════════════════════════════ */

/* ─── BATTLE STATE ─── */

export interface PetBattle {
  id: string;
  player1Pet: BattlePet;
  player2Pet: BattlePet;
  round: number;
  maxRounds: number;
  status: "preparing" | "in_progress" | "completed";
  winner: "player1" | "player2" | "draw" | null;
  log: BattleLogEntry[];
  /** Current tempo: determines which pet acts next */
  turn: "player1" | "player2";
}

export interface BattlePet {
  petId: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: PetMove[];
  statusEffects: StatusEffect[];
  /** Evolution stage affects stats */
  evolutionStage: 1 | 2 | 3;
}

export interface PetMove {
  id: string;
  name: string;
  description: string;
  /** Damage multiplier */
  power: number;
  accuracy: number;
  /** Cooldown in rounds */
  cooldown: number;
  currentCooldown: number;
  /** Special effect */
  effect?: "stun" | "burn" | "heal" | "shield" | "rage" | "dodge";
  /** Flavor text shown in battle log */
  flavorText: string;
  /** Which skill tree node unlocks this */
  requiresSkill?: string;
}

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  modifier: { stat: "attack" | "defense" | "speed"; change: number };
}

export interface BattleLogEntry {
  round: number;
  turn: "player1" | "player2";
  action: string;
  damage?: number;
  effect?: string;
  critical?: boolean;
  flavor: string;
}

/* ─── STANDARD MOVES (every pet has these) ─── */

export const STANDARD_MOVES: PetMove[] = [
  { id: "strike", name: "Strike", description: "Basic attack", power: 1.0, accuracy: 95, cooldown: 0, currentCooldown: 0,
    flavorText: "{pet} lunges forward with a sharp strike!" },
  { id: "guard", name: "Guard", description: "Defensive stance: +20% defense for 2 rounds", power: 0, accuracy: 100, cooldown: 2, currentCooldown: 0, effect: "shield",
    flavorText: "{pet} takes a defensive stance, bracing for impact." },
  { id: "focus", name: "Focus", description: "+15% damage next attack", power: 0, accuracy: 100, cooldown: 2, currentCooldown: 0, effect: "rage",
    flavorText: "{pet} focuses its energy, preparing a powerful strike." },
];

/* ─── PET-SPECIFIC MOVES (unlocked via skill tree) ─── */

export const SPECIES_MOVES: Record<string, PetMove[]> = {
  holographic_fox: [
    { id: "light_flash", name: "Light Flash", description: "Blinding light — 80% chance to miss next turn", power: 0.8, accuracy: 85, cooldown: 3, currentCooldown: 0, effect: "stun",
      flavorText: "Lux erupts in blinding light! The enemy staggers back!", requiresSkill: "dodge" },
    { id: "phase_strike", name: "Phase Strike", description: "Phases through defense", power: 1.5, accuracy: 90, cooldown: 4, currentCooldown: 0,
      flavorText: "Lux phases through the enemy's guard and strikes from within!", requiresSkill: "crit" },
  ],
  data_serpent: [
    { id: "code_bite", name: "Code Bite", description: "Inject viral code — damage over time", power: 0.8, accuracy: 95, cooldown: 2, currentCooldown: 0, effect: "burn",
      flavorText: "Cipher bites, injecting corrupted code into the enemy's systems!", requiresSkill: "crit" },
    { id: "system_crash", name: "System Crash", description: "High damage, may stun", power: 1.8, accuracy: 75, cooldown: 4, currentCooldown: 0, effect: "stun",
      flavorText: "Cipher floods the enemy with nonsense data — their systems crash!" },
  ],
  temporal_kitten: [
    { id: "time_slip", name: "Time Slip", description: "Dodge next attack guaranteed", power: 0, accuracy: 100, cooldown: 3, currentCooldown: 0, effect: "dodge",
      flavorText: "Echo slips sideways through time. It's somewhere else when the attack lands.", requiresSkill: "dodge" },
    { id: "rewind", name: "Rewind", description: "Heal 30% HP (one-time use per battle)", power: 0, accuracy: 100, cooldown: 99, currentCooldown: 0, effect: "heal",
      flavorText: "Echo rewinds its own wounds. The damage simply... un-happens." },
  ],
};

/* ─── BATTLE LOGIC ─── */

export function createBattlePet(petId: string, species: string, evolutionStage: 1 | 2 | 3, bond: number): BattlePet {
  const baseHp = 50;
  const stageBonus = { 1: 1.0, 2: 1.25, 3: 1.5 }[evolutionStage];
  const bondBonus = 1 + bond * 0.005; // +0.5% per bond point (50% at max bond)

  return {
    petId,
    name: petId.charAt(0).toUpperCase() + petId.slice(1),
    hp: Math.floor(baseHp * stageBonus * bondBonus),
    maxHp: Math.floor(baseHp * stageBonus * bondBonus),
    attack: Math.floor(10 * stageBonus * bondBonus),
    defense: Math.floor(8 * stageBonus * bondBonus),
    speed: Math.floor(12 * stageBonus),
    moves: [...STANDARD_MOVES, ...(SPECIES_MOVES[species] || [])],
    statusEffects: [],
    evolutionStage,
  };
}

export function executeMove(attacker: BattlePet, defender: BattlePet, moveId: string): BattleLogEntry {
  const move = attacker.moves.find(m => m.id === moveId);
  if (!move) {
    return { round: 0, turn: "player1", action: "miss", flavor: "The move failed to execute." };
  }

  // Accuracy check
  if (Math.random() * 100 > move.accuracy) {
    return { round: 0, turn: "player1", action: "miss", flavor: `${attacker.name} missed!` };
  }

  // Calculate damage
  let damage = 0;
  if (move.power > 0) {
    const baseDamage = attacker.attack * move.power;
    const defense = defender.defense * 0.5;
    damage = Math.max(1, Math.floor(baseDamage - defense));
    // Crit chance
    const critChance = attacker.evolutionStage * 5;
    const isCrit = Math.random() * 100 < critChance;
    if (isCrit) damage = Math.floor(damage * 2);
    defender.hp = Math.max(0, defender.hp - damage);

    return {
      round: 0,
      turn: "player1",
      action: move.name,
      damage,
      effect: move.effect,
      critical: isCrit,
      flavor: move.flavorText.replace("{pet}", attacker.name) + (isCrit ? " CRITICAL HIT!" : ""),
    };
  }

  // Status moves
  if (move.effect === "heal") {
    const healAmount = Math.floor(attacker.maxHp * 0.3);
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
    return { round: 0, turn: "player1", action: move.name, effect: "heal", flavor: move.flavorText.replace("{pet}", attacker.name) };
  }

  // Buffs/debuffs
  move.currentCooldown = move.cooldown;
  return { round: 0, turn: "player1", action: move.name, effect: move.effect, flavor: move.flavorText.replace("{pet}", attacker.name) };
}

/* ─── BATTLE OUTCOMES ─── */

export interface BattleRewards {
  bondGain: number;
  skillPoints: number;
  dream: number;
  xp: number;
  injury: number; // To pet after the battle
}

export function calculateBattleRewards(win: boolean, rounds: number, perfectVictory: boolean): BattleRewards {
  if (win) {
    return {
      bondGain: perfectVictory ? 8 : 5,
      skillPoints: perfectVictory ? 2 : 1,
      dream: 20 + rounds * 5,
      xp: 50 + rounds * 10,
      injury: perfectVictory ? 0 : Math.min(40, rounds * 5), // Rough battles hurt
    };
  }
  return {
    bondGain: 1, // Small bond gain even in loss (they tried)
    skillPoints: 0,
    dream: 5,
    xp: 15,
    injury: 60 + rounds * 5, // Losses hurt badly
  };
}

/* ─── ARENA BRACKETS ─── */

export interface ArenaTier {
  id: string;
  name: string;
  minEvolution: 1 | 2 | 3;
  opponentLevels: number[];
  rewards: { champion: BattleRewards; tier: BattleRewards };
  lore: string;
}

export const ARENA_TIERS: ArenaTier[] = [
  {
    id: "bronze_gauntlet",
    name: "Bronze Gauntlet",
    minEvolution: 1,
    opponentLevels: [1, 1, 2],
    rewards: {
      champion: { bondGain: 10, skillPoints: 3, dream: 100, xp: 200, injury: 0 },
      tier: { bondGain: 5, skillPoints: 1, dream: 50, xp: 100, injury: 0 },
    },
    lore: "New contenders face the dregs of the Collector's archives. Survive to earn the right to rise.",
  },
  {
    id: "silver_circle",
    name: "Silver Circle",
    minEvolution: 2,
    opponentLevels: [2, 2, 3, 3],
    rewards: {
      champion: { bondGain: 15, skillPoints: 5, dream: 250, xp: 400, injury: 0 },
      tier: { bondGain: 8, skillPoints: 2, dream: 100, xp: 200, injury: 0 },
    },
    lore: "Veteran pets test their bond against other veterans. The clone Collector watches, taking notes.",
  },
  {
    id: "gold_coliseum",
    name: "Gold Coliseum",
    minEvolution: 3,
    opponentLevels: [3, 3, 3, 3, 3],
    rewards: {
      champion: { bondGain: 25, skillPoints: 10, dream: 750, xp: 1000, injury: 0 },
      tier: { bondGain: 12, skillPoints: 3, dream: 250, xp: 500, injury: 0 },
    },
    lore: "Only Ascended pets enter the Gold Coliseum. Victory here is immortality in the Collector's archive.",
  },
];

export function getAvailableTiers(petEvolution: 1 | 2 | 3): ArenaTier[] {
  return ARENA_TIERS.filter(t => t.minEvolution <= petEvolution);
}

/* ─── EVOLUTION EPOCH THEMING ─── */

export interface EvolutionEpochTheme {
  stage: 1 | 2 | 3;
  epochName: string;
  title: string;
  description: string;
  statBonusType: "attack" | "defense" | "speed" | "hp";
  visualEffect: string;
}

export const EVOLUTION_EPOCH_THEMES: EvolutionEpochTheme[] = [
  {
    stage: 1,
    epochName: "Age of Privacy",
    title: "Echo of Genesis",
    description:
      "The pet's primal form, connected to the creation era. Born from the raw data of a world still learning to hide its secrets, it carries the spark of origin — fragile, watchful, and full of latent potential.",
    statBonusType: "defense",
    visualEffect: "flickering_silhouette",
  },
  {
    stage: 2,
    epochName: "Age of Prophecy",
    title: "Expansion Form",
    description:
      "The pet's growth mirrors the empire's expansion. Fueled by prophetic visions and the momentum of an age that believed it could see all possible futures, the pet unfolds into something larger, bolder, and far more dangerous.",
    statBonusType: "attack",
    visualEffect: "radiant_growth_aura",
  },
  {
    stage: 3,
    epochName: "Fall of Reality",
    title: "Post-Fall Ascension",
    description:
      "The pet reaches its final form in the aftermath of the Fall. Reality has shattered and rebuilt itself around this creature. It is no longer bound by the rules that once defined it — ascended, luminous, and terrifying.",
    statBonusType: "hp",
    visualEffect: "reality_fracture_halo",
  },
];

/* ─── EPOCH ARENA MODIFIERS ─── */

export interface EpochArenaModifier {
  epochName: string;
  modifierName: string;
  description: string;
  effect: {
    stat?: "attack" | "defense" | "speed" | "dodge" | "critChance";
    value?: number;
    condition?: string;
    special?: string;
  };
  arenaDecoration: string;
}

export const EPOCH_ARENA_MODIFIERS: EpochArenaModifier[] = [
  {
    epochName: "Age of Privacy",
    modifierName: "Surveillance Protocol",
    description:
      "All pets gain +10% dodge chance — hiding from the ever-present watchers has made them elusive.",
    effect: { stat: "dodge", value: 10 },
    arenaDecoration: "Watcher's Eyes line the arena walls, their unblinking gaze following every movement.",
  },
  {
    epochName: "Age of Prophecy",
    modifierName: "Prophet's Blessing",
    description:
      "Critical hit chance doubled for all combatants. Fate favors the bold.",
    effect: { stat: "critChance", value: 200, condition: "multiplier" },
    arenaDecoration: "Oracle flames burn at the four corners of the arena, casting visions of strikes yet to land.",
  },
  {
    epochName: "Age of Insurgency",
    modifierName: "Rebel Spirit",
    description:
      "Pets gain +15% attack when below 50% HP. The fighting spirit of the rebellion burns brightest when cornered.",
    effect: { stat: "attack", value: 15, condition: "hp_below_50_percent" },
    arenaDecoration: "Tattered rebel banners hang from the rafters, stained with the ink of forbidden manifestos.",
  },
  {
    epochName: "Age of Revelation",
    modifierName: "Truth Revealed",
    description:
      "All status effects are visible. No hidden buffs or debuffs — every secret is laid bare.",
    effect: { special: "reveal_all_status_effects" },
    arenaDecoration: "The arena floor is a mirror. Everything is reflected. Nothing can hide.",
  },
  {
    epochName: "Fall of Reality",
    modifierName: "Reality Fracture",
    description:
      "Random stat swaps occur each round. Chaos rules — attack may become defense, speed may become HP. Nothing is certain.",
    effect: { special: "random_stat_swap_per_round" },
    arenaDecoration: "The arena shimmers and glitches. Walls phase in and out. The ground is not always there.",
  },
];

/** Returns the active arena modifier for the current week, rotating through epochs. */
export function getActiveArenaModifier(now: Date = new Date()): EpochArenaModifier {
  const epochMs = new Date("2024-01-01T00:00:00Z").getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceEpoch = Math.floor((now.getTime() - epochMs) / weekMs);
  const index = weeksSinceEpoch % EPOCH_ARENA_MODIFIERS.length;
  return EPOCH_ARENA_MODIFIERS[index];
}
