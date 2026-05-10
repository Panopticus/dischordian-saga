#!/usr/bin/env npx tsx
/**
 * ROMANCE VO GENERATOR — per-stage romance scene scripts.
 *
 * Walks apps/shared/npcs/romanceScenes/* (via the ROMANCE_SCENE_BANKS
 * barrel) and synthesises every entry whose owning NPC has a voice id
 * in extended-vo-config.json `_per_npc_voices`. Each line writes to
 * its NPC's manifest at apps/shared/<npc>VoManifest.json.
 *
 * Note: dmc_companion (npcKey="dmc_clone_companion") is non-verbal in
 * the bank but verbal in romance Stage 5+. The romance bank as a whole
 * is held back here because we don't have a stage-resolver yet — the
 * dmc_clone_companion entry in `_per_npc_voices` is intentionally
 * absent so all 11 of its lines get filtered out cleanly.
 *
 *   pnpm vo:romance
 *   pnpm vo:romance -- --npc adjudicator_locke
 *   pnpm vo:romance -- --dry-run
 */
import { ROMANCE_SCENE_BANKS } from "../shared/npcs/romanceScenes";
import { loadConfig, runJobs, type LineJob } from "./lib/extended-vo-runner";

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
for (const [npcId, lines] of Object.entries(ROMANCE_SCENE_BANKS)) {
  for (const line of lines) {
    if (!line.text || line.text.length === 0) continue;
    if (opts.npc && line.npcKey !== opts.npc) continue;
    const voice = VOICES[line.npcKey];
    if (!voice) continue;
    jobs.push({ voice, lineId: line.lineId, text: line.text, label: `${npcId}:${line.lineId}` });
  }
}

await runJobs({ surface: "ROMANCE", jobs, dryRun: opts.dryRun });
