/* ═══════════════════════════════════════════════════════
   useVexCommissions

   Watches the player's army-recruitment counter and, when it
   advances, calls the engagement.vexCommissions.recordMissionCount
   mutation on the server. Surfaces any newly-issued commissions
   through an FIFO queue so the page can pop the Vex Solène modal
   one beat at a time.

   The hook is idempotent across mounts and React strict-mode
   double-fires: the server tracks `vexLastMissionCount` and only
   emits commissions for milestones the player has not yet
   crossed.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import type { CodaCommission } from "@shared/vexSoleneCommissions";

export interface UseVexCommissionsResult {
  /** All commissions the player has ever received (cumulative). */
  receipts: ReadonlyArray<{ milestone: number; receivedAt: number }>;
  /** The next un-dismissed commission to display, or null. */
  current: CodaCommission | null;
  /** Pop the front of the queue. */
  dismiss: () => void;
  /** True while the recordMissionCount mutation is in flight. */
  syncing: boolean;
}

export function useVexCommissions(
  missionCount: number,
  opts: { enabled?: boolean } = {},
): UseVexCommissionsResult {
  const enabled = opts.enabled ?? true;

  const listQuery = trpc.engagement.vexCommissions.list.useQuery(undefined, { enabled });

  const [queue, setQueue] = useState<CodaCommission[]>([]);
  /**
   * The last missionCount we sent to the server. We avoid firing the
   * mutation on every render — only when the count strictly advances
   * past what we have on the server.
   */
  const lastSyncedRef = useRef<number | null>(null);

  const recordMutation = trpc.engagement.vexCommissions.recordMissionCount.useMutation({
    onSuccess: (data) => {
      if (data.newCommissions && data.newCommissions.length > 0) {
        setQueue(prev => [...prev, ...data.newCommissions]);
      }
    },
  });

  // Initial sync: once the server's lastMissionCount is known, mark it
  // as the baseline so we don't refire commissions the player has
  // already seen on a prior visit.
  useEffect(() => {
    if (!enabled) return;
    if (lastSyncedRef.current !== null) return;
    if (listQuery.data) {
      lastSyncedRef.current = listQuery.data.lastMissionCount;
    }
  }, [enabled, listQuery.data]);

  // Forward sync: when the local counter advances past the last
  // synced value, call the mutation. Idempotent on the server.
  useEffect(() => {
    if (!enabled) return;
    const last = lastSyncedRef.current;
    if (last === null) return; // wait for initial sync first
    if (missionCount <= last) return;
    lastSyncedRef.current = missionCount;
    recordMutation.mutate({ missionCount });
    // recordMutation.mutate is stable; the linter wants it in the
    // deps but including it would refire when its identity changes
    // each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, missionCount]);

  const dismiss = useCallback(() => {
    setQueue(prev => (prev.length === 0 ? prev : prev.slice(1)));
  }, []);

  const current = queue.length > 0 ? queue[0] : null;
  const receipts = useMemo(() => listQuery.data?.receipts ?? [], [listQuery.data]);

  return {
    receipts,
    current,
    dismiss,
    syncing: recordMutation.isPending,
  };
}
