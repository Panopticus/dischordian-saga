/* ═══════════════════════════════════════════════════════
   VORTEX CLOCK — Three Clocks Panel subcomponent

   Renders the Vortex's doomsday-meter state from the
   composed snapshot. State is reflected in `data-phase`
   so CSS can theme the clock per phase without state-via-
   class violations.

   docs/design/NEXUS_TRIAL_PLAN.md → Three Clocks Panel UI
   ═══════════════════════════════════════════════════════ */

import type { VortexClockState } from "@shared/threeClocks/state";

const PHASE_LABEL: Record<VortexClockState["phase"], string> = {
  dawn: "DAWN",
  dimming: "DIMMING",
  long_night: "LONG NIGHT",
  vortex_advance: "VORTEX ADVANCE",
  reclamation: "RECLAMATION",
  light_holds: "LIGHT HOLDS",
};

/** Phase → token mapping. `data-phase` carries the state; the
 *  text token here is the readout-color cue that the panel
 *  applies to the phase label. */
const PHASE_TOKEN: Record<VortexClockState["phase"], string> = {
  dawn: "void-text-success",
  dimming: "void-text-muted",
  long_night: "void-text-dim",
  vortex_advance: "void-text-error",
  reclamation: "void-text-accent",
  light_holds: "void-text-success",
};

export function VortexClock({ state }: { state: VortexClockState }) {
  return (
    <section
      data-component="vortex-clock"
      data-phase={state.phase}
      className="void-radius-sm void-border-subtle border void-bg-sunk p-3 font-mono"
    >
      <header className="mb-2 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.25em] void-text-accent">
          VORTEX
        </span>
        <span
          className={`text-[10px] tracking-[0.2em] ${PHASE_TOKEN[state.phase]}`}
          data-phase-label
        >
          {PHASE_LABEL[state.phase]}
        </span>
      </header>

      <div
        className="relative h-2 w-full overflow-hidden void-radius void-bg-canvas"
        role="meter"
        aria-label="Vortex proximity"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={state.proximity}
      >
        <div
          className="absolute inset-y-0 left-0 void-bg-error void-transition-base"
          style={{ width: `${state.proximity}%` }}
          data-meter="proximity"
        />
      </div>

      <footer className="mt-2 flex items-center justify-between text-[9px] tracking-[0.18em] void-text-muted">
        <span data-readout="proximity">{state.proximity}%</span>
        <span data-readout="sectors">
          CONSUMED {state.sectorsConsumed} · RECLAIMED {state.sectorsReclaimed}
        </span>
      </footer>

      <p
        className="mt-2 text-[10px] italic void-text-dim"
        data-readout="narration"
      >
        {state.narration}
      </p>
    </section>
  );
}
