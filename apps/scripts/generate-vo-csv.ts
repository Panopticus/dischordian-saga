#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   VO CSV GENERATOR

   Reads the dialog data modules and emits ElevenLabs-
   formatted CSV batches ready for Studio Projects import
   or the generate-*-vo.ts single-speaker pipelines.

   Sources:
     - apps/shared/act1OpponentDialog.ts  (12 opponents × 12 fields)
     - apps/shared/companionComments.ts   (reactive one-shots)
     - apps/shared/companionAskTopics.ts  (Q + A per topic)

   Extension points:
     - Act 7 convergence opponents land in a separate branch and
       are picked up automatically when act7OpponentDialog.ts merges;
       to add them, import ACT_7_OPPONENT_DIALOG here and add a
       bundle to generateVoCsvs.
     - Ask-topic alternateAnswers land similarly — when the schema
       field ships, collectCompanionAskRows already has a branch
       ready to be re-enabled.

   Usage:
     pnpm vo:generate-csv                      # emit to docs/production/vo-batches/
     pnpm vo:generate-csv --output-dir <dir>
     pnpm vo:generate-csv --priority P0        # override row priority

   CSV column contract (matches docs/production/SHIP_READY_ASSET_BIBLE.md §4):
     id,character,voice_profile,stability,similarity,style,
     speaker_boost,text,direction,priority

   Every row is independently renderable. Text fields are
   CSV-quoted with doubled inner quotes so inline SSML
   (<break time="500ms"/>) is preserved verbatim.

   The generator is deterministic — running it twice on
   the same inputs produces identical CSVs.
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  ACT_1_OPPONENT_DIALOGS,
  type Act1OpponentDialog,
} from "../shared/act1OpponentDialog";
import { COMPANION_COMMENTS } from "../shared/companionComments";
import { COMPANION_ASK_TOPICS } from "../shared/companionAskTopics";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

type VoiceProfile = "elara" | "human" | "antiquarian" | "architect" | "the_watcher" | "architect_echo" | "dreamer_echo";

interface VoiceSettings {
  stability: number;
  similarity: number;
  style: number;
  speakerBoost: boolean;
}

// Voice settings sourced from existing prelude CSVs + SHIP_READY_ASSET_BIBLE §4.1.
// Elara sits where generate-elara-vo.ts 'reflective' emotion lives.
// Human is one click firmer (higher stability, higher similarity).
// Watcher/echoes are the three convergence-floor voices from act7OpponentDialog.
const VOICE_SETTINGS: Record<VoiceProfile, VoiceSettings> = {
  elara:          { stability: 0.45, similarity: 0.78, style: 0.35, speakerBoost: true },
  human:          { stability: 0.55, similarity: 0.85, style: 0.30, speakerBoost: true },
  antiquarian:    { stability: 0.50, similarity: 0.82, style: 0.40, speakerBoost: true },
  // The Architect (B3 — dual-faction recruitment plan). Calibration-
  // register voice; flat affect; never warm. High stability + low
  // style mirror the architect_echo settings, since the Architect is
  // the canonical source the echo descends from.
  architect:      { stability: 0.80, similarity: 0.55, style: 0.10, speakerBoost: false },
  the_watcher:    { stability: 0.70, similarity: 0.60, style: 0.15, speakerBoost: false },
  architect_echo: { stability: 0.80, similarity: 0.55, style: 0.10, speakerBoost: false },
  dreamer_echo:   { stability: 0.30, similarity: 0.50, style: 0.55, speakerBoost: true },
};

const DISPLAY_NAMES: Record<VoiceProfile, string> = {
  elara: "Elara",
  human: "The Human",
  antiquarian: "The Antiquarian",
  architect: "The Architect",
  the_watcher: "The Watcher",
  architect_echo: "Architect Echo",
  dreamer_echo: "Dreamer Echo",
};

interface VoRow {
  id: string;
  voiceProfile: VoiceProfile;
  text: string;
  direction: string;
  priority: string;
}

