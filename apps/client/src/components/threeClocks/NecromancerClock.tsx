/* ═══════════════════════════════════════════════════════
   NECROMANCER CLOCK — Three Clocks Panel subcomponent

   Renders the Necromancer cycle's phase + tiered energy
   descriptor. Never exposes the hidden numeric meter — the
   resurrectionEnergy field is a discrete tier and the
   narration is the prose descriptor.

   docs/design/NEXUS_TRIAL_PLAN.md → Three Clocks Panel UI
   ═══════════════════════════════════════════════════════ */

import type { NecromancerClockState } from "@shared/threeClocks/state";

const PHASE_LABEL: Record<NecromancerClockState["phase"], string> = {
  dormant: "DORMANT",
  stirring: "STIRRING",
  awakening: "AWAKENING",
  manifesting: "MANIFESTING",
  returned: "RETURNED",
  banishment_active: "BANISHMENT",
  banished: "BANISHED",
};

const PHASE_TOKEN: Record<NecromancerClockState["phase"], string> = {
  dormant: "void-text-muted",
  stirring: "void-text-muted",
  awakening: "void-text-system",
  manifesting: "void-text-premium",
  returned: "void-text-error",
  banishment_active: "void-text-accent",
  banished: "void-text-success",
};

const TIER_TOKEN: Record<NecromancerClockState["resurrectionEnergy"], string> = {
  cold: "void-text-muted",
  warm: "void-text-system",
  hot: "void-text-premium",
  critical: "void-text-error",
};

const TIER_LABEL: Record<NecromancerClockState["resurrectionEnergy"], string> = {
  cold: "COLD",
  warm: "WARM",
  hot: "HOT",
  critical: "CRITICAL",
};

/** Cycle phases as the ladder pips render them. */
const PHASE_LADDER: ReadonlyArray<NecromancerClockState["phase"]> = [
  "dormant",
  "stirring",
  "awakening",
  "manifesting",
  "returned",
  "banishment_active",
  "banished",
];

export function NecromancerClock({ state }: { state: NecromancerClockState }) {
  return (
    <section
      data-component="necromancer-clock"
      data-phase={state.phase}
      data-tier={state.resurrectionEnergy}
      className="void-radius-sm void-border-subtle border void-bg-sunk p-3 font-mono"
    >
      <header className="mb-2 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.25em] void-text-accent">
          NECROMANCER · CYCLE {state.cycleNumber}
        </span>
        <span
          className={`text-[10px] tracking-[0.2em] ${PHASE_TOKEN[state.phase]}`}
          data-phase-label
        >
          {PHASE_LABEL[state.phase]}
        </span>
      </header>

      <ol
        className="mb-2 flex items-center justify-between gap-1"
        role="meter"
        aria-label="Necromancer cycle phase"
        aria-valuemin={0}
        aria-valuemax={PHASE_LADDER.length - 1}
        aria-valuenow={PHASE_LADDER.indexOf(state.phase)}
      >
        {PHASE_LADDER.map((p) => (
          <li
            key={p}
            data-phase-pip={p}
            data-active={p === state.phase}
            className={`h-1 flex-1 void-radius-sm void-transition-base ${
              p === state.phase ? "void-bg-system" : "void-bg-canvas"
            }`}
            aria-hidden="true"
          />
        ))}
      </ol>

      <footer className="flex items-center justify-between text-[9px] tracking-[0.18em] void-text-muted">
        <span data-readout="energy-tier" className={TIER_TOKEN[state.resurrectionEnergy]}>
          ENERGY {TIER_LABEL[state.resurrectionEnergy]}
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
