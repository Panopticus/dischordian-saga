/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT AUTO-TRACKER — Server-side helper to track
   achievement progress from any game action
   ═══════════════════════════════════════════════════════ */
import { eq, and, sql } from "drizzle-orm";
import { getDb } from "./db";
import { cardGameAchievements, userCards, dreamBalance, userProgress } from "../db/schema";
import { CARD_ACHIEVEMENTS, type CardAchievementDef } from "./routers/cardAchievements";

const achievementMap = new Map<string, CardAchievementDef>(
  CARD_ACHIEVEMENTS.map(a => [a.key, a])
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
 * Track a successful Forge recipe craft (separate from card crafting).
 * Increments forge counts and checks rarity-tier achievements.
 */
export async function trackRecipeForge(
  userId: number,
  outputRarity?: string,
): Promise<string[]> {
  const completed: string[] = [];

  for (const key of ["forge_first", "forge_25", "forge_100"]) {
    const r = await trackIncrement(userId, key);
    if (r.newlyCompleted) completed.push(key);
  }

  if (outputRarity === "epic") {
    const r = await trackSet(userId, "forge_epic_recipe", 1);
    if (r.newlyCompleted) completed.push("forge_epic_recipe");
  }
  if (outputRarity === "legendary" || outputRarity === "mythic") {
    const r = await trackSet(userId, "forge_legendary_recipe", 1);
    if (r.newlyCompleted) completed.push("forge_legendary_recipe");
  }

  return completed;
}

/**
 * Track when a player levels up a crafting skill. Fires the
 * "max skill" achievement when any skill hits 10, and the
 * "all max skills" achievement counts how many distinct skills
 * have reached 10.
 *
 * The list of maxed skills is reconstructed from the session's
 * progress row at call time, so passing a single skillId here is
 * sufficient — the helper handles the aggregation.
 */
export async function trackForgeSkillLevel(
  userId: number,
  _skillId: string,
  newLevel: number,
): Promise<string[]> {
  const completed: string[] = [];
  if (newLevel < 10) return completed;

  // First any-skill maxed
  const r1 = await trackSet(userId, "forge_max_skill", 1);
  if (r1.newlyCompleted) completed.push("forge_max_skill");

  // Aggregate count of maxed skills — read from userProgress
  try {
    const db = await getDb();
    if (!db) return completed;
    const row = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, "dischordian-saga")))
      .limit(1);
    const gameData = (row[0]?.gameData ?? {}) as Record<string, unknown>;
    const skills = (gameData.craftingSkills ?? {}) as Record<string, unknown>;
    let maxed = 0;
    for (const v of Object.values(skills)) {
      if (typeof v === "number" && v >= 10) maxed++;
      else if (v && typeof v === "object" && "level" in (v as object)) {
        const lvl = (v as { level?: unknown }).level;
        if (typeof lvl === "number" && lvl >= 10) maxed++;
      }
    }
    const r2 = await trackSet(userId, "forge_all_max_skills", maxed);
    if (r2.newlyCompleted) completed.push("forge_all_max_skills");
  } catch (e) {
    console.error("[AchievementTracker] forge_all_max_skills aggregation failed:", e);
  }

  return completed;
}

/**
 * Track a Forge disenchant action (distinct from card disenchanting).
 */
export async function trackForgeDisenchant(userId: number): Promise<string[]> {
  const completed: string[] = [];
  const r = await trackIncrement(userId, "forge_disenchant_10");
  if (r.newlyCompleted) completed.push("forge_disenchant_10");
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
