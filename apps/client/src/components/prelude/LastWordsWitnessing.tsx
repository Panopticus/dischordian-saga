/**
 * LastWordsWitnessing — Prelude Beat J tease (35 seconds).
 *
 * AFTER THE OCTOBER 2026 RESTRUCTURE: the full Malkia Ukweli
 * song + 20-slide Witnessing sequence + Light/Dark alignment
 * choice moved to the Act 1 Cycle C Authority finale. What
 * plays at the end of the Prelude is a 35-second tease of
 * Verse 1 — just enough to establish Malkia's voice as a
 * motif. See:
 *
 *   docs/production/prelude-asset-build/prompts/voice/log5/
 *     LAST_WORDS_TEASE_VS_FULL.md
 *
 * This component is self-contained: it plays the tease MP3,
 * cross-fades through 5 "Malkia watching" slides, and fires
 * onComplete({ elapsedS }) when the audio ends. The canonical
 * alignment choice is not captured here — it belongs to the
 * Act 1 full-song treatment.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LAST_WORDS_SONG_URL,
  LAST_WORDS_TEASE_DURATION_S,
  SLIDE_TIMELINE,
  slideAtTime,
  slideImageUrl,
  type SlideAnchor,
} from "./lastWordsTimeline";

/**
 * Retained export for Act 1's future full-Witnessing component.
 * Beat J's tease does not capture this value.
 */
export type LastWordsChoice = "light" | "dark";

export interface LastWordsWitnessingProps {
  /** Called when the tease audio finishes. */
  onComplete: (result: { elapsedS: number }) => void;
  /** Start audio on mount. Default true. */
  autoPlay?: boolean;
  /** Override audio volume (0-1). Default 0.85. */
  volume?: number;
}

export function LastWordsWitnessing({
  onComplete,
  autoPlay = true,
  volume = 0.85,
}: LastWordsWitnessingProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const currentSlide: SlideAnchor = slideAtTime(currentTime);

  // Sync volume to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // Track audio time via rAF for smooth slide transitions
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleEnded = () => {
    onComplete({ elapsedS: currentTime });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--bg-void)",
        zIndex: 100,
        overflow: "hidden",
      }}
      role="region"
      aria-label="Last Words tease"
    >
      {/* Slide cross-fade layer */}
      <AnimatePresence mode="sync">
        <motion.img
          key={`tease-slide-${currentSlide.slide}`}
          src={slideImageUrl(currentSlide.slide)}
          alt={`Last Words tease slide ${currentSlide.slide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      </AnimatePresence>

      {/* Phase announcement — visually hidden aria-live region.
          Announces phase transitions (before_play → hologram_on →
          listening → line_lands → first_breath) without the
          verbose ticking-timer noise that a visible indicator
          would produce. */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
        }}
      >
        {currentSlide.phase.replace(/_/g, " ")}
      </div>

      {/* Visible phase indicator (subtle — helps QA debug timing).
          aria-hidden so it doesn't double-announce alongside the
          live region above. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: "monospace",
          fontSize: 10,
          color: "color-mix(in oklch, var(--energy-primary) 40%, transparent)",
          zIndex: 130,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.6,
        }}
      >
        {currentSlide.phase} · {Math.floor(currentTime)}s /{" "}
        {Math.floor(LAST_WORDS_TEASE_DURATION_S)}s
      </div>

      {/* Audio element (not visible) */}
      <audio
        ref={audioRef}
        src={LAST_WORDS_SONG_URL}
        autoPlay={autoPlay}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Preload all 5 tease slides off-screen for instant cross-fades */}
      <div
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        {SLIDE_TIMELINE.map((a) => (
          <img
            key={`preload-${a.slide}`}
            src={slideImageUrl(a.slide)}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}
