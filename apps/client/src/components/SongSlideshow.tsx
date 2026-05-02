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
}

const DEFAULT_DURATION = 5000;
const FADE_MS = 800;

export default function SongSlideshow({
  frames,
  audioSrc,
  onEnd,
  dismissible = true,
  title,
}: SongSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = title card
  const [dismissed, setDismissed] = useState(false);
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

  const advance = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (next >= frames.length) {
        onEnd?.();
        return prev; // stay on last frame
      }
      return next;
    });
  }, [frames.length, onEnd]);

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
    if (!dismissible) return;
    clearTimeout(timerRef.current);
    audioRef.current?.pause();
    setDismissed(true);
    onEnd?.();
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onClick={dismissible ? handleDismiss : undefined}
      role="dialog"
      aria-label="Song slideshow"
    >
      {/* Skip hint */}
      {dismissible && (
        <div className="absolute top-4 right-4 z-10">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
            tap to skip
          </span>
        </div>
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
