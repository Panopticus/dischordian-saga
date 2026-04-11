/* ═══════════════════════════════════════════════════════
   TRANSMISSIONS ROUTER — Meme Broadcast rewards + watched
   state persistence.

   Server-side source of truth for whether a Meme broadcast
   has been watched by a given user. Provides idempotent
   reward granting: calling recordWatched twice for the same
   transmission awards XP/Dream/achievement exactly once.

   Stores watched state in `contentParticipation` with
   contentType="transmission" so it integrates with the
   existing content-reward infrastructure.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb, type DrizzleDb } from "../db";
import {
  contentParticipation,
  dreamBalance,
  citizenCharacters,
  userAchievements,
  notifications,
  achievements,
} from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { logger } from "../logger";
import { getTransmissionAchievementDefs } from "@shared/transmissions";

const TRANSMISSION_CONTENT_TYPE = "transmission";
const TRANSMISSION_NOTIFIED_TYPE = "transmission-notified";

async function grantDream(db: DrizzleDb, userId: number, amount: number) {
  if (amount <= 0) return;
  const existing = await db
    .select()
    .from(dreamBalance)
    .where(eq(dreamBalance.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(dreamBalance)
      .set({
        dreamTokens: sql`${dreamBalance.dreamTokens} + ${amount}`,
        totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${amount}`,
      })
      .where(eq(dreamBalance.userId, userId));
  } else {
    await db.insert(dreamBalance).values({
      userId,
      dreamTokens: amount,
      totalDreamEarned: amount,
      soulBoundDream: 0,
      dnaCode: 0,
    });
  }
}

async function grantCitizenXp(db: DrizzleDb, userId: number, amount: number) {
  if (amount <= 0) return;
  const rows = await db
    .select()
    .from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1)))
    .limit(1);
  if (!rows[0]) return;
  const char = rows[0];
  const newXp = (char.xp ?? 0) + amount;
  const newLevel = Math.floor(newXp / 200) + 1;
  await db
    .update(citizenCharacters)
    .set({ xp: newXp, level: Math.max(char.level, newLevel) })
    .where(eq(citizenCharacters.id, char.id));
}

async function grantAchievementIfNew(
  db: DrizzleDb,
  userId: number,
  achievementId: string,
): Promise<boolean> {
  const existing = await db
    .select()
    .from(userAchievements)
    .where(
      and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, achievementId)),
    )
    .limit(1);
  if (existing.length > 0) return false;
  await db.insert(userAchievements).values({ userId, achievementId });
  return true;
}

export const transmissionsRouter = router({
  /**
   * Idempotently record that the player watched a transmission and
   * grant its rewards. Calling this twice for the same transmissionId
   * returns { newlyGranted: false } on the second call.
   */
  recordWatched: protectedProcedure
    .input(
      z.object({
        transmissionId: z.string().min(1).max(128),
        xp: z.number().int().min(0).max(10_000).default(0),
        dream: z.number().int().min(0).max(10_000).default(0),
        achievement: z.string().min(1).max(128).optional(),
        loredexEntries: z.array(z.string().min(1).max(128)).max(64).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { newlyGranted: false as const };

      const existing = await db
        .select()
        .from(contentParticipation)
        .where(
          and(
            eq(contentParticipation.userId, ctx.user.id),
            eq(contentParticipation.contentType, TRANSMISSION_CONTENT_TYPE),
            eq(contentParticipation.contentId, input.transmissionId),
          ),
        )
        .limit(1);

      if (existing.length > 0 && existing[0].completed === 1 && existing[0].rewardsClaimed === 1) {
        return {
          newlyGranted: false as const,
          alreadyWatched: true as const,
        };
      }

      try {
        if (input.dream > 0) await grantDream(db, ctx.user.id, input.dream);
        if (input.xp > 0) await grantCitizenXp(db, ctx.user.id, input.xp);

        let achievementGranted = false;
        if (input.achievement) {
          achievementGranted = await grantAchievementIfNew(db, ctx.user.id, input.achievement);
        }

        if (existing.length > 0) {
          await db
            .update(contentParticipation)
            .set({
              completed: 1,
              progress: 100,
              rewardsClaimed: 1,
              metadata: {
                xp: input.xp,
                dream: input.dream,
                achievement: input.achievement,
                loredexEntries: input.loredexEntries ?? [],
              },
            })
            .where(eq(contentParticipation.id, existing[0].id));
        } else {
          await db.insert(contentParticipation).values({
            userId: ctx.user.id,
            contentType: TRANSMISSION_CONTENT_TYPE,
            contentId: input.transmissionId,
            completed: 1,
            progress: 100,
            rewardsClaimed: 1,
            metadata: {
              xp: input.xp,
              dream: input.dream,
              achievement: input.achievement,
              loredexEntries: input.loredexEntries ?? [],
            },
          });
        }

        return {
          newlyGranted: true as const,
          rewards: {
            xp: input.xp,
            dream: input.dream,
            achievement: achievementGranted ? input.achievement : undefined,
            loredexEntries: input.loredexEntries ?? [],
          },
        };
      } catch (err) {
        logger.error("[transmissions.recordWatched] Failed:", err);
        return { newlyGranted: false as const, error: "grant_failed" as const };
      }
    }),

  /**
   * Create a persistent "TRANSMISSION INCOMING" bell notification
   * for a newly unlocked broadcast. Deduped server-side via a
   * `transmission-notified` contentParticipation row so repeated
   * calls from the client's `useIncomingTransmissions` hook don't
   * spam the bell if client state is lost.
   */
  notifyIncoming: protectedProcedure
    .input(
      z.object({
        transmissionId: z.string().min(1).max(128),
        title: z.string().min(1).max(256),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { inserted: false as const };

      // Dedup: check if we've already notified for this transmission.
      const existing = await db
        .select()
        .from(contentParticipation)
        .where(
          and(
            eq(contentParticipation.userId, ctx.user.id),
            eq(contentParticipation.contentType, TRANSMISSION_NOTIFIED_TYPE),
            eq(contentParticipation.contentId, input.transmissionId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return { inserted: false as const, alreadyNotified: true as const };
      }

      try {
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "meme_broadcast",
          title: "▸ TRANSMISSION INCOMING",
          message: `Late Night with the Meme: "${input.title}"`,
          actionUrl: "/transmissions",
        });
        await db.insert(contentParticipation).values({
          userId: ctx.user.id,
          contentType: TRANSMISSION_NOTIFIED_TYPE,
          contentId: input.transmissionId,
          completed: 1,
          progress: 100,
          rewardsClaimed: 0,
          metadata: { notifiedAt: Date.now() },
        });
        return { inserted: true as const };
      } catch (err) {
        logger.error("[transmissions.notifyIncoming] Failed:", err);
        return { inserted: false as const, error: "insert_failed" as const };
      }
    }),

  /**
   * Admin: upsert every transmission-awarded achievement into the
   * `achievements` table so architect console and achievement UIs
   * can render names/icons. Safe to re-run (idempotent per
   * achievementId). Returns counts of inserted vs updated rows.
   */
  seedAchievements: adminProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) return { success: false as const, error: "DB unavailable" as const };
    const defs = getTransmissionAchievementDefs();
    let inserted = 0;
    let updated = 0;
    for (const def of defs) {
      try {
        const existing = await db
          .select()
          .from(achievements)
          .where(eq(achievements.achievementId, def.achievementId))
          .limit(1);
        if (existing.length > 0) {
          await db
            .update(achievements)
            .set({
              name: def.name,
              description: def.description,
              category: def.category,
              tier: def.tier,
              xpReward: def.xpReward,
              pointsReward: def.pointsReward,
              icon: "radio",
            })
            .where(eq(achievements.achievementId, def.achievementId));
          updated++;
        } else {
          await db.insert(achievements).values({
            achievementId: def.achievementId,
            franchiseId: "dischordian-saga",
            name: def.name,
            description: def.description,
            category: def.category,
            tier: def.tier,
            xpReward: def.xpReward,
            pointsReward: def.pointsReward,
            icon: "radio",
            hidden: 0,
          });
          inserted++;
        }
      } catch (err) {
        logger.error(`[transmissions.seedAchievements] Failed for ${def.achievementId}:`, err);
      }
    }
    return { success: true as const, inserted, updated, total: defs.length };
  }),

  /**
   * Server-side authoritative list of watched transmission ids.
   * Used to hydrate client state on login and to dedupe the
   * "TRANSMISSION INCOMING" toast across devices.
   */
  listWatched: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { watched: [] as string[] };
    const rows = await db
      .select({ contentId: contentParticipation.contentId })
      .from(contentParticipation)
      .where(
        and(
          eq(contentParticipation.userId, ctx.user.id),
          eq(contentParticipation.contentType, TRANSMISSION_CONTENT_TYPE),
          eq(contentParticipation.completed, 1),
        ),
      );
    return { watched: rows.map(r => r.contentId) };
  }),
});