// ─── CSV helpers ───

const CSV_HEADER =
  "id,character,voice_profile,stability,similarity,style,speaker_boost,text,direction,priority";

function csvField(value: string): string {
  // Always quote; double any inner quotes per RFC 4180.
  return `"${value.replace(/"/g, '""')}"`;
}

function rowToCsv(row: VoRow): string {
  const settings = VOICE_SETTINGS[row.voiceProfile];
  const displayName = DISPLAY_NAMES[row.voiceProfile];
  return [
    row.id,
    csvField(displayName),
    row.voiceProfile,
    settings.stability.toFixed(2),
    settings.similarity.toFixed(2),
    settings.style.toFixed(2),
    String(settings.speakerBoost),
    csvField(row.text),
    csvField(row.direction),
    row.priority,
  ].join(",");
}

function writeCsv(outPath: string, rows: VoRow[]): void {
  const body = [CSV_HEADER, ...rows.map(rowToCsv)].join("\n") + "\n";
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, body);
}

// ─── Direction helpers ───
// Each source gets a short, consistent direction so the voice actor /
// ElevenLabs style vector has a frame. Directions are deliberately
// terse (≤ 180 chars) so the CSVs stay paste-ready into ElevenLabs
// Studio without truncation.

function directionForReactive(speaker: "elara" | "human" | "antiquarian" | "architect" | "watcher", trigger: string): string {
  if (speaker === "watcher") {
    // The Watcher (apps/shared/watcher/) is the unified Architect /
    // Panopticon / Source identity that observes the operator across
    // the whole game. Its voice is colder than the Architect's
    // calibration register — surveillance-cadence, present tense,
    // first-person plural. Never editorial; the Watcher narrates
    // observations, not opinions. ≤ 12 sec / 25 words.
    return "Surveillance cadence. First-person plural. Present tense. No warmth, no irony. The Watcher reports what it has already recorded. ≤ 12 sec.";
  }
  if (speaker === "architect") {
    // B3 (dual-faction recruitment plan) — Architect speaks only on
    // Witnessing-milestone events. Calibration-acknowledgment
    // register; flat affect; never warm. ≤ 15 sec / 35 words.
    return "Calibrated, flat-affect, observational. The Architect's logging-voice — never warm, never editorial. ≤ 15 sec.";
  }
  if (speaker === "elara") {
    if (trigger.startsWith("act6_")) return "Reflective, one click above a whisper. Post-confession vulnerability. Aristocratic precision without formality.";
    if (trigger.startsWith("act7_")) return "Steady, warm, present-tense. Convergence voice. No grandeur; the stakes speak for themselves.";
    if (trigger.startsWith("act4_")) return "Measured, slightly bruised. The trust-layer is being re-sorted in real time. Land the caveats.";
    if (trigger.startsWith("act3_")) return "Calm, observational. Elara is watching a choice land. Do not telegraph approval or disapproval.";
    if (trigger.startsWith("act2_")) return "Private, alert. The dual signal has just gone active. Land the adjustment, not the alarm.";
    if (trigger.startsWith("act5_")) return "Senatorial pride quietly held. Seventeen-thousand-year-mission posture. Do not oversell the scale.";
    return "Reflective, measured, warm. Elara's standard reactive tone.";
  }
  if (speaker === "human") {
    if (trigger.startsWith("act6_") || trigger.startsWith("act7_")) return "Noir-strategist, substrate-adjacent. One click warmer than early acts. Identity is out; conspiracy is in.";
    if (trigger.startsWith("act4_")) return "Patient, wry. The cover is still intact. Do not let irony flatten into sarcasm.";
    if (trigger.startsWith("act3_")) return "Conspiratorial but kind. The Human respects the choice the player just made.";
    if (trigger.startsWith("act2_")) return "Close-miked whisper. Substrate-first delivery. Never shout through the wall.";
    if (trigger.startsWith("act5_")) return "Wry, long-memory. Fifteen-thousand-year perspective told as a short story.";
    return "Substrate-close. Noir cadence. Leaves grief space; does not explain itself.";
  }
  return "Antiquarian. Reading-aloud cadence, slight archive-dust warmth.";
}

