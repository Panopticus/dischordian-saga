#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   VO MANIFEST BUILDER

   Walks every narrator tier dialog file and every companion
   comment file and emits two canonical VO recording manifests:

     docs/narrator-vo-manifest.json   — tier dialog, grouped by
                                        speaker x tier
     docs/companion-vo-manifest.json  — event-triggered companion
                                        comments, grouped by
                                        speaker x category

   Both manifests share a cross-catalog uniqueness check on
   audioDialogId so studio pipeline filenames never collide.

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
import { COMPANION_COMMENTS } from "../shared/companionComments";
import type {
  CompanionComment,
  CompanionTriggerCategory,
} from "../shared/companionComments";

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

/* ─── Companion-comment manifest shape ─── */

interface CompanionManifestLine {
  audioDialogId: string;
  commentId: string;
  speaker: string;
  category: CompanionTriggerCategory;
  trigger: string;
  text: string;
  emotion: string;
  stageDirection?: string;
  proximity?: number;
  estimatedDurationSec: number;
  loreReveal?: string;
  timing: string;
  maxPlays: number;
  requiresClass?: string;
  minTrust?: number;
}

interface CompanionSessionGroup {
  /** e.g. "elara_combat", "human_ship_ambient". */
  sessionKey: string;
  speaker: string;
  category: CompanionTriggerCategory;
  lineCount: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  lines: CompanionManifestLine[];
}

interface CompanionManifestTotals {
  totalLines: number;
  totalDurationSec: number;
  totalDurationMinFormatted: string;
  perSpeaker: Record<
    string,
    { lines: number; durationSec: number; durationMin: string }
  >;
  perCategory: Record<string, { lines: number; durationSec: number; durationMin: string }>;
}

interface CompanionVoManifest {
  generatedAt: string;
  generator: "apps/scripts/buildVoManifest.ts";
  totals: CompanionManifestTotals;
  sessions: CompanionSessionGroup[];
}

function companionToManifestLine(c: CompanionComment): CompanionManifestLine {
  return {
    audioDialogId: c.audioDialogId,
    commentId: c.id,
    speaker: c.speaker,
    category: c.category,
    trigger: c.trigger,
    text: c.voiceLine,
    emotion: c.emotion,
    stageDirection: c.stageDirection,
    proximity: c.proximity,
    estimatedDurationSec: c.estimatedDurationSec,
    loreReveal: c.loreReveal,
    timing: c.timing,
    maxPlays: c.maxPlays,
    requiresClass: c.requiresClass,
    minTrust: c.minTrust,
  };
}

function buildCompanionSessions(): CompanionSessionGroup[] {
  const groups = new Map<string, CompanionSessionGroup>();
  for (const c of COMPANION_COMMENTS) {
    const key = `${c.speaker}_${c.category}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        sessionKey: key,
        speaker: c.speaker,
        category: c.category,
        lineCount: 0,
        totalDurationSec: 0,
        totalDurationMinFormatted: "",
        lines: [],
      };
      groups.set(key, group);
    }
    group.lines.push(companionToManifestLine(c));
    group.lineCount++;
    group.totalDurationSec += c.estimatedDurationSec;
  }
  for (const g of groups.values()) g.totalDurationMinFormatted = fmtMin(g.totalDurationSec);
  return [...groups.values()].sort((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}

function buildCompanionTotals(sessions: CompanionSessionGroup[]): CompanionManifestTotals {
  const perSpeaker: CompanionManifestTotals["perSpeaker"] = {};
  const perCategory: CompanionManifestTotals["perCategory"] = {};
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
    const cat = (perCategory[s.category] ??= {
      lines: 0,
      durationSec: 0,
      durationMin: "",
    });
    cat.lines += s.lineCount;
    cat.durationSec += s.totalDurationSec;
  }
  for (const v of Object.values(perSpeaker)) v.durationMin = fmtMin(v.durationSec);
  for (const v of Object.values(perCategory)) v.durationMin = fmtMin(v.durationSec);
  return {
    totalLines,
    totalDurationSec,
    totalDurationMinFormatted: fmtMin(totalDurationSec),
    perSpeaker,
    perCategory,
  };
}

function verifyCrossCatalogUnique(
  narratorSessions: SpeakerSessionGroup[],
  companionSessions: CompanionSessionGroup[],
): void {
  const seen = new Map<string, string>();
  for (const s of narratorSessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Duplicate audioDialogId "${line.audioDialogId}" in narrator catalog (${line.sceneId} & ${seen.get(line.audioDialogId)})`,
        );
      }
      seen.set(line.audioDialogId, `narrator:${line.sceneId}`);
    }
  }
  for (const s of companionSessions) {
    for (const line of s.lines) {
      if (seen.has(line.audioDialogId)) {
        throw new Error(
          `Cross-catalog duplicate audioDialogId "${line.audioDialogId}" (companion:${line.commentId} collides with ${seen.get(line.audioDialogId)})`,
        );
      }
      seen.set(line.audioDialogId, `companion:${line.commentId}`);
    }
  }
}

