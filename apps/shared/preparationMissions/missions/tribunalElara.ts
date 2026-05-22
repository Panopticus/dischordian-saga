/* ═══════════════════════════════════════════════════════
   TRIBUNAL: ELARA — Mission 3 (Week 3)
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3 mission detail

   A 3-phase Authority Trial (compressed) where Elara is
   the defendant, the substrate is the prosecutor, and the
   player officiates. The player's choice of which evidence
   to admit at each phase is the mechanical hinge.

   Romance gate: relationship ≥75 unlocks a 4th phase where
   Elara cross-examines herself — narratively significant,
   not scored differently.

   Pass:   verdict-delta ends in "redeemed" or
           "guilty but accepted" range
   Reward: elaraConfessionVisibility = true (the player can
           see the live Elara-tally during the Trial's
           Confession phase)
   Penalty: elaraConfessionVisibility stays false; per the
           plan, Elara also doesn't appear at the Confession-
           phase ceremony, but that's a Sprint-9 surface
           gated on this flag.

   Pure scorer. The Tribunal UI (deferred) submits the final
   verdict-delta and optional romance flag; this scorer
   resolves the mission evaluation.
   ═══════════════════════════════════════════════════════ */

import type { MissionEvaluation } from "../registry";

/**
 * Outcome shape:
 *   - "redeemed"          — verdict-delta strongly positive; Elara is
 *                           absolved by her own substrate-record.
 *   - "guilty_but_accepted" — verdict-delta strongly negative; Elara
 *                           accepts her past as Senator without dodging.
 *   - "split"             — verdict-delta near zero; neither outcome
 *                           lands. Failure.
 *
 * Both pass outcomes are canonically valid — the plan calls this out:
 * "Either is canonically valid; the player chooses Elara's relationship
 * to her own past."
 */
export type TribunalOutcome = "redeemed" | "guilty_but_accepted" | "split";

export interface TribunalSubmission {
  /** Signed verdict-delta at end of the final phase. Higher = more
   *  redeemed; lower = more guilty. */
  verdictDelta: number;
  /** True iff the romance gate was open at mission start (relationship
   *  ≥75). Surfaces in the narrative summary; does not change the
   *  scoring rule. */
  romanceGateUnlocked: boolean;
  /** True iff the player actually completed the 4th phase (the
   *  romance-gate self-cross-examination). Only meaningful when
   *  romanceGateUnlocked. */
  romancePhaseCompleted?: boolean;
}

/** Threshold below which a delta counts as "split" (fail). The plan's
 *  "redeemed or guilty but accepted" framing is *commitment-required*
 *  — a near-zero delta means the player didn't admit enough decisive
 *  evidence. */
export const TRIBUNAL_COMMITMENT_THRESHOLD = 3;

/**
 * Classify a verdict-delta into an outcome. Pure.
 */
export function classifyTribunalOutcome(verdictDelta: number): TribunalOutcome {
  if (verdictDelta >= TRIBUNAL_COMMITMENT_THRESHOLD) return "redeemed";
  if (verdictDelta <= -TRIBUNAL_COMMITMENT_THRESHOLD) return "guilty_but_accepted";
  return "split";
}

/**
 * Score a Tribunal: Elara submission. Pure / deterministic.
 *
 * Validation:
 *   - verdictDelta must be finite.
 *   - romancePhaseCompleted may only be true if romanceGateUnlocked.
 */
export function scoreTribunalElara(
  submission: TribunalSubmission,
): MissionEvaluation {
  const validation = validate(submission);
  if (validation) {
    return {
      passed: false,
      reason: validation,
      // Failure penalty: visibility stays off. Service applies a
      // boolean-replace; passing `false` here is explicit.
      penalties: { elaraConfessionVisibility: false },
    };
  }

  const outcome = classifyTribunalOutcome(submission.verdictDelta);
  if (outcome === "split") {
    return {
      passed: false,
      reason: "Tribunal closed with a split verdict — Elara was neither redeemed nor accepted.",
      penalties: { elaraConfessionVisibility: false },
    };
  }

  const baseReason =
    outcome === "redeemed"
      ? "Elara was redeemed by her own substrate-record."
      : "Elara accepted her past as Senator without dodging.";

  const romanceTag =
    submission.romanceGateUnlocked && submission.romancePhaseCompleted
      ? " The fourth phase landed."
      : "";

  return {
    passed: true,
    reason: baseReason + romanceTag,
    rewards: {
      elaraConfessionVisibility: true,
    },
  };
}

function validate(submission: TribunalSubmission): string | null {
  if (!Number.isFinite(submission.verdictDelta)) {
    return "Tribunal verdictDelta must be finite.";
  }
  if (
    submission.romancePhaseCompleted &&
    !submission.romanceGateUnlocked
  ) {
    return "Romance phase cannot be completed when the romance gate was not unlocked.";
  }
  return null;
}
