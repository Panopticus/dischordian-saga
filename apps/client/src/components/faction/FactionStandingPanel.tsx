/* ═══════════════════════════════════════════════════════
   FACTION STANDING PANEL

   Item 6 of the choice-impact follow-up. getFactionStandings
   has existed server-side since #404 but no UI rendered it.
   Five horizontal bars: -100 to +100 with a midpoint at 0,
   shaded into bands (enemy / suspect / neutral / ally /
   champion).
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";

const FACTION_DISPLAY: Record<string, { name: string; tagline: string; accent: string }> = {
  architect_remnants: {
    name: "Architect Remnants",
    tagline: "Sleeping engineers; deep order.",
    accent: "bg-violet-500",
  },
  new_babylon: {
    name: "New Babylon",
    tagline: "Authority bureaucracy; lawful trade.",
    accent: "bg-amber-500",
  },
  hierarchy: {
    name: "The Hierarchy",
    tagline: "Demon-lord petitioners; signed contracts.",
    accent: "bg-zinc-500",
  },
  insurgency: {
    name: "Insurgency",
    tagline: "Iron Lions and the wide refusal.",
    accent: "bg-orange-500",
  },
  dreamers_children: {
    name: "Dreamer's Children",
    tagline: "Voltari pilgrims; held silences.",
    accent: "bg-cyan-500",
  },
};

function bandFor(standing: number): { label: string; tone: string } {
  if (standing >= 75) return { label: "Champion", tone: "text-emerald-300" };
  if (standing >= 25) return { label: "Ally", tone: "text-emerald-200/80" };
  if (standing <= -75) return { label: "Enemy", tone: "text-rose-300" };
  if (standing <= -25) return { label: "Suspect", tone: "text-rose-200/80" };
  return { label: "Neutral", tone: "text-zinc-300" };
}

export function FactionStandingPanel() {
  const standings = trpc.rpg.getFactionStandings.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  if (standings.isLoading) {
    return (
      <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4 text-sm text-zinc-400">
        Loading factions…
      </div>
    );
  }

  const data = (standings.data ?? {}) as Record<string, number>;

  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-wide text-zinc-100">
          Faction Standings
        </h2>
        <span className="text-xs uppercase tracking-wider text-zinc-500">
          −100 enemy · 0 neutral · +100 champion
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {Object.entries(FACTION_DISPLAY).map(([id, def]) => {
          const standing = data[id] ?? 0;
          const band = bandFor(standing);
          // Convert -100..+100 to 0..100% offset for bar position.
          const pct = (standing + 100) / 2;
          return (
            <li key={id} className="rounded border border-zinc-800 bg-zinc-950/40 p-3">
              <div className="mb-1.5 flex items-baseline justify-between">
                <div className="min-w-0">
                  <span className="font-medium text-zinc-100">{def.name}</span>
                  <span className="ml-2 text-xs uppercase tracking-wider text-zinc-500">
                    {def.tagline}
                  </span>
                </div>
                <div className="shrink-0 text-xs">
                  <span className={`font-mono ${band.tone}`}>{standing > 0 ? `+${standing}` : standing}</span>
                  <span className={`ml-2 ${band.tone}`}>{band.label}</span>
                </div>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                {/* Midpoint marker */}
                <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-700" />
                {/* Standing bar */}
                <div
                  className={`absolute top-0 h-full ${def.accent} opacity-70`}
                  style={
                    standing >= 0
                      ? { left: "50%", width: `${pct - 50}%` }
                      : { right: "50%", width: `${50 - pct}%` }
                  }
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
