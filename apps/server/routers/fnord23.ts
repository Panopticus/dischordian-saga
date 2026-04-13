/**
 * FNORD-23 router — backing API for the Engineer's stolen sampler.
 *
 * Procedures:
 *   - getState: per-user device state (discovered, unlocked channels,
 *     last played track). Auto-creates a row on first call.
 *   - discover: one-shot call that flips the discovered flag to true,
 *     unlocks OUTERGROOVE, and returns the discovery lore blob.
 *     Called from the second-room sequence.
 *   - listChannels: all channels the player can see (unlocked plus
 *     any locked teasers).
 *   - listTracks: all instrumentals for a given channel.
 *   - captureAudio: record a VO clip into the memory resin bank.
 *     Idempotent via (userId, audioClipId, context) unique index.
 *   - listMemoryResin: the player's captured audio library,
 *     filterable by speaker and paginated.
 *   - getDeviceLore: the in-universe description of the device.
 *   - rollFnord: press the unlabeled 23rd button. Returns a
 *     deterministic FnordEffect seeded by userId + UTC day.
 *   - setLastPlayed: remember which track the player had queued.
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { memoryResinBank, fnord23UserState } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { logger } from "../logger";
import {
  ALL_CHANNELS,
  ALL_INSTRUMENTAL_TRACKS,
  INSTRUMENTAL_TRACK_MAP,
  FNORD_EFFECTS,
  FNORD23_DEVICE_LORE,
} from "@shared/tcg-core";
import type { FnordEffect } from "@shared/tcg-core";

/** Channel the device ships with — OUTERGROOVE unlocks the moment
 *  the player discovers the sampler. */
const STARTING_CHANNEL_IDS: readonly string[] = ["outergroove"];

