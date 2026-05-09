#!/usr/bin/env node
/**
 * Build the 12 NPC VO line files from npcDialogues.ts (BioWare-style
 * branching topics) and npcCompanionExtensions.ts (reactive comments
 * + banter pairs).
 *
 * For each NamedNpcKey, emits:
 *   apps/scripts/npc-<npcKey>-lines.json
 *
 * Each entry carries:
 *   - id        — `${npcKey}_${bucket}_${path}`, stable across runs
 *   - character — `npc_${npcKey}` (single voice per NPC, no gender split)
 *   - text      — the NPC's spoken line
 *   - bucket    — "dialogue" | "comment" | "banter"
 *   - file      — source-of-truth file
 *
 * The generator is idempotent — re-running it overwrites the JSON
 * deterministically. Add lines to npcDialogues.ts /
 * npcCompanionExtensions.ts and rerun.
 *
 * Usage:
 *   pnpm tsx apps/scripts/build-npc-vo-lines.mjs
 *   (or: node apps/scripts/build-npc-vo-lines.mjs after compile)
 */

import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const DIALOGUE_TS = join(REPO_ROOT, "apps", "shared", "npcDialogues.ts");
const EXTENSIONS_TS = join(
  REPO_ROOT,
  "apps",
  "shared",
  "npcCompanionExtensions.ts",
);
const IDENTITY_TS = join(REPO_ROOT, "apps", "shared", "npcIdentity.ts");
const OUT_DIR = join(REPO_ROOT, "apps", "scripts");

const NPC_KEYS = [
  // Tier 2
  "the_antiquarian",
  "the_seer",
  "the_necromancer",
  "engineer_zero",
  "iron_lion_prefall",
  "drael_mon",
  // Tier 3
  "the_architect",
  "the_dreamer",
  "the_source",
  "the_degen",
  "the_game_master",
  "the_resurrectionist",
];

/** Pull every NPC line from the BioWare-style branching topics. */
async function loadDialogueLines() {
  const exists = await fs
    .stat(DIALOGUE_TS)
    .then(() => true)
    .catch(() => false);
  if (!exists) return {};
  const escaped = DIALOGUE_TS.replace(/\\/g, "\\\\");
  const dumpCmd = `pnpm tsx -e "import('${escaped}').then(m => { const out = {}; for (const k of Object.keys(m.NPC_DIALOGUES)) { const set = m.NPC_DIALOGUES[k]; out[k] = []; for (const t of [set.past, set.calling, set.mortality, set.us]) { for (const l of m.npcTopicLines(t)) out[k].push(l); } } process.stdout.write(JSON.stringify(out)); })"`;
  const buf = execSync(dumpCmd, { cwd: REPO_ROOT, encoding: "utf8" });
  return JSON.parse(buf);
}

/** Pull reactive comments + banter pairs grouped by NPC. */
async function loadCompanionExtensions() {
  const exists = await fs
    .stat(EXTENSIONS_TS)
    .then(() => true)
    .catch(() => false);
  if (!exists) return { comments: {}, banter: {} };
  const escaped = EXTENSIONS_TS.replace(/\\/g, "\\\\");
  const dumpCmd = `pnpm tsx -e "import('${escaped}').then(m => { const comments = {}; const banter = {}; for (const c of m.NPC_REACTIVE_COMMENTS) { (comments[c.speaker] ||= []).push({ id: c.id, text: c.voiceLine, trigger: c.trigger }); } for (const p of m.NPC_BANTER_PAIRS) { for (let i = 0; i < p.speakers.length; i++) { const sp = p.speakers[i]; (banter[sp] ||= []).push({ id: p.id + '_line' + i, text: p.lines[i] ?? '', trigger: p.trigger, partner: p.speakers[1 - i] }); } } process.stdout.write(JSON.stringify({ comments, banter })); })"`;
  const buf = execSync(dumpCmd, { cwd: REPO_ROOT, encoding: "utf8" });
  return JSON.parse(buf);
}

/** Pull NPC identity for the signature line + display name. */
async function loadIdentity() {
  const exists = await fs
    .stat(IDENTITY_TS)
    .then(() => true)
    .catch(() => false);
  if (!exists) return {};
  const escaped = IDENTITY_TS.replace(/\\/g, "\\\\");
  const dumpCmd = `pnpm tsx -e "import('${escaped}').then(m => { const out = {}; for (const k of Object.keys(m.NPC_IDENTITIES)) { const id = m.NPC_IDENTITIES[k]; out[k] = { displayName: id.displayName, signatureLine: id.signatureLine }; } process.stdout.write(JSON.stringify(out)); })"`;
  const buf = execSync(dumpCmd, { cwd: REPO_ROOT, encoding: "utf8" });
  return JSON.parse(buf);
}

function sanitize(s) {
  return s.replace(/[^a-z0-9_]/gi, "_");
}

async function main() {
  const dialogues = await loadDialogueLines();
  const ext = await loadCompanionExtensions();
  const identity = await loadIdentity();
  const summary = [];
  for (const npcKey of NPC_KEYS) {
    const character = `npc_${npcKey}`;
    const out = [];

    // Signature line — one entry per NPC, always present.
    if (identity[npcKey]?.signatureLine) {
      out.push({
        id: `${npcKey}_signature`,
        character,
        text: identity[npcKey].signatureLine,
        bucket: "signature",
        file: "shared/npcIdentity.ts",
      });
    }

    // Branching dialogues (past / calling / mortality / us).
    const dialogLines = dialogues[npcKey] ?? [];
    for (const d of dialogLines) {
      out.push({
        id: `${npcKey}_dlg_${d.topicKind}_${sanitize(d.path)}`,
        character,
        text: d.text,
        bucket: "dialogue",
        emotion: "dialogue",
        file: "shared/npcDialogues.ts",
        dialogueTopic: d.topicKind,
      });
    }

    // Reactive comments — keyed on (npc, trigger).
    const comments = ext.comments?.[npcKey] ?? [];
    for (const c of comments) {
      out.push({
        id: `${npcKey}_comment_${sanitize(c.id)}`,
        character,
        text: c.text,
        bucket: "comment",
        trigger: c.trigger,
        file: "shared/npcCompanionExtensions.ts",
      });
    }

    // Banter pair lines — one entry per (pair, speaker-position).
    const banter = ext.banter?.[npcKey] ?? [];
    for (const b of banter) {
      out.push({
        id: `${npcKey}_banter_${sanitize(b.id)}`,
        character,
        text: b.text,
        bucket: "banter",
        trigger: b.trigger,
        partner: b.partner,
        file: "shared/npcCompanionExtensions.ts",
      });
    }

    const outPath = join(OUT_DIR, `npc-${npcKey}-lines.json`);
    await fs.writeFile(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
    summary.push({
      npcKey,
      lines: out.length,
      buckets: {
        signature: identity[npcKey]?.signatureLine ? 1 : 0,
        dialogue: dialogLines.length,
        comment: comments.length,
        banter: banter.length,
      },
      path: outPath,
    });
  }
  const total = summary.reduce((acc, s) => acc + s.lines, 0);
  console.log(
    `Wrote ${summary.length} NPC VO line files (${total} total lines).`,
  );
  for (const s of summary) {
    const b = s.buckets;
    console.log(
      `  ${s.npcKey}: ${s.lines} lines (sig:${b.signature} / dlg:${b.dialogue} / cmt:${b.comment} / bntr:${b.banter})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
