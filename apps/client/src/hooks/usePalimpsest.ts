/* ═══════════════════════════════════════════════════════
   usePalimpsest — shared Palimpsest meter hook

   Single source of truth for reading the per-user Palimpsest
   state on the client. Every component that needs Signal/Noise
   data should use this hook instead of calling
   trpc.palimpsest.get.useQuery directly — that way, heavily
   browsed pages (Home, WatchPage, CharacterTimeline, Hierarchy,
   SongPage + anything else wired to CorruptibleBio) share a
   single in-flight query through React Query's dedupe.

   The default state is returned while loading, so callers never
   have to handle undefined.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  DEFAULT_PALIMPSEST_STATE,
  getPhase,
  shouldHostMaskSlip,
  shouldMarkEntryCorrupted,
  getEntryCorruptionSeverity,
  type PalimpsestState,
} from "@shared/palimpsest";

export interface UsePalimpsestResult {
  state: PalimpsestState;
  phase: ReturnType<typeof getPhase>;
  isMaskSlipping: boolean;
  isLoading: boolean;
  /** Is a specific Loredex entry marked corrupted right now? */
  isEntryCorrupted: (entryId: string) => boolean;
  /** How badly is a specific entry corrupted right now (0..1)? */
  corruptionSeverity: (entryId: string) => number;
  /** Force a refetch — used after recordEpisode-type mutations. */
  refetch: () => void;
}

const STALE_TIME_MS = 30_000; // 30s — the manuscript doesn't change by the second.

/**
 * Read the current user's Palimpsest state. React Query deduplicates
 * concurrent calls to this hook from multiple components within the
 * stale window, so mounting 5 CorruptibleBio instances triggers at
 * most one HTTP request.
 */
export function usePalimpsest(): UsePalimpsestResult {
  const query = trpc.palimpsest.get.useQuery(undefined, {
    staleTime: STALE_TIME_MS,
    retry: false,
  });

  const state = query.data?.state ?? DEFAULT_PALIMPSEST_STATE;
  const { isLoading, refetch } = query;

  return useMemo<UsePalimpsestResult>(() => ({
    state,
    phase: getPhase(state),
    isMaskSlipping: shouldHostMaskSlip(state),
    isLoading,
    isEntryCorrupted: (entryId: string) => shouldMarkEntryCorrupted(entryId, state),
    corruptionSeverity: (entryId: string) => getEntryCorruptionSeverity(entryId, state),
    refetch: () => { refetch(); },
  }), [state, isLoading, refetch]);
}
