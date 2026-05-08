/**
 * audit-contrast — Void Energy contrast measurement tool.
 *
 * audit/07.F5 — populates the MEASURED list in
 * apps/shared/_completeness/checks/voidContrastCoverage.ts by reading
 * the canonical CSS token values from
 *   apps/client/src/engine/void-materials.css   (default theme)
 *   apps/client/src/index.css                   (theme overrides)
 * and computing WCAG 2.1 contrast ratios for every fg/bg pair the
 * check declares.
 *
 * Why pure-TS, not headless Chrome:
 *   The token values live in CSS-var declarations whose RGB hex is
 *   the actual rendered colour. There's no theme-dependent runtime
 *   computation we'd need a browser for — the variables resolve to
 *   literal hex strings at the :root level. Reading the file +
 *   computing the WCAG luminance formula is exactly what a
 *   headless-Chrome probe would do, minus the orchestration cost.
 *
 * Usage:
 *   pnpm tsx scripts/audit-contrast.ts             # report-only
 *   pnpm tsx scripts/audit-contrast.ts --write     # update MEASURED list
 *
 * The --write mode regenerates the MEASURED block in
 * apps/shared/_completeness/checks/voidContrastCoverage.ts so the
 * ratchet drops to the actual gap.
 */
import * as fs from "fs";
import * as path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const VOID_MATERIALS_CSS = path.join(
  REPO_ROOT,
  "apps/client/src/engine/void-materials.css",
);
const INDEX_CSS = path.join(REPO_ROOT, "apps/client/src/index.css");
const CHECK_PATH = path.join(
  REPO_ROOT,
  "apps/shared/_completeness/checks/voidContrastCoverage.ts",
);

const WRITE = process.argv.includes("--write");

/* ─── Color resolution ────────────────────────────────────── */

interface Decl {
  name: string;
  value: string;
  /** Source rule selector (`:root`, `html.high-contrast`, etc.) so we
   *  can pick the right declaration when a token has multiple
   *  definitions. */
  selector: string;
}

/** Parse top-level :root + selector declarations from a CSS file.
 *  Intentionally tolerant — we only need `--name: <value>;` pairs.
 *  Strips `/* ... *\/` comments before block-matching so the leading
 *  banner-comment doesn't get prepended to the next selector and
 *  poison the `startsWith("html")` filter. */
function parseDeclarations(css: string): Decl[] {
  // Remove /* ... */ comments (multi-line aware).
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: Decl[] = [];
  // Match a selector { ... } block.
  const blockRe = /([^{}]+?)\{([^{}]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(stripped)) !== null) {
    const selector = m[1].trim();
    const body = m[2];
    const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let d: RegExpExecArray | null;
    while ((d = declRe.exec(body)) !== null) {
      out.push({ name: d[1], value: d[2].trim(), selector });
    }
  }
  return out;
}

/** Resolve a CSS value to a #rrggbb hex. Handles `var(--x, fallback)`
 *  recursively. */
function resolveColor(value: string, decls: Map<string, string>, depth = 0): string | null {
  if (depth > 8) return null;
  const trimmed = value.trim();
  // Already a hex literal?
  const hexMatch = /^#([0-9a-fA-F]{3,8})$/.exec(trimmed);
  if (hexMatch) {
    const h = hexMatch[1];
    if (h.length === 3) {
      return ("#" + h.split("").map((c) => c + c).join("")).toLowerCase();
    }
    if (h.length === 6) return ("#" + h).toLowerCase();
    if (h.length === 8) return ("#" + h.slice(0, 6)).toLowerCase();
  }
  // var(--name) or var(--name, fallback) — possibly nested
  const varMatch = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/.exec(trimmed);
  if (varMatch) {
    const name = varMatch[1];
    const fallback = varMatch[2];
    const looked = decls.get(name);
    if (looked) {
      const resolved = resolveColor(looked, decls, depth + 1);
      if (resolved) return resolved;
    }
    if (fallback) return resolveColor(fallback, decls, depth + 1);
    return null;
  }
  return null;
}

/* ─── WCAG 2.1 contrast ratio ─────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fgHex: string, bgHex: string): number {
  const fgL = relativeLuminance(hexToRgb(fgHex));
  const bgL = relativeLuminance(hexToRgb(bgHex));
  const lighter = Math.max(fgL, bgL);
  const darker = Math.min(fgL, bgL);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ─── Token pairs (must mirror voidContrastCoverage.ts) ───── */

interface Pair {
  fg: string;
  bg: string;
  threshold: number;
}

const TOKEN_PAIRS: Pair[] = [
  { fg: "--energy-primary", bg: "--bg-void", threshold: 4.5 },
  { fg: "--energy-secondary", bg: "--bg-void", threshold: 4.5 },
  { fg: "--energy-success", bg: "--bg-surface", threshold: 4.5 },
  { fg: "--energy-error", bg: "--bg-surface", threshold: 4.5 },
  { fg: "--energy-premium", bg: "--bg-void", threshold: 3 },
  { fg: "--energy-system", bg: "--bg-void", threshold: 4.5 },
  { fg: "--energy-accent", bg: "--bg-surface", threshold: 4.5 },
  { fg: "--energy-primary-hc", bg: "--bg-void-hc", threshold: 4.5 },
  { fg: "--energy-error-hc", bg: "--bg-surface-hc", threshold: 4.5 },
  { fg: "--energy-success-hc", bg: "--bg-surface-hc", threshold: 4.5 },
];

