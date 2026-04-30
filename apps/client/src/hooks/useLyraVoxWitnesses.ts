/* ═══════════════════════════════════════════════════════
   useLyraVoxWitnesses

   Watches the crew state and, when a bloodline advances, calls
   engagement.bloodlineWitnesses.scan on the server for each
   bloodline that may have crossed a milestone. New witness
   reports are queued FIFO so the page can pop the Lyra Vox
   substrate-witness modal one beat at a time.

   The scan is server-authoritative — it dedupes against
   already-filed witnesses, so a re-mount or a rebroadcast of
   the same bloodline state will not refire reports.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import type { WitnessReport } from "@shared/lyraVoxBloodlineWitness";
import type { CrewState, BloodlineId } from "@shared/crewPersistence";

export interface UseLyraVoxWitnessesResult {
  /** All witnesses the player has filed (cumulative; from server). */
  filed: ReadonlyArray<WitnessReport>;
  /** The next un-dismissed witness to display, or null. */
  current: WitnessReport | null;
  /** Pop the front of the queue. */
  dismiss: () => void;
  /** True while any scan mutation is in flight. */
  syncing: boolean;
}

/** Snapshot a bloodline's signature so we only re-scan when it
 *  actually changes (generation, drift, member count, deceased
 *  count, founder presence). Stable string so React's
 *  shallow-compare is happy. */
function bloodlineSignature(
  cs: CrewState,
  bloodlineId: BloodlineId,
): string {
  const bl = cs.bloodlines[bloodlineId];
  if (!bl) return "";
  const memberCount = cs.roster.members.filter(m => m.bloodlineId === bloodlineId).length;
  const deceasedCount = cs.roster.deceased.filter(m => m.bloodlineId === bloodlineId).length;
  const founderDead = cs.roster.deceased.some(
    m => m.bloodlineId === bloodlineId && m.isFounder === true,
  );
  return [
    bloodlineId,
    bl.generationCount,
    bl.geneticDrift,
    memberCount,
    deceasedCount,
    founderDead ? 1 : 0,
  ].join(":");
}

export function useLyraVoxWitnesses(
  crewState: CrewState | null | undefined,
  opts: { enabled?: boolean } = {},
): UseLyraVoxWitnessesResult {
  const enabled = opts.enabled ?? true;

  const listQuery = trpc.engagement.bloodlineWitnesses.list.useQuery(undefined, {
    enabled,
  });

  const [queue, setQueue] = useState<WitnessReport[]>([]);

  /** Last bloodline-signature we sent, per bloodline. Avoids
   *  re-scanning when nothing has structurally changed. */
  const sigRef = useRef<Record<string, string>>({});

  const scanMutation = trpc.engagement.bloodlineWitnesses.scan.useMutation({
    onSuccess: (data) => {
      if (data.newReports.length > 0) {
        setQueue(prev => [...prev, ...data.newReports]);
      }
    },
  });

  // For each known bloodline, if its signature has changed since we
  // last saw it, scan the server. The mutation is idempotent
  // (server-side dedup against already-filed witnesses) so an
  // accidental double-fire does no harm.
  useEffect(() => {
    if (!enabled) return;
    if (!crewState) return;
    // Wait for the initial list query to settle so we don't churn
    // the mutation before the server has loaded the existing filed
    // set. (The server still dedupes; this just avoids needless work.)
    if (listQuery.isLoading) return;

    const bloodlineIds = Object.keys(crewState.bloodlines) as BloodlineId[];
    for (const id of bloodlineIds) {
      const sig = bloodlineSignature(crewState, id);
      if (!sig) continue;
      if (sigRef.current[id] === sig) continue;
      sigRef.current[id] = sig;

      const bl = crewState.bloodlines[id]!;
      const members = crewState.roster.members
        .filter(m => m.bloodlineId === id)
        .map(m => ({
          bloodlineId: m.bloodlineId,
          isFounder: m.isFounder,
          stats: m.stats,
        }));
      const deceased = crewState.roster.deceased
        .filter(m => m.bloodlineId === id)
        .map(m => ({ bloodlineId: m.bloodlineId, isFounder: m.isFounder }));

      scanMutation.mutate({
        bloodline: {
          id: bl.id,
          generationCount: bl.generationCount,
          geneticDrift: bl.geneticDrift,
        },
        members,
        deceased,
      });
    }
    // scanMutation identity changes per render; intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, crewState, listQuery.isLoading]);

  const dismiss = useCallback(() => {
    setQueue(prev => (prev.length === 0 ? prev : prev.slice(1)));
  }, []);

  const current = queue.length > 0 ? queue[0] : null;
  const filed = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  return {
    filed,
    current,
    dismiss,
    syncing: scanMutation.isPending,
  };
}
