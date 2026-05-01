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

/** Build the URL for a producer-numbered T03 frame. The Album 1
 *  manifest stores frames as `T03_00_title.webp`, `T03_01.webp`,
 *  `T03_02.webp`... where the first is a title card. The plan-side
 *  frame numbers (`T03_07`, etc.) refer to the producer-numbered
 *  files directly, NOT to the album1FrameUrl 1-indexed scheme. So
 *  this helper translates plan-numbered to manifest path. */
function t03FrameUrl(producerIndex: number): string {
  const t03 = ALBUM1_TRACKS.find((t) => t.id === "T03");
  if (!t03) {
    throw new Error("dreamerVisions: Album 1 T03 not in manifest");
  }
  // Producer files are T03_00_title.webp + T03_01.webp..T03_NN.webp.
  // Match by suffix to be tolerant of zero-padding changes.
  const suffix = `T03_${String(producerIndex).padStart(2, "0")}.webp`;
  const path = t03.frameRelPaths.find((p) => p.endsWith(suffix));
  if (!path) {
    throw new Error(`dreamerVisions: T03 producer frame ${producerIndex} missing`);
  }
  return assetUrl(path);
}

/** Title-card URL for the reduced-motion fallback. */
function t03TitleUrl(): string {
  const t03 = ALBUM1_TRACKS.find((t) => t.id === "T03");
  if (!t03) {
    throw new Error("dreamerVisions: Album 1 T03 not in manifest");
  }
  return assetUrl(t03.frameRelPaths[0]);
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

/* ─── Visions 2-4 (stubs) ─────────────────────────────────────────
 *
 * Each follows the Vision 1 build pattern but anchors against frames
 * from Albums 2-5, which are typed in the manifests but not yet
 * uploaded to the CDN as of this PR. The plan
 * (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md
 * §Part 1.5) specifies the frame mappings. Once Albums 2-5 frames
 * land, replace these `null`-returning entries with concrete
 * DreamerVision objects.
 *
 *   Vision 2 — "The Coin Without a Face"  (threshold 7)
 *     Album 1 T11 / T07 / T05 mix per plan — 10 frames × 14s
 *
 *   Vision 3 — "The Hidden Hand"           (threshold 13)
 *     Album 1 T18 / T15 / T20 mix + one Veo flash — 12 frames + 1
 *
 *   Vision 4 — "The Dreamer Sees You"      (threshold 23)
 *     Album 1 T23 + two Veo flashes — 6 frames + 2
 * ─────────────────────────────────────────────────────────────── */

/** Lookup: threshold → vision (or undefined if not yet built). */
const VISIONS_BY_THRESHOLD = new Map<VisionThreshold, DreamerVision>([
  [3, VISION_1],
  // [7, VISION_2],   // pending Albums 2-5 CDN upload
  // [13, VISION_3],
  // [23, VISION_4],
]);

/** All built visions, in threshold order. */
export const DREAMER_VISIONS: readonly DreamerVision[] = [VISION_1];

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
