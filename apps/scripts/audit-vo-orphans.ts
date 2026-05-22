#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   AUDIT VO ORPHAN LINES

   An "orphan" VO line is one where the manifest holds a URL
   pointing at an MP3 on S3, but no `*-lines.json` voice-bank
   file contains the line's authored text. The audio plays in
   the game, but the strip / regenerate pipeline cannot touch
   it because the pipeline keys off line-bank entries.

   Why this matters: orphan audio is whatever some one-off
   process baked into ElevenLabs at generation time. If that
   process included producer stage directions (`[CUE 0:00]`,
   `*speaking warmly*`) in the prompt, the cue is permanently
   spoken into the MP3 with no clean way to refresh it.

   This audit produces three reports:

     1. ORPHANS — id is in a manifest, NOT in any line bank.
        These are the lines our cleanup can't help. If they
        sound wrong in-game, the only fix is to add a source
        entry to a line bank, delete the manifest URL, and
        re-render.

     2. MISSING_AUDIO — id is in a line bank, NOT in any
        manifest. The line is authored but has no audio yet
        (likely awaiting a `vo:gaps` run with credentials).

     3. LIVE_REFS — for the orphans, where in the client TS
        source the id is actually called via speak(). If an
        orphan has no live ref, it's dead audio (safe to
        ignore); if it has refs, fixing it matters.

   Usage:
     pnpm vo:audit-orphans              # human-readable report
     pnpm vo:audit-orphans --json       # machine-readable
   ═══════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SCRIPTS_DIR = path.resolve(REPO_ROOT, "apps", "scripts");
const SHARED_DIR = path.resolve(REPO_ROOT, "apps", "shared");
const CLIENT_SRC = path.resolve(REPO_ROOT, "apps", "client", "src");

const AS_JSON = process.argv.includes("--json");

interface LineEntry {
  id?: string;
  text?: string;
  speaker?: string;
  directionNotes?: string;
}

/** Collect every line id authored in a *-lines.json file. */
function collectLineBankIds(): Map<string, string[]> {
  const out = new Map<string, string[]>(); // id → list of bank files containing it
  for (const name of fs.readdirSync(SCRIPTS_DIR)) {
    if (!name.endsWith("-lines.json")) continue;
    const full = path.join(SCRIPTS_DIR, name);
    let parsed: unknown;
    try {
      parsed = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch {
      continue;
    }
    if (!Array.isArray(parsed)) continue;
    for (const entryUnknown of parsed) {
      const entry = entryUnknown as LineEntry;
      if (typeof entry?.id !== "string") continue;
      if (!out.has(entry.id)) out.set(entry.id, []);
      out.get(entry.id)!.push(name);
    }
  }
  return out;
}

/** Collect every id in every *VoManifest.json. */
function collectManifestIds(): Map<string, string[]> {
  const out = new Map<string, string[]>(); // id → list of manifest files containing it
  for (const name of fs.readdirSync(SHARED_DIR)) {
    if (!name.endsWith("VoManifest.json")) continue;
    const full = path.join(SHARED_DIR, name);
    let parsed: unknown;
    try {
      parsed = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch {
      continue;
    }
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) continue;
    for (const id of Object.keys(parsed as Record<string, unknown>)) {
      if (!out.has(id)) out.set(id, []);
      out.get(id)!.push(name);
    }
  }
  return out;
}

/** Walk every .ts/.tsx file under the client and collect:
 *  • string-literal references — `speakX("some_id")`, including any
 *    function whose name contains "speak" or property access ".speak("
 *  • template-literal references — `speakX(\`prefix_${n}\`)` — we
 *    capture the literal prefix so orphans named "prefix_*" can be
 *    matched fuzzily.
 */
function collectClientReferences(): {
  literals: Map<string, string[]>;       // exact id → list of file paths
  templatePrefixes: Map<string, string[]>; // prefix → list of file paths
} {
  const literals = new Map<string, string[]>();
  const templatePrefixes = new Map<string, string[]>();

  const SPEAK_LITERAL = /\bspeak[A-Za-z]*\s*\(\s*["'`]([^"'`$\n]+?)["'`]/g;
  const SPEAK_TEMPLATE_PREFIX = /\bspeak[A-Za-z]*\s*\(\s*`([^`$\n]+?)\$\{/g;
  // Also catch generic .speak() property calls (npc.speak(...), elaraVo.speak(...))
  const PROP_LITERAL = /\.\s*speak\s*\(\s*["'`]([^"'`$\n]+?)["'`]/g;
  const PROP_TEMPLATE_PREFIX = /\.\s*speak\s*\(\s*`([^`$\n]+?)\$\{/g;

  function walk(dir: string) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (name === "node_modules" || name === "dist" || name === ".git") continue;
        walk(full);
        continue;
      }
      if (!/\.(ts|tsx)$/.test(name)) continue;
      if (/\.test\.(ts|tsx)$/.test(name)) continue;
      const src = fs.readFileSync(full, "utf8");
      const rel = path.relative(REPO_ROOT, full);

      for (const re of [SPEAK_LITERAL, PROP_LITERAL]) {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(src)) !== null) {
          const id = m[1];
          if (!literals.has(id)) literals.set(id, []);
          if (!literals.get(id)!.includes(rel)) literals.get(id)!.push(rel);
        }
      }
      for (const re of [SPEAK_TEMPLATE_PREFIX, PROP_TEMPLATE_PREFIX]) {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(src)) !== null) {
          const prefix = m[1];
          if (!templatePrefixes.has(prefix)) templatePrefixes.set(prefix, []);
          if (!templatePrefixes.get(prefix)!.includes(rel)) templatePrefixes.get(prefix)!.push(rel);
        }
      }
    }
  }

  walk(CLIENT_SRC);
  return { literals, templatePrefixes };
}

