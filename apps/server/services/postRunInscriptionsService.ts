/* ═══════════════════════════════════════════════════════
   POST-RUN INSCRIPTIONS SERVICE

   Server-side glue for Bandersnatch Moves 4 + 5. Called by the
   prestige router on Act 7 completion to write the Antiquarian's
   cycle-aware Tome entry and the community Dischordia inscription.
   Idempotent on the inscriptionId — re-running yields no
   duplicate rows.
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";

import { voteAntiquarianEntries } from "../../db/schema";
import {
  buildCycleAwareInscription,
  buildDischordiaInscription,
  type PostRunInscriptionContext,
} from "../../shared/postRunInscriptions";
import { getDb } from "../db";
import { logger } from "../logger";
import { dischordiaCycleService } from "./dischordiaCycleService";

export interface WriteResult {
  cycleAwareWritten: boolean;
  dischordiaWritten: boolean;
  cycleAwareInscriptionId: string;
  dischordiaInscriptionId: string;
}

/**
 * Idempotently inscribe the cycle-aware + Dischordia post-run
 * entries. `userId` is the player; the inscription's voteId
 * namespace embeds the userId so each player gets their own row
 * per cycle.
 *
 * Returns flags indicating whether each inscription was newly
 * written (false means it already existed).
 */
export async function inscribePostRun(args: {
  userId: number;
  ctx: PostRunInscriptionContext;
}): Promise<WriteResult> {
  const { userId, ctx } = args;
  const db = await getDb();

  const cycleInscription = buildCycleAwareInscription(ctx);
  const dischordiaInscription = buildDischordiaInscription(ctx);

  const cycleVoteId = `post_run:${userId}:${ctx.prestigeTier}:${ctx.stanceFlag ?? "none"}`;
  const dischordiaVoteId = `dischordia:${userId}:${ctx.prestigeTier}`;

  const result: WriteResult = {
    cycleAwareWritten: false,
    dischordiaWritten: false,
    cycleAwareInscriptionId: cycleVoteId,
    dischordiaInscriptionId: dischordiaVoteId,
  };

  if (!db) return result;

  // Cycle-aware tome
  try {
    const [existing] = await db
      .select({ id: voteAntiquarianEntries.id })
      .from(voteAntiquarianEntries)
      .where(eq(voteAntiquarianEntries.voteId, cycleVoteId))
      .limit(1);
    if (!existing) {
      await db.insert(voteAntiquarianEntries).values({
        voteId: cycleVoteId,
        winningOptionNumber: ctx.prestigeTier,
        body: cycleInscription.body,
        annotation: cycleInscription.annotation ?? null,
      });
      result.cycleAwareWritten = true;
    }
  } catch (err) {
    logger.error("[PostRunInscription] cycle-aware insert failed:", err);
  }

  // Dischordia
  try {
    const [existing] = await db
      .select({ id: voteAntiquarianEntries.id })
      .from(voteAntiquarianEntries)
      .where(eq(voteAntiquarianEntries.voteId, dischordiaVoteId))
      .limit(1);
    if (!existing) {
      await db.insert(voteAntiquarianEntries).values({
        voteId: dischordiaVoteId,
        winningOptionNumber: ctx.prestigeTier,
        body: dischordiaInscription.body,
        annotation: dischordiaInscription.annotation ?? null,
      });
      result.dischordiaWritten = true;
    }
  } catch (err) {
    logger.error("[PostRunInscription] dischordia insert failed:", err);
  }

  return result;
}

/**
 * Build the inscription context for the just-finished player by
 * reading the canonical run-state inputs the inscription
 * templates need. Pure DB read; no mutations.
 */
export async function snapshotInscriptionContext(args: {
  userId: number;
  prestigeTier: number;
  stanceFlag: string | null;
  pathFlag: PostRunInscriptionContext["pathFlag"];
  humanityRunCount: number;
  machineRunCount: number;
  balanceRunCount: number;
}): Promise<PostRunInscriptionContext> {
  const cycleState = dischordiaCycleService.getState();
  return {
    prestigeTier: args.prestigeTier,
    stanceFlag: args.stanceFlag,
    pathFlag: args.pathFlag,
    humanityRunCount: args.humanityRunCount,
    machineRunCount: args.machineRunCount,
    balanceRunCount: args.balanceRunCount,
    communityLight: cycleState.lightEnergy,
    communityDark: cycleState.darkEnergy,
  };
}
