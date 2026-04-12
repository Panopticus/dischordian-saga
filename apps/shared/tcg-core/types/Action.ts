/**
 * Player-submitted actions.
 *
 * Every mutation of the game state goes through exactly one Action. Actions
 * are serializable, idempotent by seq, and fully validated before the
 * reducer applies them.
 *
 * Authority rule: the server alone decides the canonical Action sequence.
 * Clients submit actions optimistically; the server validates via
 * engine/validation.ts (same code), applies reduce(), and broadcasts the
 * authoritative state back.
 */
import type { Side } from "./Ids";

export type Action =
  /** Mulligan phase: replace these hand indices with fresh draws. */
  | { kind: "mulligan"; actor: Side; replaceIndices: readonly number[]; seq: number }
  /** Mulligan phase: commit the current hand and leave mulligan. */
  | { kind: "finish_mulligan"; actor: Side; seq: number }
  /** Move a unit to a tile. */
  | {
      kind: "move";
      actor: Side;
      entityId: string;
      toRow: number;
      toCol: number;
      seq: number;
    }
  /** Attack an enemy entity. */
  | {
      kind: "attack";
      actor: Side;
      attackerId: string;
      targetId: string;
      seq: number;
    }
  /** Play a card from hand onto a tile (unit) or with a target (spell). */
  | {
      kind: "play_card";
      actor: Side;
      handIndex: number;
      /** For units: the summon tile. For spells: origin of AoE/etc. */
      row?: number;
      col?: number;
      /** Optional explicit target for spells/abilities that require one. */
      targetEntityId?: string;
      /** Player-chosen branch for `choose_one` ops. */
      chooseIndex?: number;
      seq: number;
    }
  /** Replace a single card in hand — once per turn. */
  | { kind: "replace_card"; actor: Side; handIndex: number; seq: number }
  /** Fire the general's Bloodborn spell. */
  | {
      kind: "bloodborn_spell";
      actor: Side;
      row?: number;
      col?: number;
      targetEntityId?: string;
      seq: number;
    }
  /** End current turn and pass priority. */
  | { kind: "end_turn"; actor: Side; seq: number }
  /** Concede the match. Always legal. */
  | { kind: "concede"; actor: Side; seq: number };

/** Types of validation errors the reducer may return. */
export type ReduceErrorCode =
  | "wrong_actor"
  | "wrong_phase"
  | "not_your_turn"
  | "seq_mismatch"
  | "invalid_target"
  | "out_of_range"
  | "insufficient_mana"
  | "hand_index_out_of_bounds"
  | "action_already_used"
  | "illegal_move"
  | "illegal_attack"
  | "unknown_card"
  | "match_ended";

export interface ReduceError {
  code: ReduceErrorCode;
  message: string;
}
