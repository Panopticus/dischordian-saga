import { describe, expect, it } from "vitest";
import { getPuzzleUnlockState, type Puzzle } from "./PuzzleSystem";

const makePuzzle = (over: Partial<Puzzle> = {}): Puzzle => ({
  id: "test_puzzle",
  roomId: "test_room",
  type: "riddle",
  title: "Test Puzzle",
  description: "Test",
  elaraHint: "Hint",
  ...over,
});

describe("getPuzzleUnlockState (audit/16 PR 8 ER1)", () => {
  it("unlocks puzzles with no prerequisites", () => {
    const result = getPuzzleUnlockState(makePuzzle(), {
      solvedPuzzles: new Set(),
      collectedClues: new Set(),
      narrativeFlags: new Set(),
    });
    expect(result.unlocked).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("unlocks puzzles with empty prerequisites array", () => {
    const result = getPuzzleUnlockState(
      makePuzzle({ prerequisites: [] }),
      { solvedPuzzles: new Set(), collectedClues: new Set(), narrativeFlags: new Set() },
    );
    expect(result.unlocked).toBe(true);
  });

  it("locks puzzles with unmet puzzle_solved prerequisite", () => {
    const result = getPuzzleUnlockState(
      makePuzzle({ prerequisites: [{ kind: "puzzle_solved", puzzleId: "med_bay" }] }),
      { solvedPuzzles: new Set(), collectedClues: new Set(), narrativeFlags: new Set() },
    );
    expect(result.unlocked).toBe(false);
    expect(result.missing).toHaveLength(1);
    expect(result.missing[0]).toEqual({ kind: "puzzle_solved", puzzleId: "med_bay" });
  });

  it("unlocks puzzles when puzzle_solved prerequisite is met", () => {
    const result = getPuzzleUnlockState(
      makePuzzle({ prerequisites: [{ kind: "puzzle_solved", puzzleId: "med_bay" }] }),
      {
        solvedPuzzles: new Set(["med_bay"]),
        collectedClues: new Set(),
        narrativeFlags: new Set(),
      },
    );
    expect(result.unlocked).toBe(true);
  });

  it("locks puzzles with unmet clue_collected prerequisite", () => {
    const result = getPuzzleUnlockState(
      makePuzzle({ prerequisites: [{ kind: "clue_collected", clueId: "data_slate" }] }),
      { solvedPuzzles: new Set(), collectedClues: new Set(), narrativeFlags: new Set() },
    );
    expect(result.unlocked).toBe(false);
  });

  it("unlocks puzzles when clue_collected prerequisite is met", () => {
    const result = getPuzzleUnlockState(
      makePuzzle({ prerequisites: [{ kind: "clue_collected", clueId: "data_slate" }] }),
      {
        solvedPuzzles: new Set(),
        collectedClues: new Set(["data_slate"]),
        narrativeFlags: new Set(),
      },
    );
    expect(result.unlocked).toBe(true);
  });

  it("locks puzzles with unmet narrative_flag prerequisite", () => {
    const result = getPuzzleUnlockState(
      makePuzzle({ prerequisites: [{ kind: "narrative_flag", flag: "act_2_complete" }] }),
      { solvedPuzzles: new Set(), collectedClues: new Set(), narrativeFlags: new Set() },
    );
    expect(result.unlocked).toBe(false);
  });

  it("unlocks puzzles when narrative_flag prerequisite is met", () => {
    const result = getPuzzleUnlockState(
      makePuzzle({ prerequisites: [{ kind: "narrative_flag", flag: "act_2_complete" }] }),
      {
        solvedPuzzles: new Set(),
        collectedClues: new Set(),
        narrativeFlags: new Set(["act_2_complete"]),
      },
    );
    expect(result.unlocked).toBe(true);
  });

  it("uses AND-logic for multiple prerequisites", () => {
    const puzzle = makePuzzle({
      prerequisites: [
        { kind: "puzzle_solved", puzzleId: "med_bay" },
        { kind: "clue_collected", clueId: "data_slate" },
      ],
    });
    // Only med_bay solved → still locked.
    expect(
      getPuzzleUnlockState(puzzle, {
        solvedPuzzles: new Set(["med_bay"]),
        collectedClues: new Set(),
        narrativeFlags: new Set(),
      }).unlocked,
    ).toBe(false);
    // Only clue collected → still locked.
    expect(
      getPuzzleUnlockState(puzzle, {
        solvedPuzzles: new Set(),
        collectedClues: new Set(["data_slate"]),
        narrativeFlags: new Set(),
      }).unlocked,
    ).toBe(false);
    // Both met → unlocked.
    expect(
      getPuzzleUnlockState(puzzle, {
        solvedPuzzles: new Set(["med_bay"]),
        collectedClues: new Set(["data_slate"]),
        narrativeFlags: new Set(),
      }).unlocked,
    ).toBe(true);
  });

  it("returns ALL missing prerequisites (not just the first)", () => {
    const puzzle = makePuzzle({
      prerequisites: [
        { kind: "puzzle_solved", puzzleId: "med_bay" },
        { kind: "clue_collected", clueId: "data_slate" },
        { kind: "narrative_flag", flag: "act_2_complete" },
      ],
    });
    const result = getPuzzleUnlockState(puzzle, {
      solvedPuzzles: new Set(),
      collectedClues: new Set(),
      narrativeFlags: new Set(),
    });
    expect(result.missing).toHaveLength(3);
  });

  it("handles mixed prerequisite kinds correctly", () => {
    // Bridge puzzle: requires med_bay solved AND data_slate collected
    // (the canonical example from the audit).
    const bridge = makePuzzle({
      id: "bridge",
      prerequisites: [
        { kind: "puzzle_solved", puzzleId: "med_bay" },
        { kind: "clue_collected", clueId: "crystal_ark_designation" },
      ],
    });
    const result = getPuzzleUnlockState(bridge, {
      solvedPuzzles: new Set(["med_bay"]),
      collectedClues: new Set(["crystal_ark_designation"]),
      narrativeFlags: new Set(),
    });
    expect(result.unlocked).toBe(true);
    expect(result.missing).toHaveLength(0);
  });
});
