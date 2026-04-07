/* ═══════════════════════════════════════════════════════
   useNotificationQueue — React hook wrapping the
   notification priority queue store.

   Provides typed helpers for common notification types
   so callers don't need to import priority enums or
   construct notification objects manually.
   ═══════════════════════════════════════════════════════ */

import { useCallback } from "react";
import {
  useNotificationQueueStore,
  NotificationPriority,
  type QueuedNotification,
} from "@/lib/notificationQueue";

export function useNotificationQueue() {
  const { enqueue, dismiss, clearAll, active, queue } =
    useNotificationQueueStore();

  // ── Generic notify helper ──────────────────────────

  const notify = useCallback(
    (
      type: string,
      title: string,
      message?: string,
      priority?: NotificationPriority,
      options?: Partial<QueuedNotification>,
    ) => {
      enqueue({
        type,
        title,
        message,
        priority,
        ...options,
      });
    },
    [enqueue],
  );

  // ── Pre-configured notification helpers ────────────

  /** Achievement unlocked — HIGH priority */
  const notifyAchievement = useCallback(
    (title: string, description: string) => {
      enqueue({
        type: "achievement",
        title: `Achievement: ${title}`,
        message: description,
        priority: NotificationPriority.HIGH,
        icon: "🏆",
        variant: "success",
      });
    },
    [enqueue],
  );

  /** Level up — HIGH priority */
  const notifyLevelUp = useCallback(
    (level: number) => {
      enqueue({
        type: "level-up",
        title: `Level Up! You reached level ${level}`,
        message: "New abilities and content may be available.",
        priority: NotificationPriority.HIGH,
        icon: "⬆️",
        variant: "success",
      });
    },
    [enqueue],
  );

  /** Quest complete — MEDIUM priority */
  const notifyQuestComplete = useCallback(
    (questName: string, rewards?: string) => {
      enqueue({
        type: "quest-complete",
        title: `Quest Complete: ${questName}`,
        message: rewards ? `Rewards: ${rewards}` : "Check your inventory for rewards.",
        priority: NotificationPriority.MEDIUM,
        icon: "✅",
        variant: "success",
      });
    },
    [enqueue],
  );

  /** Loot drop — MEDIUM normally, HIGH if epic+ rarity */
  const notifyLootDrop = useCallback(
    (itemName: string, rarity: string) => {
      const isEpicPlus = ["epic", "legendary", "mythic", "divine"].includes(
        rarity.toLowerCase(),
      );
      enqueue({
        type: "loot-drop",
        title: `${rarity} Drop: ${itemName}`,
        message: isEpicPlus
          ? "An extraordinary item has been found!"
          : "New item added to your inventory.",
        priority: isEpicPlus
          ? NotificationPriority.HIGH
          : NotificationPriority.MEDIUM,
        icon: isEpicPlus ? "💎" : "🎁",
        variant: isEpicPlus ? "success" : "default",
      });
    },
    [enqueue],
  );

  /** Story reveal — HIGH priority */
  const notifyStoryReveal = useCallback(
    (text: string) => {
      enqueue({
        type: "story-reveal",
        title: "Story Update",
        message: text,
        priority: NotificationPriority.HIGH,
        icon: "📖",
      });
    },
    [enqueue],
  );

  /** Error — CRITICAL priority */
  const notifyError = useCallback(
    (message: string) => {
      enqueue({
        type: "error",
        title: "Error",
        message,
        priority: NotificationPriority.CRITICAL,
        variant: "error",
      });
    },
    [enqueue],
  );

  /** Tip / ambient — LOW priority */
  const notifyTip = useCallback(
    (message: string) => {
      enqueue({
        type: "tip",
        title: "Tip",
        message,
        priority: NotificationPriority.LOW,
        icon: "💡",
      });
    },
    [enqueue],
  );

  return {
    // State
    active,
    queue,

    // Generic
    notify,
    dismiss,
    clearAll,

    // Typed helpers
    notifyAchievement,
    notifyLevelUp,
    notifyQuestComplete,
    notifyLootDrop,
    notifyStoryReveal,
    notifyError,
    notifyTip,
  };
}

// Re-export priority enum for convenience
export { NotificationPriority } from "@/lib/notificationQueue";
