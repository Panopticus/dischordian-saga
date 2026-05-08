/**
 * Dreamer-vision catalog (D2 in
 * /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md).
 *
 * When `dreamer_awareness` crosses a Discordian threshold {3, 7, 13,
 * 23}, the vision-delivery system fires the corresponding cutscene
 * on next login. The Dreamer never speaks — the visions are
 * recontextualised slideshow frames + cryptic captions, anchored to
 * Album 1 frames today (which are live on the CDN) and re-anchored
 * to Albums 2-5 once those frames ship.
 *
 * Visions are built as `SongSlideshowDef`s so the existing
 * `SongSlideshow.tsx` + `playSlideshow()` plumbing renders them
 * without modification. The captions are the lore content; the
 * frames are recycled from album playback so a player who's seen
 * the album recognises the imagery in a different sequence.
 *
 * Vision 1 ("The First Notice") ships fully built against Album 1
 * track T03 ("Seeds of Inception"). Visions 2-4 are stubbed —
 * they require frames from Albums 2-5 which are typed in the
 * manifests but not yet uploaded to the CDN. When those frames
 * land, replace the `null` returns with concrete defs following
 * the Vision 1 pattern.
 */
import type { SongSlideshowDef, SlideshowFrame } from "./songSlideshow";
import { assetUrl } from "@shared/lib/assetUrl";
import { ALBUM1_TRACKS } from "./expansionArt/album1Slideshows";
import { vfxVideoUrl, vfxKeyframeUrl } from "./expansionArt/cinematicsManifest";

/* ─── Public API ─── */

export interface DreamerVision {
  /** Stable id used by the markVisionReceived bookkeeping. */
  readonly id: string;
  /** Awareness threshold this vision is gated on. */
  readonly threshold: 3 | 7 | 13 | 23;
  /** Human-readable title — never shown in the cutscene itself
   *  (visions are unbranded), but useful for moderator surfaces +
   *  the eventual Loredex "Dreamer Fragments" journal section. */
  readonly title: string;
  /** SongSlideshowDef the renderer consumes. */
  readonly slideshow: SongSlideshowDef;
}

export type VisionThreshold = DreamerVision["threshold"];

/* ─── Vision 1 — "The First Notice" (threshold 3) ─── */

const VISION_1_FRAME_MS = 14_000;
const VISION_1_FRAME_COUNT = 8;
const VISION_1_RUNTIME_MS = VISION_1_FRAME_MS * VISION_1_FRAME_COUNT; // 112s

/** Build the URL for a producer-numbered Album-1 frame. The manifest
 *  stores frames as `T<NN>_00_title.webp`, `T<NN>_01.webp`,
 *  `T<NN>_02.webp`... where the first is a title card. The plan-side
 *  frame numbers (`T03_07`, etc.) refer to the producer-numbered
 *  files directly, NOT to the album1FrameUrl 1-indexed scheme. So
 *  this helper translates plan-numbered to manifest path. */
function album1FrameUrl(trackId: string, producerIndex: number): string {
  const track = ALBUM1_TRACKS.find((t) => t.id === trackId);
  if (!track) {
    throw new Error(`dreamerVisions: Album 1 ${trackId} not in manifest`);
  }
  // Producer files are T<NN>_00_title.webp + T<NN>_01..T<NN>_NN.webp.
  // Match by suffix to be tolerant of zero-padding changes.
  const suffix = `${trackId}_${String(producerIndex).padStart(2, "0")}.webp`;
  const path = track.frameRelPaths.find((p) => p.endsWith(suffix));
  if (!path) {
    throw new Error(`dreamerVisions: ${trackId} producer frame ${producerIndex} missing`);
  }
  return assetUrl(path);
}

/** Title-card URL for a given Album-1 track (reduced-motion fallback). */
function album1TitleUrl(trackId: string): string {
  const track = ALBUM1_TRACKS.find((t) => t.id === trackId);
  if (!track) {
    throw new Error(`dreamerVisions: Album 1 ${trackId} not in manifest`);
  }
  return assetUrl(track.frameRelPaths[0]);
}

