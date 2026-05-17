/* ═══════════════════════════════════════════════════════
   THE COMING — two-stage canon binding tests (PR-21)

   Proves the keystone binding is coherent: exactly two
   stages, the parity gate passes, and each stage's cited
   anchors resolve (necromancer/politician arcs, saga phases,
   Archon #7, the resurrection meter, the PR-16 loop, and the
   PR-20 act-close Comings).
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import { THE_COMING, getComingStage } from "./theComingCanon";
import { getActCloseEntry } from "./actCloseCutsceneCanon";
import { getArchonByPosition } from "./archonCanon";
import { checkTheComingCoverage } from "./_completeness/checks/theComingCoverage";

describe("the Coming — two-stage canon", () => {
  it("has exactly two stages: first (halfway) and final (endgame)", () => {
    expect(THE_COMING.map((c) => c.id)).toEqual([
      "first_coming",
      "final_coming",
    ]);
    expect(getComingStage("first_coming")?.role).toBe("halfway");
    expect(getComingStage("final_coming")?.role).toBe("endgame");
  });

  it("the parity gate passes (hard)", () => {
    const r = checkTheComingCoverage();
    expect(r.missing).toEqual([]);
    expect(r.implemented).toBe(r.declared);
  });

  it("FIRST Coming = Necromancer, Act 4, phase 7 (the halfway mark)", () => {
    const f = getComingStage("first_coming")!;
    expect(f.whoReturns).toBe("The Necromancer");
    expect(f.act).toBe(4);
    expect(f.sagaPhase).toBe(7);
    expect(getActCloseEntry(4)?.comingStage).toBe("first");
  });

  it("FINAL Coming = Politician, Act 7, phase 13, ignites the loop", () => {
    const fin = getComingStage("final_coming")!;
    expect(fin.whoReturns).toBe("The Politician");
    expect(fin.act).toBe(7);
    expect(fin.sagaPhase).toBe(13);
    const a7 = getActCloseEntry(7);
    expect(a7?.comingStage).toBe("final");
    expect(a7?.ignitesContinuingLoop).toBe(true);
  });

  it("the Politician is Archon position #7", () => {
    expect(getArchonByPosition(7)?.name).toMatch(/Politician/i);
  });
});