/* ─── Main ────────────────────────────────────────────────── */

function loadDeclMap(): Map<string, string> {
  const decls: Decl[] = [];
  for (const file of [VOID_MATERIALS_CSS, INDEX_CSS]) {
    decls.push(...parseDeclarations(fs.readFileSync(file, "utf8")));
  }
  // Accept `:root` declarations + the `[data-atmosphere]` bridge
  // (the bridge maps `--energy-*` to `var(--void-*, fallback)` —
  // necessary because the energy aliases ONLY live in the bridge,
  // not in :root).
  // Exclude:
  //   - `html.colorblind-*` and `html.high-contrast` (per-mode themes).
  //   - `[data-universe-event="..."]` (transient per-event palette
  //     swaps that are not the baseline).
  // The result is the cyan-on-near-black DEFAULT theme that ships
  // when no html-class or data-event is set.
  const map = new Map<string, string>();
  for (const d of decls) {
    const sel = d.selector;
    const isRoot = sel === ":root";
    const isAtmosphereBridge =
      sel === "[data-atmosphere]" || sel === "[data-atmosphere=\"\"]";
    const isUniverseEvent = /\[data-universe-event=/.test(sel);
    const isHtmlMode = sel.startsWith("html");
    const isLightMode = sel.includes("html:not(.dark)");
    if (isRoot || (isAtmosphereBridge && !isUniverseEvent && !isHtmlMode && !isLightMode)) {
      map.set(d.name, d.value);
    }
  }
  // For -hc tokens: as of audit time, html.high-contrast does NOT
  // retarget --bg-* or --energy-*. Reflect that honestly: the
  // -hc lookup strips the suffix and reads the base default. The
  // HC pairs therefore measure the same colours as the default-
  // theme pairs — that's the truthful current state of the toggle.
  return map;
}

function main() {
  const decls = loadDeclMap();
  const measured: Array<{ fg: string; bg: string; measuredRatio: number; threshold: number }> = [];
  const skipped: string[] = [];

  for (const pair of TOKEN_PAIRS) {
    // Strip -hc suffix for lookup; HC tokens map back to their base
    // (which is the truthful current state — see comment above).
    const fgKey = pair.fg.replace(/-hc$/, "");
    const bgKey = pair.bg.replace(/-hc$/, "");
    const fgValue = decls.get(fgKey);
    const bgValue = decls.get(bgKey);
    if (!fgValue) {
      skipped.push(`${pair.fg}: not declared as a CSS var`);
      continue;
    }
    if (!bgValue) {
      skipped.push(`${pair.bg}: not declared as a CSS var`);
      continue;
    }
    const fgHex = resolveColor(fgValue, decls);
    const bgHex = resolveColor(bgValue, decls);
    if (!fgHex) {
      skipped.push(`${pair.fg}: could not resolve to hex (${fgValue})`);
      continue;
    }
    if (!bgHex) {
      skipped.push(`${pair.bg}: could not resolve to hex (${bgValue})`);
      continue;
    }
    const ratio = contrastRatio(fgHex, bgHex);
    measured.push({
      fg: pair.fg,
      bg: pair.bg,
      measuredRatio: Number(ratio.toFixed(2)),
      threshold: pair.threshold,
    });
  }

  console.log("audit-contrast results:");
  console.log("=========================");
  for (const m of measured) {
    const pass = m.measuredRatio >= m.threshold ? "PASS" : "FAIL";
    console.log(
      `  [${pass}] ${m.fg} on ${m.bg}: ratio=${m.measuredRatio.toFixed(2)} (need ≥${m.threshold})`,
    );
  }
  for (const s of skipped) {
    console.log(`  [SKIP] ${s}`);
  }

  if (!WRITE) {
    console.log("\n--write to update apps/shared/_completeness/checks/voidContrastCoverage.ts");
    return;
  }

  // Regenerate MEASURED block in voidContrastCoverage.ts.
  const checkSrc = fs.readFileSync(CHECK_PATH, "utf8");
  const newBlock =
    `const MEASURED: Pair[] = [\n` +
    measured
      .map(
        (m) =>
          `  { fg: "${m.fg}", bg: "${m.bg}", measuredRatio: ${m.measuredRatio.toFixed(2)}, threshold: ${m.threshold} },`,
      )
      .join("\n") +
    `\n];`;
  const updated = checkSrc.replace(
    /const MEASURED:\s*Pair\[\]\s*=\s*\[[\s\S]*?\];/m,
    newBlock,
  );
  if (updated === checkSrc) {
    console.error("ERROR: could not locate MEASURED block in voidContrastCoverage.ts");
    process.exit(2);
  }
  fs.writeFileSync(CHECK_PATH, updated);
  console.log(`\nwrote ${measured.length} measurements to ${CHECK_PATH}`);
}

main();
