/* ═══════════════════════════════════════════════════════
   REVERSE TRIAL — Mission 2 (Week 2)
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3 mission detail

   Authority Trial mechanic with player/AI roles inverted.
   Player runs all six phases sequentially against an AI
   defendant; must win ≥4 of 6 phases on verdict-delta.

   Pass:    ≥4 phase wins → filed buff (+2 plays on turns 1–3 at Trial)
   Penalty: <4 wins → 0.75× weight on Charge + Opening at Trial

   Pure scorer module. The Reverse Trial UI (deferred to
   later sprints) submits per-phase outcomes; this scorer
   resolves the mission evaluation.
   ═══════════════════════════════════════════════════════ */

import type { MissionEvaluation } from "../registry";

/** The six phases of the Authority Trial, in order. Mirrors the
 *  apps/shared/tcg-core/engine/trialPhase.ts phase set. */
export const REVERSE_TRIAL_PHASES = [
  "charge",
  "opening",
  "evidence",
  "cross_examination",
  "confession",
  "verdict",
] as const;

export type ReverseTrialPhase = (typeof REVERSE_TRIAL_PHASES)[number];

/** Per-phase outcome the client submits. The aggregate verdict-delta
 *  is the running total at end-of-phase; `won` is true if the
 *  player's delta exceeds the AI defendant's at phase close. */
export interface PhaseOutcome {
  phase: ReverseTrialPhase;
  won: boolean;
  /** Signed verdict-delta accumulated during the phase. Surfaced in the
   *  mission summary; not used by the pass/fail rule itself. */
  verdictDelta: number;
}

export interface ReverseTrialSubmission {
  /** Per-phase outcomes in canonical order. Must contain exactly six
   *  entries, one per phase. */
  outcomes: readonly PhaseOutcome[];
}

/** Minimum phase wins for pass. */
export const REVERSE_TRIAL_PASS_THRESHOLD = 4;
/** Filed-buff Trial weight on charge + opening when failed. */
const FAIL_HUMAN_CONFESSION_WEIGHT = 0.75;

/**
 * Score a Reverse Trial submission. Pure / deterministic.
 *
 * Validation:
 *   - `outcomes` must contain exactly the six declared phases in
 *     canonical order.
 *   - Each `verdictDelta` must be finite.
 *   - Submissions that violate these constraints fail with a
 *     diagnostic `reason`.
 */
export function scoreReverseTrial(
  submission: ReverseTrialSubmission,
): MissionEvaluation {
  const validation = validate(submission);
  if (validation) {
    return {
      passed: false,
      reason: validation,
      // A malformed submission gets the same penalty as a normal
      // fail — the player's Trial weight drops on Charge + Opening.
      penalties: { humanConfessionWeight: FAIL_HUMAN_CONFESSION_WEIGHT },
    };
  }

  const wins = submission.outcomes.filter((o) => o.won).length;
  if (wins >= REVERSE_TRIAL_PASS_THRESHOLD) {
    return {
      passed: true,
      reason: `Won ${wins} of ${REVERSE_TRIAL_PHASES.length} trial phases.`,
      rewards: {
        filedBuff: true,
      },
    };
  }

  return {
    passed: false,
    reason: `Won only ${wins} of ${REVERSE_TRIAL_PHASES.length}; minimum is ${REVERSE_TRIAL_PASS_THRESHOLD}.`,
    penalties: { humanConfessionWeight: FAIL_HUMAN_CONFESSION_WEIGHT },
  };
}

function validate(submission: ReverseTrialSubmission): string | null {
  if (submission.outcomes.length !== REVERSE_TRIAL_PHASES.length) {
    return `Reverse Trial submission must contain ${REVERSE_TRIAL_PHASES.length} phase outcomes; got ${submission.outcomes.length}.`;
  }
  for (let i = 0; i < REVERSE_TRIAL_PHASES.length; i++) {
    const expected = REVERSE_TRIAL_PHASES[i];
    const got = submission.outcomes[i];
    if (got.phase !== expected) {
      return `Phase index ${i} must be "${expected}"; got "${got.phase}".`;
    }
    if (!Number.isFinite(got.verdictDelta)) {
      return `Phase "${got.phase}" verdictDelta must be finite.`;
    }
  }
  return null;
}
