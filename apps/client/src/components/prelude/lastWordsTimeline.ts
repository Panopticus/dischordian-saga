/* ═══════════════════════════════════════════════════════
   LAST WORDS TIMELINE — Song structure + slide timing

   Defines the canonical timeline for the Beat J "Last Words"
   witnessing sequence. Each slide is anchored to a start time
   in the song (seconds from song start). Structure matches
   PRELUDE_SHIP_READY_BIBLE.md §17.5 and
   CANON_REV_7_ORACLE_VEX_EXPANSION.md §5.6.9.

   Song duration: ~219.8s (3:39.8) — 20 slides organized in
   4 sections of 5 slides each:
     - Section 1: Verse 1
     - Section 2: Pre-Chorus + Chorus 1
     - Section 3: Verse 2 + Chorus 2
     - Section 4: Bridge + Outro

   The player cannot skip through the first chorus per Bible
   §17.5; the Light/Dark alignment choice pillar appears at
   the chorus sync point.

   Timing values are tunable — if production delivers exact
   cue sheets, update SLIDE_TIMELINE and CHOICE_PILLAR_REVEAL_S
   to match. The component will do linear interpolation between
   anchors at runtime.
   ═══════════════════════════════════════════════════════ */

/** Total song duration in seconds. */
export const LAST_WORDS_SONG_DURATION_S = 219.8;

/** Path to the normalized MP3 (loudnorm -18 LUFS). */
export const LAST_WORDS_SONG_URL =
  "/audio/music/song_last_words_prelude_cut.mp3";

export interface SlideAnchor {
  /** Section 1-4, slide 1-5 (matches on-disk filename). */
  section: 1 | 2 | 3 | 4;
  slide: 1 | 2 | 3 | 4 | 5;
  /** Start time in seconds from song start. */
  startS: number;
  /** Which song section this slide belongs to. */
  phase: "verse_1" | "pre_chorus" | "chorus_1" | "verse_2" | "chorus_2" | "bridge" | "outro";
}

/**
 * 20 slide anchors. Timing is linear distribution (11s per slide)
 * as a first pass; tune after reviewing the song against the slides
 * in production.
 */
export const SLIDE_TIMELINE: readonly SlideAnchor[] = [
  // Section 1 — Verse 1 (0–55s)
  { section: 1, slide: 1, startS: 0, phase: "verse_1" },
  { section: 1, slide: 2, startS: 11, phase: "verse_1" },
  { section: 1, slide: 3, startS: 22, phase: "verse_1" },
  { section: 1, slide: 4, startS: 33, phase: "verse_1" },
  { section: 1, slide: 5, startS: 44, phase: "verse_1" },
  // Section 2 — Pre-Chorus + Chorus 1 (55–110s)
  { section: 2, slide: 1, startS: 55, phase: "pre_chorus" },
  { section: 2, slide: 2, startS: 66, phase: "chorus_1" },
  { section: 2, slide: 3, startS: 77, phase: "chorus_1" },
  { section: 2, slide: 4, startS: 88, phase: "chorus_1" },
  { section: 2, slide: 5, startS: 99, phase: "chorus_1" },
  // Section 3 — Verse 2 + Chorus 2 (110–165s)
  { section: 3, slide: 1, startS: 110, phase: "verse_2" },
  { section: 3, slide: 2, startS: 121, phase: "verse_2" },
  { section: 3, slide: 3, startS: 132, phase: "chorus_2" },
  { section: 3, slide: 4, startS: 143, phase: "chorus_2" },
  { section: 3, slide: 5, startS: 154, phase: "chorus_2" },
  // Section 4 — Bridge + Outro (165–219.8s)
  { section: 4, slide: 1, startS: 165, phase: "bridge" },
  { section: 4, slide: 2, startS: 176, phase: "bridge" },
  { section: 4, slide: 3, startS: 187, phase: "bridge" },
  { section: 4, slide: 4, startS: 198, phase: "outro" },
  { section: 4, slide: 5, startS: 209, phase: "outro" },
];

/**
 * Time at which the Light/Dark choice pillar appears. Aligned to the
 * start of chorus 1 per Bible §17.5 — the choice is synced to the
 * line "Freedom of thought is worth dying for / And the insurgency
 * will be broadcast once more."
 */
export const CHOICE_PILLAR_REVEAL_S = 66;

/**
 * Time at which skip becomes available (end of chorus 1 per Bible).
 * Before this timestamp, the player is locked into the sequence.
 */
export const SKIP_UNLOCK_S = 110;

/** Image URL for a specific slide on disk. */
export function slideImageUrl(section: number, slide: number): string {
  return `/art/prelude/last-words/slide-${section}-${slide}.webp`;
}

/**
 * Return the slide anchor that should be visible at the given time.
 * Uses the last anchor whose startS <= currentTime.
 */
export function slideAtTime(currentTime: number): SlideAnchor {
  let current = SLIDE_TIMELINE[0];
  for (const anchor of SLIDE_TIMELINE) {
    if (anchor.startS <= currentTime) current = anchor;
    else break;
  }
  return current;
}

/** Whether the player is allowed to skip at a given time. */
export function canSkipAt(currentTime: number): boolean {
  return currentTime >= SKIP_UNLOCK_S;
}

/** Whether the choice pillar should be visible at a given time. */
export function showChoiceAt(currentTime: number): boolean {
  return currentTime >= CHOICE_PILLAR_REVEAL_S;
}
