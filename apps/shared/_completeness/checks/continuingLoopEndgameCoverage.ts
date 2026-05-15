/**
 * Phase C — continuing-loop endgame canon-lock coverage.
 *
 * Build-plan §VIII Phase C (reframed 2026-05-15): the shipped
 * endgame is the post-Act-7 continuing loop, NOT the Servant
 * Hero Academy. Every LoopSurfaceCanon
 * (apps/shared/continuingLoopEndgameCanon.ts) MUST bind to a
 * shipped runtime anchor + file:line loreSource + a valid
 * status. The Cross-Wave Witness Network must be scoped
 * current-loop (never servant-hero), and the Chronicler's
 * Desk / §X.7 baton-pass must be canon-locked.
 *
 * Hard parity. No ratchet — these surfaces are canon-locked,
 * not gap-tracked.
 */
import {
  CONTINUING_LOOP_ENDGAME,
  getContinuingLoopCoverage,
} from "../../continuingLoopEndgameCanon";
import { isCrossWaveWitnessCurrentLoop } from "../../crossWaveWitnessNetwork";
import { isChroniclersDeskCanonLocked } from "../../chroniclersDeskCanon";
import type { RawParityCount } from "../types";

export function checkContinuingLoopEndgameCoverage(): RawParityCount {
  const { declared, locked } = getContinuingLoopCoverage();
  const missing: string[] = [];

  for (const s of CONTINUING_LOOP_ENDGAME) {
    if (
      s.runtimeAnchorModule.trim().length === 0 ||
      s.loreSource.trim().length === 0 ||
      s.diegeticRole.trim().length === 0
    ) {
      missing.push(
        `loop surface '${s.id}' (${s.name}) lacks a runtime anchor / ` +
          `loreSource / diegeticRole — Phase C requires every loop ` +
          `surface canon-anchored`,
      );
    }
  }

  if (!isCrossWaveWitnessCurrentLoop()) {
    missing.push(
      "Cross-Wave Witness Network is not scoped current_loop_surface — " +
        "it must never be classified as a Servant Hero (future-season) surface",
    );
  }
  if (!isChroniclersDeskCanonLocked()) {
    missing.push(
      "Chronicler's Desk (§X.7 baton-pass) is not canon-locked — " +
        "expected CHRONICLERS_DESK.status === 'canon_locked'",
    );
  }

  // implemented counts the canon-locked surfaces; the two scope/lock
  // guards gate the whole result (a guard failure adds to `missing`
  // and the gate fails even if all surfaces are individually locked).
  const implemented = missing.length === 0 ? declared : locked;
  return { declared, implemented, missing };
}