function main(): void {
  // ── narrator tier dialog ──
  const narratorSessions: SpeakerSessionGroup[] = [
    ...ALL_ELARA_DIALOGS.map(buildSessionForTier),
    ...ALL_HUMAN_DIALOGS.map(buildSessionForTier),
  ];
  verifyUnique(narratorSessions);

  const narratorManifest: NarratorVoManifest = {
    generatedAt: new Date().toISOString(),
    generator: "apps/scripts/buildVoManifest.ts",
    totals: buildTotals(narratorSessions),
    sessions: narratorSessions,
  };

  // ── companion comments ──
  const companionSessions = buildCompanionSessions();
  const companionManifest: CompanionVoManifest = {
    generatedAt: new Date().toISOString(),
    generator: "apps/scripts/buildVoManifest.ts",
    totals: buildCompanionTotals(companionSessions),
    sessions: companionSessions,
  };

  // ── cross-catalog uniqueness ──
  verifyCrossCatalogUnique(narratorSessions, companionSessions);

  // ── write outputs ──
  const __filename = fileURLToPath(import.meta.url);
  const repoRoot = resolve(dirname(__filename), "..", "..");
  const narratorPath = resolve(repoRoot, "docs", "narrator-vo-manifest.json");
  const companionPath = resolve(repoRoot, "docs", "companion-vo-manifest.json");
  mkdirSync(dirname(narratorPath), { recursive: true });
  writeFileSync(narratorPath, JSON.stringify(narratorManifest, null, 2) + "\n", "utf8");
  writeFileSync(companionPath, JSON.stringify(companionManifest, null, 2) + "\n", "utf8");

  // ── report ──
  console.log("");
  console.log("Narrator VO Manifest");
  console.log("====================");
  console.log(`Written: ${narratorPath}`);
  console.log("");
  console.log(`Total lines:    ${narratorManifest.totals.totalLines}`);
  console.log(`Total runtime:  ${narratorManifest.totals.totalDurationMinFormatted}`);
  console.log("");
  console.log("Per speaker:");
  for (const [name, v] of Object.entries(narratorManifest.totals.perSpeaker)) {
    console.log(`  ${name.padEnd(12)} ${v.lines.toString().padStart(4)} lines   ${v.durationMin}`);
  }
  console.log("");
  console.log("Per recording session (speaker x tier):");
  for (const s of narratorSessions) {
    console.log(
      `  ${s.speaker.padEnd(12)} T${s.tier} ${s.tierLabel.padEnd(32)} ${s.lineCount
        .toString()
        .padStart(3)} lines   ${s.totalDurationMinFormatted}`,
    );
  }

  console.log("");
  console.log("Companion VO Manifest");
  console.log("=====================");
  console.log(`Written: ${companionPath}`);
  console.log("");
  console.log(`Total lines:    ${companionManifest.totals.totalLines}`);
  console.log(`Total runtime:  ${companionManifest.totals.totalDurationMinFormatted}`);
  console.log("");
  console.log("Per speaker:");
  for (const [name, v] of Object.entries(companionManifest.totals.perSpeaker)) {
    console.log(`  ${name.padEnd(12)} ${v.lines.toString().padStart(4)} lines   ${v.durationMin}`);
  }
  console.log("");
  console.log("Per recording session (speaker x category):");
  for (const s of companionSessions) {
    console.log(
      `  ${s.speaker.padEnd(10)} ${s.category.padEnd(22)} ${s.lineCount
        .toString()
        .padStart(3)} lines   ${s.totalDurationMinFormatted}`,
    );
  }
  console.log("");
}

main();
