#!/usr/bin/env node
/**
 * Build the 24 apprentice VO line files from the source-of-truth in
 * apps/shared/apprenticeVoiceLines.ts.
 *
 * For each (archetype × gender) combo, emits:
 *   apps/scripts/apprentice-<archetype>-<gender>-lines.json
 *
 * The generator is idempotent — re-running it overwrites the JSON
 * deterministically. Add lines to apprenticeVoiceLines.ts and rerun.
 *
 * Usage:
 *   pnpm tsx apps/scripts/build-apprentice-vo-lines.mjs
 *   (or: node apps/scripts/build-apprentice-vo-lines.mjs after compile)
 */

import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const SRC_TS = join(REPO_ROOT, "apps", "shared", "apprenticeVoiceLines.ts");
const OUT_DIR = join(REPO_ROOT, "apps", "scripts");

const ARCHETYPES = [
  "zealot",
  "ghost",
  "scholar",
  "revenant",
  "artisan",
  "oracle",
  "wanderer",
  "martyr",
  "heretic",
  "jester",
  "sentinel",
  "prodigal",
];

const GENDERS = ["female", "male"];

/** Apply pronoun substitution + leading-pronoun capitalisation. Mirrors
 *  applyPronouns() in apprenticeVoiceLines.ts. */
function applyPronouns(line, gender) {
  const map =
    gender === "female"
      ? { they: "she", them: "her", their: "her", theirs: "hers", themself: "herself" }
      : { they: "he", them: "him", their: "his", theirs: "his", themself: "himself" };
  let out = line;
  for (const key of Object.keys(map)) {
    out = out.replace(new RegExp(`\\{${key}\\}`, "g"), map[key]);
  }
  out = out.replace(/(^|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
  return out;
}

/** Parse the line bank from the TS source via a tiny extract: import the
 *  module via tsx if available, else fall back to a regex parse. We use
 *  tsx eval so the source-of-truth stays typed. */
async function loadLineBank() {
  const srcExists = await fs
    .stat(SRC_TS)
    .then(() => true)
    .catch(() => false);
  if (!srcExists) {
    throw new Error(`apprenticeVoiceLines.ts not found at ${SRC_TS}`);
  }
  // Use tsx to evaluate the TS file and dump the bank as JSON. Run from
  // the repo root so the import resolves through the workspace.
  const escaped = SRC_TS.replace(/\\/g, "\\\\");
  const dumpCmd = `pnpm tsx -e "import('${escaped}').then(m => process.stdout.write(JSON.stringify(m.APPRENTICE_VOICE_LINES)))"`;
  const buf = execSync(dumpCmd, { cwd: REPO_ROOT, encoding: "utf8" });
  return JSON.parse(buf);
}

async function main() {
  const bank = await loadLineBank();
  const summary = [];
  for (const archetype of ARCHETYPES) {
    const lines = bank[archetype];
    if (!lines) {
      console.warn(`[apprentice-vo] missing lines for ${archetype}`);
      continue;
    }
    for (const gender of GENDERS) {
      const out = lines.map((l) => ({
        id: `${archetype}_${gender}_${l.id}`,
        character: `apprentice_${archetype}_${gender}`,
        text: applyPronouns(l.text, gender),
        emotion: l.emotion,
        bucket: l.bucket,
        file: "shared/apprenticeVoiceLines.ts",
      }));
      const outPath = join(
        OUT_DIR,
        `apprentice-${archetype}-${gender}-lines.json`,
      );
      await fs.writeFile(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
      summary.push({ archetype, gender, lines: out.length, path: outPath });
    }
  }
  console.log(
    `Wrote ${summary.length} apprentice VO line files (${
      summary.reduce((acc, s) => acc + s.lines, 0)
    } total lines).`,
  );
  for (const s of summary) {
    console.log(`  ${s.archetype} × ${s.gender}: ${s.lines} lines`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
