/* ═══════════════════════════════════════════════════════
   SONG SLIDESHOW — Reusable dynamic cutscene engine.

   Witnessing Narrative Proposal §5.

   Plays an audio track while crossfading still frames with
   ken-burns pans, synced lyrics, and atmospheric overlays.
   Respects prefers-reduced-motion by falling back to a
   single hero image + prose summary.

   Usage:
     <SongSlideshow
       def={LAST_WORDS_SLIDESHOW}
       onComplete={() => setFlag("act1_complete")}
       onSkip={() => setFlag("act1_complete")}
       autoplay
     />
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward, Volume2, VolumeX, X } from "lucide-react";
import type {
  LyricLine,
  SlideshowFrame,
  SlideshowOverlay,
  SongSlideshowDef,
} from "@shared/songSlideshow";
import {
  getActiveOverlays,
  getFrameAt,
  getLyricAt,
} from "@shared/songSlideshow";

/** Minimum fraction of duration that must play before the skip button appears. */
const SKIP_UNLOCK_FRACTION = 0.15;

export interface SongSlideshowProps {
  def: SongSlideshowDef;
  /** Fired when the audio reaches durationMs or the user skips past 15%. */
  onComplete?: () => void;
  /** Fired if the user explicitly hits skip before the auto-complete fires. */
  onSkip?: () => void;
  /** Close the overlay entirely (e.g. X button). Disables auto-complete. */
  onClose?: () => void;
  /** Whether to play audio immediately on mount. Default true. */
  autoplay?: boolean;
  /** Force reduced motion even if the OS media query disagrees. */
  forceReducedMotion?: boolean;
}

