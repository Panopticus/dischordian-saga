/**
 * §5.7 Game Master match — public-witness state transitions.
 *
 * Pure. Operates on PublicWitnessState. The drain-into-§5.8
 * hand-off is a single derived value — see
 * deriveAuthorityVerdictOffset — that the campaign layer reads
 * at §5.7 match end and passes into TrialModeConfig.openingVerdictBalance.
 *
 * Spec: docs/production/act1/public-witness-ui-spec.md.
 */

import type {
  PublicWitnessEntry,
  PublicWitnessState,
  WitnessModeConfig,
} from "../types/PublicWitness";
import {
  PUBLIC_WITNESS_BALANCE_MAX,
  PUBLIC_WITNESS_BALANCE_MIN,
  PUBLIC_WITNESS_THRESHOLDS,
} from "../types/PublicWitness";

/** Clamp a balance value into the §4 clip range. Non-finite → 0. */
export function clipWitnessBalance(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < PUBLIC_WITNESS_BALANCE_MIN) return PUBLIC_WITNESS_BALANCE_MIN;
  if (value > PUBLIC_WITNESS_BALANCE_MAX) return PUBLIC_WITNESS_BALANCE_MAX;
  return value;
}

/**
 * Initial §5.7 state. Starts at balance 0 with no entries per
 * spec §6. Optional opening balance for tests + save-resume.
 */
export function initPublicWitnessState(
  config: WitnessModeConfig = {},
): PublicWitnessState {
  const opening =
    typeof config.openingBalance === "number" &&
    Number.isFinite(config.openingBalance)
      ? config.openingBalance
      : 0;
  return {
    balance: clipWitnessBalance(opening),
    entries: [],
  };
}

/**
 * Record a Game Master card play: append the entry and update
 * the running balance (clipped). Spec §6: "On every Game Master
 * card play: += publicDelta (clip to ±10)". Returns a new state;
 * mutates nothing.
 */
export function recordOpponentPlay(
  state: PublicWitnessState,
  entry: PublicWitnessEntry,
): PublicWitnessState {
  const nextBalance = clipWitnessBalance(state.balance + entry.publicDelta);
  return {
    balance: nextBalance,
    entries: [...state.entries, entry],
  };
}

/**
 * Derive the §5.8 opening verdict offset from the §5.7 final
 * balance. Spec §4 thresholds:
 *
 *   balance ≥ +3 → +3 warm offset
 *   balance ≤ -3 → -3 cool offset
 *   otherwise    → 0 neutral
 *
 * The campaign layer reads this at §5.7 match end and feeds it
 * into TrialModeConfig.openingVerdictBalance for the §5.8 match.
 */
export function deriveAuthorityVerdictOffset(balance: number): number {
  if (!Number.isFinite(balance)) return 0;
  if (balance >= PUBLIC_WITNESS_THRESHOLDS.warm) {
    return PUBLIC_WITNESS_THRESHOLDS.warm;
  }
  if (balance <= PUBLIC_WITNESS_THRESHOLDS.cool) {
    return PUBLIC_WITNESS_THRESHOLDS.cool;
  }
  return 0;
}

/**
 * Spec §3 divergence rule: public and private deltas "diverge"
 * when they disagree in sign. The UI renders a rust-orange
 * border around verdict cards whose entries fail this check.
 *
 *   agree in sign OR either is zero  → false (not diverged)
 *   disagree in sign                  → true  (diverged)
 */
export function isEntryDiverged(entry: PublicWitnessEntry): boolean {
  if (entry.publicDelta === 0 || entry.privateDelta === 0) return false;
  return (
    (entry.publicDelta > 0 && entry.privateDelta < 0) ||
    (entry.publicDelta < 0 && entry.privateDelta > 0)
  );
}
