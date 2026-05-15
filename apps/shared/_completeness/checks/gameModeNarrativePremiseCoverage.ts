/**
 * Phase F — game-mode narrative-premise coverage parity check.
 *
 * Build-plan §VIII Phase F: "every game mode has its diegetic
 * 'why'." The GAME_MODE_PREMISES registry
 * (apps/shared/gameModeNarrativePremises.ts) binds every
 * player-facing game mode to an in-fiction reason the player
 * engages it + the canon module that anchors that reason.
 *
 * This gate is HARD PARITY: every registered game mode MUST
 * have a non-empty `diegeticWhy` AND a non-empty
 * `premiseSourceModule`. A game mode with no recorded
 * in-fiction reason to exist is a Phase F failure — the saga's
 * design contract is that no system is "just a minigame."
 *
 * No ratchet: a premise either exists or it does not. The
 * registry is the declared surface; the populated fields are
 * the implemented surface.
 */
import {
  GAME_MODE_PREMISES,
  getGameModePremiseCoverage,
} from "../../gameModeNarrativePremises";
import type { RawParityCount } from "../types";

export function checkGameModeNarrativePremiseCoverage(): RawParityCount {
  const { declared, withPremise } = getGameModePremiseCoverage();
  const missing = GAME_MODE_PREMISES
    .filter(
      (m) =>
        m.premiseSourceModule.trim().length === 0 ||
        m.diegeticWhy.trim().length === 0,
    )
    .map(
      (m) =>
        `game mode '${m.id}' (${m.name}) has no diegetic premise — ` +
        `Phase F requires a non-empty diegeticWhy + premiseSourceModule`,
    );
  return { declared, implemented: withPremise, missing };
}
