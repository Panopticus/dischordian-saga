#!/usr/bin/env node
/**
 * One-off generator: walks the canonical ENGINEER_LOGS catalog
 * (apps/shared/tcg-core/story/engineerLogs.ts + batch files) and
 * emits apps/scripts/engineer-lines.json — one entry per log,
 * shaped for the per-character VO pipeline (id / text / context /
 * emotion / file).
 *
 * Run from repo root:
 *   node apps/scripts/_generate-engineer-lines.mjs
 *
 * Re-run when new logs land. Idempotent — just rewrites the file
 * with whatever ENGINEER_LOGS contains today. Diffable.
 *
 * The logs themselves are long-form prose with [SPOKEN] /
 * [FREESTYLE] tags; the TTS pipeline downstream picks how to render
 * those (single-take spoken delivery for the SPOKEN sections, beat-
 * synced freestyle for the FREESTYLE sections). The script JSON is
 * the source-of-truth transcript regardless.
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import { ENGINEER_LOGS } from "../shared/tcg-core/story/engineerLogs.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outPath = resolve(__dirname, "engineer-lines.json");

const entries = ENGINEER_LOGS.map((log) => ({
  id: `engineer_${log.id}`,
  text: log.transcript,
  context: "engineer_log",
  emotion: "lab_journal",
  file: "shared/tcg-core/story/engineerLogs.ts",
  // Carry forward the canonical log fields the VO pipeline doesn't
  // strictly need but the producer / writer team will want when
  // recording. These are read-only metadata.
  meta: {
    logNumber: log.logNumber,
    title: log.title,
    dateStamp: log.dateStamp,
    mechanicExplanation: log.mechanicExplanation,
    musicChannelId: log.musicPrompt?.channelId ?? null,
    musicTrackId: log.musicPrompt?.trackId ?? null,
    musicTempoBpm: log.musicPrompt?.tempoBpm ?? null,
    musicDurationSec: log.musicPrompt?.durationTargetSeconds ?? null,
  },
}));

writeFileSync(outPath, JSON.stringify(entries, null, 2) + "\n", "utf-8");
console.log(`Wrote ${entries.length} engineer-log entries to ${outPath}`);
