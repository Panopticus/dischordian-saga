#!/usr/bin/env npx tsx
/**
 * ENCOUNTER VO GENERATOR — multi-speaker scripted encounters.
 *
 * Walks the per-encounter EncounterLine arrays in
 * apps/shared/encounters/* and synthesises every line through the
 * speaker → voice config (existing per-character voices for elara /
 * the_human / antiquarian; new per-encounter voices for the
 * Hierarchy lords + Source/Kael + Malkia from
 * extended-vo-config.json `_encounter_speakers`).
 *
 * Manifest routing: each line lands in the manifest of its
 * speaker (so the client looks up by speaker, not by encounter):
 *   - elara → elaraVoManifest.json
 *   - the_human → humanVoManifest.json
 *   - antiquarian → antiquarianVoManifest.json
 *   - hierarchy:* → masterOfRlyeh / paleEmissary / reckoningDaughter
 *   - source / kael_trace → sourceVoManifest / kaelVoManifest
 *   - malkia_ukweli → malkiaVoManifest
 *
 * Excluded by default: act7EpilogueVoScripts.ts (its own header
 * marks it producer-owned recording, not auto-pipeline). Pass
 * --include-act7 to override.
 *
 *   pnpm vo:encounters
 *   pnpm vo:encounters -- --speaker hierarchy:pale_emissary
 *   pnpm vo:encounters -- --include-act7
 *   pnpm vo:encounters -- --dry-run
 */
import { MASTER_OF_RLYEH_LINES } from "../shared/encounters/masterOfRlyeh";
import { PALE_EMISSARY_LINES } from "../shared/encounters/paleEmissary";
import { RECKONING_DAUGHTER_LINES } from "../shared/encounters/reckoningDaughter";
import { SOURCE_KAEL_DIALOGUE_LINES } from "../shared/encounters/sourceKaelDialogue";
import { MALKIA_REVOLUTION_QUESTLINE } from "../shared/encounters/malkiaRevolution";
import { ALL_ACT7_EPILOGUE_LINES } from "../shared/encounters/act7EpilogueVoScripts";

import { loadConfig, runJobs, type LineJob, type VoiceConfig } from "./lib/extended-vo-runner";

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  return {
    speaker: get("--speaker"),
    includeAct7: args.includes("--include-act7"),
    dryRun: args.includes("--dry-run"),
  };
}

const opts = parseArgs();
const cfg = loadConfig();

/** Speaker → voice mapping. Unifies the per-NPC and per-encounter
 *  configs so a single lookup resolves any speaker an encounter
 *  references. Per-NPC voice wins on collision (rare). */
const SPEAKER_VOICES: Record<string, VoiceConfig> = {
  ...cfg._encounter_speakers,
  elara: cfg._per_npc_voices.elara,
  the_human: cfg._per_npc_voices.the_human,
  antiquarian: cfg._per_npc_voices.antiquarian,
};

const ENCOUNTER_LINES = [
  ...MASTER_OF_RLYEH_LINES,
  ...PALE_EMISSARY_LINES,
  ...RECKONING_DAUGHTER_LINES,
  ...SOURCE_KAEL_DIALOGUE_LINES,
  ...MALKIA_REVOLUTION_QUESTLINE,
  ...(opts.includeAct7 ? ALL_ACT7_EPILOGUE_LINES : []),
];

const jobs: LineJob[] = [];
const unmappedSpeakers = new Set<string>();
for (const line of ENCOUNTER_LINES) {
  if (!line.text || line.text.length === 0) continue;
  if (opts.speaker && line.speaker !== opts.speaker) continue;
  const voice = SPEAKER_VOICES[line.speaker];
  if (!voice) {
    unmappedSpeakers.add(line.speaker);
    continue;
  }
  jobs.push({
    voice,
    lineId: line.lineId,
    text: line.text,
    label: `${line.speaker}:${line.lineId}`,
  });
}

if (unmappedSpeakers.size > 0) {
  console.warn(
    `[encounters] ${unmappedSpeakers.size} speaker(s) had no voice mapping; lines skipped:\n  ${[...unmappedSpeakers].sort().join(", ")}`,
  );
}

await runJobs({ surface: "ENCOUNTERS", jobs, dryRun: opts.dryRun });
