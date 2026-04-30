/* ═══════════════════════════════════════════════════════
   LyraVoxWitnessModal

   Pops once per newly-filed Lyra Vox bloodline witness.
   Renders the substrate's clinical voice + the boon she has
   appended to the bloodline's record.

   Voice surface only — no business logic. The shared module
   apps/shared/lyraVoxBloodlineWitness.ts owns the lines and
   the boon shapes. Visual idiom matches the existing
   ArmyManagementPage mission-report modal: framer-motion
   fade+scale, void-* design tokens, faction-style colored
   speaker dots + uppercase labels.

   The depthLine — Lyra Vox's gated second beat — surfaces
   only when the player has earned the lyra_vox_depth_1 flag
   (per apps/shared/lyraVoxDialog.ts §requiredFlag pattern).
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Cpu } from "lucide-react";
import type { WitnessReport } from "@shared/lyraVoxBloodlineWitness";

export interface LyraVoxWitnessModalProps {
  report: WitnessReport | null;
  /** True when the player has earned the lyra_vox_depth_1 narrative
   *  flag — unlocks the depthLine where Lyra Vox provides the
   *  second-beat detail she would otherwise withhold. */
  depthUnlocked?: boolean;
  onDismiss: () => void;
}

/** Pretty-print a basis-points value as a percent. 300bp → "+3.0%". */
function formatBp(bp: number): string {
  if (bp === 0) return "—";
  return `+${(bp / 100).toFixed(1)}%`;
}

/** Pretty-print the milestone slug as a display string. */
function milestoneLabel(milestone: string): string {
  switch (milestone) {
    case "dynasty_reached":    return "Dynasty Reached";
    case "high_fitness_birth": return "High-Fitness Birth";
    case "founder_passed":     return "Founder Passed";
    case "drift_exceeded":     return "Drift Exceeded";
    case "centenary":          return "Centenary";
    default: return milestone.replace(/_/g, " ");
  }
}

export function LyraVoxWitnessModal({
  report,
  depthUnlocked = false,
  onDismiss,
}: LyraVoxWitnessModalProps) {
  return (
    <AnimatePresence>
      {report && (
        <motion.div
          key="lyra-vox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onDismiss}
        >
          <motion.div
            key={report.id}
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-md void-surface p-5"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header — substrate signal + milestone */}
            <div className="flex items-center gap-2 mb-1">
              <Radio size={16} className="text-primary" />
              <h3 className="font-display text-sm font-bold tracking-wide">
                SUBSTRATE WITNESS &middot; {milestoneLabel(report.milestone).toUpperCase()}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 mb-4 pl-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] text-primary tracking-[0.2em]">
                DR. LYRA VOX
              </span>
              <span className="font-mono text-[10px] opacity-50 ml-auto tracking-[0.15em]">
                BLOODLINE {report.bloodlineId.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>

            {/* The substrate line. Lyra's cadence is long; needs
                generous leading. */}
            <div className="space-y-3 mb-4">
              <p className="text-sm leading-relaxed">{report.line}</p>
              {depthUnlocked && report.depthLine && (
                <div className="border-l-2 border-primary/40 pl-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Cpu size={10} className="text-primary" />
                    <span className="font-mono text-[9px] text-primary tracking-[0.2em] opacity-80">
                      DEPTH 1 &middot; SUBSTRATE PRIVATE LOG
                    </span>
                  </div>
                  <p className="text-xs italic opacity-80 leading-relaxed">
                    {report.depthLine}
                  </p>
                </div>
              )}
            </div>

            {/* Boon card — substrate-tier surface to mirror the
                Vex directive card on the army page. */}
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Cpu size={12} className="text-primary" />
                <span className="font-mono text-[10px] text-primary tracking-[0.2em]">
                  BLOODLINE BOON FILED
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <BoonStat label="Gestation" value={formatBp(report.boon.gestationSpeedBp)} />
                <BoonStat label="Integrity" value={formatBp(report.boon.integrityFloorBp)} />
                <BoonStat label="Mutation" value={formatBp(report.boon.mutationFavorBp)} />
              </div>
            </div>

            <button
              onClick={onDismiss}
              autoFocus
              className="w-full px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all tracking-wide"
            >
              ACKNOWLEDGE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BoonStat({ label, value }: { label: string; value: string }) {
  const isInert = value === "—";
  return (
    <div>
      <div className="font-mono text-[9px] opacity-60 tracking-[0.15em] mb-0.5">
        {label.toUpperCase()}
      </div>
      <div className={`font-display text-sm font-bold ${isInert ? "opacity-40" : "text-primary"}`}>
        {value}
      </div>
    </div>
  );
}
