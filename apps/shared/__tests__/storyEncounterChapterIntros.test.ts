import { describe, expect, it } from "vitest";
import { ALL_CHAPTER_ENCOUNTERS } from "@shared/tcg-core/story/chapters";
import { ACT_1_OPPONENTS } from "@shared/act1Opponents";
import { CHAPTER_INTROS } from "@shared/chapterIntroCutscenes";
import {
  STORY_CHAPTER_INTRO_MAPPINGS,
  resolveChapterIntroForChapter,
  resolveChapterIntroForOpponent,
} from "@shared/storyEncounterChapterIntros";

describe("storyEncounterChapterIntros — bible-confirmed mappings", () => {
  it("every mapped chapterId exists in the engine's StoryEncounter list", () => {
    const engineChapterIds = new Set(
      ALL_CHAPTER_ENCOUNTERS.map((e) => e.chapterId),
    );
    for (const chapterId of Object.keys(
      STORY_CHAPTER_INTRO_MAPPINGS.byChapterId,
    )) {
      expect(
        engineChapterIds.has(chapterId),
        `mapped chapterId ${chapterId} not found in ALL_CHAPTER_ENCOUNTERS`,
      ).toBe(true);
    }
  });

  it("every mapped opponentId exists in the engine's Act1Opponents list", () => {
    const engineOpponentIds = new Set(ACT_1_OPPONENTS.map((o) => o.id));
    for (const opponentId of Object.keys(
      STORY_CHAPTER_INTRO_MAPPINGS.byOpponentId,
    )) {
      expect(
        engineOpponentIds.has(opponentId),
        `mapped opponentId ${opponentId} not found in ACT_1_OPPONENTS`,
      ).toBe(true);
    }
  });

  it("every mapped intro id exists in CHAPTER_INTROS", () => {
    const introIds = new Set(CHAPTER_INTROS.map((d) => d.id));
    const allMapped = [
      ...Object.values(STORY_CHAPTER_INTRO_MAPPINGS.byChapterId),
      ...Object.values(STORY_CHAPTER_INTRO_MAPPINGS.byOpponentId),
    ];
    for (const introId of allMapped) {
      expect(
        introIds.has(introId),
        `mapped intro id ${introId} not in CHAPTER_INTROS`,
      ).toBe(true);
    }
  });

  it("resolveChapterIntroForChapter round-trips every mapped chapterId", () => {
    for (const [chapterId, introId] of Object.entries(
      STORY_CHAPTER_INTRO_MAPPINGS.byChapterId,
    )) {
      expect(resolveChapterIntroForChapter(chapterId)?.id).toBe(introId);
    }
  });

  it("resolveChapterIntroForOpponent round-trips every mapped opponentId", () => {
    for (const [opponentId, introId] of Object.entries(
      STORY_CHAPTER_INTRO_MAPPINGS.byOpponentId,
    )) {
      expect(resolveChapterIntroForOpponent(opponentId)?.id).toBe(introId);
    }
  });

  it("unknown ids resolve to null (no wrong-content fire)", () => {
    expect(resolveChapterIntroForChapter("ch1")).toBeNull();
    expect(resolveChapterIntroForChapter("ch_authority_trial")).toBeNull();
    expect(resolveChapterIntroForChapter("nonsense")).toBeNull();
    expect(resolveChapterIntroForOpponent("vernon_vortex")).toBeNull();
    expect(resolveChapterIntroForOpponent("nonsense")).toBeNull();
  });

  it("ships exactly 4 chapterId mappings + 5 opponentId mappings (the 9 confident ones)", () => {
    expect(
      Object.keys(STORY_CHAPTER_INTRO_MAPPINGS.byChapterId),
    ).toHaveLength(4);
    expect(
      Object.keys(STORY_CHAPTER_INTRO_MAPPINGS.byOpponentId),
    ).toHaveLength(5);
  });
});
