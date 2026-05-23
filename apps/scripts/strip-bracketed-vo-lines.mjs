#!/usr/bin/env node
/**
 * Bucket-B polish — strip leading/trailing brackets from voice-bank
 * `text` fields where the entire line is wrapped in `[ ... ]`. The
 * stage-direction lint flags these because TTS will speak the
 * brackets literally, and the runtime stripper (voSpokenText.ts)
 * leaves the line empty after removal — neither outcome is what
 * the writer wanted. Source files are the canonical record, so
 * fix them at the source.
 *
 * Touches only lines whose text *starts* with `[` and *ends* with
 * `]` (and contains no other unbalanced brackets) — purely
 * cosmetic delimiter strip; the spoken text inside is preserved.
 */
import * as fs from "node:fs";
import * as path from "node:path";

const FILES = [
  "apps/scripts/npc-the_source-lines.json",
  "apps/scripts/wraith-calder-first-meet-lines.json",
  "apps/scripts/human-lines.json",
  "apps/scripts/oracle-first-meet-lines.json",
];

const ROOT = process.cwd();
let totalStripped = 0;

for (const rel of FILES) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.error(`skip ${rel} — not found`);
    continue;
  }
  const raw = fs.readFileSync(abs, "utf8");
  const entries = JSON.parse(raw);
  if (!Array.isArray(entries)) {
    console.error(`skip ${rel} — not an array`);
    continue;
  }
  let stripped = 0;
  for (const entry of entries) {
    if (typeof entry?.text !== "string") continue;
    const t = entry.text.trim();
    if (!t.startsWith("[") || !t.endsWith("]")) continue;
    // Reject if there's a nested unbalanced bracket — would change meaning.
    const inner = t.slice(1, -1);
    if (inner.includes("[") || inner.includes("]")) continue;
    // npcFirstMeetLines.test.ts round-trip invariant:
    //   (directionNotes ?? text) === dialog-tree onscreenText
    // For dialog-tree-sourced entries (those with meta.treeId) the
    // canonical onscreenText INCLUDES the brackets, so we must
    // preserve them in `directionNotes`. TTS still receives the
    // clean `text` (the extractor reads `text` directly), so the
    // stage-direction lint is satisfied AND the round-trip holds.
    if (entry?.meta?.treeId && typeof entry.directionNotes !== "string") {
      entry.directionNotes = t;
    }
    entry.text = inner.trim();
    stripped++;
  }
  totalStripped += stripped;
  fs.writeFileSync(abs, JSON.stringify(entries, null, 2) + "\n", "utf8");
  console.log(`${rel}: stripped ${stripped} bracket-wrapped lines`);
}

console.log(`\nTotal: ${totalStripped} lines de-bracketed.`);
