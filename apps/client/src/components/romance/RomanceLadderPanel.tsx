/* ═══════════════════════════════════════════════════════
   ROMANCE LADDER PANEL

   Status widget listing the five romance candidates with their
   current stage, trust, and per-candidate "advance" / "commit"
   / "end" actions. Drives the RomanceScenePlayer modal — the
   "Play scene" button on a row whose nextStage is available
   calls trpc.romance.advance.useMutation, which writes the
   stage row, returns the new stage's scene line ids, and we
   open the player on the matching beats.

   Blocked rows show a structured reason — trust gate, missing
   flag, or exclusivity conflict — so the player knows what to
   work on next, not just that they're stuck.

   The panel is a self-contained card. Mount it inside the
   companion ask wheel page or its own route.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";

import {
  ROMANCE_NPC_IDS,
  type RomanceNpcId,
} from "@shared/npcs/romanceScenes";
import { trpc } from "@/lib/trpc";

import { RomanceScenePlayer } from "./RomanceScenePlayer";

const NPC_DISPLAY: Record<RomanceNpcId, { name: string; tagline: string }> = {
  locke: { name: "Adjudicator Locke", tagline: "Trade Nexus" },
  vex: { name: "Vex Solène", tagline: "Coda Bridge" },
  elara: { name: "Elara", tagline: "Comms-relay" },
  dmc_companion: { name: "DMC Companion", tagline: "Awakening Protocol" },
  jericho_jones: { name: "Jericho Jones", tagline: "Heart of Time" },
};

const STAGE_LABEL = ["Unstarted", "Acquaintance", "Mutual Interest", "Committed", "Intimate", "Devoted"] as const;

interface ActiveScene {
  npcId: RomanceNpcId;
  stage: number;
}

export function RomanceLadderPanel() {
  const status = trpc.romance.getStatus.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
  const advanceMutation = trpc.romance.advance.useMutation();
  const commitMutation = trpc.romance.commitExclusivity.useMutation();
  const endMutation = trpc.romance.end.useMutation();

  const [activeScene, setActiveScene] = useState<ActiveScene | null>(null);

  // Build the active flag set from the status response. The
  // server already resolves trust + flags + exclusivity for
  // us; the player itself only needs the public-flag set to
  // filter path-aware scene variants.
  const activeFlags = new Set<string>();
  for (const cand of status.data ?? []) {
    if (cand.exclusive) activeFlags.add(cand.committedFlag);
    if (cand.ended) activeFlags.add(cand.endedFlag);
  }

  const onAdvance = useCallback(
    async (npcId: RomanceNpcId) => {
      const result = await advanceMutation.mutateAsync({ npcId });
      if (result.ok && result.newStage !== null) {
        setActiveScene({ npcId, stage: result.newStage });
      }
      void status.refetch();
    },
    [advanceMutation, status],
  );

  const onCommit = useCallback(
    async (npcId: RomanceNpcId) => {
      await commitMutation.mutateAsync({ npcId });
      void status.refetch();
    },
    [commitMutation, status],
  );

  const onEnd = useCallback(
    async (npcId: RomanceNpcId) => {
      const ok = window.confirm(
        `End the romance with ${NPC_DISPLAY[npcId].name}? This is canon — it cannot be undone within this cycle.`,
      );
      if (!ok) return;
      await endMutation.mutateAsync({ npcId });
      void status.refetch();
    },
    [endMutation, status],
  );

  if (status.isLoading) {
    return (
      <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4 text-sm text-zinc-400">
        Loading bonds…
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-zinc-700 bg-zinc-900/60 p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold tracking-wide text-zinc-100">
            Bonds
          </h2>
          <span className="text-xs uppercase tracking-wider text-zinc-500">
            Five candidates · one exclusive at stage 3+
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {ROMANCE_NPC_IDS.map((npcId) => {
            const cand = (status.data ?? []).find((c) => c.npcId === npcId);
            if (!cand) return null;
            const display = NPC_DISPLAY[npcId];
            return (
              <li
                key={npcId}
                className={`rounded-md border ${cand.ended ? "border-zinc-800 bg-zinc-950/60 text-zinc-500" : cand.exclusive ? "border-emerald-700/60 bg-emerald-950/30" : "border-zinc-700 bg-zinc-900/40"} p-3`}
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
                      {cand.ended
                        ? "Ended."
                        : cand.exclusive
                          ? `Committed · Stage ${cand.stage} · ${STAGE_LABEL[cand.stage]}`
                          : `Stage ${cand.stage} · ${STAGE_LABEL[cand.stage]} · trust ${cand.trust}`}
                    </div>
                    {cand.blockedReason ? (
                      <div className="mt-1 text-xs text-amber-400/80">
                        {formatBlocked(cand.blockedReason as BlockedReason)}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {!cand.ended && cand.nextStage !== null ? (
                      <button
                        type="button"
                        className="rounded-md border border-zinc-600 px-3 py-1 text-xs text-zinc-100 transition hover:bg-white/5"
                        onClick={() => onAdvance(npcId)}
                      >
                        Advance to stage {cand.nextStage}
                      </button>
                    ) : null}
                    {!cand.ended && cand.stage >= 3 && !cand.exclusive ? (
                      <button
                        type="button"
                        className="rounded-md border border-emerald-600/60 px-3 py-1 text-xs text-emerald-100 transition hover:bg-emerald-900/40"
                        onClick={() => onCommit(npcId)}
                      >
                        Commit exclusivity
                      </button>
                    ) : null}
                    {!cand.ended && cand.stage >= 1 ? (
                      <button
                        type="button"
                        className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition hover:text-zinc-200"
                        onClick={() => onEnd(npcId)}
                      >
                        End
                      </button>
                    ) : null}
                    {cand.stage >= 1 ? (
                      <button
                        type="button"
                        className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition hover:text-zinc-200"
                        onClick={() => setActiveScene({ npcId, stage: cand.stage })}
                      >
                        Replay scene
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {activeScene ? (
        <RomanceScenePlayer
          npcId={activeScene.npcId}
          stage={activeScene.stage}
          activeFlags={activeFlags}
          onComplete={() => setActiveScene(null)}
          onClose={() => setActiveScene(null)}
        />
      ) : null}
    </>
  );
}

type BlockedReason =
  | { kind: "max_stage" }
  | { kind: "ended" }
  | { kind: "trust_gate"; required: number; current: number }
  | { kind: "missing_flag"; flag: string }
  | { kind: "exclusive_with_other"; otherNpcId: RomanceNpcId };

function formatBlocked(reason: BlockedReason): string {
  switch (reason.kind) {
    case "trust_gate":
      return `Trust ${reason.current}/${reason.required} required to advance.`;
    case "missing_flag":
      return `Awaiting: ${reason.flag}`;
    case "exclusive_with_other":
      return `Locked by exclusive partner: ${NPC_DISPLAY[reason.otherNpcId].name}.`;
    case "ended":
      return "This romance has ended.";
    case "max_stage":
      return "Maximum stage reached.";
  }
}
