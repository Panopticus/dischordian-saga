/* ═══════════════════════════════════════════════════════
   ACT 2 COMPLETION GATE — §6.6 pure logic

   Four sub-flags must all be true (AND the player must be in
   narrativeAct >= 2) for Act 2 to complete. This module
   exposes that check as a pure function so it can be tested
   without mounting the React hook that drives it at runtime.

   The hook in useNarrativeIntegration.ts (around L1065)
   mirrors this shape — keep the two in sync. If a new sub-
   flag is added, update BOTH this module AND the hook.
   ═══════════════════════════════════════════════════════ */

export type Act2CompletionFlagName =
  | "crafting_mastered"
  | "chess_mastered"
  | "thaloria_cinematic_seen"
  | "game_master_loss";

export const ACT_2_COMPLETION_FLAGS: readonly Act2CompletionFlagName[] = [
  "crafting_mastered",
  "chess_mastered",
  "thaloria_cinematic_seen",
  "game_master_loss",
] as const;

export interface Act2CompletionInput {
  /** Current narrative act. Act 2 completion is gated on >= 2. */
  narrativeAct: number | undefined;
  /** Player's narrative flag set (the union of all fired flags). */
  flags: Record<string, unknown> | undefined;
}

export interface Act2CompletionStatus {
  /** Whether the player has already completed Act 2 (flag set). */
  alreadyComplete: boolean;
  /** Whether all four sub-flags are set (gate condition met). */
  allSubFlagsMet: boolean;
  /** Whether Act 2 is newly-completable on this tick (fire once!). */
  readyToFire: boolean;
  /** Per-flag true/false map for UI rendering and diagnostics. */
  subFlagStatus: Record<Act2CompletionFlagName, boolean>;
  /** Count of sub-flags met, 0-4. */
  subFlagsMet: number;
}

/** Evaluate whether Act 2 is complete (or ready to fire). Pure. */
export function deriveAct2CompletionStatus(
  input: Act2CompletionInput,
): Act2CompletionStatus {
  const flags = input.flags ?? {};
  const alreadyComplete = Boolean(flags.act_2_complete);
  const inAct2 = (input.narrativeAct ?? 0) >= 2;

  const subFlagStatus = {
    crafting_mastered: Boolean(flags.crafting_mastered),
    chess_mastered: Boolean(flags.chess_mastered),
    thaloria_cinematic_seen: Boolean(flags.thaloria_cinematic_seen),
    game_master_loss: Boolean(flags.game_master_loss),
  } as Record<Act2CompletionFlagName, boolean>;

  const subFlagsMet = ACT_2_COMPLETION_FLAGS.reduce(
    (n, flag) => n + (subFlagStatus[flag] ? 1 : 0),
    0,
  );
  const allSubFlagsMet = subFlagsMet === ACT_2_COMPLETION_FLAGS.length;
  const readyToFire = inAct2 && !alreadyComplete && allSubFlagsMet;

  return {
    alreadyComplete,
    allSubFlagsMet,
    readyToFire,
    subFlagStatus,
    subFlagsMet,
  };
}

/** Shorthand boolean helper used by the Witnessing Hub Act-2 panel. */
export function isAct2Complete(
  flags: Record<string, unknown> | undefined,
): boolean {
  return Boolean(flags?.act_2_complete);
}
