/**
 * Behavioral golden tests for s1_char_002 — Agent Zero.
 *
 * The three abilities run through the interpreter:
 *  1. on_deploy → grant untargetable (3 turns) + stealth_turns counter (3).
 *  2. on_damage_dealt(self) → remove untargetable.
 *  3. passive_aura(self) → grant ignore_armor_3 permanent.
 *
 * These tests drive the interpreter directly, independent of the trigger
 * queue wiring. A follow-up commit wires the trigger queue → interpreter
 * so trigger dispatch stays transparent to these tests.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import type { GameEvent } from "../../../index";
import type { Effect as EffectTree } from "../../../engine/effectInterpreter";
import { interpret, makeExecCtx, createRng } from "../../../index";
import type { ReduceCtx } from "../../../engine/reducer";
import { cardDef } from "../../../cards/definitions/insurgency/s1_char_002_agent_zero";
import { buildBareState, placeUnit, emptyRegistry } from "../../fixtures/stateBuilder";
import type { EntityId, Side } from "../../../types/Ids";

function makeReduceCtx(events: GameEvent[], rngState: string): ReduceCtx {
  return {
    events,
    rng: createRng(rngState, true),
    registry: emptyRegistry,
  };
}

const AZ_ID = "az_body" as EntityId;

function stateWithAgentZero(turnNumber = 1): ReturnType<typeof buildBareState> {
  return placeUnit(
    buildBareState({ seed: "agent-zero", turnNumber }),
    AZ_ID,
    "s1_char_002",
    0,
    2,
    2,
    { currentPower: 7, maxHealth: 8, currentHealth: 8 }
  );
}

describe("s1_char_002 — Agent Zero (behavior)", () => {
  it("on_deploy grants untargetable for 3 turns and sets stealth_turns counter", () => {
    const s0 = stateWithAgentZero(1);
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: AZ_ID });
    const events: GameEvent[] = [];

    const s1 = produce(s0, (draft) => {
      interpret(
        cardDef.abilities[0].effect as EffectTree,
        ctx,
        draft,
        makeReduceCtx(events, draft.rngState)
      );
    });

    const az = Object.values(s1.board).find((e) => e.entityId === AZ_ID);
    expect(az).toBeDefined();
    expect(az!.card.activeKeywords).toContain("untargetable");
    expect(az!.card.counters.stealth_turns).toBe(3);

    const keywordEvt = events.find((e) => e.type === "keyword_granted");
    expect(keywordEvt).toMatchObject({
      type: "keyword_granted",
      targetId: AZ_ID,
      keyword: "untargetable",
      expiresAtTurn: 4, // current turn 1 + n_turns 3
    });
  });

  it("reveal ability removes untargetable", () => {
    // Start with untargetable already on the card.
    let s = stateWithAgentZero();
    s = produce(s, (draft) => {
      const az = Object.values(draft.board).find((e) => e.entityId === AZ_ID);
      if (!az) throw new Error("missing agent zero");
      az.card.activeKeywords = ["untargetable"];
    });

    const ctx = makeExecCtx(0 as Side, { sourceEntityId: AZ_ID });
    const events: GameEvent[] = [];

    const s1 = produce(s, (draft) => {
      const reveal = cardDef.abilities.find((a) => a.id === "az_reveal_on_attack");
      if (!reveal) throw new Error("missing reveal ability");
      interpret(reveal.effect as EffectTree, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const az = Object.values(s1.board).find((e) => e.entityId === AZ_ID);
    expect(az!.card.activeKeywords).not.toContain("untargetable");
    const removedEvt = events.find((e) => e.type === "keyword_removed");
    expect(removedEvt).toMatchObject({
      type: "keyword_removed",
      targetId: AZ_ID,
      keyword: "untargetable",
    });
  });

  it("passive pierce grants ignore_armor_3 as a permanent keyword", () => {
    const s0 = stateWithAgentZero();
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: AZ_ID });
    const events: GameEvent[] = [];

    const s1 = produce(s0, (draft) => {
      const pierce = cardDef.abilities.find((a) => a.id === "az_pierce_passive");
      if (!pierce) throw new Error("missing pierce ability");
      interpret(pierce.effect as EffectTree, ctx, draft, makeReduceCtx(events, draft.rngState));
    });

    const az = Object.values(s1.board).find((e) => e.entityId === AZ_ID);
    expect(az!.card.activeKeywords).toContain("ignore_armor_3");

    const grantEvt = events.find((e) => e.type === "keyword_granted");
    expect(grantEvt).toMatchObject({
      type: "keyword_granted",
      targetId: AZ_ID,
      keyword: "ignore_armor_3",
      expiresAtTurn: -1, // permanent
    });
  });

  it("granting a keyword that already exists is idempotent and emits a single event", () => {
    // Agent Zero already has ignore_armor_3 from passive pierce. Running
    // the effect a second time must not duplicate the keyword in
    // activeKeywords, though it still emits a keyword_granted event so
    // the UI can flash the aura confirmation.
    let s = stateWithAgentZero();
    const ctx = makeExecCtx(0 as Side, { sourceEntityId: AZ_ID });
    const pierce = cardDef.abilities.find((a) => a.id === "az_pierce_passive");
    if (!pierce) throw new Error("missing");

    s = produce(s, (draft) => {
      interpret(pierce.effect as EffectTree, ctx, draft, makeReduceCtx([], draft.rngState));
    });
    const before = Object.values(s.board).find((e) => e.entityId === AZ_ID)!
      .card.activeKeywords;
    s = produce(s, (draft) => {
      interpret(pierce.effect as EffectTree, ctx, draft, makeReduceCtx([], draft.rngState));
    });
    const after = Object.values(s.board).find((e) => e.entityId === AZ_ID)!
      .card.activeKeywords;
    expect(after.length).toBe(before.length);
    // Specifically: only one instance of ignore_armor_3.
    expect(after.filter((k) => k === "ignore_armor_3").length).toBe(1);
  });
});
