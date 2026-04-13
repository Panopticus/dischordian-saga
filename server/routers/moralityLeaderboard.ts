/* ═══════════════════════════════════════════════════════
   MORALITY LEADERBOARD ROUTER
   Aggregates morality scores from all players' game state
   to show community-wide faction distribution.
   ═══════════════════════════════════════════════════════ */
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress, users } from "../../drizzle/schema";
import { eq, sql, isNotNull } from "drizzle-orm";

/**
 * Extract morality score from the gameData JSON blob.
 * The gameData is stored as JSON in userProgress.gameData.
 * moralityScore is a top-level field in the blob.
 */
function extractMoralityScore(gameData: unknown): number {
  if (!gameData || typeof gameData !== "object") return 0;
  const data = gameData as Record<string, unknown>;
  if (typeof data.moralityScore === "number") return data.moralityScore;
  return 0;
}

function classifyAlignment(score: number): "machine" | "balanced" | "humanity" {
  if (score <= -20) return "machine";
  if (score >= 20) return "humanity";
  return "balanced";
}

function getTierLabel(score: number): string {
  const abs = Math.abs(score);
  if (abs < 20) return "Balanced";
  if (abs < 40) return score < 0 ? "Machine-Leaning" : "Humanity-Leaning";
  if (abs < 60) return score < 0 ? "Machine-Aligned" : "Humanity-Aligned";
  if (abs < 80) return score < 0 ? "Machine-Devoted" : "Humanity-Devoted";
  return score < 0 ? "Machine-Ascended" : "Humanity-Ascended";
}

export const moralityLeaderboardRouter = router({
  /**
   * Get community-wide morality distribution.
   * Returns faction counts, percentages, and top players per faction.
   */
  getDistribution: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { machine: 0, balanced: 0, humanity: 0, total: 0, players: [], averageScore: 0 };

    // Fetch all user progress with game data
    const allProgress = await db
      .select({
        userId: userProgress.userId,
        gameData: userProgress.gameData,
        title: userProgress.title,
        level: userProgress.level,
      })
      .from(userProgress)
      .where(isNotNull(userProgress.gameData));

    // Fetch user names
    const userIds = allProgress.map(p => p.userId);
    let userMap: Record<number, string> = {};
    if (userIds.length > 0) {
      const userRows = await db
        .select({ id: users.id, name: users.name })
        .from(users)
        .where(sql`${users.id} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`);
      for (const u of userRows) {
        userMap[u.id] = u.name ?? "Unknown Operative";
      }
    }

    let machineCount = 0;
    let balancedCount = 0;
    let humanityCount = 0;
    let totalScore = 0;

    interface PlayerEntry {
      userId: number;
      name: string;
      score: number;
      alignment: "machine" | "balanced" | "humanity";
      tierLabel: string;
      level: number;
      title: string;
    }

    const players: PlayerEntry[] = [];

    for (const row of allProgress) {
      const score = extractMoralityScore(row.gameData);
      const alignment = classifyAlignment(score);
      totalScore += score;

      if (alignment === "machine") machineCount++;
      else if (alignment === "humanity") humanityCount++;
      else balancedCount++;

      players.push({
        userId: row.userId,
        name: userMap[row.userId] ?? "Unknown Operative",
        score,
        alignment,
        tierLabel: getTierLabel(score),
        level: row.level ?? 1,
        title: row.title ?? "Recruit",
      });
    }

    // Sort by absolute score descending (most committed to their alignment)
    players.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

    const total = allProgress.length;
    const averageScore = total > 0 ? Math.round(totalScore / total) : 0;

    return {
      machine: machineCount,
      balanced: balancedCount,
      humanity: humanityCount,
      total,
      averageScore,
      players: players.slice(0, 50), // Top 50 most committed
    };
  }),

  /**
   * Get the current user's morality rank among all players.
   */
  getMyRank: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { rank: 0, total: 0, score: 0, alignment: "balanced" as const, percentile: 0 };

    const allProgress = await db
      .select({
        userId: userProgress.userId,
        gameData: userProgress.gameData,
      })
      .from(userProgress)
      .where(isNotNull(userProgress.gameData));

    const scores = allProgress.map(p => ({
      userId: p.userId,
      score: extractMoralityScore(p.gameData),
    }));

    // Sort by absolute score descending
    scores.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

    const myIndex = scores.findIndex(s => s.userId === ctx.user.id);
    const myScore = myIndex >= 0 ? scores[myIndex].score : 0;
    const total = scores.length;
    const rank = myIndex >= 0 ? myIndex + 1 : total + 1;
    const percentile = total > 0 ? Math.round(((total - rank + 1) / total) * 100) : 0;

    return {
      rank,
      total,
      score: myScore,
      alignment: classifyAlignment(myScore),
      percentile,
    };
  }),
});
