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
import type { SlideshowFrame, SongSlideshowDef } from "./songSlideshow";
import {
  album5BackgroundUrl,
  album5PortraitUrl,
} from "./expansionArt/album5Slideshows";

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

/* ─── DIALOG INTERLUDES AS SLIDESHOWS ──────────────────────────
 * The 19 dialog steps each carry an mp3 + a beat list (speaker +
 * line + bgId + portrait expressionId). Synthesise a SongSlideshowDef
 * per dialog step so the standard slideshow pipeline (SongSlideshow
 * + SlideshowPlayerRoot + AlbumFilmPlayer) can render them alongside
 * the 18 song slideshows without any new component.
 *
 * Beats are split evenly across the audio duration; each beat's
 * `bgId` resolves to a dialog background and the line drops into
 * the `dialogOverlay` slot the renderer surfaces as the lyric track.
 * Portrait expressions stay in the typed beats for future composite
 * rendering — today they're carried but unused by the renderer. */

const SIH_DIALOG_FALLBACK_BG = album5BackgroundUrl("sih_bg_void") ?? "";

function narratorLabel(speaker: SIHPrologueBeat["speaker"]): string {
  if (speaker === "antiquarian") return "The Antiquarian";
  if (speaker === "storyteller") return "The Storyteller";
  return "Both";
}

/** Where the speaker's portrait sits over the background. The Antiquarian
 *  always reads from the left (Chronicle on his lap); the Storyteller
 *  always commands the right (microphone stand). When both speak together
 *  ("New Babylon. Goddamn.") no single portrait is overlaid — the line
 *  reads as joint narration. */
function portraitSideFor(
  speaker: SIHPrologueBeat["speaker"],
): "left" | "right" | undefined {
  if (speaker === "antiquarian") return "left";
  if (speaker === "storyteller") return "right";
  return undefined;
}

function dialogStepToSlideshow(step: SIHDialogShowStep): SongSlideshowDef {
  const beats = step.beats ?? [];
  const beatCount = Math.max(beats.length, 1);
  const slotMs = Math.max(1000, Math.floor(step.durationMs / beatCount));
  const frames: SlideshowFrame[] =
    beats.length === 0
      ? [
          {
            startMs: 0,
            endMs: step.durationMs,
            imageUrl: SIH_DIALOG_FALLBACK_BG,
            transition: "fade",
            dialogOverlay: step.title,
          },
        ]
      : beats.map((b, i) => {
          const start = i * slotMs;
          const end = i === beatCount - 1 ? step.durationMs : start + slotMs;
          const bgUrl =
            (b.bgId && album5BackgroundUrl(b.bgId)) || SIH_DIALOG_FALLBACK_BG;
          const portraitUrl = b.expressionId
            ? album5PortraitUrl(b.expressionId)
            : undefined;
          const portraitSide = portraitSideFor(b.speaker);
          return {
            startMs: start,
            endMs: end,
            imageUrl: bgUrl,
            transition: i === 0 ? "fade" : "dissolve",
            dialogOverlay: `${narratorLabel(b.speaker)} — ${b.line}`,
            dialogSpeakerId: b.speaker,
            portraitUrl: portraitSide ? portraitUrl : undefined,
            portraitSide,
          };
        });
  const id = `sih-dialog-${step.albumTrackNumber}`;
  return {
    id,
    songId: step.slug,
    audioUrl: step.audioUrl,
    durationMs: step.durationMs,
    title: step.title,
    subtitle: "Silence in Heaven · Interlude",
    priority: "P1",
    frames,
    flagsSetOnComplete: [`slideshow_${id.replace(/-/g, "_")}_complete`],
    /* Loredex auto-discovery — interludes sit at odd album positions
     * 1,3,…,37; the matching Loredex entry is `song_sih_<albumPos>`. */
    unlockLoredexEntry: `song_sih_${step.albumTrackNumber}`,
    reducedMotionFallback: {
      heroImageUrl: SIH_DIALOG_FALLBACK_BG,
      prose: beats.length
        ? beats
            .map((b) => `${narratorLabel(b.speaker)}: ${b.line}`)
            .join("\n\n")
        : `${step.title} — interlude.`,
    },
  };
}

/** SongSlideshowDef per dialog interlude (19 entries — odd album positions). */
export const SIH_DIALOG_SLIDESHOWS: SongSlideshowDef[] = SIH_SHOW_PROGRAM
  .filter((s): s is SIHDialogShowStep => s.kind === "dialog")
  .map(dialogStepToSlideshow);

/** Ordered slideshow ids for the full 37-step show. Pass this list to
 *  AlbumFilmPlayer to play the show end-to-end. Songs use their canonical
 *  `sih-NN` ids; interludes use synthetic `sih-dialog-<albumPos>` ids. */
export const SIH_SHOW_SLIDESHOW_IDS: readonly string[] = SIH_SHOW_PROGRAM.map(
  (s) => (s.kind === "song" ? s.slideshow.id : `sih-dialog-${s.albumTrackNumber}`),
);
