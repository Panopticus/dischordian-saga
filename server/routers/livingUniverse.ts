/* ═══════════════════════════════════════════════════════
   LIVING UNIVERSE ROUTER

   Public, dedicated tRPC router for Task 1.2. Exposes the
   Living Universe state that was previously only reachable
   through dailyBrief:
     - current community pressure (last 30 days)
     - currently active events with their expiry windows
     - append-only history of resolved events
     - admin / internal mutations for manual intervention
       and the periodic universe tick job

   The heavy lifting still lives in services/pressureService.ts;
   this router is a thin, dedicated surface area so the client
   can find everything in one place.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { universeEventState, universeEventHistory } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";
import { pressureService } from "../services/pressureService";
import {
  ALL_EMERGENT_EVENTS,
  DEFAULT_PRESSURE,
  EVENT_SYNERGIES,
  getEmergingEvent,
  type PressureTracker,
} from "@shared/livingUniverseEvents";
import { logger } from "../logger";

/** Zod enum of the 5 canonical pressure dimensions used by the Living Universe */
const PressureTypeEnum = z.enum([
  "deaths",
  "trustGains",
  "viralExposures",
  "loreDiscoveries",
  "betrayals",
  "moralityHumanity",
  "moralityMachine",
  "truthRevealed",
  "healingDone",
  "exploration",
]);

/** Resolution kinds accepted by admin tooling */
const ResolutionEnum = z.enum(["community_success", "community_failure", "expired", "admin"]);

