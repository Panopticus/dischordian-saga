/**
 * Visit → Loredex Entry Mapping
 *
 * Mirrors `transmissionLoredexUnlocks.ts`: first visit to a canonical
 * space unlocks the corresponding loredex entry via the
 * `room_visited` ripple handler in
 * `apps/server/services/rippleEngine.ts`. Re-uses the existing
 * DiscoveryNotification surface.
 *
 * Source of truth: the 7 vehicles + 60 destination zones bridged by
 * `apps/shared/expansionArt/newArtRoomBridge.ts`. The mapping is
 * derived (canonical id → `loredex_<flattened-id>`) so the registry
 * stays in lockstep with the bridge.
 */

import { NEW_ART_BRIDGED_ROOMS } from "./expansionArt/newArtRoomBridge";

export interface VisitLoredexUnlock {
  /** Canonical room id that, when visited, unlocks the entry. */
  canonicalRoomId: string;
  /** Loredex entity id(s) to unlock. Almost always exactly one. */
  entityIds: readonly string[];
  /** Label surfaced via DiscoveryNotification. */
  discoveryLabel: string;
}

function loredexIdFromCanonical(canonicalRoomId: string): string {
  return `loredex_${canonicalRoomId.replace(/\./g, "_")}`;
}

function buildLabel(canonicalRoomId: string): string {
  if (canonicalRoomId.startsWith("veh.")) {
    return "Vessel logged";
  }
  if (canonicalRoomId.startsWith("dest.")) {
    const [, category] = canonicalRoomId.split(".");
    switch (category) {
      case "castle_of_death": return "Castle of Death — chamber mapped";
      case "crucible":        return "Crucible — arena mapped";
      case "tower_defense":   return "Tower Defense — position mapped";
      case "trade_empire":    return "Trade Empire — sector mapped";
      case "quiz_show":       return "Quiz Show — set piece mapped";
      default:                return "Destination mapped";
    }
  }
  return "Location logged";
}

export const VISIT_LOREDEX_UNLOCKS: readonly VisitLoredexUnlock[] =
  Object.freeze(
    NEW_ART_BRIDGED_ROOMS
      .filter(
        (r) =>
          r.category === "vehicle" || r.category === "destination_subzone",
      )
      .map((r) => ({
        canonicalRoomId: r.canonicalSpaceId,
        entityIds: [loredexIdFromCanonical(r.canonicalSpaceId)],
        discoveryLabel: buildLabel(r.canonicalSpaceId),
      })),
  );

const BY_ROOM: ReadonlyMap<string, VisitLoredexUnlock> = new Map(
  VISIT_LOREDEX_UNLOCKS.map((u) => [u.canonicalRoomId, u] as const),
);

const BY_LOREDEX_ID: ReadonlyMap<string, string> = (() => {
  const out = new Map<string, string>();
  for (const u of VISIT_LOREDEX_UNLOCKS) {
    for (const entityId of u.entityIds) {
      out.set(entityId, u.canonicalRoomId);
    }
  }
  return out;
})();

/** Resolve a visit unlock for the given canonical room id, or undefined. */
export function visitLoredexUnlockFor(
  canonicalRoomId: string,
): VisitLoredexUnlock | undefined {
  return BY_ROOM.get(canonicalRoomId);
}

/**
 * Resolve the canonical room id for a loredex entity id, or undefined.
 * Used by the EntityPage to surface a "Visit" affordance on bridged
 * vehicle / destination entries.
 */
export function canonicalRoomIdFor(
  loredexEntityId: string,
): string | undefined {
  return BY_LOREDEX_ID.get(loredexEntityId);
}