/** Deterministic 32-bit hash for seeding the FNORD button. */
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const fnord23Router = router({
  /** Per-user device state. Creates a default row on first call. */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        discovered: false,
        unlockedChannelIds: [] as string[],
        lastPlayedTrackId: null as string | null,
        beatGameUnlocked: false,
      };
    }
    const rows = await db
      .select()
      .from(fnord23UserState)
      .where(eq(fnord23UserState.userId, ctx.user.id))
      .limit(1);
    if (!rows[0]) {
      const initial = {
        userId: ctx.user.id,
        unlockedChannelIds: [] as string[],
        discovered: 0,
        beatGameUnlocked: 0,
      };
      await db.insert(fnord23UserState).values(initial);
      return {
        discovered: false,
        unlockedChannelIds: [] as string[],
        lastPlayedTrackId: null as string | null,
        beatGameUnlocked: false,
      };
    }
    return {
      discovered: rows[0].discovered === 1,
      unlockedChannelIds: (rows[0].unlockedChannelIds as string[] | null) ?? [],
      lastPlayedTrackId: rows[0].lastPlayedTrackId ?? null,
      beatGameUnlocked: rows[0].beatGameUnlocked === 1,
    };
  }),

  /** Flip the discovered flag + unlock the starting channels. */
  discover: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { ok: false };
    await db.insert(fnord23UserState).values({
      userId: ctx.user.id,
      unlockedChannelIds: [...STARTING_CHANNEL_IDS],
      discovered: 1,
      beatGameUnlocked: 0,
    }).onDuplicateKeyUpdate({
      set: {
        discovered: 1,
        unlockedChannelIds: [...STARTING_CHANNEL_IDS],
      },
    });
    return { ok: true, lore: FNORD23_DEVICE_LORE };
  }),

  /** List channels the player can see. Locked channels still appear
   *  so the UI can show them as "coming soon" slots. */
  listChannels: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const unlocked = new Set<string>();
    if (db) {
      const rows = await db
        .select({ unlockedChannelIds: fnord23UserState.unlockedChannelIds })
        .from(fnord23UserState)
        .where(eq(fnord23UserState.userId, ctx.user.id))
        .limit(1);
      const ids = (rows[0]?.unlockedChannelIds as string[] | null) ?? [];
      ids.forEach((id) => unlocked.add(id));
    }
    return ALL_CHANNELS.map((channel) => ({
      ...channel,
      unlocked: unlocked.has(channel.id),
    }));
  }),

  /** List all tracks for a channel. */
  listTracks: protectedProcedure
    .input(z.object({ channelId: z.string().min(1).max(64) }))
    .query(async ({ input }) => {
      return ALL_INSTRUMENTAL_TRACKS.filter((t) => t.channelId === input.channelId);
    }),

  /** Capture an audio clip into the player's memory resin bank.
   *  Idempotent — calling twice with the same (audioClipId, context)
   *  is a no-op. Called by the audio-playback hook whenever the
   *  client starts playing a new VO line. */
  captureAudio: protectedProcedure
    .input(z.object({
      audioClipId: z.string().min(1).max(128),
      audioUrl: z.string().min(1).max(512),
      speaker: z.string().min(1).max(64).optional(),
      context: z.string().min(1).max(128).optional(),
      transcript: z.string().max(10_000).optional(),
      durationSeconds: z.number().int().min(0).max(3600).default(0),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { ok: false, captured: false };
      try {
        await db.insert(memoryResinBank).values({
          userId: ctx.user.id,
          audioClipId: input.audioClipId,
          audioUrl: input.audioUrl,
          speaker: input.speaker ?? null,
          context: input.context ?? null,
          transcript: input.transcript ?? null,
          durationSeconds: input.durationSeconds,
          tags: input.tags ?? null,
        });
        return { ok: true, captured: true };
      } catch {
        // Already captured (unique index). Success is still success.
        return { ok: true, captured: false };
      }
    }),

  /** The player's memory resin library. */
  listMemoryResin: protectedProcedure
    .input(z.object({
      speaker: z.string().max(64).optional(),
      limit: z.number().int().min(1).max(200).default(50),
      offset: z.number().int().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const base = db.select().from(memoryResinBank)
        .where(
          input.speaker
            ? and(
                eq(memoryResinBank.userId, ctx.user.id),
                eq(memoryResinBank.speaker, input.speaker),
              )
            : eq(memoryResinBank.userId, ctx.user.id),
        )
        .orderBy(desc(memoryResinBank.capturedAt))
        .limit(input.limit)
        .offset(input.offset);
      return await base;
    }),

  /** The in-universe description of the FNORD-23 device. */
  getDeviceLore: protectedProcedure.query(() => FNORD23_DEVICE_LORE),

  /** Press the unlabeled button. Deterministic per user per day. */
  rollFnord: protectedProcedure
    .input(z.object({ nonce: z.number().int().optional() }))
    .mutation(async ({ ctx, input }) => {
      const day = Math.floor(Date.now() / 86_400_000);
      const seed = hashString(`${ctx.user.id}_${day}_${input.nonce ?? 0}`);
      const effect: FnordEffect = FNORD_EFFECTS[seed % FNORD_EFFECTS.length];
      return { effect };
    }),

  /** Persist which track the player had queued up. */
  setLastPlayed: protectedProcedure
    .input(z.object({ trackId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { ok: false };
      if (!INSTRUMENTAL_TRACK_MAP[input.trackId]) {
        return { ok: false, error: "unknown_track" };
      }
      try {
        await db
          .update(fnord23UserState)
          .set({ lastPlayedTrackId: input.trackId })
          .where(eq(fnord23UserState.userId, ctx.user.id));
      } catch (e) {
        logger.warn("Failed to set last played track", e);
      }
      return { ok: true };
    }),

  /** Count captured clips grouped by speaker — drives the
   *  "64 lines from Elara / 12 lines from The Human" sidebar. */
  getSpeakerCounts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [] as Array<{ speaker: string; count: number }>;
    const rows = await db
      .select({
        speaker: memoryResinBank.speaker,
        count: sql<number>`COUNT(*)`,
      })
      .from(memoryResinBank)
      .where(eq(memoryResinBank.userId, ctx.user.id))
      .groupBy(memoryResinBank.speaker);
    return rows.map((r) => ({
      speaker: r.speaker ?? "unknown",
      count: Number(r.count ?? 0),
    }));
  }),
});
