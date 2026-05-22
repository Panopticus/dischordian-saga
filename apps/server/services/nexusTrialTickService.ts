/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL TICK SERVICE
   docs/design/NEXUS_TRIAL_PLAN.md → Server Architecture

   The 1-min cadence aggregator + phase-transition handler
   for the 72-hour live event. Phase boundaries fire on
   schedule; missed boundary ticks are recovered by reading
   the wall clock against `phaseEndsAt`.

   Sprint 9 scope:
     - loadActiveTrial / startTrial / abortTrial
     - tick() — drives phase transitions
     - transitionPhase() — transactional advance, snapshot
       on close, permadeath hook at Verdict close
     - getTrialStatus() — read-only view

   Sprint 10 expands:
     - testimony aggregation queries
     - leaderboard subscription publishing
     - cinematic selector wiring at confession + ballot hooks

   The tick is wired from apps/server/_core/index.ts as a
   1-minute setInterval during the Trial window (the season
   tick remains at 5 minutes and is independent).
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { trials, trialPhases } from "../../db/schema";
import { logger } from "../logger";
import { RULES_VERSION } from "@shared/tcg-core/engine/version";
import {
  TRIAL_PHASES,
  PHASE_DURATION_PRODUCTION_MS,
  nextPhase,
  type TrialPhase,
  type TrialStatus,
} from "@shared/nexusTrial/phases";
import { getPermadeathStore } from "@shared/resurrectionProtocols";
import {
  aggregateTallies,
  resolveCompanionSacrifice,
  resolveResurrectedBallot,
} from "./nexusTrialResolverService";
import {
  ballotCinematicFor,
  lockeCinematic,
} from "@shared/nexusTrial/cinematics";

/** Last-resolved cache so the Verdict-close hook can name the ballot
 *  winner without re-running the resolver. Updated at
 *  cross_examination close; consumed at verdict close. Module-local
 *  state is fine here because production has one Trial and one
 *  server process running the tick. */
let lastBallotWinner: import("@shared/nexusTrial/buckets").BallotKey | null = null;
let lastCompanionSacrifice:
  | import("@shared/nexusTrial/buckets").CompanionKey
  | null = null;

/** Exposed for tests + the operator dashboard's audit surface. */
export function getLastResolverState() {
  return { lastBallotWinner, lastCompanionSacrifice };
}

/** Reset for tests. Production never calls this. */
export function _resetResolverStateForTests() {
  lastBallotWinner = null;
  lastCompanionSacrifice = null;
}

/* ─── Active-trial cache ─── */

/**
 * Minimal in-memory shape the service operates on. The persisted
 * row carries additional metadata (audit fields, abort reason) we
 * don't need on the hot path.
 */
export interface ActiveTrial {
  id: number;
  trialKey: string;
  currentPhase: TrialPhase;
  startedAt: Date;
  phaseStartedAt: Date;
  phaseEndsAt: Date;
  phaseDurationMs: number;
  rulesVersionAtStart: string;
  status: TrialStatus;
}

/* ─── Read ─── */

/**
 * Return the currently-running Trial, or null. Falls back to null
 * when the DB is unavailable (tests, dev without a DB).
 */
export async function loadActiveTrial(): Promise<ActiveTrial | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(trials)
      .where(eq(trials.status, "live"))
      .limit(1);
    if (rows.length === 0) return null;
    return toActive(rows[0]);
  } catch (e) {
    logger.error("[NexusTrial] loadActiveTrial failed:", e);
    return null;
  }
}

/* ─── Write — admin ─── */

export interface StartTrialOptions {
  trialKey: string;
  /** When the Trial should begin. Defaults to "now". */
  startedAt?: Date;
  /** Production: 12 h. Staging dry-run override: shorter cadence. */
  phaseDurationMs?: number;
}

/**
 * Create a new Trial row and flip its status to "live". Called once
 * (manually, by operator) when the 72-hour window opens. Idempotent
 * on `trialKey` — calling with an existing key returns the existing
 * trial unchanged.
 */
