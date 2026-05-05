/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT AUTO-TRACKER — Server-side helper to track
   achievement progress from any game action.

   Routes by key:
     - CARD_ACHIEVEMENTS keys (from cardAchievements.ts) → write to
       cardGameAchievements (existing behavior).
     - marketAchievements stat-types (e.g. "market_listings",
       "market_purchases", "market_sales") → recompute running totals
       from marketplace tables via marketStatsService and unlock any
       ACHIEVEMENT_DEFS whose condition is met. Writes to
       userAchievements.

   Phase I of the build-everything pass un-deprecated marketAchievements
   by routing the marketplace router's existing trackIncrement calls
   through this dispatcher.
   ═══════════════════════════════════════════════════════ */
import { eq, and, sql } from "drizzle-orm";
import { getDb } from "./db";
import { cardGameAchievements, userCards, dreamBalance, userAchievements } from "../db/schema";
import { CARD_ACHIEVEMENTS, type CardAchievementDef } from "./routers/cardAchievements";
import { ACHIEVEMENT_DEFS as MARKET_ACHIEVEMENT_DEFS } from "./routers/marketAchievements";
import { computeMarketStats } from "./services/marketStatsService";

const achievementMap = new Map<string, CardAchievementDef>(
  CARD_ACHIEVEMENTS.map(a => [a.key, a])
);

/** Stat-types referenced by marketAchievements ACHIEVEMENT_DEFS
 *  conditions. Any trackIncrement call with one of these keys is
 *  routed to the marketAchievements unlock path instead of the
 *  card-game-achievements path. */
const MARKET_STAT_KEYS = new Set<string>(
  MARKET_ACHIEVEMENT_DEFS.map((a) => a.condition.type as string),
);

/**
 * Increment progress for an achievement. Creates the row if it doesn't exist.
 * Returns { newlyCompleted } if the achievement was just completed.
 */
export async function trackIncrement(
  userId: number,
  achievementKey: string,
  amount: number = 1,
): Promise<{ newlyCompleted: boolean; progress: number }> {
  // marketAchievements branch — when the key is a stat-type that
  // marketAchievements conditions read against, recompute totals from
  // source tables and unlock any defs whose condition is met. Returns
  // a normalized shape so the existing call sites don't have to know
  // which registry resolved the key.
  if (MARKET_STAT_KEYS.has(achievementKey)) {
    const result = await unlockMarketAchievementsByStat(userId, achievementKey);
    return result;
  }

  const def = achievementMap.get(achievementKey);
  if (!def) return { newlyCompleted: false, progress: 0 };

  try {
    const db = await getDb();
    if (!db) return { newlyCompleted: false, progress: 0 };

    const [existing] = await db.select().from(cardGameAchievements)
      .where(and(
        eq(cardGameAchievements.userId, userId),
        eq(cardGameAchievements.achievementKey, achievementKey),
      )).limit(1);

    if (existing) {
      if (existing.completed === 1) return { newlyCompleted: false, progress: existing.progress };
      const newProgress = Math.min(existing.progress + amount, def.target);
      const nowComplete = newProgress >= def.target;
      await db.update(cardGameAchievements)
        .set({
          progress: newProgress,
          completed: nowComplete ? 1 : 0,
          completedAt: nowComplete ? new Date() : null,
        })
        .where(eq(cardGameAchievements.id, existing.id));
      return { newlyCompleted: nowComplete, progress: newProgress };
    } else {
      const progress = Math.min(amount, def.target);
      const completed = progress >= def.target;
      await db.insert(cardGameAchievements).values({
        userId,
        achievementKey,
        progress,
        target: def.target,
        completed: completed ? 1 : 0,
        completedAt: completed ? new Date() : null,
      });
      return { newlyCompleted: completed, progress };
    }
  } catch (e) {
    console.error(`[AchievementTracker] Error tracking ${achievementKey} for user ${userId}:`, e);
    return { newlyCompleted: false, progress: 0 };
  }
}

/**
 * Set progress to an absolute value (for rank achievements, collection counts).
 */
