/* ═══════════════════════════════════════════════════════
   DISCHORDIA METER PANEL

   Item 7 of the choice-impact follow-up. The dischordia cycle
   service has tracked light/dark/vortex energy server-side
   since the original implementation; the post-run inscription
   service writes it to the Tome. But there was no live meter
   for the player to *see* — the only feedback was after the
   cycle closed.

   This panel reads the current state via
   trpc.dischordiaCycle.getState and renders three horizontal
   bars: light (cyan), dark (violet), vortex proximity
   (rose). Plus the current phase + cycle number.
   ═══════════════════════════════════════════════════════ */

import { trpc } from "@/lib/trpc";

const PHASE_DISPLAY: Record<string, { name: string; mood: string; tone: string }> = {
  dawn: { name: "Dawn", mood: "The galaxy is waking.", tone: "text-cyan-300" },
  dimming: { name: "Dimming", mood: "Light receding by degrees.", tone: "text-amber-300" },
  long_night: { name: "Long Night", mood: "The dark holds.", tone: "text-violet-300" },
  vortex_advance: { name: "Vortex Advance", mood: "The Vortex is paying attention.", tone: "text-rose-400" },
  reclamation: { name: "Reclamation", mood: "A sector remembers itself.", tone: "text-emerald-300" },
};

export function DischordiaMeterPanel() {
  const state = trpc.dischordiaCycle.getState.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  if (state.isLoading || !state.data) {
    return (
      <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4 text-sm text-zinc-400">
        Loading the cycle…
      </div>
    );
  }

  const cycle = state.data;
  const phase = PHASE_DISPLAY[cycle.phase] ?? {
    name: cycle.phase,
    mood: "",
    tone: "text-zinc-300",
  };

  const lightPct = clampPct(cycle.lightEnergy, 1000);
  const darkPct = clampPct(cycle.darkEnergy, 1000);
  const vortexPct = clampPct(cycle.vortexProximity, 100);

  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-wide text-zinc-100">
          Dischordia Cycle
        </h2>
        <span className="text-xs uppercase tracking-wider text-zinc-500">
          Cycle {cycle.cycleNumber}
        </span>
      </div>

      <div className="mb-4">
        <div className={`text-sm font-medium ${phase.tone}`}>
          Current phase: {phase.name}
        </div>
        {phase.mood ? (
          <div className="text-xs italic text-zinc-400">{phase.mood}</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <Meter
          label="Light energy"
          value={cycle.lightEnergy}
          fillClass="bg-cyan-500"
          pct={lightPct}
        />
        <Meter
          label="Dark energy"
          value={cycle.darkEnergy}
          fillClass="bg-violet-500"
          pct={darkPct}
        />
        <Meter
          label="Vortex proximity"
          value={cycle.vortexProximity}
          fillClass="bg-rose-500"
          pct={vortexPct}
          danger
        />
      </div>

      <div className="mt-4 text-xs text-zinc-500">
        Energy balance:{" "}
        <span className="font-mono text-zinc-300">{cycle.energyBalance}</span>
      </div>
    </div>
  );
}

interface MeterProps {
  label: string;
  value: number;
  pct: number;
  fillClass: string;
  danger?: boolean;
}

function Meter({ label, value, pct, fillClass, danger }: MeterProps) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-medium text-zinc-300">{label}</span>
        <span className={`font-mono ${danger && pct > 70 ? "text-rose-400" : "text-zinc-400"}`}>
          {value}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full ${fillClass} opacity-80 transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function clampPct(value: number, scale: number): number {
  if (scale <= 0) return 0;
  const pct = (value / scale) * 100;
  return Math.max(0, Math.min(100, pct));
}
