/* ═══════════════════════════════════════════════════════
   useGameMastersIntervention

   Wraps engagement.gameMasters.* tRPC procedures into a
   single hook the Apprentice (Celebration) page can mount.
   Per-apprentice state: redeemed days + held boons.

   Unlike the other engagement hooks (Vex, Lyra Vox, Engineer)
   which auto-fire when their trigger conditions advance, this
   one is **player-initiated**: the cult does not impose itself.
   The page checks eligibility, surfaces a button on canonical
   sanctuary days (7/14/21/28) when the apprentice is in
   jeopardy, and the player chooses to invoke.

   Returns:
     • `eligibility` — current eligibility query (live)
     • `apprentice` — per-apprentice intervention state (live)
     • `invoke()` — call to fire the intervention
     • `current` — the result of the most recent invocation
                   (queued FIFO; pop with `dismiss`)
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";
import { trpc } from "@/lib/trpc";
import type {
  Intervention,
  GameMasterSpeaker,
} from "@shared/gameMastersTrialIntervention";

export interface InvocationEvent {
  intervention: Intervention;
  bondAfter: number;
  missedDaysAfter: number;
  /** The line spoken at this moment (Left/Right/cult formatting). */
  line: string;
  /** Convenience: who spoke. */
  speaker: GameMasterSpeaker;
}

export interface UseGameMastersInterventionInput {
  apprenticeId: string;
  trialDay: number;
  bond: number;
  missedDays: number;
  enabled?: boolean;
}

export interface UseGameMastersInterventionResult {
  /** Eligibility for the current trialDay/bond/missedDays. Re-fetches
   *  when any of those values change. */
  eligible: boolean;
  /** When ineligible, the reason code from the shared module. */
  reason: string | null;
  /** Per-apprentice state — which days are redeemed, which boons held. */
  redeemedDays: ReadonlyArray<number>;
  heldBoonDays: ReadonlyArray<number>;
  /** True while invoke() is in flight. */
  invoking: boolean;
  /** Fire the intervention. No-op if not eligible. */
  invoke: () => void;
  /** The next un-dismissed invocation result. */
  current: InvocationEvent | null;
  /** Pop the front of the queue. */
  dismiss: () => void;
}

export function useGameMastersIntervention(
  input: UseGameMastersInterventionInput,
): UseGameMastersInterventionResult {
  const enabled = input.enabled ?? true;
  const utils = trpc.useUtils();
  const [queue, setQueue] = useState<InvocationEvent[]>([]);

  const apprenticeQuery = trpc.engagement.gameMasters.getApprentice.useQuery(
    { apprenticeId: input.apprenticeId },
    { enabled: enabled && !!input.apprenticeId },
  );

  const eligibilityQuery = trpc.engagement.gameMasters.checkEligibility.useQuery(
    {
      apprenticeId: input.apprenticeId,
      trialDay: input.trialDay,
      bond: input.bond,
      missedDays: input.missedDays,
    },
    { enabled: enabled && !!input.apprenticeId },
  );

  const invokeMutation = trpc.engagement.gameMasters.invoke.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setQueue(prev => [
          ...prev,
          {
            intervention: data.intervention,
            bondAfter: data.bondAfter,
            missedDaysAfter: data.missedDaysAfter,
            line: data.line,
            speaker: data.intervention.speaker,
          },
        ]);
        // Refresh per-apprentice + eligibility.
        void utils.engagement.gameMasters.getApprentice.invalidate({
          apprenticeId: input.apprenticeId,
        });
        void utils.engagement.gameMasters.checkEligibility.invalidate();
      }
    },
  });

  const invoke = useCallback(() => {
    if (!enabled) return;
    invokeMutation.mutate({
      apprenticeId: input.apprenticeId,
      trialDay: input.trialDay,
      bond: input.bond,
      missedDays: input.missedDays,
    });
    // Inputs intentionally captured at call time; mutation deps omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, input.apprenticeId, input.trialDay, input.bond, input.missedDays]);

  const dismiss = useCallback(() => {
    setQueue(prev => (prev.length === 0 ? prev : prev.slice(1)));
  }, []);

  const eligibility = eligibilityQuery.data;
  const ap = apprenticeQuery.data;

  return {
    eligible: !!eligibility?.eligible,
    reason:
      eligibility && !eligibility.eligible ? eligibility.reason : null,
    redeemedDays: ap?.redeemedDays ?? [],
    heldBoonDays: ap?.heldBoonDays ?? [],
    invoking: invokeMutation.isPending,
    invoke,
    current: queue.length > 0 ? queue[0] : null,
    dismiss,
  };
}
