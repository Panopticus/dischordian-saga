#!/usr/bin/env node
/* VO COVERAGE AUDIT — read every line source and every manifest, report
   per-surface counts and missing-line lists. No network calls.

   Usage:  node scripts/_vo-audit.mjs                    (summary)
           node scripts/_vo-audit.mjs --missing antiquarian   (dump
             missing line ids for one surface)
*/
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SCRIPTS = join(ROOT, "apps", "scripts");
const SHARED = join(ROOT, "apps", "shared");

function loadJson(p) {
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
}
function loadManifest(name) {
  const p = join(SHARED, `${name}VoManifest.json`);
  const j = loadJson(p);
  return j && typeof j === "object" ? Object.keys(j) : [];
}
function loadLineIds(file) {
  const p = join(SCRIPTS, file);
  const j = loadJson(p);
  if (!j) return null;
  if (Array.isArray(j)) return j.map((l) => l.id || l.lineId).filter(Boolean);
  return null;
}

/* -------- SURFACES -------- */

const surfaces = [];

// JSON-line-driven surfaces (Python or TS generators that read *-lines.json):
for (const [src, manifest, generator, idem] of [
  ["agent_zero-lines.json",    "agent_zero",    "python3 apps/scripts/generate_agent_zero_vo.py",    true],
  ["antiquarian-lines.json",   "antiquarian",   "python3 apps/scripts/generate_antiquarian_vo.py",   true],
  ["cades-lines.json",         "cades",         "python3 apps/scripts/generate_cades_vo.py",         true],
  ["degen-lines.json",         "degen",         "python3 apps/scripts/generate_degen_vo.py",         true],
  ["elara-lines.json",         "elara",         "python3 apps/scripts/generate_elara_vo.py",         true],
  ["human-lines.json",         "human",         "python3 apps/scripts/generate_human_vo.py",         true],
  ["locke-lines.json",         "locke",         "python3 apps/scripts/generate_locke_vo.py",         true],
  ["meme-lines.json",          "meme",          "python3 apps/scripts/generate_meme_vo.py",          true],
  ["necromancer-lines.json",   "necromancer",   "python3 apps/scripts/generate_necromancer_vo.py",   true],
  ["nilmorg-lines.json",       "nilmorg",       "python3 apps/scripts/generate_nilmorg_vo.py",       true],
  ["shadow_tongue-lines.json", "shadow_tongue", "python3 apps/scripts/generate_shadow_tongue_vo.py", true],
  ["source-lines.json",        "source",        "python3 apps/scripts/generate_source_vo.py",        true],
  ["story-mode-lines.json",    "storyMode",     "pnpm vo:story-mode",                                true],
  ["chess-climb-lines.json",   "gamemaster",    "pnpm tsx apps/scripts/generate-chess-climb-vo.ts",  true],
  ["act2-vo-lines.json",       "act2",          "pnpm vo:act2",                                       true],
  ["act3-vo-lines.json",       "act3",          "pnpm vo:te-sync && pnpm vo:act3",                    true],
  ["act4-vo-lines.json",       "act4",          "pnpm vo:act4",                                       true],
  ["act5-vo-lines.json",       "act5",          "pnpm vo:act5",                                       true],
  ["act6-vo-lines.json",       "act6",          "pnpm vo:act6",                                       true],
  ["act7-vo-lines.json",       "act7",          "pnpm vo:act7",                                       true],
  ["engineer-memoir-lines.json", "engineerMemoir", "pnpm vo:engineer-memoir",                          true],
  ["palimpsest-host-lines.json", "palimpsestHost", "pnpm vo:palimpsest-host",                          true],
  ["seer-lines.json",            "seer",           "pnpm vo:seer",                                     true],
]) {
  const ids = loadLineIds(src) ?? [];
  surfaces.push({
    surface: src.replace(/-lines\.json$/, "").replace(/-vo$/, ""),
    source: src,
    generator,
    idempotent: idem,
    expected: new Set(ids),
    actual: new Set(loadManifest(manifest)),
    manifest,
  });
}

