/**
 * Dump every card the trial-category proposer left uncategorized to
 * stdout as JSON, with the fields needed to make a manual category
 * decision. Used during the §5.8 backfill manual-categorization pass.
 *
 * Run:  tsx apps/scripts/dump-uncategorized.ts > /tmp/uncat.json
 */
import { proposeAll } from "../shared/tcg-core/balance/trialCategoryProposer";
import { ALL_CARD_DEFINITIONS } from "../shared/tcg-core/cards/index";

interface UncatRow {
  id: string;
  name: string;
  faction: string;
  cardType: string;
  rarity: string;
  cost: number;
  keywords: readonly string[];
  abilityTriggers: readonly string[];
  abilityOps: readonly string[];
  flavorText: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collectOps(node: any, out: Set<string>): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const c of node) collectOps(c, out);
    return;
  }
  if (typeof node.op === "string") out.add(node.op);
  for (const k of Object.keys(node)) collectOps(node[k], out);
}

function rowFor(card: (typeof ALL_CARD_DEFINITIONS)[number]): UncatRow {
  const triggers = new Set<string>();
  const ops = new Set<string>();
  for (const a of card.abilities) {
    if (a.trigger && typeof a.trigger === "object") {
      const k = (a.trigger as { kind?: unknown }).kind;
      if (typeof k === "string") triggers.add(k);
    }
    collectOps(a.effect, ops);
  }
  return {
    id: card.id,
    name: card.name,
    faction: card.faction,
    cardType: card.cardType,
    rarity: card.rarity,
    cost: card.cost,
    keywords: card.keywords,
    abilityTriggers: [...triggers].sort(),
    abilityOps: [...ops].sort(),
    flavorText: card.flavorText,
  };
}

function main(): void {
  const uncat = proposeAll().filter((p) => p.uncategorized);
  const byId = new Map<string, (typeof ALL_CARD_DEFINITIONS)[number]>();
  for (const c of ALL_CARD_DEFINITIONS) byId.set(c.id, c);
  const rows: UncatRow[] = uncat
    .map((p) => byId.get(p.id))
    .filter((c): c is (typeof ALL_CARD_DEFINITIONS)[number] => Boolean(c))
    .map(rowFor);
  console.log(JSON.stringify(rows, null, 2));
}

main();
