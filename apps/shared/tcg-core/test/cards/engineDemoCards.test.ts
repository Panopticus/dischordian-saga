/**
 * Runtime tests for the Phase H1 engine demo cards. Each card
 * exercises one engine surface the audit annotated as "// reserved":
 *
 *   - Cut the Threads (s1_neutral_dispel_001) → op: "dispel"
 *   - Tidewall (s1_neutral_push_001)          → op: "push"
 *   - Witness Whose Time Has Come (...if_001) → op: "if"
 *   - The Anchor of Kael (...struct_001)      → keyword: "structure"
 *
 * Schema validation is covered by the global cardDefinitionSchema
 * load at registry build time; these tests focus on the runtime
 * effect interpretation + flag propagation that the audit's
 * "reserved" annotation cast doubt on.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";

import { ALL_CARD_DEFINITIONS } from "../../cards";
import { ENGINE_DEMO_CARDS } from "../../cards/definitions/neutral/engine_demo_cards";
import type { GameEvent } from "../../index";
import type { Effect as EffectTree } from "../../engine/effectInterpreter";
import {
  interpret,
} from "../../engine/effectInterpreter";
import { makeExecCtx } from "../../engine/execCtx";
import type { ReduceCtx } from "../../engine/reducer";
import { buildBareState, placeUnit, emptyRegistry } from "../fixtures/stateBuilder";
import type { EntityId, Side } from "../../types/Ids";
import { createRng } from "../../index";

function makeReduceCtx(events: GameEvent[], rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry: emptyRegistry,
  };
}

describe("Engine demo cards — registry membership", () => {
  it("all 4 H1 cards are registered in ALL_CARD_DEFINITIONS", () => {
    const ids = new Set<string>(ALL_CARD_DEFINITIONS.map((c) => c.id as unknown as string));
    expect(ids.has("s1_neutral_dispel_001")).toBe(true);
    expect(ids.has("s1_neutral_push_001")).toBe(true);
    expect(ids.has("s1_neutral_if_001")).toBe(true);
    expect(ids.has("s1_neutral_struct_001")).toBe(true);
  });

  it("ENGINE_DEMO_CARDS exports at least the 4 H1 entries", () => {
    // The set grows as Phase H subphases land; pin the floor so removals
    // are caught while permitting H2..H7 additions to extend.
    expect(ENGINE_DEMO_CARDS.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Cut the Threads (dispel) — runtime", () => {
  it("strips active keywords from the chosen target", () => {
    const SRC_ID = "src" as EntityId;
    const TGT_ID = "tgt" as EntityId;
    let s = placeUnit(buildBareState({ seed: "dispel-test" }), SRC_ID, "tok_x", 0, 1, 1);
    s = placeUnit(s, TGT_ID, "tok_x", 1, 1, 3);
    // Pre-load a keyword the dispel should strip.
    s = produce(s, (draft) => {
      const cell = draft.board["1,3"];
      if (cell) {
        cell.card.activeKeywords = ["rush"];
      }
    });
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID, previousTarget: TGT_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = { op: "dispel", to: { kind: "previous_target" } };
    const next = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const after = next.board["1,3"];
    expect(after).toBeDefined();
    expect(after?.card.activeKeywords).toEqual([]);
  });
});

describe("Tidewall (push) — runtime", () => {
  it("pushes the target away from source by the configured distance", () => {
    const SRC_ID = "src" as EntityId;
    const TGT_ID = "tgt" as EntityId;
    let s = placeUnit(buildBareState({ seed: "tw-test" }), SRC_ID, "tok_x", 0, 1, 1);
    s = placeUnit(s, TGT_ID, "tok_x", 1, 1, 3);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID, previousTarget: TGT_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "push",
      target: { kind: "previous_target" },
      direction: { kind: "away_from_source" },
      distance: 2,
    };
    const next = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    expect(next.board["1,3"]).toBeUndefined();
    const moved = next.board["1,5"];
    expect(moved).toBeDefined();
    expect(moved?.entityId).toBe(TGT_ID);
    const ev = events.find((e) => e.type === "pushed");
    expect(ev).toBeDefined();
  });
});

describe("Witness Whose Time Has Come (if) — runtime", () => {
  it("then-branch fires when the counter meets the threshold", () => {
    const SRC_ID = "src" as EntityId;
    let s = placeUnit(buildBareState({ seed: "if-then" }), SRC_ID, "tok_x", 0, 1, 1);
    // Seed the counter on the source so the if branch picks `then`.
    s = produce(s, (draft) => {
      const cell = draft.board["1,1"];
      if (cell) {
        cell.card.counters = { damage_dealt_match: 4 };
      }
    });
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "if",
      cond: { kind: "counter_gte", counter: "damage_dealt_match", value: 4 },
      then: {
        op: "buff",
        stats: { power: 2, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    };
    const baselinePower = s.board["1,1"]?.card.currentPower ?? 0;
    const next = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });
    const after = next.board["1,1"];
    expect(after).toBeDefined();
    expect(after?.card.currentPower).toBe(baselinePower + 2);
  });

  it("no branch fires when the counter is below the threshold", () => {
    const SRC_ID = "src" as EntityId;
    const s = placeUnit(buildBareState({ seed: "if-skip" }), SRC_ID, "tok_x", 0, 1, 1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: SRC_ID });
    const events: GameEvent[] = [];

    const effect: EffectTree = {
      op: "if",
      cond: { kind: "counter_gte", counter: "damage_dealt_match", value: 4 },
      then: {
        op: "buff",
        stats: { power: 2, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    };
    const baselinePower = s.board["1,1"]?.card.currentPower ?? 0;
    const next = produce(s, (draft) => {
      interpret(effect, ctx, draft, makeReduceCtx(events, draft.rngState));
    });
    const after = next.board["1,1"];
    expect(after).toBeDefined();
    expect(after?.card.currentPower).toBe(baselinePower);
  });
});

describe("The Anchor of Kael (structure) — definition shape", () => {
  // Schema-side check: structure is a valid keyword that the engine
  // already enforces in movement.ts:54 and combat.ts:96. Movement +
  // combat tests are exercised end-to-end by the existing engine
  // suite; here we just confirm the card is shaped correctly to take
  // advantage of that runtime.
  it("declares the structure keyword and zero abilities", () => {
    const def = ALL_CARD_DEFINITIONS.find((c) => c.id === "s1_neutral_struct_001");
    expect(def).toBeDefined();
    expect(def?.cardType).toBe("unit");
    expect(def?.keywords).toContain("structure");
    expect(def?.abilities).toEqual([]);
  });

  it("ships at the spec'd 4-cost 4/8 statline", () => {
    const def = ALL_CARD_DEFINITIONS.find((c) => c.id === "s1_neutral_struct_001");
    expect(def?.cost).toBe(4);
    expect(def?.baseStats).toEqual({ power: 4, health: 8 });
  });
});
