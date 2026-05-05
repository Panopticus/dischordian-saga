import { describe, it, expect } from "vitest";

import {
  nextAntiquarianMalkiaStage,
  resolveAntiquarianMalkiaStage,
} from "./antiquarianMalkiaRevealStage";

describe("resolveAntiquarianMalkiaStage", () => {
  it("defaults to unrelated before act 4", () => {
    expect(resolveAntiquarianMalkiaStage({ flags: new Set(), act: 3 })).toBe(
      "unrelated",
    );
  });

  it("advances to resonance at act 4 by default", () => {
    expect(resolveAntiquarianMalkiaStage({ flags: new Set(), act: 4 })).toBe(
      "resonance",
    );
  });

  it("explicit phrase-echo flag advances early", () => {
    expect(
      resolveAntiquarianMalkiaStage({
        flags: new Set(["act4_malkia_phrase_echo"]),
        act: 3,
      }),
    ).toBe("resonance");
  });

  it("paired flag overrides resonance", () => {
    expect(
      resolveAntiquarianMalkiaStage({
        flags: new Set(["act5_antiquarian_malkia_paired"]),
        act: 5,
      }),
    ).toBe("paired");
  });

  it("two_halves reveal is final and reachable through the questline path", () => {
    expect(
      resolveAntiquarianMalkiaStage({
        flags: new Set(["malkia_revolution_questline_complete"]),
        act: 6,
      }),
    ).toBe("two_halves");
  });

  it("two_halves is also reachable via the Act 6 reveal flag", () => {
    expect(
      resolveAntiquarianMalkiaStage({
        flags: new Set(["act6_antiquarian_malkia_revealed"]),
        act: 6,
      }),
    ).toBe("two_halves");
  });
});

describe("nextAntiquarianMalkiaStage", () => {
  it("returns the canonical advancement chain", () => {
    expect(nextAntiquarianMalkiaStage("unrelated")?.nextStage).toBe(
      "resonance",
    );
    expect(nextAntiquarianMalkiaStage("resonance")?.nextStage).toBe("paired");
    expect(nextAntiquarianMalkiaStage("paired")?.nextStage).toBe("two_halves");
    expect(nextAntiquarianMalkiaStage("two_halves")).toBeNull();
  });
});
