import { describe, it, expect, beforeEach } from "vitest";
import { useAct1C4TrialStore, CANONICAL_ENGINEER_HAND } from "./act1C4TrialStore";

describe("act1C4TrialStore", () => {
  beforeEach(() => {
    useAct1C4TrialStore.getState().reset();
  });

  it("initializes with canonical 12-card engineer hand", () => {
    const { state } = useAct1C4TrialStore.getState();
    expect(state.engineerHand.length).toBe(CANONICAL_ENGINEER_HAND.length);
    expect(state.inkLines).toBe(0);
    expect(state.tribunalDeck.length).toBe(42);
    expect(state.outcome).toBeNull();
  });

  it("advanceTribunal plays the next card and sets pending", () => {
    useAct1C4TrialStore.getState().advanceTribunal();
    const { state, hasStarted } = useAct1C4TrialStore.getState();
    expect(hasStarted).toBe(true);
    expect(state.pendingTribunalCard?.id).toBe("j01");
    expect(state.tribunalDeck.length).toBe(41);
  });

  it("counterWith resolves the pending card and increments turnsCompleted", () => {
    const store = useAct1C4TrialStore.getState();
    store.advanceTribunal(); // play j01
    store.counterWith("standstill"); // any card delays jury
    const { state, turnsCompleted } = useAct1C4TrialStore.getState();
    expect(state.inkLines).toBe(0);
    expect(state.pendingTribunalCard).toBeNull();
    expect(turnsCompleted).toBe(1);
  });

  it("counterWith null adds the card's full weight to the scroll", () => {
    const store = useAct1C4TrialStore.getState();
    store.advanceTribunal(); // play j01 (weight 1)
    store.counterWith(null);
    expect(useAct1C4TrialStore.getState().state.inkLines).toBe(1);
  });

  it("reset restores the canonical starting state", () => {
    const store = useAct1C4TrialStore.getState();
    store.advanceTribunal();
    store.counterWith(null);
    expect(useAct1C4TrialStore.getState().state.inkLines).toBe(1);
    store.reset();
    const { state, hasStarted, turnsCompleted } = useAct1C4TrialStore.getState();
    expect(state.inkLines).toBe(0);
    expect(hasStarted).toBe(false);
    expect(turnsCompleted).toBe(0);
  });
});