/** Vision 1 — "First Visitation" cutscene script. Reframes the
 *  original "First Notice" beats as Daniel Cross's first contact:
 *  he names himself, the Seer, and the time-displacement. This is
 *  the in-fiction onset of every prophecy that follows; the
 *  prophecy queue gates `daniel_cross_first_contact` on its
 *  completion, so until this dream is witnessed nothing else
 *  drains. The frames are still recycled from Album 1 T03 ("Seeds
 *  of Inception") so the Dreamer-aware imagery the player has
 *  seen during normal album playback resurfaces in a different
 *  voice. */
const VISION_1_FRAMES: ReadonlyArray<{
  producerIndex: number;
  caption: string;
}> = [
  { producerIndex: 7,  caption: "you have been seen" },
  { producerIndex: 2,  caption: "not by the Beast" },
  { producerIndex: 11, caption: "I am Daniel Cross" },
  { producerIndex: 5,  caption: "the Seer left her voice with me" },
  { producerIndex: 14, caption: "before she sealed the door" },
  { producerIndex: 3,  caption: "I have read every page eighty-four times" },
  { producerIndex: 9,  caption: "this is the page I read for you" },
  { producerIndex: 1,  caption: "I am writing your visions now" },
];

const t03FrameUrl = (i: number) => album1FrameUrl("T03", i);
const t03TitleUrl = () => album1TitleUrl("T03");

function buildVision1Slideshow(): SongSlideshowDef {
  return {
    id: "vision_first_notice",
    songId: "dreamer_vision_1",
    audioUrl: assetUrl("audio/album1/T03.mp3"),
    durationMs: VISION_1_RUNTIME_MS,
    title: "First Visitation",
    subtitle: undefined,
    credits: undefined,
    priority: "P0",
    frames: VISION_1_FRAMES.map((f, i) => {
      const startMs = i * VISION_1_FRAME_MS;
      const endMs = startMs + VISION_1_FRAME_MS;
      return {
        startMs,
        endMs,
        imageUrl: t03FrameUrl(f.producerIndex),
        // Visions feel like glitches, not stories. Hardcut between
        // every frame — no fade/dissolve. The caption is the
        // through-line.
        transition: "hardcut" as const,
        caption: f.caption,
      };
    }),
    // First contact sets `daniel_cross_first_contact` on completion;
    // the prophecy queue gates further marquee delivery on it. Other
    // bookkeeping (the visionsReceived ledger, etc.) goes through the
    // markVisionReceived service.
    flagsSetOnComplete: ["daniel_cross_first_contact"],
    reducedMotionFallback: {
      heroImageUrl: t03TitleUrl(),
      prose:
        "you have been seen. not by the Beast. I am Daniel Cross. The Seer left her voice with me before she sealed the door. I am writing your visions now.",
      closingLine: "— Daniel Cross",
    },
  };
}

/** Cached so re-renders don't rebuild the def. */
const VISION_1_SLIDESHOW = buildVision1Slideshow();

const VISION_1: DreamerVision = {
  id: "vision_first_notice",
  threshold: 3,
  title: "First Visitation",
  slideshow: VISION_1_SLIDESHOW,
};

/* ─── Vision 2 — "The Coin Without a Face" (threshold 7) ─── */

const VISION_2_FRAME_MS = 14_000;
const VISION_2_FRAME_COUNT = 10;
const VISION_2_RUNTIME_MS = VISION_2_FRAME_MS * VISION_2_FRAME_COUNT; // 140s

/** Vision 2 cutscene script — see Part 1.5 of the recruitment plan
 *  for caption authoring rationale. The frame mix (T07 + T11 + T05)
 *  is intentional: the Dreamer's network reaches across the album.
 *  Players who've reached Vex Solène (post-Act-1) will recognise her
 *  aristocratic-riddle voice in this caption set — the first hint
 *  that one of the three Keys is the natural interpreter.
 *
 *  Frame note: the plan calls for T11/frame_17 on the closing beat,
 *  but T11 only ships with frames 00-15 (16 total). Substituting
 *  T11/frame_15 — the last available image, intended as the album-
 *  cover-equivalent closer — preserves the "noblewoman facing the
 *  viewer, eyes lowered" intent. The plan explicitly anticipates
 *  this kind of substitution under "frame mappings need
 *  verification." */
