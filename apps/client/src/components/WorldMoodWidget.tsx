/* ═══════════════════════════════════════════════════════
   WORLD MOOD WIDGET — chrome-mounted four-horsemen sliver

   Four colored arcs (Conquest / War / Famine / Death). The
   dominant horseman is emphasized. Reads worldMood.getGlobal
   with a 60s staleTime so it doesn't re-query on every page
   navigation.

   Click the widget to open /world-tapestry for the full view.
   ═══════════════════════════════════════════════════════ */
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type Horseman = "conquest" | "war" | "famine" | "death";

const HORSEMAN_LABEL: Record<Horseman, string> = {
  conquest: "Conquest",
  war: "War",
  famine: "Famine",
  death: "Death",
};

const HORSEMAN_COLOR: Record<Horseman, string> = {
  conquest: "#fde68a", // pale gold — white-horse / crown
  war: "#ef4444",      // red-horse / sword
  famine: "#1f2937",   // black-horse / scales
  death: "#9ca3af",    // pale-horse / ash
};

function clampPct(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v * 100)));
}

export default function WorldMoodWidget() {
  const { data: mood } = trpc.worldMood.getGlobal.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const dominant = mood?.dominantAxis ?? "conquest";
  const axes: Horseman[] = ["conquest", "war", "famine", "death"];

  return (
    <Link href="/world-tapestry">
      <a
        className="group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 transition-colors"
        title={`Dominant horseman: ${HORSEMAN_LABEL[dominant]}`}
        data-testid="world-mood-widget"
      >
        <div className="flex items-end gap-0.5 h-5">
          {axes.map((axis) => {
            const value = mood ? (mood as Record<Horseman, number>)[axis] : 0;
            const pct = clampPct(value);
            const isDominant = axis === dominant;
            return (
              <div
                key={axis}
                className="relative w-1.5 rounded-sm"
                style={{
                  height: `${Math.max(4, pct / 5)}px`,
                  backgroundColor: HORSEMAN_COLOR[axis],
                  opacity: isDominant ? 1 : 0.6,
                  outline: isDominant ? "1px solid rgba(255,255,255,0.4)" : "none",
                }}
                data-axis={axis}
                data-pct={pct}
              />
            );
          })}
        </div>
        <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors hidden sm:inline">
          {HORSEMAN_LABEL[dominant]}
        </span>
      </a>
    </Link>
  );
}
