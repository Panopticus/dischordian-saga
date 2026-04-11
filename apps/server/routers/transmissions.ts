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
  userProgress,
} from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { logger } from "../logger";
import { getTransmissionAchievementDefs } from "@shared/transmissions";

const TRANSMISSION_CONTENT_TYPE = "transmission";
const TRANSMISSION_NOTIFIED_TYPE = "transmission-notified";

/**
 * Shared seeder used by both the admin mutation and the server
 * boot hook. Upserts every transmission-awarded achievement into
 * the `achievements` table. Safe to re-run (idempotent per
 * achievementId). Exported so `_core/index.ts` can call it once
 * on startup without depending on an admin invocation.
 */
export async function seedTransmissionAchievements(
  db: DrizzleDb,
): Promise<{ inserted: number; updated: number; total: number }> {
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
      logger.error(`[seedTransmissionAchievements] Failed for ${def.achievementId}:`, err);
    }
  }
  return { inserted, updated, total: defs.length };
}

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
    const result = await seedTransmissionAchievements(db);
    return { success: true as const, ...result };
  }),

  /**
   * Admin: migrate pre-fix `ep0-N` watched ids in a specific
   * user's gameData to a chosen strategy.
   *
   * Context: before the SIB id-collision fix, both Spaces In Between
   * Ep N and Epoch 0 Ep N serialized to the same `ep0-N` string.
   * Any existing `ep0-N` entry (where N is 1..10) in a player's
   * `transmissionsWatched` list is ambiguous — we can't know if
   * they actually watched the SIB or the main Epoch 0 episode.
   *
   * Strategies (pick one based on product guidance):
   *   - `keep-epoch0`: leave the `ep0-N` entries alone, treat them
   *     as Epoch 0 main-chain watches (current default behavior).
   *     This is a no-op data-wise but clears the diagnostic warning.
   *   - `wipe`: remove the ambiguous `ep0-N` entries entirely so
   *     the player can re-watch for correct credit. Refunds nothing
   *     (server-side `contentParticipation` rows stay intact for
   *     auditing). Produces a tombstone in `transmissionsNotified`
   *     so the player doesn't get a fresh "INCOMING" toast for the
   *     re-unlocked episodes.
   *   - `duplicate`: keep the `ep0-N` entry as Epoch 0 AND add a
   *     `sib-epN` entry for the same index, so the player gets
   *     credit for both. Most generous option; use only if the
   *     team prefers overcounting over forcing re-watches.
   *
   * Returns `{ migrated: number, strategy, beforeIds, afterIds }`
   * so the caller can audit the change.
   */
  migrateAmbiguousIds: adminProcedure
    .input(
      z.object({
        userId: z.number().int().positive(),
        strategy: z.enum(["keep-epoch0", "wipe", "duplicate"]),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { success: false as const, error: "DB unavailable" as const };
      }

      const rows = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, input.userId))
        .limit(1);

      if (rows.length === 0) {
        return { success: false as const, error: "User has no game state" as const };
      }

      const gameData = (rows[0].gameData ?? {}) as Record<string, unknown>;
      const beforeIds = Array.isArray(gameData.transmissionsWatched)
        ? (gameData.transmissionsWatched as string[])
        : [];
      const beforeNotified = Array.isArray(gameData.transmissionsNotified)
        ? (gameData.transmissionsNotified as string[])
        : [];

      const LEGACY_RE = /^ep0-([1-9]|10)$/;
      const ambiguous = beforeIds.filter(id => LEGACY_RE.test(id));

      if (ambiguous.length === 0) {
        return {
          success: true as const,
          migrated: 0,
          strategy: input.strategy,
          beforeIds,
          afterIds: beforeIds,
          message: "No ambiguous ids found — nothing to migrate",
        };
      }

      let afterIds = beforeIds;
      let afterNotified = beforeNotified;
      if (input.strategy === "wipe") {
        // Drop the ambiguous entries. Also drop their counterparts
        // from `transmissionsNotified` so the client's getNewlyUnlocked
        // re-surfaces them on the next login and the player sees the
        // INCOMING toast again.
        afterIds = beforeIds.filter(id => !LEGACY_RE.test(id));
        afterNotified = beforeNotified.filter(id => !LEGACY_RE.test(id));
      } else if (input.strategy === "duplicate") {
        // Add sib-epN alongside each ep0-N so the player gets credit
        // for both. Deduplicate with a Set in case the sib- entry
        // somehow already exists.
        const sibEntries = ambiguous.map(id => {
          const match = id.match(LEGACY_RE);
          return `sib-ep${match?.[1] ?? ""}`;
        });
        afterIds = Array.from(new Set([...beforeIds, ...sibEntries]));
      }
      // strategy === "keep-epoch0" is a no-op on the list; we still
      // clear the ambiguous diagnostic by flipping a flag below.

      const nextGameData = {
        ...gameData,
        transmissionsWatched: afterIds,
        transmissionsNotified: afterNotified,
        // Flag consumed by the client migration helper to suppress
        // the one-shot console.warn on future loads.
        _ambiguousIdsMigrated: true,
        _ambiguousIdsMigratedStrategy: input.strategy,
        _ambiguousIdsMigratedAt: Date.now(),
      };

      await db
        .update(userProgress)
        .set({ gameData: nextGameData })
        .where(eq(userProgress.userId, input.userId));

      logger.info(
        `[transmissions.migrateAmbiguousIds] user=${input.userId} strategy=${input.strategy} migrated=${ambiguous.length}`,
      );

      return {
        success: true as const,
        migrated: ambiguous.length,
        strategy: input.strategy,
        beforeIds,
        afterIds,
      };
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
