/**
 * Rewrite hardcoded `/art|audio|videos|music|games/*` string literals in
 * apps/** to use `assetUrl()` from apps/client/src/lib/assetUrl.ts.
 *
 * Usage:
 *   pnpm tsx apps/scripts/rewrite-asset-refs.ts           # dry-run, report
 *   pnpm tsx apps/scripts/rewrite-asset-refs.ts --apply   # rewrite in place
 *
 * DO NOT RUN until apps/scripts/upload-public-to-s3.ts has successfully
 * synced public/{art,audio,videos,music,games} to s3://dgrsart/cdn/client-public/.
 * Running earlier will ship code that 404s on every media URL.
 *
 * Scope handled automatically:
 *   - `"/art/foo.png"` and `'/art/foo.png'` in TS/TSX/JS/JSX sources
 *   - Auto-inserts `import { assetUrl } from "@/lib/assetUrl"` (apps/client)
 *     or a relative import (apps/server, apps/shared)
 *
 * Reported for manual handling (script will NOT touch these):
 *   - JSX attribute form, e.g. `src="/art/foo.png"` → needs `src={assetUrl(...)}`
 *   - *.test.ts / *.test.tsx files (assertions on literal URLs)
 *   - apps/client/index.html preload links
 *   - Template literals that mix paths with other interpolation
 */

import { readFile, writeFile } from "node:fs/promises";
import { readdir, stat } from "node:fs/promises";
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
const SKIP_EXT = new Set([".d.ts", ".css", ".scss", ".html", ".md", ".json"]);
const INCLUDE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

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

function importStatementFor(filePath: string): string {
  const fromClient = filePath.includes("/apps/client/");
  if (fromClient) return `import { assetUrl } from "@/lib/assetUrl";`;
  const helperFromRoot = join(process.cwd(), ASSET_HELPER_PATH).replace(/\.ts$/, "");
  const rel = relative(dirname(filePath), helperFromRoot).split("\\").join("/");
  const normalized = rel.startsWith(".") ? rel : `./${rel}`;
  return `import { assetUrl } from "${normalized}";`;
}

function ensureImport(source: string, importLine: string): string {
  if (source.includes(importLine)) return source;
  if (source.includes("from \"@/lib/assetUrl\"") || source.includes("from '@/lib/assetUrl'"))
    return source;
  const lastImportMatch = source.match(/^(?:[^\n]*\bimport\b[^\n]*\n)+/m);
  if (lastImportMatch) {
    const end = lastImportMatch.index! + lastImportMatch[0].length;
    return source.slice(0, end) + importLine + "\n" + source.slice(end);
  }
  return importLine + "\n" + source;
}

function collectJsxRanges(source: string): { ranges: [number, number][]; matches: FileReport["jsxMatches"] } {
  const ranges: [number, number][] = [];
  const matches: FileReport["jsxMatches"] = [];
  const regex = new RegExp(JSX_ATTR_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = regex.exec(source)) !== null) {
    ranges.push([m.index, m.index + m[0].length]);
    const line = source.slice(0, m.index).split("\n").length;
    matches.push({ attr: m[1].trim(), path: m[3], line });
  }
  return { ranges, matches };
}

function rewriteLiteralsOutsideJsx(
  source: string,
  jsxRanges: [number, number][],
): { next: string; count: number } {
  const inJsx = (pos: number) => jsxRanges.some(([s, e]) => pos >= s && pos < e);
  const regex = new RegExp(LITERAL_RE.source, "g");
  const pieces: string[] = [];
  let lastEnd = 0;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(source)) !== null) {
    if (inJsx(m.index)) continue;
    pieces.push(source.slice(lastEnd, m.index));
    pieces.push(`assetUrl("${m[2]}")`);
    lastEnd = m.index + m[0].length;
    count++;
  }
  pieces.push(source.slice(lastEnd));
  return { next: pieces.join(""), count };
}

async function processFile(path: string, apply: boolean): Promise<FileReport | null> {
  const ext = extname(path);
  if (!INCLUDE_EXT.has(ext)) return null;
  if (SKIP_EXT.has(ext)) return null;
  const source = await readFile(path, "utf8");
  if (!TRACKED_RE.test(source)) return null;

  const { ranges: jsxRanges, matches: jsxMatches } = collectJsxRanges(source);
  const { next: literalRewritten, count: literalCount } = rewriteLiteralsOutsideJsx(
    source,
    jsxRanges,
  );

  const report: FileReport = {
    path,
    literalMatches: literalCount,
    jsxMatches,
    isTest: isTestFile(path),
  };
  if (literalCount === 0 && jsxMatches.length === 0) return null;
  if (report.isTest || literalCount === 0) return report;

  if (apply) {
    const withImport = ensureImport(literalRewritten, importStatementFor(path));
    await writeFile(path, withImport, "utf8");
  }
  return report;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const files: string[] = [];
  for await (const f of walk(APPS_ROOT)) files.push(f);

  const reports: FileReport[] = [];
  for (const f of files) {
    const r = await processFile(f, apply);
    if (r) reports.push(r);
  }

  let literalTotal = 0;
  let jsxTotal = 0;
  const testFiles: FileReport[] = [];
  const touched: FileReport[] = [];
  const jsxNeedsManual: FileReport[] = [];

  for (const r of reports) {
    literalTotal += r.literalMatches;
    jsxTotal += r.jsxMatches.length;
    if (r.isTest && r.literalMatches > 0) testFiles.push(r);
    else if (r.literalMatches > 0) touched.push(r);
    if (r.jsxMatches.length > 0) jsxNeedsManual.push(r);
  }

  const header = apply ? "APPLIED" : "DRY RUN";
  console.log(`\n=== ${header} ===`);
  console.log(`files with literal string refs rewritten: ${touched.length}`);
  console.log(`total literal replacements:               ${literalTotal}`);
  console.log(`test files skipped (manual update):       ${testFiles.length}`);
  console.log(`files with JSX attrs needing manual edit: ${jsxNeedsManual.length} (${jsxTotal} matches)`);

  if (jsxNeedsManual.length) {
    console.log("\n--- JSX attrs to hand-edit ---");
    for (const r of jsxNeedsManual) {
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

  if (!apply) {
    console.log("\nRe-run with --apply to write changes.");
    console.log("Remember to also:");
    console.log("  1. Update apps/client/index.html preload <link> tags (hardcode CDN URL)");
    console.log("  2. Update test expectations to the new CDN URL format");
    console.log("  3. git rm --cached apps/client/public/{art,audio,videos,music,games}");
    console.log("  4. Add those 5 dirs to .gitignore");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
