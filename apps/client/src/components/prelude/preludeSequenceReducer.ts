/* ═══════════════════════════════════════════════════════
   preludeSequenceReducer — Pure finite-state machine for
   the Prelude's 15-beat playthrough.

   Extracted as a reducer so the state transitions can be
   unit-tested without React DOM / @testing-library.

   The React hook (usePreludeSequenceState) is a thin wrapper
   around useReducer with this function.
   ═══════════════════════════════════════════════════════ */

import {
  PRELUDE_BEATS,
  type PreludeBeat,
  type PreludeBeatId,
} from "../../../../shared/preludeSequence";

export type SequencePhase = "cutscene" | "completed" | "done";

export type PreludeAlignmentChoice = "light" | "dark";

export interface PreludeSequenceState {
  beatIndex: number;
  phase: SequencePhase;
  completedFlags: readonly string[];
  alignment: PreludeAlignmentChoice | null;
}

export type PreludeSequenceAction =
  | { type: "cutscene_ended" }
  | { type: "skip_cutscene" }
  | { type: "advance" }
  | {
      type: "interaction_complete";
      payload?: { alignment?: PreludeAlignmentChoice };
    }
  | { type: "reset"; startingBeatIndex?: number };

/**
 * Beats that hold at `phase=completed` after their cutscene ends,
 * waiting on a post-cutscene interaction to fire `interaction_complete`.
 *
 * - beat_d → BeatDMissionBoard (click the 3 mission slates, read at
 *            least one to continue)
 * - beat_e → BeatEFlashback (click hotspots, hear Prince hologram VO)
 * - beat_h → BeatHInbox (click envelope, listen to Locke's first
 *            transmission, close message to continue)
 * - beat_j → LastWordsWitnessing (slideshow + song + Light/Dark choice)
 *
 * Every other beat auto-advances on cutscene end.
 */
export function beatHasInteraction(beat: PreludeBeat): boolean {
  return (
    beat.id === "beat_d" ||
    beat.id === "beat_e" ||
    beat.id === "beat_h" ||
    beat.id === "beat_j"
  );
}

/** Find the index of a beat by id; returns 0 if unknown. */
export function beatIndexFromId(id: PreludeBeatId | undefined): number {
  if (!id) return 0;
  const idx = PRELUDE_BEATS.findIndex((b: PreludeBeat) => b.id === id);
  return idx >= 0 ? idx : 0;
}

/** Initial state for a fresh run. */
export function initialPreludeSequenceState(
  startingBeatId?: PreludeBeatId,
): PreludeSequenceState {
  return {
    beatIndex: beatIndexFromId(startingBeatId),
    phase: "cutscene",
    completedFlags: [],
    alignment: null,
  };
}

/** Add a flag to completedFlags only if it's not already present. */
function recordFlag(flags: readonly string[], flag: string | undefined) {
  if (!flag || flags.includes(flag)) return flags;
  return [...flags, flag];
}

export function preludeSequenceReducer(
  state: PreludeSequenceState,
  action: PreludeSequenceAction,
): PreludeSequenceState {
  const beat = PRELUDE_BEATS[state.beatIndex];
  const isLastBeat = state.beatIndex >= PRELUDE_BEATS.length - 1;

  switch (action.type) {
    case "cutscene_ended":
    case "skip_cutscene": {
      // If already completed (double-fire) or past done, no-op
      if (state.phase !== "cutscene") return state;
      const newFlags = recordFlag(state.completedFlags, beat.completionFlag);

      // Beat J holds for interaction; every other beat auto-advances to next
      if (beatHasInteraction(beat)) {
        return {
          ...state,
          phase: "completed",
          completedFlags: newFlags,
        };
      }

      if (isLastBeat) {
        return {
          ...state,
          phase: "done",
          completedFlags: newFlags,
        };
      }

      return {
        ...state,
        beatIndex: state.beatIndex + 1,
        phase: "cutscene",
        completedFlags: newFlags,
      };
    }

    case "advance": {
      if (isLastBeat) {
        return { ...state, phase: "done" };
      }
      return {
        ...state,
        beatIndex: state.beatIndex + 1,
        phase: "cutscene",
      };
    }

    case "interaction_complete": {
      const newFlags = recordFlag(state.completedFlags, beat.completionFlag);
      const newAlignment =
        action.payload?.alignment ?? state.alignment;
      if (isLastBeat) {
        return {
          ...state,
          phase: "done",
          completedFlags: newFlags,
          alignment: newAlignment,
        };
      }
      return {
        ...state,
        beatIndex: state.beatIndex + 1,
        phase: "cutscene",
        completedFlags: newFlags,
        alignment: newAlignment,
      };
    }

    case "reset": {
      const idx =
        action.startingBeatIndex !== undefined
          ? Math.max(0, Math.min(action.startingBeatIndex, PRELUDE_BEATS.length - 1))
          : 0;
      return {
        beatIndex: idx,
        phase: "cutscene",
        completedFlags: [],
        alignment: null,
      };
    }

    default:
      return state;
  }
}
