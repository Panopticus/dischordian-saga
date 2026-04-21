/**
 * useMindGame — orchestrate the mid-match mind-game overlay.
 *
 * The chess match page feeds this hook each completed move
 * (with its Stockfish eval delta) via `recordMove`. The hook
 * runs the trigger detector, and when a trigger fires it exposes
 * the matching cue via `activeCue`. The page renders
 * `<MindGameOverlay>` when `activeCue` is non-null.
 *
 * The player's choice is recorded to the server-side profile via
 * `trpc.playerProfile.recordMindGameChoice`, then the overlay is
 * dismissed after the reply has been shown.
 */
import { useCallback, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  evaluateMindGameTriggers,
  type EvalDeltaSample,
  type MindGameArchetype,
  type MindGameTriggerId,
} from "@shared/chessMindGameTriggers";
import {
  getMindGameCueForTrigger,
  type MindGameCue,
} from "@shared/tcg-core/story/chessMindGameCues";

export interface UseMindGameArgs {
  matchId: string;
  /** Current climb tier 0..3. Affects trigger eligibility. */
  climbTier?: number;
  /** True if we're between games of a climb best-of-3. */
  midClimbSeries?: boolean;
}

export function useMindGame({
  matchId,
  climbTier = 0,
  midClimbSeries = false,
}: UseMindGameArgs) {
  const firedRef = useRef<MindGameTriggerId[]>([]);
  const [activeCue, setActiveCue] = useState<MindGameCue | null>(null);
  const recordChoice = trpc.playerProfile.recordMindGameChoice.useMutation();

  /** Feed a completed move + eval sample. If a trigger fires,
   *  `activeCue` is set and the caller should render the overlay. */
  const recordMove = useCallback(
    (sample: EvalDeltaSample) => {
      if (activeCue) return; // don't re-trigger while overlay is up
      const trigger = evaluateMindGameTriggers({
        sample,
        alreadyFired: firedRef.current,
        climbTier,
        midClimbSeries,
      });
      if (!trigger) return;
      const cue = getMindGameCueForTrigger(trigger);
      if (!cue) return;
      firedRef.current = [...firedRef.current, trigger];
      setActiveCue(cue);
    },
    [activeCue, climbTier, midClimbSeries],
  );

  /** The overlay calls this when the player picks an archetype
   *  (or silent default fires). We record the choice, then
   *  dismiss after a short reply-reading window. */
  const handleChoice = useCallback(
    (archetype: MindGameArchetype) => {
      if (!activeCue) return;
      recordChoice.mutate({
        archetype,
        cueTrigger: activeCue.trigger,
        matchId,
      });
      // Let the overlay render the reply for a few seconds, then
      // clear — the MindGameOverlay component holds its own
      // internal state for reply display, so we just dismiss
      // after a delay.
      window.setTimeout(() => setActiveCue(null), 4500);
    },
    [activeCue, matchId, recordChoice],
  );

  /** Reset all trigger memory — call at the start of a new match. */
  const resetForNewMatch = useCallback(() => {
    firedRef.current = [];
    setActiveCue(null);
  }, []);

  return {
    activeCue,
    recordMove,
    handleChoice,
    resetForNewMatch,
  };
}
