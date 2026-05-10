import { describe, expect, it } from "vitest";
import {
  CHAPTER_INTROS,
  CHAPTER_INTRO_TOTAL,
  chapterIntrosFor,
  getChapterIntro,
  resolveChapterIntro,
} from "@shared/chapterIntroCutscenes";

describe("chapterIntroCutscenes — parity", () => {
  it("registers exactly 21 producer-delivered openers", () => {
    expect(CHAPTER_INTRO_TOTAL).toBe(21);
    expect(CHAPTER_INTROS).toHaveLength(21);
  });

  it("every entry's videoRelPath is uniquely shaped after the id", () => {
    const seen = new Set<string>();
    for (const def of CHAPTER_INTROS) {
      const ch = String(def.chapter).padStart(2, "0");
      expect(def.id).toBe(`ch${ch}_${def.slug}`);
      expect(def.videoRelPath).toBe(
        `videos/fight-intros/ch${ch}_${def.slug}_complete.mp4`,
      );
      expect(seen.has(def.id)).toBe(false);
      seen.add(def.id);
    }
  });

  it("chapter numbers fall in the documented Act 2-7 range", () => {
    for (const def of CHAPTER_INTROS) {
      expect(def.chapter).toBeGreaterThanOrEqual(5);
      expect(def.chapter).toBeLessThanOrEqual(21);
    }
  });

  it("BONUS variants are flagged isBonusVariant=true", () => {
    const bonus = CHAPTER_INTROS.filter((d) => d.isBonusVariant);
    expect(bonus.map((d) => d.slug).sort()).toEqual([
      "conexus_BONUS",
      "nilmorg_BONUS",
      "shadow_tongue_BONUS",
    ]);
    for (const def of CHAPTER_INTROS) {
      expect(def.isBonusVariant).toBe(def.slug.endsWith("_BONUS"));
    }
  });

  it("resolveChapterIntro returns the non-bonus variant by default and the requested slug when given", () => {
    // Chapter 19 has antiquarian (primary) + nilmorg_BONUS.
    expect(resolveChapterIntro(19)?.slug).toBe("antiquarian");
    expect(resolveChapterIntro(19, "nilmorg_BONUS")?.slug).toBe(
      "nilmorg_BONUS",
    );
    // Chapter 20 has dreamer (primary) + conexus_BONUS.
    expect(resolveChapterIntro(20)?.slug).toBe("dreamer");
    // Unknown chapter → undefined.
    expect(resolveChapterIntro(999)).toBeUndefined();
    // Unknown slug falls back to the primary variant.
    expect(resolveChapterIntro(20, "no_such_slug")?.slug).toBe("dreamer");
  });

  it("getChapterIntro round-trips every id", () => {
    for (const def of CHAPTER_INTROS) {
      expect(getChapterIntro(def.id)?.id).toBe(def.id);
    }
    expect(getChapterIntro("ch99_unknown")).toBeUndefined();
  });

  it("chapterIntrosFor returns variants sorted with primary before bonus", () => {
    const ch11 = chapterIntrosFor(11);
    expect(ch11).toHaveLength(2);
    // Both slugs are non-BONUS for chapter 11; the relative order
    // doesn't matter, but both must be present and non-bonus.
    expect(ch11.every((d) => !d.isBonusVariant)).toBe(true);

    const ch19 = chapterIntrosFor(19);
    expect(ch19).toHaveLength(2);
    expect(ch19[0].isBonusVariant).toBe(false);
    expect(ch19[1].isBonusVariant).toBe(true);
  });
});
