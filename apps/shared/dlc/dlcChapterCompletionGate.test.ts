import { describe, expect, it } from "vitest";
import {
  deriveDlcChapterStatus,
  getAvailableDlcChapters,
  isPrerequisiteMet,
} from "./dlcChapterCompletionGate";
import { dlcChapterCompletionFlag } from "./dlcChapterRegistry";
import type { DlcChapter, DlcPrerequisite } from "./types";

const advocateChapter: DlcChapter = {
  id: "dlc_advocate_01_sacrum_echo",
  title: "Sacrum Echo",
  synopsis: "First fragment of the Sacrum surfaces in Act 3.",
  parentSection: { kind: "advocate_arc" },
  sequence: 1,
  prerequisites: [
    { kind: "act_completion", act: 2 },
    { kind: "flag", flag: "authority_trial_complete" },
  ],
  steps: [],
  rewards: { xp: 50, soulBoundDream: 5 },
  setsFlagsOnComplete: [
    "dlc_chapter_dlc_advocate_01_sacrum_echo_complete",
    "advocate_sacrum_fragment_collected",
  ],
};

const chainedChapter: DlcChapter = {
  id: "dlc_advocate_02_blood_weave",
  title: "Blood Weave",
  synopsis: "",
  parentSection: { kind: "advocate_arc" },
  sequence: 2,
  prerequisites: [
    {
      kind: "dlc_chapter_completion",
      chapterId: "dlc_advocate_01_sacrum_echo",
    },
  ],
  steps: [],
  rewards: {},
  setsFlagsOnComplete: ["dlc_chapter_dlc_advocate_02_blood_weave_complete"],
};

describe("isPrerequisiteMet", () => {
  it("flag prerequisite reads truthy values from the flag bag", () => {
    const p: DlcPrerequisite = { kind: "flag", flag: "x" };
    expect(isPrerequisiteMet(p, { flags: { x: true }, entitlements: {} })).toBe(true);
    expect(isPrerequisiteMet(p, { flags: { x: 1 }, entitlements: {} })).toBe(true);
    expect(isPrerequisiteMet(p, { flags: {}, entitlements: {} })).toBe(false);
    expect(isPrerequisiteMet(p, { flags: { x: false }, entitlements: {} })).toBe(false);
  });

  it("act_completion reads act_<N>_complete", () => {
    const p: DlcPrerequisite = { kind: "act_completion", act: 3 };
    expect(
      isPrerequisiteMet(p, { flags: { act_3_complete: true }, entitlements: {} }),
    ).toBe(true);
    expect(
      isPrerequisiteMet(p, { flags: { act_2_complete: true }, entitlements: {} }),
    ).toBe(false);
  });

  it("secret reads act_<N>_secret_revealed", () => {
    const p: DlcPrerequisite = { kind: "secret", act: 4 };
    expect(
      isPrerequisiteMet(p, {
        flags: { act_4_secret_revealed: true },
        entitlements: {},
      }),
    ).toBe(true);
  });

  it("dlc_chapter_completion reads the canonical flag", () => {
    const p: DlcPrerequisite = {
      kind: "dlc_chapter_completion",
      chapterId: "dlc_advocate_01_sacrum_echo",
    };
    expect(
      isPrerequisiteMet(p, {
        flags: {
          [dlcChapterCompletionFlag("dlc_advocate_01_sacrum_echo")]: true,
        },
        entitlements: {},
      }),
    ).toBe(true);
  });

  it("entitlement reads from the entitlement bag, not flags", () => {
    const p: DlcPrerequisite = { kind: "entitlement", key: "foundingAuthor" };
    expect(
      isPrerequisiteMet(p, {
        flags: {},
        entitlements: { foundingAuthor: true },
      }),
    ).toBe(true);
    expect(
      isPrerequisiteMet(p, {
        flags: { foundingAuthor: true },
        entitlements: {},
      }),
    ).toBe(false);
  });
});

describe("deriveDlcChapterStatus", () => {
  it("blocked when no prerequisites are met", () => {
    const status = deriveDlcChapterStatus({
      chapter: advocateChapter,
      flags: {},
      entitlements: {},
    });
    expect(status.available).toBe(false);
    expect(status.alreadyComplete).toBe(false);
    expect(status.missingPrerequisites).toHaveLength(2);
  });

  it("available when all prerequisites are met", () => {
    const status = deriveDlcChapterStatus({
      chapter: advocateChapter,
      flags: { act_2_complete: true, authority_trial_complete: true },
      entitlements: {},
    });
    expect(status.available).toBe(true);
    expect(status.alreadyComplete).toBe(false);
    expect(status.missingPrerequisites).toEqual([]);
  });

  it("partial — surfaces only the unmet prerequisites", () => {
    const status = deriveDlcChapterStatus({
      chapter: advocateChapter,
      flags: { act_2_complete: true },
      entitlements: {},
    });
    expect(status.available).toBe(false);
    expect(status.missingPrerequisites).toEqual([
      { kind: "flag", flag: "authority_trial_complete" },
    ]);
  });

  it("alreadyComplete reads dlc_chapter_<id>_complete", () => {
    const status = deriveDlcChapterStatus({
      chapter: advocateChapter,
      flags: {
        act_2_complete: true,
        authority_trial_complete: true,
        [dlcChapterCompletionFlag(advocateChapter.id)]: true,
      },
      entitlements: {},
    });
    expect(status.available).toBe(true);
    expect(status.alreadyComplete).toBe(true);
  });

  it("dlc_chapter_completion prerequisite chains chapters", () => {
    const blocked = deriveDlcChapterStatus({
      chapter: chainedChapter,
      flags: {},
      entitlements: {},
    });
    expect(blocked.available).toBe(false);
    const unlocked = deriveDlcChapterStatus({
      chapter: chainedChapter,
      flags: {
        [dlcChapterCompletionFlag("dlc_advocate_01_sacrum_echo")]: true,
      },
      entitlements: {},
    });
    expect(unlocked.available).toBe(true);
  });
});

describe("getAvailableDlcChapters", () => {
  it("returns only chapters that are available AND not yet complete", () => {
    const flags = {
      act_2_complete: true,
      authority_trial_complete: true,
      [dlcChapterCompletionFlag("dlc_advocate_01_sacrum_echo")]: true,
    };
    const chapters = [advocateChapter, chainedChapter];
    const out = getAvailableDlcChapters(chapters, flags, {});
    // advocateChapter is complete — excluded. chainedChapter unlocks
    // because of the chain prerequisite.
    expect(out.map((c) => c.id)).toEqual([
      "dlc_advocate_02_blood_weave",
    ]);
  });
});
