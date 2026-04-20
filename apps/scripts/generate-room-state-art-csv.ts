#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   ROOM STATE ART CSV GENERATOR

   Reads apps/shared/roomStateArtPrompts.ts and emits a
   production-queue CSV suitable for Nano Banana 2 or any
   other tool-agnostic generator. Each composed_prompt
   column bundles the shared ROOM_STATE_STYLE_ANCHOR + the
   per-state body so a producer pastes a row directly.

   Usage:
     pnpm room-art:generate-csv
     pnpm room-art:generate-csv --output-dir <dir>
     pnpm room-art:generate-csv --room cryo-bay

   CSV column contract:
     asset_id,room_id,state_id,label,condition,resolution,
     priority,dependencies,composed_prompt

   Output location (default):
     docs/production/room-asset-build/manifests/
       room_state_art_prompts__all.csv
       room_state_art_prompts__<room_id>.csv  (one per room)
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  ROOM_STATE_ART_PROMPTS,
  ROOM_STATE_STYLE_ANCHOR,
  type RoomId,
  type RoomStateArtPrompt,
} from "../shared/roomStateArtPrompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const DEFAULT_OUTPUT_DIR = path.join(
  REPO_ROOT,
  "docs/production/room-asset-build/manifests",
);

const CSV_HEADER =
  "asset_id,room_id,state_id,label,condition,resolution,priority,dependencies,composed_prompt";

/** RFC 4180: always quote, double inner quotes. */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function composePrompt(p: RoomStateArtPrompt): string {
  return `${ROOM_STATE_STYLE_ANCHOR}\n\n${p.prompt}`;
}

function rowToCsv(p: RoomStateArtPrompt): string {
  return [
    p.assetId,
    p.roomId,
    p.stateId,
    csvField(p.label),
    csvField(p.condition),
    p.resolution,
    p.priority,
    csvField(p.dependencies.join("|")),
    csvField(composePrompt(p)),
  ].join(",");
}

function emitCsv(prompts: readonly RoomStateArtPrompt[]): string {
  return [CSV_HEADER, ...prompts.map(rowToCsv)].join("\n") + "\n";
}

interface CliArgs {
  outputDir: string;
  roomId: RoomId | null;
}

function parseArgs(argv: readonly string[]): CliArgs {
  const args: CliArgs = { outputDir: DEFAULT_OUTPUT_DIR, roomId: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--output-dir") {
      const v = argv[i + 1];
      if (!v) throw new Error("--output-dir requires a value");
      args.outputDir = path.resolve(v);
      i++;
    } else if (a === "--room") {
      const v = argv[i + 1];
      if (!v) throw new Error("--room requires a value");
      args.roomId = v as RoomId;
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

  const filtered = args.roomId
    ? ROOM_STATE_ART_PROMPTS.filter((p) => p.roomId === args.roomId)
    : ROOM_STATE_ART_PROMPTS;

  if (filtered.length === 0) {
    console.error(
      `No prompts found${args.roomId ? ` for room "${args.roomId}"` : ""}.`,
    );
    process.exit(1);
  }

  const allPath = path.join(
    args.outputDir,
    args.roomId
      ? `room_state_art_prompts__${args.roomId}.csv`
      : "room_state_art_prompts__all.csv",
  );
  fs.writeFileSync(allPath, emitCsv(filtered));
  console.log(`Wrote ${filtered.length} prompt(s) → ${allPath}`);

  if (!args.roomId) {
    const rooms = Array.from(
      new Set(ROOM_STATE_ART_PROMPTS.map((p) => p.roomId)),
    );
    for (const r of rooms) {
      const subset = ROOM_STATE_ART_PROMPTS.filter((p) => p.roomId === r);
      const p = path.join(
        args.outputDir,
        `room_state_art_prompts__${r}.csv`,
      );
      fs.writeFileSync(p, emitCsv(subset));
      console.log(`Wrote ${subset.length} ${r} prompt(s) → ${p}`);
    }
  }
}

main();
