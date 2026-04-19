#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   ACT 1 ART CSV GENERATOR

   Reads apps/shared/act1ArtPrompts.ts and emits a Nano
   Banana 2 production-queue CSV.

   The canonical prompt text composes:
     ACT1_GLOBAL_STYLE_ANCHOR (§0.3 biographical aesthetic)
   + per-prompt specific text (§§2.2-2.13 opponent visuals,
     §22.1 battlefields, §22.3 card arts as they ship)

   The composed text is RFC-4180 CSV-quoted; producers can
   paste a full row into Nano Banana 2 without pre-processing.

   Usage:
     pnpm art:generate-csv
     pnpm art:generate-csv --output-dir <dir>
     pnpm art:generate-csv --category opponent_portrait

   CSV column contract:
     asset_id,name,category,cycle,bible_section,resolution,
     priority,dependencies,composed_prompt

   Output location (default):
     docs/production/act1-asset-build/manifests/
       act1_art_prompts__<category>.csv
       act1_art_prompts__all.csv
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  ACT1_ART_PROMPTS,
  ACT1_GLOBAL_STYLE_ANCHOR,
  type Act1ArtCategory,
  type Act1ArtPrompt,
} from "../shared/act1ArtPrompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const DEFAULT_OUTPUT_DIR = path.join(
  REPO_ROOT,
  "docs/production/act1-asset-build/manifests",
);

const CSV_HEADER =
  "asset_id,name,category,cycle,bible_section,resolution,priority,dependencies,composed_prompt";

/** RFC 4180: always quote, double inner quotes. */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Build the composed prompt: global style anchor + per-prompt text. */
function composePrompt(p: Act1ArtPrompt): string {
  return `${ACT1_GLOBAL_STYLE_ANCHOR}\n\n${p.prompt}`;
}

function rowToCsv(p: Act1ArtPrompt): string {
  return [
    p.assetId,
    csvField(p.name),
    p.category,
    p.cycle,
    p.bibleSection,
    p.resolution,
    p.priority,
    csvField((p.dependencies ?? []).join("|")),
    csvField(composePrompt(p)),
  ].join(",");
}

function emitCsv(prompts: readonly Act1ArtPrompt[]): string {
  return [CSV_HEADER, ...prompts.map(rowToCsv)].join("\n") + "\n";
}

interface CliArgs {
  outputDir: string;
  category: Act1ArtCategory | null;
}

function parseArgs(argv: readonly string[]): CliArgs {
  const args: CliArgs = {
    outputDir: DEFAULT_OUTPUT_DIR,
    category: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--output-dir") {
      const v = argv[i + 1];
      if (!v) throw new Error("--output-dir requires a value");
      args.outputDir = path.resolve(v);
      i++;
    } else if (a === "--category") {
      const v = argv[i + 1];
      if (!v) throw new Error("--category requires a value");
      args.category = v as Act1ArtCategory;
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

  // Filter by category if requested.
  const prompts = args.category
    ? ACT1_ART_PROMPTS.filter((p) => p.category === args.category)
    : ACT1_ART_PROMPTS;

  if (prompts.length === 0) {
    console.error(
      `No prompts found${args.category ? ` for category "${args.category}"` : ""}.`,
    );
    process.exit(1);
  }

  // Emit "all" CSV + per-category CSVs.
  const allCsv = emitCsv(prompts);
  const allPath = path.join(
    args.outputDir,
    args.category
      ? `act1_art_prompts__${args.category}.csv`
      : "act1_art_prompts__all.csv",
  );
  fs.writeFileSync(allPath, allCsv);
  console.log(`Wrote ${prompts.length} prompt(s) → ${allPath}`);

  if (!args.category) {
    // Also emit per-category files for producer-queue scoping.
    const categories = Array.from(
      new Set(ACT1_ART_PROMPTS.map((p) => p.category)),
    );
    for (const cat of categories) {
      const catPrompts = ACT1_ART_PROMPTS.filter((p) => p.category === cat);
      const catCsv = emitCsv(catPrompts);
      const catPath = path.join(
        args.outputDir,
        `act1_art_prompts__${cat}.csv`,
      );
      fs.writeFileSync(catPath, catCsv);
      console.log(`Wrote ${catPrompts.length} ${cat} prompt(s) → ${catPath}`);
    }
  }
}

main();
