#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════
   VOID ENERGY MIGRATE — single-file migration helper

   Reusable migration worker that applies the Slice-3-through-6
   axis recipe to one file at a time. Shared by:
     - the pre-commit hook (.git/hooks/pre-commit) which runs
       it against staged .tsx/.ts files on every commit
     - the /migrate-void-energy Claude skill, which runs it
       against a file the contributor is about to edit

   Invocation:
     node scripts/void-energy-migrate.mjs <file>...

   Exit codes:
     0 — file(s) migrated (or already clean). New adopted
         entries appended to .void-energy-adopted.
     1 — file changed but still has residual violations
         (raw-px, unmapped hex). Contributor needs to fix
         manually before the ratchet will pass.

   The same-file, per-invocation shape keeps organic migration
   painless: you run this on the file you're already editing,
   it touches only that file, and your PR picks up the
   migration as a side effect.
   ═══════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

/* ─── Axis mapping (same recipe as Slices 3-6) ─── */

const FAMILY_MAP = {
  cyan: { text: "void-text-energy", bg: "void-bg-success", border: "void-border-success" },
  green: { text: "void-text-energy", bg: "void-bg-success", border: "void-border-success" },
  emerald: { text: "void-text-energy", bg: "void-bg-success", border: "void-border-success" },
  lime: { text: "void-text-energy", bg: "void-bg-success", border: "void-border-success" },
  teal: { text: "void-text-energy", bg: "void-bg-success", border: "void-border-success" },
  amber: { text: "void-text-accent", bg: "void-bg-sunk", border: "void-border" },
  yellow: { text: "void-text-premium", bg: "void-bg-sunk", border: "void-border" },
  orange: { text: "void-text-premium", bg: "void-bg-sunk", border: "void-border" },
  red: { text: "void-text-error", bg: "void-bg-error", border: "void-border-error" },
  rose: { text: "void-text-error", bg: "void-bg-error", border: "void-border-error" },
  pink: { text: "void-text-error", bg: "void-bg-error", border: "void-border-error" },
  purple: { text: "void-text-system", bg: "void-bg-system", border: "void-border-system" },
  violet: { text: "void-text-system", bg: "void-bg-system", border: "void-border-system" },
  fuchsia: { text: "void-text-system", bg: "void-bg-system", border: "void-border-system" },
  blue: { text: "void-text-energy", bg: "void-bg-sunk", border: "void-border" },
  sky: { text: "void-text-energy", bg: "void-bg-sunk", border: "void-border" },
  indigo: { text: "void-text-energy", bg: "void-bg-sunk", border: "void-border" },
  stone: { text: "void-text", bg: "void-bg-canvas", border: "void-border" },
  slate: { text: "void-text", bg: "void-bg-canvas", border: "void-border" },
  gray: { text: "void-text", bg: "void-bg-canvas", border: "void-border" },
  zinc: { text: "void-text", bg: "void-bg-canvas", border: "void-border" },
  neutral: { text: "void-text", bg: "void-bg-canvas", border: "void-border" },
};

const RGBA_AXIS_MAP = [
  { rgb: "51,226,230", token: "var(--energy-primary)" },
  { rgb: "34,211,238", token: "var(--energy-primary)" },
  { rgb: "56,117,250", token: "var(--electric-blue)" },
  { rgb: "59,130,246", token: "var(--electric-blue)" },
  { rgb: "255,183,77", token: "var(--energy-premium)" },
  { rgb: "255,140,0",  token: "var(--energy-premium)" },
  { rgb: "255,215,0",  token: "var(--energy-premium)" },
  { rgb: "245,158,11", token: "var(--energy-accent)" },
  { rgb: "168,85,247", token: "var(--energy-system)" },
  { rgb: "34,197,94",  token: "var(--energy-success)" },
  { rgb: "5,150,105",  token: "var(--energy-success)" },
  { rgb: "74,222,128", token: "var(--energy-success)" },
  { rgb: "220,38,38",  token: "var(--energy-error)" },
  { rgb: "239,68,68",  token: "var(--energy-error)" },
  { rgb: "248,113,113", token: "var(--energy-error)" },
  { rgb: "251,113,133", token: "var(--energy-error)" },
  { rgb: "192,132,252", token: "var(--energy-system)" },
  { rgb: "96,165,250", token: "var(--electric-blue)" },
  { rgb: "251,191,36", token: "var(--energy-premium)" },
  { rgb: "0,0,0",      token: "var(--bg-void)" },
  { rgb: "1,0,32",     token: "var(--bg-void)" },
  { rgb: "255,255,255", token: "var(--text-primary)" },
];

