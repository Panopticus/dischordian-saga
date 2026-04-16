/**
 * Trial-category proposer for §5.8 Authority match backfill.
 *
 * Reads every card in ALL_CARD_DEFINITIONS and proposes a
 * `trial_categories` set for each, using deterministic heuristics
 * over each card's faction / cardType / keywords / abilities /
 * flavorText. Output is review-grade: the proposer never modifies
 * card files. Subsequent backfill PRs apply the proposals one
 * faction at a time after user review.
 *
 * See the "Card-category metadata" item in
 * docs/production/act1/authority-trial-phase-mechanic.md §7 for
 * the contract this proposer is implementing the first half of.
 *
 * Heuristic policy (deterministic; one card may match multiple
 * categories; none required):
 *
 *   defensive: keywords include `provoke`/`taunt`/`forcefield`/
 *              `rebirth`; OR ability effect tree contains
 *              `op: "heal"` or grants `forcefield` keyword
 *
 *   offensive: keywords include `rush` or `celerity`; OR ability
 *              effect tree contains `op: "deal_damage"` or
 *              `op: "destroy"`
 *
 *   narrative: rarity is `epic` or `legendary` AND the card has
 *              a substantive flavorText (>= 40 chars); OR card id
 *              starts with `s1_song_` (song cards are pure-flavor
 *              by category convention)
 *
 *   evidence:  ability effect tree contains `op: "add_counter"`;
 *              OR flavorText contains any of: trial, record,
 *              verdict, file, report, archive, transcript,
 *              evidence, court, sentence
 *
 *   reactive:  any ability whose trigger.kind is
 *              `on_damage_taken` / `on_card_played` /
 *              `on_any_unit_dies` / `on_summoned_near_me` /
 *              `on_kill` / `on_card_drawn`
 *
 *   confession: faction is `insurgency` AND ability effect tree
 *               contains `op: "sacrifice_then"` OR self-targeting
 *               negative buff (target.kind === "self" with
 *               stats.power < 0 or stats.health < 0)
 */
import { ALL_CARD_DEFINITIONS } from "../cards/index";
import type { CardDefinition, TrialCategory } from "../types/Card";

interface Proposal {
  id: string;
  name: string;
  faction: string;
  cardType: string;
  rarity: string;
  proposed: readonly TrialCategory[];
  /** True when the heuristic produces an empty set — flagged for
   *  manual category authoring. */
  uncategorized: boolean;
}

/**
 * Walk an effect tree (or any nested ability shape) looking for
 * effect-ops or trigger.kinds matching the predicate. Loose
 * any-typing because the schema's effect tree is intentionally
 * unstructured at the TS layer (see types/Card.ts comment).
 */
function effectTreeMatches(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
  pred: (n: Record<string, unknown>) => boolean,
): boolean {
  if (!node || typeof node !== "object") return false;
  if (Array.isArray(node)) {
    return node.some((child) => effectTreeMatches(child, pred));
  }
  if (pred(node as Record<string, unknown>)) return true;
  for (const key of Object.keys(node)) {
    if (effectTreeMatches((node as Record<string, unknown>)[key], pred)) {
      return true;
    }
  }
  return false;
}

function hasEffectOp(card: CardDefinition, op: string): boolean {
  return card.abilities.some((a) =>
    effectTreeMatches(a.effect, (n) => n.op === op),
  );
}

function hasTriggerKind(card: CardDefinition, kind: string): boolean {
  return card.abilities.some(
    (a) =>
      a.trigger &&
      typeof a.trigger === "object" &&
      (a.trigger as { kind?: unknown }).kind === kind,
  );
}

function hasGrantsForcefield(card: CardDefinition): boolean {
  return card.abilities.some((a) =>
    effectTreeMatches(
      a.effect,
      (n) => n.op === "grant_keyword" && n.keyword === "forcefield",
    ),
  );
}

