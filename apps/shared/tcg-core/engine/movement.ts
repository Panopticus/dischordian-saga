/**
 * Movement.
 *
 * handleMove validates and executes a unit move on the 9×5 grid. Rules
 * (ported from the original duelyst/engine.ts but hardened against
 * mutation bugs):
 *
 *  - The unit must belong to the active player and be on the board.
 *  - It must not have moved already this turn.
 *  - It must not be stunned.
 *  - It must not be a `structure` (immobile).
 *  - The destination tile must be empty and in bounds.
 *  - Reach:
 *      * `flying` → any empty tile on the board.
 *      * default → orthogonal step, up to 2 tiles (Duelyst default),
 *        BFS-bounded by other units blocking path.
 *  - Provoke: if any enemy adjacent to the unit has `provoke`, the unit
 *    cannot move at all (it must attack into the provoker's zone).
 *  - Infiltrate: a unit with `infiltrate` that crosses into the enemy
 *    side of the board gains an active flag the damage pipeline reads.
 *    (Flag flip only — combat handler reads it.)
 *
 * Exports:
 *  - getValidMoves(state, entityId) → list of (row, col) destinations.
 *    Used by AI, deckbuilder preview, and tests.
 *  - handleMove(draft, action, ctx) → the real reducer handler.
 */
import type { Draft } from "immer";
import type { GameState, BoardEntity } from "../types/GameState";
import { BOARD_HEIGHT, BOARD_WIDTH, posKey } from "../types/GameState";
import type { Action, ReduceError } from "../types/Action";
import type { EntityId } from "../types/Ids";
import type { ReduceCtx } from "./reducer";
import { findBoardEntity } from "./targeting";

export interface Coord {
  row: number;
  col: number;
}

/**
 * Return every legal destination (row, col) for `entityId` given the
 * current board state. Pure function; used by AI + UI highlight +
 * action validator.
 */
export function getValidMoves(
  state: GameState,
  entityId: string
): Coord[] {
  const unit = findBoardEntity(state, entityId as EntityId);
  if (!unit) return [];
  if (unit.hasMoved) return [];
  if (unit.isStunned) return [];
  if (unit.card.activeKeywords.includes("structure")) return [];

  // Provoke lockdown: any adjacent enemy with `provoke` prevents movement.
  if (hasAdjacentEnemyWithKeyword(state, unit, "provoke")) return [];

  // Flying: any empty tile on the board.
  if (unit.card.activeKeywords.includes("flying")) {
    const out: Coord[] = [];
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      for (let c = 0; c < BOARD_WIDTH; c++) {
        if (r === unit.row && c === unit.col) continue;
        if (!state.board[posKey(r, c)]) out.push({ row: r, col: c });
      }
    }
    return out;
  }

  // Default: orthogonal BFS up to 2 steps through empty tiles.
  const reach = 2;
  const visited = new Set<string>([posKey(unit.row, unit.col)]);
  const queue: Array<{ row: number; col: number; d: number }> = [
    { row: unit.row, col: unit.col, d: 0 },
  ];
  const out: Coord[] = [];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.d > 0) out.push({ row: cur.row, col: cur.col });
    if (cur.d === reach) continue;
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nr = cur.row + dr;
      const nc = cur.col + dc;
      if (nr < 0 || nr >= BOARD_HEIGHT || nc < 0 || nc >= BOARD_WIDTH) continue;
      const key = posKey(nr, nc);
      if (visited.has(key)) continue;
      // Can pass through empty tiles only.
      if (state.board[key]) continue;
      visited.add(key);
      queue.push({ row: nr, col: nc, d: cur.d + 1 });
    }
  }
  return out;
}

/** True if any enemy adjacent to `unit` has `keyword`. */
function hasAdjacentEnemyWithKeyword(
  state: GameState,
  unit: BoardEntity,
  keyword: string
): boolean {
  const enemySide = unit.card.owner === 0 ? 1 : 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = unit.row + dr;
      const nc = unit.col + dc;
      if (nr < 0 || nr >= BOARD_HEIGHT || nc < 0 || nc >= BOARD_WIDTH) continue;
      const neighbor = state.board[posKey(nr, nc)];
      if (!neighbor) continue;
      if (neighbor.card.owner !== enemySide) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((neighbor.card.activeKeywords as any[]).includes(keyword)) return true;
    }
  }
  return false;
}

export function handleMove(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "move" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  if (draft.phase !== "playing") {
    return { code: "wrong_phase", message: "move only legal in play phase" };
  }
  if (action.actor !== draft.currentPlayer) {
    return { code: "not_your_turn", message: "move from non-active player" };
  }

  // Locate the entity. We do our own lookup on the draft so we can
  // mutate it.
  let movingKey: string | null = null;
  let moving: Draft<BoardEntity> | null = null;
  for (const [key, entity] of Object.entries(draft.board)) {
    if (entity.entityId === action.entityId) {
      movingKey = key;
      moving = entity;
      break;
    }
  }
  if (!moving || !movingKey) {
    return {
      code: "illegal_move",
      message: `no such entity on board: ${action.entityId}`,
    };
  }
  if (moving.card.owner !== action.actor) {
    return {
      code: "illegal_move",
      message: "can only move your own units",
    };
  }
  if (moving.hasMoved) {
    return {
      code: "action_already_used",
      message: "this unit has already moved this turn",
    };
  }
  if (moving.isStunned) {
    return { code: "illegal_move", message: "unit is stunned" };
  }
  if (moving.card.activeKeywords.includes("structure")) {
    return { code: "illegal_move", message: "structures cannot move" };
  }

  // Reuse getValidMoves against the read-through draft so we only have
  // one set of movement rules.
  const legal = getValidMoves(draft as GameState, action.entityId);
  const found = legal.find((m) => m.row === action.toRow && m.col === action.toCol);
  if (!found) {
    return {
      code: "illegal_move",
      message: `(${action.toRow},${action.toCol}) is not a legal move target`,
    };
  }

  const fromRow = moving.row;
  const fromCol = moving.col;
  delete draft.board[movingKey];
  moving.row = action.toRow;
  moving.col = action.toCol;
  moving.hasMoved = true;
  draft.board[posKey(action.toRow, action.toCol)] = moving;

  ctx.events.push({
    type: "unit_moved",
    entityId: moving.entityId,
    fromRow,
    fromCol,
    toRow: action.toRow,
    toCol: action.toCol,
  });

  return undefined;
}
