import { describe, it, expect, beforeEach } from "vitest";
import { useCompanionStore } from "./companionStore";

beforeEach(() => {
  useCompanionStore.getState().reset();
  // Persist middleware writes to localStorage; clear so tests start
  // from a true blank slate each time.
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("loredex_companion_state_v1");
  }
});

describe("useCompanionStore", () => {
  it("starts with default Elara/Human relationships", () => {
    const s = useCompanionStore.getState();
    expect(s.relationships.elara).toBe(5);
    expect(s.relationships.the_human).toBe(0);
  });

  it("bumpRelationship clamps to 0-100", () => {
    const { bumpRelationship } = useCompanionStore.getState();
    bumpRelationship("elara", 200);
    expect(useCompanionStore.getState().relationships.elara).toBe(100);
    bumpRelationship("elara", -500);
    expect(useCompanionStore.getState().relationships.elara).toBe(0);
  });

  it("startQuest is idempotent", () => {
    const { startQuest } = useCompanionStore.getState();
    startQuest("q1");
    startQuest("q1");
    expect(useCompanionStore.getState().questsActive).toEqual(["q1"]);
  });

  it("completeQuest moves from active to completed", () => {
    const { startQuest, completeQuest } = useCompanionStore.getState();
    startQuest("q1");
    completeQuest("q1");
    const s = useCompanionStore.getState();
    expect(s.questsActive).toEqual([]);
    expect(s.questsCompleted).toEqual(["q1"]);
  });

  it("recordDialogChoice dedupes per companion", () => {
    const { recordDialogChoice } = useCompanionStore.getState();
    recordDialogChoice("elara", "choice-1");
    recordDialogChoice("elara", "choice-1");
    recordDialogChoice("elara", "choice-2");
    expect(useCompanionStore.getState().dialogHistory.elara).toEqual([
      "choice-1",
      "choice-2",
    ]);
  });

  it("hydrate replaces snapshot fields without dropping actions", () => {
    const { hydrate } = useCompanionStore.getState();
    hydrate({
      relationships: { elara: 50, the_human: 30 },
      questsCompleted: ["q-onboard"],
    });
    const s = useCompanionStore.getState();
    expect(s.relationships.elara).toBe(50);
    expect(s.questsCompleted).toEqual(["q-onboard"]);
    expect(typeof s.bumpRelationship).toBe("function");
  });

  it("reset returns to defaults", () => {
    const { bumpRelationship, startQuest, reset } = useCompanionStore.getState();
    bumpRelationship("elara", 30);
    startQuest("q1");
    reset();
    const s = useCompanionStore.getState();
    expect(s.relationships.elara).toBe(5);
    expect(s.questsActive).toEqual([]);
  });
});
