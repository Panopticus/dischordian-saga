/* ═══════════════════════════════════════════════════════
   SONG SLIDESHOW — Reusable cinematic component

   Timed still-art + lyrics + crossfade. Any song in the
   Lore Bible that doesn't have a music video can be rendered
   as a slideshow with this component.

   Props:
     frames   — ordered slide data (image, lyric, duration)
     audioSrc — optional song URL (plays automatically)
     onEnd    — fires when the last frame's duration expires

   See docs/design/WITNESSING_NARRATIVE_PROPOSAL.md §5
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DanielCrossProphecy } from "@shared/danielCrossProphecies";
import DreamProphecyFlash from "./DreamProphecyFlash";

/** Bookend pair drawn from DANIEL_CROSS_PROPHECIES. When provided
 *  to a slideshow in dreamMode, the opening flash plays before the
 *  first frame and the closing flash plays after the last. */
export interface DreamBookend {
  readonly opening: DanielCrossProphecy;
  readonly closing: DanielCrossProphecy;
}

/** Result of a dream-mode playback. Surfaced via onDreamEnd so the
 *  caller can decide whether the watch counts as full or partial. */
export interface DreamEndResult {
  readonly kind: "full" | "awoken_early";
  readonly visionId: string;
}

export interface SlideshowFrame {
  /** Path to the still image (relative to /public). Always required —
   *  used as the fallback when a video frame fails to load. */
  imageSrc: string;
  /** Optional video URL. When set, the renderer plays the MP4 in
   *  place of the still and pauses the background audio for the
   *  frame's duration (the song "stretches over" the flash silently
   *  per the recruitment plan §Part 1.5). Falls back to `imageSrc`
   *  on video-load failure or unsupported codec. */
  videoSrc?: string;
  /** Optional lyric line displayed over the image. */
  lyric?: string;
  /** How long this frame stays (ms). Default 5000. */
  durationMs?: number;
  /** Optional subtitle below the lyric (e.g. speaker attribution). */
  subtitle?: string;
  /** Optional narrator portrait composited over the background — the
   *  Silence in Heaven dialog interlude renderer drops the speaker's
   *  expression here so the line lands with a face attached. */
  portraitSrc?: string;
  /** Where the portrait sits. Default behaviour without a side is
   *  not to render the portrait. */
  portraitSide?: "left" | "right" | "center";
}

export interface SongSlideshowProps {
  frames: SlideshowFrame[];
  /** Optional audio source to auto-play alongside the slides. */
  audioSrc?: string;
  /** Called when the last frame's duration expires. */
  onEnd?: () => void;
  /** Allow the viewer to dismiss early with a click/tap. */
  dismissible?: boolean;
  /** Optional title shown before the first frame fades in. */
  title?: string;
  /** Dream mode: bookend the slideshow with prophecy flashes,
   *  hide the "tap to skip" hint, and surface an Awaken affordance
   *  in place of click-to-dismiss. The slideshow becomes a
   *  prophecy cinematic. */
  dreamMode?: boolean;
  /** Bookend prophecies — required when dreamMode is true. */
  bookend?: DreamBookend;
  /** Stable id for the vision being delivered. Surfaced back via
   *  onDreamEnd so the caller knows which vision was just resolved. */
  visionId?: string;
  /** Disable the awaken affordance — used for the unawakenable
   *  apex pair (First Visitation + "Not a Lion but a Lamb"). */
  unawakenable?: boolean;
  /** Dream-mode end callback. Fires with { kind: "full" } on
   *  natural completion of the closing prophecy flash, or
   *  { kind: "awoken_early" } when the player triggers the
   *  awaken affordance during the body. */
  onDreamEnd?: (result: DreamEndResult) => void;
}

const DEFAULT_DURATION = 5000;
const FADE_MS = 800;

