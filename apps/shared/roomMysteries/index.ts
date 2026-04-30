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
import { ANTIQUARIAN_LIBRARY_MYSTERY } from "./antiquarianLibrary";
import { ARCHIVES_MYSTERY } from "./archives";
import { ARMORY_MYSTERY } from "./armory";
import { BRIDGE_MYSTERY } from "./bridge";
import { CAPTAINS_QUARTERS_MYSTERY } from "./captainsQuarters";
import { CARGO_HOLD_MYSTERY } from "./cargoHold";
import { CHAOS_FORGE_MYSTERY } from "./chaosForge";
import { CIPHER_DEN_MYSTERY } from "./cipherDen";
import { COMMS_ARRAY_MYSTERY } from "./commsArray";
import { DREAMS_WORKSHOP_MYSTERY } from "./dreamsWorkshop";
import { ELEMENTAL_NEXUS_MYSTERY } from "./elementalNexus";
import { ENGINEERING_MYSTERY } from "./engineering";
import { ENGINEERING_CORE_MYSTERY } from "./engineeringCore";
import { FORGE_WORKSHOP_MYSTERY } from "./forgeWorkshop";
import { GUILD_SANCTUM_MYSTERY } from "./guildSanctum";
import { MEDICAL_BAY_MYSTERY } from "./medicalBay";
import { OBSERVATION_DECK_MYSTERY } from "./observationDeck";
import { ORACLE_SANCTUM_MYSTERY } from "./oracleSanctum";
import { ORDER_TRIBUNAL_MYSTERY } from "./orderTribunal";
import { QUANTUM_LAB_MYSTERY } from "./quantumLab";
import { SHADOW_VAULT_MYSTERY } from "./shadowVault";
import { SOCIAL_HUB_MYSTERY } from "./socialHub";
import { STATION_DOCK_MYSTERY } from "./stationDock";
import { SYNTHESIS_CHAMBER_MYSTERY } from "./synthesisChamber";
import { WAR_ROOM_MYSTERY } from "./warRoom";

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
  "captains-quarters": CAPTAINS_QUARTERS_MYSTERY as RoomMysteryModule,
  "shadow-vault": SHADOW_VAULT_MYSTERY as RoomMysteryModule,
  "cipher-den": CIPHER_DEN_MYSTERY as RoomMysteryModule,
  "observation-deck": OBSERVATION_DECK_MYSTERY as RoomMysteryModule,
  "war-room": WAR_ROOM_MYSTERY as RoomMysteryModule,
  "station-dock": STATION_DOCK_MYSTERY as RoomMysteryModule,
  "forge-workshop": FORGE_WORKSHOP_MYSTERY as RoomMysteryModule,
  "antiquarian-library": ANTIQUARIAN_LIBRARY_MYSTERY as RoomMysteryModule,
  "engineering-core": ENGINEERING_CORE_MYSTERY as RoomMysteryModule,
  "oracle-sanctum": ORACLE_SANCTUM_MYSTERY as RoomMysteryModule,
  "order-tribunal": ORDER_TRIBUNAL_MYSTERY as RoomMysteryModule,
  "dreams-workshop-subbasement": DREAMS_WORKSHOP_MYSTERY as RoomMysteryModule,
  "chaos-forge": CHAOS_FORGE_MYSTERY as RoomMysteryModule,
  "elemental-nexus": ELEMENTAL_NEXUS_MYSTERY as RoomMysteryModule,
  "quantum-lab": QUANTUM_LAB_MYSTERY as RoomMysteryModule,
  "synthesis-chamber": SYNTHESIS_CHAMBER_MYSTERY as RoomMysteryModule,
  "guild-sanctum": GUILD_SANCTUM_MYSTERY as RoomMysteryModule,
  "social-hub": SOCIAL_HUB_MYSTERY as RoomMysteryModule,
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
  resolveBandedVoId,
  resolveBandedHumanVoId,
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
