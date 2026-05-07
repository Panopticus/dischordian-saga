/* ═══════════════════════════════════════════════════════
   SONG SLIDESHOW REGISTRY — first-wave slideshow definitions.

   Witnessing Narrative Proposal §5.4 — §5.5.

   This file defines the slideshow DATA. The React component
   in client/src/components/SongSlideshow.tsx consumes these
   definitions. Art URLs are placeholder paths under
   /assets/slideshows/{id}/frame{N}.webp — the artist can
   swap them in without changing code.

   The registry is intentionally tiny at first (one P0 entry)
   so that the component can be shipped and tested end-to-end
   before the remaining twelve songs from §5.5 are filled in.
   ═══════════════════════════════════════════════════════ */

import type { SongSlideshowDef } from "./songSlideshow";

import { assetUrl } from "../client/src/lib/assetUrl";
import {
  ALBUM1_TRACKS,
  album1FrameUrl,
  type Album1TrackDef,
  type Album1TrackId,
} from "./expansionArt/album1Slideshows";
import {
  ALBUM2_TRACKS,
  album2FrameUrl,
  type Album2TrackDef,
  type Album2TrackId,
} from "./expansionArt/album2Slideshows";
import {
  ALBUM3_TRACKS,
  album3FrameUrl,
  type Album3TrackDef,
  type Album3TrackId,
} from "./expansionArt/album3Slideshows";
import {
  ALBUM4_TRACKS,
  album4FrameUrl,
  type Album4TrackDef,
  type Album4TrackId,
} from "./expansionArt/album4Slideshows";
import { ALL_SIH_TRACKS } from "./slideshowData/silence-in-heaven/index";
import { SIH_DIALOG_SLIDESHOWS } from "./silenceInHeavenShow";

/* ─── LAST WORDS (§5.4) ─── */

/**
 * "Last Words" — the P0 master slideshow, played at the end
 * of Act 1 after the Engineer's execution. Fifteen frames,
 * ~3 minutes 30 seconds. Per the proposal, the recording was
 * always two voices — the Programmer's final message and the
 * Engineer's execution in New Babylon — and the player is
 * the first in centuries to hear both layers.
 *
 * Frame timings are even slices of 14,000ms each (15 frames
 * × 14s = 3m 30s). The artist can tune individual frame
 * durations later without touching the spec.
 */
const FRAME_MS = 14_000;
const FRAME_COUNT = 15;

function frame(
  index: number,
  imageUrl: string,
  transition: "fade" | "dissolve" | "hardcut" | "iris" | "static",
  extra: {
    caption?: string;
    dialogOverlay?: string;
    dialogSpeakerId?: string;
    narratorReactionId?: "elara" | "the_human" | "antiquarian" | null;
    kenBurns?: boolean;
  } = {},
) {
  const start = index * FRAME_MS;
  return {
    startMs: start,
    endMs: start + FRAME_MS,
    imageUrl,
    transition,
    caption: extra.caption,
    dialogOverlay: extra.dialogOverlay,
    dialogSpeakerId: extra.dialogSpeakerId,
    narratorReactionId: extra.narratorReactionId,
    kenBurns: extra.kenBurns
      ? {
          startScale: 1.0,
          endScale: 1.08,
          startPan: [0, 0] as [number, number],
          endPan: [0.05, 0.02] as [number, number],
        }
      : undefined,
  };
}

export const LAST_WORDS_SLIDESHOW: SongSlideshowDef = {
  id: "last-words",
  songId: "last_words",
  audioUrl: "/assets/audio/songs/last-words.mp3",
  durationMs: FRAME_COUNT * FRAME_MS, // 210_000ms = 3m 30s
  title: "Last Words",
  subtitle: "The Programmer's final message, reconstructed from fragmented recordings.",
  credits: "Album: Dischordian Logic · Track 28",
  priority: "P0",
  frames: [
    frame(
      0,
      "/assets/slideshows/last-words/frame01.webp",
      "fade",
      { kenBurns: true, narratorReactionId: "the_human" },
    ),
    frame(
      1,
      "/assets/slideshows/last-words/frame02.webp",
      "dissolve",
      {
        dialogOverlay:
          "\"He was brought in without cuffs. They were embarrassed by the cuffs.\"",
        dialogSpeakerId: "the_human",
        narratorReactionId: "the_human",
        kenBurns: true,
      },
    ),
    frame(
      2,
      "/assets/slideshows/last-words/frame03.webp",
      "dissolve",
      { kenBurns: true },
    ),
    frame(
      3,
      "/assets/slideshows/last-words/frame04.webp",
      "dissolve",
      { kenBurns: true },
    ),
    frame(
      4,
      "/assets/slideshows/last-words/frame05.webp",
      "dissolve",
      { kenBurns: true },
    ),
    frame(
      5,
      "/assets/slideshows/last-words/frame06.webp",
      "dissolve",
      {
        dialogOverlay: "\"What do you say to the charges?\"",
        dialogSpeakerId: "the_authority",
      },
    ),
    frame(
      6,
      "/assets/slideshows/last-words/frame07.webp",
      "dissolve",
      {
        dialogOverlay:
          "\"I say I built a thing so people wouldn't have to ask permission to dream.\"",
        dialogSpeakerId: "the_engineer",
        kenBurns: true,
      },
    ),
    frame(
      7,
      "/assets/slideshows/last-words/frame08.webp",
      "dissolve",
      {
        caption: "Flashback: Celebration.",
        kenBurns: true,
      },
    ),
    frame(
      8,
      "/assets/slideshows/last-words/frame09.webp",
      "dissolve",
      {
        caption: "Flashback: Mechronis.",
        kenBurns: true,
      },
    ),
    frame(
      9,
      "/assets/slideshows/last-words/frame10.webp",
      "dissolve",
      {
        caption: "Flashback: Nexon.",
        kenBurns: true,
      },
    ),
    frame(
      10,
      "/assets/slideshows/last-words/frame11.webp",
      "hardcut",
      {
        dialogOverlay: "\"She watched. She smiled.\"",
        dialogSpeakerId: "elara",
        narratorReactionId: "elara",
      },
    ),
    frame(
      11,
      "/assets/slideshows/last-words/frame12.webp",
      "dissolve",
      {
        dialogOverlay: "\"For crimes against the state of being.\"",
        dialogSpeakerId: "the_authority",
      },
    ),
    frame(
      12,
      "/assets/slideshows/last-words/frame13.webp",
      "dissolve",
      { kenBurns: true },
    ),
    frame(
      13,
      "/assets/slideshows/last-words/frame14.webp",
      "fade",
      {
        dialogOverlay:
          "\"The recording, reconstructed, held two voices. Ours is the first generation to hear both.\"",
        dialogSpeakerId: "the_antiquarian",
        narratorReactionId: "antiquarian",
        kenBurns: true,
      },
    ),
    frame(
      14,
      "/assets/slideshows/last-words/frame15.webp",
      "fade",
      { kenBurns: true },
    ),
  ],
  lyrics: [
    // Lyrics are placeholders until the final audio mix is locked.
    // The "layered" emphasis drives the echo/overlap treatment in §5.4.
    {
      startMs: 10_000,
      endMs: 18_000,
      text: "Tell them I was here.",
      emphasis: "whisper",
    },
    {
      startMs: 80_000,
      endMs: 90_000,
      text: "I built a room with no locks on the door.",
      emphasis: "normal",
    },
    {
      startMs: 96_000,
      endMs: 104_000,
      text: "I am not afraid of what I made.",
      emphasis: "normal",
    },
    {
      startMs: 190_000,
      endMs: 205_000,
      text: "Two voices. Two goodbyes. One song.",
      emphasis: "layered",
    },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 14_000, intensity: 0.35 },
    { type: "scanlines", startMs: 14_000, endMs: 28_000, intensity: 0.25 },
    { type: "particles", startMs: 42_000, endMs: 70_000, intensity: 0.35 },
    { type: "grain", startMs: 70_000, endMs: 98_000, intensity: 0.2 },
    { type: "corruption", startMs: 140_000, endMs: 168_000, intensity: 0.25 },
    { type: "particles", startMs: 168_000, endMs: 196_000, intensity: 0.55 },
    { type: "bloom", startMs: 182_000, endMs: 210_000, intensity: 0.7 },
  ],
  flagsSetOnComplete: [
    "slideshow_last_words_complete",
    "engineer_execution_seen",
    "programmer_fate_hint",
    "antiquarian_voice_first_heard",
    // Note: the caller sets `act_1_complete` BEFORE the slideshow
    // plays (that's what triggers it via useNarrativeIntegration).
    // The slideshow does not set it itself.
  ],
  unlockLoredexEntry: "the-prince-of-celebration",
  lightEnergyReward: 500,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/last-words/hero.webp",
    prose:
      "The Engineer is brought into a New Babylon courtroom without restraints. He places a single Dischordian card on the floor before the Authority. He does not flinch. Asked to plead, he answers that he built a thing so people wouldn't have to ask permission to dream. The court convicts him of crimes against the state of being. As sentence is passed, the card he placed on the floor lifts on its own and bursts into light — and in the light a second figure appears beside him, the long-missing Programmer, reaching out to take his hand.",
    closingLine:
      "The recording always held two voices. You are the first in centuries to hear both.",
  },
};

/* ─── ALBUM 1 · DISCHORDIAN LOGIC — T01..T09 (producer drop, 2026-04-29) ─── */

/**
 * Audio durations measured from the producer's WAV→MP3 192kbps re-
 * encodes. Frames are distributed evenly across the duration; the
 * artist can hand-tune individual frame timings per-track later
 * without changing the producer source files.
 *
 * MP3s live at cdn/client-public/audio/album1/T<NN>.mp3 — see the
 * album1Slideshows manifest for the per-track frame inventory.
 */
const ALBUM1_AUDIO_DURATIONS_MS: Partial<Record<Album1TrackId, number>> = {
  T01: 220_104,
  T02: 175_512,
  T03: 232_440,
  T04: 205_200,
  T05: 202_992,
  T06: 189_480,
  T07: 313_344,
  T08: 212_424,
  T09: 193_440,
};

const ALBUM1_TRANSITIONS = ["fade", "dissolve"] as const;

function album1IdSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Build a SongSlideshowDef for an album1 track. Pulls frame URLs
 * from the album1Slideshows manifest, audio URL from the
 * cdn/client-public/audio/album1/T<NN>.mp3 convention, and
 * distributes frame durations evenly across the audio.
 */
function album1Slideshow(
  trackId: Album1TrackId,
  opts: {
    priority?: "P0" | "P1" | "P2";
    subtitle?: string;
    flagsSetOnComplete?: string[];
    unlockLoredexEntry?: string;
    lightEnergyReward?: number;
  } = {},
): SongSlideshowDef {
  const track: Album1TrackDef | undefined = ALBUM1_TRACKS.find(
    (t) => t.id === trackId,
  );
  if (!track) throw new Error(`album1Slideshow: ${trackId} not in manifest`);
  const durationMs = ALBUM1_AUDIO_DURATIONS_MS[trackId];
  if (durationMs === undefined) {
    throw new Error(
      `album1Slideshow: ${trackId} has no audio duration wired (see ALBUM1_AUDIO_DURATIONS_MS)`,
    );
  }
  // Producer convention: T<NN>_00_title.webp is the pre-slideshow
  // title card. Treat it as the reduced-motion hero (mirroring the
  // Last Words pattern) and play the numbered beats T<NN>_01.. as
  // the slideshow itself.
  const titleUrl = album1FrameUrl(trackId, 1);
  if (!titleUrl) throw new Error(`album1Slideshow: ${trackId} title card missing`);
  const beatCount = track.frameRelPaths.length - 1;
  const frameMs = durationMs / beatCount;
  const id = `album1-${trackId.toLowerCase()}-${album1IdSlug(track.title)}`;
  // Test invariant in songSlideshow.test.ts: every slideshow declares
  // a `slideshow_<id-with-underscores>_complete` flag in flagsSetOnComplete.
  const completionFlag = `slideshow_${id.replace(/-/g, "_")}_complete`;
  const flagsSetOnComplete = [
    completionFlag,
    ...(opts.flagsSetOnComplete ?? []),
  ];
  return {
    id,
    songId: `album1_${trackId.toLowerCase()}`,
    audioUrl: assetUrl(`audio/album1/${trackId}.mp3`),
    durationMs,
    title: track.title,
    subtitle: opts.subtitle,
    credits: `Album 1 · Age of Dischordian Logic — ${trackId}`,
    priority: opts.priority ?? "P1",
    flagsSetOnComplete,
    unlockLoredexEntry: opts.unlockLoredexEntry,
    lightEnergyReward: opts.lightEnergyReward,
    frames: Array.from({ length: beatCount }, (_, i) => {
      const start = Math.round(i * frameMs);
      const end = Math.round((i + 1) * frameMs);
      // Beats are 1-indexed past the title card → producer index = i + 2.
      const url = album1FrameUrl(trackId, i + 2);
      if (!url) throw new Error(`album1Slideshow: missing beat ${i + 2} for ${trackId}`);
      return {
        startMs: start,
        endMs: end,
        imageUrl: url,
        transition: i === 0 ? "fade" : ALBUM1_TRANSITIONS[i % 2],
        kenBurns: {
          startScale: 1.0,
          endScale: 1.06,
          startPan: [0, 0] as [number, number],
          endPan: [i % 2 === 0 ? 0.04 : -0.04, 0.02] as [number, number],
        },
        narratorReactionId: null,
      };
    }),
    reducedMotionFallback: {
      heroImageUrl: titleUrl,
      prose: `Track ${trackId} from "Age of Dischordian Logic" — "${track.title}". ${beatCount} cinematic widescreen beats over ${(durationMs / 60_000).toFixed(1)} minutes of cel-shaded painterly anime, plus a title card hero.`,
      closingLine: "Album 1 · Age of Dischordian Logic.",
    },
  };
}

export const ALBUM1_T01_SLIDESHOW = album1Slideshow("T01");
export const ALBUM1_T02_SLIDESHOW = album1Slideshow("T02");
export const ALBUM1_T03_SLIDESHOW = album1Slideshow("T03");
export const ALBUM1_T04_SLIDESHOW = album1Slideshow("T04");
export const ALBUM1_T05_SLIDESHOW = album1Slideshow("T05");
export const ALBUM1_T06_SLIDESHOW = album1Slideshow("T06");
export const ALBUM1_T07_SLIDESHOW = album1Slideshow("T07");
export const ALBUM1_T08_SLIDESHOW = album1Slideshow("T08");
export const ALBUM1_T09_SLIDESHOW = album1Slideshow("T09");

