/* ═══════════════════════════════════════════════════════
   YEARLY EVENT SCHEDULER

   On each tick, for each canonical YEARLY_EVENT def:
     1. If today is on or after the anchor date for the current
        year and no row exists for (key, year), insert one and
        mark activatedAt — emit `yearly_event_started`.
     2. If a row is past activatedAt + durationDays and not yet
        resolvedAt, mark resolvedAt and emit
        `yearly_event_closed` + `governance_motion_proposed`.
     3. Prune the ripple ledger.

   Seal-break overrides: callers can also call
   `activateBySeal(key, sealNumber, year)` to fire Severance
   on first Seal IV break / Memorial Day on first Seal V break
   regardless of the calendar.

   The runtime tick site lives wherever the existing announcement
   bootstrap fires — wiring that mount is left to a follow-up
   PR; the scheduler is callable as a pure function in tests.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { yearlyEvents } from "../../db/schema";
import { eq, and, isNull, lte } from "drizzle-orm";
import {
  YEARLY_EVENTS,
  closingMotionKeyForYear,
  type YearlyEventKey,
} from "@shared/yearlyEvents";
import { ripple } from "./rippleEngine";
import { rippleLedgerService } from "./rippleLedgerService";
import { logger } from "../logger";

/**
 * Pure helper: for an anchor (month, day) and a date, is `date`
 * within `durationDays` after this year's anchor?
 *
 * Uses UTC to keep the result identical across deployment zones.
 * The +/- one-day fudge handles end-of-month anchors on leap years
 * implicitly.
 */
export function isWithinAnchorWindow(
  date: Date,
  anchorMonth: number,
  anchorDay: number,
  durationDays: number,
): boolean {
  const year = date.getUTCFullYear();
  const anchor = Date.UTC(year, anchorMonth - 1, anchorDay);
  const close = anchor + durationDays * 24 * 60 * 60 * 1000;
  return date.getTime() >= anchor && date.getTime() < close;
}

/** Pure helper: has this year's anchor passed (inclusive)? */
export function isOnOrAfterAnchor(
  date: Date,
  anchorMonth: number,
  anchorDay: number,
): boolean {
  const year = date.getUTCFullYear();
  const anchor = Date.UTC(year, anchorMonth - 1, anchorDay);
  return date.getTime() >= anchor;
}

