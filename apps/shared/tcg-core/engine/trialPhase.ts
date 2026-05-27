/**
 * §5.8 Authority trial-phase mechanic — engine module.
 *
 * Pure helpers for the §5.8 Act 1 finale match. The Authority is a
 * verdict, not a duelist: it has no hand and never plays cards. Each
 * of the match's ten turns IS a trial phase that gates which cards
 * the player may play. The match's outcome is computed at turn 10
 * against the verdict-stream balance, NOT by general death.
 *
 * Spec: docs/production/act1/authority-trial-phase-mechanic.md.
 *
 * This module owns:
 *   - The phase rules table (PHASE_RULES) — which trial_categories a
 *     phase admits, plus per-phase quirks (single-play phases 2 + 9,
 *     pure-resolution phase 10).
 *   - isCardAdmissibleInPhase() — the play-time admissibility check
 *     reused by playCard.ts.
 *   - applyTrialPlay() — runs after a successful card play; updates
 *     the trial balance and the per-phase one-shot flags.
 *   - shouldForceEndPhase() — true when phases 2 / 9 have used their
 *     single play, telling the reducer to short-circuit further plays
 *     this turn.
 *   - resolveTrialOutcome() — the turn-10 verdict-threshold formula.
 *
 * The phase advancement itself happens via the standard `end_turn`
 * action; the §5.8 match doesn't need a separate phase-counter
 * because phaseNumber === turnNumber by spec §2.
 */
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import type { CardDefinition, TrialCategory } from "../types/Card";
import type { GameEvent } from "../types/Event";
import { resolveCardStakeDelta } from "./stakesResolver";
import type {
  TrialPhaseNumber,
  TrialOutcome,
  TrialState,
} from "../types/TrialPhase";

/** Number of phases / match turns. */
export const TRIAL_TOTAL_PHASES = 10 as const;

/** Verdict-threshold base + offset constants per spec §3. */
const VERDICT_BASE_THRESHOLD = -2;
const VERDICT_WARM_OFFSET = 3;
const VERDICT_COOL_OFFSET = -3;
const VERDICT_WARM_TRIGGER = 3; // openingBalance >= +3 → +3 offset
const VERDICT_COOL_TRIGGER = -3; // openingBalance <= -3 → -3 offset

/**
 * Per-card verdict-stream contribution. Spec §3 calls for "per its
 * public delta" but the per-card delta authoring hasn't landed yet
 * (open design item §7); placeholder is +1 per admissible play.
 * When the per-card deltas land, this module reads from
 * card.verdict_delta or similar; until then, +1 keeps the
 * threshold math meaningful (a player with a coherent deck and
 * no violations will land near +9, well above the default -2
 * threshold; an under-provisioned deck or pass-heavy run lands
 * lower).
 */
const PLACEHOLDER_PLAY_DELTA = 1;

/* ──────────────────────────────────────────────────────────────────── */
/*  Phase rules table                                                   */
/* ──────────────────────────────────────────────────────────────────── */

interface PhaseRule {
  /** Human-readable name for events + UI. */
  name: string;
  /**
   * Categories whose presence on a card admits it to this phase.
   * Empty array → no card is admissible (turn 10 verdict phase).
   * The check is "card has at least one matching category"; cards
   * with multiple categories can play in any phase that admits any
   * of theirs.
   */
  admittedCategories: readonly TrialCategory[];
  /**
   * If true, the phase ends after a single play (spec §2 phases 2
   * and 9 — opening + closing argument). The reducer's end-of-play
   * hook reads this to set `openingArgumentPlayed` /
   * `closingArgumentPlayed` and to fast-end the player's turn.
   */
  forceEndAfterFirstPlay: boolean;
  /**
   * If true, the phase rejects every card unconditionally. Phase
   * 10 (verdict resolution) is the only such phase. Pre-empts the
   * `admittedCategories` check.
   */
  rejectAllPlays: boolean;
}

