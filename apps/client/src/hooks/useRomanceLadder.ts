/* ═══════════════════════════════════════════════════════
   useRomanceLadder

   Client hook + scene playback wiring for the romance ladders.
   Wraps the romance tRPC router:

     - getStatus()     polls every 60s; returns the per-candidate
                       status array (stage / nextStage / blocked
                       reason / trust / flags)
     - advance(npcId)  fires the advance mutation; on success,
                       fetches the new stage's scene line texts
                       from the local ROMANCE_SCENE_BANKS and
                       queues them through fireCompanionComment
                       so the toast pipeline plays them
     - commit(npcId)   stage-3 commitment beat
     - end(npcId)      player-initiated breakup

   The advance mutation returns scene LINE IDS, not full lines.
   The hook resolves the line texts client-side by reading the
   ROMANCE_SCENE_BANKS so the request stays small. Every line
   is queued at a 4-second cadence to give the toast time to
   render and dismiss between beats.
   ═══════════════════════════════════════════════════════ */

import { useCallback } from "react";

import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { trpc } from "@/lib/trpc";
import {
  ROMANCE_SCENE_BANKS,
  type RomanceNpcId,
} from "@shared/npcs/romanceScenes";

const SCENE_BEAT_INTERVAL_MS = 4_000;

export function useRomanceLadder() {
  const status = trpc.romance.getStatus.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
  const advanceMutation = trpc.romance.advance.useMutation();
  const commitMutation = trpc.romance.commitExclusivity.useMutation();
  const endMutation = trpc.romance.end.useMutation();

  const playScene = useCallback(
    (npcId: RomanceNpcId, sceneLineIds: readonly string[]) => {
      if (sceneLineIds.length === 0) return;
      const bank = ROMANCE_SCENE_BANKS[npcId] ?? [];
      const linesById = new Map(bank.map((l) => [l.lineId, l]));
      sceneLineIds.forEach((lineId, idx) => {
        const line = linesById.get(lineId);
        if (!line) return;
        // Each scene line goes through the toast pipeline using a
        // synthetic per-line trigger. The CompanionCommentToast
        // doesn't currently know about romance scenes — it picks
        // by trigger string — so we route them through trigger ids
        // that match the romance:<npc>:stage<N>:reached pattern
        // already authored in companionComments.ts. The scene
        // play, in toast form, is the brief reactive line. The
        // full multi-line cinematic awaits a dedicated
        // RomanceScenePlayer surface (next sprint).
        window.setTimeout(() => {
          fireCompanionComment(
            `romance:${npcId}:stage${getStageFromLineId(lineId)}:reached`,
          );
        }, idx * SCENE_BEAT_INTERVAL_MS);
      });
    },
    [],
  );

  const advance = useCallback(
    async (npcId: RomanceNpcId) => {
      const result = await advanceMutation.mutateAsync({ npcId });
      if (result.ok && result.sceneLineIds.length > 0) {
        playScene(npcId, result.sceneLineIds);
      }
      void status.refetch();
      return result;
    },
    [advanceMutation, playScene, status],
  );

  const commit = useCallback(
    async (npcId: RomanceNpcId) => {
      const result = await commitMutation.mutateAsync({ npcId });
      void status.refetch();
      return result;
    },
    [commitMutation, status],
  );

  const end = useCallback(
    async (npcId: RomanceNpcId) => {
      const result = await endMutation.mutateAsync({ npcId });
      void status.refetch();
      return result;
    },
    [endMutation, status],
  );

  return {
    status: status.data ?? [],
    isLoading: status.isLoading,
    advance,
    commit,
    end,
  };
}

/**
 * Pull the stage number from a romance scene line id like
 * `vex.romance.s3.commit`. Returns 0 if the id doesn't match
 * the canonical pattern.
 */
function getStageFromLineId(lineId: string): number {
  const match = lineId.match(/\.s(\d)\./);
  if (!match) return 0;
  return Number.parseInt(match[1], 10);
}