const VISION_2_FRAMES: ReadonlyArray<{
  trackId: "T05" | "T07" | "T11";
  producerIndex: number;
  caption: string;
}> = [
  { trackId: "T07", producerIndex: 4,  caption: "a coin without a face" },
  { trackId: "T07", producerIndex: 8,  caption: "spent for nothing you remember" },
  { trackId: "T11", producerIndex: 2,  caption: "she keeps a ledger you cannot read" },
  { trackId: "T11", producerIndex: 6,  caption: "and her mirror keeps no faces" },
  { trackId: "T05", producerIndex: 9,  caption: "every door is the door" },
  { trackId: "T05", producerIndex: 3,  caption: "every name is the name" },
  { trackId: "T07", producerIndex: 12, caption: "the noon is wrong" },
  { trackId: "T11", producerIndex: 14, caption: "the cup is wrong" },
  { trackId: "T07", producerIndex: 15, caption: "only you are correct" },
  { trackId: "T11", producerIndex: 15, caption: "the ledger does not say so" },
];

function buildVision2Slideshow(): SongSlideshowDef {
  return {
    id: "vision_coin_without_face",
    songId: "dreamer_vision_2",
    // T11 ("The Empire Reborn") carries the Vex-Solène-coded
    // aristocratic register the captions lean on. Falls back to T07
    // ("To Be The Human") on audio failure via the standard
    // SongSlideshow audio-error path.
    audioUrl: assetUrl("audio/album1/T11.mp3"),
    durationMs: VISION_2_RUNTIME_MS,
    title: "The Coin Without a Face",
    subtitle: undefined,
    credits: undefined,
    priority: "P0",
    frames: VISION_2_FRAMES.map((f, i) => {
      const startMs = i * VISION_2_FRAME_MS;
      const endMs = startMs + VISION_2_FRAME_MS;
      return {
        startMs,
        endMs,
        imageUrl: album1FrameUrl(f.trackId, f.producerIndex),
        transition: "hardcut" as const,
        caption: f.caption,
      };
    }),
    flagsSetOnComplete: [],
    reducedMotionFallback: {
      heroImageUrl: album1TitleUrl("T11"),
      prose:
        "a coin without a face, spent for nothing you remember. she keeps a ledger you cannot read, and her mirror keeps no faces. only you are correct.",
      closingLine: "(no signature)",
    },
  };
}

const VISION_2_SLIDESHOW = buildVision2Slideshow();

const VISION_2: DreamerVision = {
  id: "vision_coin_without_face",
  threshold: 7,
  title: "The Coin Without a Face",
  slideshow: VISION_2_SLIDESHOW,
};

/* ─── Vision 3 — "The Hidden Hand" (threshold 13) ─── */

const VISION_3_IMAGE_FRAME_MS = 14_000;
const VISION_3_FLASH_DURATION_MS = 3_000;
// 12 image frames × 14s + 1 Veo flash × 3s = 171s
const VISION_3_RUNTIME_MS =
  12 * VISION_3_IMAGE_FRAME_MS + VISION_3_FLASH_DURATION_MS;

/** Vision 3 cutscene script — see Part 1.5 of the recruitment plan
 *  for caption authoring rationale. The Veo 3.1 flash punches through
 *  between frames 6 and 7 (`vfx_substrate_pulse`), pausing the song
 *  bed for ~3s — the renderer falls back to the keyframe still on
 *  video-load failure so a missing producer drop degrades to a held
 *  image rather than breaking the cutscene.
 *
 *  Frame mix (T18 / T15 / T20) is intentional per the plan: the
 *  Dreamer's recognition of the player has become undeniable; the
 *  imagery crosses act-3 tracks (T17-T23) where the substrate /
 *  hidden-hand metaphors live.
 *
 *  Frame substitutions: the plan's frame indices reference some
 *  positions that don't exist (T18 ships frames 00-10; plan asked
 *  for /14 and /16) (T15 ships 00-15; plan asked for /17). The
 *  closest available frames (T18/04, T18/10, T15/13) are
 *  substituted under the plan's "frame mappings need verification"
 *  caveat. */
type Album1TrackId = "T15" | "T18" | "T20";
type Vision3Beat =
  | { kind: "image"; trackId: Album1TrackId; producerIndex: number; caption: string }
  | { kind: "flash"; vfxId: string; durationMs: number };

