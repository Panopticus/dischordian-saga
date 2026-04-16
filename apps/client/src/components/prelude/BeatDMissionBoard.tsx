/**
 * BeatDMissionBoard — Beat D's post-cutscene Trade Empire seed.
 *
 * Renders over the cargo-hold room backdrop (rendered by
 * PreludeSequencePlayer). Shows three glowing mission-slate buttons
 * positioned per Bible §8.3. Clicking a slate opens a reader panel
 * with the posting's title, poster, years-open, and body text.
 * Read slates dim to indicate "already examined"; Continue unlocks
 * after the first slate is read.
 *
 * Canon:
 *   - Bible §8.1 — three legacy postings still active
 *   - Bible §8.3 — slate positions on the board
 *   - Bible §8.5 — Elara's "17,000 years" highlight VO
 *   - Bible §14.1 / §14.5 — Locke's three-jobs forward-reference
 *
 * Usage:
 *   <BeatDMissionBoard onComplete={() => interactionComplete()} />
 */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BEAT_D_MISSION_POSTINGS,
  formatYearsOpen,
  type MissionPosting,
} from "./beatDMissionPostings";

export interface BeatDMissionBoardProps {
  /** Called when the player signals they're done at the board. */
  onComplete: () => void;
}

export function BeatDMissionBoard({ onComplete }: BeatDMissionBoardProps) {
  const [read, setRead] = useState<ReadonlySet<string>>(new Set());
  const [openPostingId, setOpenPostingId] = useState<string | null>(null);

  const openPosting = useCallback((p: MissionPosting) => {
    setOpenPostingId(p.id);
    setRead((prev) => {
      if (prev.has(p.id)) return prev;
      const next = new Set(prev);
      next.add(p.id);
      return next;
    });
  }, []);

  const closePosting = useCallback(() => {
    setOpenPostingId(null);
  }, []);

  // Escape closes the reader panel
  useEffect(() => {
    if (openPostingId === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePosting();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openPostingId, closePosting]);

  // Auto-complete when every posting has been read
  useEffect(() => {
    if (read.size >= BEAT_D_MISSION_POSTINGS.length && openPostingId === null) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
  }, [read.size, openPostingId, onComplete]);

  const canContinue = read.size > 0 && openPostingId === null;
  const openPosting_ = openPostingId
    ? BEAT_D_MISSION_POSTINGS.find((p) => p.id === openPostingId)
    : null;

  return (
    <div
      role="region"
      aria-label="Beat D — Trade Empire mission board"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
      }}
    >
      {/* Mission slates — positioned per-posting on the cargo-hold backdrop */}
      {BEAT_D_MISSION_POSTINGS.map((posting) => {
        const isRead = read.has(posting.id);
        const isOpen = openPostingId === posting.id;
        const baseAlpha = posting.highlighted ? 0.85 : 0.55;
        const dimAlpha = posting.highlighted ? 0.5 : 0.3;
        const glowIntensity = posting.highlighted ? 40 : 24;

        return (
          <button
            key={posting.id}
            onClick={() => openPosting(posting)}
            aria-label={`Read mission: ${posting.title}`}
            aria-pressed={isOpen}
            title={posting.title}
            disabled={isOpen}
            style={{
              position: "absolute",
              left: `${posting.position.leftPct}%`,
              top: `${posting.position.topPct}%`,
              transform: "translate(-50%, -50%)",
              width: 96,
              height: 60,
              borderRadius: 4,
              border: `1px solid rgba(34, 211, 238, ${isRead ? dimAlpha : baseAlpha})`,
              background: `linear-gradient(
                135deg,
                rgba(34, 211, 238, ${isRead ? 0.06 : 0.18}) 0%,
                rgba(34, 211, 238, ${isRead ? 0.04 : 0.1}) 100%
              )`,
              cursor: isOpen ? "default" : "pointer",
              boxShadow: isRead
                ? `0 0 ${glowIntensity / 3}px rgba(34, 211, 238, 0.15)`
                : `0 0 ${glowIntensity}px rgba(34, 211, 238, ${posting.highlighted ? 0.55 : 0.3})`,
              animation:
                !isRead && posting.highlighted
                  ? "pvfx-cyan-shimmer 3.2s ease-in-out infinite"
                  : "none",
              transition: "box-shadow 0.4s ease-out, border-color 0.4s ease-out",
              opacity: isRead ? 0.85 : 1,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 40,
            }}
          >
            {/* Minimal glyph — no rendered text on the slate itself
                per Bible §8.3 "no rendered text" rule. A small
                hyperglyph suggests the posting is still open. */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#22d3ee",
                boxShadow: "0 0 8px #22d3ee",
                opacity: isRead ? 0.35 : posting.highlighted ? 0.9 : 0.65,
              }}
            />
            {/* Read checkmark */}
            {isRead && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "rgba(34, 211, 238, 0.8)",
                }}
              />
            )}
          </button>
        );
      })}

      {/* Reader panel — the posting's full body */}
      <AnimatePresence>
        {openPosting_ && (
          <motion.div
            key={`reader-${openPosting_.id}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Mission posting: ${openPosting_.title}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
              border: "1px solid rgba(34, 211, 238, 0.4)",
              boxShadow: "0 0 40px rgba(34, 211, 238, 0.2)",
              color: "rgba(255, 255, 255, 0.9)",
              fontFamily: "monospace",
              zIndex: 60,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid rgba(34, 211, 238, 0.25)",
              }}
            >
              <div
                style={{
                  color: "#22d3ee",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  marginBottom: 6,
                }}
              >
                {openPosting_.title}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "rgba(34, 211, 238, 0.6)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <span>Posted by {openPosting_.postedBy}</span>
                <span>{formatYearsOpen(openPosting_.yearsOpen)} open</span>
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                padding: "20px 24px",
                overflowY: "auto",
                fontSize: 13,
                lineHeight: 1.65,
                color: "rgba(255, 255, 255, 0.78)",
                flex: 1,
              }}
            >
              {openPosting_.description
                .split(/\n\n+/)
                .map((para, i) => (
                  <p key={i} style={{ margin: "0 0 12px 0" }}>
                    {para}
                  </p>
                ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid rgba(34, 211, 238, 0.25)",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                onClick={closePosting}
                aria-label="Close posting"
                style={{
                  padding: "8px 18px",
                  background: "transparent",
                  border: "1px solid rgba(34, 211, 238, 0.4)",
                  color: "#22d3ee",
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button — unlocks after first read */}
      <button
        onClick={onComplete}
        disabled={!canContinue}
        aria-label="Continue to next beat"
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          padding: "12px 24px",
          background: canContinue
            ? "rgba(34, 211, 238, 0.18)"
            : "rgba(1, 0, 32, 0.5)",
          border: `1px solid ${
            canContinue ? "rgba(34, 211, 238, 0.6)" : "rgba(34, 211, 238, 0.2)"
          }`,
          color: canContinue ? "#22d3ee" : "rgba(34, 211, 238, 0.35)",
          fontFamily: "monospace",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: canContinue ? "pointer" : "default",
          transition: "background 0.2s, border-color 0.2s, color 0.2s",
          zIndex: 70,
        }}
      >
        Continue ›
      </button>

      {/* Read progress indicator (top-left) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 72,
          left: 16,
          fontFamily: "monospace",
          fontSize: 10,
          color: "rgba(34, 211, 238, 0.55)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          zIndex: 60,
        }}
      >
        Read {read.size} / {BEAT_D_MISSION_POSTINGS.length}
      </div>
    </div>
  );
}
