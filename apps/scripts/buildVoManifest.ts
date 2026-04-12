#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   VO MANIFEST BUILDER

   Walks every narrator tier dialog file and emits a canonical
   VO recording manifest at docs/narrator-vo-manifest.json.

   Groups lines by speaker -> tier -> scene for recording-session
   planning. Reports totals per speaker and per tier for studio
   scheduling.

   Run:
     npx tsx apps/scripts/buildVoManifest.ts
   ═══════════════════════════════════════════════════════ */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ALL_ELARA_DIALOGS,
  ALL_HUMAN_DIALOGS,
} from "../shared/narratorDialog";
import type {
  NarratorLine,
  NarratorScene,
  NarratorTierDialog,
} from "../shared/trustTierDialogTypes";

interface ManifestLine {
  audioDialogId: string;
  speaker: string;
  tier: number;
  tierLabel: string;
  sceneId: string;
  sceneTrigger: string;
  position: "opener" | "followup";
  wheelOptionId?: string;
  text: string;
  emotion: string;
  stageDirection?: string;
  proximity?: number;
  estimatedDurationSec: number;
}

interface SpeakerSessionGroup {
  speaker: string;
  tier: number;
  tierLabel: string;
  voiceProfile: string;
  lineCount: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  lines: ManifestLine[];
}

interface ManifestTotals {
  totalLines: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  perSpeaker: Record<string, { lines: number; durationSec: number; durationMin: string }>;
  perTier: Record<
    string,
    { lines: number; durationSec: number; durationMin: string }
  >;
}

interface NarratorVoManifest {
  generatedAt: string;
  generator: "apps/scripts/buildVoManifest.ts";
  totals: ManifestTotals;
  sessions: SpeakerSessionGroup[];
}

function fmtMin(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m${s.toString().padStart(2, "0")}s`;
}

function lineToManifestLine(
  line: NarratorLine,
  scene: NarratorScene,
  tierDialog: NarratorTierDialog,
  position: "opener" | "followup",
  wheelOptionId: string | undefined,
): ManifestLine {
  return {
    audioDialogId: line.audioDialogId,
    speaker: tierDialog.narrator,
    tier: tierDialog.tier,
    tierLabel: tierDialog.tierLabel,
    sceneId: scene.id,
    sceneTrigger: scene.trigger,
    position,
    wheelOptionId,
    text: line.text,
    emotion: line.emotion,
    stageDirection: line.stageDirection,
    proximity: line.proximity,
    estimatedDurationSec: line.estimatedDurationSec,
  };
}

function buildSessionForTier(d: NarratorTierDialog): SpeakerSessionGroup {
  const lines: ManifestLine[] = [];
  for (const scene of d.scenes) {
    for (const line of scene.opener) {
      lines.push(lineToManifestLine(line, scene, d, "opener", undefined));
    }
    for (const key of Object.keys(scene.followups)) {
      for (const line of scene.followups[key]) {
        lines.push(lineToManifestLine(line, scene, d, "followup", key));
      }
    }
  }
  const totalDurationSec = lines.reduce((a, l) => a + l.estimatedDurationSec, 0);
  return {
    speaker: d.narrator,
    tier: d.tier,
    tierLabel: d.tierLabel,
    voiceProfile: d.voiceProfile,
    lineCount: lines.length,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    lines,
  };
}

function verifyUnique(sessions: SpeakerSessionGroup[]): void {
  const seen = new Map<string, string>();
  for (const s of sessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Duplicate audioDialogId "${line.audioDialogId}" — in ${line.sceneId} and ${seen.get(line.audioDialogId)}`,
        );
      }
      seen.set(line.audioDialogId, line.sceneId);
    }
  }
}

function buildTotals(sessions: SpeakerSessionGroup[]): ManifestTotals {
  const perSpeaker: ManifestTotals["perSpeaker"] = {};
  const perTier: ManifestTotals["perTier"] = {};
  let totalLines = 0;
  let totalDurationSec = 0;
  for (const s of sessions) {
    totalLines += s.lineCount;
    totalDurationSec += s.totalDurationSec;
    const sp = (perSpeaker[s.speaker] ??= {
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    sp.lines += s.lineCount;
    sp.durationSec += s.totalDurationSec;

    const key = `${s.speaker}_T${s.tier}`;
    perTier[key] = {
      lines: s.lineCount,
      durationSec: s.totalDurationSec,
      durationMin: s.totalDurationMinFormatted,
    };
  }
  for (const sp of Object.values(perSpeaker)) {
    sp.durationMin = fmtMin(sp.durationSec);
  }
  return {
    totalLines,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    perSpeaker,
    perTier,
  };
}

function main(): void {
  const sessions: SpeakerSessionGroup[] = [
    ...ALL_ELARA_DIALOGS.map(buildSessionForTier),
    ...ALL_HUMAN_DIALOGS.map(buildSessionForTier),
  ];
  verifyUnique(sessions);

  const manifest: NarratorVoManifest = {
    generatedAt: new Date().toISOString(),
    generator: "apps/scripts/buildVoManifest.ts",
    totals: buildTotals(sessions),
    sessions,
  };

  const __filename = fileURLToPath(import.meta.url);
  const repoRoot = resolve(dirname(__filename), "..", "..");
  const outPath = resolve(repoRoot, "docs", "narrator-vo-manifest.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log("");
  console.log("Narrator VO Manifest");
  console.log("====================");
  console.log(`Written: ${outPath}`);
  console.log("");
  console.log(`Total lines:    ${manifest.totals.totalLines}`);
  console.log(`Total runtime:  ${manifest.totals.totalDurationMinFormatted}`);
  console.log("");
  console.log("Per speaker:");
  for (const [name, v] of Object.entries(manifest.totals.perSpeaker)) {
    console.log(`  ${name.padEnd(12)} ${v.lines.toString().padStart(4)} lines   ${v.durationMin}`);
  }
  console.log("");
  console.log("Per recording session (speaker x tier):");
  for (const s of sessions) {
    console.log(
      `  ${s.speaker.padEnd(12)} T${s.tier} ${s.tierLabel.padEnd(32)} ${s.lineCount
        .toString()
        .padStart(3)} lines   ${s.totalDurationMinFormatted}`,
    );
  }
  console.log("");
}

main();
