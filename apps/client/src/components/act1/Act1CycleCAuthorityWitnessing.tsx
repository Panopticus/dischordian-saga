/* ═══════════════════════════════════════════════════════
   ACT 1 CYCLE C AUTHORITY WITNESSING

   The full Last Words sequence moved here from the Prelude
   in the October 2026 restructure. Plays the Malkia Ukweli
   track end-to-end, cross-fades through 20 slides, and
   opens a Light/Dark alignment gate during the final
   refrain. The player's pick is persisted via:

     - `setLightDarkAlignment(alignment)` on GameContext
     - `act1_cycle_c_alignment_light|dark` narrative flag
     - `act_1_cycle_c_complete` narrative flag (always)

   Per Bible §4.5 the alignment choice here is the canonical
   fork for Act 2+ — it replaces the prior Beat-J capture
   that never shipped. If the player skips past the gate
   (audio ends without a pick) we commit "light" as the
   default; the post-match dialog makes this visible so the
   player can still redirect later via the governance hub.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { fireCrossGameBeat } from "@/lib/crossGameBeats";
import {
  ALIGNMENT_CHOICES,
  FULL_WITNESSING_SLIDES,
  LAST_WORDS_FULL_DURATION_S,
  LAST_WORDS_FULL_SONG_URL,
  alignmentGateOpen,
  witnessingSlideAtTime,
  witnessingSlideImageUrl,
  type LastWordsAlignment,
  type WitnessingSlide,
} from "./act1CycleCWitnessing";

export interface Act1CycleCAuthorityWitnessingProps {
  /**
   * Called after the player commits (or defaults to) an
   * alignment and the song has completed. The result carries
   * both the chosen alignment and the elapsed seconds so the
   * caller can log pace.
   */
  onComplete: (result: {
    alignment: LastWordsAlignment;
    elapsedS: number;
    skipped: boolean;
  }) => void;
  /** Volume 0-1 for the Last Words track. Default 0.85. */
  volume?: number;
  /** Auto-start playback on mount. Default true. */
  autoPlay?: boolean;
}

