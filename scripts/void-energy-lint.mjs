#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════
   VOID ENERGY LINT — ratchet for Tier 3A adoption

   Reads the adopted-files registry at
   `.void-energy-adopted` (one path per line, relative to
   repo root, # comments allowed) and scans each for
   hardcoded Tailwind color classes and hex literals. Exit
   code 1 if any are found — that's the ratchet: once a
   file is marked adopted, it cannot regress.

   Intentional exceptions go in `.void-energy-intentional`
   (same format). Those paths are never scanned.

   Invocation (CI + local):
     node scripts/void-energy-lint.mjs
   ═══════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

/** Hardcoded color patterns the ratchet forbids. Narrow but strict. */
const FORBIDDEN_PATTERNS = [
  // Raw hex — catches "#fff", "#ffffff", "#ffffff99"
  { name: "hex literal", re: /#(?:[0-9a-fA-F]{3,8})\b/ },
  // Tailwind text/bg/border color classes with numeric ramp
  {
    name: "tailwind color ramp",
    re: /\b(?:text|bg|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
  },
];

function readList(filename) {
  const file = path.join(REPO_ROOT, filename);
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

function scan(relativePath) {
  const abs = path.join(REPO_ROOT, relativePath);
  if (!fs.existsSync(abs)) {
    return [{ kind: "missing", message: `adopted file does not exist: ${relativePath}` }];
  }
  const source = fs.readFileSync(abs, "utf-8");
  const violations = [];
  const lines = source.split("\n");
  lines.forEach((line, i) => {
    for (const pattern of FORBIDDEN_PATTERNS) {
      const match = line.match(pattern.re);
      if (match) {
        violations.push({
          kind: "forbidden",
          message: `${relativePath}:${i + 1}: ${pattern.name} "${match[0]}"`,
        });
      }
    }
  });
  return violations;
}

function main() {
  const adopted = readList(".void-energy-adopted");
  const intentional = new Set(readList(".void-energy-intentional"));

  if (adopted.length === 0) {
    console.log(
      "[void-energy-lint] no adopted files registered yet — see docs/design/VOID_ENERGY_ADOPTION_ROADMAP.md",
    );
    return 0;
  }

  const violations = [];
  for (const file of adopted) {
    if (intentional.has(file)) continue;
    violations.push(...scan(file));
  }

  if (violations.length === 0) {
    console.log(
      `[void-energy-lint] OK — ${adopted.length} adopted file(s) clean`,
    );
    return 0;
  }

  console.error("[void-energy-lint] ratchet violations:");
  for (const v of violations) console.error("  " + v.message);
  console.error(
    `[void-energy-lint] ${violations.length} violation(s) across ${adopted.length} adopted file(s)`,
  );
  return 1;
}

process.exit(main());
