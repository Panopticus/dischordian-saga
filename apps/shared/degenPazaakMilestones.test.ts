import { describe, expect, it } from "vitest";
import {
  DEGEN_PAZAAK_MILESTONES,
  milestonesCrossed,
} from "./degenPazaakMilestones";

describe("degenPazaakMilestones — threshold ratchets", () => {
  it("declares the three canonical milestones in ascending order", () => {
    expect(DEGEN_PAZAAK_MILESTONES.map((m) => m.wins)).toEqual([1, 5, 10]);
    // Each milestone now carries a flags array — the 5-win milestone
    // lands both the Degen quiet-moment and the Act 4.5 casino-track
    // completion flags in the same tick.
    expect(DEGEN_PAZAAK_MILESTONES.map((m) => m.flags)).toEqual([
      ["degen_pazaak_wins_1"],
      ["degen_pazaak_wins_5", "act_4_5_casino_complete"],
      ["degen_pazaak_wins_10"],
    ]);
  });

  it("returns no flags when the win count is unchanged", () => {
    expect(milestonesCrossed(5, 5)).toEqual([]);
  });

  it("returns no flags on a decrement (one-way ratchet)", () => {
    expect(milestonesCrossed(6, 4)).toEqual([]);
  });

  it("fires the 1-win flag on the first win", () => {
    expect(milestonesCrossed(0, 1)).toEqual(["degen_pazaak_wins_1"]);
  });

  it("does not re-fire a milestone the player has already crossed", () => {
    expect(milestonesCrossed(1, 2)).toEqual([]);
    expect(milestonesCrossed(2, 4)).toEqual([]);
  });

  it("fires both the 5-win flag and Act 4.5 casino completion at 5 wins", () => {
    expect(milestonesCrossed(4, 5)).toEqual([
      "degen_pazaak_wins_5",
      "act_4_5_casino_complete",
    ]);
    expect(milestonesCrossed(5, 6)).toEqual([]);
  });

  it("fires every milestone's flags if a single win crosses more than one threshold", () => {
    // Edge case: a big batch update could vault from 0 → 10.
    expect(milestonesCrossed(0, 10)).toEqual([
      "degen_pazaak_wins_1",
      "degen_pazaak_wins_5",
      "act_4_5_casino_complete",
      "degen_pazaak_wins_10",
    ]);
  });

  it("fires the 10-win flag exactly when the player reaches 10", () => {
    expect(milestonesCrossed(9, 10)).toEqual(["degen_pazaak_wins_10"]);
    expect(milestonesCrossed(10, 11)).toEqual([]);
  });
});
