/* ═══════════════════════════════════════════════════════
   PALIMPSEST METER PANEL — Illuminated Manuscript

   Two-column manuscript page. Left column = Signal (gold
   ink, truth). Right column = Noise (red ink, corruption).
   The player never sees numbers — only the descriptors
   from apps/shared/palimpsest.ts and the relative fill of
   the two columns.

   Designed to sit on the Governance Hub below Daily Micro
   Votes, next to the Antiquarian's Tome and the Pulse.
   ═══════════════════════════════════════════════════════ */

import { motion } from "framer-motion";
import { BookOpen, Eye, AlertTriangle } from "lucide-react";
import {
  DEFAULT_PALIMPSEST_STATE,
  getSignalDescription,
  getNoiseDescription,
  getBalanceDescription,
  getPhase,
  shouldHostMaskSlip,
  PALIMPSEST_SOFT_MAX,
  type PalimpsestState,
} from "@shared/palimpsest";

interface Props {
  state?: PalimpsestState;
}

/** Clamp meter fill to [0,1] for display. */
function fill(value: number): number {
  return Math.max(0, Math.min(1, value / PALIMPSEST_SOFT_MAX));
}

const PHASE_FLAVOR: Record<ReturnType<typeof getPhase>, { color: string; label: string }> = {
  radiant: { color: "text-amber-200", label: "RADIANT" },
  truthful: { color: "text-amber-300/80", label: "TRUTHFUL" },
  balanced: { color: "text-muted-foreground/70", label: "BALANCED" },
  corrupted: { color: "text-red-400", label: "CORRUPTED" },
  overwritten: { color: "text-red-500", label: "OVERWRITTEN" },
};

export function PalimpsestMeterPanel({ state = DEFAULT_PALIMPSEST_STATE }: Props) {
  const phase = getPhase(state);
  const flavor = PHASE_FLAVOR[phase];
  const signalFill = fill(state.signal);
  const noiseFill = fill(state.noise);
  const maskSlipping = shouldHostMaskSlip(state);

  return (
    <div
      className="void-elevated p-5 relative overflow-hidden"
      style={{
        borderColor: "rgba(251,191,36,0.15)",
        background:
          "linear-gradient(135deg, rgba(24,18,8,0.85) 0%, rgba(20,10,8,0.85) 100%)",
      }}
      data-testid="palimpsest-meter-panel"
    >
      {/* Parchment texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(251,191,36,0.3) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(220,60,60,0.2) 0 1px, transparent 1px 3px)",
        }}
      />

      <div className="relative">
        <div className="text-center mb-4">
          <BookOpen size={18} className="mx-auto text-amber-300 mb-1" />
          <h2 className="font-display text-sm font-bold tracking-[0.2em] text-amber-200">
            THE PALIMPSEST
          </h2>
          <p className="font-mono text-[8px] text-amber-400/50 tracking-wider">
            SIGNAL &amp; NOISE · EPISODE {state.currentEpisode}/13
          </p>
        </div>

        {/* Two-column manuscript */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Signal column */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[8px] uppercase tracking-wider text-amber-300/70">
                Signal
              </span>
              <span className="font-mono text-[8px] text-amber-400/40">gold ink</span>
            </div>
            <div className="h-28 rounded border border-amber-500/20 bg-black/30 relative overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-400/70 via-amber-300/40 to-amber-200/10"
                initial={{ height: 0 }}
                animate={{ height: `${signalFill * 100}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                data-testid="palimpsest-signal-fill"
              />
              {/* Calligraphy flourish */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(251,191,36,0.15) 0 1px, transparent 1px 8px)",
                }}
              />
            </div>
            <p className="font-serif text-[10px] italic text-amber-100/70 mt-2 leading-snug">
              {getSignalDescription(state.signal)}
            </p>
          </div>

          {/* Noise column */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[8px] uppercase tracking-wider text-red-400/70">
                Noise
              </span>
              <span className="font-mono text-[8px] text-red-500/40">red ink</span>
            </div>
            <div className="h-28 rounded border border-red-500/20 bg-black/30 relative overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600/70 via-red-500/40 to-red-400/10"
                initial={{ height: 0 }}
                animate={{ height: `${noiseFill * 100}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                data-testid="palimpsest-noise-fill"
              />
              {/* Crosshatch overlay — the edit marks */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(220,60,60,0.25) 0 1px, transparent 1px 5px), repeating-linear-gradient(-45deg, rgba(220,60,60,0.15) 0 1px, transparent 1px 7px)",
                }}
              />
            </div>
            <p className="font-serif text-[10px] italic text-red-200/70 mt-2 leading-snug">
              {getNoiseDescription(state.noise)}
            </p>
          </div>
        </div>

        {/* Balance caption */}
        <div className="p-3 rounded border border-amber-500/10 bg-black/30 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-mono text-[8px] uppercase tracking-[0.2em] ${flavor.color}`}>
              {flavor.label}
            </span>
            <span className="font-mono text-[8px] text-muted-foreground/30">·</span>
            <Eye size={10} className="text-amber-400/40" />
            <span className="font-mono text-[8px] text-amber-400/40">
              {state.history.length} episode{state.history.length === 1 ? "" : "s"} inscribed
            </span>
          </div>
          <p className="font-serif text-[10px] italic text-amber-100/60 leading-relaxed">
            {getBalanceDescription(state)}
          </p>
        </div>

        {/* Host mask slip warning */}
        {maskSlipping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 rounded border border-red-500/40 bg-red-950/40 flex items-center gap-2"
            data-testid="palimpsest-mask-slip-warning"
          >
            <AlertTriangle size={12} className="text-red-400 shrink-0" />
            <p className="font-mono text-[9px] text-red-300 leading-snug">
              The Host's face is slipping. Watch the next broadcast carefully.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PalimpsestMeterPanel;
