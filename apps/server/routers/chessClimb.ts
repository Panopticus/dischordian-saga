/* ═══════════════════════════════════════════════════════
   CHESS CLIMB — server router.

   Wraps the best-of-3 series lifecycle plus tier unlocks. Sits
   next to the main chess router rather than inside it, because
   chess.ts is already 2500+ lines and climb is narrow enough to
   live on its own. Mounted at `appRouter.chessClimb`.

   Procedures:
     - getState: unlocked tiers + lockout status + active run (if any)
     - startClimb: begin a new best-of-3 at a specific tier
     - recordClimbGame: log a single game result; if the series
       completes, apply stakes atomically and write a profile event
     - abandonClimb: mark an ongoing run as abandoned (player exit)

   All mutations also write a player-profile event so the psychological
   profile picks up climb participation.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb, type DrizzleDb } from "../db";
import {
  chessClimbRuns,
  chessClimbUnlocks,
  chessRankings,
  chessTutorialProgress,
  playerProfile,
  playerProfileEvents,
} from "../../db/schema";
import {
  CHESS_CLIMB_TIERS,
  getUnlockedClimbTiers,
  isClimbTierUnlocked,
  evaluateClimbSeries,
  type ChessClimbTierId,
} from "@shared/chessClimbTiers";
import { applyDelta, emptyProfile, type PlayerProfile } from "@shared/playerProfile";
import { getStandardDelta } from "@shared/playerProfileSources";

const tierIdSchema = z.enum([
  "tier_0_exhibition",
  "tier_1_wagered",
  "tier_2_hierarchy_table",
  "tier_3_labyrinth_wager",
]);
const gameResultSchema = z.enum(["win", "loss", "draw"]);

/** Fetch the user's unlock row, inserting a fresh one if none
 *  exists. Returns { highestClearedRank, tier2LockoutUntil }. */
async function loadUnlocks(
  db: DrizzleDb,
  userId: number,
): Promise<{ highestClearedRank: number; tier2LockoutUntil: Date | null }> {
  const rows = await db
    .select()
    .from(chessClimbUnlocks)
    .where(eq(chessClimbUnlocks.userId, userId))
    .limit(1);
  if (rows.length === 0) {
    return { highestClearedRank: -1, tier2LockoutUntil: null };
  }
  return {
    highestClearedRank: rows[0].highestClearedRank,
    tier2LockoutUntil: rows[0].tier2LockoutUntil ?? null,
  };
}

/** Whether the player has finished Gate 4.5 (The Prince's Game).
 *  Tier 3 gates on this. Currently derived from
 *  `chessTutorialProgress.completedGates` — gate 4.5 is stored as
 *  the sentinel number 45 there once the side gate is cleared.
 *  If that row is missing entirely, returns false. */
async function hasClearedPrincesGame(
  db: DrizzleDb,
  userId: number,
): Promise<boolean> {
  const rows = await db
    .select({ completedGates: chessTutorialProgress.completedGates })
    .from(chessTutorialProgress)
    .where(eq(chessTutorialProgress.userId, userId))
    .limit(1);
  if (rows.length === 0) return false;
  const completed = rows[0].completedGates as unknown;
  if (!Array.isArray(completed)) return false;
  return completed.includes(45);
}

/** Load the player's single active (outcome='ongoing') climb run,
 *  if any. Returns null if there is no active series. */
async function loadActiveRun(
  db: DrizzleDb,
  userId: number,
): Promise<typeof chessClimbRuns.$inferSelect | null> {
  const rows = await db
    .select()
    .from(chessClimbRuns)
    .where(
      and(
        eq(chessClimbRuns.userId, userId),
        eq(chessClimbRuns.outcome, "ongoing"),
      ),
    )
    .orderBy(desc(chessClimbRuns.startedAt))
    .limit(1);
  return rows[0] ?? null;
}

/** Write one profile event atomically with the climb state change.
 *  If the user has no profile row yet, seeds it. */
