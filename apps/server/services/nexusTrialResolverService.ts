/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL RESOLVERS — Sprint 10
   docs/design/NEXUS_TRIAL_PLAN.md → Server Architecture

   Vote-aggregation + resolution layer that the tick service
   (apps/server/services/nexusTrialTickService.ts) calls at
   the documented hook points:

     - aggregateTallies()          — every tick. testimony rows
                                     since lastSeenId roll into
                                     trial_tallies.
     - resolveCompanionSacrifice() — confession close. Lower
                                     weight = sacrificed.
     - resolveResurrectedBallot()  — cross_examination close.
                                     Higher weight = sacrificed
                                     (the community "names the
                                     dying name loudest").
     - getLeaderboard()            — polled read of trial_tallies.

   These functions are intentionally pure-of-tick-state — they
   accept the active trial as input and read/write through
   the DB. The tick service composes them.
   ═══════════════════════════════════════════════════════ */

import { and, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  testimony,
  trialTallies,
} from "../../db/schema";
import { logger } from "../logger";
import {
  BALLOT_KEYS,
  COMPANION_KEYS,
  bucket,
  type BallotKey,
  type CompanionKey,
} from "@shared/nexusTrial/buckets";
import type { TrialPhase } from "@shared/nexusTrial/phases";
import type { ActiveTrial } from "./nexusTrialTickService";

/* ─── Aggregation tick ─── */

export interface AggregationResult {
  testimonyConsidered: number;
  bucketsUpdated: number;
}

/**
 * Aggregate every testimony row for the active phase into
 * trial_tallies. Each testimony row contributes its
 * witnessingWeightX100 to each of its declared buckets.
 *
 * Implementation note: this is intentionally idempotent at the
 * row-aggregation level — re-running this for the same testimony
 * window produces the same totals because we write absolute sums
 * computed from the source rows, not deltas. Safe to call at the
 * 1-min tick cadence without coordination.
 */
export async function aggregateTallies(
  trial: ActiveTrial,
): Promise<AggregationResult> {
  const db = await getDb();
  if (!db) return { testimonyConsidered: 0, bucketsUpdated: 0 };

  try {
    // Pull every testimony row for this trial+phase. The row count
    // grows over the Trial's lifetime; at p99 we expect this in the
    // low-millions across the 72h window, partitioned by phase.
    // Sprint 15's load test confirms the query plan with realistic
    // data volume.
    const rows = await db
      .select()
      .from(testimony)
      .where(
        and(eq(testimony.trialId, trial.id), eq(testimony.phase, trial.currentPhase)),
      );

    // Bucket → summed weight.
    const totals = new Map<string, number>();
    for (const row of rows) {
      const w = row.witnessingWeightX100;
      for (const b of row.buckets as string[]) {
        totals.set(b, (totals.get(b) ?? 0) + w);
      }
    }

    // Upsert per-bucket totals. We use the unique (trialId, phase,
    // bucket) index — INSERT … ON DUPLICATE KEY UPDATE writes the
    // absolute weight, never an additive delta, so the tally is
    // self-correcting after restarts.
    let bucketsUpdated = 0;
    for (const [bucketId, weight] of totals.entries()) {
      await db
        .insert(trialTallies)
        .values({
          trialId: trial.id,
          phase: trial.currentPhase,
          bucket: bucketId,
          weight,
        })
        .onDuplicateKeyUpdate({ set: { weight } });
      bucketsUpdated++;
    }

    return { testimonyConsidered: rows.length, bucketsUpdated };
  } catch (e) {
    logger.error(
      `[NexusTrial] aggregateTallies failed for trial=${trial.trialKey}:`,
      e,
    );
    return { testimonyConsidered: 0, bucketsUpdated: 0 };
  }
}

/* ─── Companion sacrifice (Confession close) ─── */

export interface CompanionSacrificeResult {
  /** Which companion is sacrificed. */
  sacrificed: CompanionKey;
  /** Final weighted vote count per companion. */
  weights: Record<CompanionKey, number>;
}

/**
 * Resolve at confession close. Per the plan:
 *   tally.elara_weight > tally.human_weight ? 'human' : 'elara'
 * The lower-weighted companion is *sacrificed* — high weight =
 * community wants them to survive.
 *
 * Reads from trial_tallies (already aggregated by the tick).
 * Falls back to deterministic default (sacrifice Elara) when both
 * tallies are zero — the plan's Operator Runbook abort default.
 */
export async function resolveCompanionSacrifice(
  trial: ActiveTrial,
): Promise<CompanionSacrificeResult | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const allPhaseBuckets = COMPANION_KEYS.map((c) => bucket("companion", c));
    const rows = await db
      .select()
      .from(trialTallies)
      .where(
        and(
          eq(trialTallies.trialId, trial.id),
          eq(trialTallies.phase, "confession"),
          inArray(trialTallies.bucket, allPhaseBuckets),
        ),
      );

    const weights: Record<CompanionKey, number> = { elara: 0, human: 0 };
    for (const row of rows) {
      for (const c of COMPANION_KEYS) {
        if (row.bucket === bucket("companion", c)) weights[c] = row.weight;
      }
    }

    // Lower-weighted is sacrificed. Tie → Elara (deterministic).
    const sacrificed: CompanionKey =
      weights.elara <= weights.human ? "elara" : "human";

    logger.info(
      `[NexusTrial] resolveCompanionSacrifice: ${sacrificed} sacrificed (elara=${weights.elara}, human=${weights.human})`,
    );
    return { sacrificed, weights };
  } catch (e) {
    logger.error(
      `[NexusTrial] resolveCompanionSacrifice failed for trial=${trial.trialKey}:`,
      e,
    );
    return null;
  }
}

