/**
 * Emitted events.
 *
 * Events are the UI-facing description of what happened during a reduce()
 * call. The client uses events to drive animations and the combat log; it
 * does NOT reconstruct state from events (state is broadcast too). Events
 * are also the substrate the trigger queue observes.
 *
 * Every event is cheap, structured, and serializable. There are no reverse
 * lookups here — the reducer emits a flat timeline.
 */
import type { Side } from "./Ids";

export type GameEvent =
  | { type: "match_started"; seed: string }
  | { type: "mulligan_drawn"; player: Side; replaced: number }
  | { type: "mulligan_finished"; player: Side }
  | { type: "turn_started"; player: Side; turnNumber: number }
  | { type: "turn_ended"; player: Side; turnNumber: number }
  | { type: "mana_gained"; player: Side; amount: number; max: number }
  | { type: "card_drawn"; player: Side; cardDefId: string; entityId: string }
  | { type: "card_burned"; player: Side; reason: "hand_full" | "deck_empty" }
  | { type: "card_discarded"; player: Side; entityId: string; mode: "random" | "choose" }
  | { type: "card_replaced"; player: Side; handIndex: number; newCardDefId: string }
  | {
      type: "card_played";
      player: Side;
      cardDefId: string;
      entityId: string;
      row?: number;
      col?: number;
    }
  | {
      type: "unit_deployed";
      entityId: string;
      cardDefId: string;
      owner: Side;
      row: number;
      col: number;
    }
  | {
      type: "unit_moved";
      entityId: string;
      fromRow: number;
      fromCol: number;
      toRow: number;
      toCol: number;
    }
  | {
      type: "damage_dealt";
      sourceId: string | null;
      targetId: string;
      amount: number;
      /** True if the damage was prevented by forcefield or similar. */
      absorbed: boolean;
    }
  | { type: "healed"; sourceId: string | null; targetId: string; amount: number }
  | {
      type: "buff_applied";
      sourceId: string;
      targetId: string;
      powerDelta: number;
      healthDelta: number;
      expiresAtTurn: number;
    }
  | { type: "buff_expired"; targetId: string; buffSource: string }
  | { type: "keyword_granted"; targetId: string; keyword: string; expiresAtTurn: number }
  | { type: "keyword_removed"; targetId: string; keyword: string }
  | { type: "unit_destroyed"; entityId: string; killerId: string | null }
  | { type: "unit_transformed"; entityId: string; intoDefId: string }
  | {
      type: "token_summoned";
      tokenId: string;
      owner: Side;
      row: number;
      col: number;
      entityId: string;
    }
  | { type: "counter_added"; targetId: string; counterKind: string; delta: number; newValue: number }
  | { type: "teleported"; entityId: string; toRow: number; toCol: number }
  | { type: "pushed"; entityId: string; toRow: number; toCol: number; distance: number }
  | {
      type: "trigger_fired";
      sourceId: string;
      abilityId: string;
      cause: string;
    }
  | { type: "bloodborn_cast"; player: Side; spellName: string }
  | {
      type: "match_ended";
      winner: Side | null;
      reason: "general_killed" | "surrender" | "disconnect_forfeit" | "turn_limit";
    };
