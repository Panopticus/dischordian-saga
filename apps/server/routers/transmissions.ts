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
import {
  ALBUM_TRANSMISSION_TRACK_ORDER,
  advanceCursor,
  getNextTrackId,
  parseCursor,
  type AlbumTransmissionCursor,
} from "@shared/albumTransmissionCursor";
import { getTrackMeme } from "@shared/dischordianLogicTrackMemes";
import { ALBUM1_FIRST_NINE_SLIDESHOWS } from "@shared/songSlideshows";
import { ALBUM1_TRACKS, type Album1TrackId } from "@shared/expansionArt/album1Slideshows";
import {
  buildInbox,
  loginItemId,
  pickNextLoginItem,
  type LoginTransmissionItem,
} from "@shared/loginTransmissionQueue";
import {
  ALL_TRANSMISSIONS,
  transmissionId as makeTransmissionId,
  type PlayerContext as TransmissionPlayerContext,
  type Transmission,
} from "@shared/transmissions";

const TRANSMISSION_CONTENT_TYPE = "transmission";
const TRANSMISSION_NOTIFIED_TYPE = "transmission-notified";
const ALBUM_CURSOR_TYPE = "album-transmission-cursor";
const ALBUM_CURSOR_ID = "dischordian-logic";
const LOGIN_SKIPPED_TYPE = "login-transmission-skipped";

/** Per-album-track completion grant — the user's "completion point".
 *  TV transmissions carry their own per-episode rewards in the
 *  Transmission.reward field; album tracks did not, so they earn
 *  this baseline grant. */
const ALBUM_COMPLETION_REWARD = { xp: 50, dream: 5 } as const;

const Album1TrackIdSchema = z.enum(["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09"]);

async function loadAlbumCursor(
  db: DrizzleDb,
  userId: number,
): Promise<AlbumTransmissionCursor> {
  const rows = await db
    .select()
    .from(contentParticipation)
    .where(
      and(
        eq(contentParticipation.userId, userId),
        eq(contentParticipation.contentType, ALBUM_CURSOR_TYPE),
        eq(contentParticipation.contentId, ALBUM_CURSOR_ID),
      ),
    )
    .limit(1);
  return parseCursor(rows[0]?.metadata ?? null);
}

async function persistAlbumCursor(
  db: DrizzleDb,
  userId: number,
  cursor: AlbumTransmissionCursor,
): Promise<void> {
  const rows = await db
    .select()
    .from(contentParticipation)
    .where(
      and(
        eq(contentParticipation.userId, userId),
        eq(contentParticipation.contentType, ALBUM_CURSOR_TYPE),
        eq(contentParticipation.contentId, ALBUM_CURSOR_ID),
      ),
    )
    .limit(1);
  if (rows[0]) {
    await db
      .update(contentParticipation)
      .set({ metadata: cursor, completed: cursor.firstEverDelivered ? 1 : 0 })
      .where(eq(contentParticipation.id, rows[0].id));
  } else {
    await db.insert(contentParticipation).values({
      userId,
      contentType: ALBUM_CURSOR_TYPE,
      contentId: ALBUM_CURSOR_ID,
      completed: cursor.firstEverDelivered ? 1 : 0,
      progress: cursor.nextTrackIndex,
      rewardsClaimed: 0,
      metadata: cursor,
    });
  }
}

/** Zod schema for the runtime PlayerContext the client sends with
 *  `getNextLoginTransmission` / `getLoginTransmissionInbox`. The
 *  client already builds this for the existing transmission-unlock
 *  evaluator (`usePlayerContext`), so we accept it as input rather
 *  than re-derive it server-side. */
const PlayerContextInputSchema = z.object({
  level: z.number().int().min(0).max(1000),
  awakeningStep: z.string().optional(),
  completedChapters: z.array(z.string()).max(256),
  elaraTrust: z.number().min(0).max(100),
  humanTrust: z.number().min(0).max(100),
  npcTrust: z.record(z.string(), z.number()).default({}),
  moralityScore: z.number(),
  narrativeFlags: z.record(z.string(), z.boolean()).default({}),
  roomsVisited: z.array(z.string()).max(256),
  hasApprenticeGraduate: z.boolean(),
});

const LoginTransmissionItemInputSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("album"),
    trackId: z.enum(["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09"]),
  }),
  z.object({
    kind: z.literal("tv"),
    transmissionId: z.string().min(1).max(128),
  }),
]);

async function loadWatchedSet(
  db: DrizzleDb,
  userId: number,
): Promise<Set<string>> {
  // Watched = any contentParticipation row of contentType="transmission"
  // with completed=1, mapped to the corresponding loginItemId form.
  const rows = await db
    .select({ contentId: contentParticipation.contentId })
    .from(contentParticipation)
    .where(
      and(
        eq(contentParticipation.userId, userId),
        eq(contentParticipation.contentType, TRANSMISSION_CONTENT_TYPE),
        eq(contentParticipation.completed, 1),
      ),
    );
  const set = new Set<string>();
  for (const r of rows) {
    set.add(`tv:${r.contentId}`);
  }
  return set;
}

