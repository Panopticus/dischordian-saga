import { describe, expect, it } from "vitest";

import { pickWinningOption } from "./mysteryClosureCron";

/* ═══════════════════════════════════════════════════════
   mysteryClosureCron.test.ts — pure tie-break probes

   pickWinningOption is the load-bearing pure function on
   the cron path. The DB-touching parts (runMysteryClosure,
   closeVoteNow) get integration coverage in a later pass.
   ═══════════════════════════════════════════════════════ */

function tally(a: number, b: number, c: number, d: number, e: number) {
  return {
    optionACount: a,
    optionBCount: b,
    optionCCount: c,
    optionDCount: d,
    optionECount: e,
  };
}

describe("pickWinningOption", () => {
  it("returns the option with the largest count", () => {
    expect(pickWinningOption(tally(0, 5, 0, 0, 0))).toBe("b");
    expect(pickWinningOption(tally(0, 0, 0, 0, 9))).toBe("e");
    expect(pickWinningOption(tally(2, 3, 7, 1, 0))).toBe("c");
  });

  it("breaks ties alphabetically (A > B > C > D > E)", () => {
    expect(pickWinningOption(tally(5, 5, 0, 0, 0))).toBe("a");
    expect(pickWinningOption(tally(0, 5, 5, 0, 0))).toBe("b");
    expect(pickWinningOption(tally(5, 5, 5, 5, 5))).toBe("a");
  });

  it("zero turnout defaults to 'a' (Chronicle always records canon)", () => {
    expect(pickWinningOption(tally(0, 0, 0, 0, 0))).toBe("a");
  });

  it("is deterministic — same input always returns the same winner", () => {
    const t = tally(3, 7, 7, 2, 1);
    const a = pickWinningOption(t);
    const b = pickWinningOption(t);
    const c = pickWinningOption(t);
    expect(a).toBe(b);
    expect(b).toBe(c);
    expect(a).toBe("b");
  });
});
