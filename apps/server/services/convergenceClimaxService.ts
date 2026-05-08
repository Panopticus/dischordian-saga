/* ═══════════════════════════════════════════════════════
   CONVERGENCE CLIMAX SERVICE — Phase D.5

   The "doom clock". Singleton row (id=1) tracks the
   global convergence score (0..100) and a phase enum
   (dormant | open | resolved). When `convergence`
   reaches 100 the climax window opens and auto-closes
   72h later if the player hasn't picked a resolution.

   Schema: apps/db/schema.ts:7048 (convergenceClimaxState,
   audit-allow: pending-feature Phase D.5).
   ═══════════════════════════════════════════════════════ */
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import {
  convergenceClimaxState,
  type ConvergenceClimaxStateRow,
} from "../../db/schema";
import { logger } from "../logger";

/** Singleton row id; the table holds exactly one row. */
export const CLIMAX_SINGLETON_ID = 1;

/** Threshold at which a dormant clock opens its climax window. */
export const CLIMAX_OPEN_THRESHOLD = 100;

/** Real-time auto-close window per the schema doc-comment. */
export const CLIMAX_AUTO_CLOSE_MS = 72 * 60 * 60 * 1000; // 72 hours

/** Resolution key written when the 72h auto-close fires (no player pick). */
export const CLIMAX_AUTO_CLOSE_KEY = "auto_close_no_choice";

/**
 * Read (or lazily create) the singleton convergence climax row.
 * Public reader for the tradeEmpire router so the UI can render
 * the doom clock.
 */
export async function getConvergenceClimaxState(): Promise<ConvergenceClimaxStateRow | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const [existing] = await db
      .select()
      .from(convergenceClimaxState)
      .where(eq(convergenceClimaxState.id, CLIMAX_SINGLETON_ID))
      .limit(1);
    if (existing) return existing;

    // Lazy seed — first read materialises the row in dormant phase.
    await db
      .insert(convergenceClimaxState)
      .values({
        id: CLIMAX_SINGLETON_ID,
        convergence: 0,
        phase: "dormant",
      })
      .onDuplicateKeyUpdate({ set: { id: CLIMAX_SINGLETON_ID } });

    const [seeded] = await db
      .select()
      .from(convergenceClimaxState)
      .where(eq(convergenceClimaxState.id, CLIMAX_SINGLETON_ID))
      .limit(1);
    return seeded ?? null;
  } catch (err) {
    logger.warn("climax_read_failed", "convergenceClimaxService", {
      err: String(err),
    });
    return null;
  }
}

/**
 * Bump the convergence score by `delta`, clamped to [0, 100]. Wired
 * into doom-clock-pressure events; safe to call from anywhere.
 *
 * Game-mechanic: feeds the singleton doom clock per the Phase D.5
 * schema doc-comment at apps/db/schema.ts:7048.
 */
export async function bumpConvergence(
  delta: number,
): Promise<{ convergence: number } | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const current = (await getConvergenceClimaxState()) ?? null;
    const prior = current?.convergence ?? 0;
    const next = Math.max(0, Math.min(CLIMAX_OPEN_THRESHOLD, prior + delta));

    await db
      .update(convergenceClimaxState)
      .set({ convergence: next })
      .where(eq(convergenceClimaxState.id, CLIMAX_SINGLETON_ID));

    return { convergence: next };
  } catch (err) {
    logger.warn("climax_bump_failed", "convergenceClimaxService", {
      delta,
      err: String(err),
    });
    return null;
  }
}

/**
 * Cron tick. Two jobs:
 *   1. If phase=dormant and convergence ≥ CLIMAX_OPEN_THRESHOLD, open
 *      the climax window: phase→open, openedAt=now, closesAtMs=now+72h.
 *   2. If phase=open and now ≥ closesAtMs, auto-resolve: phase→resolved,
 *      resolutionKey=CLIMAX_AUTO_CLOSE_KEY (the player missed their
 *      choice window).
 *
 * Idempotent — running twice in a row leaves the second pass a no-op
 * because the phase has already advanced. Errors are logged but never
 * thrown so the cron host stays alive.
 *
 * Cron entry-point: scheduled hourly from apps/server/_core/index.ts.
 */
export async function tickConvergenceClimax(): Promise<{
  opened: boolean;
  autoResolved: boolean;
}> {
  try {
    const state = await getConvergenceClimaxState();
    if (!state) return { opened: false, autoResolved: false };

    const db = await getDb();
    if (!db) return { opened: false, autoResolved: false };

    let opened = false;
    let autoResolved = false;
    const now = Date.now();

    if (
      state.phase === "dormant" &&
      (state.convergence ?? 0) >= CLIMAX_OPEN_THRESHOLD
    ) {
      await db
        .update(convergenceClimaxState)
        .set({
          phase: "open",
          openedAt: new Date(now),
          closesAtMs: now + CLIMAX_AUTO_CLOSE_MS,
        })
        .where(eq(convergenceClimaxState.id, CLIMAX_SINGLETON_ID));
      opened = true;
    } else if (
      state.phase === "open" &&
      state.closesAtMs != null &&
      now >= Number(state.closesAtMs)
    ) {
      await db
        .update(convergenceClimaxState)
        .set({
          phase: "resolved",
          resolutionKey: CLIMAX_AUTO_CLOSE_KEY,
        })
        .where(eq(convergenceClimaxState.id, CLIMAX_SINGLETON_ID));
      autoResolved = true;
    }

    return { opened, autoResolved };
  } catch (err) {
    logger.warn("climax_tick_failed", "convergenceClimaxService", {
      err: String(err),
    });
    return { opened: false, autoResolved: false };
  }
}
