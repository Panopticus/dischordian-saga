import { ALL_CARD_DEFINITIONS } from "../cards/index";
import { STAT_CURVE, KEYWORD_TAX, getExpectedStats, getToleranceForCost } from "./statCurve";

interface AuditResult {
  id: string;
  name: string;
  faction: string;
  cost: number;
  power: number;
  health: number;
  totalStats: number;
  keywords: string[];
  expectedStats: number;
  deviation: number;
  status: "OK" | "OVER" | "UNDER";
}

function audit(): AuditResult[] {
  const results: AuditResult[] = [];

  for (const card of ALL_CARD_DEFINITIONS) {
    if (card.cardType !== "unit" && card.cardType !== "structure") continue;
    if (!card.baseStats) continue;
    if (card.cardType === "general" as any) continue; // skip generals

    const total = card.baseStats.power + card.baseStats.health;
    const expected = getExpectedStats(card.cost, card.keywords.length);
    const tolerance = getToleranceForCost(card.cost);
    const deviation = expected === 0 ? 0 : (total - expected) / expected;

    let status: "OK" | "OVER" | "UNDER" = "OK";
    if (deviation > tolerance) status = "OVER";
    if (deviation < -tolerance) status = "UNDER";

    results.push({
      id: card.id,
      name: card.name,
      faction: card.faction,
      cost: card.cost,
      power: card.baseStats.power,
      health: card.baseStats.health,
      totalStats: total,
      keywords: [...card.keywords],
      expectedStats: expected,
      deviation: Math.round(deviation * 100),
      status,
    });
  }

  return results.sort((a, b) => a.cost - b.cost || a.deviation - b.deviation);
}

// When run directly, print the report
const results = audit();
const flagged = results.filter(r => r.status !== "OK");

console.log(`\n=== BALANCE AUDIT: ${results.length} units analyzed ===\n`);
console.log(`✓ ${results.length - flagged.length} within tolerance`);
console.log(`✗ ${flagged.length} flagged\n`);

if (flagged.length > 0) {
  console.log("FLAGGED CARDS:");
  console.log("─".repeat(100));
  for (const r of flagged) {
    const kws = r.keywords.length > 0 ? ` [${r.keywords.join(", ")}]` : "";
    console.log(
      `${r.status.padEnd(5)} | ${r.id.padEnd(30)} | ${r.name.padEnd(25)} | ` +
      `${r.faction.padEnd(14)} | cost ${r.cost} | ${r.power}/${r.health} (${r.totalStats}) | ` +
      `expected ${r.expectedStats} | ${r.deviation > 0 ? "+" : ""}${r.deviation}%${kws}`
    );
  }
}

export { audit, type AuditResult };
