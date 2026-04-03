/* ═══════════════════════════════════════════════════════
   QUEST & ACHIEVEMENT SYSTEM — Cross-game progression
   Daily, weekly, and epoch (season) quests with
   rewards spanning all game modes.
   ═══════════════════════════════════════════════════════ */

/* ─── QUEST DEFINITIONS ─── */

export type QuestFrequency = "daily" | "weekly" | "epoch";
export type QuestGame = "terminus" | "dischordia" | "chess" | "fight" | "any";

export interface QuestDef {
  id: string;
  name: string;
  description: string;
  game: QuestGame;
  frequency: QuestFrequency;
  requirement: QuestRequirement;
  reward: QuestReward;
  loreText?: string;
}

export interface QuestRequirement {
  type: "kills" | "waves" | "wins" | "damage" | "turrets_built" | "cards_played"
    | "packs_opened" | "matches_played" | "perfect_wins" | "elo_reached"
    | "collection_size" | "crafts" | "trades";
  count: number;
  game?: QuestGame;
}

export interface QuestReward {
  salvage?: number;
  viralIchor?: number;
  neuralCores?: number;
  voidCrystals?: number;
  dream?: number;
  xp?: number;
  titleUnlock?: string;
  cardPack?: string;
}

export interface QuestProgress {
  questId: string;
  progress: number;
  completed: boolean;
  claimedReward: boolean;
  startedAt: number; // timestamp
  expiresAt: number; // timestamp
}

/* ─── DAILY QUESTS ─── */

export const DAILY_QUESTS: QuestDef[] = [
  // Terminus Swarm
  {
    id: "daily_terminus_survive_3",
    name: "Hold the Line",
    description: "Survive 3 waves in Terminus Swarm",
    game: "terminus",
    frequency: "daily",
    requirement: { type: "waves", count: 3 },
    reward: { salvage: 100, dream: 10 },
    loreText: "Every wave you survive is another moment the Ark's systems can recover.",
  },
  {
    id: "daily_terminus_kill_50",
    name: "Pest Control",
    description: "Kill 50 enemies in Terminus Swarm",
    game: "terminus",
    frequency: "daily",
    requirement: { type: "kills", count: 50 },
    reward: { salvage: 75, viralIchor: 10 },
  },
  {
    id: "daily_terminus_build_5",
    name: "Fortify",
    description: "Build 5 turrets in a single game",
    game: "terminus",
    frequency: "daily",
    requirement: { type: "turrets_built", count: 5 },
    reward: { salvage: 50 },
  },
  // Dischordia
  {
    id: "daily_dischordia_play_2",
    name: "Tactical Exercise",
    description: "Play 2 Dischordia matches",
    game: "dischordia",
    frequency: "daily",
    requirement: { type: "matches_played", count: 2 },
    reward: { dream: 15 },
  },
  {
    id: "daily_dischordia_win_1",
    name: "Faction Victor",
    description: "Win a Dischordia match",
    game: "dischordia",
    frequency: "daily",
    requirement: { type: "wins", count: 1 },
    reward: { dream: 25, cardPack: "season1" },
  },
  {
    id: "daily_dischordia_cards_10",
    name: "Card Slinger",
    description: "Play 10 cards in Dischordia matches",
    game: "dischordia",
    frequency: "daily",
    requirement: { type: "cards_played", count: 10 },
    reward: { dream: 10 },
  },
  // Chess
  {
    id: "daily_chess_play_1",
    name: "Architect's Opening",
    description: "Play a chess match",
    game: "chess",
    frequency: "daily",
    requirement: { type: "matches_played", count: 1 },
    reward: { dream: 10 },
  },
  // Fight
  {
    id: "daily_fight_win_1",
    name: "Arena Champion",
    description: "Win a fight in the Collector's Arena",
    game: "fight",
    frequency: "daily",
    requirement: { type: "wins", count: 1 },
    reward: { dream: 15, salvage: 50 },
  },
  // Cross-game
  {
    id: "daily_any_play_3",
    name: "Active Potential",
    description: "Play any 3 games across any mode",
    game: "any",
    frequency: "daily",
    requirement: { type: "matches_played", count: 3 },
    reward: { dream: 20, xp: 50 },
  },
];

/* ─── WEEKLY QUESTS ─── */

