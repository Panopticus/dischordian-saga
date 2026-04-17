/**
 * §5.7 Game Master match — public-witness type definitions.
 *
 * Cycle C step 11 of the Act 1 ladder. The Game Master is a
 * prosecutor, not a duelist: every card HE plays resolves twice,
 * once privately (normal Dischordia scoring) and once publicly
 * (the verdict stream visible in a dedicated UI column). The
 * player's cards only resolve once, normally. The asymmetry is
 * the point — the match ends by private score, but the public
 * record carries forward as §5.8 Authority trial opening state.
 *
 * Spec: docs/production/act1/public-witness-ui-spec.md.
 *
 * Lives in types/ (not engine/) so GameState can reference the
 * state shape. Transitions + thresholds + clip live in
 * engine/publicWitness.ts.
 */

/** Balance clip range. Per spec §4 the running sum is clipped so
 *  a single play can't push past the threshold. */
export const PUBLIC_WITNESS_BALANCE_MIN = -10;
export const PUBLIC_WITNESS_BALANCE_MAX = 10;

/**
 * §4 thresholds that feed the §5.8 Authority trial's
 * openingVerdictBalance. The spec defines three zones:
 *
 *   balance ≥ +3 → warm  (verdict threshold easier to cross)
 *   -2 ≤ b ≤ +2 → neutral
 *   balance ≤ -3 → cool  (verdict threshold harder to cross)
 */
export const PUBLIC_WITNESS_THRESHOLDS = {
  warm: 3,
  cool: -3,
} as const;

/**
 * A single row in the verdict stream. One per Game Master card
 * played. Rendered in the TranscriptColumn on the right edge of
 * the match field.
 */
export interface PublicWitnessEntry {
  /** Unique id — the reducer's actionSeq works. */
  id: string;
  /** Turn number on which the play resolved. */
  turnNumber: number;
  /** Short label the UI renders ("admission", "deflection", etc.). */
  publicLabel: string;
  /** Signed delta this play added to the running public balance. */
  publicDelta: number;
  /** Signed delta the same card had on the private scoring track.
   *  Used by the UI to flag the divergence border (spec §3). */
  privateDelta: number;
  /** The def id of the card that was played — for optional renders. */
  cardDefId: string;
}

/**
 * Per-match §5.7 public-witness state. Present on
 * `GameState.publicWitness` only when the match was initialized
 * with `MatchConfig.witnessMode`. Standard matches leave absent.
 */
export interface PublicWitnessState {
  /** Running sum of publicDeltas, clipped to [MIN, MAX]. */
  balance: number;
  /** All Game Master plays recorded in order. UI stacks oldest
   *  at top so the match reads downward like a transcript. */
  entries: readonly PublicWitnessEntry[];
}

/**
 * Pre-match witness-mode opt-in. Carried on MatchConfig and
 * consumed by createMatchState, parallel to TrialModeConfig and
 * GiftModeConfig.
 */
export interface WitnessModeConfig {
  /**
   * Optional starting balance. Defaults to 0 per spec §6. The
   * field exists for tests + save-resume; production §5.7 matches
   * always start at 0.
   */
  openingBalance?: number;
}