export const livingUniverseRouter = router({
  /**
   * Return the current aggregated pressure tracker across all dimensions.
   * Public query — the Living Universe is community-wide, not per-user.
   */
  getActivePressure: publicProcedure.query(async () => {
    const pressure = await pressureService.getAllPressures();
    const emerging = getEmergingEvent(pressure);
    return {
      pressure,
      emerging,
      defaults: DEFAULT_PRESSURE as PressureTracker,
    };
  }),

  /**
   * Return all events that are currently active. Includes the event
   * definition so the client can render names/taglines/lore.
   */
  getActiveEvents: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { active: [], synergies: [] };

    const rows = await db.select().from(universeEventState)
      .where(eq(universeEventState.isActive, 1));

    const activeEventIds = rows.map(r => r.eventId);
    const synergies = EVENT_SYNERGIES.filter(s =>
      s.events.every(eId => activeEventIds.includes(eId))
    );

    return {
      active: rows.map(r => ({
        eventId: r.eventId,
        pressureScore: r.pressureScore,
        activatedAt: r.activatedAt,
        expiresAt: r.expiresAt,
        playerParticipation: r.playerParticipation,
        occurrenceCount: r.occurrenceCount,
        definition: ALL_EMERGENT_EVENTS.find(e => e.id === r.eventId) ?? null,
      })),
      synergies,
    };
  }),

  /**
   * Return the most recent N resolved events. Defaults to 20, max 100.
   */
  getEventHistory: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const limit = input?.limit ?? 20;
      const rows = await db.select().from(universeEventHistory)
        .orderBy(desc(universeEventHistory.resolvedAt))
        .limit(limit);

      return rows.map(r => ({
        id: r.id,
        eventId: r.eventId,
        activatedAt: r.activatedAt,
        resolvedAt: r.resolvedAt,
        resolution: r.resolution,
        finalPressureScore: r.finalPressureScore,
        totalParticipants: r.totalParticipants,
        effectsSummary: r.effectsSummary,
        definition: ALL_EMERGENT_EVENTS.find(e => e.id === r.eventId) ?? null,
      }));
    }),

  /**
   * Record community participation in resolving an active event.
   * Any authenticated player can call this when they complete an
   * event-specific quest or action.
   */
  recordParticipation: protectedProcedure
    .input(z.object({
      eventId: z.string().min(1).max(64),
      amount: z.number().min(1).max(100).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await pressureService.recordParticipation(input.eventId, ctx.user.id, input.amount);
      return { success: true };
    }),

  /**
   * Internal increment mutation. Other tRPC routers that don't already
   * go through rippleEngine can call this to add pressure.
   * Also surfaces threshold checks synchronously.
   */
  incrementPressure: protectedProcedure
    .input(z.object({
      pressureType: PressureTypeEnum,
      amount: z.number().min(1).max(1000),
      source: z.string().min(1).max(128),
    }))
    .mutation(async ({ ctx, input }) => {
      await pressureService.increment(
        ctx.user.id,
        input.pressureType,
        input.amount,
        input.source,
      );
      const emerging = await pressureService.checkThresholds();
      return { success: true, emerging };
    }),

  /* ─── ADMIN / INTERNAL OPERATIONS ─── */

  /**
   * Manually resolve an active event. Used by admins or by the
   * dailyBrief router's community resolution flow.
   */
  resolveEvent: adminProcedure
    .input(z.object({
      eventId: z.string().min(1).max(64),
      resolution: ResolutionEnum.default("admin"),
    }))
    .mutation(async ({ input }) => {
      await pressureService.resolveEvent(input.eventId, input.resolution);
      return { success: true };
    }),

  /**
   * Force-run the universe tick (expire stale events, re-check thresholds).
   * Useful for admin debugging and for the setInterval job.
   */
  runTick: adminProcedure.mutation(async () => {
    const result = await pressureService.tick();
    logger.info(`[LivingUniverse] runTick: expired=${result.expired.join(",")} emerged=${result.emerged ?? "none"}`);
    return result;
  }),

  /**
   * Get a consolidated snapshot for admin dashboards.
   * Combines active pressure, active events, and recent history.
   */
  getAdminSnapshot: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return {
        pressure: DEFAULT_PRESSURE,
        active: [],
        history: [],
        totals: { activeCount: 0, historyCount: 0 },
      };
    }

    const [pressure, active, history, totals] = await Promise.all([
      pressureService.getAllPressures(),
      db.select().from(universeEventState).where(eq(universeEventState.isActive, 1)),
      db.select().from(universeEventHistory)
        .orderBy(desc(universeEventHistory.resolvedAt))
        .limit(20),
      db.select({
        activeCount: sql<number>`SUM(CASE WHEN ${universeEventState.isActive} = 1 THEN 1 ELSE 0 END)`.as("activeCount"),
        totalCount: sql<number>`COUNT(*)`.as("totalCount"),
      }).from(universeEventState),
    ]);

    // Separate query for history count so we don't JOIN two tables
    const [historyCountRow] = await db.select({
      count: sql<number>`COUNT(*)`.as("count"),
    }).from(universeEventHistory);

    return {
      pressure,
      active: active.map(r => ({
        ...r,
        definition: ALL_EMERGENT_EVENTS.find(e => e.id === r.eventId) ?? null,
      })),
      history: history.map(r => ({
        ...r,
        definition: ALL_EMERGENT_EVENTS.find(e => e.id === r.eventId) ?? null,
      })),
      totals: {
        activeCount: Number(totals[0]?.activeCount) || 0,
        totalCount: Number(totals[0]?.totalCount) || 0,
        historyCount: Number(historyCountRow?.count) || 0,
      },
    };
  }),

  /**
   * Dev-only helper: get current pressure + what would activate if we crossed
   * the threshold right now. Used by architect console.
   */
  getPreview: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { pressure: DEFAULT_PRESSURE, nextLikelyEvent: null, activeEventCount: 0 };

    const pressure = await pressureService.getAllPressures();
    const emerging = getEmergingEvent(pressure);
    const [countRow] = await db.select({
      n: sql<number>`COUNT(*)`.as("n"),
    }).from(universeEventState).where(eq(universeEventState.isActive, 1));

    return {
      pressure,
      nextLikelyEvent: emerging,
      activeEventCount: Number(countRow?.n) || 0,
      // Surface explicit sentinel so the caller can detect empty state
      hasAnyActiveEvent: (Number(countRow?.n) || 0) > 0,
    };
  }),
});

/**
 * Small re-export so tests and future callers can keep reaching pressureService
 * from the same import path they already use for the router.
 */
export { pressureService };

/* ─── Non-tRPC utility: used by the setInterval tick job in _core/index.ts ─── */
export async function runUniverseTick(): Promise<{ expired: string[]; emerged: string | null }> {
  try {
    const result = await pressureService.tick();
    if (result.expired.length > 0 || result.emerged) {
      logger.info(`[LivingUniverse] scheduled tick: expired=${result.expired.join(",") || "none"} emerged=${result.emerged ?? "none"}`);
    }
    return result;
  } catch (e) {
    logger.error("[LivingUniverse] scheduled tick failed:", e);
    return { expired: [], emerged: null };
  }
}

