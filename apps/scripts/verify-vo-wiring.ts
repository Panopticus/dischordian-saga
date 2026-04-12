#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   VERIFY VO WIRING — Comprehensive voice-over audit

   Checks every VO manifest against its lines JSON,
   scans code for speak() references, and reports all
   gaps so nothing falls through the cracks.

   Usage:  npx tsx apps/scripts/verify-vo-wiring.ts
   ═══════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename } from "path";

const ROOT = join(import.meta.dirname, "..");
const SHARED = join(ROOT, "shared");
const SCRIPTS = join(ROOT, "scripts");
const CLIENT_SRC = join(ROOT, "client/src");
const CADES_FPS = join(ROOT, "..", "games", "cades-fps");

// ── Helpers ────────────────────────────────────────

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function readTextFile(path: string): string {
  return readFileSync(path, "utf-8");
}

interface VoLine {
  id: string;
  text: string;
  context: string;
  emotion: string;
  file?: string;
  character?: string;
}

type VoManifest = Record<string, string>;

let totalIssues = 0;
let totalWarnings = 0;

function issue(msg: string) {
  console.log(`  ❌ ${msg}`);
  totalIssues++;
}

function warn(msg: string) {
  console.log(`  ⚠️  ${msg}`);
  totalWarnings++;
}

function ok(msg: string) {
  console.log(`  ✅ ${msg}`);
}

