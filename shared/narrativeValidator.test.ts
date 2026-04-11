import { describe, it, expect, beforeAll } from "vitest";
import {
  runFullValidation,
  validateDialogTrees,
  validateStoryFlags,
  validateTrustGates,
  validateTransmissionUnlocks,
  validateLoreConsistency,
  type ValidationIssue,
  type ValidationReport,
} from "./narrativeValidator";

/* ─── HELPERS ─── */

function criticals(issues: ValidationIssue[]): ValidationIssue[] {
  return issues.filter(i => i.severity === "critical");
}

function warnings(issues: ValidationIssue[]): ValidationIssue[] {
  return issues.filter(i => i.severity === "warning");
}

function infos(issues: ValidationIssue[]): ValidationIssue[] {
  return issues.filter(i => i.severity === "info");
}

/* ─── TESTS ─── */

describe("narrativeValidator", () => {
  let report: ValidationReport;

  // Run validation once — it's pure and deterministic
  beforeAll(() => {
    report = runFullValidation();
  });

  describe("runFullValidation", () => {
    it("returns a valid report structure", () => {
      expect(report).toBeDefined();
      expect(report.issues).toBeInstanceOf(Array);
      expect(report.summary).toBeDefined();
      expect(typeof report.summary.critical).toBe("number");
      expect(typeof report.summary.warning).toBe("number");
      expect(typeof report.summary.info).toBe("number");
      expect(typeof report.summary.total).toBe("number");
      expect(typeof report.passed).toBe("boolean");
    });

    it("summary counts match actual issues", () => {
      const actualCritical = criticals(report.issues).length;
      const actualWarning = warnings(report.issues).length;
      const actualInfo = infos(report.issues).length;
      expect(report.summary.critical).toBe(actualCritical);
      expect(report.summary.warning).toBe(actualWarning);
      expect(report.summary.info).toBe(actualInfo);
      expect(report.summary.total).toBe(actualCritical + actualWarning + actualInfo);
    });

    it("has zero critical issues (no orphans, dead-ends, or broken references)", () => {
      const crits = criticals(report.issues);
      if (crits.length > 0) {
        const messages = crits.map(c => `  [${c.category}] ${c.message} (${c.location ?? "global"})`);
        expect.fail(
          `Found ${crits.length} critical issue(s):\n${messages.join("\n")}`
        );
      }
    });

    it("passed flag is true when no critical issues exist", () => {
      expect(report.passed).toBe(report.summary.critical === 0);
    });
  });

  describe("validateDialogTrees", () => {
    it("finds no orphan nodes (every room has choices)", () => {
      const issues = validateDialogTrees();
      const orphans = issues.filter(
        i => i.severity === "critical" && i.message.includes("no dialog choices")
      );
      expect(orphans).toHaveLength(0);
    });

    it("finds no missing NPC responses", () => {
      const issues = validateDialogTrees();
      const missing = issues.filter(
        i => i.severity === "critical" && i.message.includes("missing NPC response")
      );
      expect(missing).toHaveLength(0);
    });

    it("finds no empty player dialog text", () => {
      const issues = validateDialogTrees();
      const empty = issues.filter(
        i => i.severity === "critical" && i.message.includes("empty fullText")
      );
      expect(empty).toHaveLength(0);
    });

    it("all rooms cover all three dialog archetypes", () => {
      const issues = validateDialogTrees();
      const missingArch = issues.filter(
        i => i.severity === "warning" && i.message.includes("Missing") && i.message.includes("archetype")
      );
      expect(missingArch).toHaveLength(0);
    });

    it("all personality contexts are populated", () => {
      const issues = validateDialogTrees();
      const missingCtx = issues.filter(
        i => i.severity === "critical" && i.message.includes("Missing context text")
      );
      expect(missingCtx).toHaveLength(0);
    });

    it("no duplicate choice IDs within any room", () => {
      const issues = validateDialogTrees();
      const dupes = issues.filter(
        i => i.severity === "critical" && i.message.includes("Duplicate choice IDs")
      );
      expect(dupes).toHaveLength(0);
    });
  });

  describe("validateStoryFlags", () => {
    it("no flags are checked but never set", () => {
      const issues = validateStoryFlags();
      const unchecked = issues.filter(
        i => i.severity === "critical" && i.message.includes("checked") && i.message.includes("never set")
      );
      expect(unchecked).toHaveLength(0);
    });

    it("mutually exclusive Breaking Point flags are recognized", () => {
      const issues = validateStoryFlags();
      const exclusive = issues.filter(
        i => i.category === "story_flags" && i.message.includes("Mutually exclusive")
      );
      expect(exclusive.length).toBeGreaterThan(0);
    });
  });

  describe("validateTrustGates", () => {
    it("no trust gate exceeds maximum trust value of 100", () => {
      const issues = validateTrustGates();
      const exceeded = issues.filter(
        i => i.severity === "critical" && i.message.includes("exceeds max")
      );
      expect(exceeded).toHaveLength(0);
    });

    it("Breaking Point trust overrides are within valid range", () => {
      const issues = validateTrustGates();
      const overRange = issues.filter(
        i => i.severity === "critical" && i.message.includes("TrustOverride")
      );
      expect(overRange).toHaveLength(0);
    });

    it("reports achievable trust info", () => {
      const issues = validateTrustGates();
      const trustInfo = issues.filter(
        i => i.severity === "info" && i.category === "trust_gates"
      );
      expect(trustInfo.length).toBeGreaterThan(0);
    });
  });

  describe("validateTransmissionUnlocks", () => {
    it("all chapter_complete triggers reference existing chapters", () => {
      const issues = validateTransmissionUnlocks();
      const badChapters = issues.filter(
        i => i.severity === "critical" && i.message.includes("does not exist")
      );
      expect(badChapters).toHaveLength(0);
    });

    it("no duplicate episode numbers within an epoch", () => {
      const issues = validateTransmissionUnlocks();
      const dupes = issues.filter(
        i => i.severity === "critical" && i.message.includes("Duplicate epoch-episodeNumber")
      );
      expect(dupes).toHaveLength(0);
    });

    it("no duplicate broadcast orders", () => {
      const issues = validateTransmissionUnlocks();
      const dupes = issues.filter(
        i => i.severity === "critical" && i.message.includes("Duplicate broadcastOrder")
      );
      expect(dupes).toHaveLength(0);
    });

    it("all transmissions have titles", () => {
      const issues = validateTransmissionUnlocks();
      const empty = issues.filter(
        i => i.severity === "critical" && i.message.includes("empty title")
      );
      expect(empty).toHaveLength(0);
    });

    it("all transmissions have video sources", () => {
      const issues = validateTransmissionUnlocks();
      const noVideo = issues.filter(
        i => i.severity === "warning" && i.message.includes("neither videoUrl nor driveFileId")
      );
      expect(noVideo).toHaveLength(0);
    });
  });

  describe("validateLoreConsistency", () => {
    it("all story chapters have pre, victory, and defeat dialogue", () => {
      const issues = validateLoreConsistency();
      const missing = issues.filter(
        i => i.severity === "critical" && (
          i.message.includes("no preDialogue") ||
          i.message.includes("no postVictoryDialogue") ||
          i.message.includes("no postDefeatDialogue")
        )
      );
      expect(missing).toHaveLength(0);
    });

    it("no dialog lines have empty speaker or text", () => {
      const issues = validateLoreConsistency();
      const empty = issues.filter(
        i => i.severity === "critical" && (
          i.message.includes("empty speaker") ||
          i.message.includes("empty text")
        )
      );
      expect(empty).toHaveLength(0);
    });

    it("all Breaking Point options have labels and descriptions", () => {
      const issues = validateLoreConsistency();
      const emptyBP = issues.filter(
        i => i.severity === "critical" && i.location === "breakingPoint" && (
          i.message.includes("empty description") ||
          i.message.includes("empty label")
        )
      );
      expect(emptyBP).toHaveLength(0);
    });

    it("all apprentice archetypes have breakingPoint descriptions", () => {
      const issues = validateLoreConsistency();
      const missingBP = issues.filter(
        i => i.severity === "warning" && i.message.includes("no breakingPoint description")
      );
      expect(missingBP).toHaveLength(0);
    });

    it("logs info about key locations referenced across systems", () => {
      const issues = validateLoreConsistency();
      const locationInfo = issues.filter(
        i => i.severity === "info" && i.message.includes("Location")
      );
      expect(locationInfo.length).toBeGreaterThan(0);
    });
  });

  describe("report output (diagnostic)", () => {
    it("prints full report for debugging", () => {
      // This test always passes — it just logs the report for CI visibility
      const lines: string[] = [
        `\n=== NARRATIVE VALIDATION REPORT ===`,
        `Critical: ${report.summary.critical}`,
        `Warnings: ${report.summary.warning}`,
        `Info:     ${report.summary.info}`,
        `Total:    ${report.summary.total}`,
        `Passed:   ${report.passed}`,
        ``,
      ];

      if (report.summary.critical > 0) {
        lines.push(`--- CRITICAL ISSUES ---`);
        for (const i of criticals(report.issues)) {
          lines.push(`  [${i.category}] ${i.message} ${i.location ? `(${i.location})` : ""}`);
        }
      }

      if (report.summary.warning > 0) {
        lines.push(`--- WARNINGS ---`);
        for (const i of warnings(report.issues)) {
          lines.push(`  [${i.category}] ${i.message} ${i.location ? `(${i.location})` : ""}`);
        }
      }

      console.log(lines.join("\n"));
      expect(true).toBe(true);
    });
  });
});
