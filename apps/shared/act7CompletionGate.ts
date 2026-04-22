/* ═══════════════════════════════════════════════════════
   ACT 7 COMPLETION GATE — "The Convergence"

   Act 7 is the end of the narrative spine. Two conditions must
   hold (AND narrativeAct >= 7):

     1. Opening cinematic played:
        `slideshow_act_7_convergence_intro_complete`

     2. The Act 7 arc closes — Act7CardLadderPage sets
        `act7_arc_closes` + `act7_convergence_landing` when the
        final (Convergence Seat) opponent falls. The arc-closes
        flag is the canonical "spine complete" signal; we read
        that one as the gate.

   When readyToFire the hook sets `act_7_complete` and triggers
   prestige rollover. narrativeAct does NOT advance past 7 — the
   prestige cycle resets it back to the Prelude era at the next
   cycle's start.

   Act 7's TRIGGER is army recruitment >= 15
   (RECRUITMENT_THRESHOLDS.act7), enforced in the hook's trigger
   watcher when `act_6_complete` is true AND the recruitment
   count is over the threshold. That's separate from this
   completion gate.

   A final-stance flag is also useful for Act 7 reporting but
   is NOT required for completion — the player may close the
   arc without selecting a canonical stance (silence is itself
   a stance, per canon). The status object exposes the stance
   for UI rendering so downstream systems can react.
   ═══════════════════════════════════════════════════════ */

export const ACT_7_FINAL_STANCE_FLAGS = [
  "act7_s1_humanity_path",
  "act7_s1_machine_path",
  "act7_s1_balance",
  "act7_s1_soldier_command",
] as const;
export type Act7FinalStanceFlag =
  (typeof ACT_7_FINAL_STANCE_FLAGS)[number];

export type Act7CompletionRequiredFlag =
  | "slideshow_act_7_convergence_intro_complete"
  | "act7_arc_closes";

export const ACT_7_COMPLETION_REQUIRED_FLAGS: readonly Act7CompletionRequiredFlag[] = [
  "slideshow_act_7_convergence_intro_complete",
  "act7_arc_closes",
] as const;

export interface Act7CompletionInput {
  narrativeAct: number | undefined;
  flags: Record<string, unknown> | undefined;
}

export interface Act7CompletionStatus {
  alreadyComplete: boolean;
  allConditionsMet: boolean;
  readyToFire: boolean;
  requiredFlagStatus: Record<Act7CompletionRequiredFlag, boolean>;
  requiredMet: number;
  stancesTaken: Act7FinalStanceFlag[];
  /** First stance raised (canonical order). Null is valid — silence is a stance. */
  primaryStance: Act7FinalStanceFlag | null;
  stancesTakenCount: number;
}

export function deriveAct7CompletionStatus(
  input: Act7CompletionInput,
): Act7CompletionStatus {
  const flags = input.flags ?? {};
  const alreadyComplete = Boolean(flags.act_7_complete);
  const inAct7 = (input.narrativeAct ?? 0) >= 7;

  const requiredFlagStatus = {
    slideshow_act_7_convergence_intro_complete: Boolean(
      flags.slideshow_act_7_convergence_intro_complete,
    ),
    act7_arc_closes: Boolean(flags.act7_arc_closes),
  } as Record<Act7CompletionRequiredFlag, boolean>;
  const requiredMet = ACT_7_COMPLETION_REQUIRED_FLAGS.reduce(
    (n, f) => n + (requiredFlagStatus[f] ? 1 : 0),
    0,
  );
  const allRequiredMet = requiredMet === ACT_7_COMPLETION_REQUIRED_FLAGS.length;

  const stancesTaken = ACT_7_FINAL_STANCE_FLAGS.filter((f) =>
    Boolean(flags[f]),
  );
  const primaryStance = stancesTaken[0] ?? null;

  const allConditionsMet = allRequiredMet;
  const readyToFire = inAct7 && !alreadyComplete && allConditionsMet;

  return {
    alreadyComplete,
    allConditionsMet,
    readyToFire,
    requiredFlagStatus,
    requiredMet,
    stancesTaken,
    primaryStance,
    stancesTakenCount: stancesTaken.length,
  };
}

export function isAct7Complete(
  flags: Record<string, unknown> | undefined,
): boolean {
  return Boolean(flags?.act_7_complete);
}
