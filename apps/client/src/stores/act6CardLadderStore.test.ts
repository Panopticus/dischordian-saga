import { describe, it, expect, beforeEach } from "vitest";
import {
  getAct6LadderSnapshot,
  isAct6LadderComplete,
  peekAct6NextOpponent,
  useAct6LadderStore,
} from "./act6CardLadderStore";
import { ACT_6_OPPONENTS } from "@shared/acts2to7Opponents";

describe("act6CardLadderStore", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("loredex-act6-ladder");
    }
    useAct6LadderStore.getState().reset();
  });

  it("starts at the first opponent with zero wins", () => {
    const snap = getAct6LadderSnapshot();
    expect(snap.wins).toBe(0);
    expect(peekAct6NextOpponent()?.actStep).toBe(1);
  });

  it("advances on a current-step win", () => {
    const first = peekAct6NextOpponent();
    useAct6LadderStore.getState().recordWin(first!.id);
    expect(getAct6LadderSnapshot().wins).toBe(1);
    expect(peekAct6NextOpponent()?.actStep).toBe(2);
  });

  it("does not advance on out-of-order wins", () => {
    const second = ACT_6_OPPONENTS.find((o) => o.actStep === 2)!;
    useAct6LadderStore.getState().recordWin(second.id);
    expect(getAct6LadderSnapshot().wins).toBe(0);
  });

  it("flips complete after both wins", () => {
    expect(isAct6LadderComplete()).toBe(false);
    for (const opp of ACT_6_OPPONENTS) {
      useAct6LadderStore.getState().recordWin(opp.id);
    }
    expect(isAct6LadderComplete()).toBe(true);
    expect(peekAct6NextOpponent()).toBeNull();
  });

  it("records losses without advancing", () => {
    const first = peekAct6NextOpponent();
    useAct6LadderStore.getState().recordLoss(first!.id);
    expect(getAct6LadderSnapshot().wins).toBe(0);
    expect(getAct6LadderSnapshot().losses).toBe(1);
  });
});