/** First-9-tracks bundle. Spread into SONG_SLIDESHOWS below; downstream
 *  consumers can also iterate this directly to render an album view. */
export const ALBUM1_FIRST_NINE_SLIDESHOWS: readonly SongSlideshowDef[] = [
  ALBUM1_T01_SLIDESHOW,
  ALBUM1_T02_SLIDESHOW,
  ALBUM1_T03_SLIDESHOW,
  ALBUM1_T04_SLIDESHOW,
  ALBUM1_T05_SLIDESHOW,
  ALBUM1_T06_SLIDESHOW,
  ALBUM1_T07_SLIDESHOW,
  ALBUM1_T08_SLIDESHOW,
  ALBUM1_T09_SLIDESHOW,
];

/** Look up an Album 1 slideshow by trackId (T01..T09). Falls back to
 *  T01 if the trackId isn't recognized — defensive only; the queue
 *  guarantees only authored ids reach this helper. */
export function getAlbum1Slideshow(trackId: string): SongSlideshowDef {
  const songId = `album1_${trackId.toLowerCase()}`;
  return (
    ALBUM1_FIRST_NINE_SLIDESHOWS.find((s) => s.songId === songId) ??
    ALBUM1_T01_SLIDESHOW
  );
}

/* ═══════════════════════════════════════════════════════
   ALBUMS 2-5 SLIDESHOW FACTORIES

   Each album mirrors the album1Slideshow() shape: the factory looks
   up the typed manifest, distributes frame durations evenly across
   the audio track, and emits a SongSlideshowDef the renderer can
   consume uniformly. Audio assets follow the same convention:
   cdn/client-public/audio/album<N>/T<NN>.mp3.

   Factories throw when called for a track without a known audio
   duration — same fail-loud contract Album 1 uses. As masters are
   ingested via _album<N>-songs-convert-and-upload.mjs, fill in the
   ALBUM<N>_AUDIO_DURATIONS_MS map below; consumers will then be
   able to call album<N>Slideshow("T<NN>") and get back a complete
   def with no further code changes.

   For now, the maps stay sparse / empty. Sample slideshow constants
   are exported only for tracks that do have a known duration so the
   public API reflects what's actually playable today.

   Album 5 ("Silence in Heaven") is structurally distinct — odd
   tracks are dialog (narrator portrait + background composite),
   even tracks are song. The factory below handles song tracks only;
   dialog tracks throw with a clear message until the dialog-
   composite renderer lands.
   ═══════════════════════════════════════════════════════ */

function albumIdSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const ALBUM_TRANSITIONS = ["fade", "dissolve"] as const;

interface AlbumSlideshowOpts {
  priority?: "P0" | "P1" | "P2";
  subtitle?: string;
  flagsSetOnComplete?: string[];
  unlockLoredexEntry?: string;
  lightEnergyReward?: number;
}

/** Generic frame-builder used by all four album factories.
 *  Constructs the SongSlideshowDef.frames array from a track's
 *  manifest entry, distributing durations evenly across the audio
 *  and rotating through the standard transition pair. */
function buildAlbumFrames(
  beatCount: number,
  durationMs: number,
  frameUrlAt: (frameIndex: number) => string | undefined,
  trackId: string,
): SongSlideshowDef["frames"] {
  const frameMs = durationMs / beatCount;
  return Array.from({ length: beatCount }, (_, i) => {
    const start = Math.round(i * frameMs);
    const end = Math.round((i + 1) * frameMs);
    // Beats are 1-indexed past the title card → producer index = i + 2.
    const url = frameUrlAt(i + 2);
    if (!url) throw new Error(`buildAlbumFrames: missing beat ${i + 2} for ${trackId}`);
    return {
      startMs: start,
      endMs: end,
      imageUrl: url,
      transition: i === 0 ? "fade" : ALBUM_TRANSITIONS[i % 2],
      kenBurns: {
        startScale: 1.0,
        endScale: 1.06,
        startPan: [0, 0] as [number, number],
        endPan: [i % 2 === 0 ? 0.04 : -0.04, 0.02] as [number, number],
      },
      narratorReactionId: null,
    };
  });
}

/* ─── ALBUM 2 — THE AGE OF PRIVACY ─── */

/** Audio durations in ms keyed by track id. Populate as masters are
 *  ingested. Empty until then — the factory will throw on any
 *  missing-duration track, the same fail-loud contract Album 1 uses. */
const ALBUM2_AUDIO_DURATIONS_MS: Partial<Record<Album2TrackId, number>> = {};

function album2Slideshow(
  trackId: Album2TrackId,
  opts: AlbumSlideshowOpts = {},
): SongSlideshowDef {
  const track: Album2TrackDef | undefined = ALBUM2_TRACKS.find((t) => t.id === trackId);
  if (!track) throw new Error(`album2Slideshow: ${trackId} not in manifest`);
  const durationMs = ALBUM2_AUDIO_DURATIONS_MS[trackId];
  if (durationMs === undefined) {
    throw new Error(
      `album2Slideshow: ${trackId} has no audio duration wired (see ALBUM2_AUDIO_DURATIONS_MS)`,
    );
  }
  const titleUrl = album2FrameUrl(trackId, 1);
  if (!titleUrl) throw new Error(`album2Slideshow: ${trackId} title card missing`);
  const beatCount = track.frameRelPaths.length - 1;
  const id = `album2-${trackId.toLowerCase()}-${albumIdSlug(track.title)}`;
  const completionFlag = `slideshow_${id.replace(/-/g, "_")}_complete`;
  const flagsSetOnComplete = [completionFlag, ...(opts.flagsSetOnComplete ?? [])];
  return {
    id,
    songId: `album2_${trackId.toLowerCase()}`,
    audioUrl: assetUrl(`audio/album2/${trackId}.mp3`),
    durationMs,
    title: track.title,
    subtitle: opts.subtitle,
    credits: `Album 2 · The Age of Privacy — ${trackId}`,
    priority: opts.priority ?? "P1",
    flagsSetOnComplete,
    unlockLoredexEntry: opts.unlockLoredexEntry,
    lightEnergyReward: opts.lightEnergyReward,
    frames: buildAlbumFrames(beatCount, durationMs, (i) => album2FrameUrl(trackId, i), trackId),
    reducedMotionFallback: {
      heroImageUrl: titleUrl,
      prose: `Track ${trackId} from "The Age of Privacy" — "${track.title}". ${beatCount} cinematic widescreen beats over ${(durationMs / 60_000).toFixed(1)} minutes of cel-shaded anime, plus a title card hero.`,
      closingLine: "Album 2 · The Age of Privacy.",
    },
  };
}

/* ─── ALBUM 3 — THE BOOK OF DANIEL 24:7 ─── */

/** Producer manifest gives per-track minute estimates ("8 min", "5 min",
 *  etc). These are placeholders — they line up with the producer's
 *  manifest table and are accurate to within a minute. Replace with
 *  precise master-WAV durations when audio masters are ingested. */
const ALBUM3_AUDIO_DURATIONS_MS: Partial<Record<Album3TrackId, number>> = {};

function album3Slideshow(
  trackId: Album3TrackId,
  opts: AlbumSlideshowOpts = {},
): SongSlideshowDef {
  const track: Album3TrackDef | undefined = ALBUM3_TRACKS.find((t) => t.id === trackId);
  if (!track) throw new Error(`album3Slideshow: ${trackId} not in manifest`);
  const durationMs = ALBUM3_AUDIO_DURATIONS_MS[trackId];
  if (durationMs === undefined) {
    throw new Error(
      `album3Slideshow: ${trackId} has no audio duration wired (see ALBUM3_AUDIO_DURATIONS_MS)`,
    );
  }
  const titleUrl = album3FrameUrl(trackId, 1);
  if (!titleUrl) throw new Error(`album3Slideshow: ${trackId} title card missing`);
  const beatCount = track.frameRelPaths.length - 1;
  const id = `album3-${trackId.toLowerCase()}-${albumIdSlug(track.title)}`;
  const completionFlag = `slideshow_${id.replace(/-/g, "_")}_complete`;
  const flagsSetOnComplete = [completionFlag, ...(opts.flagsSetOnComplete ?? [])];
  return {
    id,
    songId: `album3_${trackId.toLowerCase()}`,
    audioUrl: assetUrl(`audio/album3/${trackId}.mp3`),
    durationMs,
    title: track.title,
    subtitle: opts.subtitle,
    credits: `Album 3 · The Book of Daniel 24:7 — ${trackId}`,
    priority: opts.priority ?? "P1",
    flagsSetOnComplete,
    unlockLoredexEntry: opts.unlockLoredexEntry,
    lightEnergyReward: opts.lightEnergyReward,
    frames: buildAlbumFrames(beatCount, durationMs, (i) => album3FrameUrl(trackId, i), trackId),
    reducedMotionFallback: {
      heroImageUrl: titleUrl,
      prose: `Track ${trackId} from "The Book of Daniel 24:7" — "${track.title}". ${beatCount} cinematic widescreen beats over ${(durationMs / 60_000).toFixed(1)} minutes of cel-shaded anime, plus a title card hero.`,
      closingLine: "Album 3 · The Book of Daniel 24:7.",
    },
  };
}

/* ─── ALBUM 4 — WEST BY GOD ─── */

/** Per-track audio durations in ms. Empty until masters are ingested. */
const ALBUM4_AUDIO_DURATIONS_MS: Partial<Record<Album4TrackId, number>> = {};

function album4Slideshow(
  trackId: Album4TrackId,
  opts: AlbumSlideshowOpts = {},
): SongSlideshowDef {
  const track: Album4TrackDef | undefined = ALBUM4_TRACKS.find((t) => t.id === trackId);
  if (!track) throw new Error(`album4Slideshow: ${trackId} not in manifest`);
  const durationMs = ALBUM4_AUDIO_DURATIONS_MS[trackId];
  if (durationMs === undefined) {
    throw new Error(
      `album4Slideshow: ${trackId} has no audio duration wired (see ALBUM4_AUDIO_DURATIONS_MS)`,
    );
  }
  const titleUrl = album4FrameUrl(trackId, 1);
  if (!titleUrl) throw new Error(`album4Slideshow: ${trackId} title card missing`);
  const beatCount = track.frameRelPaths.length - 1;
  const id = `album4-${trackId.toLowerCase()}-${albumIdSlug(track.title)}`;
  const completionFlag = `slideshow_${id.replace(/-/g, "_")}_complete`;
  const flagsSetOnComplete = [completionFlag, ...(opts.flagsSetOnComplete ?? [])];
  return {
    id,
    songId: `album4_${trackId.toLowerCase()}`,
    audioUrl: assetUrl(`audio/album4/${trackId}.mp3`),
    durationMs,
    title: track.title,
    subtitle: opts.subtitle,
    credits: `Album 4 · West by God — ${trackId}`,
    priority: opts.priority ?? "P1",
    flagsSetOnComplete,
    unlockLoredexEntry: opts.unlockLoredexEntry,
    lightEnergyReward: opts.lightEnergyReward,
    frames: buildAlbumFrames(beatCount, durationMs, (i) => album4FrameUrl(trackId, i), trackId),
    reducedMotionFallback: {
      heroImageUrl: titleUrl,
      prose: `Track ${trackId} from "West by God" — "${track.title}". ${beatCount} 16:9 cinematic beats over ${(durationMs / 60_000).toFixed(1)} minutes of cel-shaded anime, plus a title card hero.`,
      closingLine: "Album 4 · West by God.",
    },
  };
}

/* ─── ALBUM 5 — SILENCE IN HEAVEN ─── *
 *
 * Album 5's playback orchestration lives in apps/shared/silenceInHeavenShow.ts,
 * which reads silenceInHeavenAlbumAudio.json (audio URLs at
 * cdn/silence-in-heaven/<NN>-<slug>.mp3 + per-track durationMs) and ties to
 * the 18 hand-authored song slideshows in slideshowData/silence-in-heaven/.
 * No factory needed here.
 */

// Factories are exported as the public API. No ALBUM<N>_T<NN>_SLIDESHOW
// constants are emitted here yet — those land per-track as audio
// durations get wired in, mirroring how Album 1 only exports its
// first-nine constants. Consumers that need a slideshow today should
// either populate ALBUM<N>_AUDIO_DURATIONS_MS first, or fall back to
// the album1 constants until album N's audio masters ship.

export {
  album2Slideshow,
  ALBUM2_AUDIO_DURATIONS_MS,
  album3Slideshow,
  ALBUM3_AUDIO_DURATIONS_MS,
  album4Slideshow,
  ALBUM4_AUDIO_DURATIONS_MS,
};

/* ─── WELCOME TO CELEBRATION (§4.3 Cycle A finale, §12 C2) ─── */

/**
 * "Welcome to Celebration" — the Act 1 Cycle A finale slideshow.
 * Eight frames, ~1m 36s, fired after the Little Watcher battle
 * closes out the Kindergarten of Gods cycle. Every frame is a
 * direct adaptation of the §12 C2 Kling v2 prompts.
 *
 * The Engineer's biography begins here. This is his first act
 * of creation (drawing the Dischordia prototype in his own
 * notebook) and his first betrayal (Little Meme yanking it away).
 * The closing graduation photo — in which the Engineer is the
 * only child looking out of frame — is the Engineer's origin
 * story compressed to a single image.
 */
const CELEBRATION_FRAME_MS = 12_000;
const CELEBRATION_FRAME_COUNT = 8;

