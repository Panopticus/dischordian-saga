/* ═══════════════════════════════════════════════════════
   ACT 4.5 COMPLETION GATE — §10 "Dead Man's Circuit"

   Act 4.5 is a sibling track to Act 5 — the player can pursue
   both in parallel, or skip 4.5 entirely. Completing 4.5 raises
   `act_4_5_complete` and grants the identity-chain trophy wall,
   but does NOT auto-advance narrativeAct (Act 5 remains the
   sequential successor).

   Two conditions must hold (AND narrativeAct >= 4) for the gate
   to fire:

     1. Opening cinematic played:
        `slideshow_act_4_5_intro_complete`

     2. Either track resolved (canon is "pick one and see it
        through"; both optional):
          - `act_4_5_circuit_complete`   (Dead Man's Circuit racing)
          - `act_4_5_casino_complete`    (The Degen Casino)

   The gate does NOT require both tracks — the canon says 4.5 is
   a wager-your-identity arc where the player names the wager and
   pays it once.

   See DEAD_MANS_CIRCUIT_TRACKS in actsFourFiveShells.ts for the
   authored thesis / identity-bet / completedFlag per track.
   ═══════════════════════════════════════════════════════ */

export type Act4_5TrackFlag =
  | "act_4_5_circuit_complete"
  | "act_4_5_casino_complete";

export const ACT_4_5_TRACK_FLAGS: readonly Act4_5TrackFlag[] = [
  "act_4_5_circuit_complete",
  "act_4_5_casino_complete",
] as const;

export type Act4_5CompletionRequiredFlag = "slideshow_act_4_5_intro_complete";

export const ACT_4_5_COMPLETION_REQUIRED_FLAGS: readonly Act4_5CompletionRequiredFlag[] = [
  "slideshow_act_4_5_intro_complete",
] as const;

export interface Act4_5CompletionInput {
  narrativeAct: number | undefined;
  flags: Record<string, unknown> | undefined;
}

export interface Act4_5CompletionStatus {
  alreadyComplete: boolean;
  allConditionsMet: boolean;
  readyToFire: boolean;
  requiredFlagStatus: Record<Act4_5CompletionRequiredFlag, boolean>;
  tracksCompleted: Act4_5TrackFlag[];
  /** First track completed (canonical order). */
  primaryTrack: Act4_5TrackFlag | null;
  tracksCompletedCount: number;
}

export function deriveAct4_5CompletionStatus(
  input: Act4_5CompletionInput,
): Act4_5CompletionStatus {
  const flags = input.flags ?? {};
  const alreadyComplete = Boolean(flags.act_4_5_complete);
  const inAct4Plus = (input.narrativeAct ?? 0) >= 4;

  const requiredFlagStatus = {
    slideshow_act_4_5_intro_complete: Boolean(
      flags.slideshow_act_4_5_intro_complete,
    ),
  } as Record<Act4_5CompletionRequiredFlag, boolean>;
  const allRequiredMet = ACT_4_5_COMPLETION_REQUIRED_FLAGS.every(
    (f) => requiredFlagStatus[f],
  );

  const tracksCompleted = ACT_4_5_TRACK_FLAGS.filter((f) => Boolean(flags[f]));
  const primaryTrack = tracksCompleted[0] ?? null;
  const anyTrackCompleted = tracksCompleted.length > 0;

  const allConditionsMet = allRequiredMet && anyTrackCompleted;
  const readyToFire = inAct4Plus && !alreadyComplete && allConditionsMet;

  return {
    alreadyComplete,
    allConditionsMet,
    readyToFire,
    requiredFlagStatus,
    tracksCompleted,
    primaryTrack,
    tracksCompletedCount: tracksCompleted.length,
  };
}

export function isAct4_5Complete(
  flags: Record<string, unknown> | undefined,
): boolean {
  return Boolean(flags?.act_4_5_complete);
}