function matchesAnyTemplate(id: string, prefixes: Map<string, string[]>): string[] {
  const hits: string[] = [];
  for (const prefix of prefixes.keys()) {
    if (id.startsWith(prefix)) hits.push(prefix);
  }
  return hits;
}

interface OrphanRecord {
  id: string;
  manifests: string[];
  liveRefs: string[];     // file paths where the id is referenced
  matchedTemplate?: string; // when matched via template-literal prefix
}

function main() {
  const lineIds = collectLineBankIds();
  const manifestIds = collectManifestIds();
  const { literals, templatePrefixes } = collectClientReferences();

  const orphans: OrphanRecord[] = [];
  const missingAudio: { id: string; banks: string[]; speaker?: string }[] = [];

  // ORPHANS: in manifest, not in any line bank
  for (const [id, manifestFiles] of manifestIds) {
    if (lineIds.has(id)) continue;
    const liveRefs = literals.get(id) ?? [];
    const tplHits = matchesAnyTemplate(id, templatePrefixes);
    if (liveRefs.length === 0 && tplHits.length === 0) {
      // dead audio (not used in client code) — still report under
      // dead-audio bucket so the human can decide whether to purge,
      // but don't conflate with live orphans.
      orphans.push({ id, manifests: manifestFiles, liveRefs: [] });
    } else {
      orphans.push({
        id,
        manifests: manifestFiles,
        liveRefs,
        matchedTemplate: tplHits[0],
      });
    }
  }

  // MISSING_AUDIO: in line bank, not in any manifest
  for (const [id, banks] of lineIds) {
    if (manifestIds.has(id)) continue;
    missingAudio.push({ id, banks });
  }

  if (AS_JSON) {
    console.log(JSON.stringify({
      summary: {
        line_bank_total: lineIds.size,
        manifest_total: manifestIds.size,
        orphans: orphans.length,
        orphans_live: orphans.filter(o => o.liveRefs.length > 0 || o.matchedTemplate).length,
        orphans_dead: orphans.filter(o => o.liveRefs.length === 0 && !o.matchedTemplate).length,
        missing_audio: missingAudio.length,
      },
      orphans,
      missing_audio: missingAudio,
    }, null, 2));
    return;
  }

  console.log(`\nLine-bank ids:   ${lineIds.size}`);
  console.log(`Manifest ids:    ${manifestIds.size}`);
  console.log(`Client speak() literal references:   ${literals.size}`);
  console.log(`Client speak() template-literal prefixes: ${templatePrefixes.size}`);

  const live = orphans.filter(o => o.liveRefs.length > 0 || o.matchedTemplate);
  const dead = orphans.filter(o => o.liveRefs.length === 0 && !o.matchedTemplate);

  console.log(`\n══════════════════════════════════════════════════════════════`);
  console.log(`ORPHANS — audio on S3, no source line (cannot be regenerated)`);
  console.log(`══════════════════════════════════════════════════════════════`);
  console.log(`Total: ${orphans.length}  (live: ${live.length}  dead: ${dead.length})\n`);

  // Group LIVE orphans by manifest for quick triage.
  const liveByManifest = new Map<string, OrphanRecord[]>();
  for (const o of live) {
    for (const mf of o.manifests) {
      if (!liveByManifest.has(mf)) liveByManifest.set(mf, []);
      liveByManifest.get(mf)!.push(o);
    }
  }
  const liveManifests = [...liveByManifest.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  );
  console.log(`── LIVE orphans (referenced in client code) ──\n`);
  if (liveManifests.length === 0) {
    console.log(`  none — every used VO id has a source line. ✓\n`);
  }
  for (const [mf, list] of liveManifests) {
    console.log(`${mf} — ${list.length}`);
    for (const o of list.slice(0, 8)) {
      const tag = o.matchedTemplate ? `template:${o.matchedTemplate}*` : "literal";
      console.log(`  ${o.id}  (${tag})`);
      for (const ref of o.liveRefs.slice(0, 2)) {
        console.log(`    → ${ref}`);
      }
    }
    if (list.length > 8) console.log(`  … and ${list.length - 8} more`);
    console.log();
  }

  console.log(`── DEAD orphans (audio uploaded but no client reference) ──\n`);
  console.log(`Total: ${dead.length}\n`);
  const deadByManifest = new Map<string, number>();
  for (const o of dead) {
    for (const mf of o.manifests) {
      deadByManifest.set(mf, (deadByManifest.get(mf) ?? 0) + 1);
    }
  }
  for (const [mf, count] of [...deadByManifest.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${mf.padEnd(45)} ${count}`);
  }

  console.log(`\n══════════════════════════════════════════════════════════════`);
  console.log(`MISSING_AUDIO — line authored, no manifest entry`);
  console.log(`══════════════════════════════════════════════════════════════`);
  console.log(`Total: ${missingAudio.length}\n`);
  const missingByBank = new Map<string, number>();
  for (const m of missingAudio) {
    for (const b of m.banks) {
      missingByBank.set(b, (missingByBank.get(b) ?? 0) + 1);
    }
  }
  for (const [bank, count] of [...missingByBank.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30)) {
    console.log(`  ${bank.padEnd(45)} ${count}`);
  }
  if (missingByBank.size > 30) {
    console.log(`  … and ${missingByBank.size - 30} more banks`);
  }
}

main();
