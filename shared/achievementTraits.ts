/**
 * ACHIEVEMENT-UNLOCKED TRAITS (Recommendation 4.8)
 * ────────────────────────────────────────────────
 * Inspired by Elder Scrolls standing stones, Hades Mirror of Night,
 * and Disco Elysium Thought Cabinet.
 * Traits are permanently unlocked by completing specific achievements.
 * Each trait provides a passive bonus and a cosmetic title.
 *
 * Design philosophy:
 * - Traits reward exploration and mastery of specific game systems
 * - Each trait tells a story about what the player has accomplished
 * - Traits are permanent once unlocked — they define your character's history
 * - Players can equip up to 3 active traits at a time (slots unlock at levels 5, 10, 20)
 * - Traits have tiers: Bronze (common), Silver (rare), Gold (epic), Diamond (legendary)
 */

/* ═══════════════════════════════════════════════════════
   TRAIT TYPES
   ═══════════════════════════════════════════════════════ */

export type TraitTier = "bronze" | "silver" | "gold" | "diamond";

export interface AchievementTrait {
  /** Unique key */
  key: string;
  /** Display name */
  name: string;
  /** Cosmetic title granted (displayed on profile) */
  title: string;
  /** Description of the trait effect */
  description: string;
  /** Icon identifier (lucide icon name) */
  icon: string;
  /** Tier determines rarity and power */
  tier: TraitTier;
  /** Color hex for UI */
  color: string;
  /** Achievement that unlocks this trait */
  achievement: TraitAchievement;
  /** Passive effects when equipped */
  effects: TraitEffect[];
  /** Flavor text — lore explanation */
  flavorText: string;
}

export interface TraitAchievement {
  /** Achievement key for tracking */
  key: string;
  /** Human-readable description of what to do */
  description: string;
  /** Category of achievement */
  category: "combat" | "exploration" | "trade" | "social" | "mastery" | "lore" | "special";
  /** Numeric target (e.g., win 100 fights) */
  target: number;
  /** What to count */
  counter: string;
}

export interface TraitEffect {
  system: "card_game" | "trade_empire" | "fight" | "chess" | "guild_war" | "quest" | "market" | "crafting" | "all";
  type: "multiplier" | "flat" | "passive" | "unlock";
  target: string;
  value: number;
  label: string;
}

/* ═══════════════════════════════════════════════════════
   TRAIT SLOT SYSTEM
   ═══════════════════════════════════════════════════════ */

export const TRAIT_SLOT_UNLOCKS = [
  { slot: 1, level: 5 },
  { slot: 2, level: 10 },
  { slot: 3, level: 20 },
] as const;

export const MAX_TRAIT_SLOTS = 3;

export function getTraitSlots(citizenLevel: number): number {
  return TRAIT_SLOT_UNLOCKS.filter(s => citizenLevel >= s.level).length;
}

/* ═══════════════════════════════════════════════════════
   TIER COLORS & INFO
   ═══════════════════════════════════════════════════════ */

export const TRAIT_TIER_INFO: Record<TraitTier, { name: string; color: string; bgColor: string; borderColor: string }> = {
  bronze: { name: "Bronze", color: "#cd7f32", bgColor: "rgba(205, 127, 50, 0.1)", borderColor: "rgba(205, 127, 50, 0.3)" },
  silver: { name: "Silver", color: "#c0c0c0", bgColor: "rgba(192, 192, 192, 0.1)", borderColor: "rgba(192, 192, 192, 0.3)" },
  gold: { name: "Gold", color: "#ffd700", bgColor: "rgba(255, 215, 0, 0.1)", borderColor: "rgba(255, 215, 0, 0.3)" },
  diamond: { name: "Diamond", color: "#b9f2ff", bgColor: "rgba(185, 242, 255, 0.1)", borderColor: "rgba(185, 242, 255, 0.3)" },
};

/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT TRAIT DEFINITIONS
   ═══════════════════════════════════════════════════════ */

