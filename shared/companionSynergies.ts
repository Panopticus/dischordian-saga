/**
 * COMPANION BUILD SYNERGIES (Recommendation 4.6)
 * ───────────────────────────────────────────────
 * Inspired by Mass Effect squad combos, BG3 party composition, Dragon Age synergies.
 * When a companion's faction/morality aligns with the player's build, both gain bonuses.
 * Deeper relationship levels unlock stronger synergy tiers.
 *
 * Design philosophy:
 * - Companion choice should matter mechanically, not just narratively
 * - Alignment between player morality and companion morality creates synergies
 * - Opposing alignments create "tension bonuses" (risk/reward dynamic)
 * - Relationship depth amplifies all synergy effects
 */

import type { CitizenData } from "./citizenTraits";

/* ═══════════════════════════════════════════════════════
   COMPANION TYPES
   ═══════════════════════════════════════════════════════ */

export type CompanionId = "elara" | "the_human";

export interface CompanionBuildProfile {
  id: CompanionId;
  name: string;
  faction: "dreamer" | "architect";
  moralitySide: "humanity" | "machine";
  /** Classes that synergize with this companion */
  synergyClasses: string[];
  /** Elements that synergize with this companion */
  synergyElements: string[];
  /** Species that synergize with this companion */
  synergySpecies: string[];
}

export const COMPANION_PROFILES: Record<CompanionId, CompanionBuildProfile> = {
  elara: {
    id: "elara",
    name: "Elara",
    faction: "dreamer",
    moralitySide: "humanity",
    synergyClasses: ["oracle", "engineer"],
    synergyElements: ["water", "time", "reality"],
    synergySpecies: ["neyon", "demagi"],
  },
  the_human: {
    id: "the_human",
    name: "The Human",
    faction: "architect",
    moralitySide: "machine",
    synergyClasses: ["spy", "assassin", "soldier"],
    synergyElements: ["fire", "space", "probability"],
    synergySpecies: ["quarchon"],
  },
};

/* ═══════════════════════════════════════════════════════
   SYNERGY TIER SYSTEM
   ═══════════════════════════════════════════════════════ */

export type SynergyTier = 0 | 1 | 2 | 3 | 4;

export interface SynergyTierInfo {
  tier: SynergyTier;
  name: string;
  description: string;
  color: string;
  /** Minimum relationship level required */
  minRelationship: number;
  /** Minimum synergy score required (from build alignment) */
  minSynergyScore: number;
}

export const SYNERGY_TIERS: SynergyTierInfo[] = [
  { tier: 0, name: "Distant", description: "No meaningful synergy — companion is a stranger.", color: "#6b7280", minRelationship: 0, minSynergyScore: 0 },
  { tier: 1, name: "Aligned", description: "Basic synergy — your builds complement each other.", color: "#22c55e", minRelationship: 15, minSynergyScore: 2 },
  { tier: 2, name: "Bonded", description: "Strong synergy — you fight as one.", color: "#3b82f6", minRelationship: 40, minSynergyScore: 3 },
  { tier: 3, name: "Resonant", description: "Deep synergy — your powers amplify each other.", color: "#8b5cf6", minRelationship: 70, minSynergyScore: 4 },
  { tier: 4, name: "Transcendent", description: "Perfect synergy — you are greater than the sum of your parts.", color: "#f59e0b", minRelationship: 90, minSynergyScore: 5 },
];

/* ═══════════════════════════════════════════════════════
   SYNERGY BONUSES PER TIER
   ═══════════════════════════════════════════════════════ */

export interface CompanionSynergyBonus {
  tier: SynergyTier;
  system: "card_game" | "trade_empire" | "fight" | "chess" | "guild_war" | "quest" | "all";
  type: "multiplier" | "flat" | "passive" | "unlock";
  target: string;
  value: number;
  label: string;
}