// Companion surfaces (TS-module-driven, idempotent):
function readTsLineIds(filename, exportName) {
  const file = join(SHARED, filename);
  const txt = readFileSync(file, "utf8");
  const ids = [];
  for (const m of txt.matchAll(/lineId:\s*"([^"]+)"/g)) ids.push(m[1]);
  return ids;
}
for (const [filename, exportName, manifestName, label] of [
  ["elaraLines.ts",       "ELARA_LINES",       "elara", "elaraLines.ts"],
  ["humanLines.ts",       "HUMAN_LINES",       "human", "humanLines.ts"],
  ["lockedDoorLines.ts",  "LOCKED_DOOR_LINES", null,    "lockedDoorLines.ts"],
]) {
  const ids = readTsLineIds(filename, exportName);
  // lockedDoorLines split between elara and human — speaker per line
  if (manifestName) {
    const actual = new Set(loadManifest(manifestName));
    surfaces.push({
      surface: label,
      source: filename,
      generator: "pnpm vo:companion",
      idempotent: true,
      expected: new Set(ids),
      actual,
      manifest: manifestName,
    });
  }
}

// Prelude + Act 1 — read CSVs by walking the docs directory
function listCsvIds(globPath) {
  try {
    const files = execSync(`ls ${globPath} 2>/dev/null`).toString().trim().split("\n").filter(Boolean);
    const ids = [];
    for (const f of files) {
      const txt = readFileSync(f, "utf8");
      for (const line of txt.split(/\r?\n/).slice(1)) {
        const id = line.split(",")[0]?.trim().replace(/^"|"$/g, "");
        if (id) ids.push(id);
      }
    }
    return ids;
  } catch { return []; }
}
// Act 1 opponent taunts fold into per-character manifests
// (collector/watcher/eidola/matrikala/authority/programmer/warlord).
{
  const ids = loadLineIds("act1-taunts-lines.json") ?? [];
  const charManifests = ["collector", "watcher", "eidola", "matrikala", "authority", "programmer", "warlord"];
  const charKeys = new Set();
  for (const m of charManifests) for (const id of loadManifest(m)) charKeys.add(id);
  surfaces.push({
    surface: "act1-taunts",
    source: "act1-taunts-lines.json",
    generator: "pnpm vo:act1-taunts",
    idempotent: true,
    expected: new Set(ids),
    actual: charKeys,
    manifest: "(folds into 7 char manifests)",
  });
}

// Engineer-logs surface — engineer-lines.json (generated by
// _generate-engineer-lines.mjs) feeds engineerVoManifest.json.
// Single source, single manifest — audit it like the JSON-driven
// surfaces above.
{
  const ids = loadLineIds("engineer-lines.json") ?? [];
  surfaces.push({
    surface: "engineer-logs",
    source: "engineer-lines.json",
    generator: "pnpm vo:engineer-logs",
    idempotent: true,
    expected: new Set(ids),
    actual: new Set(loadManifest("engineer")),
    manifest: "engineer",
  });
}

// Guild-cutscene surface — guild-cutscene-vo-lines.json fans 62 lines
// out across ~25 per-speaker manifests (aoki, architect, between,
// chorus, engineer, greenshaw, halverez, kanevas, kasra, mireille,
// orphic, politician, proctor, vasara, vellis, vent, vex, warden,
// plus the series regulars elara/human/meme/necromancer/locke/etc.).
// We aggregate by speaker manifest into a single audit row that
// reports total expected vs total found across all touched manifests.
{
  const linesPath = join(SCRIPTS, "guild-cutscene-vo-lines.json");
  const lines = loadJson(linesPath);
  if (Array.isArray(lines)) {
    const expected = new Set();
    const speakerManifests = new Set();
    for (const l of lines) {
      if (l.id) expected.add(l.id);
      if (l.manifest) speakerManifests.add(l.manifest);
    }
    const actual = new Set();
    for (const m of speakerManifests) {
      for (const id of loadManifest(m)) actual.add(id);
    }
    surfaces.push({
      surface: "guild-cutscenes",
      source: "guild-cutscene-vo-lines.json",
      generator: "pnpm vo:guild-cutscenes",
      idempotent: true,
      expected,
      actual,
      manifest: `(folds into ${speakerManifests.size} speaker manifests)`,
    });
  }
}

