#!/usr/bin/env npx tsx
/**
 * Sync apps/shared/tradeEmpireVoLines.ts → apps/scripts/act3-vo-lines.json
 *
 * The TS module is the source of truth for the Trade Empire expansion's
 * voice-over lines. This script:
 *   1. Reads the existing act3-vo-lines.json
 *   2. Filters out any pre-existing te-* entries (the script is the
 *      authority for them)
 *   3. Appends every entry from TRADE_EMPIRE_VO_LINES
 *   4. Writes the merged JSON back, sorted: non-te lines first, te-*
 *      lines second (grouped by their original order in the TS module)
 *
 * Run before `pnpm vo:act3` so ElevenLabs sees the new lines.
 *
 * Usage:
 *   pnpm tsx apps/scripts/sync-te-vo-lines.ts
 *   pnpm tsx apps/scripts/sync-te-vo-lines.ts --check    (CI mode: exit
 *     non-zero if the JSON file is out of sync with the TS module)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { TRADE_EMPIRE_VO_LINES } from "../shared/tradeEmpireVoLines";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LINES_PATH = join(__dirname, "act3-vo-lines.json");

interface JsonLine {
  id: string;
  speaker: string;
  voiceId: string;
  text: string;
  context: string;
  section: string;
  emotion: string;
  outputDir: string;
}

function loadExisting(): JsonLine[] {
  try {
    return JSON.parse(readFileSync(LINES_PATH, "utf8")) as JsonLine[];
  } catch {
    return [];
  }
}

function buildMerged(): JsonLine[] {
  const existing = loadExisting();
  const nonTe = existing.filter((l) => !l.id.startsWith("te-"));
  return [...nonTe, ...TRADE_EMPIRE_VO_LINES];
}

function main(): void {
  const checkMode = process.argv.includes("--check");
  const merged = buildMerged();
  const json = JSON.stringify(merged, null, 2) + "\n";

  if (checkMode) {
    const current = readFileSync(LINES_PATH, "utf8");
    if (current !== json) {
      console.error(
        "act3-vo-lines.json is out of sync with apps/shared/tradeEmpireVoLines.ts.",
      );
      console.error("Run: pnpm tsx apps/scripts/sync-te-vo-lines.ts");
      process.exit(1);
    }
    console.log("act3-vo-lines.json is in sync with tradeEmpireVoLines.ts");
    return;
  }

  writeFileSync(LINES_PATH, json);
  console.log(
    `Synced ${TRADE_EMPIRE_VO_LINES.length} Trade Empire lines into ${LINES_PATH}`,
  );
}

main();
