/* ═══════════════════════════════════════════════════════
   VORTEX INCURSION ROUTER — §11.5 community endgame sync

   Endpoints:
     reportRoomCleared     — record a room clear for the user
                             and fire a ripple event so the
                             community counter advances.
     getCommunityProgress  — read the community-wide progress
                             counter (total Vortex rooms
                             cleared by all players this week
                             + total Vortex Cores held).
     getUserStats          — read the caller's personal
                             Vortex stats.
     listRecentClears      — last N room clears for UI feeds.

   Uses the existing `contentParticipation` table with
   contentType = "vortex_room". No new migration needed.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { contentParticipation } from "../../db/schema";
import { ripple } from "../services/rippleEngine";
import { VORTEX_PROGRESS_RIPPLE_EVENT } from "@shared/vortexIncursionTemplate";
import { logger } from "../logger";

const ROOM_KEY_SCHEMA = z.string().min(1).max(64);
const RUN_ID_SCHEMA = z.string().min(1).max(64);
const ROOM_INDEX_SCHEMA = z.number().int().min(0).max(9);

/** Window in ms for "current week" aggregates (7 days). */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const vortexIncursionRouter = router({
  /* ─── REPORT A ROOM CLEAR ─── */
  reportRoomCleared: protectedProcedure
    .input(
      z.object({
        runId: RUN_ID_SCHEMA,
        roomKey: ROOM_KEY_SCHEMA,
        roomIndex: ROOM_INDEX_SCHEMA,
        elapsedMs: z.number().int().min(0).max(3_600_000),
        isCore: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        // In a dev environment without a DB, fall through to a
        // ripple emit so the in-memory community counter still
        // advances.
        await ripple
          .emit(VORTEX_PROGRESS_RIPPLE_EVENT, {
            userId: ctx.user.id,
            roomKey: input.roomKey,
            roomIndex: input.roomIndex,
            elapsedMs: input.elapsedMs,
            isCore: Boolean(input.isCore),
          })
          .catch((err) => {
            logger.warn("[vortexIncursion] ripple emit failed", err);
          });
        return { recorded: false, ripple: true };
      }

      // contentId = `${runId}_room_${roomIndex}` so retries
      // within the same run don't double-count.
      const contentId = `${input.runId}_room_${input.roomIndex}`;
      const existing = await db
        .select()
        .from(contentParticipation)
        .where(
          and(
            eq(contentParticipation.userId, ctx.user.id),
            eq(contentParticipation.contentType, "vortex_room"),
            eq(contentParticipation.contentId, contentId),
          ),
        )
        .limit(1);

      if (existing.length === 0) {
        await db.insert(contentParticipation).values({
          userId: ctx.user.id,
          contentType: "vortex_room",
          contentId,
          completed: 1,
          progress: 100,
          metadata: {
            runId: input.runId,
            roomKey: input.roomKey,
            roomIndex: input.roomIndex,
            elapsedMs: input.elapsedMs,
            isCore: Boolean(input.isCore),
          },
        });
      }

      // Always emit the ripple — it's idempotent at the
      // subscriber layer and some listeners care about the
      // live beat regardless of first-clear status.
      await ripple
        .emit(VORTEX_PROGRESS_RIPPLE_EVENT, {
          userId: ctx.user.id,
          roomKey: input.roomKey,
          roomIndex: input.roomIndex,
          elapsedMs: input.elapsedMs,
          isCore: Boolean(input.isCore),
        })
        .catch((err) => {
          logger.warn("[vortexIncursion] ripple emit failed", err);
        });

      return { recorded: existing.length === 0, ripple: true };
    }),

  /* ─── COMMUNITY PROGRESS ─── */
  getCommunityProgress: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return {
        roomsClearedThisWeek: 0,
        coresHeldThisWeek: 0,
        uniqueArksThisWeek: 0,
      };
    }
    const since = new Date(Date.now() - WEEK_MS);
    const [[roomsRow]] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(contentParticipation)
        .where(
          and(
            eq(contentParticipation.contentType, "vortex_room"),
            eq(contentParticipation.completed, 1),
            gte(contentParticipation.createdAt, since),
          ),
        ),
    ]);

    // Core count — read rows where contentId ends in _room_9.
    const coreRows = await db
      .select({ count: sql<number>`count(*)` })
      .from(contentParticipation)
      .where(
        and(
          eq(contentParticipation.contentType, "vortex_room"),
          eq(contentParticipation.completed, 1),
          gte(contentParticipation.createdAt, since),
          sql`${contentParticipation.contentId} LIKE '%_room_9'`,
        ),
      );

    const uniqueArks = await db
      .select({ count: sql<number>`count(distinct ${contentParticipation.userId})` })
      .from(contentParticipation)
      .where(
        and(
          eq(contentParticipation.contentType, "vortex_room"),
          eq(contentParticipation.completed, 1),
          gte(contentParticipation.createdAt, since),
        ),
      );

    return {
      roomsClearedThisWeek: Number(roomsRow?.count ?? 0),
      coresHeldThisWeek: Number(coreRows[0]?.count ?? 0),
      uniqueArksThisWeek: Number(uniqueArks[0]?.count ?? 0),
    };
  }),

  /* ─── USER STATS ─── */
  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return { roomsCleared: 0, coresReached: 0, runsStarted: 0 };
    }
    const rows = await db
      .select()
      .from(contentParticipation)
      .where(
        and(
          eq(contentParticipation.userId, ctx.user.id),
          eq(contentParticipation.contentType, "vortex_room"),
          eq(contentParticipation.completed, 1),
        ),
      );
    const roomsCleared = rows.length;
    const coresReached = rows.filter((r) =>
      r.contentId.endsWith("_room_9"),
    ).length;
    // Unique runs = distinct prefix before "_room_".
    const runIds = new Set(
      rows.map((r) => r.contentId.split("_room_")[0]).filter(Boolean),
    );
    return {
      roomsCleared,
      coresReached,
      runsStarted: runIds.size,
    };
  }),

  /* ─── RECENT CLEARS FEED ─── */
  listRecentClears: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { clears: [] };
      const rows = await db
        .select()
        .from(contentParticipation)
        .where(
          and(
            eq(contentParticipation.contentType, "vortex_room"),
            eq(contentParticipation.completed, 1),
          ),
        )
        .orderBy(desc(contentParticipation.createdAt))
        .limit(input.limit ?? 10);
      return {
        clears: rows.map((r) => ({
          userId: r.userId,
          contentId: r.contentId,
          metadata: r.metadata,
          clearedAt: r.createdAt,
        })),
      };
    }),
});