export const WEEKLY_QUESTS: QuestDef[] = [
  {
    id: "weekly_terminus_wave_10",
    name: "Swarm Survivor",
    description: "Reach wave 10 in Terminus Swarm",
    game: "terminus",
    frequency: "weekly",
    requirement: { type: "waves", count: 10 },
    reward: { salvage: 500, viralIchor: 50, neuralCores: 5, dream: 50 },
    loreText: "The deeper waves test every defense. Only the prepared survive.",
  },
  {
    id: "weekly_terminus_kill_500",
    name: "Exterminator",
    description: "Kill 500 enemies in Terminus Swarm",
    game: "terminus",
    frequency: "weekly",
    requirement: { type: "kills", count: 500 },
    reward: { salvage: 300, viralIchor: 30, dream: 30 },
  },
  {
    id: "weekly_dischordia_win_5",
    name: "Warmaster",
    description: "Win 5 Dischordia matches",
    game: "dischordia",
    frequency: "weekly",
    requirement: { type: "wins", count: 5 },
    reward: { dream: 100, cardPack: "season1" },
  },
  {
    id: "weekly_dischordia_packs_3",
    name: "Collector's Haul",
    description: "Open 3 card packs",
    game: "dischordia",
    frequency: "weekly",
    requirement: { type: "packs_opened", count: 3 },
    reward: { dream: 50 },
  },
  {
    id: "weekly_chess_win_3",
    name: "Strategic Mind",
    description: "Win 3 chess matches",
    game: "chess",
    frequency: "weekly",
    requirement: { type: "wins", count: 3 },
    reward: { dream: 75 },
  },
  {
    id: "weekly_fight_win_5",
    name: "Gladiator",
    description: "Win 5 arena fights",
    game: "fight",
    frequency: "weekly",
    requirement: { type: "wins", count: 5 },
    reward: { dream: 75, salvage: 200 },
  },
  {
    id: "weekly_any_play_15",
    name: "Dedicated Potential",
    description: "Play 15 games across all modes",
    game: "any",
    frequency: "weekly",
    requirement: { type: "matches_played", count: 15 },
    reward: { dream: 100, xp: 200, cardPack: "season1" },
  },
  {
    id: "weekly_craft_3",
    name: "Forge Worker",
    description: "Craft or fuse 3 items",
    game: "any",
    frequency: "weekly",
    requirement: { type: "crafts", count: 3 },
    reward: { dream: 40, neuralCores: 3 },
  },
];

/* ─── EPOCH (SEASON) QUESTS ─── */

export const EPOCH_QUESTS: QuestDef[] = [
  {
    id: "epoch_terminus_boss",
    name: "Tyrant Slayer",
    description: "Defeat the Hive Tyrant (Wave 10 boss)",
    game: "terminus",
    frequency: "epoch",
    requirement: { type: "waves", count: 10 },
    reward: { voidCrystals: 5, dream: 200, titleUnlock: "Tyrant Slayer" },
    loreText: "The Hive Tyrant is what killed the first wave of Potentials. You've proven stronger.",
  },
  {
    id: "epoch_terminus_source",
    name: "Source Defier",
    description: "Survive the Avatar of The Source (Wave 20)",
    game: "terminus",
    frequency: "epoch",
    requirement: { type: "waves", count: 20 },
    reward: { voidCrystals: 20, dream: 500, titleUnlock: "Source Defier" },
    loreText: "You've faced a fragment of Patient Zero himself. Few have survived.",
  },
  {
    id: "epoch_terminus_kills_5000",
    name: "Swarm Eradicator",
    description: "Kill 5,000 enemies total in Terminus Swarm",
    game: "terminus",
    frequency: "epoch",
    requirement: { type: "kills", count: 5000 },
    reward: { salvage: 2000, neuralCores: 25, titleUnlock: "Swarm Eradicator" },
  },
  {
    id: "epoch_dischordia_collection_50",
    name: "Archivist",
    description: "Collect 50% of all Dischordia cards",
    game: "dischordia",
    frequency: "epoch",
    requirement: { type: "collection_size", count: 50 },
    reward: { dream: 300, titleUnlock: "Archivist" },
  },
  {
    id: "epoch_dischordia_win_25",
    name: "Grand Strategist",
    description: "Win 25 Dischordia matches this epoch",
    game: "dischordia",
    frequency: "epoch",
    requirement: { type: "wins", count: 25 },
    reward: { dream: 250, cardPack: "season2", titleUnlock: "Grand Strategist" },
  },
  {
    id: "epoch_chess_grandmaster",
    name: "Grandmaster",
    description: "Reach 2400 ELO in chess",
    game: "chess",
    frequency: "epoch",
    requirement: { type: "elo_reached", count: 2400 },
    reward: { dream: 500, titleUnlock: "Grandmaster" },
  },
  {
    id: "epoch_fight_perfect_10",
    name: "Flawless",
    description: "Achieve 10 perfect wins in the arena",
    game: "fight",
    frequency: "epoch",
    requirement: { type: "perfect_wins", count: 10 },
    reward: { dream: 200, titleUnlock: "Flawless" },
  },
  {
    id: "epoch_any_play_100",
    name: "True Potential",
    description: "Play 100 total games across all modes",
    game: "any",
    frequency: "epoch",
    requirement: { type: "matches_played", count: 100 },
    reward: { dream: 500, voidCrystals: 10, titleUnlock: "True Potential" },
  },
  {
    id: "epoch_trade_10",
    name: "Master Trader",
    description: "Complete 10 card trades with other players",
    game: "any",
    frequency: "epoch",
    requirement: { type: "trades", count: 10 },
    reward: { dream: 150, titleUnlock: "Master Trader" },
  },
];

