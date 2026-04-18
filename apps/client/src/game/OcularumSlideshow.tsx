/* ═══════════════════════════════════════════════════════
   OCULARUM SLIDESHOW — Act 3 mid-act reveal
   Five slides tied to the song "The Ocularum" (B-side of
   Silence in Heaven). Triggers after completing the New
   Babylon or Artificial Empire arc. Spec §7.5.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, SkipForward } from "lucide-react";
import { OCULARUM_SLIDESHOW } from "./eyesArc";

interface Props {
  onComplete: () => void;
}

export default function OcularumSlideshow({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = OCULARUM_SLIDESHOW[index];

  useEffect(() => {
    if (paused || !slide) return;
    const timer = setTimeout(() => {
      if (index < OCULARUM_SLIDESHOW.length - 1) {
        setIndex(i => i + 1);
      }
    }, slide.durationMs);
    return () => clearTimeout(timer);
  }, [index, paused, slide]);

  const atEnd = index >= OCULARUM_SLIDESHOW.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black flex flex-col items-center justify-center p-6"
    >
      {/* Ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--energy-premium) 8%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8 text-center">
        <Eye size={24} className="void-text-accent mx-auto mb-2" />
        <p className="font-display text-[10px] tracking-[0.4em] void-text-accent">THE OCULARUM</p>
        <p className="font-mono text-[9px] text-white/30 mt-1">The Watcher's Origin · Silence in Heaven, B-side</p>
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-2xl"
        >
          {/* Placeholder art block — real art would be rendered here */}
          <div className="relative aspect-video rounded-xl border void-border bg-gradient-to-br from-amber-950/40 via-black to-purple-950/30 mb-4 overflow-hidden">
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Eye size={120} className="void-text-accent" strokeWidth={0.5} />
            </motion.div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-mono text-[8px] void-text-accent italic">{slide.visualPrompt}</p>
            </div>
          </div>

          {/* Title + caption */}
          <h3 className="font-display text-lg tracking-wider void-text-accent mb-2 text-center">{slide.title}</h3>
          <p className="font-mono text-xs text-white/70 italic text-center leading-relaxed mb-3">{slide.caption}</p>
          {slide.lyricLine && (
            <p className="font-mono text-[10px] void-text-accent text-center border-t void-border pt-3">
              ♪ {slide.lyricLine}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="relative z-10 flex gap-2 mt-6">
        {OCULARUM_SLIDESHOW.map((s, i) => (
          <div
            key={s.id}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-8 void-bg-sunk" : i < index ? "w-4 void-bg-sunk" : "w-4 bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="relative z-10 mt-4 flex items-center gap-3">
        <button
          onClick={() => setPaused(p => !p)}
          className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-[9px] hover:text-white/80"
        >
          {paused ? "RESUME" : "PAUSE"}
        </button>
        {!atEnd && (
          <button
            onClick={() => setIndex(i => Math.min(OCULARUM_SLIDESHOW.length - 1, i + 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-[9px] hover:text-white/80"
          >
            NEXT <SkipForward size={9} />
          </button>
        )}
        {atEnd && (
          <button
            onClick={onComplete}
            className="px-5 py-2 rounded void-bg-sunk border void-border void-text-accent font-mono text-[10px] font-bold void-bg-sunk"
          >
            HE IS STILL WATCHING — CONTINUE
          </button>
        )}
      </div>
    </motion.div>
  );
}
