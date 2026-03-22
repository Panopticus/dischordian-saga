/**
 * NON-COMBAT SKILL PROFICIENCIES (Recommendation 4.4)
 * ───────────────────────────────────────────────────
 * Inspired by KOTOR Skills, BG3 Proficiencies, Divinity Civil Abilities, Skyrim learn-by-doing.
 * Civil skills level up through use and provide non-combat advantages across all game systems.
 * Each skill has a 1-10 rating that improves as the player performs related actions.
 *
 * Design philosophy:
 * - Skills improve through use (Skyrim-style), not point allocation
 * - Each skill affects multiple game systems
 * - Higher levels provide increasingly powerful bonuses
 * - Rewards breadth of engagement across game systems
 */

/* ═══════════════════════════════════════════════════════
   SKILL DEFINITIONS
   ═══════════════════════════════════════════════════════ */

export const MAX_CIVIL_SKILL_LEVEL = 10;

export interface CivilSkill {
  /** Unique key */
  key: string;
  /** Display name */
  name: string;
  /** Description of what this skill does */
  description: string;
  /** Icon identifier (lucide icon name) */
  icon: string;
  /** Color hex for UI */
  color: string;
  /** Actions that level this skill */
  leveledBy: SkillAction[];
  /** Bonuses at each level (1-10) */
  levelBonuses: SkillLevelBonus[];
  /** Max level effect description */
  maxLevelEffect: string;
}

export interface SkillAction {
  /** Action key that triggers XP gain */
  action: string;
  /** Human-readable description */
  label: string;
  /** XP gained per action */
  xpPerAction: number;
}

export interface SkillLevelBonus {
  /** Level this bonus activates at */
  level: number;
  /** Game system affected */
  system: "card_game" | "trade_empire" | "fight" | "chess" | "guild_war" | "quest" | "market" | "crafting" | "all";
  /** Effect type */
  type: "multiplier" | "flat" | "passive" | "unlock";
  /** Target stat/mechanic */
  target: string;
  /** Numeric value */
  value: number;
  /** Human-readable label */
  label: string;
}

/* ═══════════════════════════════════════════════════════
   XP CURVE — Exponential scaling per level
   ═══════════════════════════════════════════════════════ */

export const CIVIL_SKILL_XP_CURVE = [
  0,     // Level 0 → 1
  50,    // Level 1 → 2
  150,   // Level 2 → 3
  350,   // Level 3 → 4
  700,   // Level 4 → 5
  1200,  // Level 5 → 6
  2000,  // Level 6 → 7
  3200,  // Level 7 → 8
  5000,  // Level 8 → 9
  8000,  // Level 9 → 10
] as const;

/* ═══════════════════════════════════════════════════════
   SKILL DEFINITIONS — 8 Civil Skills
   ═══════════════════════════════════════════════════════ */

