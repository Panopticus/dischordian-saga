/* ═══════════════════════════════════════════════════════
   TICK EVENT SERVICE — per-player "what happened while you
   were away" log (NPC depth #12).

   Writers (seasonTickService, agendaEngine, future
   Architect/Dreamer plot-beat queues, the Shadow Tongue
   redaction service when broadcasting reveals) call
   `recordTickEvent` to append a row. The session-resume
   handler calls `readUnacknowledgedTickEvents` to fetch
   what to show, then `acknowledgeTickEvents` after rendering.

   Pure read/write API — no in-fiction logic; the typed
   payloads (apps/shared/universe/tickEvents.ts) are the
   semantic contract.
   ═══════════════════════════════════════════════════════ */

import { and, asc, eq, isNull, sql } from "drizzle-orm";

import { getDb } from "../db";
import { logger } from "../logger";
import { tickEvents } from "../../db/schema";
import type { TickEventRow } from "../../db/schema";
import {
  formatTickEventSummary,
  type TickEventPayload,
  type TickEventKind,
} from "../../shared/universe/tickEvents";

export interface RecordTickEventInput {
  userId: number;
  payload: TickEventPayload;
  /** Optional override for the formatted summary; defaults to formatTickEventSummary(payload). */
  summary?: string;
  /** Optional VO id from a manifest. */
  voId?: string | null;
}

/** Append a tick-event row for one player. Returns the inserted id, or 0 on failure. */
export async function recordTickEvent(
  input: RecordTickEventInput,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const summary = input.summary ?? formatTickEventSummary(input.payload);
  try {
    const [res] = (await db.insert(tickEvents).values({
      userId: input.userId,
      kind: input.payload.kind as TickEventKind,
      summary,
      voId: input.voId ?? null,
      payload: input.payload as unknown as Record<string, unknown>,
    })) as unknown as Array<{ insertId: number }>;
    return res?.insertId ?? 0;
  } catch (err) {
    logger.warn("[TickEvents] recordTickEvent failed", err);
    return 0;
  }
}

/**
 * Fan-out variant: record the same event for many players. Used by
 * world-scoped events (Shadow Tongue power level change, Architect
 * plot beat) where every active player should see the row.
 */
export async function recordTickEventForUsers(
  userIds: ReadonlyArray<number>,
  payload: TickEventPayload,
  options: { summary?: string; voId?: string | null } = {},
): Promise<number> {
  const db = await getDb();
  if (!db || userIds.length === 0) return 0;
  const summary = options.summary ?? formatTickEventSummary(payload);
  try {
    await db.insert(tickEvents).values(
      userIds.map(userId => ({
        userId,
        kind: payload.kind as TickEventKind,
        summary,
        voId: options.voId ?? null,
        payload: payload as unknown as Record<string, unknown>,
      })),
    );
    return userIds.length;
  } catch (err) {
    logger.warn("[TickEvents] recordTickEventForUsers failed", err);
    return 0;
  }
}

/**
 * Read unacknowledged tick events for one player, oldest first.
 * Caller is expected to render and then call acknowledgeTickEvents.
 */
export async function readUnacknowledgedTickEvents(
  userId: number,
  limit = 20,
): Promise<ReadonlyArray<TickEventRow>> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(tickEvents)
    .where(
      and(
        eq(tickEvents.userId, userId),
        isNull(tickEvents.acknowledgedAt),
      ),
    )
    .orderBy(asc(tickEvents.occurredAt))
    .limit(limit);
}

/** Mark every unacknowledged tick event for the player as seen. */
export async function acknowledgeTickEvents(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  try {
    const result = await db
      .update(tickEvents)
      .set({ acknowledgedAt: sql`CURRENT_TIMESTAMP` })
      .where(
        and(
          eq(tickEvents.userId, userId),
          isNull(tickEvents.acknowledgedAt),
        ),
      );
    // Drizzle returns dialect-specific shapes; cast loosely.
    const r = result as unknown as { affectedRows?: number };
    return r?.affectedRows ?? 0;
  } catch (err) {
    logger.warn("[TickEvents] acknowledgeTickEvents failed", err);
    return 0;
  }
}

/**
 * Mark a specific subset of tick-event rows as acknowledged. Used
 * when the resume report is paginated and only some pages have been
 * shown.
 */
export async function acknowledgeTickEventsByIds(
  userId: number,
  ids: ReadonlyArray<number>,
): Promise<number> {
  const db = await getDb();
  if (!db || ids.length === 0) return 0;
  try {
    let touched = 0;
    for (const id of ids) {
      const result = await db
        .update(tickEvents)
        .set({ acknowledgedAt: sql`CURRENT_TIMESTAMP` })
        .where(
          and(
            eq(tickEvents.userId, userId),
            eq(tickEvents.id, id),
            isNull(tickEvents.acknowledgedAt),
          ),
        );
      const r = result as unknown as { affectedRows?: number };
      touched += r?.affectedRows ?? 0;
    }
    return touched;
  } catch (err) {
    logger.warn("[TickEvents] acknowledgeTickEventsByIds failed", err);
    return 0;
  }
}
