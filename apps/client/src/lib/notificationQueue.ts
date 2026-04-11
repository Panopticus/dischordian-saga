/* ═══════════════════════════════════════════════════════
   NOTIFICATION PRIORITY QUEUE — Centralized notification
   manager that prevents toast stacking and spam.

   Priority levels control display order, interruption
   behavior, and duration. Maximum 2 visible at once.
   Uses Zustand for reactive state management.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { toast } from "sonner";

// ── Priority levels ──────────────────────────────────

export enum NotificationPriority {
  LOW = 0,       // daily tips, ambient notifications
  MEDIUM = 1,    // quest completions, loot drops
  HIGH = 2,      // achievements, level ups, story reveals
  CRITICAL = 3,  // errors, game-breaking issues
}

// ── Duration per priority (ms) ───────────────────────

const PRIORITY_DURATION: Record<NotificationPriority, number> = {
  [NotificationPriority.LOW]: 3000,
  [NotificationPriority.MEDIUM]: 4000,
  [NotificationPriority.HIGH]: 5000,
  [NotificationPriority.CRITICAL]: 8000,
};

// ── Cooldown between same-type notifications (ms) ────

const TYPE_COOLDOWN_MS = 2000;

// ── Max visible notifications ────────────────────────

const MAX_VISIBLE = 2;

// ── Types ────────────────────────────────────────────

export interface QueuedNotification {
  /** Unique ID — auto-generated if omitted */
  id?: string;
  /** Notification type key for cooldown grouping (e.g. "achievement", "loot-drop") */
  type: string;
  /** Toast title / main text */
  title: string;
  /** Optional description text */
  message?: string;
  /** Priority level — defaults to MEDIUM */
  priority?: NotificationPriority;
  /** Override default duration (ms) */
  duration?: number;
  /** Sonner toast icon */
  icon?: string;
  /** Sonner variant: "default" | "success" | "error" | "info" | "warning" */
  variant?: "default" | "success" | "error" | "info" | "warning";
  /** Extra CSS class forwarded to Sonner */
  className?: string;
  /** Custom JSX description (passed to Sonner's `description`) */
  description?: string;
}

interface ActiveNotification extends Required<Pick<QueuedNotification, "id" | "type" | "priority">> {
  notification: QueuedNotification;
  /** Timeout handle for auto-dismiss */
  timerId: ReturnType<typeof setTimeout>;
}

interface NotificationQueueState {
  /** Currently visible notifications */
  active: ActiveNotification[];
  /** Waiting notifications, sorted by priority (highest first) */
  queue: QueuedNotification[];
  /** Timestamps of last notification shown per type, for cooldown */
  lastShownByType: Record<string, number>;

