#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   TS DIALOG BANK EXTRACTOR

   Imports the canonical TS dialog banks and emits matching
   JSON files in apps/scripts/ in the line-entry shape the
   gap-fill generator (generate_vo_gaps.py) consumes.

   Bank surfaces covered:
     - apps/shared/npcs/romanceScenes/*.ts        → romance-<npc>-lines.json
     - apps/shared/encounters/*.ts (5 banks)      → encounter-<key>-lines.json
     - apps/shared/encounters/act7EpilogueVoScripts.ts → act7-epilogue-<branch>-lines.json
     - apps/shared/tcg-core/story/dialogBank_*.ts → story-<bank>-lines.json

   Run: pnpm tsx apps/scripts/_extract-ts-dialog-banks.mjs

   Idempotent: rewrites the JSON files from the TS sources every
   time. Safe to re-run; the gap-fill generator picks the latest
   shape automatically.
   ═══════════════════════════════════════════════════════ */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  LOCKE_ROMANCE_BANK,
  VEX_ROMANCE_BANK,
  ELARA_ROMANCE_BANK,
  DMC_ROMANCE_BANK,
  JERICHO_ROMANCE_BANK,
} from "../shared/npcs/romanceScenes/index";
import {
  MASTER_OF_RLYEH_LINES,
  PALE_EMISSARY_LINES,
  RECKONING_DAUGHTER_LINES,
  SOURCE_KAEL_DIALOGUE_LINES,
} from "../shared/encounters/index";
import { MALKIA_REVOLUTION_QUESTLINE } from "../shared/encounters/malkiaRevolution";
import {
  HUMANITY_ENDING_VO,
  MACHINE_ENDING_VO,
  BALANCE_ENDING_VO,
  SOLDIER_COMMAND_ENDING_VO,
  SILENCE_ENDING_VO,
} from "../shared/encounters/act7EpilogueVoScripts";

// Story dialog banks live in tcg-core/story.
import { DIALOG_BANK_CHAPTERS_1_3 } from "../shared/tcg-core/story/dialogBank_chapters_1_3";
import { DIALOG_BANK_CHAPTERS_4_6 } from "../shared/tcg-core/story/dialogBank_chapters_4_6";
import { DIALOG_BANK_CHAPTERS_7_9 } from "../shared/tcg-core/story/dialogBank_chapters_7_9";
import { DIALOG_BANK_CHAPTERS_10_12 } from "../shared/tcg-core/story/dialogBank_chapters_10_12";
import { DIALOG_BANK_CINEMATICS } from "../shared/tcg-core/story/dialogBank_cinematics";
import { DIALOG_BANK_MATCH_LIFECYCLE } from "../shared/tcg-core/story/dialogBank_matchlifecycle";
import { DIALOG_BANK_TUTORIAL } from "../shared/tcg-core/story/dialogBank_tutorial";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT_DIR = __dirname;

interface ExtractedEntry {
  id: string;
  text: string;
  context: string;
  emotion: string;
  speaker: string;
  file: string;
  meta?: Record<string, unknown>;
}

function writeJson(filename: string, entries: ExtractedEntry[]): void {
  const path = join(OUT_DIR, filename);
  writeFileSync(path, JSON.stringify(entries, null, 2) + "\n", "utf-8");
  console.log(`  ${filename.padEnd(50)} ${String(entries.length).padStart(4)} entries`);
}

// ── ROMANCE BANKS ────────────────────────────────────────
// NpcLine shape: { lineId, text, speaker?, voiceId?, ... }
type NpcLineLike = {
  lineId?: string;
  id?: string;
  text: string;
  speaker?: string;
  voiceId?: string;
  context?: string;
  emotion?: string;
  mood?: string;
};

function fromNpcLines(
  banks: ReadonlyArray<{ npc: string; bank: ReadonlyArray<NpcLineLike> }>,
  fileTag: string,
): Map<string, ExtractedEntry[]> {
  const grouped = new Map<string, ExtractedEntry[]>();
  for (const { npc, bank } of banks) {
    const out: ExtractedEntry[] = bank.map((line) => ({
      id: line.lineId ?? line.id ?? "MISSING_ID",
      text: line.text,
      context: line.context ?? `${fileTag}_${npc}`,
      emotion: line.emotion ?? line.mood ?? "neutral",
      speaker: line.speaker ?? npc,
      file: `shared/npcs/${fileTag}/${npc}.ts`,
      meta: line.voiceId ? { voiceId: line.voiceId } : undefined,
    }));
    grouped.set(npc, out);
  }
  return grouped;
}

console.log("=== romance scenes ===");
const romance = fromNpcLines(
  [
    { npc: "locke",   bank: LOCKE_ROMANCE_BANK as unknown as NpcLineLike[] },
    { npc: "vex",     bank: VEX_ROMANCE_BANK as unknown as NpcLineLike[] },
    { npc: "elara",   bank: ELARA_ROMANCE_BANK as unknown as NpcLineLike[] },
    { npc: "dmc",     bank: DMC_ROMANCE_BANK as unknown as NpcLineLike[] },
    { npc: "jericho", bank: JERICHO_ROMANCE_BANK as unknown as NpcLineLike[] },
  ],
  "romanceScenes",
);
for (const [npc, entries] of romance) {
  writeJson(`romance-${npc}-lines.json`, entries);
}

// ── ENCOUNTER BANKS ──────────────────────────────────────
// EncounterLine shape: { lineId, speaker, phase, text, mood?, ... }
type EncounterLineLike = {
  lineId: string;
  speaker: string;
  text: string;
  phase?: string;
  mood?: string;
  emotion?: string;
};

