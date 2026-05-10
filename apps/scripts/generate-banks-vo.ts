#!/usr/bin/env npx tsx
/**
 * NPC BANK VO GENERATOR — long-form Q&A topic banks.
 *
 * Walks apps/shared/npcs/banks/* (via the ALL_NPC_LINES barrel) and
 * synthesises every bank entry whose owning NPC has a voice id in
 * extended-vo-config.json `_per_npc_voices`. Each line writes to
 * its NPC's manifest at apps/shared/<npc>VoManifest.json.
 *
 * Skipped banks (non-verbal per their own headers):
 *   - your_eidolon: non-verbal pilot
 *   - dmc_clone_companion: stages 1-4 non-verbal; only stage 5 verbal
 *
 * Idempotent S3 HEAD-check + per-line manifest write. Crash-safe.
 *
 *   pnpm vo:banks
 *   pnpm vo:banks -- --npc the_oracle
 *   pnpm vo:banks -- --dry-run
 */
import { ALL_NPC_LINES } from "../shared/npcs/banks";
import { loadConfig, runJobs, type LineJob } from "./lib/extended-vo-runner";

const SKIP_NPCS = new Set(["your_eidolon", "dmc_clone_companion"]);

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  return {
    npc: get("--npc"),
    dryRun: args.includes("--dry-run"),
  };
}

const opts = parseArgs();
const cfg = loadConfig();
const VOICES = cfg._per_npc_voices;

const jobs: LineJob[] = [];
for (const line of ALL_NPC_LINES) {
  if (SKIP_NPCS.has(line.npcKey)) continue;
  if (!line.text || line.text.length === 0) continue;
  if (opts.npc && line.npcKey !== opts.npc) continue;
  const voice = VOICES[line.npcKey];
  if (!voice) continue;
  jobs.push({ voice, lineId: line.lineId, text: line.text });
}

await runJobs({ surface: "BANKS", jobs, dryRun: opts.dryRun });
