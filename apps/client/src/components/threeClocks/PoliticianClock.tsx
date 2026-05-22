/* ═══════════════════════════════════════════════════════
   POLITICIAN CLOCK — Three Clocks Panel subcomponent

   Renders the Politician's 7-layer Archon Ascension Ladder
   top-rank + seat status. Three seat states drive the
   color cue: sealed → success, contested → system,
   open → error.

   docs/design/NEXUS_TRIAL_PLAN.md → Three Clocks Panel UI
   ═══════════════════════════════════════════════════════ */

import type { PoliticianClockState } from "@shared/threeClocks/state";

const SEAT_LABEL: Record<PoliticianClockState["seatStatus"], string> = {
  sealed: "SEAT SEALED",
  contested: "SEAT CONTESTED",
  open: "SEAT OPEN",
};

const SEAT_TOKEN: Record<PoliticianClockState["seatStatus"], string> = {
  sealed: "void-text-success",
  contested: "void-text-system",
  open: "void-text-error",
};

const SEAT_PIP_TOKEN: Record<PoliticianClockState["seatStatus"], string> = {
  sealed: "void-bg-success",
  contested: "void-bg-system",
  open: "void-bg-error",
};

export function PoliticianClock({ state }: { state: PoliticianClockState }) {
  const ranks: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6 | 7> = [1, 2, 3, 4, 5, 6, 7];
  return (
    <section
      data-component="politician-clock"
      data-seat-status={state.seatStatus}
      data-top-rank={state.topRank}
      className="void-radius-sm void-border-subtle border void-bg-sunk p-3 font-mono"
    >
      <header className="mb-2 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.25em] void-text-accent">
          POLITICIAN · RANK {state.topRank}/7
        </span>
        <span
          className={`text-[10px] tracking-[0.2em] ${SEAT_TOKEN[state.seatStatus]}`}
          data-phase-label
        >
          {SEAT_LABEL[state.seatStatus]}
        </span>
      </header>

      <ol
        className="mb-2 flex items-center justify-between gap-1"
        role="meter"
        aria-label="Politician ascension ladder top rank"
        aria-valuemin={1}
        aria-valuemax={7}
        aria-valuenow={state.topRank}
      >
        {ranks.map((rank) => {
          const reached = rank <= state.topRank;
          const pipToken = reached
            ? SEAT_PIP_TOKEN[state.seatStatus]
            : "void-bg-canvas";
          return (
            <li
              key={rank}
              data-rank-pip={rank}
              data-reached={reached}
              className={`h-1 flex-1 void-radius-sm void-transition-base ${pipToken}`}
              aria-hidden="true"
            />
          );
        })}
      </ol>

      <footer className="flex items-center justify-between text-[9px] tracking-[0.18em] void-text-muted">
        <span data-readout="apprentices">
          APPRENTICES {state.apprenticesActive}
        </span>
        {state.aspirantNemesisId && (
          <span data-readout="aspirant" className="void-text-system">
            ARCHON-ASPIRANT PRESENT
          </span>
        )}
      </footer>
    </section>
  );
}
