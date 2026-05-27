/**
 * Act4PrisonerStoryPage — manifest binding contract (Phase A10).
 * Source-scan style. Pins the page-to-manifest binding so the
 * campaign-atlas layer + the page render the same title/subtitle.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "Act4PrisonerStoryPage.tsx"),
  "utf-8",
);

describe("Act4PrisonerStoryPage — manifest binding", () => {
  it("imports the canonical Act 4 Prisoner manifest", () => {
    expect(SRC).toContain(
      'from "@shared/campaign/manifests/act4Prisoner"',
    );
    expect(SRC).toContain("ACT_4_PRISONER_MANIFEST");
  });

  it("renders the manifest's title in the header (not a hard-coded string)", () => {
    expect(SRC).toContain("{ACT_4_PRISONER_MANIFEST.title}");
  });

  it("renders the manifest's subtitle below the title", () => {
    expect(SRC).toContain("{ACT_4_PRISONER_MANIFEST.subtitle}");
  });

  it("retains the dual-tracking flag-write pattern (server narrativeFlag + local storyProgress)", () => {
    // The page MUST keep its dual-tracking — the Act 4 completion
    // gate reads the server flag; offline play reads
    // storyProgress.completedChapters.
    expect(SRC).toMatch(/setNarrativeFlag\(.*completedFlag/);
    expect(SRC).toContain("saveStoryProgress");
  });
});
