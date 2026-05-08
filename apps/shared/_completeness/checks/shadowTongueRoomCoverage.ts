/**
 * Shadow Tongue room-coverage parity check.
 *
 * `docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md` §1 enumerates 26 universal
 * rooms + 6 species-exclusive bonus rooms = 32 rooms total. The shipped
 * `apps/shared/roomMysteries/index.ts` registry must:
 *
 *   1. Have a `RoomMysteryModule` entry for every room in DECLARED_ROOMS.
 *   2. Each module must be non-trivial (≥ 1 hotspot in its `responses`
 *      table) — an empty module is the same dead-click bug as no module.
 *
 * Hard parity. The doc's Phase B/C work already closed the bulk of the
 * gap (was 9/26 at landing); this check freezes the closure so a future
 * design expansion (new room added to the doc) lights up the gate
 * before it ships unconnected.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const REGISTRY_PATH = path.join(
  REPO_ROOT,
  "apps/shared/roomMysteries/index.ts",
);
const ROOM_MODULES_DIR = path.join(REPO_ROOT, "apps/shared/roomMysteries");

/**
 * The full room set per STREAMED_PRISM_MYSTERY_ENGINE.md §1. Adding a
 * new room to the design = adding a row here.
 *
 * Each entry is { roomId, sourceModule } — `sourceModule` is the file
 * we expect to find a non-empty mystery module in.
 */
interface DeclaredRoom {
  roomId: string;
  sourceModule: string;
  classification:
    | "universal" /* unlocks for every player at Act 1+ */
    | "prelude" /* unlocks during the Prelude only */
    | "species_exclusive" /* gated by canAccessRoom() */;
}

const DECLARED_ROOMS: ReadonlyArray<DeclaredRoom> = [
  // Universal rooms (26 per doc §1)
  { roomId: "cryo-bay", sourceModule: "../cryoBayMystery.ts", classification: "universal" },
  { roomId: "medical-bay", sourceModule: "medicalBay.ts", classification: "universal" },
  { roomId: "bridge", sourceModule: "bridge.ts", classification: "universal" },
  { roomId: "archives", sourceModule: "archives.ts", classification: "universal" },
  { roomId: "comms-array", sourceModule: "commsArray.ts", classification: "universal" },
  { roomId: "observation-deck", sourceModule: "observationDeck.ts", classification: "universal" },
  { roomId: "engineering", sourceModule: "engineering.ts", classification: "universal" },
  { roomId: "engineering-core", sourceModule: "engineeringCore.ts", classification: "universal" },
  { roomId: "armory", sourceModule: "armory.ts", classification: "universal" },
  { roomId: "cargo-hold", sourceModule: "cargoHold.ts", classification: "universal" },
  { roomId: "captains-quarters", sourceModule: "captainsQuarters.ts", classification: "universal" },
  { roomId: "forge-workshop", sourceModule: "forgeWorkshop.ts", classification: "universal" },
  { roomId: "antiquarian-library", sourceModule: "antiquarianLibrary.ts", classification: "universal" },
  { roomId: "oracle-sanctum", sourceModule: "oracleSanctum.ts", classification: "universal" },
  { roomId: "shadow-vault", sourceModule: "shadowVault.ts", classification: "universal" },
  { roomId: "war-room", sourceModule: "warRoom.ts", classification: "universal" },
  { roomId: "cipher-den", sourceModule: "cipherDen.ts", classification: "universal" },
  { roomId: "order-tribunal", sourceModule: "orderTribunal.ts", classification: "universal" },
  { roomId: "chaos-forge", sourceModule: "chaosForge.ts", classification: "universal" },
  { roomId: "elemental-nexus", sourceModule: "elementalNexus.ts", classification: "universal" },
  { roomId: "quantum-lab", sourceModule: "quantumLab.ts", classification: "universal" },
  { roomId: "synthesis-chamber", sourceModule: "synthesisChamber.ts", classification: "universal" },
  { roomId: "station-dock", sourceModule: "stationDock.ts", classification: "universal" },
  { roomId: "guild-sanctum", sourceModule: "guildSanctum.ts", classification: "universal" },
  { roomId: "social-hub", sourceModule: "socialHub.ts", classification: "universal" },
  { roomId: "dreams-workshop-subbasement", sourceModule: "dreamsWorkshop.ts", classification: "universal" },
  // Species-exclusive bonus rooms (6 per doc §1; each module sourced from _speciesExclusive.ts)
  { roomId: "the_elemental_forge", sourceModule: "_speciesExclusive.ts", classification: "species_exclusive" },
  { roomId: "blood_archive", sourceModule: "_speciesExclusive.ts", classification: "species_exclusive" },
  { roomId: "probability_chamber", sourceModule: "_speciesExclusive.ts", classification: "species_exclusive" },
  { roomId: "dimensional_observatory", sourceModule: "_speciesExclusive.ts", classification: "species_exclusive" },
  { roomId: "hybrid_sanctum", sourceModule: "_speciesExclusive.ts", classification: "species_exclusive" },
  { roomId: "the_between", sourceModule: "_speciesExclusive.ts", classification: "species_exclusive" },
];

export function checkShadowTongueRoomCoverage(): RawParityCount {
  const registrySrc = fs.existsSync(REGISTRY_PATH)
    ? fs.readFileSync(REGISTRY_PATH, "utf-8")
    : "";
  const missing: string[] = [];

  for (const room of DECLARED_ROOMS) {
    // 1) Registered in ROOM_MYSTERY_REGISTRY?
    // Match the key as either "kebab-case-string" or snake_case literal.
    const registryKeyRe = new RegExp(
      String.raw`["']?` +
        room.roomId.replace(/[-]/g, "[-]").replace(/[_]/g, "[_]") +
        String.raw`["']?\s*:`,
    );
    if (!registryKeyRe.test(registrySrc)) {
      missing.push(
        `${room.roomId} (${room.classification}): no entry in apps/shared/roomMysteries/index.ts ROOM_MYSTERY_REGISTRY`,
      );
      continue;
    }

    // 2) Source module exists and is non-empty (≥ 1 response key)?
    const modulePath = path.join(ROOM_MODULES_DIR, room.sourceModule);
    if (!fs.existsSync(modulePath)) {
      missing.push(
        `${room.roomId}: source module ${room.sourceModule} not found relative to apps/shared/roomMysteries/`,
      );
      continue;
    }
    const moduleSrc = fs.readFileSync(modulePath, "utf-8");
    // A response key looks like `verb_noun: { ... }` inside a `responses:` block.
    // We accept any `<key>: {` literal as evidence the module is not a stub.
    if (!/[a-z_][a-zA-Z0-9_-]*:\s*\{/.test(moduleSrc)) {
      missing.push(
        `${room.roomId}: ${room.sourceModule} contains no hotspot keys — empty module is a dead click`,
      );
    }
  }

  return {
    declared: DECLARED_ROOMS.length,
    implemented: DECLARED_ROOMS.length - missing.length,
    missing,
  };
}