export function Act1CycleCAuthorityWitnessing({
  onComplete,
  volume = 0.85,
  autoPlay = true,
}: Act1CycleCAuthorityWitnessingProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [pick, setPick] = useState<LastWordsAlignment | null>(null);
  const [skipped, setSkipped] = useState(false);
  const currentSlide: WitnessingSlide = witnessingSlideAtTime(currentTime);
  const gateOpen = alignmentGateOpen(currentTime);
  const { setLightDarkAlignment, setNarrativeFlag } = useGame();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

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

  const commit = useCallback(
    (alignment: LastWordsAlignment, wasSkip: boolean) => {
      if (pick) return;
      setPick(alignment);
      if (wasSkip) setSkipped(true);
      const descriptor = ALIGNMENT_CHOICES.find((c) => c.id === alignment)!;
      setLightDarkAlignment(alignment);
      setNarrativeFlag(descriptor.flag, true);
      setNarrativeFlag("act_1_cycle_c_complete", true);
      // Tier 4D: Last Words performance is the canonical split point
      // all three games read from. The Light/Dark flag lives on the
      // narrativeFlags set above; this emit records that the
      // performance landed so Cades FPS + DMC can cue their
      // branch-specific callbacks in later chapters.
      void fireCrossGameBeat("last_words_echo_loredex_performance");
      // Stop playback so the alignment blurb can land without
      // fighting the music.
      if (audioRef.current) audioRef.current.pause();
      const timer = window.setTimeout(
        () =>
          onComplete({
            alignment,
            elapsedS: currentTime,
            skipped: wasSkip,
          }),
        1400,
      );
      return () => window.clearTimeout(timer);
    },
    [pick, setLightDarkAlignment, setNarrativeFlag, onComplete, currentTime],
  );

  const handleEnded = useCallback(() => {
    // If the player didn't pick during the gate, commit "light" as a
    // soft default — the governance hub exposes a re-selection later.
    if (!pick) commit("light", true);
  }, [pick, commit]);

  return (
    <div
      role="region"
      aria-label="Act 1 Cycle C — Authority Witnessing"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--bg-void)",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {/* Slide cross-fade */}
      <AnimatePresence mode="sync">
        <motion.img
          key={`slide-${currentSlide.slide}`}
          src={witnessingSlideImageUrl(currentSlide.slide)}
          alt={`Witnessing slide ${currentSlide.slide}: ${currentSlide.caption}`}
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
            filter: "brightness(0.75)",
            pointerEvents: "none",
          }}
        />
      </AnimatePresence>

      {/* Caption band */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          bottom: 96,
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: 720,
          textAlign: "center",
          fontFamily: "serif",
          fontSize: 18,
          lineHeight: 1.5,
          color: "color-mix(in oklch, var(--text-primary) 90%, transparent)",
          padding: "var(--space-sm) var(--space-md)",
          background:
            "color-mix(in oklch, var(--bg-void) 70%, transparent)",
          border:
            "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)",
          zIndex: 130,
        }}
      >
        {currentSlide.caption}
      </div>

      {/* Phase / timing indicator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: "monospace",
          fontSize: 10,
          color: "color-mix(in oklch, var(--energy-primary) 45%, transparent)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          zIndex: 130,
          opacity: 0.7,
        }}
      >
        {currentSlide.phase.replace(/_/g, " ")} ·{" "}
        {Math.floor(currentTime)}s / {LAST_WORDS_FULL_DURATION_S}s
      </div>

      {/* Alignment gate */}
      <AnimatePresence>
        {gateOpen && !pick && (
          <motion.div
            key="gate"
            role="dialog"
            aria-modal="true"
            aria-label="Alignment choice"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(720px, 92vw)",
              padding: "var(--space-lg) var(--space-xl)",
              background: "color-mix(in oklch, var(--bg-void) 95%, transparent)",
              border:
                "1px solid color-mix(in oklch, var(--energy-primary) 55%, transparent)",
              boxShadow:
                "0 0 var(--space-2xl) color-mix(in oklch, var(--energy-primary) 30%, transparent)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              zIndex: 140,
            }}
          >
            {ALIGNMENT_CHOICES.map((choice) => (
              <button
                key={choice.id}
                onClick={() => commit(choice.id, false)}
                style={{
                  textAlign: "left",
                  padding: "var(--space-md) var(--space-lg)",
                  background:
                    "color-mix(in oklch, var(--energy-primary) 10%, transparent)",
                  border:
                    "1px solid color-mix(in oklch, var(--energy-primary) 55%, transparent)",
                  color: "var(--text-primary)",
                  fontFamily: "serif",
                  fontSize: 16,
                  lineHeight: 1.6,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    color: "var(--energy-primary)",
                    fontFamily: "monospace",
                    fontSize: 12,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {choice.label}
                </div>
                <p style={{ margin: 0 }}>{choice.blurb}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post-commit confirmation card */}
      <AnimatePresence>
        {pick && (
          <motion.div
            key={`commit-${pick}`}
            role="status"
            aria-live="assertive"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(560px, 90vw)",
              padding: "var(--space-lg) var(--space-xl)",
              background: "color-mix(in oklch, var(--bg-void) 95%, transparent)",
              border: "1px solid var(--energy-primary)",
              color: "var(--text-primary)",
              fontFamily: "serif",
              fontSize: 16,
              lineHeight: 1.6,
              textAlign: "center",
              zIndex: 150,
            }}
          >
            <div
              style={{
                color: "var(--energy-primary)",
                fontFamily: "monospace",
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              {skipped ? "Default alignment set" : "Alignment committed"}
            </div>
            <p style={{ margin: 0 }}>
              {
                ALIGNMENT_CHOICES.find((c) => c.id === pick)?.blurb
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={LAST_WORDS_FULL_SONG_URL}
        autoPlay={autoPlay}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Slide preload, offscreen */}
      <div
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
      >
        {FULL_WITNESSING_SLIDES.map((s) => (
          <img
            key={`preload-${s.slide}`}
            src={witnessingSlideImageUrl(s.slide)}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}