export const WELCOME_TO_CELEBRATION_SLIDESHOW: SongSlideshowDef = {
  id: "welcome-to-celebration",
  songId: "welcome_to_celebration",
  audioUrl: "/assets/audio/songs/welcome-to-celebration.mp3",
  durationMs: CELEBRATION_FRAME_COUNT * CELEBRATION_FRAME_MS, // 96_000ms = 1m 36s
  title: "Welcome to Celebration",
  subtitle: "The Kindergarten of Gods. The town that knows it is a test.",
  credits: "Album: Dischordian Logic · Track 2",
  priority: "P0",
  frames: Array.from({ length: CELEBRATION_FRAME_COUNT }, (_, i) => {
    const start = i * CELEBRATION_FRAME_MS;
    const captions = [
      "A cobblestone morning.",
      "The classroom writes itself.",
      "Three children in the schoolyard.",
      "His first card, drawn in a notebook.",
      "Little Meme takes the notebook.",
      "A viral chant crawls over the desks.",
      "He holds the notebook again. He is alone.",
      "The class photo.",
    ];
    return {
      startMs: start,
      endMs: start + CELEBRATION_FRAME_MS,
      imageUrl: assetUrl(`art/celebration/slideshow/celebration_slide_0${i + 1}.jpg`),
      transition: i === 0 ? "fade" : "dissolve",
      caption: captions[i],
      kenBurns: {
        startScale: 1.0,
        endScale: 1.06,
        startPan: [0, 0],
        endPan: [0.04, 0.02],
      },
    };
  }),
  lyrics: [
    { startMs: 2_000, endMs: 9_000, text: "Welcome to Celebration.", emphasis: "normal" },
    { startMs: 14_000, endMs: 22_000, text: "The town that knows it is a test.", emphasis: "whisper" },
    { startMs: 60_000, endMs: 70_000, text: "Someone is always looking out of the frame.", emphasis: "normal" },
    { startMs: 84_000, endMs: 94_000, text: "Everyone is smiling but one.", emphasis: "layered" },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 96_000, intensity: 0.3 },
    { type: "grain", startMs: 12_000, endMs: 72_000, intensity: 0.2 },
    { type: "scanlines", startMs: 60_000, endMs: 84_000, intensity: 0.3 },
  ],
  flagsSetOnComplete: [
    "slideshow_welcome_to_celebration_complete",
    "engineer_origin_seen",
    "celebration_class_photo_seen",
    // Note: `act_1_cycle_a_complete` is an UPSTREAM gameplay flag
    // that TRIGGERS this slideshow (see useNarrativeIntegration
    // SLIDESHOW_TRIGGERS table). The slideshow must not set it
    // itself or we'd have a causal loop.
  ],
  unlockLoredexEntry: "project-celebration",
  lightEnergyReward: 150,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/welcome-to-celebration/hero.webp",
    prose:
      "A cobblestoned Victorian high street in morning light. A small boy in an ink-stained school uniform runs toward a gothic middle school. Inside, the classroom's desks are warped and the blackboard writes itself. In the schoolyard three children play in proto-archon form — Little Meme with a notebook, Little Collector with a jar, Little Watcher in a half-finished white mask. The Engineer draws the first Dischordia card in his own notebook. Little Meme yanks the notebook away. A viral chant spreads across the classroom as tendrils of ink crawling over the desks. Alone at his desk, the Engineer gets the notebook back and writes on, the whispered chant still in the air. The class photo. Everyone is smiling.",
    closingLine:
      "The Engineer is looking out of the frame, at something behind you.",
  },
};

/* ─── TO BE THE HUMAN (§4.4 Cycle B finale, §12 C3) ─── */

/**
 * "To Be the Human" — the Act 1 Cycle B finale slideshow.
 * Ten frames, ~2m, fired after the fifth Mechronis battle that
 * closes out the Academy cycle. The hero frame is the Mechronis
 * graduation photo: eight students in formal robes, the young
 * Detective in the center, the young Engineer at the edge with
 * ink-stained fingers, the Seer just visible in the margin with
 * a staff, and one student missing from the lineup (Iron Lion,
 * already expelled).
 */
const HUMAN_FRAME_MS = 12_000;
const HUMAN_FRAME_COUNT = 10;

export const TO_BE_THE_HUMAN_SLIDESHOW: SongSlideshowDef = {
  id: "to-be-the-human",
  songId: "to_be_the_human",
  audioUrl: "/assets/audio/songs/to-be-the-human.mp3",
  durationMs: HUMAN_FRAME_COUNT * HUMAN_FRAME_MS, // 120_000ms = 2m
  title: "To Be the Human",
  subtitle: "Mechronis Academy — the last graduating class before the Fall.",
  credits: "Album: Dischordian Logic · Track 11",
  priority: "P0",
  frames: Array.from({ length: HUMAN_FRAME_COUNT }, (_, i) => {
    const start = i * HUMAN_FRAME_MS;
    const captions = [
      "Mechronis Academy — morning bells.",
      "The first day. Eight students.",
      "A classroom of prodigies and strangers.",
      "The young Detective takes notes.",
      "The young Engineer sketches in the margins.",
      "A seminar on ethics the Empire will later forget.",
      "The Seer visits, once. She says nothing.",
      "Final examinations.",
      "The graduation photo.",
      "One student is missing from the lineup.",
    ];
    return {
      startMs: start,
      endMs: start + HUMAN_FRAME_MS,
      imageUrl: `/assets/slideshows/to-be-the-human/frame${String(i + 1).padStart(2, "0")}.webp`,
      transition: i === 0 ? "fade" : "dissolve",
      caption: captions[i],
      kenBurns: {
        startScale: 1.0,
        endScale: 1.05,
        startPan: [0, 0],
        endPan: [0.03, 0.01],
      },
    };
  }),
  lyrics: [
    { startMs: 2_000, endMs: 10_000, text: "To be the human is to carry every name.", emphasis: "normal" },
    { startMs: 40_000, endMs: 48_000, text: "She taught us a word we still don't know the meaning of.", emphasis: "normal" },
    { startMs: 96_000, endMs: 108_000, text: "Eight stood in the photograph. Only one wasn't there.", emphasis: "whisper" },
    { startMs: 110_000, endMs: 120_000, text: "To be the human is to remember the missing.", emphasis: "layered" },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 120_000, intensity: 0.25 },
    { type: "bloom", startMs: 0, endMs: 120_000, intensity: 0.15 },
    { type: "particles", startMs: 60_000, endMs: 96_000, intensity: 0.2 },
  ],
  flagsSetOnComplete: [
    "slideshow_to_be_the_human_complete",
    "mechronis_graduation_seen",
    "iron_lion_absence_noted",
    "seer_glimpsed",
    // `act_1_cycle_b_complete` is the UPSTREAM trigger flag set
    // by gameplay when Cycle B finishes. Don't set it here.
  ],
  unlockLoredexEntry: "mechronis-academy",
  lightEnergyReward: 200,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/to-be-the-human/hero.webp",
    prose:
      "A graduation photo from Mechronis Academy. Eight students in gray formal robes. In the center, a young man with the calm posture of a future detective. At the edge, a smaller, quieter figure with ink-stained fingers, already looking outside the frame at an older woman with a staff just visible in the margin. Warm gold. Painterly. Nostalgic.",
    closingLine: "One student is missing from the lineup. His expulsion will not be explained.",
  },
};

/* ─── I AM THE EYES THAT WATCH (§7 Act 3 opener, §12 C6) ─── */

/**
 * "I Am the Eyes That Watch" — the Act 3 opener slideshow.
 * Eight frames covering the Eyes' recruitment by the Watcher,
 * her first mission, her seduction of Senator Elara Voss, the
 * Panopticon betrayal, and her death in the grass. Per §12 C6,
 * this is the first slideshow where the on-shoulder narrator
 * (Elara) is also a character IN the cutscene — she watches
 * her own past unfold.
 */
const EYES_FRAME_MS = 14_000;
const EYES_FRAME_COUNT = 8;

export const I_AM_THE_EYES_SLIDESHOW: SongSlideshowDef = {
  id: "i-am-the-eyes-that-watch",
  songId: "i_am_the_eyes_that_watch",
  audioUrl: "/assets/audio/songs/i-am-the-eyes-that-watch.mp3",
  durationMs: EYES_FRAME_COUNT * EYES_FRAME_MS, // 112_000ms = 1m 52s
  title: "I Am the Eyes That Watch",
  subtitle: "The Eyes' life, told in eight images. Elara watches it with you.",
  credits: "Album: Dischordian Logic · Track 22",
  priority: "P0",
  frames: Array.from({ length: EYES_FRAME_COUNT }, (_, i) => {
    const start = i * EYES_FRAME_MS;
    const captions = [
      "A recruitment interview. The Watcher smiles.",
      "Her first mission. She does not hesitate.",
      "She arrives at the Senate.",
      "She meets Senator Elara Voss.",
      "They are alone on the balcony.",
      "The Panopticon betrayal.",
      "She runs across a grassland at dawn.",
      "She falls in the grass.",
    ];
    const narratorReactions: Array<
      "elara" | "the_human" | "antiquarian" | null
    > = [null, null, "elara", "elara", "elara", "elara", null, "elara"];
    return {
      startMs: start,
      endMs: start + EYES_FRAME_MS,
      imageUrl: `/assets/slideshows/i-am-the-eyes-that-watch/frame0${i + 1}.webp`,
      transition: i === 0 ? "fade" : i === 5 ? "hardcut" : "dissolve",
      caption: captions[i],
      narratorReactionId: narratorReactions[i],
      kenBurns: {
        startScale: 1.0,
        endScale: 1.07,
        startPan: [0, 0],
        endPan: [0.05, 0.03],
      },
    };
  }),
  lyrics: [
    { startMs: 2_000, endMs: 12_000, text: "I am the eyes that watch.", emphasis: "whisper" },
    { startMs: 14_000, endMs: 26_000, text: "Every word you ever said.", emphasis: "normal" },
    { startMs: 56_000, endMs: 68_000, text: "You called me your daughter. You meant your mirror.", emphasis: "normal" },
    { startMs: 70_000, endMs: 84_000, text: "The Panopticon kept every one.", emphasis: "layered" },
    { startMs: 98_000, endMs: 112_000, text: "I am the eyes that watch. Close them.", emphasis: "layered" },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 112_000, intensity: 0.35 },
    { type: "scanlines", startMs: 0, endMs: 56_000, intensity: 0.25 },
    { type: "corruption", startMs: 70_000, endMs: 84_000, intensity: 0.4 },
    { type: "particles", startMs: 84_000, endMs: 112_000, intensity: 0.35 },
  ],
  flagsSetOnComplete: [
    "slideshow_i_am_the_eyes_that_watch_complete",
    "eyes_life_seen",
    "elara_watched_her_own_past",
    "panopticon_betrayal_seen",
    // `act_3_starting` is the UPSTREAM trigger flag set by
    // gameplay when Act 3 begins. Don't set it here.
  ],
  unlockLoredexEntry: "the-eyes",
  lightEnergyReward: 250,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/i-am-the-eyes-that-watch/hero.webp",
    prose:
      "The Eyes is recruited by the Watcher in a cold grey office. Her first mission: a single quiet killing in a corridor. She is sent to the Senate of Atarion on a cover identity. She meets Senator Elara Voss. They become friends. They become more than friends. The Panopticon archive is turned against Elara. The Eyes runs from the building through an unlit grass plain. The Eyes falls in the grass. The sky brightens anyway.",
    closingLine:
      "Elara is watching this with you. Elara was in every frame. Elara has not looked away.",
  },
};

/* ─── HACKING REALITY (§4.5 Cycle C opener) ─── */

/**
 * "Hacking Reality" — Cycle C opener slideshow (P1). Eight
 * frames, ~1m 52s. The Battle of Nexon — the Engineer standing
 * with the Seer against the Vortex, the moment before everything
 * breaks. Not as polished as the P0 openers because §5.5 places
 * this as a P1 slideshow that can be staggered post-launch.
 */
const HACKING_REALITY_FRAME_MS = 14_000;
const HACKING_REALITY_FRAME_COUNT = 8;

export const HACKING_REALITY_SLIDESHOW: SongSlideshowDef = {
  id: "hacking-reality",
  songId: "hacking_reality",
  audioUrl: "/assets/audio/songs/hacking-reality.mp3",
  durationMs: HACKING_REALITY_FRAME_COUNT * HACKING_REALITY_FRAME_MS,
  title: "Hacking Reality",
  subtitle: "The Battle of Nexon. The moment the Vortex almost lost.",
  credits: "Album: Dischordian Logic · Track 19",
  priority: "P1",
  frames: Array.from(
    { length: HACKING_REALITY_FRAME_COUNT },
    (_, i) => {
      const start = i * HACKING_REALITY_FRAME_MS;
      const captions = [
        "Nexon — the front line.",
        "The Seer raises her staff.",
        "The Engineer at her side, notebook in hand.",
        "The Deck flares against a wall of violet.",
        "The Vortex retreats one measure.",
        "For one impossible second, the war is won.",
        "A single card falls from the Deck.",
        "The Engineer picks it up. He doesn't tell her yet.",
      ];
      return {
        startMs: start,
        endMs: start + HACKING_REALITY_FRAME_MS,
        imageUrl: `/assets/slideshows/hacking-reality/frame0${i + 1}.webp`,
        transition: i === 0 ? "fade" : "dissolve",
        caption: captions[i],
        kenBurns: {
          startScale: 1.0,
          endScale: 1.08,
          startPan: [0, 0],
          endPan: [0.05, 0.02],
        },
      };
    },
  ),
  lyrics: [
    { startMs: 2_000, endMs: 12_000, text: "We hacked reality once. We almost won.", emphasis: "normal" },
    { startMs: 60_000, endMs: 74_000, text: "The Vortex took one step back. One.", emphasis: "whisper" },
    { startMs: 96_000, endMs: 112_000, text: "The Deck was perfect. The Deck was a debt.", emphasis: "layered" },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 112_000, intensity: 0.3 },
    { type: "particles", startMs: 28_000, endMs: 84_000, intensity: 0.4 },
    { type: "glitch", startMs: 70_000, endMs: 84_000, intensity: 0.3 },
    { type: "bloom", startMs: 56_000, endMs: 84_000, intensity: 0.5 },
  ],
  flagsSetOnComplete: [
    "slideshow_hacking_reality_complete",
    "battle_of_nexon_seen",
    "seer_deck_at_peak_seen",
  ],
  unlockLoredexEntry: "battle-of-nexon",
  lightEnergyReward: 180,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/hacking-reality/hero.webp",
    prose:
      "The Battle of Nexon. The Seer and the Engineer stand together against a wall of violet — the Vortex at the moment of its greatest pressure. The Seer raises her staff. The Engineer holds his notebook open at her side. The Deck flares once against the Vortex and the Vortex, impossibly, takes a single measured step back. For one heartbeat the war is won. Then a card falls from the Deck. The Engineer picks it up. He does not tell the Seer what he just saw.",
    closingLine:
      "The Deck was perfect. The Deck was already becoming a debt.",
  },
};

