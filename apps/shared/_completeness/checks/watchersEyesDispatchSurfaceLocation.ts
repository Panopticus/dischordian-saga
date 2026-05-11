/**
 * Watchers' Eyes dispatch surface-location parity check.
 *
 * Declared: every WatchersEyesDispatch in
 * apps/shared/watchersEyesDispatches.ts declares a
 * `surfaceLocation: { roomId, hotspotId }`.
 *
 * Implemented: the snake_case `roomId` maps to a real room-
 * mystery module on disk and the kebab-case `hotspotId`
 * appears in that module's source.
 *
 * Hard parity — same logic as the Mascoteer file surface
 * check. A dispatch with a broken surface location silently
 * fails to surface and the Elara betrayal reveal at Beat H
 * never lands.
 */
import type { RawParityCount } from "../types";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { WATCHERS_EYES_DISPATCHES } from "../../watchersEyesDispatches";

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

export async function checkWatchersEyesDispatchSurfaceLocation(): Promise<RawParityCount> {
  const missing: string[] = [];
  let implemented = 0;

  for (const d of WATCHERS_EYES_DISPATCHES) {
    const moduleName = roomIdToModuleName(d.surfaceLocation.roomId);
    const path = `apps/shared/roomMysteries/${moduleName}.ts`;
    let content = "";
    try {
      content = await readFile(resolve(process.cwd(), path), "utf8");
    } catch {
      missing.push(`${d.dispatchId} → ${path} (not found)`);
      continue;
    }
    if (content.includes(`"${d.surfaceLocation.hotspotId}"`)) {
      implemented++;
    } else {
      missing.push(
        `${d.dispatchId} → ${d.surfaceLocation.roomId}/${d.surfaceLocation.hotspotId} (hotspot not present in ${moduleName}.ts)`,
      );
    }
  }

  return {
    declared: WATCHERS_EYES_DISPATCHES.length,
    implemented,
    missing,
  };
}
