/**
 * Foundation determinism test.
 *
 * Proves the reducer contract holds for the skeleton:
 *  - Reducer never throws on valid actions.
 *  - Reducer never throws on invalid actions (returns error cleanly).
 *  - Same (state, action) sequence produces identical state hashes across
 *    independent runs.
 *  - Input state is not mutated by the reducer.
 *  - RNG is serializable and round-trips through state.
 *  - hashState/canonicalStringify are stable across calls.
 *
 * These tests do NOT exercise card effects, combat, or targeting yet —
 * those ship in follow-up commits. They exercise the *contract* so
 * everything else can safely build on top.
 */
import { describe, it, expect } from "vitest";
import {
  reduce,
  hashState,
  hashPrefix,
  canonicalStringify,
  createRng,
  rngShuffle,
  rngInt,
  RULES_VERSION,
  isReplayCompatible,
} from "../../index";
import type { GameState, Action } from "../../index";
import { buildBareState, emptyRegistry } from "../fixtures/stateBuilder";

/**
 * Thin wrapper so tests read naturally. `buildBareState` from the shared
 * fixture places generals on the board (SBA needs them to exist), so the
 * reducer's runFixedPoint pass doesn't auto-end the match.
 */
function makeBareState(seed = "deadbeef"): GameState {
  return buildBareState({ seed });
}

/* ─── Tests ─── */

