/* ═══════════════════════════════════════════════════════
   DYNAMIC DIFFICULTY ADJUSTMENT (DDA) ENGINE
   Adapts fight AI, chess ELO, and terminus wave params
   based on rolling player performance.
   ═══════════════════════════════════════════════════════ */

export interface PlayerPerformance {
  recentWins: number;        // wins in last 10 games
  recentLosses: number;      // losses in last 10 games
  averageMargin: number;     // how decisively they win/lose (HP remaining %, 0-1)
  winStreak: number;         // current consecutive wins
  loseStreak: number;        // current consecutive losses
  totalGamesPlayed: number;
  currentDifficulty: number; // 0.0-1.0 scale
}

/** Default performance for a brand-new player. */
export function createDefaultPerformance(): PlayerPerformance {
  return {
    recentWins: 0,
    recentLosses: 0,
    averageMargin: 0,
    winStreak: 0,
    loseStreak: 0,
    totalGamesPlayed: 0,
    currentDifficulty: 0.3,
  };
}

/* ─── Constants ─── */

const MAX_ADJUSTMENT = 0.1;
const MIN_DIFFICULTY = 0.0;
const MAX_DIFFICULTY = 1.0;
const DEFAULT_DIFFICULTY = 0.3;

// Thresholds
const WIN_STREAK_THRESHOLD = 3;       // consecutive wins before nudge up
const LOSE_STREAK_THRESHOLD = 2;      // consecutive losses before nudge down
const DOMINANT_MARGIN = 0.5;          // >50% HP remaining = dominant win
const CLOSE_MATCH_MARGIN = 0.2;       // within 20% HP = close match

/* ─── Core DDA Algorithm ─── */

/**
 * Calculate the difficulty adjustment to apply after a match.
 *
 * Rules:
 * - After 3+ consecutive wins with >50% HP remaining avg: nudge UP
 * - After 2+ consecutive losses: nudge DOWN
 * - Close matches (margin within 20%): maintain (return 0)
 * - Never adjust more than ±0.1 per match
 * - Result is clamped so difficulty stays in [0.0, 1.0]
 */
export function calculateDifficultyAdjustment(perf: PlayerPerformance): number {
  // Close matches — the system is well-calibrated, hold steady
  if (perf.averageMargin <= CLOSE_MATCH_MARGIN && perf.winStreak < WIN_STREAK_THRESHOLD && perf.loseStreak < LOSE_STREAK_THRESHOLD) {
    return 0;
  }

  let adjustment = 0;

  // Dominant win streaks push difficulty up
  if (perf.winStreak >= WIN_STREAK_THRESHOLD && perf.averageMargin > DOMINANT_MARGIN) {
    // Scale adjustment by how far above threshold they are, capped at MAX_ADJUSTMENT
    const streakFactor = Math.min(1, (perf.winStreak - WIN_STREAK_THRESHOLD + 1) / 3);
    const marginFactor = Math.min(1, (perf.averageMargin - DOMINANT_MARGIN) * 2);
    adjustment = MAX_ADJUSTMENT * (0.5 + 0.5 * streakFactor) * (0.5 + 0.5 * marginFactor);
  }
  // Losing streaks push difficulty down
  else if (perf.loseStreak >= LOSE_STREAK_THRESHOLD) {
    const streakFactor = Math.min(1, (perf.loseStreak - LOSE_STREAK_THRESHOLD + 1) / 3);
    adjustment = -MAX_ADJUSTMENT * (0.5 + 0.5 * streakFactor);
  }

  // Clamp adjustment magnitude
  adjustment = Math.max(-MAX_ADJUSTMENT, Math.min(MAX_ADJUSTMENT, adjustment));

  // Clamp resulting difficulty
  const newDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, perf.currentDifficulty + adjustment));
  return newDifficulty - perf.currentDifficulty;
}