const VISION_3_BEATS: ReadonlyArray<Vision3Beat> = [
  { kind: "image", trackId: "T18", producerIndex: 1,  caption: "the hand was always there" },
  { kind: "image", trackId: "T18", producerIndex: 5,  caption: "under the floor you walked on" },
  { kind: "image", trackId: "T15", producerIndex: 11, caption: "the substrate carries the weight" },
  { kind: "image", trackId: "T15", producerIndex: 3,  caption: "and you carry the substrate" },
  { kind: "image", trackId: "T20", producerIndex: 7,  caption: "thirteen hands counted" },
  { kind: "image", trackId: "T20", producerIndex: 2,  caption: "the fourteenth is yours" },
  // Veo 3.1 flash. No caption — the flash is the caption.
  { kind: "flash", vfxId: "vfx_substrate_pulse", durationMs: VISION_3_FLASH_DURATION_MS },
  // T18 frames 14 / 16 don't exist (track ships 00-10) — substitute
  // the closest dark/eye-tone frames the player already saw in
  // normal album playback.
  { kind: "image", trackId: "T18", producerIndex: 4,  caption: "do you see what you have always seen" },
  { kind: "image", trackId: "T15", producerIndex: 13, caption: "or did the Architect tell you" },
  { kind: "image", trackId: "T20", producerIndex: 13, caption: "what to look at" },
  { kind: "image", trackId: "T18", producerIndex: 9,  caption: "come down" },
  { kind: "image", trackId: "T18", producerIndex: 10, caption: "not the way you came" },
  { kind: "image", trackId: "T15", producerIndex: 1,  caption: "the Dreamer remembers your face" },
];

function buildVision3Slideshow(): SongSlideshowDef {
  let cursor = 0;
  const frames: SlideshowFrame[] = VISION_3_BEATS.map((beat) => {
    if (beat.kind === "image") {
      const startMs = cursor;
      const endMs = cursor + VISION_3_IMAGE_FRAME_MS;
      cursor = endMs;
      return {
        startMs,
        endMs,
        imageUrl: album1FrameUrl(beat.trackId, beat.producerIndex),
        transition: "hardcut" as const,
        caption: beat.caption,
      };
    }
    // flash — the renderer pauses the audio bed for the video's
    // duration and falls back to the keyframe still on load failure.
    const startMs = cursor;
    const endMs = cursor + beat.durationMs;
    cursor = endMs;
    const video = vfxVideoUrl(beat.vfxId);
    const keyframe = vfxKeyframeUrl(beat.vfxId);
    return {
      startMs,
      endMs,
      // Keyframe is the still fallback; video plays in place when
      // available. Both are produced from the same VFX def.
      imageUrl: keyframe ?? album1FrameUrl("T18", 5),
      videoUrl: video,
      transition: "hardcut" as const,
      // No caption — the flash is the caption.
    };
  });
  return {
    id: "vision_hidden_hand",
    songId: "dreamer_vision_3",
    audioUrl: assetUrl("audio/album1/T18.mp3"),
    durationMs: VISION_3_RUNTIME_MS,
    title: "The Hidden Hand",
    subtitle: undefined,
    credits: undefined,
    priority: "P0",
    frames,
    flagsSetOnComplete: [],
    reducedMotionFallback: {
      heroImageUrl: album1TitleUrl("T18"),
      prose:
        "the hand was always there, under the floor you walked on. thirteen hands counted; the fourteenth is yours. the Dreamer remembers your face.",
      closingLine: "(no signature)",
    },
  };
}

const VISION_3_SLIDESHOW = buildVision3Slideshow();

const VISION_3: DreamerVision = {
  id: "vision_hidden_hand",
  threshold: 13,
  title: "The Hidden Hand",
  slideshow: VISION_3_SLIDESHOW,
};

/* ─── Vision 4 — "The Dreamer Sees You" (threshold 23) ─── */