/* ─── ACHIEVEMENT DEFINITIONS ─── */

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  game: QuestGame;
  requirement: QuestRequirement;
  reward: QuestReward;
  icon: string; // emoji
  tier: "bronze" | "silver" | "gold" | "diamond" | "legendary";
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Terminus Swarm
  { id: "ach_first_wave", name: "First Contact", description: "Survive your first wave", game: "terminus", requirement: { type: "waves", count: 1 }, reward: { salvage: 50 }, icon: "🛡️", tier: "bronze" },
  { id: "ach_wave_5", name: "Entrenched", description: "Reach wave 5", game: "terminus", requirement: { type: "waves", count: 5 }, reward: { salvage: 150, dream: 20 }, icon: "🏰", tier: "silver" },
  { id: "ach_wave_10", name: "Unbreakable", description: "Reach wave 10", game: "terminus", requirement: { type: "waves", count: 10 }, reward: { neuralCores: 5, dream: 50 }, icon: "⚔️", tier: "gold" },
  { id: "ach_wave_20", name: "Terminus Defender", description: "Reach wave 20", game: "terminus", requirement: { type: "waves", count: 20 }, reward: { voidCrystals: 10, dream: 200 }, icon: "👑", tier: "legendary" },
  { id: "ach_kills_100", name: "Exterminator", description: "Kill 100 enemies", game: "terminus", requirement: { type: "kills", count: 100 }, reward: { salvage: 200 }, icon: "💀", tier: "bronze" },
  { id: "ach_kills_1000", name: "Swarm Bane", description: "Kill 1,000 enemies", game: "terminus", requirement: { type: "kills", count: 1000 }, reward: { viralIchor: 50, dream: 50 }, icon: "🔥", tier: "silver" },
  { id: "ach_kills_10000", name: "Genocide Protocol", description: "Kill 10,000 enemies", game: "terminus", requirement: { type: "kills", count: 10000 }, reward: { voidCrystals: 20, dream: 300 }, icon: "☠️", tier: "diamond" },

  // Dischordia
  { id: "ach_first_win", name: "Tactician", description: "Win your first Dischordia match", game: "dischordia", requirement: { type: "wins", count: 1 }, reward: { dream: 25 }, icon: "🎯", tier: "bronze" },
  { id: "ach_wins_10", name: "Commander", description: "Win 10 Dischordia matches", game: "dischordia", requirement: { type: "wins", count: 10 }, reward: { dream: 100 }, icon: "⭐", tier: "silver" },
  { id: "ach_wins_50", name: "Warlord", description: "Win 50 Dischordia matches", game: "dischordia", requirement: { type: "wins", count: 50 }, reward: { dream: 300, cardPack: "season2" }, icon: "🏆", tier: "gold" },
  { id: "ach_collection_25", name: "Hobbyist", description: "Collect 25% of all cards", game: "dischordia", requirement: { type: "collection_size", count: 25 }, reward: { dream: 50 }, icon: "📚", tier: "bronze" },
  { id: "ach_collection_100", name: "Completionist", description: "Collect 100% of all cards", game: "dischordia", requirement: { type: "collection_size", count: 100 }, reward: { dream: 1000, voidCrystals: 25 }, icon: "💎", tier: "legendary" },
  { id: "ach_packs_10", name: "Pack Rat", description: "Open 10 card packs", game: "dischordia", requirement: { type: "packs_opened", count: 10 }, reward: { dream: 30 }, icon: "📦", tier: "bronze" },

  // Chess
  { id: "ach_chess_win_1", name: "Opening Gambit", description: "Win your first chess match", game: "chess", requirement: { type: "wins", count: 1 }, reward: { dream: 15 }, icon: "♟️", tier: "bronze" },
  { id: "ach_chess_gold", name: "Gold Ranked", description: "Reach Gold tier in chess", game: "chess", requirement: { type: "elo_reached", count: 1600 }, reward: { dream: 100 }, icon: "🥇", tier: "gold" },

  // Fight
  { id: "ach_fight_win_1", name: "First Blood", description: "Win your first arena fight", game: "fight", requirement: { type: "wins", count: 1 }, reward: { dream: 15, salvage: 50 }, icon: "🥊", tier: "bronze" },
  { id: "ach_fight_perfect", name: "Untouchable", description: "Win a perfect fight (no damage taken)", game: "fight", requirement: { type: "perfect_wins", count: 1 }, reward: { dream: 50 }, icon: "✨", tier: "silver" },

  // Cross-game
  { id: "ach_all_games", name: "Renaissance Potential", description: "Win at least once in every game mode", game: "any", requirement: { type: "wins", count: 4 }, reward: { dream: 200, voidCrystals: 5 }, icon: "🌟", tier: "gold" },
];