const PHASE_RULES: Readonly<Record<TrialPhaseNumber, PhaseRule>> = {
  1: {
    name: "Charge",
    admittedCategories: ["defensive"],
    forceEndAfterFirstPlay: false,
    rejectAllPlays: false,
  },
  2: {
    name: "Opening argument",
    admittedCategories: ["narrative"],
    forceEndAfterFirstPlay: true,
    rejectAllPlays: false,
  },
  3: {
    name: "Evidence (presentation)",
    admittedCategories: ["evidence"],
    forceEndAfterFirstPlay: false,
    rejectAllPlays: false,
  },
  4: {
    name: "Evidence (cross-support)",
    admittedCategories: ["evidence"],
    forceEndAfterFirstPlay: false,
    rejectAllPlays: false,
  },
  5: {
    name: "Evidence (closing)",
    admittedCategories: ["evidence"],
    forceEndAfterFirstPlay: false,
    rejectAllPlays: false,
  },
  6: {
    name: "Cross-examination (first)",
    admittedCategories: ["reactive"],
    forceEndAfterFirstPlay: false,
    rejectAllPlays: false,
  },
  7: {
    name: "Cross-examination (second)",
    // Per spec §2 row turn 7: reactive + confession allowed.
    admittedCategories: ["reactive", "confession"],
    forceEndAfterFirstPlay: false,
    rejectAllPlays: false,
  },
  8: {
    name: "Cross-examination (closing)",
    admittedCategories: ["reactive", "confession"],
    forceEndAfterFirstPlay: false,
    rejectAllPlays: false,
  },
  9: {
    name: "Closing argument",
    admittedCategories: ["narrative"],
    forceEndAfterFirstPlay: true,
    rejectAllPlays: false,
  },
  10: {
    name: "Verdict",
    admittedCategories: [],
    forceEndAfterFirstPlay: false,
    rejectAllPlays: true,
  },
};

/** Phase number lookup helper — narrows turnNumber into the
 *  TrialPhaseNumber union if it's in range. Returns null past
 *  the trial's 10 phases (the trial machine is one-shot per
 *  spec §8). */
export function trialPhaseFromTurn(
  turnNumber: number,
): TrialPhaseNumber | null {
  if (turnNumber < 1 || turnNumber > TRIAL_TOTAL_PHASES) return null;
  return turnNumber as TrialPhaseNumber;
}

