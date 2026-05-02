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
import type { SongSlideshowDef } from "./songSlideshow";
import { assetUrl } from "../client/src/lib/assetUrl";
import { ALBUM1_TRACKS } from "./expansionArt/album1Slideshows";

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

/** Vision 1 cutscene script — see Part 1.5 of the recruitment plan
 *  for the per-frame caption authoring rationale. The producer-frame
 *  reordering is intentional: the Dreamer is showing the player
 *  imagery they've already seen during normal Album 1 playback,
 *  refracted into a different meaning. */
const VISION_1_FRAMES: ReadonlyArray<{
  producerIndex: number;
  caption: string;
}> = [
  { producerIndex: 7,  caption: "the first notice is not a noise" },
  { producerIndex: 2,  caption: "count your hands when you wake" },
  { producerIndex: 11, caption: "the gate was not where you thought" },
  { producerIndex: 5,  caption: "someone has been keeping the score" },
  { producerIndex: 14, caption: "they sat with you for years" },
  { producerIndex: 3,  caption: "and you never asked their name" },
  { producerIndex: 9,  caption: "the window was always lit" },
  { producerIndex: 1,  caption: "you have been seen" },
];

const t03FrameUrl = (i: number) => album1FrameUrl("T03", i);
const t03TitleUrl = () => album1TitleUrl("T03");

function buildVision1Slideshow(): SongSlideshowDef {
  return {
    id: "vision_first_notice",
    songId: "dreamer_vision_1",
    audioUrl: assetUrl("audio/album1/T03.mp3"),
    durationMs: VISION_1_RUNTIME_MS,
    title: "The First Notice",
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
    // No flags fire on completion — the vision-delivery system handles
    // the bookkeeping via dreamerAwareness.markVisionReceived() so
    // re-trigger logic isn't tied to slideshow flag state.
    flagsSetOnComplete: [],
    reducedMotionFallback: {
      heroImageUrl: t03TitleUrl(),
      prose:
        "you have been seen. count your hands when you wake. the window was always lit.",
      closingLine: "(no signature)",
    },
  };
}

/** Cached so re-renders don't rebuild the def. */
const VISION_1_SLIDESHOW = buildVision1Slideshow();

const VISION_1: DreamerVision = {
  id: "vision_first_notice",
  threshold: 3,
  title: "The First Notice",
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

/* ─── Visions 3-4 (stubs) ─────────────────────────────────────────
 *
 * Each follows the Vision 1/2 build pattern but the renderer needs
 * extension before they ship — both interleave Veo 3.1 video flashes
 * with the slideshow frames. The plan
 * (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md
 * §Part 1.5) specifies the frame mappings.
 *
 *   Vision 3 — "The Hidden Hand"           (threshold 13)
 *     Album 1 T18 / T15 / T20 mix + one Veo flash — 12 frames + 1
 *
 *   Vision 4 — "The Dreamer Sees You"      (threshold 23)
 *     Album 1 T23 + two Veo flashes — 6 frames + 2
 *
 * Blocked on: SongSlideshow.tsx renderer extension to accept mixed
 *   image-or-video frames (`frames: Array<{ kind: "image" | "video";
 *   ... }>`). When that lands, add Vision 3 + 4 here with the same
 *   build pattern.
 * ─────────────────────────────────────────────────────────────── */

/** Lookup: threshold → vision (or undefined if not yet built). */
const VISIONS_BY_THRESHOLD = new Map<VisionThreshold, DreamerVision>([
  [3, VISION_1],
  [7, VISION_2],
  // [13, VISION_3],  // pending SongSlideshow video-frame support
  // [23, VISION_4],
]);

/** All built visions, in threshold order. */
export const DREAMER_VISIONS: readonly DreamerVision[] = [VISION_1, VISION_2];

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
