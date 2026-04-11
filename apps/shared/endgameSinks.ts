/* ═══════════════════════════════════════════════════════
   F.4 ENDGAME DREAM DRAINS — Sinks for level 40+ players

   The balance simulator shows Dream inflating 35-78x over
   90 days. Endgame players accumulate Dream fastest because
   they have high resource multipliers and nothing to spend on.

   These sinks target the highest-balance players with
   community, cosmetic, and guild options that are visible
   to other players (social proof drives spending).
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type EndgameSinkCategory = "cosmetic" | "community" | "guild";

export interface EndgameSink {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: EndgameSinkCategory;
  requirements: EndgameSinkRequirement;
  /** Whether it can be purchased multiple times */
  repeatable: boolean;
  /** For tiered sinks, which tier this represents */
  tier?: number;
}

export interface EndgameSinkRequirement {
  minLevel: number;
  /** Optional: must have completed a specific quest */
  questId?: string;
  /** Optional: must be in a guild */
  requiresGuild?: boolean;
  /** Optional: must own a previous tier of this sink */
  previousTierId?: string;
}

/* ─── ARK RESTORATION (Community Goal) ─── */

/**
 * Weekly community project. All players contribute Dream to
 * repair/upgrade Ark 1047. Progress is visible to everyone.
 * Each tier unlocks a permanent server-wide bonus.
 */
const ARK_RESTORATION_TIERS: EndgameSink[] = [
  {
    id: "ark_hull_plating",
    name: "Ark Restoration: Hull Plating",
    description:
      "Contribute Dream to reinforce the Ark's hull. When the community goal is reached, " +
      "all players gain +5% Salvage from Terminus Swarm for the rest of the season.",
    cost: 1000,
    category: "community",
    requirements: { minLevel: 40 },
    repeatable: true,
    tier: 1,
  },
  {
    id: "ark_engine_core",
    name: "Ark Restoration: Engine Core",
    description:
      "Fund the Engine Core reconstruction. Community reward: Trade Empire missions " +
      "complete 10% faster for all players this season.",
    cost: 2000,
    category: "community",
    requirements: { minLevel: 42 },
    repeatable: true,
    tier: 2,
  },
  {
    id: "ark_weapons_array",
    name: "Ark Restoration: Weapons Array",
    description:
      "Restore the Ark's weapons systems. Community reward: +1 Void Crystal " +
      "from weekly boss kills for all players this season.",
    cost: 3500,
    category: "community",
    requirements: { minLevel: 44 },
    repeatable: true,
    tier: 3,
  },
  {
    id: "ark_shield_generator",
    name: "Ark Restoration: Shield Generator",
    description:
      "Rebuild the planetary shield. Community reward: all players gain a " +
      "free daily crafting attempt (no material cost) this season.",
    cost: 5000,
    category: "community",
    requirements: { minLevel: 46 },
    repeatable: true,
    tier: 4,
  },
  {
    id: "ark_nexus_beacon",
    name: "Ark Restoration: CoNexus Beacon",
    description:
      "Activate the CoNexus Beacon — the Ark's most powerful system. " +
      "Community reward: +10% XP and Dream from all sources for the rest of the season.",
    cost: 7500,
    category: "community",
    requirements: { minLevel: 48 },
    repeatable: true,
    tier: 5,
  },
];

/* ─── DREAM TITHE (Guild) ─── */

/**
 * Donate Dream to your guild treasury. Grants shared bonuses
 * to all guild members based on total donations this week.
 */
const DREAM_TITHE_OPTIONS: EndgameSink[] = [
  {
    id: "tithe_small",
    name: "Dream Tithe: Offering",
    description:
      "Donate Dream to the guild treasury. Guild members gain +2% Dream income " +
      "for the rest of the week when the guild reaches 5,000 total donations.",
    cost: 500,
    category: "guild",
    requirements: { minLevel: 40, requiresGuild: true },
    repeatable: true,
  },
  {
    id: "tithe_medium",
    name: "Dream Tithe: Tribute",
    description:
      "A generous tribute to the guild. Counts for 3x toward the weekly guild goal. " +
      "At 15,000 total: guild members gain +5% XP for the week.",
    cost: 1500,
    category: "guild",
    requirements: { minLevel: 42, requiresGuild: true },
    repeatable: true,
  },
  {
    id: "tithe_large",
    name: "Dream Tithe: Grand Offering",
    description:
      "A massive Dream contribution. Counts for 7x toward the weekly guild goal. " +
      "At 50,000 total: guild unlocks a temporary shared Void Crystal bonus.",
    cost: 5000,
    category: "guild",
    requirements: { minLevel: 45, requiresGuild: true },
    repeatable: true,
  },
];

/* ─── PRESTIGE AURA (Cosmetic, 5 tiers) ─── */

/**
 * Cosmetic auras visible to all players. Each tier builds on the
 * previous one and costs 5000+ Dream. Purely visual.
 */
