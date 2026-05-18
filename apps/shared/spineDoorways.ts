/* ═══════════════════════════════════════════════════════
   SPINE DOORWAYS — the room ↔ mode bridge

   A system being on the narrative spine (narrativeSpine.ts) and
   listed in the objective tracker (spineObjectives.ts) is not the
   same as the player being able to walk into it from the living
   world. The Ark's ROOM_DEFINITIONS hotspots can carry a route
   `action` (e.g. the Strategy Table → /chess, the Trade Terminal
   → /trade-empire) — that hotspot IS the diegetic door.

   This module makes "does this spine wing have an in-world door?"
   queryable, by scanning the ROOM_DEFINITIONS source for route-
   action hotspots and intersecting them with each wing's surface
   routes (resolved from the shipped discoverability registry — no
   hardcoded paths). It is the input that drives W0's room-manifest
   work: every wing WITHOUT a door is a precise, auditable target.

   Source-scan (not import) of the client GameContext on purpose —
   the same pattern the CADES bridge test uses — so this stays a
   pure shared module with no client/React dependency.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "./_completeness/scanner";
import { getGameModePremise } from "./gameModeNarrativePremises";
import { NARRATIVE_SPINE } from "./narrativeSpine";

const GAME_CONTEXT_PATH = path.join(
  REPO_ROOT,
  "apps/client/src/contexts/GameContext.tsx",
);

/** Every route a ROOM_DEFINITIONS hotspot navigates to (its `action`). */
export function getInWorldHotspotRoutes(): Set<string> {
  const src = fs.readFileSync(GAME_CONTEXT_PATH, "utf-8");
  const routes = new Set<string>();
  const re = /action:\s*"(\/[^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) routes.add(m[1]);
  return routes;
}

export interface SpineDoorway {
  premiseId: string;
  name: string;
  /** The wing's canonical entry route (narrativeSpine entryRoute). */
  entryRoute: string;
  /** Does that entry route have an in-world ROOM_DEFINITIONS hotspot? */
  hasWorldDoor: boolean;
}

/**
 * For every spine WING, whether the living world currently has a
 * hotspot doorway into it. Trunk beats are the mandatory path and
 * are excluded — they are entered through the story, not explored.
 */
export function resolveSpineDoorways(): SpineDoorway[] {
  const hotspotRoutes = getInWorldHotspotRoutes();
  return NARRATIVE_SPINE.filter((b) => b.spineRole === "wing").map((b) => ({
    premiseId: b.revealsPremiseId,
    name: getGameModePremise(b.revealsPremiseId)?.name ?? b.revealsPremiseId,
    entryRoute: b.entryRoute,
    hasWorldDoor: hotspotRoutes.has(b.entryRoute),
  }));
}

/** Wings the story reveals but the world has no door into yet (W0 targets). */
export function getDoorlessWings(): SpineDoorway[] {
  return resolveSpineDoorways().filter((d) => !d.hasWorldDoor);
}
