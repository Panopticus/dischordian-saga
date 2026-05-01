/* ═══════════════════════════════════════════════════════
   MYSTERY CLOSURE CRON

   Finds expired epoch_vote_tallies rows (expiresAt <= now AND
   isClosed = 0), computes the winning option, marks them closed,
   and compiles a MysterySeed → MysteryDefinition via
   apps/shared/mysteryTemplates.ts.

   Closes the engine's outer loop (per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md
   §10):

     epoch_vote_tallies.expiresAt fires
       → runMysteryClosure() picks the row
       → pickWinningOption(tally) → option id
       → seedFromVoteClosure() → MysterySeed
       → compileMysterySeed() → MysteryDefinition
       → logger.info (eligibility + openCase fan-out is a
                      follow-up slice; this slice ships
                      the engine plumbing only)

   Convention mirrors auditLogRotation.ts: fire-and-forget,
   errors are logged but never throw, returns an aggregate count.
   Idempotent — re-running picks up only rows still flagged
   isClosed=0, so a crashed run between the close-write and
   the compile-log step is safe to retry.
   ═══════════════════════════════════════════════════════ */

import { and, eq, lte } from "drizzle-orm";
import { epochVoteTallies, mysterySeeds } from "../../db/schema";
import { getDb } from "../db";
import { logger } from "../logger";
import {
  TEMPLATE_VOTE_RESOLUTION_SHORT,
  compileMysterySeed,
  seedFromVoteClosure,
} from "@shared/mysteryTemplates";
import type { MysterySeed } from "@shared/mysteryTypes";
import { registerCompiledMystery } from "./mysteryRegistry";

/** Persist a seed to the mystery_seeds table. Idempotent on
 *  seedId via the unique index — a duplicate insert is silently
 *  absorbed so cron retries don't crash. */
async function persistSeed(
  seed: MysterySeed,
  compiledMysteryId: string | null,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(mysterySeeds).values({
      seedId: seed.seedId,
      source: seed.source,
      templateId: seed.templateId,
      payload: seed.payload as Record<string, unknown>,
      compiledMysteryId,
    });
  } catch {
    // Duplicate seedId — already persisted on a prior pass.
    // Idempotent: no-op.
  }
}

/* ─── PURE: WINNING-OPTION SELECTION ─── */

/**
 * Pick the winning option id from a tally. Pure function — no
 * DB access, no logging. Ties resolve alphabetically (A > B > C
 * > D > E) so two players running the same closure deterministically
 * agree on the outcome.
 *
 * Returns "a" when every option has zero votes — the cron treats
 * a no-turnout closure as "default to option A" rather than skip,
 * so the Chronicle still records a canon outcome and the
 * downstream compiler always has something to work with.
 */
export function pickWinningOption(tally: {
  optionACount: number;
  optionBCount: number;
  optionCCount: number;
  optionDCount: number;
  optionECount: number;
}): "a" | "b" | "c" | "d" | "e" {
  const counts: ReadonlyArray<{ id: "a" | "b" | "c" | "d" | "e"; n: number }> = [
    { id: "a", n: tally.optionACount },
    { id: "b", n: tally.optionBCount },
    { id: "c", n: tally.optionCCount },
    { id: "d", n: tally.optionDCount },
    { id: "e", n: tally.optionECount },
  ];
  let winner: { id: "a" | "b" | "c" | "d" | "e"; n: number } = counts[0];
  for (let i = 1; i < counts.length; i++) {
    if (counts[i].n > winner.n) winner = counts[i];
  }
  return winner.id;
}

/* ─── CRON ─── */

export interface MysteryClosureResult {
  /** Number of vote tallies the cron flipped to isClosed = 1. */
  closed: number;
  /** Number of mysteries successfully compiled from the closures. */
  compiled: number;
  /** Number of closures that failed at any step (logged, not thrown). */
  errors: number;
}