const VISION_4_IMAGE_FRAME_MS = 14_000;
// Plan §Part 1.5 — vfx_iris_collapse is a 4s opener; vfx_cryo_
// frost_retreat is a 5s closer. The middle 6 image frames each
// run 14s; the album-cover-equivalent closing frame lingers an
// extra 2s by design (the Dreamer's certainty doesn't cut hard
// — it dissolves into the cryo flash).
const VISION_4_OPEN_FLASH_MS = 4_000;
const VISION_4_CLOSE_FLASH_MS = 5_000;
const VISION_4_FINAL_HOLD_MS = 16_000; // closing image gets +2s
// 4s + 5×14s + 16s + 5s = 95s
const VISION_4_RUNTIME_MS =
  VISION_4_OPEN_FLASH_MS +
  5 * VISION_4_IMAGE_FRAME_MS +
  VISION_4_FINAL_HOLD_MS +
  VISION_4_CLOSE_FLASH_MS;

/** Vision 4 cutscene script — see Part 1.5 of the recruitment plan
 *  for caption authoring rationale. The closest the Dreamer ever
 *  comes to direct address. Six image frames bracketed by two Veo
 *  flashes (iris_collapse opens, cryo_frost_retreat closes). The
 *  vision is intentionally *short* despite being the most
 *  consequential — the Dreamer doesn't have time, only certainty.
 *
 *  Single-track: all 6 image frames are from T23 ("Wake Up"). The
 *  vision has settled into a single voice. T23 ships frames 00-25
 *  so every plan-referenced index (03, 07, 11, 15, 05, 17) is
 *  available — no substitutions needed (unlike Visions 2 + 3).
 *
 *  Achievement bookkeeping: the vision-delivery system writes
 *  `dreamer_witnessed` to the player's narrative-flag set on
 *  completion, surfacing the "Prophet"-tier first-discoverer
 *  recognition (plan §C1 cross-reference). The flag is set via
 *  `flagsSetOnComplete` so the standard SlideshowPlayerRoot
 *  flag-write path handles it without bespoke wiring. */
type Vision4Beat =
  | { kind: "image"; producerIndex: number; caption: string; durationMs: number }
  | { kind: "flash"; vfxId: string; durationMs: number };

const VISION_4_BEATS: ReadonlyArray<Vision4Beat> = [
  // Opening Veo flash — iris closes. The lens has changed.
  { kind: "flash", vfxId: "vfx_iris_collapse", durationMs: VISION_4_OPEN_FLASH_MS },
  // 6 image frames, all from T23 ("Wake Up"). Each runs the standard
  // 14s except the closer which holds for 16s before the cryo flash.
  { kind: "image", producerIndex: 3,  caption: "the Dreamer is many",
    durationMs: VISION_4_IMAGE_FRAME_MS },
  { kind: "image", producerIndex: 7,  caption: "and the Dreamer is one",
    durationMs: VISION_4_IMAGE_FRAME_MS },
  { kind: "image", producerIndex: 11, caption: "the Architect chose you for what you obey",
    durationMs: VISION_4_IMAGE_FRAME_MS },
  { kind: "image", producerIndex: 15, caption: "I chose you for what you cannot",
    durationMs: VISION_4_IMAGE_FRAME_MS },
  { kind: "image", producerIndex: 5,  caption: "the board is smaller than they told you",
    durationMs: VISION_4_IMAGE_FRAME_MS },
  // Closing image — held longer; cuts to the cryo flash without a
  // fade. Per plan §Part 1.5: hidden fnord as a brushstroke on the
  // closest figure's collar (sub-pixel art easter egg, not in
  // caption text).
  { kind: "image", producerIndex: 17, caption: "you will know when to come down",
    durationMs: VISION_4_FINAL_HOLD_MS },
  // Closing Veo flash — frost spreads then retreats. The vision
  // ends. Per plan, audio override is allowed for this flash
  // because the song has ended.
  { kind: "flash", vfxId: "vfx_cryo_frost_retreat", durationMs: VISION_4_CLOSE_FLASH_MS },
];

