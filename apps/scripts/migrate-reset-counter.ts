#!/usr/bin/env tsx
/**
 * One-shot codemod: rewrite the `-999` reset-counter workaround to
 * the explicit `reset_counter` op introduced in B3.
 *
 * Pattern matched:
 *   {
 *     op: "add_counter",
 *     kind: "<X>",
 *     amount: -999,
 *     to: { ... },
 *   }
 *
 * Rewritten to:
 *   {
 *     op: "reset_counter",
 *     counter: "<X>",
 *     to: { ... },
 *   }
 *
 * Idempotent: a second run is a no-op (the regex no longer matches).
 *
 * Usage:
 *   pnpm tsx apps/scripts/migrate-reset-counter.ts            (preview)
 *   pnpm tsx apps/scripts/migrate-reset-counter.ts --apply    (write)
 */
import * as fs from "node:fs";
import * as path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..");
const CARD_ROOT = path.join(
  REPO_ROOT,
  "apps/shared/tcg-core/cards/definitions",
);

const APPLY = process.argv.includes("--apply");

// Multi-line; tolerates whitespace and trailing comma. Captures the
// counter kind so we can reuse it on the rewrite side.
const PATTERN =
  /op:\s*"add_counter",\s*\n(\s*)kind:\s*("[^"]+")\s*,\s*\n\s*amount:\s*-999\s*,/g;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (name.endsWith(".ts") && !name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

function migrate(): void {
  const files = walk(CARD_ROOT);
  let touchedFiles = 0;
  let touchedSites = 0;
  for (const file of files) {
    const src = fs.readFileSync(file, "utf-8");
    if (!src.includes("amount: -999")) continue;
    const next = src.replace(PATTERN, (_match, indent, counterLit) => {
      touchedSites++;
      return `op: "reset_counter",\n${indent}counter: ${counterLit},`;
    });
    if (next === src) continue;
    touchedFiles++;
    const rel = path.relative(REPO_ROOT, file);
    console.log(`  ${APPLY ? "✓" : "·"} ${rel}`);
    if (APPLY) fs.writeFileSync(file, next);
  }
  if (touchedFiles === 0) {
    console.log("migrate-reset-counter: nothing to do (idempotent).");
    return;
  }
  console.log(
    `migrate-reset-counter: ${touchedSites} site(s) across ${touchedFiles} file(s) ` +
      (APPLY ? "rewritten." : "would be rewritten — re-run with --apply."),
  );
}

migrate();
