// audit-allow-proc: listAvailable, getProgress, getChapterStatus
// These three procs are part of the Wave 2 DLC surface; the client
// today only consumes listAll + markChapterComplete, but the others
// remain registered as the entry points the upcoming chapter-detail
// + per-player-progress UIs will call once those pages ship.
/* ═══════════════════════════════════════════════════════
   DLC CHAPTERS — tRPC router (foundation)

   Wave 2 ships the surface area for the DLC chapter system:
     - listAvailable    : chapters the player can play right now
     - listAll          : every registered chapter + per-player status
     - getProgress      : completed-chapter ids for the active player
     - markChapterComplete : fired by client when the chapter's last
                             step + encounter resolves; persists the
                             `dlc_chapter_<id>_complete` flag and the
                             chapter's other declared flags.

   The registry ships empty (Wave 2 = foundation). All endpoints
   degrade gracefully when ALL_DLC_CHAPTERS is []: lists return
   empty, getProgress returns an empty set, markChapterComplete
   404s for unknown chapter ids.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import {
  ALL_DLC_CHAPTERS,
  deriveDlcChapterStatus,
  dlcChapterCompletionFlag,
  getDlcChapter,
  type DlcChapterStatus,
} from "@shared/dlc";

type AnyRecord = Record<string, unknown>;

async function readGameData(userId: number): Promise<{
  flags: AnyRecord;
  entitlements: AnyRecord;
  bloodlineGenerations: Record<string, number>;
  raw: AnyRecord;
}> {
  const db = await getDb();
  if (!db) return { flags: {}, entitlements: {}, bloodlineGenerations: {}, raw: {} };
  const rows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const row = rows[0];
  if (!row) return { flags: {}, entitlements: {}, bloodlineGenerations: {}, raw: {} };
  const raw = (row.gameData ?? {}) as AnyRecord;
  const bloodlineGenerations: Record<string, number> = {};
  const rawGens = raw.bloodlineGenerations;
  if (rawGens && typeof rawGens === "object") {
    for (const [k, v] of Object.entries(rawGens as AnyRecord)) {
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isFinite(n) && n > 0) bloodlineGenerations[k] = n;
    }
  }
  return {
    flags: (raw.narrativeFlags ?? {}) as AnyRecord,
    entitlements: (raw.entitlements ?? {}) as AnyRecord,
    bloodlineGenerations,
    raw,
  };
}

/** Persist a partial flag merge into `userProgress.gameData.narrativeFlags`. */
async function setFlags(
  userId: number,
  newFlags: Record<string, true>,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const rows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const row = rows[0];
  const raw = (row?.gameData ?? {}) as AnyRecord;
  const flags = { ...((raw.narrativeFlags ?? {}) as AnyRecord), ...newFlags };
  const next = { ...raw, narrativeFlags: flags };
  if (row) {
    await db
      .update(userProgress)
      .set({ gameData: next })
      .where(eq(userProgress.userId, userId));
  } else {
    await db.insert(userProgress).values({ userId, gameData: next });
  }
}

export const dlcChaptersRouter = router({
  /** Chapters whose prerequisites are met AND the player hasn't
   *  already completed. Ordered by parent-section then sequence. */
  listAvailable: protectedProcedure.query(async ({ ctx }) => {
    const { flags, entitlements, bloodlineGenerations } = await readGameData(ctx.user.id);
    const out = [];
    for (const chapter of ALL_DLC_CHAPTERS) {
      const status = deriveDlcChapterStatus({ chapter, flags, entitlements, bloodlineGenerations });
      if (status.available && !status.alreadyComplete) {
        out.push({ chapter, status });
      }
    }
    return out;
  }),

  /** Every registered chapter + its per-player status. Used by the
   *  DLC index UI so locked / completed chapters can show alongside
   *  available ones. */
  listAll: protectedProcedure.query(async ({ ctx }) => {
    const { flags, entitlements, bloodlineGenerations } = await readGameData(ctx.user.id);
    return ALL_DLC_CHAPTERS.map((chapter) => ({
      chapter,
      status: deriveDlcChapterStatus({ chapter, flags, entitlements, bloodlineGenerations }),
    }));
  }),

  /** Completed-chapter ids for the active player. */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const { flags } = await readGameData(ctx.user.id);
    const completed: string[] = [];
    for (const key of Object.keys(flags)) {
      if (!flags[key]) continue;
      const m = /^dlc_chapter_(.+)_complete$/.exec(key);
      if (m) completed.push(m[1]);
    }
    return { completedChapterIds: completed };
  }),

  /** Mark a chapter complete. Writes the canonical
   *  `dlc_chapter_<id>_complete` flag plus any additional flags the
   *  chapter declares in `setsFlagsOnComplete`. Idempotent — calling
   *  twice is a no-op. */
  markChapterComplete: protectedProcedure
    .input(
      z.object({
        chapterId: z.string().min(1).max(120),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chapter = getDlcChapter(input.chapterId);
      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Unknown DLC chapter: ${input.chapterId}`,
        });
      }
      const completionFlag = dlcChapterCompletionFlag(chapter.id);
      const flags: Record<string, true> = { [completionFlag]: true };
      for (const flag of chapter.setsFlagsOnComplete) {
        flags[flag] = true;
      }
      await setFlags(ctx.user.id, flags);
      return {
        chapterId: chapter.id,
        flagsSet: Object.keys(flags),
      } as const;
    }),

  /** Per-chapter status by id. Useful for "open-the-detail-panel"
   *  flows that fetch a single chapter rather than the whole list. */
  getChapterStatus: protectedProcedure
    .input(z.object({ chapterId: z.string().min(1).max(120) }))
    .query(async ({ ctx, input }): Promise<DlcChapterStatus | null> => {
      const chapter = getDlcChapter(input.chapterId);
      if (!chapter) return null;
      const { flags, entitlements, bloodlineGenerations } = await readGameData(ctx.user.id);
      return deriveDlcChapterStatus({ chapter, flags, entitlements, bloodlineGenerations });
    }),
});