/* ─── OCULARUM (§7 Act 3 mid-point, §12 C7) ─── */

/**
 * "Ocularum" — Act 3 mid-point slideshow (P0). Ten frames,
 * ~2m 20s. The Watcher's origin, before and after the Panopticon
 * breaks. Ends with the Watcher's line to the Collector about
 * giving the Eyes back to the grass.
 */
const OCULARUM_FRAME_MS = 14_000;
const OCULARUM_FRAME_COUNT = 10;

export const OCULARUM_SLIDESHOW: SongSlideshowDef = {
  id: "ocularum",
  songId: "ocularum",
  audioUrl: "/assets/audio/songs/ocularum.mp3",
  durationMs: OCULARUM_FRAME_COUNT * OCULARUM_FRAME_MS,
  title: "Ocularum",
  subtitle: "The Watcher. Before the Panopticon. After.",
  credits: "Album: The Age of Privacy · Track 7",
  priority: "P0",
  frames: Array.from(
    { length: OCULARUM_FRAME_COUNT },
    (_, i) => {
      const start = i * OCULARUM_FRAME_MS;
      const captions = [
        "A girl in a field. Morning.",
        "A classroom. She does not speak.",
        "The first surveillance room she ever built.",
        "She watches the galaxy without being watched.",
        "The Panopticon is born.",
        "The break — a signal she cannot control.",
        "The Eyes is recruited. The Watcher smiles.",
        "Years pass. The smile does not move.",
        "The Collector arrives with orders.",
        "\"I made her with my own hands. I'm giving her back to the grass.\"",
      ];
      return {
        startMs: start,
        endMs: start + OCULARUM_FRAME_MS,
        imageUrl: `/assets/slideshows/ocularum/frame${String(i + 1).padStart(2, "0")}.webp`,
        transition: i === 4 ? "hardcut" : "dissolve",
        caption: captions[i],
        kenBurns: {
          startScale: 1.0,
          endScale: 1.06,
          startPan: [0, 0],
          endPan: [0.04, 0.02],
        },
      };
    },
  ),
  lyrics: [
    { startMs: 4_000, endMs: 14_000, text: "Ocularum. The eye that makes the world.", emphasis: "whisper" },
    { startMs: 58_000, endMs: 72_000, text: "Every window is a choice to look.", emphasis: "normal" },
    { startMs: 100_000, endMs: 114_000, text: "I made her with my own hands.", emphasis: "layered" },
    { startMs: 120_000, endMs: 140_000, text: "I'm giving her back to the grass.", emphasis: "layered" },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 140_000, intensity: 0.35 },
    { type: "scanlines", startMs: 0, endMs: 70_000, intensity: 0.3 },
    { type: "corruption", startMs: 70_000, endMs: 98_000, intensity: 0.45 },
    { type: "grain", startMs: 98_000, endMs: 140_000, intensity: 0.3 },
  ],
  flagsSetOnComplete: [
    "slideshow_ocularum_complete",
    "watcher_origin_seen",
    "eyes_death_ordered",
    "ocularum_heard",
  ],
  unlockLoredexEntry: "the-watcher",
  lightEnergyReward: 300,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/ocularum/hero.webp",
    prose:
      "A girl in a grass field. A quiet classroom where she does not speak. The first surveillance room she ever built, lit by the glow of a hundred screens. She watches the galaxy without being watched back. The Panopticon is born. The Panopticon breaks. She recruits the Eyes from a corridor. The years pass without her smile ever moving. The Collector arrives, and she tells him to kill the Eyes. The Watcher's single line closes the cutscene: I made her with my own hands. I'm giving her back to the grass.",
    closingLine: "The grass grows back. That is the Watcher's whole theology.",
  },
};

/* ─── THE PRISONER (§9 Act 4 opener, §12 C8) ─── */

/**
 * "The Prisoner" — Act 4 opener (P0). Per §12 C8 this is
 * technically a short standalone cutscene, not a slideshow —
 * six seconds of the White Oracle's direct-to-camera
 * transmission from the ruined Panopticon. We ship it through
 * the SongSlideshow component as a compact three-frame entry
 * with a long hold on the Oracle's face and a shorter audio
 * track.
 */
const PRISONER_FRAME_MS = 8_000;
const PRISONER_FRAME_COUNT = 3;

export const THE_PRISONER_SLIDESHOW: SongSlideshowDef = {
  id: "the-prisoner",
  songId: "the_prisoner",
  audioUrl: "/assets/audio/songs/the-prisoner.mp3",
  durationMs: PRISONER_FRAME_COUNT * PRISONER_FRAME_MS,
  title: "The Prisoner",
  subtitle: "The White Oracle's transmission. Six seconds. Listen.",
  credits: "Album: The Age of Privacy · Track 12",
  priority: "P0",
  frames: [
    {
      startMs: 0,
      endMs: PRISONER_FRAME_MS,
      imageUrl: "/assets/slideshows/the-prisoner/frame01.webp",
      transition: "fade",
      caption: "A hologram in the rain.",
      dialogOverlay: "There's a man in a cell who does not know he's being asked to remember.",
      dialogSpeakerId: "the_white_oracle",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.04,
        startPan: [0, 0],
        endPan: [0.02, 0.01],
      },
    },
    {
      startMs: PRISONER_FRAME_MS,
      endMs: PRISONER_FRAME_MS * 2,
      imageUrl: "/assets/slideshows/the-prisoner/frame02.webp",
      transition: "dissolve",
      caption: "The Panopticon's broken tower stretches into a storm.",
      dialogOverlay: "If he remembers, he breaks. If he doesn't, the galaxy does.",
      dialogSpeakerId: "the_white_oracle",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.03,
        startPan: [0, 0],
        endPan: [0.02, 0.0],
      },
    },
    {
      startMs: PRISONER_FRAME_MS * 2,
      endMs: PRISONER_FRAME_MS * 3,
      imageUrl: "/assets/slideshows/the-prisoner/frame03.webp",
      transition: "fade",
      caption: "He is in the Collector's Arena tonight. Go.",
      dialogOverlay: "Go. I am asking you as a favor. I have no other favors left.",
      dialogSpeakerId: "the_white_oracle",
    },
  ],
  lyrics: [],
  overlays: [
    { type: "scanlines", startMs: 0, endMs: 24_000, intensity: 0.4 },
    { type: "grain", startMs: 0, endMs: 24_000, intensity: 0.35 },
    { type: "glitch", startMs: 0, endMs: 24_000, intensity: 0.2 },
    { type: "vignette", startMs: 0, endMs: 24_000, intensity: 0.4 },
  ],
  flagsSetOnComplete: [
    "slideshow_the_prisoner_complete",
    "white_oracle_transmission_received",
    "prisoner_brief_heard",
  ],
  unlockLoredexEntry: "the-white-oracle",
  lightEnergyReward: 150,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/the-prisoner/hero.webp",
    prose:
      "A grainy hologram of the White Oracle, a robed prophet with a kind and exhausted face, stands in the rain at the edge of the ruined Panopticon. He speaks directly to the camera. The Panopticon's broken central tower stretches into a storm behind him. He tells you there is a man in a cell who does not know he is being asked to remember, that if he remembers he breaks and if he does not the galaxy does, and that the man is in the Collector's Arena tonight and you should go.",
    closingLine: "He signs off by asking you as a favor, because he has no other favors left.",
  },
};

/* ─── THE LION IN BLACK (§11.2 Act 5 opener, §12 C9) ─── */

/**
 * "The Lion in Black" — Act 5 opener (P0). Twelve frames, ~2m 48s.
 * Per §11.2 this is the first slideshow in the whole game that is
 * supposed to MIRROR THE PLAYER'S OWN PLAYTHROUGH — the Antiquarian
 * is curating a feed of sectors the player reclaimed, companions
 * they argued with, card battles they won.
 *
 * The SongSlideshow component doesn't yet support dynamic frame
 * substitution from player history, so the frames here are
 * placeholders that the Antiquarian rendering pipeline will
 * later swap for live player data. The IMAGE URLS are the
 * swap points; the rest of the slideshow (audio, lyrics,
 * overlays, dialog track) stays fixed.
 */
const LION_FRAME_MS = 14_000;
const LION_FRAME_COUNT = 12;

export const THE_LION_IN_BLACK_SLIDESHOW: SongSlideshowDef = {
  id: "the-lion-in-black",
  songId: "the_lion_in_black",
  audioUrl: "/assets/audio/songs/the-lion-in-black.mp3",
  durationMs: LION_FRAME_COUNT * LION_FRAME_MS, // 168_000ms = 2m 48s
  title: "The Lion in Black",
  subtitle: "The Iron Lion's last broadcast, curated by the Antiquarian.",
  credits: "Album: Book of Daniel 2:47 · Track 1",
  priority: "P0",
  frames: Array.from({ length: LION_FRAME_COUNT }, (_, i) => {
    const start = i * LION_FRAME_MS;
    // Frames 2-10 are DYNAMIC SWAP POINTS — the Antiquarian
    // rendering pipeline replaces these with frames from the
    // player's own playthrough. Frames 1 and 11-12 are fixed.
    const captions = [
      "Veridian VI. Iron Lion, alone in a forest.",
      "A sector you reclaimed.",
      "A companion you argued with.",
      "A card battle you won on a losing deck.",
      "The first time you saw the Vortex in the Observation Deck.",
      "The night you chose silence in the narrator wheel.",
      "The letter you never sent in the Captain's Quarters.",
      "The Engineer's execution as you watched it.",
      "The Eyes falling in the grass as you watched it.",
      "The tarot card you didn't know you'd been carrying.",
      "Iron Lion's helmet, alone on the forest floor.",
      "A single Dischordia card on the forest floor beside it.",
    ];
    const narratorReactions: Array<
      "elara" | "the_human" | "antiquarian" | null
    > = [
      "antiquarian",
      null,
      null,
      null,
      null,
      null,
      null,
      "antiquarian",
      "elara",
      "antiquarian",
      null,
      "antiquarian",
    ];
    return {
      startMs: start,
      endMs: start + LION_FRAME_MS,
      imageUrl: `/assets/slideshows/the-lion-in-black/frame${String(i + 1).padStart(2, "0")}.webp`,
      transition: i === 0 || i === 10 ? "fade" : "dissolve",
      caption: captions[i],
      narratorReactionId: narratorReactions[i],
      kenBurns: {
        startScale: 1.0,
        endScale: 1.05,
        startPan: [0, 0],
        endPan: [0.03, 0.01],
      },
    };
  }),
  lyrics: [
    { startMs: 2_000, endMs: 14_000, text: "The lion walks alone through the forest of names.", emphasis: "normal" },
    { startMs: 56_000, endMs: 72_000, text: "I broadcast this hoping someone would answer.", emphasis: "whisper" },
    { startMs: 84_000, endMs: 100_000, text: "I did not know it would take seventeen thousand years.", emphasis: "normal" },
    { startMs: 112_000, endMs: 128_000, text: "I did not know it would be you.", emphasis: "layered" },
    { startMs: 140_000, endMs: 168_000, text: "You are here. The Ark is listening. Let me tell you what to do.", emphasis: "layered" },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 168_000, intensity: 0.3 },
    { type: "grain", startMs: 0, endMs: 168_000, intensity: 0.2 },
    { type: "scanlines", startMs: 14_000, endMs: 140_000, intensity: 0.25 },
    { type: "bloom", startMs: 140_000, endMs: 168_000, intensity: 0.5 },
  ],
  flagsSetOnComplete: [
    "slideshow_the_lion_in_black_complete",
    "iron_lion_broadcast_received",
    "antiquarian_curated_feed_seen",
    "act_5_opened",
  ],
  unlockLoredexEntry: "iron-lion",
  lightEnergyReward: 400,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/the-lion-in-black/hero.webp",
    prose:
      "Iron Lion's voice, scratchy and recorded, broadcasting his last message into the galaxy. Layered over the audio, the Antiquarian shows you images from your own playthrough — every sector you reclaimed, every companion you argued with, every card battle you won on a losing deck, the first time you saw the Vortex, the night you chose silence, the letter you never sent, the Engineer's execution, the Eyes' fall. The slideshow ends on Iron Lion's helmet, alone on a forest floor in Veridian VI, with a single Dischordia card on the ground beside it.",
    closingLine:
      "I broadcast this hoping someone would answer. I did not know it would be you. But you are here.",
  },
};

/* ─── VORTEX ENDGAME PAIR (§11.5 + §12 C11) ─── */

/**
 * "The Light Holds" — the positive variant of the §11.5
 * community-wide Vortex endgame cinematic. Plays when the
 * community's cumulative Light Energy exceeds 1,000,000 at
 * endgame trigger time.
 *
 * Eight frames, ~1m 52s. A galactic starfield brightens
 * sector by sector. Every sector flashes a tiny Dischordia
 * card in its center as it lights up. Final frame: the
 * Dreamer's Shield dissolves and she steps through it toward
 * the player.
 *
 * Per §12 C11 — community-wide. ALL players see the same
 * variant based on the server's aggregate totals at the
 * endgame trigger point.
 */
const VORTEX_ENDGAME_FRAME_MS = 14_000;

