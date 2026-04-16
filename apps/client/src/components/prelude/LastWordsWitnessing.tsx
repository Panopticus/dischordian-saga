/**
 * LastWordsWitnessing — Beat J's Last Words sequence.
 *
 * The player's first "Witnessing" experience per Bible §17.5. Plays
 * the Last Words song while cross-fading through 20 slide images
 * (4 sections × 5 slides). At the first-chorus sync point, the
 * canonical Light/Dark alignment choice pillar appears; skip becomes
 * available after the first chorus ends.
 *
 * The component is self-contained: import it, give it an
 * `onComplete({ choice })` callback, and render. It handles the
 * audio element, timing state, slide cross-fade, and choice pillar
 * visibility internally.
 *
 * Usage:
 *   <LastWordsWitnessing
 *     onComplete={({ choice }) => persistAlignment(choice)}
 *   />
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChoicePillarLightDark } from "./vfx/ui/ChoicePillarLightDark";
import { PeripheralWarmHalo } from "./vfx/effects/PeripheralWarmHalo";
import {
  LAST_WORDS_SONG_URL,
  LAST_WORDS_SONG_DURATION_S,
  SLIDE_TIMELINE,
  canSkipAt,
  showChoiceAt,
  slideAtTime,
  slideImageUrl,
  type SlideAnchor,
} from "./lastWordsTimeline";

export type LastWordsChoice = "light" | "dark";

export interface LastWordsWitnessingProps {
  /** Called when the player makes the alignment choice + the song ends. */
  onComplete: (result: { choice: LastWordsChoice; elapsedS: number }) => void;
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
  const [choice, setChoice] = useState<LastWordsChoice | null>(null);
  const [songEnded, setSongEnded] = useState(false);

  const currentSlide: SlideAnchor = slideAtTime(currentTime);
  const choiceVisible = showChoiceAt(currentTime);
  const skippable = canSkipAt(currentTime);

  // Sync audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // Track audio time via rAF (smoother than timeupdate event which only fires ~4x/sec)
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

  // Complete when song ends AND player has chosen. If they haven't chosen
  // by the time the song ends, we hold on the last slide until they do.
  useEffect(() => {
    if (songEnded && choice) {
      onComplete({ choice, elapsedS: currentTime });
    }
  }, [songEnded, choice, currentTime, onComplete]);

  const handleChoice = (picked: LastWordsChoice) => {
    if (choice) return; // Only first pick registers
    setChoice(picked);
  };

  const handleSkip = () => {
    if (!skippable || !audioRef.current) return;
    // Seek to near the end; audio's `ended` handler will fire onComplete
    audioRef.current.currentTime = Math.max(0, LAST_WORDS_SONG_DURATION_S - 1);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#010020",
        zIndex: 100,
        overflow: "hidden",
      }}
      role="region"
      aria-label="Last Words witnessing sequence"
    >
      {/* Slide cross-fade layer */}
      <AnimatePresence mode="sync">
        <motion.img
          key={`${currentSlide.section}-${currentSlide.slide}`}
          src={slideImageUrl(currentSlide.section, currentSlide.slide)}
          alt={`Last Words slide ${currentSlide.section}.${currentSlide.slide}`}
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

      {/* Peripheral warm halo — builds through the first chorus + holds */}
      <PeripheralWarmHalo
        active
        state={
          currentTime < 66
            ? "build"
            : currentTime < LAST_WORDS_SONG_DURATION_S - 10
            ? "hold"
            : "fade"
        }
      />

      {/* Light/Dark alignment choice pillar */}
      {choiceVisible && !choice && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 120,
          }}
        >
          <ChoicePillarLightDark
            active
            state="appearance"
            onChoice={handleChoice}
          />
        </div>
      )}

      {/* Confirmed choice afterglow */}
      {choice && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 120,
          }}
        >
          <ChoicePillarLightDark active state={choice} />
        </div>
      )}

      {/* Skip affordance (unlocks after first chorus) */}
      {skippable && (
        <button
          onClick={handleSkip}
          aria-label="Skip Last Words"
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            padding: "10px 20px",
            background: "rgba(1, 0, 32, 0.6)",
            border: "1px solid rgba(34, 211, 238, 0.4)",
            color: "#22d3ee",
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            zIndex: 130,
            transition: "background 0.2s, border-color 0.2s",
          }}
        >
          Skip ›
        </button>
      )}

      {/* Phase indicator (subtle — helps QA debug timing) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: "monospace",
          fontSize: 10,
          color: "rgba(34, 211, 238, 0.4)",
          zIndex: 130,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          opacity: 0.6,
        }}
      >
        {currentSlide.phase} · {Math.floor(currentTime)}s / {Math.floor(LAST_WORDS_SONG_DURATION_S)}s
      </div>

      {/* Audio element (not visible) */}
      <audio
        ref={audioRef}
        src={LAST_WORDS_SONG_URL}
        autoPlay={autoPlay}
        onEnded={() => setSongEnded(true)}
        preload="auto"
      />

      {/* Preload all slides off-screen for instant cross-fades */}
      <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        {SLIDE_TIMELINE.map((a) => (
          <img
            key={`preload-${a.section}-${a.slide}`}
            src={slideImageUrl(a.section, a.slide)}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}