export const CIVIL_SKILLS: CivilSkill[] = [
  {
    key: "negotiation",
    name: "Negotiation",
    description: "The art of the deal. Better prices, better terms, better outcomes.",
    icon: "Handshake",
    color: "#f59e0b",
    leveledBy: [
      { action: "complete_trade", label: "Complete a trade run", xpPerAction: 8 },
      { action: "marketplace_sell", label: "Sell on marketplace", xpPerAction: 5 },
      { action: "marketplace_buy", label: "Buy on marketplace", xpPerAction: 3 },
      { action: "guild_trade", label: "Complete a guild trade deal", xpPerAction: 12 },
    ],
    levelBonuses: [
      { level: 1, system: "market", type: "multiplier", target: "buy_price", value: 0.98, label: "2% better buy prices" },
      { level: 3, system: "market", type: "multiplier", target: "sell_price", value: 1.05, label: "5% better sell prices" },
      { level: 5, system: "market", type: "multiplier", target: "tax_reduction", value: 0.90, label: "10% tax reduction" },
      { level: 7, system: "trade_empire", type: "multiplier", target: "trade_profit", value: 1.15, label: "+15% trade profits" },
      { level: 10, system: "market", type: "multiplier", target: "buy_price", value: 0.80, label: "20% better buy/sell prices" },
    ],
    maxLevelEffect: "20% better buy/sell prices on all marketplace transactions",
  },
  {
    key: "perception",
    name: "Perception",
    description: "See what others miss. Discover hidden items, entries, and opportunities.",
    icon: "Eye",
    color: "#8b5cf6",
    leveledBy: [
      { action: "discover_entity", label: "Discover a Loredex entry", xpPerAction: 10 },
      { action: "find_easter_egg", label: "Find an easter egg", xpPerAction: 25 },
      { action: "explore_room", label: "Explore a new room", xpPerAction: 5 },
      { action: "scan_system", label: "Scan a star system", xpPerAction: 4 },
    ],
    levelBonuses: [
      { level: 1, system: "all", type: "passive", target: "hidden_item_chance", value: 0.02, label: "2% hidden item discovery" },
      { level: 3, system: "trade_empire", type: "flat", target: "scan_range", value: 1, label: "+1 scan range" },
      { level: 5, system: "all", type: "passive", target: "hidden_item_chance", value: 0.05, label: "5% hidden item discovery" },
      { level: 7, system: "quest", type: "unlock", target: "hidden_quest_reveal", value: 1, label: "Reveal hidden quests" },
      { level: 10, system: "all", type: "unlock", target: "auto_discover_hidden", value: 1, label: "Hidden items revealed automatically" },
    ],
    maxLevelEffect: "Hidden items and entries revealed automatically",
  },
  {
    key: "tactics",
    name: "Tactics",
    description: "Strategic thinking. Better chess play, card battle decisions, and combat planning.",
    icon: "Brain",
    color: "#3b82f6",
    leveledBy: [
      { action: "win_chess", label: "Win a chess game", xpPerAction: 12 },
      { action: "win_card_battle", label: "Win a card battle", xpPerAction: 8 },
      { action: "win_fight", label: "Win a fight", xpPerAction: 6 },
      { action: "chess_checkmate", label: "Win by checkmate", xpPerAction: 15 },
    ],
    levelBonuses: [
      { level: 1, system: "chess", type: "flat", target: "time_bonus", value: 5, label: "+5s chess time" },
      { level: 3, system: "card_game", type: "flat", target: "starting_hand", value: 1, label: "+1 starting hand size" },
      { level: 5, system: "chess", type: "flat", target: "time_bonus", value: 10, label: "+10s chess time total" },
      { level: 7, system: "fight", type: "multiplier", target: "damage_bonus", value: 1.10, label: "+10% fight damage" },
      { level: 10, system: "chess", type: "unlock", target: "preview_opponent_move", value: 1, label: "Preview opponent's next move" },
    ],
    maxLevelEffect: "Preview opponent's next move in chess",
  },
  {
    key: "endurance",
    name: "Endurance",
    description: "Physical and mental stamina. More HP, more quests, more staying power.",
    icon: "HeartPulse",
    color: "#ef4444",
    leveledBy: [
      { action: "complete_quest", label: "Complete a quest", xpPerAction: 8 },
      { action: "survive_fight", label: "Survive a fight", xpPerAction: 5 },
      { action: "survive_low_hp", label: "Survive below 20% HP", xpPerAction: 15 },
      { action: "complete_guild_war", label: "Complete a guild war round", xpPerAction: 10 },
    ],
    levelBonuses: [
      { level: 1, system: "fight", type: "multiplier", target: "max_hp", value: 1.05, label: "+5% max HP" },
      { level: 3, system: "fight", type: "multiplier", target: "max_hp", value: 1.10, label: "+10% max HP" },
      { level: 5, system: "quest", type: "flat", target: "daily_quest_slots", value: 1, label: "+1 daily quest slot" },
      { level: 7, system: "fight", type: "multiplier", target: "max_hp", value: 1.20, label: "+20% max HP" },
      { level: 10, system: "fight", type: "multiplier", target: "max_hp", value: 1.25, label: "+25% max HP; +2 daily quest slots" },
    ],
    maxLevelEffect: "+25% max HP in all combat, +2 daily quest slots",
  },
  {
    key: "craftsmanship",
    name: "Craftsmanship",
    description: "The mastery of creation. Better crafts, cheaper materials, higher quality.",
    icon: "Hammer",
    color: "#a16207",
    leveledBy: [
      { action: "craft_item", label: "Craft an item", xpPerAction: 10 },
      { action: "craft_rare", label: "Craft a rare+ item", xpPerAction: 20 },
      { action: "repair_ship", label: "Repair a ship", xpPerAction: 8 },
      { action: "upgrade_colony", label: "Upgrade a colony", xpPerAction: 12 },
    ],
    levelBonuses: [
      { level: 1, system: "crafting", type: "multiplier", target: "craft_success", value: 1.05, label: "+5% craft success" },
      { level: 3, system: "crafting", type: "multiplier", target: "material_cost", value: 0.90, label: "10% material cost reduction" },
      { level: 5, system: "crafting", type: "multiplier", target: "craft_success", value: 1.15, label: "+15% craft success" },
      { level: 7, system: "crafting", type: "multiplier", target: "material_cost", value: 0.75, label: "25% material cost reduction" },
      { level: 10, system: "crafting", type: "passive", target: "guaranteed_success", value: 1, label: "Crafting always succeeds; -30% material costs" },
    ],
    maxLevelEffect: "Crafting always succeeds at skill 10, material costs -30%",
  },
  {
    key: "espionage",
    name: "Espionage",
    description: "The art of secrets. See what's hidden, sabotage what's exposed.",
    icon: "Search",
    color: "#6366f1",
    leveledBy: [
      { action: "sabotage_territory", label: "Sabotage a territory", xpPerAction: 12 },
      { action: "spy_action", label: "Perform a spy action", xpPerAction: 8 },
      { action: "marketplace_sell", label: "Sell on marketplace (intel)", xpPerAction: 3 },
      { action: "guild_war_contribute", label: "Guild war contribution", xpPerAction: 6 },
    ],
    levelBonuses: [
      { level: 1, system: "guild_war", type: "multiplier", target: "sabotage_power", value: 1.05, label: "+5% sabotage power" },
      { level: 3, system: "market", type: "unlock", target: "price_history_24h", value: 1, label: "See 24h price history" },
      { level: 5, system: "guild_war", type: "multiplier", target: "sabotage_power", value: 1.15, label: "+15% sabotage power" },
      { level: 7, system: "guild_war", type: "unlock", target: "see_contributions", value: 1, label: "See all guild war contributions" },
      { level: 10, system: "market", type: "unlock", target: "hidden_market_data", value: 1, label: "See hidden market data" },
    ],
    maxLevelEffect: "See all guild war contributions, hidden market data",
  },
  {
    key: "leadership",
    name: "Leadership",
    description: "Inspire others. Your presence strengthens your guild and allies.",
    icon: "Users",
    color: "#10b981",
    leveledBy: [
      { action: "guild_war_contribute", label: "Guild war contribution", xpPerAction: 8 },
      { action: "capture_territory", label: "Capture a territory", xpPerAction: 15 },
      { action: "guild_donation", label: "Donate to guild", xpPerAction: 10 },
      { action: "rally_members", label: "Rally guild members", xpPerAction: 12 },
    ],
    levelBonuses: [
      { level: 1, system: "guild_war", type: "multiplier", target: "guild_member_bonus", value: 1.02, label: "+2% guild member bonuses" },
      { level: 3, system: "guild_war", type: "multiplier", target: "guild_member_bonus", value: 1.05, label: "+5% guild member bonuses" },
      { level: 5, system: "guild_war", type: "multiplier", target: "capture_speed", value: 1.10, label: "+10% capture speed" },
      { level: 7, system: "guild_war", type: "multiplier", target: "guild_member_bonus", value: 1.08, label: "+8% guild member bonuses" },
      { level: 10, system: "guild_war", type: "multiplier", target: "guild_member_bonus", value: 1.10, label: "+10% guild member bonuses when online" },
    ],
    maxLevelEffect: "Guild member bonuses +10% when you're online",
  },
  {
    key: "lore",
    name: "Lore",
    description: "Knowledge of the Dischordian Saga. Deeper understanding yields greater rewards.",
    icon: "BookMarked",
    color: "#ec4899",
    leveledBy: [
      { action: "discover_entity", label: "Discover a Loredex entry", xpPerAction: 10 },
      { action: "complete_quest", label: "Complete a story quest", xpPerAction: 8 },
      { action: "read_backstory", label: "Read companion backstory", xpPerAction: 15 },
      { action: "listen_song", label: "Listen to a song", xpPerAction: 3 },
    ],
    levelBonuses: [
      { level: 1, system: "all", type: "multiplier", target: "dream_token_gain", value: 1.05, label: "+5% Dream token gains" },
      { level: 3, system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.10, label: "+10% quest rewards" },
      { level: 5, system: "all", type: "multiplier", target: "dream_token_gain", value: 1.15, label: "+15% Dream token gains" },
      { level: 7, system: "all", type: "multiplier", target: "xp_bonus", value: 1.10, label: "+10% all XP gains" },
      { level: 10, system: "all", type: "multiplier", target: "dream_token_gain", value: 1.25, label: "+25% Dream from all lore activities" },
    ],
    maxLevelEffect: "Bonus Dream tokens from all lore-related activities",
  },
];

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Calculate civil skill level from total XP.
 */
