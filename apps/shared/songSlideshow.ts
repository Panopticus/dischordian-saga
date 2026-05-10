/* ═══════════════════════════════════════════════════════
   SONG SLIDESHOW — Reusable Dynamic Cutscene Engine

   Witnessing Narrative Proposal §5.

   A slideshow is: song + timed still frames + synced
   lyric track + atmospheric overlays + reduced-motion
   fallback. This module defines the data shape every
   slideshow must conform to, validation helpers, and
   the canonical first-wave slideshow definitions.

   The React component that actually plays a slideshow
   lives at client/src/components/SongSlideshow.tsx and
   imports the types from this file.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface SongSlideshowDef {
  id: string;
  songId: string;
  audioUrl: string;
  /**
   * Optional cinematic video URL. When set, the slideshow player
   * plays this MP4 in place of the still-frame slideshow and
   * lets `audioUrl` ride underneath as the music bed. Used by
   * the Acts 2-7 AAA Final cinematic drop where each act opener
   * has both a `cin_act{N}_opener.mp4` and an `act-{N}-intro.mp3`.
   * Falls back to the frame slideshow if the video 404s.
   */
  videoUrl?: string;
  durationMs: number;
  title: string;
  subtitle?: string;
  credits?: string;
  frames: SlideshowFrame[];
  lyrics?: LyricLine[];
  overlays?: SlideshowOverlay[];
  /** Flags set in game state the moment the slideshow finishes (or skips past 15%). */
  flagsSetOnComplete?: string[];
  /** Loredex entry unlocked on completion. */
  unlockLoredexEntry?: string;
  /** Light-energy reward applied to the community pool (§3). */
  lightEnergyReward?: number;
  /** Static fallback for reduced-motion players. */
  reducedMotionFallback: ReducedMotionSummary;
  /** §5.5 priority tier — controls asset gating. */
  priority: "P0" | "P1" | "P2";
  /** Theater Mode — full production tier with dialog beats, lore cards, and theme metadata. */
  theaterMode?: TheaterModeConfig;
}

/* ─── THEATER MODE — Full Production Tier ─── */

export type TheaterDialogEmotion =
  | "neutral" | "grief" | "defiant" | "tender" | "cold"
  | "afraid" | "triumphant" | "wry";

export interface TheaterDialogBeat {
  startMs: number;
  endMs: number;
  /** Character name — matches NPC ids or narrator ids. */
  speaker: string;
  /** CDN key for portrait image (populated during art production). */
  speakerPortrait: string;
  /** The spoken line. */
  line: string;
  emotion: TheaterDialogEmotion;
  position: "left" | "right" | "center";
}

export interface LoreCardReveal {
  triggerMs: number;
  /** Loredex entity id. */
  entityId: string;
  displayDurationMs: number;
  revealAnimation: "slide_right" | "fade" | "decode" | "flip";
}

export interface TheaterModeConfig {
  /** Dialog lines that fire during instrumental passages. */
  dialogBeats: TheaterDialogBeat[];
  /** Lore cards that surface mid-song. */
  loreCardReveals: LoreCardReveal[];
  /** Primary theme color (hex). */
  themeColor: string;
  /** Default overlay style for the track. */
  overlayStyle: "vignette" | "scanlines" | "corruption" | "particles" | "grain" | "clean";
  /** Narrative act this track belongs to (for Silence in Heaven: I, II, III, Epilogue). */
  act?: string;
  /** Book of Revelation parallel reference. */
  revParallel?: string;
  /** Narrator ids active during this track. */
  narrators?: string[];
}

export interface SlideshowFrame {
  startMs: number;
  endMs: number;
  /** Always required as the fallback when a video frame fails to load. */
  imageUrl: string;
  /**
   * Optional video override for this frame. When set, the renderer
   * plays the MP4 in place of the still image for the frame's duration
   * and pauses the background audio while it does (so the song
   * "stretches over" the flash silently per the recruitment plan
   * §Part 1.5). On video-load failure or unsupported codec, the
   * renderer falls back to `imageUrl`. Used by D2 Vision 3 + 4
   * mid-slideshow Veo flashes.
   */
  videoUrl?: string;
  kenBurns?: KenBurnsSpec;
  transition: SlideshowTransition;
  /** Optional caption rendered in the frame corner. */
  caption?: string;
  /** Optional dialog line overlaid on this frame. */
  dialogOverlay?: string;
  /** NPC id for the dialog speaker (links to portrait tint). */
  dialogSpeakerId?: string;
  /** Which on-shoulder narrator visibly reacts during this frame. */
  narratorReactionId?: "elara" | "the_human" | "antiquarian" | null;
  /** Production reference — Kling v2 prompt to generate this keyframe. Not used at runtime. */
  klingPrompt?: string;
  /** Production reference — Seedance 2.0 motion prompt for this frame. Not used at runtime. */
  seedanceMotion?: string;
  /** Optional narrator portrait URL composited over the background.
   *  When set, the renderer overlays the image at `portraitSide`
   *  (default "center"). Used today by Silence in Heaven dialog
   *  interludes to surface the speaker's expression on top of the
   *  scene background. */
  portraitUrl?: string;
  /** Where the portrait sits relative to the frame. */
  portraitSide?: "left" | "right" | "center";
  /** Optional second portrait — composited alongside `portraitUrl` for
   *  joint-narration beats (Silence in Heaven `speaker: "both"`). The
   *  renderer draws both portraits at their respective sides so the
   *  conversation reads as two figures sharing the stage. */
  secondaryPortraitUrl?: string;
  secondaryPortraitSide?: "left" | "right" | "center";
}

