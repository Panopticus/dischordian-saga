import { describe, expect, it } from "vitest";
import { ALL_CHAPTER_ENCOUNTERS } from "@shared/tcg-core/story/chapters";
import { ACT_1_OPPONENTS } from "@shared/act1Opponents";
import {
  ACT_3_OPPONENTS,
  ACT_4_OPPONENTS,
  ACT_6_OPPONENTS,
  ACT_7_OPPONENTS,
} from "@shared/acts2to7Opponents";
import { CHAPTER_INTROS } from "@shared/chapterIntroCutscenes";
import {
  STORY_CHAPTER_INTRO_MAPPINGS,
  resolveChapterIntroForChapter,
  resolveChapterIntroForOpponent,
  resolveChapterIntroForOpponentPrestigeRematch,
} from "@shared/storyEncounterChapterIntros";

const ALL_ENGINE_OPPONENT_IDS: ReadonlySet<string> = new Set([
  ...ACT_1_OPPONENTS.map((o) => o.id),
  ...ACT_3_OPPONENTS.map((o) => o.id),
  ...ACT_4_OPPONENTS.map((o) => o.id),
  ...ACT_6_OPPONENTS.map((o) => o.id),
  ...ACT_7_OPPONENTS.map((o) => o.id),
]);

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

  it("every mapped opponentId exists in the engine's Acts 1-7 opponent lists", () => {
    for (const opponentId of Object.keys(
      STORY_CHAPTER_INTRO_MAPPINGS.byOpponentId,
    )) {
      expect(
        ALL_ENGINE_OPPONENT_IDS.has(opponentId),
        `mapped opponentId ${opponentId} not found in any Act opponent list`,
      ).toBe(true);
    }
  });

  it("every prestige-rematch mapped opponentId exists in the engine's Act 1 opponents", () => {
    // Prestige rematches only fire on Act 1 cycle re-engagement.
    const act1Ids = new Set(ACT_1_OPPONENTS.map((o) => o.id));
    for (const opponentId of Object.keys(
      STORY_CHAPTER_INTRO_MAPPINGS.byOpponentIdPrestigeRematch,
    )) {
      expect(
        act1Ids.has(opponentId),
        `prestige-rematch opponentId ${opponentId} not in ACT_1_OPPONENTS`,
      ).toBe(true);
    }
  });

  it("every mapped intro id exists in CHAPTER_INTROS", () => {
    const introIds = new Set(CHAPTER_INTROS.map((d) => d.id));
    const allMapped = [
      ...Object.values(STORY_CHAPTER_INTRO_MAPPINGS.byChapterId),
      ...Object.values(STORY_CHAPTER_INTRO_MAPPINGS.byOpponentId),
      ...Object.values(STORY_CHAPTER_INTRO_MAPPINGS.byOpponentIdPrestigeRematch),
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

  it("resolveChapterIntroForChapter picks gamemaster variant by gameMasterForm flag", () => {
    // Default (no flags) → human variant (the canonical static map).
    expect(resolveChapterIntroForChapter("ch_game_master")?.id).toBe(
      "ch11_gamemaster_human",
    );
    expect(
      resolveChapterIntroForChapter("ch_game_master", {})?.id,
    ).toBe("ch11_gamemaster_human");
    // Explicit human form → human variant.
    expect(
      resolveChapterIntroForChapter("ch_game_master", {
        gameMasterForm: "human",
      })?.id,
    ).toBe("ch11_gamemaster_human");
    // Robot form → robot variant.
    expect(
      resolveChapterIntroForChapter("ch_game_master", {
        gameMasterForm: "robot",
      })?.id,
    ).toBe("ch11_gamemaster_robot");
  });

  it("flags arg has no effect on non-gamemaster chapters", () => {
    // Other chapters ignore flags entirely — only ch_game_master
    // currently uses variant resolution.
    expect(
      resolveChapterIntroForChapter("ch4", { gameMasterForm: "robot" })?.id,
    ).toBe("ch19_antiquarian");
  });

  it("resolveChapterIntroForOpponent round-trips every mapped opponentId", () => {
    for (const [opponentId, introId] of Object.entries(
      STORY_CHAPTER_INTRO_MAPPINGS.byOpponentId,
    )) {
      expect(resolveChapterIntroForOpponent(opponentId)?.id).toBe(introId);
    }
  });

  it("resolveChapterIntroForOpponentPrestigeRematch round-trips every mapped opponentId", () => {
    for (const [opponentId, introId] of Object.entries(
      STORY_CHAPTER_INTRO_MAPPINGS.byOpponentIdPrestigeRematch,
    )) {
      expect(
        resolveChapterIntroForOpponentPrestigeRematch(opponentId)?.id,
      ).toBe(introId);
    }
  });

  it("prestige-rematch resolver returns null for an opponent without a rematch intro", () => {
    // young_kael (Cycle B) has a regular intro but no rematch intro
    // shipped in the producer drop.
    expect(resolveChapterIntroForOpponentPrestigeRematch("young_kael")).toBeNull();
    expect(resolveChapterIntroForOpponentPrestigeRematch("nonsense")).toBeNull();
  });

  it("unknown ids resolve to null (no wrong-content fire)", () => {
    expect(resolveChapterIntroForChapter("ch1")).toBeNull();
    expect(resolveChapterIntroForChapter("ch_authority_trial")).toBeNull();
    expect(resolveChapterIntroForChapter("nonsense")).toBeNull();
    expect(resolveChapterIntroForOpponent("vernon_vortex")).toBeNull();
    expect(resolveChapterIntroForOpponent("nonsense")).toBeNull();
  });

  it("ships 4 chapterId + 12 opponentId + 1 prestige-rematch mappings (canon-gap fully resolved)", () => {
    // PR #565 shipped 4+5; this PR added in successive phases:
    //  - Phase 3: Elara-glitched + Source/Patient-Zero + Iron Lion (rematch)
    //  - Phase 5: Necromancer (act6_thazulok_returns)
    //  - Phase 6: Collector rematch (act6_corey_resurfaces)
    //  - Phase 7: Jailer (act6_the_jailer)
    //  - Phase 8: Dreamer (act7_the_dreamer)
    //  - Phase 9: Oracle/Meme (act7_oracle_meme_final)
    // All 12 originally-unmapped chapter intros from
    // chapter-intro-canon-gap-2026-05.md are now resolved
    // (5 of them via SCAFFOLD opponents pending writer review).
    expect(
      Object.keys(STORY_CHAPTER_INTRO_MAPPINGS.byChapterId),
    ).toHaveLength(4);
    expect(
      Object.keys(STORY_CHAPTER_INTRO_MAPPINGS.byOpponentId),
    ).toHaveLength(12);
    expect(
      Object.keys(STORY_CHAPTER_INTRO_MAPPINGS.byOpponentIdPrestigeRematch),
    ).toHaveLength(1);
  });
});
