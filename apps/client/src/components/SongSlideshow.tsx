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
  /** Optional second narrator portrait — paired with `portraitSrc` for
   *  joint-narration beats (Silence in Heaven `speaker: "both"`). */
  secondaryPortraitSrc?: string;
  secondaryPortraitSide?: "left" | "right" | "center";
  /** Optional speaker id ("antiquarian" | "storyteller" | "both" | etc.).
   *  Used as the React key for the dialog overlay so a speaker change
   *  triggers a crossfade between portrait + line attributions. */
  dialogSpeakerId?: string;
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

/** Ken Burns pan/zoom presets — chosen by frame index so consecutive
 *  frames pan in different directions and the slideshow doesn't feel
 *  metronomic. Numbers are CSS transform end-state translate (%) and
 *  scale; the start state is the identity. */
const KEN_BURNS_PRESETS: ReadonlyArray<{
  scale: number;
  tx: number;
  ty: number;
}> = [
  { scale: 1.08, tx: -2, ty: -1 },
  { scale: 1.1, tx: 2, ty: -2 },
  { scale: 1.07, tx: -1, ty: 2 },
  { scale: 1.12, tx: 0, ty: -3 },
  { scale: 1.09, tx: 2, ty: 2 },
  { scale: 1.06, tx: -3, ty: 0 },
];

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
  // Lyric/dialog overlay auto-hides ~6.5s after a frame appears so the
  // line doesn't loiter for the full beat. The frame keeps playing
  // (image, atmosphere, portraits) — only the text fades out and
  // dissolves upward like ascending smoke. Reset on every frame change.
  const [lyricHidden, setLyricHidden] = useState(false);
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

  // Lyric/dialog overlay lifetime — show on every fresh frame, then
  // hide after ~6.5s so a long beat doesn't leave the line glued to
  // the screen. The frame keeps playing; only the text dissolves.
  useEffect(() => {
    if (dismissed) return;
    setLyricHidden(false);
    if (!frame?.lyric) return;
    const t = setTimeout(() => setLyricHidden(true), 6500);
    return () => clearTimeout(t);
  }, [currentIndex, dismissed, frame?.lyric]);

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

      {/* Title card — engraved Cinzel scripture plate, blood-amber
          glow, slow reveal. Reads like the chapter heading of an
          illuminated Revelation manuscript: small "the testimony of"
          ornament line, then the title in heavy small-caps with a
          faint tremor and an underline of beaten gold. The mood is
          approaching-doom: dim center, dark vignetted edges, a single
          held breath before the song begins. */}
      <AnimatePresence mode="wait">
        {currentIndex === -1 && title && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_MS / 1000 }}
            className="text-center px-8 relative z-20"
          >
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.65, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="uppercase text-[10px] sm:text-xs tracking-[0.5em]"
              style={{
                fontFamily: "var(--font-scripture)",
                color: "color-mix(in oklch, #d4af37 78%, #ffffff)" /* void-ignore */,
                letterSpacing: "0.5em",
              }}
            >
              · the testimony ·
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ delay: 0.35, duration: 1.4, ease: "easeOut" }}
              className="mt-3 text-4xl sm:text-6xl font-black uppercase"
              style={{
                fontFamily: "var(--font-scripture)",
                color: "color-mix(in oklch, #f7e7c4 70%, #ffffff)" /* void-ignore */,
                textShadow:
                  "0 0 18px rgba(139, 0, 0, 0.55), 0 0 42px rgba(212, 175, 55, 0.18), 0 2px 0 rgba(0,0,0,0.6)" /* void-ignore */,
              }}
            >
              {title}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.7 }}
              transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
              className="mx-auto mt-4 h-px w-40 origin-center"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklch, #d4af37 70%, transparent), transparent)" /* void-ignore */,
              }}
            />
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
                Safari inline playback (see audit M-vision-mobile).
                Wrapped in a Ken Burns layer that scales/pans the
                background over the frame duration so still frames
                breathe. */}
            {(() => {
              const preset =
                KEN_BURNS_PRESETS[currentIndex % KEN_BURNS_PRESETS.length];
              const dur = isVideoFrame
                ? null
                : Math.max(
                    2500,
                    frame.durationMs ?? DEFAULT_DURATION,
                  );
              return (
                <motion.div
                  className="absolute inset-0"
                  initial={{
                    scale: 1,
                    x: "0%",
                    y: "0%",
                  }}
                  animate={
                    dur
                      ? {
                          scale: preset.scale,
                          x: `${preset.tx}%`,
                          y: `${preset.ty}%`,
                        }
                      : undefined
                  }
                  transition={
                    dur
                      ? { duration: dur / 1000, ease: "linear" }
                      : undefined
                  }
                  style={{ transformOrigin: "center" }}
                >
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
                      style={{ filter: "brightness(0.55) saturate(0.85) contrast(1.05)" }}
                    />
                  )}
                </motion.div>
              );
            })()}

            {/* Atmospheric overlays — vignette + grain + a thin
                blood-amber wash that brightens slightly toward the end
                of each frame. Together they give the slideshow an
                approaching-doom mood without obscuring the art. The
                vignette is a static radial mask; the wash + grain
                animate subtly so the frame "breathes" with the music. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none z-[3]"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.85) 100%)" /* void-ignore */,
              }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none z-[3] mix-blend-overlay"
              initial={{ opacity: 0.18 }}
              animate={{ opacity: 0.34 }}
              transition={{
                duration: (frame.durationMs ?? DEFAULT_DURATION) / 1000,
                ease: "easeIn",
              }}
              style={{
                background:
                  "radial-gradient(circle at 50% 65%, color-mix(in oklch, #8b0000 30%, transparent) 0%, transparent 60%)" /* void-ignore */,
              }}
            />
            {/* Grain — subtle film noise. SVG fractal noise as a
                base64 background; opacity is intentionally low. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none z-[3] opacity-[0.07] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.65'/></svg>\")",
                backgroundSize: "220px 220px",
              }}
            />

            {/* Narrator portrait — when the frame declares a portraitSrc
                (today: Silence in Heaven dialog interludes), composite
                it over the background at the speaker's side. The
                AnimatePresence keyed on dialogSpeakerId crossfades the
                portrait when the speaker changes between beats. */}
            <AnimatePresence mode="sync">
              {frame.portraitSrc && frame.portraitSide && (
                <motion.img
                  key={`primary-${frame.dialogSpeakerId ?? frame.portraitSrc}`}
                  src={frame.portraitSrc}
                  alt=""
                  initial={{ opacity: 0, x: frame.portraitSide === "left" ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className={
                    "absolute bottom-0 z-[5] h-[52%] max-h-[52%] w-auto object-contain object-bottom pointer-events-none " +
                    (frame.portraitSide === "left"
                      ? "left-0 sm:left-4"
                      : frame.portraitSide === "right"
                        ? "right-0 sm:right-4"
                        : "left-1/2 -translate-x-1/2")
                  }
                  style={{ filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.6))" /* void-ignore — pre-existing portrait drop shadow */ }}
                />
              )}
              {/* Secondary portrait — joint-narration beats
                  (speaker: "both") share the stage with both
                  narrators on. Stays smaller so the line stays
                  readable between them. */}
              {frame.secondaryPortraitSrc && frame.secondaryPortraitSide && (
                <motion.img
                  key={`secondary-${frame.dialogSpeakerId ?? frame.secondaryPortraitSrc}`}
                  src={frame.secondaryPortraitSrc}
                  alt=""
                  initial={{ opacity: 0, x: frame.secondaryPortraitSide === "left" ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                  className={
                    "absolute bottom-0 z-[5] h-[50%] max-h-[50%] w-auto object-contain object-bottom pointer-events-none " +
                    (frame.secondaryPortraitSide === "left"
                      ? "left-0 sm:left-4"
                      : frame.secondaryPortraitSide === "right"
                        ? "right-0 sm:right-4"
                        : "left-1/2 -translate-x-1/2")
                  }
                  style={{ filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.6))" /* void-ignore */ }}
                />
              )}
            </AnimatePresence>

            {/* Lyric / dialog overlay — restyled to read like
                illuminated scripture rather than a UI caption. Words
                ink-bleed in one at a time (stagger reveal with blur
                clearing) so the line feels spoken into being. On the
                way out the words ascend and dissolve — smoke rising
                off a page that has just been read. The container
                hugs the speaker: text sits opposite the speaker's
                portrait so the conversation reads visually. Hides
                after ~6.5s (lyricHidden) so long beats don't leave
                the line glued to the screen. */}
            {(() => {
              // Speaker-aware container positioning. Antiquarian
              // (left portrait) → text on the right half. Storyteller
              // (right portrait) → text on the left half. Joint /
              // unspecified → centered, full width. Absolute so we
              // sit independently of the parent flex centering.
              const speakerId = frame.dialogSpeakerId;
              const sideClass =
                speakerId === "antiquarian"
                  ? "absolute right-[5%] sm:right-[8%] top-1/2 -translate-y-1/2 max-w-[44%] text-left"
                  : speakerId === "storyteller"
                    ? "absolute left-[5%] sm:left-[8%] top-1/2 -translate-y-1/2 max-w-[44%] text-left"
                    : "relative z-10 text-center px-8 max-w-3xl";
              return (
                <AnimatePresence mode="wait">
                  {frame.lyric && !lyricHidden && (
                    <motion.div
                      key={`lyric-${currentIndex}-${speakerId ?? ""}`}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        y: -28,
                        filter: "blur(8px)",
                        transition: { duration: 1.0, ease: "easeOut" },
                      }}
                      className={`${sideClass} z-10`}
                    >
                      {(() => {
                        // Dialog beats arrive as "Speaker Name — line".
                        // Split on the em-dash so the attribution and
                        // the line can be styled independently. Falls
                        // through to a single-line render when there's
                        // no em-dash (song lyrics, captions).
                        const split = frame.lyric.split(" — ");
                        const speaker =
                          split.length >= 2 ? split[0] : null;
                        const line =
                          split.length >= 2
                            ? split.slice(1).join(" — ")
                            : frame.lyric;
                        const words = line.split(/\s+/);
                        return (
                          <>
                            {speaker && (
                              <motion.p
                                initial={{ opacity: 0, letterSpacing: "0.7em" }}
                                animate={{ opacity: 0.85, letterSpacing: "0.45em" }}
                                transition={{ duration: 0.9, ease: "easeOut" }}
                                className="uppercase text-[10px] sm:text-xs"
                                style={{
                                  fontFamily: "var(--font-scripture)",
                                  color: "color-mix(in oklch, #d4af37 70%, #ffffff)" /* void-ignore */,
                                  textShadow: "0 0 12px rgba(0,0,0,0.7)" /* void-ignore */,
                                }}
                              >
                                {speaker}
                              </motion.p>
                            )}
                            <p
                              className={
                                "mt-3 text-xl sm:text-3xl leading-relaxed italic"
                              }
                              style={{
                                fontFamily: "var(--font-scripture-body)",
                                color: "color-mix(in oklch, #f7e7c4 85%, #ffffff)" /* void-ignore */,
                                textShadow:
                                  "0 2px 22px rgba(0,0,0,0.85), 0 0 6px rgba(0,0,0,0.6)" /* void-ignore */,
                              }}
                            >
                              {words.map((w, i) => (
                                <motion.span
                                  key={`${currentIndex}-${i}-${w}`}
                                  initial={{
                                    opacity: 0,
                                    filter: "blur(10px)",
                                    y: 6,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    filter: "blur(0px)",
                                    y: 0,
                                  }}
                                  transition={{
                                    duration: 0.5,
                                    delay: 0.25 + i * 0.07,
                                    ease: "easeOut",
                                  }}
                                  style={{
                                    display: "inline-block",
                                    marginRight: "0.28em",
                                  }}
                                >
                                  {w}
                                </motion.span>
                              ))}
                            </p>
                          </>
                        );
                      })()}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })()}
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
