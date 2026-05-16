/* ═══════════════════════════════════════════════════════
   ACT-CLOSE CHAPTER CUTSCENE CANON — integrity tests (PR-20)

   Proves:
   - 7 entries, acts {1..7} once each, in order
   - the parity gate passes (hard)
   - each close resolves its delivery runtime (Antiquarian
     bridge) and its prophecyTarot binding
   - the two Comings are canon-pinned: FIRST on Act 4
     (Necromancer = halfway), FINAL on Act 7 (Politician =
     endgame) igniting the continuing loop
   - the pure resolver mirrors the bridge-overlay contract
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  ACT_CLOSE_ENTRIES,
  getActCloseEntry,
  pendingActClose,
} from "./actCloseCutsceneCanon";
import { getAntiquarianBridge } from "./antiquarianLoredexBridges";
import { getProphecyTarotAct } from "./prophecyTarotCanon";
import { checkActCloseCutsceneCoverage } from "./_completeness/checks/actCloseCutsceneCoverage";

describe("act-close chapter cutscene canon", () => {
  it("has 7 entries, acts 1..7 in order", () => {
    expect(ACT_CLOSE_ENTRIES.map((e) => e.act)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("the parity gate passes (hard)", () => {
    const r = checkActCloseCutsceneCoverage();
    expect(r.missing).toEqual([]);
    expect(r.implemented).toBe(r.declared);
  });

  it("every close resolves its Antiquarian bridge + prophecyTarot binding", () => {
    for (const e of ACT_CLOSE_ENTRIES) {
      expect(
        getAntiquarianBridge(e.antiquarianBridgeId),
        `act ${e.act} bridge`,
      ).toBeDefined();
      expect(getProphecyTarotAct(e.act), `act ${e.act} prophecyTarot`).toBeDefined();
      expect(e.triggerFlag).toBe(`act_${e.act}_complete`);
    }
  });

  it("the FIRST Coming is the Necromancer on Act 4 (halfway)", () => {
    const a4 = getActCloseEntry(4);
    expect(a4?.comingStage).toBe("first");
    expect(a4?.ignitesContinuingLoop).toBeUndefined();
  });

  it("the FINAL Coming is the Politician on Act 7 (endgame) and ignites the loop", () => {
    const a7 = getActCloseEntry(7);
    expect(a7?.comingStage).toBe("final");
    expect(a7?.ignitesContinuingLoop).toBe(true);
  });

  it("no act other than 4 and 7 carries a Coming", () => {
    for (const e of ACT_CLOSE_ENTRIES) {
      if (e.act !== 4 && e.act !== 7) {
        expect(e.comingStage, `act ${e.act}`).toBeUndefined();
      }
    }
  });

  describe("pendingActClose", () => {
    it("returns null when nothing has triggered", () => {
      expect(pendingActClose(new Set())).toBeNull();
    });

    it("returns the first triggered-but-unseen close in act order", () => {
      const flags = new Set(["act_1_complete", "act_2_complete"]);
      expect(pendingActClose(flags)?.act).toBe(1);
    });

    it("skips a close whose bridge seen-flag is set", () => {
      const flags = new Set([
        "act_1_complete",
        "antiq_bridge_act_1_close_seen",
        "act_2_complete",
      ]);
      expect(pendingActClose(flags)?.act).toBe(2);
    });
  });
});
