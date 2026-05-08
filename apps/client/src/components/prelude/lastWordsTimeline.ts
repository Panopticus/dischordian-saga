import { assetUrl } from "@/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   LAST WORDS TIMELINE — Prelude Tease (5 slides, 35s)

   Defines the canonical timeline for the Beat J tease of the
   Last Words song. After the Last Words restructure (October
   2026) the Prelude plays only a 35-second motif of Verse 1
   over 5 slides of Malkia watching the Engineer's Log 5
   hologram in her studio; the full song + 20-slide Witnessing
   sequence + Light/Dark choice moved to the Act 1 Cycle C
   Authority finale.

   See sibling design doc for the full restructure rationale:
     docs/production/prelude-asset-build/prompts/voice/log5/
       LAST_WORDS_TEASE_VS_FULL.md

   Slide prompts for production:
     docs/production/prelude-asset-build/prompts/voice/log5/
       LAST_WORDS_TEASE_SLIDE_PROMPTS.md

   Source canon: PRELUDE_SHIP_READY_BIBLE.md §17.5 +
   CANON_REV_7_ORACLE_VEX_EXPANSION.md §5.6.9.

   Timing values tunable: if production re-cuts the tease or
   adjusts the vocal-line landing points, update TEASE_DURATION_S
   and SLIDE_TIMELINE to match.
   ═══════════════════════════════════════════════════════ */

/** Total tease duration in seconds (includes the 3s fade-out). */
export const LAST_WORDS_TEASE_DURATION_S = 35;

/** Path to the tease MP3 (35s trim of the full song with fade-out). */
export const LAST_WORDS_SONG_URL =
  assetUrl("audio/music/song_last_words_prelude_tease.mp3");

/**
 * A single slide in the 5-slide tease sequence. The sequence
 * tells one compact story: Malkia at the console → presses play
 * → listens → a line lands → she begins to sing.
 */
export interface SlideAnchor {
  /** 1-indexed slide number; matches on-disk filename slide-{n}.webp. */
  slide: 1 | 2 | 3 | 4 | 5;
  /** Start time in seconds from tease start. */
  startS: number;
  /**
   * Narrative phase tag used for screen-reader announcements
   * in LastWordsWitnessing's visually-hidden aria-live region.
   */
  phase:
    | "before_play"
    | "hologram_on"
    | "listening"
    | "line_lands"
    | "first_breath";
}

/**
 * 5 slide anchors for the 35-second tease. 7 seconds each until
 * the last, which holds 7 seconds and then the tease fades out.
 */
export const SLIDE_TIMELINE: readonly SlideAnchor[] = [
  { slide: 1, startS: 0, phase: "before_play" },
  { slide: 2, startS: 7, phase: "hologram_on" },
  { slide: 3, startS: 14, phase: "listening" },
  { slide: 4, startS: 21, phase: "line_lands" },
  { slide: 5, startS: 28, phase: "first_breath" },
];

/** Image URL for a specific tease slide on disk. */
export function slideImageUrl(slide: number): string {
  return assetUrl(`art/prelude/last-words-tease/slide-${slide}.webp`);
}

/**
 * Return the slide anchor that should be visible at the given
 * time. Uses the last anchor whose startS <= currentTime.
 */
export function slideAtTime(currentTime: number): SlideAnchor {
  let current = SLIDE_TIMELINE[0];
  for (const anchor of SLIDE_TIMELINE) {
    if (anchor.startS <= currentTime) current = anchor;
    else break;
  }
  return current;
}
