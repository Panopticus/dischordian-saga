import { describe, it, expect } from "vitest";
import {
  dialogSceneAdvanceIndex,
  dialogSceneCurrent,
  dialogSceneSpeakers,
  type DialogSceneLine,
} from "./useDialogScene";

describe("dialogSceneSpeakers", () => {
  it("preserves first-appearance order", () => {
    const lines: DialogSceneLine[] = [
      { speaker: "elara", text: "First." },
      { speaker: "human", text: "Second." },
      { speaker: "elara", text: "Third." },
      { speaker: "antiquarian", text: "Fourth." },
      { speaker: "human", text: "Fifth." },
    ];
    expect(dialogSceneSpeakers(lines)).toEqual(["elara", "human", "antiquarian"]);
  });

  it("returns an empty list when no lines are present", () => {
    expect(dialogSceneSpeakers([])).toEqual([]);
  });

  it("dedupes a single-speaker monologue down to one entry", () => {
    const lines: DialogSceneLine[] = [
      { speaker: "elara", text: "Line 1" },
      { speaker: "elara", text: "Line 2" },
      { speaker: "elara", text: "Line 3" },
    ];
    expect(dialogSceneSpeakers(lines)).toEqual(["elara"]);
  });
});

describe("dialogSceneAdvanceIndex", () => {
  it("increments inside the scene", () => {
    expect(dialogSceneAdvanceIndex(0, 3)).toBe(1);
    expect(dialogSceneAdvanceIndex(1, 3)).toBe(2);
    expect(dialogSceneAdvanceIndex(2, 3)).toBe(3);
  });

  it("clamps once we reach lineCount (idempotent past completion)", () => {
    expect(dialogSceneAdvanceIndex(3, 3)).toBe(3);
    expect(dialogSceneAdvanceIndex(99, 3)).toBe(99);
  });

  it("treats an empty scene as already complete", () => {
    expect(dialogSceneAdvanceIndex(0, 0)).toBe(0);
  });
});

describe("dialogSceneCurrent", () => {
  const lines: DialogSceneLine[] = [
    { speaker: "elara", text: "First." },
    { speaker: "human", text: "Second." },
  ];

  it("returns the line at the given index", () => {
    expect(dialogSceneCurrent(lines, 0)?.text).toBe("First.");
    expect(dialogSceneCurrent(lines, 1)?.text).toBe("Second.");
  });

  it("returns null once past the end", () => {
    expect(dialogSceneCurrent(lines, 2)).toBeNull();
    expect(dialogSceneCurrent(lines, 99)).toBeNull();
  });

  it("returns null on an empty scene", () => {
    expect(dialogSceneCurrent([], 0)).toBeNull();
  });
});
