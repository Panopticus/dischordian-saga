/**
 * Structural tests for Act4PrisonerStoryPage (§9 Collector's Arena story mode).
 * Source-scan style matching Act2/Act3 page tests. Verifies the canon
 * data shells are consumed, flags are written through setNarrativeFlag,
 * and every Prisoner chapter surfaces a stance-selection UI.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { ACT_4_PRISONER_CHAPTERS } from "@shared/actsFourFiveShells";

const src = fs.readFileSync(
  path.resolve(__dirname, "Act4PrisonerStoryPage.tsx"),
  "utf-8",
);

describe("Act4PrisonerStoryPage — imports", () => {
  it("imports canonical Act 4 Prisoner chapters", () => {
    expect(src).toContain("ACT_4_PRISONER_CHAPTERS");
    expect(src).toContain('from "@shared/actsFourFiveShells"');
  });

  it("reuses the existing storyMode local-persistence helpers", () => {
    expect(src).toContain("loadStoryProgress");
    expect(src).toContain("saveStoryProgress");
    expect(src).toContain("DEFAULT_STORY_PROGRESS");
  });

  it("reads + writes narrative flags via useGame()", () => {
    expect(src).toContain("useGame()");
    expect(src).toContain("setNarrativeFlag");
  });
});

describe("Act4PrisonerStoryPage — chapter coverage", () => {
  it("ships a stance table for every canonical Prisoner chapter", () => {
    for (const chapter of ACT_4_PRISONER_CHAPTERS) {
      expect(src).toContain(chapter.id);
    }
  });

  it("offers at least one fight stance and one lay-down stance per chapter", () => {
    // The module declares StanceId = "fight" | "listen" | "lay_down".
    expect(src).toContain('"fight"');
    expect(src).toContain('"lay_down"');
  });

  it("references the canonical 'Lay down the fight' line (ch6 canon)", () => {
    // The White Oracle chapter's opening line is "Lay down the fight.
    // The fight was the extraction. …" — the stance outcome text must
    // quote it to preserve the canon beat.
    expect(src).toMatch(/Lay down the fight/i);
    expect(src).toContain("extraction is complete");
  });
});

describe("Act4PrisonerStoryPage — flag-write contract", () => {
  it("writes the chapter's completedFlag on resolution", () => {
    // Must be keyed on chapter.completedFlag, not a hardcoded string,
    // so future chapter additions don't need a matching edit here.
    expect(src).toMatch(/setNarrativeFlag\(chapter\.completedFlag/);
  });

  it("also appends to storyProgress.completedChapters for offline parity", () => {
    expect(src).toContain("completedChapters");
    expect(src).toContain("storyModeChapterTag");
  });

  it("guards against double-firing the narrative flag", () => {
    // If the chapter's completedFlag is already set the resolution
    // shouldn't re-emit the toast or re-call setNarrativeFlag.
    expect(src).toMatch(/if\s*\(\s*!flags\[chapter\.completedFlag\]/);
  });
});

describe("Act4PrisonerStoryPage — unlock gating", () => {
  it("uses sequential unlock based on the prior chapter's order", () => {
    expect(src).toMatch(/chapterOrder\s*===\s*1/);
    expect(src).toContain("chapterOrder - 1");
  });

  it("treats a chapter as done if EITHER server flag OR local progress says so", () => {
    // The isDone helper should read both paths so offline-then-sync
    // transitions and pre-sync play both show the right state.
    expect(src).toMatch(/flags\[chapter\.completedFlag\]/);
    expect(src).toMatch(/progress\.completedChapters\.includes/);
  });
});

describe("Act4PrisonerStoryPage — route invariants", () => {
  it("never writes act_4_complete directly (gate fires from useNarrativeIntegration)", () => {
    expect(src).not.toContain('setNarrativeFlag("act_4_complete"');
  });

  it("shows the chapter's canonical openingLine in the pre-fight overlay", () => {
    expect(src).toContain("chapter.openingLine");
  });

  it("shows the chapter's memoryExtracted beat on resolution", () => {
    expect(src).toContain("chapter.memoryExtracted");
  });
});
