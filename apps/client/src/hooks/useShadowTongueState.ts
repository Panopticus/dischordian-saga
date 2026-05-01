/* ═══════════════════════════════════════════════════════
   useShadowTongueState — shared ST global-state hook

   Single source of truth for reading shadowTongueState on
   the client (power, activeEdits, grandEditActive). Mirrors
   usePalimpsest's deduplication pattern: every component
   that needs ST state should use this hook instead of
   calling trpc.epochWitness.getShadowTongueState.useQuery
   directly, so heavily-browsed pages share one in-flight
   query through React Query.

   The default state is returned while loading, so callers
   never have to handle undefined.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  type ActiveEdit,
  type ActiveEdits,
  isEditActive as isEditActivePure,
  makeEditId,
  parseActiveEdits,
} from "@shared/shadowTongueEdits";

export interface UseShadowTongueStateResult {
  /** Current power level (0–100). */
  power: number;
  /** Current active-edits map keyed by `<room>_<artifact>`. */
  activeEdits: ActiveEdits;
  /** Has the Grand Edit event been triggered? */
  grandEditActive: boolean;
  /** Last server tick when state was updated, or null when DB row missing. */
  lastUpdated: Date | null;
  isLoading: boolean;
  /** Returns true when an edit with the given id is currently active. */
  isEditActive: (id: string) => boolean;
  /** Convenience: is the (room, artifact) pair currently corrupted? */
  isArtifactEdited: (room: string, artifact: string) => boolean;
  /** Look up an edit's full record by id (may include uncorrupted ones). */
  getEdit: (id: string) => ActiveEdit | undefined;
  /** Force a refetch — call after a successful clearActiveEdit /
   *  recordActiveEdit mutation. */
  refetch: () => void;
}

const DEFAULT_STATE = {
  power: 0,
  activeEdits: {} as ActiveEdits,
  grandEditActive: false,
  lastUpdated: null as Date | null,
};

const STALE_TIME_MS = 15_000; // 15s — ST edits land on player-paced
// hotspot interactions, so a tighter stale window keeps the crossout
// overlay in sync without thrashing the network.

/**
 * Read the current global Shadow Tongue state. React Query deduplicates
 * concurrent calls within the stale window, so mounting 5 CorruptibleBio
 * instances triggers at most one HTTP request.
 *
 * The tRPC procedure (apps/server/routers/epochWitness.ts) returns
 * activeEdits already serialised through parseActiveEdits, so the
 * client receives a typed ActiveEdits map. We re-run parseActiveEdits
 * defensively in case the wire shape ever drifts.
 */
export function useShadowTongueState(): UseShadowTongueStateResult {
  const query = trpc.epochWitness.getShadowTongueState.useQuery(undefined, {
    staleTime: STALE_TIME_MS,
    retry: false,
  });

  const data = query.data;
  const activeEdits = useMemo<ActiveEdits>(
    () => parseActiveEdits(data?.activeEdits ?? null),
    [data?.activeEdits],
  );

  const power = data?.power ?? DEFAULT_STATE.power;
  const grandEditActive = data?.grandEditActive ?? DEFAULT_STATE.grandEditActive;
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated as unknown as string)
    : DEFAULT_STATE.lastUpdated;
  const { isLoading, refetch } = query;

  return useMemo<UseShadowTongueStateResult>(
    () => ({
      power,
      activeEdits,
      grandEditActive,
      lastUpdated,
      isLoading,
      isEditActive: (id: string) => isEditActivePure(activeEdits, id),
      isArtifactEdited: (room: string, artifact: string) =>
        isEditActivePure(activeEdits, makeEditId(room, artifact)),
      getEdit: (id: string) => activeEdits[id],
      refetch: () => {
        refetch();
      },
    }),
    [power, activeEdits, grandEditActive, lastUpdated, isLoading, refetch],
  );
}
