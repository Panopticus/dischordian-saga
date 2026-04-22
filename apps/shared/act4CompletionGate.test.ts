import { describe, it, expect } from "vitest";
import {
  ACT_4_PATH_FLAGS,
  ACT_4_PRISONER_CHAPTER_FLAGS,
  ACT_4_COMPLETION_REQUIRED_FLAGS,
  deriveAct4CompletionStatus,
  isAct4Complete,
} from "./act4CompletionGate";

const REQUIRED_AND_PATH = {
  slideshow_act_4_revelation_intro_complete: true,
  act1_path_A: true,
};
const ONE_CHAPTER = {
  act4_prisoner_cell_complete: true,
};

describe("deriveAct4CompletionStatus — baseline", () => {
  it("reports nothing met on empty flags", () => {
    const s = deriveAct4CompletionStatus({ narrativeAct: 4, flags: {} });
    expect(s.requiredMet).toBe(0);
    expect(s.activePathFlag).toBeNull();
    expect(s.chaptersCleared).toEqual([]);
    expect(s.readyToFire).toBe(false);
  });

  it("tolerates undefined inputs", () => {
    const s = deriveAct4CompletionStatus({
      narrativeAct: undefined,
      flags: undefined,
    });
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct4CompletionStatus — readyToFire", () => {
  it("fires when slideshow + path + one chapter + Act 4", () => {
    const s = deriveAct4CompletionStatus({
      narrativeAct: 4,
      flags: { ...REQUIRED_AND_PATH, ...ONE_CHAPTER },
    });
    expect(s.allConditionsMet).toBe(true);
    expect(s.readyToFire).toBe(true);
    expect(s.activePathFlag).toBe("act1_path_A");
    expect(s.primaryChapter).toBe("act4_prisoner_cell_complete");
  });

  it("does NOT fire when narrativeAct < 4", () => {
    const s = deriveAct4CompletionStatus({
      narrativeAct: 3,
      flags: { ...REQUIRED_AND_PATH, ...ONE_CHAPTER },
    });
    expect(s.allConditionsMet).toBe(true);
    expect(s.readyToFire).toBe(false);
  });

  it("does NOT re-fire once act_4_complete is set", () => {
    const s = deriveAct4CompletionStatus({
      narrativeAct: 4,
      flags: { ...REQUIRED_AND_PATH, ...ONE_CHAPTER, act_4_complete: true },
    });
    expect(s.alreadyComplete).toBe(true);
    expect(s.readyToFire).toBe(false);
  });
});

describe("deriveAct4CompletionStatus — required flag gating", () => {
  for (const flag of ACT_4_COMPLETION_REQUIRED_FLAGS) {
    it(`does NOT fire when ${flag} is missing`, () => {
      const partial = { ...REQUIRED_AND_PATH, ...ONE_CHAPTER, [flag]: false };
      const s = deriveAct4CompletionStatus({
        narrativeAct: 4,
        flags: partial,
      });
      expect(s.requiredFlagStatus[flag]).toBe(false);
      expect(s.readyToFire).toBe(false);
    });
  }
});

describe("deriveAct4CompletionStatus — path flag disjunction", () => {
  it("does NOT fire with slideshow + chapter but no path flag raised", () => {
    const flags = {
      slideshow_act_4_revelation_intro_complete: true,
      ...ONE_CHAPTER,
    };
    const s = deriveAct4CompletionStatus({ narrativeAct: 4, flags });
    expect(s.activePathFlag).toBeNull();
    expect(s.readyToFire).toBe(false);
  });

  for (const pathFlag of ACT_4_PATH_FLAGS) {
    it(`fires when ${pathFlag} is the only path raised`, () => {
      const flags = {
        slideshow_act_4_revelation_intro_complete: true,
        [pathFlag]: true,
        ...ONE_CHAPTER,
      };
      const s = deriveAct4CompletionStatus({ narrativeAct: 4, flags });
      expect(s.activePathFlag).toBe(pathFlag);
      expect(s.readyToFire).toBe(true);
    });
  }

  it("activePathFlag reports the canonical-order first raised path", () => {
    // All three raised together — canonical order is [act1_path_A, partial, secret].
    const flags = {
      slideshow_act_4_revelation_intro_complete: true,
      act3_full_secret: true,
      act3_partial_share: true,
      act1_path_A: true,
      ...ONE_CHAPTER,
    };
    const s = deriveAct4CompletionStatus({ narrativeAct: 4, flags });
    expect(s.activePathFlag).toBe("act1_path_A");
  });
});

describe("deriveAct4CompletionStatus — chapter disjunction", () => {
  it("does NOT fire with slideshow + path but no chapter cleared", () => {
    const s = deriveAct4CompletionStatus({
      narrativeAct: 4,
      flags: REQUIRED_AND_PATH,
    });
    expect(s.chaptersCleared).toEqual([]);
    expect(s.readyToFire).toBe(false);
  });

  for (const chapterFlag of ACT_4_PRISONER_CHAPTER_FLAGS) {
    it(`fires when ${chapterFlag} is the only chapter cleared`, () => {
      const s = deriveAct4CompletionStatus({
        narrativeAct: 4,
        flags: { ...REQUIRED_AND_PATH, [chapterFlag]: true },
      });
      expect(s.primaryChapter).toBe(chapterFlag);
      expect(s.chaptersClearedCount).toBe(1);
      expect(s.readyToFire).toBe(true);
    });
  }

  it("primaryChapter reports canonical-order first", () => {
    const s = deriveAct4CompletionStatus({
      narrativeAct: 4,
      flags: {
        ...REQUIRED_AND_PATH,
        act4_prisoner_oracle_complete: true,
        act4_prisoner_cell_complete: true,
      },
    });
    expect(s.primaryChapter).toBe("act4_prisoner_cell_complete");
    expect(s.chaptersClearedCount).toBe(2);
  });
});

describe("isAct4Complete", () => {
  it("reads the completion flag directly", () => {
    expect(isAct4Complete({ act_4_complete: true })).toBe(true);
    expect(isAct4Complete({ act_4_complete: false })).toBe(false);
    expect(isAct4Complete({})).toBe(false);
    expect(isAct4Complete(undefined)).toBe(false);
  });
});
