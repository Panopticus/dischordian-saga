/* ═══════════════════════════════════════════════════════
   4TH-WALL SWEEP — diegetic-language enforcement

   Walks user-facing source under apps/client/src/pages and
   apps/client/src/components and fails if any of the
   listed placeholder / dev-speak patterns appear inside a
   double-quoted string literal.

   This is a heuristic, not a full JSX parser. It looks for
   each pattern with word boundaries inside `"..."`
   strings. CSS class strings, attribute keys (data-…), and
   comparison-string usage (.startsWith("TBD")) are
   tolerated because they are not user-facing on screen.

   When a pattern is intentional and diegetic — e.g.
   `loredex-data.json` enriches a song aliased "TBD" or an
   in-fiction radio sign reads "PRESS BUTTON" — add a
   precise entry to ALLOWLIST below. Allowlist entries are
   per-file substrings; reviewers should keep them short
   and self-explanatory.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join } from "path";

const ROOT = resolve(__dirname, "..", "..", "..", "..");
const SCAN_DIRS = [
  resolve(ROOT, "apps/client/src/pages"),
  resolve(ROOT, "apps/client/src/components"),
];

/** Patterns that must not appear inside any user-facing
 *  string literal. Word boundaries protect against
 *  fragment matches (e.g. SWIPE was matching WIP). Case-
 *  insensitive where it makes sense. */
const FORBIDDEN: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bComing Soon\b/i, label: "Coming Soon" },
  { pattern: /\bClick here\b/i, label: "Click here" },
  { pattern: /\bPress button\b/i, label: "Press button" },
  { pattern: /\bClick to continue\b/i, label: "Click to continue" },
  { pattern: /\blorem ipsum\b/i, label: "lorem ipsum" },
  { pattern: /\[placeholder\]/i, label: "[placeholder]" },
  { pattern: /\bplaceholder text\b/i, label: "placeholder text" },
  { pattern: /\bSKIP AWAKENING\b/, label: "SKIP AWAKENING (use EMERGENCY OVERRIDE)" },
  // \bTODO\b and \bFIXME\b are intentionally NOT enforced
  // here because they appear legitimately in code comments
  // (the JSX-string heuristic catches the user-facing
  // cases). Adding them would create false positives in
  // every developer note.
];

/** Per-file substrings that are allowed despite matching a
 *  forbidden pattern. Use sparingly and document why each
 *  entry exists. The match is a `String.includes` test on
 *  the offending line. */
const ALLOWLIST: Record<string, string[]> = {
  // DiscographyPage filters OUT streaming-link strings that
  // are placeholder "TBD" markers — the match is in a
  // logical comparison, not a user-facing display.
  "apps/client/src/pages/DiscographyPage.tsx": [
    'startsWith("TBD")',
  ],
  // shadcn/ui select component — `data-[placeholder]:` is
  // a CSS attribute selector, not a user-visible string.
  "apps/client/src/components/ui/select.tsx": [
    "data-[placeholder]",
  ],
};

/** Walk a directory recursively, returning all .tsx files
 *  (excluding test files). */
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full));
    } else if (
      name.endsWith(".tsx") &&
      !name.endsWith(".test.tsx") &&
      !full.includes("/__tests__/")
    ) {
      out.push(full);
    }
  }
  return out;
}

/** Strip /* … *\/ block comments and // line comments from
 *  a file's content. We still scan the result for string
 *  literals; this just removes legitimate-comment noise so
 *  patterns in author notes don't trip the sweep. */
function stripComments(src: string): string {
  // Block comments — non-greedy, multi-line.
  src = src.replace(/\/\*[\s\S]*?\*\//g, "");
  // Line comments — to end of line.
  src = src.replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  return src;
}

/** Pull every double-quoted string literal out of source.
 *  Handles escaped quotes inside the literal. JSX
 *  attribute values and `"..."` expressions both match. */
function extractStringLiterals(src: string): Array<{ line: number; text: string }> {
  const out: Array<{ line: number; text: string }> = [];
  const re = /"((?:[^"\\]|\\.)*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const upTo = src.slice(0, m.index);
    const line = upTo.split("\n").length;
    out.push({ line, text: m[1]! });
  }
  return out;
}

describe("4th-wall sweep", () => {
  const allFiles = SCAN_DIRS.flatMap(walk);

  it("scans a non-trivial number of files", () => {
    // Smoke check — if SCAN_DIRS drifts (e.g. apps/ rename)
    // this catches it before the silent zero-file pass.
    expect(allFiles.length).toBeGreaterThan(100);
  });

  it("contains no forbidden dev-speak in user-facing strings", () => {
    const offenses: string[] = [];
    for (const file of allFiles) {
      const relativePath = file.slice(ROOT.length + 1);
      const allowed = ALLOWLIST[relativePath] ?? [];
      const src = stripComments(readFileSync(file, "utf8"));
      const literals = extractStringLiterals(src);

      // Reconstruct line text for allowlist substring
      // matching — the literal alone loses surrounding
      // context (.startsWith, data-[…], etc.).
      const lines = readFileSync(file, "utf8").split("\n");

      for (const { line, text } of literals) {
        for (const { pattern, label } of FORBIDDEN) {
          if (!pattern.test(text)) continue;
          const lineText = lines[line - 1] ?? "";
          if (allowed.some((needle) => lineText.includes(needle))) continue;
          offenses.push(`${relativePath}:${line} — "${label}" in literal "${text.slice(0, 80)}${text.length > 80 ? "…" : ""}"`);
        }
      }
    }
    expect(
      offenses,
      `Forbidden 4th-wall strings found:\n  ${offenses.join("\n  ")}`,
    ).toEqual([]);
  });
});
