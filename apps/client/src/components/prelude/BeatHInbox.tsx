/**
 * BeatHInbox — Beat H's post-cutscene NPC Inbox first-message UX.
 *
 * Renders over the comms-array room backdrop (rendered by
 * PreludeSequencePlayer). The player sees an envelope glyph with
 * the canonical amber unread-count indicator; clicking the envelope
 * unfolds a reader panel, starts Locke's first-contact VO, and —
 * near the end of the VO — cyan-blooms the "I am watching…" sentence
 * per Bible §14.6 / §18.3.
 *
 * Canon:
 *   - Bible §14.1 + §14.5 — message content (verbatim)
 *   - Bible §14.6 + §18.3 — VFX (envelope unfold, sentence bloom,
 *                          amber counter glyph)
 *   - CANON: Locke's "three jobs" textually echoes Beat D's three
 *            mission postings. Kelvara is the one she's offering.
 *
 * Usage:
 *   <BeatHInbox onComplete={() => interactionComplete()} />
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmberCounterGlyph } from "./vfx/ui/AmberCounterGlyph";
import {
  LOCKE_FIRST_MESSAGE,
  getLockeFirstMessageVoUrl,
} from "./beatHInboxMessage";
import { useGame } from "../../contexts/GameContext";

export interface BeatHInboxProps {
  /** Called when the player closes the message. */
  onComplete: () => void;
  /** VO volume 0-1. Default 0.9. */
  volume?: number;
}

type Phase = "closed" | "open" | "read";

export function BeatHInbox({ onComplete, volume = 0.9 }: BeatHInboxProps) {
  const { setNarrativeFlag } = useGame();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [phase, setPhase] = useState<Phase>("closed");
  const [voProgressPct, setVoProgressPct] = useState(0);
  const voUrl = getLockeFirstMessageVoUrl();

  // Keep audio volume synced
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  const openMessage = useCallback(() => {
    if (phase !== "closed") return;
    setPhase("open");
    // Kick off VO on next tick so the audio element has its src set
    setTimeout(() => {
      if (audioRef.current && voUrl) {
        audioRef.current.currentTime = 0;
        void audioRef.current.play().catch(() => {
          // Autoplay blocked — flip to "read" so the UI doesn't lock.
          setPhase("read");
        });
      } else {
        // No VO URL available — immediately allow the player to continue.
        setPhase("read");
      }
    }, 650);
  }, [phase, voUrl]);

  const handleVoEnded = useCallback(() => {
    setPhase("read");
    setNarrativeFlag("vex_dog_tag_found");
  }, [setNarrativeFlag]);

  // Track VO progress for the sentence bloom timing
  useEffect(() => {
    if (phase !== "open") return;
    let raf = 0;
    const tick = () => {
      if (audioRef.current && audioRef.current.duration > 0) {
        setVoProgressPct(
          audioRef.current.currentTime / audioRef.current.duration,
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const showHighlight =
    (phase === "open" || phase === "read") &&
    voProgressPct >= LOCKE_FIRST_MESSAGE.highlightTimingPct;
  const canContinue = phase === "read";
  const collapsed = phase === "closed";

  return (
    <div
      role="region"
      aria-label="Beat H — NPC Inbox"
      style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
    >
      {/* Envelope + amber counter (collapsed state) */}
      <AnimatePresence>
        {collapsed && (
          <motion.button
            key="envelope"
            onClick={openMessage}
            aria-label={`Open message from ${LOCKE_FIRST_MESSAGE.sender}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 96,
              height: 96,
              borderRadius: 8,
              border: "1px solid rgba(34, 211, 238, 0.45)",
              background: "rgba(1, 0, 32, 0.85)",
              color: "#22d3ee",
              fontSize: 44,
              cursor: "pointer",
              boxShadow: "0 0 32px rgba(34, 211, 238, 0.35)",
              animation: "pvfx-cyan-shimmer 2.6s ease-in-out infinite",
              zIndex: 40,
            }}
          >
            ✉
            {/* Amber unread counter — floats top-right of the envelope */}
            <div
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                pointerEvents: "none",
              }}
            >
              <AmberCounterGlyph active count={1} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Reader panel (open / read state) */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="reader"
            role="dialog"
            aria-modal="true"
            aria-label={`Message from ${LOCKE_FIRST_MESSAGE.sender}`}
            initial={{ opacity: 0, scale: 0.3, borderRadius: 32 }}
            animate={{ opacity: 1, scale: 1, borderRadius: 8 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(560px, 90vw)",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              background: "rgba(1, 0, 32, 0.95)",
              border: "1px solid rgba(34, 211, 238, 0.45)",
              boxShadow: "0 0 44px rgba(34, 211, 238, 0.25)",
              color: "rgba(255, 255, 255, 0.9)",
              fontFamily: "monospace",
              overflow: "hidden",
              zIndex: 60,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid rgba(34, 211, 238, 0.25)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  color: "#22d3ee",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                {LOCKE_FIRST_MESSAGE.sender}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(34, 211, 238, 0.6)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {LOCKE_FIRST_MESSAGE.senderContext} · {LOCKE_FIRST_MESSAGE.subject}
              </div>
            </div>

            {/* Separator line */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, #22d3ee, transparent)",
              }}
            />

            {/* Body — one span per sentence, highlight blooms one */}
            <div
              style={{
                padding: "20px 24px",
                overflowY: "auto",
                fontSize: 13,
                lineHeight: 1.65,
                color: "rgba(255, 255, 255, 0.82)",
                flex: 1,
              }}
            >
              {LOCKE_FIRST_MESSAGE.sentences.map((sentence, i) => {
                const isHighlighted =
                  showHighlight &&
                  i === LOCKE_FIRST_MESSAGE.highlightSentenceIndex;
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline",
                      transition:
                        "text-shadow 0.9s ease-out, color 0.9s ease-out",
                      textShadow: isHighlighted
                        ? "0 0 12px #22d3ee, 0 0 22px rgba(34, 211, 238, 0.4)"
                        : "none",
                      color: isHighlighted ? "#22d3ee" : undefined,
                    }}
                  >
                    {sentence}{" "}
                  </span>
                );
              })}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid rgba(34, 211, 238, 0.25)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                aria-live="polite"
                style={{
                  fontSize: 10,
                  color: "rgba(34, 211, 238, 0.5)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {phase === "open"
                  ? "Receiving transmission…"
                  : "Transmission complete"}
              </span>
              <button
                onClick={onComplete}
                disabled={!canContinue}
                aria-label="Close message and continue"
                style={{
                  padding: "10px 22px",
                  background: canContinue
                    ? "rgba(34, 211, 238, 0.18)"
                    : "rgba(1, 0, 32, 0.5)",
                  border: `1px solid ${
                    canContinue
                      ? "rgba(34, 211, 238, 0.6)"
                      : "rgba(34, 211, 238, 0.2)"
                  }`,
                  color: canContinue ? "#22d3ee" : "rgba(34, 211, 238, 0.35)",
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: canContinue ? "pointer" : "default",
                  transition:
                    "background 0.2s, border-color 0.2s, color 0.2s",
                }}
              >
                Continue ›
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio element */}
      {voUrl && (
        <audio
          ref={audioRef}
          src={voUrl}
          onEnded={handleVoEnded}
          preload="auto"
        />
      )}
    </div>
  );
}