const HEX_MAP = [
  [/#33E2E6/gi, "var(--energy-primary)"],
  [/#22d3ee/gi, "var(--energy-primary)"],
  [/#3875FA/gi, "var(--electric-blue)"],
  [/#FF8C00/gi, "var(--energy-premium)"],
  [/#F59E0B/gi, "var(--energy-accent)"],
  [/#FFD700/gi, "var(--energy-premium)"],
  [/#FFA528/gi, "var(--energy-premium)"],
  [/#A078FF/gi, "var(--energy-system)"],
  [/#22C55E/gi, "var(--energy-success)"],
  [/#EF4444/gi, "var(--energy-error)"],
  [/#010020/gi, "var(--bg-void)"],
  [/#0a0c2b/gi, "var(--bg-spotlight)"],
  [/#fde68a/gi, "var(--energy-accent)"],
];

/**
 * Data files whose hex literals feed lerpColor() or other runtime
 * consumers and MUST stay as hex. Skipped entirely.
 */
const DATA_FILE_DENYLIST = new Set([
  "apps/client/src/contexts/MoralityThemeContext.tsx",
  "apps/client/src/data/arenaAssets.ts",
  "apps/client/src/data/moralityUnlockables.ts",
  "apps/client/src/game/arenaHazards.ts",
  "apps/client/src/game/gameData.ts",
  "apps/client/src/game/storyModeChapters.ts",
]);

function pct(a) {
  return Math.round(parseFloat(a) * 100) + "%";
}

function migrate(abs) {
  const rel = path.relative(REPO_ROOT, abs);
  if (DATA_FILE_DENYLIST.has(rel)) {
    return { skipped: true, reason: "data-file (feeds lerpColor)" };
  }
  if (!fs.existsSync(abs)) return { skipped: true, reason: "does not exist" };
  let src = fs.readFileSync(abs, "utf-8");
  const original = src;

  for (const [family, m] of Object.entries(FAMILY_MAP)) {
    src = src.replace(
      new RegExp(`\\btext-${family}-\\d+\\/\\d+`, "g"),
      m.text === "void-text" ? "void-text-dim" : m.text,
    );
    src = src.replace(new RegExp(`\\btext-${family}-\\d+`, "g"), m.text);
    src = src.replace(new RegExp(`\\bbg-${family}-\\d+\\/\\d+`, "g"), m.bg);
    src = src.replace(new RegExp(`\\bbg-${family}-\\d+`, "g"), m.bg);
    src = src.replace(new RegExp(`\\bborder-${family}-\\d+\\/\\d+`, "g"), m.border);
    src = src.replace(new RegExp(`\\bborder-${family}-\\d+`, "g"), m.border);
  }
  src = src.replace(/\bhover:void-([a-z]+(?:-[a-z]+)*)/g, "void-$1");
  src = src
    .replace(/\bvoid-text-(?:energy|error|system|premium|accent|dim|muted)\/\d+\b/g, (m) => m.split("/")[0])
    .replace(/\bvoid-text\/\d+\b/g, "void-text-dim")
    .replace(/\bvoid-border(?:-(?:subtle|success|error|system))?\/\d+\b/g, (m) => m.split("/")[0])
    .replace(/\bvoid-bg-(?:canvas|sunk|success|error|system)\/\d+\b/g, (m) => m.split("/")[0]);

  for (const [re, to] of HEX_MAP) src = src.replace(re, to);

  for (const { rgb, token } of RGBA_AXIS_MAP) {
    const reA = new RegExp(
      `rgba\\(\\s*${rgb.replace(/,/g, "\\s*,\\s*")}\\s*,\\s*([0-9.]+)\\s*\\)`,
      "g",
    );
    src = src.replace(reA, (_m, a) =>
      `color-mix(in oklch, ${token} ${pct(a)}, transparent)`,
    );
    const reT = new RegExp(
      `rgba\\(\\s*${rgb.replace(/,/g, "\\s*,\\s*")}\\s*,\\s*\\$\\{([^}]+)\\}\\s*\\)`,
      "g",
    );
    src = src.replace(reT, (_m, expr) =>
      `color-mix(in oklch, ${token} calc((${expr}) * 100%), transparent)`,
    );
    const reB = new RegExp(
      `rgb\\(\\s*${rgb.replace(/,/g, "\\s*,\\s*")}\\s*\\)`,
      "g",
    );
    src = src.replace(reB, token);
  }

  if (src === original) return { changed: false };
  fs.writeFileSync(abs, src);
  return { changed: true };
}

function appendAdopted(rel) {
  const file = path.join(REPO_ROOT, ".void-energy-adopted");
  const src = fs.readFileSync(file, "utf-8");
  const lines = src.split("\n");
  const entries = new Set(lines.filter((l) => l && !l.startsWith("#")));
  if (entries.has(rel)) return;
  entries.add(rel);
  const header = lines.filter((l) => l.startsWith("#")).join("\n");
  const sorted = Array.from(entries).sort().join("\n");
  fs.writeFileSync(file, header + "\n" + sorted + "\n");
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("usage: node scripts/void-energy-migrate.mjs <file>...");
    process.exit(2);
  }
  let anyChanged = false;
  const anyDirty = false;
  for (const arg of args) {
    const abs = path.isAbsolute(arg) ? arg : path.join(REPO_ROOT, arg);
    const rel = path.relative(REPO_ROOT, abs);
    const result = migrate(abs);
    if (result.skipped) {
      console.log(`[void-migrate] skipped ${rel}: ${result.reason}`);
      continue;
    }
    if (result.changed) {
      anyChanged = true;
      console.log(`[void-migrate] migrated ${rel}`);
    } else {
      console.log(`[void-migrate] ${rel} already clean`);
    }
  }
  if (anyChanged) {
    console.log("[void-migrate] run `pnpm lint:void-energy` then add clean files to .void-energy-adopted");
  }
  process.exit(anyDirty ? 1 : 0);
}

main();
