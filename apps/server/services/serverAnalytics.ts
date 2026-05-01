/**
 * Server-side analytics event emitter.
 *
 * Mirrors the client `analytics.ts` flow but writes server-authoritative
 * events (match completion, ELO changes, server-issued rewards) directly
 * into the same `analytics_events` table. The admin dashboard queries in
 * routers/analytics.ts aggregate over both client- and server-emitted
 * events transparently.
 *
 * No-DB safety: when the DB pool is unavailable (tests / local without
 * MySQL) the call is a logged no-op so producers never need to gate
 * their telemetry on environment.
 */
import { getDb } from "../db";
import { analyticsEvents } from "../../db/schema";
import { logger } from "../logger";

export type ServerEventProperties = Record<string, string | number | boolean>;

/**
 * Persist a single server-authoritative analytics event for `userId`.
 * Errors are swallowed to keep telemetry off the critical path; no
 * gameplay should depend on the row landing.
 */
export async function recordServerEvent(
  userId: number,
  event: string,
  properties: ServerEventProperties = {},
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(analyticsEvents).values({
      userId,
      event,
      properties,
      sessionId: "server",
      clientTimestamp: new Date(),
    });
  } catch (e) {
    logger.warn(
      `[serverAnalytics] event '${event}' failed for user ${userId}: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
  }
}
