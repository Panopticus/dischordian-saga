/* ═══════════════════════════════════════════════════════
   GLOBAL ALIGNMENT METER — NARRATIVE_ARCHITECTURE.md §0

   Status indicator surfacing the community-wide Light/Dark
   balance. Reads `trpc.globalAlignment.get` (refreshed every
   60 s; the server-side aggregate recomputes hourly so any
   shorter interval is wasted bytes) and renders:

     - a horizontal split bar — light segment scaled to
       `lightTotal / (lightTotal + darkTotal)`, dark segment
       to `darkTotal / total`. A 50/50 bar means the community
       is dead-balanced.
     - the two raw totals beneath, plus the active-player
       count, plus the derived phase label
       (light_dominant / balanced / dark_dominant).

   Void Energy compliant — uses `void-text-*` / `void-bg-*` /
   `void-border` tokens; no Tailwind color ramps, no hex.
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";

const PHASE_LABEL: Record<
  "light_dominant" | "balanced" | "dark_dominant",
  string
> = {
  light_dominant: "LIGHT ASCENDANT",
  balanced: "EQUILIBRIUM",
  dark_dominant: "DARK ASCENDANT",
};

const PHASE_TOKEN: Record<
  "light_dominant" | "balanced" | "dark_dominant",
  string
> = {
  light_dominant: "void-text-warning",
  balanced: "void-text-accent",
  dark_dominant: "void-text-error",
};

export default function GlobalAlignmentMeter() {
  const query = trpc.globalAlignment.get.useQuery(undefined, {
    refetchInterval: 60_000,
    staleTime: 60_000,
    retry: 1,
  });

  const data = query.data;
  const lightTotal = data?.lightTotal ?? 0;
  const darkTotal = data?.darkTotal ?? 0;
  const total = lightTotal + darkTotal;
  const lightPct = total > 0 ? (lightTotal / total) * 100 : 50;
  const darkPct = total > 0 ? (darkTotal / total) * 100 : 50;
  const phase = data?.phase ?? "balanced";
  const playerCount = data?.playerCount ?? 0;

  return (
    <section
      data-component="global-alignment-meter"
      data-phase={phase}
      className="rounded-md border void-border void-bg-sunk p-3 font-mono"
    >
      <header className="mb-2 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.25em] void-text-accent">
          COMMUNITY ALIGNMENT
        </span>
        <span
          className={`text-[10px] tracking-[0.2em] ${PHASE_TOKEN[phase]}`}
          data-phase-label
        >
          {PHASE_LABEL[phase]}
        </span>
      </header>

      <div
        className="relative h-2 w-full overflow-hidden rounded-full void-bg-base"
        role="meter"
        aria-label="Community Light/Dark alignment"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(lightPct)}
      >
        <div
          className="absolute inset-y-0 left-0 void-bg-warning"
          style={{ width: `${lightPct}%` }}
          data-side="light"
        />
        <div
          className="absolute inset-y-0 right-0 void-bg-error"
          style={{ width: `${darkPct}%` }}
          data-side="dark"
        />
      </div>

      <footer className="mt-2 flex items-center justify-between text-[9px] tracking-[0.18em]">
        <span className="void-text-warning" data-readout="light">
          LIGHT {lightTotal.toLocaleString()}
        </span>
        <span className="void-text-muted" data-readout="players">
          {playerCount.toLocaleString()} ACTIVE
        </span>
        <span className="void-text-error" data-readout="dark">
          DARK {darkTotal.toLocaleString()}
        </span>
      </footer>
    </section>
  );
}
