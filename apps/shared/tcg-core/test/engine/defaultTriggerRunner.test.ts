/**
 * End-to-end trigger dispatch test.
 *
 * Installs the default trigger runner (interpreter-backed) into the
 * reducer's plug-point, enqueues a PendingTrigger for a real card's
 * ability, drains the queue, and asserts the effect actually ran on
 * the draft.
 *
 * This is the first test that exercises:
 *   trigger queue → default runner → effect interpreter → state change
 * as a single pipeline with real authored card data. Everything from
 * here on just adds more ops to the interpreter; the dispatch plumbing
 * is proven.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { produce } from "immer";
import type { GameEvent, ReduceResult } from "../../index";
import {
  setTriggerEffectRunner,
  resetTriggerEffectRunner,
  createDefaultTriggerRunner,
  drainTriggerQueue,
  enqueueTrigger,
  createRng,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
} from "../../index";
import type { ReduceCtx } from "../../engine/reducer";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";
import type { EntityId } from "../../types/Ids";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

function ctxFor(events: GameEvent[], rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry,
  };
}

describe("default trigger runner → effect interpreter", () => {
  beforeEach(() => {
    setTriggerEffectRunner(createDefaultTriggerRunner());
  });
  afterEach(() => {
    resetTriggerEffectRunner();
  });

  it("dispatches Antiquarian's on_deploy ability through the queue", () => {
    const ANT: EntityId = "ant_1" as EntityId;
    const s0 = placeUnit(
      buildBareState({ seed: "trigger-dispatch" }),
      ANT,
      "s1_char_018",
      0,
      2,
      2,
      { currentPower: 12, maxHealth: 11, currentHealth: 11 }
    );

    const events: GameEvent[] = [];

    const s1 = produce(s0, (draft) => {
      // Enqueue the on_deploy trigger (ability index 0 for Antiquarian).
      enqueueTrigger(draft, {
        sourceEntityId: ANT,
        sourceOwner: 0,
        sourceRow: 2,
        sourceCol: 2,
        abilityIdx: 0,
        context: {},
      });
      drainTriggerQueue(draft, ctxFor(events, draft.rngState), createDefaultTriggerRunner());
    });

    const ant = Object.values(s1.board).find((e) => e.entityId === ANT);
    expect(ant!.card.counters.forcefield_charges).toBe(4);

    const fired = events.find((e) => e.type === "trigger_fired");
    expect(fired).toMatchObject({
      sourceId: ANT,
      abilityId: "ant_forcefield_4",
    });

    // counter_added was emitted downstream of the trigger
    expect(events.some((e) => e.type === "counter_added")).toBe(true);
  });

  it("fizzles if the source entity is no longer on the board", () => {
    const ANT: EntityId = "ant_fizzle" as EntityId;
    const s0 = buildBareState({ seed: "fizzle" });
    // Don't place the entity — just enqueue a trigger naming it.

    const events: GameEvent[] = [];

    const s1 = produce(s0, (draft) => {
      enqueueTrigger(draft, {
        sourceEntityId: ANT,
        sourceOwner: 0,
        sourceRow: 0,
        sourceCol: 0,
        abilityIdx: 0,
        context: {},
      });
      drainTriggerQueue(draft, ctxFor(events, draft.rngState), createDefaultTriggerRunner());
    });

    // Queue was drained, but the runner silently dropped the trigger.
    expect(s1.triggerQueue.length).toBe(0);
    expect(events.some((e) => e.type === "trigger_fired")).toBe(false);
  });

  it("respects ability guard conditions (Antiquarian evolve only fires at 4 kills)", () => {
    const ANT: EntityId = "ant_2" as EntityId;
    let s = placeUnit(
      buildBareState({ seed: "guarded" }),
      ANT,
      "s1_char_018",
      0,
      2,
      2,
      { currentPower: 12, maxHealth: 11, currentHealth: 11 }
    );

    // Pre-tick kills to 3 — below the evolve threshold.
    s = produce(s, (draft) => {
      const ant = Object.values(draft.board).find((e) => e.entityId === ANT);
      if (!ant) throw new Error("missing");
      ant.card.counters.antiquarian_kills = 3;
    });

    const events: GameEvent[] = [];

    const s1 = produce(s, (draft) => {
      // abilityIdx 2 is evolve-at-4.
      enqueueTrigger(draft, {
        sourceEntityId: ANT,
        sourceOwner: 0,
        sourceRow: 2,
        sourceCol: 2,
        abilityIdx: 2,
        context: {},
      });
      drainTriggerQueue(draft, ctxFor(events, draft.rngState), createDefaultTriggerRunner());
    });

    const ant = Object.values(s1.board).find((e) => e.entityId === ANT);
    // Guard condition failed → no buff, no keyword grant.
    expect(ant!.card.currentPower).toBe(12);
    expect(ant!.card.activeKeywords).not.toContain("celerity");
    // And no trigger_fired event.
    expect(events.some((e) => e.type === "trigger_fired")).toBe(false);

    // Now bump to 4 kills and re-enqueue.
    const s2 = produce(s1, (draft) => {
      const a = Object.values(draft.board).find((e) => e.entityId === ANT);
      if (!a) throw new Error("missing");
      a.card.counters.antiquarian_kills = 4;
      enqueueTrigger(draft, {
        sourceEntityId: ANT,
        sourceOwner: 0,
        sourceRow: 2,
        sourceCol: 2,
        abilityIdx: 2,
        context: {},
      });
      drainTriggerQueue(draft, ctxFor(events, draft.rngState), createDefaultTriggerRunner());
    });

    const a2 = Object.values(s2.board).find((e) => e.entityId === ANT);
    expect(a2!.card.currentPower).toBe(14);
    expect(a2!.card.activeKeywords).toContain("celerity");
    expect(events.some((e) => e.type === "trigger_fired")).toBe(true);
  });
});

// Placate unused-imports lint rule — these symbols exist here because
// the default runner signature flows through ReduceResult in the
// full reducer integration tests we'll add in the combat port.
void ({} as ReduceResult);
