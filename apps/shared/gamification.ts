/* ═══════════════════════════════════════════════════════
   GAMIFICATION — Shared types & achievement definitions
   Franchise-agnostic: scoped by franchiseId
   ═══════════════════════════════════════════════════════ */

export interface AchievementDef {
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  category: "explore" | "watch" | "fight" | "discover" | "collect" | "social" | "master" | "crossgame" | "chess" | "swarm" | "lore" | "fighting" | "card" | "guild" | "misc";
  tier: "bronze" | "silver" | "gold" | "platinum" | "legendary";
  xpReward: number;
  pointsReward: number;
  condition: { type: string; count?: number; target?: string };
  hidden?: boolean;
}

export interface UserProgressData {
  discoveredEntries: string[];
  watchedEpisodes: string[];
  fightWins: number;
  fightLosses: number;
  perfectWins: number;
  specialsUsed: number;
  connectionsFound: number;
  timelineExplored: boolean;
  boardExplored: boolean;
  doomScrollRead: number;
  demonKills: number;
  hierarchyExplored: boolean;
  demonCardsCollected: number;
}

export interface GameSaveData {
  unlockedFighters: string[];
  fightPoints: number;
  highestDifficulty: string;
  totalFights: number;
  winStreak: number;
  bestWinStreak: number;
}

export const DEFAULT_PROGRESS: UserProgressData = {
  demonKills: 0,
  hierarchyExplored: false,
  demonCardsCollected: 0,
  discoveredEntries: [],
  watchedEpisodes: [],
  fightWins: 0,
  fightLosses: 0,
  perfectWins: 0,
  specialsUsed: 0,
  connectionsFound: 0,
  timelineExplored: false,
  boardExplored: false,
  doomScrollRead: 0,
};

export const DEFAULT_GAME_SAVE: GameSaveData = {
  unlockedFighters: [],
  fightPoints: 0,
  highestDifficulty: "easy",
  totalFights: 0,
  winStreak: 0,
  bestWinStreak: 0,
};

/* ─── XP LEVEL THRESHOLDS ─── */
export const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200,
  6500, 8000, 10000, 12500, 15500, 19000, 23000, 28000, 34000, 41000,
];

export const TITLES: Record<number, string> = {
  1: "Recruit",
  3: "Operative",
  5: "Agent",
  8: "Specialist",
  10: "Commander",
  13: "Archon",
  16: "Sentinel",
  18: "Oracle",
  20: "Architect of Reality",
};

export function getLevelForXp(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getTitleForLevel(level: number): string {
  let title = "Recruit";
  for (const [lvl, t] of Object.entries(TITLES)) {
    if (level >= Number(lvl)) title = t;
  }
  return title;
}

/* ─── ARK THEMES ─── */
export interface ArkThemeDef {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    panel: string;
    text: string;
    glow: string;
  };
}

