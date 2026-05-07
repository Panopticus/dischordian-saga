import { describe, expect, it } from "vitest";
import {
  ALL_DLC_CHAPTERS,
  dlcChapterCompletionFlag,
  getDlcChapter,
  getDlcChaptersForSection,
  sameParentSection,
} from "./dlcChapterRegistry";
import type { DlcChapter, DlcParentSection } from "./types";

describe("DLC chapter registry — foundation invariants", () => {
  it("registry is frozen and contains at least one chapter", () => {
    expect(Object.isFrozen(ALL_DLC_CHAPTERS)).toBe(true);
    expect(ALL_DLC_CHAPTERS.length).toBeGreaterThan(0);
  });

  it("the Wave-3 reference chapter is registered", () => {
    expect(getDlcChapter("dlc_advocate_01_sacrum_echo")).toBeDefined();
  });

  it("getDlcChapter returns undefined for unknown ids", () => {
    expect(getDlcChapter("dlc_does_not_exist")).toBeUndefined();
  });

  it("getDlcChaptersForSection returns [] for sections with no chapters", () => {
    // Hierarchy arc has no Wave-3 chapters yet.
    expect(getDlcChaptersForSection({ kind: "hierarchy_arc" })).toEqual([]);
    // SiH per-track surface — no DLC chapters bound to individual tracks
    // (the show wires through AlbumPage, not the DLC system).
    expect(
      getDlcChaptersForSection({ kind: "silence_in_heaven", trackNumber: 12 }),
    ).toEqual([]);
  });

  it("dlcChapterCompletionFlag derives the canonical flag name", () => {
    expect(dlcChapterCompletionFlag("dlc_advocate_01_sacrum_echo")).toBe(
      "dlc_chapter_dlc_advocate_01_sacrum_echo_complete",
    );
  });

  it("registry uniqueness invariants hold for any future content", () => {
    // Forward-looking: when chapters are added, they must have unique
    // ids AND unique (parentSection, sequence) pairs. Empty array
    // trivially passes; the test stays in place to guard against
    // duplicates as content lands.
    const ids = ALL_DLC_CHAPTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    const seqs = ALL_DLC_CHAPTERS.map(
      (c) => `${JSON.stringify(c.parentSection)}::${c.sequence}`,
    );
    expect(new Set(seqs).size).toBe(seqs.length);
  });

  it("every registered chapter declares a setsFlagsOnComplete that includes its canonical flag", () => {
    // Forward-looking — empty registry trivially passes.
    for (const chapter of ALL_DLC_CHAPTERS) {
      expect(chapter.setsFlagsOnComplete).toContain(
        dlcChapterCompletionFlag(chapter.id),
      );
    }
  });

  it("chapter ids match the dlc_<...> snake-case convention", () => {
    for (const chapter of ALL_DLC_CHAPTERS) {
      expect(chapter.id).toMatch(/^dlc_[a-z0-9_]+$/);
    }
  });
});

describe("sameParentSection", () => {
  it("matches act sections by act number", () => {
    const a: DlcParentSection = { kind: "act", act: 3 };
    const b: DlcParentSection = { kind: "act", act: 3 };
    const c: DlcParentSection = { kind: "act", act: 4 };
    expect(sameParentSection(a, b)).toBe(true);
    expect(sameParentSection(a, c)).toBe(false);
  });

  it("matches galactic-dance sections by faction", () => {
    expect(
      sameParentSection(
        { kind: "galactic_dance", faction: "voltari" },
        { kind: "galactic_dance", faction: "voltari" },
      ),
    ).toBe(true);
    expect(
      sameParentSection(
        { kind: "galactic_dance", faction: "voltari" },
        { kind: "galactic_dance", faction: "thaloria" },
      ),
    ).toBe(false);
  });

  it("matches epoch-witness sections by epoch + archetype", () => {
    expect(
      sameParentSection(
        { kind: "epoch_witness", epoch: 3, archetype: "witness" },
        { kind: "epoch_witness", epoch: 3, archetype: "witness" },
      ),
    ).toBe(true);
    expect(
      sameParentSection(
        { kind: "epoch_witness", epoch: 3, archetype: "witness" },
        { kind: "epoch_witness", epoch: 3, archetype: "advocate" },
      ),
    ).toBe(false);
  });

  it("singleton kinds match by kind alone", () => {
    expect(
      sameParentSection({ kind: "advocate_arc" }, { kind: "advocate_arc" }),
    ).toBe(true);
    expect(
      sameParentSection({ kind: "hierarchy_arc" }, { kind: "advocate_arc" }),
    ).toBe(false);
  });

  it("filters by section against a synthetic registry of two chapters", () => {
    const a: DlcChapter = {
      id: "dlc_advocate_a",
      title: "A",
      synopsis: "",
      parentSection: { kind: "advocate_arc" },
      sequence: 1,
      prerequisites: [],
      steps: [],
      rewards: {},
      setsFlagsOnComplete: ["dlc_chapter_dlc_advocate_a_complete"],
    };
    const b: DlcChapter = {
      ...a,
      id: "dlc_advocate_b",
      sequence: 2,
      setsFlagsOnComplete: ["dlc_chapter_dlc_advocate_b_complete"],
    };
    const reg = [b, a];
    const out = reg
      .filter((c) => sameParentSection(c.parentSection, { kind: "advocate_arc" }))
      .slice()
      .sort((x, y) => x.sequence - y.sequence);
    expect(out.map((c) => c.id)).toEqual(["dlc_advocate_a", "dlc_advocate_b"]);
  });
});
