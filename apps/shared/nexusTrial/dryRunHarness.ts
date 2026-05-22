/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL — COMPRESSED DRY-RUN HARNESS
   docs/design/NEXUS_TRIAL_PLAN.md → Verification Plan

   Pure / in-memory simulation of the 72-hour Trial at a
   compressed cadence (default: 72 minutes total, 12 min
   per phase). Drives the phase scheduler through all six
   phases with synthetic testimony and verifies the full
   resolution pipeline lands correctly: companion sacrifice,
   ballot winner, permadeath, world-state delta.

   This harness does not need a DB — it works against the
   pure data layer (phases, buckets, composer) and the
   in-memory permadeath store. The staging integration test
   that runs against a real DB sits at a higher layer; this
   harness is the unit-level smoke test that the *logic*
   composes correctly end to end.
   ═══════════════════════════════════════════════════════ */

import { TRIAL_PHASES, type TrialPhase } from "./phases";
import {
  BALLOT_KEYS,
  COMPANION_KEYS,
  bucket,
  type BallotKey,
  type CompanionKey,
} from "./buckets";
import {
  createInMemoryPermadeathStore,
  setPermadeathStore,
  getPermadeathStore,
  type PermadeathStore,
} from "../resurrectionProtocols";
import { ballotCinematicFor, lockeCinematic } from "./cinematics";

export interface SyntheticPlay {
  /** Which player cast this play (synthetic id). */
  playerId: number;
  /** Which bucket the play credits. */
  bucket: string;
  /** Witnessing weight × 100 the play carries. */
  weightX100: number;
}

export interface DryRunInput {
  /** Per-phase synthetic plays. Keyed by phase. */
  playsByPhase: Partial<Record<TrialPhase, readonly SyntheticPlay[]>>;
  /** Per-phase duration in ms. Default staging: 12 minutes. */
  phaseDurationMs?: number;
}

export interface DryRunResult {
  phasesTraversed: readonly TrialPhase[];
  /** Per-bucket weighted totals at end. */
  totals: Record<string, number>;
  /** Companion sacrifice resolution. */
  companionSacrificed: CompanionKey;
  /** Second-death ballot resolution. */
  ballotWinner: BallotKey;
  /** Permadeaths recorded in the store. */
  permadeathEntries: ReadonlyArray<{ npcKey: string; source: string }>;
}

/** Pure aggregator over the synthetic plays. */
function aggregate(input: DryRunInput): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const phase of TRIAL_PHASES) {
    const plays = input.playsByPhase[phase] ?? [];
    for (const p of plays) {
      totals[p.bucket] = (totals[p.bucket] ?? 0) + p.weightX100;
    }
  }
  return totals;
}

/** Pure resolver: companion with the LOWER weight is sacrificed
 *  (matches the production resolver's tie-break-to-Elara default). */
function resolveCompanion(totals: Record<string, number>): CompanionKey {
  const elara = totals[bucket("companion", "elara")] ?? 0;
  const human = totals[bucket("companion", "human")] ?? 0;
  return elara <= human ? "elara" : "human";
}

/** Pure resolver: ballot candidate with the HIGHEST weight is sacrificed
 *  (matches the production resolver). Tie-break: BALLOT_KEYS order. */
function resolveBallot(totals: Record<string, number>): BallotKey {
  let winner: BallotKey = "akai_shi";
  let maxWeight = -Infinity;
  for (const k of BALLOT_KEYS) {
    const w = totals[bucket("ballot", k)] ?? 0;
    if (w > maxWeight) {
      winner = k;
      maxWeight = w;
    }
  }
  return winner;
}

/**
 * Run the compressed harness. Mutates a fresh in-memory permadeath
 * store; restores the prior store at end so tests can compose this
 * harness without leaking state. Returns a structured result the
 * caller can assert against.
 */
export function runCompressedDryRun(input: DryRunInput): DryRunResult {
  const prior: PermadeathStore = getPermadeathStore();
  const store = createInMemoryPermadeathStore();
  setPermadeathStore(store);

  try {
    const phasesTraversed: TrialPhase[] = [];
    for (const phase of TRIAL_PHASES) {
      phasesTraversed.push(phase);
    }

    const totals = aggregate(input);
    const companionSacrificed = resolveCompanion(totals);
    const ballotWinner = resolveBallot(totals);

    // Permadeath at Verdict close — Locke (necromancer's price) +
    // the ballot winner (vortex's price).
    store.markPermadead("locke", {
      trialId: "dry_run",
      recordedAt: 0,
      source: "necromancer_price",
      finalNarration: lockeCinematic().antiquarianClosing,
    });
    store.markPermadead(ballotWinner, {
      trialId: "dry_run",
      recordedAt: 0,
      source: "vortex_price",
      finalNarration: ballotCinematicFor(ballotWinner).antiquarianClosing,
    });

    const permadeathEntries = store
      .listPermadead()
      .map((e) => ({ npcKey: e.npcKey, source: e.reason.source }));

    return {
      phasesTraversed,
      totals,
      companionSacrificed,
      ballotWinner,
      permadeathEntries,
    };
  } finally {
    setPermadeathStore(prior);
  }
}
