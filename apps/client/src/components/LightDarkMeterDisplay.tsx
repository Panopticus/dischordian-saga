/* ═══════════════════════════════════════════════════════
   LIGHT / DARK METER DISPLAY — §3.5 poetic readout.

   Read-only overlay that renders the current Dischordia
   Cycle state as three stacked lines of poetry:

     Light  →  getLightEnergyDescription(lightEnergy)
     Dark   →  getDarkEnergyDescription(darkEnergy)
     Vortex →  getVortexProximityDescription(vortexProximity)
               (hidden until proximity > 50%)

   Never shows the underlying number. Never touches the
   store to write — it's a pure subscription.

   Drop-in for the Bridge conspiracy board, the §3.3 galactic
   starfield overlay, or any admin debug panel.
   ═══════════════════════════════════════════════════════ */

import {
  getBalanceDescription,
  getDarkEnergyDescription,
  getLightEnergyDescription,
  getVortexProximityDescription,
  type DischordiaPhase,
} from "@shared/dischordiaCycle";
import { useDischordiaCycleStore } from "@/stores/dischordiaCycleStore";

export interface LightDarkMeterDisplayProps {
  /** Compact mode hides labels and shrinks the footprint. */
  compact?: boolean;
  /** Extra class names for the wrapper card. */
  className?: string;
}

const PHASE_TINT: Record<DischordiaPhase, string> = {
  dawn: "border-white/10",
  dimming: "void-border",
  long_night: "void-border-error",
  vortex_advance: "void-border-error",
  reclamation: "void-border",
  light_holds: "void-border-success",
};

const PHASE_LABEL: Record<DischordiaPhase, string> = {
  dawn: "Dawn",
  dimming: "Dimming",
  long_night: "Long Night",
  vortex_advance: "Vortex Advance",
  reclamation: "Reclamation",
  light_holds: "The Light Holds",
};

export function LightDarkMeterDisplay({
  compact = false,
  className,
}: LightDarkMeterDisplayProps) {
  const state = useDischordiaCycleStore((s) => s.state);

  const lightText = getLightEnergyDescription(state.lightEnergy);
  const darkText = getDarkEnergyDescription(state.darkEnergy);
  const vortexText = getVortexProximityDescription(state.vortexProximity);
  const balanceText = getBalanceDescription(state.energyBalance, state.phase);

  const phaseTint = PHASE_TINT[state.phase];
  const phaseLabel = PHASE_LABEL[state.phase];

  return (
    <div
      className={`rounded-lg border ${phaseTint} bg-black/40 backdrop-blur-sm ${compact ? "p-2" : "p-3"} ${className ?? ""}`}
      data-testid="light-dark-meter-display"
    >
      {!compact && (
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase">
            Galactic State
          </p>
          <p className="font-mono text-[10px] text-white/60 tracking-wider">
            {phaseLabel}
          </p>
        </div>
      )}

      <MeterLine
        tint="void-text-energy"
        label={compact ? null : "Light"}
        text={lightText}
      />
      <MeterLine
        tint="void-text-accent"
        label={compact ? null : "Dark"}
        text={darkText}
      />
      {vortexText && (
        <MeterLine
          tint="void-text-error"
          label={compact ? null : "Vortex"}
          text={vortexText}
        />
      )}

      {!compact && (
        <p className="mt-2 pt-2 border-t border-white/5 font-mono text-[10px] italic text-white/50">
          {balanceText}
        </p>
      )}
    </div>
  );
}

function MeterLine({
  tint,
  label,
  text,
}: {
  tint: string;
  label: string | null;
  text: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      {label && (
        <span className="font-mono text-[10px] text-white/30 tracking-wider w-12 flex-shrink-0">
          {label}
        </span>
      )}
      <p className={`font-mono text-xs italic ${tint} leading-snug`}>{text}</p>
    </div>
  );
}
