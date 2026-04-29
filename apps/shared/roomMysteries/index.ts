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
  CRYO_MYSTERY_COMBINES,
  CRYO_MYSTERY_RESPONSES,
  type CryoMysteryHotspotId,
} from "../cryoBayMystery";
import type { CombineRule, RoomMysteryModule } from "./_template";
import { ARCHIVES_MYSTERY } from "./archives";
import { ARMORY_MYSTERY } from "./armory";
import { BRIDGE_MYSTERY } from "./bridge";
import { CARGO_HOLD_MYSTERY } from "./cargoHold";
import { COMMS_ARRAY_MYSTERY } from "./commsArray";
import { ENGINEERING_MYSTERY } from "./engineering";
import { MEDICAL_BAY_MYSTERY } from "./medicalBay";

/** Cryo Bay adapter — wraps the legacy responses table in the
 *  generic module shape so the registry can dispatch to it. The
 *  combine rules are surfaced too so getAllAuthoredClues() finds
 *  the victim-identified clue (logged when torn-id + data-slate
 *  are combined). */
const CRYO_BAY_MYSTERY: RoomMysteryModule<CryoMysteryHotspotId> = {
  roomId: "cryo-bay",
  responses: CRYO_MYSTERY_RESPONSES,
  combines: CRYO_MYSTERY_COMBINES as readonly CombineRule[],
};

/** roomId → module. Add new room modules here as they ship. */
export const ROOM_MYSTERY_REGISTRY: Readonly<Record<string, RoomMysteryModule>> = {
  "cryo-bay": CRYO_BAY_MYSTERY as RoomMysteryModule,
  "medical-bay": MEDICAL_BAY_MYSTERY as RoomMysteryModule,
  "bridge": BRIDGE_MYSTERY as RoomMysteryModule,
  "engineering": ENGINEERING_MYSTERY as RoomMysteryModule,
  "archives": ARCHIVES_MYSTERY as RoomMysteryModule,
  "comms-array": COMMS_ARRAY_MYSTERY as RoomMysteryModule,
  "cargo-hold": CARGO_HOLD_MYSTERY as RoomMysteryModule,
  "armory": ARMORY_MYSTERY as RoomMysteryModule,
};

/** Get the module for a room id, or null if no mystery is authored. */
export function getRoomMysteryModule(roomId: string): RoomMysteryModule | null {
  return ROOM_MYSTERY_REGISTRY[roomId] ?? null;
}

/** Walk every authored response and combine across the registry and
 *  collect the deduplicated set of Clue objects. The Clue Journal UI
 *  uses this to compute "logged / total" without hardcoding a number
 *  that drifts when a new room mystery is shipped. */
export function getAllAuthoredClues(): import("./_template").Clue[] {
  const seen = new Set<string>();
  const out: import("./_template").Clue[] = [];
  for (const mod of Object.values(ROOM_MYSTERY_REGISTRY)) {
    for (const verbs of Object.values(mod.responses)) {
      for (const resp of Object.values(verbs ?? {})) {
        const c = resp?.logsClue;
        if (c && !seen.has(c.id)) {
          seen.add(c.id);
          out.push(c);
        }
      }
    }
    for (const rule of mod.combines ?? []) {
      const c = rule.result.logsClue;
      if (c && !seen.has(c.id)) {
        seen.add(c.id);
        out.push(c);
      }
    }
  }
  return out;
}

export type { RoomMysteryModule } from "./_template";
export {
  resolveVerbResponse,
  combineInventory,
  resolveTierResponse,
  resolveBandedNarration,
  resolveHumanBandedNarration,
  resolveHumanReaction,
  type Verb,
  type VerbResponse,
  type Clue,
  type CombineResult,
  type CombineRule,
  type HumanReaction,
  type ElaraBandedText,
  type HumanBandedText,
  type ElaraNarration,
  type HumanNarration,
  VERB_LIST,
} from "./_template";
