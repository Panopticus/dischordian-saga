/**
 * Legacy client compatibility layer.
 *
 * Pure functions that translate between the old Duelyst client's wire
 * format (apps/client/src/game/duelyst/types.ts) and the canonical
 * tcg-core types. This lives in shared/ so both the WebSocket server
 * and the in-browser TcgClient can import the same translation code.
 *
 * Exports:
 *   - translateClientAction: legacy GameAction → tcg-core Action
 *   - TranslateResult: discriminated { ok, action } | { ok, error }
 */
import type { Action } from "../types/Action";

export type TranslateResult =
  | { ok: true; action: Action }
  | { ok: false; error: string };

/**
 * Translate a legacy Duelyst client action payload into a tcg-core Action.
 *
 * The legacy client constructs actions as `{ type: "move", unitId, ... }`.
 * tcg-core Actions use `{ kind: "move", entityId, actor, seq, ... }`.
 * This function bridges the two shapes. `actor` and `seq` are injected by
 * the caller (server assigns them from socket auth + monotonic counter;
 * client assigns them from the local player's side + a local counter).
 */
export function translateClientAction(
  raw: unknown,
  actor: 0 | 1,
  seq: number
): TranslateResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "action payload must be an object" };
  }
  const m = raw as Record<string, unknown>;
  const type = typeof m.type === "string" ? m.type : null;
  if (!type) return { ok: false, error: "action.type missing or not a string" };

  switch (type) {
    case "move": {
      const entityId = typeof m.unitId === "string" ? m.unitId : null;
      const toRow = typeof m.toRow === "number" ? m.toRow : null;
      const toCol = typeof m.toCol === "number" ? m.toCol : null;
      if (!entityId || toRow === null || toCol === null) {
        return { ok: false, error: "move requires unitId + toRow + toCol" };
      }
      return { ok: true, action: { kind: "move", actor, entityId, toRow, toCol, seq } };
    }

    case "attack": {
      const attackerId = typeof m.attackerId === "string" ? m.attackerId : null;
      const targetId = typeof m.targetId === "string" ? m.targetId : null;
      if (!attackerId || !targetId) {
        return { ok: false, error: "attack requires attackerId + targetId" };
      }
      return { ok: true, action: { kind: "attack", actor, attackerId, targetId, seq } };
    }

    case "play_card": {
      const handIndex = typeof m.cardIndex === "number" ? m.cardIndex : null;
      if (handIndex === null) {
        return { ok: false, error: "play_card requires cardIndex" };
      }
      return {
        ok: true,
        action: {
          kind: "play_card",
          actor,
          handIndex,
          row: typeof m.row === "number" ? m.row : undefined,
          col: typeof m.col === "number" ? m.col : undefined,
          targetEntityId: typeof m.targetId === "string" ? m.targetId : undefined,
          chooseIndex: typeof m.chooseIndex === "number" ? m.chooseIndex : undefined,
          seq,
        },
      };
    }

    case "replace_card": {
      const handIndex = typeof m.cardIndex === "number" ? m.cardIndex : null;
      if (handIndex === null) {
        return { ok: false, error: "replace_card requires cardIndex" };
      }
      return { ok: true, action: { kind: "replace_card", actor, handIndex, seq } };
    }

    case "bloodborn_spell":
      return {
        ok: true,
        action: {
          kind: "bloodborn_spell",
          actor,
          row: typeof m.targetRow === "number" ? m.targetRow : undefined,
          col: typeof m.targetCol === "number" ? m.targetCol : undefined,
          targetEntityId: typeof m.targetId === "string" ? m.targetId : undefined,
          seq,
        },
      };

    case "end_turn":
      return { ok: true, action: { kind: "end_turn", actor, seq } };

    case "mulligan": {
      const replaceIndices = Array.isArray(m.replaceIndices)
        ? (m.replaceIndices.filter((x) => typeof x === "number") as number[])
        : [];
      return { ok: true, action: { kind: "mulligan", actor, replaceIndices, seq } };
    }

    case "finish_mulligan":
      return { ok: true, action: { kind: "finish_mulligan", actor, seq } };

    case "concede":
      return { ok: true, action: { kind: "concede", actor, seq } };

    default:
      return { ok: false, error: `unknown action type: ${type}` };
  }
}
