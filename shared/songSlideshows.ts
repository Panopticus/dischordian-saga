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
      imageUrl: `/assets/slideshows/welcome-to-celebration/frame0${i + 1}.webp`,
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
    "cycle_a_complete",
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
    "cycle_b_complete",
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
    "slideshow_i_am_the_eyes_complete",
    "eyes_life_seen",
    "elara_watched_her_own_past",
    "panopticon_betrayal_seen",
    "act_3_opened",
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

/* ─── REGISTRY ─── */

/**
 * The canonical first-wave slideshow registry. More slideshows
 * are added here as art and audio for §5.5's priority list ship.
 */
export const SONG_SLIDESHOWS: Record<string, SongSlideshowDef> = {
  [LAST_WORDS_SLIDESHOW.id]: LAST_WORDS_SLIDESHOW,
  [WELCOME_TO_CELEBRATION_SLIDESHOW.id]: WELCOME_TO_CELEBRATION_SLIDESHOW,
  [TO_BE_THE_HUMAN_SLIDESHOW.id]: TO_BE_THE_HUMAN_SLIDESHOW,
  [I_AM_THE_EYES_SLIDESHOW.id]: I_AM_THE_EYES_SLIDESHOW,
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
