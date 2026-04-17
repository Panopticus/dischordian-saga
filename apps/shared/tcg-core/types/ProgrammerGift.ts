/**
 * §5.6 Programmer match — gift-mechanic type definitions.
 *
 * Cycle C step 10 of the Act 1 ladder. The Programmer is the
 * Engineer's oldest friend; canonically he deliberately throws
 * the match and the player can either accept the gift or decline
 * and fight on honest terms. The choice raises a persistent
 * campaign flag that Act 2+ codex variants read.
 *
 * Spec: ACT1_NARRATIVE_STRUCTURE.md §5.6.
 * Roadmap: ALL_ACTS_ROADMAP.md Cycle C row 10.
 *
 * Lives in types/ (not engine/) for the same reason TrialPhase
 * does: GameState references the state shape and types/ has no
 * engine/ imports. The state machine itself lives in
 * engine/programmerGift.ts.
 */

/**
 * Life cycle of the gift.
 *
 *   not_offered → offered → accepted | declined
 *
 * The Programmer's AI raises the `offered` transition at a
 * scripted point in the match. Player choice drives the final
 * transition; once it lands, the state is terminal.
 */
export type ProgrammerGiftStatus =
  | "not_offered"
  | "offered"
  | "accepted"
  | "declined";

/**
 * Per-match §5.6 gift state. Present on `GameState.programmerGift`
 * only when the match was initialized with `MatchConfig.giftMode`.
 * Standard matches leave this absent.
 */
export interface ProgrammerGiftState {
  /** Current transition of the lifecycle. */
  status: ProgrammerGiftStatus;
  /**
   * Turn number on which the gift was offered (spec §2 timing
   * reference). Absent while status === "not_offered".
   */
  offeredOnTurn?: number;
  /**
   * Turn number on which the player made the choice. Absent
   * until a terminal transition fires.
   */
  resolvedOnTurn?: number;
}

/** Pre-match gift-mode opt-in. Carried on MatchConfig and consumed
 *  by createMatchState, parallel to TrialModeConfig. Absent on
 *  standard matches. */
export interface GiftModeConfig {
  /**
   * Earliest turn on which the Programmer AI is allowed to offer
   * the gift. Defaults to 3 — the Programmer opens with two
   * legitimate plays before making the gesture (spec §2).
   */
  earliestOfferTurn?: number;
}

/**
 * Canonical campaign flag the terminal transition writes. Acts 2+
 * codex variants read this to branch the Programmer's Last Words
 * framing — a single source of truth so the spelling can't drift.
 */
export const PROGRAMMER_GIFT_ACCEPTED_FLAG = "act1_programmer_gift_accepted" as const;
