/**
 * MatchView projection tests. Verifies the team-aware view
 * over a 1v1 GameState is structurally consistent.
 */
import { describe, it, expect } from "vitest";
import {
  viewOf,
  actorSlotFromSide,
  sideFromActorSlot,
  peekNextSlot,
} from "./MatchView";
import { teams1v1 } from "./Teams";
import type { GameState } from "./GameState";

function makeMockState(currentPlayer: 0 | 1, winner: 0 | 1 | null = null): GameState {
  return {
    matchId: "test_match_42",
    rulesVersion: "1.0.0",
    rngState: "rng_init",
    seed: "seed_init",
    board: {},
    players: [{} as never, {} as never],
    currentPlayer,
    turnNumber: 1,
    phase: "main",
    winner,
    winReason: null,
    triggerQueue: [],
    actionSeq: 0,
    nextEntityCounter: 0,
  } as unknown as GameState;
}

describe("MatchView projection", () => {
  it("yields a 1v1 view with two slots and two single-player teams", () => {
    const state = makeMockState(0);
    const view = viewOf(state);
    expect(view.matchId).toBe("test_match_42");
    expect(view.slots).toEqual([0, 1]);
    expect(view.teams).toEqual(teams1v1());
    expect(view.currentSlot).toBe(0);
    expect(view.winnerSlot).toBeNull();
  });

  it("propagates currentPlayer + winner to slot fields", () => {
    const state = makeMockState(1, 1);
    const view = viewOf(state);
    expect(view.currentSlot).toBe(1);
    expect(view.winnerSlot).toBe(1);
  });
});

describe("Side ↔ MatchPlayerSlot adapters", () => {
  it("actorSlotFromSide is the identity for legal Side values", () => {
    expect(actorSlotFromSide(0)).toBe(0);
    expect(actorSlotFromSide(1)).toBe(1);
  });

  it("sideFromActorSlot accepts in-view slots and rejects others", () => {
    const view = viewOf(makeMockState(0));
    expect(sideFromActorSlot(view, 0)).toBe(0);
    expect(sideFromActorSlot(view, 1)).toBe(1);
    expect(() => sideFromActorSlot(view, 2)).toThrow();
  });
});

describe("peekNextSlot", () => {
  it("alternates 0 → 1 → 0 in 1v1", () => {
    const v0 = viewOf(makeMockState(0));
    expect(peekNextSlot(v0)).toBe(1);
    const v1 = viewOf(makeMockState(1));
    expect(peekNextSlot(v1)).toBe(0);
  });
});