export function SongSlideshow({
  def,
  onComplete,
  onSkip,
  onClose,
  autoplay = true,
  forceReducedMotion = false,
}: SongSlideshowProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timeMs, setTimeMs] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [completed, setCompleted] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (forceReducedMotion) return true;
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [forceReducedMotion]);

  // Tick the clock off of audio.currentTime. Falls back to a raf loop
  // if audio isn't playing (e.g. tests, SSR, autoplay blocked).
  useEffect(() => {
    if (prefersReducedMotion) return;
    const audio = audioRef.current;
    let raf = 0;
    let startWall = performance.now();
    let startOffset = 0;

    const tick = () => {
      if (audio && !audio.paused && !audio.ended) {
        setTimeMs(audio.currentTime * 1000);
      } else {
        setTimeMs(startOffset + (performance.now() - startWall));
      }
      raf = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      startWall = performance.now();
      startOffset = audio ? audio.currentTime * 1000 : 0;
    };
    audio?.addEventListener("play", onPlay);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      audio?.removeEventListener("play", onPlay);
    };
  }, [prefersReducedMotion]);

  // Autoplay audio when the component mounts.
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!autoplay) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = audioEnabled ? 1 : 0;
    void audio.play().catch(() => {
      // Autoplay rejected — the RAF fallback will still drive time.
    });
  }, [autoplay, prefersReducedMotion, audioEnabled]);

  // Sync mute toggle.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = audioEnabled ? 1 : 0;
  }, [audioEnabled]);

  // Fire onComplete when the slideshow reaches its duration.
  useEffect(() => {
    if (completed) return;
    if (timeMs >= def.durationMs) {
      setCompleted(true);
      onComplete?.();
    }
  }, [timeMs, def.durationMs, completed, onComplete]);

  const currentFrame = prefersReducedMotion ? null : getFrameAt(def, timeMs);
  const currentLyric = prefersReducedMotion ? null : getLyricAt(def, timeMs);
  const activeOverlays = prefersReducedMotion ? [] : getActiveOverlays(def, timeMs);

  const progress = Math.min(1, timeMs / def.durationMs);
  const canSkip = progress >= SKIP_UNLOCK_FRACTION;

  const handleSkip = () => {
    if (!canSkip) return;
    setCompleted(true);
    onSkip?.();
    onComplete?.();
  };

  /* ─── REDUCED MOTION FALLBACK ─── */

  if (prefersReducedMotion) {
    return (
      <ReducedMotionView
        def={def}
        onClose={onClose}
        onComplete={() => {
          setCompleted(true);
          onComplete?.();
        }}
      />
    );
  }

  /* ─── FULL SLIDESHOW ─── */

  return (
    <AnimatePresence>
      <motion.div
        key={def.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
        role="dialog"
        aria-label={`${def.title} slideshow`}
      >
        <audio
          ref={audioRef}
          src={def.audioUrl}
          preload="auto"
          data-testid="slideshow-audio"
        />

        {/* Frame stack — each frame crossfades in. */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {currentFrame && (
              <SlideshowFrameView
                key={currentFrame.startMs}
                frame={currentFrame}
                timeMs={timeMs}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Atmospheric overlays. */}
        {activeOverlays.map((overlay, i) => (
          <OverlayLayer key={`${overlay.type}-${i}`} overlay={overlay} />
        ))}

        {/* Title card shown in the first three seconds. */}
        <AnimatePresence>
          {timeMs < 3000 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative text-center z-20 px-6 select-none"
            >
              <p className="font-mono text-xs tracking-[0.5em] text-white/40 mb-3">
                ♪ SLIDESHOW
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-wide">
                {def.title}
              </h1>
              {def.subtitle && (
                <p className="mt-3 font-mono text-xs sm:text-sm text-white/60 max-w-xl mx-auto">
                  {def.subtitle}
                </p>
              )}
              {def.credits && (
                <p className="mt-6 font-mono text-[10px] text-white/30 tracking-wider">
                  {def.credits}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialog overlay tied to the current frame. */}
        {currentFrame?.dialogOverlay && (
          <DialogOverlay
            text={currentFrame.dialogOverlay}
            speakerId={currentFrame.dialogSpeakerId}
          />
        )}

        {/* On-shoulder narrator reaction line. */}
        {currentFrame?.narratorReactionId && (
          <NarratorReactionBar narratorId={currentFrame.narratorReactionId} />
        )}

        {/* Synced lyric line. */}
        <AnimatePresence>
          {currentLyric && <LyricLineView key={currentLyric.startMs} line={currentLyric} />}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
          <button
            type="button"
            onClick={() => setAudioEnabled((v) => !v)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
            aria-label={audioEnabled ? "Mute" : "Unmute"}
          >
            {audioEnabled ? (
              <Volume2 size={16} className="text-white/60" />
            ) : (
              <VolumeX size={16} className="text-white/40" />
            )}
          </button>
          {canSkip && (
            <button
              type="button"
              onClick={handleSkip}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 font-mono text-[10px] flex items-center gap-1"
              aria-label="Skip slideshow"
            >
              <SkipForward size={12} />
              SKIP
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
              aria-label="Close slideshow"
            >
              <X size={16} className="text-white/60" />
            </button>
          )}
        </div>

        {/* Progress bar at the bottom. */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-30">
          <motion.div
            className="h-full bg-amber-300/70"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.2, ease: "linear" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── FRAME RENDERER (with ken-burns) ─── */

function SlideshowFrameView({
  frame,
  timeMs,
}: {
  frame: SlideshowFrame;
  timeMs: number;
}) {
  const localMs = Math.max(0, timeMs - frame.startMs);
  const durMs = Math.max(1, frame.endMs - frame.startMs);
  const t = Math.min(1, localMs / durMs);

  let transform = "";
  if (frame.kenBurns) {
    const { startScale, endScale, startPan, endPan } = frame.kenBurns;
    const scale = startScale + (endScale - startScale) * t;
    const panX = (startPan[0] + (endPan[0] - startPan[0]) * t) * 100;
    const panY = (startPan[1] + (endPan[1] - startPan[1]) * t) * 100;
    transform = `translate(${panX}%, ${panY}%) scale(${scale})`;
  }

  const transitionDuration = frame.transition === "hardcut" ? 0.01 : 0.8;

  return (
    <motion.img
      src={frame.imageUrl}
      alt={frame.caption ?? ""}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: transitionDuration }}
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        transform: transform || undefined,
        transformOrigin: "center",
      }}
    />
  );
}

/* ─── OVERLAY LAYERS ─── */

function OverlayLayer({ overlay }: { overlay: SlideshowOverlay }) {
  const intensity = Math.max(0, Math.min(1, overlay.intensity));
  switch (overlay.type) {
    case "vignette":
      return (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, transparent 55%, rgba(0,0,0,${0.3 + intensity * 0.5}) 100%)`,
          }}
        />
      );
    case "scanlines":
      return (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
            opacity: 0.4 + intensity * 0.4,
            mixBlendMode: "overlay",
          }}
        />
      );
    case "grain":
      return (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
            opacity: intensity * 0.5,
            mixBlendMode: "overlay",
          }}
        />
      );
    case "particles":
      return (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {Array.from({ length: Math.ceil(20 * intensity) }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full bg-amber-200/70"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: 0,
              }}
              animate={{ y: ["100%", "-10%"], opacity: [0, 0.8, 0] }}
              transition={{
                duration: 4 + Math.random() * 3,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      );
    case "corruption":
      return (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ mixBlendMode: "difference" }}
          animate={{ opacity: [0, intensity, 0, intensity, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="w-full h-1/3 bg-red-500/20" />
          <div className="w-full h-1/3 bg-green-500/20" />
          <div className="w-full h-1/3 bg-blue-500/20" />
        </motion.div>
      );
    case "glitch":
      return (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none bg-cyan-500/20"
          animate={{ x: [0, -3, 3, 0], opacity: [0, intensity, 0] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.6 }}
        />
      );
    case "bloom":
      return (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(255,245,200,${intensity * 0.45}) 0%, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />
      );
    default:
      return null;
  }
}

/* ─── LYRIC LINE ─── */

function LyricLineView({ line }: { line: LyricLine }) {
  const classes = {
    normal: "text-white/90 text-xl sm:text-2xl",
    whisper: "text-white/60 text-lg sm:text-xl italic",
    shout: "text-amber-200 text-2xl sm:text-4xl font-black tracking-wide",
    layered: "text-white/90 text-2xl sm:text-3xl",
  };
  const emphasis = line.emphasis ?? "normal";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.6 }}
      className="absolute bottom-20 left-0 right-0 text-center px-6 z-20 pointer-events-none"
    >
      <p className={`font-display ${classes[emphasis]}`}>{line.text}</p>
      {emphasis === "layered" && (
        <p
          className="font-display text-xl sm:text-2xl text-white/30 mt-1"
          style={{ transform: "translate(2px, 1px)" }}
          aria-hidden
        >
          {line.text}
        </p>
      )}
    </motion.div>
  );
}

/* ─── DIALOG OVERLAY ─── */

function DialogOverlay({ text, speakerId }: { text: string; speakerId?: string }) {
  const accent = speakerColor(speakerId);
  const displayName = speakerLabel(speakerId);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="absolute top-6 left-6 right-6 sm:left-12 sm:right-12 z-20 pointer-events-none"
    >
      <div className="inline-block px-4 py-2 rounded-md bg-black/60 backdrop-blur-sm border border-white/10">
        {displayName && (
          <p className={`font-mono text-[10px] tracking-[0.3em] ${accent} mb-1`}>
            {displayName}
          </p>
        )}
        <p className="font-mono text-sm sm:text-base text-white/90 max-w-2xl">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function NarratorReactionBar({
  narratorId,
}: {
  narratorId: "elara" | "the_human" | "antiquarian";
}) {
  const text: Record<typeof narratorId, string> = {
    elara: "Elara looks away.",
    the_human: "The Human's jaw tightens.",
    antiquarian: "The Antiquarian breathes out a line you can't quite hear.",
  };
  return (
    <div className="absolute bottom-8 left-0 right-0 text-center z-20 pointer-events-none">
      <p className="font-mono text-[11px] text-white/40 italic">{text[narratorId]}</p>
    </div>
  );
}

function speakerLabel(speakerId?: string): string {
  if (!speakerId) return "";
  return speakerId
    .replace(/^the_/, "the ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function speakerColor(speakerId?: string): string {
  switch (speakerId) {
    case "elara":
      return "text-cyan-300";
    case "the_human":
      return "text-amber-300";
    case "the_antiquarian":
      return "text-purple-300";
    case "the_engineer":
      return "text-emerald-300";
    case "the_authority":
      return "text-red-300";
    default:
      return "text-white/60";
  }
}

/* ─── REDUCED MOTION VIEW ─── */

function ReducedMotionView({
  def,
  onClose,
  onComplete,
}: {
  def: SongSlideshowDef;
  onClose?: () => void;
  onComplete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
      role="dialog"
      aria-label={`${def.title} — reduced motion summary`}
    >
      <div className="max-w-2xl w-full bg-black/80 border border-white/10 rounded-lg p-8">
        <p className="font-mono text-xs tracking-[0.4em] text-white/40 mb-2">
          ♪ SLIDESHOW (REDUCED MOTION)
        </p>
        <h1 className="font-display text-3xl font-black text-white mb-4">{def.title}</h1>
        {def.subtitle && (
          <p className="font-mono text-sm text-white/60 mb-6">{def.subtitle}</p>
        )}
        <img
          src={def.reducedMotionFallback.heroImageUrl}
          alt=""
          className="w-full rounded-md mb-6 border border-white/10"
        />
        <p className="font-mono text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
          {def.reducedMotionFallback.prose}
        </p>
        {def.reducedMotionFallback.closingLine && (
          <p className="font-mono text-sm text-amber-200/80 italic mt-6">
            {def.reducedMotionFallback.closingLine}
          </p>
        )}
        <div className="mt-8 flex items-center justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white/70 font-mono text-xs"
            >
              CLOSE
            </button>
          )}
          <button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-mono text-xs"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
