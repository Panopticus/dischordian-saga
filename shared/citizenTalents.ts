/**
 * CITIZEN TALENT SYSTEM (Recommendation 4.3)
 * ─────────────────────────────────────────
 * Inspired by BG3 Feats, Divinity Talents, Disco Elysium Thought Cabinet.
 * Players choose one powerful passive ability at milestone levels (5, 10, 15, 20).
 * Each talent meaningfully alters gameplay rather than providing simple stat increases.
 *
 * Design philosophy:
 * - Level 5: Accessible early, general utility talents
 * - Level 10: Specialization talents that reward a playstyle
 * - Level 15: Powerful talents that reshape gameplay
 * - Level 20: Capstone talents with transformative effects
 */

/* ═══════════════════════════════════════════════════════
   TALENT DEFINITIONS
   ═══════════════════════════════════════════════════════ */

export const TALENT_MILESTONES = [5, 10, 15, 20] as const;
export type TalentMilestone = (typeof TALENT_MILESTONES)[number];

export interface CitizenTalent {
  /** Unique key */
  key: string;
  /** Display name */
  name: string;
  /** Lore-flavored description */
  description: string;
  /** Icon identifier (lucide icon name) */
  icon: string;
  /** Color hex for UI */
  color: string;
  /** Which milestone level this talent is available at */
  availableAt: TalentMilestone;
  /** Tier for UI display */
  tier: 1 | 2 | 3 | 4;
  /** Optional: class restriction (null = available to all) */
  classRestriction?: string | null;
  /** Optional: species restriction */
  speciesRestriction?: string | null;
  /** Mechanical effects */
  effects: TalentEffect[];
  /** Flavor text — lore explanation */
  flavorText: string;
}

export interface TalentEffect {
  /** Which game system this affects */
  system: "card_game" | "trade_empire" | "fight" | "chess" | "guild_war" | "quest" | "market" | "crafting" | "all";
  /** Effect type */
  type: "multiplier" | "flat" | "passive" | "unlock";
  /** What stat/mechanic is affected */
  target: string;
  /** Numeric value */
  value: number;
  /** Human-readable description */
  label: string;
}

/* ═══════════════════════════════════════════════════════
   TIER 1 TALENTS — Available at Level 5
   General utility, accessible to all builds
   ═══════════════════════════════════════════════════════ */

