/* ═══════════════════════════════════════════════════════
   HOST MASK SLIP — animated overlay

   When the Palimpsest Noise meter pulls ahead of Signal, the
   Host's face glitches on the broadcast. At "corrupted," it's
   a brief 120ms static shimmer. At "overwritten," the mask
   falls away for ~400ms and the Meme underneath is visible
   for four frames.

   Consumed by PalimpsestEpisodesPage during broadcasts and by
   GamemastersArena in standalone runs. The component reads
   the cue table from apps/shared/palimpsestCinematics.ts so
   timings stay aligned with the design spec.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPhase,
  type PalimpsestState,
} from "@shared/palimpsest";
import { MASK_SLIP_CUES } from "@shared/palimpsestCinematics";

interface Props {
  state: PalimpsestState;
  /** Force the slip to trigger for preview (tests, screenshots). */
  forcePhase?: "corrupted" | "overwritten";
}

export function HostMaskSlip({ state, forcePhase }: Props) {
  const phase = forcePhase ?? getPhase(state);
  const [visible, setVisible] = useState(false);

  // Schedule a slip once per phase change into a corrupted/overwritten
  // state. We don't loop — the slip is a punctuation, not ambient noise.
  useEffect(() => {
    if (phase !== "corrupted" && phase !== "overwritten") return;
    setVisible(true);
    const cue = MASK_SLIP_CUES[phase];
    const t = setTimeout(() => setVisible(false), cue.durationMs);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase !== "corrupted" && phase !== "overwritten") return null;

  const cue = MASK_SLIP_CUES[phase];
  const revealMeme = cue.revealMemeBelow;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: cue.glitchIntensity / 3 + 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.08 }}
          className="fixed inset-0 z-[75] pointer-events-none"
          data-testid="host-mask-slip"
        >
          {/* Static/glitch overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, color-mix(in oklch, var(--text-primary) 12%, transparent) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, color-mix(in oklch, var(--bg-void) 20%, transparent) 0 1px, transparent 1px 2px)",
              mixBlendMode: "difference",
            }}
          />
          {/* Chromatic aberration streaks */}
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,0,64,0.08) 0%, transparent 40%, transparent 60%, rgba(0,200,255,0.08) 100%)",
            }}
          />
          {/* The Meme underneath — only at overwritten */}
          {revealMeme && (
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <p
                  className="font-serif text-[10vw] void-text-error"
                  style={{ textShadow: "0 0 30px rgba(220,40,40,0.8)" }}
                >
                  ?
                </p>
                <p className="font-mono text-[10px] void-text-error mt-2 tracking-[0.3em]">
                  THE HOST IS NOT WHAT HE WAS
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HostMaskSlip;
