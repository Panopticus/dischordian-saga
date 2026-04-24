#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE ART CSV GENERATOR

   Reads apps/shared/tradeEmpireArtPrompts.ts and emits a
   Nano Banana 2 production-queue CSV.

   Composed prompt text is:
     TRADE_EMPIRE_STYLE_ANCHOR
     + palette line
     + composition
     + negative prompt

   Usage:
     pnpm art:trade-empire
     pnpm art:trade-empire --output-dir <dir>
     pnpm art:trade-empire --category wonder
     pnpm art:trade-empire --gate A

   CSV column contract:
     asset_id,name,category,review_gate,resolution,priority,
     palette,composed_prompt

   Output location (default):
     docs/production/trade-empire-asset-build/manifests/
       trade_empire_art_prompts__<category>.csv
       trade_empire_art_prompts__gate_<gate>.csv
       trade_empire_art_prompts__all.csv
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  TRADE_EMPIRE_ART_PROMPTS,
  composeTradeEmpireArtPrompt,
  type TradeEmpireArtCategory,
  type TradeEmpireArtPrompt,
} from "../shared/tradeEmpireArtPrompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const DEFAULT_OUTPUT_DIR = path.join(
  REPO_ROOT,
  "docs/production/trade-empire-asset-build/manifests",
);

const CSV_HEADER =
  "asset_id,name,category,review_gate,resolution,priority,palette,composed_prompt";

/** RFC 4180: always quote, double inner quotes. */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function rowToCsv(p: TradeEmpireArtPrompt): string {
  return [
    p.assetId,
    csvField(p.name),
    p.category,
    p.reviewGate,
    p.resolution,
    p.priority,
    csvField(p.palette),
    csvField(composeTradeEmpireArtPrompt(p)),
  ].join(",");
}

function emitCsv(prompts: readonly TradeEmpireArtPrompt[]): string {
  return [CSV_HEADER, ...prompts.map(rowToCsv)].join("\n") + "\n";
}

interface CliArgs {
  outputDir: string;
  category: TradeEmpireArtCategory | null;
  gate: "A" | "B" | "C" | "D" | null;
}

function parseArgs(argv: readonly string[]): CliArgs {
  const args: CliArgs = {
    outputDir: DEFAULT_OUTPUT_DIR,
    category: null,
    gate: null,
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
      args.category = v as TradeEmpireArtCategory;
      i++;
    } else if (a === "--gate") {
      const v = argv[i + 1];
      if (!v) throw new Error("--gate requires a value");
      if (!["A", "B", "C", "D"].includes(v)) {
        throw new Error(`--gate must be A|B|C|D, got "${v}"`);
      }
      args.gate = v as "A" | "B" | "C" | "D";
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

  let prompts: readonly TradeEmpireArtPrompt[] = TRADE_EMPIRE_ART_PROMPTS;
  if (args.category) {
    prompts = prompts.filter((p) => p.category === args.category);
  }
  if (args.gate) {
    prompts = prompts.filter((p) => p.reviewGate === args.gate);
  }

  if (prompts.length === 0) {
    console.error(
      `No prompts found${args.category ? ` for category "${args.category}"` : ""}${args.gate ? ` gate "${args.gate}"` : ""}.`,
    );
    process.exit(1);
  }

  // Filtered run — one file, named by filter.
  if (args.category || args.gate) {
    const fname = [
      "trade_empire_art_prompts",
      args.category ? `_${args.category}` : "",
      args.gate ? `_gate_${args.gate}` : "",
      ".csv",
    ].join("");
    const outPath = path.join(args.outputDir, fname);
    fs.writeFileSync(outPath, emitCsv(prompts));
    console.log(`Wrote ${prompts.length} prompt(s) → ${outPath}`);
    return;
  }

  // Full run — emit all + per-category + per-gate files.
  const allPath = path.join(args.outputDir, "trade_empire_art_prompts__all.csv");
  fs.writeFileSync(allPath, emitCsv(prompts));
  console.log(`Wrote ${prompts.length} prompt(s) → ${allPath}`);

  const categories = Array.from(new Set(prompts.map((p) => p.category)));
  for (const cat of categories) {
    const catPrompts = prompts.filter((p) => p.category === cat);
    const catPath = path.join(
      args.outputDir,
      `trade_empire_art_prompts__${cat}.csv`,
    );
    fs.writeFileSync(catPath, emitCsv(catPrompts));
    console.log(`Wrote ${catPrompts.length} ${cat} prompt(s) → ${catPath}`);
  }

  const gates: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  for (const g of gates) {
    const gatePrompts = prompts.filter((p) => p.reviewGate === g);
    if (gatePrompts.length === 0) continue;
    const gatePath = path.join(
      args.outputDir,
      `trade_empire_art_prompts__gate_${g}.csv`,
    );
    fs.writeFileSync(gatePath, emitCsv(gatePrompts));
    console.log(`Wrote ${gatePrompts.length} gate-${g} prompt(s) → ${gatePath}`);
  }
}

main();