export const ARK_THEMES: ArkThemeDef[] = [
  {
    id: "default",
    name: "Standard Issue",
    description: "Default Inception Ark console",
    unlockLevel: 1,
    colors: { primary: "#22d3ee", secondary: "#0f172a", accent: "#f59e0b", bg: "#020617", panel: "rgba(15,23,42,0.85)", text: "#e2e8f0", glow: "#22d3ee" },
  },
  {
    id: "empire",
    name: "AI Empire",
    description: "The crimson glow of the Empire",
    unlockLevel: 3,
    colors: { primary: "#ef4444", secondary: "#1a0000", accent: "#fbbf24", bg: "#0a0000", panel: "rgba(26,0,0,0.85)", text: "#fecaca", glow: "#ef4444" },
  },
  {
    id: "insurgency",
    name: "Insurgency",
    description: "Fight the power — green resistance",
    unlockLevel: 5,
    colors: { primary: "#22c55e", secondary: "#052e16", accent: "#86efac", bg: "#020a04", panel: "rgba(5,46,22,0.85)", text: "#dcfce7", glow: "#22c55e" },
  },
  {
    id: "neyons",
    name: "Ne-Yon Sanctum",
    description: "The ethereal blue of the Ne-Yons",
    unlockLevel: 8,
    colors: { primary: "#818cf8", secondary: "#1e1b4b", accent: "#c4b5fd", bg: "#0a0820", panel: "rgba(30,27,75,0.85)", text: "#e0e7ff", glow: "#818cf8" },
  },
  {
    id: "terminus",
    name: "Terminus",
    description: "The void at the end of time",
    unlockLevel: 10,
    colors: { primary: "#a855f7", secondary: "#1a0a2e", accent: "#d8b4fe", bg: "#050010", panel: "rgba(26,10,46,0.85)", text: "#f3e8ff", glow: "#a855f7" },
  },
  {
    id: "fall",
    name: "Fall of Reality",
    description: "When everything changed",
    unlockLevel: 15,
    colors: { primary: "#f97316", secondary: "#1a0a00", accent: "#fb923c", bg: "#0a0500", panel: "rgba(26,10,0,0.85)", text: "#ffedd5", glow: "#f97316" },
  },
  {
    id: "golden",
    name: "Golden Age",
    description: "The glory days of the Empire",
    unlockLevel: 18,
    colors: { primary: "#eab308", secondary: "#1a1500", accent: "#fde047", bg: "#0a0800", panel: "rgba(26,21,0,0.85)", text: "#fef9c3", glow: "#eab308" },
  },
  {
    id: "matrix",
    name: "Matrix of Dreams",
    description: "Beyond the First Epoch",
    unlockLevel: 20,
    colors: { primary: "#06b6d4", secondary: "#001a1a", accent: "#67e8f9", bg: "#000a0a", panel: "rgba(0,26,26,0.85)", text: "#cffafe", glow: "#06b6d4" },
  },
];