const PRESTIGE_AURAS: EndgameSink[] = [
  {
    id: "aura_ember",
    name: "Prestige Aura: Ember",
    description:
      "A subtle ember glow surrounds your avatar. The first step on the path " +
      "to true prestige.",
    cost: 5000,
    category: "cosmetic",
    requirements: { minLevel: 40 },
    repeatable: false,
    tier: 1,
  },
  {
    id: "aura_starfall",
    name: "Prestige Aura: Starfall",
    description:
      "Falling stars trail behind your avatar. A testament to your commitment.",
    cost: 7500,
    category: "cosmetic",
    requirements: { minLevel: 42, previousTierId: "aura_ember" },
    repeatable: false,
    tier: 2,
  },
  {
    id: "aura_void_rift",
    name: "Prestige Aura: Void Rift",
    description:
      "Reality fractures around you with void energy. Others can see it in all game modes.",
    cost: 10000,
    category: "cosmetic",
    requirements: { minLevel: 44, previousTierId: "aura_starfall" },
    repeatable: false,
    tier: 3,
  },
  {
    id: "aura_archon_flame",
    name: "Prestige Aura: Archon Flame",
    description:
      "The legendary flame of the Archons themselves. A mark of the highest dedication.",
    cost: 15000,
    category: "cosmetic",
    requirements: { minLevel: 46, previousTierId: "aura_void_rift" },
    repeatable: false,
    tier: 4,
  },
  {
    id: "aura_nexus_crown",
    name: "Prestige Aura: CoNexus Crown",
    description:
      "The ultimate prestige cosmetic. A pulsating crown of CoNexus energy that " +
      "marks you as one of the game's most dedicated players. Visible everywhere.",
    cost: 25000,
    category: "cosmetic",
    requirements: { minLevel: 48, previousTierId: "aura_archon_flame" },
    repeatable: false,
    tier: 5,
  },
];

/* ─── CARD GILDING (Cosmetic) ─── */

/**
 * Make any card golden/animated. Purely cosmetic — no stat change.
 * Costs 2000 Dream per card. Visible to opponents in Dischordia.
 */
const CARD_GILDING: EndgameSink[] = [
  {
    id: "gild_card",
    name: "Card Gilding",
    description:
      "Transform a card into a golden animated version. The card shimmers in your " +
      "collection and on the Dischordia battlefield. Purely cosmetic.",
    cost: 2000,
    category: "cosmetic",
    requirements: { minLevel: 40 },
    repeatable: true,
  },
  {
    id: "gild_card_holographic",
    name: "Holographic Card Gilding",
    description:
      "An even more prestigious card treatment: full holographic animation " +
      "with particle effects. The ultimate flex in Dischordia matches.",
    cost: 4000,
    category: "cosmetic",
    requirements: { minLevel: 45 },
    repeatable: true,
  },
];

/* ─── ALL ENDGAME SINKS ─── */

const ALL_ENDGAME_SINKS: EndgameSink[] = [
  ...ARK_RESTORATION_TIERS,
  ...DREAM_TITHE_OPTIONS,
  ...PRESTIGE_AURAS,
  ...CARD_GILDING,
];

/* ─── PUBLIC API ─── */

/**
 * Returns all endgame sinks available to a player at the given level.
 * Filters by minimum level requirement.
 */
export function getEndgameSinks(level: number): EndgameSink[] {
  return ALL_ENDGAME_SINKS.filter((sink) => level >= sink.requirements.minLevel);
}

/**
 * Returns endgame sinks filtered by category.
 */
export function getEndgameSinksByCategory(
  level: number,
  category: EndgameSinkCategory,
): EndgameSink[] {
  return getEndgameSinks(level).filter((sink) => sink.category === category);
}

/**
 * Calculates the total Dream needed to purchase all non-repeatable
 * endgame sinks. Useful for estimating how much Dream the endgame
 * can absorb from a single player.
 *
 * Current total: 5000 + 7500 + 10000 + 15000 + 25000 = 62,500 (auras)
 *                + 2000 + 4000 = 6,000 (gilding, but repeatable)
 * Non-repeatable total: 62,500 Dream
 *
 * With repeatable sinks (Ark, Tithe, Gilding), the ceiling is unlimited.
 */
export function getTotalNonRepeatableCost(): number {
  return ALL_ENDGAME_SINKS
    .filter((sink) => !sink.repeatable)
    .reduce((sum, sink) => sum + sink.cost, 0);
}

/**
 * Convenience: get the Ark Restoration tiers as a standalone array.
 */
export function getArkRestorationTiers(): EndgameSink[] {
  return [...ARK_RESTORATION_TIERS];
}

/**
 * Convenience: get the Prestige Aura tiers as a standalone array.
 */
export function getPrestigeAuraTiers(): EndgameSink[] {
  return [...PRESTIGE_AURAS];
}
