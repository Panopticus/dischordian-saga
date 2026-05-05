#!/usr/bin/env node
/**
 * Lore-vs-code entity-name consistency linter.
 *
 * Greps the loredex JSON (apps/client/src/data/loredex-data.json,
 * the canonical entity registry) for every named entity and checks
 * that names referenced in cards / dialog / episode mysteries exist
 * in the registry.
 *
 * False positives are tolerated — a name found in flavour text
 * doesn't have to be in the loredex. The linter prints WARNINGS,
 * not failures, so writers can decide. Returns nonzero only on
 * I/O errors.
 *
 * Run:
 *   node scripts/_check-entity-names.mjs
 *
 * Wired into CI as advisory — flip to fail-on-warn once the
 * baseline is clean.
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const REPO_ROOT = process.cwd();
const LOREDEX_PATH = resolve(REPO_ROOT, "apps/client/src/data/loredex-data.json");

function readLoredex() {
  const raw = readFileSync(LOREDEX_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  // The file is either an array or an { entries: [...] } envelope.
  const entries = Array.isArray(parsed) ? parsed : parsed.entries ?? [];
  const names = new Set();
  for (const e of entries) {
    if (typeof e?.name === "string") names.add(e.name.trim());
    for (const alias of e?.aliases ?? []) {
      if (typeof alias === "string") names.add(alias.trim());
    }
  }
  return names;
}

function findCandidates() {
  // Pull capitalised multi-word names from card definitions, dialog
  // banks, and episode mysteries. The regex is conservative —
  // requires a 2+ word capitalised phrase, which catches "Mol'Garath"
  // and "The Architect" but not common nouns.
  const re = "[A-Z][a-zA-Z]+(?:[ '][A-Z][a-zA-Z]+){1,4}";
  const cmd = [
    "git grep -h -oE",
    `"${re}"`,
    "-- 'apps/shared/tcg-core/cards/definitions/' 'apps/shared/dialogTrees/' 'apps/shared/episodeMysteries.ts'",
  ].join(" ");
  let output = "";
  try {
    output = execSync(cmd, { encoding: "utf8" });
  } catch (err) {
    output = (err.stdout ?? "").toString();
  }
  // Frequencies — most-cited unknowns first.
  const counts = new Map();
  for (const raw of output.split("\n")) {
    const v = raw.trim();
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return counts;
}

const loredex = readLoredex();
console.error(`[entity-names] loredex: ${loredex.size} known names`);

const candidates = findCandidates();
const unknown = [];
for (const [name, count] of candidates) {
  if (!loredex.has(name)) unknown.push({ name, count });
}
unknown.sort((a, b) => b.count - a.count);

console.log(`\n${unknown.length} candidate name(s) referenced in code but not in loredex:`);
for (const { name, count } of unknown.slice(0, 100)) {
  console.log(`  [${String(count).padStart(3)}x]  ${name}`);
}
if (unknown.length > 100) console.log(`  … ${unknown.length - 100} more`);

console.log("\nNote: false positives are common (flavour text characters, ");
console.log("place names, weapon names that aren't loredex entities). Use ");
console.log("the count column to prioritise — high-frequency unknowns are");
console.log("most likely real loredex gaps worth filling.");
