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

import { aggregateMultipliers, type TraitBonus } from "@shared/companionTraitThresholds";
import { aggregateSkillEffects, type SkillBonusEffect } from "@shared/petSkillTrees";

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

/* ─── PARTY SYNERGY / COMBAT BONUSES ───

   Pets contribute to party-wide trait thresholds (see
   `companionTraitThresholds.ts`). When the player fields two
   or more pets sharing an element/species/faction/class, the
   resulting bonuses are baked into the fighter's stats via
   `applyPartyBonusesToPet` before the battle starts.          */

export interface PartyCombatBonuses {
  /** Stacked multipliers keyed by trait target (e.g., "fire_damage"). */
  multipliers: Record<string, number>;
  /** Flat values (e.g., damage_reduction = 10). */
  flats: Record<string, number>;
  /** Passive flags (burn_on_hit, chain_lightning, reveal_invisible, etc.). */
  passives: Record<string, number>;
  /** Unlocked abilities (pyre_ultimate, tidal_revival, etc.). */
  unlocks: string[];
  /** Human-readable summary lines for the UI. */
  labels: string[];
}

export const EMPTY_PARTY_BONUSES: PartyCombatBonuses = {
  multipliers: {},
  flats: {},
  passives: {},
  unlocks: [],
  labels: [],
};

export function resolvePartyCombatBonuses(bonuses: TraitBonus[]): PartyCombatBonuses {
  const multipliers = aggregateMultipliers(bonuses);
  const flats: Record<string, number> = {};
  const passives: Record<string, number> = {};
  const unlocks: string[] = [];
  const labels: string[] = [];

  for (const b of bonuses) {
    labels.push(b.label);
    switch (b.type) {
      case "flat":
        flats[b.target] = (flats[b.target] ?? 0) + b.value;
        break;
      case "passive":
        passives[b.target] = Math.max(passives[b.target] ?? 0, b.value);
        break;
      case "unlock":
        unlocks.push(b.target);
        break;
    }
  }

  return { multipliers, flats, passives, unlocks, labels };
}

/** Returns the effective multiplier for a target stat (defaults to 1). */
function mult(bonuses: PartyCombatBonuses, target: string): number {
  return bonuses.multipliers[target] ?? 1;
}

/* ─── BATTLE LOGIC ─── */

export function createBattlePet(
  petId: string,
  species: string,
  evolutionStage: 1 | 2 | 3,
  bond: number,
  partyBonuses: PartyCombatBonuses = EMPTY_PARTY_BONUSES,
  skillEffects: SkillBonusEffect = {},
): BattlePet {
  const baseHp = 50;
  const stageBonus = { 1: 1.0, 2: 1.25, 3: 1.5 }[evolutionStage];
  const bondBonus = 1 + bond * 0.005; // +0.5% per bond point (50% at max bond)

  // Party synergy: baseline multipliers stack with whatever other traits
  // you're running. `armor` is the standardized defense target in
  // companionTraitThresholds.
  const armorMult = mult(partyBonuses, "armor");
  const hpMult = mult(partyBonuses, "hp"); // unused by default, reserved for Tidal Flow
  const damageMult = skillEffects.damageMult ?? 1;
  const initiativeMult = 1 + (skillEffects.initiativeBonus ?? 0) / 100;

  return {
    petId,
    name: petId.charAt(0).toUpperCase() + petId.slice(1),
    hp: Math.floor(baseHp * stageBonus * bondBonus * hpMult),
    maxHp: Math.floor(baseHp * stageBonus * bondBonus * hpMult),
    attack: Math.floor(10 * stageBonus * bondBonus * damageMult),
    defense: Math.floor(8 * stageBonus * bondBonus * armorMult),
    speed: Math.floor(12 * stageBonus * mult(partyBonuses, "initiative") * initiativeMult),
    moves: [...STANDARD_MOVES, ...(SPECIES_MOVES[species] || [])],
    statusEffects: [],
    evolutionStage,
  };
}

export interface MoveContext {
  /** Party-wide synergy bonuses applied on top of base stats. */
  partyBonuses?: PartyCombatBonuses;
  /** Active epoch modifier for the current arena week. */
  arenaModifier?: EpochArenaModifier;
  /** Is the attacker the player-controlled pet? (Arena modifiers may be sided.) */
  attackerIsPlayer?: boolean;
  /** Aggregated effects from unlocked skill-tree nodes on the attacker. */
  skillEffects?: SkillBonusEffect;
}

