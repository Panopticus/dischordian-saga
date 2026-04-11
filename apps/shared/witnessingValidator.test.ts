import { describe, it, expect } from "vitest";
import {
  checkDialogMatrix,
  checkForcingFlags,
  checkLivingArkTouchpoints,
  checkLyraVoxDialog,
  checkMemorableMomentFeed,
  checkMilestones,
  checkRegistryCrossReferences,
  checkSlideshows,
  runWitnessingValidation,
} from "./witnessingValidator";

describe("witnessingValidator (Appendix A.3)", () => {
  describe("runWitnessingValidation — the whole content library must pass", () => {
    it("produces zero errors across all checks", () => {
      const report = runWitnessingValidation();
      // If this test fails, the specific issue is in
      // report.issues — filter by .category to narrow down.
      if (report.errorCount > 0) {
        for (const issue of report.issues.filter(
          (i) => i.severity === "error",
        )) {
          console.error(
            `[${issue.category}] ${issue.locus}: ${issue.message}`,
          );
        }
      }
      expect(report.errorCount).toBe(0);
    });
  });

  describe("individual check functions", () => {
    it("checkSlideshows returns no errors on the current registry", () => {
      const issues = checkSlideshows();
      const errors = issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
    });

    it("checkDialogMatrix returns no errors on the current registry", () => {
      const issues = checkDialogMatrix();
      const errors = issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
    });

    it("checkLivingArkTouchpoints returns no errors", () => {
      const issues = checkLivingArkTouchpoints();
      const errors = issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
    });

    it("checkMilestones returns no errors (and raisesFlags are unique)", () => {
      const issues = checkMilestones();
      const errors = issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
    });

    it("checkMemorableMomentFeed returns no errors (slots within bounds)", () => {
      const issues = checkMemorableMomentFeed();
      const errors = issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
    });

    it("checkLyraVoxDialog returns no errors (every canonical room covered)", () => {
      const issues = checkLyraVoxDialog();
      const errors = issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
    });

    it("checkForcingFlags returns no errors (every value is valid)", () => {
      const issues = checkForcingFlags();
      expect(issues).toEqual([]);
    });

    it("checkRegistryCrossReferences returns no errors", () => {
      const issues = checkRegistryCrossReferences();
      const errors = issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
    });
  });

  describe("report shape", () => {
    it("errorCount + warningCount match issue counts", () => {
      const report = runWitnessingValidation();
      expect(report.errorCount).toBe(
        report.issues.filter((i) => i.severity === "error").length,
      );
      expect(report.warningCount).toBe(
        report.issues.filter((i) => i.severity === "warning").length,
      );
    });

    it("every issue has a category, severity, locus, and message", () => {
      const report = runWitnessingValidation();
      for (const issue of report.issues) {
        expect(issue.category).toBeDefined();
        expect(["error", "warning"]).toContain(issue.severity);
        expect(issue.locus.length).toBeGreaterThan(0);
        expect(issue.message.length).toBeGreaterThan(0);
      }
    });
  });
});
