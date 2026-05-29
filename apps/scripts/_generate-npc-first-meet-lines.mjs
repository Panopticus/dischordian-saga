#!/usr/bin/env node
/**
 * One-off generator: walks every per-NPC first-meeting dialog tree
 * and emits a per-character script JSON file at apps/scripts/<npc>-
 * first-meet-lines.json. Production-bible §3 flagged 60 voLineIds
 * across 8 NPCs that had no transcript in any script JSON; this
 * generator closes that gap from the canonical onscreenText fields
 * already present in the dialog-tree definitions.
 *
 * Per-character output schema matches the existing per-character
 * script JSON shape (id / text / context / emotion / file).
 *
 * Run from repo root:
 *   node apps/scripts/_generate-npc-first-meet-lines.mjs
 *
 * Re-run when new first-meeting trees land or a node's onscreenText
 * is edited. Idempotent — diffable.
 *
 * Skipped NPCs (intentional):
 *   - nilmorg: already has 197 entries in nilmorg-lines.json
 *   - dmc_clone_companion: non-verbal per Phase 6e.1c canon (no
 *     voLineId fields on any node)
 *   - your_eidolon: non-verbal per Phase 6e.1c canon
 */
import { writeFileSync, mkdirSync, readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";

import { ALL_NPC_DIALOG_TREES } from "../shared/npcs/dialogTrees/index.ts";
import { spokenText, hasStageDirection } from "../shared/voSpokenText.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TREES_DIR = resolve(__dirname, "..", "shared", "npcs", "dialogTrees");

/** Resolve each tree's true source file by scanning the dialogTrees
 *  directory for the `id: "<treeId>"` literal. Tree ids are thematic
 *  (wraith_calder's first-meeting tree is `hierophant-first-meeting`),
 *  so the filename can't be reverse-derived from the id — we must read
 *  it from disk. Returns a Map<treeId, { npcKey, fileStem }>. */
function buildTreeSourceIndex() {
  const index = new Map();
  for (const npcKey of readdirSync(TREES_DIR, { withFileTypes: true })) {
    if (!npcKey.isDirectory()) continue;
    const npcDir = join(TREES_DIR, npcKey.name);
    for (const file of readdirSync(npcDir)) {
      if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
      const src = readFileSync(join(npcDir, file), "utf-8");
      const re = /\bid:\s*["']([a-z0-9][a-zA-Z0-9_-]+)["']/g;
      let m;
      while ((m = re.exec(src)) !== null) {
        // Only the tree-level id (not node ids) — tree ids are the ones
        // ALL_NPC_DIALOG_TREES exposes; node ids are filtered out below
        // because we only look up tree ids we actually emit for.
        if (!index.has(m[1])) {
          index.set(m[1], { npcKey: npcKey.name, fileStem: file.slice(0, -3) });
        }
      }
    }
  }
  return index;
}

const TREE_SOURCE_INDEX = buildTreeSourceIndex();

const SKIP_NPC_KEYS = new Set([
  "nilmorg",
  "dmc_clone_companion",
  "your_eidolon",
]);

/** Map an NPC key to the per-character script-JSON filename stem.
 *  Mirrors the existing convention in apps/scripts/ — e.g.
 *  the_seer → seer-first-meet-lines.json. */
function npcKeyToFilename(npcKey) {
  const stem = npcKey.startsWith("the_") ? npcKey.slice(4) : npcKey;
  return `${stem.replace(/_/g, "-")}-first-meet-lines.json`;
}

let totalEntries = 0;
let totalFiles = 0;
const summary = [];

// Group the trees by NPC so a single NPC gets one script JSON file
// per character (rather than one per tree).
const treesByNpc = new Map();
for (const tree of ALL_NPC_DIALOG_TREES) {
  if (SKIP_NPC_KEYS.has(tree.npcKey)) continue;
  if (!treesByNpc.has(tree.npcKey)) treesByNpc.set(tree.npcKey, []);
  treesByNpc.get(tree.npcKey).push(tree);
}

for (const [npcKey, trees] of treesByNpc) {
  const entries = [];
  for (const tree of trees) {
    // Provenance: resolve the tree's real source file (first_meeting.ts,
    // second_meeting_pre_trial.ts, …). The `context`/`file` fields are
    // producer hints; mislabeling every multi-tree NPC's lines as
    // `first_meeting.ts` sends producers to the wrong file. For
    // single-tree NPCs this resolves back to `first_meeting`, so their
    // emitted JSON is unchanged. Falls back defensively to first_meeting.
    const source = TREE_SOURCE_INDEX.get(tree.id);
    const fileStem = source?.fileStem ?? "first_meeting";
    for (const node of Object.values(tree.nodes)) {
      // Skip nodes without a voLineId — those are non-verbal /
      // expression-only beats.
      if (!node.voLineId) continue;
      // Defensive: skip nodes whose onscreenText is empty / absent
      // (also non-verbal beats; the lint contract permits empty
      // text when the renderer reads expressionChannel instead).
      if (!node.onscreenText || node.onscreenText.length === 0) continue;
      // Split the authored onscreenText into the spoken form (clean
      // of producer cue cards) and a `directionNotes` sidecar that
      // preserves the original verbatim for the producer audit and
      // the canonical onscreen renderer. Without the split the
      // ElevenLabs model literally reads "[CUE 0:00]" or "Voice
      // direction: warm." out loud — see apps/shared/voSpokenText.ts.
      const stripped = spokenText(node.onscreenText);
      const direction = hasStageDirection(node.onscreenText);
      entries.push({
        id: node.voLineId,
        text: stripped,
        context: `${fileStem}.${tree.id}`,
        emotion: "first_meeting",
        file: `shared/npcs/dialogTrees/${npcKey}/${fileStem}.ts`,
        ...(direction ? { directionNotes: node.onscreenText } : {}),
        meta: {
          npcKey,
          treeId: tree.id,
          nodeId: node.id,
          requiresRevealStage: node.requiresRevealStage ?? null,
        },
      });
    }
  }
  if (entries.length === 0) continue;

  const filename = npcKeyToFilename(npcKey);
  const outPath = resolve(__dirname, filename);
  writeFileSync(outPath, JSON.stringify(entries, null, 2) + "\n", "utf-8");
  totalFiles++;
  totalEntries += entries.length;
  summary.push({ npcKey, filename, entries: entries.length });
}

console.log(`Wrote ${totalEntries} first-meeting transcript entries across ${totalFiles} files:`);
for (const s of summary) {
  console.log(`  ${s.npcKey.padEnd(22)}  ${String(s.entries).padStart(3)} entries  →  ${s.filename}`);
}
