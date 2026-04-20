#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   EARNED LOADOUT ART CSV GENERATOR

   Reads apps/shared/earnedLoadoutArtPrompts.ts and emits a
   production-queue CSV suitable for Nano Banana 2 (or any
   tool-agnostic generator).

   The composed prompt text = EARNED_LOADOUT_STYLE_ANCHOR
   (shared cyberpunk × steampunk sorcery aesthetic) + the
   per-item prompt body.

   Usage:
     pnpm loadout:generate-csv
     pnpm loadout:generate-csv --output-dir <dir>
     pnpm loadout:generate-csv --slot weapon

   CSV column contract:
     asset_id,name,slot,resolution,priority,dependencies,composed_prompt

   Output location (default):
     docs/production/loadout-asset-build/manifests/
       earned_loadout_art_prompts__<slot>.csv
       earned_loadout_art_prompts__all.csv
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  EARNED_LOADOUT_ART_PROMPTS,
  EARNED_LOADOUT_STYLE_ANCHOR,
  type EarnedLoadoutArtPrompt,
} from "../shared/earnedLoadoutArtPrompts";
import type { Slot } from "../shared/earnedLoadouts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const DEFAULT_OUTPUT_DIR = path.join(
  REPO_ROOT,
  "docs/production/loadout-asset-build/manifests",
);

const CSV_HEADER =
  "asset_id,name,slot,resolution,priority,dependencies,composed_prompt";

/** RFC 4180: always quote, double inner quotes. */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function composePrompt(p: EarnedLoadoutArtPrompt): string {
  return `${EARNED_LOADOUT_STYLE_ANCHOR}\n\n${p.prompt}`;
}

function rowToCsv(p: EarnedLoadoutArtPrompt): string {
  return [
    p.assetId,
    csvField(p.name),
    p.slot,
    p.resolution,
    p.priority,
    csvField((p.dependencies ?? []).join("|")),
    csvField(composePrompt(p)),
  ].join(",");
}

function emitCsv(prompts: readonly EarnedLoadoutArtPrompt[]): string {
  return [CSV_HEADER, ...prompts.map(rowToCsv)].join("\n") + "\n";
}

interface CliArgs {
  outputDir: string;
  slot: Slot | null;
}

function parseArgs(argv: readonly string[]): CliArgs {
  const args: CliArgs = { outputDir: DEFAULT_OUTPUT_DIR, slot: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--output-dir") {
      const v = argv[i + 1];
      if (!v) throw new Error("--output-dir requires a value");
      args.outputDir = path.resolve(v);
      i++;
    } else if (a === "--slot") {
      const v = argv[i + 1];
      if (!v) throw new Error("--slot requires a value");
      args.slot = v as Slot;
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

  const prompts = args.slot
    ? EARNED_LOADOUT_ART_PROMPTS.filter((p) => p.slot === args.slot)
    : EARNED_LOADOUT_ART_PROMPTS;

  if (prompts.length === 0) {
    console.error(
      `No prompts found${args.slot ? ` for slot "${args.slot}"` : ""}.`,
    );
    process.exit(1);
  }

  const allCsv = emitCsv(prompts);
  const allPath = path.join(
    args.outputDir,
    args.slot
      ? `earned_loadout_art_prompts__${args.slot}.csv`
      : "earned_loadout_art_prompts__all.csv",
  );
  fs.writeFileSync(allPath, allCsv);
  console.log(`Wrote ${prompts.length} prompt(s) → ${allPath}`);

  if (!args.slot) {
    const slots = Array.from(
      new Set(EARNED_LOADOUT_ART_PROMPTS.map((p) => p.slot)),
    );
    for (const s of slots) {
      const subset = EARNED_LOADOUT_ART_PROMPTS.filter((p) => p.slot === s);
      const csv = emitCsv(subset);
      const p = path.join(
        args.outputDir,
        `earned_loadout_art_prompts__${s}.csv`,
      );
      fs.writeFileSync(p, csv);
      console.log(`Wrote ${subset.length} ${s} prompt(s) → ${p}`);
    }
  }
}

main();
