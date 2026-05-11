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

/** Default "listening" expressions for the non-speaking narrator on
 *  each beat. Pinned to the neutral / witness portraits so the listener
 *  reads as attentive without competing with the speaker's authored
 *  emotion. */
const ANTIQ_LISTENING_EXPRESSION = "sih_antiq_neutral" as const;
const STORY_LISTENING_EXPRESSION = "sih_story_witness" as const;

/** Compose the pair of narrator portraits to render on every dialog
 *  beat — Antiquarian on the left, Storyteller on the right. The
 *  speaker uses their authored expression (`b.expressionId`); the
 *  listener falls back to the canonical listening portrait above. For
 *  `speaker: "both"` beats neither is the explicit speaker, so both
 *  use the listening default and the renderer treats them as joint. */
function dialogPortraitsFor(b: SIHPrologueBeat): {
  primaryUrl?: string;
  secondaryUrl?: string;
} {
  const antiqExpr =
    b.speaker === "antiquarian" && b.expressionId
      ? b.expressionId
      : ANTIQ_LISTENING_EXPRESSION;
  const storyExpr =
    b.speaker === "storyteller" && b.expressionId
      ? b.expressionId
      : STORY_LISTENING_EXPRESSION;
  return {
    primaryUrl: album5PortraitUrl(antiqExpr),
    secondaryUrl: album5PortraitUrl(storyExpr),
  };
}

/** Approximate spoken length of a line. Counts visible characters and
 *  weights punctuation ('.' '!' '?' '—' ',') as extra time, because the
 *  voice actor pauses there. This is the cheap proxy for real audio
 *  alignment — close enough that a long Antiquarian paragraph no
 *  longer shares the screen 50/50 with a six-word Storyteller jab. */
function weightForLine(line: string): number {
  const chars = line.trim().length;
  const breathPauses =
    (line.match(/[.!?—]/g)?.length ?? 0) * 6 +
    (line.match(/,/g)?.length ?? 0) * 2;
  return Math.max(8, chars + breathPauses);
}

/** Allocate a dialog interlude's duration across its beats by spoken
 *  weight, with a 900ms minimum floor per beat so very short lines
 *  ("Goddamn.") still get a readable hold. Returns absolute [start,
 *  end] ms per beat — the last beat clamps to `step.durationMs` so we
 *  never round past the audio. */
function allocateBeatSlots(
  beats: SIHPrologueBeat[],
  totalMs: number,
): { startMs: number; endMs: number }[] {
  if (beats.length === 0) return [];
  const MIN_BEAT_MS = 900;
  const weights = beats.map((b) => weightForLine(b.line));
  const totalWeight = weights.reduce((a, w) => a + w, 0);
  // First pass: proportional allocation.
  const raw = weights.map((w) =>
    Math.max(MIN_BEAT_MS, Math.floor((w / totalWeight) * totalMs)),
  );
  // The min-floor + flooring can push total over the audio length.
  // Trim from the longest beats first (proportionally) so any
  // shortfall lands on the lines that have the most slack. Excess is
  // tiny in practice — single-digit ms — but worth keeping the loop
  // safe so the last beat doesn't end past the audio.
  let drift = raw.reduce((a, x) => a + x, 0) - totalMs;
  if (drift > 0) {
    // Sort indices by raw size, descending; trim 1ms from each in
    // round-robin until drift hits zero.
    const order = raw
      .map((v, i) => [v, i] as const)
      .sort((a, b) => b[0] - a[0])
      .map(([, i]) => i);
    let cursor = 0;
    while (drift > 0) {
      const i = order[cursor % order.length];
      if (raw[i] > MIN_BEAT_MS) {
        raw[i]--;
        drift--;
      }
      cursor++;
      if (cursor > order.length * (totalMs + 1)) break; // pathological safety
    }
  }
  // Walk into absolute [start, end] pairs.
  const slots: { startMs: number; endMs: number }[] = [];
  let t = 0;
  for (let i = 0; i < beats.length; i++) {
    const end = i === beats.length - 1 ? totalMs : t + raw[i];
    slots.push({ startMs: t, endMs: end });
    t = end;
  }
  return slots;
}

function dialogStepToSlideshow(step: SIHDialogShowStep): SongSlideshowDef {
  const beats = step.beats ?? [];
  const slots = allocateBeatSlots(beats, step.durationMs);
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
          const { startMs, endMs } = slots[i];
          const bgUrl =
            (b.bgId && album5BackgroundUrl(b.bgId)) || SIH_DIALOG_FALLBACK_BG;
          const portraits = dialogPortraitsFor(b);
          return {
            startMs,
            endMs,
            imageUrl: bgUrl,
            transition: i === 0 ? "fade" : "dissolve",
            dialogOverlay: `${narratorLabel(b.speaker)} — ${b.line}`,
            dialogSpeakerId: b.speaker,
            // Both narrators share the stage on every dialog beat —
            // antiquarian on the left, storyteller on the right. The
            // renderer reads `dialogSpeakerId` to decide which one is
            // the active speaker and animates accordingly.
            portraitUrl: portraits.primaryUrl,
            portraitSide: "left",
            secondaryPortraitUrl: portraits.secondaryUrl,
            secondaryPortraitSide: "right",
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