/**
 * Update performance after a match result.
 * @param current  Current performance state
 * @param won      Whether the player won
 * @param margin   HP remaining as fraction 0-1 (for winner)
 */
export function updatePerformance(
  current: PlayerPerformance,
  won: boolean,
  margin: number,
): PlayerPerformance {
  const clampedMargin = Math.max(0, Math.min(1, margin));

  // Rolling average margin over recent window (exponential smoothing)
  const alpha = current.totalGamesPlayed === 0 ? 1 : 0.3;
  const newAvgMargin = current.averageMargin * (1 - alpha) + clampedMargin * alpha;

  // Track recent wins/losses (simple sliding window approximation)
  const decayFactor = current.totalGamesPlayed < 10 ? 0 : 0.1;
  const newRecentWins = Math.max(0, current.recentWins * (1 - decayFactor) + (won ? 1 : 0));
  const newRecentLosses = Math.max(0, current.recentLosses * (1 - decayFactor) + (won ? 0 : 1));

  const updatedPerf: PlayerPerformance = {
    recentWins: newRecentWins,
    recentLosses: newRecentLosses,
    averageMargin: newAvgMargin,
    winStreak: won ? current.winStreak + 1 : 0,
    loseStreak: won ? 0 : current.loseStreak + 1,
    totalGamesPlayed: current.totalGamesPlayed + 1,
    currentDifficulty: current.currentDifficulty,
  };

  // Apply DDA adjustment
  const adjustment = calculateDifficultyAdjustment(updatedPerf);
  updatedPerf.currentDifficulty = Math.max(
    MIN_DIFFICULTY,
    Math.min(MAX_DIFFICULTY, updatedPerf.currentDifficulty + adjustment),
  );

  return updatedPerf;
}

/* ─── Mapping Functions ─── */

/**
 * Map 0.0-1.0 difficulty to the 2D fight AI tier.
 * recruit:  0.00-0.24
 * soldier:  0.25-0.49
 * veteran:  0.50-0.74
 * archon:   0.75-1.00
 */
export function mapDifficultyToFightAI(
  difficulty: number,
): "recruit" | "soldier" | "veteran" | "archon" {
  const d = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));
  if (d < 0.25) return "recruit";
  if (d < 0.50) return "soldier";
  if (d < 0.75) return "veteran";
  return "archon";
}

/**
 * Map 0.0-1.0 difficulty to a Stockfish-equivalent ELO (400-2200).
 * Linear interpolation within the range.
 */
export function mapDifficultyToChessElo(difficulty: number): number {
  const d = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));
  const minElo = 400;
  const maxElo = 2200;
  return Math.round(minElo + d * (maxElo - minElo));
}

/**
 * Map 0.0-1.0 difficulty to terminus wave parameters.
 * - spawnRate:       multiplier on spawn delay (lower = faster spawns). Range 0.5-1.5
 * - enemyHpMultiplier: multiplier on enemy HP. Range 0.6-2.0
 * - bossFrequency:   how often boss waves appear (every N waves). Range 3-10
 */
export function mapDifficultyToTerminusWaves(difficulty: number): {
  spawnRate: number;
  enemyHpMultiplier: number;
  bossFrequency: number;
} {
  const d = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));

  // spawnRate: at d=0 enemies spawn slowly (1.5x delay), at d=1 they spawn fast (0.5x delay)
  const spawnRate = 1.5 - d * 1.0;

  // enemyHpMultiplier: at d=0 enemies are fragile (0.6x), at d=1 they're tanky (2.0x)
  const enemyHpMultiplier = 0.6 + d * 1.4;

  // bossFrequency: at d=0 bosses every 10 waves, at d=1 bosses every 3 waves
  const bossFrequency = Math.round(10 - d * 7);

  return {
    spawnRate: Math.round(spawnRate * 100) / 100,
    enemyHpMultiplier: Math.round(enemyHpMultiplier * 100) / 100,
    bossFrequency: Math.max(3, Math.min(10, bossFrequency)),
  };
}