/** Bonuses from Elara synergy */
export const ELARA_SYNERGY_BONUSES: CompanionSynergyBonus[] = [
  // Tier 1 — Aligned
  { tier: 1, system: "quest", type: "multiplier", target: "quest_reward", value: 1.10, label: "+10% quest rewards" },
  { tier: 1, system: "all", type: "multiplier", target: "dream_token_gain", value: 1.05, label: "+5% Dream token gains" },

  // Tier 2 — Bonded
  { tier: 2, system: "card_game", type: "flat", target: "starting_hp", value: 5, label: "+5 starting HP in card battles" },
  { tier: 2, system: "trade_empire", type: "multiplier", target: "scan_efficiency", value: 1.15, label: "+15% scan efficiency" },
  { tier: 2, system: "all", type: "multiplier", target: "dream_token_gain", value: 1.10, label: "+10% Dream token gains" },

  // Tier 3 — Resonant
  { tier: 3, system: "fight", type: "multiplier", target: "heal_power", value: 1.25, label: "+25% healing power" },
  { tier: 3, system: "chess", type: "flat", target: "undo_moves", value: 1, label: "+1 chess undo per game" },
  { tier: 3, system: "quest", type: "multiplier", target: "quest_reward", value: 1.25, label: "+25% quest rewards" },
  { tier: 3, system: "all", type: "multiplier", target: "xp_bonus", value: 1.10, label: "+10% all XP gains" },

  // Tier 4 — Transcendent
  { tier: 4, system: "all", type: "multiplier", target: "global_bonus", value: 1.08, label: "+8% all bonuses" },
  { tier: 4, system: "card_game", type: "unlock", target: "elara_assist_card", value: 1, label: "Unlock Elara's Assist card (once per battle)" },
  { tier: 4, system: "quest", type: "unlock", target: "elara_exclusive_quests", value: 1, label: "Unlock Elara's exclusive quest chain" },
  { tier: 4, system: "all", type: "multiplier", target: "dream_token_gain", value: 1.20, label: "+20% Dream token gains" },
];

/** Bonuses from The Human synergy */
export const THE_HUMAN_SYNERGY_BONUSES: CompanionSynergyBonus[] = [
  // Tier 1 — Aligned
  { tier: 1, system: "fight", type: "multiplier", target: "damage_bonus", value: 1.08, label: "+8% fight damage" },
  { tier: 1, system: "guild_war", type: "multiplier", target: "war_contribution", value: 1.05, label: "+5% war contributions" },

  // Tier 2 — Bonded
  { tier: 2, system: "fight", type: "multiplier", target: "crit_chance", value: 1.10, label: "+10% critical hit chance" },
  { tier: 2, system: "trade_empire", type: "multiplier", target: "trade_profit", value: 1.10, label: "+10% trade profits" },
  { tier: 2, system: "guild_war", type: "multiplier", target: "sabotage_power", value: 1.15, label: "+15% sabotage power" },

  // Tier 3 — Resonant
  { tier: 3, system: "fight", type: "multiplier", target: "damage_bonus", value: 1.20, label: "+20% fight damage" },
  { tier: 3, system: "chess", type: "flat", target: "time_bonus", value: 15, label: "+15s chess time" },
  { tier: 3, system: "guild_war", type: "multiplier", target: "territory_capture", value: 1.20, label: "+20% territory capture speed" },
  { tier: 3, system: "all", type: "multiplier", target: "class_mastery_xp", value: 1.10, label: "+10% class mastery XP" },

  // Tier 4 — Transcendent
  { tier: 4, system: "all", type: "multiplier", target: "global_bonus", value: 1.08, label: "+8% all bonuses" },
  { tier: 4, system: "fight", type: "unlock", target: "human_assist_strike", value: 1, label: "Unlock The Human's Assist Strike (once per fight)" },
  { tier: 4, system: "quest", type: "unlock", target: "human_exclusive_quests", value: 1, label: "Unlock The Human's exclusive quest chain" },
  { tier: 4, system: "guild_war", type: "multiplier", target: "war_contribution", value: 1.25, label: "+25% war contributions" },
];

/* ═══════════════════════════════════════════════════════
   TENSION BONUSES — When player opposes companion alignment
   (e.g., humanity player + The Human, or machine player + Elara)
   These are smaller but unique bonuses that reward diverse play.
   ═══════════════════════════════════════════════════════ */