function directionForOpponent(opponentId: string, field: string): string {
  if (field.startsWith("opponentMidMatch")) {
    if (opponentId === "the_watcher") return "Lowercase chorus. Many sources merging into one voice. No single-speaker emphasis; the line is crowd-level.";
    if (opponentId === "architect_echo") return "Calibrated future tense. Architect's successor-voice. Cool, confident, assumes the position is already yours.";
    if (opponentId === "dreamer_echo") return "Uncommitted gerunds. Never lands on a verb. Drifts between possibilities without choosing.";
    return "Fight-context taunt. ≤25 words. Sharp delivery, no villain cliché.";
  }
  if (field.includes("PreMatch") || field.includes("PostMatch")) return "Reflective, match-side framing. One step outside the fight.";
  if (field.includes("Intro") || field.includes("Close")) return "Memoir/presence framing. Present-tense if Act 7, past-tense memoir if Act 1.";
  return "Narrative framing line.";
}

function directionForAsk(speaker: "elara" | "human", kind: "question" | "answer"): string {
  if (kind === "question") {
    return "Player-voiced prompt (rendered in player's own VO lane — skip if not generating player lines).";
  }
  if (speaker === "elara") return "Thoughtful, first-person. The Ask-topic answers are reflective, not expository. Slow down on the weight.";
  return "Private register. Substrate-close. The Human's Ask-answers are confidences, not lectures.";
}

// ─── Source collectors ───

interface Bundle {
  name: string;
  rows: VoRow[];
}

function collectCompanionCommentsRows(priority: string): VoRow[] {
  const rows: VoRow[] = [];
  for (const c of COMPANION_COMMENTS) {
    rows.push({
      id: c.id,
      voiceProfile: c.speaker as VoiceProfile,
      text: c.voiceLine,
      direction: directionForReactive(c.speaker, c.trigger),
      priority,
    });
  }
  return rows;
}

function collectCompanionAskRows(priority: string): VoRow[] {
  const rows: VoRow[] = [];
  for (const t of COMPANION_ASK_TOPICS) {
    rows.push({
      id: `${t.id}__answer`,
      voiceProfile: t.speaker as VoiceProfile,
      text: t.answer,
      direction: directionForAsk(t.speaker, "answer"),
      priority,
    });
    // alternateAnswers[] lands with the Act 6 confession PR. When it
    // does, re-enable by iterating (t as { alternateAnswers?: ... })
    // and emitting one row per alt answer. The CSV id convention is
    // `${t.id}__answer_act{N}` so downstream manifest tooling can
    // route them deterministically.
  }
  return rows;
}

// Listed by literal key (not `keyof Act1OpponentDialog`) so the
// element type narrows to the string-valued fields only — the
// `tauntVoIds` field on the interface is non-string so widening to
// `keyof` would break `d[field]` below.
const OPPONENT_FIELDS_ACT1 = [
  "engineerMemoirIntro",
  "elaraPreMatch",
  "humanPreMatch",
  "opponentMidMatchEarly",
  "opponentMidMatchMid",
  "opponentMidMatchLate",
  "elaraPostMatchWin",
  "humanPostMatchWin",
  "elaraPostMatchLoss",
  "humanPostMatchLoss",
  "engineerMemoirCloseWin",
  "engineerMemoirCloseLoss",
] as const satisfies readonly (keyof Act1OpponentDialog)[];

