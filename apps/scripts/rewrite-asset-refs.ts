/**
 * Rewrite hardcoded /art|audio|videos|music|games/ string literals in
 * apps/** to use assetUrl() from apps/client/src/lib/assetUrl.ts.
 *
 * Usage:
 *   pnpm tsx apps/scripts/rewrite-asset-refs.ts              # dry-run
 *   pnpm tsx apps/scripts/rewrite-asset-refs.ts --apply      # rewrite literals
 *   pnpm tsx apps/scripts/rewrite-asset-refs.ts --apply-jsx  # literals + JSX attrs
 *
 * DO NOT RUN until apps/scripts/upload-public-to-s3.ts has successfully
 * synced public/{art,audio,videos,music,games} to s3://dgrsart/cdn/client-public/.
 *
 * Matches inside line or block comments are ignored. The helper file,
 * test files, and these scripts are never rewritten.
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";

const APPS_ROOT = join(process.cwd(), "apps");
const ASSET_HELPER_PATH = "apps/client/src/lib/assetUrl.ts";
const TRACKED = ["art", "audio", "videos", "music", "games"] as const;
const TRACKED_RE = new RegExp(`(?:${TRACKED.join("|")})`);
const LITERAL_RE = new RegExp(
  `(?<!\\w)(["'])/((?:${TRACKED.join("|")})/[^"'\\s\`]+)\\1`,
  "g",
);
const JSX_ATTR_RE = new RegExp(
  `(\\s[A-Za-z_][A-Za-z0-9_-]*)=\\s*(["'])/((?:${TRACKED.join("|")})/[^"'\\s]+)\\2`,
  "g",
);
// Template literal whose text starts with `/{dir}/`. Interpolation tokens
// like `${x}` inside are preserved verbatim.
const TEMPLATE_RE = new RegExp(
  "(?<!\\w)`/((?:" + TRACKED.join("|") + ")/(?:[^`]*))`",
  "g",
);
const INCLUDE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const SKIP_ABS_PATHS = new Set([
  join(process.cwd(), "apps/client/src/lib/assetUrl.ts"),
  join(process.cwd(), "apps/scripts/rewrite-asset-refs.ts"),
  join(process.cwd(), "apps/scripts/upload-public-to-s3.ts"),
]);

interface FileReport {
  path: string;
  literalMatches: number;
  jsxMatches: { attr: string; path: string; line: number }[];
  isTest: boolean;
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === "dist") continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile()) yield full;
  }
}

function isTestFile(p: string): boolean {
  return /\.(test|spec)\.[jt]sx?$/.test(p);
}

function collectCommentRanges(source: string): [number, number][] {
  const ranges: [number, number][] = [];
  const re = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    ranges.push([m.index, m.index + m[0].length]);
  }
  return ranges;
}

function inAnyRange(pos: number, ranges: [number, number][]): boolean {
  for (const [s, e] of ranges) if (pos >= s && pos < e) return true;
  return false;
}

function findImportInsertionPoint(source: string): number {
  // `import\s+` rejects `import.meta` and `import(...)` which aren't import
  // statements. Matches: `import "side";`, `import x from "p";`,
  // `import { a, b } from "p";`, `import * as x from "p";`, `import type ...`.
  const importRe =
    /^\s*import\s+(?:[{*\w][\s\S]*?from\s+)?["'][^"']+["']\s*;?\s*$/gm;
  const commentRanges = collectCommentRanges(source);
  let lastEnd = 0;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(source)) !== null) {
    if (inAnyRange(m.index, commentRanges)) continue;
    lastEnd = m.index + m[0].length;
    while (lastEnd < source.length && source[lastEnd] === "\n") lastEnd++;
  }
  return lastEnd;
}

function importStatementFor(filePath: string): string {
  if (filePath.includes("/apps/client/"))
    return `import { assetUrl } from "@/lib/assetUrl";`;
  const helperFromRoot = join(process.cwd(), ASSET_HELPER_PATH).replace(/\.ts$/, "");
  const rel = relative(dirname(filePath), helperFromRoot).split("\\").join("/");
  const normalized = rel.startsWith(".") ? rel : `./${rel}`;
  return `import { assetUrl } from "${normalized}";`;
}

function ensureImport(source: string, importLine: string): string {
  if (source.includes(importLine)) return source;
  if (/from\s+["']@\/lib\/assetUrl["']/.test(source)) return source;
  if (/from\s+["'][^"']*\blib\/assetUrl["']/.test(source)) return source;
  const insertAt = findImportInsertionPoint(source);
  if (insertAt > 0)
    return source.slice(0, insertAt) + importLine + "\n" + source.slice(insertAt);
  return importLine + "\n" + source;
}

function collectJsxAttrs(
  source: string,
  commentRanges: [number, number][],
): { ranges: [number, number][]; matches: FileReport["jsxMatches"] } {
  const ranges: [number, number][] = [];
  const matches: FileReport["jsxMatches"] = [];
  const re = new RegExp(JSX_ATTR_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    if (inAnyRange(m.index, commentRanges)) continue;
    ranges.push([m.index, m.index + m[0].length]);
    const line = source.slice(0, m.index).split("\n").length;
    matches.push({ attr: m[1].trim(), path: m[3], line });
  }
  return { ranges, matches };
}

function rewriteLiterals(
  source: string,
  skipRanges: [number, number][],
): { next: string; count: number } {
  const re = new RegExp(LITERAL_RE.source, "g");
  const pieces: string[] = [];
  let lastEnd = 0;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    if (inAnyRange(m.index, skipRanges)) continue;
    pieces.push(source.slice(lastEnd, m.index));
    pieces.push(`assetUrl("${m[2]}")`);
    lastEnd = m.index + m[0].length;
    count++;
  }
  pieces.push(source.slice(lastEnd));
  return { next: pieces.join(""), count };
}

function rewriteTemplates(
  source: string,
  skipRanges: [number, number][],
): { next: string; count: number } {
  const re = new RegExp(TEMPLATE_RE.source, "g");
  const pieces: string[] = [];
  let lastEnd = 0;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    if (inAnyRange(m.index, skipRanges)) continue;
    pieces.push(source.slice(lastEnd, m.index));
    pieces.push("assetUrl(`" + m[1] + "`)");
    lastEnd = m.index + m[0].length;
    count++;
  }
  pieces.push(source.slice(lastEnd));
  return { next: pieces.join(""), count };
}

function rewriteJsxAttrs(
  source: string,
  commentRanges: [number, number][],
): { next: string; count: number } {
  const re = new RegExp(JSX_ATTR_RE.source, "g");
  const pieces: string[] = [];
  let lastEnd = 0;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    if (inAnyRange(m.index, commentRanges)) continue;
    pieces.push(source.slice(lastEnd, m.index));
    pieces.push(`${m[1]}={assetUrl("${m[3]}")}`);
    lastEnd = m.index + m[0].length;
    count++;
  }
  pieces.push(source.slice(lastEnd));
  return { next: pieces.join(""), count };
}

interface ProcessOptions {
  apply: boolean;
  applyJsx: boolean;
}

async function processFile(path: string, opts: ProcessOptions): Promise<FileReport | null> {
  if (SKIP_ABS_PATHS.has(path)) return null;
  const ext = extname(path);
  if (!INCLUDE_EXT.has(ext)) return null;
  const source = await readFile(path, "utf8");
  if (!TRACKED_RE.test(source)) return null;

  const commentRanges = collectCommentRanges(source);
  const { ranges: jsxRanges, matches: jsxMatches } = collectJsxAttrs(source, commentRanges);
  const literalSkip = [...commentRanges, ...jsxRanges];
  const { next: literalRewritten, count: literalCount } = rewriteLiterals(source, literalSkip);
  const templateCommentRanges = collectCommentRanges(literalRewritten);
  const { next: templateRewritten, count: templateCount } = rewriteTemplates(
    literalRewritten,
    templateCommentRanges,
  );
  const totalLiteral = literalCount + templateCount;

  const report: FileReport = {
    path,
    literalMatches: totalLiteral,
    jsxMatches,
    isTest: isTestFile(path),
  };
  if (totalLiteral === 0 && jsxMatches.length === 0) return null;
  if (report.isTest) return report;

  const willWrite = opts.apply && (totalLiteral > 0 || (opts.applyJsx && jsxMatches.length > 0));
  if (!willWrite) return report;

  let working = templateRewritten;
  if (opts.applyJsx && jsxMatches.length > 0) {
    const freshComments = collectCommentRanges(working);
    working = rewriteJsxAttrs(working, freshComments).next;
  }
  const withImport = ensureImport(working, importStatementFor(path));
  await writeFile(path, withImport, "utf8");
  return report;
}

async function main() {
  const applyJsx = process.argv.includes("--apply-jsx");
  const apply = applyJsx || process.argv.includes("--apply");
  const files: string[] = [];
  for await (const f of walk(APPS_ROOT)) files.push(f);

  const reports: FileReport[] = [];
  for (const f of files) {
    const r = await processFile(f, { apply, applyJsx });
    if (r) reports.push(r);
  }

  let literalTotal = 0;
  let jsxTotal = 0;
  const testFiles: FileReport[] = [];
  const touched: FileReport[] = [];
  const jsxReports: FileReport[] = [];

  for (const r of reports) {
    literalTotal += r.literalMatches;
    jsxTotal += r.jsxMatches.length;
    if (r.isTest && r.literalMatches > 0) testFiles.push(r);
    else if (r.literalMatches > 0) touched.push(r);
    if (r.jsxMatches.length > 0) jsxReports.push(r);
  }

  const header = apply
    ? applyJsx
      ? "APPLIED (literals + JSX)"
      : "APPLIED (literals only)"
    : "DRY RUN";
  console.log(`\n=== ${header} ===`);
  console.log(`files with literal refs rewritten:    ${touched.length}`);
  console.log(`total literal replacements:           ${literalTotal}`);
  console.log(`test files skipped (manual update):   ${testFiles.length}`);
  const jsxNote = applyJsx ? "rewritten" : "needing manual edit";
  console.log(`files with JSX attrs ${jsxNote}: ${jsxReports.length} (${jsxTotal} matches)`);

  if (jsxReports.length && !applyJsx) {
    console.log("\n--- JSX attrs to hand-edit ---");
    for (const r of jsxReports) {
      const rel = relative(process.cwd(), r.path);
      for (const m of r.jsxMatches) {
        console.log(`  ${rel}:${m.line}  ${m.attr}="/${m.path}"`);
      }
    }
  }
  if (testFiles.length) {
    console.log("\n--- test files to hand-update ---");
    for (const r of testFiles) {
      console.log(`  ${relative(process.cwd(), r.path)}  (${r.literalMatches} literals)`);
    }
  }
  if (!apply) console.log("\nRe-run with --apply or --apply-jsx to write changes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
