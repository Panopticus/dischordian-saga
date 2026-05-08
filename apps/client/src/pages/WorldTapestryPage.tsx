/* ═══════════════════════════════════════════════════════
   WORLD TAPESTRY — the saga's weather, in one page

   Sections:
     - Seven Seals ribbon
     - Four Horsemen gauge (global mood + dominant axis)
     - Yearly event countdown + closing-motion preview
     - Recent ripples ticker (last 20, "from → to" pairs)
     - 17-system constellation legend
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import SevenSealsRibbon from "@/components/SevenSealsRibbon";
import { WOVEN_SYSTEMS } from "@shared/wovenSystems/registry";
import { ALL_HORSEMEN } from "@shared/wovenSystems/types";

const HORSEMAN_LABEL: Record<string, string> = {
  conquest: "Conquest",
  war: "War",
  famine: "Famine",
  death: "Death",
};

const HORSEMAN_COLOR: Record<string, string> = {
  conquest: "#fde68a",
  war: "#ef4444",
  famine: "#1f2937",
  death: "#9ca3af",
};

function pct(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v * 100)));
}

function timeUntil(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "imminent";
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"}`;
  const hours = Math.floor(ms / 3_600_000);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

export default function WorldTapestryPage() {
  const { data: globalMood } = trpc.worldMood.getGlobal.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: nextAnchor } = trpc.yearlyEvents.getNextAnchor.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: recentRipples } = trpc.worldMood.recentRipples.useQuery(
    { limit: 20 },
    { staleTime: 30_000 },
  );
  const { data: activeYearlies } = trpc.yearlyEvents.listActive.useQuery(undefined, {
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-light tracking-wide mb-2">World Tapestry</h1>
        <p className="text-sm text-white/50">
          The saga's weather. The four horsemen are how today feels; the seven
          seals are how far the spine has cracked.
        </p>
      </header>

      {/* Seven Seals ribbon */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
          Seven Seals
        </h2>
        <SevenSealsRibbon />
      </section>

      {/* Four Horsemen gauge */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
          Four Horsemen
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {ALL_HORSEMEN.map((axis) => {
            const value = globalMood
              ? (globalMood as unknown as Record<string, number>)[axis]
              : 0;
            const isDominant = globalMood?.dominantAxis === axis;
            return (
              <div key={axis} className="flex flex-col items-center gap-2">
                <div className="relative w-full h-24 bg-white/5 rounded-md overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all"
                    style={{
                      height: `${pct(value)}%`,
                      backgroundColor: HORSEMAN_COLOR[axis],
                      opacity: isDominant ? 1 : 0.65,
                    }}
                  />
                </div>
                <div className="text-xs text-white/70">
                  {HORSEMAN_LABEL[axis]}
                  {isDominant ? " ✦" : null}
                </div>
                <div className="text-[10px] text-white/40">{pct(value)}%</div>
              </div>
            );
          })}
        </div>
        {globalMood?.mercyOffset && globalMood.mercyOffset > 0 ? (
          <p className="mt-3 text-xs text-emerald-400/80">
            Mercy offset: −{(globalMood.mercyOffset * 100).toFixed(1)}% from
            Famine + Death (recent donations + social counter-tick).
          </p>
        ) : null}
      </section>

      {/* Yearly events */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
          Yearly Events
        </h2>
        {activeYearlies && activeYearlies.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {activeYearlies.map((y) => (
              <li
                key={y.id}
                className="flex items-center justify-between px-3 py-2 rounded-md bg-amber-900/20 border border-amber-700/40"
              >
                <span className="text-sm">
                  <span className="text-amber-300 font-medium">{y.eventKey}</span>
                  <span className="text-white/50"> — active, year {y.activeYear}</span>
                </span>
                <span className="text-xs text-white/50">
                  {y.closingMotionKey ?? "no closing motion"}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        {nextAnchor ? (
          <div className="text-sm text-white/70">
            Next anchor: <span className="text-white">{nextAnchor.name}</span>
            <span className="text-white/50"> in {timeUntil(nextAnchor.at)}</span>
          </div>
        ) : null}
      </section>

      {/* Recent ripples */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
          Recent Ripples
        </h2>
        {recentRipples && recentRipples.length > 0 ? (
          <ul className="space-y-1 font-mono text-xs text-white/60 max-h-64 overflow-y-auto">
            {recentRipples.map((r) => (
              <li key={r.id} className="flex items-center gap-3">
                <span className="text-white/40 shrink-0 w-32">
                  {new Date(r.emittedAt).toISOString().slice(11, 19)}
                </span>
                <span className="text-amber-400/80 shrink-0 w-28 truncate">
                  {r.fromSystem ?? "·"}
                </span>
                <span className="text-white/30">→</span>
                <span className="text-cyan-300/80 shrink-0 w-40 truncate">
                  {Array.isArray(r.toSystems) ? r.toSystems.join(", ") : "—"}
                </span>
                <span className="text-white/70 truncate">{r.eventType}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/40">
            No ripples logged yet. Trigger any cross-system action and the
            ledger will fill within ~60s.
          </p>
        )}
      </section>

      {/* Constellation legend */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
          17 Woven Systems
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {WOVEN_SYSTEMS.map((s) => (
            <div
              key={s.id}
              className="px-3 py-2 rounded-md bg-white/5 border border-white/5"
              title={s.description}
            >
              <div className="text-white/80">{s.name}</div>
              <div className="text-white/40 font-mono text-[10px]">{s.id}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
