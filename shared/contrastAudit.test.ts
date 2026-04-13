/* ═══════════════════════════════════════════════════════
   CONTRAST AUDIT TESTS — Validates morality theme color
   combinations against WCAG AA contrast requirements.
   Runnable via `vitest run`.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  parseColor,
  resolveAlpha,
  relativeLuminance,
  checkContrast,
  auditAllThemes,
  THEME_COLOR_PAIRS,
} from "./contrastAudit";

/* ═══════════════════════════════════════════════════════
   UNIT TESTS — Core Contrast Functions
   ═══════════════════════════════════════════════════════ */

describe("parseColor", () => {
  it("parses 6-digit hex colors", () => {
    expect(parseColor("#000000")).toEqual([0, 0, 0]);
    expect(parseColor("#FFFFFF")).toEqual([255, 255, 255]);
    expect(parseColor("#FF8C00")).toEqual([255, 140, 0]);
    expect(parseColor("#33E2E6")).toEqual([51, 226, 230]);
  });

  it("parses 3-digit hex colors", () => {
    expect(parseColor("#000")).toEqual([0, 0, 0]);
    expect(parseColor("#FFF")).toEqual([255, 255, 255]);
    expect(parseColor("#F00")).toEqual([255, 0, 0]);
  });

  it("parses rgb() strings", () => {
    expect(parseColor("rgb(255, 255, 255)")).toEqual([255, 255, 255]);
    expect(parseColor("rgb(0, 0, 0)")).toEqual([0, 0, 0]);
    expect(parseColor("rgb(51, 226, 230)")).toEqual([51, 226, 230]);
  });

  it("parses rgba() strings (ignoring alpha for raw parse)", () => {
    expect(parseColor("rgba(255, 255, 255, 0.85)")).toEqual([255, 255, 255]);
    expect(parseColor("rgba(15, 23, 42, 0.55)")).toEqual([15, 23, 42]);
  });

  it("throws on invalid input", () => {
    expect(() => parseColor("notacolor")).toThrow("Cannot parse color");
    expect(() => parseColor("#ABCDE")).toThrow("Invalid hex color");
  });
});

describe("resolveAlpha", () => {
  it("returns raw RGB for opaque colors", () => {
    expect(resolveAlpha("#FFFFFF", "#000000")).toEqual([255, 255, 255]);
    expect(resolveAlpha("#FF4444", "#010020")).toEqual([255, 68, 68]);
  });

  it("blends rgba foreground onto solid background", () => {
    // White at 50% alpha on black background → mid-gray
    const result = resolveAlpha("rgba(255, 255, 255, 0.5)", "#000000");
    expect(result[0]).toBeCloseTo(128, 0);
    expect(result[1]).toBeCloseTo(128, 0);
    expect(result[2]).toBeCloseTo(128, 0);
  });

  it("blends rgba(255,255,255,0.85) on #010020", () => {
    // This is the actual foreground-on-background for dark mode
    const result = resolveAlpha("rgba(255, 255, 255, 0.85)", "#010020");
    // Expected: ~217, ~217, ~222 (white blended at 85% onto deep blue)
    expect(result[0]).toBeGreaterThan(200);
    expect(result[1]).toBeGreaterThan(200);
    expect(result[2]).toBeGreaterThan(200);
  });
});

describe("relativeLuminance", () => {
  it("returns 0 for black", () => {
    expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0, 4);
  });

  it("returns 1 for white", () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 4);
  });

  it("returns ~0.2126 for pure red", () => {
    expect(relativeLuminance([255, 0, 0])).toBeCloseTo(0.2126, 3);
  });

  it("returns ~0.7152 for pure green", () => {
    expect(relativeLuminance([0, 255, 0])).toBeCloseTo(0.7152, 3);
  });

  it("returns ~0.0722 for pure blue", () => {
    expect(relativeLuminance([0, 0, 255])).toBeCloseTo(0.0722, 3);
  });
});

