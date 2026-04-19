import { describe, it, expect, beforeEach } from "vitest";
import {
  getAct3LadderSnapshot,
  isAct3LadderComplete,
  peekAct3NextOpponent,
  useAct3LadderStore,
} from "./act3CardLadderStore";
import { ACT_3_OPPONENTS } from "@shared/acts2to7Opponents";

describe("act3CardLadderStore", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("loredex-act3-ladder");
    }
    useAct3LadderStore.getState().reset();
  });

  it("starts at the first opponent with zero wins", () => {
    const snap = getAct3LadderSnapshot();
    expect(snap.wins).toBe(0);
    expect(snap.losses).toBe(0);
    expect(snap.defeatedOpponents).toEqual([]);
    expect(peekAct3NextOpponent()?.actStep).toBe(1);
  });

  it("advances on a current-step win", () => {
    const first = peekAct3NextOpponent();
    useAct3LadderStore.getState().recordWin(first!.id);
    expect(getAct3LadderSnapshot().wins).toBe(1);
    expect(peekAct3NextOpponent()?.actStep).toBe(2);
  });

  it("does not advance on a non-current-step win (retry out of order)", () => {
    const secondStepOpponent = ACT_3_OPPONENTS.find((o) => o.actStep === 2)!;
    useAct3LadderStore.getState().recordWin(secondStepOpponent.id);
    // Wins stayed 0; defeatedOpponents list is unchanged.
    expect(getAct3LadderSnapshot().wins).toBe(0);
    expect(getAct3LadderSnapshot().defeatedOpponents).toEqual([]);
  });

  it("records losses without advancing the ladder", () => {
    const first = peekAct3NextOpponent();
    useAct3LadderStore.getState().recordLoss(first!.id);
    const snap = getAct3LadderSnapshot();
    expect(snap.wins).toBe(0);
    expect(snap.losses).toBe(1);
    expect(snap.lastBattleOutcome).toBe("loss");
  });

  it("isAct3LadderComplete only flips after all three wins", () => {
    expect(isAct3LadderComplete()).toBe(false);
    for (const opp of ACT_3_OPPONENTS) {
      useAct3LadderStore.getState().recordWin(opp.id);
    }
    expect(isAct3LadderComplete()).toBe(true);
    expect(peekAct3NextOpponent()).toBeNull();
  });

  it("persists snapshot shape through reset", () => {
    useAct3LadderStore.getState().recordWin(ACT_3_OPPONENTS[0].id);
    useAct3LadderStore.getState().reset();
    expect(getAct3LadderSnapshot().wins).toBe(0);
    expect(getAct3LadderSnapshot().defeatedOpponents).toEqual([]);
  });
});
