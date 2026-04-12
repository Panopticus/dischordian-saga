/**
 * Trigger queue tests.
 *
 * Validates APNAP ordering, deterministic tie-breaking, mid-drain enqueue
 * handling, and the safety cap. Uses a recording stub runner so we can
 * assert ordering without needing the full effect interpreter.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import {
  drainTriggerQueue,
  enqueueTrigger,
  TRIGGER_DRAIN_CAP,
  type TriggerEffectRunner,
} from "../../engine/triggerQueue";
import type { ReduceCtx } from "../../engine/reducer";
import type { GameState, PendingTrigger } from "../../types/GameState";
import type { GameEvent } from "../../types/Event";
import { createRng } from "../../engine/rng";
import { buildBareState, emptyRegistry } from "../fixtures/stateBuilder";

function ctxFor(state: GameState): { ctx: ReduceCtx; events: GameEvent[] } {
  const events: GameEvent[] = [];
  return {
    events,
    ctx: {
      events,
      rng: createRng(state.rngState, true),
      registry: emptyRegistry,
    },
  };
}

/** A recording runner that appends trigger ids to an external log. */
function recordingRunner(log: string[]): TriggerEffectRunner {
  return (_draft, pending) => {
    log.push(pending.sourceEntityId);
  };
}

describe("trigger queue", () => {
  it("returns false on empty queue", () => {
    const s0 = buildBareState();
    const { ctx } = ctxFor(s0);
    const log: string[] = [];
    const s1 = produce(s0, (draft) => {
      const drained = drainTriggerQueue(draft, ctx, recordingRunner(log));
      expect(drained).toBe(false);
    });
    expect(s1).toBe(s0);
    expect(log.length).toBe(0);
  });

  it("drains a single trigger and returns true", () => {
    let s0 = buildBareState();
    s0 = produce(s0, (draft) => {
      enqueueTrigger(draft, {
        sourceEntityId: "e1",
        sourceOwner: 0,
        sourceRow: 0,
        sourceCol: 0,
        abilityIdx: 0,
        context: {},
      });
    });
    const { ctx } = ctxFor(s0);
    const log: string[] = [];
    const s1 = produce(s0, (draft) => {
      const drained = drainTriggerQueue(draft, ctx, recordingRunner(log));
      expect(drained).toBe(true);
    });
    expect(log).toEqual(["e1"]);
    expect(s1.triggerQueue.length).toBe(0);
  });

  it("drains triggers APNAP — active player's triggers first", () => {
    // Active player is P0. Enqueue P1 trigger first to prove ordering wins
    // over insertion order.
    let s0 = buildBareState({ currentPlayer: 0 });
    s0 = produce(s0, (draft) => {
      enqueueTrigger(draft, {
        sourceEntityId: "p1_unit",
        sourceOwner: 1,
        sourceRow: 0,
        sourceCol: 0,
        abilityIdx: 0,
        context: {},
      });
      enqueueTrigger(draft, {
        sourceEntityId: "p0_unit",
        sourceOwner: 0,
        sourceRow: 4,
        sourceCol: 4,
        abilityIdx: 0,
        context: {},
      });
    });
    const { ctx } = ctxFor(s0);
    const log: string[] = [];
    produce(s0, (draft) => {
      drainTriggerQueue(draft, ctx, recordingRunner(log));
    });
    expect(log).toEqual(["p0_unit", "p1_unit"]);
  });

  it("within same owner, orders by (row, col, entityId, abilityIdx)", () => {
    let s0 = buildBareState({ currentPlayer: 0 });
    s0 = produce(s0, (draft) => {
      // Intentionally shuffled insert order.
      enqueueTrigger(draft, {
        sourceEntityId: "z",
        sourceOwner: 0,
        sourceRow: 3,
        sourceCol: 1,
        abilityIdx: 0,
        context: {},
      });
      enqueueTrigger(draft, {
        sourceEntityId: "a",
        sourceOwner: 0,
        sourceRow: 2,
        sourceCol: 5,
        abilityIdx: 0,
        context: {},
      });
      enqueueTrigger(draft, {
        sourceEntityId: "b",
        sourceOwner: 0,
        sourceRow: 2,
        sourceCol: 5,
        abilityIdx: 1,
        context: {},
      });
      enqueueTrigger(draft, {
        sourceEntityId: "m",
        sourceOwner: 0,
        sourceRow: 2,
        sourceCol: 4,
        abilityIdx: 0,
        context: {},
      });
    });
    const { ctx } = ctxFor(s0);
    const log: string[] = [];
    produce(s0, (draft) => {
      drainTriggerQueue(draft, ctx, recordingRunner(log));
    });
    // Expected: row 2 col 4 "m", row 2 col 5 "a" (ability 0), row 2 col 5
    // "b" (ability 1), row 3 col 1 "z".
    expect(log).toEqual(["m", "a", "b", "z"]);
  });

  it("handles mid-drain enqueue correctly (chained triggers)", () => {
    let s0 = buildBareState({ currentPlayer: 0 });
    s0 = produce(s0, (draft) => {
      enqueueTrigger(draft, {
        sourceEntityId: "seed",
        sourceOwner: 0,
        sourceRow: 0,
        sourceCol: 0,
        abilityIdx: 0,
        context: {},
      });
    });
    const { ctx } = ctxFor(s0);
    const log: string[] = [];
    // Runner that enqueues a follow-on trigger the first time it fires.
    let chained = false;
    const runner: TriggerEffectRunner = (draft, pending) => {
      log.push(pending.sourceEntityId);
      if (!chained) {
        chained = true;
        enqueueTrigger(draft, {
          sourceEntityId: "follow",
          sourceOwner: 0,
          sourceRow: 1,
          sourceCol: 0,
          abilityIdx: 0,
          context: {},
        });
      }
    };
    produce(s0, (draft) => {
      drainTriggerQueue(draft, ctx, runner);
    });
    expect(log).toEqual(["seed", "follow"]);
  });

  it("throws if drain exceeds the safety cap", () => {
    let s0 = buildBareState({ currentPlayer: 0 });
    s0 = produce(s0, (draft) => {
      enqueueTrigger(draft, {
        sourceEntityId: "inf",
        sourceOwner: 0,
        sourceRow: 0,
        sourceCol: 0,
        abilityIdx: 0,
        context: {},
      });
    });
    const { ctx } = ctxFor(s0);
    // Runner that infinitely re-enqueues itself.
    const runner: TriggerEffectRunner = (draft, _pending) => {
      enqueueTrigger(draft, {
        sourceEntityId: "inf",
        sourceOwner: 0,
        sourceRow: 0,
        sourceCol: 0,
        abilityIdx: 0,
        context: {},
      });
    };
    expect(() =>
      produce(s0, (draft) => {
        drainTriggerQueue(draft, ctx, runner);
      })
    ).toThrow(new RegExp(String(TRIGGER_DRAIN_CAP)));
  });

  it("sort key has a stable shape for reproducibility", () => {
    let s0 = buildBareState({ currentPlayer: 1 });
    s0 = produce(s0, (draft) => {
      enqueueTrigger(draft, {
        sourceEntityId: "e",
        sourceOwner: 1,
        sourceRow: 2,
        sourceCol: 3,
        abilityIdx: 4,
        context: {},
      });
    });
    const pending: PendingTrigger = s0.triggerQueue[0];
    // ownerPriority 0 because P1 is the active player.
    expect(pending.sortKey).toEqual([0, 2, 3, "e", 4]);
  });
});
