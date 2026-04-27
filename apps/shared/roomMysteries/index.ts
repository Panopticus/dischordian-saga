/* ═══════════════════════════════════════════════════════
   ROOM MYSTERIES — registry

   Central lookup from roomId → RoomMysteryModule. The runtime
   uses this to dispatch `room-mystery:<roomId>:<hotspotId>`
   actions to the right module without hard-coding per-room
   branches.

   Cryo Bay continues to live in apps/shared/cryoBayMystery.ts
   (its data shape predates the generic template). We adapt it
   into a RoomMysteryModule shape here so it's reachable through
   the same registry.
   ═══════════════════════════════════════════════════════ */

import {
  CRYO_MYSTERY_RESPONSES,
  type CryoMysteryHotspotId,
} from "../cryoBayMystery";
import type { RoomMysteryModule } from "./_template";
import { BRIDGE_MYSTERY } from "./bridge";
import { ENGINEERING_MYSTERY } from "./engineering";
import { MEDICAL_BAY_MYSTERY } from "./medicalBay";

/** Cryo Bay adapter — wraps the legacy responses table in the
 *  generic module shape so the registry can dispatch to it. */
const CRYO_BAY_MYSTERY: RoomMysteryModule<CryoMysteryHotspotId> = {
  roomId: "cryo-bay",
  responses: CRYO_MYSTERY_RESPONSES,
};

/** roomId → module. Add new room modules here as they ship. */
export const ROOM_MYSTERY_REGISTRY: Readonly<Record<string, RoomMysteryModule>> = {
  "cryo-bay": CRYO_BAY_MYSTERY as RoomMysteryModule,
  "medical-bay": MEDICAL_BAY_MYSTERY as RoomMysteryModule,
  "bridge": BRIDGE_MYSTERY as RoomMysteryModule,
  "engineering": ENGINEERING_MYSTERY as RoomMysteryModule,
};

/** Get the module for a room id, or null if no mystery is authored. */
export function getRoomMysteryModule(roomId: string): RoomMysteryModule | null {
  return ROOM_MYSTERY_REGISTRY[roomId] ?? null;
}

export type { RoomMysteryModule } from "./_template";
export {
  resolveVerbResponse,
  combineInventory,
  type Verb,
  type VerbResponse,
  type Clue,
  type CombineResult,
  type CombineRule,
  VERB_LIST,
} from "./_template";