export const CITIZEN_TALENTS: CitizenTalent[] = [
  /* ─── TIER 1: Level 5 ─── */
  {
    key: "lucky_star",
    name: "Lucky Star",
    description: "Fortune favors you. All RNG outcomes improved by 5%.",
    icon: "Star",
    color: "#fbbf24",
    availableAt: 5,
    tier: 1,
    flavorText: "Some say luck is just probability in disguise. You know better — you've always had the universe's attention.",
    effects: [
      { system: "all", type: "passive", target: "rng_improvement", value: 0.05, label: "+5% to all RNG outcomes" },
    ],
  },
  {
    key: "iron_constitution",
    name: "Iron Constitution",
    description: "Cannot be reduced below 1 HP for the first 3 turns of any fight.",
    icon: "ShieldCheck",
    color: "#6b7280",
    availableAt: 5,
    tier: 1,
    flavorText: "Your body has been broken before. It learned to refuse death.",
    effects: [
      { system: "fight", type: "passive", target: "invulnerable_turns", value: 3, label: "Invulnerable for first 3 turns" },
    ],
  },
  {
    key: "silver_tongue",
    name: "Silver Tongue",
    description: "Marketplace tax reduced by 15%, quest rewards +10%.",
    icon: "MessageSquare",
    color: "#a3a3a3",
    availableAt: 5,
    tier: 1,
    flavorText: "Words are weapons. Yours are sharper than most blades.",
    effects: [
      { system: "market", type: "multiplier", target: "tax_reduction", value: 0.85, label: "15% marketplace tax reduction" },
      { system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.10, label: "+10% quest rewards" },
    ],
  },
  {
    key: "quick_study",
    name: "Quick Study",
    description: "All XP gains +20% (class XP, battle pass, citizen level).",
    icon: "BookOpen",
    color: "#22d3ee",
    availableAt: 5,
    tier: 1,
    flavorText: "Where others see patterns, you see shortcuts. Knowledge flows to you like water downhill.",
    effects: [
      { system: "all", type: "multiplier", target: "xp_bonus", value: 1.20, label: "+20% all XP gains" },
    ],
  },
  {
    key: "scavenger",
    name: "Scavenger",
    description: "10% chance to find bonus materials after any game activity.",
    icon: "Package",
    color: "#a16207",
    availableAt: 5,
    tier: 1,
    flavorText: "Nothing is truly wasted. Every battlefield, every market, every ruin holds treasures for those who know where to look.",
    effects: [
      { system: "all", type: "passive", target: "bonus_material_chance", value: 0.10, label: "10% chance for bonus materials" },
    ],
  },

  /* ─── TIER 2: Level 10 ─── */
  {
    key: "elemental_mastery",
    name: "Elemental Mastery",
    description: "Element affinity bonus doubled in all game systems.",
    icon: "Flame",
    color: "#ef4444",
    availableAt: 10,
    tier: 2,
    flavorText: "You have transcended mere affinity. The element doesn't just respond to you — it obeys.",
    effects: [
      { system: "all", type: "multiplier", target: "element_affinity", value: 2.0, label: "Element affinity bonus doubled" },
    ],
  },
  {
    key: "war_veteran",
    name: "War Veteran",
    description: "Guild war contributions count double; territory bonuses +25%.",
    icon: "Shield",
    color: "#dc2626",
    availableAt: 10,
    tier: 2,
    flavorText: "You've fought in more wars than most soldiers have heard of. Every scar is a lesson learned.",
    effects: [
      { system: "guild_war", type: "multiplier", target: "war_contribution", value: 2.0, label: "Guild war contributions doubled" },
      { system: "guild_war", type: "multiplier", target: "territory_bonus", value: 1.25, label: "+25% territory bonuses" },
    ],
  },
  {
    key: "card_collector",
    name: "Card Collector",
    description: "Card drop rates +15%; disenchant yields +25%.",
    icon: "Layers",
    color: "#8b5cf6",
    availableAt: 10,
    tier: 2,
    flavorText: "Every card tells a story. You've made it your life's work to collect them all.",
    effects: [
      { system: "card_game", type: "multiplier", target: "card_drop_rate", value: 1.15, label: "+15% card drop rates" },
      { system: "card_game", type: "multiplier", target: "disenchant_yield", value: 1.25, label: "+25% disenchant yields" },
    ],
  },
  {
    key: "dual_nature",
    name: "Dual Nature",
    description: "Gain 50% of the opposite alignment's bonuses.",
    icon: "Blend",
    color: "#6366f1",
    availableAt: 10,
    tier: 2,
    flavorText: "Order and Chaos are not opposites — they are partners in an eternal dance. You've learned to hear both melodies.",
    effects: [
      { system: "all", type: "passive", target: "opposite_alignment_bonus", value: 0.50, label: "50% of opposite alignment bonuses" },
    ],
  },
  {
    key: "merchant_prince",
    name: "Merchant Prince",
    description: "All trade profits +20%; colony income +15%.",
    icon: "Coins",
    color: "#f59e0b",
    availableAt: 10,
    tier: 2,
    flavorText: "Credits flow to you like rivers to the sea. Every transaction is an opportunity, and you never miss one.",
    effects: [
      { system: "trade_empire", type: "multiplier", target: "trade_profit", value: 1.20, label: "+20% trade profits" },
      { system: "trade_empire", type: "multiplier", target: "colony_income", value: 1.15, label: "+15% colony income" },
    ],
  },

  /* ─── TIER 3: Level 15 ─── */
  {
    key: "lone_wolf",
    name: "Lone Wolf",
    description: "All bonuses +30% when not in a guild. Solo play becomes viable at endgame.",
    icon: "Moon",
    color: "#475569",
    availableAt: 15,
    tier: 3,
    flavorText: "You walk alone, but you walk with the strength of ten. The pack slows you down.",
    effects: [
      { system: "all", type: "multiplier", target: "solo_bonus", value: 1.30, label: "+30% all bonuses when guildless" },
    ],
  },
  {
    key: "companion_bond",
    name: "Companion Bond",
    description: "Companion relationship gains +50%; companion quest rewards doubled.",
    icon: "Heart",
    color: "#ec4899",
    availableAt: 15,
    tier: 3,
    flavorText: "The bonds you forge are unbreakable. Your companions would follow you into the void itself.",
    effects: [
      { system: "quest", type: "multiplier", target: "companion_relationship_gain", value: 1.50, label: "+50% companion relationship gains" },
      { system: "quest", type: "multiplier", target: "companion_quest_reward", value: 2.0, label: "Companion quest rewards doubled" },
    ],
  },
  {
    key: "grandmasters_focus",
    name: "Grandmaster's Focus",
    description: "Class mastery XP gains +40%. Accelerate your path to Grandmaster.",
    icon: "Target",
    color: "#7c3aed",
    availableAt: 15,
    tier: 3,
    flavorText: "Mastery is not a destination — it is a discipline. You have dedicated yourself to perfection.",
    effects: [
      { system: "all", type: "multiplier", target: "class_mastery_xp", value: 1.40, label: "+40% class mastery XP" },
    ],
  },
  {
    key: "battle_hardened",
    name: "Battle Hardened",
    description: "Start all fights with a damage shield absorbing 15% of max HP. +10% damage after taking a hit.",
    icon: "Swords",
    color: "#b91c1c",
    availableAt: 15,
    tier: 3,
    flavorText: "Pain is just information. And you've learned to use every piece of data at your disposal.",
    effects: [
      { system: "fight", type: "passive", target: "damage_shield_percent", value: 0.15, label: "Start with 15% HP damage shield" },
      { system: "fight", type: "passive", target: "revenge_damage_bonus", value: 0.10, label: "+10% damage after taking a hit" },
    ],
  },

  /* ─── TIER 4: Level 20 (Capstone) ─── */
  {
    key: "transcendence",
    name: "Transcendence",
    description: "All game system bonuses +15%. Your character has reached a state beyond mortal limits.",
    icon: "Crown",
    color: "#fbbf24",
    availableAt: 20,
    tier: 4,
    flavorText: "You have touched the edge of something greater. The Panopticon itself takes notice.",
    effects: [
      { system: "all", type: "multiplier", target: "global_bonus", value: 1.15, label: "+15% all game system bonuses" },
    ],
  },
  {
    key: "architects_will",
    name: "Architect's Will",
    description: "Once per day: choose any single game outcome. The universe bends to your design.",
    icon: "Wand2",
    color: "#d946ef",
    availableAt: 20,
    tier: 4,
    flavorText: "Reality is merely a suggestion to those with sufficient will. The Architect would be proud.",
    effects: [
      { system: "all", type: "passive", target: "daily_outcome_override", value: 1, label: "Once per day: choose any single game outcome" },
    ],
  },
  {
    key: "dreamers_gift",
    name: "Dreamer's Gift",
    description: "Dream token gains +50% from all sources. Unlock the Dream Forge crafting station.",
    icon: "Sparkles",
    color: "#a78bfa",
    availableAt: 20,
    tier: 4,
    flavorText: "The Dreamer whispers in your sleep. Each night, you wake with more power than the day before.",
    effects: [
      { system: "all", type: "multiplier", target: "dream_token_gain", value: 1.50, label: "+50% Dream token gains" },
      { system: "crafting", type: "unlock", target: "dream_forge", value: 1, label: "Unlock Dream Forge crafting station" },
    ],
  },
  {
    key: "nexus_walker",
    name: "Nexus Walker",
    description: "Gain access to all class rank 1 perks regardless of your class. The boundaries between disciplines dissolve.",
    icon: "Orbit",
    color: "#06b6d4",
    availableAt: 20,
    tier: 4,
    flavorText: "You have walked every path. Now you walk them all at once.",
    effects: [
      { system: "all", type: "unlock", target: "all_class_rank1_perks", value: 1, label: "Access all class rank 1 perks" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Get talents available at a specific milestone level.
 */
export function getTalentsAtMilestone(milestone: TalentMilestone): CitizenTalent[] {
  return CITIZEN_TALENTS.filter(t => t.availableAt === milestone);
}

/**
 * Get all talents available up to a given citizen level.
 */
export function getAvailableTalents(citizenLevel: number): { milestone: TalentMilestone; talents: CitizenTalent[] }[] {
  return TALENT_MILESTONES
    .filter(m => citizenLevel >= m)
    .map(m => ({ milestone: m, talents: getTalentsAtMilestone(m) }));
}

/**
 * Get how many talent slots a citizen has unlocked.
 */
export function getTalentSlots(citizenLevel: number): number {
  return TALENT_MILESTONES.filter(m => citizenLevel >= m).length;
}

/**
 * Check if a talent can be selected by a citizen.
 */
export function canSelectTalent(
  talent: CitizenTalent,
  citizenLevel: number,
  characterClass?: string,
  species?: string
): boolean {
  if (citizenLevel < talent.availableAt) return false;
  if (talent.classRestriction && talent.classRestriction !== characterClass) return false;
  if (talent.speciesRestriction && talent.speciesRestriction !== species) return false;
  return true;
}

/**
 * Resolve all talent effects for a specific game system.
 */
export function resolveTalentEffects(
  selectedTalentKeys: string[],
  system: TalentEffect["system"]
): TalentEffect[] {
  const effects: TalentEffect[] = [];
  
  for (const key of selectedTalentKeys) {
    const talent = CITIZEN_TALENTS.find(t => t.key === key);
    if (!talent) continue;
    
    for (const effect of talent.effects) {
      if (effect.system === system || effect.system === "all") {
        effects.push(effect);
      }
    }
  }
  
  return effects;
}

/**
 * Get aggregated talent effect for a specific target.
 */
export function getAggregatedTalentEffect(
  selectedTalentKeys: string[],
  system: TalentEffect["system"],
  target: string
): { value: number; type: TalentEffect["type"] } {
  const effects = resolveTalentEffects(selectedTalentKeys, system).filter(e => e.target === target);
  
  if (effects.length === 0) return { value: 0, type: "flat" };
  
  const type = effects[0].type;
  if (type === "multiplier") {
    return { value: effects.reduce((acc, e) => acc * e.value, 1), type };
  }
  return { value: effects.reduce((acc, e) => acc + e.value, 0), type };
}

/**
 * Get the next milestone level where a talent can be selected.
 */
export function getNextTalentMilestone(citizenLevel: number): TalentMilestone | null {
  return TALENT_MILESTONES.find(m => citizenLevel < m) || null;
}
