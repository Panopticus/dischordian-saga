/* ═══════════════════════════════════════════════════════
   CHOICE PANEL — episode-close choice carry-forward

   Renders the current episode's authored choices as a
   horizontally-arranged button strip. The player picks one;
   the engine persists the choice via mysteries.submitChoice
   (overwrite-on-resubmit semantics, so the player can change
   their mind before the next episode opens).

   Once committed, surfaces a "X will remember that" toast in
   the spirit of Telltale's choice carry-forward UX.

   See docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §3
   (Choice Carry-Forward) and §10.
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface ChoicePanelProps {
  /** Branded mystery + episode id of the case currently in
   *  view. Pass from CasesPage's active-case query. */
  mysteryId: string;
  episodeId: string;
}

export function ChoicePanel({ mysteryId, episodeId }: ChoicePanelProps) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const episode = trpc.mysteries.getEpisode.useQuery(
    { mysteryId, episodeId },
    { enabled: isAuthenticated },
  );

  const [pickedId, setPickedId] = useState<string | null>(null);

  const submit = trpc.mysteries.submitChoice.useMutation({
    onSuccess: () => {
      utils.mysteries.getActiveCase.invalidate();
      utils.mysteries.getRecap.invalidate();
    },
  });

  if (!episode.data) return null;
  if (episode.data.choices.length === 0) return null;

  const handlePick = (choiceId: string, weight: string) => {
    setPickedId(choiceId);
    submit.mutate({ mysteryId, episodeId, choiceId, weight });
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--energy-accent)" }}>
        EPISODE-CLOSE CHOICE
      </p>

      <div className="space-y-2">
        {episode.data.choices.map((choice) => {
          const isPicked = pickedId === choice.id;
          const otherPicked = pickedId !== null && !isPicked;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={submit.isPending}
              onClick={() => handlePick(choice.id, choice.weight)}
              className="w-full text-left font-mono text-[11px] px-3 py-2 rounded-md transition-colors flex items-start gap-3"
              style={{
                background: isPicked
                  ? "color-mix(in oklch, var(--energy-primary) 18%, transparent)"
                  : "rgba(255, 255, 255, 0.03)",
                border: isPicked
                  ? "1px solid color-mix(in oklch, var(--energy-primary) 60%, transparent)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                color: otherPicked ? "rgba(226, 232, 240, 0.4)" : "#e2e8f0",
                cursor: submit.isPending ? "wait" : "pointer",
                opacity: otherPicked ? 0.6 : 1,
              }}
            >
              <span className="flex-1">{choice.label}</span>
              <span
                className="font-mono text-[8px] tracking-[0.25em] uppercase shrink-0 px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "rgba(226, 232, 240, 0.55)",
                }}
              >
                {choice.weight}
              </span>
            </button>
          );
        })}
      </div>

      {submit.data && pickedId && (
        <p className="font-mono text-[10px] tracking-[0.2em] mt-3" style={{ color: "var(--energy-primary)" }}>
          THE SAGA WILL REMEMBER THAT.
        </p>
      )}

      <p className="font-mono text-[9px] mt-3" style={{ color: "rgba(226, 232, 240, 0.4)" }}>
        Choices carry forward across episodes. You can change your selection until the next episode opens.
      </p>
    </div>
  );
}