export const ACHIEVEMENT_TRAITS: AchievementTrait[] = [
  /* ─── BRONZE TIER — Common achievements ─── */
  {
    key: "first_blood",
    name: "First Blood",
    title: "Blooded",
    description: "+5% damage in all fights.",
    icon: "Swords",
    tier: "bronze",
    color: "#cd7f32",
    achievement: { key: "win_first_fight", description: "Win your first fight", category: "combat", target: 1, counter: "fights_won" },
    effects: [{ system: "fight", type: "multiplier", target: "damage_bonus", value: 1.05, label: "+5% fight damage" }],
    flavorText: "Every warrior remembers their first victory. The taste of it never fades.",
  },
  {
    key: "merchant_initiate",
    name: "Merchant Initiate",
    title: "Trader",
    description: "+5% trade profits.",
    icon: "Coins",
    tier: "bronze",
    color: "#cd7f32",
    achievement: { key: "complete_10_trades", description: "Complete 10 trade runs", category: "trade", target: 10, counter: "trades_completed" },
    effects: [{ system: "trade_empire", type: "multiplier", target: "trade_profit", value: 1.05, label: "+5% trade profits" }],
    flavorText: "The first step on the road to fortune is learning that everything has a price.",
  },
  {
    key: "lore_seeker",
    name: "Lore Seeker",
    title: "Scholar",
    description: "+5% Dream token gains.",
    icon: "BookOpen",
    tier: "bronze",
    color: "#cd7f32",
    achievement: { key: "discover_25_entries", description: "Discover 25 Loredex entries", category: "lore", target: 25, counter: "entries_discovered" },
    effects: [{ system: "all", type: "multiplier", target: "dream_token_gain", value: 1.05, label: "+5% Dream token gains" }],
    flavorText: "Knowledge is the currency of the cosmos. You've begun to accumulate wealth.",
  },
  {
    key: "card_apprentice",
    name: "Card Apprentice",
    title: "Duelist",
    description: "+3 starting HP in card battles.",
    icon: "Layers",
    tier: "bronze",
    color: "#cd7f32",
    achievement: { key: "win_10_card_battles", description: "Win 10 card battles", category: "combat", target: 10, counter: "card_battles_won" },
    effects: [{ system: "card_game", type: "flat", target: "starting_hp", value: 3, label: "+3 starting HP" }],
    flavorText: "The cards speak to those who listen. You're beginning to hear their whispers.",
  },
  {
    key: "guild_recruit",
    name: "Guild Recruit",
    title: "Recruit",
    description: "+5% guild war contributions.",
    icon: "Users",
    tier: "bronze",
    color: "#cd7f32",
    achievement: { key: "join_guild_war", description: "Participate in 5 guild wars", category: "social", target: 5, counter: "guild_wars_participated" },
    effects: [{ system: "guild_war", type: "multiplier", target: "war_contribution", value: 1.05, label: "+5% war contributions" }],
    flavorText: "You've stood beside your guild in battle. That bond is forged in fire.",
  },

  /* ─── SILVER TIER — Moderate achievements ─── */
  {
    key: "centurion",
    name: "Centurion",
    title: "Centurion",
    description: "+10% fight damage, +5% HP.",
    icon: "Shield",
    tier: "silver",
    color: "#c0c0c0",
    achievement: { key: "win_100_fights", description: "Win 100 fights", category: "combat", target: 100, counter: "fights_won" },
    effects: [
      { system: "fight", type: "multiplier", target: "damage_bonus", value: 1.10, label: "+10% fight damage" },
      { system: "fight", type: "multiplier", target: "max_hp", value: 1.05, label: "+5% max HP" },
    ],
    flavorText: "A hundred victories. A hundred lessons. Each one carved into your soul.",
  },
  {
    key: "trade_baron",
    name: "Trade Baron",
    title: "Baron",
    description: "+10% trade profits, -5% marketplace tax.",
    icon: "TrendingUp",
    tier: "silver",
    color: "#c0c0c0",
    achievement: { key: "earn_100k_credits", description: "Earn 100,000 credits from trading", category: "trade", target: 100000, counter: "credits_earned_trading" },
    effects: [
      { system: "trade_empire", type: "multiplier", target: "trade_profit", value: 1.10, label: "+10% trade profits" },
      { system: "market", type: "multiplier", target: "tax_reduction", value: 0.95, label: "5% tax reduction" },
    ],
    flavorText: "Money talks. Yours speaks in volumes.",
  },
  {
    key: "chess_strategist",
    name: "Chess Strategist",
    title: "Strategist",
    description: "+15s chess time, +1 undo per game.",
    icon: "Brain",
    tier: "silver",
    color: "#c0c0c0",
    achievement: { key: "win_50_chess", description: "Win 50 chess games", category: "mastery", target: 50, counter: "chess_wins" },
    effects: [
      { system: "chess", type: "flat", target: "time_bonus", value: 15, label: "+15s chess time" },
      { system: "chess", type: "flat", target: "undo_moves", value: 1, label: "+1 chess undo" },
    ],
    flavorText: "The board is your battlefield. Every piece, a soldier under your command.",
  },
  {
    key: "lore_master",
    name: "Lore Master",
    title: "Sage",
    description: "+10% Dream tokens, +10% quest rewards.",
    icon: "BookMarked",
    tier: "silver",
    color: "#c0c0c0",
    achievement: { key: "discover_100_entries", description: "Discover 100 Loredex entries", category: "lore", target: 100, counter: "entries_discovered" },
    effects: [
      { system: "all", type: "multiplier", target: "dream_token_gain", value: 1.10, label: "+10% Dream tokens" },
      { system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.10, label: "+10% quest rewards" },
    ],
    flavorText: "You have read the stories of a hundred worlds. Their wisdom lives in you now.",
  },
  {
    key: "craft_master",
    name: "Master Crafter",
    title: "Artisan",
    description: "+10% craft success, -10% material costs.",
    icon: "Hammer",
    tier: "silver",
    color: "#c0c0c0",
    achievement: { key: "craft_100_items", description: "Craft 100 items", category: "mastery", target: 100, counter: "items_crafted" },
    effects: [
      { system: "crafting", type: "multiplier", target: "craft_success", value: 1.10, label: "+10% craft success" },
      { system: "crafting", type: "multiplier", target: "material_cost", value: 0.90, label: "10% material cost reduction" },
    ],
    flavorText: "Your hands know the shape of creation. Every material sings under your touch.",
  },

  /* ─── GOLD TIER — Difficult achievements ─── */
  {
    key: "warlord_supreme",
    name: "Warlord Supreme",
    title: "Warlord",
    description: "+15% fight damage, +10% guild war contributions, +10% territory capture speed.",
    icon: "Crown",
    tier: "gold",
    color: "#ffd700",
    achievement: { key: "win_500_fights", description: "Win 500 fights", category: "combat", target: 500, counter: "fights_won" },
    effects: [
      { system: "fight", type: "multiplier", target: "damage_bonus", value: 1.15, label: "+15% fight damage" },
      { system: "guild_war", type: "multiplier", target: "war_contribution", value: 1.10, label: "+10% war contributions" },
      { system: "guild_war", type: "multiplier", target: "territory_capture", value: 1.10, label: "+10% capture speed" },
    ],
    flavorText: "Five hundred souls have fallen before you. The battlefield knows your name.",
  },
  {
    key: "trade_emperor",
    name: "Trade Emperor",
    title: "Emperor",
    description: "+20% trade profits, marketplace tax reduced by 10%, colony income +10%.",
    icon: "Gem",
    tier: "gold",
    color: "#ffd700",
    achievement: { key: "earn_1m_credits", description: "Earn 1,000,000 credits from trading", category: "trade", target: 1000000, counter: "credits_earned_trading" },
    effects: [
      { system: "trade_empire", type: "multiplier", target: "trade_profit", value: 1.20, label: "+20% trade profits" },
      { system: "market", type: "multiplier", target: "tax_reduction", value: 0.90, label: "10% tax reduction" },
      { system: "trade_empire", type: "multiplier", target: "colony_income", value: 1.10, label: "+10% colony income" },
    ],
    flavorText: "A million credits. An empire built on cunning, patience, and the willingness to take risks others won't.",
  },
  {
    key: "saga_keeper",
    name: "Saga Keeper",
    title: "Keeper of the Saga",
    description: "+15% Dream tokens, +15% all XP, reveal hidden lore connections.",
    icon: "Sparkles",
    tier: "gold",
    color: "#ffd700",
    achievement: { key: "discover_all_entries", description: "Discover all Loredex entries", category: "lore", target: 999, counter: "entries_discovered" },
    effects: [
      { system: "all", type: "multiplier", target: "dream_token_gain", value: 1.15, label: "+15% Dream tokens" },
      { system: "all", type: "multiplier", target: "xp_bonus", value: 1.15, label: "+15% all XP" },
      { system: "all", type: "unlock", target: "hidden_lore_connections", value: 1, label: "Reveal hidden lore connections" },
    ],
    flavorText: "You have read every page of the Dischordian Saga. Its secrets are yours to keep.",
  },
  {
    key: "grandmaster_chess",
    name: "Grandmaster",
    title: "Grandmaster",
    description: "+30s chess time, +2 undos, preview opponent's next move.",
    icon: "Target",
    tier: "gold",
    color: "#ffd700",
    achievement: { key: "win_200_chess", description: "Win 200 chess games", category: "mastery", target: 200, counter: "chess_wins" },
    effects: [
      { system: "chess", type: "flat", target: "time_bonus", value: 30, label: "+30s chess time" },
      { system: "chess", type: "flat", target: "undo_moves", value: 2, label: "+2 chess undos" },
      { system: "chess", type: "unlock", target: "preview_opponent_move", value: 1, label: "Preview opponent's next move" },
    ],
    flavorText: "The board is a mirror. In it, you see not just the game — but the player.",
  },
  {
    key: "guild_champion",
    name: "Guild Champion",
    title: "Champion",
    description: "+15% all guild war bonuses, allies near you gain +5% ATK.",
    icon: "Flag",
    tier: "gold",
    color: "#ffd700",
    achievement: { key: "capture_50_territories", description: "Capture 50 territories in guild wars", category: "social", target: 50, counter: "territories_captured" },
    effects: [
      { system: "guild_war", type: "multiplier", target: "all_war_bonuses", value: 1.15, label: "+15% all guild war bonuses" },
      { system: "guild_war", type: "passive", target: "ally_atk_aura", value: 0.05, label: "Nearby allies +5% ATK" },
    ],
    flavorText: "Fifty territories bear your mark. Your guild's banner flies because of you.",
  },

  /* ─── DIAMOND TIER — Legendary achievements ─── */
  {
    key: "legend_of_dischord",
    name: "Legend of Dischord",
    title: "Legend",
    description: "+10% all bonuses across every game system.",
    icon: "Crown",
    tier: "diamond",
    color: "#b9f2ff",
    achievement: { key: "reach_level_25", description: "Reach citizen level 25", category: "mastery", target: 25, counter: "citizen_level" },
    effects: [
      { system: "all", type: "multiplier", target: "global_bonus", value: 1.10, label: "+10% all bonuses" },
    ],
    flavorText: "Your name echoes across the stars. The Dischordian Saga will remember you.",
  },
  {
    key: "master_of_all",
    name: "Master of All",
    title: "Polymath",
    description: "Access rank 1 perks of all classes. +5% to every game system.",
    icon: "Orbit",
    tier: "diamond",
    color: "#b9f2ff",
    achievement: { key: "all_classes_rank3", description: "Reach mastery rank 3 in all 5 classes", category: "mastery", target: 5, counter: "classes_at_rank3" },
    effects: [
      { system: "all", type: "unlock", target: "all_class_rank1_perks", value: 1, label: "Access all class rank 1 perks" },
      { system: "all", type: "multiplier", target: "global_bonus", value: 1.05, label: "+5% all bonuses" },
    ],
    flavorText: "You have mastered every discipline. The boundaries between classes dissolve in your presence.",
  },
  {
    key: "the_dreamer_chosen",
    name: "The Dreamer's Chosen",
    title: "Dreamer's Chosen",
    description: "+25% Dream tokens, +20% quest rewards, unlock Dreamer's exclusive quest line.",
    icon: "Sparkles",
    tier: "diamond",
    color: "#b9f2ff",
    achievement: { key: "max_humanity", description: "Reach maximum Humanity morality", category: "special", target: 100, counter: "humanity_morality" },
    effects: [
      { system: "all", type: "multiplier", target: "dream_token_gain", value: 1.25, label: "+25% Dream tokens" },
      { system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.20, label: "+20% quest rewards" },
      { system: "quest", type: "unlock", target: "dreamer_quest_line", value: 1, label: "Unlock Dreamer's quest line" },
    ],
    flavorText: "The Dreamer has chosen you. In your compassion, she sees the future she always hoped for.",
  },
  {
    key: "the_architects_instrument",
    name: "The Architect's Instrument",
    title: "Architect's Instrument",
    description: "+25% crafting success, +20% colony production, unlock Architect's exclusive quest line.",
    icon: "Cpu",
    tier: "diamond",
    color: "#b9f2ff",
    achievement: { key: "max_machine", description: "Reach maximum Machine morality", category: "special", target: 100, counter: "machine_morality" },
    effects: [
      { system: "crafting", type: "multiplier", target: "craft_success", value: 1.25, label: "+25% crafting success" },
      { system: "trade_empire", type: "multiplier", target: "colony_production", value: 1.20, label: "+20% colony production" },
      { system: "quest", type: "unlock", target: "architect_quest_line", value: 1, label: "Unlock Architect's quest line" },
    ],
    flavorText: "The Architect has found you worthy. In your precision, it sees the order it always sought.",
  },
  {
    key: "romance_complete",
    name: "Heart of the Saga",
    title: "Beloved",
    description: "+15% companion synergy bonuses, companion assist abilities cooldown -50%.",
    icon: "Heart",
    tier: "diamond",
    color: "#b9f2ff",
    achievement: { key: "complete_romance", description: "Complete a companion romance storyline", category: "social", target: 1, counter: "romances_completed" },
    effects: [
      { system: "all", type: "multiplier", target: "companion_synergy", value: 1.15, label: "+15% companion synergy bonuses" },
      { system: "all", type: "multiplier", target: "companion_assist_cooldown", value: 0.50, label: "50% faster companion assists" },
    ],
    flavorText: "Love is the most powerful force in any universe. You've proven that.",
  },
];

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Get all traits of a specific tier.
 */
