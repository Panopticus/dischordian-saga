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
    "act1_complete",
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

/* ─── REGISTRY ─── */

/**
 * The canonical first-wave slideshow registry. More slideshows
 * are added here as art and audio for §5.5's priority list ship.
 */
export const SONG_SLIDESHOWS: Record<string, SongSlideshowDef> = {
  [LAST_WORDS_SLIDESHOW.id]: LAST_WORDS_SLIDESHOW,
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
