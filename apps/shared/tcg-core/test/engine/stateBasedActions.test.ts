/**
 * State-based actions tests.
 *
 * SBA is correctness-critical — it handles dead entity cleanup, buff expiry,
 * and general-death win conditions inside the reducer's fixed-point loop.
 * These tests drive SBA directly (not through the reducer) so failures point
 * at SBA behavior rather than downstream reducer wiring.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import { runStateBasedActions } from "../../engine/stateBasedActions";
import type { ReduceCtx } from "../../engine/reducer";
import type { GameState } from "../../types/GameState";
import type { GameEvent } from "../../types/Event";
import { createRng } from "../../engine/rng";
import {
  buildBareState,
  placeUnit,
  setEntityHealth,
  emptyRegistry,
} from "../fixtures/stateBuilder";

function ctxFor(state: GameState): { ctx: ReduceCtx; events: GameEvent[] } {
  const events: GameEvent[] = [];
  const ctx: ReduceCtx = {
    events,
    rng: createRng(state.rngState, true),
    registry: emptyRegistry,
  };
  return { ctx, events };
}

describe("state-based actions", () => {
  it("is a no-op on a fresh state", () => {
    const s0 = buildBareState();
    const { ctx, events } = ctxFor(s0);
    const s1 = produce(s0, (draft) => {
      const changed = runStateBasedActions(draft, ctx);
      expect(changed).toBe(false);
    });
    expect(s1).toBe(s0);
    expect(events.length).toBe(0);
  });

  it("removes a dead unit and emits unit_destroyed", () => {
    const s0 = setEntityHealth(
      placeUnit(buildBareState(), "u1", "test_unit", 0, 3, 2),
      "u1",
      0
    );
    const { ctx, events } = ctxFor(s0);
    const s1 = produce(s0, (draft) => {
      const changed = runStateBasedActions(draft, ctx);
      expect(changed).toBe(true);
    });
    // Board no longer contains the dead unit.
    expect(Object.values(s1.board).some((e) => e.entityId === "u1")).toBe(false);
    // Unit moved to owner's graveyard.
    expect(s1.players[0].graveyard.length).toBe(1);
    expect(s1.players[0].graveyard[0].entityId).toBe("u1");
    // Event emitted.
    const destroyed = events.filter((e) => e.type === "unit_destroyed");
    expect(destroyed.length).toBe(1);
  });

  it("processes multiple simultaneous deaths in stable order", () => {
    let s = buildBareState();
    // Three P0 units at varying positions. Sorted by (row, col, id) the
    // order should be: u2 (0,3), u1 (1,1), u3 (1,2).
    s = placeUnit(s, "u1", "x", 0, 1, 1);
    s = placeUnit(s, "u2", "x", 0, 0, 3);
    s = placeUnit(s, "u3", "x", 0, 1, 2);
    s = setEntityHealth(s, "u1", 0);
    s = setEntityHealth(s, "u2", 0);
    s = setEntityHealth(s, "u3", 0);
    const { ctx, events } = ctxFor(s);
    const s1 = produce(s, (draft) => {
      runStateBasedActions(draft, ctx);
    });
    // All three removed into P0's graveyard.
    expect(s1.players[0].graveyard.length).toBe(3);
    // Board has only the two generals left.
    expect(Object.keys(s1.board).length).toBe(2);
    // Deterministic order by (row, col): u2 (0,3) → u1 (1,1) → u3 (1,2).
    const destroyed = events.filter((e) => e.type === "unit_destroyed");
    const ids = destroyed.map((e) =>
      e.type === "unit_destroyed" ? e.entityId : ""
    );
    expect(ids).toEqual(["u2", "u1", "u3"]);
  });

  it("ends the match when a general dies", () => {
    let s = buildBareState();
    // Kill P0's general.
    s = setEntityHealth(s, "general_p0", 0);
    const { ctx, events } = ctxFor(s);
    const s1 = produce(s, (draft) => {
      runStateBasedActions(draft, ctx);
    });
    // First pass removes the general from the board, second pass triggers
    // the win check. SBA is run iteratively by the reducer's fixed-point
    // loop; here we have to run it twice manually to mimic that.
    const s2 = produce(s1, (draft) => {
      runStateBasedActions(draft, ctx);
    });
    expect(s2.phase).toBe("ended");
    expect(s2.winner).toBe(1);
    expect(s2.winReason).toBe("general_killed");
    expect(events.some((e) => e.type === "match_ended")).toBe(true);
  });

  it("awards the win to the non-active player on simultaneous general deaths", () => {
    let s = buildBareState({ currentPlayer: 0 });
    s = setEntityHealth(s, "general_p0", 0);
    s = setEntityHealth(s, "general_p1", 0);
    const { ctx } = ctxFor(s);
    // Run two passes as above.
    let s1 = produce(s, (draft) => {
      runStateBasedActions(draft, ctx);
    });
    s1 = produce(s1, (draft) => {
      runStateBasedActions(draft, ctx);
    });
    // P0 was the active player, so the non-active P1 wins on simultaneous.
    expect(s1.phase).toBe("ended");
    expect(s1.winner).toBe(1);
  });

  it("expires temporary buffs whose turn has passed", () => {
    let s = buildBareState({ turnNumber: 5 });
    s = placeUnit(s, "u1", "x", 0, 2, 2, { currentPower: 3, maxHealth: 5, currentHealth: 5 });
    // Add a +2/+2 buff that expired at turn 3.
    s = produce(s, (draft) => {
      const e = Object.values(draft.board).find((x) => x.entityId === "u1");
      if (!e) throw new Error("missing");
      e.card.currentPower += 2;
      e.card.maxHealth += 2;
      e.card.currentHealth += 2;
      e.card.buffs = [
        { source: "spell_test", powerDelta: 2, healthDelta: 2, expiresAtTurn: 3 },
      ];
    });
    const { ctx, events } = ctxFor(s);
    const s1 = produce(s, (draft) => {
      const changed = runStateBasedActions(draft, ctx);
      expect(changed).toBe(true);
    });
    const e1 = Object.values(s1.board).find((x) => x.entityId === "u1");
    expect(e1).toBeDefined();
    expect(e1!.card.currentPower).toBe(3); // +2 buff removed, back to base 3
    expect(e1!.card.maxHealth).toBe(5);
    expect(e1!.card.currentHealth).toBe(5);
    expect(e1!.card.buffs.length).toBe(0);
    expect(events.some((e) => e.type === "buff_expired")).toBe(true);
  });

  it("keeps permanent buffs (expiresAtTurn = -1) across turns", () => {
    let s = buildBareState({ turnNumber: 10 });
    s = placeUnit(s, "u1", "x", 0, 2, 2, { currentPower: 5, maxHealth: 7, currentHealth: 7 });
    s = produce(s, (draft) => {
      const e = Object.values(draft.board).find((x) => x.entityId === "u1");
      if (!e) throw new Error("missing");
      e.card.buffs = [
        { source: "enchant", powerDelta: 2, healthDelta: 2, expiresAtTurn: -1 },
      ];
    });
    const { ctx } = ctxFor(s);
    const s1 = produce(s, (draft) => {
      const changed = runStateBasedActions(draft, ctx);
      expect(changed).toBe(false);
    });
    const e1 = Object.values(s1.board).find((x) => x.entityId === "u1");
    expect(e1!.card.buffs.length).toBe(1);
  });

  it("clamps currentHealth when a +health buff expires while damaged", () => {
    let s = buildBareState({ turnNumber: 5 });
    s = placeUnit(s, "u1", "x", 0, 2, 2, { currentPower: 2, maxHealth: 5, currentHealth: 4 });
    // +0/+3 buff expiring at turn 3.
    s = produce(s, (draft) => {
      const e = Object.values(draft.board).find((x) => x.entityId === "u1");
      if (!e) throw new Error("missing");
      e.card.maxHealth += 3;
      e.card.currentHealth += 3; // now 7/8
      e.card.buffs = [
        { source: "spell_x", powerDelta: 0, healthDelta: 3, expiresAtTurn: 3 },
      ];
    });
    const { ctx } = ctxFor(s);
    const s1 = produce(s, (draft) => {
      runStateBasedActions(draft, ctx);
    });
    const e1 = Object.values(s1.board).find((x) => x.entityId === "u1");
    // maxHealth back to 5; currentHealth was 7 so should clamp to 5.
    expect(e1!.card.maxHealth).toBe(5);
    expect(e1!.card.currentHealth).toBe(5);
  });
});