  // Actions
  enqueue: (notification: QueuedNotification) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

// ── Helpers ──────────────────────────────────────────

let idCounter = 0;
function generateId(): string {
  return `nq-${Date.now()}-${++idCounter}`;
}

function effectivePriority(n: QueuedNotification): NotificationPriority {
  return n.priority ?? NotificationPriority.MEDIUM;
}

function effectiveDuration(n: QueuedNotification): number {
  return n.duration ?? PRIORITY_DURATION[effectivePriority(n)];
}

// ── Show a notification via Sonner ───────────────────

function showViaSonner(n: QueuedNotification): void {
  const id = n.id!;
  const variant = n.variant ?? "default";
  const opts = {
    id,
    duration: Infinity, // we manage duration ourselves
    icon: n.icon,
    description: n.description ?? n.message,
    className: n.className,
    onDismiss: () => {
      // User manually dismissed — trigger our dismiss flow
      useNotificationQueueStore.getState().dismiss(id);
    },
  };

  switch (variant) {
    case "success":
      toast.success(n.title, opts);
      break;
    case "error":
      toast.error(n.title, opts);
      break;
    case "info":
      toast.info(n.title, opts);
      break;
    case "warning":
      toast.warning(n.title, opts);
      break;
    default:
      toast(n.title, opts);
  }
}

function dismissViaSonner(id: string): void {
  toast.dismiss(id);
}

// ── The store ────────────────────────────────────────

export const useNotificationQueueStore = create<NotificationQueueState>()((set, get) => {

  /** Internal: schedule auto-dismiss for an active notification */
  function scheduleAutoDismiss(n: QueuedNotification): ReturnType<typeof setTimeout> {
    const duration = effectiveDuration(n);
    return setTimeout(() => {
      get().dismiss(n.id!);
    }, duration);
  }

  /** Internal: try to show queued notifications when there is room */
  function processQueue(): void {
    const state = get();
    let { active, queue } = state;

    // Nothing waiting
    if (queue.length === 0) return;

    // Fill available slots
    while (active.length < MAX_VISIBLE && queue.length > 0) {
      const next = queue[0];
      queue = queue.slice(1);

      const id = next.id!;
      showViaSonner(next);
      const timerId = scheduleAutoDismiss(next);

      active = [
        ...active,
        {
          id,
          type: next.type,
          priority: effectivePriority(next),
          notification: next,
          timerId,
        },
      ];
    }

    set({ active, queue });
  }

  return {
    active: [],
    queue: [],
    lastShownByType: {},

    enqueue(notification: QueuedNotification) {
      const now = Date.now();
      const state = get();
      const id = notification.id ?? generateId();
      const n: QueuedNotification = { ...notification, id };
      const priority = effectivePriority(n);

      // ── Cooldown check: suppress same-type spam ──
      const lastShown = state.lastShownByType[n.type];
      if (lastShown && now - lastShown < TYPE_COOLDOWN_MS) {
        return; // silently drop
      }

      // Record timestamp
      const lastShownByType = { ...state.lastShownByType, [n.type]: now };

      // ── CRITICAL: clear everything else ──
      if (priority === NotificationPriority.CRITICAL) {
        // Dismiss all active
        for (const a of state.active) {
          clearTimeout(a.timerId);
          dismissViaSonner(a.id);
        }

        // Show the critical notification immediately
        showViaSonner(n);
        const timerId = scheduleAutoDismiss(n);

        set({
          active: [{
            id,
            type: n.type,
            priority,
            notification: n,
            timerId,
          }],
          queue: [], // clear the queue too
          lastShownByType,
        });
        return;
      }

      // ── HIGH+: can interrupt LOW notifications ──
      if (priority >= NotificationPriority.HIGH && state.active.length >= MAX_VISIBLE) {
        // Find a LOW notification to replace
        const lowIndex = state.active.findIndex(
          a => a.priority <= NotificationPriority.LOW,
        );

        if (lowIndex !== -1) {
          const replaced = state.active[lowIndex];
          clearTimeout(replaced.timerId);
          dismissViaSonner(replaced.id);

          const newActive = [...state.active];
          showViaSonner(n);
          const timerId = scheduleAutoDismiss(n);
          newActive[lowIndex] = {
            id,
            type: n.type,
            priority,
            notification: n,
            timerId,
          };

          set({ active: newActive, lastShownByType });
          return;
        }
      }

      // ── Room available: show immediately ──
      if (state.active.length < MAX_VISIBLE) {
        showViaSonner(n);
        const timerId = scheduleAutoDismiss(n);

        set({
          active: [
            ...state.active,
            { id, type: n.type, priority, notification: n, timerId },
          ],
          lastShownByType,
        });
        return;
      }

      // ── At capacity: add to queue sorted by priority (highest first) ──
      const newQueue = [...state.queue, n].sort(
        (a, b) => effectivePriority(b) - effectivePriority(a),
      );

      set({ queue: newQueue, lastShownByType });
    },

    dismiss(id: string) {
      const state = get();
      const activeItem = state.active.find(a => a.id === id);
      if (!activeItem) return; // already dismissed or not found

      clearTimeout(activeItem.timerId);
      dismissViaSonner(id);

      const active = state.active.filter(a => a.id !== id);
      set({ active });

      // Dequeue next notification(s) after a brief tick so Sonner can animate out
      setTimeout(() => processQueue(), 150);
    },

    clearAll() {
      const state = get();
      for (const a of state.active) {
        clearTimeout(a.timerId);
        dismissViaSonner(a.id);
      }
      set({ active: [], queue: [], lastShownByType: {} });
    },
  };
});

// ── Convenience export for non-React usage ───────────

export const notificationQueue = {
  enqueue: (n: QueuedNotification) => useNotificationQueueStore.getState().enqueue(n),
  dismiss: (id: string) => useNotificationQueueStore.getState().dismiss(id),
  clearAll: () => useNotificationQueueStore.getState().clearAll(),
};
