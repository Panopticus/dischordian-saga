/* Structural smoke test for DlcChaptersPage. */
import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import DlcChaptersPage from "./DlcChaptersPage";

describe("DlcChaptersPage", () => {
  it("exports a component function as default", () => {
    expect(DlcChaptersPage).toBeDefined();
    expect(typeof DlcChaptersPage).toBe("function");
  });

  it("source uses trpc.dlcChapters.listAll for the per-player chapter list", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "DlcChaptersPage.tsx"),
      "utf-8",
    );
    expect(src).toMatch(/trpc\.dlcChapters\.listAll\.useQuery/);
  });

  it("source surfaces every parent-section kind in its label switch", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "DlcChaptersPage.tsx"),
      "utf-8",
    );
    for (const kind of [
      "act",
      "authority_trial",
      "galactic_dance",
      "advocate_arc",
      "hierarchy_arc",
      "endgame",
      "epoch_witness",
      "silence_in_heaven",
      "breeding_program",
    ]) {
      expect(src, `missing case "${kind}"`).toContain(`case "${kind}"`);
    }
  });

  it("source surfaces every prerequisite kind in its formatPrereq switch", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "DlcChaptersPage.tsx"),
      "utf-8",
    );
    for (const kind of [
      "flag",
      "act_completion",
      "secret",
      "dlc_chapter_completion",
      "entitlement",
      "bloodline_threshold",
    ]) {
      expect(src, `missing prereq case "${kind}"`).toContain(`case "${kind}"`);
    }
  });
});
