#!/usr/bin/env npx tsx
/**
 * AWAKENING-OVERLAY VO GENERATOR — Architect + Dreamer cryo-bus voices.
 *
 * The first voice the player hears in cryo (Architect) and the
 * counter-voice that layers underneath at half-frequency (Dreamer).
 * Both consumed by apps/client/src/components/prelude/RecruitStageVoiceOverlay.tsx.
 *
 *   - architectAwakeningLines.ts → architectVoManifest.json
 *   - dreamerAwakeningLines.ts   → dreamerVoManifest.json
 *
 * Skips Dreamer cues whose `text` is empty (pure-hum audio cues —
 * those need bespoke audio assets, not TTS).
 *
 *   pnpm vo:awakening-overlay
 *   pnpm vo:awakening-overlay -- --dry-run
 */
import { ARCHITECT_AWAKENING_CUES } from "../shared/architectAwakeningLines";
import { DREAMER_AWAKENING_CUES } from "../shared/dreamerAwakeningLines";
import { loadConfig, runJobs, type LineJob } from "./lib/extended-vo-runner";

const opts = { dryRun: process.argv.includes("--dry-run") };
const cfg = loadConfig();

const archVoice = cfg._awakening_speakers.architect;
const dreamVoice = cfg._awakening_speakers.dreamer;

const jobs: LineJob[] = [];

for (const cue of ARCHITECT_AWAKENING_CUES) {
  if (!cue.text || cue.text.length === 0) continue;
  jobs.push({
    voice: archVoice,
    lineId: cue.id,
    text: cue.text,
    label: `architect:${cue.id}`,
  });
}

for (const cue of DREAMER_AWAKENING_CUES) {
  // Pure-hum cues carry empty text — skip; producer drops in a hum
  // sample directly. The client tolerates a missing manifest entry.
  if (!cue.text || cue.text.length === 0) continue;
  jobs.push({
    voice: dreamVoice,
    lineId: cue.id,
    text: cue.text,
    label: `dreamer:${cue.id}`,
  });
}

await runJobs({ surface: "AWAKENING-OVERLAY", jobs, dryRun: opts.dryRun });
