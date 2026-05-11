/**
 * Mascoteer-file surface-location parity check.
 *
 * Declared: every MascoteerFile in apps/shared/mascoteerFiles.ts
 * declares a `surfaceLocation: { roomId, hotspotId }`.
 *
 * Implemented: the snake_case `roomId` maps to a real room-
 * mystery module on disk, and the kebab-case `hotspotId`
 * appears in that module's source (as a hotspot key in the
 * responses table or in the HotspotId union).
 *
 * Hard parity — a case surfaced at a non-existent hotspot
 * silently fails to surface and the player never reads it.
 */
import type { RawParityCount } from "../types";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { MASCOTEER_FILES } from "../../mascoteerFiles";

/** snake_case room id → camelCase room-mystery filename
 *  (without the `.ts` extension). `cargo_hold` → `cargoHold`. */
function roomIdToModuleName(snake: string): string {
  const parts = snake.split("_");
  return (
    parts[0] +
    parts
      .slice(1)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("")
  );
}

export async function checkMascoteerFileSurfaceLocation(): Promise<RawParityCount> {
  const missing: string[] = [];
  let implemented = 0;

  for (const f of MASCOTEER_FILES) {
    const moduleName = roomIdToModuleName(f.surfaceLocation.roomId);
    const path = `apps/shared/roomMysteries/${moduleName}.ts`;
    let content = "";
    try {
      content = await readFile(resolve(process.cwd(), path), "utf8");
    } catch {
      missing.push(`${f.caseId} → ${path} (not found)`);
      continue;
    }
    // Hotspot id appears either as a literal key in the responses
    // table (`"hotspot-id":`) or as a member of the HotspotId union
    // (`| "hotspot-id"`). Either occurrence is sufficient evidence
    // the runtime can resolve the hotspot.
    const hotspotInTable = content.includes(`"${f.surfaceLocation.hotspotId}":`);
    const hotspotInUnion = content.includes(`"${f.surfaceLocation.hotspotId}"`);
    if (hotspotInTable || hotspotInUnion) {
      implemented++;
    } else {
      missing.push(
        `${f.caseId} → ${f.surfaceLocation.roomId}/${f.surfaceLocation.hotspotId} (hotspot not present in ${moduleName}.ts)`,
      );
    }
  }

  return { declared: MASCOTEER_FILES.length, implemented, missing };
}