export interface TensionBonus {
  companionId: CompanionId;
  system: "card_game" | "fight" | "guild_war" | "all";
  type: "multiplier" | "passive";
  target: string;
  value: number;
  label: string;
  /** Min relationship level for tension bonus to activate */
  minRelationship: number;
}

export const TENSION_BONUSES: TensionBonus[] = [
  // Elara tension (machine-aligned player + Elara)
  { companionId: "elara", system: "fight", type: "passive", target: "unpredictable_damage", value: 0.10, minRelationship: 30, label: "10% chance of unpredictable bonus damage" },
  { companionId: "elara", system: "all", type: "multiplier", target: "xp_bonus", value: 1.05, minRelationship: 50, label: "+5% XP from philosophical tension" },
  { companionId: "elara", system: "card_game", type: "passive", target: "wild_card_draw", value: 0.08, minRelationship: 70, label: "8% chance to draw a wild card" },

  // The Human tension (humanity-aligned player + The Human)
  { companionId: "the_human", system: "fight", type: "passive", target: "mercy_heal", value: 0.05, minRelationship: 30, label: "5% chance to heal on kill (mercy)" },
  { companionId: "the_human", system: "all", type: "multiplier", target: "dream_token_gain", value: 1.08, minRelationship: 50, label: "+8% Dream tokens from moral conflict" },
  { companionId: "the_human", system: "guild_war", type: "passive", target: "diplomacy_chance", value: 0.10, minRelationship: 70, label: "10% chance to convert enemy territory peacefully" },
];

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Calculate synergy score between a player build and a companion.
 * Score is 0-6 based on how many build aspects align.
 */
export function calculateSynergyScore(
  citizen: Pick<CitizenData, "species" | "characterClass" | "element" | "alignment">,
  companionId: CompanionId,
  morality: number // positive = humanity, negative = machine
): number {
  const profile = COMPANION_PROFILES[companionId];
  let score = 0;

  // Class synergy (+1)
  if (profile.synergyClasses.includes(citizen.characterClass)) score += 1;

  // Element synergy (+1)
  if (profile.synergyElements.includes(citizen.element)) score += 1;

  // Species synergy (+1)
  if (profile.synergySpecies.includes(citizen.species)) score += 1;

  // Morality alignment (+2 for strong alignment, +1 for moderate)
  const isAligned = (profile.moralitySide === "humanity" && morality > 0) ||
                    (profile.moralitySide === "machine" && morality < 0);
  if (isAligned) {
    const strength = Math.abs(morality);
    if (strength >= 50) score += 2;
    else if (strength >= 20) score += 1;
  }

  // Alignment synergy (+1 for matching faction philosophy)
  const factionAlignment = profile.faction === "dreamer" ? "chaos" : "order";
  if (citizen.alignment === factionAlignment) score += 1;

  return Math.min(score, 6);
}

/**
 * Determine the synergy tier based on relationship level and synergy score.
 */
export function getSynergyTier(
  relationshipLevel: number,
  synergyScore: number
): SynergyTierInfo {
  for (let i = SYNERGY_TIERS.length - 1; i >= 0; i--) {
    const tier = SYNERGY_TIERS[i];
    if (relationshipLevel >= tier.minRelationship && synergyScore >= tier.minSynergyScore) {
      return tier;
    }
  }
  return SYNERGY_TIERS[0];
}

/**
 * Get all active synergy bonuses for a companion at a given tier.
 */
export function getActiveSynergyBonuses(
  companionId: CompanionId,
  tier: SynergyTier
): CompanionSynergyBonus[] {
  const bonuses = companionId === "elara" ? ELARA_SYNERGY_BONUSES : THE_HUMAN_SYNERGY_BONUSES;
  return bonuses.filter(b => b.tier <= tier);
}

/**
 * Get active tension bonuses (when player opposes companion alignment).
 */
