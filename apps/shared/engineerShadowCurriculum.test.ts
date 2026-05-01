import { describe, it, expect } from "vitest";
import {
  PAGES_PER_CHAPTER,
  TOTAL_CHAPTERS,
  TOTAL_CIPHER_PAGES,
  TOTAL_JOURNAL_PAGES,
  allSignatureTechniques,
  awardCipherPage,
  chapterFromPage,
  emptyCurriculumProgress,
  equipSignature,
  getCipherPage,
  getJournalPage,
  getSignatureTechnique,
  recoverJournalPage,
  resolveEquippedSignature,
} from "./engineerShadowCurriculum";

describe("engineerShadowCurriculum — constants", () => {
  it("ships 4 chapters of 3 pages each, totalling 12", () => {
    expect(TOTAL_CHAPTERS).toBe(4);
    expect(PAGES_PER_CHAPTER).toBe(3);
    expect(TOTAL_JOURNAL_PAGES).toBe(12);
  });

  it("the legacy TOTAL_CIPHER_PAGES alias still equals 12", () => {
    expect(TOTAL_CIPHER_PAGES).toBe(TOTAL_JOURNAL_PAGES);
  });
});

describe("engineerShadowCurriculum — getJournalPage", () => {
  it("returns the page for valid page numbers, with the journal id format", () => {
    const p = getJournalPage(1);
    expect(p?.pageNumber).toBe(1);
    expect(p?.text.length).toBeGreaterThan(20);
    expect(p?.id).toBe("engineer.journal.1");
  });

  it("rejects page numbers outside 1..12", () => {
    expect(getJournalPage(0)).toBeNull();
    expect(getJournalPage(13)).toBeNull();
    expect(getJournalPage(-1)).toBeNull();
  });

  it("every page has unique non-empty text", () => {
    const texts = new Set<string>();
    for (let i = 1; i <= TOTAL_JOURNAL_PAGES; i++) {
      const p = getJournalPage(i);
      expect(p).not.toBeNull();
      expect(p!.text.length).toBeGreaterThan(20);
      texts.add(p!.text);
    }
    expect(texts.size).toBe(TOTAL_JOURNAL_PAGES);
  });

  it("every page carries an Entry mark in archaic numbering", () => {
    expect(getJournalPage(1)?.entryMark).toBe("Entry the First");
    expect(getJournalPage(2)?.entryMark).toBe("Entry the Second");
    expect(getJournalPage(12)?.entryMark).toBe("Entry the Twelfth, the Last");
  });

  it("the legacy getCipherPage alias still resolves the same data", () => {
    const j = getJournalPage(5);
    const c = getCipherPage(5);
    expect(c).toEqual(j);
  });
});

describe("engineerShadowCurriculum — chapterFromPage", () => {
  it("maps pages 1-3 to chapter 1, 4-6 to chapter 2, etc.", () => {
    expect(chapterFromPage(1)).toBe(1);
    expect(chapterFromPage(3)).toBe(1);
    expect(chapterFromPage(4)).toBe(2);
    expect(chapterFromPage(7)).toBe(3);
    expect(chapterFromPage(12)).toBe(4);
  });
});

describe("engineerShadowCurriculum — signature techniques", () => {
  it("ships exactly 4 techniques, one per chapter", () => {
    const all = allSignatureTechniques();
    expect(all.length).toBe(TOTAL_CHAPTERS);
    for (let c = 1; c <= TOTAL_CHAPTERS; c++) {
      expect(getSignatureTechnique(c)).not.toBeNull();
    }
  });

  it("each technique has a unique effectKeyword", () => {
    const keywords = new Set(allSignatureTechniques().map(t => t.effectKeyword));
    expect(keywords.size).toBe(TOTAL_CHAPTERS);
  });
});

describe("engineerShadowCurriculum — recoverJournalPage", () => {
  it("recovers the next sequential page", () => {
    const start = emptyCurriculumProgress();
    const r = recoverJournalPage(start);
    expect(r.page?.pageNumber).toBe(1);
    expect(r.progress.pagesUnlocked).toEqual([1]);
  });

  it("after 3 distinctions, chapter 1 unlocks", () => {
    let prog = emptyCurriculumProgress();
    let chapterUnlocked: number | null = null;
    for (let i = 0; i < PAGES_PER_CHAPTER; i++) {
      const r = recoverJournalPage(prog);
      prog = r.progress;
      if (r.chapterUnlocked !== null) chapterUnlocked = r.chapterUnlocked;
    }
    expect(chapterUnlocked).toBe(1);
    expect(prog.chaptersCompleted).toEqual([1]);
  });

  it("does not double-award a chapter", () => {
    let prog = emptyCurriculumProgress();
    for (let i = 0; i < PAGES_PER_CHAPTER + 1; i++) {
      prog = recoverJournalPage(prog).progress;
    }
    expect(prog.chaptersCompleted).toEqual([1]);
  });

  it("caps at 12 pages — further recoveries return null page", () => {
    let prog = emptyCurriculumProgress();
    for (let i = 0; i < TOTAL_JOURNAL_PAGES; i++) prog = recoverJournalPage(prog).progress;
    expect(prog.pagesUnlocked.length).toBe(TOTAL_JOURNAL_PAGES);
    const overflow = recoverJournalPage(prog);
    expect(overflow.page).toBeNull();
    expect(overflow.progress.pagesUnlocked.length).toBe(TOTAL_JOURNAL_PAGES);
  });

  it("after 12 distinctions, all 4 chapters are completed", () => {
    let prog = emptyCurriculumProgress();
    for (let i = 0; i < TOTAL_JOURNAL_PAGES; i++) prog = recoverJournalPage(prog).progress;
    expect(prog.chaptersCompleted.sort()).toEqual([1, 2, 3, 4]);
  });

  it("the legacy awardCipherPage alias still works for back-compat", () => {
    const r = awardCipherPage(emptyCurriculumProgress());
    expect(r.page?.pageNumber).toBe(1);
  });
});

describe("engineerShadowCurriculum — equipSignature / resolveEquippedSignature", () => {
  it("can equip a chapter the player has unlocked", () => {
    let prog = emptyCurriculumProgress();
    for (let i = 0; i < PAGES_PER_CHAPTER; i++) prog = recoverJournalPage(prog).progress;
    const r = equipSignature(prog, 1);
    expect(r.ok).toBe(true);
    expect(r.progress.equippedChapter).toBe(1);
  });

  it("rejects equipping a locked chapter", () => {
    const r = equipSignature(emptyCurriculumProgress(), 2);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("chapter_locked");
  });

  it("can unequip by passing null", () => {
    const r = equipSignature({ ...emptyCurriculumProgress(), equippedChapter: 1, chaptersCompleted: [1] }, null);
    expect(r.ok).toBe(true);
    expect(r.progress.equippedChapter).toBeNull();
  });

  it("resolves to the equipped technique or null", () => {
    expect(resolveEquippedSignature(emptyCurriculumProgress())).toBeNull();
    const equipped = { ...emptyCurriculumProgress(), equippedChapter: 1, chaptersCompleted: [1] };
    expect(resolveEquippedSignature(equipped)?.chapterNumber).toBe(1);
  });
});
