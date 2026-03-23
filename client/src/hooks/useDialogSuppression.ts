/**
 * DIALOG SUPPRESSION HOOK
 * Used by popup components (AchievementToast, DiscoveryNotification, QuestRewardSystem)
 * to suppress display while a dialog is active and queue items for later.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { isDialogActive } from "@/lib/dialogState";

/**
 * Returns { suppressed, queueItem, flushQueue }
 * - suppressed: true when a dialog is active
 * - queueItem: add an item to the pending queue
 * - flushQueue: returns all queued items (called when dialog closes)
 */
export function useDialogSuppression<T>() {
  const [suppressed, setSuppressed] = useState(() => isDialogActive());
  const queueRef = useRef<T[]>([]);
  const [flushTrigger, setFlushTrigger] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.active) {
        setSuppressed(true);
      } else {
        setSuppressed(false);
        // Trigger a flush cycle
        setFlushTrigger(prev => prev + 1);
      }
    };
    window.addEventListener("dialog-state-change", handler);
    return () => window.removeEventListener("dialog-state-change", handler);
  }, []);

  const queueItem = useCallback((item: T) => {
    queueRef.current.push(item);
  }, []);

  const flushQueue = useCallback((): T[] => {
    const items = [...queueRef.current];
    queueRef.current = [];
    return items;
  }, []);

  return { suppressed, queueItem, flushQueue, flushTrigger };
}