export function phaseRuleFor(phase: TrialPhaseNumber): PhaseRule {
  return PHASE_RULES[phase];
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Admissibility                                                       */
/* ──────────────────────────────────────────────────────────────────── */

/**
 * Reason a card is rejected by the current phase, suitable for
 * surfacing in the rejection toast. `null` when the card is
 * admissible. Callers map "single_play_consumed" to the
 * "no further [phase-specific-wording]" pass-button UX (spec
 * §2.2 exhaustion handling) — the engine itself just rejects.
 */
export type AdmissibilityRejection =
  | { kind: "wrong_phase_categories"; needed: readonly TrialCategory[] }
  | { kind: "card_uncategorized" }
  | { kind: "phase_rejects_all_plays" }
  | { kind: "single_play_consumed" };

/**
 * Check whether a card may be played in the current trial phase.
 * Returns null if admissible, or a structured rejection if not.
 * Callers (playCard.ts) translate the rejection into a `ReduceError
 * { code: "phase_violation" }` and emit a `trial_phase_violation`
 * event for the UI to display.
 *
 * Pure: no state mutation, no events emitted here.
 */
export function checkPhaseAdmissibility(
  trial: TrialState,
  phase: TrialPhaseNumber,
  card: CardDefinition,
): AdmissibilityRejection | null {
  const rule = PHASE_RULES[phase];

  if (rule.rejectAllPlays) {
    return { kind: "phase_rejects_all_plays" };
  }

  // Single-play phases reject after the first play has landed.
  if (
    rule.forceEndAfterFirstPlay &&
    ((phase === 2 && trial.openingArgumentPlayed) ||
      (phase === 9 && trial.closingArgumentPlayed))
  ) {
    return { kind: "single_play_consumed" };
  }

  // The card needs at least one category, AND that category must be
  // in the phase's admitted set. An empty / absent trial_categories
  // makes the card unplayable in every restricted phase (spec §6.1
  // pre-match advisory exists to warn the player before they enter
  // §5.8 with such a deck).
  const cats = card.trial_categories;
  if (!cats || cats.length === 0) {
    return { kind: "card_uncategorized" };
  }
  const admitted = new Set<string>(rule.admittedCategories);
  if (!cats.some((c) => admitted.has(c))) {
    return {
      kind: "wrong_phase_categories",
      needed: rule.admittedCategories,
    };
  }
  return null;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Post-play state mutation                                            */
/* ──────────────────────────────────────────────────────────────────── */

/**
 * Apply the post-play side effects of an admissible play to the
 * trial state. Called by playCard.ts AFTER the play succeeds:
 *  - Bumps `trialBalance` by the card's authored `verdict_delta`
 *    (or PLACEHOLDER_PLAY_DELTA when the field is absent).
 *  - Sets the single-play flag on phases 2 / 9.
 *  - Emits `trial_balance_changed` for the UI.
 *
 * No-op when `state.trial` is undefined (non-§5.8 matches) or the
 * current turn is past the trial's 10 phases.
 *
 * Takes the full CardDefinition (not just the defId) so the
 * authored per-card `verdict_delta` can be read directly without
 * a registry round-trip. Callers that have already resolved the
 * def (playCard.ts has `def` in scope) pass it through; tests can
 * construct stub defs.
 */
export function applyTrialPlay(
  draft: Draft<GameState>,
  card: CardDefinition,
  events: GameEvent[],
): void {
  if (!draft.trial) return;
  const phase = trialPhaseFromTurn(draft.turnNumber);
  if (phase === null) return;
  const rule = PHASE_RULES[phase];

  const player = draft.currentPlayer;
  const resolved = resolveCardStakeDelta(card, "verdict");
  const delta = typeof resolved === "number" ? resolved : PLACEHOLDER_PLAY_DELTA;
  draft.trial.trialBalance += delta;
  events.push({
    type: "trial_balance_changed",
    player,
    cardDefId: String(card.id),
    delta,
    newBalance: draft.trial.trialBalance,
  });

  if (rule.forceEndAfterFirstPlay) {
    if (phase === 2) draft.trial.openingArgumentPlayed = true;
    if (phase === 9) draft.trial.closingArgumentPlayed = true;
  }
}

/**
 * True when the active phase is a single-play phase (2 or 9) AND
 * the play has been consumed. The reducer's end-of-action hook
 * reads this to fast-end the player's turn — the spec's "phase
 * forcibly ends after one play regardless of remaining action
 * budget" requirement.
 *
 * Returns false on every non-trial match.
 */
export function shouldForceEndPhase(state: GameState): boolean {
  if (!state.trial) return false;
  const phase = trialPhaseFromTurn(state.turnNumber);
  if (phase === null) return false;
  if (phase === 2) return state.trial.openingArgumentPlayed;
  if (phase === 9) return state.trial.closingArgumentPlayed;
  return false;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Verdict resolution (turn 10)                                        */
/* ──────────────────────────────────────────────────────────────────── */

/**
 * Compute the turn-10 verdict outcome and write it to `trial.outcome`.
 * Idempotent: re-resolving on a match where outcome is already set
 * is a no-op. Emits `trial_verdict_resolved` exactly once.
 *
 * The reducer calls this when handleEndTurn moves the match into
 * phase 10's start (turnNumber === 10) — phase 10 has no card play
 * (spec §2 row 10), so resolution happens immediately. The match
 * doesn't end via the standard general-killed path; the campaign
 * layer is expected to read `trial.outcome` and trigger the §5.8.1
 * Last Words cutscene.
 */
export function resolveTrialOutcome(
  draft: Draft<GameState>,
  events: GameEvent[],
): void {
  if (!draft.trial) return;
  if (draft.trial.outcome) return; // idempotent

  const opening = draft.trial.openingVerdictBalance;
  const warmOffset = opening >= VERDICT_WARM_TRIGGER ? VERDICT_WARM_OFFSET : 0;
  const coolOffset = opening <= VERDICT_COOL_TRIGGER ? VERDICT_COOL_OFFSET : 0;
  const threshold = VERDICT_BASE_THRESHOLD + warmOffset + coolOffset;
  const balance = draft.trial.trialBalance;
  const outcome: TrialOutcome =
    balance >= threshold ? "overturn" : "sentence_passed";

  draft.trial.outcome = outcome;
  events.push({
    type: "trial_verdict_resolved",
    outcome,
    trialBalance: balance,
    threshold,
  });
}

/**
 * Emit a `trial_phase_started` event for the new phase. Called by
 * handleEndTurn when entering each turn 1..10 of a §5.8 match.
 * No-op for non-trial matches.
 */
export function emitPhaseStartEvent(
  state: Pick<GameState, "trial" | "turnNumber">,
  events: GameEvent[],
): void {
  if (!state.trial) return;
  const phase = trialPhaseFromTurn(state.turnNumber);
  if (phase === null) return;
  events.push({
    type: "trial_phase_started",
    phaseNumber: phase,
    phaseName: PHASE_RULES[phase].name,
  });
}