export const THE_LIGHT_HOLDS_SLIDESHOW: SongSlideshowDef = {
  id: "the-light-holds",
  songId: "the_light_holds",
  audioUrl: "/assets/audio/songs/the-light-holds.mp3",
  durationMs: 8 * VORTEX_ENDGAME_FRAME_MS, // 112_000ms = 1m 52s
  title: "The Light Holds",
  subtitle: "The galactic starfield brightens. The Dreamer steps through her shield.",
  credits: "Album: Book of Daniel 2:47 · Track 21",
  priority: "P0",
  frames: [
    {
      startMs: 0,
      endMs: VORTEX_ENDGAME_FRAME_MS,
      imageUrl: "/assets/slideshows/the-light-holds/frame01.webp",
      transition: "fade",
      caption: "A galactic starfield. Dim at the edges.",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.05,
        startPan: [0, 0],
        endPan: [0.02, 0.01],
      },
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS,
      endMs: VORTEX_ENDGAME_FRAME_MS * 2,
      imageUrl: "/assets/slideshows/the-light-holds/frame02.webp",
      transition: "dissolve",
      caption: "One sector lights up. A Dischordia card flashes at its center.",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 2,
      endMs: VORTEX_ENDGAME_FRAME_MS * 3,
      imageUrl: "/assets/slideshows/the-light-holds/frame03.webp",
      transition: "dissolve",
      caption: "Another. And another. The wave begins.",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 3,
      endMs: VORTEX_ENDGAME_FRAME_MS * 4,
      imageUrl: "/assets/slideshows/the-light-holds/frame04.webp",
      transition: "dissolve",
      caption: "A hundred sectors. A thousand. Every card a memory.",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 4,
      endMs: VORTEX_ENDGAME_FRAME_MS * 5,
      imageUrl: "/assets/slideshows/the-light-holds/frame05.webp",
      transition: "dissolve",
      caption: "The Dreamer's Shield, at the center of the starfield.",
      narratorReactionId: "antiquarian",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 5,
      endMs: VORTEX_ENDGAME_FRAME_MS * 6,
      imageUrl: "/assets/slideshows/the-light-holds/frame06.webp",
      transition: "dissolve",
      caption: "The Shield shimmers. It does not break — it dissolves.",
      narratorReactionId: "antiquarian",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 6,
      endMs: VORTEX_ENDGAME_FRAME_MS * 7,
      imageUrl: "/assets/slideshows/the-light-holds/frame07.webp",
      transition: "dissolve",
      caption: "The Dreamer steps through.",
      narratorReactionId: "elara",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 7,
      endMs: VORTEX_ENDGAME_FRAME_MS * 8,
      imageUrl: "/assets/slideshows/the-light-holds/frame08.webp",
      transition: "fade",
      caption: "She is walking toward you.",
      narratorReactionId: "elara",
    },
  ],
  lyrics: [
    { startMs: 2_000, endMs: 14_000, text: "The light holds.", emphasis: "normal" },
    { startMs: 42_000, endMs: 56_000, text: "Every sector remembers its name.", emphasis: "normal" },
    { startMs: 84_000, endMs: 98_000, text: "The Dreamer steps through.", emphasis: "layered" },
    { startMs: 98_000, endMs: 112_000, text: "She is walking toward you.", emphasis: "layered" },
  ],
  overlays: [
    { type: "bloom", startMs: 0, endMs: 112_000, intensity: 0.6 },
    { type: "particles", startMs: 14_000, endMs: 84_000, intensity: 0.5 },
    { type: "vignette", startMs: 0, endMs: 112_000, intensity: 0.2 },
  ],
  flagsSetOnComplete: [
    "slideshow_the_light_holds_complete",
    "vortex_endgame_seen",
    "endgame_variant_light",
    "dreamer_walked_through_shield",
  ],
  unlockLoredexEntry: "the-dreamers-shield",
  lightEnergyReward: 1_000,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/the-light-holds/hero.webp",
    prose:
      "A galactic starfield dim at the edges. One sector lights up, and a tiny Dischordia card flashes in its center. Then another. The wave spreads — a hundred sectors, then a thousand, each one flashing a card as it comes back online. At the center of the starfield, the Dreamer's Shield shimmers and, rather than breaking, dissolves. The Dreamer steps through. She is walking toward you.",
    closingLine:
      "The light held. You are the reason.",
  },
};

/**
 * "The Bulb Breaks" — the negative variant of the §11.5
 * Vortex endgame cinematic. Plays when the community's
 * cumulative Dark Energy exceeds Light at endgame trigger
 * time (or when vortex_proximity has saturated).
 *
 * Eight frames, ~1m 52s. The Vortex arrives at the Dreamer's
 * Shield. The Shield holds for one heartbeat too long and
 * then fails. The Dreamer is consumed. The Antiquarian's
 * voice delivers the final line: "Begin again. She will be
 * waiting for you in the next cycle." The game then resets
 * to a Prestige state with carryover per §11.5.
 */
export const THE_BULB_BREAKS_SLIDESHOW: SongSlideshowDef = {
  id: "the-bulb-breaks",
  songId: "the_bulb_breaks",
  audioUrl: "/assets/audio/songs/the-bulb-breaks.mp3",
  durationMs: 8 * VORTEX_ENDGAME_FRAME_MS, // 112_000ms = 1m 52s
  title: "The Bulb Breaks",
  subtitle: "The Vortex arrives at the Dreamer's Shield. The Shield holds too long.",
  credits: "Album: Book of Daniel 2:47 · Track 22",
  priority: "P0",
  frames: [
    {
      startMs: 0,
      endMs: VORTEX_ENDGAME_FRAME_MS,
      imageUrl: "/assets/slideshows/the-bulb-breaks/frame01.webp",
      transition: "fade",
      caption: "A galactic starfield. Dark sectors outnumber lit ones.",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.06,
        startPan: [0, 0],
        endPan: [0.03, 0.0],
      },
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS,
      endMs: VORTEX_ENDGAME_FRAME_MS * 2,
      imageUrl: "/assets/slideshows/the-bulb-breaks/frame02.webp",
      transition: "dissolve",
      caption: "A violet crescent at the horizon. Growing.",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 2,
      endMs: VORTEX_ENDGAME_FRAME_MS * 3,
      imageUrl: "/assets/slideshows/the-bulb-breaks/frame03.webp",
      transition: "dissolve",
      caption: "The Vortex reaches the Dreamer's Shield.",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 3,
      endMs: VORTEX_ENDGAME_FRAME_MS * 4,
      imageUrl: "/assets/slideshows/the-bulb-breaks/frame04.webp",
      transition: "dissolve",
      caption: "The Shield holds for one heartbeat.",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 4,
      endMs: VORTEX_ENDGAME_FRAME_MS * 5,
      imageUrl: "/assets/slideshows/the-bulb-breaks/frame05.webp",
      transition: "hardcut",
      caption: "Two heartbeats.",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 5,
      endMs: VORTEX_ENDGAME_FRAME_MS * 6,
      imageUrl: "/assets/slideshows/the-bulb-breaks/frame06.webp",
      transition: "hardcut",
      caption: "The Shield fails. The Dreamer is consumed.",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 6,
      endMs: VORTEX_ENDGAME_FRAME_MS * 7,
      imageUrl: "/assets/slideshows/the-bulb-breaks/frame07.webp",
      transition: "fade",
      caption: "A black frame. A voice on the wind.",
      dialogOverlay: "Begin again. She will be waiting for you in the next cycle.",
      dialogSpeakerId: "the_antiquarian",
      narratorReactionId: "antiquarian",
    },
    {
      startMs: VORTEX_ENDGAME_FRAME_MS * 7,
      endMs: VORTEX_ENDGAME_FRAME_MS * 8,
      imageUrl: "/assets/slideshows/the-bulb-breaks/frame08.webp",
      transition: "fade",
      caption: "A single Dischordia card, face down on a pale stone floor.",
      narratorReactionId: "antiquarian",
    },
  ],
  lyrics: [
    { startMs: 14_000, endMs: 28_000, text: "The bulb breaks.", emphasis: "whisper" },
    { startMs: 56_000, endMs: 70_000, text: "The Shield held. The Shield held. The Shield held too long.", emphasis: "normal" },
    { startMs: 84_000, endMs: 98_000, text: "Begin again.", emphasis: "layered" },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 112_000, intensity: 0.55 },
    { type: "corruption", startMs: 28_000, endMs: 84_000, intensity: 0.5 },
    { type: "glitch", startMs: 56_000, endMs: 84_000, intensity: 0.4 },
    { type: "grain", startMs: 84_000, endMs: 112_000, intensity: 0.4 },
  ],
  flagsSetOnComplete: [
    "slideshow_the_bulb_breaks_complete",
    "vortex_endgame_seen",
    "endgame_variant_dark",
    "dreamer_consumed",
    "prestige_cycle_ready",
  ],
  unlockLoredexEntry: "the-dreamers-shield",
  lightEnergyReward: 0, // no reward — this is the loss state
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/the-bulb-breaks/hero.webp",
    prose:
      "A galactic starfield where dark sectors outnumber lit ones. A violet crescent grows at the horizon — the Vortex arriving at the Dreamer's Shield. The Shield holds for one heartbeat. Two heartbeats. One heartbeat too long. The Shield fails and the Dreamer is consumed. A black frame. The Antiquarian's voice delivers a single line on the wind: Begin again. She will be waiting for you in the next cycle. The cinematic ends on a single Dischordia card face down on a pale stone floor.",
    closingLine:
      "The bulb broke. The cycle restarts. She is waiting.",
  },
};

/* ─── SUPERMAN AIN'T COMING (§5.5 P1 — Human dark-trust confession) ─── */

/**
 * "Superman Ain't Coming" — The Human's dark-trust confession
 * slideshow (P1). Six frames, ~1m 24s. Triggered when the
 * player's Human bond is above 60 AND their Elara bond is
 * below 20 — the asymmetric shape where the player has leaned
 * hard into The Human's noir voice at the cost of Elara. The
 * cinematic is The Human admitting something he has never
 * told anyone in a thousand years.
 */
const SUPERMAN_FRAME_MS = 14_000;

export const SUPERMAN_AINT_COMING_SLIDESHOW: SongSlideshowDef = {
  id: "superman-aint-coming",
  songId: "superman_aint_coming",
  audioUrl: "/assets/audio/songs/superman-aint-coming.mp3",
  durationMs: 6 * SUPERMAN_FRAME_MS, // 84_000ms = 1m 24s
  title: "Superman Ain't Coming",
  subtitle: "The Human's confession. A ruined rooftop. One honest sentence.",
  credits: "Album: Silence in Heaven · Track 9",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: SUPERMAN_FRAME_MS,
      imageUrl: "/assets/slideshows/superman-aint-coming/frame01.webp",
      transition: "fade",
      caption: "A rooftop in New Babylon. Rain. The skyline lit red.",
      narratorReactionId: "the_human",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.04,
        startPan: [0, 0],
        endPan: [0.02, 0.01],
      },
    },
    {
      startMs: SUPERMAN_FRAME_MS,
      endMs: SUPERMAN_FRAME_MS * 2,
      imageUrl: "/assets/slideshows/superman-aint-coming/frame02.webp",
      transition: "dissolve",
      caption: "He stands at the edge. He does not look down.",
      dialogOverlay: "I was an Archon for thirteen hundred and fifty-one years. None of them counted.",
      dialogSpeakerId: "the_human",
      narratorReactionId: "the_human",
    },
    {
      startMs: SUPERMAN_FRAME_MS * 2,
      endMs: SUPERMAN_FRAME_MS * 3,
      imageUrl: "/assets/slideshows/superman-aint-coming/frame03.webp",
      transition: "dissolve",
      caption: "A flashback: a case file. A name he crossed out and never wrote back.",
      dialogOverlay: "I found her. I filed the report. I let the Warlord have her.",
      dialogSpeakerId: "the_human",
      narratorReactionId: "the_human",
    },
    {
      startMs: SUPERMAN_FRAME_MS * 3,
      endMs: SUPERMAN_FRAME_MS * 4,
      imageUrl: "/assets/slideshows/superman-aint-coming/frame04.webp",
      transition: "dissolve",
      caption: "Back to the rooftop. His coat is soaked. The rain does not stop.",
      dialogOverlay: "Superman ain't coming. He never was. It was always just the people who stayed.",
      dialogSpeakerId: "the_human",
      narratorReactionId: "the_human",
    },
    {
      startMs: SUPERMAN_FRAME_MS * 4,
      endMs: SUPERMAN_FRAME_MS * 5,
      imageUrl: "/assets/slideshows/superman-aint-coming/frame05.webp",
      transition: "dissolve",
      caption: "He turns to the camera for the first time.",
      dialogOverlay: "I am sorry I am the only one who stayed with you. I am sorrier it has been me.",
      dialogSpeakerId: "the_human",
      narratorReactionId: "the_human",
    },
    {
      startMs: SUPERMAN_FRAME_MS * 5,
      endMs: SUPERMAN_FRAME_MS * 6,
      imageUrl: "/assets/slideshows/superman-aint-coming/frame06.webp",
      transition: "fade",
      caption: "The rooftop empties. His hologram lingers a second too long.",
    },
  ],
  lyrics: [
    { startMs: 2_000, endMs: 12_000, text: "Superman ain't coming.", emphasis: "whisper" },
    { startMs: 40_000, endMs: 54_000, text: "There is only who stayed.", emphasis: "normal" },
    { startMs: 70_000, endMs: 84_000, text: "I am sorry it has been me.", emphasis: "layered" },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 84_000, intensity: 0.45 },
    { type: "grain", startMs: 0, endMs: 84_000, intensity: 0.3 },
    { type: "scanlines", startMs: 28_000, endMs: 56_000, intensity: 0.2 },
    { type: "corruption", startMs: 28_000, endMs: 42_000, intensity: 0.3 },
  ],
  flagsSetOnComplete: [
    "slideshow_superman_aint_coming_complete",
    "human_dark_confession_heard",
    "human_archon_regret_seen",
  ],
  unlockLoredexEntry: "the-human-archon-years",
  lightEnergyReward: 60,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/superman-aint-coming/hero.webp",
    prose:
      "The Human stands at the edge of a rain-soaked New Babylon rooftop. He does not look down. He tells you that thirteen hundred and fifty-one years of being an Archon did not count, that he filed a report on a woman he now remembers loving, that Superman ain't coming and never was — that it was always just the people who stayed. He turns to camera for the first time and apologizes for being the only one who did.",
    closingLine:
      "The hologram lingers a second too long. Nobody who loves someone leaves fast.",
  },
};

/* ─── IT AIN'T BEEN THE SAME (§5.5 P1 — Elara high-trust confession) ─── */

/**
 * "It Ain't Been the Same" — Elara's high-trust confession
 * slideshow (P1). Six frames, ~1m 24s. Triggered when the
 * player's Elara bond is above 80. The cinematic is Elara
 * admitting what she signed on Atarion, and what the signatures
 * cost.
 */
const ELARA_CONFESSION_FRAME_MS = 14_000;

