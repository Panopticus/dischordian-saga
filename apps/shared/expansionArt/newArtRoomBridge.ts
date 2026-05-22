/**
 * NEW_ART_{1,2} → room-runtime bridge.
 *
 * The 2026-05-12 producer drop (`newArtInventory.data.ts`) shipped
 * baseline art for the 7 vehicles + 60 destination zones + 8
 * destination panoramas that `roomArtManifest.data.ts` still treats
 * as deferred. The runtime resolver (`compositeResolver.ts`) and the
 * baseline lookup (`roomArtBaselineUrl`) only consult the older
 * manifest, so the producer art was on the CDN but invisible to the
 * client.
 *
 * This bridge derives `canonicalSpaceId → CDN url` from
 * `NEW_ART_ASSETS` so `roomArtBaselineUrl()` can fall through to it
 * on miss. Mapping is by file-path convention:
 *
 *   art/vehicles/<slug>/exterior.png           → veh.<slug>
 *   art/destinations/<category>/<slug>.png     → dest.<category>.<slug>
 *   art/destinations/<root_slug>_panorama.png  → dest.panorama.<root_slug>
 *
 * The mapping is one-way and idempotent — re-running the producer
 * inventory generator picks up new entries without touching this file.
 */

import { assetUrl } from "@shared/lib/assetUrl";
import { NEW_ART_ASSETS, type NewArtAsset } from "./newArtInventory.data";

/** Subcategory the bridge resolves. */
export type BridgedRoomCategory =
  | "vehicle"
  | "destination_subzone"
  | "destination_panorama";

/** One bridged room — canonical space id + the producer asset. */
export interface NewArtBridgedRoom {
  readonly canonicalSpaceId: string;
  readonly category: BridgedRoomCategory;
  readonly asset: NewArtAsset;
}

const VEHICLE_PATH_RE = /^art\/vehicles\/([a-z0-9_]+)\/exterior\.png$/;
const DEST_SUBZONE_PATH_RE =
  /^art\/destinations\/([a-z0-9_]+)\/([a-z0-9_]+)\.png$/;
const DEST_PANORAMA_PATH_RE =
  /^art\/destinations\/destination_([a-z0-9_]+)_panorama\.png$/;

function deriveBridgedRoom(asset: NewArtAsset): NewArtBridgedRoom | null {
  if (asset.topCategory === "vehicles") {
    const m = VEHICLE_PATH_RE.exec(asset.relPath);
    if (m) {
      return {
        canonicalSpaceId: `veh.${m[1]}`,
        category: "vehicle",
        asset,
      };
    }
    return null;
  }
  if (asset.topCategory === "destinations") {
    const pano = DEST_PANORAMA_PATH_RE.exec(asset.relPath);
    if (pano) {
      return {
        canonicalSpaceId: `dest.panorama.${pano[1]}`,
        category: "destination_panorama",
        asset,
      };
    }
    const sub = DEST_SUBZONE_PATH_RE.exec(asset.relPath);
    if (sub) {
      return {
        canonicalSpaceId: `dest.${sub[1]}.${sub[2]}`,
        category: "destination_subzone",
        asset,
      };
    }
    return null;
  }
  return null;
}

const ENTRIES: readonly NewArtBridgedRoom[] = Object.freeze(
  NEW_ART_ASSETS.map(deriveBridgedRoom).filter(
    (e): e is NewArtBridgedRoom => e !== null,
  ),
);

const BY_CANONICAL: ReadonlyMap<string, NewArtBridgedRoom> = new Map(
  ENTRIES.map((e) => [e.canonicalSpaceId, e] as const),
);

/** All bridged rooms (frozen). */
export const NEW_ART_BRIDGED_ROOMS: readonly NewArtBridgedRoom[] = ENTRIES;

/** O(1) canonical-space-id → bridged room. */
export const NEW_ART_BRIDGED_ROOMS_BY_ID: ReadonlyMap<
  string,
  NewArtBridgedRoom
> = BY_CANONICAL;

/**
 * Resolve a canonical space id (e.g. "veh.cades_apc",
 * "dest.castle_of_death.cod01_entrance_hall") to its baseline CDN URL.
 *
 * Returns `undefined` when the id isn't a bridged room. Callers
 * should not rely on this for ark/hellbox rooms — those resolve
 * through the primary `roomArtManifest`.
 */
export function newArtRoomBaselineUrl(
  canonicalSpaceId: string,
): string | undefined {
  const e = BY_CANONICAL.get(canonicalSpaceId);
  return e ? assetUrl(e.asset.relPath) : undefined;
}

/** Filter bridged rooms by subcategory. */
export function newArtBridgedRoomsByCategory(
  category: BridgedRoomCategory,
): readonly NewArtBridgedRoom[] {
  return ENTRIES.filter((e) => e.category === category);
}
