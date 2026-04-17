/**
 * Bulk-apply verdict_delta proposals to card source files.
 *
 * Mirrors apps/scripts/apply-trial-categories.ts's pattern exactly:
 * reads proposeAllVerdictDeltas() output and for each card that does
 * NOT already have a `verdict_delta` line in source, locates the
 * matching `trial_categories` line (the conventional insertion
 * anchor — every card with a delta also has categories, since the
 * delta is read during §5.8 plays and §5.8 gates by category) and
 * appends a new line after it:
 *
 *     verdict_delta: <N>,
 *
 * Idempotent: skips cards whose source already declares
 * `verdict_delta`. Cards with zero trial_categories (uncategorized)
 * and a proposer delta of 0 are also skipped since writing
 * `verdict_delta: 0` is redundant (the engine's
 * PLACEHOLDER_PLAY_DELTA defaults to +1 only when the field is
 * absent; for uncategorized cards the play never succeeds in §5.8
 * anyway, so the delta is never read).
 *
 * Run:  tsx apps/scripts/apply-verdict-deltas.ts [--dry-run]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { proposeAllVerdictDeltas } from "../shared/tcg-core/balance/verdictDeltaProposer";

const CARDS_DIR = "/home/user/dischordian-saga/apps/shared/tcg-core/cards";

interface Args {
  dryRun: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  let dryRun = false;
  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
    else throw new Error(`unknown arg: ${a}`);
  }
  return { dryRun };
}

function findSourceFile(cardId: string): string {
  const out = execSync(
    `grep -rl --include='*.ts' 'id: "${cardId}"' ${CARDS_DIR}`,
    { encoding: "utf8" },
  ).trim();
  const files = out.split("\n").filter(Boolean);
  if (files.length === 0) throw new Error(`no source for id ${cardId}`);
  if (files.length > 1) {
    throw new Error(`multiple sources for id ${cardId}: ${files.join(", ")}`);
  }
  return files[0];
}

interface InsertResult {
  ok: boolean;
  reason?: string;
}

function insertVerdictDelta(
  filePath: string,
  cardId: string,
  delta: number,
  dryRun: boolean,
): InsertResult {
  const text = readFileSync(filePath, "utf8");
  const lines = text.split("\n");

  const idLineIdx = lines.findIndex((l) => l.includes(`id: "${cardId}"`));
  if (idLineIdx === -1) {
    return { ok: false, reason: `id "${cardId}" not found` };
  }

  // Walk from the id line forward to the matching card's closing `};`.
  // Within that block, find the trial_categories line if present;
  // otherwise find rulesVersion (fallback for uncategorized cards).
  // Insert the verdict_delta line after whichever anchor is found.
  let anchorIdx = -1;
  let closeIdx = -1;
  for (let i = idLineIdx; i < lines.length; i++) {
    if (/^\s*trial_categories:/.test(lines[i])) {
      anchorIdx = i;
    } else if (
      /^\s*rulesVersion:\s*"/.test(lines[i]) &&
      anchorIdx === -1
    ) {
      anchorIdx = i;
    } else if (/^\};/.test(lines[i])) {
      closeIdx = i;
      break;
    }
    if (/^\s*verdict_delta:/.test(lines[i])) {
      return { ok: false, reason: "already has verdict_delta" };
    }
  }
  if (anchorIdx === -1 || closeIdx === -1) {
    return { ok: false, reason: "no anchor or closing brace" };
  }

  const indent = lines[anchorIdx].match(/^\s*/)?.[0] ?? "  ";
  const newLine = `${indent}verdict_delta: ${delta},`;
  lines.splice(anchorIdx + 1, 0, newLine);

  if (!dryRun) {
    writeFileSync(filePath, lines.join("\n"));
  }
  return { ok: true };
}

function main(): void {
  const args = parseArgs();
  const proposals = proposeAllVerdictDeltas();

  // Group by source file so files with multiple cards (allegiance/,
  // imprint/, etc.) are read+written once per card; same pattern as
  // apply-trial-categories.ts.
  const stats = {
    considered: 0,
    applied: 0,
    skippedAlready: 0,
    skippedZero: 0,
    errored: 0,
  };

  for (const p of proposals) {
    // Skip uncategorized-zero cards: writing `verdict_delta: 0`
    // clutters diff without behavior change (the delta is never
    // read for uncategorized cards since they can't legally play
    // in any §5.8 phase).
    if (p.proposed === 0 && p.categories.length === 0) {
      stats.skippedZero++;
      continue;
    }
    stats.considered++;
    try {
      const file = findSourceFile(p.id);
      const r = insertVerdictDelta(file, p.id, p.proposed, args.dryRun);
      if (r.ok) {
        stats.applied++;
        if (args.dryRun) {
          // eslint-disable-next-line no-console
          console.log(`[dry] ${p.id}  +=${p.proposed}  (${file})`);
        }
      } else if (r.reason === "already has verdict_delta") {
        stats.skippedAlready++;
      } else {
        stats.errored++;
        // eslint-disable-next-line no-console
        console.error(`[err] ${p.id}: ${r.reason}`);
      }
    } catch (e) {
      stats.errored++;
      // eslint-disable-next-line no-console
      console.error(`[err] ${p.id}: ${(e as Error).message}`);
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    `\n${args.dryRun ? "[DRY RUN] " : ""}Done.\n` +
      `  considered:   ${stats.considered}\n` +
      `  applied:      ${stats.applied}\n` +
      `  already:      ${stats.skippedAlready}\n` +
      `  zero-skip:    ${stats.skippedZero}\n` +
      `  errors:       ${stats.errored}`,
  );
  if (stats.errored > 0) process.exit(1);
}

main();
