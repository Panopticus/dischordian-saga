/**
 * Human whisper room-coverage parity check.
 *
 * Declared: HUMAN_WHISPERS in apps/shared/humanWhispers.ts.
 * Implemented: every whisper's roomId must either be the
 * "any_room" sentinel or a real RoomId from
 * apps/shared/detectiveCommentary.ts.
 *
 * Hard parity — a whisper referencing a non-existent room
 * silently fails to fire and breaks the pre-Beat-H surface
 * the Reveal video promises the player.
 */
import type { RawParityCount } from "../types";
import { HUMAN_WHISPERS } from "../../humanWhispers";

// Mirror the RoomId union from detectiveCommentary.ts at runtime.
// Keeping a literal allowlist here lets the check fail loudly the
// moment HUMAN_WHISPERS drifts off the canonical room set; pulling
// the union from the source TS type is not possible at runtime.
const ROOM_IDS = new Set([
  "cryo_bay",
  "bridge",
  "medical_bay",
  "archives",
  "comms_array",
  "engineering",
  "forge",
  "armory",
  "captains_quarters",
  "antiquarians_library",
  "cargo_hold",
  "chaos_forge",
  "cipher_den",
  "dreams_workshop",
  "elemental_nexus",
  "engineering_core",
  "forge_workshop",
  "guild_sanctum",
  "observation_deck",
  "oracle_sanctum",
  "order_tribunal",
  "quantum_lab",
  "shadow_vault",
  "social_hub",
  "station_dock",
  "synthesis_chamber",
  "war_room",
]);

export function checkHumanWhisperRoomCoverage(): RawParityCount {
  const missing: string[] = [];
  let implemented = 0;

  for (const w of HUMAN_WHISPERS) {
    if (w.roomId === "any_room" || ROOM_IDS.has(w.roomId)) {
      implemented++;
    } else {
      missing.push(`${w.id} → unknown room ${w.roomId}`);
    }
  }

  return {
    declared: HUMAN_WHISPERS.length,
    implemented,
    missing,
  };
}
