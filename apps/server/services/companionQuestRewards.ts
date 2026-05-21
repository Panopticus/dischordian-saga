/* ═══════════════════════════════════════════════════════
   COMPANION QUEST REWARDS — applies per-anchor bond deltas
   and per-agency standing deltas declared on a
   CompanionQuestDef. Decoupled from the daily-quest router
   so the same shape can be invoked from the trade-mission
   router (companion-bound Coda missions) without
   duplicating the SQL.

   Schema touchpoints:
     - npc_trust_scalars   (0-100, midpoint 50)
     - trade_agency_standing (integer running total)
   ═══════════════════════════════════════════════════════ */

import { and, eq, sql } from "drizzle-orm";
import { logger } from "../logger";
import { getDb } from "../db";
import { npcTrustScalars, tradeAgencyStanding } from "../../db/schema";
import type { CompanionQuestDef } from "../../shared/tradeEmpire/companionQuestCatalog";

const TRUST_MIN = 0;
const TRUST_MAX = 100;
const TRUST_MIDPOINT = 50;

/** Apply a per-anchor bond delta to npc_trust_scalars. Clamps the
 *  resulting scalar to [0, 100] and stamps the quest id as the
 *  source for audit. Returns true iff a write actually landed. */
async function adjustNpcTrust(
  userId: number,
  npcId: string,
  delta: number,
  sourceQuestId: string,
): Promise<boolean> {
  if (delta === 0) return false;
  const db = await getDb();
  if (!db) return false;
  const existing = await db
    .select()
    .from(npcTrustScalars)
    .where(and(eq(npcTrustScalars.userId, userId), eq(npcTrustScalars.npcId, npcId)))
    .limit(1);
  const current = existing[0]?.scalar ?? TRUST_MIDPOINT;
  const next = Math.max(TRUST_MIN, Math.min(TRUST_MAX, current + delta));
  if (existing.length === 0) {
    await db.insert(npcTrustScalars).values({
      userId,
      npcId,
      scalar: next,
      lastUpdatedFromMysteryId: sourceQuestId,
    });
  } else {
    await db
      .update(npcTrustScalars)
      .set({ scalar: next, lastUpdatedFromMysteryId: sourceQuestId })
      .where(and(eq(npcTrustScalars.userId, userId), eq(npcTrustScalars.npcId, npcId)));
  }
  return true;
}

/** Apply a per-agency standing delta to trade_agency_standing.
 *  Mirrors the upsert pattern in tradeMissions.ts:completeMission.
 *  Returns true iff a write actually landed. */
async function adjustAgencyStanding(
  userId: number,
  agencyId: string,
  delta: number,
): Promise<boolean> {
  if (delta === 0) return false;
  const db = await getDb();
  if (!db) return false;
  const existing = await db
    .select()
    .from(tradeAgencyStanding)
    .where(
      and(
        eq(tradeAgencyStanding.userId, userId),
        eq(tradeAgencyStanding.agencyId, agencyId),
      ),
    )
    .limit(1);
  if (existing[0]) {
    await db
      .update(tradeAgencyStanding)
      .set({ standing: sql`${tradeAgencyStanding.standing} + ${delta}` })
      .where(eq(tradeAgencyStanding.id, existing[0].id));
  } else {
    await db
      .insert(tradeAgencyStanding)
      .values({ userId, agencyId, standing: delta });
  }
  return true;
}

export interface AppliedCompanionRewards {
  bondsApplied: number;
  standingsApplied: number;
}

/** Apply the relationshipDelta and standingDelta declared on a
 *  CompanionQuestDef. Non-critical: failures log + continue. The
 *  daily-quest reward economy ships independently. */
export async function applyCompanionQuestRewards(
  userId: number,
  def: CompanionQuestDef,
): Promise<AppliedCompanionRewards> {
  let bondsApplied = 0;
  let standingsApplied = 0;

  if (def.relationshipDelta) {
    for (const [anchor, delta] of Object.entries(def.relationshipDelta)) {
      if (typeof delta !== "number" || delta === 0) continue;
      try {
        const landed = await adjustNpcTrust(userId, anchor, delta, def.id);
        if (landed) bondsApplied += 1;
      } catch (err) {
        logger.warn(
          `[companionQuestRewards] bond adjust failed for ${def.id} → ${anchor}:`,
          err,
        );
      }
    }
  }

  if (def.standingDelta) {
    for (const [agencyId, delta] of Object.entries(def.standingDelta)) {
      if (typeof delta !== "number" || delta === 0) continue;
      try {
        const landed = await adjustAgencyStanding(userId, agencyId, delta);
        if (landed) standingsApplied += 1;
      } catch (err) {
        logger.warn(
          `[companionQuestRewards] standing adjust failed for ${def.id} → ${agencyId}:`,
          err,
        );
      }
    }
  }

  return { bondsApplied, standingsApplied };
}
