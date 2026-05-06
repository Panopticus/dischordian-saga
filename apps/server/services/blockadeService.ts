/* ═══════════════════════════════════════════════════════
   BLOCKADE SERVICE — Phase D.5 of the Lore-Aligned Galactic-
   Empire Overhaul.

   Sectors with threat ≥ 50 can be blockaded by the player for
   one season turn. Costs influence; suppresses the sector's
   credit yield for the duration. Pure server logic; the trade
   empire router consults isSectorBlockaded(userId, sectorId)
   when crediting mission rewards.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { tradeBlockades } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../logger";

import { postPublicKnowledge } from "./publicKnowledgeService";
import { seasonClockService } from "./seasonClockService";

export const BLOCKADE_INFLUENCE_COST = 100;
export const BLOCKADE_THREAT_MINIMUM = 50;

export async function declareBlockade(args: {
  userId: number;
  sectorId: string;
  sectorThreat: number;
  influenceAvailable: number;
}): Promise<
  | { ok: true; blockadeId: number; influenceSpent: number }
  | { ok: false; error: string }
> {
  if (args.sectorThreat < BLOCKADE_THREAT_MINIMUM) {
    return { ok: false, error: `sector threat ${args.sectorThreat} below blockade minimum ${BLOCKADE_THREAT_MINIMUM}` };
  }
  if (args.influenceAvailable < BLOCKADE_INFLUENCE_COST) {
    return {
      ok: false,
      error: `insufficient influence (need ${BLOCKADE_INFLUENCE_COST}, have ${args.influenceAvailable})`,
    };
  }
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const seasonNumber = seasonClockService.getState().seasonNumber;

  // Reject duplicate active blockade in same season.
  const existing = await db
    .select()
    .from(tradeBlockades)
    .where(
      and(
        eq(tradeBlockades.userId, args.userId),
        eq(tradeBlockades.sectorId, args.sectorId),
        eq(tradeBlockades.seasonNumber, seasonNumber),
        eq(tradeBlockades.status, "active"),
      ),
    )
    .limit(1);
  if (existing.length > 0) {
    return { ok: false, error: "sector already blockaded this season" };
  }

  const [insert] = await db
    .insert(tradeBlockades)
    .values({
      userId: args.userId,
      seasonNumber,
      sectorId: args.sectorId,
      status: "active",
      influenceSpent: BLOCKADE_INFLUENCE_COST,
    })
    .$returningId();

  await postPublicKnowledge({
    userId: args.userId,
    eventKind: "agenda_step",
    subjectHouseKey: null,
    summary: `Blockade declared on ${args.sectorId}.`,
    payload: { sectorId: args.sectorId, blockadeId: insert?.id },
    seasonNumber,
  }).catch(err => logger.warn("[blockade] declare post failed:", err));

  return {
    ok: true,
    blockadeId: insert?.id ?? 0,
    influenceSpent: BLOCKADE_INFLUENCE_COST,
  };
}

export async function isSectorBlockaded(userId: number, sectorId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const seasonNumber = seasonClockService.getState().seasonNumber;
  const [row] = await db
    .select()
    .from(tradeBlockades)
    .where(
      and(
        eq(tradeBlockades.userId, userId),
        eq(tradeBlockades.sectorId, sectorId),
        eq(tradeBlockades.seasonNumber, seasonNumber),
        eq(tradeBlockades.status, "active"),
      ),
    )
    .limit(1);
  return Boolean(row);
}

export async function listMyBlockades(userId: number): Promise<ReadonlyArray<{
  id: number;
  sectorId: string;
  status: string;
  seasonNumber: number;
}>> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(tradeBlockades)
    .where(eq(tradeBlockades.userId, userId));
  return rows.map(r => ({
    id: r.id,
    sectorId: r.sectorId,
    status: r.status,
    seasonNumber: r.seasonNumber,
  }));
}

export async function breakBlockade(userId: number, blockadeId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };
  const [row] = await db
    .select()
    .from(tradeBlockades)
    .where(
      and(
        eq(tradeBlockades.id, blockadeId),
        eq(tradeBlockades.userId, userId),
        eq(tradeBlockades.status, "active"),
      ),
    )
    .limit(1);
  if (!row) return { ok: false, error: "blockade not found or inactive" };
  await db
    .update(tradeBlockades)
    .set({ status: "broken", resolvedAt: new Date() })
    .where(eq(tradeBlockades.id, row.id));
  await postPublicKnowledge({
    userId,
    eventKind: "agenda_step",
    subjectHouseKey: null,
    summary: `Blockade broken on ${row.sectorId}.`,
    payload: { sectorId: row.sectorId, blockadeId: row.id },
    seasonNumber: seasonClockService.getState().seasonNumber,
  }).catch(err => logger.warn("[blockade] break post failed:", err));
  return { ok: true };
}
