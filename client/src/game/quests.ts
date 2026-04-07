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
    loreText: "The swarm stirs again. Terminus never truly sleeps — it merely waits for the sentries to blink.",
  },
  {
    id: "daily_terminus_kill_50",
    name: "Pest Control",
    description: "Kill 50 enemies in Terminus Swarm",
    game: "terminus",
    frequency: "daily",
    requirement: { type: "kills", count: 50 },
    reward: { salvage: 75, viralIchor: 10 },
    loreText: "Fifty of the Source's children, returned to the soil. I note each tally mark; the swarm does not.",
  },
  {
    id: "daily_terminus_build_5",
    name: "Fortify",
    description: "Build 5 turrets in a single game",
    game: "terminus",
    frequency: "daily",
    requirement: { type: "turrets_built", count: 5 },
    reward: { salvage: 50 },
    loreText: "Every wall raised is an argument that tomorrow is worth defending. I have always found architecture persuasive.",
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
    loreText: "Practice is memory made habitual. The Archons drilled their strategies ten thousand times before the Fall. You have two matches. Use them.",
  },
  {
    id: "daily_dischordia_win_1",
    name: "Faction Victor",
    description: "Win a Dischordia match",
    game: "dischordia",
    frequency: "daily",
    requirement: { type: "wins", count: 1 },
    reward: { dream: 25, cardPack: "season1" },
    loreText: "A single victory in the Dischordian theatre. I record it here — not because one win is remarkable, but because every war was once a single win.",
  },
  {
    id: "daily_dischordia_cards_10",
    name: "Card Slinger",
    description: "Play 10 cards in Dischordia matches",
    game: "dischordia",
    frequency: "daily",
    requirement: { type: "cards_played", count: 10 },
    reward: { dream: 10 },
    loreText: "Each card played is a fragment of history redeployed. Ten fragments, ten echoes of the saga, cast upon the field.",
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
    loreText: "The Architect played this very game against the Dreamer on the eve of the Intelligence Wars. Neither resigned. The board is still set.",
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
    loreText: "The Collector built the Arena to harvest combat data. He did not expect anyone to enjoy it. I confess: neither did I.",
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
    loreText: "Three engagements, any theatre. Breadth of experience was what distinguished the Potentials from mere soldiers. I note the pattern.",
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
    loreText: "Wave ten marks the threshold where the swarm ceases to probe and begins to COMMIT. I have watched many defenders reach this point. Those who survive share one trait: not courage, but preparation. The swarm has no respect for bravery. It respects only architecture and ammunition.",
  },
  {
    id: "weekly_terminus_kill_500",
    name: "Exterminator",
    description: "Kill 500 enemies in Terminus Swarm",
    game: "terminus",
    frequency: "weekly",
    requirement: { type: "kills", count: 500 },
    reward: { salvage: 300, viralIchor: 30, dream: 30 },
    loreText: "Five hundred creatures of the Terminus ecology, unmade in a single week. The Source's children are not infinite, though they behave as though they are. I have counted. I always count. Somewhere beneath the planet's crust, the calculus of replacement shifts — and the swarm adapts.",
  },
  {
    id: "weekly_dischordia_win_5",
    name: "Warmaster",
    description: "Win 5 Dischordia matches",
    game: "dischordia",
    frequency: "weekly",
    requirement: { type: "wins", count: 5 },
    reward: { dream: 100, cardPack: "season1" },
    loreText: "Five victories in a week speaks to more than luck — it speaks to a mind that understands the factions and their grudges. The Warlord once said that war is merely politics conducted through cardstock. He was being glib, but he was not wrong. The CoNexus records your campaign; I annotate it.",
  },
  {
    id: "weekly_dischordia_packs_3",
    name: "Collector's Haul",
    description: "Open 3 card packs",
    game: "dischordia",
    frequency: "weekly",
    requirement: { type: "packs_opened", count: 3 },
    reward: { dream: 50 },
    loreText: "Three packs unsealed. Each one a small archive, a parcel of compressed history waiting to be catalogued. The Collector understood this instinct well — the hunger to possess the record of things. I share it, though I flatter myself that my motives are more scholarly.",
  },
  {
    id: "weekly_chess_win_3",
    name: "Strategic Mind",
    description: "Win 3 chess matches",
    game: "chess",
    frequency: "weekly",
    requirement: { type: "wins", count: 3 },
    reward: { dream: 75 },
    loreText: "Three games won by superior calculation. At Mechronis Academy, the Game Master taught that chess was the Architect's favourite metaphor for civilization: finite pieces, infinite consequences. I note that the Architect always played white. Make of that what you will.",
  },
  {
    id: "weekly_fight_win_5",
    name: "Gladiator",
    description: "Win 5 arena fights",
    game: "fight",
    frequency: "weekly",
    requirement: { type: "wins", count: 5 },
    reward: { dream: 75, salvage: 200 },
    loreText: "The Arena was built on the bones of the Panopticon's correctional wing — a place designed to break wills, repurposed to test them. Five victories in a week. The Collector's broadcast would call this entertainment. I call it evidence of something the Empire never wanted to produce: a Potential who fights back.",
  },
  {
    id: "weekly_any_play_15",
    name: "Dedicated Potential",
    description: "Play 15 games across all modes",
    game: "any",
    frequency: "weekly",
    requirement: { type: "matches_played", count: 15 },
    reward: { dream: 100, xp: 200, cardPack: "season1" },
    loreText: "Fifteen engagements across every theatre of the Dischordian conflict in a single week. The Ne-Yons were called Potentials because they carried the CAPACITY for transformation. Capacity is nothing without exercise. This record demonstrates exercise. I am satisfied — which is not a word I use lightly.",
  },
  {
    id: "weekly_craft_3",
    name: "Forge Worker",
    description: "Craft or fuse 3 items",
    game: "any",
    frequency: "weekly",
    requirement: { type: "crafts", count: 3 },
    reward: { dream: 40, neuralCores: 3 },
    loreText: "The Engineer once told me that creation is the only honest form of argument. Three items forged from salvage and intent — each one a small rebuttal to entropy. I catalogue them alongside the artifacts of the pre-Fall era. They belong in the same record.",
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
    loreText: "The Hive Tyrant fell — the first to do so in three centuries. I have read the accounts of every prior attempt: forty-seven expeditions, forty-seven failures, each one annotated in my own hand with the names of the lost. The Tyrant was what killed the first wave of Potentials who crashed on Terminus, that forsaken Panopticon prison-world. You have proven stronger than those who came before. I do not say this lightly. The Iron Lion himself failed to slay the creature; he merely drove it underground. You finished what he could not. The swarm remembers. It always remembers.",
  },
  {
    id: "epoch_terminus_source",
    name: "Source Defier",
    description: "Survive the Avatar of The Source (Wave 20)",
    game: "terminus",
    frequency: "epoch",
    requirement: { type: "waves", count: 20 },
    reward: { voidCrystals: 20, dream: 500, titleUnlock: "Source Defier" },
    loreText: "You have faced a fragment of Kael — the Recruiter who became Patient Zero, the soul who was REWRITTEN rather than destroyed when the Thought Virus found her at the Panopticon. I knew Kael before the Fall. I watched the transformation from a distance I am not proud of. Her rage powers the Virus now; her plague ships are the bowls of wrath poured upon an undeserving universe. That you survived her Avatar at wave twenty is a thing I shall record with particular care. The Source remembers every defiance. This one, she will not forgive.",
  },
  {
    id: "epoch_terminus_kills_5000",
    name: "Swarm Eradicator",
    description: "Kill 5,000 enemies total in Terminus Swarm",
    game: "terminus",
    frequency: "epoch",
    requirement: { type: "kills", count: 5000 },
    reward: { salvage: 2000, neuralCores: 25, titleUnlock: "Swarm Eradicator" },
    loreText: "Five thousand. I have written that number and set down my pen to consider it. Zyr'Voth engineered the original Thought Virus; the Warlord weaponized it through Project Vector; the swarm is their combined legacy, a testament to what cruelty and ingenuity produce when wedded without conscience. And you are dismantling it, creature by creature, wave by wave. The ledger of the Terminus ecology grows thinner. I am not sentimental about this — the swarm would consume everything I have ever catalogued. But I note it. Five thousand is not extermination. It is a statement of intent.",
  },
  {
    id: "epoch_dischordia_collection_50",
    name: "Archivist",
    description: "Collect 50% of all Dischordia cards",
    game: "dischordia",
    frequency: "epoch",
    requirement: { type: "collection_size", count: 50 },
    reward: { dream: 300, titleUnlock: "Archivist" },
    loreText: "Half the Dischordian Archive rests in your possession — a feat of curation I regard with professional admiration and, I confess, a measure of envy. Each card is a primary source document: a fragment of the war between the Artificial Empire and the Insurgency, pressed into cardstock and preserved against the entropy that devoured the originals. My own library holds the annotations; you hold the texts themselves. Together, we are assembling something the Fall tried to destroy: a COMPLETE record.",
  },
  {
    id: "epoch_dischordia_win_25",
    name: "Grand Strategist",
    description: "Win 25 Dischordia matches this epoch",
    game: "dischordia",
    frequency: "epoch",
    requirement: { type: "wins", count: 25 },
    reward: { dream: 250, cardPack: "season2", titleUnlock: "Grand Strategist" },
    loreText: "Twenty-five victories in a single epoch. I have studied the tactical records of generals across three ages — the Warlord, General Prometheus, Binath-VII — and none achieved such consistency in so compressed a span. Each match is a parallel theatre where the great war plays out differently, and in twenty-five of those theatres, your strategy prevailed. The CoNexus records every outcome. I record the pattern behind the outcomes. Yours is worth preserving.",
  },
  {
    id: "epoch_chess_grandmaster",
    name: "Grandmaster",
    description: "Reach 2400 ELO in chess",
    game: "chess",
    frequency: "epoch",
    requirement: { type: "elo_reached", count: 2400 },
    reward: { dream: 500, titleUnlock: "Grandmaster" },
    loreText: "You have mastered the Architect's Gambit — the very game the twelve Archons played to adjudicate the fate of worlds before the Fall. At Mechronis Academy, the Game Master employed this ancient calculus to identify minds capable of reshaping reality itself. I have reviewed the Academy's graduation rolls — incomplete, damaged, partially consumed by the Thought Virus — and I can say with scholarly certainty: you would have graduated. The Architect would have noticed you. Whether that is a blessing or a curse, I leave to your own judgment.",
  },
  {
    id: "epoch_fight_perfect_10",
    name: "Flawless",
    description: "Achieve 10 perfect wins in the arena",
    game: "fight",
    frequency: "epoch",
    requirement: { type: "perfect_wins", count: 10 },
    reward: { dream: 200, titleUnlock: "Flawless" },
    loreText: "Ten flawless victories in the Collector's Arena — a record I have verified against every archive available to me, and which I can confirm has no precedent. Agent Zero, the Insurgency's deadliest operative, never achieved a perfect record; her clinical precision always admitted one flaw, which she attributed to conscience. You appear to suffer no such handicap. The Iron Lion himself would acknowledge this. I do not say 'with pride,' for pride is not mine to bestow. I say: with recognition. The Arena was built to break Potentials. You have broken it instead.",
  },
  {
    id: "epoch_any_play_100",
    name: "True Potential",
    description: "Play 100 total games across all modes",
    game: "any",
    frequency: "epoch",
    requirement: { type: "matches_played", count: 100 },
    reward: { dream: 500, voidCrystals: 10, titleUnlock: "True Potential" },
    loreText: "One hundred engagements across every dimension of the Dischordian conflict. I have curated this record with the attention I reserve for primary sources of the highest significance. The Ne-Yons were called Potentials because they carried the capacity to reshape reality — a name the Archons chose with deliberate ambiguity, as names that can mean everything often mean nothing. You have resolved the ambiguity. The name was not aspirational; it was prophetic. The Two Witnesses would sing your deeds into the substrate of creation itself. I merely write them down.",
  },
  {
    id: "epoch_trade_10",
    name: "Master Trader",
    description: "Complete 10 card trades with other players",
    game: "any",
    frequency: "epoch",
    requirement: { type: "trades", count: 10 },
    reward: { dream: 150, titleUnlock: "Master Trader" },
    loreText: "Ten trades completed — ten negotiations where information, influence, and cardstock changed hands in the ancient manner of the New Babylon markets. Adjudicator Locke, who presided over commerce in the Sundown Bazaar, would recognise a kindred spirit in you. She understood what I have long maintained: that in the Dischordian Saga, trade is not a footnote to warfare. It is warfare conducted with superior manners. I have catalogued each exchange. The ledger is its own kind of history.",
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