export function getCivilSkillLevel(totalXp: number): number {
  for (let i = CIVIL_SKILL_XP_CURVE.length - 1; i >= 0; i--) {
    if (totalXp >= CIVIL_SKILL_XP_CURVE[i]) {
      return Math.min(i + 1, MAX_CIVIL_SKILL_LEVEL);
    }
  }
  return 1;
}

/**
 * Get XP progress to next level.
 */
export function getCivilSkillProgress(totalXp: number): { level: number; current: number; next: number; progress: number } {
  const level = getCivilSkillLevel(totalXp);
  if (level >= MAX_CIVIL_SKILL_LEVEL) {
    return { level, current: totalXp, next: CIVIL_SKILL_XP_CURVE[CIVIL_SKILL_XP_CURVE.length - 1], progress: 1 };
  }
  const currentThreshold = CIVIL_SKILL_XP_CURVE[level - 1];
  const nextThreshold = CIVIL_SKILL_XP_CURVE[level];
  const range = nextThreshold - currentThreshold;
  const progressXp = totalXp - currentThreshold;
  return {
    level,
    current: totalXp,
    next: nextThreshold,
    progress: range > 0 ? progressXp / range : 0,
  };
}

/**
 * Get all active bonuses for a civil skill at a given level.
 */
export function getActiveBonuses(skillKey: string, level: number): SkillLevelBonus[] {
  const skill = CIVIL_SKILLS.find(s => s.key === skillKey);
  if (!skill) return [];
  return skill.levelBonuses.filter(b => b.level <= level);
}

