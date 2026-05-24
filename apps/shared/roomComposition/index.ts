/* ═══════════════════════════════════════════════════════
   ROOM COMPOSITION — public facade

   Single entry point for room composite rendering. Returns
   null for rooms not covered, letting the caller fall back
   through the existing Phase H + Phase F render cascade.
   ═══════════════════════════════════════════════════════ */

import { resolveBridgeComposite, BRIDGE_BASE_IDS, BRIDGE_SPRITE_IDS } from "./bridgeComposite";
import { resolveCryoBayComposite, CRYO_BAY_BASE_IDS, CRYO_BAY_SPRITE_IDS } from "./cryoBayComposite";
import { resolveMedicalBayComposite, MEDICAL_BAY_BASE_IDS, MEDICAL_BAY_SPRITE_IDS } from "./medicalBayComposite";
import { compositeBaseUrl, compositeSpriteUrl } from "./types";
import type {
  CompositeGameSlice,
  CompositeResult,
  CompositeRoomId,
} from "./types";

export type {
  CompositeGameSlice,
  CompositeResult,
  CompositeRoomId,
} from "./types";

export {
  compositeBaseUrl,
  compositeSpriteUrl,
  COMPOSITE_ROOM_S3_DIR,
  LIGHTING_FILTERS,
} from "./types";

/** Asset id catalogs (per-room, exported for ship:check parity). */
export const COMPOSITE_ASSET_CATALOG: Readonly<
  Record<CompositeRoomId, { bases: readonly string[]; sprites: readonly string[] }>
> = {
  bridge: { bases: BRIDGE_BASE_IDS, sprites: BRIDGE_SPRITE_IDS },
  "cryo-bay": { bases: CRYO_BAY_BASE_IDS, sprites: CRYO_BAY_SPRITE_IDS },
  "medical-bay": { bases: MEDICAL_BAY_BASE_IDS, sprites: MEDICAL_BAY_SPRITE_IDS },
};

/** True when the room has a Phase J composite resolver wired. */
export function hasRoomComposite(roomId: string): roomId is CompositeRoomId {
  return roomId === "bridge" || roomId === "cryo-bay" || roomId === "medical-bay";
}

/** Resolve a room composite for a given game state slice.
 *  Returns null when the room has no composite (caller falls back
 *  through the existing Phase H + Phase F render cascade). */
export function resolveRoomComposite(
  roomId: string,
  game: CompositeGameSlice,
): CompositeResult | null {
  if (!hasRoomComposite(roomId)) return null;
  switch (roomId) {
    case "bridge":
      return resolveBridgeComposite(game);
    case "cryo-bay":
      return resolveCryoBayComposite(game);
    case "medical-bay":
      return resolveMedicalBayComposite(game);
  }
}

/** Resolve a room composite directly to a renderer-ready
 *  `{ base: url, sprites: url[], filter? }` shape. Asset paths
 *  are absolute CDN URLs. Returns null when the room has no
 *  composite. */
export function resolveRoomCompositeUrls(
  roomId: string,
  game: CompositeGameSlice,
): { base: string; sprites: string[]; filter?: string } | null {
  const c = resolveRoomComposite(roomId, game);
  if (!c) return null;
  return {
    base: compositeBaseUrl(roomId as CompositeRoomId, c.base),
    sprites: c.sprites.map((id) => compositeSpriteUrl(roomId as CompositeRoomId, id)),
    filter: c.baseLightingFilter,
  };
}

export { resolveBridgeComposite } from "./bridgeComposite";
export { resolveCryoBayComposite } from "./cryoBayComposite";
export { resolveMedicalBayComposite } from "./medicalBayComposite";
