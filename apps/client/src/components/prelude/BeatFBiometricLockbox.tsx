/**
 * BeatFBiometricLockbox — Beat F "Kael Contingency Memo" lockbox.
 *
 * Bible §11 ends Beat F on the Captain's briefing table, where a
 * biometric lockbox recognises the player and unfurls a holographic
 * memo Kael left behind. The memo scrolls once; dismissing it raises
 * `prelude_beat_f_memo_read` and advances the sequence.
 *
 * Interaction:
 *   1. Lockbox pulses on the table (idle).
 *   2. Player taps it — the `lockbox-bio-recognize` VFX plays the
 *      `recognize` → `open` sequence and the holo-memo rises.
 *   3. The memo pages through three fragments. Each tap advances.
 *   4. On the final fragment the "Hold the letter" button surfaces,
 *      raising the flag and calling `onComplete()`.
 *
 * The component uses the already-registered `vfx_lockbox_bio_recognize`
 * and `vfx_memo_holo_rise` ids (both declared code-implemented in
 * preludeSequence.ts §11 VFX section) — no new effect rigs here.
 */

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { PreludeTutorCard } from "./PreludeTutorCard";

type LockboxPhase = "idle" | "recognize" | "memo" | "closing";

export interface BeatFBiometricLockboxProps {
  onComplete: () => void;
}

/**
 * Three-page memo Kael left in the briefing-room lockbox. Each entry
 * is rendered as a separate fragment so the player has time to sit
 * with each beat. Source: Bible §11.5 "213 Entries" draft.
 */
const MEMO_PAGES: readonly { heading: string; body: string }[] = [
  {
    heading: "Contingency Memo — Kael Vash",
    body:
      "If you are reading this, I am not at the table. There are two hundred and thirteen entries in the ledger and one chair that will not fill.",
  },
  {
    heading: "On what happens next",
    body:
      "The Ark will wake without me. Trust the Engineer — or trust the pattern he left behind. Both say the same thing in different languages.",
  },
  {
    heading: "On the chair",
    body:
      "Leave it empty. Do not sit in it. Do not move it. It is the only promise I can still keep.",
  },
];

export function BeatFBiometricLockbox({ onComplete }: BeatFBiometricLockboxProps) {
  const { setNarrativeFlag } = useGame();
  const [phase, setPhase] = useState<LockboxPhase>("idle");
  const [pageIndex, setPageIndex] = useState(0);

  const openLockbox = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("recognize");
    // Brief recognize animation, then reveal the memo.
    const timer = window.setTimeout(() => setPhase("memo"), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const advancePage = useCallback(() => {
    setPageIndex((i) => Math.min(i + 1, MEMO_PAGES.length - 1));
  }, []);

  const holdTheLetter = useCallback(() => {
    if (phase === "closing") return;
    setPhase("closing");
    setNarrativeFlag("prelude_beat_f_memo_read", true);
    // Let the exit animation breathe.
    const timer = window.setTimeout(onComplete, 600);
    return () => window.clearTimeout(timer);
  }, [phase, setNarrativeFlag, onComplete]);

  const onLastPage = pageIndex >= MEMO_PAGES.length - 1;

  return (
    <div
      role="region"
      aria-label="Beat F — biometric lockbox"
      style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
    >
      <div className="absolute left-4 top-4 z-30 max-w-md">
        <PreludeTutorCard systemId="beat_f_lockbox" />
      </div>

      {/* Lockbox hotspot — anchored on the briefing-room table. */}
      {phase === "idle" && (
        <button
          onClick={openLockbox}
          aria-label="Open the biometric lockbox"
          style={{
            position: "absolute",
            left: "50%",
            top: "62%",
            transform: "translate(-50%, -50%)",
            width: 120,
            height: 44,
            borderRadius: 6,
            border: "1px solid color-mix(in oklch, var(--energy-primary) 55%, transparent)",
            background: "color-mix(in oklch, var(--energy-primary) 14%, transparent)",
            color: "var(--energy-primary)",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow:
              "0 0 var(--space-xl) color-mix(in oklch, var(--energy-primary) 45%, transparent)",
            animation: "pvfx-cyan-shimmer 3s ease-in-out infinite",
            zIndex: 40,
          }}
        >
          Lockbox
        </button>
      )}

      {/* Recognize pulse ring */}
      {phase === "recognize" && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0.6, scale: 0.4 }}
          animate={{ opacity: 0, scale: 2.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "62%",
            width: 120,
            height: 120,
            marginLeft: -60,
            marginTop: -60,
            borderRadius: "50%",
            border: "1px solid var(--energy-primary)",
            zIndex: 35,
          }}
        />
      )}

      {/* Memo holo-rise */}
      <AnimatePresence>
        {(phase === "memo" || phase === "closing") && (
          <motion.div
            key="memo"
            role="dialog"
            aria-modal="true"
            aria-label="Kael contingency memo"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{
              opacity: phase === "closing" ? 0 : 1,
              y: phase === "closing" ? -16 : 0,
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(520px, 90vw)",
              padding: "var(--space-lg) var(--space-lg) var(--space-md)",
              background: "color-mix(in oklch, var(--bg-void) 92%, transparent)",
              border:
                "1px solid color-mix(in oklch, var(--energy-primary) 55%, transparent)",
              boxShadow:
                "0 0 var(--space-2xl) color-mix(in oklch, var(--energy-primary) 30%, transparent)",
              color: "var(--text-primary)",
              fontFamily: "monospace",
              zIndex: 60,
            }}
          >
            <div
              style={{
                color: "var(--energy-primary)",
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              {MEMO_PAGES[pageIndex].heading}
            </div>
            <p
              aria-live="polite"
              style={{
                fontFamily: "serif",
                fontSize: 15,
                lineHeight: 1.65,
                margin: 0,
                color:
                  "color-mix(in oklch, var(--text-primary) 88%, transparent)",
              }}
            >
              {MEMO_PAGES[pageIndex].body}
            </p>
            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  flex: 1,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color:
                    "color-mix(in oklch, var(--energy-primary) 50%, transparent)",
                  alignSelf: "center",
                }}
              >
                {pageIndex + 1} / {MEMO_PAGES.length}
              </div>
              {!onLastPage && (
                <button
                  onClick={advancePage}
                  style={{
                    padding: "var(--space-xs) var(--space-md)",
                    background: "transparent",
                    border:
                      "1px solid color-mix(in oklch, var(--energy-primary) 45%, transparent)",
                    color: "var(--energy-primary)",
                    fontFamily: "monospace",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Next ›
                </button>
              )}
              {onLastPage && (
                <button
                  onClick={holdTheLetter}
                  autoFocus
                  style={{
                    padding: "var(--space-xs) var(--space-md)",
                    background:
                      "color-mix(in oklch, var(--energy-primary) 25%, transparent)",
                    border: "1px solid var(--energy-primary)",
                    color: "var(--energy-primary)",
                    fontFamily: "monospace",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Hold the letter
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
