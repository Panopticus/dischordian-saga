/**
 * §4.9 Seer prophecy-mechanic type definitions.
 *
 * Cycle B step 8 (visiting fellow). The Seer plays cards that aren't
 * in her hand yet — her plays are drawn from a future turn and
 * retroactively applied. The reducer fakes this via a "pending
 * future" that's baked before the player's turn resolves.
 *
 * Three terminal outcomes (spec §5):
 *   - "defeated"       the one winnable path — player's deck contains
 *                      the burnt_card_placeholder; Acts 2+ unlock route.
 *   - "scripted_loss"  canonical first-playthrough — the Seer plays her
 *                      retroactive sequence and the match ends in loss.
 *   - "fled"           player conceded mid-match.
 *
 * Spec: docs/production/act1/seer-prophecy-mechanic.md.
 *
 * Lives in types/ so GameState can reference the shapes. All state
 * transitions + sampling + outcome derivation live in
 * engine/seerProphecy.ts.
 */

/** Canonical id of the card that unlocks the one winnable path.
 *  Reserved in the schema; never populated in a normal live card
 *  pool — Acts 2+ deliver it retroactively (spec §3.3). */
export const BURNT_CARD_PLACEHOLDER_ID = "burnt_card_placeholder" as const;

/** Canonical narrative flag written at match end. Regardless of
 *  outcome, the Seer's staff is witnessed — seeds the Prelude's
 *  burnt_card continuity. */
export const SEER_STAFF_WITNESSED_FLAG = "act1_seer_staff_witnessed" as const;

/** Cycle B completion flag — always set at §4.9 match end. */
export const ACT1_CYCLE_B_COMPLETE_FLAG = "act1_cycle_b_complete" as const;

/** Per-outcome narrative flags (spec §5). Exactly one is set. */
export const SEER_OUTCOME_FLAGS = {
  defeated: "act1_seer_visit_defeated",
  scripted_loss: "act1_seer_visit_scripted_loss",
  fled: "act1_seer_visit_fled",
} as const;

export type SeerOutcome = keyof typeof SEER_OUTCOME_FLAGS;

/**
 * The engine's match-internal "pending future" — the card the Seer
 * will play on her next turn, baked at the start of each player
 * turn. Read-only from card effects (spec §3.2: no feedback loop).
 */
export interface SeerPendingFuture {
  /** CardDefinition id the Seer will play. */
  cardDefId: string;
  /** Turn index the play is baked for (match turnNumber + 1). */
  turnIndex: number;
}

/**
 * Per-match §4.9 Seer state. Present on `GameState.seerProphecy`
 * only when the match was initialized with `MatchConfig.prophecyMode`.
 */
export interface SeerProphecyState {
  /** The next baked play. Null between bakes or after the Seer
   *  has played her final retroactive card. */
  pending: SeerPendingFuture | null;
  /** How many prophecy plays have been performed. Spec §4 uses
   *  6-8; the engine doesn't hard-cap here — the scripted match
   *  authors the sequence length via prophecyMode.turnCount. */
  playsPerformed: number;
}

/** Pre-match prophecy-mode opt-in. */
export interface ProphecyModeConfig {
  /**
   * How many retroactive plays the Seer makes before the scripted
   * loss resolves. Spec §4 says "6-8". Defaults to 6.
   */
  turnCount?: number;
}
