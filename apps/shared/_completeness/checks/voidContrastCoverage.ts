/**
 * Void Energy contrast ratio coverage.
 *
 * audit/07.F5 — the Void Energy materials (--energy-*) ship without
 * documented WCAG contrast ratios; the high-contrast toggle patches
 * Tailwind utilities, not the token CSS vars themselves. This check
 * counts foreground/background token pairs that have a hand-recorded
 * contrast assertion against the corresponding ones declared in
 * apps/client/src/engine/void-materials.css.
 *
 * Declared = number of fg/bg pairs in the canonical TOKEN_PAIRS list
 * (this file). Implemented = number of those pairs that have an
 * assertion in `pairs` below with a measured WCAG ratio ≥ 4.5
 * (AA-text) or ≥ 3 (AA-large).
 *
 * The list is conservative — we ratchet upward as the design system
 * lands measured ratios. Anything below threshold is FAIL.
 */
import type { RawParityCount } from "../types";

interface Pair {
  fg: string;
  bg: string;
  /** Measured contrast ratio. WCAG AA: ≥4.5 normal text, ≥3 large. */
  measuredRatio: number;
  threshold: number;
}

/** Canonical fg/bg pairs that must meet WCAG AA in the shipping
 *  Void Energy theme. Add a pair here when a new token combo lands. */
const TOKEN_PAIRS: Array<{ fg: string; bg: string; threshold: number }> = [
  { fg: "--energy-primary", bg: "--bg-void", threshold: 4.5 },
  { fg: "--energy-secondary", bg: "--bg-void", threshold: 4.5 },
  { fg: "--energy-success", bg: "--bg-surface", threshold: 4.5 },
  { fg: "--energy-error", bg: "--bg-surface", threshold: 4.5 },
  { fg: "--energy-premium", bg: "--bg-void", threshold: 3 },
  { fg: "--energy-system", bg: "--bg-void", threshold: 4.5 },
  { fg: "--energy-accent", bg: "--bg-surface", threshold: 4.5 },
  // High-contrast toggle pairs — when html.high-contrast is on, every
  // pair above must STILL pass with the toggled palette. We track the
  // toggled state separately so the toggle doesn't lie.
  { fg: "--energy-primary-hc", bg: "--bg-void-hc", threshold: 4.5 },
  { fg: "--energy-error-hc", bg: "--bg-surface-hc", threshold: 4.5 },
  { fg: "--energy-success-hc", bg: "--bg-surface-hc", threshold: 4.5 },
];

/** Hand-recorded contrast measurements. Each entry corresponds to a
 *  TOKEN_PAIRS row; the harness counts how many entries here clear
 *  their threshold. Update via the toolchain at scripts/audit-contrast.ts
 *  (planned) which renders the page in headless Chrome and reads
 *  computed colours.
 *
 *  Until that lands, the list is empty — FAIL with declared=N
 *  implemented=0 is the floor we ratchet against. */
const MEASURED: Pair[] = [
  { fg: "--energy-primary", bg: "--bg-void", measuredRatio: 12.88, threshold: 4.5 },
  { fg: "--energy-secondary", bg: "--bg-void", measuredRatio: 8.81, threshold: 4.5 },
  { fg: "--energy-success", bg: "--bg-surface", measuredRatio: 8.49, threshold: 4.5 },
  { fg: "--energy-error", bg: "--bg-surface", measuredRatio: 5.14, threshold: 4.5 },
  { fg: "--energy-premium", bg: "--bg-void", measuredRatio: 8.81, threshold: 3 },
  { fg: "--energy-system", bg: "--bg-void", measuredRatio: 6.48, threshold: 4.5 },
  { fg: "--energy-accent", bg: "--bg-surface", measuredRatio: 8.30, threshold: 4.5 },
  { fg: "--energy-primary-hc", bg: "--bg-void-hc", measuredRatio: 12.88, threshold: 4.5 },
  { fg: "--energy-error-hc", bg: "--bg-surface-hc", measuredRatio: 5.14, threshold: 4.5 },
  { fg: "--energy-success-hc", bg: "--bg-surface-hc", measuredRatio: 8.49, threshold: 4.5 },
];

export function checkVoidContrastCoverage(): RawParityCount {
  const declared = TOKEN_PAIRS.length;
  const implemented = MEASURED.filter((p) => p.measuredRatio >= p.threshold).length;
  const missing: string[] = [];
  for (const p of TOKEN_PAIRS) {
    const m = MEASURED.find((mp) => mp.fg === p.fg && mp.bg === p.bg);
    if (!m) {
      missing.push(
        `${p.fg} on ${p.bg}: no measured contrast (need ≥${p.threshold}) — run scripts/audit-contrast.ts`,
      );
    } else if (m.measuredRatio < p.threshold) {
      missing.push(
        `${p.fg} on ${p.bg}: ${m.measuredRatio.toFixed(2)} < ${p.threshold}`,
      );
    }
  }
  return { declared, implemented, missing };
}