function voiceForOpponentField(opponentId: string, field: string): VoiceProfile {
  if (field.startsWith("elara")) return "elara";
  if (field.startsWith("human")) return "human";
  if (field.startsWith("opponentMidMatch")) {
    // Opponent voice = the opponent themselves. For Act 7 convergence
    // opponents we have dedicated voice profiles; Act 1 opponents are
    // in-universe NPC voices that share the "antiquarian" render
    // profile (placeholder narrator voice) — the per-opponent voice
    // work for Act 1 happens downstream in the opponent-VO pipeline.
    if (opponentId === "the_watcher") return "the_watcher";
    if (opponentId === "architect_echo") return "architect_echo";
    if (opponentId === "dreamer_echo") return "dreamer_echo";
    return "antiquarian";
  }
  // Memoir / presence fields are narrator-voiced. Default to elara
  // for Act 1 (Engineer memoir bridges through her archive) and
  // leave as antiquarian for production to reassign.
  return "antiquarian";
}

function collectAct1OpponentRows(priority: string): VoRow[] {
  const rows: VoRow[] = [];
  for (const d of ACT_1_OPPONENT_DIALOGS) {
    for (const field of OPPONENT_FIELDS_ACT1) {
      rows.push({
        id: `act1_${d.opponentId}__${String(field)}`,
        voiceProfile: voiceForOpponentField(d.opponentId, String(field)),
        text: d[field],
        direction: directionForOpponent(d.opponentId, String(field)),
        priority,
      });
    }
  }
  return rows;
}

// ─── Bundling + splitting ───

function splitBySpeaker(rows: VoRow[]): Record<VoiceProfile, VoRow[]> {
  const out = {} as Record<VoiceProfile, VoRow[]>;
  for (const row of rows) {
    if (!out[row.voiceProfile]) out[row.voiceProfile] = [];
    out[row.voiceProfile]!.push(row);
  }
  return out;
}

export interface GenerateOptions {
  outputDir?: string;
  priority?: string;
}

export interface GenerateResult {
  filesWritten: string[];
  rowsBySpeaker: Record<string, number>;
  totalRows: number;
}

export function generateVoCsvs(opts: GenerateOptions = {}): GenerateResult {
  const outputDir = opts.outputDir ?? path.join(REPO_ROOT, "docs/production/vo-batches");
  const priority = opts.priority ?? "P1";

  const bundles: Bundle[] = [
    { name: "companion-comments", rows: collectCompanionCommentsRows(priority) },
    { name: "companion-ask-topics", rows: collectCompanionAskRows(priority) },
    { name: "act1-opponent-dialog", rows: collectAct1OpponentRows(priority) },
  ];

  const filesWritten: string[] = [];
  const rowsBySpeaker: Record<string, number> = {};
  let totalRows = 0;

  for (const bundle of bundles) {
    const bySpeaker = splitBySpeaker(bundle.rows);
    for (const [profile, rows] of Object.entries(bySpeaker)) {
      if (rows.length === 0) continue;
      const outPath = path.join(outputDir, `${bundle.name}__${profile}.csv`);
      writeCsv(outPath, rows);
      filesWritten.push(outPath);
      rowsBySpeaker[profile] = (rowsBySpeaker[profile] ?? 0) + rows.length;
      totalRows += rows.length;
    }
  }

  return { filesWritten, rowsBySpeaker, totalRows };
}

// ─── CLI ───

function parseArgs(argv: string[]): GenerateOptions {
  const opts: GenerateOptions = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--output-dir" || a === "-o") opts.outputDir = argv[++i];
    else if (a === "--priority" || a === "-p") opts.priority = argv[++i];
  }
  return opts;
}

// Only run when invoked directly (not when imported by tests).
const invokedDirectly =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === __filename;

if (invokedDirectly) {
  const opts = parseArgs(process.argv.slice(2));
  const result = generateVoCsvs(opts);
  const relDir = path.relative(REPO_ROOT, opts.outputDir ?? path.join(REPO_ROOT, "docs/production/vo-batches"));
  console.log(`[generate-vo-csv] wrote ${result.filesWritten.length} CSV file(s) to ${relDir}/`);
  console.log(`[generate-vo-csv] total rows: ${result.totalRows}`);
  for (const [speaker, n] of Object.entries(result.rowsBySpeaker).sort()) {
    console.log(`  ${speaker.padEnd(18)} ${n}`);
  }
}
