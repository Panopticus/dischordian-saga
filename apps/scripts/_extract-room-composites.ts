/* Extract Phase J composite-room metadata for the standalone hotspot
   author tool. Reads every composite module (bridge, cryo-bay,
   medical-bay, engineering, archives, comms-array, observation-deck,
   antiquarian-library), resolves every base + sprite to its full CDN
   URL via the runtime helpers, and writes
   tools/hotspot-author-composites.json in a shape the tool can directly
   stack as <img> layers.
*/

import * as fs from "fs";
import * as path from "path";
import {
  BRIDGE_BASE_IDS,
  BRIDGE_SPRITE_IDS,
} from "../shared/roomComposition/bridgeComposite";
import {
  CRYO_BAY_BASE_IDS,
  CRYO_BAY_SPRITE_IDS,
} from "../shared/roomComposition/cryoBayComposite";
import {
  MEDICAL_BAY_BASE_IDS,
  MEDICAL_BAY_SPRITE_IDS,
} from "../shared/roomComposition/medicalBayComposite";
import {
  ENGINEERING_BASE_IDS,
  ENGINEERING_SPRITE_IDS,
} from "../shared/roomComposition/engineeringComposite";
import {
  ARCHIVES_BASE_IDS,
  ARCHIVES_SPRITE_IDS,
} from "../shared/roomComposition/archivesComposite";
import {
  COMMS_ARRAY_BASE_IDS,
  COMMS_ARRAY_SPRITE_IDS,
} from "../shared/roomComposition/commsArrayComposite";
import {
  OBSERVATION_DECK_BASE_IDS,
  OBSERVATION_DECK_SPRITE_IDS,
} from "../shared/roomComposition/observationDeckComposite";
import {
  ANTIQUARIAN_LIBRARY_BASE_IDS,
  ANTIQUARIAN_LIBRARY_SPRITE_IDS,
} from "../shared/roomComposition/antiquarianLibraryComposite";
import {
  CARGO_HOLD_BASE_IDS,
  CARGO_HOLD_SPRITE_IDS,
} from "../shared/roomComposition/cargoHoldComposite";
import {
  CAPTAINS_QUARTERS_BASE_IDS,
  CAPTAINS_QUARTERS_SPRITE_IDS,
} from "../shared/roomComposition/captainsQuartersComposite";
import {
  ARMORY_BASE_IDS,
  ARMORY_SPRITE_IDS,
} from "../shared/roomComposition/armoryComposite";
import {
  FORGE_WORKSHOP_BASE_IDS,
  FORGE_WORKSHOP_SPRITE_IDS,
} from "../shared/roomComposition/forgeWorkshopComposite";
import {
  compositeBaseUrl,
  compositeSpriteUrl,
  LIGHTING_FILTERS,
  type CompositeRoomId,
} from "../shared/roomComposition/types";

interface AssetEntry {
  id: string;
  url: string;
}

interface RoomComposite {
  bases: AssetEntry[];
  sprites: AssetEntry[];
  lightingFilters: Readonly<Record<string, string>>;
}

const ROOMS: Record<CompositeRoomId, { bases: readonly string[]; sprites: readonly string[] }> = {
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

const out: Record<string, RoomComposite> = {};
for (const [roomId, ids] of Object.entries(ROOMS) as Array<[CompositeRoomId, typeof ROOMS[CompositeRoomId]]>) {
  out[roomId] = {
    bases: ids.bases.map((id) => ({ id, url: compositeBaseUrl(roomId, id) })),
    sprites: ids.sprites.map((id) => ({ id, url: compositeSpriteUrl(roomId, id) })),
    lightingFilters: LIGHTING_FILTERS,
  };
}

const outPath = path.resolve("tools/hotspot-author-composites.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

const totalBases = Object.values(out).reduce((n, r) => n + r.bases.length, 0);
const totalSprites = Object.values(out).reduce((n, r) => n + r.sprites.length, 0);
console.log(
  `Wrote ${Object.keys(out).length} composite rooms / ${totalBases} bases / ${totalSprites} sprites → ${outPath}`,
);
