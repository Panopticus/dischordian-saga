/* ═══════════════════════════════════════════════════════
   PUBLIC KNOWLEDGE SERVICE — append-only news feed of
   in-world political events. NPCs read from here for dialog
   flavor; the court widget reads here for "while you were
   gone" summaries; agendas write here when a step completes.

   Phase 1 of the items-matter / Game-of-Thrones arc. This
   file ships the writer + reader; producers (contract
   signing, demand refusal, agenda step) wire in subsequent
   phases.

   Storage model is simpler than dischordiaCycleService:
   the table is append-only, so no in-memory singleton is
   needed. We keep a small in-memory ring buffer for the
   most-recent N events so dialog selectors can consult
   them without a DB round-trip on every utterance.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { tradePublicKnowledge } from "../../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { logger } from "../logger";

import type { SubHouseKey } from "@shared/tradeEmpire/houses";

/** Canonical event kinds. New kinds extend this list. */
export type PublicKnowledgeEventKind =
  | "contract_signed"
  | "contract_breached"
  | "demand_refused"
  | "demand_paid"
  | "tribute_paid"
  | "cover_blown"
  | "agenda_step"
  | "season_declaration"
  | "sector_flipped"
  | "house_oath_sworn"
  | "house_oath_broken";

/** Input shape for posting a single event. */
export interface PostKnowledgeEvent {
  userId: number | null;
  eventKind: PublicKnowledgeEventKind;
  subjectHouseKey?: SubHouseKey | null;
  summary: string;
  payload?: Record<string, unknown> | null;
  seasonNumber: number;
}

/** Cached event row shape (minus heavy JSON columns). */
interface CachedEvent {
  id: number;
  userId: number | null;
  eventKind: string;
  subjectHouseKey: string | null;
  summary: string;
  payload: Record<string, unknown> | null;
  seasonNumber: number;
  createdAt: number; // ms epoch
}

const RECENT_BUFFER_SIZE = 200;
const recentEvents: CachedEvent[] = [];

function pushRecent(event: CachedEvent): void {
  recentEvents.unshift(event);
  if (recentEvents.length > RECENT_BUFFER_SIZE) {
    recentEvents.length = RECENT_BUFFER_SIZE;
  }
}

/**
 * Post one event. Best-effort write to DB; failures are logged but
 * never block the caller, mirroring dischordiaCycleService.
 */
export async function postPublicKnowledge(event: PostKnowledgeEvent): Promise<number | null> {
  const cached: CachedEvent = {
    id: -1, // Filled in if DB write succeeds.
    userId: event.userId,
    eventKind: event.eventKind,
    subjectHouseKey: event.subjectHouseKey ?? null,
    summary: event.summary,
    payload: event.payload ?? null,
    seasonNumber: event.seasonNumber,
    createdAt: Date.now(),
  };

  const db = await getDb();
  if (!db) {
    pushRecent(cached);
    return null;
  }

  try {
    const [insert] = await db.insert(tradePublicKnowledge).values({
      userId: event.userId ?? null,
      eventKind: event.eventKind,
      subjectHouseKey: event.subjectHouseKey ?? null,
      summary: event.summary,
      payload: event.payload ?? null,
      seasonNumber: event.seasonNumber,
    });
    cached.id = (insert as { insertId?: number }).insertId ?? -1;
    pushRecent(cached);
    return cached.id || null;
  } catch (err) {
    logger.error("[publicKnowledge] insert failed:", err);
    pushRecent(cached); // Cache anyway so dialog still has context.
    return null;
  }
}

/** Read the most recent N events from the in-memory ring (synchronous). */
export function getRecentPublicKnowledge(limit = 50): ReadonlyArray<CachedEvent> {
  return recentEvents.slice(0, Math.max(0, Math.min(limit, RECENT_BUFFER_SIZE)));
}

/** Read events for a specific subject house from the DB. */
export async function getPublicKnowledgeForHouse(
  houseKey: SubHouseKey,
  options: { limit?: number; seasonNumber?: number } = {},
): Promise<ReadonlyArray<CachedEvent>> {
  const db = await getDb();
  if (!db) {
    return recentEvents.filter(e => e.subjectHouseKey === houseKey).slice(0, options.limit ?? 50);
  }

  const limit = options.limit ?? 50;
  try {
    const where =
      options.seasonNumber !== undefined
        ? and(
            eq(tradePublicKnowledge.subjectHouseKey, houseKey),
            eq(tradePublicKnowledge.seasonNumber, options.seasonNumber),
          )
        : eq(tradePublicKnowledge.subjectHouseKey, houseKey);
    const rows = await db
      .select()
      .from(tradePublicKnowledge)
      .where(where)
      .orderBy(desc(tradePublicKnowledge.createdAt))
      .limit(limit);

    return rows.map(rowToCached);
  } catch (err) {
    logger.error("[publicKnowledge] house query failed:", err);
    return [];
  }
}

/** Read all events posted by a specific user. */
export async function getPublicKnowledgeForUser(
  userId: number,
  options: { limit?: number } = {},
): Promise<ReadonlyArray<CachedEvent>> {
  const db = await getDb();
  if (!db) {
    return recentEvents.filter(e => e.userId === userId).slice(0, options.limit ?? 50);
  }
  const limit = options.limit ?? 50;
  try {
    const rows = await db
      .select()
      .from(tradePublicKnowledge)
      .where(eq(tradePublicKnowledge.userId, userId))
      .orderBy(desc(tradePublicKnowledge.createdAt))
      .limit(limit);
    return rows.map(rowToCached);
  } catch (err) {
    logger.error("[publicKnowledge] user query failed:", err);
    return [];
  }
}

function rowToCached(row: {
  id: number;
  userId: number | null;
  eventKind: string;
  subjectHouseKey: string | null;
  summary: string;
  payload: Record<string, unknown> | null;
  seasonNumber: number;
  createdAt: Date;
}): CachedEvent {
  return {
    id: row.id,
    userId: row.userId,
    eventKind: row.eventKind,
    subjectHouseKey: row.subjectHouseKey,
    summary: row.summary,
    payload: row.payload ?? null,
    seasonNumber: row.seasonNumber,
    createdAt: row.createdAt.getTime(),
  };
}

/** Test hook: clear the in-memory ring. Server code never calls this. */
export function _resetPublicKnowledgeCache(): void {
  recentEvents.length = 0;
}
