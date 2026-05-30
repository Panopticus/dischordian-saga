/* ═══════════════════════════════════════════════════════
   ROOM COMPOSITION — public facade

   Single entry point for room composite rendering. Returns
   null for rooms not covered, letting the caller fall back
   through the existing Phase H + Phase F render cascade.
   ═══════════════════════════════════════════════════════ */

import { resolveBridgeComposite, BRIDGE_BASE_IDS, BRIDGE_SPRITE_IDS } from "./bridgeComposite";
import { resolveCryoBayComposite, CRYO_BAY_BASE_IDS, CRYO_BAY_SPRITE_IDS } from "./cryoBayComposite";
import { resolveMedicalBayComposite, MEDICAL_BAY_BASE_IDS, MEDICAL_BAY_SPRITE_IDS } from "./medicalBayComposite";
import { resolveEngineeringComposite, ENGINEERING_BASE_IDS, ENGINEERING_SPRITE_IDS } from "./engineeringComposite";
import { resolveArchivesComposite, ARCHIVES_BASE_IDS, ARCHIVES_SPRITE_IDS } from "./archivesComposite";
import { resolveCommsArrayComposite, COMMS_ARRAY_BASE_IDS, COMMS_ARRAY_SPRITE_IDS } from "./commsArrayComposite";
import { resolveObservationDeckComposite, OBSERVATION_DECK_BASE_IDS, OBSERVATION_DECK_SPRITE_IDS } from "./observationDeckComposite";
import { resolveAntiquarianLibraryComposite, ANTIQUARIAN_LIBRARY_BASE_IDS, ANTIQUARIAN_LIBRARY_SPRITE_IDS } from "./antiquarianLibraryComposite";
import { resolveCargoHoldComposite, CARGO_HOLD_BASE_IDS, CARGO_HOLD_SPRITE_IDS } from "./cargoHoldComposite";
import { resolveCaptainsQuartersComposite, CAPTAINS_QUARTERS_BASE_IDS, CAPTAINS_QUARTERS_SPRITE_IDS } from "./captainsQuartersComposite";
import { resolveArmoryComposite, ARMORY_BASE_IDS, ARMORY_SPRITE_IDS } from "./armoryComposite";
import { resolveForgeWorkshopComposite, FORGE_WORKSHOP_BASE_IDS, FORGE_WORKSHOP_SPRITE_IDS } from "./forgeWorkshopComposite";
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
  engineering: { bases: ENGINEERING_BASE_IDS, sprites: ENGINEERING_SPRITE_IDS },
  archives: { bases: ARCHIVES_BASE_IDS, sprites: ARCHIVES_SPRITE_IDS },
  "comms-array": { bases: COMMS_ARRAY_BASE_IDS, sprites: COMMS_ARRAY_SPRITE_IDS },
  "observation-deck": { bases: OBSERVATION_DECK_BASE_IDS, sprites: OBSERVATION_DECK_SPRITE_IDS },
  "antiquarian-library": { bases: ANTIQUARIAN_LIBRARY_BASE_IDS, sprites: ANTIQUARIAN_LIBRARY_SPRITE_IDS },
  "cargo-hold": { bases: CARGO_HOLD_BASE_IDS, sprites: CARGO_HOLD_SPRITE_IDS },
  "captains-quarters": { bases: CAPTAINS_QUARTERS_BASE_IDS, sprites: CAPTAINS_QUARTERS_SPRITE_IDS },
  armory: { bases: ARMORY_BASE_IDS, sprites: ARMORY_SPRITE_IDS },
  "forge-workshop": { bases: FORGE_WORKSHOP_BASE_IDS, sprites: FORGE_WORKSHOP_SPRITE_IDS },
};

/** True when the room has a Phase J composite resolver wired. */
export function hasRoomComposite(roomId: string): roomId is CompositeRoomId {
  return (
    roomId === "bridge" ||
    roomId === "cryo-bay" ||
    roomId === "medical-bay" ||
    roomId === "engineering" ||
    roomId === "archives" ||
    roomId === "comms-array" ||
    roomId === "observation-deck" ||
    roomId === "antiquarian-library" ||
    roomId === "cargo-hold" ||
    roomId === "captains-quarters" ||
    roomId === "armory" ||
    roomId === "forge-workshop"
  );
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
    case "engineering":
      return resolveEngineeringComposite(game);
    case "archives":
      return resolveArchivesComposite(game);
    case "comms-array":
      return resolveCommsArrayComposite(game);
    case "observation-deck":
      return resolveObservationDeckComposite(game);
    case "antiquarian-library":
      return resolveAntiquarianLibraryComposite(game);
    case "cargo-hold":
      return resolveCargoHoldComposite(game);
    case "captains-quarters":
      return resolveCaptainsQuartersComposite(game);
    case "armory":
      return resolveArmoryComposite(game);
    case "forge-workshop":
      return resolveForgeWorkshopComposite(game);
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
export { resolveEngineeringComposite } from "./engineeringComposite";
export { resolveArchivesComposite } from "./archivesComposite";
export { resolveCommsArrayComposite } from "./commsArrayComposite";
export { resolveObservationDeckComposite } from "./observationDeckComposite";
export { resolveAntiquarianLibraryComposite } from "./antiquarianLibraryComposite";
export { resolveCargoHoldComposite } from "./cargoHoldComposite";
export { resolveCaptainsQuartersComposite } from "./captainsQuartersComposite";
export { resolveArmoryComposite } from "./armoryComposite";
export { resolveForgeWorkshopComposite } from "./forgeWorkshopComposite";
