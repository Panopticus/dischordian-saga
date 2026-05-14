import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, Skull } from "lucide-react";
import { NEMESIS_PAIR_BANKS } from "@shared/npcs/banks/nemesis/_index";
import type { DialogNode, DialogTree } from "@shared/dialogTree";

/* ═══════════════════════════════════════════════════════
   NEMESIS ENCOUNTER MODAL — Phase K Wave 6

   Polls `nemesis.getPendingNemesisEncounter` on the
   current surface. When a pending encounter exists,
   opens a Mass-Effect-style dialog modal that walks the
   pair-bank's DialogTree for the matching scene + grudge
   band.

   On reaching a terminal node (no choices), or when the
   player closes the modal, calls
   `markNemesisEncounterRendered` with the last `sets:`
   flag the player chose.

   Surface gating: the modal only opens if the encounter
   matches the surface the player is currently on (or is
   a "world"-source encounter, which fires anywhere).
   ═══════════════════════════════════════════════════════ */

type GrudgeBand = "low" | "mid" | "high";

interface NemesisEncounterModalProps {
  /** Which surface the player is on — used to gate which
   *  encounters fire here. */
  surface: "trade-empire" | "casino" | "hub" | "apprentice" | "world";
}

const FACTION_LABEL: Record<string, string> = {
  hierarchy: "the Hierarchy",
  insurgency: "the Insurgency",
  new_babylon: "New Babylon",
  architect_remnants: "the Architect Remnants",
  dreamers_children: "the Dreamer's Children",
};

const SCENE_LABEL: Record<string, string> = {
  first_sighting: "First Sighting",
  sabotage_caught_in_act: "Caught in the Act",
  mocking_interlude: "Interlude",
  lieutenant_promotion: "Promotion",
  cohort_end_confrontation: "Cohort's End",
  accumulation_reveal: "The Roster Widens",
  name_reveal_moment: "The Name",
  final_encounter: "Final Encounter",
};

export function NemesisEncounterModal({ surface }: NemesisEncounterModalProps) {
  const utils = trpc.useUtils();
  const pendingQuery = trpc.nemesis.getPendingNemesisEncounter.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      staleTime: 30_000,
    },
  );
  const markRendered = trpc.nemesis.markNemesisEncounterRendered.useMutation({
    onSuccess: () => utils.nemesis.getPendingNemesisEncounter.invalidate(),
  });

  // The dialog walker's current node id. Reset when the
  // pending encounter changes.
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [lastChoiceFlag, setLastChoiceFlag] = useState<string | null>(null);

  const pending = pendingQuery.data;

  // Gate: only render if the pending encounter is for
  // this surface (or is "world"-sourced).
  const shouldRender = useMemo(() => {
    if (!pending) return false;
    if (pending.surface === "world") return true;
    return pending.surface === surface;
  }, [pending, surface]);

  // Resolve the DialogTree for the pending encounter
  const tree = useMemo<DialogTree | null>(() => {
    if (!pending) return null;
    const bank = NEMESIS_PAIR_BANKS.find((p) => p.pairId === pending.pairId);
    if (!bank) return null;
    const scene = bank.scenes[pending.sceneId as keyof typeof bank.scenes];
    if (!scene) return null;
    return scene.variants[pending.grudgeBand as GrudgeBand] ?? null;
  }, [pending]);

  // Initialize the walker to the tree's entry node when
  // a new tree arrives.
  useEffect(() => {
    if (!tree) {
      setCurrentNodeId(null);
      setLastChoiceFlag(null);
      return;
    }
    setCurrentNodeId(tree.entryNodeId ?? "root");
    setLastChoiceFlag(null);
  }, [tree]);

  if (!shouldRender || !pending || !tree || !currentNodeId) return null;

  const node: DialogNode | undefined = tree.nodes[currentNodeId];
  if (!node) return null;

  const isTerminal = !node.choices || node.choices.length === 0;
  const nemesisDisplay =
    pending.nemesisProperName ?? `The ${pending.nemesisArchetypeTitle}-Nemesis`;
  const factionLabel = FACTION_LABEL[pending.alignedFaction ?? "hierarchy"];

  const onChoice = (nextId: string, setsFlag: string | undefined) => {
    if (setsFlag) setLastChoiceFlag(setsFlag);
    setCurrentNodeId(nextId);
  };

  const onClose = () => {
    markRendered.mutate({
      memoryId: pending.memoryId,
      choiceFlag: lastChoiceFlag,
    });
    setCurrentNodeId(null);
  };

  // Render the speaker label according to the speaker key
  const speakerLabel =
    node.speaker === "nemesis"
      ? nemesisDisplay
      : node.speaker === "apprentice"
        ? "Your Apprentice"
        : node.speaker === "elara"
          ? "Elara"
          : "You";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative mx-4 mb-4 w-full max-w-2xl rounded-lg border border-amber-900/40 bg-zinc-950/95 shadow-2xl sm:mb-0">
        {/* Header: Nemesis identity + faction + scene context */}
        <div className="flex items-start gap-3 border-b border-amber-900/30 px-5 py-3">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-950/40">
            <Skull className="size-5 text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-amber-200">{nemesisDisplay}</div>
            <div className="text-xs text-zinc-500">
              {SCENE_LABEL[pending.sceneId] ?? pending.sceneId} ·{" "}
              {pending.grudgeBand} grudge · serving {factionLabel}
            </div>
          </div>
          {isTerminal && (
            <button
              onClick={onClose}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              aria-label="Close encounter"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Body: speaker line */}
        <div className="px-5 py-4">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            {speakerLabel}
          </div>
          <div className="text-sm leading-relaxed text-zinc-100">
            {node.onscreenText}
          </div>
        </div>

        {/* Footer: choices or "Continue" terminal button */}
        <div className="border-t border-amber-900/30 px-5 py-3">
          {isTerminal ? (
            <button
              onClick={onClose}
              className="w-full rounded border border-amber-700/40 bg-amber-950/30 px-4 py-2 text-sm font-medium text-amber-100 hover:bg-amber-950/50"
            >
              Continue
            </button>
          ) : (
            <div className="space-y-2">
              {(node.choices ?? []).map((choice) => (
                <button
                  key={choice.nextId}
                  onClick={() => onChoice(choice.nextId, choice.sets)}
                  className="block w-full rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-left text-sm text-zinc-200 hover:border-amber-700/40 hover:bg-amber-950/20 hover:text-amber-100"
                >
                  &gt; {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
