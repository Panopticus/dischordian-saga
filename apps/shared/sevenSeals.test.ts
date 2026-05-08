import { describe, it, expect } from "vitest";
import {
  SEVEN_SEALS,
  resolveSealPhase,
  latestBrokenSeal,
  isSealBroken,
} from "./sevenSeals";

describe("SEVEN_SEALS", () => {
  it("has exactly seven entries, one per act", () => {
    expect(SEVEN_SEALS.length).toBe(7);
    for (let n = 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7; n <= 7; n++) {
      expect(SEVEN_SEALS[n - 1].num).toBe(n);
      expect(SEVEN_SEALS[n - 1].act).toBe(n);
    }
  });

  it("seals I–IV bind to the four horsemen in order", () => {
    expect(SEVEN_SEALS[0].horseman).toBe("conquest");
    expect(SEVEN_SEALS[1].horseman).toBe("war");
    expect(SEVEN_SEALS[2].horseman).toBe("famine");
    expect(SEVEN_SEALS[3].horseman).toBe("death");
  });

  it("seals V–VII have no single-horseman binding", () => {
    expect(SEVEN_SEALS[4].horseman).toBeNull();
    expect(SEVEN_SEALS[5].horseman).toBeNull();
    expect(SEVEN_SEALS[6].horseman).toBeNull();
  });

  it("seal IV unlocks Severance; seal V unlocks Memorial Day", () => {
    expect(SEVEN_SEALS[3].unlocksYearly).toBe("severance");
    expect(SEVEN_SEALS[4].unlocksYearly).toBe("memorial_day");
  });

  it("every fallSummary is non-empty (writers fill prose elsewhere)", () => {
    for (const s of SEVEN_SEALS) {
      expect(s.fallSummary.length).toBeGreaterThan(10);
    }
  });
});

describe("resolveSealPhase", () => {
  it("act not started → sealed", () => {
    expect(
      resolveSealPhase({ actStarted: false, actComplete: false }),
    ).toBe("sealed");
  });
  it("act started but not complete → breaking", () => {
    expect(
      resolveSealPhase({ actStarted: true, actComplete: false }),
    ).toBe("breaking");
  });
  it("act complete → broken", () => {
    expect(resolveSealPhase({ actStarted: true, actComplete: true })).toBe(
      "broken",
    );
  });
});

describe("latestBrokenSeal", () => {
  it("returns null with no completes", () => {
    expect(
      latestBrokenSeal([
        { act: 1, complete: false },
        { act: 2, complete: false },
      ]),
    ).toBeNull();
  });
  it("returns the highest-numbered completed act", () => {
    expect(
      latestBrokenSeal([
        { act: 1, complete: true },
        { act: 2, complete: true },
        { act: 3, complete: false },
      ]),
    ).toBe(2);
  });
  it("ignores order and finds the max", () => {
    expect(
      latestBrokenSeal([
        { act: 5, complete: true },
        { act: 1, complete: true },
        { act: 3, complete: true },
      ]),
    ).toBe(5);
  });
});

describe("isSealBroken", () => {
  it("matches by act number + completion", () => {
    const flags = [
      { act: 1, complete: true },
      { act: 4, complete: true },
    ] as const;
    expect(isSealBroken(1, flags)).toBe(true);
    expect(isSealBroken(4, flags)).toBe(true);
    expect(isSealBroken(2, flags)).toBe(false);
    expect(isSealBroken(7, flags)).toBe(false);
  });
});
