/**
 * Behavioral tests for the `choose_one` and `push` effect ops.
 *
 * Drives the interpreter directly (matches the repeatTeleport pattern).
 * No card-loader involvement — fixtures use the bare state builder and
 * synthetic entities.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import type { GameEvent } from "../../index";
import type { Effect as EffectTree } from "../../engine/effectInterpreter";
import {
  interpret,
  makeExecCtx,
  createRng,
} from "../../index";
import type { ReduceCtx } from "../../engine/reducer";
import { buildBareState, placeUnit, emptyRegistry } from "../fixtures/stateBuilder";
import type { EntityId, Side } from "../../types/Ids";

function makeReduceCtx(events: GameEvent[], rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry: emptyRegistry,
  };
}

describe("choose_one op", () => {
  it("picks the option at chooseIndex and applies its effect", () => {
    const SRC_ID = "src" as EntityId;
    const s0 = placeUnit(buildBareState({ seed: "co-pick" }), SRC_ID, "tok_x", 0, 1, 1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID, chooseIndex: 1 });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "choose_one",
      options: [
        {
          text: "+1 power",
          effect: {
            op: "buff",
            stats: { power: 1, health: 0 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        },
        {
          text: "+0/+3",
          effect: {
            op: "buff",
            stats: { power: 0, health: 3 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        },
      ],
    };

    const s1 = produce(s0, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const src = Object.values(s1.board).find((e) => e.entityId === SRC_ID)!;
    // Option 1 chosen: +0/+3 only.
    expect(src.card.currentPower).toBe(2);
    expect(src.card.maxHealth).toBe(6);
    expect(events.filter((e) => e.type === "buff_applied")).toHaveLength(1);
  });

  it("undefined chooseIndex falls back to option 0", () => {
    const SRC_ID = "src" as EntityId;
    const s0 = placeUnit(buildBareState({ seed: "co-default" }), SRC_ID, "tok_x", 0, 1, 1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "choose_one",
      options: [
        {
          text: "draw 1",
          effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
        },
        {
          text: "+5 power",
          effect: {
            op: "buff",
            stats: { power: 5, health: 0 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        },
      ],
    };

    const s1 = produce(s0, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const src = Object.values(s1.board).find((e) => e.entityId === SRC_ID)!;
    // Option 0 (draw) chosen: stats unchanged. Deck is empty so we expect
    // a card_burned event from drawing into an empty deck.
    expect(src.card.currentPower).toBe(2);
    expect(events.some((e) => e.type === "card_burned")).toBe(true);
  });

  it("out-of-range chooseIndex clamps to option 0", () => {
    const SRC_ID = "src" as EntityId;
    const s0 = placeUnit(buildBareState({ seed: "co-clamp" }), SRC_ID, "tok_x", 0, 1, 1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID, chooseIndex: 99 });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "choose_one",
      options: [
        {
          text: "+2/+0",
          effect: {
            op: "buff",
            stats: { power: 2, health: 0 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        },
        {
          text: "+0/+5",
          effect: {
            op: "buff",
            stats: { power: 0, health: 5 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        },
      ],
    };

    const s1 = produce(s0, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const src = Object.values(s1.board).find((e) => e.entityId === SRC_ID)!;
    // Clamped to option 0: +2 power.
    expect(src.card.currentPower).toBe(4);
    expect(src.card.maxHealth).toBe(3);
  });

  it("empty options array is a no-op", () => {
    const SRC_ID = "src" as EntityId;
    const s0 = placeUnit(buildBareState({ seed: "co-empty" }), SRC_ID, "tok_x", 0, 1, 1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID, chooseIndex: 0 });
    const events: GameEvent[] = [];

    const effect: EffectTree = { op: "choose_one", options: [] };

    const s1 = produce(s0, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    expect(events).toHaveLength(0);
    const src = Object.values(s1.board).find((e) => e.entityId === SRC_ID)!;
    expect(src.card.currentPower).toBe(2);
  });
});

describe("push op", () => {
  it("specific direction: moves target N tiles and emits pushed event", () => {
    const SRC_ID = "src" as EntityId;
    const TGT_ID = "tgt" as EntityId;
    let s = placeUnit(buildBareState({ seed: "push-spec" }), SRC_ID, "tok_x", 0, 1, 1);
    s = placeUnit(s, TGT_ID, "tok_x", 1, 1, 3);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "push",
      target: { kind: "previous_target" },
      direction: { kind: "specific", dRow: 0, dCol: 1 },
      distance: 2,
    };

    // Place TGT_ID into previousTarget so { kind: "previous_target" } resolves.
    const s1 = produce(s, (draft) => {
      interpret(effect, { ...ctx, previousTarget: TGT_ID }, draft, makeReduceCtx(events, draft.rngState));
    });

    expect(s1.board["1,3"]).toBeUndefined();
    const moved = s1.board["1,5"];
    expect(moved?.entityId).toBe(TGT_ID);
    const ev = events.find((e) => e.type === "pushed");
    expect(ev).toMatchObject({
      type: "pushed",
      entityId: TGT_ID,
      toRow: 1,
      toCol: 5,
      distance: 2,
    });
  });

  it("away_from_source: pushes target along the dominant axis", () => {
    const SRC_ID = "src" as EntityId;
    const TGT_ID = "tgt" as EntityId;
    // Source at (1,1), target at (1,4): dCol=3, dRow=0 → push +1 col.
    let s = placeUnit(buildBareState({ seed: "push-away" }), SRC_ID, "tok_x", 0, 1, 1);
    s = placeUnit(s, TGT_ID, "tok_x", 1, 1, 4);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID, previousTarget: TGT_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "push",
      target: { kind: "previous_target" },
      direction: { kind: "away_from_source" },
      distance: 3,
    };

    const s1 = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    // Pushed to (1,7).
    expect(s1.board["1,4"]).toBeUndefined();
    expect(s1.board["1,7"]?.entityId).toBe(TGT_ID);
    const ev = events.find((e) => e.type === "pushed");
    expect(ev).toMatchObject({ entityId: TGT_ID, toRow: 1, toCol: 7, distance: 3 });
  });

  it("stops at occupied tile, emits actual distance moved", () => {
    const SRC_ID = "src" as EntityId;
    const TGT_ID = "tgt" as EntityId;
    let s = placeUnit(buildBareState({ seed: "push-block" }), SRC_ID, "tok_x", 0, 1, 1);
    s = placeUnit(s, TGT_ID, "tok_x", 1, 1, 3);
    s = placeUnit(s, "blocker" as EntityId, "tok_x", 0, 1, 5);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID, previousTarget: TGT_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "push",
      target: { kind: "previous_target" },
      direction: { kind: "specific", dRow: 0, dCol: 1 },
      distance: 5,
    };

    const s1 = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    // Target stops at (1,4) — one step short of the blocker.
    expect(s1.board["1,4"]?.entityId).toBe(TGT_ID);
    expect(s1.board["1,5"]?.entityId).toBe("blocker");
    const ev = events.find((e) => e.type === "pushed");
    expect(ev).toMatchObject({ toRow: 1, toCol: 4, distance: 1 });
  });

  it("stops at board edge, no event when wedged", () => {
    const TGT_ID = "tgt" as EntityId;
    // Target at column 8 (last column) — push east is impossible.
    const s = placeUnit(buildBareState({ seed: "push-edge" }), TGT_ID, "tok_x", 1, 1, 8);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: "noop" as EntityId, previousTarget: TGT_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "push",
      target: { kind: "previous_target" },
      direction: { kind: "specific", dRow: 0, dCol: 1 },
      distance: 3,
    };

    const s1 = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    expect(s1.board["1,8"]?.entityId).toBe(TGT_ID);
    expect(events.filter((e) => e.type === "pushed")).toHaveLength(0);
  });

  it("does not push generals", () => {
    // Friendly general lives at (2,0). Push it east — should be a no-op.
    const events: GameEvent[] = [];
    const s = buildBareState({ seed: "push-general" });
    const generalId = s.players[0].generalEntityId;
    const ctx = makeExecCtx(0 as Side, {
      sourceEntityId: "noop" as EntityId,
      previousTarget: generalId,
    });

    const effect: EffectTree = {
      op: "push",
      target: { kind: "previous_target" },
      direction: { kind: "specific", dRow: 0, dCol: 1 },
      distance: 2,
    };

    const s1 = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    expect(s1.board["2,0"]?.entityId).toBe(generalId);
    expect(events.filter((e) => e.type === "pushed")).toHaveLength(0);
  });

  it("zero distance is a no-op", () => {
    const TGT_ID = "tgt" as EntityId;
    const s = placeUnit(buildBareState({ seed: "push-zero" }), TGT_ID, "tok_x", 0, 1, 3);
    const ctx = makeExecCtx(0 as Side, { previousTarget: TGT_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "push",
      target: { kind: "previous_target" },
      direction: { kind: "specific", dRow: 0, dCol: 1 },
      distance: 0,
    };

    const s1 = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    expect(s1.board["1,3"]?.entityId).toBe(TGT_ID);
    expect(events.filter((e) => e.type === "pushed")).toHaveLength(0);
  });
});