export interface KenBurnsSpec {
  startScale: number;
  endScale: number;
  /** Pan values are normalized [-1, 1] offsets from image center. */
  startPan: [number, number];
  endPan: [number, number];
}

export type SlideshowTransition = "fade" | "dissolve" | "hardcut" | "iris" | "static";

export interface LyricLine {
  startMs: number;
  endMs: number;
  text: string;
  emphasis?: LyricEmphasis;
}

export type LyricEmphasis = "normal" | "whisper" | "shout" | "echo" | "layered";

export interface SlideshowOverlay {
  type: SlideshowOverlayType;
  startMs: number;
  endMs: number;
  /** 0-1. Clamped by the renderer. */
  intensity: number;
}

export type SlideshowOverlayType =
  | "particles"
  | "vignette"
  | "scanlines"
  | "grain"
  | "corruption"
  | "glitch"
  | "bloom";

export interface ReducedMotionSummary {
  /** Single hero image shown in place of the frame sequence. */
  heroImageUrl: string;
  /** Plain-prose description of what the slideshow depicts. */
  prose: string;
  /** Closing line shown under the prose block. */
  closingLine?: string;
}

/* ─── VALIDATION HELPERS ─── */

export interface SlideshowValidationIssue {
  kind:
    | "empty_frames"
    | "frame_ordering"
    | "frame_gap"
    | "lyric_ordering"
    | "overlay_ordering"
    | "ken_burns_scale"
    | "duration_mismatch";
  message: string;
}

/**
 * Validate a slideshow definition. Returns a list of issues.
 * Empty array means valid. Used in content integrity tests.
 */
export function validateSlideshow(def: SongSlideshowDef): SlideshowValidationIssue[] {
  const issues: SlideshowValidationIssue[] = [];

  if (def.frames.length === 0) {
    issues.push({ kind: "empty_frames", message: `Slideshow ${def.id} has no frames.` });
    return issues;
  }

  // Frames must be in chronological order with no backwards jumps or gaps.
  for (let i = 0; i < def.frames.length; i++) {
    const frame = def.frames[i];
    if (frame.endMs <= frame.startMs) {
      issues.push({
        kind: "frame_ordering",
        message: `Frame ${i} of ${def.id} has endMs <= startMs.`,
      });
    }
    if (i > 0) {
      const prev = def.frames[i - 1];
      if (frame.startMs < prev.endMs) {
        issues.push({
          kind: "frame_ordering",
          message: `Frame ${i} of ${def.id} starts before frame ${i - 1} ends.`,
        });
      }
      if (frame.startMs > prev.endMs + 250) {
        issues.push({
          kind: "frame_gap",
          message: `Gap > 250ms between frame ${i - 1} and ${i} of ${def.id}.`,
        });
      }
    }
    if (frame.kenBurns) {
      const { startScale, endScale } = frame.kenBurns;
      if (startScale <= 0 || endScale <= 0) {
        issues.push({
          kind: "ken_burns_scale",
          message: `Frame ${i} of ${def.id} has non-positive ken-burns scale.`,
        });
      }
    }
  }

  // Lyrics must be monotonic.
  if (def.lyrics) {
    for (let i = 1; i < def.lyrics.length; i++) {
      if (def.lyrics[i].startMs < def.lyrics[i - 1].startMs) {
        issues.push({
          kind: "lyric_ordering",
          message: `Lyric ${i} of ${def.id} starts before lyric ${i - 1}.`,
        });
      }
    }
  }

  // Overlays must have valid ranges.
  if (def.overlays) {
    for (let i = 0; i < def.overlays.length; i++) {
      const o = def.overlays[i];
      if (o.endMs <= o.startMs) {
        issues.push({
          kind: "overlay_ordering",
          message: `Overlay ${i} of ${def.id} has endMs <= startMs.`,
        });
      }
    }
  }

  // Duration must match the last frame.
  const last = def.frames[def.frames.length - 1];
  if (Math.abs(def.durationMs - last.endMs) > 1500) {
    issues.push({
      kind: "duration_mismatch",
      message: `Slideshow ${def.id} durationMs (${def.durationMs}) differs from last frame endMs (${last.endMs}) by > 1.5s.`,
    });
  }

  return issues;
}

/**
 * Returns the frame that should be on-screen at a given time.
 * Returns null if the time is before the first frame or after the last.
 */
export function getFrameAt(def: SongSlideshowDef, timeMs: number): SlideshowFrame | null {
  for (const f of def.frames) {
    if (timeMs >= f.startMs && timeMs < f.endMs) return f;
  }
  return null;
}

/** Returns the lyric line that should be visible at a given time. */
export function getLyricAt(def: SongSlideshowDef, timeMs: number): LyricLine | null {
  if (!def.lyrics) return null;
  for (const l of def.lyrics) {
    if (timeMs >= l.startMs && timeMs < l.endMs) return l;
  }
  return null;
}

/** Returns the overlays active at a given time. */
export function getActiveOverlays(
  def: SongSlideshowDef,
  timeMs: number,
): SlideshowOverlay[] {
  if (!def.overlays) return [];
  return def.overlays.filter((o) => timeMs >= o.startMs && timeMs < o.endMs);
}
