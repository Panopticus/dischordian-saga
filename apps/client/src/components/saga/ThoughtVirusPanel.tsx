/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS PANEL

   Item 9 UI: a row per sector showing infection level + band,
   with each containment action as a button. Disabled buttons
   for cooldowns; click sends apply mutation.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";

import { trpc } from "@/lib/trpc";
import { VIRUS_SECTORS } from "@shared/thoughtVirusSpread";

const BAND_COLOUR: Record<string, string> = {
  clean: "bg-emerald-600",
  subclinical: "bg-yellow-600",
  active: "bg-orange-600",
  critical: "bg-rose-600",
  saturated: "bg-rose-800",
};

const BAND_TEXT: Record<string, string> = {
  clean: "text-emerald-300",
  subclinical: "text-yellow-300",
  active: "text-orange-300",
  critical: "text-rose-300",
  saturated: "text-rose-200",
};

export function ThoughtVirusPanel() {
  const status = trpc.thoughtVirusSpread.getSectorStatus.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
  const apply = trpc.thoughtVirusSpread.applyContainment.useMutation();
  const [feedback, setFeedback] = useState<string | null>(null);

  const onAction = useCallback(
    async (sectorId: string, actionId: string) => {
      setFeedback(null);
      const result = await apply.mutateAsync({
        sectorId: sectorId as never,
        actionId,
      });
      if (!result.ok) {
        setFeedback(`Action declined: ${result.reason}`);
      } else {
        setFeedback(
          `Containment applied. New level: ${result.newLevel}` +
            (result.flagSet ? ` · flag set: ${result.flagSet}` : ""),
        );
      }
      void status.refetch();
    },
    [apply, status],
  );

  if (status.isLoading) {
    return (
      <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4 text-sm text-zinc-400">
        Loading sector readings…
      </div>
    );
  }

  const rows = status.data ?? [];
  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-wide text-zinc-100">
          Thought Virus — Sector Audit
        </h2>
        <span className="text-xs uppercase tracking-wider text-zinc-500">
          5 sectors · 4 containments each
        </span>
      </div>

      <p className="mb-4 text-xs italic text-zinc-400">
        The Hierarchy's slow corruption. Each sector grows daily until you
        contain it. Choices have costs.
      </p>

      {feedback ? (
        <div className="mb-3 rounded border border-amber-700/40 bg-amber-950/30 p-2 text-xs text-amber-200">
          {feedback}
        </div>
      ) : null}

      <ul className="flex flex-col gap-3">
        {rows.map((sector) => {
          const def = VIRUS_SECTORS.find((s) => s.id === sector.sectorId)!;
          return (
            <li
              key={sector.sectorId}
              className="rounded border border-zinc-800 bg-zinc-950/40 p-3"
            >
              <div className="mb-1.5 flex items-baseline justify-between">
                <div className="min-w-0">
                  <span className="font-medium text-zinc-100">
                    {sector.name}
                  </span>
                  <span className={`ml-2 text-xs uppercase tracking-wider ${BAND_TEXT[sector.band]}`}>
                    {sector.band}
                  </span>
                </div>
                <span className={`font-mono text-xs ${BAND_TEXT[sector.band]}`}>
                  {sector.level}/100
                </span>
              </div>
              <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full ${BAND_COLOUR[sector.band]} opacity-80`}
                  style={{ width: `${sector.level}%` }}
                />
              </div>
              <p className="mb-3 text-xs italic text-zinc-400">{sector.description}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {def.actions.map((action) => {
                  const available = sector.actionAvailability[action.id];
                  return (
                    <button
                      key={action.id}
                      type="button"
                      disabled={!available}
                      onClick={() => onAction(sector.sectorId, action.id)}
                      className={`rounded-md border p-2 text-left text-xs transition ${
                        available
                          ? "border-zinc-700 bg-zinc-900/60 text-zinc-100 hover:bg-white/5"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-600"
                      }`}
                    >
                      <div className="font-medium">{action.label}</div>
                      <div className="mt-1 text-[10px] text-zinc-400">
                        {action.description}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider">
                        <span className={action.infectionDelta < 0 ? "text-emerald-400" : action.infectionDelta > 0 ? "text-rose-400" : "text-zinc-500"}>
                          {action.infectionDelta > 0 ? "+" : ""}{action.infectionDelta}
                        </span>
                        {action.dreamCost ? (
                          <span className="text-cyan-400">{action.dreamCost} Dream</span>
                        ) : null}
                        {!available ? <span className="text-zinc-500">cooldown</span> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
