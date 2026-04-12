/**
 * Mulligan + finish_mulligan tests.
 *
 * Exercises the end-to-end mulligan phase through the real reducer:
 *  - mulligan action replaces specified indices with fresh draws
 *  - finish_mulligan without a prior mulligan call succeeds (zero replace)
 *  - phase advances to "playing" only when both players commit
 *  - wrong phase / out-of-bounds indices return structured errors
 *  - seeded RNG drives deterministic replacement
 */
import { describe, it, expect } from "vitest";
import {
  createMatchState,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  reduce,
  hashState,
  posKey,
  BOARD_HEIGHT,
} from "../../index";
import type { Action, GameState, MatchConfig } from "../../index";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

function buildTestDeck(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}_${i}`);
}

const p1Config: MatchConfig = {
  userId: 1 as MatchConfig["userId"],
  faction: "architect",
  generalDefId: "gen_architect",
  deckCardDefIds: buildTestDeck("p1", 39),
};
const p2Config: MatchConfig = {
  userId: 2 as MatchConfig["userId"],
  faction: "dreamer",
  generalDefId: "gen_dreamer",
  deckCardDefIds: buildTestDeck("p2", 39),
};

function freshMatch(seed = "mulligan-test"): GameState {
  return createMatchState({
    matchId: "mul",
    seed,
    p1: p1Config,
    p2: p2Config,
    registry,
  });
}

describe("mulligan handlers", () => {
  it("replaces the specified hand indices with fresh draws", () => {
    const s0 = freshMatch();
    const originalHand = s0.players[0].hand.map((c) => c.entityId);

    const r = reduce(
      s0,
      { kind: "mulligan", actor: 0, replaceIndices: [0, 2], seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    const newHand = r.state.players[0].hand.map((c) => c.entityId);
    // Indices 1, 3, 4 stay; 0 and 2 swap in new cards.
    expect(newHand[0]).toBe(originalHand[1]); // the old index-1 card
    expect(newHand[1]).toBe(originalHand[3]); // the old index-3 card
    expect(newHand[2]).toBe(originalHand[4]); // the old index-4 card
    // The two new cards must be different from any original entity id.
    expect(new Set(newHand).size).toBe(newHand.length);
    expect(r.state.players[0].replaceUsed).toBe(true);
  });

  it("finish_mulligan without a prior mulligan counts as 'mulligan nothing'", () => {
    const s0 = freshMatch();
    const handBefore = s0.players[0].hand;
    const r = reduce(s0, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry);
    expect(r.error).toBeUndefined();
    expect(r.state.players[0].hand).toEqual(handBefore);
    // Still in mulligan — P1 hasn't committed yet.
    expect(r.state.phase).toBe("mulligan");
  });

  it("advances phase to 'playing' when both players finish", () => {
    let s = freshMatch();
    s = reduce(s, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry).state;
    s = reduce(s, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry).state;
    expect(s.phase).toBe("playing");
    expect(s.currentPlayer).toBe(0);
    expect(s.turnNumber).toBe(1);
    // replaceUsed flags cleared post-mulligan so they can track
    // once-per-turn Replace in the playing phase.
    expect(s.players[0].replaceUsed).toBe(false);
    expect(s.players[1].replaceUsed).toBe(false);
    // P0's turn was refreshed: starting mana bumped from 2 to 3.
    expect(s.players[0].maxMana).toBe(3);
    expect(s.players[0].mana).toBe(3);
  });

  it("rejects mulligan in non-mulligan phase", () => {
    let s = freshMatch();
    s = reduce(s, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry).state;
    s = reduce(s, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry).state;
    // Now phase is "playing".
    const r = reduce(
      s,
      { kind: "mulligan", actor: 0, replaceIndices: [], seq: 3 },
      registry
    );
    expect(r.error?.code).toBe("wrong_phase");
  });

  it("rejects a second mulligan from the same player", () => {
    const s0 = freshMatch();
    const r1 = reduce(
      s0,
      { kind: "mulligan", actor: 0, replaceIndices: [0], seq: 1 },
      registry
    );
    expect(r1.error).toBeUndefined();
    const r2 = reduce(
      r1.state,
      { kind: "mulligan", actor: 0, replaceIndices: [1], seq: 2 },
      registry
    );
    expect(r2.error?.code).toBe("action_already_used");
  });

  it("rejects out-of-bounds replace indices", () => {
    const s0 = freshMatch();
    const r = reduce(
      s0,
      { kind: "mulligan", actor: 0, replaceIndices: [99], seq: 1 },
      registry
    );
    expect(r.error?.code).toBe("hand_index_out_of_bounds");
  });

  it("mulligan with same seed + indices produces identical hand", () => {
    const a = reduce(
      freshMatch("same"),
      { kind: "mulligan", actor: 0, replaceIndices: [0, 3], seq: 1 },
      registry
    );
    const b = reduce(
      freshMatch("same"),
      { kind: "mulligan", actor: 0, replaceIndices: [0, 3], seq: 1 },
      registry
    );
    expect(hashState(a.state)).toBe(hashState(b.state));
  });
});

describe("end_turn after mulligan (turn refresh)", () => {
  it("advances currentPlayer, bumps incoming player's mana, draws a card", () => {
    let s = freshMatch("et");
    s = reduce(s, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry).state;
    s = reduce(s, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry).state;
    // In "playing" phase now. P0 has 3 mana, 5 cards in hand.
    const handBefore = s.players[1].hand.length;
    const r = reduce(s, { kind: "end_turn", actor: 0, seq: 3 }, registry);
    expect(r.error).toBeUndefined();
    expect(r.state.currentPlayer).toBe(1);
    // P1's maxMana went from 2 → 3 (first turn of playing phase for P1).
    expect(r.state.players[1].maxMana).toBe(3);
    expect(r.state.players[1].mana).toBe(3);
    // P1 drew a card.
    expect(r.state.players[1].hand.length).toBe(handBefore + 1);
  });

  it("refreshes on-board units' action counts for the incoming player", () => {
    let s = freshMatch("refresh");
    s = reduce(s, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry).state;
    s = reduce(s, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry).state;
    // Each general was just placed — their actionsRemaining is 0 from init.
    // After refresh-for-P0 in finish_mulligan, P0's general should have 1.
    const mid = Math.floor(BOARD_HEIGHT / 2);
    const p0Gen = s.board[posKey(mid, 0)];
    expect(p0Gen.actionsRemaining).toBe(1);
    // End P0's turn — P1's general gets refreshed.
    const r = reduce(s, { kind: "end_turn", actor: 0, seq: 3 }, registry);
    const p1Gen = r.state.board[posKey(mid, 8)];
    expect(p1Gen.actionsRemaining).toBe(1);
  });
});
