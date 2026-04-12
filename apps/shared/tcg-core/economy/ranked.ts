/**
 * Ranked season configuration — competitive TCG ladder (WS8).
 *
 * Defines the tier structure, ELO parameters, and end-of-season
 * rewards for the ranked matchmaking system.
 */

/* ─── Tier definitions ─── */

export interface RankedTier {
  id: string;
  name: string;
  /** Divisions within the tier (e.g. Gold 3, Gold 2, Gold 1). */
  divisions: number;
  minRating: number;
  maxRating: number;
  icon: string;
  /** Color for UI rendering. */
  color: string;
}

export const RANKED_TIERS: readonly RankedTier[] = Object.freeze([
  { id: "bronze",   name: "Bronze",   divisions: 3, minRating: 0,    maxRating: 399,  icon: "🥉", color: "#cd7f32" },
  { id: "silver",   name: "Silver",   divisions: 3, minRating: 400,  maxRating: 799,  icon: "🥈", color: "#c0c0c0" },
  { id: "gold",     name: "Gold",     divisions: 3, minRating: 800,  maxRating: 1199, icon: "🥇", color: "#ffd700" },
  { id: "diamond",  name: "Diamond",  divisions: 3, minRating: 1200, maxRating: 1599, icon: "💎", color: "#b9f2ff" },
  { id: "master",   name: "Master",   divisions: 1, minRating: 1600, maxRating: 1999, icon: "⭐", color: "#9b59b6" },
  { id: "legend",   name: "Legend",   divisions: 1, minRating: 2000, maxRating: 9999, icon: "👑", color: "#ff4500" },
]);

/**
 * Resolve the tier + division for a given rating.
 * Returns e.g. { tier: "gold", division: 2, displayName: "Gold II" }
 */
export function getTierForRating(rating: number): {
  tier: string;
  division: number;
  displayName: string;
  color: string;
} {
  const clamped = Math.max(0, rating);
  for (const t of RANKED_TIERS) {
    if (clamped >= t.minRating && clamped <= t.maxRating) {
      if (t.divisions === 1) {
        return { tier: t.id, division: 1, displayName: t.name, color: t.color };
      }
      const range = t.maxRating - t.minRating + 1;
      const divSize = Math.floor(range / t.divisions);
      const offset = clamped - t.minRating;
      const div = Math.min(t.divisions, Math.floor(offset / divSize) + 1);
      const roman = ["I", "II", "III"][div - 1] ?? `${div}`;
      return { tier: t.id, division: div, displayName: `${t.name} ${roman}`, color: t.color };
    }
  }
  // Fallback for extremely high ratings.
  return { tier: "legend", division: 1, displayName: "Legend", color: "#ff4500" };
}

/* ─── ELO parameters ─── */

export interface EloConfig {
  /** Base K-factor — higher = more volatile ratings. */
  kFactor: number;
  /** K-factor for new players (first 20 games). */
  provisionalKFactor: number;
  /** Number of games considered "provisional". */
  provisionalGames: number;
  /** Starting rating for new players. */
  startingRating: number;
  /** Floor rating — can't drop below this. */
  floorRating: number;
  /** Win streak bonus: extra points per consecutive win beyond 3. */
  winStreakBonus: number;
}

export const ELO_CONFIG: EloConfig = {
  kFactor: 32,
  provisionalKFactor: 48,
  provisionalGames: 20,
  startingRating: 1000,
  floorRating: 0,
  winStreakBonus: 4,
};

/**
 * Calculate ELO rating change for a match.
 * Pure function — no side effects.
 */
export function calculateEloChange(
  playerRating: number,
  opponentRating: number,
  won: boolean,
  gamesPlayed: number,
  winStreak: number,
): { newRating: number; change: number } {
  const k = gamesPlayed < ELO_CONFIG.provisionalGames
    ? ELO_CONFIG.provisionalKFactor
    : ELO_CONFIG.kFactor;

  const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const actual = won ? 1 : 0;
  let change = Math.round(k * (actual - expected));

  // Win streak bonus.
  if (won && winStreak >= 3) {
    change += ELO_CONFIG.winStreakBonus * (winStreak - 2);
  }

  const newRating = Math.max(ELO_CONFIG.floorRating, playerRating + change);
  return { newRating, change: newRating - playerRating };
}

/* ─── End-of-season rewards per tier ─── */

export interface SeasonReward {
  dreamTokens: number;
  packCredits: number;
  cardBackId?: string;
  titleId?: string;
}

export const SEASON_REWARDS: Record<string, SeasonReward> = {
  bronze:  { dreamTokens: 50,   packCredits: 1 },
  silver:  { dreamTokens: 100,  packCredits: 2 },
  gold:    { dreamTokens: 200,  packCredits: 4, cardBackId: "cb_gold_s1" },
  diamond: { dreamTokens: 400,  packCredits: 6, cardBackId: "cb_diamond_s1", titleId: "title_diamond" },
  master:  { dreamTokens: 800,  packCredits: 10, cardBackId: "cb_master_s1", titleId: "title_master" },
  legend:  { dreamTokens: 1600, packCredits: 20, cardBackId: "cb_legend_s1", titleId: "title_legend" },
};