/* ─── TITLE DEFINITIONS ─── */

export interface TitleDef {
  id: string;
  name: string;
  description: string;
  color: string;
  source: string; // how to unlock
}

export const TITLES: TitleDef[] = [
  // Terminus
  { id: "tyrant_slayer", name: "Tyrant Slayer", description: "Defeated the Hive Tyrant", color: "#ff4444", source: "Epoch quest: defeat wave 10 boss" },
  { id: "source_defier", name: "Source Defier", description: "Survived The Source's Avatar", color: "#ff0044", source: "Epoch quest: survive wave 20" },
  { id: "swarm_eradicator", name: "Swarm Eradicator", description: "Killed 5,000 Terminus enemies", color: "#cc2244", source: "Epoch quest: 5,000 kills" },
  { id: "terminus_defender", name: "Terminus Defender", description: "Ultimate defender of the crashed Arks", color: "#ff6644", source: "Achievement: reach wave 20" },

  // Dischordia
  { id: "archivist", name: "Archivist", description: "Collected 50% of all cards", color: "#9c27b0", source: "Epoch quest" },
  { id: "grand_strategist", name: "Grand Strategist", description: "Won 25 tactical battles", color: "#00bcd4", source: "Epoch quest" },
  { id: "completionist", name: "Completionist", description: "Collected every card", color: "#ffd700", source: "Achievement: 100% collection" },

  // Chess
  { id: "grandmaster", name: "Grandmaster", description: "Reached 2400 ELO in chess", color: "#e91e63", source: "Epoch quest" },

  // Fight
  { id: "flawless", name: "Flawless", description: "10 perfect arena victories", color: "#ff9800", source: "Epoch quest" },

  // Cross-game
  { id: "true_potential", name: "True Potential", description: "Played 100 games across all modes", color: "#00e5ff", source: "Epoch quest" },
  { id: "master_trader", name: "Master Trader", description: "Completed 10 trades", color: "#4caf50", source: "Epoch quest" },
  { id: "renaissance", name: "Renaissance Potential", description: "Mastered all game modes", color: "#ffd700", source: "Achievement: win in every mode" },
];

/* ─── HELPER: Get today's quests ─── */

export function getDailyQuests(seed?: number): QuestDef[] {
  // Rotate 3 daily quests based on day
  const day = seed ?? Math.floor(Date.now() / 86400000);
  const shuffled = [...DAILY_QUESTS].sort((a, b) => {
    const ha = hashString(a.id + day);
    const hb = hashString(b.id + day);
    return ha - hb;
  });
  return shuffled.slice(0, 3);
}

export function getWeeklyQuests(seed?: number): QuestDef[] {
  const week = seed ?? Math.floor(Date.now() / (86400000 * 7));
  const shuffled = [...WEEKLY_QUESTS].sort((a, b) => {
    const ha = hashString(a.id + week);
    const hb = hashString(b.id + week);
    return ha - hb;
  });
  return shuffled.slice(0, 4);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}