export async function startTrial(
  options: StartTrialOptions,
): Promise<ActiveTrial | null> {
  const db = await getDb();
  if (!db) {
    logger.warn("[NexusTrial] startTrial: no DB available");
    return null;
  }
  const phaseDurationMs = options.phaseDurationMs ?? PHASE_DURATION_PRODUCTION_MS;
  const startedAt = options.startedAt ?? new Date();
  const phaseStartedAt = startedAt;
  const phaseEndsAt = new Date(startedAt.getTime() + phaseDurationMs);

  try {
    // Idempotent: check for an existing row first.
    const existing = await db
      .select()
      .from(trials)
      .where(eq(trials.trialKey, options.trialKey))
      .limit(1);
    if (existing.length > 0) return toActive(existing[0]);

    await db.insert(trials).values({
      trialKey: options.trialKey,
      currentPhase: "charge",
      startedAt,
      phaseStartedAt,
      phaseEndsAt,
      phaseDurationMs,
      rulesVersionAtStart: RULES_VERSION,
      status: "live",
    });

    // Initialize all six phase rows with the charge row started.
    for (const phase of TRIAL_PHASES) {
      await db.insert(trialPhases).values({
        trialId: 0, // placeholder; replaced below
        phase,
        startedAt: phase === "charge" ? startedAt : new Date(0),
      } as never).onDuplicateKeyUpdate({ set: {} });
    }

    const created = await db
      .select()
      .from(trials)
      .where(eq(trials.trialKey, options.trialKey))
      .limit(1);
    if (created.length === 0) return null;

    // Update the phase rows with the real trial id.
    const trialId = created[0].id;
    await db
      .update(trialPhases)
      .set({ trialId })
      .where(eq(trialPhases.trialId, 0));

    logger.info(
      `[NexusTrial] started trial=${options.trialKey} id=${trialId} phaseDuration=${phaseDurationMs}ms`,
    );
    return toActive(created[0]);
  } catch (e) {
    logger.error("[NexusTrial] startTrial failed:", e);
    return null;
  }
}

/* ─── Tick ─── */

/** Output of a single `tick()` call. Useful in tests + the operator
 *  dashboard so producers can see what each tick did. */
export interface TickResult {
  ranAt: Date;
  /** True iff a phase boundary crossed during this tick. */
  transitioned: boolean;
  /** Phase entered, when transitioned. */
  enteredPhase?: TrialPhase | null;
  /** True iff the Trial closed during this tick. */
  closedTrial: boolean;
}

/**
 * Main entry point. Idempotent — if no boundary has crossed, this is
 * a no-op aside from the read. Safe to call concurrently with the
 * existing 5-min season tick; the two services don't share state.
 */
export async function tick(now: Date = new Date()): Promise<TickResult> {
  const result: TickResult = { ranAt: now, transitioned: false, closedTrial: false };
  const trial = await loadActiveTrial();
  if (!trial || trial.status !== "live") return result;

  // Every tick: roll testimony rows into trial_tallies. Idempotent
  // (writes absolute sums), so safe even if the previous tick was
  // missed or the row count exploded between ticks.
  await aggregateTallies(trial);

  if (now.getTime() < trial.phaseEndsAt.getTime()) return result;

  const transition = await transitionPhase(trial, now);
  result.transitioned = transition.transitioned;
  result.enteredPhase = transition.enteredPhase ?? undefined;
  result.closedTrial = transition.closedTrial;
  return result;
}

/* ─── Transition ─── */

export interface TransitionResult {
  transitioned: boolean;
  enteredPhase: TrialPhase | null;
  closedTrial: boolean;
}

/**
 * Advance the Trial out of its current phase. All writes happen in a
 * single DB transaction so observers never see a half-applied state.
 *
 *   1. Close the current phase row (write closedAt + snapshot).
 *   2. If `currentPhase === verdict`, mark the trial closed and
 *      apply the Verdict permadeath hooks.
 *   3. Else, advance currentPhase, phaseStartedAt, phaseEndsAt on
 *      the trial row, and mark the next phase row as started.
 *
 * Sprint 10's resolvers (companion sacrifice on confession close;
 * ballot winner on cross_examination close) plug in at the marked
 * hook points below.
 */
