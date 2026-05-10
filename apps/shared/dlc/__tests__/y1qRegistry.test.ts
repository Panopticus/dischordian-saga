import { describe, expect, it } from "vitest";
import { ALL_DLC_CHAPTERS } from "@shared/dlc/dlcChapterRegistry";
import { CINEMATICS } from "@shared/expansionArt/cinematicsManifest";

/* The 2026-05-10 producer drop ships intro cinematics for the
 * five Year-1 + early-Year-2 quarterly mini-DLCs. This test
 * pins:
 *   1. each chapter is registered in ALL_DLC_CHAPTERS
 *   2. each carries a cinematic_ref step at index 0
 *   3. the referenced cinematic id resolves in the cinematics
 *      manifest with a videoRelPath
 *   4. the videoRelPath points at the expected staged file
 *
 * Failures here mean the next pnpm assets:upload won't make the
 * intro reachable in-game — useful as a regression net. */

const Y1Q_CHAPTERS: readonly {
  chapterId: string;
  cinematicId: string;
  videoRelPath: string;
}[] = [
  {
    chapterId: "dlc_y1q1_first_charter",
    cinematicId: "y1q1_first_charter",
    videoRelPath:
      "videos/dlc_mystery/y1q1_first_charter/dlc_y1q1_first_charter.mp4",
  },
  {
    chapterId: "dlc_y1q2_pale_inheritance",
    cinematicId: "y1q2_pale_inheritance",
    videoRelPath:
      "videos/dlc_mystery/y1q2_pale_inheritance/dlc_y1q2_pale_inheritance.mp4",
  },
  {
    chapterId: "dlc_y1q3_curriculum_crisis",
    cinematicId: "y1q3_curriculum_crisis",
    videoRelPath:
      "videos/dlc_mystery/y1q3_curriculum_crisis/dlc_y1q3_curriculum_crisis.mp4",
  },
  {
    chapterId: "dlc_y1q4_witness_plaza",
    cinematicId: "y1q4_witness_plaza",
    videoRelPath:
      "videos/dlc_mystery/y1q4_witness_plaza/dlc_y1q4_witness_plaza.mp4",
  },
  {
    chapterId: "dlc_y2q1_charter_schism",
    cinematicId: "y2q1_charter_schism",
    videoRelPath:
      "videos/dlc_mystery/y2q1_charter_schism/dlc_y2q1_charter_schism.mp4",
  },
];

describe("Y1Q–Y2Q1 DLC chapter registry — producer 2026-05-10 drop", () => {
  it("all 5 chapters are registered in ALL_DLC_CHAPTERS", () => {
    const ids = new Set(ALL_DLC_CHAPTERS.map((c) => c.id));
    for (const { chapterId } of Y1Q_CHAPTERS) {
      expect(
        ids.has(chapterId),
        `chapter ${chapterId} not in ALL_DLC_CHAPTERS`,
      ).toBe(true);
    }
  });

  it("each chapter has a cinematic_ref as its first step", () => {
    for (const { chapterId, cinematicId } of Y1Q_CHAPTERS) {
      const chapter = ALL_DLC_CHAPTERS.find((c) => c.id === chapterId);
      expect(chapter, `chapter ${chapterId} missing`).toBeDefined();
      const firstStep = chapter!.steps[0];
      expect(firstStep.kind).toBe("cinematic_ref");
      if (firstStep.kind === "cinematic_ref") {
        expect(firstStep.cinematicId).toBe(cinematicId);
      }
    }
  });

  it("each cinematic resolves in CINEMATICS with the expected videoRelPath", () => {
    for (const { cinematicId, videoRelPath } of Y1Q_CHAPTERS) {
      const def = CINEMATICS.find((c) => c.id === cinematicId);
      expect(def, `cinematic ${cinematicId} not found`).toBeDefined();
      expect(def?.videoRelPath).toBe(videoRelPath);
    }
  });
});
