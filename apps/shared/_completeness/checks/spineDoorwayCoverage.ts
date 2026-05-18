/**
 * Spine-doorway coverage — the room↔mode bridge gate (W0).
 *
 * "Open but guided": a system being on the spine + in the objective
 * tracker is not the same as the player being able to walk into it
 * from the living world. Every spine WING should have a diegetic
 * in-world doorway — a ROOM_DEFINITIONS hotspot whose route action is
 * the wing's canonical entryRoute (narrativeSpine.ts).
 *
 * RATCHET (target 0): the bridge already exists for some wings
 * (Strategy Table → /chess, Trade Terminal → /trade-empire, Warden's
 * Vigil → /tower-defense); the rest are precise, auditable targets
 * surfaced in `missing`. The gap can only shrink — once a wing has a
 * world door it can never regress to doorless.
 *
 * declared = spine wings; implemented = wings with an in-world door.
 */
import { resolveSpineDoorways } from "../../spineDoorways";
import type { RawParityCount } from "../types";

export function checkSpineDoorwayCoverage(): RawParityCount {
  const doorways = resolveSpineDoorways();
  const withDoor = doorways.filter((d) => d.hasWorldDoor);
  const missing = doorways
    .filter((d) => !d.hasWorldDoor)
    .map(
      (d) =>
        `wing '${d.premiseId}' (${d.name}) has no in-world doorway — ` +
        `no ROOM_DEFINITIONS hotspot navigates to its entry route ` +
        `${d.entryRoute}; the story reveals it but the world has no ` +
        `door into it`,
    );
  return {
    declared: doorways.length,
    implemented: withDoor.length,
    missing,
  };
}
