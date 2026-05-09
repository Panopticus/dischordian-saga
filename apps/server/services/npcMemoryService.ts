/* ═══════════════════════════════════════════════════════
   NPC MEMORY SERVICE — episodic memory writer (NPC depth #6).

   Records what individual NPCs remember about the player's choices.
   Memories surface in dialog as pre-voiced variant lines (not text
   substitution) — the selector reads memory rows via
   synthesizeMemoryFlags() in apps/shared/npcs/memoryEvents.ts and
   matches them against per-line `unlockFlags`.

   Distinct from npc_public_flags (binary, sticky, globally readable);
   memories are episodic + per-NPC + carry polarity + payload. The
   rippleEngine fans memory writes out to all NPCs whose interest
   vector includes the event-key.
   ═══════════════════════════════════════════════════════ */

import { and, desc, eq } from "drizzle-orm";

import { getDb } from "../db";
import { logger } from "../logger";
import { npcMemory } from "../../db/schema";
import type { NpcMemoryRow } from "../../db/schema";
import type { NpcKey } from "../../shared/npcs/types";
import {
  type MemoryEventKey,
  npcsInterestedIn,
} from "../../shared/npcs/memoryEvents";

export interface RecordMemoryInput {
  userId: number;
  eventKey: MemoryEventKey;
  /** -1 disapproved, 0 noticed, +1 approved. Clamped to that range. */
  polarity?: number;
  /** Free-form payload the variant lines may reference. */
  payload?: Record<string, unknown>;
  /**
   * Restrict the fan-out to a subset of NPCs (e.g. only the broker
   * involved in a contract). Default: every NPC whose interest vector
   * includes `eventKey`.
   */
  onlyForNpcs?: ReadonlyArray<NpcKey>;
  /** Optional expiry; null = persistent. */
  expiresAt?: Date | null;
}

function clampPolarity(polarity: number | undefined): number {
  if (polarity === undefined) return 0;
  if (polarity > 0) return 1;
  if (polarity < 0) return -1;
  return 0;
}

/**
 * Record a memory for every NPC interested in the event-key. Returns
 * the number of memory rows written. No-op if no NPC is interested
 * (or if the DB is unavailable).
 */
export async function recordMemory(input: RecordMemoryInput): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const interested = npcsInterestedIn(input.eventKey);
  const targets = input.onlyForNpcs
    ? interested.filter(k => input.onlyForNpcs!.includes(k))
    : interested;
  if (targets.length === 0) return 0;

  const polarity = clampPolarity(input.polarity);
  const payload = input.payload ?? null;
  const expiresAt = input.expiresAt ?? null;

  const rows = targets.map(npcKey => ({
    userId: input.userId,
    npcKey,
    eventKey: input.eventKey,
    polarity,
    payload,
    expiresAt,
  }));

  try {
    await db.insert(npcMemory).values(rows);
    return rows.length;
  } catch (err) {
    logger.error("[NpcMemory] insert failed:", err);
    return 0;
  }
}

/**
 * Read every active memory row for a player. The selector calls this
 * (typically once per dialog session) and feeds the rows into
 * synthesizeMemoryFlags() to build the synthetic-flag set for a
 * given NPC. Returns rows in newest-first order.
 */
export async function getMemoriesForPlayer(
  userId: number,
): Promise<ReadonlyArray<NpcMemoryRow>> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(npcMemory)
    .where(eq(npcMemory.userId, userId))
    .orderBy(desc(npcMemory.createdAt));
}

/**
 * Read memories for a single (player, NPC) pair. Faster than
 * getMemoriesForPlayer when only one NPC's banks are being resolved.
 */
export async function getMemoriesForNpc(
  userId: number,
  npcKey: NpcKey,
): Promise<ReadonlyArray<NpcMemoryRow>> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(npcMemory)
    .where(
      and(
        eq(npcMemory.userId, userId),
        eq(npcMemory.npcKey, npcKey),
      ),
    )
    .orderBy(desc(npcMemory.createdAt));
}

/**
 * Forget a specific memory (testing, or in-fiction "the player did
 * something that erased the record"). No-op if no row matches.
 */
export async function forgetMemory(
  userId: number,
  npcKey: NpcKey,
  eventKey: MemoryEventKey,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .delete(npcMemory)
    .where(
      and(
        eq(npcMemory.userId, userId),
        eq(npcMemory.npcKey, npcKey),
        eq(npcMemory.eventKey, eventKey),
      ),
    );
}