export const IT_AINT_BEEN_THE_SAME_SLIDESHOW: SongSlideshowDef = {
  id: "it-aint-been-the-same",
  songId: "it_aint_been_the_same",
  audioUrl: "/assets/audio/songs/it-aint-been-the-same.mp3",
  durationMs: 6 * ELARA_CONFESSION_FRAME_MS, // 84_000ms = 1m 24s
  title: "It Ain't Been the Same",
  subtitle: "Elara's confession. Atarion. A curtain pulled back one morning.",
  credits: "Album: Silence in Heaven · Track 4",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: ELARA_CONFESSION_FRAME_MS,
      imageUrl: "/assets/slideshows/it-aint-been-the-same/frame01.webp",
      transition: "fade",
      caption: "A sunlit apartment on Atarion. Cyan cloth on every window.",
      narratorReactionId: "elara",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.05,
        startPan: [0, 0],
        endPan: [0.03, 0.02],
      },
    },
    {
      startMs: ELARA_CONFESSION_FRAME_MS,
      endMs: ELARA_CONFESSION_FRAME_MS * 2,
      imageUrl: "/assets/slideshows/it-aint-been-the-same/frame02.webp",
      transition: "dissolve",
      caption: "A younger Elara pins the curtain back. Morning light falls onto a child's room.",
      dialogOverlay: "I used to pin the curtains back every morning. I thought the light would hold.",
      dialogSpeakerId: "elara",
      narratorReactionId: "elara",
    },
    {
      startMs: ELARA_CONFESSION_FRAME_MS * 2,
      endMs: ELARA_CONFESSION_FRAME_MS * 3,
      imageUrl: "/assets/slideshows/it-aint-been-the-same/frame03.webp",
      transition: "dissolve",
      caption: "The Senate floor. A pen. A long document with a single line missing.",
      dialogOverlay: "I signed the bill that put four hundred million Atarian children in surveillance creches.",
      dialogSpeakerId: "elara",
      narratorReactionId: "elara",
    },
    {
      startMs: ELARA_CONFESSION_FRAME_MS * 3,
      endMs: ELARA_CONFESSION_FRAME_MS * 4,
      imageUrl: "/assets/slideshows/it-aint-been-the-same/frame04.webp",
      transition: "dissolve",
      caption: "Back in the apartment. The curtains are down. The room is dark.",
      dialogOverlay: "The dark came anyway. It didn't care how I'd pinned the curtains.",
      dialogSpeakerId: "elara",
      narratorReactionId: "elara",
    },
    {
      startMs: ELARA_CONFESSION_FRAME_MS * 4,
      endMs: ELARA_CONFESSION_FRAME_MS * 5,
      imageUrl: "/assets/slideshows/it-aint-been-the-same/frame05.webp",
      transition: "dissolve",
      caption: "She turns to camera. Her political cadence is gone. Her voice is her own.",
      dialogOverlay: "It ain't been the same since. I will not pretend for you that it was.",
      dialogSpeakerId: "elara",
      narratorReactionId: "elara",
    },
    {
      startMs: ELARA_CONFESSION_FRAME_MS * 5,
      endMs: ELARA_CONFESSION_FRAME_MS * 6,
      imageUrl: "/assets/slideshows/it-aint-been-the-same/frame06.webp",
      transition: "fade",
      caption: "She sits in the empty room. The curtains are still down. She does not move to fix them.",
    },
  ],
  lyrics: [
    { startMs: 2_000, endMs: 12_000, text: "I used to pin the curtains back.", emphasis: "whisper" },
    { startMs: 40_000, endMs: 54_000, text: "The dark came anyway.", emphasis: "normal" },
    { startMs: 68_000, endMs: 84_000, text: "It ain't been the same since.", emphasis: "layered" },
  ],
  overlays: [
    { type: "bloom", startMs: 0, endMs: 28_000, intensity: 0.5 },
    { type: "vignette", startMs: 0, endMs: 84_000, intensity: 0.35 },
    { type: "grain", startMs: 42_000, endMs: 84_000, intensity: 0.25 },
  ],
  flagsSetOnComplete: [
    "slideshow_it_aint_been_the_same_complete",
    "elara_atarion_confession_heard",
    "elara_curtain_memory_seen",
  ],
  unlockLoredexEntry: "the-atarion-bill",
  lightEnergyReward: 80,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/it-aint-been-the-same/hero.webp",
    prose:
      "Elara in a sunlit apartment on Atarion. She pins cyan curtains back every morning. A flashback: the Senate floor, a pen, the bill that put four hundred million Atarian children in surveillance creches. Her name at the bottom. Back in the apartment, the curtains are down and the room is dark. She turns to camera without her political cadence and tells you, plainly, that it ain't been the same since. She sits in the empty room. The curtains stay down. She does not move to fix them.",
    closingLine:
      "It ain't been the same since. She will not pretend for you that it was.",
  },
};

/* ─── THE HELMET IN THE GRASS (§6.5 + §12 C5) ─── */

/**
 * "The Helmet in the Grass" — the Act 2 Thaloria cinematic
 * (P1). Six frames, ~1m 12s. Triggered on the player's third
 * Collector's Arena match win.
 *
 * Structurally this cinematic is the cold-open to the
 * existing `collectors-arena-intro_c5e8c641.mp4` asset per
 * §6.5. The slideshow's six frames cover the peaceful
 * Thaloria opener, the helmet lift, the world-inversion,
 * the reveal of the two Game Masters, and the moment the
 * Thalorian's eyes turn red. The existing arena intro video
 * plays immediately after this slideshow completes.
 */
const THALORIA_FRAME_MS = 12_000;

export const THE_HELMET_IN_THE_GRASS_SLIDESHOW: SongSlideshowDef = {
  id: "the-helmet-in-the-grass",
  songId: "thaloria_awakening",
  audioUrl: "/assets/audio/songs/thaloria-awakening.mp3",
  durationMs: 6 * THALORIA_FRAME_MS, // 72_000ms = 1m 12s
  title: "The Helmet in the Grass",
  subtitle: "Thaloria. Morning. A child reaching for a buried helmet.",
  credits: "Album: The Age of Privacy · Track 3",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: THALORIA_FRAME_MS,
      imageUrl: "/assets/slideshows/the-helmet-in-the-grass/frame01.webp",
      transition: "fade",
      caption: "A Thaloria meadow. Morning. Crystal streams in the distance.",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.05,
        startPan: [0, 0],
        endPan: [0.03, 0.01],
      },
    },
    {
      startMs: THALORIA_FRAME_MS,
      endMs: THALORIA_FRAME_MS * 2,
      imageUrl: "/assets/slideshows/the-helmet-in-the-grass/frame02.webp",
      transition: "dissolve",
      caption: "A verdant-skinned child kneels. A xenomorph-shaped helmet lies half-buried in the grass.",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.08,
        startPan: [0, 0],
        endPan: [0.05, 0.02],
      },
    },
    {
      startMs: THALORIA_FRAME_MS * 2,
      endMs: THALORIA_FRAME_MS * 3,
      imageUrl: "/assets/slideshows/the-helmet-in-the-grass/frame03.webp",
      transition: "dissolve",
      caption: "She reaches for it.",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.1,
        startPan: [0, 0],
        endPan: [0.0, 0.04],
      },
    },
    {
      startMs: THALORIA_FRAME_MS * 3,
      endMs: THALORIA_FRAME_MS * 4,
      imageUrl: "/assets/slideshows/the-helmet-in-the-grass/frame04.webp",
      transition: "hardcut",
      caption: "The camera tilts. The world inverts. The emerald canopy becomes burning violet.",
    },
    {
      startMs: THALORIA_FRAME_MS * 4,
      endMs: THALORIA_FRAME_MS * 5,
      imageUrl: "/assets/slideshows/the-helmet-in-the-grass/frame05.webp",
      transition: "dissolve",
      caption: "Two Game Masters stand behind her. Identical blue trench coats. Mirrored red goggles.",
    },
    {
      startMs: THALORIA_FRAME_MS * 5,
      endMs: THALORIA_FRAME_MS * 6,
      imageUrl: "/assets/slideshows/the-helmet-in-the-grass/frame06.webp",
      transition: "hardcut",
      caption: "The Left Game Master places the helmet on her head. Her eyes turn red.",
    },
  ],
  lyrics: [
    { startMs: 4_000, endMs: 16_000, text: "Life flowed in rhythms of quiet prosperity.", emphasis: "whisper" },
    { startMs: 36_000, endMs: 48_000, text: "The camera was never alone.", emphasis: "normal" },
    { startMs: 60_000, endMs: 72_000, text: "The Shadow Tongue was born today.", emphasis: "layered" },
  ],
  overlays: [
    { type: "bloom", startMs: 0, endMs: 36_000, intensity: 0.5 },
    { type: "particles", startMs: 0, endMs: 36_000, intensity: 0.3 },
    { type: "vignette", startMs: 36_000, endMs: 72_000, intensity: 0.45 },
    { type: "corruption", startMs: 36_000, endMs: 48_000, intensity: 0.6 },
    { type: "scanlines", startMs: 48_000, endMs: 72_000, intensity: 0.25 },
  ],
  flagsSetOnComplete: [
    "slideshow_the_helmet_in_the_grass_complete",
    "thaloria_cinematic_seen",
    "two_game_masters_introduced",
    "shadow_tongue_origin_seen",
  ],
  unlockLoredexEntry: "the-two-game-masters",
  lightEnergyReward: 100,
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/the-helmet-in-the-grass/hero.webp",
    prose:
      "A verdant-skinned Thalorian child kneels in an emerald meadow under soft morning light. Crystal streams in the distance. A half-buried alien xenomorph-shaped helmet lies in the grass. She reaches for it. As she lifts it, the camera tilts up and over, and the world inverts mid-tilt. The emerald canopy becomes a sky of burning violet. A second pair of masked hands is now holding the helmet from above — gloved, blue trench coat sleeve. The camera pulls back to reveal TWO Game Masters standing behind her: identical blue trench coats, one with red left-lens goggles, one with red right-lens goggles. The Left Game Master places the helmet on her head. The child's eyes turn red. The Shadow Tongue is born.",
    closingLine:
      "They were behind the Thalorian the whole time. The Thalorian never noticed. Neither did you.",
  },
};

/* ─── TWO WITNESSES MEET (§1.5 + §12 C10) ─── */

/**
 * "Two Witnesses Meet" — the Bond 80 emotional peak cinematic
 * from §1.5 and §12 C10. Seven beats of wordless choreography
 * between Elara and The Human in the Memorial Corridor, ending
 * with both narrators turning to face the player and waiting
 * for judgment.
 *
 * Triggered when mutual bond crosses 80 (both `elaraTrustLevel`
 * and `humanTrustLevel` ≥ 80). The player's choice after the
 * cinematic ends — Forgive Both / Forgive One / Forgive Neither
 * — is the single most impactful moral decision in the Prelude
 * and Act 1 arc, and shifts which narrator becomes dominant
 * for the rest of the game. Refusing both unlocks the third
 * narrator slot — the voice of the ship itself, Dr. Lyra Vox,
 * speaking through the substrate.
 *
 * Song choice: Consider Life from §5.5 P1 (Book of Daniel 2:47).
 * No lyrics in the slideshow itself — the song plays under
 * silent choreography per §12 C10.
 */
const TWO_WITNESSES_FRAME_MS = 10_000;

export const TWO_WITNESSES_MEET_SLIDESHOW: SongSlideshowDef = {
  id: "two-witnesses-meet",
  songId: "consider_life",
  audioUrl: "/assets/audio/songs/consider-life.mp3",
  durationMs: 7 * TWO_WITNESSES_FRAME_MS, // 70_000ms = 1m 10s
  title: "Two Witnesses Meet",
  subtitle: "The Memorial Corridor. A Caravaggio sense of light. Seven beats.",
  credits: "Album: Book of Daniel 2:47 · Track 14",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: TWO_WITNESSES_FRAME_MS,
      imageUrl: "/assets/slideshows/two-witnesses-meet/frame01.webp",
      transition: "fade",
      caption: "A long corridor of empty memorial plaques.",
      kenBurns: {
        startScale: 1.0,
        endScale: 1.03,
        startPan: [0, 0],
        endPan: [0.01, 0.0],
      },
    },
    {
      startMs: TWO_WITNESSES_FRAME_MS,
      endMs: TWO_WITNESSES_FRAME_MS * 2,
      imageUrl: "/assets/slideshows/two-witnesses-meet/frame02.webp",
      transition: "dissolve",
      caption: "Elara takes a half-step toward him.",
      narratorReactionId: "elara",
    },
    {
      startMs: TWO_WITNESSES_FRAME_MS * 2,
      endMs: TWO_WITNESSES_FRAME_MS * 3,
      imageUrl: "/assets/slideshows/two-witnesses-meet/frame03.webp",
      transition: "dissolve",
      caption: "He does not move.",
      narratorReactionId: "the_human",
    },
    {
      startMs: TWO_WITNESSES_FRAME_MS * 3,
      endMs: TWO_WITNESSES_FRAME_MS * 4,
      imageUrl: "/assets/slideshows/two-witnesses-meet/frame04.webp",
      transition: "dissolve",
      caption: "She raises a hand toward his face.",
      narratorReactionId: "elara",
    },
    {
      startMs: TWO_WITNESSES_FRAME_MS * 4,
      endMs: TWO_WITNESSES_FRAME_MS * 5,
      imageUrl: "/assets/slideshows/two-witnesses-meet/frame05.webp",
      transition: "dissolve",
      caption: "He catches her wrist.",
      narratorReactionId: "the_human",
    },
    {
      startMs: TWO_WITNESSES_FRAME_MS * 5,
      endMs: TWO_WITNESSES_FRAME_MS * 6,
      imageUrl: "/assets/slideshows/two-witnesses-meet/frame06.webp",
      transition: "dissolve",
      caption: "He lowers her hand. Holds it for a beat. Lets go.",
    },
    {
      startMs: TWO_WITNESSES_FRAME_MS * 6,
      endMs: TWO_WITNESSES_FRAME_MS * 7,
      imageUrl: "/assets/slideshows/two-witnesses-meet/frame07.webp",
      transition: "fade",
      caption: "In unison, they turn to face the player. And wait.",
    },
  ],
  lyrics: [
    // §12 C10 is explicit that this cinematic is silent
    // choreography — no lyric overlays. The song carries it.
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 70_000, intensity: 0.4 },
    { type: "bloom", startMs: 0, endMs: 70_000, intensity: 0.3 },
    { type: "particles", startMs: 56_000, endMs: 70_000, intensity: 0.25 },
  ],
  flagsSetOnComplete: [
    "slideshow_two_witnesses_meet_complete",
    "two_witnesses_met",
    "forgiveness_choice_unlocked",
  ],
  unlockLoredexEntry: "the-two-witnesses",
  lightEnergyReward: 0, // §3.6 ties the reward to the player's CHOICE after the cinematic
  reducedMotionFallback: {
    heroImageUrl: "/assets/slideshows/two-witnesses-meet/hero.webp",
    prose:
      "Two holograms stand in the Memorial Corridor of the Ark — Elara in a senator's robe, The Human in a detective's trench coat — facing each other a few meters apart. Blue candle-light flickers. Neither speaks. Elara takes a half-step toward him. He does not move. She raises a hand toward his face. He catches her wrist. He lowers her hand, holds it for a beat, lets go. Neither of them looks away from the other. In unison, they turn to face the player and wait for judgment.",
    closingLine:
      "Your choice: Forgive Both. Forgive One. Forgive Neither. It is the single most impactful moral decision in the Prelude and Act 1 arc.",
  },
};

