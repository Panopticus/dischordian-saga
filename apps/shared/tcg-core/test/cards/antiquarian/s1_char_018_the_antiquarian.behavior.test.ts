/**
 * Behavioral golden tests for s1_char_018 — The Antiquarian.
 *
 * Exercises the evolve sequence end-to-end via the interpreter:
 *  1. on_deploy seeds 4 forcefield_charges.
 *  2. Ticking the kill counter to 4 fires the evolve ability:
 *     - permanent +2/+2 buff
 *     - Celerity keyword granted
 *     - kill counter reset
 *
 * These drive the interpreter directly rather than going through the
 * reducer's trigger queue. A future commit will thread trigger
 * dispatch through the queue, at which point these tests stay green
 * unchanged (the interpreter is already the authoritative resolver).
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import type { GameEvent } from "../../../index";
import type { Effect as EffectTree } from "../../../engine/effectInterpreter";
import {
  interpret,
  makeExecCtx,
  createRng,
  evaluateCondition,
} from "../../../index";
import type { ReduceCtx } from "../../../engine/reducer";
import { cardDef } from "../../../cards/definitions/antiquarian/s1_char_018_the_antiquarian";
import { buildBareState, placeUnit, emptyRegistry } from "../../fixtures/stateBuilder";
import type { EntityId, Side } from "../../../types/Ids";
import type { Condition } from "../../../types/Effect";

function makeReduceCtx(events: GameEvent[], rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry: emptyRegistry,
  };
}

const ANT_ID = "ant_body" as EntityId;

function stateWithAntiquarian(): ReturnType<typeof buildBareState> {
  // Plant the Antiquarian on the board with its base stats so the evolve
  // buff's before/after is measurable.
  return placeUnit(
    buildBareState({ seed: "antiquarian" }),
    ANT_ID,
    "s1_char_018",
    0,
    2,
    2,
    { currentPower: 12, maxHealth: 11, currentHealth: 11 }
  );
}

describe("s1_char_018 — The Antiquarian (behavior)", () => {
  it("on_deploy adds 4 forcefield_charges counters", () => {
    const s0 = stateWithAntiquarian();
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: ANT_ID });
    const events: GameEvent[] = [];

    const s1 = produce(s0, (draft) => {
      interpret(
        cardDef.abilities[0].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx(events, draft.rngState)
      );
    });

    const ant = Object.values(s1.board).find((e) => e.entityId === ANT_ID);
    expect(ant!.card.counters.forcefield_charges).toBe(4);
    expect(events.some((e) => e.type === "counter_added")).toBe(true);
  });

  it("kill tick ability increments antiquarian_kills by 1", () => {
    const s0 = stateWithAntiquarian();
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: ANT_ID });
    const events: GameEvent[] = [];

    const s1 = produce(s0, (draft) => {
      interpret(
        cardDef.abilities[1].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx(events, draft.rngState)
      );
    });

    const ant = Object.values(s1.board).find((e) => e.entityId === ANT_ID);
    expect(ant!.card.counters.antiquarian_kills).toBe(1);
  });

  it("evolve condition is false at 3 kills, true at 4 kills", () => {
    let s = stateWithAntiquarian();
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: ANT_ID });

    // Tick 3 kills.
    for (let i = 0; i < 3; i++) {
      s = produce(s, (draft) => {
        interpret(
          cardDef.abilities[1].effect as EffectTree,
          ctx,
          draft,
          makeReduceCtx([], draft.rngState)
        );
      });
    }
    // Condition should be false.
    {
      const cond = cardDef.abilities[2].condition as Condition;
      const result = produce(s, () => {})
        // run evaluateCondition against the immutable state
        ;
      const check = evaluateCondition(cond, ctx, result);
      expect(check).toBe(false);
    }
    // Tick the 4th kill.
    s = produce(s, (draft) => {
      interpret(
        cardDef.abilities[1].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx([], draft.rngState)
      );
    });
    {
      const cond = cardDef.abilities[2].condition as Condition;
      const check = evaluateCondition(cond, ctx, s);
      expect(check).toBe(true);
    }
  });

  it("evolve effect applies +2/+2 permanent, grants celerity, resets counter", () => {
    // Pre-tick the kill counter to 4 directly, then run the evolve effect.
    let s = stateWithAntiquarian();
    s = produce(s, (draft) => {
      const ant = Object.values(draft.board).find((e) => e.entityId === ANT_ID);
      if (!ant) throw new Error("missing antiquarian");
      ant.card.counters.antiquarian_kills = 4;
    });

    const ctx = makeExecCtx(0 as Side, { sourceEntityId: ANT_ID });
    const events: GameEvent[] = [];

    const s1 = produce(s, (draft) => {
      interpret(
        cardDef.abilities[2].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx(events, draft.rngState)
      );
    });

    const ant = Object.values(s1.board).find((e) => e.entityId === ANT_ID);
    // Base stats were 12/11. After +2/+2 permanent:
    expect(ant!.card.currentPower).toBe(14);
    expect(ant!.card.maxHealth).toBe(13);
    expect(ant!.card.currentHealth).toBe(13);
    // Celerity granted.
    expect(ant!.card.activeKeywords).toContain("celerity");
    // Counter reset to 0 (floor of add_counter with negative amount).
    expect(ant!.card.counters.antiquarian_kills).toBe(0);
    // A permanent buff was recorded on the CardInstance for later dispel
    // handling.
    expect(ant!.card.buffs.length).toBe(1);
    expect(ant!.card.buffs[0].powerDelta).toBe(2);
    expect(ant!.card.buffs[0].healthDelta).toBe(2);
    expect(ant!.card.buffs[0].expiresAtTurn).toBe(-1);
    // Events fired: buff_applied, keyword_granted, counter_added(reset).
    expect(events.some((e) => e.type === "buff_applied")).toBe(true);
    expect(events.some((e) => e.type === "keyword_granted")).toBe(true);
  });
});
