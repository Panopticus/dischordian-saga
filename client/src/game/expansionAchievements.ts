/* ═══════════════════════════════════════════════════════
   EXPANSION ACHIEVEMENTS — Cross-Mode, Hidden, and Rare
   50+ new achievements organized by game mode.
   Each achievement has a tier, optional hidden flag,
   and optional unlock reward (cosmetic, title, lore).
   ═══════════════════════════════════════════════════════ */

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "legendary";
export type AchievementCategory =
  | "cross_mode" | "chess" | "card_game" | "terminus_swarm"
  | "casino" | "fighting" | "social" | "lore";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  hidden?: boolean;
  unlockReward?: string;
}

/* ─── CROSS-MODE (Hidden/Rare) ─── */

export const CROSS_MODE_ACHIEVEMENTS: Achievement[] = [
  {
    id: "programmers_ghost",
    name: "The Programmer's Ghost",
    description: "Find all 15 hidden data fragments across Ark rooms.",
    category: "cross_mode", tier: "legendary",
    unlockReward: "The Programmer's personal log — Loredex entry",
  },
  {
    id: "breaking_even",
    name: "Breaking Even",
    description: "Reach exactly 0 net profit/loss across 1,000 casino bets.",
    category: "cross_mode", tier: "legendary", hidden: true,
    unlockReward: "'The Equilibrium' title",
  },
  {
    id: "the_witness_event",
    name: "The Witness",
    description: "Be online when a Living Universe Event triggers.",
    category: "cross_mode", tier: "gold", hidden: true,
    unlockReward: "Unique event-specific cosmetic",
  },
  {
    id: "silence_in_heaven",
    name: "Silence in Heaven",
    description: "Play all 5 albums start to finish without pausing.",
    category: "cross_mode", tier: "legendary", hidden: true,
    unlockReward: "'Two Witnesses' Chosen' title",
  },
  {
    id: "i_remember_everything",
    name: "I Remember Everything",
    description: "Trigger all 9 Elara callbacks in a single playthrough.",
    category: "cross_mode", tier: "legendary", hidden: true,
    unlockReward: "Elara's Senator Voss memory fragment",
  },
  {
    id: "the_betrayed",
    name: "The Betrayed",
    description: "Have an apprentice reach Betrayal stage 4.",
    category: "cross_mode", tier: "gold", hidden: true,
    unlockReward: "'Scarred Commander' title + unique scar cosmetic",
  },
  {
    id: "the_merciful",
    name: "The Merciful",
    description: "Forgive an apprentice at Betrayal stage 3.",
    category: "cross_mode", tier: "gold", hidden: true,
    unlockReward: "'Redeemer' title",
  },
  {
    id: "playing_both_sides",
    name: "Playing Both Sides",
    description: "Reach trust 50+ with BOTH Elara AND The Human simultaneously.",
    category: "cross_mode", tier: "gold",
    unlockReward: "Unique dialog where Elara and The Human argue about you",
  },
  {
    id: "the_editor_was_here",
    name: "The Editor Was Here",
    description: "Notice and report a Shadow Tongue text corruption in the Archives.",
    category: "cross_mode", tier: "gold", hidden: true,
    unlockReward: "Shadow Tongue trust boost (+5)",
  },
  {
    id: "speed_runner",
    name: "Speed Runner",
    description: "Complete the Awakening sequence in under 3 minutes.",
    category: "cross_mode", tier: "silver", hidden: true,
  },
  {
    id: "canon",
    name: "Canon",
    description: "Reach Level 50 and complete the Breaking Point.",
    category: "cross_mode", tier: "legendary",
    unlockReward: "Your name in the Ark's foundational memory",
  },
];

/* ─── CHESS ─── */

export const CHESS_ACHIEVEMENTS: Achievement[] = [
  { id: "scholars_mate", name: "Scholar's Mate", description: "Win in 4 moves or fewer.", category: "chess", tier: "gold" },
  { id: "the_long_game", name: "The Long Game", description: "Win a match lasting 100+ moves.", category: "chess", tier: "silver" },
  { id: "architects_gambit", name: "Architect's Gambit Accepted", description: "Beat The Architect (highest AI).", category: "chess", tier: "platinum" },
  { id: "stalemate_specialist", name: "Stalemate Specialist", description: "Force a stalemate from a losing position.", category: "chess", tier: "gold" },
  { id: "humans_opening", name: "The Human's Opening", description: "Win using the Queen's Gambit (The Human's favorite).", category: "chess", tier: "silver" },
  { id: "immortal_game", name: "Immortal Game", description: "Sacrifice your queen and still win.", category: "chess", tier: "legendary" },
];

/* ─── CARD GAME ─── */