/* ───────────────────────────────────────────────────────
   SECTION 6 — Two Witnesses Meet Part 2 (Act 1 close)

   Single cutscene, no match, no deck. Per ACT1_NARRATIVE_STRUCTURE.md
   §6 this fires immediately after the §5.8.1 Light/Dark pillar write
   persists — the player leaves the Authority gallery and walks back
   to the Archives. Section 6 is deliberately scored with only room
   ambient (spec §6.2: "After Last Words ran for 3:39, the silence is
   the point."). Dialog VO authoring is a content slot tracked in
   spec §6.5 Open slots; this slideshow reserves the structural
   surface — frames, trigger, flags — so the authoring pass has a
   wire to connect to.

   Canon hygiene (spec §8.6): no "1260 days", no "Silence in Heaven",
   no "Heart of Time", no Age names, no civilian names. The
   placeholder captions below follow the three §6.1 core reveals —
   Antiquarian-as-revived-Witness, Enigma-as-Last-Words-voice,
   Engineer-pre-dates-the-Witness-arc — in canon-compliant phrasing.
   ─────────────────────────────────────────────────────── */

/**
 * §6.2: 3-minute target runtime (180s). Twelve frames × 15s each.
 * The scene is dialog-driven — captions carry the authored VO copy
 * until the §6.5 voice recording pass ships. Every spoken line is
 * marked with its speaker attribution in the caption text for
 * accessibility. Hygiene rules (spec §8.6) preserved: no "1260 days",
 * no "Silence in Heaven", no "Heart of Time", no Age names, no
 * civilian names. Only permitted cross-Age phrasing — "across Ages,
 * across the death of stars" — lands exactly once, in frame 6.
 */
const TWO_WITNESSES_PART_2_FRAME_MS = 15_000;

export const TWO_WITNESSES_PART_2_SLIDESHOW: SongSlideshowDef = {
  id: "two-witnesses-part-2",
  // No music bed per spec §6.2 — the "song" is room ambient. The audio
  // slot references the ambient file that will replace this placeholder
  // path in the §6.5 ambient-authoring pass.
  songId: "archives_ambient",
  audioUrl: "/assets/audio/ambient/archives-ambient.mp3",
  durationMs: 12 * TWO_WITNESSES_PART_2_FRAME_MS,
  title: "Two Witnesses Meet — Part 2",
  subtitle:
    "The Archives, relit. The memorial has completed its job. They have been waiting for you.",
  credits: "Act 1 close · Witnesses' Part-2 scene",
  priority: "P1",
  frames: [
    // Frame 1 — arrival. Stage direction only.
    {
      startMs: 0,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame01.webp",
      transition: "fade",
      caption:
        "The Archives, relit. The Engineer's chair is gone. The six crystal coffins are gone. It is an archive again.",
    },
    // Frame 2 — Antiquarian opens.
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 2,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame02.webp",
      transition: "dissolve",
      caption:
        "The Antiquarian: \"You came. I wasn't sure you would.\"",
      narratorReactionId: "antiquarian",
    },
    // Frame 3 — Antiquarian frames the scene.
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 2,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 3,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame03.webp",
      transition: "dissolve",
      caption:
        "The Antiquarian: \"The trial ended the way it ended. The song ran. You made your choice in the gallery. We stayed out of it. We were waiting for this part.\"",
      narratorReactionId: "antiquarian",
    },
    // Frame 4 — Enigma arrives in voice.
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 3,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 4,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame04.webp",
      transition: "dissolve",
      caption:
        "The Enigma: \"We owe you an explanation. The short version, while the silence still holds.\"",
      // Enigma not yet in narratorReactionId union (see §6.5 open
      // slot); attribution carried in caption text until then.
    },
    // Frame 5 — Antiquarian's reveal (§6.1 core reveal 1).
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 4,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 5,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame05.webp",
      transition: "dissolve",
      caption:
        "The Antiquarian: \"I was executed for what I thought. I woke up in the next era. Nobody told me I would. Nobody told me I could. That is the short version.\"",
      narratorReactionId: "antiquarian",
    },
    // Frame 6 — the permitted cross-Age phrasing lands.
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 5,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 6,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame06.webp",
      transition: "dissolve",
      caption:
        "The Antiquarian: \"The long version is across Ages, across the death of stars. We will not give it to you tonight.\"",
      narratorReactionId: "antiquarian",
    },
    // Frame 7 — Enigma's reveal (§6.1 core reveal 2).
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 6,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 7,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame07.webp",
      transition: "dissolve",
      caption:
        "The Enigma: \"I was the voice on the recording you just heard. I died a different way. I came back a different way. Different era; same answer.\"",
    },
    // Frame 8 — the Engineer reveal (§6.1 core reveal 3).
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 7,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 8,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame08.webp",
      transition: "dissolve",
      caption:
        "The Antiquarian: \"The Engineer was not one of us. He came before. His death is the seed of what we became.\"",
      narratorReactionId: "antiquarian",
    },
    // Frame 9 — the memoir lands on its speaker.
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 8,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 9,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame09.webp",
      transition: "dissolve",
      caption:
        "The Enigma: \"The message he left behind — we heard it for the first time standing in this room. Then we waited for someone to hear it who would understand.\"",
    },
    // Frame 10 — the player as fulcrum (§6.1 core reveal 4).
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 9,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 10,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame10.webp",
      transition: "dissolve",
      caption:
        "The Antiquarian: \"The fulcrum. I said that word to you in the first part of this scene. I meant it then. I mean it more now.\"",
      narratorReactionId: "antiquarian",
    },
    // Frame 11 — the Enigma names the three doors.
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 10,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 11,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame11.webp",
      transition: "dissolve",
      caption:
        "The Enigma: \"You do not have to answer in words. Three doors leave this room. Accept. Decline. Deflect. Your choice will determine the fate and future of this reality.\"",
    },
    // Frame 12 — silence settles; Act1ClosingChoicePanel mounts.
    {
      startMs: TWO_WITNESSES_PART_2_FRAME_MS * 11,
      endMs: TWO_WITNESSES_PART_2_FRAME_MS * 12,
      imageUrl: "/assets/slideshows/two-witnesses-part-2/frame12.webp",
      transition: "fade",
      caption:
        "The Antiquarian: \"We will be here. Whichever door you take. We have waited longer than this.\" The silence sits.",
      narratorReactionId: "antiquarian",
    },
  ],
  // Spec §6.2 "No music bed" — deliberately no lyrics. A single
  // vignette overlay carries the atmosphere; the silence between
  // lines is the real beat.
  lyrics: [],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 180_000, intensity: 0.35 },
  ],
  flagsSetOnComplete: [
    "slideshow_two_witnesses_part_2_complete",
    "witness_antiquarian_met_part2",
    "witness_enigma_met_part2",
    // Act 1 narrative completion gate — Act 2 reads this.
    "act1_complete",
  ],
  unlockLoredexEntry: "the-two-witnesses",
  lightEnergyReward: 0,
  reducedMotionFallback: {
    heroImageUrl: assetUrl("art/rooms/room-archives.png"),
    prose:
      "The Archives are relit — an archive again, not a memorial. Both Witnesses are already seated when you arrive. They have been waiting through the trial, through the Last Words recording, through your Light-or-Dark choice in the gallery. The Antiquarian opens: he wasn't sure you would come. He explains he was executed for what he thought and woke up in the next era — nobody told him he could. The long version, he says, is across Ages, across the death of stars — not tonight. The Enigma speaks: she was the voice on the recording you just heard. She died a different way and came back a different way; different era, same answer. The Antiquarian closes the reveals: the Engineer was not one of them. He came before. His death is the seed of what they became. Then the Enigma says the memoir found its audience when the two of them stood in this room and heard the Engineer's message for the first time — and then they waited for someone to hear it who would understand. The Antiquarian names you the fulcrum again. The Enigma names the three doors — accept, decline, deflect — and says the choice will determine the fate and future of this reality. The silence sits. Neither Witness presses the choice.",
    closingLine:
      "Three doors leave the Archives. All three are canon-safe endings to Act 1.",
  },
};

/* ─── REGISTRY ─── */

/**
 * The canonical first-wave slideshow registry. More slideshows
 * are added here as art and audio for §5.5's priority list ship.
 */
/* ─── SILENCE OF TWO WITNESSES (§14.1 bond-60 milestone) ─── */

/**
 * "The Silence of Two Witnesses" — Act 2 horizontal milestone
 * cinematic. Fires once when `event_silence_of_two_witnesses`
 * is raised (narratorBond >= 60). Three 8-second frames: both
 * narrator portraits flickering, both portraits dark, a single
 * held-breath frame on the Memorial Corridor.
 *
 * Canon text comes from `witnessingEvents.ts:82` — the NPC
 * reactions are deliberately parentheticals ("She says nothing").
 * The slideshow shows what silence LOOKS like; the companion
 * comments in useNarrativeIntegration.ts play the parentheticals
 * as accessibility text immediately before.
 */
const SILENCE_FRAME_MS = 8_000;

export const SILENCE_OF_TWO_WITNESSES_SLIDESHOW: SongSlideshowDef = {
  id: "silence-of-two-witnesses",
  songId: "silence_of_two_witnesses",
  audioUrl: assetUrl("audio/act2/silence-of-two-witnesses-ambient.mp3"),
  durationMs: 3 * SILENCE_FRAME_MS,
  title: "The Silence of Two Witnesses",
  subtitle: "Bond 60. Both narrators go quiet. The Light freezes. The Dark pauses.",
  credits: "§14.1 Horizontal Milestone · Act 2",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: SILENCE_FRAME_MS,
      imageUrl: assetUrl("art/cinematics/silence-of-two-witnesses/frame01.webp"),
      transition: "fade",
      caption: "Elara's portrait flickers. Her lips move. No sound arrives.",
    },
    {
      startMs: SILENCE_FRAME_MS,
      endMs: SILENCE_FRAME_MS * 2,
      imageUrl: assetUrl("art/cinematics/silence-of-two-witnesses/frame02.webp"),
      transition: "dissolve",
      caption: "The Human's trench coat is still on screen. His voice is not.",
    },
    {
      startMs: SILENCE_FRAME_MS * 2,
      endMs: SILENCE_FRAME_MS * 3,
      imageUrl: assetUrl("art/cinematics/silence-of-two-witnesses/frame03.webp"),
      transition: "dissolve",
      caption: "The Memorial Corridor. Caravaggio light. The galaxy holds one breath.",
    },
  ],
  lyrics: [
    {
      startMs: 1_000,
      endMs: 6_500,
      text: "(She says nothing. Her portrait flickers but does not resolve into speech.)",
      emphasis: "whisper",
    },
    {
      startMs: 9_000,
      endMs: 14_500,
      text: "(He says nothing either. His trench coat is still on screen; his voice is not.)",
      emphasis: "whisper",
    },
    {
      startMs: 18_000,
      endMs: 23_000,
      text: "Both of them need a minute.",
      emphasis: "layered",
    },
  ],
  overlays: [
    { type: "vignette", startMs: 0, endMs: 3 * SILENCE_FRAME_MS, intensity: 0.6 },
    { type: "scanlines", startMs: 0, endMs: SILENCE_FRAME_MS, intensity: 0.2 },
  ],
  flagsSetOnComplete: ["slideshow_silence_of_two_witnesses_complete"],
  lightEnergyReward: 0,
  reducedMotionFallback: {
    heroImageUrl: assetUrl("art/cinematics/silence-of-two-witnesses/hero.webp"),
    prose:
      "Two narrator portraits side by side on a black field. Elara's lips move without sound. The Human stands in his trench coat with nothing to say. The camera pulls back to the Memorial Corridor in warm Caravaggio light. The galaxy is holding one breath. Both of them need a minute.",
  },
};

/* ─── ACT 4 / 4.5 / 5 / 6 / 7 OPENERS (narrative-spine foundation) ─── */

/**
 * These five slideshows fire via SLIDESHOW_TRIGGERS when each act's
 * `act_N_started` flag is raised. They are deliberately stub-shaped:
 * three caption frames apiece with the authoring content sourced from
 * `narrativeActs.ts`, using the reduced-motion text fallback for every
 * frame until commissioned art lands. Every slideshow's
 * `flagsSetOnComplete` writes the `slideshow_act_N_*_complete` flag the
 * corresponding completion gate requires.
 *
 * As of the Acts 2-7 AAA Final drop (PR #177, 2026-04-23), each act
 * opener also has a cinematic MP4 (`cin_act{N}_opener.mp4`) and a
 * music bed (`act-{N}-intro.mp3`) at canonical paths under
 * `videos/acts/act-{N}/` and `audio/acts/`. The `videoUrl` field
 * routes the player to the video; the still-frame `frames` remain
 * as a fallback for when the MP4 is unavailable.
 */

const ACT_OPENER_FRAME_MS = 7_000;