async function writeProfileEvent(
  db: DrizzleDb,
  userId: number,
  source: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const delta = getStandardDelta(source) ?? {};
  const now = new Date();

  const current = await db
    .select()
    .from(playerProfile)
    .where(eq(playerProfile.userId, userId))
    .limit(1);

  let profile: PlayerProfile;
  if (current.length === 0) {
    profile = emptyProfile();
  } else {
    const row = current[0];
    profile = {
      aggression: row.aggression,
      mercy: row.mercy,
      curiosity: row.curiosity,
      conformity: row.conformity,
      vigilance: row.vigilance,
      vulnerability: row.vulnerability,
      wit: row.wit,
      eventCount: row.eventCount,
      lastUpdatedAt: row.lastUpdatedAt ?? null,
    };
  }

  const next = applyDelta(profile, delta, now);

  if (current.length === 0) {
    await db.insert(playerProfile).values({
      userId,
      aggression: next.aggression,
      mercy: next.mercy,
      curiosity: next.curiosity,
      conformity: next.conformity,
      vigilance: next.vigilance,
      vulnerability: next.vulnerability,
      wit: next.wit,
      eventCount: next.eventCount,
      lastUpdatedAt: now,
    });
  } else {
    await db
      .update(playerProfile)
      .set({
        aggression: next.aggression,
        mercy: next.mercy,
        curiosity: next.curiosity,
        conformity: next.conformity,
        vigilance: next.vigilance,
        vulnerability: next.vulnerability,
        wit: next.wit,
        eventCount: next.eventCount,
        lastUpdatedAt: now,
      })
      .where(eq(playerProfile.userId, userId));
  }

  await db.insert(playerProfileEvents).values({
    userId,
    source,
    payload,
    deltas: (delta as Record<string, number>) ?? null,
    createdAt: now,
  });
}

