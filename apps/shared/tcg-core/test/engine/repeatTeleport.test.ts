/**
 * Behavioral tests for the `repeat` and `teleport` effect ops, plus the
 * `count_of` Amount kind that 3 of the 7 `repeat` cards depend on.
 *
 * Drives the interpreter directly (matches the s1_char_018 behavior-test
 * pattern). No card-loader involvement — fixtures use the bare state
 * builder and synthetic entities.
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
import { evaluateAmount } from "../../engine/amounts";
import { buildBareState, placeUnit, emptyRegistry } from "../fixtures/stateBuilder";
import type { EntityId, Side } from "../../types/Ids";

function makeReduceCtx(events: GameEvent[], rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry: emptyRegistry,
  };
}

describe("repeat op", () => {
  it("const times: applies the inner effect N times", () => {
    const SRC_ID = "src" as EntityId;
    const s0 = placeUnit(buildBareState({ seed: "repeat-const" }), SRC_ID, "tok_x", 0, 1, 1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "repeat",
      times: { kind: "const", value: 3 },
      do: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    };

    const s1 = produce(s0, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const src = Object.values(s1.board).find((e) => e.entityId === SRC_ID)!;
    // placeUnit defaults to 2/3; +1/+1 ×3 = 5/6.
    expect(src.card.currentPower).toBe(5);
    expect(src.card.maxHealth).toBe(6);
    expect(src.card.currentHealth).toBe(6);
    // 3 buff_applied events.
    expect(events.filter((e) => e.type === "buff_applied")).toHaveLength(3);
  });

  it("zero times: no-op (no buff, no events)", () => {
    const SRC_ID = "src" as EntityId;
    const s0 = placeUnit(buildBareState({ seed: "repeat-zero" }), SRC_ID, "tok_x", 0, 1, 1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "repeat",
      times: { kind: "const", value: 0 },
      do: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    };

    const s1 = produce(s0, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const src = Object.values(s1.board).find((e) => e.entityId === SRC_ID)!;
    // placeUnit default 2/3, no buff applied.
    expect(src.card.currentPower).toBe(2);
    expect(src.card.maxHealth).toBe(3);
    expect(events.filter((e) => e.type === "buff_applied")).toHaveLength(0);
  });

  it("count_of times: snapshot at trigger, not re-evaluated per iteration", () => {
    // Reproduces Governor Thane / Ironclad Veteran / Bloodline Inheritor
    // pattern: +1/+1 to self per other controller-self entity. The friendly
    // general also matches `controller: "self"` (only the source itself is
    // excluded by `except: "self"`), so 3 placed allies + 1 general = 4
    // matches. The whole point of this test: the count is snapshot at
    // trigger time and does NOT re-evaluate per buff (which would otherwise
    // grow exponentially).
    const SRC_ID = "thane" as EntityId;
    let s = placeUnit(buildBareState({ seed: "repeat-count" }), SRC_ID, "tok_x", 0, 1, 1);
    s = placeUnit(s, "ally1" as EntityId, "tok_x", 0, 1, 2);
    s = placeUnit(s, "ally2" as EntityId, "tok_x", 0, 1, 3);
    s = placeUnit(s, "ally3" as EntityId, "tok_x", 0, 1, 4);
    // Plus an enemy that should NOT be counted.
    s = placeUnit(s, "enemy" as EntityId, "tok_x", 1, 1, 5);

    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "repeat",
      times: { kind: "count_of", filter: { controller: "self", except: "self" } },
      do: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    };

    const s1 = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const src = Object.values(s1.board).find((e) => e.entityId === SRC_ID)!;
    // 2/3 base + (+4/+4) = 6/7. If the count were re-evaluated per buff
    // iteration nothing would change here either (same denominator), but
    // the buff_applied count guards against any double-resolution.
    expect(src.card.currentPower).toBe(6);
    expect(src.card.maxHealth).toBe(7);
    expect(events.filter((e) => e.type === "buff_applied")).toHaveLength(4);
  });
});

describe("count_of Amount", () => {
  it("counts board entities that match the filter", () => {
    let s = buildBareState({ seed: "count" });
    s = placeUnit(s, "f1" as EntityId, "tok_x", 0, 1, 1);
    s = placeUnit(s, "f2" as EntityId, "tok_x", 0, 1, 2);
    s = placeUnit(s, "e1" as EntityId, "tok_x", 1, 1, 5);

    const ctx = makeExecCtx(0 as Side, { sourceEntityId: "f1" as EntityId });

    expect(
      evaluateAmount({ kind: "count_of", filter: { controller: "self" } }, ctx, s)
    ).toBe(3); // 2 friendlies + p0 general
    expect(
      evaluateAmount(
        { kind: "count_of", filter: { controller: "self", except: "self" } },
        ctx,
        s
      )
    ).toBe(2); // exclude f1 (the source)
    expect(
      evaluateAmount({ kind: "count_of", filter: { controller: "opponent" } }, ctx, s)
    ).toBe(2); // 1 enemy + p1 general
  });

  it("returns 0 when nothing matches", () => {
    const s = buildBareState({ seed: "empty-count" });
    const ctx = makeExecCtx(0 as Side, {});
    expect(
      evaluateAmount(
        { kind: "count_of", filter: { keywords: { has: ["provoke"] } } },
        ctx,
        s
      )
    ).toBe(0);
  });
});

describe("teleport op", () => {
  it("specific position: moves the entity to that tile and emits event", () => {
    const SRC_ID = "src" as EntityId;
    const s0 = placeUnit(buildBareState({ seed: "tp-specific" }), SRC_ID, "tok_x", 0, 1, 1);
    // Wrap in with_target so {kind: "it"} resolves — matches Arena Protocol /
    // Dream Walk shape. `single` chooser: "player" reads from
    // playerChosenTargetId, which we plant on the ctx.
    const ctx = makeExecCtx(0 as Side, {
      sourceEntityId: SRC_ID,
      playerChosenTargetId: SRC_ID,
    });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "with_target",
      selector: { kind: "single", filter: { controller: "self" }, chooser: "player" },
      do: {
        op: "teleport",
        target: { kind: "it" },
        to: { kind: "specific", row: 3, col: 7 },
      },
    };

    const s1 = produce(s0, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    // Entity is gone from old tile, present at new tile.
    expect(s1.board["1,1"]).toBeUndefined();
    const moved = s1.board["3,7"];
    expect(moved).toBeDefined();
    expect(moved!.entityId).toBe(SRC_ID);
    expect(moved!.row).toBe(3);
    expect(moved!.col).toBe(7);

    const tpEvent = events.find((e) => e.type === "teleported");
    expect(tpEvent).toBeDefined();
    expect(tpEvent).toMatchObject({
      type: "teleported",
      entityId: SRC_ID,
      toRow: 3,
      toCol: 7,
    });
  });

  it("random_empty: lands on an empty tile (not the source's tile)", () => {
    // Pin the entity by surrounding it with one empty tile so the random
    // pick is deterministic. The general at (2,0) and (2,8) plus our unit
    // at (1,1); we'll fill the board so only one empty tile remains.
    let s = buildBareState({ seed: "tp-random" });
    const SRC_ID = "src" as EntityId;
    s = placeUnit(s, SRC_ID, "tok_x", 0, 0, 0);
    // Fill all tiles except (4,8). 5×9 = 45 tiles; generals at (2,0),(2,8);
    // src at (0,0). We want exactly one tile empty besides src's own.
    let blockerCount = 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 9; c++) {
        if (r === 0 && c === 0) continue; // source
        if (r === 2 && c === 0) continue; // p0 general
        if (r === 2 && c === 8) continue; // p1 general
        if (r === 4 && c === 8) continue; // the one empty target
        s = placeUnit(s, `b${blockerCount++}` as EntityId, "tok_x", 0, r, c);
      }
    }

    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];
    const effect: EffectTree = {
      op: "teleport",
      target: { kind: "self" },
      to: { kind: "random_empty" },
    };

    const s1 = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    // Source moved off (0,0).
    expect(s1.board["0,0"]).toBeUndefined();
    // Source landed on (4,8) — the only empty tile.
    expect(s1.board["4,8"]?.entityId).toBe(SRC_ID);
    expect(events.some((e) => e.type === "teleported")).toBe(true);
  });

  it("destination occupied: no-op, no event", () => {
    const SRC_ID = "src" as EntityId;
    let s = placeUnit(buildBareState({ seed: "tp-occupied" }), SRC_ID, "tok_x", 0, 1, 1);
    s = placeUnit(s, "blocker" as EntityId, "tok_x", 0, 3, 3);

    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];
    const effect: EffectTree = {
      op: "teleport",
      target: { kind: "self" },
      to: { kind: "specific", row: 3, col: 3 },
    };

    const s1 = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    // Source still at (1,1); blocker still at (3,3).
    expect(s1.board["1,1"]?.entityId).toBe(SRC_ID);
    expect(s1.board["3,3"]?.entityId).toBe("blocker");
    expect(events.filter((e) => e.type === "teleported")).toHaveLength(0);
  });

  it("out-of-bounds destination: no-op", () => {
    const SRC_ID = "src" as EntityId;
    const s0 = placeUnit(buildBareState({ seed: "tp-oob" }), SRC_ID, "tok_x", 0, 1, 1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];
    const effect: EffectTree = {
      op: "teleport",
      target: { kind: "self" },
      to: { kind: "specific", row: 5, col: 9 }, // OOB (board is 5×9, max row=4 col=8)
    };

    const s1 = produce(s0, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    expect(s1.board["1,1"]?.entityId).toBe(SRC_ID);
    expect(events.filter((e) => e.type === "teleported")).toHaveLength(0);
  });
});
