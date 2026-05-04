/* ═══════════════════════════════════════════════════════
   SILENCE IN HEAVEN — End-to-end show program

   Ties the 37-track album manifest (silenceInHeavenAlbumAudio.json)
   to the 18 song slideshows (slideshowData/silence-in-heaven/) and
   the dialog beats that accompany the interlude tracks. A
   `SIHShowStep` is one playable beat in the album: songs carry a
   `SongSlideshowDef`; dialog interludes carry the speakers and
   (when authored) the line-by-line beat list, otherwise the
   audio plays under a themed title card.

   Album positions (1-indexed):
     - odd  → dialog interlude (authored beats, fall back to themed title card)
     - even → song with full slideshow
   Songs at album positions 2,4,…,36 map 1:1 to ALL_SIH_TRACKS[0..17].
   Dialog interludes at positions 3,5,…,37 each carry authored beats
   from SIH_INTER_TRACK_DIALOG (afterTrack n → position n*2+1); track 1
   reuses SIH_PROLOGUE. Each beat pairs a dialog background + narrator
   expression from album5Slideshows.ts for the composite renderer.
   ═══════════════════════════════════════════════════════ */

import albumAudio from "./silenceInHeavenAlbumAudio.json";
import { ALL_SIH_TRACKS } from "./slideshowData/silence-in-heaven/index";
import {
  SIH_PROLOGUE,
  SIH_INTER_TRACK_DIALOG,
  SIH_TRACKLIST,
  type SIHPrologueBeat,
} from "./silenceInHeavenTracklist";
import type { SongSlideshowDef } from "./songSlideshow";

export type SIHShowStepKind = "song" | "dialog";

export interface SIHShowStepBase {
  /** 1-indexed album position (1..37). */
  albumTrackNumber: number;
  kind: SIHShowStepKind;
  title: string;
  slug: string;
  audioUrl: string;
  durationMs: number;
}

export interface SIHSongShowStep extends SIHShowStepBase {
  kind: "song";
  /** 1-indexed song position within the show (1..18). */
  songNumber: number;
  slideshow: SongSlideshowDef;
}

export interface SIHDialogShowStep extends SIHShowStepBase {
  kind: "dialog";
  /** Active narrators ("antiquarian" | "storyteller"). */
  speakers: ("antiquarian" | "storyteller")[];
  /** Authored line beats (prologue, inter-track), if any. */
  beats?: SIHPrologueBeat[];
  /** Theme color for the interlude title card; falls back to neighbor song. */
  themeColor: string;
}

export type SIHShowStep = SIHSongShowStep | SIHDialogShowStep;

interface AlbumManifestTrack {
  trackNumber: number;
  title: string;
  kind: SIHShowStepKind;
  slug: string;
  durationMs: number;
  audioUrl: string;
}

const MANIFEST_TRACKS = (albumAudio as { tracks: AlbumManifestTrack[] }).tracks;

/** Map of album dialog position → authored beats. */
const DIALOG_BEATS_BY_POSITION: Record<number, SIHPrologueBeat[]> = {
  1: SIH_PROLOGUE,
  ...Object.fromEntries(
    SIH_INTER_TRACK_DIALOG.map(d => [d.afterTrack * 2 + 1, d.beats]),
  ),
};

/** Pick a theme color for a dialog interlude — prefer the upcoming song,
 *  fall back to the previous song so the prologue/outro inherit the
 *  opener/closer's palette. */
function dialogThemeColor(albumPos: number): string {
  const upcomingSongNumber = Math.floor(albumPos / 2) + 1; // 1 → 1, 3 → 2, …
  const prevSongNumber = Math.floor((albumPos - 1) / 2);   // 1 → 0
  const upcoming = SIH_TRACKLIST[upcomingSongNumber - 1];
  const prev = SIH_TRACKLIST[prevSongNumber - 1];
  return upcoming?.themeColor ?? prev?.themeColor ?? "#000000";
}

export const SIH_SHOW_PROGRAM: SIHShowStep[] = MANIFEST_TRACKS.map((t) => {
  const base: SIHShowStepBase = {
    albumTrackNumber: t.trackNumber,
    kind: t.kind,
    title: t.title,
    slug: t.slug,
    audioUrl: t.audioUrl,
    durationMs: t.durationMs,
  };
  if (t.kind === "song") {
    const songNumber = t.trackNumber / 2; // 2→1, 4→2, …, 36→18
    const slideshow = ALL_SIH_TRACKS[songNumber - 1];
    return { ...base, kind: "song", songNumber, slideshow };
  }
  return {
    ...base,
    kind: "dialog",
    speakers: ["antiquarian", "storyteller"],
    beats: DIALOG_BEATS_BY_POSITION[t.trackNumber],
    themeColor: dialogThemeColor(t.trackNumber),
  };
});

/** Total runtime of the full show (sum of all 37 track durations). */
export const SIH_SHOW_TOTAL_DURATION_MS = SIH_SHOW_PROGRAM.reduce(
  (a, s) => a + s.durationMs,
  0,
);

/** Look up a step by 1-indexed album position. */
export function getShowStep(albumTrackNumber: number): SIHShowStep | undefined {
  return SIH_SHOW_PROGRAM[albumTrackNumber - 1];
}

/** Step that follows the given album position (or undefined at the end). */
export function getNextShowStep(albumTrackNumber: number): SIHShowStep | undefined {
  return SIH_SHOW_PROGRAM[albumTrackNumber];
}

/** Step that contains the given offset from the start of the show, plus the
 *  ms-into-step. Used by a scrubber that operates on absolute show time. */
export function locateShowTime(showTimeMs: number): {
  step: SIHShowStep;
  offsetMs: number;
} | null {
  if (showTimeMs < 0) return null;
  let cursor = 0;
  for (const step of SIH_SHOW_PROGRAM) {
    if (showTimeMs < cursor + step.durationMs) {
      return { step, offsetMs: showTimeMs - cursor };
    }
    cursor += step.durationMs;
  }
  return null;
}
