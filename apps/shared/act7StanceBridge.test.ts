/**
 * Act 7 final-stance bridge test.
 *
 * Unlike Act 6, the Act 7 completion gate does NOT require a stance flag
 * for `act_7_complete` to fire — canon (per `act7CompletionGate.ts` §32)
 * is explicit that "silence is itself a stance." But the four canonical
 * stance flags exist (ACT_7_FINAL_STANCE_FLAGS) and feed downstream
 * surfaces (companion lines, prestige carryover narration, the Hub
 * Act-7 panel's "Final stance taken" check). Before this bridge nothing
 * wrote them, and the Hub had no way to indicate "silence chosen" vs
 * "stance not yet offered."
 *
 * Source-scan structural test: enforces Act7CardLadderPage offers the
 * four canonical stances AND a fifth "silence" path that raises a
 * dedicated `act7_silence_stance` flag.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { ACT_7_FINAL_STANCE_FLAGS } from "./act7CompletionGate";

const pageSrc = fs.readFileSync(
  path.resolve(__dirname, "../client/src/pages/Act7CardLadderPage.tsx"),
  "utf-8",
);

describe("Act 7 ladder — final-stance picker bridge", () => {
  it("references every canonical stance flag", () => {
    for (const flag of ACT_7_FINAL_STANCE_FLAGS) {
      expect(pageSrc).toContain(flag);
    }
  });

  it("offers an explicit silence option that raises act7_silence_stance", () => {
    // Canon: silence is itself a stance. The picker must let the player
    // refuse without bouncing them back to the ladder uncommitted.
    expect(pageSrc).toContain("act7_silence_stance");
    expect(pageSrc).toMatch(/handleSilenceChosen|silence/);
  });

  it("writes a meta act7_stance_chosen flag for Hub display", () => {
    // The Hub panel can't OR over five flags from a single check row,
    // so the bridge raises a single meta-flag whenever ANY stance
    // (including silence) is picked.
    expect(pageSrc).toContain("act7_stance_chosen");
  });

  it("transitions to the stance view after the saga-final win", () => {
    // Phase-9 rename: act7_the_convergence_seat → act7_oracle_meme_final.
    expect(pageSrc).toMatch(/act7_oracle_meme_final/);
    expect(pageSrc).toMatch(/setView\("stance"\)/);
  });

  it("renders a fallback stance-picker CTA from the ladder-complete banner", () => {
    expect(pageSrc).toMatch(/anyStanceTaken/);
  });
});