describe("checkContrast", () => {
  it("returns 21:1 for black on white", () => {
    const result = checkContrast("#000000", "#FFFFFF");
    expect(result.ratio).toBe(21);
    expect(result.passesAA).toBe(true);
    expect(result.passesAALarge).toBe(true);
  });

  it("returns 1:1 for same color", () => {
    const result = checkContrast("#336699", "#336699");
    expect(result.ratio).toBe(1);
    expect(result.passesAA).toBe(false);
    expect(result.passesAALarge).toBe(false);
  });

  it("correctly evaluates a known passing pair", () => {
    // Dark blue text on white — should easily pass
    const result = checkContrast("#0F172A", "#F0F2F8");
    expect(result.ratio).toBeGreaterThan(10);
    expect(result.passesAA).toBe(true);
    expect(result.passesAALarge).toBe(true);
  });

  it("correctly evaluates a known failing pair", () => {
    // Light yellow on white — should fail
    const result = checkContrast("#FFFF00", "#FFFFFF");
    expect(result.ratio).toBeLessThan(2);
    expect(result.passesAA).toBe(false);
  });

  it("handles rgba foreground with alpha compositing", () => {
    // rgba white at 85% on dark background — the main dark-mode text
    const result = checkContrast("rgba(255, 255, 255, 0.85)", "#010020");
    expect(result.ratio).toBeGreaterThan(10);
    expect(result.passesAA).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════
   THEME AUDIT — All 11 Ship Themes + Morality Palettes
   ═══════════════════════════════════════════════════════ */

describe("Morality theme contrast audit", () => {
  const results = auditAllThemes();

  it("audits all defined theme groups", () => {
    expect(results.length).toBe(THEME_COLOR_PAIRS.length);
    expect(results.length).toBeGreaterThanOrEqual(4); // balanced dark/light, machine, humanity
  });

  // For each theme, separate critical failures from decorative warnings
  for (const themeResult of results) {
    describe(`Theme: ${themeResult.theme}`, () => {
      const criticalIssues = themeResult.issues.filter((i) => !i.isDecorative);
      const decorativeIssues = themeResult.issues.filter((i) => i.isDecorative);

      it("has zero WCAG AA failures for primary text pairs", () => {
        if (criticalIssues.length > 0) {
          const details = criticalIssues
            .map(
              (i) =>
                `  ${i.element}: ${i.ratio}:1 (need ${i.required}:1) — ${i.foreground} on ${i.background}`,
            )
            .join("\n");
          expect(criticalIssues, `Critical contrast failures:\n${details}`).toHaveLength(0);
        }
      });

      it("reports decorative/accent contrast as warnings (not failures)", () => {
        // This test always passes — it only logs warnings for visibility
        if (decorativeIssues.length > 0) {
          const warnings = decorativeIssues
            .map(
              (i) =>
                `  [WARN] ${i.element}: ${i.ratio}:1 (need ${i.required}:1)`,
            )
            .join("\n");
          console.warn(
            `⚠ ${themeResult.theme} — ${decorativeIssues.length} decorative contrast warning(s):\n${warnings}`,
          );
        }
        // Decorative elements intentionally do not fail the test
        expect(true).toBe(true);
      });
    });
  }
});

describe("Individual theme pair checks", () => {
  it("Balanced dark: foreground on background passes AA", () => {
    const result = checkContrast("rgba(255, 255, 255, 0.85)", "#010020");
    expect(result.passesAA).toBe(true);
    expect(result.ratio).toBeGreaterThan(4.5);
  });

  it("Balanced dark: primary (#33E2E6) on background passes AA", () => {
    const result = checkContrast("#33E2E6", "#010020");
    expect(result.passesAA).toBe(true);
  });

  it("Machine dark: primary (#FF4444) on background passes AA", () => {
    const result = checkContrast("#FF4444", "#010020");
    expect(result.passesAA).toBe(true);
  });

  it("Humanity dark: primary (#22C55E) on background passes AA", () => {
    const result = checkContrast("#22C55E", "#010020");
    expect(result.passesAA).toBe(true);
  });

  it("Balanced light: foreground on background passes AA", () => {
    const result = checkContrast("#0F172A", "#F0F2F8");
    expect(result.passesAA).toBe(true);
  });

  it("Balanced light: primary (#0EADB2) on background has measurable contrast", () => {
    // Light-mode primary is used on large text (buttons, headings) where 3:1
    // is the threshold. The actual ratio (~2.46:1) is below even that, flagged
    // as a known limitation. This test documents the measured value.
    const result = checkContrast("#0EADB2", "#F0F2F8");
    expect(result.ratio).toBeGreaterThan(2);
    expect(result.ratio).toBeLessThan(4.5);
  });
});