export function executeMove(
  attacker: BattlePet,
  defender: BattlePet,
  moveId: string,
  context: MoveContext = {},
): BattleLogEntry {
  const move = attacker.moves.find(m => m.id === moveId);
  if (!move) {
    return { round: 0, turn: "player1", action: "miss", flavor: "The move failed to execute." };
  }

  const bonuses = context.partyBonuses ?? EMPTY_PARTY_BONUSES;
  const modifier = context.arenaModifier;
  const skills = context.skillEffects ?? {};

  // Dodge: synergy multiplier (+15% from Cyclone/Phalanx) × arena epoch dodge
  // bonus × per-pet dodge skill nodes (e.g., dodge_5 for "Quick Dodge").
  const dodgeMult = mult(bonuses, "dodge_chance");
  let arenaDodge = 0;
  if (modifier?.effect.stat === "dodge" && typeof modifier.effect.value === "number") {
    arenaDodge = modifier.effect.value;
  }
  const skillDodge = skills.dodgeBonus ?? 0;
  const effectiveAccuracy = Math.max(
    5,
    move.accuracy - arenaDodge * 0.5 - (dodgeMult - 1) * 15 - skillDodge,
  );

  // Accuracy check — with optional miss re-roll from Echo's "Second Chance".
  const accRoll = () => Math.random() * 100;
  let firstRoll = accRoll();
  if (firstRoll > effectiveAccuracy && skills.missRerollChance && Math.random() < skills.missRerollChance) {
    firstRoll = accRoll();
  }
  if (firstRoll > effectiveAccuracy) {
    return { round: 0, turn: "player1", action: "miss", flavor: `${attacker.name} missed!` };
  }

  // Calculate damage
  let damage = 0;
  if (move.power > 0) {
    let baseDamage = attacker.attack * move.power;

    // Arena modifier: Rebel Spirit — +15% attack when below 50% HP
    if (modifier?.modifierName === "Rebel Spirit" && attacker.hp < attacker.maxHp * 0.5) {
      baseDamage *= 1 + (modifier.effect.value ?? 15) / 100;
    }
    // Arena modifier: Reality Fracture — chaotic 0.7–1.4 multiplier each strike
    if (modifier?.modifierName === "Reality Fracture") {
      baseDamage *= 0.7 + Math.random() * 0.7;
    }

    // Party-wide improvise/plan bonuses
    baseDamage *= mult(bonuses, "improvise_damage");
    baseDamage *= mult(bonuses, "plan_damage");
    baseDamage *= mult(bonuses, "ambush_damage");
    baseDamage *= mult(bonuses, "backstab_damage");
    // Fire-aligned moves — applied if move hint matches burn effect
    if (move.effect === "burn") baseDamage *= mult(bonuses, "fire_damage");

    // Defense calculation with armor penetration from skill nodes.
    const armorPen = (skills.armorPen ?? 0) / 100;
    const defense = defender.defense * 0.5 * (1 - armorPen);
    const damageReduction = bonuses.flats.damage_reduction ?? 0;
    damage = Math.max(1, Math.floor(baseDamage - defense - damageReduction));

    // Double-hit: split damage across two sub-strikes (Echo Strike).
    if (skills.doubleHitFactor) {
      damage = Math.max(2, Math.floor(damage * skills.doubleHitFactor * 2));
    }

    // Crit chance: base + party synergy + skill crit bonus + arena modifier.
    const baseCrit = attacker.evolutionStage * 5;
    const critMult = mult(bonuses, "crit_chance");
    let critChance = baseCrit * critMult + (skills.critBonus ?? 0);
    if (modifier?.modifierName === "Prophet's Blessing") critChance *= 2;
    const isCrit = Math.random() * 100 < critChance;
    if (isCrit) damage = Math.floor(damage * 2);

    // Passive: chain_lightning splashes a flat 20% of damage — includes
    // Voltari chorus synergy AND Lux's "Photon Chain" skill node.
    const chainChance = Math.max(
      bonuses.passives.chain_lightning ?? 0,
      skills.chainChance ?? 0,
    );
    if (chainChance && Math.random() < chainChance) {
      damage = Math.floor(damage * 1.2);
    }

    defender.hp = Math.max(0, defender.hp - damage);

    const suffixes: string[] = [];
    if (isCrit) suffixes.push("CRITICAL HIT!");
    if (modifier?.modifierName === "Reality Fracture") suffixes.push("[reality fractures]");

    return {
      round: 0,
      turn: "player1",
      action: move.name,
      damage,
      effect: move.effect,
      critical: isCrit,
      flavor: move.flavorText.replace("{pet}", attacker.name) + (suffixes.length ? " " + suffixes.join(" ") : ""),
    };
  }

  // Status moves
  if (move.effect === "heal") {
    const healMult = mult(bonuses, "heal_power") * (skills.healMult ?? 1);
    const healAmount = Math.floor(attacker.maxHp * 0.3 * healMult);
    attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
    return { round: 0, turn: "player1", action: move.name, effect: "heal", flavor: move.flavorText.replace("{pet}", attacker.name) };
  }

  // Buffs/debuffs — skill cooldownMult shortens the re-arm delay.
  const cdMult = skills.cooldownMult ?? 1;
  move.currentCooldown = Math.max(0, Math.round(move.cooldown * cdMult));
  return { round: 0, turn: "player1", action: move.name, effect: move.effect, flavor: move.flavorText.replace("{pet}", attacker.name) };
}