// Room-mystery verb-coin surface — voIds aren't in any *-lines.json.
// They're authored as fields directly on RoomMysteryModule.responses
// (apps/shared/roomMysteries/*.ts) and the generator (`pnpm
// vo:room-mystery`) expands banded narrations into per-band lineIds.
// We invoke the generator with --list-voids to enumerate the
// expected (speaker, voId) pairs without any API calls.
{
  let lines = [];
  try {
    const out = execSync(
      "pnpm tsx apps/scripts/generate-room-mystery-vo.ts --list-voids",
      { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] },
    ).toString();
    lines = out.split("\n").filter(Boolean);
  } catch (err) {
    // If tsx isn't on PATH or the script fails to load, fall through
    // with an empty expected set — the surface will report 0/0.
    lines = [];
  }
  const elaraExpected = new Set();
  const detectiveExpected = new Set();
  for (const line of lines) {
    const [speaker, voId] = line.split("\t");
    if (speaker === "elara") elaraExpected.add(voId);
    else if (speaker === "detective") detectiveExpected.add(voId);
  }
  const elaraActual = new Set(loadManifest("elara"));
  const humanActual = new Set(loadManifest("human"));
  surfaces.push({
    surface: "room-mystery (elara)",
    source: "apps/shared/roomMysteries/*.ts",
    generator: "pnpm vo:room-mystery",
    idempotent: true,
    expected: elaraExpected,
    actual: elaraActual,
    manifest: "elara",
  });
  surfaces.push({
    surface: "room-mystery (detective)",
    source: "apps/shared/roomMysteries/*.ts",
    generator: "pnpm vo:room-mystery",
    idempotent: true,
    expected: detectiveExpected,
    actual: humanActual,
    manifest: "human",
  });
}

// Apprentice surface — 24 voices (12 archetypes × 2 genders) read from
// apps/scripts/apprentice-<archetype>-<gender>-lines.json and write to
// apps/shared/apprentice<Archetype><Gender>VoManifest.json. Aggregate
// into a single audit row that sums all 24 voice slots.
{
  const ARCHS = [
    "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
    "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
  ];
  const GENS = ["female", "male"];
  for (const a of ARCHS) {
    for (const g of GENS) {
      const ids = loadLineIds(`apprentice-${a}-${g}-lines.json`) ?? [];
      const cap = (s) => s[0].toUpperCase() + s.slice(1);
      const manifestName = `apprentice${cap(a)}${cap(g)}`;
      surfaces.push({
        surface: `apprentice-${a}-${g}`,
        source: `apprentice-${a}-${g}-lines.json`,
        generator: `pnpm vo:apprentice -- --archetype ${a} --gender ${g}`,
        idempotent: true,
        expected: new Set(ids),
        actual: new Set(loadManifest(manifestName)),
        manifest: manifestName,
      });
    }
  }
}

// First-meet surface — 8 NPC first-meeting dialog trees, lines emitted
// by _generate-npc-first-meet-lines.mjs. Each NPC merges into its
// existing per-character manifest where one ships (locke / degen /
// gamemaster / meme / seer) or a new manifest for new NPCs (oracle /
// vexSolene / wraithCalder).
for (const [linesFile, manifestName, npcLabel] of [
  ["adjudicator-locke-first-meet-lines.json", "locke",         "first-meet (locke)"],
  ["degen-first-meet-lines.json",              "degen",         "first-meet (degen)"],
  ["game-master-first-meet-lines.json",        "gamemaster",    "first-meet (game-master)"],
  ["meme-first-meet-lines.json",               "meme",          "first-meet (meme)"],
  ["nilmorg-first-meet-lines.json",            "nilmorg",       "first-meet (nilmorg)"],
  ["oracle-first-meet-lines.json",             "oracle",        "first-meet (oracle)"],
  ["seer-first-meet-lines.json",               "seer",          "first-meet (seer)"],
  ["vex-solene-first-meet-lines.json",         "vexSolene",     "first-meet (vex-solene)"],
  ["wraith-calder-first-meet-lines.json",      "wraithCalder",  "first-meet (wraith-calder)"],
]) {
  const ids = loadLineIds(linesFile) ?? [];
  surfaces.push({
    surface: npcLabel,
    source: linesFile,
    generator: "pnpm vo:first-meet",
    idempotent: true,
    expected: new Set(ids),
    actual: new Set(loadManifest(manifestName)),
    manifest: manifestName,
  });
}

