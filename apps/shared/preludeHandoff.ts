/* ═══════════════════════════════════════════════════════
   PRELUDE → ACT 1 HANDOFF — runtime dispatcher predicate

   The Prelude's third crew mission (burnt card) raises:
     - prelude_mission_burnt_card_complete
     - prelude_burnt_card_found
     - prelude_complete

   After those fire, narrativeAct must move from 0 → 1 so
   ACT_TRIGGERS[0] (Act 1 "THE SIGNAL") can fire the next
   time the player steps into comms-relay.

   This module is the pure predicate. The runtime dispatcher
   — the effect that calls advanceNarrativeAct(1) when the
   predicate turns true — lives in
   `apps/client/src/hooks/useNarrativeIntegration.ts` and is
   mounted from `AppShellImmersive`. The earlier "NOT wired
   (ship-blocker)" roadmap note is resolved.
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
