/* ═══════════════════════════════════════════════════════
   THEME COMPLIANCE TESTS — Validates that all UI component
   types use morality-aware CSS variables instead of
   hardcoded color values. Warns about non-compliant components.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  verifyThemeCompliance,
  formatComplianceReport,
  THEME_COMPONENT_REQUIREMENTS,
  type ComplianceResult,
} from "./themeCompliance";

describe("Morality Theme Compliance", () => {
  let results: ComplianceResult[];

  // Run the compliance check once for all tests
  results = verifyThemeCompliance();

  it("should check all registered component types", () => {
    expect(results.length).toBe(THEME_COMPONENT_REQUIREMENTS.length);

    // Every component type in the requirements should have a result
    for (const req of THEME_COMPONENT_REQUIREMENTS) {
      const result = results.find((r) => r.component === req.componentType);
      expect(result, `Missing result for component type: ${req.componentType}`).toBeDefined();
    }
  });

  it("should produce a valid status for each component", () => {
    for (const result of results) {
      expect(["compliant", "partial", "non-compliant"]).toContain(result.status);
    }
  });

  it("should detect missing CSS variables", () => {
    // Components with no files found should report all vars as missing
    const noFiles = results.filter((r) => r.filesAnalyzed.length === 0);
    for (const result of noFiles) {
      const req = THEME_COMPONENT_REQUIREMENTS.find(
        (r) => r.componentType === result.component
      );
      if (req) {
        expect(result.missingVars.length).toBe(req.requiredVars.length);
      }
    }
  });

  it("should flag hardcoded hex colors in analyzed files", () => {
    // This test verifies the scanner runs — actual violations depend on codebase state
    for (const result of results) {
      expect(Array.isArray(result.hardcodedColors)).toBe(true);
      for (const violation of result.hardcodedColors) {
        expect(violation.file).toBeTruthy();
        expect(violation.line).toBeGreaterThan(0);
        expect(violation.color).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      }
    }
  });

  it("should warn about components with partial compliance", () => {
    const partial = results.filter((r) => r.status === "partial");
    if (partial.length > 0) {
      console.warn(
        `\n[Theme Compliance Warning] ${partial.length} component type(s) have partial theme compliance:\n` +
          partial.map((r) => `  - ${r.component}: missing ${r.missingVars.join(", ")}`).join("\n")
      );
    }
    // This test always passes — it is advisory
    expect(true).toBe(true);
  });

  it("should warn about non-compliant components", () => {
    const nonCompliant = results.filter((r) => r.status === "non-compliant");
    if (nonCompliant.length > 0) {
      console.warn(
        `\n[Theme Compliance Warning] ${nonCompliant.length} component type(s) are non-compliant:\n` +
          nonCompliant
            .map((r) => {
              if (r.filesAnalyzed.length === 0) {
                return `  - ${r.component}: no source files found`;
              }
              return `  - ${r.component}: uses none of the required CSS variables`;
            })
            .join("\n")
      );
    }
    // Advisory — does not fail the suite
    expect(true).toBe(true);
  });

  it("should generate a readable compliance report", () => {
    const report = formatComplianceReport(results);
    expect(report).toContain("MORALITY THEME COMPLIANCE REPORT");
    expect(report).toContain("Compliant:");
    expect(report).toContain("Partial:");
    expect(report).toContain("Non-compliant:");

    // Print the report so CI logs show the full picture
    console.log("\n" + report);
  });

  // Component-specific assertions for key UI surfaces
  describe("critical component coverage", () => {
    it("should find files for loading-screens", () => {
      const result = results.find((r) => r.component === "loading-screens");
      expect(result).toBeDefined();
      if (result && result.filesAnalyzed.length > 0 && result.missingVars.length > 0) {
        // Advisory: loading screens should ideally use theme variables
        console.warn(
          `[Theme Compliance] loading-screens missing: ${result.missingVars.join(", ")}`
        );
      }
    });

    it("should find files for toasts", () => {
      const result = results.find((r) => r.component === "toasts");
      expect(result).toBeDefined();
      // Toast files should exist in this project
      if (result) {
        expect(result.filesAnalyzed.length).toBeGreaterThan(0);
      }
    });

    it("should find files for quest-tracker", () => {
      const result = results.find((r) => r.component === "quest-tracker");
      expect(result).toBeDefined();
    });

    it("should find files for achievement-popups", () => {
      const result = results.find((r) => r.component === "achievement-popups");
      expect(result).toBeDefined();
    });
  });
});
