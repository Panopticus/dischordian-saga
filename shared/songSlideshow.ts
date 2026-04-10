/* ═══════════════════════════════════════════════════════
   THE SONG SLIDESHOW ENGINE — Data Model

   Spec from PART 5 of the Witnessing production plan.

   A SongSlideshow is an audio-synchronised cinematic built
   from a list of keyframes. The component in
   client/src/components/SongSlideshow.tsx renders these
   data objects. This file is the pure data contract shared
   between server, client, and tests.
   ═══════════════════════════════════════════════════════ */

/* ─── FRAMES ─── */

export interface KenBurnsParams {
  /** Starting scale (1.0 = no zoom). */
  startScale: number;
  /** Ending scale. */
  endScale: number;
  /** Starting translate, percent of image width/height. */
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  /** Easing function applied to the scale + translate interpolation. */
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export type FrameTransition =
  | "fade"
  | "dissolve"
  | "hardcut"
  | "iris"
  | "static";

export interface SlideshowFrame {
  /** Millisecond offset from song start when this frame becomes visible. */
  startMs: number;
  /** Millisecond offset when this frame ends (next frame begins). */
  endMs: number;
  /** Image URL (relative or absolute). */
  imageUrl: string;
  /** Ken-Burns camera movement across the frame's duration. */
  kenBurns?: KenBurnsParams;
  /** Transition style into this frame. */
  transition: FrameTransition;
  /** Optional caption placed along the top/bottom of the frame. */
  caption?: string;
  /** Optional dialog line laid over the frame (attributed to dialogSpeakerId). */
  dialogOverlay?: string;
  dialogSpeakerId?: string;
  /** Optional alt text for accessibility (used by reduced motion fallback). */
  alt?: string;
}

/* ─── LYRICS ─── */

export type LyricEmphasis = "normal" | "emphasized" | "shout" | "whisper";

export interface LyricLine {
  /** Millisecond offset when this line appears. */
  startMs: number;
  /** Millisecond offset when this line fades out. */
  endMs: number;
  /** Line of song text. */
  text: string;
  /** Visual treatment applied to the line. */
  emphasis: LyricEmphasis;
  /**
   * Which narrator voice, if any, is delivering this line? Used by
   * the slideshow to tint the lyric or swap the portrait.
   */
  speakerId?: "elara" | "human" | "lyra_vox" | "engineer" | "seer";
}

/* ─── OVERLAYS ─── */

export type SlideshowOverlayKind =
  | "logo"          // Chapter title card
  | "location"      // Place / year label
  | "chapter"       // Act indicator
  | "date"          // Time stamp (e.g., "TRANSMISSION DATE — 3 YEARS AGO")
  | "subtitle";     // Plain subtitle

export interface SlideshowOverlay {
  kind: SlideshowOverlayKind;
  startMs: number;
  endMs: number;
  text: string;
  /** Tailwind / CSS class to tint the overlay with. */
  className?: string;
}

/* ─── NARRATOR REACTIONS ─── */

/**
 * Thin subtitle bar that appears at the bottom of the slideshow
 * while Elara or The Human "react" to what's on screen. See spec
 * §5.1 — this is how we land emotional beats without stopping the
 * cinematic to roll a full dialog scene.
 */
export interface NarratorReactionTrack {
  narrator: "elara" | "human" | "lyra_vox";
  lines: NarratorReactionLine[];
}

export interface NarratorReactionLine {
  startMs: number;
  endMs: number;
  text: string;
  /** Bond delta applied for watching to completion. */
  bondDelta?: number;
}

/* ─── REDUCED-MOTION FALLBACK ─── */

export interface ReducedMotionSummary {
  /** Single static image shown in place of the slideshow. */
  imageUrl: string;
  /** Plain-text summary of the song's narrative. Rendered as paragraphs. */
  summary: string[];
  /** Shorter caption used for screen readers. */
  alt: string;
}

/* ─── CORE CONTRACT ─── */

export interface SongSlideshow {
  /** Stable slug — e.g., "last-words", "welcome-to-celebration". */
  id: string;
  /** Song ID in the music library (key for the audio player). */
  songId: string;
  /** Audio asset URL. */
  audioUrl: string;
  /** Total duration in milliseconds (used to drive the timeline). */
  durationMs: number;
  /** Display title. */
  title: string;
  /** Optional subtitle / tagline. */
  subtitle?: string;
  /** Credits line shown at the end of the slideshow. */
  credits?: string;
  /** Ordered list of keyframes. */
  frames: SlideshowFrame[];
  /** Synchronised lyrics (optional). */
  lyrics?: LyricLine[];
  /** Floating overlays such as chapter titles, dates, etc. */
  overlays?: SlideshowOverlay[];
  /** Flags set on the player's save when the slideshow is completed. */
  flagsSetOnComplete?: string[];
  /** Loredex entry unlocked when the slideshow finishes. */
  unlockLoredexEntry?: string;
  /** Narrator reaction bars. */
  narratorReactions?: NarratorReactionTrack[];
  /** Required reduced-motion alternative. */
  reducedMotionFallback: ReducedMotionSummary;
  /** Priority tier — "P0" blocks progression; "P1" stagger post-launch. */
  priority: "P0" | "P1" | "P2";
  /** Which act the slideshow gates. */
  actGate: "prelude" | "act1" | "act2" | "act3" | "act4" | "act4.5" | "act5";
}

/* ─── HELPERS ─── */

/**
 * Pick the frame that is active at `timeMs`. Returns the LAST frame
 * whose start is <= timeMs.
 */
export function getActiveFrame(
  slideshow: SongSlideshow,
  timeMs: number,
): SlideshowFrame | null {
  if (slideshow.frames.length === 0) return null;
  let active: SlideshowFrame | null = null;
  for (const frame of slideshow.frames) {
    if (frame.startMs <= timeMs) active = frame;
    else break;
  }
  return active;
}

/** Pick all lyric lines visible at `timeMs`. */
export function getVisibleLyrics(
  slideshow: SongSlideshow,
  timeMs: number,
): LyricLine[] {
  if (!slideshow.lyrics) return [];
  return slideshow.lyrics.filter(line => line.startMs <= timeMs && line.endMs >= timeMs);
}

/** Pick the active overlay (if any) for `timeMs`. */
export function getActiveOverlay(
  slideshow: SongSlideshow,
  timeMs: number,
): SlideshowOverlay | null {
  if (!slideshow.overlays) return null;
  return slideshow.overlays.find(o => o.startMs <= timeMs && o.endMs >= timeMs) ?? null;
}

/** Get the narrator reaction line visible at `timeMs`, if any. */
export function getActiveNarratorReaction(
  slideshow: SongSlideshow,
  timeMs: number,
): { narrator: NarratorReactionTrack["narrator"]; line: NarratorReactionLine } | null {
  if (!slideshow.narratorReactions) return null;
  for (const track of slideshow.narratorReactions) {
    const line = track.lines.find(l => l.startMs <= timeMs && l.endMs >= timeMs);
    if (line) return { narrator: track.narrator, line };
  }
  return null;
}

/**
 * Has the viewer seen enough of the slideshow to count as "completed"?
 * Skip button is allowed after 15% completion per spec §5.1, but flags
 * only set if a viewer reaches ≥85%.
 */
export function canSkip(slideshow: SongSlideshow, timeMs: number): boolean {
  return timeMs >= slideshow.durationMs * 0.15;
}

export function isCompleted(slideshow: SongSlideshow, timeMs: number): boolean {
  return timeMs >= slideshow.durationMs * 0.85;
}

/* ─── SLIDESHOW REGISTRY ─── */

/**
 * Priority list of slideshows to produce, per spec §5.3.
 * The registry only holds metadata — actual frame data is loaded
 * lazily from data/ JSON files at runtime.
 */
export interface SlideshowRegistryEntry {
  id: string;
  title: string;
  song: string;
  priority: "P0" | "P1" | "P2";
  actGate: SongSlideshow["actGate"];
  /** Short description for the production backlog. */
  logline: string;
}

export const SLIDESHOW_REGISTRY: SlideshowRegistryEntry[] = [
  { id: "last-words", title: "Last Words", song: "Dischordian Logic Track 28", priority: "P0", actGate: "act1",
    logline: "Act 1 finale — the Engineer's execution in New Babylon. 15-frame master slideshow." },
  { id: "welcome-to-celebration", title: "Welcome to Celebration", song: "Dischordian Logic Track 25", priority: "P0", actGate: "act1",
    logline: "Cycle A opener — the Architect's kindergarten of gods." },
  { id: "to-be-the-human", title: "To Be the Human", song: "Dischordian Logic Track (TBD)", priority: "P0", actGate: "act1",
    logline: "Cycle B opener — Mechronis through the Detective's eyes." },
  { id: "hacking-reality", title: "Hacking Reality", song: "Dischordian Logic", priority: "P1", actGate: "act1",
    logline: "Cycle C opener — Nexon and the Dischordian Deck's first strike." },
  { id: "i-am-the-eyes-that-watch", title: "I Am the Eyes That Watch", song: "Dischordian Logic", priority: "P0", actGate: "act3",
    logline: "Act 3 opener — a woman made of lenses speaks from three years ago." },
  { id: "ocularum", title: "Ocularum", song: "The Age of Privacy", priority: "P0", actGate: "act3",
    logline: "Act 3 mid — the Collector's garden." },
  { id: "the-prisoner", title: "The Prisoner", song: "The Age of Privacy", priority: "P0", actGate: "act4",
    logline: "Act 4 opener — the Panopticon's eye." },
  { id: "the-lion-in-black", title: "The Lion in Black", song: "Book of Daniel 2:47", priority: "P0", actGate: "act5",
    logline: "Act 5 opener — Iron Lion's helmet and the Bridge of Kael." },
  { id: "identity", title: "Identity", song: "Book of Daniel 2:47", priority: "P1", actGate: "act4.5",
    logline: "Dead Man's Circuit naming sequence." },
  { id: "superman-aint-coming", title: "Superman Ain't Coming", song: "Silence in Heaven", priority: "P1", actGate: "act4",
    logline: "Human dark-trust personal cinematic." },
  { id: "it-aint-been-the-same", title: "It Ain't Been the Same", song: "Silence in Heaven", priority: "P1", actGate: "act4",
    logline: "Elara high-trust personal cinematic." },
  { id: "consider-life", title: "Consider Life", song: "Book of Daniel 2:47", priority: "P1", actGate: "act3",
    logline: "Two Witnesses Meet reflective coda." },

  /* ─── GALACTIC DANCE CINEMATICS ─── */
  // See docs/design/THE_GALACTIC_DANCE.md Part 10 — these hook into the
  // faction first-contact system and the Voltari transmission arc.
  { id: "voltari-word-in-the-storm", title: "The Word in the Storm", song: "The Enigma's Lament", priority: "P0", actGate: "act2",
    logline: "Voltari first contact — AWAKE arrives through a 37-second shield failure." },
  { id: "voltari-awake-remember-before-you", title: "Awake Remember Before You", song: "Dischordian Logic", priority: "P0", actGate: "act3",
    logline: "Community decodes the four-word sentence across the galaxy map." },
  { id: "voltari-coordinate", title: "The Coordinate", song: "The Two Witnesses", priority: "P1", actGate: "act4",
    logline: "The Voltari share a coordinate for the first time in five Ages." },
  { id: "council-of-survivors", title: "The Council of Survivors", song: "Silence in Heaven", priority: "P0", actGate: "act2",
    logline: "New Atarion first contact — Mirren Hale, tired and assessing." },
  { id: "the-long-mourning", title: "The Long Mourning", song: "We Are Not Okay", priority: "P0", actGate: "act3",
    logline: "The Thalorian Hierophant writes names back into the record — three thousand years in." },
  { id: "seventeen-thousand", title: "Seventeen Thousand", song: "Family Tree", priority: "P1", actGate: "act3",
    logline: "Awakened Clones — General Binath-VII and the Oracle's living argument." },
];
