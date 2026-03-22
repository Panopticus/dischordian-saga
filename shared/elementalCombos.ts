/**
 * ELEMENTAL COMBO SYSTEM (Recommendation 4.5)
 * ────────────────────────────────────────────
 * Inspired by Divinity: Original Sin 2 elemental interactions.
 * When elements interact in card battles, fights, and guild wars,
 * they trigger combo effects that add a strategic layer to element selection.
 *
 * Design philosophy:
 * - Every element pair has a defined interaction
 * - Combos trigger when player element meets opponent element or environment
 * - Some combos are offensive, some defensive, some utility
 * - Creates a rock-paper-scissors-plus dynamic
 */

import type { CitizenData } from "./citizenTraits";

/* ═══════════════════════════════════════════════════════
   ELEMENT TYPE
   ═══════════════════════════════════════════════════════ */

export type Element = CitizenData["element"];

export const ALL_ELEMENTS: Element[] = [
  "earth", "fire", "water", "air", "space", "time", "probability", "reality"
];

/* ═══════════════════════════════════════════════════════
   COMBO DEFINITIONS
   ═══════════════════════════════════════════════════════ */

export interface ElementalCombo {
  /** Unique key */
  key: string;
  /** Display name */
  name: string;
  /** Description of the combo effect */
  description: string;
  /** The two elements that create this combo */
  elements: [Element, Element];
  /** Icon identifier (lucide icon name) */
  icon: string;
  /** Color hex for UI */
  color: string;
  /** Which game systems this combo applies in */
  applicableSystems: ("card_game" | "fight" | "guild_war" | "chess" | "trade_empire")[];
  /** Combo effects */
  effects: ComboEffect[];
  /** Visual effect description for combat feedback */
  visualEffect: string;
}

export interface ComboEffect {
  /** Effect type */
  type: "damage" | "debuff" | "buff" | "utility" | "heal";
  /** Target: self, enemy, or area */
  target: "self" | "enemy" | "area";
  /** Stat or mechanic affected */
  stat: string;
  /** Numeric value */
  value: number;
  /** Duration in turns (0 = instant) */
  duration: number;
  /** Human-readable label */
  label: string;
}

/* ═══════════════════════════════════════════════════════
   COMBO DEFINITIONS — 28 element pairs
   (8 choose 2 = 28 unique pairs)
   ═══════════════════════════════════════════════════════ */

