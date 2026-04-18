/**
 * §5.7 → §5.8 campaign-layer handoff.
 *
 * The spec (docs/production/act1/public-witness-ui-spec.md + §5.8
 * authority-trial-phase-mechanic.md §4) says the Game Master's final
 * public-witness balance at match end feeds the Authority's opening
 * verdict balance as `+3 / 0 / -3` via `deriveAuthorityVerdictOffset`.
 *
 * Before this module the pipe was open at both ends:
 *   - `engine/publicWitness.ts:deriveAuthorityVerdictOffset` — pure,
 *     test-covered, never called outside tests
 *   - `chapters.ts:chAuthorityTrial.trialMode.openingVerdictBalance`
 *     — hard-coded to 0
 * This module is the middle bridge: it owns the one place where the
 * campaign layer translates the saved balance into a live
 * `TrialModeConfig` override for the §5.8 encounter.
 *
 * The campaign layer is expected to:
 *   1. On §5.7 match end, read `gameState.publicWitness.balance` and
 *      call `rememberPublicWitnessBalance(setter, balance)`. A single
 *      nullable number lives on `GameContext.state.act1PublicWitnessBalance`.
 *   2. When the §5.8 encounter is about to start, call
 *      `computeAuthorityTrialOverride(state.act1PublicWitnessBalance)`
 *      and pass the result as the `trialMode` option to
 *      `TcgClient.init(...)`. If the player skipped §5.7 (`balance === null`),
 *      the helper returns `undefined` and the encounter falls back to
 *      its authored default (openingVerdictBalance: 0).
 */
import { deriveAuthorityVerdictOffset } from "./tcg-core/engine/publicWitness";
import type { TrialModeConfig } from "./tcg-core/types/TrialPhase";

/**
 * Translate a saved §5.7 public-witness balance into the §5.8
 * Authority trial's `TrialModeConfig` override. Returns `undefined`
 * when no balance has been captured yet (null / unset), which lets
 * the caller skip the override entirely and use the encounter's
 * authored default.
 */
export function computeAuthorityTrialOverride(
  savedBalance: number | null | undefined,
): TrialModeConfig | undefined {
  if (savedBalance === null || savedBalance === undefined) return undefined;
  const offset = deriveAuthorityVerdictOffset(savedBalance);
  return { openingVerdictBalance: offset };
}

/**
 * Thin dispatcher used by the match-end handler in DuelystGameUI.
 * Passed a setter + the live `gameState.publicWitness.balance`, it
 * persists the balance to campaign state so it survives past the
 * §5.7 match teardown.
 *
 * The setter is passed as a parameter (instead of importing
 * GameContext directly) so this helper stays in `apps/shared/`
 * without pulling React into the shared bundle.
 */
export function rememberPublicWitnessBalance(
  setAct1PublicWitnessBalance: (balance: number) => void,
  balance: number,
): void {
  // Defensive: clamp NaN / infinities to 0 before persisting.
  if (!Number.isFinite(balance)) return;
  setAct1PublicWitnessBalance(balance);
}
