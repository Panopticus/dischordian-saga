/* Wave-6 integration tests — Breeding Program ladder.
 *
 * Confirms the three Crew-Bene-Gesserit chapters chain via
 * the new bloodline_threshold prerequisite kind, and that the
 * terminal chapter only unlocks at the canonical
 * PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY = 5 threshold
 * AND the spine-complete flag.
 */
import { describe, expect, it } from "vitest";
import {
  ALL_BREEDING_DLC_CHAPTERS,
  DLC_BREEDING_01_CREW_UNLOCKS,
  DLC_BREEDING_02_FIRST_PURE_CYCLE,
  DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES,
} from "./index";
import {
  ALL_DLC_CHAPTERS,
  deriveDlcChapterStatus,
  dlcChapterCompletionFlag,
  getDlcChaptersForSection,
} from "../../index";
import { PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY } from "../../../bloodClassification";

const LADDER = [
  DLC_BREEDING_01_CREW_UNLOCKS,
  DLC_BREEDING_02_FIRST_PURE_CYCLE,
  DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES,
];

describe("Breeding Program — DLC chapters", () => {
  it("ships exactly three chapters under breeding_program/crew_bene_gesserit", () => {
    expect(ALL_BREEDING_DLC_CHAPTERS).toHaveLength(3);
    const fromSection = getDlcChaptersForSection({
      kind: "breeding_program",
      tier: "crew_bene_gesserit",
    });
    expect(fromSection).toHaveLength(3);
    expect(fromSection.map((c) => c.id)).toEqual(LADDER.map((c) => c.id));
  });

  it("Mascoteers tier has no DLC chapters bound (Act-1 tutorial loop)", () => {
    expect(
      getDlcChaptersForSection({
        kind: "breeding_program",
        tier: "mascoteers",
      }),
    ).toEqual([]);
  });

  it("first chapter unlocks at Act 3 with no bloodline prereq", () => {
    expect(DLC_BREEDING_01_CREW_UNLOCKS.prerequisites).toContainEqual({
      kind: "act_completion",
      act: 3,
    });
  });

  it("second chapter requires 1 PURE generation", () => {
    expect(DLC_BREEDING_02_FIRST_PURE_CYCLE.prerequisites).toContainEqual({
      kind: "bloodline_threshold",
      classification: "PURE",
      minGenerations: 1,
    });
    expect(DLC_BREEDING_02_FIRST_PURE_CYCLE.prerequisites).toContainEqual({
      kind: "dlc_chapter_completion",
      chapterId: "dlc_breeding_01_crew_unlocks",
    });
  });

  it("terminal chapter requires the canonical 5 PURE generations + spine complete", () => {
    expect(DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES.prerequisites).toContainEqual({
      kind: "bloodline_threshold",
      classification: "PURE",
      minGenerations: PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY,
    });
    expect(DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES.prerequisites).toContainEqual({
      kind: "flag",
      flag: "narrative_spine_complete",
    });
  });

  it("terminal chapter raises the S2 Advocate-body hook flag", () => {
    expect(
      DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES.setsFlagsOnComplete,
    ).toContain("season_2_advocate_body_hook_raised");
    expect(
      DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES.setsFlagsOnComplete,
    ).toContain("advocate_body_coordinates_unlocked");
  });

  it("bloodline_threshold gate honors generation count", () => {
    const chapter = DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES;
    const fullPrereqsExceptBloodline = {
      narrative_spine_complete: true,
      [dlcChapterCompletionFlag(DLC_BREEDING_02_FIRST_PURE_CYCLE.id)]: true,
    };
    // 0 PURE generations → gate fails.
    expect(
      deriveDlcChapterStatus({
        chapter,
        flags: fullPrereqsExceptBloodline,
        entitlements: {},
        bloodlineGenerations: { PURE: 0 },
      }).available,
    ).toBe(false);
    // 4 PURE generations → still fails.
    expect(
      deriveDlcChapterStatus({
        chapter,
        flags: fullPrereqsExceptBloodline,
        entitlements: {},
        bloodlineGenerations: { PURE: 4 },
      }).available,
    ).toBe(false);
    // 5 PURE generations → unlocks.
    expect(
      deriveDlcChapterStatus({
        chapter,
        flags: fullPrereqsExceptBloodline,
        entitlements: {},
        bloodlineGenerations: { PURE: 5 },
      }).available,
    ).toBe(true);
    // 7 PURE → still unlocks (>=).
    expect(
      deriveDlcChapterStatus({
        chapter,
        flags: fullPrereqsExceptBloodline,
        entitlements: {},
        bloodlineGenerations: { PURE: 7 },
      }).available,
    ).toBe(true);
  });

  it("bloodline_threshold honors the classification key — DEMONIC count doesn't satisfy a PURE gate", () => {
    const chapter = DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES;
    const flags = {
      narrative_spine_complete: true,
      [dlcChapterCompletionFlag(DLC_BREEDING_02_FIRST_PURE_CYCLE.id)]: true,
    };
    expect(
      deriveDlcChapterStatus({
        chapter,
        flags,
        entitlements: {},
        bloodlineGenerations: { DEMONIC: 99 },
      }).available,
    ).toBe(false);
  });

  it("missing bloodlineGenerations input defaults every classification to 0", () => {
    const chapter = DLC_BREEDING_02_FIRST_PURE_CYCLE;
    const status = deriveDlcChapterStatus({
      chapter,
      flags: {
        [dlcChapterCompletionFlag(DLC_BREEDING_01_CREW_UNLOCKS.id)]: true,
      },
      entitlements: {},
      // bloodlineGenerations omitted entirely.
    });
    expect(status.available).toBe(false);
    expect(status.missingPrerequisites).toContainEqual({
      kind: "bloodline_threshold",
      classification: "PURE",
      minGenerations: 1,
    });
  });

  it("the global registry contains every Breeding chapter", () => {
    for (const c of ALL_BREEDING_DLC_CHAPTERS) {
      expect(ALL_DLC_CHAPTERS).toContain(c);
    }
  });

  it("first chapter offers the seven canonical bloodline paths as a choice (PURE, HYBRID, NAMED ship as choices in Wave 6)", () => {
    const choice = DLC_BREEDING_01_CREW_UNLOCKS.steps.find(
      (s) => s.kind === "choice",
    );
    expect(choice?.kind).toBe("choice");
    if (choice?.kind === "choice") {
      const flagIds = choice.options
        .map((o) => o.setFlag)
        .filter((f): f is string => Boolean(f));
      expect(new Set(flagIds)).toEqual(
        new Set([
          "breeding_path_pure_chosen",
          "breeding_path_hybrid_chosen",
          "breeding_path_named_chosen",
        ]),
      );
    }
  });
});
