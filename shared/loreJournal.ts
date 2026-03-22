/**
 * LORE JOURNAL WRITING
 * ══════════════════════════════════════════════════════════
 * Personal journal, word count XP, writing streaks.
 *
 * RPG IMPACT:
 * - Civil skill "Lore" → XP multiplier for writing
 * - Oracle class → bonus insight XP
 * - Prestige "Chronomancer" → time-themed writing bonuses
 * - Achievement traits → passive writing streak protection
 * - Morality → Machine entries vs Humanity entries give different rewards
 */

export type JournalCategory = "character_study" | "location_lore" | "faction_analysis" | "timeline_theory" | "song_interpretation" | "personal_log" | "prophecy" | "battle_report";

export interface JournalCategoryDef {
  key: JournalCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  /** Base XP per word */
  xpPerWord: number;
  /** Bonus class */
  bonusClass?: string;
}

export const JOURNAL_CATEGORIES: JournalCategoryDef[] = [
  { key: "character_study", name: "Character Study", description: "Deep dive into a character's motivations and history", icon: "User", color: "#3b82f6", xpPerWord: 2 },
  { key: "location_lore", name: "Location Lore", description: "Document the history and secrets of a location", icon: "MapPin", color: "#22c55e", xpPerWord: 2 },
  { key: "faction_analysis", name: "Faction Analysis", description: "Analyze a faction's structure, goals, and influence", icon: "Users", color: "#f59e0b", xpPerWord: 2.5, bonusClass: "spy" },
  { key: "timeline_theory", name: "Timeline Theory", description: "Theorize about temporal events and paradoxes", icon: "Timer", color: "#8b5cf6", xpPerWord: 3, bonusClass: "oracle" },
  { key: "song_interpretation", name: "Song Interpretation", description: "Interpret the hidden meanings in Dischordian songs", icon: "Music", color: "#ec4899", xpPerWord: 2.5 },
  { key: "personal_log", name: "Personal Log", description: "Your operative's personal journal entries", icon: "BookOpen", color: "#78716c", xpPerWord: 1.5 },
  { key: "prophecy", name: "Prophecy", description: "Write prophetic visions of the future", icon: "Eye", color: "#6d28d9", xpPerWord: 3, bonusClass: "oracle" },
  { key: "battle_report", name: "Battle Report", description: "Document combat encounters and strategies", icon: "Swords", color: "#ef4444", xpPerWord: 2, bonusClass: "soldier" },
];

export interface WritingStreakReward {
  days: number;
  reward: { type: "xp" | "dream" | "cosmetic"; key: string; amount: number };
  label: string;
}

export const WRITING_STREAK_REWARDS: WritingStreakReward[] = [
  { days: 3, reward: { type: "xp", key: "xp", amount: 200 }, label: "3-Day Streak" },
  { days: 7, reward: { type: "dream", key: "dream", amount: 25 }, label: "Weekly Writer" },
  { days: 14, reward: { type: "dream", key: "dream", amount: 75 }, label: "Dedicated Scribe" },
  { days: 30, reward: { type: "cosmetic", key: "golden_quill", amount: 1 }, label: "Golden Quill" },
  { days: 60, reward: { type: "cosmetic", key: "master_scribe_frame", amount: 1 }, label: "Master Scribe" },
  { days: 100, reward: { type: "cosmetic", key: "legendary_author_title", amount: 1 }, label: "Legendary Author" },
];

/** Minimum words per day to maintain streak */
export const MIN_WORDS_FOR_STREAK = 100;
/** Maximum XP-earning words per day */
export const MAX_XP_WORDS_PER_DAY = 2000;

export interface WritingBonuses {
  xpMultiplier: number;
  streakProtection: boolean;
  bonusCategories: JournalCategory[];
  sources: { source: string; label: string }[];
}

export function resolveWritingBonuses(opts: {
  characterClass?: string;
  classRank?: number;
  civilSkills?: Record<string, number>;
  prestigeClass?: string;
  achievementTraits?: string[];
  talents?: string[];
}): WritingBonuses {
  const b: WritingBonuses = {
    xpMultiplier: 1.0,
    streakProtection: false,
    bonusCategories: [],
    sources: [],
  };

  // Lore civil skill
  const loreLevel = opts.civilSkills?.["lore"] || 0;
  if (loreLevel >= 1) {
    b.xpMultiplier += loreLevel * 0.10;
    b.sources.push({ source: "Lore Skill", label: `+${loreLevel * 10}% writing XP` });
  }

  // Class bonuses
  if (opts.characterClass === "oracle" && (opts.classRank || 0) >= 1) {
    b.xpMultiplier += 0.15;
    b.bonusCategories.push("timeline_theory", "prophecy");
    b.sources.push({ source: "Oracle Class", label: "+15% XP, bonus for theories & prophecies" });
  }
  if (opts.characterClass === "spy" && (opts.classRank || 0) >= 1) {
    b.bonusCategories.push("faction_analysis");
    b.sources.push({ source: "Spy Class", label: "Bonus for faction analysis" });
  }
  if (opts.characterClass === "soldier" && (opts.classRank || 0) >= 1) {
    b.bonusCategories.push("battle_report");
    b.sources.push({ source: "Soldier Class", label: "Bonus for battle reports" });
  }

  // Prestige
  if (opts.prestigeClass === "chronomancer") {
    b.xpMultiplier += 0.20;
    b.sources.push({ source: "Chronomancer Prestige", label: "+20% writing XP" });
  }

  // Achievement traits — streak protection
  if (opts.achievementTraits && opts.achievementTraits.length >= 5) {
    b.streakProtection = true;
    b.sources.push({ source: "Achievement Collection", label: "1 free streak miss per week" });
  }

  return b;
}

/** Calculate XP for a journal entry */
export function calculateWritingXP(
  wordCount: number,
  category: JournalCategory,
  bonuses: WritingBonuses
): number {
  const catDef = JOURNAL_CATEGORIES.find(c => c.key === category);
  if (!catDef) return 0;
  const cappedWords = Math.min(wordCount, MAX_XP_WORDS_PER_DAY);
  let xp = cappedWords * catDef.xpPerWord;
  // Category bonus
  if (bonuses.bonusCategories.includes(category)) xp *= 1.25;
  // Global multiplier
  xp *= bonuses.xpMultiplier;
  return Math.floor(xp);
}