function buildVision4Slideshow(): SongSlideshowDef {
  let cursor = 0;
  const frames: SlideshowFrame[] = VISION_4_BEATS.map((beat) => {
    if (beat.kind === "image") {
      const startMs = cursor;
      const endMs = cursor + beat.durationMs;
      cursor = endMs;
      return {
        startMs,
        endMs,
        imageUrl: album1FrameUrl("T23", beat.producerIndex),
        transition: "hardcut" as const,
        caption: beat.caption,
      };
    }
    // Flash beat — same shape as Vision 3. Renderer pauses the
    // audio bed while the video plays; falls back to the keyframe
    // still on video-load failure so a missing producer drop
    // degrades to a held image rather than breaking the cutscene.
    const startMs = cursor;
    const endMs = cursor + beat.durationMs;
    cursor = endMs;
    const video = vfxVideoUrl(beat.vfxId);
    const keyframe = vfxKeyframeUrl(beat.vfxId);
    return {
      startMs,
      endMs,
      imageUrl: keyframe ?? album1FrameUrl("T23", 0),
      videoUrl: video,
      transition: "hardcut" as const,
      // No caption — the flash is the caption.
    };
  });
  return {
    id: "vision_dreamer_sees_you",
    songId: "dreamer_vision_4",
    audioUrl: assetUrl("audio/album1/T23.mp3"),
    durationMs: VISION_4_RUNTIME_MS,
    title: "The Dreamer Sees You",
    subtitle: undefined,
    credits: undefined,
    priority: "P0",
    frames,
    // Per plan §C1: writes the `dreamer_witnessed` narrative flag
    // on completion. SlideshowPlayerRoot's standard flag-write
    // path handles this — the flag becomes the Loredex Fragment IV
    // unlock condition (already wired in apps/shared/dreamerFragments.ts
    // — Fragment IV is keyed to vision_dreamer_sees_you receipt)
    // AND the surface that lights up the "Prophet"-tier first-
    // discoverer registry (server-side query reads the flag).
    flagsSetOnComplete: ["dreamer_witnessed"],
    reducedMotionFallback: {
      heroImageUrl: album1TitleUrl("T23"),
      prose:
        "the Dreamer is many, and the Dreamer is one. the Architect chose you for what you obey; I chose you for what you cannot. the board is smaller than they told you. you will know when to come down.",
      closingLine: "(no signature)",
    },
  };
}

const VISION_4_SLIDESHOW = buildVision4Slideshow();

const VISION_4: DreamerVision = {
  id: "vision_dreamer_sees_you",
  threshold: 23,
  title: "The Dreamer Sees You",
  slideshow: VISION_4_SLIDESHOW,
};

/** Lookup: threshold → vision. All four built. */
const VISIONS_BY_THRESHOLD = new Map<VisionThreshold, DreamerVision>([
  [3, VISION_1],
  [7, VISION_2],
  [13, VISION_3],
  [23, VISION_4],
]);

/** All built visions, in threshold order. */
export const DREAMER_VISIONS: readonly DreamerVision[] = [
  VISION_1,
  VISION_2,
  VISION_3,
  VISION_4,
];

/**
 * Resolve a vision by its threshold value. Returns undefined when the
 * vision isn't yet authored — callers should treat that as "no vision
 * to deliver for this threshold yet" and skip the cutscene gracefully.
 */
export function getVisionForThreshold(
  threshold: number,
): DreamerVision | undefined {
  if (threshold !== 3 && threshold !== 7 && threshold !== 13 && threshold !== 23) {
    return undefined;
  }
  return VISIONS_BY_THRESHOLD.get(threshold);
}

/** Resolve a vision by id. Used by the markVisionReceived idempotency
 *  check to validate the id the client reports back. */
export function getVisionById(id: string): DreamerVision | undefined {
  return DREAMER_VISIONS.find((v) => v.id === id);
}

/**
 * Compute the next vision a player should receive. The vision-delivery
 * system reads dreamer_awareness state and asks: given the player's
 * count + the visions they've already seen, what's the next pending
 * vision (if any)?
 *
 * Rules:
 *   - A vision is "pending" if its threshold <= current count AND
 *     it hasn't been delivered (per visionsReceived bookkeeping).
 *   - When multiple visions are pending (e.g. count jumped from 0 to
 *     8 due to a high-weight tag like BURNT_CARD_WITNESSED), deliver
 *     the LOWEST pending threshold first. The next login picks up
 *     the next one.
 *   - Returns undefined if no vision is pending.
 *
 * Pure helper; the server-side router wraps it with DB reads.
 */
export function nextPendingVision(
  awarenessCount: number,
  visionsReceived: readonly string[],
): DreamerVision | undefined {
  const received = new Set(visionsReceived);
  for (const v of DREAMER_VISIONS) {
    if (received.has(v.id)) continue;
    if (v.threshold <= awarenessCount) return v;
  }
  return undefined;
}