/* ─── Second-death ballot (cross_examination close) ─── */

export interface BallotResolutionResult {
  /** The ballot name selected for the second death. */
  winner: BallotKey;
  /** Final weighted vote count per candidate, aggregated across
   *  every phase up to and including cross_examination. */
  weights: Record<BallotKey, number>;
}

/**
 * Resolve at cross_examination close. Per the plan: the ballot
 * winner is the candidate with the **highest** weighted votes
 * across all pre-Verdict phases. This may feel inverted relative
 * to a normal protect-your-favorite vote — but the Trial is a
 * death vote: the community "names the dying name loudest", and
 * the multiplier from recovered burnt cards (1.5×) amplifies the
 * voice of players who rescued a candidate's name in Salvage.
 *
 * Falls back to a deterministic default (sacrifice Akai Shi —
 * the cosmic-threat archetype) when every tally is zero.
 */
export async function resolveResurrectedBallot(
  trial: ActiveTrial,
): Promise<BallotResolutionResult | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const ballotBuckets = BALLOT_KEYS.map((k) => bucket("ballot", k));
    // Sum across all pre-Verdict phases. trial_tallies stores per-
    // phase rows so we SUM them at read time.
    const rows = await db
      .select({
        bucket: trialTallies.bucket,
        weight: sql<number>`SUM(${trialTallies.weight})`.as("weight"),
      })
      .from(trialTallies)
      .where(
        and(
          eq(trialTallies.trialId, trial.id),
          inArray(trialTallies.bucket, ballotBuckets),
        ),
      )
      .groupBy(trialTallies.bucket);

    const weights: Record<BallotKey, number> = {
      wraith_calder: 0,
      lycos: 0,
      akai_shi: 0,
      vex_solene: 0,
    };
    for (const row of rows) {
      for (const k of BALLOT_KEYS) {
        if (row.bucket === bucket("ballot", k)) weights[k] = Number(row.weight ?? 0);
      }
    }

    // Highest weight wins (is sacrificed). Tie-break by canonical
    // BALLOT_KEYS order (stable across runs); operator runbook
    // documents Akai Shi as the abort-default fallback.
    let winner: BallotKey = "akai_shi";
    let maxWeight = -Infinity;
    for (const k of BALLOT_KEYS) {
      if (weights[k] > maxWeight) {
        winner = k;
        maxWeight = weights[k];
      }
    }

    logger.info(
      `[NexusTrial] resolveResurrectedBallot: ${winner} sacrificed (weights=${JSON.stringify(weights)})`,
    );
    return { winner, weights };
  } catch (e) {
    logger.error(
      `[NexusTrial] resolveResurrectedBallot failed for trial=${trial.trialKey}:`,
      e,
    );
    return null;
  }
}

/* ─── Leaderboard (polled read) ─── */

export interface LeaderboardEntry {
  phase: TrialPhase;
  bucket: string;
  weight: number;
}

/** Polled read of trial_tallies for the panel/Daily-Brief surfaces.
 *  Sprint 4 has the panel polling at 30s; this endpoint returns the
 *  current per-phase tallies. WebSocket push lands later. */
export async function getLeaderboard(
  trial: ActiveTrial,
): Promise<LeaderboardEntry[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(trialTallies)
      .where(eq(trialTallies.trialId, trial.id));
    return rows.map((r) => ({
      phase: r.phase as TrialPhase,
      bucket: r.bucket,
      weight: r.weight,
    }));
  } catch (e) {
    logger.error(`[NexusTrial] getLeaderboard failed for trial=${trial.trialKey}:`, e);
    return [];
  }
}
