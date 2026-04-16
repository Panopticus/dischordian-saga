/**
 * §5.8 Authority trial-phase machine type definitions.
 *
 * Lives in types/ (not engine/) for the same reason ScriptedAction
 * does: GameState references it and types/ has no engine/ imports.
 * The phase rules table + admissibility checks + advancement live in
 * engine/trialPhase.ts.
 *
 * Spec: docs/production/act1/authority-trial-phase-mechanic.md.
 *
 * The §5.8 match has 10 turns. Each turn IS a phase; phases are
 * linear (no skip / double / reorder per spec §2). The Authority is
 * a verdict, not a duelist — it has no hand and never plays cards.
 * The match's outcome is computed at turn 10 against the verdict
 * stream balance, NOT by general death.
 */

/**
 * The ten trial phases. Numeric value === match turnNumber when the
 * phase is active, so the engine can compute current phase via
 * `state.turnNumber` (no separate field needed beyond the trialMode
 * flag).
 *
 * Closing names follow the spec table at §2:
 *   1  Charge
 *   2  Opening argument
 *   3  Evidence (presentation)
 *   4  Evidence (cross-support)
 *   5  Evidence (closing)
 *   6  Cross-examination (first)
 *   7  Cross-examination (second)
 *   8  Cross-examination (closing)
 *   9  Closing argument
 *   10 Verdict
 */
export type TrialPhaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Per-match §5.8 trial state. Present on `GameState.trial` only when
 * the match was initialized with `MatchConfig.trialMode`. Standard
 * Dischordia matches leave this absent.
 */
export interface TrialState {
  /**
   * Snapshot of `gameMasterVerdictStreamBalance` from §5.7 at match
   * start. Used by the verdict-threshold computation (spec §3.0):
   * `>=+3` → `+3` warm offset; `<=-3` → `-3` cool offset; else 0.
   * Stored on the match so the threshold doesn't drift mid-match.
   */
  openingVerdictBalance: number;
  /**
   * Running sum of every player card play's verdict-stream delta
   * during §5.8 (spec §3 `trial_balance`). Per the spec each card
   * contributes ±N per its public delta; the live PR uses `+1` per
   * play as a placeholder until the per-card delta authoring
   * lands. Negative deltas (offensive plays in the wrong phase)
   * never get added because the phase guard rejects them.
   */
  trialBalance: number;
  /**
   * Set true on the FIRST play of phase 2 (opening argument). The
   * phase forcibly ends after one play per spec §2 row "Opening
   * argument". The end_turn handler reads this on phase 2 / 9 to
   * decide whether to allow more plays.
   */
  openingArgumentPlayed: boolean;
  /** Same flag for phase 9 closing argument. */
  closingArgumentPlayed: boolean;
  /**
   * Outcome computed at phase 10. Absent during phases 1-9; set
   * exactly once at phase 10 resolution. Read by the campaign
   * layer to write the persistent `act1_authority_outcome` flag
   * and to fire the §5.8.1 Last Words cutscene (per spec §5).
   */
  outcome?: TrialOutcome;
}

export type TrialOutcome = "overturn" | "sentence_passed";

/**
 * Pre-match trial-mode opt-in. Carried on MatchConfig and consumed
 * by createMatchState. Absent on standard matches; setting it to
 * a non-undefined value puts the match into §5.8 mode (initial
 * `trial` state populated, phase guards active).
 */
export interface TrialModeConfig {
  /** Opening verdict balance from §5.7 hand-off. Defaults to 0
   *  per spec §4 safety net for save-state corruption. */
  openingVerdictBalance: number;
}
