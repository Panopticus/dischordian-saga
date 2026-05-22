/* ═══════════════════════════════════════════════════════
   THE QUESTION — Mission 4 (Week 4)
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3 mission detail

   The deepest mission mechanically. The Human takes the
   player into the substrate-dive bay and asks a question
   composed from the player's own Witnessing record. Seven
   turns. The Human's deck is *generated server-side* from
   the cards the player played in Acts 3–6.

   The match has no traditional win condition; it ends after
   7 turns. The player's verdict-delta at end-of-turn-7 IS
   the answer.

   Pass:   verdictDelta !== 0 (the player committed —
           both high-positive and high-negative pass)
   Reward: humanConfessionWeight = 1.5
   Fail penalty: humanConfessionWeight stays at baseline 1.0
           (per plan: also no `the_humans_chip` unlock and
           no Confession-phase romance tag, but those are
           Sprint-9 surfaces gated on this row's status)

   Two surfaces here:
     1. scoreTheQuestion(submission) — pass/fail scorer
     2. generateTheQuestionDeck(record, fallback, opts) —
        the server-authoritative deck generator
   ═══════════════════════════════════════════════════════ */

import type { MissionEvaluation } from "../registry";

/* ─── SCORING ─── */

export interface TheQuestionSubmission {
  /** Verdict-delta at end-of-turn-7. Sign carries meaning:
   *  positive = player answered "yes"; negative = "no". Zero =
   *  the player played neutrally and didn't commit. */
  verdictDelta: number;
  /** The actual number of turns played. Must equal 7. */
  turnsPlayed: number;
}

/** Pass requires *some* commitment — perfectly-neutral play fails. */
export function scoreTheQuestion(
  submission: TheQuestionSubmission,
): MissionEvaluation {
  if (!Number.isFinite(submission.verdictDelta)) {
    return {
      passed: false,
      reason: "verdictDelta must be finite.",
      penalties: { humanConfessionWeight: 1.0 },
    };
  }
  if (submission.turnsPlayed !== 7) {
    return {
      passed: false,
      reason: `The Question is 7 turns; got ${submission.turnsPlayed}.`,
      penalties: { humanConfessionWeight: 1.0 },
    };
  }
  if (submission.verdictDelta === 0) {
    return {
      passed: false,
      reason:
        "Verdict-delta is zero — you didn't commit. The Human did not get an answer.",
      penalties: { humanConfessionWeight: 1.0 },
    };
  }
  const answer = submission.verdictDelta > 0 ? "Yes" : "No";
  return {
    passed: true,
    reason: `Answered: ${answer} (delta ${submission.verdictDelta}).`,
    rewards: { humanConfessionWeight: 1.5 },
  };
}

/* ─── DECK GENERATION ─── */

/**
 * Minimal card shape the generator operates on. Decouples the
 * generator from the full CardDefinition so it stays pure +
 * easily testable. The service materialises real
 * CardDefinitions and projects them to this shape before calling
 * the generator.
 */
export interface WitnessCard {
  id: string;
  trialCategories: readonly string[];
}

/**
 * A play record: one entry per card-play in the player's history.
 * Same card-id can appear multiple times (one entry per play).
 */
export type WitnessRecord = readonly WitnessCard[];

export interface GenerateDeckOptions {
  /** Total deck size. Plan says 20. */
  deckSize?: number;
  /** Minimum confession-category cards in the output. Plan says 10. */
  minConfession?: number;
  /**
   * Pool of confession-category cards to fall back on when the
   * player's history is short. The service supplies the actual
   * registry's confession-category cards.
   */
  fallbackConfessionPool?: readonly WitnessCard[];
  /**
   * Pool of any-category cards to fall back on when the player's
   * history doesn't have enough total plays.
   */
  fallbackAnyPool?: readonly WitnessCard[];
}

export interface GeneratedDeck {
  cards: readonly WitnessCard[];
  /** True iff the deck satisfies the minConfession constraint. */
  confessionCount: number;
  /** True iff any cards came from a fallback pool (i.e. the player's
   *  history didn't fully populate). */
  usedFallback: boolean;
}

const DEFAULT_DECK_SIZE = 20;
const DEFAULT_MIN_CONFESSION = 10;

/**
 * Generate The Human's deck from the player's Witnessing record.
 * Pure / deterministic. Given the same inputs, returns the same
 * deck.
 *
 * Algorithm:
 *   1. Count play frequency per card-id in `record`.
 *   2. Order ids by frequency descending, then by id ascending for
 *      stable ties.
 *   3. Pick the top `minConfession` confession-category cards from
 *      the player's history. Fall back to `fallbackConfessionPool`
 *      if the player hasn't played enough confession-category cards.
 *   4. Fill the remaining `deckSize - minConfession` slots with any
 *      top-played cards (any category, including more confession-
 *      cards if available). Fall back to `fallbackAnyPool` if still
 *      short.
 *   5. Return.
 *
 * If both fallback pools are empty and the player's history is too
 * short, returns a partial deck with `usedFallback: false` and a
 * confessionCount below the minimum. Callers (the service) inspect
 * confessionCount to decide whether the player has earned the
 * opportunity to attempt the mission yet.
 */
export function generateTheQuestionDeck(
  record: WitnessRecord,
  options: GenerateDeckOptions = {},
): GeneratedDeck {
  const deckSize = options.deckSize ?? DEFAULT_DECK_SIZE;
  const minConfession = Math.min(options.minConfession ?? DEFAULT_MIN_CONFESSION, deckSize);
  const fallbackConfessionPool = options.fallbackConfessionPool ?? [];
  const fallbackAnyPool = options.fallbackAnyPool ?? [];

  // Build frequency-sorted list of unique cards from the player's
  // history.
  const freq = new Map<string, { card: WitnessCard; plays: number }>();
  for (const card of record) {
    const existing = freq.get(card.id);
    if (existing) {
      existing.plays += 1;
    } else {
      freq.set(card.id, { card, plays: 1 });
    }
  }
  const ranked = Array.from(freq.values()).sort((a, b) => {
    if (b.plays !== a.plays) return b.plays - a.plays;
    return a.card.id.localeCompare(b.card.id);
  });

  const isConfession = (c: WitnessCard) =>
    c.trialCategories.includes("confession");

  // Step 3: confession picks from history.
  const cards: WitnessCard[] = [];
  const used = new Set<string>();
  let usedFallback = false;

  for (const entry of ranked) {
    if (cards.length >= minConfession) break;
    if (!isConfession(entry.card)) continue;
    cards.push(entry.card);
    used.add(entry.card.id);
  }

  // Backfill confession slots from the fallback pool, also
  // deterministic by id-ascending order.
  if (cards.length < minConfession) {
    const sortedFallback = [...fallbackConfessionPool].sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    for (const card of sortedFallback) {
      if (cards.length >= minConfession) break;
      if (used.has(card.id)) continue;
      cards.push(card);
      used.add(card.id);
      usedFallback = true;
    }
  }

  // Step 4: fill the rest from any top-played cards.
  for (const entry of ranked) {
    if (cards.length >= deckSize) break;
    if (used.has(entry.card.id)) continue;
    cards.push(entry.card);
    used.add(entry.card.id);
  }

  // Final backfill from the any-pool.
  if (cards.length < deckSize) {
    const sortedAny = [...fallbackAnyPool].sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    for (const card of sortedAny) {
      if (cards.length >= deckSize) break;
      if (used.has(card.id)) continue;
      cards.push(card);
      used.add(card.id);
      usedFallback = true;
    }
  }

  const confessionCount = cards.filter(isConfession).length;
  return { cards, confessionCount, usedFallback };
}
