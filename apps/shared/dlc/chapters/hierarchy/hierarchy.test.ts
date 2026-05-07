/* Wave-5 integration tests — Hierarchy ladder.
 *
 * Confirms the five Hierarchy chapters (Xeth'Raal → Taskmaster →
 * Syl'Vex → Mol'Garath → Yog-Nathal teaser):
 *   - chain strictly in lore order via dlc_chapter_completion
 *     prerequisites,
 *   - escalate Act gates from Act 3 → Act 6 → spine_complete,
 *   - terminal chapter raises the Season-2 hook flag.
 */
import { describe, expect, it } from "vitest";
import {
  ALL_HIERARCHY_DLC_CHAPTERS,
  DLC_HIERARCHY_01_XETH_AUDIT,
  DLC_HIERARCHY_02_TASKMASTER_REMEMBERED,
  DLC_HIERARCHY_03_SYLVEX_TEMPTATION,
  DLC_HIERARCHY_04_MOLGARATH_LABYRINTH,
  DLC_HIERARCHY_05_YOG_NATHAL_TEASER,
} from "./index";
import {
  ALL_DLC_CHAPTERS,
  deriveDlcChapterStatus,
  dlcChapterCompletionFlag,
  getDlcChaptersForSection,
} from "../../index";

const LADDER = [
  DLC_HIERARCHY_01_XETH_AUDIT,
  DLC_HIERARCHY_02_TASKMASTER_REMEMBERED,
  DLC_HIERARCHY_03_SYLVEX_TEMPTATION,
  DLC_HIERARCHY_04_MOLGARATH_LABYRINTH,
  DLC_HIERARCHY_05_YOG_NATHAL_TEASER,
];

