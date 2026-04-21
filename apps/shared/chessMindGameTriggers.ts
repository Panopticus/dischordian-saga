/**
 * Chess Mind-Game Triggers — pure predicates.
 *
 * Given a stream of (move, eval-delta) pairs from a live match,
 * decide which mind-game cue trigger (if any) fires next. The
 * client feeds Stockfish evaluations into these predicates and
 * uses the return value to surface the `MindGameOverlay` UI at
 * the right beat.
 *
 * Triggers are pure functions — no state beyond the arguments
 * passed in. The caller is expected to remember which triggers
 * have already fired this match (each trigger should fire at
 * most once per game in most cases).
 */

export const MIND_GAME_TRIGGER_IDS = [
  "first_non_book_move",
  "tempo_loss",
  "strong_tactic_found",
  "time_burn",
  "opponent_in_trouble",
  "player_blundered",
  "mid_series_offer",
] as const;

export type MindGameTriggerId = (typeof MIND_GAME_TRIGGER_IDS)[number];

export interface EvalDeltaSample {
  /** Half-move number (1-indexed). */
  ply: number;
  /** Whose move it was. */
  side: "white" | "black";
  /** Stockfish eval in centipawns AFTER this move. Positive =
   *  White better, negative = Black better. */
  evalCp: number;
  /** Centipawn delta from the previous position. Positive = the
   *  moving side's move improved their eval; negative = cost. */
  deltaCp: number;
  /** Time taken on this move, in seconds. */
  timeOnMoveSec: number;
  /** Whether this move is still in standard opening book. */
  inOpeningBook: boolean;
}

export interface TriggerInput {
  /** The latest eval sample for the player's move (NOT the opponent's). */
  sample: EvalDeltaSample;
  /** Which trigger ids have already fired this match. */
  alreadyFired: readonly MindGameTriggerId[];
  /** Climb tier, 0..3 — affects mid-series-offer availability. */
  climbTier: number;
  /** True if we're between games 1 and 2 of a climb best-of-3. */
  midClimbSeries: boolean;
}

/** Returns the next trigger to fire given the input, or null if
 *  nothing should fire. Only fires triggers that haven't already
 *  been used this match. Order of precedence is tuned so that
 *  the MOST narratively important cue wins when multiple are
 *  eligible. */
export function evaluateMindGameTriggers(
  input: TriggerInput,
): MindGameTriggerId | null {
  const { sample, alreadyFired, climbTier, midClimbSeries } = input;
  const fired = new Set(alreadyFired);

  // Priority: player_blundered > opponent_in_trouble >
  //   strong_tactic_found > tempo_loss > time_burn >
  //   mid_series_offer > first_non_book_move.

  const playerDelta = sample.side === "white" ? sample.deltaCp : -sample.deltaCp;

  if (!fired.has("player_blundered") && playerDelta <= -200) {
    return "player_blundered";
  }

  const evalForPlayer = sample.side === "white" ? sample.evalCp : -sample.evalCp;
  if (!fired.has("opponent_in_trouble") && evalForPlayer >= 200) {
    return "opponent_in_trouble";
  }

  if (!fired.has("strong_tactic_found") && playerDelta >= 80) {
    return "strong_tactic_found";
  }

  if (!fired.has("tempo_loss") && playerDelta <= -60 && playerDelta > -200) {
    return "tempo_loss";
  }

  if (!fired.has("time_burn") && sample.timeOnMoveSec > 120) {
    return "time_burn";
  }

  if (
    !fired.has("mid_series_offer") &&
    midClimbSeries &&
    climbTier >= 1
  ) {
    return "mid_series_offer";
  }

  if (
    !fired.has("first_non_book_move") &&
    !sample.inOpeningBook &&
    sample.ply <= 20
  ) {
    return "first_non_book_move";
  }

  return null;
}

/** The four archetype choices the player can pick at any cue.
 *  Silent is the implicit default on timeout. */
export const MIND_GAME_ARCHETYPES = [
  "defiant",
  "curious",
  "philosophical",
  "mocking",
  "vulnerable",
  "silent",
] as const;

export type MindGameArchetype = (typeof MIND_GAME_ARCHETYPES)[number];
