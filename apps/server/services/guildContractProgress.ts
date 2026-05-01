/* ═══════════════════════════════════════════════════════
   GUILD CONTRACT PROGRESS — server-side helpers for the
   F.2 weekly contract loop.

   incrementProgress is called from the existing source
   emitters (guildWars.contribute for fight_win / pvp_win /
   trade_volume / etc., guild.donate for guild_donation).
   It walks WEEKLY_CONTRACTS, finds every contract whose
   source matches the emitted event, and upserts a per-
   (userId, weekId, contractId) row with the new count.

   Contracts complete the moment progressCount crosses the
   template's targetCount; cs_contract_complete fires from
   the explicit completeContract mutation, NOT here, so the
   client's confirmation step decides when to play the
   cinematic + claim the reward.

   Schema: guildContractProgress in apps/db/schema.ts.
   ═══════════════════════════════════════════════════════ */

import { eq, and, sql } from "drizzle-orm";

import { getDb } from "../db";
import { guildContractProgress } from "../../db/schema";
import {
  WEEKLY_CONTRACTS,
  type ContractSource,
} from "../../shared/guildContracts";
import { currentWeekId } from "../routers/guildContracts";
import { logger } from "../logger";

/** Progress row shape returned to the client. */
export interface ContractProgressRow {
  contractId: string;
  progressCount: number;
  targetCount: number;
  completed: boolean;
}

/**
 * Increment progress on every weekly contract whose source matches
 * the emitted event. Fire-and-forget from the source emitters; logs
 * + swallows DB errors so the caller's main flow isn't disrupted by
 * a contract-progress write failure.
 *
 * @param userId    the player who triggered the source event
 * @param source    which game-loop fired (must match a ContractSource)
 * @param amount    how much to increment (1 for discrete events,
 *                  trade_volume passes the credits amount)
 */
export async function incrementContractProgress(
  userId: number,
  source: ContractSource,
  amount = 1,
): Promise<void> {
  const matching = WEEKLY_CONTRACTS.filter((c) => c.source === source);
  if (matching.length === 0) return;
  const db = await getDb();
  if (!db) return;
  const weekId = currentWeekId();

  for (const contract of matching) {
    try {
      // Upsert: insert with progressCount=amount, OR on conflict bump
      // the existing row's progressCount by amount.
      await db
        .insert(guildContractProgress)
        .values({
          userId,
          weekId,
          contractId: contract.id,
          progressCount: amount,
        })
        .onDuplicateKeyUpdate({
          set: {
            progressCount: sql`${guildContractProgress.progressCount} + ${amount}`,
          },
        });
    } catch (err) {
      logger.error(
        `[GuildContracts] incrementContractProgress upsert failed for user=${userId} contract=${contract.id}:`,
        err,
      );
    }
  }
}

/** Read every weekly contract's progress for a player in the
 *  current week. Missing rows surface as progressCount=0. */
export async function getContractProgress(
  userId: number,
): Promise<ContractProgressRow[]> {
  const db = await getDb();
  if (!db) return WEEKLY_CONTRACTS.map((c) => ({
    contractId: c.id,
    progressCount: 0,
    targetCount: c.targetCount,
    completed: false,
  }));
  const weekId = currentWeekId();
  const rows = await db
    .select()
    .from(guildContractProgress)
    .where(
      and(
        eq(guildContractProgress.userId, userId),
        eq(guildContractProgress.weekId, weekId),
      ),
    );
  const byContractId = new Map(rows.map((r) => [r.contractId, r] as const));
  return WEEKLY_CONTRACTS.map((c) => {
    const row = byContractId.get(c.id);
    return {
      contractId: c.id,
      progressCount: row?.progressCount ?? 0,
      targetCount: c.targetCount,
      completed: row?.completedAt != null,
    };
  });
}

/** Mark a contract as completed if the player's progress meets the
 *  template's target. Idempotent: a second call after completedAt
 *  is set returns `{ alreadyCompleted: true }`. Returns the
 *  authoritative state so the caller doesn't have to re-query. */
export async function tryCompleteContract(
  userId: number,
  contractId: string,
): Promise<
  | { ok: false; reason: "unknown_contract" | "below_target" | "db_unavailable"; progressCount?: number; targetCount?: number }
  | { ok: true; alreadyCompleted: boolean; progressCount: number; targetCount: number }
> {
  const template = WEEKLY_CONTRACTS.find((c) => c.id === contractId);
  if (!template) return { ok: false, reason: "unknown_contract" };
  const db = await getDb();
  if (!db) return { ok: false, reason: "db_unavailable" };
  const weekId = currentWeekId();
  const [row] = await db
    .select()
    .from(guildContractProgress)
    .where(
      and(
        eq(guildContractProgress.userId, userId),
        eq(guildContractProgress.weekId, weekId),
        eq(guildContractProgress.contractId, contractId),
      ),
    )
    .limit(1);
  const progressCount = row?.progressCount ?? 0;
  if (progressCount < template.targetCount) {
    return {
      ok: false,
      reason: "below_target",
      progressCount,
      targetCount: template.targetCount,
    };
  }
  if (row?.completedAt) {
    return {
      ok: true,
      alreadyCompleted: true,
      progressCount,
      targetCount: template.targetCount,
    };
  }
  // Stamp completedAt. Upsert pattern handles the case where
  // progress just crossed the threshold but no row exists yet
  // (impossible if increments are wired, but defensive).
  await db
    .insert(guildContractProgress)
    .values({
      userId,
      weekId,
      contractId,
      progressCount,
      completedAt: new Date(),
    })
    .onDuplicateKeyUpdate({
      set: { completedAt: new Date() },
    });
  return {
    ok: true,
    alreadyCompleted: false,
    progressCount,
    targetCount: template.targetCount,
  };
}
