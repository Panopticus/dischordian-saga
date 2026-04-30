/* ═══════════════════════════════════════════════════════
   useLockeLedger

   Wraps engagement.lockeLedger.* tRPC procedures into a hook
   the Trade Empire page mounts under its Locke panel.

   Server-authoritative: the server reads Locke's trust from
   the canonical npc_trust table, derives the band, and gates
   contract eligibility on its side. The client no longer
   passes band / reputation. Pending cross-system payouts are
   accumulated server-side and claimed via `claim(kind, amount)`.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";
import { trpc } from "@/lib/trpc";
import type {
  LedgerEntry,
  LedgerPayout,
  LedgerPayoutKind,
  LockeTrustBand,
} from "@shared/lockeConfidentialLedger";
import type { PendingPayouts } from "@shared/engagementPersistence";

export interface SignResult {
  success: boolean;
  payout: LedgerPayout | null;
  closeLine: string | null;
  reason: string | null;
}

export interface UseLockeLedgerResult {
  /** Locke's current band, resolved server-side from npc_trust. */
  band: LockeTrustBand;
  /** Locke's current 0-100 trust score. */
  trust: number;
  catalog: ReadonlyArray<LedgerEntry>;
  completedIds: ReadonlyArray<string>;
  available: ReadonlyArray<LedgerEntry>;
  /** Cross-system payouts the server has credited but the player
   *  has not yet claimed. */
  pendingPayouts: PendingPayouts;
  /** Sign a contract; result is queued FIFO under `current`. */
  sign: (entryId: string) => void;
  signing: boolean;
  /** Pop the front of the sign-result queue. */
  current: { entry: LedgerEntry; result: SignResult } | null;
  dismiss: () => void;
  /** Claim an amount of pending payout for a given kind. Returns
   *  the actual amount the server claimed (clamped at the
   *  accumulator's current balance). */
  claim: (kind: LedgerPayoutKind, amount: number) => Promise<number>;
  claiming: boolean;
}

export function useLockeLedger(opts: { enabled?: boolean } = {}): UseLockeLedgerResult {
  const enabled = opts.enabled ?? true;
  const utils = trpc.useUtils();
  const [queue, setQueue] = useState<{ entry: LedgerEntry; result: SignResult }[]>([]);

  const catalogQuery = trpc.engagement.lockeLedger.catalog.useQuery(undefined, { enabled });
  const stateQuery = trpc.engagement.lockeLedger.state.useQuery(undefined, { enabled });
  const availabilityQuery = trpc.engagement.lockeLedger.checkAvailability.useQuery(
    undefined,
    { enabled },
  );

  const signMutation = trpc.engagement.lockeLedger.sign.useMutation({
    onSuccess: (data, variables) => {
      const entry = (catalogQuery.data ?? []).find(e => e.id === variables.entryId);
      if (!entry) return;
      const result: SignResult = data.success
        ? {
            success: true,
            payout: data.payout,
            closeLine: data.closeLine,
            reason: null,
          }
        : {
            success: false,
            payout: null,
            closeLine: null,
            reason: data.reason,
          };
      setQueue(prev => [...prev, { entry, result }]);
      void utils.engagement.lockeLedger.state.invalidate();
      void utils.engagement.lockeLedger.checkAvailability.invalidate();
    },
  });

  const claimMutation = trpc.engagement.lockeLedger.claim.useMutation({
    onSuccess: () => {
      void utils.engagement.lockeLedger.state.invalidate();
    },
  });

  const sign = useCallback((entryId: string) => {
    if (!enabled) return;
    signMutation.mutate({ entryId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const dismiss = useCallback(() => {
    setQueue(prev => (prev.length === 0 ? prev : prev.slice(1)));
  }, []);

  const claim = useCallback(
    async (kind: LedgerPayoutKind, amount: number) => {
      if (!enabled) return 0;
      try {
        const result = await claimMutation.mutateAsync({ kind, amount });
        return result.claimed;
      } catch {
        return 0;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [enabled],
  );

  const stateData = stateQuery.data;

  return {
    band: stateData?.band ?? "Prospect",
    trust: stateData?.trust ?? 0,
    catalog: catalogQuery.data ?? [],
    completedIds: stateData?.completedEntryIds ?? [],
    available: availabilityQuery.data ?? [],
    pendingPayouts:
      stateData?.pendingPayouts ?? {
        crew_xp: 0,
        army_recruitment: 0,
        celebration_bond: 0,
        mechronis_approval: 0,
        trade_reputation: 0,
      },
    sign,
    signing: signMutation.isPending,
    current: queue.length > 0 ? queue[0] : null,
    dismiss,
    claim,
    claiming: claimMutation.isPending,
  };
}