describe("rules version", () => {
  it("exports a semver-shaped constant", () => {
    expect(RULES_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("considers patch bumps compatible, minor bumps incompatible", () => {
    expect(isReplayCompatible("1.0.0", "1.0.5")).toBe(true);
    expect(isReplayCompatible("1.0.0", "1.1.0")).toBe(false);
    expect(isReplayCompatible("1.0.0", "2.0.0")).toBe(false);
  });
});

describe("canonical hashing", () => {
  it("produces 16-char hex digests", () => {
    const h = hashState({ a: 1, b: [1, 2, 3] });
    expect(h).toMatch(/^[0-9a-f]{16}$/);
  });

  it("is key-order independent", () => {
    expect(hashState({ a: 1, b: 2 })).toBe(hashState({ b: 2, a: 1 }));
  });

  it("differs between distinct values", () => {
    expect(hashState({ a: 1 })).not.toBe(hashState({ a: 2 }));
  });

  it("hashPrefix is the first 8 chars of hashState", () => {
    const full = hashState({ x: "hi" });
    expect(hashPrefix({ x: "hi" })).toBe(full.slice(0, 8));
  });

  it("rejects non-finite numbers", () => {
    expect(() => canonicalStringify({ x: Number.NaN })).toThrow();
    expect(() => canonicalStringify({ x: Number.POSITIVE_INFINITY })).toThrow();
  });

  it("serializes Map with sorted keys", () => {
    const m1 = new Map<string, number>([["a", 1], ["b", 2]]);
    const m2 = new Map<string, number>([["b", 2], ["a", 1]]);
    expect(hashState(m1)).toBe(hashState(m2));
  });

  it("serializes Set with sorted items", () => {
    const s1 = new Set(["a", "b", "c"]);
    const s2 = new Set(["c", "a", "b"]);
    expect(hashState(s1)).toBe(hashState(s2));
  });

  it("collapses -0 and 0", () => {
    expect(hashState({ x: -0 })).toBe(hashState({ x: 0 }));
  });
});

describe("RNG determinism", () => {
  it("same seed produces same shuffle", () => {
    const r1 = createRng("seed1");
    const r2 = createRng("seed1");
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(rngShuffle(r1, arr)).toEqual(rngShuffle(r2, arr));
  });

  it("different seeds produce different shuffles", () => {
    const r1 = createRng("seed1");
    const r2 = createRng("seed2");
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const s1 = rngShuffle(r1, arr);
    const s2 = rngShuffle(r2, arr);
    expect(s1).not.toEqual(s2);
  });

  it("state round-trips through serialization", () => {
    const r1 = createRng("roundtrip");
    // Advance the RNG a bit.
    for (let i = 0; i < 5; i++) r1.next();
    const snapshot = r1.state();
    const nextFromOriginal = r1.next();
    // Reconstruct from state and verify the next draw matches.
    const r2 = createRng(snapshot, true);
    expect(r2.next()).toBeCloseTo(nextFromOriginal, 15);
  });

  it("rngInt stays within bounds", () => {
    const r = createRng("bounds-test");
    for (let i = 0; i < 1000; i++) {
      const v = rngInt(r, -5, 5);
      expect(v).toBeGreaterThanOrEqual(-5);
      expect(v).toBeLessThanOrEqual(5);
    }
  });
});

describe("reducer contract", () => {
  it("end_turn advances turn counter and switches active player", () => {
    const s0 = makeBareState();
    const a: Action = { kind: "end_turn", actor: 0, seq: 1 };
    const r = reduce(s0, a, emptyRegistry);
    expect(r.error).toBeUndefined();
    expect(r.state.currentPlayer).toBe(1);
    expect(r.state.turnNumber).toBe(1); // advances only when P0 starts next
    // Two end_turns bring us back to P0 and turn 2.
    const r2 = reduce(r.state, { kind: "end_turn", actor: 1, seq: 2 }, emptyRegistry);
    expect(r2.state.currentPlayer).toBe(0);
    expect(r2.state.turnNumber).toBe(2);
  });

  it("end_turn from wrong actor returns not_your_turn error", () => {
    const s0 = makeBareState();
    const a: Action = { kind: "end_turn", actor: 1, seq: 1 };
    const r = reduce(s0, a, emptyRegistry);
    expect(r.error).toBeDefined();
    expect(r.error?.code).toBe("not_your_turn");
    // State was not changed.
    expect(r.state).toBe(s0);
  });

  it("concede ends the match with the right winner", () => {
    const s0 = makeBareState();
    const r = reduce(s0, { kind: "concede", actor: 0, seq: 1 }, emptyRegistry);
    expect(r.error).toBeUndefined();
    expect(r.state.phase).toBe("ended");
    expect(r.state.winner).toBe(1);
    expect(r.state.winReason).toBe("surrender");
  });

  it("any action after match end returns match_ended", () => {
    const s0 = makeBareState();
    const ended = reduce(s0, { kind: "concede", actor: 0, seq: 1 }, emptyRegistry).state;
    const r = reduce(ended, { kind: "end_turn", actor: 1, seq: 2 }, emptyRegistry);
    expect(r.error?.code).toBe("match_ended");
  });

  it("does not mutate the input state on success", () => {
    const s0 = makeBareState();
    const snapshotHash = hashState(s0);
    reduce(s0, { kind: "end_turn", actor: 0, seq: 1 }, emptyRegistry);
    expect(hashState(s0)).toBe(snapshotHash);
  });

  it("does not mutate the input state on failure", () => {
    const s0 = makeBareState();
    const snapshotHash = hashState(s0);
    reduce(s0, { kind: "end_turn", actor: 1, seq: 1 }, emptyRegistry);
    expect(hashState(s0)).toBe(snapshotHash);
  });

  it("identical action sequences from identical states produce identical hashes", () => {
    const actions: Action[] = [
      { kind: "end_turn", actor: 0, seq: 1 },
      { kind: "end_turn", actor: 1, seq: 2 },
      { kind: "end_turn", actor: 0, seq: 3 },
      { kind: "end_turn", actor: 1, seq: 4 },
    ];
    const runA = playSequence(makeBareState("same-seed"), actions);
    const runB = playSequence(makeBareState("same-seed"), actions);
    expect(hashState(runA)).toBe(hashState(runB));
    expect(runA.turnNumber).toBe(3);
  });

  it("different seeds yield different state hashes even for identical actions", () => {
    const actions: Action[] = [{ kind: "end_turn", actor: 0, seq: 1 }];
    const runA = playSequence(makeBareState("seed-a"), actions);
    const runB = playSequence(makeBareState("seed-b"), actions);
    expect(hashState(runA)).not.toBe(hashState(runB));
  });

  it("bumps actionSeq on every successful action", () => {
    const s0 = makeBareState();
    const r1 = reduce(s0, { kind: "end_turn", actor: 0, seq: 1 }, emptyRegistry);
    const r2 = reduce(r1.state, { kind: "end_turn", actor: 1, seq: 2 }, emptyRegistry);
    expect(r1.state.actionSeq).toBe(1);
    expect(r2.state.actionSeq).toBe(2);
  });
});

/** Helper: walk a sequence, stop early on error. */
function playSequence(s0: GameState, actions: readonly Action[]): GameState {
  let s = s0;
  for (const a of actions) {
    const r = reduce(s, a, emptyRegistry);
    if (r.error) throw new Error(`Unexpected error: ${r.error.code} ${r.error.message}`);
    s = r.state;
  }
  return s;
}
