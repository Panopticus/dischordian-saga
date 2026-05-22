/* ═══════════════════════════════════════════════════════
   SALVAGE — Mission 1 (Week 1)
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3 mission detail

   The player drafts 5 burnt cards from the 20-entry roster
   and plays 5 micro-matches (one per drafted card). Each
   micro-match: 3 turns, must play the burnt card by turn 3
   to "recover" it. The player walks out with the recovered
   cards added to the Witness Hand.

   Pass:    recover ≥3 of 5 drafted cards
   Reward:  +recovered.length to Witness Hand size,
            recoveredBurntCardIds appended
            (ballot vote bias 1.5× applies at Trial time)
   Penalty: -2 Witness Hand size (baseline 5 → 3)

   This module is the *scorer* — a pure function that takes
   the submission and produces a MissionEvaluation. The
   Salvage UI (deferred — out of Sprint 6 scope) calls into
   the tRPC submit endpoint which dispatches here.
   ═══════════════════════════════════════════════════════ */

import { findBurntCard } from "../burntCardRoster";
import type { MissionEvaluation } from "../registry";

/** What the player submits at the end of Salvage. */
export interface SalvageSubmission {
  /** The 5 NPC keys drafted at the start of the mission. */
  drafted: readonly string[];
  /** The subset of `drafted` the player successfully played by turn 3
   *  in their micro-matches. */
  recovered: readonly string[];
}

/** Minimum recoveries required to pass. */
export const SALVAGE_PASS_THRESHOLD = 3;
/** How many cards must be drafted (the player's pool size). */
export const SALVAGE_DRAFT_SIZE = 5;
/** Penalty applied to Witness Hand on fail (replaces baseline). */
const FAIL_WITNESS_HAND_SIZE = 3;

/**
 * Score a Salvage submission. Pure / deterministic. Returns a
 * MissionEvaluation the service applies via resolveMission().
 *
 * Validation:
 *   - `drafted` must contain exactly SALVAGE_DRAFT_SIZE entries,
 *     all distinct, all valid burnt-card NPC keys.
 *   - `recovered` must be a subset of `drafted`.
 *   - Submissions that violate these constraints are treated as
 *     failures rather than throwing — the scorer is the source of
 *     truth for the verdict, so a malformed submission fails the
 *     mission with a diagnostic `reason`.
 */
export function scoreSalvage(submission: SalvageSubmission): MissionEvaluation {
  const validation = validate(submission);
  if (validation) {
    return {
      passed: false,
      reason: validation,
      penalties: { witnessHandSize: FAIL_WITNESS_HAND_SIZE },
    };
  }

  const recovered = submission.recovered;
  if (recovered.length >= SALVAGE_PASS_THRESHOLD) {
    return {
      passed: true,
      reason: `Recovered ${recovered.length} of ${SALVAGE_DRAFT_SIZE} burnt cards.`,
      rewards: {
        witnessHandSize: recovered.length,
        recoveredBurntCardIds: recovered,
      },
    };
  }

  return {
    passed: false,
    reason: `Recovered only ${recovered.length} of ${SALVAGE_DRAFT_SIZE}; minimum is ${SALVAGE_PASS_THRESHOLD}.`,
    penalties: { witnessHandSize: FAIL_WITNESS_HAND_SIZE },
  };
}

function validate(submission: SalvageSubmission): string | null {
  if (submission.drafted.length !== SALVAGE_DRAFT_SIZE) {
    return `Salvage draft must contain exactly ${SALVAGE_DRAFT_SIZE} cards; got ${submission.drafted.length}.`;
  }
  if (new Set(submission.drafted).size !== SALVAGE_DRAFT_SIZE) {
    return "Salvage draft must contain distinct cards.";
  }
  for (const key of submission.drafted) {
    if (!findBurntCard(key)) {
      return `Unknown burnt card "${key}" in draft.`;
    }
  }
  const draftedSet = new Set(submission.drafted);
  for (const key of submission.recovered) {
    if (!draftedSet.has(key)) {
      return `Recovered card "${key}" is not in the player's draft.`;
    }
  }
  if (new Set(submission.recovered).size !== submission.recovered.length) {
    return "Recovered list contains duplicates.";
  }
  return null;
}