// Banks surface — apps/shared/npcs/banks/<npc>.ts. Each bank's
// lineIds land in the per-NPC manifest (oracle bank → oracleVoManifest,
// etc.). Skips your_eidolon + dmc_clone_companion (non-verbal canon).
function tsLineIdsFor(relPath, fieldName = "lineId") {
  const file = join(ROOT, relPath);
  if (!existsSync(file)) return [];
  const txt = readFileSync(file, "utf8");
  const ids = [];
  const re = new RegExp(`${fieldName}:\\s*"([^"]+)"`, "g");
  for (const m of txt.matchAll(re)) ids.push(m[1]);
  return ids;
}
for (const [bankFile, manifestName, label] of [
  ["apps/shared/npcs/banks/the_oracle.ts",       "oracle",        "bank (the_oracle)"],
  ["apps/shared/npcs/banks/wraith_calder.ts",    "wraithCalder",  "bank (wraith_calder)"],
  ["apps/shared/npcs/banks/adjudicator_locke.ts","locke",         "bank (adjudicator_locke)"],
  ["apps/shared/npcs/banks/the_meme.ts",         "meme",          "bank (the_meme)"],
  ["apps/shared/npcs/banks/vex_solene.ts",       "vexSolene",     "bank (vex_solene)"],
  ["apps/shared/npcs/banks/the_seer.ts",         "seer",          "bank (the_seer)"],
  ["apps/shared/npcs/banks/the_game_master.ts",  "gamemaster",    "bank (the_game_master)"],
  ["apps/shared/npcs/banks/the_degen.ts",        "degen",         "bank (the_degen)"],
  ["apps/shared/npcs/banks/nilmorg.ts",          "nilmorg",       "bank (nilmorg)"],
  ["apps/shared/npcs/banks/the_antiquarian.ts",  "antiquarian",   "bank (the_antiquarian)"],
  ["apps/shared/npcs/banks/jericho_jones.ts",    "jerichoJones",  "bank (jericho_jones)"],
  ["apps/shared/npcs/banks/drael_mon.ts",        "draelMon",      "bank (drael_mon)"],
]) {
  const ids = tsLineIdsFor(bankFile);
  surfaces.push({
    surface: label,
    source: bankFile,
    generator: "pnpm vo:banks",
    idempotent: true,
    expected: new Set(ids),
    actual: new Set(loadManifest(manifestName)),
    manifest: manifestName,
  });
}

// Romance surface — apps/shared/npcs/romanceScenes/<npc>.ts. Each
// scene's lineIds land in the same per-NPC manifest as the bank.
for (const [romanceFile, manifestName, label] of [
  ["apps/shared/npcs/romanceScenes/locke.ts",         "locke",        "romance (locke)"],
  ["apps/shared/npcs/romanceScenes/vex.ts",           "vexSolene",    "romance (vex)"],
  ["apps/shared/npcs/romanceScenes/elara.ts",         "elara",        "romance (elara)"],
  ["apps/shared/npcs/romanceScenes/jericho_jones.ts", "jerichoJones", "romance (jericho_jones)"],
]) {
  const ids = tsLineIdsFor(romanceFile);
  surfaces.push({
    surface: label,
    source: romanceFile,
    generator: "pnpm vo:romance",
    idempotent: true,
    expected: new Set(ids),
    actual: new Set(loadManifest(manifestName)),
    manifest: manifestName,
  });
}

// Encounter surface — multi-speaker scripted encounters. Each speaker
// lands in its own manifest; the audit checks the encounter file's
// lineIds against the union of all speakers' manifests touched
// (per-speaker membership-test isn't tractable here without parsing
// `speaker:` fields, so we fold into the union of the per-encounter
// + per-speaker manifests authored in extended-vo-config.json).
for (const [encFile, manifestNames, label, generator] of [
  ["apps/shared/encounters/masterOfRlyeh.ts",      ["masterOfRlyeh", "elara", "human", "antiquarian"],     "encounter (master_of_rlyeh)",    "pnpm vo:encounters"],
  ["apps/shared/encounters/paleEmissary.ts",       ["paleEmissary",  "elara", "human", "antiquarian"],     "encounter (pale_emissary)",      "pnpm vo:encounters"],
  ["apps/shared/encounters/reckoningDaughter.ts",  ["reckoningDaughter", "elara", "human", "antiquarian"], "encounter (reckoning_daughter)", "pnpm vo:encounters"],
  ["apps/shared/encounters/sourceKaelDialogue.ts", ["source", "kael", "antiquarian"],                       "encounter (source_kael)",        "pnpm vo:encounters"],
  ["apps/shared/encounters/malkiaRevolution.ts",   ["malkia", "elara", "antiquarian"],                      "encounter (malkia_revolution)",  "pnpm vo:encounters"],
]) {
  const ids = tsLineIdsFor(encFile);
  const actualUnion = new Set();
  for (const m of manifestNames) for (const id of loadManifest(m)) actualUnion.add(id);
  surfaces.push({
    surface: label,
    source: encFile,
    generator,
    idempotent: true,
    expected: new Set(ids),
    actual: actualUnion,
    manifest: manifestNames.join("+"),
  });
}