export function getActiveTensionBonuses(
  companionId: CompanionId,
  morality: number,
  relationshipLevel: number
): TensionBonus[] {
  const profile = COMPANION_PROFILES[companionId];

  // Check if player opposes companion's morality
  const isOpposed = (profile.moralitySide === "humanity" && morality < 0) ||
                    (profile.moralitySide === "machine" && morality > 0);

  if (!isOpposed) return [];

  return TENSION_BONUSES.filter(
    b => b.companionId === companionId && relationshipLevel >= b.minRelationship
  );
}

/**
 * Resolve all companion synergy bonuses for a specific game system.
 */
export function resolveCompanionBonuses(
  companionId: CompanionId,
  citizen: Pick<CitizenData, "species" | "characterClass" | "element" | "alignment">,
  morality: number,
  relationshipLevel: number,
  system: CompanionSynergyBonus["system"]
): {
  tier: SynergyTierInfo;
  synergyScore: number;
  synergyBonuses: CompanionSynergyBonus[];
  tensionBonuses: TensionBonus[];
} {
  const synergyScore = calculateSynergyScore(citizen, companionId, morality);
  const tierInfo = getSynergyTier(relationshipLevel, synergyScore);
  
  const synergyBonuses = getActiveSynergyBonuses(companionId, tierInfo.tier)
    .filter(b => b.system === system || b.system === "all");
  
  const tensionBonuses = getActiveTensionBonuses(companionId, morality, relationshipLevel)
    .filter(b => b.system === system || b.system === "all");

  return { tier: tierInfo, synergyScore, synergyBonuses, tensionBonuses };
}

/**
 * Get a summary of all synergy effects for UI display.
 */
export function getSynergySummary(
  companionId: CompanionId,
  citizen: Pick<CitizenData, "species" | "characterClass" | "element" | "alignment">,
  morality: number,
  relationshipLevel: number
): {
  companionName: string;
  tier: SynergyTierInfo;
  synergyScore: number;
  maxScore: number;
  matchDetails: { aspect: string; matched: boolean; label: string }[];
  totalBonuses: number;
} {
  const profile = COMPANION_PROFILES[companionId];
  const synergyScore = calculateSynergyScore(citizen, companionId, morality);
  const tierInfo = getSynergyTier(relationshipLevel, synergyScore);

  const matchDetails = [
    {
      aspect: "class",
      matched: profile.synergyClasses.includes(citizen.characterClass),
      label: `Class: ${citizen.characterClass} ${profile.synergyClasses.includes(citizen.characterClass) ? "✓" : "✗"}`,
    },
    {
      aspect: "element",
      matched: profile.synergyElements.includes(citizen.element),
      label: `Element: ${citizen.element} ${profile.synergyElements.includes(citizen.element) ? "✓" : "✗"}`,
    },
    {
      aspect: "species",
      matched: profile.synergySpecies.includes(citizen.species),
      label: `Species: ${citizen.species} ${profile.synergySpecies.includes(citizen.species) ? "✓" : "✗"}`,
    },
    {
      aspect: "morality",
      matched: (profile.moralitySide === "humanity" && morality > 0) || (profile.moralitySide === "machine" && morality < 0),
      label: `Morality: ${morality > 0 ? "Humanity" : morality < 0 ? "Machine" : "Neutral"} ${((profile.moralitySide === "humanity" && morality > 0) || (profile.moralitySide === "machine" && morality < 0)) ? "✓" : "✗"}`,
    },
    {
      aspect: "alignment",
      matched: citizen.alignment === (profile.faction === "dreamer" ? "chaos" : "order"),
      label: `Alignment: ${citizen.alignment} ${citizen.alignment === (profile.faction === "dreamer" ? "chaos" : "order") ? "✓" : "✗"}`,
    },
  ];

  const totalBonuses = getActiveSynergyBonuses(companionId, tierInfo.tier).length +
    getActiveTensionBonuses(companionId, morality, relationshipLevel).length;

  return {
    companionName: profile.name,
    tier: tierInfo,
    synergyScore,
    maxScore: 6,
    matchDetails,
    totalBonuses,
  };
}
