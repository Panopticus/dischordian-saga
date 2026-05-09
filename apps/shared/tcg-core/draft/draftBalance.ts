/* ═══════════════════════════════════════════════════════
   DRAFT BALANCE
   audit/16 PR 20 (finding TCG2 — TCG persona).

   Pre-audit, draft tournaments had rarity escalation
   (legendary weight grows linearly with pickNumber) but no
   counterweights against:
     - greedy decks: AI happy to pile on legendaries because
       picking high-value cards is locally optimal
     - removal scarcity: nothing tracks how many removal spells
       are already in a player's pool, so pack 8 might be
       another removal in a deck that already has six
     - unbounded legendary weight: the existing formula caps
       at +5, but deck-construction outcomes still reward
       early-pick legendary spam past the audit'd-OK point

   This module provides pure helpers the draft code uses to
   stay within the audit'd balance windows. Schema-only ship
   for the AI penalty path; the draft page wires the helpers
   in via a follow-up — the substrate lives here so the
   helpers can be unit-tested without React.
   ═══════════════════════════════════════════════════════ */

/** Names of effect ops that constitute "removal" — direct
 *  damage that can kill a unit, hard control like silence /
 *  banish / destroy, or stat-debuffs that reduce a unit's
 *  toughness below 1. The draft AI uses this set to count
 *  removal density per pool. */
export const REMOVAL_OP_NAMES: ReadonlySet<string> = new Set([
  "deal_damage",
  "destroy",
  "banish",
  "silence",
  "transform_into_token",
  "return_to_hand",
  // Stat-debuff to zero toughness behaves as removal in
  // practice; the draft heuristic treats it equivalently.
  "set_stats_zero",
]);

/** Loose card shape — the draft consumer can pass either a
 *  full CardDefinition or a slimmed DraftCard. */
export interface DraftBalanceCard {
  id: string;
  rarity?: string | null;
  /** Names of effect ops this card uses. The draft consumer
   *  walks the card's effect tree once and passes the flat
   *  set; the helper doesn't re-walk the tree per call. */
  opNames?: ReadonlySet<string> | readonly string[];
}

/** Returns true iff the card uses any removal op. */
export function isRemovalCard(card: DraftBalanceCard): boolean {
  if (!card.opNames) return false;
  const ops = card.opNames instanceof Set
    ? card.opNames
    : new Set<string>(card.opNames);
  for (const op of REMOVAL_OP_NAMES) {
    if (ops.has(op)) return true;
  }
  return false;
}

/** Count removals in a card pool (deck or pack). */
export function countRemovals(pool: readonly DraftBalanceCard[]): number {
  return pool.filter(isRemovalCard).length;
}

/* ─── Scarcity tracking (TCG2 subA) ─────────────────────── */

/** Returns the per-rarity count of cards already in the draft
 *  pool. Useful for the UI's "you have X uncommons / Y rares"
 *  surface. */
export function rarityBreakdown(
  pool: readonly DraftBalanceCard[],
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const card of pool) {
    const r = card.rarity ?? "unknown";
    counts[r] = (counts[r] ?? 0) + 1;
  }
  return counts;
}

/* ─── Legendary weight cap (TCG2 subB) ──────────────────── */

/** Audit'd ceiling on legendary weight in the per-pack
 *  rarity distribution. Pre-audit the formula was
 *  `5 + min(pickNumber * 0.3, 5)` — capped at 10 — but the
 *  audit found the rate of legendary-into-pack at later
 *  picks rewarded greedy deck construction. Cap formula at
 *  this value so the player can still see a legendary when
 *  drafting late, but the rate doesn't compound. */
export const LEGENDARY_WEIGHT_CAP = 8;

/** Cap a draft-pack rarity-weights map's legendary entry to
 *  the audited ceiling. Mutates the input for ergonomic chain
 *  use; returns it. */
export function capLegendaryWeight(
  weights: Record<string, number>,
): Record<string, number> {
  if (typeof weights.legendary === "number" && weights.legendary > LEGENDARY_WEIGHT_CAP) {
    weights.legendary = LEGENDARY_WEIGHT_CAP;
  }
  return weights;
}

/* ─── Greedy-deck AI penalty (TCG2 subC) ────────────────── */

/** Audit'd thresholds: when the deck has > N legendaries OR
 *  > M removals, the AI picker should penalise further picks
 *  of the same kind. Tuning knobs from the audit's
 *  recommended starting values; balance team can iterate. */
export const GREEDY_LEGENDARY_THRESHOLD = 3;
export const GREEDY_REMOVAL_THRESHOLD = 4;

/** Penalty applied to the AI's per-card pick score when the
 *  card would push the deck past a greedy threshold. The AI's
 *  pick score is computed elsewhere; this helper subtracts
 *  the penalty from that score. Negative is correct; the AI's
 *  picker selects the highest-scored card. */
export const GREEDY_PENALTY = 15;

export function greedyDeckPenalty(
  card: DraftBalanceCard,
  currentDeck: readonly DraftBalanceCard[],
): number {
  let penalty = 0;
  // Greedy on legendaries: the AI bot was happy to pile on
  // legendaries past the deck's actual mana curve.
  if (card.rarity === "legendary") {
    const legendaryCount = currentDeck.filter((c) => c.rarity === "legendary").length;
    if (legendaryCount >= GREEDY_LEGENDARY_THRESHOLD) {
      penalty += GREEDY_PENALTY;
    }
  }
  // Greedy on removals: a deck with too many removals can't
  // close out games (no proactive damage / threats).
  if (isRemovalCard(card)) {
    const removalCount = countRemovals(currentDeck);
    if (removalCount >= GREEDY_REMOVAL_THRESHOLD) {
      penalty += GREEDY_PENALTY;
    }
  }
  return penalty;
}
