/* End-to-end lifecycle test for the Wave-3 reference chapter.
 *
 * Validates the full data flow that the foundation promises:
 *   1. The chapter is in the registry.
 *   2. Locked initially (no prerequisites met).
 *   3. Available after the prerequisites are satisfied.
 *   4. Marking complete (raising dlc_chapter_<id>_complete) flips
 *      the chapter into alreadyComplete + drops it from the
 *      available list.
 *   5. The completion flag drops the chapter id into
 *      PlayerExpansionState.completedDlcChapters via the
 *      derive-from-flags adapter.
 *   6. A card with kind: "dlc_chapter_completion" gating UNLOCKS
 *      once that derived state holds.
 *   7. The choice steps' setFlag values are present (the runtime
 *      surface that stitches choices to flags can rely on them).
 */
import { describe, expect, it } from "vitest";
import { DLC_ADVOCATE_01_SACRUM_ECHO } from "./manifest";
import {
  ALL_DLC_CHAPTERS,
  deriveDlcChapterStatus,
  dlcChapterCompletionFlag,
  getAvailableDlcChapters,
  getDlcChapter,
  getDlcChaptersForSection,
} from "../../index";
import {
  derivePlayerExpansionStateFromFlags,
  evaluateUnlockCondition,
  isCardUnlocked,
  type PlayerExpansionState,
} from "../../../tcg-core/rewards/expansionUnlockService";
import type { CardDefinition } from "../../../tcg-core/types/Card";

const CHAPTER_ID = "dlc_advocate_01_sacrum_echo";
const COMPLETION_FLAG = dlcChapterCompletionFlag(CHAPTER_ID);

describe("DLC Wave-3 reference chapter — Sacrum Echo", () => {
  it("is registered and resolves by id", () => {
    expect(getDlcChapter(CHAPTER_ID)).toBe(DLC_ADVOCATE_01_SACRUM_ECHO);
    expect(ALL_DLC_CHAPTERS).toContain(DLC_ADVOCATE_01_SACRUM_ECHO);
  });

  it("attaches to the advocate_arc parent section at sequence 1", () => {
    expect(DLC_ADVOCATE_01_SACRUM_ECHO.parentSection).toEqual({
      kind: "advocate_arc",
    });
    expect(DLC_ADVOCATE_01_SACRUM_ECHO.sequence).toBe(1);
    const list = getDlcChaptersForSection({ kind: "advocate_arc" });
    expect(list.map((c) => c.id)).toEqual([CHAPTER_ID]);
  });

  it("declares the canonical dlc_chapter_<id>_complete flag among setsFlagsOnComplete", () => {
    expect(DLC_ADVOCATE_01_SACRUM_ECHO.setsFlagsOnComplete).toContain(
      COMPLETION_FLAG,
    );
  });

  it("is locked when no prerequisites are met", () => {
    const status = deriveDlcChapterStatus({
      chapter: DLC_ADVOCATE_01_SACRUM_ECHO,
      flags: {},
      entitlements: {},
    });
    expect(status.available).toBe(false);
    expect(status.alreadyComplete).toBe(false);
    expect(status.missingPrerequisites).toHaveLength(2);
  });

  it("is available after Act 2 + Authority Trial flag", () => {
    const status = deriveDlcChapterStatus({
      chapter: DLC_ADVOCATE_01_SACRUM_ECHO,
      flags: {
        act_2_complete: true,
        authority_trial_complete: true,
      },
      entitlements: {},
    });
    expect(status.available).toBe(true);
    expect(status.alreadyComplete).toBe(false);
  });

  it("flips to alreadyComplete when the canonical flag is set", () => {
    const status = deriveDlcChapterStatus({
      chapter: DLC_ADVOCATE_01_SACRUM_ECHO,
      flags: {
        act_2_complete: true,
        authority_trial_complete: true,
        [COMPLETION_FLAG]: true,
      },
      entitlements: {},
    });
    expect(status.available).toBe(true); // prereqs still hold
    expect(status.alreadyComplete).toBe(true);
  });

  it("drops out of getAvailableDlcChapters once complete", () => {
    const flagsBefore = {
      act_2_complete: true,
      authority_trial_complete: true,
    };
    const flagsAfter = { ...flagsBefore, [COMPLETION_FLAG]: true };
    expect(
      getAvailableDlcChapters(ALL_DLC_CHAPTERS, flagsBefore, {}).map(
        (c) => c.id,
      ),
    ).toContain(CHAPTER_ID);
    expect(
      getAvailableDlcChapters(ALL_DLC_CHAPTERS, flagsAfter, {}).map(
        (c) => c.id,
      ),
    ).not.toContain(CHAPTER_ID);
  });

  it("derivePlayerExpansionStateFromFlags lifts the chapter into completedDlcChapters", () => {
    const state = derivePlayerExpansionStateFromFlags({
      [COMPLETION_FLAG]: true,
    });
    expect(state.completedDlcChapters.has(CHAPTER_ID)).toBe(true);
  });

  it("a card gated on dlc_chapter_completion=<id> unlocks once the chapter completes", () => {
    const stub: CardDefinition = {
      id: "test_card_advocate_sacrum" as CardDefinition["id"],
      name: "Sacrum Shard",
      faction: "neutral",
      cardType: "unit",
      rarity: "rare",
      cost: 3,
      baseStats: { power: 2, health: 4 },
      keywords: [],
      abilities: [],
      art: "x",
      flavorText: "",
      rulesVersion: "1.1.0",
      unlockCondition: { kind: "dlc_chapter_completion", chapterId: CHAPTER_ID },
    };
    const before: PlayerExpansionState = derivePlayerExpansionStateFromFlags({});
    const after: PlayerExpansionState = derivePlayerExpansionStateFromFlags({
      [COMPLETION_FLAG]: true,
    });
    expect(isCardUnlocked(stub, before)).toBe(false);
    expect(isCardUnlocked(stub, after)).toBe(true);
    // Direct-evaluator path matches.
    expect(
      evaluateUnlockCondition(
        { kind: "dlc_chapter_completion", chapterId: CHAPTER_ID },
        after,
      ),
    ).toBe(true);
  });

  it("declares loredex unlocks in its rewards bundle", () => {
    expect(DLC_ADVOCATE_01_SACRUM_ECHO.rewards.loredexEntries).toContain(
      "the_sacrum_of_severed_silk",
    );
  });

  it("steps include narration + a choice with three branching flag outcomes", () => {
    const steps = DLC_ADVOCATE_01_SACRUM_ECHO.steps;
    expect(steps.length).toBeGreaterThanOrEqual(3);
    const narrations = steps.filter((s) => s.kind === "narration");
    const choices = steps.filter((s) => s.kind === "choice");
    expect(narrations.length).toBeGreaterThanOrEqual(2);
    expect(choices).toHaveLength(1);
    const choice = choices[0];
    if (choice.kind !== "choice") throw new Error("type narrowing");
    expect(choice.options).toHaveLength(3);
    const flagSet = choice.options
      .map((o) => o.setFlag)
      .filter((f): f is string => Boolean(f));
    expect(new Set(flagSet)).toEqual(
      new Set([
        "advocate_sacrum_path_preserve",
        "advocate_sacrum_path_weave",
        "advocate_sacrum_path_return",
      ]),
    );
  });

  it("every step id is unique within the chapter", () => {
    const ids = DLC_ADVOCATE_01_SACRUM_ECHO.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
