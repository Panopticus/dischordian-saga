/* ═══════════════════════════════════════════════════════
   MEMORABLE MOMENTS STORE (Zustand) — §11.2 Antiquarian feed.

   Ring buffer of the player's most recent memorable moments.
   Used by `getDynamicLionFrames` when playing "The Lion in
   Black" (§11.2) — the Antiquarian curates the feed from
   these records.

   Capped at MAX_MOMENTS entries to bound memory. Persisted
   to localStorage so the feed survives page reloads.
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import {
  makeMemorableMoment,
  type MemorableMoment,
  type MemorableMomentKind,
} from "@shared/memorableMoments";

const STORAGE_KEY = "loredex-memorable-moments";
const MAX_MOMENTS = 50;

interface MemorableMomentsStore {
  moments: MemorableMoment[];
  /**
   * Record a new moment. Keeps the buffer capped at
   * MAX_MOMENTS. Fire-and-forget localStorage write.
   */
  record: (
    kind: MemorableMomentKind,
    subtitle: string,
    imageUrl?: string,
    metadata?: Record<string, unknown>,
  ) => void;
  /** Reset the buffer. Used by tests and "New Game". */
  reset: () => void;
}

function loadFromStorage(): MemorableMoment[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_MOMENTS);
  } catch {
    return [];
  }
}

function writeToStorage(moments: MemorableMoment[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
  } catch {
    /* quota exceeded or disabled — best-effort only */
  }
}

export const useMemorableMomentsStore = create<MemorableMomentsStore>((set) => ({
  moments: loadFromStorage(),

  record: (kind, subtitle, imageUrl, metadata) => {
    const moment = makeMemorableMoment(kind, subtitle, imageUrl, metadata);
    set((state) => {
      // Prepend newest moment, truncate to MAX_MOMENTS.
      const next = [moment, ...state.moments].slice(0, MAX_MOMENTS);
      writeToStorage(next);
      return { moments: next };
    });
  },

  reset: () => {
    writeToStorage([]);
    set({ moments: [] });
  },
}));

/* ─── SELECTORS ─── */

export const selectMoments = (s: MemorableMomentsStore) => s.moments;
export const selectMostRecentMoment = (s: MemorableMomentsStore) =>
  s.moments[0] ?? null;

/* ─── PLAIN-FUNCTION HELPERS ─── */

/**
 * Record a moment from non-React code. Equivalent to:
 *   useMemorableMomentsStore.getState().record(kind, subtitle, ...)
 */
export function recordMemorableMoment(
  kind: MemorableMomentKind,
  subtitle: string,
  imageUrl?: string,
  metadata?: Record<string, unknown>,
): void {
  useMemorableMomentsStore
    .getState()
    .record(kind, subtitle, imageUrl, metadata);
}

/** Get a snapshot of current moments from non-React code. */
export function getMemorableMoments(): ReadonlyArray<MemorableMoment> {
  return useMemorableMomentsStore.getState().moments;
}