export const yearlyEventScheduler = {
  /**
   * Run one full tick: activate any due events, close any past-
   * duration events, and prune the ledger. Returns a summary for
   * tests and observability.
   */
  async tick(now: Date = new Date()): Promise<{
    activated: YearlyEventKey[];
    closed: YearlyEventKey[];
    prunedLedgerRows: number;
  }> {
    const activated: YearlyEventKey[] = [];
    const closed: YearlyEventKey[] = [];
    const db = await getDb();
    if (!db) {
      const prunedLedgerRows = await rippleLedgerService.prune();
      return { activated, closed, prunedLedgerRows };
    }

    const year = now.getUTCFullYear();

    // ─── Activate ───────────────────────────────────────
    for (const def of YEARLY_EVENTS) {
      if (!isWithinAnchorWindow(now, def.anchorMonth, def.anchorDay, def.durationDays)) {
        continue;
      }
      try {
        const existing = await db
          .select({ id: yearlyEvents.id })
          .from(yearlyEvents)
          .where(
            and(
              eq(yearlyEvents.eventKey, def.key),
              eq(yearlyEvents.activeYear, year),
            ),
          )
          .limit(1);
        if (existing.length > 0) continue;

        await db.insert(yearlyEvents).values({
          eventKey: def.key,
          anchorMonth: def.anchorMonth,
          anchorDay: def.anchorDay,
          durationDays: def.durationDays,
          closingMotionKey: closingMotionKeyForYear(def.key, year),
          activeYear: year,
          activatedAt: now,
        });
        activated.push(def.key);
        await ripple.emit("yearly_event_started", {
          userId: 0,
          eventKey: def.key,
          year,
        });
        await rippleLedgerService.record({
          eventType: "yearly_event_started",
          fromSystem: "yearly",
          toSystems: ["governance", "guild", "charity"],
          payload: { eventKey: def.key, year },
        });
      } catch (err) {
        logger.error(`[yearlyScheduler] activate ${def.key} failed:`, err);
      }
    }

    // ─── Close ──────────────────────────────────────────
    try {
      const dueClose = await db
        .select({
          id: yearlyEvents.id,
          eventKey: yearlyEvents.eventKey,
          activatedAt: yearlyEvents.activatedAt,
          durationDays: yearlyEvents.durationDays,
          activeYear: yearlyEvents.activeYear,
          closingMotionKey: yearlyEvents.closingMotionKey,
        })
        .from(yearlyEvents)
        .where(
          and(
            isNull(yearlyEvents.resolvedAt),
            lte(yearlyEvents.activatedAt, now),
          ),
        );
      for (const row of dueClose) {
        if (!row.activatedAt) continue;
        const closeAt =
          row.activatedAt.getTime() +
          row.durationDays * 24 * 60 * 60 * 1000;
        if (now.getTime() < closeAt) continue;
        try {
          await db
            .update(yearlyEvents)
            .set({ resolvedAt: now })
            .where(eq(yearlyEvents.id, row.id));
          closed.push(row.eventKey as YearlyEventKey);
          await ripple.emit("yearly_event_closed", {
            userId: 0,
            eventKey: row.eventKey,
            year: row.activeYear,
            closingMotionKey: row.closingMotionKey,
          });
          if (row.closingMotionKey) {
            await ripple.emit("governance_motion_proposed", {
              userId: 0,
              motionKey: row.closingMotionKey,
              source: "yearly_event_close",
            });
          }
          await rippleLedgerService.record({
            eventType: "yearly_event_closed",
            fromSystem: "yearly",
            toSystems: ["governance", "social"],
            payload: {
              eventKey: row.eventKey,
              year: row.activeYear,
              closingMotionKey: row.closingMotionKey,
            },
          });
        } catch (err) {
          logger.error(
            `[yearlyScheduler] close ${row.eventKey} failed:`,
            err,
          );
        }
      }
    } catch (err) {
      logger.error("[yearlyScheduler] close-pass failed:", err);
    }

    const prunedLedgerRows = await rippleLedgerService.prune();
    return { activated, closed, prunedLedgerRows };
  },

  /**
   * Seal-break override: activate Severance / Memorial Day
   * regardless of the calendar when the matching seal first
   * breaks. No-op if a row already exists for (key, year).
   */
  async activateBySeal(
    key: "severance" | "memorial_day",
    sealNumber: 4 | 5,
    year: number = new Date().getUTCFullYear(),
    now: Date = new Date(),
  ): Promise<boolean> {
    const def = YEARLY_EVENTS.find((e) => e.key === key);
    if (!def) return false;
    const db = await getDb();
    if (!db) return false;
    try {
      const existing = await db
        .select({ id: yearlyEvents.id })
        .from(yearlyEvents)
        .where(
          and(
            eq(yearlyEvents.eventKey, def.key),
            eq(yearlyEvents.activeYear, year),
          ),
        )
        .limit(1);
      if (existing.length > 0) return false;
      await db.insert(yearlyEvents).values({
        eventKey: def.key,
        anchorMonth: def.anchorMonth,
        anchorDay: def.anchorDay,
        durationDays: def.durationDays,
        closingMotionKey: closingMotionKeyForYear(def.key, year),
        activeYear: year,
        activatedAt: now,
        triggeredBySeal: sealNumber,
      });
      await ripple.emit("yearly_event_started", {
        userId: 0,
        eventKey: def.key,
        year,
        triggeredBySeal: sealNumber,
      });
      await rippleLedgerService.record({
        eventType: "yearly_event_started",
        fromSystem: "yearly",
        toSystems: ["governance", "guild", "charity"],
        payload: { eventKey: def.key, year, triggeredBySeal: sealNumber },
      });
      return true;
    } catch (err) {
      logger.error(`[yearlyScheduler] activateBySeal ${key} failed:`, err);
      return false;
    }
  },
};
