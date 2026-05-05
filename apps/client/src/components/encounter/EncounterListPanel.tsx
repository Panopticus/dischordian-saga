/* ═══════════════════════════════════════════════════════
   ENCOUNTER LIST PANEL

   Status widget listing the five encounters with their current
   phase, branch (if chosen), completed flag, and a "Begin" /
   "Continue" / "Replay" button. Driving the EncounterPlayer
   modal.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";

import { trpc } from "@/lib/trpc";

import { EncounterPlayer, type EncounterId } from "./EncounterPlayer";

const ENCOUNTER_DISPLAY: Record<EncounterId, { name: string; tagline: string }> = {
  master_of_rlyeh: { name: "Master of R'lyeh", tagline: "Dream-substrate audit" },
  pale_emissary: { name: "Pale Emissary", tagline: "Hierarchy contract" },
  reckoning_daughter: { name: "Reckoning Daughter", tagline: "Auditor of the Damned" },
  malkia_revolution: { name: "Malkia Ukweli", tagline: "Revolution questline" },
  source_kael: { name: "The Source / Kael", tagline: "Philosophical encounter" },
};

export function EncounterListPanel() {
  const status = trpc.encounter.getStatus.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
  const openMutation = trpc.encounter.open.useMutation();

  const [activeEncounter, setActiveEncounter] = useState<EncounterId | null>(null);

  const onBegin = useCallback(
    async (encounterId: EncounterId) => {
      await openMutation.mutateAsync({ encounterId });
      setActiveEncounter(encounterId);
      void status.refetch();
    },
    [openMutation, status],
  );

  if (status.isLoading) {
    return (
      <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4 text-sm text-zinc-400">
        Loading encounters…
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold tracking-wide text-zinc-100">
            Encounters
          </h2>
          <span className="text-xs uppercase tracking-wider text-zinc-500">
            Hierarchy · Malkia · Source
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {(status.data ?? []).map((cand) => {
            const display = ENCOUNTER_DISPLAY[cand.encounterId as EncounterId];
            return (
              <li
                key={cand.encounterId}
                className={`rounded-md border ${cand.completed ? "border-emerald-700/50 bg-emerald-950/30" : "border-zinc-700 bg-zinc-900/40"} p-3`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-zinc-100">
                        {display.name}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-zinc-500">
                        {display.tagline}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-400">
                      {cand.completed
                        ? `Resolved · ${cand.branchChosen ?? "no branch recorded"}`
                        : cand.notStarted
                          ? `Available from Act ${cand.minAct}.`
                          : `Phase: ${cand.phase}${cand.step ? ` · step ${cand.step}/6` : ""}${cand.branchChosen ? ` · ${cand.branchChosen}` : ""}`}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {cand.notStarted ? (
                      <button
                        type="button"
                        className="rounded-md border border-zinc-600 px-3 py-1 text-xs text-zinc-100 transition hover:bg-white/5"
                        onClick={() => onBegin(cand.encounterId as EncounterId)}
                      >
                        Begin
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rounded-md border border-zinc-600 px-3 py-1 text-xs text-zinc-100 transition hover:bg-white/5"
                        onClick={() => setActiveEncounter(cand.encounterId as EncounterId)}
                      >
                        {cand.completed ? "Replay" : "Continue"}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {activeEncounter ? (
        <EncounterPlayer
          encounterId={activeEncounter}
          onClose={() => {
            setActiveEncounter(null);
            void status.refetch();
          }}
        />
      ) : null}
    </>
  );
}
