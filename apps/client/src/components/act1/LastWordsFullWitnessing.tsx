/**
 * LastWordsFullWitnessing — Act 1 Cycle C finale (full song + choice).
 *
 * Sibling to the Prelude `LastWordsWitnessing` (35-second tease).
 * Here the player hears the full 219.8-second Malkia Ukweli track
 * over the 20 canonical slides, AND picks the single canonical
 * Light/Dark alignment choice that persists into Acts 2+.
 *
 * Fires after the `the_authority` match resolves. The gate is
 * `preludeCompletedFlags` contains `cutscene_archives_two_witnesses_part1_complete`.
 *
 * Canonical references:
 *   docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md §6.4
 *   apps/client/public/audio/music/song_last_words_prelude_cut.mp3
 *   apps/client/public/art/prelude/last-words/slide-{1..4}-{1..5}.webp
 *   apps/client/src/components/prelude/lastWordsTimeline.ts
 *   (ChoicePillarLightDark from PR #40)
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LAST_WORDS_SONG_URL,
  SLIDE_TIMELINE,
  slideAtTime,
  slideImageUrl,
  type SlideAnchor,
} from "../prelude/lastWordsTimeline";
import type { LastWordsChoice } from "../prelude/LastWordsWitnessing";

/** Reveal the choice UI at chorus-1 onset (~66s from song start). */
export const CHOICE_REVEAL_S = 66;
/** Unlock the skip button at chorus-1 end (~110s from song start). */
export const SKIP_UNLOCK_S = 110;
/** Canonical full-song duration. */
export const FULL_SONG_DURATION_S = 219.8;

export interface LastWordsFullResult {
  alignment: LastWordsChoice;
  elapsedS: number;
  skipped: boolean;
}

export interface LastWordsFullWitnessingProps {
  /** Called when the player has settled the choice AND the song ends (or skip fires). */
  onComplete: (result: LastWordsFullResult) => void;
  /** Start audio on mount. Default true. */
  autoPlay?: boolean;
  /** Override audio volume (0-1). Default 0.85. */
  volume?: number;
  /** Render without motion / autoplay; text-only fallback for reduced-motion users. */
  reducedMotion?: boolean;
}

/**
 * Scaffold. Does not yet wire:
 *   - full-song audio playback (reuse the tease's HTMLAudioElement pattern)
 *   - 20-slide cross-fade (reuse prelude SLIDE_TIMELINE)
 *   - ChoicePillarLightDark reveal at 66s + skip-unlock at 110s
 *   - refusal handling (no default choice; cutscene holds on black)
 *   - persistence write to GameState.lightDarkAlignment
 *
 * Public API is locked so the Act 1 runner can consume this.
 */
export function LastWordsFullWitnessing({
  onComplete,
  autoPlay = true,
  volume = 0.85,
  reducedMotion = false,
}: LastWordsFullWitnessingProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [choice, setChoice] = useState<LastWordsChoice | null>(null);
  const [skipUnlocked, setSkipUnlocked] = useState(false);
  const mountedAtRef = useRef(performance.now());

  const currentSlide: SlideAnchor = useMemo(
    () => slideAtTime(currentTime),
    [currentTime],
  );

  // Skip unlocks once the chorus ends.
  useEffect(() => {
    if (!skipUnlocked && currentTime >= SKIP_UNLOCK_S) setSkipUnlocked(true);
  }, [currentTime, skipUnlocked]);

  const choiceVisible = currentTime >= CHOICE_REVEAL_S;

  // Sync volume.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  const finish = (skipped: boolean) => {
    if (!choice) return; // Refusal: cutscene holds on black until pick.
    const elapsedS = (performance.now() - mountedAtRef.current) / 1000;
    onComplete({ alignment: choice, elapsedS, skipped });
  };

  return (
    <div
      data-testid="last-words-full-witnessing"
      data-time-s={currentTime.toFixed(1)}
      data-choice={choice ?? "pending"}
      className="fixed inset-0 bg-black"
    >
      {!reducedMotion && (
        <audio
          ref={audioRef}
          src={LAST_WORDS_SONG_URL}
          autoPlay={autoPlay}
          onTimeUpdate={(e) =>
            setCurrentTime((e.target as HTMLAudioElement).currentTime)
          }
          onEnded={() => finish(false)}
        />
      )}
      <img
        src={slideImageUrl(currentSlide)}
        alt=""
        className="h-full w-full object-cover"
        data-slide-section={currentSlide.section}
        data-slide-index={currentSlide.index}
      />
      {choiceVisible && (
        <div data-testid="light-dark-choice-pillar">
          {/* TODO: <ChoicePillarLightDark onPick={setChoice} /> */}
        </div>
      )}
      {skipUnlocked && choice !== null && (
        <button
          type="button"
          onClick={() => finish(true)}
          className="absolute right-8 bottom-8 rounded-md border border-[#d9a66a] bg-black/80 px-4 py-2 text-sm text-[#d9a66a]"
          data-testid="last-words-skip-button"
        >
          Skip
        </button>
      )}
    </div>
  );
}

/**
 * Persists the resolved alignment into GameState. Caller wires
 * the Act 1 → Two Witnesses Part 2 transition after this.
 */
export function applyLastWordsFullResult(
  result: LastWordsFullResult,
  gameState: {
    lightDarkAlignment: LastWordsChoice | null;
    act1_cycle_c_complete: boolean;
    first_light_dark_choice_resolved_light: boolean;
    first_light_dark_choice_resolved_dark: boolean;
  },
) {
  gameState.lightDarkAlignment = result.alignment;
  gameState.act1_cycle_c_complete = true;
  if (result.alignment === "light")
    gameState.first_light_dark_choice_resolved_light = true;
  else gameState.first_light_dark_choice_resolved_dark = true;
}
