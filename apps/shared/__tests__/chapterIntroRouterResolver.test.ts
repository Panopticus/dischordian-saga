import { describe, expect, it } from "vitest";
import {
  chapterIntroSeenFlag,
  chapterIntroTriggerFlag,
  resolvePendingChapterIntro,
} from "@/components/cutscenes/ChapterIntroRouter";
import { CHAPTER_INTROS } from "@shared/chapterIntroCutscenes";

describe("ChapterIntroRouter — resolvePendingChapterIntro", () => {
  it("returns null when no flags are set", () => {
    expect(resolvePendingChapterIntro({})).toBeNull();
  });

  it("returns the intro whose trigger flag is set", () => {
    const def = CHAPTER_INTROS[0];
    const flags = { [chapterIntroTriggerFlag(def.id)]: true };
    expect(resolvePendingChapterIntro(flags)?.id).toBe(def.id);
  });

  it("skips an intro whose seen flag is already set", () => {
    const def = CHAPTER_INTROS[0];
    const flags = {
      [chapterIntroTriggerFlag(def.id)]: true,
      [chapterIntroSeenFlag(def.id)]: true,
    };
    expect(resolvePendingChapterIntro(flags)).toBeNull();
  });

  it("when multiple triggers fire, returns the first in registry order", () => {
    const a = CHAPTER_INTROS[0];
    const b = CHAPTER_INTROS[CHAPTER_INTROS.length - 1];
    const flags = {
      [chapterIntroTriggerFlag(a.id)]: true,
      [chapterIntroTriggerFlag(b.id)]: true,
    };
    expect(resolvePendingChapterIntro(flags)?.id).toBe(a.id);
  });

  it("non-true values do not count as triggered", () => {
    const def = CHAPTER_INTROS[0];
    expect(
      resolvePendingChapterIntro({ [chapterIntroTriggerFlag(def.id)]: false }),
    ).toBeNull();
    expect(
      resolvePendingChapterIntro({
        [chapterIntroTriggerFlag(def.id)]: 1 as unknown as boolean,
      }),
    ).toBeNull();
  });

  it("trigger and seen flags follow the documented convention", () => {
    expect(chapterIntroTriggerFlag("ch05_watcher")).toBe(
      "chapter_intro_ch05_watcher_triggered",
    );
    expect(chapterIntroSeenFlag("ch05_watcher")).toBe(
      "chapter_intro_ch05_watcher_seen",
    );
  });
});
