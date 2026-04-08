/* ═══════════════════════════════════════════════════════
   PRESSURE SERVICE — Thin service layer for Living Universe

   Wraps the pressureEvents + universeEventState tables
   created in Wave 1 (dailyBrief system). Provides simple
   functions that ANY server endpoint can call with a single
   line to record player behavior for emergent events.

   Usage from any router:
     import { pressureService } from "../services/pressureService";
     await pressureService.increment(userId, "deaths", 1, "fight_death");

   The heavy lifting (aggregation, threshold checks, event
   activation) lives in the dailyBrief router's
   checkEmergingEvents(). This service just records events.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { pressureEvents, universeEventState } from "../../drizzle/schema";
import { eq, sql, gte } from "drizzle-orm";
import { logger } from "../logger";
import {
  type PressureTracker,
  DEFAULT_PRESSURE,
  getEmergingEvent,
  MAX_CONCURRENT_EVENTS,
  PRESSURE_SOURCE_MAP,
} from "@shared/livingUniverseEvents";

/** Valid pressure types (matches PressureTracker keys) */
type PressureType = keyof PressureTracker;

export const pressureService = {
  /**
   * Record a pressure event. This is the ONE function other routers call.
   * @param userId - The player who caused this
   * @param type - Pressure category (deaths, trustGains, viralExposures, etc.)
   * @param amount - How much pressure to add
   * @param source - What triggered it (fight_death, npc_trust_elara, tome_found, etc.)
   */
  async increment(userId: number, type: PressureType, amount: number, source: string): Promise<void> {
    const db = await getDb();
    if (!db) return;

    await db.insert(pressureEvents).values({
      userId,
      pressureType: type,
      amount,
      source,
    }).catch(e => logger.error(`[Pressure] Failed to record ${type}:`, e));
  },

  /**
   * Record pressure from a known game action using PRESSURE_SOURCE_MAP.
   * Even simpler — just pass the action key.
   * @param userId - The player
   * @param actionKey - Key from PRESSURE_SOURCE_MAP (e.g., "fight_death", "npc_trust_gain")
   */
  async recordAction(userId: number, actionKey: string): Promise<void> {
    const mapping = PRESSURE_SOURCE_MAP[actionKey];
    if (!mapping) return;
    await this.increment(userId, mapping.pressureType, mapping.amount, actionKey);
  },

  /** Get current pressure for a single type (last 30 days) */
  async getPressure(type: PressureType): Promise<number> {
    const db = await getDb();
    if (!db) return 0;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const result = await db.select({
      total: sql<number>`COALESCE(SUM(${pressureEvents.amount}), 0)`.as("total"),
    }).from(pressureEvents)
      .where(sql`${pressureEvents.pressureType} = ${type} AND ${pressureEvents.createdAt} >= ${cutoff}`);

    return Number(result[0]?.total) || 0;
  },

  /** Get all 5 pressure scores (last 30 days) */
  async getAllPressures(): Promise<PressureTracker> {
    const db = await getDb();
    if (!db) return { ...DEFAULT_PRESSURE };

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const aggregated = await db.select({
      pressureType: pressureEvents.pressureType,
      total: sql<number>`SUM(${pressureEvents.amount})`.as("total"),
    }).from(pressureEvents)
      .where(gte(pressureEvents.createdAt, cutoff))
      .groupBy(pressureEvents.pressureType);

    const pressure: PressureTracker = { ...DEFAULT_PRESSURE };
    for (const row of aggregated) {
      if (row.pressureType in pressure) {
        (pressure as Record<string, number>)[row.pressureType] = Number(row.total) || 0;
      }
    }
    return pressure;
  },

  /** Check if any emergent event should activate */
  async checkThresholds(): Promise<{ eventId: string; proximity: number } | null> {
    const pressure = await this.getAllPressures();
    const emerging = getEmergingEvent(pressure);
    if (!emerging || emerging.proximity < 100) return emerging;

    // If at 100% proximity, try to activate
    const db = await getDb();
    if (!db) return emerging;

    const activeCount = await db.select({
      count: sql<number>`COUNT(*)`.as("count"),
    }).from(universeEventState)
      .where(eq(universeEventState.isActive, 1));

    if ((Number(activeCount[0]?.count) || 0) >= MAX_CONCURRENT_EVENTS) {
      return emerging; // At capacity — return but don't activate
    }

    // Activate the event
    const existing = await db.select().from(universeEventState)
      .where(eq(universeEventState.eventId, emerging.eventId))
      .limit(1);

    if (existing[0]) {
      if (!existing[0].isActive) {
        await db.update(universeEventState)
          .set({
            isActive: 1,
            pressureScore: Math.round(emerging.proximity * 100),
            activatedAt: new Date(),
            occurrenceCount: existing[0].occurrenceCount + 1,
          })
          .where(eq(universeEventState.id, existing[0].id));
        logger.info(`[LivingUniverse] Event ACTIVATED: ${emerging.eventId}`);
      }
    } else {
      await db.insert(universeEventState).values({
        eventId: emerging.eventId,
        isActive: 1,
        pressureScore: Math.round(emerging.proximity * 100),
        activatedAt: new Date(),
        occurrenceCount: 1,
      });
      logger.info(`[LivingUniverse] Event ACTIVATED (first time): ${emerging.eventId}`);
    }

    return emerging;
  },

  /** Deactivate an event (admin or community resolution) */
  async resolveEvent(eventId: string): Promise<void> {
    const db = await getDb();
    if (!db) return;

    await db.update(universeEventState)
      .set({ isActive: 0, resolvedAt: new Date() })
      .where(eq(universeEventState.eventId, eventId));

    logger.info(`[LivingUniverse] Event RESOLVED: ${eventId}`);
  },
};