export function getTraitsByTier(tier: TraitTier): AchievementTrait[] {
  return ACHIEVEMENT_TRAITS.filter(t => t.tier === tier);
}

/**
 * Get all traits in a specific achievement category.
 */
export function getTraitsByCategory(category: TraitAchievement["category"]): AchievementTrait[] {
  return ACHIEVEMENT_TRAITS.filter(t => t.achievement.category === category);
}

/**
 * Check if a trait is unlocked based on achievement progress.
 */
export function isTraitUnlocked(traitKey: string, achievementProgress: Record<string, number>): boolean {
  const trait = ACHIEVEMENT_TRAITS.find(t => t.key === traitKey);
  if (!trait) return false;
  const progress = achievementProgress[trait.achievement.counter] || 0;
  return progress >= trait.achievement.target;
}

/**
 * Get all unlocked traits based on achievement progress.
 */
export function getUnlockedTraits(achievementProgress: Record<string, number>): AchievementTrait[] {
  return ACHIEVEMENT_TRAITS.filter(t => {
    const progress = achievementProgress[t.achievement.counter] || 0;
    return progress >= t.achievement.target;
  });
}

/**
 * Get achievement progress for a specific trait.
 */
export function getTraitProgress(traitKey: string, achievementProgress: Record<string, number>): { current: number; target: number; progress: number; unlocked: boolean } {
  const trait = ACHIEVEMENT_TRAITS.find(t => t.key === traitKey);
  if (!trait) return { current: 0, target: 0, progress: 0, unlocked: false };
  const current = achievementProgress[trait.achievement.counter] || 0;
  return {
    current,
    target: trait.achievement.target,
    progress: Math.min(current / trait.achievement.target, 1),
    unlocked: current >= trait.achievement.target,
  };
}

/**
 * Resolve all equipped trait effects for a specific game system.
 */
export function resolveTraitEffects(
  equippedTraitKeys: string[],
  system: TraitEffect["system"]
): TraitEffect[] {
  const effects: TraitEffect[] = [];

  for (const key of equippedTraitKeys) {
    const trait = ACHIEVEMENT_TRAITS.find(t => t.key === key);
    if (!trait) continue;

    for (const effect of trait.effects) {
      if (effect.system === system || effect.system === "all") {
        effects.push(effect);
      }
    }
  }

  return effects;
}

/**
 * Get a trait by key.
 */
export function getTrait(key: string): AchievementTrait | undefined {
  return ACHIEVEMENT_TRAITS.find(t => t.key === key);
}
