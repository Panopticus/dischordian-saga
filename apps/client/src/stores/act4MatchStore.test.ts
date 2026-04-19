import { describe, it, expect, beforeEach } from "vitest";
import {
  getAct4MatchSnapshot,
  isAct4MatchPlayed,
  useAct4MatchStore,
} from "./act4MatchStore";

describe("act4MatchStore", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("loredex-act4-match");
    }
    useAct4MatchStore.getState().reset();
  });

  it("starts unplayed with null outcome and zero attempts", () => {
    const snap = getAct4MatchSnapshot();
    expect(snap.resolvedOpponentId).toBeNull();
    expect(snap.outcome).toBeNull();
    expect(snap.attempts).toBe(0);
    expect(isAct4MatchPlayed()).toBe(false);
  });

  it("records an outcome and increments attempts", () => {
    useAct4MatchStore.getState().recordOutcome("act4_the_bridge", "win");
    const snap = getAct4MatchSnapshot();
    expect(snap.resolvedOpponentId).toBe("act4_the_bridge");
    expect(snap.outcome).toBe("win");
    expect(snap.attempts).toBe(1);
    expect(isAct4MatchPlayed()).toBe(true);
  });

  it("retries accumulate on attempts and overwrite outcome", () => {
    useAct4MatchStore.getState().recordOutcome("act4_the_betrayal", "loss");
    useAct4MatchStore.getState().recordOutcome("act4_the_betrayal", "win");
    const snap = getAct4MatchSnapshot();
    expect(snap.attempts).toBe(2);
    expect(snap.outcome).toBe("win");
  });

  it("reset clears outcome and attempts", () => {
    useAct4MatchStore.getState().recordOutcome("act4_the_discovery", "loss");
    useAct4MatchStore.getState().reset();
    const snap = getAct4MatchSnapshot();
    expect(snap.outcome).toBeNull();
    expect(snap.attempts).toBe(0);
    expect(snap.resolvedOpponentId).toBeNull();
  });
});
