/**
 * Resurrect keyword runtime tests — Phase H4.
 *
 * Engine handler: stateBasedActions.ts Pass 1a. A dying unit with
 * `resurrect` and counter `has_resurrected !== 1` is restored to full
 * health on the same SBA pass that would otherwise destroy it. The
 * counter flips to 1 so the second death is permanent. on_death
 * triggers from the suppressed first death do not fire — the unit
 * never left the board.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import { runStateBasedActions } from "../../engine/stateBasedActions";
import { buildBareState, placeUnit, emptyRegistry } from "../fixtures/stateBuilder";
import type { EntityId } from "../../types/Ids";
import type { GameEvent } from "../../types/Event";
import { createRng } from "../../engine/rng";
import type { ReduceCtx } from "../../engine/reducer";

function makeReduceCtx(events: GameEvent[], rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry: emptyRegistry,
  };
}

describe("resurrect keyword", () => {
  it("revives the unit at full health on first death", () => {
    const TGT = "u1" as EntityId;
    let s = placeUnit(buildBareState({ seed: "r-once" }), TGT, "tok_phoenix", 0, 1, 1);
    s = produce(s, (draft) => {
      const cell = draft.board["1,1"];
      if (cell) {
        cell.card.activeKeywords = ["resurrect"];
        cell.card.maxHealth = 4;
        cell.card.currentHealth = 0; // simulate lethal damage
      }
    });
    const events: GameEvent[] = [];
    const next = produce(s, (draft) => {
      runStateBasedActions(draft, makeReduceCtx(events, draft.rngState));
    });

    const after = next.board["1,1"];
    expect(after).toBeDefined();
    expect(after?.card.currentHealth).toBe(4);
    expect(after?.card.counters.has_resurrected).toBe(1);
    expect(events.find((e) => e.type === "resurrected")).toBeDefined();
    expect(events.find((e) => e.type === "unit_destroyed")).toBeUndefined();
  });

  it("permanently dies on the second death (no second revival)", () => {
    const TGT = "u2" as EntityId;
    let s = placeUnit(buildBareState({ seed: "r-twice" }), TGT, "tok_phoenix", 0, 1, 1);
    s = produce(s, (draft) => {
      const cell = draft.board["1,1"];
      if (cell) {
        cell.card.activeKeywords = ["resurrect"];
        cell.card.maxHealth = 4;
        cell.card.currentHealth = 0;
        cell.card.counters = { has_resurrected: 1 };
      }
    });
    const events: GameEvent[] = [];
    const next = produce(s, (draft) => {
      runStateBasedActions(draft, makeReduceCtx(events, draft.rngState));
    });

    expect(next.board["1,1"]).toBeUndefined();
    expect(events.find((e) => e.type === "resurrected")).toBeUndefined();
  });

  it("non-resurrect units die normally on health <= 0", () => {
    const TGT = "u3" as EntityId;
    let s = placeUnit(buildBareState({ seed: "r-vanilla" }), TGT, "tok_normie", 0, 1, 1);
    s = produce(s, (draft) => {
      const cell = draft.board["1,1"];
      if (cell) cell.card.currentHealth = 0;
    });
    const events: GameEvent[] = [];
    const next = produce(s, (draft) => {
      runStateBasedActions(draft, makeReduceCtx(events, draft.rngState));
    });
    expect(next.board["1,1"]).toBeUndefined();
  });
});
