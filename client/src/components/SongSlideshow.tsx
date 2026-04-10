/* ═══════════════════════════════════════════════════════
   SONG SLIDESHOW — Audio-synchronised cinematic renderer

   Spec from PART 5 of the Witnessing production plan.

   Feeds on a SongSlideshow data object (see
   shared/songSlideshow.ts). Renders frames with Ken-Burns
   interpolation, lyrics with emphasis treatments, overlays,
   and narrator reactions — all driven by the underlying
   audio element's currentTime.

   Reduced motion: falls back to a static image and text.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type SongSlideshow,
  type SlideshowFrame,
  type LyricEmphasis,
  canSkip,
  getActiveFrame,
  getActiveNarratorReaction,
  getActiveOverlay,
  getVisibleLyrics,
  isCompleted,
} from "@shared/songSlideshow";

/* ─── TYPES ─── */

export interface SongSlideshowProps {
  slideshow: SongSlideshow;
  /** Called when the viewer reaches the completion threshold (or ends). */
  onComplete?: (flagsSet: string[]) => void;
  /** Called when the viewer presses skip. Receives whether they completed. */
  onSkip?: (completed: boolean) => void;
  /** If true, respect prefers-reduced-motion and render the static fallback. */
  respectReducedMotion?: boolean;
  /** Auto-start playback on mount. */
  autoPlay?: boolean;
}

/* ─── STYLE HELPERS ─── */

const EMPHASIS_STYLES: Record<LyricEmphasis, string> = {
  normal: "text-white/85 text-2xl sm:text-3xl font-light",
  emphasized: "text-white text-3xl sm:text-4xl font-semibold tracking-wide",
  shout: "text-cyan-200 text-4xl sm:text-5xl font-black tracking-widest uppercase",
  whisper: "text-white/50 text-xl sm:text-2xl italic font-thin",
};

const SPEAKER_TINTS: Record<string, string> = {
  elara: "text-cyan-300",
  human: "text-violet-300",
  lyra_vox: "text-amber-200",
  engineer: "text-white",
  seer: "text-emerald-200",
};

/** Convert a KenBurnsParams object to a CSS transform at interpolation t (0..1). */
function kenBurnsTransform(frame: SlideshowFrame, t: number): string {
  const kb = frame.kenBurns;
  if (!kb) return "none";
  const clamped = Math.max(0, Math.min(1, t));
  const eased = ease(clamped, kb.easing ?? "ease-in-out");
  const scale = kb.startScale + (kb.endScale - kb.startScale) * eased;
  const x = kb.startX + (kb.endX - kb.startX) * eased;
  const y = kb.startY + (kb.endY - kb.startY) * eased;
  return `translate(${x}%, ${y}%) scale(${scale.toFixed(4)})`;
}

type EasingKind = "linear" | "ease-in" | "ease-out" | "ease-in-out";

