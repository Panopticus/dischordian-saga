/**
 * PreludeSequencePlayerConnected — GameContext-aware wrapper.
 *
 * Thin bridge that consumes the Prelude playhead state from
 * GameContext and spreads it onto <PreludeSequencePlayer/>. Keeps
 * the base component pure (and testable without a provider) while
 * giving callers a single drop-in component for save/resume.
 *
 * Behavior:
 *   - Reads `currentPreludeBeat` from GameContext on mount and
 *     passes it as startingBeatId — returning players resume at
 *     their last beat.
 *   - On every beat completion, records the beat's completionFlag
 *     (if any) and advances `currentPreludeBeat` to the next beat.
 *   - On Beat J's Light/Dark choice, persists the alignment and
 *     clears `currentPreludeBeat` (Prelude complete).
 *
 * The base <PreludeSequencePlayer/> remains available for unit
 * testing or callers that want to wire their own persistence.
 */

import { useCallback, useMemo } from "react";
import {
  PRELUDE_BEATS,
  type PreludeBeat,
  type PreludeBeatId,
} from "../../../../shared/preludeSequence";
import { useGame } from "../../contexts/GameContext";
import { PreludeSequencePlayer } from "./PreludeSequencePlayer";
import type { PreludeAlignmentChoice } from "./preludeSequenceReducer";

export interface PreludeSequencePlayerConnectedProps {
  /** Volume 0-1 for cutscene audio. Passed through to the player. */
  volume?: number;
  /**
   * Optional callback fired after Beat J's alignment is captured
   * and the Prelude state is marked complete. Useful for callers
   * that want to advance `narrativeAct` to 1 or navigate to the
   * post-Prelude scene.
   */
  onPreludeComplete?: (alignment: PreludeAlignmentChoice) => void;
}

/** Lookup table for fast next-beat resolution. */
const BEAT_INDEX_BY_ID: ReadonlyMap<string, number> = new Map(
  PRELUDE_BEATS.map((b, i) => [b.id, i]),
);

function nextBeatId(currentId: string): string | null {
  const idx = BEAT_INDEX_BY_ID.get(currentId);
  if (idx === undefined) return null;
  if (idx >= PRELUDE_BEATS.length - 1) return null;
  return PRELUDE_BEATS[idx + 1].id;
}

export function PreludeSequencePlayerConnected({
  volume,
  onPreludeComplete,
}: PreludeSequencePlayerConnectedProps) {
  const {
    state,
    setCurrentPreludeBeat,
    recordPreludeCompletionFlag,
    setLightDarkAlignment,
  } = useGame();

  // Validate the saved beat id against the live manifest. If the player
  // has an old/invalid id (e.g. canon rename), fall back to the start.
  const startingBeatId = useMemo<PreludeBeatId | undefined>(() => {
    const saved = state.currentPreludeBeat;
    if (!saved) return undefined;
    return BEAT_INDEX_BY_ID.has(saved)
      ? (saved as PreludeBeatId)
      : undefined;
  }, [state.currentPreludeBeat]);

  const handleBeatComplete = useCallback(
    (beat: PreludeBeat) => {
      if (beat.completionFlag) {
        recordPreludeCompletionFlag(beat.completionFlag);
      }
      const next = nextBeatId(beat.id);
      setCurrentPreludeBeat(next);
    },
    [recordPreludeCompletionFlag, setCurrentPreludeBeat],
  );

  const handleComplete = useCallback(
    ({ alignment }: { alignment: PreludeAlignmentChoice }) => {
      setLightDarkAlignment(alignment);
      setCurrentPreludeBeat(null);
      onPreludeComplete?.(alignment);
    },
    [setLightDarkAlignment, setCurrentPreludeBeat, onPreludeComplete],
  );

  return (
    <PreludeSequencePlayer
      startingBeatId={startingBeatId}
      onBeatComplete={handleBeatComplete}
      onComplete={handleComplete}
      volume={volume}
    />
  );
}

/** Re-export helpers so callers can use them independently. */
export { nextBeatId };
