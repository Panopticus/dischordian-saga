/**
 * Second-pass trial-category categorizer for §5.8 backfill.
 *
 * Runs after the main proposer (./trialCategoryProposer.ts) on cards
 * the main proposer left uncategorized, applying a richer rule set
 * over the same card fields. Kept in a separate module so the
 * conservative first-pass heuristics stay untouched and reviewable.
 *
 * Authored as part of the manual-categorization pass that follows
 * PR #61's antiquarian backfill — the main proposer left 196 cards
 * empty (32% of the pool) because its rules are deliberately
 * conservative; this second pass classifies the obvious patterns
 * the main pass intentionally skipped, then leaves any residual
 * cards to a hand-authored manual override map
 * (./manualTrialCategoryOverrides.ts).
 *
 * Rule rationale (per pattern → category mapping):
 *
 *   defensive
 *     - `buff` op (any positive stat to ally or self) — building up
 *        board state is defensive in the §5.8 charge phase
 *     - `summon` op — board presence absorbs the opening exchange
 *     - `drain` keyword — lifesteal restores survivability
 *     - `grant_keyword` op for a defensive-leaning keyword
 *
 *   offensive
 *     - `debuff` op — reducing enemy stats opens attack windows
 *     - `silence` / `stun` op — disabling enemies is an attack vector
 *     - `discard` op (any) — pruning enemy hand removes their plays
 *     - `return_to_hand` op — bouncing enemies clears the field
 *     - `airdrop` / `flying` keyword — positional aggression
 *     - `backstab` / `pierce` / `dispel` keyword — damage modifiers
 *
 *   narrative
 *     - `draw` op — drawing extra cards is the §5.8 narrative-phase
 *        tempo verb (opening / closing arguments)
 *     - `gain_mana` op — same tempo basis
 *     - `teleport` op — positional rewriting reads as narrative
 *        re-staging
 *     - `sacrifice_then` op on non-insurgency factions — the
 *        sacrifice frame itself is narrative; insurgency keeps
 *        confession via the main proposer
 *     - rarity ∈ {rare, epic, legendary} AND flavor ≥ 40 chars —
 *        substantive flavor on a non-trivial card; the main
 *        proposer requires epic/legendary, this loosens to rare
 *
 *   evidence
 *     - flavor mentions any of: catalog, chronicle, archive,
 *       memoir, witness, testimony (extends the main proposer's
 *       evidence-flavor list with antiquarian-leaning terms)
 *
 *   reactive
 *     - trigger.kind ∈ {`on_death`, `on_damage_dealt`} — the main
 *        proposer's reactive list omits these because they're
 *        common; the §5.8 cross-examination phase wants the broader
 *        sense of "responds to a triggered event"
 *     - `deathwatch` keyword — reactive to deaths anywhere
 *
 *   confession
 *     - reserved for the main proposer (insurgency-scoped); this
 *        pass does not extend it (per §5.8 spec the confession
 *        category is rarity-bounded)
 *
 * The combined output (main + second-pass) covers the bulk of the
 * pool. Whatever remains uncategorized after both passes is handled
 * by ./manualTrialCategoryOverrides.ts — a small hand-authored map.
 */
import type { CardDefinition, TrialCategory } from "../types/Card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function effectTreeMatches(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
  pred: (n: Record<string, unknown>) => boolean,
): boolean {
  if (!node || typeof node !== "object") return false;
  if (Array.isArray(node)) {
    return node.some((c) => effectTreeMatches(c, pred));
  }
  if (pred(node as Record<string, unknown>)) return true;
  for (const k of Object.keys(node)) {
    if (effectTreeMatches((node as Record<string, unknown>)[k], pred)) {
      return true;
    }
  }
  return false;
}

function hasOp(card: CardDefinition, op: string): boolean {
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

const EVIDENCE_FLAVOR_TERMS_EXTENDED = [
  "catalog",
  "chronicle",
  "archive",
  "memoir",
  "witness",
  "testimony",
];

function flavorMentionsExtendedEvidence(card: CardDefinition): boolean {
  const lower = card.flavorText.toLowerCase();
  return EVIDENCE_FLAVOR_TERMS_EXTENDED.some((t) => lower.includes(t));
}

const DEFENSIVE_GRANT_KEYWORDS = new Set([
  "provoke",
  "taunt",
  "forcefield",
  "rebirth",
  "drain",
]);

function grantsDefensiveKeyword(card: CardDefinition): boolean {
  return card.abilities.some((a) =>
    effectTreeMatches(a.effect, (n) => {
      if (n.op !== "grant_keyword") return false;
      const kw = (n as { keyword?: unknown }).keyword;
      return typeof kw === "string" && DEFENSIVE_GRANT_KEYWORDS.has(kw);
    }),
  );
}

const OFFENSIVE_KEYWORDS = new Set([
  "airdrop",
  "flying",
  "backstab",
  "pierce",
  "dispel",
]);

function isInsurgencySacrifice(card: CardDefinition): boolean {
  // Mirrors the main proposer's confession-trigger so we don't
  // double-count: insurgency self-sacrifice belongs to confession,
  // not narrative.
  return card.faction === "insurgency" && hasOp(card, "sacrifice_then");
}

export function secondPassTrialCategorize(
  card: CardDefinition,
): readonly TrialCategory[] {
  const out = new Set<TrialCategory>();

  // ---- defensive ----
  if (
    hasOp(card, "buff") ||
    hasOp(card, "summon") ||
    card.keywords.includes("drain") ||
    grantsDefensiveKeyword(card)
  ) {
    out.add("defensive");
  }

  // ---- offensive ----
  if (
    hasOp(card, "debuff") ||
    hasOp(card, "silence") ||
    hasOp(card, "stun") ||
    hasOp(card, "discard") ||
    hasOp(card, "return_to_hand") ||
    card.keywords.some((k) => OFFENSIVE_KEYWORDS.has(k))
  ) {
    out.add("offensive");
  }

  // ---- narrative ----
  if (hasOp(card, "draw") || hasOp(card, "gain_mana") || hasOp(card, "teleport")) {
    out.add("narrative");
  }
  if (hasOp(card, "sacrifice_then") && !isInsurgencySacrifice(card)) {
    out.add("narrative");
  }
  if (
    (card.rarity === "rare" ||
      card.rarity === "epic" ||
      card.rarity === "legendary") &&
    card.flavorText.trim().length >= 40
  ) {
    out.add("narrative");
  }

  // ---- evidence ----
  if (flavorMentionsExtendedEvidence(card)) {
    out.add("evidence");
  }

  // ---- reactive ----
  if (
    hasTriggerKind(card, "on_death") ||
    hasTriggerKind(card, "on_damage_dealt") ||
    card.keywords.includes("deathwatch")
  ) {
    out.add("reactive");
  }

  return [...out].sort();
}