function ease(t: number, kind: EasingKind): number {
  switch (kind) {
    case "linear":
      return t;
    case "ease-in":
      return t * t;
    case "ease-out":
      return t * (2 - t);
    case "ease-in-out":
    default:
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}

/* ─── REDUCED-MOTION FALLBACK ─── */

function ReducedMotionView({ slideshow, onComplete }: { slideshow: SongSlideshow; onComplete?: (f: string[]) => void }) {
  const handleClose = useCallback(() => {
    onComplete?.(slideshow.flagsSetOnComplete ?? []);
  }, [onComplete, slideshow.flagsSetOnComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white overflow-auto" role="dialog" aria-label={slideshow.title}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <img
          src={slideshow.reducedMotionFallback.imageUrl}
          alt={slideshow.reducedMotionFallback.alt}
          className="w-full max-w-2xl mx-auto rounded-lg border border-white/20"
        />
        <h1 className="mt-8 text-3xl font-display tracking-wide">{slideshow.title}</h1>
        {slideshow.subtitle && <p className="text-white/60 mt-1">{slideshow.subtitle}</p>}
        <div className="mt-6 space-y-4 text-white/80 leading-relaxed">
          {slideshow.reducedMotionFallback.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {slideshow.credits && <p className="mt-8 text-xs tracking-widest text-white/40 uppercase">{slideshow.credits}</p>}
        <button
          type="button"
          onClick={handleClose}
          className="mt-10 px-6 py-2 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 transition-colors rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */

export default function SongSlideshow({
  slideshow,
  onComplete,
  onSkip,
  respectReducedMotion = true,
  autoPlay = true,
}: SongSlideshowProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [timeMs, setTimeMs] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Detect reduced motion preference.
  useEffect(() => {
    if (!respectReducedMotion || typeof window === "undefined") return;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [respectReducedMotion]);

  // Start audio playback when mounted.
  useEffect(() => {
    if (reducedMotion) return;
    const audio = new Audio(slideshow.audioUrl);
    audio.preload = "auto";
    audio.volume = 0.7;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setTimeMs(audio.currentTime * 1000);
    };
    const handleEnded = () => {
      setTimeMs(slideshow.durationMs);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    if (autoPlay) {
      audio.play().catch(() => {
        // Autoplay blocked — user will tap to begin.
      });
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [slideshow.audioUrl, slideshow.durationMs, autoPlay, reducedMotion]);

  // Completion detection — fires once when we cross 85%.
  useEffect(() => {
    if (hasCompleted) return;
    if (isCompleted(slideshow, timeMs)) {
      setHasCompleted(true);
      onComplete?.(slideshow.flagsSetOnComplete ?? []);
    }
  }, [timeMs, slideshow, hasCompleted, onComplete]);

  // Skip handler — honours the 15% rule from spec §5.1.
  const handleSkip = useCallback(() => {
    const completed = isCompleted(slideshow, timeMs);
    onSkip?.(completed);
    if (completed) onComplete?.(slideshow.flagsSetOnComplete ?? []);
  }, [slideshow, timeMs, onSkip, onComplete]);

  const activeFrame = useMemo(() => getActiveFrame(slideshow, timeMs), [slideshow, timeMs]);
  const visibleLyrics = useMemo(() => getVisibleLyrics(slideshow, timeMs), [slideshow, timeMs]);
  const activeOverlay = useMemo(() => getActiveOverlay(slideshow, timeMs), [slideshow, timeMs]);
  const reaction = useMemo(() => getActiveNarratorReaction(slideshow, timeMs), [slideshow, timeMs]);
  const canPressSkip = canSkip(slideshow, timeMs);

  // Reduced motion bypass.
  if (reducedMotion) {
    return <ReducedMotionView slideshow={slideshow} onComplete={onComplete} />;
  }

  const frameProgress = activeFrame
    ? Math.max(0, Math.min(1, (timeMs - activeFrame.startMs) / Math.max(1, activeFrame.endMs - activeFrame.startMs)))
    : 0;
  const transform = activeFrame ? kenBurnsTransform(activeFrame, frameProgress) : "none";

  return (
    <div
      className="fixed inset-0 z-[200] bg-black overflow-hidden select-none"
      role="dialog"
      aria-label={slideshow.title}
    >
      {/* FRAME IMAGE WITH KEN-BURNS */}
      <AnimatePresence mode="wait">
        {activeFrame && (
          <motion.div
            key={`${activeFrame.startMs}-${activeFrame.imageUrl}`}
            initial={{ opacity: activeFrame.transition === "hardcut" ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: activeFrame.transition === "hardcut" ? 0 : 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={activeFrame.imageUrl}
              alt={activeFrame.alt ?? slideshow.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform,
                transformOrigin: "center center",
                transition: "transform 120ms linear",
              }}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIGNETTE */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* TOP / BOTTOM GRADIENTS */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

      {/* ACTIVE OVERLAY (chapter title, date stamp, etc.) */}
      <AnimatePresence>
        {activeOverlay && (
          <motion.div
            key={`overlay-${activeOverlay.startMs}-${activeOverlay.text}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.8 }}
            className={`absolute top-12 left-0 right-0 text-center pointer-events-none ${activeOverlay.className ?? ""}`}
          >
            <p className="font-mono text-xs tracking-[0.4em] text-white/70 uppercase">
              {activeOverlay.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIALOG OVERLAY (frame-attached line) */}
      {activeFrame?.dialogOverlay && (
        <motion.div
          key={`dialog-${activeFrame.startMs}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-32 left-0 right-0 px-8 text-center pointer-events-none"
        >
          <p className={`font-display text-2xl sm:text-3xl leading-relaxed ${
            SPEAKER_TINTS[activeFrame.dialogSpeakerId ?? ""] ?? "text-white/90"
          }`}>
            {activeFrame.dialogOverlay}
          </p>
        </motion.div>
      )}

      {/* LYRICS — float up from bottom */}
      <div className="absolute inset-x-0 bottom-20 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {visibleLyrics.map(line => (
            <motion.p
              key={`lyric-${line.startMs}-${line.text}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={`text-center leading-tight px-6 ${
                EMPHASIS_STYLES[line.emphasis]
              } ${line.speakerId ? SPEAKER_TINTS[line.speakerId] ?? "" : ""}`}
            >
              {line.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      {/* NARRATOR REACTION BAR — thin subtitle at the very bottom */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            key={`reaction-${reaction.line.startMs}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-x-0 bottom-4 pointer-events-none text-center"
          >
            <p className={`font-mono text-xs sm:text-sm italic ${SPEAKER_TINTS[reaction.narrator] ?? "text-white/70"}`}>
              [{reaction.narrator.toUpperCase()}] {reaction.line.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SKIP BUTTON — only after 15% */}
      {canPressSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-6 right-6 font-mono text-xs tracking-widest text-white/60 hover:text-white border border-white/30 hover:border-white/70 px-4 py-2 rounded transition-colors"
          aria-label="Skip slideshow"
        >
          SKIP
        </button>
      )}

      {/* TITLE CARD — first 3 seconds */}
      {timeMs < 3000 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-[0.1em] text-white/90">
              {slideshow.title}
            </h1>
            {slideshow.subtitle && (
              <p className="mt-3 font-mono text-xs sm:text-sm tracking-[0.4em] text-white/50 uppercase">
                {slideshow.subtitle}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
