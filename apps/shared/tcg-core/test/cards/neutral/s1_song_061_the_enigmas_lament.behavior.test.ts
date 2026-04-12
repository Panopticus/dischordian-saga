/**
 * Behavioral golden tests for s1_song_061 — The Enigma's Lament.
 *
 * Drives the effect interpreter directly on the authored ability tree,
 * without routing through the full reducer (card play handler lands in
 * a later commit with the combat/movement port). The test constructs a
 * GameState with a target unit, calls `interpret()` with an ExecCtx
 * carrying the player's chosen target id, and asserts the counter
 * appeared on the target.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import type { GameEvent } from "../../../index";
import type { Effect as EffectTree } from "../../../engine/effectInterpreter";
import { interpret, makeExecCtx, createRng } from "../../../index";
import type { ReduceCtx } from "../../../engine/reducer";
import { cardDef } from "../../../cards/definitions/neutral/s1_song_061_the_enigmas_lament";
import {
  buildBareState,
  placeUnit,
  emptyRegistry,
} from "../../fixtures/stateBuilder";
import type { EntityId, Side } from "../../../types/Ids";

function makeReduceCtx(events: GameEvent[], rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry: emptyRegistry,
  };
}

describe("s1_song_061 — The Enigma's Lament (behavior)", () => {
  it("adds 2 forcefield_charges to the chosen friendly target", () => {
    let s = buildBareState({ seed: "lament-1" });
    s = placeUnit(s, "target_unit", "test_target", 0, 2, 2);

    const events: GameEvent[] = [];
    const ctx = makeExecCtx(0 as Side, {
      playerChosenTargetId: "target_unit" as EntityId,
    });

    const next = produce(s, (draft) => {
      const reduceCtx = makeReduceCtx(events, draft.rngState);
      interpret(
        cardDef.abilities[0].effect as EffectTree,
        ctx,
        draft,
        reduceCtx
      );
    });

    const hit = Object.values(next.board).find((e) => e.entityId === "target_unit");
    expect(hit).toBeDefined();
    expect(hit!.card.counters.forcefield_charges).toBe(2);

    const counterEvents = events.filter((e) => e.type === "counter_added");
    expect(counterEvents.length).toBe(1);
    expect(counterEvents[0]).toMatchObject({
      type: "counter_added",
      targetId: "target_unit",
      counterKind: "forcefield_charges",
      delta: 2,
      newValue: 2,
    });
  });

  it("stacks counters when cast twice on the same target", () => {
    let s = buildBareState({ seed: "lament-2" });
    s = placeUnit(s, "u1", "test", 0, 2, 2);
    const ctx = makeExecCtx(0 as Side, {
      playerChosenTargetId: "u1" as EntityId,
    });
    let events: GameEvent[] = [];

    s = produce(s, (draft) => {
      interpret(
        cardDef.abilities[0].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx(events, draft.rngState)
      );
    });
    events = [];
    s = produce(s, (draft) => {
      interpret(
        cardDef.abilities[0].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx(events, draft.rngState)
      );
    });

    const hit = Object.values(s.board).find((e) => e.entityId === "u1");
    expect(hit!.card.counters.forcefield_charges).toBe(4);
  });

  it("is a no-op when no target is chosen", () => {
    const s = buildBareState({ seed: "lament-3" });
    const ctx = makeExecCtx(0 as Side, {
      playerChosenTargetId: undefined,
    });
    const events: GameEvent[] = [];
    const next = produce(s, (draft) => {
      interpret(
        cardDef.abilities[0].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx(events, draft.rngState)
      );
    });
    // Nothing changed: graveyards, board, counters all identical.
    expect(next).toEqual(s);
    expect(events.length).toBe(0);
  });

  it("fails to target enemy units (filter: controller self)", () => {
    let s = buildBareState({ seed: "lament-4" });
    s = placeUnit(s, "enemy", "test", 1, 2, 5);
    const ctx = makeExecCtx(0 as Side, {
      playerChosenTargetId: "enemy" as EntityId,
    });
    const events: GameEvent[] = [];
    const next = produce(s, (draft) => {
      interpret(
        cardDef.abilities[0].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx(events, draft.rngState)
      );
    });
    const hit = Object.values(next.board).find((e) => e.entityId === "enemy");
    expect(hit!.card.counters.forcefield_charges ?? 0).toBe(0);
    expect(events.length).toBe(0);
  });
});