export const ELEMENTAL_COMBOS: ElementalCombo[] = [
  /* ─── CLASSICAL ELEMENT COMBOS ─── */
  {
    key: "firestorm",
    name: "Firestorm",
    description: "Fire and Air combine into a devastating tornado of flame.",
    elements: ["fire", "air"],
    icon: "Flame",
    color: "#f97316",
    applicableSystems: ["card_game", "fight", "guild_war"],
    effects: [
      { type: "damage", target: "enemy", stat: "aoe_damage", value: 0.30, duration: 0, label: "+30% AoE damage" },
      { type: "debuff", target: "enemy", stat: "accuracy", value: -0.10, duration: 2, label: "-10% enemy accuracy for 2 turns" },
    ],
    visualEffect: "Swirling vortex of flame engulfs the battlefield",
  },
  {
    key: "steam_cloud",
    name: "Steam Cloud",
    description: "Water quenches Fire, creating a blinding cloud of steam.",
    elements: ["water", "fire"],
    icon: "CloudFog",
    color: "#94a3b8",
    applicableSystems: ["card_game", "fight"],
    effects: [
      { type: "debuff", target: "enemy", stat: "accuracy", value: -0.20, duration: 2, label: "20% miss chance for 2 turns" },
      { type: "damage", target: "enemy", stat: "steam_damage", value: 0.10, duration: 2, label: "10% steam damage per turn for 2 turns" },
    ],
    visualEffect: "Billowing clouds of scalding steam obscure all vision",
  },
  {
    key: "mudslide",
    name: "Mudslide",
    description: "Earth and Water combine into a crushing wave of mud and stone.",
    elements: ["earth", "water"],
    icon: "Mountain",
    color: "#78716c",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "debuff", target: "enemy", stat: "speed", value: -0.30, duration: 3, label: "-30% enemy speed for 3 turns" },
      { type: "damage", target: "enemy", stat: "crush_damage", value: 0.15, duration: 0, label: "+15% crushing damage" },
    ],
    visualEffect: "A wall of churning mud and boulders crashes forward",
  },
  {
    key: "magma_shield",
    name: "Magma Shield",
    description: "Fire and Earth fuse into a protective shell of molten rock.",
    elements: ["fire", "earth"],
    icon: "Shield",
    color: "#dc2626",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "buff", target: "self", stat: "damage_reflection", value: 0.15, duration: 3, label: "Reflect 15% damage for 3 turns" },
      { type: "buff", target: "self", stat: "armor_bonus", value: 0.20, duration: 3, label: "+20% armor for 3 turns" },
    ],
    visualEffect: "Glowing magma crystallizes into protective armor",
  },
  {
    key: "void_wind",
    name: "Void Wind",
    description: "Air and Space create currents that bend the fabric of distance.",
    elements: ["air", "space"],
    icon: "Wind",
    color: "#6366f1",
    applicableSystems: ["trade_empire", "guild_war"],
    effects: [
      { type: "utility", target: "self", stat: "warp_speed", value: 2.0, duration: 0, label: "Trade warp speed doubled" },
      { type: "utility", target: "self", stat: "movement_speed", value: 1.30, duration: 0, label: "+30% movement speed" },
    ],
    visualEffect: "Space folds as wind tears through dimensional barriers",
  },
  {
    key: "chrono_tide",
    name: "Chrono Tide",
    description: "Water and Time flow together, healing wounds as they wash away the past.",
    elements: ["water", "time"],
    icon: "Droplets",
    color: "#06b6d4",
    applicableSystems: ["fight"],
    effects: [
      { type: "heal", target: "self", stat: "hp_regen", value: 0.10, duration: 3, label: "Heal 10% HP per turn for 3 turns" },
      { type: "buff", target: "self", stat: "cooldown_reduction", value: 0.25, duration: 3, label: "25% cooldown reduction for 3 turns" },
    ],
    visualEffect: "Shimmering water flows backward through time, mending all it touches",
  },

  /* ─── DIMENSIONAL COMBOS ─── */
  {
    key: "temporal_flux",
    name: "Temporal Flux",
    description: "Time and Probability interweave, allowing you to rewrite a single moment.",
    elements: ["time", "probability"],
    icon: "Timer",
    color: "#8b5cf6",
    applicableSystems: ["chess", "card_game", "fight"],
    effects: [
      { type: "utility", target: "self", stat: "reroll_action", value: 1, duration: 0, label: "Reroll one action per game" },
      { type: "buff", target: "self", stat: "crit_chance", value: 0.10, duration: 2, label: "+10% crit chance for 2 turns" },
    ],
    visualEffect: "Reality stutters as timelines branch and reconverge",
  },
  {
    key: "dimensional_rift",
    name: "Dimensional Rift",
    description: "Space and Reality tear open a portal to anywhere in the known universe.",
    elements: ["space", "reality"],
    icon: "Orbit",
    color: "#d946ef",
    applicableSystems: ["guild_war", "trade_empire"],
    effects: [
      { type: "utility", target: "self", stat: "teleport", value: 1, duration: 0, label: "Teleport to any territory" },
      { type: "utility", target: "self", stat: "scan_range", value: 5, duration: 0, label: "+5 scan range" },
    ],
    visualEffect: "A shimmering portal tears through the fabric of space",
  },
  {
    key: "probability_storm",
    name: "Probability Storm",
    description: "Probability and Air create chaotic winds where nothing is certain.",
    elements: ["probability", "air"],
    icon: "Dices",
    color: "#14b8a6",
    applicableSystems: ["card_game", "fight"],
    effects: [
      { type: "debuff", target: "area", stat: "accuracy", value: -0.15, duration: 3, label: "-15% accuracy for all (3 turns)" },
      { type: "buff", target: "self", stat: "rng_improvement", value: 0.15, duration: 3, label: "+15% RNG outcomes for 3 turns" },
    ],
    visualEffect: "Chaotic winds swirl with shimmering probability particles",
  },
  {
    key: "reality_anchor",
    name: "Reality Anchor",
    description: "Reality and Earth create an unshakeable foundation that resists all manipulation.",
    elements: ["reality", "earth"],
    icon: "Anchor",
    color: "#78716c",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "buff", target: "self", stat: "debuff_immunity", value: 1, duration: 3, label: "Immune to debuffs for 3 turns" },
      { type: "buff", target: "self", stat: "armor_bonus", value: 0.25, duration: 3, label: "+25% armor for 3 turns" },
    ],
    visualEffect: "Crystalline reality matrices lock the ground into absolute stability",
  },
  {
    key: "time_freeze",
    name: "Time Freeze",
    description: "Time and Water crystallize into frozen moments, halting enemy actions.",
    elements: ["time", "water"],
    icon: "Snowflake",
    color: "#38bdf8",
    applicableSystems: ["fight", "card_game"],
    effects: [
      { type: "debuff", target: "enemy", stat: "frozen", value: 1, duration: 1, label: "Freeze enemy for 1 turn" },
      { type: "buff", target: "self", stat: "extra_action", value: 1, duration: 0, label: "Gain 1 extra action" },
    ],
    visualEffect: "Time crystallizes into ice, trapping the enemy in a frozen moment",
  },
  {
    key: "fire_time",
    name: "Eternal Flame",
    description: "Fire sustained by Time burns forever, dealing persistent damage.",
    elements: ["fire", "time"],
    icon: "Flame",
    color: "#f59e0b",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "damage", target: "enemy", stat: "burn_damage", value: 0.05, duration: 5, label: "5% burn damage per turn for 5 turns" },
      { type: "debuff", target: "enemy", stat: "heal_reduction", value: -0.50, duration: 5, label: "-50% healing for 5 turns" },
    ],
    visualEffect: "Flames that exist outside of time burn endlessly",
  },
  {
    key: "space_water",
    name: "Abyssal Depths",
    description: "Space and Water create a crushing pressure from the void between stars.",
    elements: ["space", "water"],
    icon: "Waves",
    color: "#1e40af",
    applicableSystems: ["fight", "card_game"],
    effects: [
      { type: "damage", target: "enemy", stat: "pressure_damage", value: 0.20, duration: 0, label: "+20% pressure damage" },
      { type: "debuff", target: "enemy", stat: "defense", value: -0.15, duration: 2, label: "-15% enemy defense for 2 turns" },
    ],
    visualEffect: "The crushing weight of an ocean compressed into a singularity",
  },
  {
    key: "earth_air",
    name: "Sandstorm",
    description: "Earth and Air whip into a blinding storm of razor-sharp particles.",
    elements: ["earth", "air"],
    icon: "Wind",
    color: "#a16207",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "damage", target: "area", stat: "sand_damage", value: 0.10, duration: 3, label: "10% AoE damage per turn for 3 turns" },
      { type: "debuff", target: "enemy", stat: "accuracy", value: -0.25, duration: 3, label: "-25% enemy accuracy for 3 turns" },
    ],
    visualEffect: "A wall of sand and stone shards tears across the battlefield",
  },
  {
    key: "probability_fire",
    name: "Wildfire Cascade",
    description: "Probability-infused flames spread unpredictably, hitting random targets.",
    elements: ["probability", "fire"],
    icon: "Zap",
    color: "#ea580c",
    applicableSystems: ["card_game", "fight"],
    effects: [
      { type: "damage", target: "area", stat: "random_fire", value: 0.25, duration: 0, label: "25% fire damage to random targets" },
      { type: "buff", target: "self", stat: "crit_chance", value: 0.15, duration: 2, label: "+15% crit chance for 2 turns" },
    ],
    visualEffect: "Flames leap unpredictably, guided by the whims of probability",
  },
  {
    key: "reality_probability",
    name: "Quantum Collapse",
    description: "Reality and Probability collide, forcing all outcomes to resolve at once.",
    elements: ["reality", "probability"],
    icon: "Sparkles",
    color: "#7c3aed",
    applicableSystems: ["card_game", "chess", "fight"],
    effects: [
      { type: "utility", target: "self", stat: "outcome_lock", value: 1, duration: 0, label: "Lock in the best possible outcome for next action" },
      { type: "damage", target: "enemy", stat: "quantum_damage", value: 0.15, duration: 0, label: "+15% quantum damage" },
    ],
    visualEffect: "All possible realities collapse into the one most favorable to you",
  },
  {
    key: "space_time",
    name: "Wormhole",
    description: "Space and Time fold together, creating shortcuts through the universe.",
    elements: ["space", "time"],
    icon: "Orbit",
    color: "#4f46e5",
    applicableSystems: ["trade_empire", "guild_war"],
    effects: [
      { type: "utility", target: "self", stat: "instant_travel", value: 1, duration: 0, label: "Instant travel to any known location" },
      { type: "buff", target: "self", stat: "action_speed", value: 1.50, duration: 2, label: "+50% action speed for 2 turns" },
    ],
    visualEffect: "A spiraling wormhole tears open, connecting two distant points",
  },
  {
    key: "reality_fire",
    name: "Hellfire",
    description: "Reality-bending flames that burn through any defense, even magical ones.",
    elements: ["reality", "fire"],
    icon: "Flame",
    color: "#b91c1c",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "damage", target: "enemy", stat: "true_fire_damage", value: 0.20, duration: 0, label: "+20% true fire damage (ignores armor)" },
      { type: "debuff", target: "enemy", stat: "armor", value: -0.20, duration: 2, label: "-20% enemy armor for 2 turns" },
    ],
    visualEffect: "Flames that burn through the very fabric of reality itself",
  },
  {
    key: "water_air",
    name: "Typhoon",
    description: "Water and Air merge into a devastating storm that sweeps the battlefield.",
    elements: ["water", "air"],
    icon: "CloudRain",
    color: "#0284c7",
    applicableSystems: ["fight", "guild_war", "card_game"],
    effects: [
      { type: "damage", target: "area", stat: "storm_damage", value: 0.15, duration: 2, label: "15% AoE storm damage for 2 turns" },
      { type: "debuff", target: "enemy", stat: "speed", value: -0.20, duration: 2, label: "-20% enemy speed for 2 turns" },
    ],
    visualEffect: "A massive typhoon of wind and rain crashes across the field",
  },
  {
    key: "probability_water",
    name: "Lucky Current",
    description: "Probability-infused waters flow toward fortune, improving all outcomes.",
    elements: ["probability", "water"],
    icon: "Droplets",
    color: "#0d9488",
    applicableSystems: ["card_game", "fight", "chess"],
    effects: [
      { type: "buff", target: "self", stat: "rng_improvement", value: 0.12, duration: 3, label: "+12% RNG outcomes for 3 turns" },
      { type: "heal", target: "self", stat: "hp_regen", value: 0.05, duration: 3, label: "Heal 5% HP per turn for 3 turns" },
    ],
    visualEffect: "Shimmering currents of liquid luck flow around you",
  },
  {
    key: "space_earth",
    name: "Meteor Strike",
    description: "Space pulls Earth from the heavens, raining destruction from above.",
    elements: ["space", "earth"],
    icon: "Asterisk",
    color: "#92400e",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "damage", target: "enemy", stat: "meteor_damage", value: 0.35, duration: 0, label: "+35% meteor impact damage" },
      { type: "debuff", target: "enemy", stat: "stun", value: 1, duration: 1, label: "Stun enemy for 1 turn" },
    ],
    visualEffect: "A massive boulder tears through space and crashes into the target",
  },
  {
    key: "time_air",
    name: "Temporal Gale",
    description: "Time-warped winds accelerate allies and slow enemies.",
    elements: ["time", "air"],
    icon: "Clock",
    color: "#0ea5e9",
    applicableSystems: ["fight", "card_game"],
    effects: [
      { type: "buff", target: "self", stat: "action_speed", value: 1.25, duration: 3, label: "+25% action speed for 3 turns" },
      { type: "debuff", target: "enemy", stat: "speed", value: -0.25, duration: 3, label: "-25% enemy speed for 3 turns" },
    ],
    visualEffect: "Winds that carry the weight of ages sweep across the field",
  },
  {
    key: "probability_earth",
    name: "Seismic Gambit",
    description: "Probability-charged earth trembles with unpredictable force.",
    elements: ["probability", "earth"],
    icon: "Mountain",
    color: "#65a30d",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "damage", target: "area", stat: "quake_damage", value: 0.20, duration: 0, label: "20% AoE quake damage" },
      { type: "buff", target: "self", stat: "crit_chance", value: 0.10, duration: 2, label: "+10% crit chance for 2 turns" },
    ],
    visualEffect: "The ground cracks and shifts with probability-infused energy",
  },
  {
    key: "reality_water",
    name: "Mirror Pool",
    description: "Reality-infused water creates perfect reflections that confuse enemies.",
    elements: ["reality", "water"],
    icon: "Scan",
    color: "#0891b2",
    applicableSystems: ["fight", "card_game"],
    effects: [
      { type: "buff", target: "self", stat: "dodge_chance", value: 0.15, duration: 3, label: "+15% dodge chance for 3 turns" },
      { type: "debuff", target: "enemy", stat: "accuracy", value: -0.15, duration: 3, label: "-15% enemy accuracy for 3 turns" },
    ],
    visualEffect: "Pools of reality-bending water create perfect mirror images",
  },
  {
    key: "reality_air",
    name: "Phantom Wind",
    description: "Reality-warped air passes through solid matter, striking the intangible.",
    elements: ["reality", "air"],
    icon: "Ghost",
    color: "#a855f7",
    applicableSystems: ["fight"],
    effects: [
      { type: "damage", target: "enemy", stat: "true_damage", value: 0.15, duration: 0, label: "+15% true damage (ignores all defenses)" },
      { type: "buff", target: "self", stat: "phase_through", value: 0.10, duration: 2, label: "10% chance to phase through attacks" },
    ],
    visualEffect: "Wind that exists between realities passes through all barriers",
  },
  {
    key: "space_fire",
    name: "Solar Flare",
    description: "Space channels the raw power of stars, unleashing devastating solar energy.",
    elements: ["space", "fire"],
    icon: "Sun",
    color: "#fbbf24",
    applicableSystems: ["fight", "guild_war"],
    effects: [
      { type: "damage", target: "area", stat: "solar_damage", value: 0.25, duration: 0, label: "25% AoE solar damage" },
      { type: "debuff", target: "enemy", stat: "defense", value: -0.10, duration: 3, label: "-10% enemy defense for 3 turns" },
    ],
    visualEffect: "A miniature sun erupts, bathing the battlefield in blinding light",
  },
  {
    key: "time_earth",
    name: "Fossil Strike",
    description: "Time petrifies Earth into ancient stone, creating devastating projectiles.",
    elements: ["time", "earth"],
    icon: "Gem",
    color: "#a3a3a3",
    applicableSystems: ["fight"],
    effects: [
      { type: "damage", target: "enemy", stat: "petrify_damage", value: 0.25, duration: 0, label: "+25% petrify damage" },
      { type: "debuff", target: "enemy", stat: "speed", value: -0.40, duration: 2, label: "-40% enemy speed for 2 turns" },
    ],
    visualEffect: "Ancient fossilized stone hurtles forward, carrying the weight of eons",
  },
  {
    key: "probability_space",
    name: "Quantum Tunnel",
    description: "Probability and Space create passages through impossible barriers.",
    elements: ["probability", "space"],
    icon: "Zap",
    color: "#6d28d9",
    applicableSystems: ["trade_empire", "guild_war"],
    effects: [
      { type: "utility", target: "self", stat: "bypass_defense", value: 1, duration: 0, label: "Bypass one defensive structure" },
      { type: "utility", target: "self", stat: "warp_cost_reduction", value: 0.50, duration: 0, label: "50% warp cost reduction" },
    ],
    visualEffect: "Reality flickers as probability carves a tunnel through space",
  },
];

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Find the combo between two elements (order-independent).
 */
