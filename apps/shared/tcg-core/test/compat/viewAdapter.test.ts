/**
 * View adapter tests.
 *
 * Verifies that adaptTcgStateToLegacyView produces a DuelystGameState
 * view that matches the legacy shape the UI expects: Map-based board,
 * Set-based keywords, DuelystCard display objects with name + imageUrl
 * from the registry, correct forcefieldActive derivation, and player
 * hand/deck/mana projection.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import {
  createMatchState,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  adaptTcgStateToLegacyView,
  reduce,
  posKey,
  BOARD_HEIGHT,
} from "../../index";
import type { MatchConfig } from "../../index";
import { PlayerId } from "../../types/Ids";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

function freshMatch(seed = "view-test"): ReturnType<typeof createMatchState> {
  return createMatchState({
    matchId: "vt",
    seed,
    p1: {
      userId: PlayerId(1),
      faction: "architect",
      generalDefId: "gen_architect",
      deckCardDefIds: Array.from({ length: 39 }, (_, i) => `p1_${i}`),
    },
    p2: {
      userId: PlayerId(2),
      faction: "dreamer",
      generalDefId: "gen_dreamer",
      deckCardDefIds: Array.from({ length: 39 }, (_, i) => `p2_${i}`),
    },
    registry,
  });
}

describe("adaptTcgStateToLegacyView", () => {
  it("produces a Map-based board from the Record-based tcg-core state", () => {
    const state = freshMatch();
    const view = adaptTcgStateToLegacyView(state, registry);
    expect(view.board).toBeInstanceOf(Map);
    expect(view.board.size).toBeGreaterThan(0);
  });

  it("generals are present with isGeneral true", () => {
    const state = freshMatch();
    const view = adaptTcgStateToLegacyView(state, registry);
    const mid = Math.floor(BOARD_HEIGHT / 2);
    const p0Gen = view.board.get(posKey(mid, 0));
    const p1Gen = view.board.get(posKey(mid, 8));
    expect(p0Gen).toBeDefined();
    expect(p1Gen).toBeDefined();
    expect(p0Gen!.isGeneral).toBe(true);
    expect(p1Gen!.isGeneral).toBe(true);
  });

  it("board units have Set-based activeKeywords", () => {
    const state = freshMatch();
    const view = adaptTcgStateToLegacyView(state, registry);
    for (const [, unit] of view.board) {
      expect(unit.activeKeywords).toBeInstanceOf(Set);
    }
  });

  it("hand cards have display names from the registry", () => {
    // Use a real card in the hand so the name looks up
    const state = createMatchState({
      matchId: "vt2",
      seed: "seed2",
      p1: {
        userId: PlayerId(1),
        faction: "antiquarian",
        generalDefId: "gen_antiquarian",
        deckCardDefIds: [
          "s1_char_018", // Antiquarian
          ...Array.from({ length: 38 }, (_, i) => `fill_${i}`),
        ],
      },
      p2: {
        userId: PlayerId(2),
        faction: "dreamer",
        generalDefId: "gen_dreamer",
        deckCardDefIds: Array.from({ length: 39 }, (_, i) => `p2_${i}`),
      },
      registry,
    });
    const view = adaptTcgStateToLegacyView(state, registry);
    const antInHand = [...view.players[0].hand, ...view.players[0].deck].find(
      (c) => c.sagaCardId === "s1_char_018"
    );
    if (antInHand) {
      expect(antInHand.name).toBe("The Antiquarian");
      expect(antInHand.imageUrl).toContain("antiquarian");
    }
  });

  it("preserves currentPlayer, turnNumber, phase, winner", () => {
    const state = freshMatch();
    const view = adaptTcgStateToLegacyView(state, registry);
    expect(view.currentPlayer).toBe(state.currentPlayer);
    expect(view.turnNumber).toBe(state.turnNumber);
    expect(view.phase).toBe(state.phase);
    expect(view.winner).toBe(state.winner);
    expect(view.boardWidth).toBe(9);
    expect(view.boardHeight).toBe(5);
  });

  it("player hand and deck are arrays of DuelystCard-shaped objects", () => {
    const state = freshMatch();
    const view = adaptTcgStateToLegacyView(state, registry);
    for (const player of view.players) {
      for (const card of player.hand) {
        expect(typeof card.name).toBe("string");
        expect(typeof card.manaCost).toBe("number");
        expect(Array.isArray(card.keywords)).toBe(true);
      }
    }
  });

  it("forcefieldActive is true when forcefield_charges counter > 0", () => {
    let state = freshMatch("ff");
    state = produce(state, (draft) => {
      const mid = Math.floor(BOARD_HEIGHT / 2);
      const gen = draft.board[posKey(mid, 0)];
      if (gen) gen.card.counters.forcefield_charges = 2;
    });
    const view = adaptTcgStateToLegacyView(state, registry);
    const mid = Math.floor(BOARD_HEIGHT / 2);
    const gen = view.board.get(posKey(mid, 0));
    expect(gen!.forcefieldActive).toBe(true);
  });

  it("survives an end_turn + reduce round-trip (state mutations project cleanly)", () => {
    let state = freshMatch("roundtrip");
    // Skip mulligan.
    state = reduce(state, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry).state;
    state = reduce(state, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry).state;
    // Now in playing phase with P0 active.
    state = reduce(state, { kind: "end_turn", actor: 0, seq: 3 }, registry).state;
    const view = adaptTcgStateToLegacyView(state, registry);
    expect(view.currentPlayer).toBe(1);
    expect(view.phase).toBe("playing");
    // P1 gained mana and drew a card.
    expect(view.players[1].mana).toBeGreaterThanOrEqual(3);
  });
});
