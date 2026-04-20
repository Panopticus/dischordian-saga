#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   SUITS OF THE INVENTOR — ART CSV GENERATOR

   Reads apps/shared/suitArtPrompts.ts and emits a
   production-queue CSV for whichever image-gen backend is
   active this week. Each row's composed_prompt column is
   already self-contained: the §G.8 preamble + pivot points
   + per-piece template are baked into SuitArtPrompt.prompt
   by buildSuitPrompt(), so producers paste the CSV row
   directly into the backend.

   Usage:
     pnpm suit:generate-csv
     pnpm suit:generate-csv --output-dir <dir>
     pnpm suit:generate-csv --set regalia-of-the-seeing-stylus
     pnpm suit:generate-csv --rarity legendary

   CSV column contract:
     asset_id,set_id,set_name,category,rarity,slot,
     resolution,priority,dependencies,composed_prompt

   Output location (default):
     docs/production/suit-asset-build/manifests/
       suit_art_prompts__all.csv
       suit_art_prompts__<set_id>.csv      (18 per-set files)
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  SUIT_ART_PROMPTS,
  SUIT_SET_ROSTER,
  type Rarity,
  type SuitArtPrompt,
} from "../shared/suitArtPrompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const DEFAULT_OUTPUT_DIR = path.join(
  REPO_ROOT,
  "docs/production/suit-asset-build/manifests",
);

const CSV_HEADER =
  "asset_id,set_id,set_name,category,rarity,slot,resolution,priority,dependencies,composed_prompt";

/** RFC 4180: always quote, double inner quotes. */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function rowToCsv(p: SuitArtPrompt): string {
  return [
    p.assetId,
    p.setId,
    csvField(p.setName),
    p.category,
    p.rarity,
    p.slot,
    p.resolution,
    p.priority,
    csvField(p.dependencies.join("|")),
    csvField(p.prompt),
  ].join(",");
}

function emitCsv(prompts: readonly SuitArtPrompt[]): string {
  return [CSV_HEADER, ...prompts.map(rowToCsv)].join("\n") + "\n";
}

interface CliArgs {
  outputDir: string;
  setId: string | null;
  rarity: Rarity | null;
}

function parseArgs(argv: readonly string[]): CliArgs {
  const args: CliArgs = {
    outputDir: DEFAULT_OUTPUT_DIR,
    setId: null,
    rarity: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--output-dir") {
      const v = argv[i + 1];
      if (!v) throw new Error("--output-dir requires a value");
      args.outputDir = path.resolve(v);
      i++;
    } else if (a === "--set") {
      const v = argv[i + 1];
      if (!v) throw new Error("--set requires a value");
      args.setId = v;
      i++;
    } else if (a === "--rarity") {
      const v = argv[i + 1];
      if (!v) throw new Error("--rarity requires a value");
      args.rarity = v as Rarity;
      i++;
    }
  }
  return args;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(args.outputDir)) {
    fs.mkdirSync(args.outputDir, { recursive: true });
  }

  let filtered: readonly SuitArtPrompt[] = SUIT_ART_PROMPTS;
  if (args.setId) {
    filtered = filtered.filter((p) => p.setId === args.setId);
  }
  if (args.rarity) {
    filtered = filtered.filter((p) => p.rarity === args.rarity);
  }

  if (filtered.length === 0) {
    console.error(
      `No prompts matched filters (set=${args.setId ?? "any"}, rarity=${args.rarity ?? "any"}).`,
    );
    process.exit(1);
  }

  // "all" (or filtered-all when flags set).
  const suffix =
    args.setId || args.rarity
      ? `__filtered${args.setId ? `_${args.setId}` : ""}${args.rarity ? `_${args.rarity}` : ""}`
      : "__all";
  const allPath = path.join(args.outputDir, `suit_art_prompts${suffix}.csv`);
  fs.writeFileSync(allPath, emitCsv(filtered));
  console.log(`Wrote ${filtered.length} prompt(s) → ${allPath}`);

  // Per-set breakdowns for producer-queue scoping (skip when a filter
  // already narrowed the result — the flag-user knows what they asked for).
  if (!args.setId && !args.rarity) {
    for (const set of SUIT_SET_ROSTER) {
      const subset = SUIT_ART_PROMPTS.filter((p) => p.setId === set.id);
      const p = path.join(
        args.outputDir,
        `suit_art_prompts__${set.id}.csv`,
      );
      fs.writeFileSync(p, emitCsv(subset));
      console.log(`Wrote ${subset.length} ${set.id} prompt(s) → ${p}`);
    }
  }
}

main();
