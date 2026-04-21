/* ═══════════════════════════════════════════════════════
   ACT 3 COMPLETION GATE — §7 pure logic

   Three sub-conditions must all hold for Act 3 to complete
   (AND the player must be in narrativeAct >= 3):

     1. `slideshow_i_am_the_eyes_that_watch_complete`
        — the Act 3 opening cinematic (authored in
        songSlideshows.ts, fired via SLIDESHOW_TRIGGERS when
        `act_3_starting` rises).

     2. `act3_kael_logs_unlocked`
        — all three substrate opponents on the Act 3 Card
        Ladder have been defeated (written by
        Act3CardLadderPage on the Warden win).

     3. Any ONE of the three infiltration-path endings:
          - `act3_insurgency_ending`
          - `act3_empire_ending`
          - `act3_hierarchy_ending`
        The canon says the player picks ONE path and sees
        it through to its ending. Completing another path
        is possible but not required.

   When all three conditions are met the hook in
   useNarrativeIntegration.ts fires `act_3_complete`,
   advances `narrativeAct` to 4, and raises `act_4_started`
   for the Act 4 opener.

   Mirror of apps/shared/act2CompletionGate.ts. Any new
   sub-condition added here MUST also update the hook.
   ═══════════════════════════════════════════════════════ */

/** The three paths the player can pick. At least one
 *  must reach its ending for Act 3 to complete. */
export const ACT_3_INFILTRATION_ENDING_FLAGS = [
  "act3_insurgency_ending",
  "act3_empire_ending",
  "act3_hierarchy_ending",
] as const;

export type Act3InfiltrationEndingFlag =
  (typeof ACT_3_INFILTRATION_ENDING_FLAGS)[number];

/** Non-path required sub-flags. */
export type Act3CompletionRequiredFlag =
  | "slideshow_i_am_the_eyes_that_watch_complete"
  | "act3_kael_logs_unlocked";

export const ACT_3_COMPLETION_REQUIRED_FLAGS: readonly Act3CompletionRequiredFlag[] = [
  "slideshow_i_am_the_eyes_that_watch_complete",
  "act3_kael_logs_unlocked",
] as const;

export interface Act3CompletionInput {
  /** Current narrative act. Act 3 completion is gated on >= 3. */
  narrativeAct: number | undefined;
  /** Player's narrative flag set. */
  flags: Record<string, unknown> | undefined;
}

export interface Act3CompletionStatus {
  /** Whether act_3_complete is already set. */
  alreadyComplete: boolean;
  /** Whether every required flag + one ending flag is true. */
  allConditionsMet: boolean;
  /** Whether Act 3 can fire on this tick (guards against re-firing). */
  readyToFire: boolean;
  /** Per-required-flag status. */
  requiredFlagStatus: Record<Act3CompletionRequiredFlag, boolean>;
  /** Which ending flags are raised (can be 0, 1, 2, or 3). */
  endingFlagsRaised: Act3InfiltrationEndingFlag[];
  /** Count of required flags met, 0..ACT_3_COMPLETION_REQUIRED_FLAGS.length. */
  requiredMet: number;
  /** The ending the player took — the first raised ending flag, or null. */
  primaryEnding: Act3InfiltrationEndingFlag | null;
}

/** Evaluate whether Act 3 is complete (or ready to fire). Pure. */
export function deriveAct3CompletionStatus(
  input: Act3CompletionInput,
): Act3CompletionStatus {
  const flags = input.flags ?? {};
  const alreadyComplete = Boolean(flags.act_3_complete);
  const inAct3 = (input.narrativeAct ?? 0) >= 3;

  const requiredFlagStatus = {
    slideshow_i_am_the_eyes_that_watch_complete: Boolean(
      flags.slideshow_i_am_the_eyes_that_watch_complete,
    ),
    act3_kael_logs_unlocked: Boolean(flags.act3_kael_logs_unlocked),
  } as Record<Act3CompletionRequiredFlag, boolean>;

  const requiredMet = ACT_3_COMPLETION_REQUIRED_FLAGS.reduce(
    (n, flag) => n + (requiredFlagStatus[flag] ? 1 : 0),
    0,
  );
  const allRequiredMet = requiredMet === ACT_3_COMPLETION_REQUIRED_FLAGS.length;

  const endingFlagsRaised = ACT_3_INFILTRATION_ENDING_FLAGS.filter((f) =>
    Boolean(flags[f]),
  );
  const primaryEnding = endingFlagsRaised[0] ?? null;
  const anyEndingRaised = endingFlagsRaised.length > 0;

  const allConditionsMet = allRequiredMet && anyEndingRaised;
  const readyToFire = inAct3 && !alreadyComplete && allConditionsMet;

  return {
    alreadyComplete,
    allConditionsMet,
    readyToFire,
    requiredFlagStatus,
    endingFlagsRaised,
    requiredMet,
    primaryEnding,
  };
}

/** Shorthand boolean helper for UI rendering. */
export function isAct3Complete(
  flags: Record<string, unknown> | undefined,
): boolean {
  return Boolean(flags?.act_3_complete);
}