/**
 * Get the next bonus to unlock for a skill.
 */
export function getNextBonus(skillKey: string, level: number): SkillLevelBonus | null {
  const skill = CIVIL_SKILLS.find(s => s.key === skillKey);
  if (!skill) return null;
  return skill.levelBonuses.find(b => b.level > level) || null;
}

/**
 * Resolve all civil skill bonuses for a specific game system.
 */
export function resolveCivilSkillBonuses(
  skillLevels: Record<string, number>,
  system: SkillLevelBonus["system"]
): SkillLevelBonus[] {
  const bonuses: SkillLevelBonus[] = [];

  for (const [skillKey, level] of Object.entries(skillLevels)) {
    const activeBonuses = getActiveBonuses(skillKey, level);
    for (const bonus of activeBonuses) {
      if (bonus.system === system || bonus.system === "all") {
        bonuses.push(bonus);
      }
    }
  }

  return bonuses;
}

/**
 * Calculate XP to award for an action across all civil skills.
 * Returns a map of skill key → XP gained.
 */
export function calculateCivilSkillXp(action: string): Record<string, number> {
  const xpGains: Record<string, number> = {};

  for (const skill of CIVIL_SKILLS) {
    const matchingAction = skill.leveledBy.find(a => a.action === action);
    if (matchingAction) {
      xpGains[skill.key] = matchingAction.xpPerAction;
    }
  }

  return xpGains;
}

/**
 * Get a skill definition by key.
 */
export function getCivilSkill(key: string): CivilSkill | undefined {
  return CIVIL_SKILLS.find(s => s.key === key);
}