/**
 * Run one closure pass. Best-effort: errors are logged per-row
 * and counted but never thrown so a single bad row can't block
 * the rest. Returns aggregate counts for telemetry.
 */
export async function runMysteryClosure(): Promise<MysteryClosureResult> {
  const result: MysteryClosureResult = { closed: 0, compiled: 0, errors: 0 };
  try {
    const db = await getDb();
    if (!db) return result;

    const now = new Date();
    const expired = await db.select().from(epochVoteTallies)
      .where(and(
        lte(epochVoteTallies.expiresAt, now),
        eq(epochVoteTallies.isClosed, 0),
      ));

    for (const tally of expired) {
      try {
        const winningOption = pickWinningOption(tally);

        await db.update(epochVoteTallies)
          .set({
            isClosed: 1,
            closedAt: now,
            winningOption,
          })
          .where(eq(epochVoteTallies.voteId, tally.voteId));
        result.closed += 1;

        const seed = seedFromVoteClosure(
          tally.voteId,
          winningOption,
          TEMPLATE_VOTE_RESOLUTION_SHORT,
        );
        const definition = compileMysterySeed(seed);

        if (definition) {
          registerCompiledMystery(definition);
          await persistSeed(seed, definition.id as string);
          result.compiled += 1;
          logger.info(
            `[MysteryClosureCron] compiled mystery '${definition.id}' from vote '${tally.voteId}' (winning option: ${winningOption}); ${definition.episodes.length} episode(s)`,
          );
        } else {
          logger.warn(
            `[MysteryClosureCron] vote '${tally.voteId}' closed on option '${winningOption}' but no mystery template accepted the seed`,
          );
        }
      } catch (rowErr) {
        result.errors += 1;
        logger.error(`[MysteryClosureCron] failed to close vote '${tally.voteId}':`, rowErr);
      }
    }
  } catch (err) {
    logger.error("[MysteryClosureCron] pass failed:", err);
  }
  return result;
}

/**
 * Manually close one specific vote (admin path). Same compile +
 * log flow as the cron, scoped to a single voteId. Returns the
 * single-row result; null when the vote isn't found or is already
 * closed.
 *
 * Used by `epochWitness.closeVote` admin procedure (per
 * docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10) so an
 * admin can advance the engine without waiting on cron.
 */
export async function closeVoteNow(voteId: string): Promise<{
  closed: boolean;
  compiled: boolean;
  winningOption: "a" | "b" | "c" | "d" | "e" | null;
  mysteryId: string | null;
}> {
  const empty = { closed: false, compiled: false, winningOption: null, mysteryId: null };
  try {
    const db = await getDb();
    if (!db) return empty;

    const rows = await db.select().from(epochVoteTallies)
      .where(eq(epochVoteTallies.voteId, voteId))
      .limit(1);
    const tally = rows[0];
    if (!tally) return empty;
    if (tally.isClosed === 1) return empty;

    const winningOption = pickWinningOption(tally);
    await db.update(epochVoteTallies)
      .set({
        isClosed: 1,
        closedAt: new Date(),
        winningOption,
      })
      .where(eq(epochVoteTallies.voteId, voteId));

    const seed = seedFromVoteClosure(
      voteId,
      winningOption,
      TEMPLATE_VOTE_RESOLUTION_SHORT,
    );
    const definition = compileMysterySeed(seed);
    if (!definition) {
      return { closed: true, compiled: false, winningOption, mysteryId: null };
    }
    registerCompiledMystery(definition);
    await persistSeed(seed, definition.id as string);
    logger.info(
      `[MysteryClosureCron:closeVoteNow] compiled '${definition.id}' from vote '${voteId}' (winning option: ${winningOption})`,
    );
    return {
      closed: true,
      compiled: true,
      winningOption,
      mysteryId: definition.id as string,
    };
  } catch (err) {
    logger.error(`[MysteryClosureCron:closeVoteNow] failed for '${voteId}':`, err);
    return empty;
  }
}

