import { describe, it, expect, beforeEach } from "vitest";
import {
  getAct7LadderSnapshot,
  isAct7LadderComplete,
  peekAct7NextOpponent,
  useAct7LadderStore,
} from "./act7CardLadderStore";
import { ACT_7_OPPONENTS } from "@shared/acts2to7Opponents";

describe("act7CardLadderStore", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("loredex-act7-ladder");
    }
    useAct7LadderStore.getState().reset();
  });

  it("starts at the Visible War with zero wins", () => {
    expect(getAct7LadderSnapshot().wins).toBe(0);
    expect(peekAct7NextOpponent()?.id).toBe("act7_the_visible_war");
  });

  it("advances through all four finale matches in order", () => {
    for (const opp of ACT_7_OPPONENTS) {
      expect(peekAct7NextOpponent()?.id).toBe(opp.id);
      useAct7LadderStore.getState().recordWin(opp.id);
    }
    expect(isAct7LadderComplete()).toBe(true);
    expect(peekAct7NextOpponent()).toBeNull();
  });

  it("does not advance on out-of-order wins", () => {
    const seat = ACT_7_OPPONENTS.find(
      (o) => o.id === "act7_the_convergence_seat",
    )!;
    useAct7LadderStore.getState().recordWin(seat.id);
    expect(getAct7LadderSnapshot().wins).toBe(0);
  });

  it("records losses without advancing", () => {
    const first = peekAct7NextOpponent();
    useAct7LadderStore.getState().recordLoss(first!.id);
    expect(getAct7LadderSnapshot().wins).toBe(0);
    expect(getAct7LadderSnapshot().losses).toBe(1);
  });

  it("reset clears progression and last-battle markers", () => {
    useAct7LadderStore.getState().recordWin(ACT_7_OPPONENTS[0].id);
    useAct7LadderStore.getState().reset();
    expect(getAct7LadderSnapshot().wins).toBe(0);
    expect(getAct7LadderSnapshot().lastBattleOpponentId).toBeNull();
  });
});
