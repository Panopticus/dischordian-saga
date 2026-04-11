/* ═══════════════════════════════════════════════════════
   CARD ARCHETYPES — Deck classification & matchup analysis

   Defines 6 deck archetypes with ideal ratios, keywords,
   counter-archetypes, and win conditions. Provides deck
   classification and ELO matchup adjustments.
   ═══════════════════════════════════════════════════════ */

import type { PvpCard } from "./pvpBattle";

/* ─── TYPES ─── */

export interface CardRatio {
  creatures: number; // 0-1 proportion
  spells: number;
  items: number;
}

export interface Archetype {
  id: string;
  name: string;
  description: string;
  idealRatio: CardRatio;
  /** Average cost curve center (mana/energy) */
  idealAvgCost: number;
  /** Cost curve tolerance +/- from idealAvgCost */
  costTolerance: number;
  /** Keywords commonly found in this archetype's cards */
  keyKeywords: string[];
  /** Archetype ID this archetype counters */
  counterArchetype: string;
  /** Archetype ID that counters this archetype */
  counteredBy: string;
  /** How this archetype wins games */
  winCondition: string;
  /** UI icon identifier */
  icon: string;
}

/* ─── ARCHETYPE DEFINITIONS ─── */

export const ARCHETYPES: Record<string, Archetype> = {
  aggro_dreamer: {
    id: "aggro_dreamer",
    name: "Aggro Dreamer",
    description: "Fast, low-cost deck that overwhelms opponents before they can set up defenses.",
    idealRatio: { creatures: 0.65, spells: 0.25, items: 0.10 },
    idealAvgCost: 2.2,
    costTolerance: 0.8,
    keyKeywords: ["rush", "charge", "haste", "direct damage", "burn", "swift"],
    counterArchetype: "combo",
    counteredBy: "control_architect",
    winCondition: "Reduce opponent HP to zero before turn 6 with cheap, aggressive units and burn spells.",
    icon: "Flame",
  },
  control_architect: {
    id: "control_architect",
    name: "Control Architect",
    description: "Defensive, high-cost deck that stalls the game and wins with powerful late-game threats.",
    idealRatio: { creatures: 0.30, spells: 0.50, items: 0.20 },
    idealAvgCost: 5.0,
    costTolerance: 1.2,
    keyKeywords: ["taunt", "guard", "heal", "removal", "counter", "shield", "ward"],
    counterArchetype: "aggro_dreamer",
    counteredBy: "ramp",
    winCondition: "Survive early aggression with removal and healing, then deploy dominant late-game finishers.",
    icon: "Shield",
  },
  midrange_neutral: {
    id: "midrange_neutral",
    name: "Midrange Neutral",
    description: "Balanced deck that can adapt to aggro or control playstyles as needed.",
    idealRatio: { creatures: 0.50, spells: 0.30, items: 0.20 },
    idealAvgCost: 3.5,
    costTolerance: 1.0,
    keyKeywords: ["versatile", "adaptive", "efficient", "value", "tempo"],
    counterArchetype: "ramp",
    counteredBy: "swarm",
    winCondition: "Out-tempo the opponent with efficient on-curve plays and flexible responses.",
    icon: "Scale",
  },
  swarm: {
    id: "swarm",
    name: "Swarm",
    description: "Floods the board with many weak units that overwhelm through sheer numbers.",
    idealRatio: { creatures: 0.75, spells: 0.15, items: 0.10 },
    idealAvgCost: 1.8,
    costTolerance: 0.6,
    keyKeywords: ["summon", "token", "swarm", "buff", "rally", "inspire"],
    counterArchetype: "midrange_neutral",
    counteredBy: "combo",
    winCondition: "Flood the board with tokens and cheap units, then use mass-buff spells for lethal damage.",
    icon: "Users",
  },
  ramp: {
    id: "ramp",
    name: "Ramp",
    description: "Accelerates resource generation to deploy expensive threats ahead of schedule.",
    idealRatio: { creatures: 0.40, spells: 0.35, items: 0.25 },
    idealAvgCost: 4.5,
    costTolerance: 1.5,
    keyKeywords: ["ramp", "accelerate", "energy", "mana", "growth", "harvest"],
    counterArchetype: "control_architect",
    counteredBy: "aggro_dreamer",
    winCondition: "Ramp energy quickly to deploy massive threats 2-3 turns earlier than the opponent expects.",
    icon: "TrendingUp",
  },
  combo: {
    id: "combo",
    name: "Combo",
    description: "Synergy-dependent deck that assembles specific card combinations for devastating effects.",
    idealRatio: { creatures: 0.35, spells: 0.45, items: 0.20 },
    idealAvgCost: 3.2,
    costTolerance: 1.3,
    keyKeywords: ["synergy", "combo", "chain", "trigger", "draw", "search", "cycle"],
    counterArchetype: "swarm",
    counteredBy: "aggro_dreamer",
    winCondition: "Assemble a specific combination of cards that creates an overwhelming or instant-win effect.",
    icon: "Puzzle",
  },
};

export const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as (keyof typeof ARCHETYPES)[];

/* ─── MATCHUP TABLE ─── */

/**
 * Matchup advantage matrix. Values represent ELO adjustment for the attacker.
 * Positive = attacker favored, negative = defender favored.
 * Range: -0.1 to +0.1
 */
