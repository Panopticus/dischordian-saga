/* ═══════════════════════════════════════════════════════
   ACT 3 PATH DIVIDEND — mechanical consequence layer

   audit/10.F3. The canonical Act 3 fork flags
   (act3_path_transparent_chosen / act3_path_pragmatic_chosen /
   act3_path_full_secret_chosen) used to branch only Act 4
   dialog and downstream companion comments / variants — they
   had no tangible effect on player state. This module is the
   pure dividend-resolution layer; the Act 6 ladder calls it
   on confession close and applies the returned deltas.

   Pure function so the test can exercise every path without
   spinning up React or the GameProvider.
   ═══════════════════════════════════════════════════════ */

export type Act3PathFlag =
  | "act3_path_transparent_chosen"
  | "act3_path_pragmatic_chosen"
  | "act3_path_full_secret_chosen";

export interface Act3PathDividend {
  /** +N elara trust points (clamped 0..100 by the caller). */
  elaraTrustDelta: number;
  /** +N human trust points (clamped 0..100 by the caller). */
  humanTrustDelta: number;
  /** Morality shift; negative = machine-leaning, positive = humanity-leaning. */
  moralityDelta: number;
  /** Sticky narrative flag the dividend leaves behind. */
  flag:
    | "act6_path_dividend_transparent"
    | "act6_path_dividend_pragmatic"
    | "act6_path_dividend_full_secret"
    | null;
  /** Which fork-flag triggered this dividend (for telemetry / tests). */
  source: Act3PathFlag | null;
}

const NO_DIVIDEND: Act3PathDividend = {
  elaraTrustDelta: 0,
  humanTrustDelta: 0,
  moralityDelta: 0,
  flag: null,
  source: null,
};

/**
 * Resolve the path dividend for the player's Act 3 disclosure
 * stance. Returns NO_DIVIDEND when no canonical fork flag is
 * set (e.g. the player skipped Act 3 or hit it before the
 * fork flags shipped).
 *
 * Precedence (only one fires):
 *  1. transparent — full disclosure rewarded Elara's bond.
 *  2. pragmatic   — partial share split the dividend evenly.
 *  3. full_secret — silence widened the bond gap and nudged
 *                   morality toward machine.
 */
export function resolveAct3PathDividend(
  flags: Readonly<Record<string, boolean | undefined>>,
): Act3PathDividend {
  if (flags.act3_path_transparent_chosen) {
    return {
      elaraTrustDelta: 10,
      humanTrustDelta: 0,
      moralityDelta: 0,
      flag: "act6_path_dividend_transparent",
      source: "act3_path_transparent_chosen",
    };
  }
  if (flags.act3_path_pragmatic_chosen) {
    return {
      elaraTrustDelta: 5,
      humanTrustDelta: 5,
      moralityDelta: 0,
      flag: "act6_path_dividend_pragmatic",
      source: "act3_path_pragmatic_chosen",
    };
  }
  if (flags.act3_path_full_secret_chosen) {
    return {
      elaraTrustDelta: 0,
      humanTrustDelta: 10,
      moralityDelta: -3,
      flag: "act6_path_dividend_full_secret",
      source: "act3_path_full_secret_chosen",
    };
  }
  return NO_DIVIDEND;
}
