/**
 * Compose the three trial-category passes into a single resolver.
 *
 * Pipeline (in order, later passes additive):
 *   1. `proposeTrialCategories` — main deterministic heuristic
 *      (keywords, effect ops, flavor terms; defensive/offensive/
 *      narrative/evidence/reactive/confession).
 *   2. `secondPassTrialCategorize` — richer ruleset over the same
 *      shape that picks up cards the first pass leaves empty.
 *   3. `MANUAL_TRIAL_CATEGORIES` — hand-authored overrides for
 *      the residual cards that neither heuristic catches
 *      (vanilla imprints, faction tokens, a couple of
 *      grant-keyword utility spells).
 *
 * Outputs the sorted union of every category any pass produces,
 * and never returns an empty list: if all three passes miss a
 * card, the resolver raises a loud error so CI catches the hole
 * before §5.8 admissibility checks run against a silently-empty
 * deck. Per spec §5.8 §6.1, an uncategorized card is unplayable
 * in every restricted phase — a silent uncategorized card is
 * worse than no card at all.
 */
import type { CardDefinition, TrialCategory } from "../types/Card";
import { proposeTrialCategories } from "./trialCategoryProposer";
import { secondPassTrialCategorize } from "./secondPassTrialCategorizer";
import { MANUAL_TRIAL_CATEGORIES } from "./manualTrialCategoryOverrides";

const CATEGORY_ORDER: readonly TrialCategory[] = [
  "confession",
  "defensive",
  "evidence",
  "narrative",
  "offensive",
  "reactive",
];

function sortCategories(cats: Iterable<TrialCategory>): readonly TrialCategory[] {
  const set = new Set(cats);
  return CATEGORY_ORDER.filter((c) => set.has(c));
}

/**
 * Resolve the effective trial_categories for a single card. If the
 * card already declares its own `trial_categories`, that authored
 * list wins — the resolver only fills holes.
 */
export function resolveTrialCategories(
  card: CardDefinition,
): readonly TrialCategory[] {
  if (card.trial_categories && card.trial_categories.length > 0) {
    return sortCategories(card.trial_categories);
  }

  const acc = new Set<TrialCategory>();
  for (const c of proposeTrialCategories(card)) acc.add(c);
  for (const c of secondPassTrialCategorize(card)) acc.add(c);
  const manual = MANUAL_TRIAL_CATEGORIES[card.id];
  if (manual) for (const c of manual) acc.add(c);
  return sortCategories(acc);
}

/**
 * Card ids that the resolver could not categorize — i.e. every pass
 * returned empty AND the manual overrides table has no row. Any id
 * in this list is a silent §5.8 admissibility hazard; CI should
 * refuse to boot a registry with residuals.
 */
export function findUncategorizedCards(
  cards: readonly CardDefinition[],
): readonly string[] {
  const out: string[] = [];
  for (const c of cards) {
    if (resolveTrialCategories(c).length === 0) out.push(c.id);
  }
  return out;
}