async function loadSkippedSet(
  db: DrizzleDb,
  userId: number,
): Promise<Set<string>> {
  const rows = await db
    .select({ contentId: contentParticipation.contentId })
    .from(contentParticipation)
    .where(
      and(
        eq(contentParticipation.userId, userId),
        eq(contentParticipation.contentType, LOGIN_SKIPPED_TYPE),
      ),
    );
  return new Set(rows.map((r) => r.contentId));
}

async function loadAlbumWatchedSet(
  cursor: AlbumTransmissionCursor,
): Promise<Set<string>> {
  // Watched album tracks are anything with index < cursor.nextTrackIndex.
  const set = new Set<string>();
  for (let i = 0; i < cursor.nextTrackIndex; i++) {
    const trackId = ALBUM_TRANSMISSION_TRACK_ORDER[i];
    if (trackId) set.add(`album:${trackId}`);
  }
  return set;
}

function describeAlbumItem(trackId: Album1TrackId) {
  const playback = describeAlbumTrack(trackId);
  const meme = getTrackMeme(trackId);
  if (!playback || !meme) return null;
  return {
    kind: "album" as const,
    trackId,
    title: playback.title,
    audioUrl: playback.audioUrl,
    durationMs: playback.durationMs,
    intro: meme.intro,
    outro: meme.outro,
    firstEverIntroId: meme.firstEverIntroId ?? null,
  };
}

function describeTvItem(transmission: Transmission) {
  return {
    kind: "tv" as const,
    transmissionId: makeTransmissionId(transmission),
    title: transmission.title,
    videoUrl: transmission.videoUrl,
    driveFileId: transmission.driveFileId,
    lengthSeconds: transmission.lengthSeconds,
    epoch: transmission.epoch,
    episodeNumber: transmission.episodeNumber,
    intro: transmission.memeIntro,
    outro: transmission.memeOutro,
    synopsis: transmission.synopsis,
    reward: transmission.reward,
    relatedLoredexEntries: transmission.relatedLoredexEntries ?? [],
  };
}

function findTvTransmission(transmissionId: string): Transmission | null {
  return ALL_TRANSMISSIONS.find((t) => makeTransmissionId(t) === transmissionId) ?? null;
}

