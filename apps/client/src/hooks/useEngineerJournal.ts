/* ═══════════════════════════════════════════════════════
   useEngineerJournal

   Wraps the engagement.engineerJournal.* tRPC procedures into
   a single hook the Mechronis Academy page can call from its
   lesson resolution flow. When the player earns a Distinction
   grade, the page calls onDistinction() and a journal page is
   recovered server-side; the result is queued FIFO for modal
   surfacing.

   The mutation is server-authoritative — already-recovered
   pages won't refire on a strict-mode mount.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useState } from "react";
import { trpc } from "@/lib/trpc";
import type { JournalPage } from "@shared/engineerShadowCurriculum";

export interface JournalRecoveryEvent {
  page: JournalPage;
  /** If set, the recovery also completed this chapter and unlocked
   *  its signature technique; the modal can call out the unlock. */
  chapterUnlocked: number | null;
}

export interface UseEngineerJournalResult {
  /** The next un-dismissed recovery event, or null. */
  current: JournalRecoveryEvent | null;
  /** Pop the front of the queue. */
  dismiss: () => void;
  /** Call this when the player earns a Distinction grade in any
   *  Mechronis lesson. No-op if the journal is already complete. */
  onDistinction: () => void;
  /** True while the recover-page mutation is in flight. */
  recovering: boolean;
}

export function useEngineerJournal(opts: { enabled?: boolean } = {}): UseEngineerJournalResult {
  const enabled = opts.enabled ?? true;
  const [queue, setQueue] = useState<JournalRecoveryEvent[]>([]);

  const utils = trpc.useUtils();

  const recoverMutation = trpc.engagement.engineerJournal.recoverPage.useMutation({
    onSuccess: (data) => {
      if (data.recovered && data.page) {
        setQueue(prev => [
          ...prev,
          { page: data.page, chapterUnlocked: data.chapterUnlocked },
        ]);
        // Refresh derived state if any consumer is reading it via
        // engineerJournal.progress.
        void utils.engagement.engineerJournal.progress.invalidate();
        if (data.chapterUnlocked !== null) {
          void utils.engagement.engineerJournal.equipped.invalidate();
        }
      }
    },
  });

  const onDistinction = useCallback(() => {
    if (!enabled) return;
    recoverMutation.mutate();
    // recoverMutation identity changes per render; intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const dismiss = useCallback(() => {
    setQueue(prev => (prev.length === 0 ? prev : prev.slice(1)));
  }, []);

  return {
    current: queue.length > 0 ? queue[0] : null,
    dismiss,
    onDistinction,
    recovering: recoverMutation.isPending,
  };
}