export async function trackSet(
  userId: number,
  achievementKey: string,
  value: number,
): Promise<{ newlyCompleted: boolean; progress: number }> {
  const def = achievementMap.get(achievementKey);
  if (!def) return { newlyCompleted: false, progress: 0 };

  try {
    const db = await getDb();
    if (!db) return { newlyCompleted: false, progress: 0 };

    const completed = value >= def.target;

    const [existing] = await db.select().from(cardGameAchievements)
      .where(and(
        eq(cardGameAchievements.userId, userId),
        eq(cardGameAchievements.achievementKey, achievementKey),
      )).limit(1);

    if (existing) {
      if (existing.completed === 1) return { newlyCompleted: false, progress: existing.progress };
      await db.update(cardGameAchievements)
        .set({
          progress: value,
          completed: completed ? 1 : 0,
          completedAt: completed ? new Date() : null,
        })
        .where(eq(cardGameAchievements.id, existing.id));
      return { newlyCompleted: completed, progress: value };
    } else {
      await db.insert(cardGameAchievements).values({
        userId,
        achievementKey,
        progress: value,
        target: def.target,
        completed: completed ? 1 : 0,
        completedAt: completed ? new Date() : null,
      });
      return { newlyCompleted: completed, progress: value };
    }
  } catch (e) {
    console.error(`[AchievementTracker] Error setting ${achievementKey} for user ${userId}:`, e);
    return { newlyCompleted: false, progress: 0 };
  }
}

/**
 * Track PvP match result — updates win count, streak, and rank achievements.
 * Called after a PvP match completes.
 */
export async function trackPvpResult(
  userId: number,
  won: boolean,
  newWinStreak: number,
  newRankTier: string,
  totalWins: number,
): Promise<string[]> {
  const completed: string[] = [];

  if (won) {
    // Win count achievements
    for (const key of ["first_blood", "pvp_wins_10", "pvp_wins_50", "pvp_wins_100", "pvp_wins_500"]) {
      const result = await trackSet(userId, key, totalWins);
      if (result.newlyCompleted) completed.push(key);
    }

    // Win streak achievements
    for (const key of ["win_streak_3", "win_streak_5", "win_streak_10"]) {
      const result = await trackSet(userId, key, newWinStreak);
      if (result.newlyCompleted) completed.push(key);
    }
  }

  // Rank achievements
  const rankAchievements: Record<string, string> = {
    silver: "reach_silver",
    gold: "reach_gold",
    diamond: "reach_diamond",
    master: "reach_master",
    grandmaster: "reach_grandmaster",
  };
  const rankKey = rankAchievements[newRankTier];
  if (rankKey) {
    const result = await trackSet(userId, rankKey, 1);
    if (result.newlyCompleted) completed.push(rankKey);
  }

  return completed;
}

/**
 * Track collection size change — updates collect_10, collect_50, etc.
 */
export async function trackCollectionSize(userId: number): Promise<string[]> {
  const completed: string[] = [];

  try {
    const db = await getDb();
    if (!db) return completed;

    const rows = await db.select({ count: sql<number>`COUNT(DISTINCT cardId)` })
      .from(userCards)
      .where(eq(userCards.userId, userId));
    const uniqueCount = rows[0]?.count || 0;

    for (const key of ["collect_10", "collect_50", "collect_100", "collect_all"]) {
      const result = await trackSet(userId, key, uniqueCount);
      if (result.newlyCompleted) completed.push(key);
    }
  } catch (e) {
    console.error(`[AchievementTracker] Error tracking collection for user ${userId}:`, e);
  }

  return completed;
}

/**
 * Track a crafting action — increments craft count and checks for legendary.
 */
export async function trackCraftAction(
  userId: number,
  outputRarity?: string,
): Promise<string[]> {
  const completed: string[] = [];

  // Increment craft count
  const r1 = await trackIncrement(userId, "first_craft");
  if (r1.newlyCompleted) completed.push("first_craft");

  const r2 = await trackIncrement(userId, "craft_10");
  if (r2.newlyCompleted) completed.push("craft_10");

  // Check if crafted a legendary
  if (outputRarity === "legendary" || outputRarity === "mythic") {
    const r3 = await trackSet(userId, "craft_legendary", 1);
    if (r3.newlyCompleted) completed.push("craft_legendary");
  }

  return completed;
}

