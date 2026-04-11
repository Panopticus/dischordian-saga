import { describe, it, expect } from "vitest";
import {
  getCiphertext,
  hideSequenceHint,
  setHackingByte,
  startCipherPuzzle,
  startHackingPuzzle,
  startSequencePuzzle,
  startVortexPuzzle,
  submitCipherGuess,
  submitHackingPuzzle,
  tapSequenceTile,
} from "./vortexRoomMinigame";

describe("vortexRoomMinigame — sequence puzzle", () => {
  it("startSequencePuzzle produces a target sequence of the requested length", () => {
    const state = startSequencePuzzle(42, 5);
    expect(state.kind).toBe("sequence");
    expect(state.targetSequence.length).toBe(5);
    expect(state.playerInput).toEqual([]);
    expect(state.hintVisibleCount).toBe(5);
    expect(state.outcome).toBe("pending");
  });

  it("is deterministic for a given seed", () => {
    const a = startSequencePuzzle(42);
    const b = startSequencePuzzle(42);
    expect(a.targetSequence).toEqual(b.targetSequence);
  });

  it("hideSequenceHint clears the hint counter", () => {
    const state = hideSequenceHint(startSequencePuzzle(42));
    expect(state.hintVisibleCount).toBe(0);
  });

  it("tapping the correct tile in order advances the puzzle", () => {
    let state = hideSequenceHint(startSequencePuzzle(42, 3));
    for (const tile of state.targetSequence) {
      state = tapSequenceTile(state, tile);
    }
    expect(state.outcome).toBe("won");
    expect(state.playerInput).toEqual(state.targetSequence);
  });

  it("tapping the wrong tile fails the puzzle immediately", () => {
    let state = hideSequenceHint(startSequencePuzzle(42, 4));
    const correctFirst = state.targetSequence[0];
    const wrongFirst = (correctFirst + 1) % 9;
    state = tapSequenceTile(state, wrongFirst);
    expect(state.outcome).toBe("lost");
  });

  it("ignores taps while the hint is still visible", () => {
    const state = startSequencePuzzle(42);
    const after = tapSequenceTile(state, 0);
    expect(after).toEqual(state);
  });

  it("ignores taps after the puzzle has resolved", () => {
    let state = hideSequenceHint(startSequencePuzzle(42, 2));
    state = tapSequenceTile(state, state.targetSequence[0]);
    state = tapSequenceTile(state, state.targetSequence[1]);
    expect(state.outcome).toBe("won");
    const after = tapSequenceTile(state, 4);
    expect(after).toEqual(state);
  });
});

describe("vortexRoomMinigame — cipher puzzle", () => {
  it("startCipherPuzzle picks a canonical word and a shift", () => {
    const state = startCipherPuzzle(1);
    expect(state.kind).toBe("cipher");
    expect(state.plaintext.length).toBeGreaterThan(0);
    expect(state.shift).toBeGreaterThanOrEqual(1);
    expect(state.shift).toBeLessThan(13);
    expect(state.outcome).toBe("pending");
  });

  it("getCiphertext shifts the plaintext", () => {
    const state = startCipherPuzzle(7);
    const cipher = getCiphertext(state);
    expect(cipher.length).toBe(state.plaintext.length);
    // The cipher should differ from the plaintext
    expect(cipher).not.toBe(state.plaintext);
  });

  it("submitting the correct plaintext wins", () => {
    const state = startCipherPuzzle(7);
    const won = submitCipherGuess(state, state.plaintext);
    expect(won.outcome).toBe("won");
  });

  it("submitting a wrong plaintext loses", () => {
    const state = startCipherPuzzle(7);
    const lost = submitCipherGuess(state, "NOPE");
    expect(lost.outcome).toBe("lost");
  });

  it("submission is case-insensitive and trims whitespace", () => {
    const state = startCipherPuzzle(7);
    const won = submitCipherGuess(state, `  ${state.plaintext.toLowerCase()}  `);
    expect(won.outcome).toBe("won");
  });
});

describe("vortexRoomMinigame — hacking puzzle", () => {
  it("startHackingPuzzle produces a target of 6 bytes", () => {
    const state = startHackingPuzzle(1);
    expect(state.kind).toBe("hacking");
    expect(state.target.length).toBe(6);
    expect(state.current.length).toBe(6);
    expect(state.outcome).toBe("pending");
  });

  it("setHackingByte updates only the given index", () => {
    let state = startHackingPuzzle(1);
    state = setHackingByte(state, 2, 7);
    expect(state.current[2]).toBe(7);
    expect(state.current[0]).toBe(0);
  });

  it("clamps byte values to [0, 15]", () => {
    let state = startHackingPuzzle(1);
    state = setHackingByte(state, 0, 99);
    expect(state.current[0]).toBe(15);
    state = setHackingByte(state, 1, -5);
    expect(state.current[1]).toBe(0);
  });

  it("submitting matching bytes wins", () => {
    let state = startHackingPuzzle(1);
    for (let i = 0; i < 6; i++) {
      state = setHackingByte(state, i, state.target[i]);
    }
    state = submitHackingPuzzle(state);
    expect(state.outcome).toBe("won");
  });

  it("submitting non-matching bytes loses", () => {
    const state = submitHackingPuzzle(startHackingPuzzle(1));
    expect(state.outcome).toBe("lost");
  });
});

describe("vortexRoomMinigame — dispatcher", () => {
  it("dispatches to the correct puzzle kind", () => {
    expect(startVortexPuzzle("sequence", 1).kind).toBe("sequence");
    expect(startVortexPuzzle("cipher", 1).kind).toBe("cipher");
    expect(startVortexPuzzle("hacking", 1).kind).toBe("hacking");
  });
});
