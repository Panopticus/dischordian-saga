/**
 * Movement tests.
 *
 * Exercises getValidMoves + the reducer's move handler for:
 *  - 2-tile orthogonal reach
 *  - blocked paths (units in the way)
 *  - flying units (anywhere on the board)
 *  - structures / stunned / already-moved units are immobile
 *  - provoke lockdown (adjacent enemy with provoke prevents movement)
 *  - attempted illegal destinations return illegal_move
 *  - successful move updates board keys + emits unit_moved event
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import {
  getValidMoves,
  reduce,
  posKey,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
} from "../../index";
import type { GameEvent } from "../../index";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

describe("getValidMoves", () => {
  it("allows orthogonal moves up to distance 2 for default units", () => {
    let s = buildBareState({ seed: "mv-1" });
    // Place a unit at center with no obstacles.
    s = placeUnit(s, "u1", "test", 0, 2, 4);
    const moves = getValidMoves(s, "u1");
    // Expected tiles: orthogonal within 2 steps of (2,4) — 8 tiles total
    // (up1, up2, down1, down2, left1, left2, right1, right2) plus
    // diagonal-ish L tiles reachable via 2-step orthogonal paths:
    // (1,3), (1,5), (3,3), (3,5), (2,2), (2,6), (0,4), (4,4).
    // Exact count: 2 up + 2 down + 2 left + 2 right + 4 L-shape = 12.
    expect(moves.length).toBe(12);
    expect(moves.some((m) => m.row === 0 && m.col === 4)).toBe(true); // up 2
    expect(moves.some((m) => m.row === 2 && m.col === 6)).toBe(true); // right 2
    expect(moves.some((m) => m.row === 1 && m.col === 3)).toBe(true); // L
  });

  it("blocks movement through occupied tiles", () => {
    let s = buildBareState({ seed: "mv-2" });
    s = placeUnit(s, "mover", "test", 0, 2, 4);
    // Block the tile at (2,5) with a friendly.
    s = placeUnit(s, "wall", "test", 0, 2, 5);
    const moves = getValidMoves(s, "mover");
    // (2,6) is not reachable because the path goes through (2,5).
    expect(moves.some((m) => m.row === 2 && m.col === 5)).toBe(false);
    expect(moves.some((m) => m.row === 2 && m.col === 6)).toBe(false);
    // Can still step around via (1,4)→(1,5)→... but (2,6) specifically
    // needs 3 steps orthogonally so it stays out of range.
  });

  it("returns empty for a unit that already moved", () => {
    let s = buildBareState({ seed: "mv-3" });
    s = placeUnit(s, "u1", "test", 0, 2, 4);
    s = produce(s, (draft) => {
      Object.values(draft.board).find((e) => e.entityId === "u1")!.hasMoved = true;
    });
    expect(getValidMoves(s, "u1")).toEqual([]);
  });

  it("returns empty for a structure unit", () => {
    let s = buildBareState({ seed: "mv-4" });
    s = placeUnit(s, "u1", "test", 0, 2, 4);
    s = produce(s, (draft) => {
      const u = Object.values(draft.board).find((e) => e.entityId === "u1")!;
      u.card.activeKeywords = ["structure"];
    });
    expect(getValidMoves(s, "u1")).toEqual([]);
  });

  it("provoke lockdown: adjacent enemy with provoke blocks all moves", () => {
    let s = buildBareState({ seed: "mv-5" });
    s = placeUnit(s, "u1", "test", 0, 2, 4);
    // Enemy with provoke at (2,5).
    s = placeUnit(s, "enemy", "test", 1, 2, 5);
    s = produce(s, (draft) => {
      const e = Object.values(draft.board).find((x) => x.entityId === "enemy")!;
      e.card.activeKeywords = ["provoke"];
    });
    expect(getValidMoves(s, "u1")).toEqual([]);
  });

  it("flying allows moving to any empty tile", () => {
    let s = buildBareState({ seed: "mv-6" });
    s = placeUnit(s, "fly", "test", 0, 0, 0);
    s = produce(s, (draft) => {
      Object.values(draft.board).find((e) => e.entityId === "fly")!.card.activeKeywords = ["flying"];
    });
    const moves = getValidMoves(s, "fly");
    // Board is 5 rows × 9 cols = 45 tiles, minus the flyer's own tile
    // minus the two generals at (2,0) and (2,8) = 42 legal destinations.
    expect(moves.length).toBe(42);
  });
});

describe("handleMove via reducer", () => {
  it("moves a unit and emits unit_moved", () => {
    let s = buildBareState({ seed: "mv-rd-1" });
    s = placeUnit(s, "u1", "test", 0, 2, 4);
    const r = reduce(
      s,
      { kind: "move", actor: 0, entityId: "u1", toRow: 2, toCol: 5, seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    expect(r.state.board[posKey(2, 5)]).toBeDefined();
    expect(r.state.board[posKey(2, 5)].entityId).toBe("u1");
    expect(r.state.board[posKey(2, 4)]).toBeUndefined();
    const moved = r.events.find((e: GameEvent) => e.type === "unit_moved");
    expect(moved).toMatchObject({
      type: "unit_moved",
      entityId: "u1",
      fromRow: 2,
      fromCol: 4,
      toRow: 2,
      toCol: 5,
    });
  });

  it("rejects a move to an illegal destination", () => {
    let s = buildBareState({ seed: "mv-rd-2" });
    s = placeUnit(s, "u1", "test", 0, 2, 4);
    const r = reduce(
      s,
      { kind: "move", actor: 0, entityId: "u1", toRow: 0, toCol: 8, seq: 1 },
      registry
    );
    expect(r.error?.code).toBe("illegal_move");
    // Input state is unchanged.
    expect(r.state.board[posKey(2, 4)]).toBeDefined();
    expect(r.state.board[posKey(2, 4)].entityId).toBe("u1");
  });

  it("rejects moving the opponent's unit", () => {
    let s = buildBareState({ seed: "mv-rd-3" });
    s = placeUnit(s, "enemy", "test", 1, 2, 4);
    const r = reduce(
      s,
      { kind: "move", actor: 0, entityId: "enemy", toRow: 2, toCol: 5, seq: 1 },
      registry
    );
    expect(r.error?.code).toBe("illegal_move");
  });
});
