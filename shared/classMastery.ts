/**
 * CLASS MASTERY PROGRESSION ENGINE
 * ─────────────────────────────────
 * Each class has 5 mastery ranks (Initiate → Grandmaster).
 * Players earn class XP by performing class-aligned actions.
 * Each rank unlocks a unique perk that stacks with trait bonuses.
 *
 * Design philosophy:
 * - Rank 1-2: Accessible early, small but noticeable bonuses
 * - Rank 3: Mid-game milestone, meaningful specialization
 * - Rank 4: Late-game power spike, changes playstyle
 * - Rank 5: Grandmaster — signature ability, aspirational goal
 */

/* ═══════════════════════════════════════════════════════
   XP THRESHOLDS — Exponential scaling
   ═══════════════════════════════════════════════════════ */

export const MASTERY_RANKS = [
  { rank: 0, title: "Unranked",     xpRequired: 0,     color: "#6b7280" },
  { rank: 1, title: "Initiate",     xpRequired: 100,   color: "#22d3ee" },
  { rank: 2, title: "Adept",        xpRequired: 500,   color: "#34d399" },
  { rank: 3, title: "Specialist",   xpRequired: 2000,  color: "#a78bfa" },
  { rank: 4, title: "Master",       xpRequired: 8000,  color: "#f59e0b" },
  { rank: 5, title: "Grandmaster",  xpRequired: 25000, color: "#ef4444" },
] as const;

export type MasteryRank = 0 | 1 | 2 | 3 | 4 | 5;
export type CharacterClass = "spy" | "oracle" | "assassin" | "engineer" | "soldier";

/* ═══════════════════════════════════════════════════════
   PERK DEFINITIONS — Unique perks per class per rank
   ═══════════════════════════════════════════════════════ */

export interface MasteryPerk {
  key: string;
  name: string;
  description: string;
  rank: MasteryRank;
  /** Mechanical effect — used by game systems to apply bonuses */
  effect: {
    type: "multiplier" | "flat" | "unlock" | "passive";
    target: string;
    value: number;
  };
}