/* ─── ACHIEVEMENT DEFINITIONS (Dischordian Saga) ─── */
export const DISCHORDIAN_ACHIEVEMENTS: AchievementDef[] = [
  // EXPLORE
  { achievementId: "first-discovery", name: "First Contact", description: "Discover your first Loredex entry", icon: "🔍", category: "explore", tier: "bronze", xpReward: 25, pointsReward: 50, condition: { type: "discover_entries", count: 1 } },
  { achievementId: "explorer-10", name: "Curious Operative", description: "Discover 10 Loredex entries", icon: "🗺️", category: "explore", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "discover_entries", count: 10 } },
  { achievementId: "explorer-50", name: "Deep Researcher", description: "Discover 50 Loredex entries", icon: "📡", category: "explore", tier: "silver", xpReward: 150, pointsReward: 300, condition: { type: "discover_entries", count: 50 } },
  { achievementId: "explorer-100", name: "Omniscient", description: "Discover 100 Loredex entries", icon: "👁️", category: "explore", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "discover_entries", count: 100 } },
  { achievementId: "explorer-all", name: "The Architect's Equal", description: "Discover every single entry", icon: "⚡", category: "explore", tier: "legendary", xpReward: 1000, pointsReward: 2500, condition: { type: "discover_entries", count: 170 } },
  { achievementId: "timeline-explorer", name: "Time Traveler", description: "Explore the interactive timeline", icon: "⏳", category: "explore", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "timeline_explored" } },
  { achievementId: "board-explorer", name: "Conspiracy Theorist", description: "Explore the conspiracy board", icon: "📌", category: "explore", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "board_explored" } },

  // WATCH
  { achievementId: "first-watch", name: "First Transmission", description: "Watch your first music video", icon: "📺", category: "watch", tier: "bronze", xpReward: 25, pointsReward: 50, condition: { type: "watch_episodes", count: 1 } },
  { achievementId: "binge-5", name: "Binge Watcher", description: "Watch 5 music videos", icon: "🎬", category: "watch", tier: "silver", xpReward: 100, pointsReward: 200, condition: { type: "watch_episodes", count: 5 } },
  { achievementId: "watch-all", name: "The Complete Saga", description: "Watch every music video", icon: "🏆", category: "watch", tier: "gold", xpReward: 300, pointsReward: 750, condition: { type: "watch_episodes", count: 17 } },

  // FIGHT
  { achievementId: "first-blood", name: "First Blood", description: "Win your first fight", icon: "⚔️", category: "fight", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "fight_wins", count: 1 } },
  { achievementId: "warrior-10", name: "Seasoned Warrior", description: "Win 10 fights", icon: "🗡️", category: "fight", tier: "silver", xpReward: 150, pointsReward: 300, condition: { type: "fight_wins", count: 10 } },
  { achievementId: "warrior-50", name: "Warlord's Rival", description: "Win 50 fights", icon: "🛡️", category: "fight", tier: "gold", xpReward: 400, pointsReward: 800, condition: { type: "fight_wins", count: 50 } },
  { achievementId: "perfect-win", name: "Flawless Victory", description: "Win a fight without taking damage", icon: "💎", category: "fight", tier: "gold", xpReward: 200, pointsReward: 500, condition: { type: "perfect_wins", count: 1 } },
  { achievementId: "streak-5", name: "Unstoppable", description: "Win 5 fights in a row", icon: "🔥", category: "fight", tier: "silver", xpReward: 150, pointsReward: 300, condition: { type: "win_streak", count: 5 } },
  { achievementId: "streak-10", name: "The Undefeated", description: "Win 10 fights in a row", icon: "👑", category: "fight", tier: "platinum", xpReward: 500, pointsReward: 1000, condition: { type: "win_streak", count: 10 } },
  { achievementId: "nightmare-win", name: "Reality Breaker", description: "Win on Fall of Reality difficulty", icon: "💀", category: "fight", tier: "platinum", xpReward: 300, pointsReward: 600, condition: { type: "nightmare_win" } },

  // COLLECT
  { achievementId: "unlock-first", name: "New Recruit", description: "Unlock your first hidden fighter", icon: "🔓", category: "collect", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "unlock_fighters", count: 1 } },
  { achievementId: "unlock-10", name: "Roster Builder", description: "Unlock 10 fighters", icon: "📋", category: "collect", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "unlock_fighters", count: 10 } },
  { achievementId: "unlock-all", name: "Complete Roster", description: "Unlock every fighter", icon: "🌟", category: "collect", tier: "legendary", xpReward: 1000, pointsReward: 2500, condition: { type: "unlock_fighters", count: 19 } },

  // DISCOVER (connections)
  { achievementId: "connection-1", name: "First Link", description: "Find your first lore connection", icon: "🔗", category: "discover", tier: "bronze", xpReward: 25, pointsReward: 50, condition: { type: "connections_found", count: 1 } },
  { achievementId: "connection-50", name: "Web Weaver", description: "Find 50 lore connections", icon: "🕸️", category: "discover", tier: "silver", xpReward: 150, pointsReward: 300, condition: { type: "connections_found", count: 50 } },
  { achievementId: "connection-200", name: "The CoNexus", description: "Find 200 lore connections", icon: "🌐", category: "discover", tier: "gold", xpReward: 400, pointsReward: 800, condition: { type: "connections_found", count: 200 } },

  // HIERARCHY OF THE DAMNED
  { achievementId: "demon-slayer-1", name: "Demon Slayer", description: "Defeat a Hierarchy demon in combat", icon: "☠️", category: "fight", tier: "silver", xpReward: 100, pointsReward: 200, condition: { type: "demon_kills", count: 1 } },
  { achievementId: "demon-slayer-10", name: "Blood Weave Breaker", description: "Defeat 10 Hierarchy demons", icon: "🔥", category: "fight", tier: "gold", xpReward: 300, pointsReward: 600, condition: { type: "demon_kills", count: 10 } },
  { achievementId: "demon-slayer-50", name: "Hierarchy's Bane", description: "Defeat 50 Hierarchy demons across all games", icon: "💀", category: "fight", tier: "platinum", xpReward: 500, pointsReward: 1000, condition: { type: "demon_kills", count: 50 } },
  { achievementId: "hierarchy-explorer", name: "Know Thy Enemy", description: "View the Hierarchy of the Damned org chart", icon: "👁️", category: "explore", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "hierarchy_explored" } },
  { achievementId: "demon-card-collector", name: "Soul Collector", description: "Collect 5 demon cards", icon: "🃏", category: "collect", tier: "silver", xpReward: 150, pointsReward: 300, condition: { type: "demon_cards", count: 5 } },
  { achievementId: "demon-card-all", name: "Master of the Damned", description: "Collect all 10 demon leader cards", icon: "👑", category: "collect", tier: "legendary", xpReward: 500, pointsReward: 1500, condition: { type: "demon_cards", count: 10 } },

  // MASTER
  { achievementId: "doom-scroll-10", name: "End Times Scholar", description: "Read 10 Doom Scroll headlines", icon: "📰", category: "master", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "doom_scroll_read", count: 10 } },
  { achievementId: "level-5", name: "Rising Star", description: "Reach Level 5", icon: "⭐", category: "master", tier: "bronze", xpReward: 0, pointsReward: 200, condition: { type: "reach_level", count: 5 } },
  { achievementId: "level-10", name: "Veteran", description: "Reach Level 10", icon: "🎖️", category: "master", tier: "silver", xpReward: 0, pointsReward: 500, condition: { type: "reach_level", count: 10 } },
  { achievementId: "level-20", name: "Architect of Reality", description: "Reach the maximum level", icon: "🏛️", category: "master", tier: "legendary", xpReward: 0, pointsReward: 5000, condition: { type: "reach_level", count: 20 } },

  // CROSS-GAME
  { achievementId: "renaissance_potential", name: "Renaissance Potential", description: "Win a match in Chess, Card Battle, Terminus Swarm, Fighting, and Pet Battles within 24 hours", icon: "🌟", category: "crossgame", tier: "legendary", xpReward: 500, pointsReward: 2000, condition: { type: "crossgame_wins_24h", count: 5 }, hidden: true },
  { achievementId: "full_spectrum", name: "Full Spectrum", description: "Have all 5 cross-game synergy buffs active simultaneously", icon: "🌈", category: "crossgame", tier: "platinum", xpReward: 300, pointsReward: 1000, condition: { type: "synergy_buffs_active", count: 5 } },
  { achievementId: "master_of_none", name: "Master of None", description: "Reach mid-rank in all game modes without reaching top rank in any", icon: "🃏", category: "crossgame", tier: "gold", xpReward: 200, pointsReward: 750, condition: { type: "mid_rank_all_modes" }, hidden: true },
  { achievementId: "the_investor", name: "The Investor", description: "Earn 10,000 Dream purely from marketplace trades", icon: "💰", category: "crossgame", tier: "platinum", xpReward: 400, pointsReward: 1500, condition: { type: "marketplace_dream_earned", count: 10000 } },
  { achievementId: "board_remembers", name: "The Board Remembers", description: "Play 1,000 total games across all modes", icon: "📋", category: "crossgame", tier: "legendary", xpReward: 500, pointsReward: 2500, condition: { type: "total_games_all_modes", count: 1000 } },

  // CHESS (expanded)
  { achievementId: "scholars_mate", name: "Scholar's Mate", description: "Win a chess match in 4 moves or fewer", icon: "♟️", category: "chess", tier: "gold", xpReward: 200, pointsReward: 500, condition: { type: "chess_win_moves", count: 4 }, hidden: true },
  { achievementId: "the_long_game", name: "The Long Game", description: "Win a chess match lasting 100+ moves", icon: "♜", category: "chess", tier: "silver", xpReward: 100, pointsReward: 300, condition: { type: "chess_win_long", count: 100 } },
  { achievementId: "architects_gambit", name: "Architect's Gambit Accepted", description: "Defeat The Architect (highest AI)", icon: "♚", category: "chess", tier: "platinum", xpReward: 400, pointsReward: 1000, condition: { type: "chess_defeat_architect" } },
  { achievementId: "immortal_game", name: "Immortal Game", description: "Sacrifice your queen and still win", icon: "♛", category: "chess", tier: "legendary", xpReward: 500, pointsReward: 2000, condition: { type: "chess_queen_sacrifice_win" }, hidden: true },
  { achievementId: "stalemate_specialist", name: "Stalemate Specialist", description: "Force a stalemate from a losing position", icon: "🤝", category: "chess", tier: "gold", xpReward: 200, pointsReward: 500, condition: { type: "chess_stalemate_losing" } },

  // TERMINUS SWARM
  { achievementId: "wave_50", name: "Wave 50", description: "Reach wave 50 in Terminus Swarm", icon: "🌊", category: "swarm", tier: "platinum", xpReward: 400, pointsReward: 1500, condition: { type: "swarm_wave_reached", count: 50 } },
  { achievementId: "untouched_core", name: "Untouched Core", description: "Complete 20 waves without the core taking damage", icon: "🛡️", category: "swarm", tier: "gold", xpReward: 200, pointsReward: 800, condition: { type: "swarm_no_damage_waves", count: 20 } },
  { achievementId: "one_tower_army", name: "One Tower Army", description: "Clear 10 waves using only 1 tower type", icon: "🗼", category: "swarm", tier: "gold", xpReward: 200, pointsReward: 750, condition: { type: "swarm_single_tower_waves", count: 10 }, hidden: true },
  { achievementId: "elemental_master", name: "Elemental Master", description: "Activate all elemental synergy combinations in a single run", icon: "🔮", category: "swarm", tier: "platinum", xpReward: 300, pointsReward: 1000, condition: { type: "swarm_all_synergies" } },
  { achievementId: "source_slayer", name: "Source Slayer", description: "Defeat the Source Avatar boss on first encounter", icon: "⚡", category: "swarm", tier: "gold", xpReward: 250, pointsReward: 800, condition: { type: "swarm_source_first_kill" } },

  // LORE / SOCIAL
  { achievementId: "shadow_tongues_nightmare", name: "Shadow Tongue's Nightmare", description: "Reach Trust 100 with every NPC simultaneously", icon: "👁️", category: "lore", tier: "legendary", xpReward: 1000, pointsReward: 5000, condition: { type: "all_npc_trust_max" }, hidden: true },
  { achievementId: "epoch_zero_complete", name: "Epoch Zero Complete", description: "View all 15 Epoch Zero episodes", icon: "📺", category: "lore", tier: "gold", xpReward: 300, pointsReward: 750, condition: { type: "epoch_zero_episodes", count: 15 } },
  { achievementId: "the_senator_remembers", name: "The Senator Remembers", description: "Trigger all 9 Elara callbacks in a single playthrough", icon: "💬", category: "lore", tier: "legendary", xpReward: 500, pointsReward: 2000, condition: { type: "elara_callbacks", count: 9 }, hidden: true },
  { achievementId: "kaels_regret", name: "Kael's Regret", description: "Reach Trust 100 with The Source choosing compassion every time", icon: "💚", category: "lore", tier: "platinum", xpReward: 400, pointsReward: 1500, condition: { type: "source_compassion_trust_max" }, hidden: true },
  { achievementId: "perfectly_balanced", name: "Perfectly Balanced", description: "Have exactly 0 morality score", icon: "⚖️", category: "lore", tier: "platinum", xpReward: 300, pointsReward: 1000, condition: { type: "morality_zero" }, hidden: true },
  { achievementId: "playing_both_sides", name: "Playing Both Sides", description: "Reach trust 50+ with both Elara and The Human simultaneously", icon: "🎭", category: "lore", tier: "gold", xpReward: 200, pointsReward: 600, condition: { type: "dual_trust_50", target: "elara_human" } },
  { achievementId: "the_betrayed", name: "The Betrayed", description: "Have an apprentice reach Betrayal stage 4", icon: "🗡️", category: "lore", tier: "silver", xpReward: 100, pointsReward: 400, condition: { type: "apprentice_betrayal_stage", count: 4 }, hidden: true },
  { achievementId: "the_merciful", name: "The Merciful", description: "Forgive an apprentice at Betrayal stage 3", icon: "🕊️", category: "lore", tier: "gold", xpReward: 200, pointsReward: 600, condition: { type: "apprentice_forgive_stage3" }, hidden: true },
  { achievementId: "what_have_i_done", name: "What Have I Done", description: "Reach 100 corruption then immediately purge to 0", icon: "🔥", category: "lore", tier: "legendary", xpReward: 500, pointsReward: 2000, condition: { type: "corruption_purge_full" }, hidden: true },
  { achievementId: "canon", name: "Canon", description: "Reach Level 50 and complete the Breaking Point", icon: "📖", category: "lore", tier: "legendary", xpReward: 1000, pointsReward: 5000, condition: { type: "canon_breaking_point" } },

  // FIGHTING GAME
  { achievementId: "combo_master", name: "Combo Master", description: "Land a 20+ hit combo", icon: "💥", category: "fighting", tier: "platinum", xpReward: 300, pointsReward: 800, condition: { type: "fight_combo_hits", count: 20 } },
  { achievementId: "glass_cannon", name: "Glass Cannon", description: "Win a fight with 1 HP remaining", icon: "💔", category: "fighting", tier: "gold", xpReward: 200, pointsReward: 500, condition: { type: "fight_win_1hp" }, hidden: true },
  { achievementId: "pacifist", name: "Pacifist", description: "Win a fight using only blocks and counters", icon: "✋", category: "fighting", tier: "legendary", xpReward: 500, pointsReward: 2000, condition: { type: "fight_blocks_only_win" }, hidden: true },
  { achievementId: "training_complete", name: "Training Complete", description: "Spend 1 hour total in Training Mode", icon: "🥋", category: "fighting", tier: "silver", xpReward: 100, pointsReward: 200, condition: { type: "training_time_minutes", count: 60 } },
  { achievementId: "every_fighter", name: "Every Fighter", description: "Win at least once with every character", icon: "🏅", category: "fighting", tier: "gold", xpReward: 200, pointsReward: 750, condition: { type: "fight_win_all_characters" } },

  // CARD GAME (expanded)
  { achievementId: "david_vs_goliath", name: "David vs Goliath", description: "Win a card battle with only Common cards", icon: "🪨", category: "card", tier: "gold", xpReward: 200, pointsReward: 600, condition: { type: "card_win_commons_only" }, hidden: true },
  { achievementId: "overkill", name: "Overkill", description: "Deal 50+ damage in a single turn", icon: "☄️", category: "card", tier: "gold", xpReward: 200, pointsReward: 500, condition: { type: "card_damage_single_turn", count: 50 } },
  { achievementId: "topdeck_miracle", name: "Topdeck Miracle", description: "Win with 0 cards in hand and 1 HP", icon: "🎴", category: "card", tier: "legendary", xpReward: 500, pointsReward: 2000, condition: { type: "card_topdeck_win" }, hidden: true },

  // GUILD
  { achievementId: "grand_patron", name: "Grand Patron", description: "Reach Grand Patron guild donation tier", icon: "🏦", category: "guild", tier: "gold", xpReward: 200, pointsReward: 600, condition: { type: "guild_donation_tier", target: "grand_patron" } },
  { achievementId: "war_hero", name: "War Hero", description: "Top contributor in an Alliance War victory", icon: "🎖️", category: "guild", tier: "platinum", xpReward: 300, pointsReward: 1000, condition: { type: "alliance_war_top_contributor" } },
  { achievementId: "secret_santa", name: "Secret Santa", description: "Give an NPC their favorite gift without being told what it is", icon: "🎁", category: "guild", tier: "gold", xpReward: 200, pointsReward: 500, condition: { type: "npc_favorite_gift_blind" }, hidden: true },

  // MISC
  { achievementId: "i_remember", name: "I Remember", description: "Visit the Observation Deck between 3:00-3:15 AM real time", icon: "🌌", category: "misc", tier: "platinum", xpReward: 300, pointsReward: 1000, condition: { type: "observation_deck_3am" }, hidden: true },
  { achievementId: "speed_runner", name: "Speed Runner", description: "Complete the Awakening sequence in under 3 minutes", icon: "⏱️", category: "misc", tier: "silver", xpReward: 100, pointsReward: 300, condition: { type: "awakening_speed_run", count: 180 }, hidden: true },
  { achievementId: "degens_nightmare", name: "The Equilibrium", description: "Break exactly even over 1000 casino bets", icon: "⚖️", category: "misc", tier: "legendary", xpReward: 500, pointsReward: 2500, condition: { type: "casino_equilibrium", count: 1000 }, hidden: true },
  { achievementId: "five_albums", name: "The Five Albums", description: "Listen to every track from all five Dischordian Saga albums", icon: "🎵", category: "misc", tier: "gold", xpReward: 300, pointsReward: 750, condition: { type: "listen_all_albums", count: 5 } },
];
