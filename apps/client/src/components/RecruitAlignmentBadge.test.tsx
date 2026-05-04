/**
 * RecruitAlignmentBadge — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "RecruitAlignmentBadge.tsx"),
  "utf-8",
);
const APP_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "App.tsx"),
  "utf-8",
);

describe("RecruitAlignmentBadge", () => {
  it("derives alignment from the canonical helper", () => {
    expect(SRC).toContain('from "@shared/recruitStageCueSequence"');
    expect(SRC).toContain("summarizeRecruitStageAlignment");
  });

  it("hides until prelude completion (no point showing alignment too early)", () => {
    expect(SRC).toContain("prelude_complete");
    expect(SRC).toContain("if (!visible) return null");
  });

  it("renders three axes: Architect / Dreamer / Engineer", () => {
    expect(SRC).toContain("Architect");
    expect(SRC).toContain("Dreamer");
    expect(SRC).toContain("Engineer");
  });

  it("Engineer score derives from canonical recording-discovery flags", () => {
    expect(SRC).toContain("countEngineerRecordingsHeard");
    expect(SRC).toContain("engineer_recording_");
  });

  it("highlights the leans-toward axis (architect | dreamer)", () => {
    expect(SRC).toContain('leansToward === "architect"');
    expect(SRC).toContain('leansToward === "dreamer"');
  });

  it("does not gate gameplay (purely a read-out)", () => {
    expect(SRC).toContain('"recruit-alignment-badge"');
    // No setNarrativeFlag — read-only
    expect(SRC).not.toContain("setNarrativeFlag");
  });
});

describe("App.tsx — alignment badge mount", () => {
  it("imports the badge", () => {
    expect(APP_SRC).toContain('from "./components/RecruitAlignmentBadge"');
  });

  it("mounts <RecruitAlignmentBadge />", () => {
    expect(APP_SRC).toContain("<RecruitAlignmentBadge");
  });
});