export const CARD_GAME_ACHIEVEMENTS: Achievement[] = [
  { id: "david_vs_goliath", name: "David vs Goliath", description: "Win a card battle with only Common cards in your deck.", category: "card_game", tier: "gold" },
  { id: "full_collection", name: "Full Collection", description: "Own at least 1 copy of every card.", category: "card_game", tier: "legendary" },
  { id: "architect_deck", name: "The Architect's Deck", description: "Win 10 matches using only Architect-faction cards.", category: "card_game", tier: "silver" },
  { id: "dreamer_deck", name: "The Dreamer's Deck", description: "Win 10 matches using only Dreamer-faction cards.", category: "card_game", tier: "silver" },
  { id: "overkill", name: "Overkill", description: "Deal 50+ damage in a single turn.", category: "card_game", tier: "gold" },
  { id: "topdeck_miracle", name: "Topdeck Miracle", description: "Win when you have 0 cards in hand and 1 HP.", category: "card_game", tier: "legendary", hidden: true },
];

/* ─── TERMINUS SWARM ─── */

export const TERMINUS_ACHIEVEMENTS: Achievement[] = [
  { id: "wave_50", name: "Wave 50", description: "Reach wave 50.", category: "terminus_swarm", tier: "platinum" },
  { id: "untouched_core", name: "Untouched Core", description: "Complete 20 waves without the core taking damage.", category: "terminus_swarm", tier: "gold" },
  { id: "one_tower_army", name: "One Tower Army", description: "Clear 10 waves using only 1 tower type.", category: "terminus_swarm", tier: "gold" },
  { id: "elemental_master", name: "Elemental Master", description: "Activate all elemental synergy combinations in a single run.", category: "terminus_swarm", tier: "platinum" },
  { id: "source_slayer", name: "The Source Slayer", description: "Defeat the Source Avatar (wave 20 boss) on first encounter.", category: "terminus_swarm", tier: "gold" },
];

/* ─── FIGHTING GAME ─── */

export const FIGHTING_ACHIEVEMENTS: Achievement[] = [
  { id: "combo_master", name: "Combo Master", description: "Land a 20+ hit combo.", category: "fighting", tier: "platinum" },
  { id: "pacifist", name: "Pacifist", description: "Win a fight using only blocks and counters.", category: "fighting", tier: "legendary", hidden: true },
  { id: "glass_cannon", name: "Glass Cannon", description: "Win with 1 HP remaining.", category: "fighting", tier: "gold" },
  { id: "training_complete", name: "Training Complete", description: "Spend 1 hour total in Training Mode.", category: "fighting", tier: "silver" },
  { id: "every_fighter", name: "Every Fighter", description: "Win at least once with every character.", category: "fighting", tier: "gold" },
];

/* ─── SOCIAL/GUILD ─── */

export const SOCIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "grand_patron", name: "Grand Patron", description: "Reach Grand Patron guild donation tier.", category: "social", tier: "gold" },
  { id: "war_hero", name: "War Hero", description: "Top contributor in an Alliance War victory.", category: "social", tier: "platinum" },
  { id: "the_diplomat_ach", name: "The Diplomat", description: "Reach trust 40+ with all 8 NPCs (including The Degen).", category: "social", tier: "legendary" },
  { id: "gift_giver", name: "Gift Giver", description: "Give a gift to every NPC.", category: "social", tier: "silver" },
  { id: "secret_santa", name: "Secret Santa", description: "Give an NPC their favorite gift without being told what it is.", category: "social", tier: "gold", hidden: true },
];

/* ─── LORE/EXPLORATION ─── */

export const LORE_ACHIEVEMENTS: Achievement[] = [
  { id: "epoch_zero_complete", name: "Epoch Zero Complete", description: "View all 15 Epoch Zero episodes.", category: "lore", tier: "gold" },
  { id: "human_origin", name: "The Human Origin", description: "Complete the full Human origin chain (Spaces Between).", category: "lore", tier: "platinum" },
  { id: "meta_solution", name: "Meta Solution", description: "Solve the meta-puzzle across all 8 room puzzles.", category: "lore", tier: "legendary" },
  { id: "antiquarians_apprentice", name: "Antiquarian's Apprentice", description: "Discover all alternate timeline entries.", category: "lore", tier: "platinum" },
  { id: "tome_collector", name: "Tome Collector", description: "Complete all 33 CoNexus tomes.", category: "lore", tier: "legendary" },
];

/* ─── ALL ACHIEVEMENTS ─── */

export const ALL_EXPANSION_ACHIEVEMENTS: Achievement[] = [
  ...CROSS_MODE_ACHIEVEMENTS,
  ...CHESS_ACHIEVEMENTS,
  ...CARD_GAME_ACHIEVEMENTS,
  ...TERMINUS_ACHIEVEMENTS,
  ...FIGHTING_ACHIEVEMENTS,
  ...SOCIAL_ACHIEVEMENTS,
  ...LORE_ACHIEVEMENTS,
];

/** Look up an achievement by id */
export function getAchievement(id: string): Achievement | undefined {
  return ALL_EXPANSION_ACHIEVEMENTS.find(a => a.id === id);
}

/** Get all achievements for a category */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ALL_EXPANSION_ACHIEVEMENTS.filter(a => a.category === category);
}

/** Get all hidden achievements */
export function getHiddenAchievements(): Achievement[] {
  return ALL_EXPANSION_ACHIEVEMENTS.filter(a => a.hidden);
}
