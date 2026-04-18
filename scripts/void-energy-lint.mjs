#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════
   VOID ENERGY LINT — ratchet for Tier 3A adoption

   Ports the enforcement patterns from the Void Energy UI
   reference project (dimonb19/void-energy-ui) —
   scripts/scan-physics.ts + .claude/rules/styling.md — into
   this React codebase. Reads the adopted-files registry at
   .void-energy-adopted (one path per line, comments allowed)
   and scans each path for Void Energy Token-Law violations.

   Checks enforced (all derived from the 5 Laws):

     - Law 2 (Token Law): raw hex / rgb / hsl literals,
       Tailwind color-ramp utilities (e.g. text-amber-400),
       and raw pixel values outside the allowlist.
     - Law 4 (State Protocol): utility-class state markers
       like "is-active" / "is-open" (state must live in
       data-* attributes or ARIA, not utility classes).

   Exception annotations (match scan-physics.ts semantics):

     - `// void-ignore` on its own line exempts the NEXT
       non-blank line.
     - `// void-ignore` at end of a line exempts THAT line.

   Allowlisted pixel values (minimal adjustments): 0px, 1px,
   2px, 3px and their negatives. Anything larger must flow
   through --space-* / --radius-* / --physics-border-width
   tokens.

   File-level exemptions stay in .void-energy-intentional
   (whole-file opt-out for narrative-signal colors, faction
   accents, etc. — not for general laziness).

   Invocation (CI + local):
     node scripts/void-energy-lint.mjs

   Companion doc: docs/design/VOID_ENERGY_ADOPTION_ROADMAP.md
   ═══════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

/* ─── Allowlisted raw-px values ─────────────────────────
   Ported verbatim from scan-physics.ts. Minimal sub-pixel
   nudges that don't warrant a design token.
   ─────────────────────────────────────────────────────── */
const ALLOWED_PIXELS = new Set(["0", "1", "2", "3", "-1", "-2", "-3"]);

/* ─── Violation patterns ─────────────────────────────── */

/**
 * Hex literals (including shortened + alpha).
 * Matches #fff, #ffffff, #ffffff99.
 */
const HEX_RE = /#(?:[0-9a-fA-F]{3,8})\b/;

/**
 * Tailwind color-ramp utilities. Covers text/bg/border/ring/
 * from/to/via × every Tailwind color × numeric ramp.
 */
const TAILWIND_COLOR_RE =
  /\b(?:text|bg|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

/**
 * rgb() / rgba() / hsl() / hsla() literals. color-mix() and
 * var() calls stay legal.
 */
const COLOR_FN_RE = /\b(?:rgb|rgba|hsl|hsla)\s*\(/;

/**
 * Raw pixel values after a colon (CSS property, inline
 * style, etc). Matches `margin: 24px`, `height: 64px`,
 * `border: 2px solid ...` (2px will be allowlisted).
 * Negative values are captured too.
 */
/**
 * Raw pixel values after a colon. Negative-lookbehind for `.` or digit
 * prevents false positives on decimal values (e.g. `1.5px` would match
 * `5px` without the lookbehind).
 */
const PX_AFTER_COLON_RE = /:[^;]*?(?<![.\d])(-?\d+)px\b/g;

/**
 * Utility-class state markers ("is-active", "is-open", etc.)
 * that should be data-state attributes instead (Law 4).
 * Matches when "is-<word>" appears in a string literal that
 * looks like a className.
 */
const STATE_CLASS_RE = /["'`][^"'`]*\bis-(?:active|open|disabled|selected|hidden|visible|loading|error)\b[^"'`]*["'`]/;

/* ─── Void-ignore directive ─────────────────────────── */

// Honor three comment forms: `// void-ignore` (single-line),
// `/* void-ignore */` (block, JS context), and `{/* void-ignore */}`
// (block, JSX context).
const VOID_IGNORE_LINE_RE = /^\s*(?:\/\/|\{?\/\*)\s*void-ignore\b/;
const VOID_IGNORE_INLINE_RE = /(?:\/\/|\{?\/\*)\s*void-ignore\b/;

/* ─── Helpers ─────────────────────────────────────── */

function readList(filename) {
  const file = path.join(REPO_ROOT, filename);
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

function isLineExempt(prevLine, line) {
  if (prevLine != null && VOID_IGNORE_LINE_RE.test(prevLine)) return true;
  if (VOID_IGNORE_INLINE_RE.test(line)) return true;
  return false;
}

function scan(relativePath) {
  const abs = path.join(REPO_ROOT, relativePath);
  if (!fs.existsSync(abs)) {
    return [
      {
        message: `adopted file does not exist: ${relativePath}`,
        kind: "missing",
      },
    ];
  }
  const source = fs.readFileSync(abs, "utf-8");
  const lines = source.split("\n");
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = i > 0 ? lines[i - 1] : null;

    // Skip blank lines, bare comments, and directive lines.
    if (line.trim() === "") continue;
    if (line.trim().startsWith("//")) continue;
    if (isLineExempt(prev, line)) continue;

    const row = i + 1;
    const report = (pattern, excerpt) => {
      violations.push({
        message: `${relativePath}:${row}: ${pattern} → ${excerpt}`,
      });
    };

    const hex = line.match(HEX_RE);
    if (hex) report("hex literal", hex[0]);

    const tw = line.match(TAILWIND_COLOR_RE);
    if (tw) report("tailwind color ramp", tw[0]);

    const fn = line.match(COLOR_FN_RE);
    if (fn) report("rgb()/hsl() literal", fn[0]);

    // Pixel values — allowlist small adjustments.
    for (const match of line.matchAll(PX_AFTER_COLON_RE)) {
      const value = match[1];
      if (!ALLOWED_PIXELS.has(value)) {
        report("raw pixel value", `${value}px`);
      }
    }

    const stateClass = line.match(STATE_CLASS_RE);
    if (stateClass) {
      report("state-via-class (use data-state instead)", stateClass[0]);
    }
  }
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
  let scanned = 0;
  for (const file of adopted) {
    if (intentional.has(file)) continue;
    scanned += 1;
    violations.push(...scan(file));
  }

  if (violations.length === 0) {
    console.log(
      `[void-energy-lint] OK — ${scanned} adopted file(s) clean`,
    );
    return 0;
  }

  console.error("[void-energy-lint] violations:");
  for (const v of violations) console.error("  " + v.message);
  console.error(
    `[void-energy-lint] ${violations.length} violation(s) across ${scanned} adopted file(s)`,
  );
  return 1;
}

process.exit(main());
