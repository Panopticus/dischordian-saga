/**
 * YEARLY EVENTS ROUTER
 * ──────────────────────────────────────────────────
 * Read-active / participate / next-anchor lookup for the four
 * canonical yearly anchors (Foundation Day, Severance, Mechronis
 * Festival, Memorial Day for the Fallen).
 *
 * Activation + close is handled by `yearlyEventScheduler.ts`
 * (called from a tick site). This router is the read + write
 * surface the client sees.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { logger } from "../logger";
import { yearlyEvents, yearlyEventParticipation } from "../../db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import {
  YEARLY_EVENTS,
  type YearlyEventKey,
} from "@shared/yearlyEvents";
import { ripple } from "../services/rippleEngine";
import { rippleLedgerService } from "../services/rippleLedgerService";

const YearlyEventKeyEnum = z.enum([
  "foundation_day",
  "severance",
  "mechronis_festival",
  "memorial_day",
]);

/**
 * Pure helper: for an anchor (month, day) and a reference date,
 * return the next anchor as a Date. If today is on or before the
 * anchor, returns this year's anchor; otherwise next year's.
 */
export function nextAnchor(
  anchorMonth: number,
  anchorDay: number,
  ref: Date = new Date(),
): Date {
  const year = ref.getUTCFullYear();
  const thisYear = new Date(Date.UTC(year, anchorMonth - 1, anchorDay));
  if (thisYear.getTime() >= ref.getTime()) return thisYear;
  return new Date(Date.UTC(year + 1, anchorMonth - 1, anchorDay));
}

export const yearlyEventsRouter = router({
  /** Currently-active yearly events (activatedAt set, resolvedAt null). */
  listActive: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(yearlyEvents)
      .where(isNull(yearlyEvents.resolvedAt))
      .orderBy(desc(yearlyEvents.activatedAt));
    return rows;
  }),

  /** All canonical defs paired with their next anchor date. */
  listAllDefs: publicProcedure.query(async () => {
    const now = new Date();
    return YEARLY_EVENTS.map((def) => ({
      ...def,
      nextAnchor: nextAnchor(def.anchorMonth, def.anchorDay, now).toISOString(),
    }));
  }),

  /** The next yearly event the player will encounter. */
  getNextAnchor: publicProcedure.query(async () => {
    const now = new Date();
    let best: { def: (typeof YEARLY_EVENTS)[number]; at: Date } | null = null;
    for (const def of YEARLY_EVENTS) {
      const at = nextAnchor(def.anchorMonth, def.anchorDay, now);
      if (!best || at.getTime() < best.at.getTime()) {
        best = { def, at };
      }
    }
    return best
      ? { eventKey: best.def.key, name: best.def.name, at: best.at.toISOString() }
      : null;
  }),

  /** Record a participation contribution from the active player. */
  participate: protectedProcedure
    .input(
      z.object({
        eventKey: YearlyEventKeyEnum,
        contribution: z.number().int().min(1).max(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const year = new Date().getUTCFullYear();

      const [event] = await db
        .select()
        .from(yearlyEvents)
        .where(
          and(
            eq(yearlyEvents.eventKey, input.eventKey),
            eq(yearlyEvents.activeYear, year),
            isNull(yearlyEvents.resolvedAt),
          ),
        )
        .limit(1);
      if (!event) {
        throw new Error(`Yearly event ${input.eventKey} is not active`);
      }

      // Insert-or-add the contribution. We use a manual upsert dance
      // to keep the unique (eventId, userId) constraint authoritative.
      const existing = await db
        .select()
        .from(yearlyEventParticipation)
        .where(
          and(
            eq(yearlyEventParticipation.eventId, event.id),
            eq(yearlyEventParticipation.userId, ctx.user.id),
          ),
        )
        .limit(1);

      if (existing.length === 0) {
        await db.insert(yearlyEventParticipation).values({
          eventId: event.id,
          userId: ctx.user.id,
          contribution: input.contribution,
        });
      } else {
        await db
          .update(yearlyEventParticipation)
          .set({
            contribution: (existing[0].contribution ?? 0) + input.contribution,
          })
          .where(eq(yearlyEventParticipation.id, existing[0].id));
      }

      try {
        await ripple.emit("yearly_event_participation", {
          userId: ctx.user.id,
          eventKey: input.eventKey,
          year,
          contribution: input.contribution,
        });
        await rippleLedgerService.record({
          eventType: "yearly_event_participation",
          userId: ctx.user.id,
          fromSystem: "yearly",
          toSystems: ["governance", "social"],
          payload: { eventKey: input.eventKey, year, contribution: input.contribution },
        });
      } catch (err) {
        logger.error("[yearlyEvents] participate ripple failed:", err);
      }

      return { ok: true };
    }),

  /** Lookup this year's row for one event (or null). */
  getThisYear: publicProcedure
    .input(z.object({ eventKey: YearlyEventKeyEnum }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const year = new Date().getUTCFullYear();
      const [row] = await db
        .select()
        .from(yearlyEvents)
        .where(
          and(
            eq(yearlyEvents.eventKey, input.eventKey),
            eq(yearlyEvents.activeYear, year),
          ),
        )
        .limit(1);
      return row ?? null;
    }),

  /** A simple test seam used by yearlyEvents.test.ts. */
  _nextAnchor: publicProcedure
    .input(
      z.object({
        eventKey: YearlyEventKeyEnum,
        ref: z.string().datetime().optional(),
      }),
    )
    .query(({ input }) => {
      const def = YEARLY_EVENTS.find((d) => d.key === input.eventKey)!;
      const ref = input.ref ? new Date(input.ref) : new Date();
      return nextAnchor(def.anchorMonth, def.anchorDay, ref).toISOString();
    }),
});

// Helper export for narrow re-use in tests / scheduler.
export type { YearlyEventKey };
