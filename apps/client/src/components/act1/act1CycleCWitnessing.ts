import { assetUrl } from "@/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   ACT 1 CYCLE C WITNESSING — Full Last Words timeline

   Moved from the Prelude in October 2026. The Prelude's
   Beat J now plays a 35-second tease (5 slides); this
   timeline covers the full Malkia Ukweli song + 20-slide
   Witnessing sequence + Light/Dark alignment choice that
   lands at the Act 1 Cycle C Authority finale.

   Timing is authoritative: if production re-cuts the song,
   adjust FULL_DURATION_S and the anchor table.
   ═══════════════════════════════════════════════════════ */

export const LAST_WORDS_FULL_DURATION_S = 246; // 4m06s

/** Path to the full Last Words MP3 (not the Prelude tease). */
export const LAST_WORDS_FULL_SONG_URL =
  assetUrl("audio/music/song_last_words_prelude_full.mp3");

export type WitnessingPhase =
  | "verse_one"
  | "first_refrain"
  | "verse_two"
  | "bridge"
  | "final_refrain"
  | "alignment_gate";

export interface WitnessingSlide {
  /** 1-indexed, matches /art/act1/last-words/slide-{n}.webp on disk. */
  slide: number;
  /** Start time in seconds from song start. */
  startS: number;
  /** Narrative phase for ARIA announcements + phase-band UI. */
  phase: WitnessingPhase;
  /** Short visible caption (≤12 words). */
  caption: string;
}

/**
 * 20 slides across ~246 seconds, pacing the Verse-Refrain-Verse-
 * Bridge-Refrain-Alignment structure. Captions are short so they
 * land without occluding the art; the full lyric sits in the
 * audio — captions frame the image, not the song.
 */
export const FULL_WITNESSING_SLIDES: readonly WitnessingSlide[] = [
  { slide: 1, startS: 0, phase: "verse_one", caption: "The studio is quiet." },
  { slide: 2, startS: 12, phase: "verse_one", caption: "She presses play." },
  { slide: 3, startS: 24, phase: "verse_one", caption: "The hologram rises." },
  { slide: 4, startS: 36, phase: "verse_one", caption: "It is Log 5." },
  { slide: 5, startS: 48, phase: "first_refrain", caption: "She listens." },
  { slide: 6, startS: 60, phase: "first_refrain", caption: "She remembers his hands." },
  { slide: 7, startS: 72, phase: "first_refrain", caption: "She remembers the bench." },
  { slide: 8, startS: 84, phase: "verse_two", caption: "The Authority is watching the courtroom." },
  { slide: 9, startS: 96, phase: "verse_two", caption: "The verdict is still open." },
  { slide: 10, startS: 108, phase: "verse_two", caption: "She begins to sing." },
  { slide: 11, startS: 120, phase: "verse_two", caption: "The trial feed goes quiet." },
  { slide: 12, startS: 132, phase: "bridge", caption: "The Engineer's last words return." },
  { slide: 13, startS: 150, phase: "bridge", caption: "The deck hums, across light-years." },
  { slide: 14, startS: 168, phase: "bridge", caption: "The Authority does not intervene." },
  { slide: 15, startS: 186, phase: "final_refrain", caption: "Cycle C closes." },
  { slide: 16, startS: 198, phase: "final_refrain", caption: "The verdict returns to you." },
  { slide: 17, startS: 210, phase: "final_refrain", caption: "Two paths. One held breath." },
  { slide: 18, startS: 222, phase: "alignment_gate", caption: "Will you forgive the Empire?" },
  { slide: 19, startS: 232, phase: "alignment_gate", caption: "Will you refuse?" },
  { slide: 20, startS: 240, phase: "alignment_gate", caption: "Choose, before the song ends." },
];

/** Image URL for a specific slide. */
export function witnessingSlideImageUrl(slide: number): string {
  return assetUrl(`art/act1/last-words/slide-${slide}.webp`);
}

/** Return the slide that should be visible at the given time. */
export function witnessingSlideAtTime(
  currentTime: number,
): WitnessingSlide {
  let current = FULL_WITNESSING_SLIDES[0];
  for (const slide of FULL_WITNESSING_SLIDES) {
    if (slide.startS <= currentTime) current = slide;
    else break;
  }
  return current;
}

/**
 * The alignment gate opens `ALIGNMENT_GATE_OPEN_S` seconds into the
 * song. Before that, the gate is dismissed in favor of the slideshow
 * so the player can't pick until Malkia's final refrain begins.
 */
export const ALIGNMENT_GATE_OPEN_S = 222;

/** True once the alignment gate is open for the given elapsed time. */
export function alignmentGateOpen(currentTime: number): boolean {
  return currentTime >= ALIGNMENT_GATE_OPEN_S;
}

export type LastWordsAlignment = "light" | "dark";

export interface LastWordsChoiceDescriptor {
  id: LastWordsAlignment;
  label: string;
  blurb: string;
  /** Narrative flag raised on commit. */
  flag: string;
}

export const ALIGNMENT_CHOICES: readonly LastWordsChoiceDescriptor[] = [
  {
    id: "light",
    label: "Forgive",
    blurb:
      "The Authority stood trial. The verdict is mercy. You carry the Engineer's last line — hold the letter, don't sit in the chair.",
    flag: "act1_cycle_c_alignment_light",
  },
  {
    id: "dark",
    label: "Refuse",
    blurb:
      "The Authority stood trial. The verdict is silence. Malkia sings the final refrain alone. You do not join.",
    flag: "act1_cycle_c_alignment_dark",
  },
];