describe("Hierarchy ladder — DLC chapters", () => {
  it("ships exactly five chapters under hierarchy_arc", () => {
    expect(ALL_HIERARCHY_DLC_CHAPTERS).toHaveLength(5);
    const fromSection = getDlcChaptersForSection({ kind: "hierarchy_arc" });
    expect(fromSection).toHaveLength(5);
    expect(fromSection.map((c) => c.id)).toEqual(LADDER.map((c) => c.id));
  });

  it("every chapter has parentSection.kind === 'hierarchy_arc'", () => {
    for (const c of ALL_HIERARCHY_DLC_CHAPTERS) {
      expect(c.parentSection.kind).toBe("hierarchy_arc");
    }
  });

  it("sequence is strictly 1..5 in ladder order", () => {
    expect(LADDER.map((c) => c.sequence)).toEqual([1, 2, 3, 4, 5]);
  });

  it("each chapter from #2 onward chains via dlc_chapter_completion on the previous chapter", () => {
    for (let i = 1; i < LADDER.length; i++) {
      const prev = LADDER[i - 1];
      const curr = LADDER[i];
      expect(curr.prerequisites).toContainEqual({
        kind: "dlc_chapter_completion",
        chapterId: prev.id,
      });
    }
  });

  it("Act gates escalate Act 3 → 4 → 5 → 6 → spine_complete", () => {
    expect(DLC_HIERARCHY_01_XETH_AUDIT.prerequisites).toContainEqual({
      kind: "act_completion",
      act: 3,
    });
    expect(DLC_HIERARCHY_02_TASKMASTER_REMEMBERED.prerequisites).toContainEqual({
      kind: "act_completion",
      act: 4,
    });
    expect(DLC_HIERARCHY_03_SYLVEX_TEMPTATION.prerequisites).toContainEqual({
      kind: "act_completion",
      act: 5,
    });
    expect(DLC_HIERARCHY_04_MOLGARATH_LABYRINTH.prerequisites).toContainEqual({
      kind: "act_completion",
      act: 6,
    });
    expect(DLC_HIERARCHY_05_YOG_NATHAL_TEASER.prerequisites).toContainEqual({
      kind: "flag",
      flag: "narrative_spine_complete",
    });
  });

  it("the terminal chapter is locked until the previous four are all complete", () => {
    const teaser = DLC_HIERARCHY_05_YOG_NATHAL_TEASER;
    // Spine complete + first three chapters complete → still missing
    // the Mol'Garath chapter.
    const partial = {
      narrative_spine_complete: true,
      [dlcChapterCompletionFlag(DLC_HIERARCHY_01_XETH_AUDIT.id)]: true,
      [dlcChapterCompletionFlag(DLC_HIERARCHY_02_TASKMASTER_REMEMBERED.id)]: true,
      [dlcChapterCompletionFlag(DLC_HIERARCHY_03_SYLVEX_TEMPTATION.id)]: true,
    };
    const partialStatus = deriveDlcChapterStatus({
      chapter: teaser,
      flags: partial,
      entitlements: {},
    });
    expect(partialStatus.available).toBe(false);
    expect(partialStatus.missingPrerequisites).toContainEqual({
      kind: "dlc_chapter_completion",
      chapterId: DLC_HIERARCHY_04_MOLGARATH_LABYRINTH.id,
    });

    const full = {
      ...partial,
      [dlcChapterCompletionFlag(DLC_HIERARCHY_04_MOLGARATH_LABYRINTH.id)]: true,
    };
    expect(
      deriveDlcChapterStatus({ chapter: teaser, flags: full, entitlements: {} })
        .available,
    ).toBe(true);
  });

  it("the terminal chapter raises the Season-2 hook flag", () => {
    expect(DLC_HIERARCHY_05_YOG_NATHAL_TEASER.setsFlagsOnComplete).toContain(
      "season_2_hook_raised",
    );
  });

  it("the Yog-Nathal teaser is pure narration (no choice steps)", () => {
    const choiceSteps = DLC_HIERARCHY_05_YOG_NATHAL_TEASER.steps.filter(
      (s) => s.kind === "choice",
    );
    expect(choiceSteps).toHaveLength(0);
    const narrationSteps = DLC_HIERARCHY_05_YOG_NATHAL_TEASER.steps.filter(
      (s) => s.kind === "narration",
    );
    expect(narrationSteps.length).toBeGreaterThanOrEqual(4);
  });

  it("Mol'Garath chapter unlocks Labyrinth Annotations + Long View loredex", () => {
    expect(
      DLC_HIERARCHY_04_MOLGARATH_LABYRINTH.rewards.loredexEntries,
    ).toEqual(
      expect.arrayContaining([
        "entity_molgarath",
        "concept_labyrinth_annotations",
        "concept_long_view_layer",
      ]),
    );
  });

  it("Syl'Vex chapter declares the dark-mirror and corruptor flags on completion", () => {
    expect(
      DLC_HIERARCHY_03_SYLVEX_TEMPTATION.setsFlagsOnComplete,
    ).toContain("advocate_dark_mirror_seen");
    expect(
      DLC_HIERARCHY_03_SYLVEX_TEMPTATION.setsFlagsOnComplete,
    ).toContain("hierarchy_ladder_corruptor_faced");
  });

  it("Taskmaster chapter raises the two_malkias_distinguished flag", () => {
    expect(
      DLC_HIERARCHY_02_TASKMASTER_REMEMBERED.setsFlagsOnComplete,
    ).toContain("two_malkias_distinguished");
  });

  it("the global registry contains every Hierarchy chapter", () => {
    for (const c of ALL_HIERARCHY_DLC_CHAPTERS) {
      expect(ALL_DLC_CHAPTERS).toContain(c);
    }
  });

  it("every chapter has a unique id matching the dlc_<...> snake-case rule", () => {
    const ids = ALL_HIERARCHY_DLC_CHAPTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^dlc_[a-z0-9_]+$/);
  });

  it("every chapter declares the canonical dlc_chapter_<id>_complete flag", () => {
    for (const c of ALL_HIERARCHY_DLC_CHAPTERS) {
      expect(c.setsFlagsOnComplete).toContain(dlcChapterCompletionFlag(c.id));
    }
  });

  it("end-to-end: walking the ladder reveals the next rung at each step", () => {
    let flags: Record<string, true> = { act_3_complete: true };
    expect(
      deriveDlcChapterStatus({
        chapter: LADDER[0],
        flags,
        entitlements: {},
      }).available,
    ).toBe(true);
    // Climb the ladder one rung at a time. After each completion,
    // raise the next chapter's act gate too — the actual gameplay
    // arc has the spine progressing alongside.
    const actGateForRung: Record<number, string> = {
      1: "act_4_complete",
      2: "act_5_complete",
      3: "act_6_complete",
      4: "narrative_spine_complete",
    };
    for (let i = 0; i < LADDER.length - 1; i++) {
      flags = {
        ...flags,
        [dlcChapterCompletionFlag(LADDER[i].id)]: true,
        [actGateForRung[i + 1]!]: true,
      };
      const next = LADDER[i + 1];
      const status = deriveDlcChapterStatus({
        chapter: next,
        flags,
        entitlements: {},
      });
      expect(status.available, `Rung ${i + 1} (${next.id}) blocked`).toBe(true);
    }
  });
});
