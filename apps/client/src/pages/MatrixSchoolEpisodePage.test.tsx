/**
 * MatrixSchoolEpisodePage — wiring contract.
 *
 * Source-scan style. Pins the contracts the data layer expects:
 *   • Loads scenes from BOTH school dialog modules
 *   • Routes back to /hellbox on completion
 *   • Handles unscripted episodes gracefully
 *   • Handles unknown episode ids gracefully
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "MatrixSchoolEpisodePage.tsx"),
  "utf-8",
);

describe("MatrixSchoolEpisodePage — episode runtime", () => {
  it("uses the wouter route /matrix/:episodeId", () => {
    expect(SRC).toContain('useRoute<{ episodeId: string }>("/matrix/:episodeId")');
  });

  it("imports the level definition lookup from the registry", () => {
    expect(SRC).toContain("getLevelById");
    expect(SRC).toContain('from "@shared/matrixOfDreamsLevels"');
  });

  it("loads scenes from BOTH school dialog modules", () => {
    expect(SRC).toContain('from "@shared/celebrationSchoolDialog"');
    expect(SRC).toContain('from "@shared/mechronisAcademyDialog"');
    expect(SRC).toContain("getScenesForEpisode");
    expect(SRC).toContain("getMechronisScenesForEpisode");
  });

  it("uses the canonical DialogScene type from tcg-core", () => {
    expect(SRC).toContain('from "@shared/tcg-core/story/dialogBank"');
    expect(SRC).toContain("DialogScene");
    expect(SRC).toContain("DialogCue");
  });

  it("routes back to /hellbox on episode completion", () => {
    expect(SRC).toContain('setLocation("/hellbox")');
  });

  it("handles unknown episode ids with a NotFound state", () => {
    expect(SRC).toContain("NotFoundEpisode");
  });

  it("handles unscripted episodes (in registry but no scenes yet) with a placeholder", () => {
    expect(SRC).toContain("UnscriptedEpisode");
  });

  it("renders cue.internal as italic sub-text (matches dialogBank canonical pattern)", () => {
    expect(SRC).toContain("cue.internal");
    expect(SRC).toContain("italic");
  });

  it("supports keyboard accessibility (space + enter advance scenes)", () => {
    expect(SRC).toContain('e.key === " "');
    expect(SRC).toContain('e.key === "Enter"');
  });

  it("supports the canonical replayable flag from MatrixLevelDefinition", () => {
    expect(SRC).toContain("level.replayable");
  });

  it("differentiates Celebration vs Mechronis visual register", () => {
    expect(SRC).toContain('level.school === "celebration"');
  });
});
