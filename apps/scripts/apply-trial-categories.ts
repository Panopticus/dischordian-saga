/**
 * Bulk apply trial-category proposer suggestions to card source files.
 *
 * Reads proposeAll() output, then for each card with non-empty proposed
 * categories that does NOT already have trial_categories in its source
 * file, locates the card's `id: "..."` line, walks forward to find the
 * matching `rulesVersion: "..."` line, and inserts a single new line
 * after it:
 *
 *     trial_categories: ["...", "..."] as const,
 *
 * Indentation matches the surrounding `rulesVersion:` line. Skips cards
 * whose proposed set is empty (those need manual authoring) and cards
 * whose source file already contains a `trial_categories:` line for
 * that card (idempotent — safe to re-run).
 *
 * Run:  tsx apps/scripts/apply-trial-categories.ts [--faction <name>] [--dry-run]
 *
 *   --faction X   only apply for faction X (architect/dreamer/etc.). Omit for all.
 *   --dry-run     report what would change without writing files.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { proposeAll } from "../shared/tcg-core/balance/trialCategoryProposer";
import { secondPassTrialCategorize } from "../shared/tcg-core/balance/secondPassTrialCategorizer";
import { MANUAL_TRIAL_CATEGORIES } from "../shared/tcg-core/balance/manualTrialCategoryOverrides";
import { ALL_CARD_DEFINITIONS } from "../shared/tcg-core/cards/index";
import type { TrialCategory } from "../shared/tcg-core/types/Card";

interface Args {
  faction: string | null;
  dryRun: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  let faction: string | null = null;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--faction") {
      faction = argv[++i] ?? null;
    } else if (argv[i] === "--dry-run") {
      dryRun = true;
    } else {
      throw new Error(`unknown arg: ${argv[i]}`);
    }
  }
  return { faction, dryRun };
}

const CARDS_DIR = "/home/user/dischordian-saga/apps/shared/tcg-core/cards";

function findSourceFile(cardId: string): string {
  // grep is the most reliable cross-platform way to find which file
  // declares a given id literal. We anchor on the literal `id: "ID"`
  // pattern that every CardDefinition uses.
  try {
    const out = execSync(
      `grep -rl --include='*.ts' 'id: "${cardId}"' ${CARDS_DIR}`,
      { encoding: "utf8" },
    ).trim();
    const files = out.split("\n").filter(Boolean);
    if (files.length === 0) throw new Error(`no source for id ${cardId}`);
    if (files.length > 1) {
      throw new Error(
        `multiple sources for id ${cardId}: ${files.join(", ")}`,
      );
    }
    return files[0];
  } catch (e) {
    throw new Error(`grep failed for id ${cardId}: ${(e as Error).message}`);
  }
}

interface InsertResult {
  ok: boolean;
  reason?: string;
}

function insertTrialCategories(
  filePath: string,
  cardId: string,
  categories: readonly string[],
  dryRun: boolean,
): InsertResult {
  const text = readFileSync(filePath, "utf8");
  const lines = text.split("\n");

  // Find the line with `id: "<cardId>"`.
  const idLineIdx = lines.findIndex((l) =>
    l.includes(`id: "${cardId}"`),
  );
  if (idLineIdx === -1) {
    return { ok: false, reason: `id "${cardId}" not found in ${filePath}` };
  }

  // From idLineIdx, scan forward for the next `rulesVersion: "..."`.
  // Stop if we hit a closing `};` first — that means we walked out of
  // the wrong block.
  let rulesIdx = -1;
  for (let i = idLineIdx; i < lines.length; i++) {
    if (/^\s*rulesVersion:\s*"/.test(lines[i])) {
      rulesIdx = i;
      break;
    }
    if (/^\};/.test(lines[i])) break;
  }
  if (rulesIdx === -1) {
    return {
      ok: false,
      reason: `no rulesVersion after id "${cardId}" in ${filePath}`,
    };
  }

  // Walk forward from rulesIdx to the next non-blank, non-comment line.
  // If it's already a trial_categories line, skip (idempotent).
  for (let i = rulesIdx + 1; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l === "" || l.startsWith("//") || l.startsWith("/*")) continue;
    if (l.startsWith("trial_categories:")) {
      return { ok: false, reason: "already has trial_categories" };
    }
    break;
  }

  const indent = lines[rulesIdx].match(/^\s*/)?.[0] ?? "  ";
  const arrayLiteral = categories.map((c) => `"${c}"`).join(", ");
  const newLine = `${indent}trial_categories: [${arrayLiteral}] as const,`;

  lines.splice(rulesIdx + 1, 0, newLine);

  if (!dryRun) {
    writeFileSync(filePath, lines.join("\n"));
  }
  return { ok: true };
}

