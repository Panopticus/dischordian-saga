/* ═══════════════════════════════════════════════════════
   BREAKING-POINT FLAG COMMIT — pure resolution helper

   `apps/shared/breakingPoint.ts:resolveBreakingPoint(choice)`
   returns the canonical outcome (companion lost, morality shift,
   the array of `breaking_point_*` flags to stamp on save state).
   The client component(s) that render the Breaking Point choice
   UI (a follow-up; the cutscene scaffold today is video-only)
   need a small pure helper that walks the resolver's `.flags`
   array and applies them via setNarrativeFlag — keeping the
   commit logic testable without a DOM and without coupling the
   resolver to React.

   Phase-8 dependency: the human-reveal variant resolver
   (`apps/shared/humanRevealVariants.ts:deriveHumanRevealBranch`)
   reads `breaking_point_chose_*` flags. Until something commits
   them on the client, those variants can never fire. This helper
   is the contract for whoever builds the choice UI next.
   ═══════════════════════════════════════════════════════ */

import {
  resolveBreakingPoint,
  type BreakingPointChoice,
  type BreakingPointOutcome,
} from "./breakingPoint";

export interface BreakingPointCommitResult {
  /** The resolver's outcome — re-exported for the caller's
   *  convenience (morality shift, trust overrides, etc. need
   *  applying separately by the GameContext caller). */
  outcome: BreakingPointOutcome;
  /** Ordered list of (flag, value) tuples the caller should set.
   *  Iteration order matches outcome.flags so the trace stays
   *  readable in the audit log. */
  flagsToSet: ReadonlyArray<readonly [string, true]>;
}

/** Pure: given a choice, return the outcome + the exact list of
 *  flag-set operations the caller should apply. */
export function commitBreakingPointChoice(
  choice: BreakingPointChoice,
): BreakingPointCommitResult {
  const outcome = resolveBreakingPoint(choice);
  const flagsToSet = outcome.flags.map(
    (flag) => [flag, true] as const,
  );
  return { outcome, flagsToSet };
}

/** Convenience wrapper for callers in React land: resolve the
 *  choice and walk the flag list, calling `setNarrativeFlag`
 *  for each. Returns the outcome so the caller can then apply
 *  morality / trust deltas separately.
 *
 *  Usage (inside a choice handler):
 *    const outcome = applyBreakingPointChoice(choice, setNarrativeFlag);
 *    shiftMorality(outcome.moralityShift);
 *    if (outcome.elaraTrustOverride !== undefined) setElaraTrust(...);
 */
export function applyBreakingPointChoice(
  choice: BreakingPointChoice,
  setNarrativeFlag: (flag: string, value: boolean) => void,
): BreakingPointOutcome {
  const { outcome, flagsToSet } = commitBreakingPointChoice(choice);
  for (const [flag, value] of flagsToSet) {
    setNarrativeFlag(flag, value);
  }
  return outcome;
}
