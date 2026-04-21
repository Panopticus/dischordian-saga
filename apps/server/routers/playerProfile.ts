/* ═══════════════════════════════════════════════════════
   PLAYER PSYCHOLOGICAL PROFILE — tRPC router.

   Three procedures:
     - getProfile(): the user's current snapshot (creates a neutral
       row on first call).
     - recordEvent({ source, payload?, overrideDeltas? }): apply
       the standard delta for the source (or an explicit override),
       update the profile snapshot, and append an audit-log row.
       Atomic across both writes.
     - getRecentEvents({ limit?, source? }): the user's recent
       events for surfacing as specific GM citations.

   Consumers:
     - apps/server/routers/chess.ts — mind-game choices, climb
       offers, hint usage, draw offers, resigns
     - apps/client (later) — Self-Portrait page, NPC dialog hooks
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb, type DrizzleDb } from "../db";
import { playerProfile, playerProfileEvents } from "../../db/schema";
import {
  PROFILE_AXES,
  emptyProfile,
  applyDelta,
  type PlayerProfile,
  type ProfileDelta,
} from "@shared/playerProfile";
import { getStandardDelta } from "@shared/playerProfileSources";

/** Convert a DB row into the shared PlayerProfile shape. */
function rowToProfile(row: typeof playerProfile.$inferSelect): PlayerProfile {
  return {
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

/** Fetch a user's profile, returning a neutral profile if no row
 *  exists yet (first time the user touches a system that writes).
 *  Does NOT create the row — that happens on the first
 *  `recordEvent` call to avoid populating empty rows for every
 *  user who logs in. */
async function loadProfile(
  db: DrizzleDb,
  userId: number,
): Promise<PlayerProfile> {
  const rows = await db
    .select()
    .from(playerProfile)
    .where(eq(playerProfile.userId, userId))
    .limit(1);
  if (rows.length === 0) return emptyProfile();
  return rowToProfile(rows[0]);
}

/** Resolve the delta for an event. If `overrideDeltas` is provided
 *  (e.g. for a one-off choice that doesn't match the source's
 *  standard weight), use it; otherwise look up the standard delta
 *  from the registry. Unknown sources are tolerated — they record
 *  an event with no axis movement. */
function resolveDelta(
  source: string,
  overrideDeltas: ProfileDelta | undefined,
): ProfileDelta {
  if (overrideDeltas) return overrideDeltas;
  return getStandardDelta(source) ?? {};
}

/** Zod schema for a partial profile delta. Each axis is optional;
 *  values are bounded to a sane single-event range to prevent
 *  runaway writes from a misbehaving caller. */
const profileDeltaSchema = z
  .object(
    Object.fromEntries(
      PROFILE_AXES.map((axis) => [
        axis,
        z.number().min(-50).max(50).optional(),
      ]),
    ) as Record<(typeof PROFILE_AXES)[number], z.ZodOptional<z.ZodNumber>>,
  )
  .strict()
  .partial();

export const playerProfileRouter = router({
  /** Read the caller's current profile. Returns a neutral profile
   *  if no events have been recorded yet. */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    return loadProfile(db, ctx.user.id);
  }),

  /** Record a single profile event. Looks up the standard delta
   *  for the source id (or uses `overrideDeltas`), applies it to
   *  the profile snapshot, and appends an audit-log row. */
  recordEvent: protectedProcedure
    .input(
      z.object({
        source: z.string().min(1).max(64),
        payload: z.record(z.string(), z.unknown()).optional(),
        overrideDeltas: profileDeltaSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const userId = ctx.user.id;
      const delta = resolveDelta(input.source, input.overrideDeltas);
      const now = new Date();

      const current = await loadProfile(db, userId);
      const next = applyDelta(current, delta, now);

      // Upsert the snapshot. Drizzle MySQL doesn't expose an
      // INSERT...ON DUPLICATE KEY UPDATE helper here, so we
      // branch on whether a row exists. Both sides write
      // identical column lists.
      const exists = current.eventCount > 0 || current.lastUpdatedAt !== null;
      if (exists) {
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
      } else {
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
      }

      await db.insert(playerProfileEvents).values({
        userId,
        source: input.source,
        payload: input.payload ?? null,
        deltas: (delta as Record<string, number>) ?? null,
        createdAt: now,
      });

      return { profile: next, deltaApplied: delta };
    }),

  /** Recent profile events for this user, optionally filtered by
   *  source. Used by the Game Master to cite specific past events
   *  in the Tier 2+ "I see you" reveals, and by the Self-Portrait
   *  page to show a feed. */
  getRecentEvents: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(20),
        source: z.string().min(1).max(64).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const where = input.source
        ? and(
            eq(playerProfileEvents.userId, ctx.user.id),
            eq(playerProfileEvents.source, input.source),
          )
        : eq(playerProfileEvents.userId, ctx.user.id);

      const rows = await db
        .select()
        .from(playerProfileEvents)
        .where(where)
        .orderBy(desc(playerProfileEvents.createdAt))
        .limit(input.limit);

      return rows.map((r) => ({
        id: r.id,
        source: r.source,
        payload: r.payload,
        deltas: r.deltas,
        createdAt: r.createdAt,
      }));
    }),
});
