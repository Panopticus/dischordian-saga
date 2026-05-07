#!/usr/bin/env tsx
/**
 * Lore-bible generator — CLI.
 *
 * Reads `apps/client/src/data/loredex-data.json` (the canonical
 * Loredex source per the 2026-05 lore-SoT decision) and emits
 * `docs/built/LORE_BIBLE.md` deterministically. The actual
 * generator logic lives in `scripts/generate-lore-bible-lib.ts` so
 * the CLI and the ship:check `lore.bible_drift` gate share one code
 * path and can never disagree.
 *
 * Usage:
 *   pnpm lore:generate              # writes docs/built/LORE_BIBLE.md
 *   pnpm lore:check                 # exits non-zero if MD drifts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { generateLoreBible } from "./generate-lore-bible-lib";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const OUT_PATH = path.join(REPO_ROOT, "docs/built/LORE_BIBLE.md");

function main(): void {
  const generated = generateLoreBible();
  if (process.argv.includes("--check")) {
    const existing = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, "utf-8") : "";
    if (existing === generated) {
      console.log(
        `lore:generate --check OK — ${path.relative(REPO_ROOT, OUT_PATH)} matches generator output.`,
      );
      process.exit(0);
    }
    console.error(
      `lore:generate --check FAIL — ${path.relative(REPO_ROOT, OUT_PATH)} drifts from generator output.\n` +
        "Run `pnpm lore:generate` to regenerate, then commit the diff.",
    );
    let i = 0;
    while (i < Math.min(existing.length, generated.length) && existing[i] === generated[i]) i++;
    console.error(`First diff at byte ${i}.`);
    console.error(`existing[${i}..${i + 60}]:  ${JSON.stringify(existing.slice(i, i + 60))}`);
    console.error(`generated[${i}..${i + 60}]: ${JSON.stringify(generated.slice(i, i + 60))}`);
    process.exit(1);
  }
  fs.writeFileSync(OUT_PATH, generated);
  console.log(
    `lore:generate OK — wrote ${path.relative(REPO_ROOT, OUT_PATH)} (${generated.length} bytes).`,
  );
}

main();