export async function transitionPhase(
  trial: ActiveTrial,
  now: Date = new Date(),
): Promise<TransitionResult> {
  const db = await getDb();
  if (!db) {
    return { transitioned: false, enteredPhase: null, closedTrial: false };
  }

  const next = nextPhase(trial.currentPhase);

  try {
    return await db.transaction(async (tx) => {
      // 1. Close the outgoing phase row.
      await tx
        .update(trialPhases)
        .set({
          closedAt: now,
          // Sprint 10 plugs the real aggregated snapshot here.
          finalTallySnapshot: { closedAt: now.toISOString() },
        })
        .where(
          and(
            eq(trialPhases.trialId, trial.id),
            eq(trialPhases.phase, trial.currentPhase),
          ),
        );

      // 2. Resolvers fire at the documented phase-close hooks.
      //    Note: the resolvers read from trial_tallies, which the
      //    1-min aggregation tick has been keeping up to date. We
      //    intentionally do NOT re-aggregate inside the transition
      //    transaction — the aggregation runs on the regular tick
      //    cadence and the resolver reads its result.
      if (trial.currentPhase === "cross_examination") {
        const result = await resolveResurrectedBallot(trial);
        if (result) {
          lastBallotWinner = result.winner;
          logger.info(
            `[NexusTrial] ballot resolved at cross_examination close: ${result.winner}`,
          );
        }
      }
      if (trial.currentPhase === "confession") {
        const result = await resolveCompanionSacrifice(trial);
        if (result) {
          lastCompanionSacrifice = result.sacrificed;
          logger.info(
            `[NexusTrial] companion sacrifice resolved at confession close: ${result.sacrificed}`,
          );
        }
      }

      if (next === null) {
        // 2.a. Verdict close — apply permadeath and finalize.
        await tx
          .update(trials)
          .set({ status: "closed" })
          .where(eq(trials.id, trial.id));

        applyVerdictPermadeath(trial);
        logger.info(
          `[NexusTrial] trial closed key=${trial.trialKey} id=${trial.id} at=${now.toISOString()}`,
        );
        return { transitioned: true, enteredPhase: null, closedTrial: true };
      }

      // 3. Advance into the next phase.
      const nextPhaseEnds = new Date(now.getTime() + trial.phaseDurationMs);
      await tx
        .update(trials)
        .set({
          currentPhase: next,
          phaseStartedAt: now,
          phaseEndsAt: nextPhaseEnds,
        })
        .where(eq(trials.id, trial.id));

      await tx
        .update(trialPhases)
        .set({ startedAt: now })
        .where(
          and(eq(trialPhases.trialId, trial.id), eq(trialPhases.phase, next)),
        );

      logger.info(
        `[NexusTrial] phase advance trial=${trial.trialKey} ${trial.currentPhase} → ${next}`,
      );
      return { transitioned: true, enteredPhase: next, closedTrial: false };
    });
  } catch (e) {
    logger.error(`[NexusTrial] transitionPhase failed for trial=${trial.trialKey}:`, e);
    return { transitioned: false, enteredPhase: null, closedTrial: false };
  }
}

/* ─── Verdict permadeath ─── */

/**
 * Apply the two Trial deaths at Verdict close.
 *
 *   - Locke is fixed canon (the Necromancer's price for banishment).
 *   - The ballot winner is the Vortex's price.
 *
 * Sprint 9 wires Locke's permadeath here; the ballot winner's
 * permadeath needs the Sprint 10 vote-aggregation resolver to name
 * the winner. Until that lands, we mark Locke and log a Sprint-10
 * TODO for the second name.
 */
function applyVerdictPermadeath(trial: ActiveTrial): void {
  const store = getPermadeathStore();
  if (!store.isPermadead("locke")) {
    store.markPermadead("locke", {
      trialId: trial.trialKey,
      recordedAt: Date.now(),
      source: "necromancer_price",
      finalNarration: lockeCinematic().antiquarianClosing,
    });
    logger.info(`[NexusTrial] permadeath recorded: locke (necromancer_price)`);
  }

  // Ballot winner — the Vortex's price. The cross_examination-close
  // resolver named the winner; consume it here. If the resolver
  // couldn't run (e.g. abort), the runbook's default applies: Akai
  // Shi (the cosmic-threat archetype). Per-candidate narration comes
  // from the canonical cinematic registry — single source of truth.
  const winner = lastBallotWinner ?? "akai_shi";
  if (!store.isPermadead(winner)) {
    store.markPermadead(winner, {
      trialId: trial.trialKey,
      recordedAt: Date.now(),
      source: "vortex_price",
      finalNarration: ballotCinematicFor(winner).antiquarianClosing,
    });
    logger.info(`[NexusTrial] permadeath recorded: ${winner} (vortex_price)`);
  }
}

/* ─── Status (read-only) ─── */

export interface TrialStatusReadout {
  available: boolean;
  trialKey: string | null;
  currentPhase: TrialPhase | null;
  status: TrialStatus | null;
  phaseEndsAt: number | null;
  rulesVersionAtStart: string | null;
}

export async function getTrialStatus(): Promise<TrialStatusReadout> {
  const trial = await loadActiveTrial();
  if (!trial) {
    return {
      available: false,
      trialKey: null,
      currentPhase: null,
      status: null,
      phaseEndsAt: null,
      rulesVersionAtStart: null,
    };
  }
  return {
    available: true,
    trialKey: trial.trialKey,
    currentPhase: trial.currentPhase,
    status: trial.status,
    phaseEndsAt: trial.phaseEndsAt.getTime(),
    rulesVersionAtStart: trial.rulesVersionAtStart,
  };
}

/* ─── Row → in-memory ─── */

function toActive(row: typeof trials.$inferSelect): ActiveTrial {
  return {
    id: row.id,
    trialKey: row.trialKey,
    currentPhase: row.currentPhase as TrialPhase,
    startedAt: row.startedAt,
    phaseStartedAt: row.phaseStartedAt,
    phaseEndsAt: row.phaseEndsAt,
    phaseDurationMs: row.phaseDurationMs,
    rulesVersionAtStart: row.rulesVersionAtStart,
    status: row.status as TrialStatus,
  };
}
