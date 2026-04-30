/* ═══════════════════════════════════════════════════════
   useLockeLedger

   Wraps engagement.lockeLedger.* tRPC procedures into a hook
   the Trade Empire page mounts under its Locke panel. The
   hook reads the player's current Locke trust band +
   reputation (passed in from the caller, since Locke trust
   lives in the trade-empire subsystem) and exposes:

     • catalog       — every contract Locke ever offers
     • completedIds  — contracts the player has signed
     • available     — contracts currently signable
     • sign(entryId) — execute a contract
     • lastPayout    — the cross-system payout from the most
                       recent successful sign (caller is
                       responsible for routing it to the
                       receiving subsystem)

   Server-authoritative dedup — re-signing a completed
   contract returns success: false with reason "already_completed".
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";
import { trpc } from "@/lib/trpc";
import type {
  LedgerEntry,
  LedgerPayout,
  LockeTrustBand,
} from "@shared/lockeConfidentialLedger";

export interface SignResult {
  success: boolean;
  /** When success: true, the cross-system payout the receiving
   *  subsystem should apply. */
  payout: LedgerPayout | null;
  /** Locke's verbatim transaction-close line. */
  closeLine: string | null;
  /** When success: false, the eligibility/error code. */
  reason: string | null;
}

export interface UseLockeLedgerInput {
  band: LockeTrustBand;
  reputation: number;
  enabled?: boolean;
}

export interface UseLockeLedgerResult {
  catalog: ReadonlyArray<LedgerEntry>;
  completedIds: ReadonlyArray<string>;
  available: ReadonlyArray<LedgerEntry>;
  sign: (entryId: string) => void;
  signing: boolean;
  /** Result of the most recent sign attempt (queued FIFO). */
  current: { entry: LedgerEntry; result: SignResult } | null;
  dismiss: () => void;
}

export function useLockeLedger(input: UseLockeLedgerInput): UseLockeLedgerResult {
  const enabled = input.enabled ?? true;
  const utils = trpc.useUtils();
  const [queue, setQueue] = useState<{ entry: LedgerEntry; result: SignResult }[]>([]);

  const catalogQuery = trpc.engagement.lockeLedger.catalog.useQuery(undefined, { enabled });
  const stateQuery = trpc.engagement.lockeLedger.state.useQuery(undefined, { enabled });
  const availabilityQuery = trpc.engagement.lockeLedger.checkAvailability.useQuery(
    { band: input.band, reputation: input.reputation },
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

  const sign = useCallback((entryId: string) => {
    if (!enabled) return;
    signMutation.mutate({ entryId, band: input.band, reputation: input.reputation });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, input.band, input.reputation]);

  const dismiss = useCallback(() => {
    setQueue(prev => (prev.length === 0 ? prev : prev.slice(1)));
  }, []);

  return {
    catalog: catalogQuery.data ?? [],
    completedIds: stateQuery.data?.completedEntryIds ?? [],
    available: availabilityQuery.data ?? [],
    sign,
    signing: signMutation.isPending,
    current: queue.length > 0 ? queue[0] : null,
    dismiss,
  };
}

/** Derive Locke's trust band from a numeric reputation reading.
 *  Stand-in until the trade-empire subsystem ships dedicated
 *  per-broker reputation. Thresholds chosen so a mid-game player
 *  reaches Counterparty and a late-game player reaches Partner.
 */
export function deriveLockeBand(reputation: number): LockeTrustBand {
  if (reputation >= 500) return "Partner";
  if (reputation >= 100) return "Counterparty";
  return "Stranger";
}
