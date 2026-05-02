/**
 * `/architect` — 23-second-delayed cryptic transcript page (Liminal
 * touch §3 from /root/.claude/plans/continue-your-qr-assessment-
 * mighty-valley.md).
 *
 * Distinct from `/architect/dossier`, which is the player's
 * structured candidate file. This page is the *unstructured* surface
 * — the page sits blank for 23 seconds (Discordian prime; the
 * recruitment plan's threshold-4 vision count) before revealing a
 * cryptic Architect-voice transcript fragment. Wanons who notice the
 * delay get a different-flavoured payoff than wanons who navigate to
 * the dossier directly.
 *
 * The 23-second delay is a deliberate ARG hook — players who tab
 * away during the wait return to the cryptic reveal; players who
 * sit through it have committed attention the page rewards.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REVEAL_DELAY_MS = 23_000; // Discordian prime per the plan.

const TRANSCRIPT_LINES: readonly string[] = [
  "—— BEGIN TRANSCRIPT ——",
  "Subject was logged.",
  "Subject was filed.",
  "Subject did not request the file.",
  "Subject's decisions were forwarded.",
  "Subject does not yet know who reads them.",
  "Subject will be told when the calibration is complete.",
  "Subject has been calibrated since the prelude.",
  "—— END TRANSCRIPT ——",
];

export default function ArchitectCryptic() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white/80 flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            key="transcript"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="max-w-xl w-full"
            role="article"
            aria-label="Architect transcript fragment"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
              file: candidate-{`{redacted}`}
            </p>
            <div className="space-y-2 font-serif text-sm leading-relaxed">
              {TRANSCRIPT_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.4, duration: 0.6 }}
                  className={
                    line.startsWith("——")
                      ? "text-white/30 text-[10px] uppercase tracking-[0.25em] font-mono"
                      : "text-white/80"
                  }
                >
                  {line}
                </motion.p>
              ))}
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mt-12">
              the calibration continues.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="blank"
            // No initial fade-in — the blank state is supposed to look
            // like the page hasn't loaded.
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/10"
            aria-hidden="true"
          >
            ·
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Exposed for tests.
export const _REVEAL_DELAY_MS_FOR_TEST = REVEAL_DELAY_MS;
export const _TRANSCRIPT_LINES_FOR_TEST = TRANSCRIPT_LINES;