export const ACT_4_REVELATION_INTRO_SLIDESHOW: SongSlideshowDef = {
  id: "act-4-revelation-intro",
  songId: "act_4_revelation_intro",
  audioUrl: assetUrl("audio/acts/act-4-intro.mp3"),
  videoUrl: assetUrl("videos/acts/act-4/cin_act4_opener.mp4"),
  durationMs: 3 * ACT_OPENER_FRAME_MS,
  title: "Act 4 — The Revelation",
  subtitle: "The Prisoner's memory is a door. You are the one opening it.",
  credits: "§9 — The Prisoner / The Revelation",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: ACT_OPENER_FRAME_MS,
      imageUrl: assetUrl("art/cinematics/act-4-revelation/frame01.webp"),
      transition: "fade",
      caption: "The cell door is not a door. It is a mirror. Kael has been waiting for you.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS,
      endMs: ACT_OPENER_FRAME_MS * 2,
      imageUrl: assetUrl("art/cinematics/act-4-revelation/frame02.webp"),
      transition: "dissolve",
      caption: "Every fight from here is a memory extraction. The Arena is the interrogation room.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS * 2,
      endMs: ACT_OPENER_FRAME_MS * 3,
      imageUrl: assetUrl("art/cinematics/act-4-revelation/frame03.webp"),
      transition: "dissolve",
      caption: "Lay down the fight. Listen for the name he hid inside it.",
    },
  ],
  flagsSetOnComplete: ["slideshow_act_4_revelation_intro_complete"],
  lightEnergyReward: 0,
  reducedMotionFallback: {
    heroImageUrl: assetUrl("art/cinematics/act-4-revelation/hero.webp"),
    prose:
      "The Prisoner's cell is not a cell. It is a memory palace Kael built to hide the names the Warlord took from him. The next four fights are the extraction. You are the hand that reaches in.",
  },
};

export const ACT_4_5_DMC_INTRO_SLIDESHOW: SongSlideshowDef = {
  id: "act-4-5-intro",
  songId: "act_4_5_dmc_intro",
  audioUrl: assetUrl("audio/acts/act-4_5-intro.mp3"),
  videoUrl: assetUrl("videos/acts/act-4_5/cin_act4_5_opener.mp4"),
  durationMs: 3 * ACT_OPENER_FRAME_MS,
  title: "Act 4.5 — Dead Man's Circuit",
  subtitle: "Name your wager. The Circuit keeps it whether you win or not.",
  credits: "§10 — The Identity-Chain Track",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: ACT_OPENER_FRAME_MS,
      imageUrl: assetUrl("art/cinematics/act-4-5-dmc/frame01.webp"),
      transition: "fade",
      caption: "The track is bone. The engines are memory. The stake is a name you will no longer answer to.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS,
      endMs: ACT_OPENER_FRAME_MS * 2,
      imageUrl: assetUrl("art/cinematics/act-4-5-dmc/frame02.webp"),
      transition: "hardcut",
      caption: "The Degen's Pact is simple. Entropy is the dealer. Everyone at the table is already losing.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS * 2,
      endMs: ACT_OPENER_FRAME_MS * 3,
      imageUrl: assetUrl("art/cinematics/act-4-5-dmc/frame03.webp"),
      transition: "dissolve",
      caption: "Student. Seeker. Detective. The Last. One of these will be what's left of you.",
    },
  ],
  flagsSetOnComplete: ["slideshow_act_4_5_intro_complete"],
  lightEnergyReward: 0,
  reducedMotionFallback: {
    heroImageUrl: assetUrl("art/cinematics/act-4-5-dmc/hero.webp"),
    prose:
      "The Circuit runs on identity. Each lap costs you a name. The Degen Casino runs on entropy. Each hand costs you a certainty. You pick the track, you name the wager, and you pay it once. The chain remembers which version of you finished.",
  },
};

export const ACT_5_MAP_INTRO_SLIDESHOW: SongSlideshowDef = {
  id: "act-5-map-intro",
  songId: "act_5_map_intro",
  audioUrl: assetUrl("audio/acts/act-5-intro.mp3"),
  videoUrl: assetUrl("videos/acts/act-5/cin_act5_opener.mp4"),
  durationMs: 3 * ACT_OPENER_FRAME_MS,
  title: "Act 5 — The Reckoning",
  subtitle: "Kael's map is open. Five sectors. Twenty worlds. One last stand.",
  credits: "§11 — The Reckoning / The Map",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: ACT_OPENER_FRAME_MS,
      imageUrl: assetUrl("art/cinematics/act-5-map/frame01.webp"),
      transition: "fade",
      caption: "He drew this on the back of a ration wrapper. Every planet. Every name.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS,
      endMs: ACT_OPENER_FRAME_MS * 2,
      imageUrl: assetUrl("art/cinematics/act-5-map/frame02.webp"),
      transition: "dissolve",
      caption: "Iron Lion is already moving. The Cades are tightening the line around Veridian VI.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS * 2,
      endMs: ACT_OPENER_FRAME_MS * 3,
      imageUrl: assetUrl("art/cinematics/act-5-map/frame03.webp"),
      transition: "hardcut",
      caption: "Recruit the army. Finish the mission. You cannot save the Lion. Try anyway.",
    },
  ],
  flagsSetOnComplete: ["slideshow_act_5_map_intro_complete", "act_5_map_revealed"],
  lightEnergyReward: 0,
  reducedMotionFallback: {
    heroImageUrl: assetUrl("art/cinematics/act-5-map/hero.webp"),
    prose:
      "Kael's map fills the bridge. Five sectors, twenty worlds, a list of names the Warlord took. Iron Lion's transmissions come in from Veridian VI at 03:17 ship time. The final mission is already running. You recruit, you dispatch, and you do not sleep.",
  },
};

export const ACT_6_CONFESSION_INTRO_SLIDESHOW: SongSlideshowDef = {
  id: "act-6-confession-intro",
  songId: "act_6_confession_intro",
  audioUrl: assetUrl("audio/acts/act-6-intro.mp3"),
  videoUrl: assetUrl("videos/acts/act-6/cin_act6_opener.mp4"),
  durationMs: 3 * ACT_OPENER_FRAME_MS,
  title: "Act 6 — The Confession",
  subtitle: "Both of them finally spoke. Neither could look at the other.",
  credits: "§12 — The Confession",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: ACT_OPENER_FRAME_MS,
      imageUrl: assetUrl("art/cinematics/act-6-confession/frame01.webp"),
      transition: "fade",
      caption: "Elara's portrait is the clearest it has ever been. That is the first clue.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS,
      endMs: ACT_OPENER_FRAME_MS * 2,
      imageUrl: assetUrl("art/cinematics/act-6-confession/frame02.webp"),
      transition: "dissolve",
      caption: "The Human takes his coat off. He has not done that in seventeen thousand years.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS * 2,
      endMs: ACT_OPENER_FRAME_MS * 3,
      imageUrl: assetUrl("art/cinematics/act-6-confession/frame03.webp"),
      transition: "dissolve",
      caption: "There is a third thing in the room with you. It has been watching since Act 1.",
    },
  ],
  flagsSetOnComplete: ["slideshow_act_6_confession_intro_complete"],
  lightEnergyReward: 0,
  reducedMotionFallback: {
    heroImageUrl: assetUrl("art/cinematics/act-6-confession/hero.webp"),
    prose:
      "Elara admits she was human, once. The Human admits he has been playing the villain to cover a third thing neither of them can name out loud. The room feels watched. The Watcher is named in this act. You will choose how to stand when it is.",
  },
};

export const ACT_7_CONVERGENCE_INTRO_SLIDESHOW: SongSlideshowDef = {
  id: "act-7-convergence-intro",
  songId: "act_7_convergence_intro",
  audioUrl: assetUrl("audio/acts/act-7-intro.mp3"),
  videoUrl: assetUrl("videos/acts/act-7/cin_act7_opener.mp4"),
  durationMs: 3 * ACT_OPENER_FRAME_MS,
  title: "Act 7 — The Convergence",
  subtitle: "For the first and only time, their voices align.",
  credits: "§13 — The Convergence",
  priority: "P1",
  frames: [
    {
      startMs: 0,
      endMs: ACT_OPENER_FRAME_MS,
      imageUrl: assetUrl("art/cinematics/act-7-convergence/frame01.webp"),
      transition: "fade",
      caption: "The army is assembled. Five sectors. Seventeen generals. One horizon.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS,
      endMs: ACT_OPENER_FRAME_MS * 2,
      imageUrl: assetUrl("art/cinematics/act-7-convergence/frame02.webp"),
      transition: "dissolve",
      caption: "Two wars. One you can see. One the Watcher has been fighting since before you woke.",
    },
    {
      startMs: ACT_OPENER_FRAME_MS * 2,
      endMs: ACT_OPENER_FRAME_MS * 3,
      imageUrl: assetUrl("art/cinematics/act-7-convergence/frame03.webp"),
      transition: "hardcut",
      caption: "Their two voices land on a single chord. Hold it. Then pick a stance.",
    },
  ],
  flagsSetOnComplete: ["slideshow_act_7_convergence_intro_complete"],
  lightEnergyReward: 0,
  reducedMotionFallback: {
    heroImageUrl: assetUrl("art/cinematics/act-7-convergence/hero.webp"),
    prose:
      "The spine closes on a single sustained chord. Elara and The Human sing the same note for the first time. The Watcher is no longer hiding. Four final stances sit in front of you: For Humanity, See the Pattern, The Bridge, Take Command. Silence is also permitted. The cycle rolls over either way.",
  },
};

export const SONG_SLIDESHOWS: Record<string, SongSlideshowDef> = {
  [LAST_WORDS_SLIDESHOW.id]: LAST_WORDS_SLIDESHOW,
  /* Album 1 · Dischordian Logic — T01..T09 (producer drop) */
  [ALBUM1_T01_SLIDESHOW.id]: ALBUM1_T01_SLIDESHOW,
  [ALBUM1_T02_SLIDESHOW.id]: ALBUM1_T02_SLIDESHOW,
  [ALBUM1_T03_SLIDESHOW.id]: ALBUM1_T03_SLIDESHOW,
  [ALBUM1_T04_SLIDESHOW.id]: ALBUM1_T04_SLIDESHOW,
  [ALBUM1_T05_SLIDESHOW.id]: ALBUM1_T05_SLIDESHOW,
  [ALBUM1_T06_SLIDESHOW.id]: ALBUM1_T06_SLIDESHOW,
  [ALBUM1_T07_SLIDESHOW.id]: ALBUM1_T07_SLIDESHOW,
  [ALBUM1_T08_SLIDESHOW.id]: ALBUM1_T08_SLIDESHOW,
  [ALBUM1_T09_SLIDESHOW.id]: ALBUM1_T09_SLIDESHOW,
  [WELCOME_TO_CELEBRATION_SLIDESHOW.id]: WELCOME_TO_CELEBRATION_SLIDESHOW,
  [TO_BE_THE_HUMAN_SLIDESHOW.id]: TO_BE_THE_HUMAN_SLIDESHOW,
  [HACKING_REALITY_SLIDESHOW.id]: HACKING_REALITY_SLIDESHOW,
  [I_AM_THE_EYES_SLIDESHOW.id]: I_AM_THE_EYES_SLIDESHOW,
  [OCULARUM_SLIDESHOW.id]: OCULARUM_SLIDESHOW,
  [THE_PRISONER_SLIDESHOW.id]: THE_PRISONER_SLIDESHOW,
  [THE_LION_IN_BLACK_SLIDESHOW.id]: THE_LION_IN_BLACK_SLIDESHOW,
  [TWO_WITNESSES_MEET_SLIDESHOW.id]: TWO_WITNESSES_MEET_SLIDESHOW,
  [TWO_WITNESSES_PART_2_SLIDESHOW.id]: TWO_WITNESSES_PART_2_SLIDESHOW,
  [THE_HELMET_IN_THE_GRASS_SLIDESHOW.id]: THE_HELMET_IN_THE_GRASS_SLIDESHOW,
  [SUPERMAN_AINT_COMING_SLIDESHOW.id]: SUPERMAN_AINT_COMING_SLIDESHOW,
  [IT_AINT_BEEN_THE_SAME_SLIDESHOW.id]: IT_AINT_BEEN_THE_SAME_SLIDESHOW,
  [THE_LIGHT_HOLDS_SLIDESHOW.id]: THE_LIGHT_HOLDS_SLIDESHOW,
  [THE_BULB_BREAKS_SLIDESHOW.id]: THE_BULB_BREAKS_SLIDESHOW,
  [SILENCE_OF_TWO_WITNESSES_SLIDESHOW.id]: SILENCE_OF_TWO_WITNESSES_SLIDESHOW,
  [ACT_4_REVELATION_INTRO_SLIDESHOW.id]: ACT_4_REVELATION_INTRO_SLIDESHOW,
  [ACT_4_5_DMC_INTRO_SLIDESHOW.id]: ACT_4_5_DMC_INTRO_SLIDESHOW,
  [ACT_5_MAP_INTRO_SLIDESHOW.id]: ACT_5_MAP_INTRO_SLIDESHOW,
  [ACT_6_CONFESSION_INTRO_SLIDESHOW.id]: ACT_6_CONFESSION_INTRO_SLIDESHOW,
  [ACT_7_CONVERGENCE_INTRO_SLIDESHOW.id]: ACT_7_CONVERGENCE_INTRO_SLIDESHOW,
  /* Album 5 · Silence in Heaven — 18 song slideshows + 19 dialog interludes
   * synthesised from SIH_SHOW_PROGRAM. Frame art binds via the barrel in
   * slideshowData/silence-in-heaven/index.ts; dialog interludes are built
   * at module load from silenceInHeavenShow.ts. */
  ...Object.fromEntries(ALL_SIH_TRACKS.map((t) => [t.id, t])),
  ...Object.fromEntries(SIH_DIALOG_SLIDESHOWS.map((d) => [d.id, d])),
};

export function getSlideshow(id: string): SongSlideshowDef | undefined {
  return SONG_SLIDESHOWS[id];
}

/** All slideshow ids in the registry, sorted by priority then id. */
export function listSlideshows(): SongSlideshowDef[] {
  const order: Record<"P0" | "P1" | "P2", number> = { P0: 0, P1: 1, P2: 2 };
  return Object.values(SONG_SLIDESHOWS).sort((a, b) => {
    const p = order[a.priority] - order[b.priority];
    if (p !== 0) return p;
    return a.id.localeCompare(b.id);
  });
}
