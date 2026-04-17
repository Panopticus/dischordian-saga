/**
 * Dry-run: report how many of the proposer-uncategorized cards the
 * second-pass categorizer catches. Pure inspection; never writes.
 *
 * Run:  tsx apps/scripts/dry-run-second-pass.ts
 */
import { proposeAll } from "../shared/tcg-core/balance/trialCategoryProposer";
import { secondPassTrialCategorize } from "../shared/tcg-core/balance/secondPassTrialCategorizer";
import { ALL_CARD_DEFINITIONS } from "../shared/tcg-core/cards/index";

function main(): void {
  const proposals = proposeAll();
  const byId = new Map<string, (typeof ALL_CARD_DEFINITIONS)[number]>();
  for (const c of ALL_CARD_DEFINITIONS) byId.set(c.id, c);

  const stillUncat: string[] = [];
  let caught = 0;
  const byFactionCaught: Record<string, number> = {};
  const byFactionMissed: Record<string, number> = {};

  for (const p of proposals) {
    if (!p.uncategorized) continue;
    const card = byId.get(p.id);
    if (!card) continue;
    const sp = secondPassTrialCategorize(card);
    if (sp.length > 0) {
      caught++;
      byFactionCaught[p.faction] = (byFactionCaught[p.faction] ?? 0) + 1;
    } else {
      stillUncat.push(p.id);
      byFactionMissed[p.faction] = (byFactionMissed[p.faction] ?? 0) + 1;
    }
  }

  console.log(
    `\nSecond-pass coverage:\n` +
      `  caught:  ${caught}\n` +
      `  missed:  ${stillUncat.length}\n` +
      `  total:   ${caught + stillUncat.length}\n`,
  );
  console.log("Caught by faction:", byFactionCaught);
  console.log("Missed by faction:", byFactionMissed);
  console.log(
    `\nStill-uncategorized card IDs (manual override required):\n  ${stillUncat.join("\n  ")}`,
  );
}

main();