function describeAlbumTrack(trackId: Album1TrackId) {
  const slideshow = ALBUM1_FIRST_NINE_SLIDESHOWS.find(
    (s) => s.songId === `album1_${trackId.toLowerCase()}`,
  );
  const trackDef = ALBUM1_TRACKS.find((t) => t.id === trackId);
  if (!slideshow || !trackDef) return null;
  return {
    title: trackDef.title,
    audioUrl: slideshow.audioUrl,
    durationMs: slideshow.durationMs,
  };
}

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

  /**
   * Read the next undelivered Dischordian Logic track for this player,
   * or null if the authored set is exhausted. Drives the on-login
   * "TRANSMISSION INCOMING" Meme broadcast.
   *
   * The cursor is server-authoritative; the client only ever receives
   * the next track to play, never the cursor itself.
   *
   * `firstEver: true` means this is the player's first-ever transmission
   * and the 3:45 cinematic in expansionArt/loginMemeSequence.ts should
   * play before the song.
   */
  getNextAlbumTransmission: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const cursor = await loadAlbumCursor(db, ctx.user.id);
    const trackId = getNextTrackId(cursor);
    if (trackId === null) return null;

    const playback = describeAlbumTrack(trackId);
    const meme = getTrackMeme(trackId);
    if (!playback || !meme) {
      logger.error(
        `[transmissions.getNextAlbumTransmission] Missing playback or meme for ${trackId}`,
      );
      return null;
    }

    return {
      trackId,
      title: playback.title,
      audioUrl: playback.audioUrl,
      durationMs: playback.durationMs,
      intro: meme.intro,
      outro: meme.outro,
      firstEver: !cursor.firstEverDelivered,
      firstEverIntroId: meme.firstEverIntroId ?? null,
    };
  }),

  /**
   * Acknowledge that the player accepted and (if `completed`) finished
   * a login transmission. Advances the cursor only when `completed`
   * is true AND `trackId` matches the expected next track. Idempotent
   * against double-clicks and stale-tab races.
   *
   * Close/dismiss without completion does NOT call this — the cursor
   * stays put and the same track pops on the next login.
   */
  acceptAlbumTransmission: protectedProcedure
    .input(
      z.object({
        trackId: Album1TrackIdSchema,
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { advanced: false as const };

      const before = await loadAlbumCursor(db, ctx.user.id);
      if (!input.completed) {
        // Acceptance without completion: we still mark firstEverDelivered
        // so the player doesn't see the cinematic again on a refresh.
        if (!before.firstEverDelivered && input.trackId === "T01") {
          const next: AlbumTransmissionCursor = {
            ...before,
            firstEverDelivered: true,
          };
          await persistAlbumCursor(db, ctx.user.id, next);
          return { advanced: false as const, cursor: next };
        }
        return { advanced: false as const, cursor: before };
      }

      const after = advanceCursor(before, input.trackId);
      if (after === before) {
        return { advanced: false as const, cursor: before };
      }
      await persistAlbumCursor(db, ctx.user.id, after);

      // Completion grant — the user's "completion point". Idempotent
      // via the same contentParticipation row pattern as recordWatched:
      // this row marks the album track as fully watched + rewarded.
      try {
        const albumWatchedId = `album:${input.trackId}`;
        const existing = await db
          .select()
          .from(contentParticipation)
          .where(
            and(
              eq(contentParticipation.userId, ctx.user.id),
              eq(contentParticipation.contentType, TRANSMISSION_CONTENT_TYPE),
              eq(contentParticipation.contentId, albumWatchedId),
            ),
          )
          .limit(1);
        const alreadyRewarded =
          existing.length > 0 &&
          existing[0].completed === 1 &&
          existing[0].rewardsClaimed === 1;
        if (!alreadyRewarded) {
          await grantDream(db, ctx.user.id, ALBUM_COMPLETION_REWARD.dream);
          await grantCitizenXp(db, ctx.user.id, ALBUM_COMPLETION_REWARD.xp);
          if (existing.length > 0) {
            await db
              .update(contentParticipation)
              .set({
                completed: 1,
                progress: 100,
                rewardsClaimed: 1,
                metadata: { ...ALBUM_COMPLETION_REWARD, trackId: input.trackId },
              })
              .where(eq(contentParticipation.id, existing[0].id));
          } else {
            await db.insert(contentParticipation).values({
              userId: ctx.user.id,
              contentType: TRANSMISSION_CONTENT_TYPE,
              contentId: albumWatchedId,
              completed: 1,
              progress: 100,
              rewardsClaimed: 1,
              metadata: { ...ALBUM_COMPLETION_REWARD, trackId: input.trackId },
            });
          }
        }
        // Also clear any prior skip row so the inbox no longer surfaces
        // it under "skipped" — the player did finish it.
        await db
          .delete(contentParticipation)
          .where(
            and(
              eq(contentParticipation.userId, ctx.user.id),
              eq(contentParticipation.contentType, LOGIN_SKIPPED_TYPE),
              eq(contentParticipation.contentId, albumWatchedId),
            ),
          );
      } catch (err) {
        logger.error("[transmissions.acceptAlbumTransmission] Reward grant failed:", err);
      }

      return {
        advanced: true as const,
        cursor: after,
        rewarded: ALBUM_COMPLETION_REWARD,
      };
    }),

  /**
   * Unified next-up query: returns the next undelivered login
   * transmission, branching on `kind`. Album tracks come first
   * (T01..T09), then TV transmissions in broadcastOrder filtered
   * by `isUnlocked`. Skipped items are skipped (kept in inbox).
   * Returns null when the queue is exhausted or the DB is down.
   */
  getNextLoginTransmission: protectedProcedure
    .input(z.object({ playerContext: PlayerContextInputSchema }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const cursor = await loadAlbumCursor(db, ctx.user.id);
      const watchedTv = await loadWatchedSet(db, ctx.user.id);
      const watchedAlbum = await loadAlbumWatchedSet(cursor);
      const watched = new Set([...watchedTv, ...watchedAlbum]);
      const skipped = await loadSkippedSet(db, ctx.user.id);

      const next = pickNextLoginItem(
        cursor,
        input.playerContext as TransmissionPlayerContext,
        watched,
        skipped,
      );
      if (next === null) return null;

      if (next.kind === "album") {
        const item = describeAlbumItem(next.trackId);
        if (!item) return null;
        return {
          ...item,
          firstEver: !cursor.firstEverDelivered,
        };
      }
      const transmission = findTvTransmission(next.transmissionId);
      if (!transmission) return null;
      return describeTvItem(transmission);
    }),

  /**
   * Mark a login transmission as skipped — closes the modal but
   * keeps the entry in the player's INBOX for later viewing.
   * Idempotent: re-skipping is a no-op. Watching the entry later
   * via `recordWatched` or `acceptAlbumTransmission` removes the
   * skip row.
   */
  skipLoginTransmission: protectedProcedure
    .input(z.object({ item: LoginTransmissionItemInputSchema }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { skipped: false as const };

      const id = loginItemId(input.item);
      const existing = await db
        .select()
        .from(contentParticipation)
        .where(
          and(
            eq(contentParticipation.userId, ctx.user.id),
            eq(contentParticipation.contentType, LOGIN_SKIPPED_TYPE),
            eq(contentParticipation.contentId, id),
          ),
        )
        .limit(1);
      if (existing.length > 0) {
        return { skipped: true as const, alreadySkipped: true as const };
      }

      // For T01: also flip firstEverDelivered so the cinematic doesn't
      // re-pop. The track itself stays in the inbox as a skip.
      if (input.item.kind === "album" && input.item.trackId === "T01") {
        const cursor = await loadAlbumCursor(db, ctx.user.id);
        if (!cursor.firstEverDelivered) {
          await persistAlbumCursor(db, ctx.user.id, {
            ...cursor,
            firstEverDelivered: true,
          });
        }
      }

      await db.insert(contentParticipation).values({
        userId: ctx.user.id,
        contentType: LOGIN_SKIPPED_TYPE,
        contentId: id,
        completed: 0,
        progress: 0,
        rewardsClaimed: 0,
        metadata: {
          skippedAt: Date.now(),
          kind: input.item.kind,
        },
      });
      return { skipped: true as const };
    }),

  /**
   * Returns the player's INBOX projection with rendered per-item
   * metadata (title, length, audio/video url, etc.) so the UI can
   * render rich rows without a second round-trip per item.
   *
   * Pending = unwatched AND not skipped.
   * Skipped = closed-with-skip; player chose "watch later".
   * Watched = grant-confirmed history with timestamps.
   */
  getLoginTransmissionInbox: protectedProcedure
    .input(z.object({ playerContext: PlayerContextInputSchema }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const empty = {
        pending: [] as InboxRow[],
        watched: [] as InboxRow[],
        skipped: [] as InboxRow[],
        pendingCount: 0,
      };
      if (!db) return empty;

      const cursor = await loadAlbumCursor(db, ctx.user.id);
      const watchedTv = await loadWatchedSet(db, ctx.user.id);
      const watchedAlbum = await loadAlbumWatchedSet(cursor);
      const watched = new Set([...watchedTv, ...watchedAlbum]);
      const skipped = await loadSkippedSet(db, ctx.user.id);

      const inbox = buildInbox(
        cursor,
        input.playerContext as TransmissionPlayerContext,
        watched,
        skipped,
      );

      const renderItem = (item: LoginTransmissionItem): InboxRow | null => {
        if (item.kind === "album") {
          const meta = describeAlbumItem(item.trackId);
          if (!meta) return null;
          return {
            kind: "album",
            id: `album:${item.trackId}`,
            trackId: item.trackId,
            title: meta.title,
            audioUrl: meta.audioUrl,
            durationMs: meta.durationMs,
            intro: meta.intro,
            outro: meta.outro,
            firstEverIntroId: meta.firstEverIntroId,
            videoUrl: null,
            driveFileId: null,
            lengthSeconds: Math.round(meta.durationMs / 1000),
            reward: ALBUM_COMPLETION_REWARD,
          };
        }
        const transmission = findTvTransmission(item.transmissionId);
        if (!transmission) return null;
        const tv = describeTvItem(transmission);
        return {
          kind: "tv",
          id: `tv:${tv.transmissionId}`,
          trackId: null,
          title: tv.title,
          audioUrl: null,
          durationMs: tv.lengthSeconds * 1000,
          intro: tv.intro,
          outro: tv.outro,
          firstEverIntroId: null,
          videoUrl: tv.videoUrl,
          driveFileId: tv.driveFileId,
          lengthSeconds: tv.lengthSeconds,
          reward: tv.reward,
          synopsis: tv.synopsis,
          relatedLoredexEntries: tv.relatedLoredexEntries,
        };
      };

      const renderList = (items: LoginTransmissionItem[]): InboxRow[] =>
        items
          .map(renderItem)
          .filter((r): r is InboxRow => r !== null);

      return {
        pending: renderList(inbox.pending),
        watched: renderList(inbox.watched),
        skipped: renderList(inbox.skipped),
        pendingCount: inbox.pendingCount,
      };
    }),
});

interface InboxRow {
  kind: "album" | "tv";
  id: string;
  trackId: string | null;
  title: string;
  audioUrl: string | null;
  videoUrl: string | null;
  driveFileId: string | null;
  durationMs: number;
  lengthSeconds: number;
  intro: string;
  outro: string;
  firstEverIntroId: "login_first_ever" | null;
  reward: { xp: number; dream: number; achievement?: string };
  synopsis?: string;
  relatedLoredexEntries?: string[];
}

// Re-export for tests.
export const _ALBUM_TRANSMISSION_INTERNALS = {
  ALBUM_CURSOR_TYPE,
  ALBUM_CURSOR_ID,
  ALBUM_TRANSMISSION_TRACK_ORDER,
};