function fromEncounterLines(
  key: string,
  lines: ReadonlyArray<EncounterLineLike>,
  filePath: string,
): ExtractedEntry[] {
  return lines.map((line) => ({
    id: line.lineId,
    text: line.text,
    context: line.phase ? `${key}_${line.phase}` : key,
    emotion: line.mood ?? line.emotion ?? "neutral",
    speaker: line.speaker,
    file: filePath,
  }));
}

console.log("\n=== encounter dialog ===");
writeJson("encounter-master_of_rlyeh-lines.json",
  fromEncounterLines("master_of_rlyeh", MASTER_OF_RLYEH_LINES as unknown as EncounterLineLike[],
    "shared/encounters/masterOfRlyeh.ts"));
writeJson("encounter-pale_emissary-lines.json",
  fromEncounterLines("pale_emissary", PALE_EMISSARY_LINES as unknown as EncounterLineLike[],
    "shared/encounters/paleEmissary.ts"));
writeJson("encounter-reckoning_daughter-lines.json",
  fromEncounterLines("reckoning_daughter", RECKONING_DAUGHTER_LINES as unknown as EncounterLineLike[],
    "shared/encounters/reckoningDaughter.ts"));
writeJson("encounter-malkia_revolution-lines.json",
  fromEncounterLines("malkia_revolution", MALKIA_REVOLUTION_QUESTLINE as unknown as EncounterLineLike[],
    "shared/encounters/malkiaRevolution.ts"));
writeJson("encounter-source_kael-lines.json",
  fromEncounterLines("source_kael", SOURCE_KAEL_DIALOGUE_LINES as unknown as EncounterLineLike[],
    "shared/encounters/sourceKaelDialogue.ts"));

// ── ACT 7 EPILOGUE (5 branches) ──────────────────────────
console.log("\n=== act 7 epilogue ===");
const epilogueBranches: ReadonlyArray<[string, ReadonlyArray<EncounterLineLike>]> = [
  ["humanity",        HUMANITY_ENDING_VO        as unknown as EncounterLineLike[]],
  ["machine",         MACHINE_ENDING_VO         as unknown as EncounterLineLike[]],
  ["balance",         BALANCE_ENDING_VO         as unknown as EncounterLineLike[]],
  ["soldier_command", SOLDIER_COMMAND_ENDING_VO as unknown as EncounterLineLike[]],
  ["silence",         SILENCE_ENDING_VO         as unknown as EncounterLineLike[]],
];
for (const [branch, lines] of epilogueBranches) {
  writeJson(`act7-epilogue-${branch}-lines.json`,
    fromEncounterLines(`act7_epilogue_${branch}`, lines,
      "shared/encounters/act7EpilogueVoScripts.ts"));
}

// ── STORY DIALOG BANKS ───────────────────────────────────
// DialogScene shape: { id, label, kind, cues: [{speaker, mood, text, audioClipId}] }
type DialogCueLike = {
  speaker: string;
  mood?: string;
  text: string;
  audioClipId: string;
};
type DialogSceneLike = {
  id: string;
  label?: string;
  kind?: string;
  cues: ReadonlyArray<DialogCueLike>;
};

function fromStoryBanks(
  scenes: ReadonlyArray<DialogSceneLike>,
  filePath: string,
): ExtractedEntry[] {
  const out: ExtractedEntry[] = [];
  for (const scene of scenes) {
    for (const cue of scene.cues) {
      out.push({
        id: cue.audioClipId,
        text: cue.text,
        context: scene.id,
        emotion: cue.mood ?? "neutral",
        speaker: cue.speaker,
        file: filePath,
        meta: scene.label ? { sceneLabel: scene.label, sceneKind: scene.kind } : undefined,
      });
    }
  }
  return out;
}

console.log("\n=== story dialog banks ===");
writeJson("story-chapters_1_3-lines.json",
  fromStoryBanks(DIALOG_BANK_CHAPTERS_1_3 as unknown as DialogSceneLike[],
    "shared/tcg-core/story/dialogBank_chapters_1_3.ts"));
writeJson("story-chapters_4_6-lines.json",
  fromStoryBanks(DIALOG_BANK_CHAPTERS_4_6 as unknown as DialogSceneLike[],
    "shared/tcg-core/story/dialogBank_chapters_4_6.ts"));
writeJson("story-chapters_7_9-lines.json",
  fromStoryBanks(DIALOG_BANK_CHAPTERS_7_9 as unknown as DialogSceneLike[],
    "shared/tcg-core/story/dialogBank_chapters_7_9.ts"));
writeJson("story-chapters_10_12-lines.json",
  fromStoryBanks(DIALOG_BANK_CHAPTERS_10_12 as unknown as DialogSceneLike[],
    "shared/tcg-core/story/dialogBank_chapters_10_12.ts"));
writeJson("story-cinematics-lines.json",
  fromStoryBanks(DIALOG_BANK_CINEMATICS as unknown as DialogSceneLike[],
    "shared/tcg-core/story/dialogBank_cinematics.ts"));
writeJson("story-match_lifecycle-lines.json",
  fromStoryBanks(DIALOG_BANK_MATCH_LIFECYCLE as unknown as DialogSceneLike[],
    "shared/tcg-core/story/dialogBank_matchlifecycle.ts"));
writeJson("story-tutorial-lines.json",
  fromStoryBanks(DIALOG_BANK_TUTORIAL as unknown as DialogSceneLike[],
    "shared/tcg-core/story/dialogBank_tutorial.ts"));

console.log("\n=== done ===");
