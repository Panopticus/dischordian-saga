/* ═══════════════════════════════════════════════════════
   SYNC STATUS STORE (Zustand) — Task 3.1

   Tracks cross-device save sync state. Extracted out of
   GameContext because:

   1. Sync status flips every ~5 seconds on save (debounced).
   2. Previously those state changes re-rendered the ENTIRE
      77-consumer GameContext tree even though only one page
      (SettingsPage) actually needed the value.
   3. The store is a drop-in replacement with selector-level
      subscriptions, so only components that read the exact
      slice re-render.

   Use:
     const status = useSyncStatusStore(s => s.status);
     const lastAt = useSyncStatusStore(s => s.lastSyncedAt);

   Mutate:
     useSyncStatusStore.getState().setStatus("saving");

   This is the first Task 3.1 extraction. See stores/README.md
   for the migration pattern and candidate list.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";

export type SyncStatus = "idle" | "saving" | "loading" | "synced" | "error";

interface SyncStatusStore {
  /** Current sync state of the game save pipeline. */
  status: SyncStatus;
  /** ISO timestamp of the most recent successful save. Null until first save. */
  lastSyncedAt: string | null;
  /** Optional error message captured on the last failure (not persisted). */
  lastError: string | null;

  // Actions
  setStatus: (status: SyncStatus) => void;
  markSynced: (at?: string) => void;
  markError: (message?: string) => void;
  reset: () => void;
}

const INITIAL_STATE: Pick<SyncStatusStore, "status" | "lastSyncedAt" | "lastError"> = {
  status: "idle",
  lastSyncedAt: null,
  lastError: null,
};

export const useSyncStatusStore = create<SyncStatusStore>((set) => ({
  ...INITIAL_STATE,

  setStatus: (status) => set({ status }),

  markSynced: (at) => set({
    status: "synced",
    lastSyncedAt: at ?? new Date().toISOString(),
    lastError: null,
  }),

  markError: (message) => set({
    status: "error",
    lastError: message ?? null,
  }),

  reset: () => set(INITIAL_STATE),
}));

/* ─── SELECTORS (use to avoid unnecessary re-renders) ─── */

export const selectStatus = (s: SyncStatusStore) => s.status;
export const selectLastSyncedAt = (s: SyncStatusStore) => s.lastSyncedAt;
export const selectLastError = (s: SyncStatusStore) => s.lastError;
export const selectIsSaving = (s: SyncStatusStore) => s.status === "saving";
export const selectIsSynced = (s: SyncStatusStore) => s.status === "synced";
