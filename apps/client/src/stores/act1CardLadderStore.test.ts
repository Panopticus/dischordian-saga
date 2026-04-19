import { describe, it, expect, beforeEach } from "vitest";
import {
  useAct1LadderStore,
  getAct1LadderSnapshot,
  peekAct1NextOpponent,
} from "./act1CardLadderStore";
import { ACT_1_OPPONENTS } from "@shared/act1Opponents";

describe("act1CardLadderStore", () => {
  beforeEach(() => {
    useAct1LadderStore.getState().reset();
  });

  it("starts at step 1 with zero wins", () => {
    const s = getAct1LadderSnapshot();
    expect(s.wins).toBe(0);
    expect(s.losses).toBe(0);
    expect(s.defeatedOpponents).toEqual([]);
    expect(s.lastBattleOutcome).toBeNull();
  });

  it("peekAct1NextOpponent returns step 1 at start", () => {
    const next = peekAct1NextOpponent();
    expect(next?.act1Step).toBe(1);
    // Canonical id (was "little_meme" in DSFGL Rev 6.2 draft);
    // recordWin still accepts the legacy id via aliases.
    expect(next?.id).toBe("minnie_meme");
  });

  it("recordWin advances only when the id matches the current step", () => {
    // Record a win against the correct current-step opponent.
    useAct1LadderStore.getState().recordWin("little_meme");
    let s = getAct1LadderSnapshot();
    expect(s.wins).toBe(1);
    expect(s.defeatedOpponents).toEqual(["little_meme"]);

    // Record a win against an opponent that is NOT the
    // current step — should not advance wins.
    useAct1LadderStore.getState().recordWin("little_watcher");
    s = getAct1LadderSnapshot();
    expect(s.wins).toBe(1);
    expect(s.defeatedOpponents).toEqual(["little_meme"]);
    // lastBattleOutcome is still "win" with the attempted opponent
    expect(s.lastBattleOutcome).toBe("win");
    expect(s.lastBattleOpponentId).toBe("little_watcher");
  });

  it("recordLoss increments losses without advancing wins", () => {
    useAct1LadderStore.getState().recordLoss("little_meme");
    const s = getAct1LadderSnapshot();
    expect(s.wins).toBe(0);
    expect(s.losses).toBe(1);
    expect(s.lastBattleOutcome).toBe("loss");
    expect(s.lastBattleOpponentId).toBe("little_meme");
  });

  it("progresses through the full ladder in order", () => {
    for (const opponent of ACT_1_OPPONENTS) {
      useAct1LadderStore.getState().recordWin(opponent.id);
    }
    const s = getAct1LadderSnapshot();
    expect(s.wins).toBe(ACT_1_OPPONENTS.length);
    expect(s.defeatedOpponents.length).toBe(ACT_1_OPPONENTS.length);
    expect(peekAct1NextOpponent()).toBeNull();
  });

  it("reset clears all progression", () => {
    useAct1LadderStore.getState().recordWin("little_meme");
    useAct1LadderStore.getState().recordLoss("little_collector");
    useAct1LadderStore.getState().reset();
    const s = getAct1LadderSnapshot();
    expect(s.wins).toBe(0);
    expect(s.losses).toBe(0);
    expect(s.defeatedOpponents).toEqual([]);
    expect(s.lastBattleOutcome).toBeNull();
  });

  it("retry against the same current-step opponent does not double-count", () => {
    // First win on step 1.
    useAct1LadderStore.getState().recordWin("little_meme");
    expect(getAct1LadderSnapshot().wins).toBe(1);

    // Player retries against step 2 (little_collector) — losses
    // and then wins. The retry-win should advance wins to 2.
    useAct1LadderStore.getState().recordLoss("little_collector");
    expect(getAct1LadderSnapshot().wins).toBe(1);
    expect(getAct1LadderSnapshot().losses).toBe(1);

    useAct1LadderStore.getState().recordWin("little_collector");
    expect(getAct1LadderSnapshot().wins).toBe(2);
    expect(getAct1LadderSnapshot().defeatedOpponents).toEqual([
      "little_meme",
      "little_collector",
    ]);
  });
});
