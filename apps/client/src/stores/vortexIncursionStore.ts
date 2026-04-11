/* ═══════════════════════════════════════════════════════
   VORTEX INCURSION STORE (Zustand)

   Tracks the player's current Vortex Incursion run and
   their lifetime Vortex stats. Persists to localStorage
   so an in-progress run survives page reloads.

   One run at a time. Starting a new run when one is in
   progress replaces it (deliberate — the Vortex doesn't
   let you pause it mid-room).
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import type { IncursionRun } from "@shared/incursions";
import {
  clearVortexRoom,
  countVortexRoomsCleared,
  getVortexLightReward,
  isVortexRunComplete,
  spawnVortexRun,
} from "@shared/vortexIncursionRun";

const STORAGE_KEY = "loredex-vortex-incursion";

export interface VortexStats {
  /** Total completed runs. */
  runsCompleted: number;
  /** Total rooms cleared across all runs. */
  roomsCleared: number;
  /** Total Vortex Cores reached (final room completed). */
  coresReached: number;
  /** Last completed run's total light energy contribution. */
  lastRunLightEnergy: number;
}

export interface VortexSnapshot {
  activeRun: IncursionRun | null;
  stats: VortexStats;
}

interface VortexStore extends VortexSnapshot {
  /** Spawn a new Vortex run, abandoning any in-progress one. */
  startRun: (playerId: string, coopPartnerId?: string) => IncursionRun;
  /** Mark the current room as cleared with the given elapsed time. */
  clearCurrentRoom: (elapsedMs: number) => void;
  /** Abandon the in-progress run without rewards. */
  abandonRun: () => void;
  /** Reset all Vortex state (used by New Game + tests). */
  reset: () => void;
}

const DEFAULT_STATS: VortexStats = {
  runsCompleted: 0,
  roomsCleared: 0,
  coresReached: 0,
  lastRunLightEnergy: 0,
};

const DEFAULT_SNAPSHOT: VortexSnapshot = {
  activeRun: null,
  stats: DEFAULT_STATS,
};

function loadFromStorage(): VortexSnapshot {
  if (typeof localStorage === "undefined") return DEFAULT_SNAPSHOT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    const parsed = JSON.parse(raw) as Partial<VortexSnapshot>;
    return {
      activeRun: parsed.activeRun ?? null,
      stats: { ...DEFAULT_STATS, ...(parsed.stats ?? {}) },
    };
  } catch {
    return DEFAULT_SNAPSHOT;
  }
}

function writeToStorage(snapshot: VortexSnapshot): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota exceeded — best-effort only */
  }
}

export const useVortexIncursionStore = create<VortexStore>((set, get) => ({
  ...loadFromStorage(),

  startRun: (playerId, coopPartnerId) => {
    const run = spawnVortexRun({
      runId: `vortex_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      playerA: playerId,
      playerB: coopPartnerId ?? `${playerId}_solo`,
      nowMs: Date.now(),
    });
    const next: VortexSnapshot = {
      activeRun: run,
      stats: get().stats,
    };
    writeToStorage(next);
    set(next);
    return run;
  },

  clearCurrentRoom: (elapsedMs) => {
    const { activeRun, stats } = get();
    if (!activeRun) return;
    const updated = clearVortexRoom(
      activeRun,
      activeRun.currentRoomIndex,
      elapsedMs,
    );
    const justCompleted = !isVortexRunComplete(activeRun) && isVortexRunComplete(updated);
    const justReachedCore =
      updated.rooms[9]?.cleared === true && activeRun.rooms[9]?.cleared !== true;

    const nextStats: VortexStats = {
      runsCompleted: stats.runsCompleted + (justCompleted ? 1 : 0),
      roomsCleared: stats.roomsCleared + 1,
      coresReached: stats.coresReached + (justReachedCore ? 1 : 0),
      lastRunLightEnergy: justCompleted
        ? getVortexLightReward(updated)
        : stats.lastRunLightEnergy,
    };
    const next: VortexSnapshot = { activeRun: updated, stats: nextStats };
    writeToStorage(next);
    set(next);
  },

  abandonRun: () => {
    const next: VortexSnapshot = {
      activeRun: null,
      stats: get().stats,
    };
    writeToStorage(next);
    set(next);
  },

  reset: () => {
    writeToStorage(DEFAULT_SNAPSHOT);
    set(DEFAULT_SNAPSHOT);
  },
}));

/* ─── SELECTORS ─── */

export const selectActiveVortexRun = (s: VortexStore) => s.activeRun;
export const selectVortexStats = (s: VortexStore) => s.stats;

/* ─── PLAIN-FUNCTION HELPERS ─── */

/** Get the current snapshot without subscribing. */
export function getVortexSnapshot(): VortexSnapshot {
  return useVortexIncursionStore.getState();
}

/** Count rooms cleared in the active run, or 0 if no run. */
export function getActiveVortexProgress(): number {
  const run = useVortexIncursionStore.getState().activeRun;
  return run ? countVortexRoomsCleared(run) : 0;
}