export function findCombo(elementA: Element, elementB: Element): ElementalCombo | null {
  if (elementA === elementB) return null; // Same element = no combo
  return ELEMENTAL_COMBOS.find(
    c =>
      (c.elements[0] === elementA && c.elements[1] === elementB) ||
      (c.elements[0] === elementB && c.elements[1] === elementA)
  ) || null;
}

/**
 * Get all combos that involve a specific element.
 */
export function getCombosForElement(element: Element): ElementalCombo[] {
  return ELEMENTAL_COMBOS.filter(
    c => c.elements[0] === element || c.elements[1] === element
  );
}

/**
 * Get all combos applicable to a specific game system.
 */
export function getCombosForSystem(system: ElementalCombo["applicableSystems"][number]): ElementalCombo[] {
  return ELEMENTAL_COMBOS.filter(c => c.applicableSystems.includes(system));
}

/**
 * Resolve a combo between two players' elements for a specific game system.
 * Returns the combo and its effects if applicable.
 */
export function resolveElementalCombo(
  attackerElement: Element,
  defenderElement: Element,
  system: ElementalCombo["applicableSystems"][number]
): { combo: ElementalCombo; effects: ComboEffect[] } | null {
  const combo = findCombo(attackerElement, defenderElement);
  if (!combo) return null;
  if (!combo.applicableSystems.includes(system)) return null;
  return { combo, effects: combo.effects };
}

/**
 * Get the element advantage chart — which elements have strong combos against others.
 */
export function getElementAdvantages(element: Element): { strong: Element[]; weak: Element[] } {
  const combos = getCombosForElement(element);
  const strong: Element[] = [];
  const weak: Element[] = [];

  for (const combo of combos) {
    const otherElement = combo.elements[0] === element ? combo.elements[1] : combo.elements[0];
    const hasDamage = combo.effects.some(e => e.type === "damage" && e.target === "enemy");
    const hasBuff = combo.effects.some(e => e.type === "buff" && e.target === "self");

    if (hasDamage) {
      strong.push(otherElement);
    } else if (hasBuff) {
      weak.push(otherElement); // "weak" in the sense that the combo is defensive, not offensive
    }
  }

  return { strong, weak };
}