const MATCHUP_TABLE: Record<string, Record<string, number>> = {
  aggro_dreamer:     { aggro_dreamer: 0, control_architect: -0.08, midrange_neutral: 0.03, swarm: 0.02, ramp: 0.10, combo: 0.07 },
  control_architect: { aggro_dreamer: 0.08, control_architect: 0, midrange_neutral: 0.03, swarm: 0.04, ramp: -0.08, combo: 0.02 },
  midrange_neutral:  { aggro_dreamer: -0.03, control_architect: -0.03, midrange_neutral: 0, swarm: -0.06, ramp: 0.07, combo: 0.03 },
  swarm:             { aggro_dreamer: -0.02, control_architect: -0.04, midrange_neutral: 0.06, swarm: 0, ramp: 0.04, combo: -0.08 },
  ramp:              { aggro_dreamer: -0.10, control_architect: 0.08, midrange_neutral: -0.07, swarm: -0.04, ramp: 0, combo: 0.05 },
  combo:             { aggro_dreamer: -0.07, control_architect: -0.02, midrange_neutral: -0.03, swarm: 0.08, ramp: -0.05, combo: 0 },
};

/* ─── DECK CLASSIFICATION ─── */

interface CardInfo {
  cardId: string;
  type?: string;
  cost?: number;
  ability?: string;
}

/**
 * Classify a deck into an archetype based on its average cost curve
 * and keyword distribution.
 *
 * @param cardIds - Array of card IDs in the deck
 * @param cardLookup - Optional lookup function to resolve card data.
 *   If not provided, classification uses cost heuristics only.
 */
export function classifyDeck(
  cardIds: string[],
  cardLookup?: (cardId: string) => CardInfo | undefined,
): string {
  if (cardIds.length === 0) return "midrange_neutral";

  // If we have a card lookup, use detailed analysis
  const cards: CardInfo[] = cardLookup
    ? cardIds.map(id => cardLookup(id) || { cardId: id })
    : cardIds.map(id => ({ cardId: id }));

  // Calculate type ratios
  let creatureCount = 0;
  let spellCount = 0;
  let itemCount = 0;
  let totalCost = 0;
  let costCount = 0;
  const keywordCounts: Record<string, number> = {};

  for (const card of cards) {
    const type = (card.type || "unit").toLowerCase();
    if (type === "unit" || type === "creature") creatureCount++;
    else if (type === "spell") spellCount++;
    else itemCount++;

    if (card.cost !== undefined) {
      totalCost += card.cost;
      costCount++;
    }

    if (card.ability) {
      const abilityLower = card.ability.toLowerCase();
      for (const [, archetype] of Object.entries(ARCHETYPES)) {
        for (const keyword of archetype.keyKeywords) {
          if (abilityLower.includes(keyword.toLowerCase())) {
            keywordCounts[archetype.id] = (keywordCounts[archetype.id] || 0) + 1;
          }
        }
      }
    }
  }

  const total = cards.length;
  const actualRatio: CardRatio = {
    creatures: creatureCount / total,
    spells: spellCount / total,
    items: itemCount / total,
  };
  const avgCost = costCount > 0 ? totalCost / costCount : 3.0;

  // Score each archetype
  let bestArchetype = "midrange_neutral";
  let bestScore = -Infinity;

  for (const [id, archetype] of Object.entries(ARCHETYPES)) {
    let score = 0;

    // Ratio similarity (lower distance = higher score)
    const ratioDist =
      Math.abs(actualRatio.creatures - archetype.idealRatio.creatures) +
      Math.abs(actualRatio.spells - archetype.idealRatio.spells) +
      Math.abs(actualRatio.items - archetype.idealRatio.items);
    score += (2 - ratioDist) * 30; // Max ~60 points

    // Cost curve similarity
    const costDist = Math.abs(avgCost - archetype.idealAvgCost);
    if (costDist <= archetype.costTolerance) {
      score += (1 - costDist / archetype.costTolerance) * 25;
    }

    // Keyword matches
    score += (keywordCounts[id] || 0) * 5;

    if (score > bestScore) {
      bestScore = score;
      bestArchetype = id;
    }
  }

  return bestArchetype;
}

/* ─── MATCHUP ADVANTAGE ─── */

/**
 * Returns an ELO adjustment factor based on the archetype matchup.
 * Range: -0.1 to +0.1
 *
 * @param attacker - Archetype ID of the attacking/initiating player's deck
 * @param defender - Archetype ID of the defending player's deck
 * @returns ELO adjustment multiplier. Positive favors attacker.
 */
export function getArchetypeAdvantage(attacker: string, defender: string): number {
  const attackerRow = MATCHUP_TABLE[attacker];
  if (!attackerRow) return 0;
  const value = attackerRow[defender];
  if (value === undefined) return 0;
  // Clamp to valid range
  return Math.max(-0.1, Math.min(0.1, value));
}

/**
 * Get a human-readable matchup description.
 */
export function getMatchupDescription(attacker: string, defender: string): string {
  const advantage = getArchetypeAdvantage(attacker, defender);
  const attackerArch = ARCHETYPES[attacker];
  const defenderArch = ARCHETYPES[defender];
  if (!attackerArch || !defenderArch) return "Unknown matchup";

  if (advantage > 0.05) return `${attackerArch.name} is strongly favored against ${defenderArch.name}`;
  if (advantage > 0.02) return `${attackerArch.name} has a slight edge against ${defenderArch.name}`;
  if (advantage > -0.02) return `Even matchup between ${attackerArch.name} and ${defenderArch.name}`;
  if (advantage > -0.05) return `${defenderArch.name} has a slight edge against ${attackerArch.name}`;
  return `${defenderArch.name} is strongly favored against ${attackerArch.name}`;
}
