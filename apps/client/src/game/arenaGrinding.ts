/* ═══════════════════════════════════════════════════════
   ARENA GRINDING — Card-Based Arena Rotation Mode

   Players rotate through their card collection battling
   AI opponents. Each card fights once per 24h rotation.
   Points earn milestone rewards and place on the
   seasonal leaderboard.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ArenaDifficulty = "easy" | "medium" | "hard" | "brutal";

export interface ArenaOpponent {
  id: string;
  name: string;
  difficulty: ArenaDifficulty;
  power: number;
  cardIds: string[];
  bonusPointMultiplier: number;
  portraitKey: string;
}

export interface ArenaRun {
  runId: string;
  seasonId: string;
  playerId: string;
  usedCardIds: string[];
  pointsEarned: number;
  winsCount: number;
  lossesCount: number;
  rotationResetAt: number; // epoch ms — next 24h window
}

export interface ArenaReward {
  threshold: number;
  rewardType: "credits" | "shards" | "card_pack" | "cosmetic" | "title";
  rewardId: string;
  rewardName: string;
  claimed: boolean;
}

export interface ArenaLeaderboardEntry {
  playerId: string;
  playerName: string;
  seasonId: string;
  totalPoints: number;
  totalWins: number;
  rank: number;
}

export interface ArenaSeason {
  seasonId: string;
  name: string;
  startDate: number;
  endDate: number;
  milestoneRewards: ArenaReward[];
}

/* ─── CONSTANTS ─── */

const RARITY_POINT_BASE: Record<CardRarity, number> = {
  common: 5,
  uncommon: 10,
  rare: 20,
  epic: 35,
  legendary: 50,
};

const DIFFICULTY_MULTIPLIER: Record<ArenaDifficulty, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  brutal: 3.0,
};

const ROTATION_DURATION_MS = 24 * 60 * 60 * 1000;

const MILESTONE_THRESHOLDS: ArenaReward[] = [
  { threshold: 100, rewardType: "credits", rewardId: "arena_100", rewardName: "Arena Initiate Purse", claimed: false },
  { threshold: 500, rewardType: "shards", rewardId: "arena_500", rewardName: "Shard Cache", claimed: false },
  { threshold: 1000, rewardType: "card_pack", rewardId: "arena_1000", rewardName: "Arena Champion Pack", claimed: false },
  { threshold: 5000, rewardType: "cosmetic", rewardId: "arena_5000", rewardName: "Gladiator Frame", claimed: false },
  { threshold: 10000, rewardType: "title", rewardId: "arena_10000", rewardName: "Title: Arena Legend", claimed: false },
];

/* ─── FUNCTIONS ─── */

export function generateOpponent(difficulty: ArenaDifficulty): ArenaOpponent {
  const basePower = { easy: 100, medium: 250, hard: 500, brutal: 900 };
  const variance = Math.floor(Math.random() * 50) - 25;
  const names: Record<ArenaDifficulty, string[]> = {
    easy: ["Novice Fighter", "Training Dummy MkII", "Sparring Bot"],
    medium: ["Arena Regular", "Seasoned Duelist", "Iron Contender"],
    hard: ["Veteran Gladiator", "Scarred Champion", "Void Berserker"],
    brutal: ["Arena Overlord", "The Unbroken", "Terminus Nightmare"],
  };
  const pool = names[difficulty];
  const name = pool[Math.floor(Math.random() * pool.length)];

  return {
    id: `opp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    difficulty,
    power: basePower[difficulty] + variance,
    cardIds: [],
    bonusPointMultiplier: DIFFICULTY_MULTIPLIER[difficulty],
    portraitKey: `portrait_${difficulty}`,
  };
}

export function calculateArenaPoints(
  cardRarity: CardRarity,
  opponentDifficulty: ArenaDifficulty,
  won: boolean,
): number {
  if (!won) return Math.floor(RARITY_POINT_BASE[cardRarity] * 0.2);
  return Math.floor(
    RARITY_POINT_BASE[cardRarity] * DIFFICULTY_MULTIPLIER[opponentDifficulty],
  );
}

export function getArenaRewards(totalPoints: number): ArenaReward[] {
  return MILESTONE_THRESHOLDS.map((m) => ({
    ...m,
    claimed: false,
  })).filter((m) => totalPoints >= m.threshold);
}

export function isRotationActive(run: ArenaRun): boolean {
  return Date.now() < run.rotationResetAt;
}

export function canCardFight(cardId: string, run: ArenaRun): boolean {
  return !run.usedCardIds.includes(cardId) && isRotationActive(run);
}

export function createArenaRun(playerId: string, seasonId: string): ArenaRun {
  return {
    runId: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    seasonId,
    playerId,
    usedCardIds: [],
    pointsEarned: 0,
    winsCount: 0,
    lossesCount: 0,
    rotationResetAt: Date.now() + ROTATION_DURATION_MS,
  };
}
