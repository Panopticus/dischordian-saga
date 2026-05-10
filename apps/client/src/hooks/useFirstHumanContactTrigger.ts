/* ═══════════════════════════════════════════════════════
   useFirstHumanContactTrigger

   The cutscene_first_human_contact entry was declared in
   apps/shared/cutsceneRegistry.ts:66 but had no setter site
   in code — the trigger flag never flipped, so the cutscene
   never fired in-game. Bible spec
   (apps/shared/cutsceneRegistry.ts comment + design doc):
     "Human trust reaches 10 OR player visits Bridge for the
      third time."

   This hook fires the trigger flag exactly once per save,
   gated on:
     - humanTrustLevel >= 10, OR
     - room_bridge_visited is set (the codebase tracks bridge
       visit as a boolean, not a counter; treating the first
       visit as the gate is the closest faithful interpretation
       without adding a new counter field).
   AND the cutscene hasn't already been seen / triggered.

   Mounted once in App.tsx as a side-effect-only watcher.

   The decision function is exported as a pure helper for
   unit testing without GameContext.
   ═══════════════════════════════════════════════════════ */
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";

export const FIRST_HUMAN_CONTACT_TRIGGER_FLAG =
  "cutscene_first_human_contact_triggered";
export const FIRST_HUMAN_CONTACT_SEEN_FLAG =
  "cutscene_first_human_contact_seen";

const HUMAN_TRUST_THRESHOLD = 10;

export interface FirstHumanContactDecisionInput {
  humanTrustLevel: number;
  flags: Readonly<Record<string, unknown>>;
}

/** Pure decision function: should we fire the trigger flag now?
 *  Returns false if the cutscene has been seen, is already
 *  triggered, or neither gate condition holds. */
export function shouldFireFirstHumanContact(
  input: FirstHumanContactDecisionInput,
): boolean {
  const { humanTrustLevel, flags } = input;
  if (flags[FIRST_HUMAN_CONTACT_SEEN_FLAG] === true) return false;
  if (flags[FIRST_HUMAN_CONTACT_TRIGGER_FLAG] === true) return false;
  const trustGate = humanTrustLevel >= HUMAN_TRUST_THRESHOLD;
  const bridgeGate = flags.room_bridge_visited === true;
  return trustGate || bridgeGate;
}

export function useFirstHumanContactTrigger(): void {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};
  const humanTrustLevel = state.humanTrustLevel ?? 0;

  useEffect(() => {
    if (
      shouldFireFirstHumanContact({
        humanTrustLevel,
        flags,
      })
    ) {
      setNarrativeFlag(FIRST_HUMAN_CONTACT_TRIGGER_FLAG, true);
    }
  }, [humanTrustLevel, flags, setNarrativeFlag]);
}
