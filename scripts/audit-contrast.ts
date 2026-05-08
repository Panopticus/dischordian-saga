#!/usr/bin/env tsx
/* Void Energy contrast audit.
 *
 * Resolves every fg/bg pair declared in
 * apps/shared/_completeness/checks/voidContrastCoverage.ts:TOKEN_PAIRS,
 * computes its WCAG 2.1 contrast ratio (reusing the math in
 * apps/shared/contrastAudit.ts), and either prints the resulting
 * MEASURED[] snippet (default) or splices it back into the check file
 * (--write).
 *
 * No headless browser needed: tokens resolve to concrete hex literals
 * via var() fallback chains in apps/client/src/engine/void-materials.css.
 *
 * Usage:
 *   pnpm tsx scripts/audit-contrast.ts            # dry-run, prints snippet
 *   pnpm tsx scripts/audit-contrast.ts --write    # rewrites MEASURED[]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { checkContrast } from "../apps/shared/contrastAudit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");
const CSS_PATH = resolve(REPO_ROOT, "apps/client/src/engine/void-materials.css");
const CHECK_PATH = resolve(
  REPO_ROOT,
  "apps/shared/_completeness/checks/voidContrastCoverage.ts",
);

interface Pair {
  fg: string;
  bg: string;
  threshold: number;
}

/** Extract `--name: value;` declarations. Captures both flat values
 *  (`#abc`, `rgb(...)`) and var() expressions including nested fallbacks. */
function parseCssVars(css: string): Map<string, string> {
  const map = new Map<string, string>();
  // Match: --name: <value> ;  (value may span balanced parens but no semicolons)
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+?)\s*;/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    // Last definition wins — matches CSS cascade for the same selector.
    map.set(m[1], m[2].trim());
  }
  return map;
}

/** Resolve `var(--name, fallback)` chains until we land on a concrete
 *  color literal. Bails after 8 hops (cycle guard). */
function resolveColor(token: string, vars: Map<string, string>): string {
  let value = token;
  for (let hop = 0; hop < 8; hop++) {
    const trimmed = value.trim();
    // Concrete: starts with # or rgb / rgba / hsl
    if (/^(#|rgba?\(|hsla?\()/.test(trimmed)) return trimmed;
    // var(--name, fallback)
    const varMatch = trimmed.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*(.+))?\)$/i);
    if (!varMatch) {
      throw new Error(`Cannot resolve color token: ${token} (stuck at "${trimmed}")`);
    }
    const [, name, fallback] = varMatch;
    const resolved = vars.get(name);
    if (resolved) {
      value = resolved;
      continue;
    }
    if (fallback) {
      value = fallback;
      continue;
    }
    throw new Error(`Unresolved CSS var: ${name}`);
  }
  throw new Error(`Resolution depth exceeded for: ${token}`);
}

/** Read TOKEN_PAIRS straight from the check file so the script and
 *  the gate can never disagree about what's measured. */
function readTokenPairs(checkSource: string): Pair[] {
  const arrayMatch = checkSource.match(
    /const TOKEN_PAIRS[^=]*=\s*\[([\s\S]*?)\];/,
  );
  if (!arrayMatch) throw new Error("Could not locate TOKEN_PAIRS in check file");
  const pairs: Pair[] = [];
  const rowRe = /\{\s*fg:\s*"(--[a-z0-9-]+)"\s*,\s*bg:\s*"(--[a-z0-9-]+)"\s*,\s*threshold:\s*([\d.]+)\s*\}/gi;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(arrayMatch[1]))) {
    pairs.push({ fg: m[1], bg: m[2], threshold: parseFloat(m[3]) });
  }
  return pairs;
}

const css = readFileSync(CSS_PATH, "utf8");
const checkSrc = readFileSync(CHECK_PATH, "utf8");
const vars = parseCssVars(css);
const pairs = readTokenPairs(checkSrc);

interface Measured {
  fg: string;
  bg: string;
  threshold: number;
  measuredRatio: number;
  fgHex: string;
  bgHex: string;
  passes: boolean;
}

const measured: Measured[] = pairs.map((p) => {
  const fgHex = resolveColor(`var(${p.fg})`, vars);
  const bgHex = resolveColor(`var(${p.bg})`, vars);
  const result = checkContrast(fgHex, bgHex);
  return {
    fg: p.fg,
    bg: p.bg,
    threshold: p.threshold,
    measuredRatio: result.ratio,
    fgHex,
    bgHex,
    passes: result.ratio >= p.threshold,
  };
});

// Pretty stdout report
const tableRows = measured.map((m) => {
  const flag = m.passes ? "PASS" : "FAIL";
  return `  ${flag}  ${m.fg.padEnd(22)} on ${m.bg.padEnd(18)} = ${String(m.measuredRatio).padStart(6)}:1  (need ≥${m.threshold})  [${m.fgHex} on ${m.bgHex}]`;
});
console.log("Void Energy contrast audit");
console.log("──────────────────────────");
console.log(tableRows.join("\n"));
console.log("──────────────────────────");
const passingCount = measured.filter((m) => m.passes).length;
console.log(`${passingCount} / ${measured.length} pairs clear their threshold.`);
console.log("");

// MEASURED[] snippet — exact shape the check file expects
const snippet = measured
  .map(
    (m) =>
      `  { fg: "${m.fg}", bg: "${m.bg}", measuredRatio: ${m.measuredRatio}, threshold: ${m.threshold} },`,
  )
  .join("\n");

const writeMode = process.argv.includes("--write");
if (writeMode) {
  const before = checkSrc;
  // Replace the existing MEASURED const body. Match the entire block from
  // `const MEASURED: Pair[] = [` to the matching `];`.
  const measuredBlockRe = /const MEASURED:\s*Pair\[\]\s*=\s*\[[\s\S]*?\];/;
  if (!measuredBlockRe.test(before)) {
    throw new Error("Could not locate MEASURED[] block in check file");
  }
  const after = before.replace(
    measuredBlockRe,
    `const MEASURED: Pair[] = [\n${snippet}\n];`,
  );
  writeFileSync(CHECK_PATH, after, "utf8");
  console.log(`✓ MEASURED[] updated in ${CHECK_PATH}`);
} else {
  console.log("MEASURED[] snippet (paste into voidContrastCoverage.ts, or run with --write):");
  console.log(`const MEASURED: Pair[] = [\n${snippet}\n];`);
}

if (measured.some((m) => !m.passes)) {
  console.error("\n✗ One or more pairs failed WCAG threshold; retune the offending tokens.");
  process.exit(1);
}