/** End-of-turn regeneration from Tidal Flow / constructs' repair_rate, etc. */
export function applyTurnPassives(
  pet: BattlePet,
  bonuses: PartyCombatBonuses,
  skills: SkillBonusEffect = {},
): number {
  const regen = (bonuses.passives.regen_per_turn ?? 0) + (skills.regenPerTurn ?? 0);
  if (regen > 0 && pet.hp > 0 && pet.hp < pet.maxHp) {
    const healed = Math.min(regen, pet.maxHp - pet.hp);
    pet.hp += healed;
    return healed;
  }
  return 0;
}

/** Re-export so PetBattlesPage can aggregate server-persisted skill nodes. */
export { aggregateSkillEffects, type SkillBonusEffect } from "@shared/petSkillTrees";

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

/* ─── ARENA BACKGROUNDS ─── */

export interface ArenaBackground {
  id: string;
  name: string;
  imageUrl: string;
  /** Which tier this is the default for (null = special/event) */
  defaultForTier: string | null;
  /** Living Universe event that activates this as override */
  activatedByEvent: string | null;
  /** Lore description shown in arena header */
  lore: string;
  /** CSS overlay color for text readability */
  overlayColor: string;
  /** Accent color for UI elements on this background */
  accentColor: string;
}

export const ARENA_BACKGROUNDS: ArenaBackground[] = [
  {
    id: "cargo_pit",
    name: "The Cargo Pit",
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775667108/PB-001_THE_CARGO_PIT_khjygj.jpg",
    defaultForTier: "bronze_gauntlet",
    activatedByEvent: null,
    lore: "Deep in the Cargo Bay, crates are shoved aside to form a makeshift ring. This is where specimens cut their teeth — no glory, no audience, just survival.",
    overlayColor: "rgba(0,0,0,0.55)",
    accentColor: "#d97706",
  },
  {
    id: "specimen_lab",
    name: "The Specimen Lab",
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775667105/PB-002_THE_SPECIMEN_LAB_bwwufn.jpg",
    defaultForTier: "silver_circle",
    activatedByEvent: null,
    lore: "The Collector's laboratory doubles as an arena. Containment fields keep the combatants in; observation glass lets the scientists watch. Clinical. Precise. Lethal.",
    overlayColor: "rgba(0,0,0,0.5)",
    accentColor: "#06b6d4",
  },
  {
    id: "matrix_ring",
    name: "The Matrix Ring",
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775667103/PB-003_THE_MATRIX_RING_yhd9jy.jpg",
    defaultForTier: "gold_coliseum",
    activatedByEvent: "dreamer_awakening",
    lore: "The Dreamer's frequency resonates through the Matrix Ring. Reality bends here — the arena exists in the space between timelines. Only Ascended specimens fight in this light.",
    overlayColor: "rgba(0,0,0,0.45)",
    accentColor: "#a855f7",
  },
  {
    id: "necromancers_pit",
    name: "The Necromancer's Pit",
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775667102/PB-004_THE_NECROMANCER_S_PIT_jvdrmj.jpg",
    defaultForTier: null,
    activatedByEvent: "necromancer_return",
    lore: "When the Necromancer stirs, the arena transforms. Bone and void replace steel and glass. Every death here feeds the Resurrection Protocols. He is watching.",
    overlayColor: "rgba(0,0,0,0.6)",
    accentColor: "#dc2626",
  },
  {
    id: "champions_dome",
    name: "The Champion's Dome",
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775667106/PB-005_THE_CHAMPION_S_DOME_gwxzuz.jpg",
    defaultForTier: null,
    activatedByEvent: "antiquarian_revelation",
    lore: "The Antiquarian opened this dome across seven timelines. Champions from every age converge here. The ceiling shows constellations from worlds that no longer exist.",
    overlayColor: "rgba(0,0,0,0.5)",
    accentColor: "#f59e0b",
  },
];

/**
 * Select the arena background based on tier + active Living Universe events.
 * Event-activated backgrounds override tier defaults — the world shapes the arena.
 */
export function getArenaBackground(tierId: string, activeEventIds: string[] = []): ArenaBackground {
  // 1. Check for event-activated override (highest priority)
  for (const bg of ARENA_BACKGROUNDS) {
    if (bg.activatedByEvent && activeEventIds.includes(bg.activatedByEvent)) {
      return bg;
    }
  }

  // 2. Fall back to tier default
  const tierDefault = ARENA_BACKGROUNDS.find(bg => bg.defaultForTier === tierId);
  if (tierDefault) return tierDefault;

  // 3. Ultimate fallback
  return ARENA_BACKGROUNDS[0];
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
