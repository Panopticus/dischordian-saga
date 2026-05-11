/**
 * useVisitTier — React hook bridging `hotspotVisitTiers.ts` schema
 * into the runtime (Phase H.J).
 *
 * The schema + helpers (`getVisitTier`, `getVisitResponse`) were
 * authored in audit/16 PR 15 but never threaded into the room-
 * mystery response resolver. H.J wires this for `ArkExplorerPage`
 * adoption — when the player examines a hotspot, the hook computes
 * the visit count from `RoomState.hotspotClickCount` (or equivalent)
 * and returns the matching tier's responseId / textOverride.
 *
 * Usage:
 *   const tier = useVisitTier(roomId, hotspotId, gameState);
 *   const response = tier?.responseId ?? hotspot.defaultResponseId;
 *
 * The hook is stateless; consumers can swap in any `visitCount`
 * source so this hook is portable across save formats.
 */

import { useMemo } from "react";

import {
  getVisitTier,
  type HotspotVisitTier,
  type HotspotWithTiers,
} from "../../../shared/hotspotVisitTiers";

export interface VisitCountSource {
  /** Returns the number of times the player has examined this hotspot. */
  getCount(roomId: string, hotspotId: string): number;
}

/**
 * Resolve the visit-tier for a hotspot given the game's count source.
 *
 * @param roomId       Room canonical id (e.g. "ark.bridge").
 * @param hotspotId    Hotspot id within the room.
 * @param hotspot      The hotspot definition (with optional `tiers`).
 * @param counts       Visit-count source (typically backed by
 *                     GameState.rooms[roomId].hotspotClickCount[hotspotId]).
 * @returns            The matching tier, or null if none qualify.
 */
export function useVisitTier(
  roomId: string,
  hotspotId: string,
  hotspot: HotspotWithTiers,
  counts: VisitCountSource,
): HotspotVisitTier | null {
  return useMemo(() => {
    const count = counts.getCount(roomId, hotspotId);
    return getVisitTier(count, hotspot);
  }, [roomId, hotspotId, hotspot, counts]);
}