/**
 * Track a disenchant action.
 */
export async function trackDisenchant(userId: number): Promise<string[]> {
  const completed: string[] = [];
  const r = await trackIncrement(userId, "disenchant_50");
  if (r.newlyCompleted) completed.push("disenchant_50");
  return completed;
}

/**
 * Track a completed trade — increments trade count.
 */
export async function trackTradeComplete(userId: number): Promise<string[]> {
  const completed: string[] = [];

  for (const key of ["first_trade", "trades_10", "trades_50"]) {
    const r = await trackIncrement(userId, key);
    if (r.newlyCompleted) completed.push(key);
  }

  return completed;
}

/**
 * Track draft tournament participation and wins.
 */
export async function trackDraftResult(
  userId: number,
  won: boolean,
  perfectRun: boolean = false,
): Promise<string[]> {
  const completed: string[] = [];

  // Participation
  const r1 = await trackIncrement(userId, "first_draft");
  if (r1.newlyCompleted) completed.push("first_draft");

  if (won) {
    const r2 = await trackIncrement(userId, "draft_wins_5");
    if (r2.newlyCompleted) completed.push("draft_wins_5");

    const r3 = await trackIncrement(userId, "draft_wins_20");
    if (r3.newlyCompleted) completed.push("draft_wins_20");

    if (perfectRun) {
      const r4 = await trackSet(userId, "draft_perfect", 1);
      if (r4.newlyCompleted) completed.push("draft_perfect");
    }
  }

  return completed;
}

/**
 * Track AI match result.
 */
export async function trackAiResult(userId: number, won: boolean): Promise<string[]> {
  const completed: string[] = [];

  // Track total games played
  const r1 = await trackIncrement(userId, "play_100_games");
  if (r1.newlyCompleted) completed.push("play_100_games");

  const r2 = await trackIncrement(userId, "play_500_games");
  if (r2.newlyCompleted) completed.push("play_500_games");

  if (won) {
    const r3 = await trackSet(userId, "first_ai_win", 1);
    if (r3.newlyCompleted) completed.push("first_ai_win");
  }

  return completed;
}

/**
 * Recompute the user's marketplace stats and unlock any
 * marketAchievements ACHIEVEMENT_DEFS whose condition is now met.
 * Writes to `userAchievements` (NOT `cardGameAchievements`).
 *
 * Returns a normalized result so trackIncrement's existing call sites
 * keep their {newlyCompleted, progress} contract. `progress` here is
 * the headline stat value the caller incremented; `newlyCompleted`
 * is true if at least one achievement crossed its threshold.
 */
async function unlockMarketAchievementsByStat(
  userId: number,
  statKey: string,
): Promise<{ newlyCompleted: boolean; progress: number }> {
  try {
    const db = await getDb();
    if (!db) return { newlyCompleted: false, progress: 0 };

    const stats = await computeMarketStats(db, userId);
    const headline = stats[statKey] ?? 0;

    const candidates = MARKET_ACHIEVEMENT_DEFS.filter(
      (a) => a.condition.type === statKey,
    );
    if (candidates.length === 0) return { newlyCompleted: false, progress: headline };

    const earned = await db
      .select({ achievementId: userAchievements.achievementId })
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
    const earnedSet = new Set(earned.map((r) => r.achievementId));

    let newlyCompleted = false;
    for (const a of candidates) {
      if (earnedSet.has(a.id)) continue;
      const required = Number(a.condition.count ?? 0);
      if (headline >= required) {
        try {
          await db.insert(userAchievements).values({
            userId,
            achievementId: a.id,
          });
          newlyCompleted = true;
        } catch (err) {
          console.warn(`[AchievementTracker] insert collision for ${a.id}:`, err);
        }
      }
    }

    return { newlyCompleted, progress: headline };
  } catch (e) {
    console.error(`[AchievementTracker] market-stat dispatch failed for ${statKey} user ${userId}:`, e);
    return { newlyCompleted: false, progress: 0 };
  }
}
