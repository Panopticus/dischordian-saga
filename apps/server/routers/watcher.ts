/* ═══════════════════════════════════════════════════════
   WATCHER ROUTER — observation persistence

   Two endpoints:
     watcher.observe(events) — append a batch of observations to the
       authenticated user's WatcherLog. Idempotent in the sense that
       duplicate-detection is the client's responsibility; the
       server simply appends and trims to MAX_LOG_ENTRIES.
     watcher.getLog() — read the current log so the client can
       evaluate triggers without round-tripping per check.

   Persistence: stored as JSON on `userProgress.gameData.watcherLog`.
   No new table; we ride the existing opaque column. If we later
   need indexed queries (analytics, mod tools), promote to a real
   table — for now the log is read whole or not at all.

   Privacy note: this router never accepts arbitrary text; only the
   typed observation kinds defined in apps/shared/watcher/
   observationLog.ts. Adding a kind requires a code change.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import {
  appendObservation,
  emptyLog,
  parseLog,
  type WatcherLog,
  type WatcherObservation,
} from "@shared/watcher/observationLog";

// Per-kind input schemas. Mirrors the WatcherObservation discriminated
// union in apps/shared/watcher/observationLog.ts. Kept here rather
// than re-exported from shared to avoid pulling Zod into the shared
// package; the union must stay in sync (the schema test in
// watcher.test.ts could be extended to enforce that if drift becomes
// a problem).
const skipSchema = z.object({ kind: z.literal("skip"), surface: z.string().min(1).max(120), at: z.number() });
const choiceLatencySchema = z.object({
  kind: z.literal("choice_latency"),
  surface: z.string().min(1).max(120),
  latencyMs: z.number().int().min(0).max(60 * 60 * 1000),
  at: z.number(),
});
const tabHiddenSchema = z.object({
  kind: z.literal("tab_hidden"),
  surface: z.string().min(1).max(120),
  seconds: z.number().int().min(0).max(60 * 60 * 24),
  at: z.number(),
});
const idleSchema = z.object({
  kind: z.literal("idle"),
  surface: z.string().min(1).max(120),
  seconds: z.number().int().min(0).max(60 * 60 * 24),
  at: z.number(),
});
const pvpRetreatSchema = z.object({
  kind: z.literal("pvp_retreat"),
  matchId: z.string().min(1).max(120),
  turn: z.number().int().min(0).max(500),
  at: z.number(),
});
const replayRewatchSchema = z.object({
  kind: z.literal("replay_rewatch"),
  replayId: z.string().min(1).max(120),
  at: z.number(),
});
const lateNightSessionSchema = z.object({
  kind: z.literal("late_night_session"),
  localHour: z.number().int().min(0).max(23),
  at: z.number(),
});
const sameChoiceTwiceSchema = z.object({
  kind: z.literal("same_choice_twice"),
  choiceId: z.string().min(1).max(120),
  at: z.number(),
});
const firstDissentSchema = z.object({ kind: z.literal("first_dissent"), at: z.number() });
const nameCommittedSchema = z.object({ kind: z.literal("name_committed"), at: z.number() });
const lockedDoorAttemptSchema = z.object({
  kind: z.literal("locked_door_attempt"),
  doorId: z.string().min(1).max(120),
  at: z.number(),
});

const observationSchema = z.union([
  skipSchema,
  choiceLatencySchema,
  tabHiddenSchema,
  idleSchema,
  pvpRetreatSchema,
  replayRewatchSchema,
  lateNightSessionSchema,
  sameChoiceTwiceSchema,
  firstDissentSchema,
  nameCommittedSchema,
  lockedDoorAttemptSchema,
]);

/** Cap per-call to keep payloads small. The client batches and
 *  flushes on visibility change, so this should rarely exceed a few
 *  dozen. */
const MAX_BATCH = 100;

function readWatcherLog(gameData: Record<string, unknown> | null | undefined): WatcherLog {
  const raw = gameData && typeof gameData === "object" ? (gameData as { watcherLog?: unknown }).watcherLog : undefined;
  return parseLog(raw);
}

export const watcherRouter = router({
  observe: protectedProcedure
    .input(z.object({ events: z.array(observationSchema).max(MAX_BATCH) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      // Without a DB the Watcher degrades to client-only. Fail soft —
      // this endpoint must never block the player's session.
      if (!db) return { success: false, written: 0, total: 0 };

      const [progress] = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .limit(1);

      if (!progress) {
        // No row yet — create one with just the watcherLog seeded.
        let log: WatcherLog = emptyLog();
        for (const e of input.events) log = appendObservation(log, e as WatcherObservation);
        await db.insert(userProgress).values({
          userId: ctx.user.id,
          gameData: { watcherLog: log } as Record<string, unknown>,
        });
        return { success: true, written: input.events.length, total: log.events.length };
      }

      const gameData = (progress.gameData || {}) as Record<string, unknown>;
      let log = readWatcherLog(gameData);
      for (const e of input.events) log = appendObservation(log, e as WatcherObservation);
      gameData.watcherLog = log;
      await db
        .update(userProgress)
        .set({ gameData: gameData as Record<string, unknown> })
        .where(eq(userProgress.userId, ctx.user.id));
      return { success: true, written: input.events.length, total: log.events.length };
    }),

  getLog: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return emptyLog();
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id))
      .limit(1);
    if (!progress) return emptyLog();
    return readWatcherLog((progress.gameData || {}) as Record<string, unknown>);
  }),

  /** Force-clear the log. Admin / dev tooling — players can use this
   *  through the Architect Console for QA. Authenticated against the
   *  caller's own row only; no cross-user write. */
  clearLog: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id))
      .limit(1);
    if (!progress) return { success: true };
    const gameData = (progress.gameData || {}) as Record<string, unknown>;
    delete gameData.watcherLog;
    await db
      .update(userProgress)
      .set({ gameData: gameData as Record<string, unknown> })
      .where(eq(userProgress.userId, ctx.user.id));
    return { success: true };
  }),
});