function section(title: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${"═".repeat(60)}`);
}

// ── 1. Manifest ↔ Lines JSON cross-reference ──────

section("1. MANIFEST ↔ LINES JSON CROSS-REFERENCE");

const manifestFiles = readdirSync(SHARED).filter((f) =>
  f.endsWith("VoManifest.json"),
);
const linesFiles = readdirSync(SCRIPTS).filter((f) =>
  f.endsWith("-lines.json"),
);

const manifestMap: Record<string, VoManifest> = {};
const linesMap: Record<string, VoLine[]> = {};

for (const f of manifestFiles) {
  const charName = f.replace("VoManifest.json", "");
  const data = loadJson<VoManifest>(join(SHARED, f));
  // Filter out metadata keys
  const real: VoManifest = {};
  for (const [k, v] of Object.entries(data)) {
    if (!k.startsWith("_")) real[k] = v;
  }
  manifestMap[charName] = real;
}

for (const f of linesFiles) {
  const charName = f.replace("-lines.json", "");
  linesMap[charName] = loadJson<VoLine[]>(join(SCRIPTS, f));
}

const allManifestChars = new Set(Object.keys(manifestMap));
const allLinesChars = new Set(Object.keys(linesMap));

// Check each character
for (const char of [...allManifestChars].sort()) {
  const manifest = manifestMap[char] ?? {};
  const lines = linesMap[char] ?? [];
  const manifestIds = new Set(Object.keys(manifest));
  const lineIds = new Set(lines.map((l) => l.id));

  console.log(
    `\n  ${char}: ${manifestIds.size} manifest entries, ${lineIds.size} lines`,
  );

  if (!allLinesChars.has(char)) {
    if (manifestIds.size === 0) {
      warn(`No lines JSON and empty manifest (needs content pass)`);
    } else {
      warn(
        `No lines JSON file (${char}-lines.json) — ${manifestIds.size} manifest entries without source text`,
      );
    }
    continue;
  }

  const missingFromManifest = [...lineIds].filter((id) => !manifestIds.has(id));
  const missingFromLines = [...manifestIds].filter((id) => !lineIds.has(id));

  if (missingFromManifest.length === 0 && missingFromLines.length === 0) {
    ok("Perfect match");
  } else {
    for (const id of missingFromManifest) {
      issue(`Line "${id}" in JSON but NOT in manifest (no audio)`);
    }
    for (const id of missingFromLines) {
      warn(`"${id}" in manifest but NOT in lines JSON (orphan audio)`);
    }
  }
}

// ── 2. Empty/placeholder manifest URLs ─────────────

section("2. EMPTY OR PLACEHOLDER MANIFEST URLS");

for (const [char, manifest] of Object.entries(manifestMap).sort()) {
  for (const [key, url] of Object.entries(manifest)) {
    if (!url || url.trim() === "") {
      issue(`${char}: "${key}" has EMPTY URL`);
    }
  }
}
if (totalIssues === 0) ok("All manifest URLs are non-empty (from section 1 count)");

// ── 3. Feature unlock VO check ─────────────────────

section("3. FEATURE UNLOCK VO (FeatureUnlockToast.tsx)");

const roadmapPath = join(SHARED, "featureRoadmap.ts");
if (existsSync(roadmapPath)) {
  const roadmapContent = readTextFile(roadmapPath);
  const featureIds = [
    ...new Set(
      [...roadmapContent.matchAll(/featureId:\s*["'](\w+)["']/g)].map(
        (m) => m[1],
      ),
    ),
  ];

  const elaraManifest = manifestMap["elara"] ?? {};
  let featureMatches = 0;
  let featureMissing = 0;

  for (const fid of featureIds.sort()) {
    const voKey = `feature_${fid}`;
    if (voKey in elaraManifest) {
      featureMatches++;
    } else {
      issue(`feature_${fid} — no Elara VO for this feature unlock`);
      featureMissing++;
    }
  }
  console.log(
    `\n  Summary: ${featureMatches} matched, ${featureMissing} missing`,
  );
} else {
  warn("featureRoadmap.ts not found");
}

// ── 4. ElaraDialog greeting VO check ───────────────

section("4. ELARA DIALOG GREETING VO (ElaraDialog.tsx)");

const elaraDialogPath = join(
  CLIENT_SRC,
  "components",
  "ElaraDialog.tsx",
);
if (existsSync(elaraDialogPath)) {
  const dialogContent = readTextFile(elaraDialogPath);
  // Extract page paths from getPageChoices
  const pathMatches = [
    ...dialogContent.matchAll(
      /(?:path\s*===?\s*["']|\.startsWith\(["'])(\/[\w\-/]*)["']/g,
    ),
  ].map((m) => m[1]);

  const elaraManifest = manifestMap["elara"] ?? {};
  const uniquePaths = [...new Set(pathMatches)];

  for (const p of uniquePaths.sort()) {
    const voKey = `greeting_${p.replace(/^\//, "").replace(/\//g, "_") || "default"}`;
    if (voKey in elaraManifest) {
      ok(`${voKey}`);
    } else {
      issue(`${voKey} — no greeting VO for route ${p}`);
    }
  }
} else {
  warn("ElaraDialog.tsx not found");
}

// ── 5. Cutscene VO check ──────────────────────────

section("5. CUTSCENE VO (CutsceneOverlay.tsx)");

const cutscenePath = join(CLIENT_SRC, "components", "CutsceneOverlay.tsx");
if (existsSync(cutscenePath)) {
  const cutsceneContent = readTextFile(cutscenePath);
  // Find cutscene IDs and count ELARA lines
  const cutsceneBlocks = [
    ...cutsceneContent.matchAll(
      /"(cq_\w+)":\s*\{[^}]*lines:\s*\[(.*?)\]/gs,
    ),
  ];

  const elaraManifest = manifestMap["elara"] ?? {};
  let totalCutsceneGaps = 0;

  for (const [, cid, linesBlock] of cutsceneBlocks) {
    const speakerMatches = [...linesBlock.matchAll(/speaker:\s*"(\w+)"/g)];
    speakerMatches.forEach((m, idx) => {
      if (m[1] === "ELARA") {
        const voKey = `${cid}_${idx}`;
        if (!(voKey in elaraManifest)) {
          issue(`${voKey} — cutscene ELARA line missing VO`);
          totalCutsceneGaps++;
        }
      }
    });
  }

  if (totalCutsceneGaps === 0)
    ok("All cutscene ELARA lines have VO entries");
}

// ── 6. PostBattleDialog VO check ──────────────────

section("6. POST-BATTLE DIALOG VO REFERENCES");

const postBattlePath = join(
  CLIENT_SRC,
  "components",
  "PostBattleDialog.tsx",
);
if (existsSync(postBattlePath)) {
  const pbContent = readTextFile(postBattlePath);
  // Extract all VO ID string literals from the mapping objects
  const voRefs = [
    ...pbContent.matchAll(/:\s*["'](\w+_\w+)["']/g),
  ].map((m) => m[1]);

  const allIds = new Set<string>();
  for (const manifest of Object.values(manifestMap)) {
    for (const k of Object.keys(manifest)) allIds.add(k);
  }

  for (const ref of voRefs) {
    if (allIds.has(ref)) {
      ok(`${ref}`);
    } else {
      issue(`${ref} — referenced in PostBattleDialog but not in any manifest`);
    }
  }
}

// ── 7. CADES/Godot VO check ──────────────────────

section("7. CADES GODOT GAME VO (Elara.gd)");

const elaraGdPath = join(CADES_FPS, "autoloads", "Elara.gd");
if (existsSync(elaraGdPath)) {
  const gdContent = readTextFile(elaraGdPath);

  // Extract LINES keys
  const linesKeys = [...gdContent.matchAll(/^\t"(\w+)":/gm)]
    .map((m) => m[1])
    .filter((k) => !k.startsWith("http"));

  // Extract VO_URLS keys
  const voUrlSection = gdContent.split("const VO_URLS")[1]?.split("const LINES")[0] ?? "";
  const voUrlKeys = new Set(
    [...voUrlSection.matchAll(/^\t"(\w+)":/gm)].map((m) => m[1]),
  );

  // Find LINES keys that appear after the LINES dict
  const linesSection = gdContent.split("const LINES")[1] ?? "";
  const allLinesKeys = [
    ...linesSection.matchAll(/^\t"(\w+)":/gm),
  ].map((m) => m[1]);

  let gdMissing = 0;
  for (const key of allLinesKeys) {
    if (!voUrlKeys.has(key)) {
      issue(`"${key}" has subtitle but no VO_URL`);
      gdMissing++;
    }
  }

  console.log(
    `\n  Summary: ${voUrlKeys.size} with VO, ${gdMissing} subtitle-only`,
  );
} else {
  warn("Elara.gd not found");
}

// ── 8. Meme epoch coverage ─────────────────────────

section("8. MEME EPOCH VO COVERAGE");

const memeManifest = manifestMap["meme"] ?? {};
const memeIntros: Record<string, number> = {};
const memeOutros: Record<string, number> = {};

for (const key of Object.keys(memeManifest)) {
  const introMatch = key.match(/^meme_intro_ep(\d+)_/);
  const outroMatch = key.match(/^meme_outro_ep(\d+)_/);
  if (introMatch) {
    memeIntros[introMatch[1]] = (memeIntros[introMatch[1]] ?? 0) + 1;
  }
  if (outroMatch) {
    memeOutros[outroMatch[1]] = (memeOutros[outroMatch[1]] ?? 0) + 1;
  }
}

const allEpochs = new Set([
  ...Object.keys(memeIntros),
  ...Object.keys(memeOutros),
]);
for (const ep of [...allEpochs].sort()) {
  const intros = memeIntros[ep] ?? 0;
  const outros = memeOutros[ep] ?? 0;
  console.log(`  Epoch ${ep}: ${intros} intros, ${outros} outros`);
  if (intros > 0 && outros === 0) {
    issue(`Epoch ${ep} has ${intros} intros but 0 outros`);
  }
}

// ── 9. Fighter VO Registry coverage ────────────────

section("9. FIGHTER VO REGISTRY COVERAGE");

const registryPath = join(SHARED, "fighterVoRegistry.ts");
if (existsSync(registryPath)) {
  const regContent = readTextFile(registryPath);
  const registeredFighters = [
    ...regContent.matchAll(/"([\w-]+)":\s*\{/g),
  ].map((m) => m[1]);

  for (const fid of registeredFighters) {
    const manifestKey = fid.replace(/-/g, "_");
    const manifest = manifestMap[manifestKey];
    if (!manifest) {
      warn(`${fid} registered but no manifest found`);
    } else if (Object.keys(manifest).length === 0) {
      warn(`${fid} registered but manifest is empty`);
    } else {
      ok(`${fid}: ${Object.keys(manifest).length} entries`);
    }
  }
}

// ── FINAL SUMMARY ──────────────────────────────────

section("FINAL SUMMARY");
console.log(`  Total issues (broken/missing): ${totalIssues}`);
console.log(`  Total warnings (orphans/empty): ${totalWarnings}`);
console.log(
  `  Status: ${totalIssues === 0 ? "✅ ALL CLEAR" : `❌ ${totalIssues} issues need attention`}`,
);
console.log();

process.exit(totalIssues > 0 ? 1 : 0);
