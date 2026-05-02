/* ═══════════════════════════════════════════════════════
   ACT 6 COMPLETION GATE — "The Confession"

   Four conditions must hold (AND narrativeAct >= 6) for Act 6
   to complete:

     1. Opening cinematic played:
        `slideshow_act_6_confession_intro_complete`

     2. Elara's confession heard (Act6CardLadderPage sets this
        on the Woman She Was win):
        `act6_elara_confession_heard`

     3. The Human's confession heard (Act6CardLadderPage sets
        this on the Detective in the Wall win):
        `act6_human_confession_heard`

     4. At least one choice-wheel answer recorded — the §6 choice
        flags `act6_confession_close_*` cover the four stances
        (empathy / challenge / refusal / reluctant ally). Any one
        of them satisfies the gate; the canon is "choose a stance
        and live with it," not "sample every branch."

   When readyToFire the hook sets `act_6_complete` + `act_7_started`
   and advances narrativeAct to 7.

   Act 6 also requires the army recruitment threshold of 5+ per
   `RECRUITMENT_THRESHOLDS.act6` — but that's a TRIGGER gate (when
   can the player ENTER Act 6), not the completion gate. The
   trigger check lives in useNarrativeIntegration.ts and fires
   `act_6_started` when the threshold is crossed.
   ═══════════════════════════════════════════════════════ */

export const ACT_6_CONFESSION_STANCE_FLAGS = [
  "act6_confession_close_empathy",
  "act6_confession_close_challenge",
  "act6_confession_close_refusal",
  "act6_confession_close_reluctant_ally",
  "act6_confession_close_partial",
] as const;
export type Act6ConfessionStanceFlag =
  (typeof ACT_6_CONFESSION_STANCE_FLAGS)[number];

export type Act6CompletionRequiredFlag =
  | "slideshow_act_6_confession_intro_complete"
  | "act6_elara_confession_heard"
  | "act6_human_confession_heard";

export const ACT_6_COMPLETION_REQUIRED_FLAGS: readonly Act6CompletionRequiredFlag[] = [
  "slideshow_act_6_confession_intro_complete",
  "act6_elara_confession_heard",
  "act6_human_confession_heard",
] as const;

export interface Act6CompletionInput {
  narrativeAct: number | undefined;
  flags: Record<string, unknown> | undefined;
}

export interface Act6CompletionStatus {
  alreadyComplete: boolean;
  allConditionsMet: boolean;
  readyToFire: boolean;
  requiredFlagStatus: Record<Act6CompletionRequiredFlag, boolean>;
  requiredMet: number;
  stancesTaken: Act6ConfessionStanceFlag[];
  /** First stance flag raised (canonical order). */
  primaryStance: Act6ConfessionStanceFlag | null;
}

export function deriveAct6CompletionStatus(
  input: Act6CompletionInput,
): Act6CompletionStatus {
  const flags = input.flags ?? {};
  const alreadyComplete = Boolean(flags.act_6_complete);
  const inAct6 = (input.narrativeAct ?? 0) >= 6;

  const requiredFlagStatus = {
    slideshow_act_6_confession_intro_complete: Boolean(
      flags.slideshow_act_6_confession_intro_complete,
    ),
    act6_elara_confession_heard: Boolean(flags.act6_elara_confession_heard),
    act6_human_confession_heard: Boolean(flags.act6_human_confession_heard),
  } as Record<Act6CompletionRequiredFlag, boolean>;
  const requiredMet = ACT_6_COMPLETION_REQUIRED_FLAGS.reduce(
    (n, f) => n + (requiredFlagStatus[f] ? 1 : 0),
    0,
  );
  const allRequiredMet = requiredMet === ACT_6_COMPLETION_REQUIRED_FLAGS.length;

  const stancesTaken = ACT_6_CONFESSION_STANCE_FLAGS.filter((f) =>
    Boolean(flags[f]),
  );
  const primaryStance = stancesTaken[0] ?? null;
  const anyStanceTaken = stancesTaken.length > 0;

  const allConditionsMet = allRequiredMet && anyStanceTaken;
  const readyToFire = inAct6 && !alreadyComplete && allConditionsMet;

  return {
    alreadyComplete,
    allConditionsMet,
    readyToFire,
    requiredFlagStatus,
    requiredMet,
    stancesTaken,
    primaryStance,
  };
}

export function isAct6Complete(
  flags: Record<string, unknown> | undefined,
): boolean {
  return Boolean(flags?.act_6_complete);
}