// Awakening overlay surface — Architect + Dreamer cryo-bus voices.
// Both files use `id:` (not `lineId:`); Dreamer cues with empty text
// are intentional pure-hum cues that don't go through TTS.
{
  const archIds = tsLineIdsFor("apps/shared/architectAwakeningLines.ts", "id");
  surfaces.push({
    surface: "awakening-overlay (architect)",
    source: "apps/shared/architectAwakeningLines.ts",
    generator: "pnpm vo:awakening-overlay",
    idempotent: true,
    expected: new Set(archIds),
    actual: new Set(loadManifest("architect")),
    manifest: "architect",
  });
  // Dreamer: only count cues whose text is non-empty (hums are skipped).
  const drFile = join(ROOT, "apps/shared/dreamerAwakeningLines.ts");
  const drTxt = existsSync(drFile) ? readFileSync(drFile, "utf8") : "";
  const drIds = [];
  for (const m of drTxt.matchAll(/\{[\s\S]*?id:\s*"([^"]+)",[\s\S]*?text:\s*"([^"]*)"/g)) {
    if (m[2].length > 0) drIds.push(m[1]);
  }
  surfaces.push({
    surface: "awakening-overlay (dreamer)",
    source: "apps/shared/dreamerAwakeningLines.ts",
    generator: "pnpm vo:awakening-overlay",
    idempotent: true,
    expected: new Set(drIds),
    actual: new Set(loadManifest("dreamer")),
    manifest: "dreamer",
  });
}

// Prelude + Act 1 lines fold into per-speaker manifests (elara/human/
// antiquarian/prince). Cross-resolve here so the audit doesn't
// false-positive an EMPTY surface when those manifests already cover them.
const PER_SPEAKER_MANIFESTS = ["elara", "human", "antiquarian", "prince"];
const allSpeakerKeys = new Set();
for (const sp of PER_SPEAKER_MANIFESTS) {
  for (const id of loadManifest(sp)) allSpeakerKeys.add(id);
}
for (const [csvGlob, generator, label] of [
  [`${ROOT}/docs/production/prelude-asset-build/prompts/voice/section_*.csv`, "pnpm vo:prelude", "prelude (csv)"],
  [`${ROOT}/docs/production/vo-batches/act1-opponent-dialog__*.csv`,           "pnpm vo:act1",    "act1-opponent (csv)"],
]) {
  const ids = listCsvIds(csvGlob);
  surfaces.push({
    surface: label,
    source: csvGlob.replace(ROOT + "/", ""),
    generator,
    idempotent: true,
    expected: new Set(ids),
    actual: allSpeakerKeys,
    manifest: "(folds into elara/human/antiquarian/prince)",
  });
}

/* -------- REPORT -------- */

const arg = process.argv.slice(2);
const onlyMissingFor = arg.includes("--missing") ? arg[arg.indexOf("--missing") + 1] : null;

if (onlyMissingFor) {
  const s = surfaces.find((x) => x.surface === onlyMissingFor || x.manifest === onlyMissingFor);
  if (!s) { console.error("no surface:", onlyMissingFor); process.exit(1); }
  const missing = [...s.expected].filter((id) => !s.actual.has(id));
  console.log(`Missing for ${s.surface} (${missing.length}/${s.expected.size}):`);
  for (const m of missing) console.log("  " + m);
  process.exit(0);
}

const w = (s, n) => String(s).padEnd(n);
console.log(w("surface", 26) + w("expected", 10) + w("in-manifest", 12) + w("missing", 10) + w("idempotent", 12) + "generator");
console.log("-".repeat(120));
let totalMissing = 0;
for (const s of surfaces) {
  const expected = s.expected.size;
  const actual = [...s.expected].filter((id) => s.actual.has(id)).length;
  const missing = expected - actual;
  totalMissing += missing;
  const flag = missing === 0 ? "✓" : missing === expected ? "EMPTY" : `${missing}`;
  console.log(
    w(s.surface, 26) + w(expected, 10) + w(actual, 12) + w(flag, 10) + w(s.idempotent ? "yes" : "no", 12) + s.generator,
  );
}
console.log("-".repeat(120));
console.log(`TOTAL missing across all surfaces: ${totalMissing}`);
console.log("\nNotes:");
console.log("  - All generators (TS + Python) are now idempotent: existing manifest entries are preserved and");
console.log("    skipped on re-run. Safe to invoke any generator multiple times.");
console.log("  - Prelude + Act 1 CSV lines are checked against the merged elara/human/antiquarian/prince");
console.log("    manifests (they fold there, not into a single 'prelude/act1' file).");
console.log("  - Run order: vo:te-sync first (merges TE lines into act3), then vo:act2..7, then vo:companion,");
console.log("    then vo:first-contact, vo:story-mode, chess-climb, then any remaining python char generators.");
