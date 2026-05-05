import { describe, expect, it } from "vitest";
import { applyCorruption, getSecondChairAdvice } from "../selector";
import type { SecondChairAdviceContext } from "../types";

function ctx(overrides: Partial<SecondChairAdviceContext> = {}): SecondChairAdviceContext {
  return {
    missionId: "m-1",
    archetype: "skirmish",
    reconstructionConfidence: 0.5,
    revealStage: "engineer_zero_hint",
    vexBondTier: 2,
    ...overrides,
  };
}

describe("getSecondChairAdvice — determinism", () => {
  it("returns the same advice for the same context", () => {
    const a = getSecondChairAdvice(ctx());
    const b = getSecondChairAdvice(ctx());
    expect(a).toEqual(b);
  });

  it("changes the picked fragment when the missionId changes", () => {
    const a = getSecondChairAdvice(ctx({ missionId: "alpha" }));
    const b = getSecondChairAdvice(ctx({ missionId: "alpha-prime" }));
    // Not strictly required to differ, but the hash should split
    // common ids; assert at least one of fragmentId / hauntedness
    // changed across a wide spread of inputs.
    const ids = new Set<string>();
    for (let i = 0; i < 20; i++) {
      ids.add(getSecondChairAdvice(ctx({ missionId: `m-${i}` })).fragmentId);
    }
    expect(ids.size).toBeGreaterThan(1);
    // Smoke: the two specific picks above are valid.
    expect(a.fragmentId).toBeTruthy();
    expect(b.fragmentId).toBeTruthy();
  });
});

describe("getSecondChairAdvice — vexAware gating", () => {
  it("never returns a vexAware fragment below confirmed reveal", () => {
    for (const stage of ["vex_public", "engineer_zero_hint"] as const) {
      for (const bond of [0, 1, 2, 3, 4] as const) {
        for (let i = 0; i < 50; i++) {
          const advice = getSecondChairAdvice(
            ctx({ missionId: `m-${i}`, revealStage: stage, vexBondTier: bond }),
          );
          expect(advice.isVexAware).toBe(false);
        }
      }
    }
  });

  it("never returns a vexAware fragment at confirmed but bondTier < 3", () => {
    for (let bond = 0; bond <= 2; bond++) {
      for (let i = 0; i < 50; i++) {
        const advice = getSecondChairAdvice(
          ctx({
            missionId: `m-${i}`,
            revealStage: "engineer_zero_confirmed",
            vexBondTier: bond as 0 | 1 | 2,
          }),
        );
        expect(advice.isVexAware).toBe(false);
      }
    }
  });

  it("can return vexAware fragments at confirmed + bondTier >= 3", () => {
    let sawVexAware = false;
    for (let i = 0; i < 200; i++) {
      const advice = getSecondChairAdvice(
        ctx({
          missionId: `m-${i}`,
          revealStage: "engineer_zero_confirmed",
          vexBondTier: 4,
        }),
      );
      if (advice.isVexAware) {
        sawVexAware = true;
        break;
      }
    }
    expect(sawVexAware).toBe(true);
  });
});

describe("getSecondChairAdvice — hauntedness", () => {
  it("clamps to [0, 1]", () => {
    for (const conf of [-1, 0, 0.5, 1, 2]) {
      const advice = getSecondChairAdvice(ctx({ reconstructionConfidence: conf }));
      expect(advice.hauntedness).toBeGreaterThanOrEqual(0);
      expect(advice.hauntedness).toBeLessThanOrEqual(1);
    }
  });

  it("is higher at vex_public than at engineer_zero_confirmed for matching confidence", () => {
    const high = getSecondChairAdvice(
      ctx({ reconstructionConfidence: 0.4, revealStage: "vex_public" }),
    );
    const low = getSecondChairAdvice(
      ctx({
        reconstructionConfidence: 0.4,
        revealStage: "engineer_zero_confirmed",
        vexBondTier: 4,
      }),
    );
    expect(high.hauntedness).toBeGreaterThan(low.hauntedness);
  });
});

describe("applyCorruption", () => {
  it("returns clean text below the corruption floor", () => {
    expect(applyCorruption("Hello world.", "stutter", 0.1)).toBe("Hello world.");
    expect(applyCorruption("Hello world.", "fade", 0)).toBe("Hello world.");
  });

  it("stutters when intensity is above the floor", () => {
    const out = applyCorruption("The seam holds.", "stutter", 0.5);
    expect(out).not.toBe("The seam holds.");
    expect(out).toContain("The");
  });

  it("fades by inserting an elision marker", () => {
    const out = applyCorruption(
      "The corridor smells of new solder, the panel was opened tonight.",
      "fade",
      0.6,
    );
    expect(out).toContain("[…]");
  });

  it("loops when asked", () => {
    const out = applyCorruption(
      "Two-stage trigger. Pull halfway. Wait.",
      "loop",
      0.8,
    );
    expect(out).toContain("Pardon");
    expect(out).toContain("Drift");
  });

  it("interrupts cleanly", () => {
    const out = applyCorruption(
      "An apology is a load-bearing wall. Don't put one in the middle of an argument.",
      "interrupt",
      0.7,
    );
    expect(out).toContain("— no. The next one.");
  });

  it("never returns empty for non-empty input above the floor", () => {
    const patterns = ["stutter", "fade", "loop", "interrupt", "none"] as const;
    for (const p of patterns) {
      const out = applyCorruption("Speech is a low-bandwidth channel.", p, 0.7);
      expect(out.length).toBeGreaterThan(0);
    }
  });
});