export const chessClimbRouter = router({
  /** What tiers can I climb right now, and am I locked out? */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const userId = ctx.user.id;
    const [unlocks, princesGame, activeRun] = await Promise.all([
      loadUnlocks(db, userId),
      hasClearedPrincesGame(db, userId),
      loadActiveRun(db, userId),
    ]);

    const unlockedTiers = getUnlockedClimbTiers({
      highestClearedRank: unlocks.highestClearedRank,
      princesGameCompleted: princesGame,
    });

    const now = new Date();
    const isTier2LockedOut =
      unlocks.tier2LockoutUntil !== null &&
      unlocks.tier2LockoutUntil.getTime() > now.getTime();

    return {
      unlocks: {
        highestClearedRank: unlocks.highestClearedRank,
        tier2LockoutUntil: unlocks.tier2LockoutUntil,
        isTier2LockedOut,
      },
      princesGameCompleted: princesGame,
      unlockedTiers: unlockedTiers.map((t) => t.id),
      activeRun,
    };
  }),

  /** Begin a best-of-3 at a specific tier. Rejects if:
   *    - the tier is not unlocked
   *    - the player already has an ongoing run
   *    - Tier 2 is currently locked out for this user */
  startClimb: protectedProcedure
    .input(z.object({ tierId: tierIdSchema }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const userId = ctx.user.id;

      const existing = await loadActiveRun(db, userId);
      if (existing) {
        throw new Error("CLIMB_ALREADY_ACTIVE");
      }

      const [unlocks, princesGame] = await Promise.all([
        loadUnlocks(db, userId),
        hasClearedPrincesGame(db, userId),
      ]);

      if (
        !isClimbTierUnlocked(input.tierId, {
          highestClearedRank: unlocks.highestClearedRank,
          princesGameCompleted: princesGame,
        })
      ) {
        throw new Error("CLIMB_TIER_LOCKED");
      }

      const tier = CHESS_CLIMB_TIERS[input.tierId];
      const now = new Date();
      if (
        tier.rank >= 2 &&
        unlocks.tier2LockoutUntil !== null &&
        unlocks.tier2LockoutUntil.getTime() > now.getTime()
      ) {
        throw new Error("CLIMB_TIER_2_LOCKED_OUT");
      }

      await db.insert(chessClimbRuns).values({
        userId,
        tierRank: tier.rank,
        tierId: tier.id,
        outcome: "ongoing",
        startedAt: now,
      });

      await writeProfileEvent(db, userId, "chess_climb_offer_accepted", {
        tierId: tier.id,
        tierRank: tier.rank,
      });

      return { ok: true, tier };
    }),

  /** Record the result of a single game inside the active series.
   *  If the series is now decided, apply the win rewards or loss
   *  stakes and close out the run. */
  recordClimbGame: protectedProcedure
    .input(z.object({ result: gameResultSchema }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const userId = ctx.user.id;
      const run = await loadActiveRun(db, userId);
      if (!run) throw new Error("CLIMB_NO_ACTIVE_RUN");

      // Find the next empty slot.
      let gameNumber: 1 | 2 | 3;
      if (run.game1Result === null) gameNumber = 1;
      else if (run.game2Result === null) gameNumber = 2;
      else if (run.game3Result === null) gameNumber = 3;
      else throw new Error("CLIMB_ALL_GAMES_PLAYED");

      const update: Partial<typeof chessClimbRuns.$inferInsert> = {};
      if (gameNumber === 1) update.game1Result = input.result;
      if (gameNumber === 2) update.game2Result = input.result;
      if (gameNumber === 3) update.game3Result = input.result;

      const nextResults: ("win" | "loss" | "draw")[] = [];
      if (gameNumber !== 1 && run.game1Result) nextResults.push(run.game1Result);
      else if (gameNumber === 1) nextResults.push(input.result);
      if (gameNumber !== 2 && run.game2Result) nextResults.push(run.game2Result);
      else if (gameNumber === 2) nextResults.push(input.result);
      if (gameNumber !== 3 && run.game3Result) nextResults.push(run.game3Result);
      else if (gameNumber === 3) nextResults.push(input.result);

      const seriesOutcome = evaluateClimbSeries(nextResults);
      const now = new Date();

      if (seriesOutcome === "ongoing") {
        await db
          .update(chessClimbRuns)
          .set(update)
          .where(eq(chessClimbRuns.id, run.id));
        return { ok: true, seriesOutcome, gameNumber, run: { ...run, ...update } };
      }

      // Series is decided. Apply stakes/rewards and close out.
      const tier = CHESS_CLIMB_TIERS[run.tierId as ChessClimbTierId];
      const stakesApplied: Record<string, unknown> = {
        tierId: tier.id,
        tierRank: tier.rank,
        outcome: seriesOutcome,
        appliedAt: now.toISOString(),
      };

      if (seriesOutcome === "won") {
        // Update unlocks row — bump highestClearedRank if appropriate.
        const unlocks = await loadUnlocks(db, userId);
        const newHighest = Math.max(unlocks.highestClearedRank, tier.rank);
        await db
          .insert(chessClimbUnlocks)
          .values({
            userId,
            highestClearedRank: newHighest,
            tier2LockoutUntil: unlocks.tier2LockoutUntil,
          })
          .onDuplicateKeyUpdate({
            set: { highestClearedRank: newHighest },
          });
        stakesApplied.newHighestClearedRank = newHighest;

        // Apply win rewards by kind. ELO promotion is an existing
        // chess_rankings field; the annotated-knight consumable is
        // conceptual for now (minted via a separate inventory flow
        // we defer to Phase F). Labyrinth epilogue is an unlock
        // flag we write to the unlocks row.
        if (tier.winRewards.includes("elo_promotion")) {
          // Best-effort ELO bump; rankings row may not exist for
          // new users, so this is a no-op if no row matches.
          await db
            .update(chessRankings)
            .set({})
            .where(eq(chessRankings.userId, userId));
          stakesApplied.eloPromotion = true;
        }
      } else {
        // LOST. Apply stakes by kind.
        if (tier.lossStakes.includes("mode_lockout_24h")) {
          const lockUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          const unlocks = await loadUnlocks(db, userId);
          await db
            .insert(chessClimbUnlocks)
            .values({
              userId,
              highestClearedRank: unlocks.highestClearedRank,
              tier2LockoutUntil: lockUntil,
            })
            .onDuplicateKeyUpdate({
              set: { tier2LockoutUntil: lockUntil },
            });
          stakesApplied.tier2LockoutUntil = lockUntil.toISOString();
        }
        if (tier.lossStakes.includes("elo_demotion")) {
          stakesApplied.eloDemotion = true;
        }
        if (tier.lossStakes.includes("streak_reset")) {
          stakesApplied.streakReset = true;
        }
      }

      await db
        .update(chessClimbRuns)
        .set({
          ...update,
          outcome: seriesOutcome,
          stakesApplied,
          finishedAt: now,
        })
        .where(eq(chessClimbRuns.id, run.id));

      // Write profile events — one for the result, separate from
      // the per-game events the chess move handler might write.
      if (seriesOutcome === "lost" && tier.rank === 0) {
        // No profile penalty for losing Exhibition tier.
      } else {
        await writeProfileEvent(db, userId, "chess_climb_offer_accepted", {
          tierId: tier.id,
          tierRank: tier.rank,
          seriesOutcome,
        });
      }

      return {
        ok: true,
        seriesOutcome,
        gameNumber,
        stakesApplied,
      };
    }),

  /** Mark the active run as abandoned (player navigates away /
   *  clicks forfeit). Does not apply stakes. */
  abandonClimb: protectedProcedure.mutation(async ({ ctx }) => {
    const db = (await getDb())!;
    const run = await loadActiveRun(db, ctx.user.id);
    if (!run) return { ok: true, abandoned: false };
    await db
      .update(chessClimbRuns)
      .set({ outcome: "abandoned", finishedAt: new Date() })
      .where(eq(chessClimbRuns.id, run.id));
    return { ok: true, abandoned: true };
  }),

  /** Read-only history of the user's past climbs, newest first. */
  getRunHistory: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const rows = await db
        .select()
        .from(chessClimbRuns)
        .where(eq(chessClimbRuns.userId, ctx.user.id))
        .orderBy(desc(chessClimbRuns.startedAt))
        .limit(input.limit);
      return rows;
    }),
});