function main(): void {
  const args = parseArgs();
  const proposals = proposeAll();
  const cardById = new Map<string, (typeof ALL_CARD_DEFINITIONS)[number]>();
  for (const c of ALL_CARD_DEFINITIONS) cardById.set(c.id, c);

  // Build a quick lookup: cardId -> categories[]. Source priority:
  //   1. Main proposer (trialCategoryProposer.ts)
  //   2. If empty: second-pass categorizer (secondPassTrialCategorizer.ts)
  //   3. If still empty: manual override map (manualTrialCategoryOverrides.ts)
  // This way the conservative main proposer's output is preserved
  // exactly, and the additional sources only fill in genuinely
  // empty proposals.
  const idToProposed = new Map<string, readonly string[]>();
  for (const p of proposals) {
    if (args.faction && p.faction !== args.faction) continue;
    let cats: readonly TrialCategory[] = p.proposed;
    if (cats.length === 0) {
      const card = cardById.get(p.id);
      if (card) cats = secondPassTrialCategorize(card);
    }
    if (cats.length === 0 && MANUAL_TRIAL_CATEGORIES[p.id]) {
      cats = MANUAL_TRIAL_CATEGORIES[p.id];
    }
    if (cats.length > 0) idToProposed.set(p.id, cats);
  }

  // Build a faction lookup so we can skip antiquarian (already done)
  // unless explicitly requested.
  const idToFaction = new Map<string, string>();
  for (const c of ALL_CARD_DEFINITIONS) idToFaction.set(c.id, c.faction);

  const stats = {
    considered: 0,
    applied: 0,
    skippedAlreadyHas: 0,
    errored: 0,
  };

  // Group by source file so we read+write each file once when many
  // cards share it (multi-faction container files). The per-card
  // "already has trial_categories" idempotency check inside
  // insertTrialCategories handles antiquarian cards previously
  // applied by PR #61 — no need for a faction-level skip.
  const byFile = new Map<string, Array<{ id: string; cats: readonly string[] }>>();
  for (const [cardId, cats] of idToProposed) {
    stats.considered++;
    const file = findSourceFile(cardId);
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file)!.push({ id: cardId, cats });
  }
  // idToFaction was used by the previous antiquarian-skip; keep the
  // declaration alive for any future per-faction logic without
  // adding lint-warn for unused vars.
  void idToFaction;

  // Apply per file. Each file is read/written once per card; for
  // multi-card files this means N reads/writes — fine since the file
  // count is small (hundreds at most) and the writes are idempotent.
  for (const [file, entries] of byFile) {
    for (const { id, cats } of entries) {
      const r = insertTrialCategories(file, id, cats, args.dryRun);
      if (r.ok) {
        stats.applied++;
        if (args.dryRun) {
          console.log(
            `[dry] ${id}  ->  [${cats.join(", ")}]  (${file})`,
          );
        }
      } else if (r.reason === "already has trial_categories") {
        stats.skippedAlreadyHas++;
      } else {
        stats.errored++;
        console.error(`[err] ${id}: ${r.reason}`);
      }
    }
  }

  console.log(
    `\n${args.dryRun ? "[DRY RUN] " : ""}Done.\n` +
      `  considered: ${stats.considered}\n` +
      `  applied:    ${stats.applied}\n` +
      `  already:    ${stats.skippedAlreadyHas}\n` +
      `  errors:     ${stats.errored}`,
  );
  if (stats.errored > 0) process.exit(1);
}

main();