export const CLASS_PERKS: Record<CharacterClass, MasteryPerk[]> = {
  /* ─── ENGINEER ─── */
  engineer: [
    {
      key: "eng_efficient_forge",
      name: "Efficient Forge",
      description: "Crafting material costs reduced by 15%",
      rank: 1,
      effect: { type: "multiplier", target: "crafting_material_cost", value: 0.85 },
    },
    {
      key: "eng_overcharge",
      name: "Overcharge Protocols",
      description: "Colony production output +20%",
      rank: 2,
      effect: { type: "multiplier", target: "colony_production", value: 1.20 },
    },
    {
      key: "eng_salvage_master",
      name: "Salvage Master",
      description: "25% chance to recover materials on failed crafts",
      rank: 3,
      effect: { type: "passive", target: "craft_fail_salvage", value: 0.25 },
    },
    {
      key: "eng_auto_repair",
      name: "Auto-Repair Systems",
      description: "Ships auto-repair 10% hull damage after each trade run",
      rank: 4,
      effect: { type: "passive", target: "ship_auto_repair", value: 0.10 },
    },
    {
      key: "eng_masterwork",
      name: "Masterwork",
      description: "10% chance to craft items at +1 rarity tier",
      rank: 5,
      effect: { type: "passive", target: "craft_rarity_upgrade", value: 0.10 },
    },
  ],

  /* ─── ORACLE ─── */
  oracle: [
    {
      key: "orc_foresight",
      name: "Foresight",
      description: "Quest reward preview — see exact rewards before accepting",
      rank: 1,
      effect: { type: "unlock", target: "quest_reward_preview", value: 1 },
    },
    {
      key: "orc_card_insight",
      name: "Card Insight",
      description: "See top card of opponent's deck in card battles",
      rank: 2,
      effect: { type: "unlock", target: "card_peek_opponent", value: 1 },
    },
    {
      key: "orc_temporal_echo",
      name: "Temporal Echo",
      description: "Chess undo — take back 1 move per game",
      rank: 3,
      effect: { type: "flat", target: "chess_undo_count", value: 1 },
    },
    {
      key: "orc_prophecy",
      name: "Prophecy",
      description: "Battle Pass XP earned +30%",
      rank: 4,
      effect: { type: "multiplier", target: "battlepass_xp", value: 1.30 },
    },
    {
      key: "orc_omniscience",
      name: "Omniscience",
      description: "All quest rewards +25% and daily quest slots +1",
      rank: 5,
      effect: { type: "multiplier", target: "quest_rewards", value: 1.25 },
    },
  ],

  /* ─── ASSASSIN ─── */
  assassin: [
    {
      key: "ass_first_blood",
      name: "First Blood",
      description: "First attack in fights deals +20% damage",
      rank: 1,
      effect: { type: "multiplier", target: "fight_first_strike", value: 1.20 },
    },
    {
      key: "ass_shadow_step",
      name: "Shadow Step",
      description: "15% dodge chance in PvP card battles",
      rank: 2,
      effect: { type: "passive", target: "pvp_dodge_chance", value: 0.15 },
    },
    {
      key: "ass_critical_mastery",
      name: "Critical Mastery",
      description: "Critical hit damage increased from 1.5x to 2x",
      rank: 3,
      effect: { type: "multiplier", target: "crit_damage", value: 2.0 },
    },
    {
      key: "ass_mark_of_death",
      name: "Mark of Death",
      description: "Marked targets take +15% damage from all sources for 3 turns",
      rank: 4,
      effect: { type: "passive", target: "mark_target_debuff", value: 0.15 },
    },
    {
      key: "ass_phantom_strike",
      name: "Phantom Strike",
      description: "Once per fight: guaranteed critical hit that ignores armor",
      rank: 5,
      effect: { type: "flat", target: "guaranteed_crit_count", value: 1 },
    },
  ],

  /* ─── SOLDIER ─── */
  soldier: [
    {
      key: "sol_fortify",
      name: "Fortify",
      description: "Max HP +15% in all combat modes",
      rank: 1,
      effect: { type: "multiplier", target: "max_hp", value: 1.15 },
    },
    {
      key: "sol_war_cry",
      name: "War Cry",
      description: "Guild war contributions +25%",
      rank: 2,
      effect: { type: "multiplier", target: "guild_war_points", value: 1.25 },
    },
    {
      key: "sol_iron_will",
      name: "Iron Will",
      description: "Survive one lethal hit with 1 HP (once per fight)",
      rank: 3,
      effect: { type: "flat", target: "death_save_count", value: 1 },
    },
    {
      key: "sol_siege_breaker",
      name: "Siege Breaker",
      description: "Territory capture speed +30%, defense structures take -20% damage",
      rank: 4,
      effect: { type: "multiplier", target: "territory_capture", value: 1.30 },
    },
    {
      key: "sol_unbreakable",
      name: "Unbreakable",
      description: "Armor effectiveness doubled, reflect 10% of blocked damage",
      rank: 5,
      effect: { type: "multiplier", target: "armor_effectiveness", value: 2.0 },
    },
  ],

  /* ─── SPY ─── */
  spy: [
    {
      key: "spy_market_intel",
      name: "Market Intel",
      description: "See 24h price history for all marketplace items",
      rank: 1,
      effect: { type: "unlock", target: "market_price_history", value: 1 },
    },
    {
      key: "spy_double_agent",
      name: "Double Agent",
      description: "Sabotage effectiveness in guild wars +30%",
      rank: 2,
      effect: { type: "multiplier", target: "sabotage_power", value: 1.30 },
    },
    {
      key: "spy_information_broker",
      name: "Information Broker",
      description: "Marketplace tax reduced by additional 10%",
      rank: 3,
      effect: { type: "multiplier", target: "market_tax", value: 0.90 },
    },
    {
      key: "spy_covert_ops",
      name: "Covert Operations",
      description: "War map contributions hidden from enemy guilds",
      rank: 4,
      effect: { type: "unlock", target: "hidden_war_contributions", value: 1 },
    },
    {
      key: "spy_mastermind",
      name: "Mastermind",
      description: "Once per day: steal 5% of a random opponent's trade profits",
      rank: 5,
      effect: { type: "passive", target: "profit_steal", value: 0.05 },
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   XP EARNING RATES — Class-aligned actions earn more XP
   ═══════════════════════════════════════════════════════ */

export interface ClassXpAction {
  action: string;
  label: string;
  baseXp: number;
  /** Classes that earn bonus XP for this action (2x) */
  alignedClasses: CharacterClass[];
}

export const CLASS_XP_ACTIONS: ClassXpAction[] = [
  // Combat actions
  { action: "win_fight",        label: "Win a fight",              baseXp: 10, alignedClasses: ["soldier", "assassin"] },
  { action: "win_pvp",          label: "Win a PvP match",          baseXp: 20, alignedClasses: ["soldier", "assassin"] },
  { action: "critical_hit",     label: "Land a critical hit",      baseXp: 5,  alignedClasses: ["assassin"] },
  { action: "survive_low_hp",   label: "Survive below 20% HP",     baseXp: 8,  alignedClasses: ["soldier"] },

  // Card battles
  { action: "win_card_battle",  label: "Win a card battle",        baseXp: 10, alignedClasses: ["oracle", "assassin"] },
  { action: "play_element_card",label: "Play element-aligned card",baseXp: 3,  alignedClasses: ["oracle"] },

  // Chess
  { action: "win_chess",        label: "Win a chess game",         baseXp: 15, alignedClasses: ["oracle", "spy"] },
  { action: "chess_checkmate",  label: "Win by checkmate",         baseXp: 10, alignedClasses: ["oracle"] },

  // Trade & Economy
  { action: "complete_trade",   label: "Complete a trade run",     baseXp: 8,  alignedClasses: ["spy", "engineer"] },
  { action: "profit_trade",     label: "Earn 1000+ credits",       baseXp: 12, alignedClasses: ["spy"] },
  { action: "marketplace_sell", label: "Sell on marketplace",      baseXp: 5,  alignedClasses: ["spy"] },

  // Crafting
  { action: "craft_item",       label: "Craft an item",            baseXp: 10, alignedClasses: ["engineer"] },
  { action: "craft_rare",       label: "Craft a rare+ item",       baseXp: 25, alignedClasses: ["engineer"] },

  // Guild Wars
  { action: "guild_war_contribute", label: "Contribute to guild war", baseXp: 8,  alignedClasses: ["soldier", "spy"] },
  { action: "capture_territory",    label: "Capture a territory",     baseXp: 20, alignedClasses: ["soldier"] },
  { action: "sabotage_territory",   label: "Sabotage enemy territory",baseXp: 15, alignedClasses: ["spy", "assassin"] },

  // Exploration & Quests
  { action: "complete_quest",   label: "Complete a quest",         baseXp: 8,  alignedClasses: ["oracle"] },
  { action: "discover_entity",  label: "Discover a Loredex entry", baseXp: 5,  alignedClasses: ["oracle", "spy"] },
];

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/** Calculate mastery rank from total XP */
export function getMasteryRank(classXp: number): MasteryRank {
  for (let i = MASTERY_RANKS.length - 1; i >= 0; i--) {
    if (classXp >= MASTERY_RANKS[i].xpRequired) {
      return MASTERY_RANKS[i].rank as MasteryRank;
    }
  }
  return 0;
}

/** Get rank info for a given rank */
export function getRankInfo(rank: MasteryRank) {
  return MASTERY_RANKS[rank];
}

/** Get XP needed for next rank */
export function getXpToNextRank(classXp: number): { current: number; next: number; remaining: number; progress: number } {
  const currentRank = getMasteryRank(classXp);
  if (currentRank >= 5) {
    return { current: classXp, next: MASTERY_RANKS[5].xpRequired, remaining: 0, progress: 1 };
  }
  const nextThreshold = MASTERY_RANKS[currentRank + 1].xpRequired;
  const currentThreshold = MASTERY_RANKS[currentRank].xpRequired;
  const rangeXp = nextThreshold - currentThreshold;
  const progressXp = classXp - currentThreshold;
  return {
    current: classXp,
    next: nextThreshold,
    remaining: nextThreshold - classXp,
    progress: rangeXp > 0 ? progressXp / rangeXp : 0,
  };
}

/** Get all unlocked perks for a class at a given rank */
export function getUnlockedPerks(characterClass: CharacterClass, rank: MasteryRank): MasteryPerk[] {
  const perks = CLASS_PERKS[characterClass] || [];
  return perks.filter(p => p.rank <= rank);
}

/** Get the next perk to unlock */
export function getNextPerk(characterClass: CharacterClass, rank: MasteryRank): MasteryPerk | null {
  const perks = CLASS_PERKS[characterClass] || [];
  return perks.find(p => p.rank === rank + 1) || null;
}

/** Calculate XP earned for an action, considering class alignment */
export function calculateClassXp(action: string, characterClass: CharacterClass): number {
  const xpAction = CLASS_XP_ACTIONS.find(a => a.action === action);
  if (!xpAction) return 0;
  const isAligned = xpAction.alignedClasses.includes(characterClass);
  return isAligned ? xpAction.baseXp * 2 : xpAction.baseXp;
}

/** Get a perk's effect value if unlocked, or default */
export function getPerkEffect(
  characterClass: CharacterClass,
  rank: MasteryRank,
  perkKey: string,
  defaultValue: number = 0
): number {
  const perks = getUnlockedPerks(characterClass, rank);
  const perk = perks.find(p => p.key === perkKey);
  return perk ? perk.effect.value : defaultValue;
}

/** Check if a specific perk is unlocked */
export function hasPerk(characterClass: CharacterClass, rank: MasteryRank, perkKey: string): boolean {
  const perks = getUnlockedPerks(characterClass, rank);
  return perks.some(p => p.key === perkKey);
}
