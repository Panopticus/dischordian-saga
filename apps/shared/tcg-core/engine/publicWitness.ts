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
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import type { CardDefinition, TrialCategory } from "../types/Card";
import type { ReduceCtx } from "./reducer";

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

/** Fallback public delta for cards that don't author verdict_delta. */
const PLACEHOLDER_PUBLIC_DELTA = 0;

/** Fallback public-record label for cards with no trial_categories. */
const PLACEHOLDER_PUBLIC_LABEL = "procedural";

/**
 * Map the highest-priority trial_category on a card def to a short
 * public-record label the TranscriptColumn row renders. The §5.7
 * spec lists example labels — "admission", "deflection",
 * "procedural", "confession" — matching the narrative character
 * of each category. A card may carry multiple categories; we pick
 * the single most-significant one.
 */
export function derivePublicLabel(
  def: Pick<CardDefinition, "trial_categories">,
): string {
  const cats = def.trial_categories;
  if (!cats || cats.length === 0) return PLACEHOLDER_PUBLIC_LABEL;
  // Priority order — most narratively-loaded first. A card that is
  // both evidence AND narrative reads as evidence first; a card that
  // is confession AND anything reads as confession first (spec §2.3
  // "how the court reads this play").
  const priority: readonly TrialCategory[] = [
    "confession",
    "evidence",
    "narrative",
    "reactive",
    "defensive",
    "offensive",
  ];
  for (const p of priority) {
    if (cats.includes(p)) return p;
  }
  return PLACEHOLDER_PUBLIC_LABEL;
}

/**
 * §5.7 bookkeeping counterpart to §5.8's applyTrialPlay. Called from
 * engine/playCard.ts after a successful play resolves. No-op unless
 * the match has a publicWitness state AND the actor is the Game
 * Master (side 1). The player's plays do NOT enter the verdict
 * stream — spec §5.7 §5.
 *
 * Reads the card's authored `verdict_delta` as the public delta; the
 * §5.7 public stream IS the §5.8 verdict stream (spec §6 hands the
 * final balance off as openingVerdictBalance). Private delta is
 * passed by the caller — the play's effect on the match's scoring
 * track — so the UI's divergence check has both halves.
 */
export function applyPublicWitnessPlay(
  draft: Draft<GameState>,
  def: CardDefinition,
  actor: 0 | 1,
  privateDelta: number,
  ctx: ReduceCtx,
): void {
  if (!draft.publicWitness) return;
  if (actor !== 1) return;
  // Spec §3: public delta overrides the private reading when the
  // author has set public_delta. This is what drives the §3 divergence
  // warning border on the TranscriptColumn row. Absent public_delta →
  // fall back to verdict_delta (public and private agree; no warning).
  const publicDelta = Number.isFinite(def.public_delta)
    ? (def.public_delta as number)
    : Number.isFinite(def.verdict_delta)
      ? (def.verdict_delta as number)
      : PLACEHOLDER_PUBLIC_DELTA;
  const entry: PublicWitnessEntry = {
    id: `pw_${draft.actionSeq}`,
    turnNumber: draft.turnNumber,
    publicLabel: derivePublicLabel(def),
    publicDelta,
    privateDelta,
    cardDefId: String(def.id),
  };
  // Mutate via the draft rather than replacing the reference — Immer
  // tracks the diff on the sub-object's fields, and PublicWitnessState's
  // `entries` is `readonly` in the authored type but writable within
  // a draft.
  const nextBalance = clipWitnessBalance(
    draft.publicWitness.balance + entry.publicDelta,
  );
  draft.publicWitness.balance = nextBalance;
  draft.publicWitness.entries = [
    ...draft.publicWitness.entries,
    entry,
  ];
  ctx.events.push({
    type: "scripted_action_fired",
    cardDefId: String(def.id),
    side: 1,
    globalTurn: draft.turnNumber,
  });
}
