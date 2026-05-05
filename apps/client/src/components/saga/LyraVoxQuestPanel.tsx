/* ═══════════════════════════════════════════════════════
   LYRA VOX QUEST PANEL

   Item 11 UI: shows the player's current step in the
   investigation arc with the available prompts as buttons.
   Picks advance the step; on the inscription step, the panel
   surfaces the canonical Antiquarian inscription that's
   been written to the Tome.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";

import { trpc } from "@/lib/trpc";

interface StepDef {
  id: string;
  title: string;
  description: string;
  prompts: ReadonlyArray<{ id: string; label: string; body: string }>;
  earliestAct: number;
}

export function LyraVoxQuestPanel() {
  const status = trpc.lyraVoxQuest.getStatus.useQuery(undefined, {
    staleTime: 30_000,
  });
  const stepsQuery = trpc.lyraVoxQuest.listSteps.useQuery(undefined, {
    staleTime: 60_000,
  });
  const pick = trpc.lyraVoxQuest.pickPrompt.useMutation();
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentStepId = status.data?.currentStep ?? "file";
  const currentStep = (stepsQuery.data ?? []).find(
    (s: StepDef) => s.id === currentStepId,
  );

  const onPick = useCallback(
    async (promptId: string) => {
      if (!currentStep) return;
      setFeedback(null);
      const result = await pick.mutateAsync({
        stepId: currentStep.id as never,
        promptId,
      });
      if (result.ok) {
        setFeedback(
          result.inscription
            ? "Verdict issued. The Antiquarian is inscribing the canonical record."
            : `Step advanced to: ${result.newStep}`,
        );
      } else {
        setFeedback(`Refused: ${result.reason}`);
      }
      void status.refetch();
    },
    [pick, status, currentStep],
  );

  if (status.isLoading || stepsQuery.isLoading) {
    return (
      <div className="rounded-md border border-stone-700 bg-stone-900/60 p-4 text-sm text-stone-400">
        Loading the file…
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="rounded-md border border-stone-700 bg-stone-900/60 p-4 text-sm text-stone-400">
        No step data available.
      </div>
    );
  }

  const completed = status.data?.completed ?? false;

  return (
    <div className="rounded-md border border-stone-700 bg-stone-900/60 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-wide text-stone-100">
          Dr. Lyra Vox — Investigation
        </h2>
        <span className="text-xs uppercase tracking-wider text-stone-500">
          Step: {currentStep.title}
        </span>
      </div>

      <p className="mb-4 text-xs italic text-stone-400">
        Five steps. Each picks a different fragment of the truth. The verdict
        you reach at step four is what the Antiquarian inscribes about her in
        this cycle's record.
      </p>

      {feedback ? (
        <div className="mb-3 rounded border border-amber-700/40 bg-amber-950/30 p-2 text-xs text-amber-200">
          {feedback}
        </div>
      ) : null}

      <div className="rounded border border-stone-800 bg-stone-950/40 p-3">
        <div className="mb-2 text-sm font-medium text-stone-100">
          {currentStep.title}
        </div>
        <p className="mb-3 whitespace-pre-wrap text-sm text-stone-300">
          {currentStep.description}
        </p>

        {completed ? (
          <p className="text-xs italic text-emerald-400">
            Investigation complete. The Tome carries the canonical record.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {currentStep.prompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => onPick(prompt.id)}
                className="rounded-md border border-stone-700 bg-stone-900/60 p-3 text-left transition hover:bg-white/5"
              >
                <div className="text-sm font-medium text-stone-100">
                  {prompt.label}
                </div>
                <div className="mt-1 text-xs text-stone-400">{prompt.body}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {status.data ? (
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider text-stone-500">
          <div>
            Theory: <span className="text-stone-300">{status.data.theoryChosen ?? "—"}</span>
          </div>
          <div>
            Door: <span className="text-stone-300">{status.data.doorOpened ?? "—"}</span>
          </div>
          <div>
            Witness: <span className="text-stone-300">{status.data.witnessBelieved ?? "—"}</span>
          </div>
          <div>
            Verdict: <span className="text-stone-300">{status.data.verdict ?? "—"}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
