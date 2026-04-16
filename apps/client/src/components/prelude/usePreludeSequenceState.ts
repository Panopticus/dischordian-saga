/**
 * usePreludeSequenceState — React hook wrapping preludeSequenceReducer.
 *
 * Keeps component code simple while the pure reducer is tested
 * separately in apps/server/preludeSequenceReducer.test.ts.
 */

import { useCallback, useMemo, useReducer } from "react";
import {
  PRELUDE_BEATS,
  type PreludeBeatId,
} from "../../../../shared/preludeSequence";
import {
  initialPreludeSequenceState,
  preludeSequenceReducer,
  type PreludeAlignmentChoice,
  type SequencePhase,
} from "./preludeSequenceReducer";

export type { PreludeAlignmentChoice, SequencePhase };

export interface UsePreludeSequenceStateOptions {
  /** Beat to start on. Defaults to the first beat (index 0). */
  startingBeatId?: PreludeBeatId;
}

export function usePreludeSequenceState(
  options: UsePreludeSequenceStateOptions = {},
) {
  const { startingBeatId } = options;

  const [state, dispatch] = useReducer(
    preludeSequenceReducer,
    startingBeatId,
    initialPreludeSequenceState,
  );

  const cutsceneEnded = useCallback(() => {
    dispatch({ type: "cutscene_ended" });
  }, []);

  const skipCutscene = useCallback(() => {
    dispatch({ type: "skip_cutscene" });
  }, []);

  const advance = useCallback(() => {
    dispatch({ type: "advance" });
  }, []);

  const interactionComplete = useCallback(
    (payload?: { alignment?: PreludeAlignmentChoice }) => {
      dispatch({ type: "interaction_complete", payload });
    },
    [],
  );

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  const beat = PRELUDE_BEATS[state.beatIndex];

  return useMemo(
    () => ({
      beat,
      beatIndex: state.beatIndex,
      totalBeats: PRELUDE_BEATS.length,
      phase: state.phase,
      completedFlags: state.completedFlags,
      alignment: state.alignment,
      isDone: state.phase === "done",
      cutsceneEnded,
      skipCutscene,
      advance,
      interactionComplete,
      reset,
    }),
    [
      beat,
      state.beatIndex,
      state.phase,
      state.completedFlags,
      state.alignment,
      cutsceneEnded,
      skipCutscene,
      advance,
      interactionComplete,
      reset,
    ],
  );
}
