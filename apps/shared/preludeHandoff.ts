/* ═══════════════════════════════════════════════════════
   PRELUDE → ACT 1 HANDOFF — the "ship-blocker" dispatcher

   Roadmap note (ALL_ACTS_ROADMAP.md, Prelude entry):
   "12/13 subsystems ready; 1 VO line pending; runtime
   handoff dispatcher NOT wired (ship-blocker)."

   The Prelude's third crew mission (burnt card) raises:
     - prelude_mission_burnt_card_complete
     - prelude_burnt_card_found
     - prelude_complete

   After those fire, the player needs narrativeAct to move
   from 0 → 1 so ACT_TRIGGERS[0] (Act 1 "THE SIGNAL") can
   trigger the next time they step into comms-relay.
   Nothing wired that transition, so Act 1 was unreachable
   from the Prelude.

   This module is the one-line predicate that the runtime
   hook reads. Pure; no React.
   ═══════════════════════════════════════════════════════ */

/** The narrative act the handoff advances into. */
export const PRELUDE_HANDOFF_TARGET_ACT = 1 as const;

/** Canonical flag the burnt-card mission raises when the Prelude wraps. */
export const PRELUDE_COMPLETE_FLAG = "prelude_complete" as const;

/**
 * True when the current state has completed the Prelude but
 * hasn't yet advanced into Act 1. The consumer (a React effect
 * or a button handler) calls advanceNarrativeAct(1) once this
 * returns true.
 *
 * Gating:
 *   - narrativeAct must be 0 (still in Prelude). We never
 *     regress from a later act.
 *   - prelude_complete flag must be set (the burnt-card mission
 *     is the canonical raiser).
 *
 * Idempotent: returns false as soon as narrativeAct has
 * advanced, so re-renders don't loop.
 */
export function shouldAdvanceToAct1OnPreludeComplete(input: {
  narrativeAct?: number | null;
  narrativeFlags?: Record<string, unknown> | null;
}): boolean {
  const act = input.narrativeAct ?? 0;
  if (act !== 0) return false;
  const flags = input.narrativeFlags ?? {};
  return Boolean(flags[PRELUDE_COMPLETE_FLAG]);
}
