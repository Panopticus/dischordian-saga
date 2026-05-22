/* ═══════════════════════════════════════════════════════
   THREE CLOCKS PANEL — docs/design/NEXUS_TRIAL_PLAN.md

   Top-level container surfacing the Vortex / Necromancer /
   Politician triad. Polls trpc.threeClocks.get at the
   fallback cadence (Sprint 4 swaps in WebSocket push).

   Renders three subcomponents in a stack:
     - VortexClock        ← doomsday meter + sector counters
     - NecromancerClock   ← cycle phase + tiered energy descriptor
     - PoliticianClock    ← Archon Ascension Ladder top rank

   Void Energy compliant — uses void-* tokens only. State
   reflected via `data-*` attributes; no state-via-class.
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";
import { VortexClock } from "./VortexClock";
import { NecromancerClock } from "./NecromancerClock";
import { PoliticianClock } from "./PoliticianClock";
import type { ThreeClocksState } from "@shared/threeClocks/state";

/** How often the panel re-polls the server snapshot. Matches the
 *  60-second tick cadence the router advertises via `nextTickAt`. */
const REFETCH_INTERVAL_MS = 30_000;

/** Pure render — exposed for tests so we can render against a known
 *  state without standing up a tRPC client. */
export function ThreeClocksPanelView({ state }: { state: ThreeClocksState }) {
  return (
    <section
      data-component="three-clocks-panel"
      data-vortex-phase={state.vortex.phase}
      data-necromancer-phase={state.necromancer.phase}
      data-politician-seat-status={state.politician.seatStatus}
      className="void-radius void-border border void-bg-elevated p-3 flex flex-col gap-2"
      aria-label="The Three Clocks"
    >
      <header className="flex items-center justify-between text-[10px] tracking-[0.25em] void-text-accent">
        <span>THE THREE CLOCKS</span>
        <span
          className="void-text-muted"
          data-readout="next-tick"
          title="Next aggregation tick"
        >
          NEXT TICK {new Date(state.nextTickAt).toLocaleTimeString()}
        </span>
      </header>

      <VortexClock state={state.vortex} />
      <NecromancerClock state={state.necromancer} />
      <PoliticianClock state={state.politician} />
    </section>
  );
}

export default function ThreeClocksPanel() {
  const query = trpc.threeClocks.get.useQuery(undefined, {
    refetchInterval: REFETCH_INTERVAL_MS,
    staleTime: REFETCH_INTERVAL_MS,
    retry: 1,
  });

  if (!query.data) {
    return (
      <section
        data-component="three-clocks-panel"
        data-state="loading"
        className="void-radius void-border border void-bg-elevated p-3"
        aria-busy="true"
        aria-label="The Three Clocks (loading)"
      >
        <span className="text-[10px] tracking-[0.25em] void-text-muted">
          THE THREE CLOCKS · LOADING…
        </span>
      </section>
    );
  }

  return <ThreeClocksPanelView state={query.data} />;
}