export default function SongSlideshow({
  frames,
  audioSrc,
  onEnd,
  dismissible = true,
  title,
  dreamMode = false,
  bookend,
  visionId,
  unawakenable = false,
  onDreamEnd,
}: SongSlideshowProps) {
  // Dream-mode phases: opening flash → body → closing flash → done.
  // Non-dream playback skips straight to "body" and never visits
  // the bookend phases.
  const [dreamPhase, setDreamPhase] = useState<
    "opening" | "body" | "closing" | "done"
  >(dreamMode && bookend ? "opening" : "body");
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = title card
  const [dismissed, setDismissed] = useState(false);
  // Awaken affordance — hold-to-confirm so an accidental tap doesn't
  // skip the dream. 1.5s threshold matches the plan; mirrored in the
  // E2E test invariants.
  const [awakenHoldStart, setAwakenHoldStart] = useState<number | null>(null);
  const [awoken, setAwoken] = useState(false);
  // Track per-frame video-load failures so a 404 / unsupported codec
  // falls back to the still image without disrupting playback. Keyed
  // by frame index so a later frame's failure doesn't poison earlier
  // frames if the slideshow is re-mounted.
  const [videoFailedAtIndex, setVideoFailedAtIndex] = useState<Set<number>>(
    () => new Set(),
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const frame = currentIndex >= 0 && currentIndex < frames.length
    ? frames[currentIndex]
    : null;

  // True when the current frame should render as a <video>: it
  // declares a videoSrc AND the video hasn't already failed at this
  // index. Both checks live here so the timer + audio coordination
  // useEffects below stay in sync.
  const isVideoFrame =
    Boolean(frame?.videoSrc) && !videoFailedAtIndex.has(currentIndex);

  const finishBody = useCallback(() => {
    if (dreamMode && bookend) {
      setDreamPhase("closing");
    } else {
      onEnd?.();
    }
  }, [dreamMode, bookend, onEnd]);

  const advance = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (next >= frames.length) {
        finishBody();
        return prev; // stay on last frame
      }
      return next;
    });
  }, [frames.length, finishBody]);

  // Hold-to-awaken: when the player presses and holds the awaken
  // affordance for ≥ 1.5s during dream-mode body playback, treat it
  // as an early dismissal and fire onDreamEnd({ kind: "awoken_early" }).
  // Mounted in dream-mode only; the standard click-to-dismiss path
  // is suppressed in dream mode (see dismissible vs. dreamMode below).
  useEffect(() => {
    if (!dreamMode) return;
    if (dreamPhase !== "body") return;
    if (awakenHoldStart === null) return;
    const timer = setTimeout(() => {
      setAwoken(true);
      audioRef.current?.pause();
      onDreamEnd?.({ kind: "awoken_early", visionId: visionId ?? "" });
      setDismissed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [dreamMode, dreamPhase, awakenHoldStart, onDreamEnd, visionId]);

  // Auto-advance timer. Skipped for video frames — the <video>
  // element's onEnded handler advances when the clip finishes, which
  // is more accurate than a wall-clock timer (and respects clips
  // that came in slightly under or over their declared duration).
  useEffect(() => {
    if (dismissed) return;
    if (isVideoFrame) return;
    const dur = currentIndex === -1
      ? 2500 // title card
      : (frame?.durationMs ?? DEFAULT_DURATION);

    timerRef.current = setTimeout(advance, dur);
    return () => clearTimeout(timerRef.current);
  }, [currentIndex, dismissed, frame, advance, isVideoFrame]);

  // Start audio
  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audio.volume = 0.6;
    audio.play().catch(() => {/* autoplay blocked — silent fallback */});
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioSrc]);

  // Audio coordination: pause the song bed while a video frame plays
  // so the flash punches through silently; resume on the next image
  // frame. The plan calls this "the song stretches over the flash" —
  // we don't seek the audio, so the missing seconds are simply not
  // played back. Resume is silently no-op if the audio failed to
  // start (autoplay block) or has already ended.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isVideoFrame) {
      audio.pause();
    } else if (currentIndex >= 0) {
      audio.play().catch(() => {/* gesture-required after pause — silent */});
    }
  }, [isVideoFrame, currentIndex]);

  const handleDismiss = () => {
    // In dream mode, click-to-dismiss is disabled — only the
    // hold-to-awaken affordance can leave a dream early. The
    // standard click-to-skip path still works for ordinary
    // (free-browse) playback.
    if (dreamMode) return;
    if (!dismissible) return;
    clearTimeout(timerRef.current);
    audioRef.current?.pause();
    setDismissed(true);
    onEnd?.();
  };

  if (dismissed) return null;

  // Dream-mode opening / closing flashes are the bookend prophecy
  // text. Phase machine: opening → body → closing → done.
  if (dreamMode && bookend && dreamPhase === "opening") {
    return (
      <DreamProphecyFlash
        prophecy={bookend.opening}
        onDone={() => setDreamPhase("body")}
      />
    );
  }
  if (dreamMode && bookend && dreamPhase === "closing") {
    return (
      <DreamProphecyFlash
        prophecy={bookend.closing}
        onDone={() => {
          setDreamPhase("done");
          if (!awoken) {
            onDreamEnd?.({ kind: "full", visionId: visionId ?? "" });
          }
          setDismissed(true);
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onClick={dismissible && !dreamMode ? handleDismiss : undefined}
      role="dialog"
      aria-label={dreamMode ? "Prophecy dream" : "Song slideshow"}
    >
      {/* Skip hint — suppressed in dream mode (use Awaken instead). */}
      {dismissible && !dreamMode && (
        <div className="absolute top-4 right-4 z-10">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
            tap to skip
          </span>
        </div>
      )}

      {/* Awaken affordance (dream mode only). Hold for 1.5s to
          dismiss the dream early — fires onDreamEnd with kind:
          "awoken_early". Disabled on unawakenable visions (the
          First Visitation + "Not a Lion but a Lamb" capstone). */}
      {dreamMode && !unawakenable && (
        <button
          type="button"
          className="absolute bottom-6 right-6 z-20 select-none rounded-full border border-white/15 bg-black/40 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition-all hover:bg-black/60 hover:text-white/90 focus:outline-none focus:ring-1 focus:ring-white/30"
          onPointerDown={() => setAwakenHoldStart(Date.now())}
          onPointerUp={() => setAwakenHoldStart(null)}
          onPointerLeave={() => setAwakenHoldStart(null)}
          onPointerCancel={() => setAwakenHoldStart(null)}
          aria-label="Hold to awaken from the dream"
          data-awaken-button="true"
        >
          {awakenHoldStart !== null ? "awakening…" : "hold to awaken"}
        </button>
      )}

      {/* Title card */}
      <AnimatePresence mode="wait">
        {currentIndex === -1 && title && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_MS / 1000 }}
            className="text-center px-8"
          >
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-wider text-white/90">
              {title}
            </h1>
          </motion.div>
        )}

        {/* Frames */}
        {frame && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_MS / 1000 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background — <video> for Veo flash frames (D2 Vision
                3 + 4), <img> otherwise or as a fallback when the
                video errors. `playsInline` is required for iOS
                Safari inline playback (see audit M-vision-mobile). */}
            {isVideoFrame ? (
              <video
                src={frame.videoSrc}
                autoPlay
                playsInline
                muted={false}
                onEnded={advance}
                onError={() =>
                  setVideoFailedAtIndex((prev) => {
                    const next = new Set(prev);
                    next.add(currentIndex);
                    return next;
                  })
                }
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.7) saturate(0.85)" }}
              />
            ) : (
              <img
                src={frame.imageSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.6) saturate(0.85)" }}
              />
            )}

            {/* Narrator portrait — when the frame declares a portraitSrc
                (today: Silence in Heaven dialog interludes), composite
                it over the background at the speaker's side. Skipped
                entirely when portraitSide is not set. */}
            {frame.portraitSrc && frame.portraitSide && (
              <img
                src={frame.portraitSrc}
                alt=""
                className={
                  "absolute bottom-0 z-[5] h-[78%] max-h-[78%] w-auto object-contain object-bottom pointer-events-none " +
                  (frame.portraitSide === "left"
                    ? "left-0 sm:left-4"
                    : frame.portraitSide === "right"
                      ? "right-0 sm:right-4"
                      : "left-1/2 -translate-x-1/2")
                }
                style={{ filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.6))" }}
              />
            )}

            {/* Lyric overlay */}
            {frame.lyric && (
              <div className="relative z-10 text-center px-8 max-w-2xl">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-display text-xl sm:text-3xl font-bold text-white leading-relaxed"
                  style={{ textShadow: "0 2px 20px color-mix(in oklch, var(--bg-void) 80%, transparent)" }}
                >
                  {frame.lyric}
                </motion.p>
                {frame.subtitle && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="font-mono text-xs text-white/50 mt-3 italic"
                  >
                    {frame.subtitle}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <motion.div
          className="h-full bg-white/30"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / frames.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
