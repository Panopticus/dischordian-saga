import { describe, expect, it } from "vitest";
import {
  ALL_DLC_CHAPTERS,
  dlcChapterCompletionFlag,
  getDlcChapter,
  getDlcChaptersForSection,
  isDlcStepVisible,
  sameParentSection,
  visibleDlcChapterSteps,
} from "./dlcChapterRegistry";
import type { DlcChapter, DlcParentSection } from "./types";

/** Every flag any choice in the chapter can set. */
function choiceFlags(chapter: DlcChapter): Set<string> {
  const out = new Set<string>();
  for (const step of chapter.steps) {
    if (step.kind === "choice") {
      for (const o of step.options) if (o.setFlag) out.add(o.setFlag);
    }
  }
  return out;
}

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
    // SiH per-track surface — no DLC chapters bound to individual tracks
    // (the show wires through AlbumPage, not the DLC system).
    expect(
      getDlcChaptersForSection({ kind: "silence_in_heaven", trackNumber: 12 }),
    ).toEqual([]);
  });

  it("endgame surface holds the Y1Q–Y2Q1 quarterly mini-DLCs", () => {
    // Producer 2026-05-10 drop landed 5 quarterly chapters under the
    // shared endgame parentSection. They sort by their year×10+quarter
    // sequence so chronological order is preserved.
    const chapters = getDlcChaptersForSection({ kind: "endgame" });
    expect(chapters.map((c) => c.id)).toEqual([
      "dlc_y1q1_first_charter",
      "dlc_y1q2_pale_inheritance",
      "dlc_y1q3_curriculum_crisis",
      "dlc_y1q4_witness_plaza",
      "dlc_y2q1_charter_schism",
    ]);
  });

  it("dlcChapterCompletionFlag derives the canonical flag name", () => {
    expect(dlcChapterCompletionFlag("dlc_advocate_01_sacrum_echo")).toBe(
      "dlc_chapter_dlc_advocate_01_sacrum_echo_complete",
    );
  });
});

describe("DLC step reactive-visibility", () => {
  it("isDlcStepVisible honors requiresFlag / requiresAbsentFlag", () => {
    const gated = {
      kind: "narration",
      id: "g",
      speaker: "x",
      text: "t",
      requiresFlag: "f",
    } as const;
    expect(isDlcStepVisible(gated, {})).toBe(false);
    expect(isDlcStepVisible(gated, { f: true })).toBe(true);

    const absent = {
      kind: "narration",
      id: "a",
      speaker: "x",
      text: "t",
      requiresAbsentFlag: "f",
    } as const;
    expect(isDlcStepVisible(absent, {})).toBe(true);
    expect(isDlcStepVisible(absent, { f: true })).toBe(false);

    const ungated = { kind: "narration", id: "u", speaker: "x", text: "t" } as const;
    expect(isDlcStepVisible(ungated, {})).toBe(true);
    // Non-narration steps are never gated.
    const choice = {
      kind: "choice",
      id: "c",
      speaker: "x",
      prompt: "p",
      options: [],
    } as const;
    expect(isDlcStepVisible(choice, {})).toBe(true);
  });

  it("every narration gate references a flag a choice in the same chapter can set (no dangling gate)", () => {
    for (const chapter of ALL_DLC_CHAPTERS) {
      const settable = choiceFlags(chapter);
      for (const step of chapter.steps) {
        if (step.kind !== "narration") continue;
        for (const f of [step.requiresFlag, step.requiresAbsentFlag]) {
          if (!f) continue;
          expect(
            settable.has(f),
            `${chapter.id}: step ${step.id} gates on "${f}" but no choice in the chapter sets it`,
          ).toBe(true);
        }
      }
    }
  });

  it("every choice path with a setFlag has a reactive aftermath beat, and picking it reveals exactly that beat", () => {
    for (const chapter of ALL_DLC_CHAPTERS) {
      // Map each settable flag to the narration steps that require it.
      const gatedByFlag = new Map<string, string[]>();
      for (const step of chapter.steps) {
        if (step.kind === "narration" && step.requiresFlag) {
          const arr = gatedByFlag.get(step.requiresFlag) ?? [];
          arr.push(step.id);
          gatedByFlag.set(step.requiresFlag, arr);
        }
      }
      // Chapters that author NO reactive beats are unaffected (legacy
      // linear chapters). Only assert the property for chapters that
      // opted into reactivity.
      if (gatedByFlag.size === 0) continue;

      for (const flag of choiceFlags(chapter)) {
        expect(
          gatedByFlag.has(flag),
          `${chapter.id}: choice flag "${flag}" has no reactive aftermath narration`,
        ).toBe(true);
        // Selecting this path: the visible step list must include the
        // beat(s) for this flag and none gated on a sibling flag.
        const visible = visibleDlcChapterSteps(chapter, { [flag]: true });
        const visibleIds = new Set(visible.map((s) => s.id));
        for (const id of gatedByFlag.get(flag)!) {
          expect(visibleIds.has(id)).toBe(true);
        }
        for (const [otherFlag, ids] of gatedByFlag) {
          if (otherFlag === flag) continue;
          for (const id of ids) expect(visibleIds.has(id)).toBe(false);
        }
      }
    }
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
        { kind: "epoch_witness", epoch: "age_of_insurgency", archetype: "the_witness" },
        { kind: "epoch_witness", epoch: "age_of_insurgency", archetype: "the_witness" },
      ),
    ).toBe(true);
    expect(
      sameParentSection(
        { kind: "epoch_witness", epoch: "age_of_insurgency", archetype: "the_witness" },
        { kind: "epoch_witness", epoch: "age_of_insurgency", archetype: "the_advocate" },
      ),
    ).toBe(false);
    expect(
      sameParentSection(
        { kind: "epoch_witness", epoch: "age_of_insurgency" },
        { kind: "epoch_witness", epoch: "age_of_revelation" },
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
