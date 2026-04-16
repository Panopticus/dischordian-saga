/**
 * Verdict-delta proposer for the §5.8 Authority trial.
 *
 * Mirrors the shape of ./trialCategoryProposer.ts: reads every card in
 * ALL_CARD_DEFINITIONS and proposes a `verdict_delta` integer per
 * card using deterministic heuristics over its trial_categories,
 * rarity, and card type. Output is review-grade; the proposer never
 * modifies card files. A subsequent backfill PR applies the proposals
 * after user review (see apps/scripts/apply-verdict-deltas.ts).
 *
 * Rationale: PR #65 landed the §5.8 engine with a +1 placeholder per
 * admissible play. Real per-card deltas are spec §7 open design item.
 * The per-category heuristic below refines the balance math: narrative
 * plays at the opening / closing argument phases weigh more than
 * routine evidence plays, confessions carry a negative sign (the
 * player trades private-scoring for verdict-stream advantage per
 * spec §2 turn 7), and uncategorized cards contribute 0 (since they
 * can't legally play in any phase anyway).
 *
 * Heuristic table (applied in order; first match wins):
 *
 *   confession present           → -2  (trade-off per spec turn 7)
 *   narrative AND rare/epic/leg. → +2  (set-piece argument plays
 *                                        land with extra weight)
 *   narrative                    → +1
 *   evidence AND epic/legendary  → +2
 *   evidence                     → +1
 *   reactive                     → +1
 *   defensive                    → +1
 *   other non-empty category     → +1  (fallback for future categories)
 *   uncategorized                →  0
 *
 * The clamp [-3, +3] matches the Zod schema bound.
 */
import { ALL_CARD_DEFINITIONS } from "../cards/index";
import type { CardDefinition, TrialCategory } from "../types/Card";

export interface VerdictDeltaProposal {
  id: string;
  name: string;
  faction: string;
  rarity: string;
  categories: readonly TrialCategory[];
  proposed: number;
}

const DELTA_MIN = -3;
const DELTA_MAX = 3;

export function proposeVerdictDelta(card: CardDefinition): number {
  const cats = new Set<string>(card.trial_categories ?? []);
  const rarity = card.rarity;
  const isHighRarity =
    rarity === "rare" || rarity === "epic" || rarity === "legendary";
  const isEpicLegendary = rarity === "epic" || rarity === "legendary";

  let delta: number;
  if (cats.has("confession")) {
    // Spec §2 turn 7: confessions trade private-scoring for verdict-
    // stream advantage. The negative sign captures the COST side; the
    // benefit is baked into phase 7's admissibility. Net effect during
    // a §5.8 match: the player who leans into confession plays pays
    // for them in the verdict balance.
    delta = -2;
  } else if (cats.has("narrative") && isHighRarity) {
    delta = 2;
  } else if (cats.has("narrative")) {
    delta = 1;
  } else if (cats.has("evidence") && isEpicLegendary) {
    delta = 2;
  } else if (cats.has("evidence")) {
    delta = 1;
  } else if (cats.has("reactive")) {
    delta = 1;
  } else if (cats.has("defensive")) {
    delta = 1;
  } else if (cats.size > 0) {
    // offensive-only or any other non-empty set falls through here.
    // Offensive cards don't play in §5.8 (no phase admits them), but
    // we still author a placeholder in case future phases change.
    delta = 1;
  } else {
    // Uncategorized cards are unplayable in every §5.8 phase, so this
    // field is informational only for them.
    delta = 0;
  }

  // Clamp to schema bound defensively (all current rules produce
  // in-range values, but future rules could overflow).
  return Math.max(DELTA_MIN, Math.min(DELTA_MAX, delta));
}

export function proposeAllVerdictDeltas(): VerdictDeltaProposal[] {
  return ALL_CARD_DEFINITIONS.map((card) => ({
    id: String(card.id),
    name: card.name,
    faction: card.faction,
    rarity: card.rarity,
    categories: card.trial_categories ?? [],
    proposed: proposeVerdictDelta(card),
  }));
}

export interface VerdictDeltaSummary {
  total: number;
  byDelta: Record<number, number>;
  byFaction: Record<string, Record<number, number>>;
}

export function summarizeVerdictDeltas(
  proposals: readonly VerdictDeltaProposal[],
): VerdictDeltaSummary {
  const byDelta: Record<number, number> = {};
  const byFaction: Record<string, Record<number, number>> = {};
  for (const p of proposals) {
    byDelta[p.proposed] = (byDelta[p.proposed] ?? 0) + 1;
    byFaction[p.faction] ??= {};
    byFaction[p.faction][p.proposed] =
      (byFaction[p.faction][p.proposed] ?? 0) + 1;
  }
  return { total: proposals.length, byDelta, byFaction };
}