function hasInsurgencySelfSacrifice(card: CardDefinition): boolean {
  if (card.faction !== "insurgency") return false;
  if (hasEffectOp(card, "sacrifice_then")) return true;
  return card.abilities.some((a) =>
    effectTreeMatches(a.effect, (n) => {
      if (n.op !== "buff" && n.op !== "debuff") return false;
      const to = (n as { to?: { kind?: string } }).to;
      if (!to || to.kind !== "self") return false;
      const stats = (n as { stats?: { power?: number; health?: number } })
        .stats;
      if (!stats) return false;
      return (
        (typeof stats.power === "number" && stats.power < 0) ||
        (typeof stats.health === "number" && stats.health < 0)
      );
    }),
  );
}

const EVIDENCE_FLAVOR_TERMS = [
  "trial",
  "record",
  "verdict",
  "file",
  "report",
  "archive",
  "transcript",
  "evidence",
  "court",
  "sentence",
];

function flavorMentionsEvidence(card: CardDefinition): boolean {
  const lower = card.flavorText.toLowerCase();
  return EVIDENCE_FLAVOR_TERMS.some((t) => lower.includes(t));
}

export function proposeTrialCategories(
  card: CardDefinition,
): readonly TrialCategory[] {
  const out = new Set<TrialCategory>();

  // defensive
  if (
    card.keywords.some((k) =>
      ["provoke", "taunt", "forcefield", "rebirth"].includes(k),
    ) ||
    hasEffectOp(card, "heal") ||
    hasGrantsForcefield(card)
  ) {
    out.add("defensive");
  }

  // offensive
  if (
    card.keywords.some((k) => ["rush", "celerity"].includes(k)) ||
    hasEffectOp(card, "deal_damage") ||
    hasEffectOp(card, "destroy")
  ) {
    out.add("offensive");
  }

  // narrative
  if (
    (card.rarity === "epic" || card.rarity === "legendary") &&
    card.flavorText.trim().length >= 40
  ) {
    out.add("narrative");
  }
  if (card.id.startsWith("s1_song_")) {
    out.add("narrative");
  }

  // evidence
  if (hasEffectOp(card, "add_counter") || flavorMentionsEvidence(card)) {
    out.add("evidence");
  }

  // reactive
  for (const triggerKind of [
    "on_damage_taken",
    "on_card_played",
    "on_any_unit_dies",
    "on_summoned_near_me",
    "on_kill",
    "on_card_drawn",
  ]) {
    if (hasTriggerKind(card, triggerKind)) {
      out.add("reactive");
      break;
    }
  }

  // confession
  if (hasInsurgencySelfSacrifice(card)) {
    out.add("confession");
  }

  // Sort for stable output ordering.
  return [...out].sort();
}

export function proposeAll(): Proposal[] {
  return ALL_CARD_DEFINITIONS.map((card) => {
    const proposed = proposeTrialCategories(card);
    return {
      id: card.id,
      name: card.name,
      faction: card.faction,
      cardType: card.cardType,
      rarity: card.rarity,
      proposed,
      uncategorized: proposed.length === 0,
    };
  });
}

export interface FactionSummary {
  faction: string;
  total: number;
  uncategorized: number;
  byCategory: Record<TrialCategory, number>;
}

const ALL_CATEGORIES: readonly TrialCategory[] = [
  "defensive",
  "offensive",
  "narrative",
  "evidence",
  "reactive",
  "confession",
];

export function summarizeByFaction(
  proposals: readonly Proposal[],
): FactionSummary[] {
  const byFaction = new Map<string, FactionSummary>();
  for (const p of proposals) {
    let s = byFaction.get(p.faction);
    if (!s) {
      s = {
        faction: p.faction,
        total: 0,
        uncategorized: 0,
        byCategory: Object.fromEntries(
          ALL_CATEGORIES.map((c) => [c, 0]),
        ) as Record<TrialCategory, number>,
      };
      byFaction.set(p.faction, s);
    }
    s.total += 1;
    if (p.uncategorized) s.uncategorized += 1;
    for (const c of p.proposed) s.byCategory[c] += 1;
  }
  return Array.from(byFaction.values()).sort((a, b) =>
    a.faction.localeCompare(b.faction),
  );
}
