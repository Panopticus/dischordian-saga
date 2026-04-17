/**
 * §4.9 silent re-route — effect-interpreter integration test.
 *
 * The unit tests in seerSilentReroute.test.ts cover resolveTargetRef
 * and resolveTargetSelector directly. This file confirms the
 * re-route actually lands through the full effect-interpreter path:
 * a `deal_damage { to: enemy_general, amount: 5 }` effect, run
 * under an §4.9 match state with a pending future, mutates the
 * alternate enemy unit's currentHealth instead of the Seer's
 * general's. No events indicate the re-route (spec §3.1 silent
 * rule); the state change is the proof.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import type { Draft } from "immer";
import { interpret } from "../../engine/effectInterpreter";
import {
  buildBareState,
  emptyRegistry,
  makeCardInstance,
} from "../fixtures/stateBuilder";
import type { BoardEntity, GameState } from "../../types/GameState";
import { posKey } from "../../types/GameState";
import type { ExecCtx } from "../../engine/execCtx";
import type { EntityId } from "../../types/Ids";
import type { Effect } from "../../types/Effect";
import type { GameEvent } from "../../types/Event";
import { createRng } from "../../engine/rng";

function placeEnemyUnit(
  state: GameState,
  entityId: string,
  row: number,
  col: number,
  health: number,
): GameState {
  const brandedId = entityId as unknown as EntityId;
  const card = makeCardInstance(entityId, "s1_char_004_ambassador_veron", 1);
  card.currentHealth = health;
  card.maxHealth = health;
  const entity: BoardEntity = {
    entityId: brandedId,
    card,
    row,
    col,
    actionsRemaining: 1,
    hasMoved: false,
    hasAttacked: false,
    isGeneral: false,
    isStunned: false,
  };
  return {
    ...state,
    board: { ...state.board, [posKey(row, col)]: entity },
  };
}

const baseExecCtx: ExecCtx = {
  sourceEntityId: undefined,
  actorSide: 0,
  it: undefined,
  previousTarget: undefined,
  triggerSourceId: undefined,
  triggerVictimId: undefined,
  playerChosenTargetId: undefined,
} as ExecCtx;

describe("§4.9 silent re-route — E2E through the effect interpreter", () => {
  it("deal_damage targeting enemy_general lands on alternate unit, not the general", () => {
    let s = buildBareState();
    s.seerProphecy = {
      pending: { cardDefId: "future_card", turnIndex: 2 },
      playsPerformed: 0,
    };
    s = placeEnemyUnit(s, "ent_alt", 2, 5, 10);

    const seerGeneralId = s.players[1].generalEntityId;
    const seerGeneral = Object.values(s.board).find(
      (e) => e.entityId === seerGeneralId,
    );
    if (!seerGeneral) throw new Error("seer general missing in fixture");
    const altBefore = Object.values(s.board).find(
      (e) => e.entityId === ("ent_alt" as unknown as EntityId),
    );
    if (!altBefore) throw new Error("alt unit missing in fixture");
    const seerHealthBefore = seerGeneral.card.currentHealth;
    const altHealthBefore = altBefore.card.currentHealth;

    const effect: Effect = {
      op: "deal_damage",
      amount: { kind: "const", value: 5 },
      to: { kind: "enemy_general" },
    };

    const events: GameEvent[] = [];
    const next = produce(s, (draft: Draft<GameState>) => {
      interpret(effect, baseExecCtx, draft, {
        events,
        rng: createRng("test"),
        registry: emptyRegistry,
      });
    });

    const seerAfter = Object.values(next.board).find(
      (e) => e.entityId === seerGeneralId,
    )!;
    const altAfter = Object.values(next.board).find(
      (e) => e.entityId === ("ent_alt" as unknown as EntityId),
    )!;

    // The Seer's general is UNTOUCHED — the re-route protected her.
    expect(seerAfter.card.currentHealth).toBe(seerHealthBefore);
    // The alternate unit absorbed the full 5 damage.
    expect(altAfter.card.currentHealth).toBe(altHealthBefore - 5);

    // Spec §3.1 silent rule — the damage_dealt event references the
    // alternate unit's id, not the general's. Player's UI reads the
    // event and renders a normal damage animation; the re-route is
    // completely invisible in the event stream.
    const dmg = events.filter((e) => e.type === "damage_dealt");
    expect(dmg.length).toBe(1);
    expect(dmg[0].targetId).toBe("ent_alt");
    // No dedicated "re-route" event. The re-route is silent by design.
    expect(events.some((e) => e.type.includes("reroute"))).toBe(false);
  });

  it("without a pending future, the same effect hits the general normally", () => {
    // Control case: no seerProphecy → re-route inactive → full damage
    // lands on the Seer's general.
    let s = buildBareState();
    s = placeEnemyUnit(s, "ent_alt", 2, 5, 10);
    const seerGeneralId = s.players[1].generalEntityId;
    const seerGeneralBefore = Object.values(s.board).find(
      (e) => e.entityId === seerGeneralId,
    )!;
    const altBefore = Object.values(s.board).find(
      (e) => e.entityId === ("ent_alt" as unknown as EntityId),
    )!;
    const seerHealthBefore = seerGeneralBefore.card.currentHealth;
    const altHealthBefore = altBefore.card.currentHealth;

    const effect: Effect = {
      op: "deal_damage",
      amount: { kind: "const", value: 5 },
      to: { kind: "enemy_general" },
    };

    const events: GameEvent[] = [];
    const next = produce(s, (draft: Draft<GameState>) => {
      interpret(effect, baseExecCtx, draft, {
        events,
        rng: createRng("test"),
        registry: emptyRegistry,
      });
    });

    const seerAfter = Object.values(next.board).find(
      (e) => e.entityId === seerGeneralId,
    )!;
    const altAfter = Object.values(next.board).find(
      (e) => e.entityId === ("ent_alt" as unknown as EntityId),
    )!;

    // Full 5 damage lands on the general; alt unit untouched.
    expect(seerAfter.card.currentHealth).toBe(seerHealthBefore - 5);
    expect(altAfter.card.currentHealth).toBe(altHealthBefore);
  });

  it("Seer's own effects never re-route (actorSide guard)", () => {
    // The Seer (side 1) targeting HER opponent's general (the player)
    // must hit normally — the re-route only protects side 1's general
    // from side 0's attacks.
    let s = buildBareState();
    s.seerProphecy = {
      pending: { cardDefId: "future_card", turnIndex: 2 },
      playsPerformed: 0,
    };
    // Place a side-0 alternate unit so a hypothetical re-route WOULD
    // have somewhere to go — but it shouldn't fire.
    const card = makeCardInstance("ent_player_minion", "s1_char_004_ambassador_veron", 0);
    card.currentHealth = 7;
    card.maxHealth = 7;
    const entity: BoardEntity = {
      entityId: "ent_player_minion" as unknown as EntityId,
      card,
      row: 2,
      col: 3,
      actionsRemaining: 1,
      hasMoved: false,
      hasAttacked: false,
      isGeneral: false,
      isStunned: false,
    };
    s = { ...s, board: { ...s.board, [posKey(2, 3)]: entity } };

    const playerGeneralId = s.players[0].generalEntityId;
    const playerGeneralBefore = Object.values(s.board).find(
      (e) => e.entityId === playerGeneralId,
    )!;
    const minionBefore = Object.values(s.board).find(
      (e) => e.entityId === ("ent_player_minion" as unknown as EntityId),
    )!;

    const effect: Effect = {
      op: "deal_damage",
      amount: { kind: "const", value: 3 },
      to: { kind: "enemy_general" },
    };

    const seerCtx: ExecCtx = { ...baseExecCtx, actorSide: 1 } as ExecCtx;
    const events: GameEvent[] = [];
    const next = produce(s, (draft: Draft<GameState>) => {
      interpret(effect, seerCtx, draft, {
        events,
        rng: createRng("test"),
        registry: emptyRegistry,
      });
    });

    const playerGeneralAfter = Object.values(next.board).find(
      (e) => e.entityId === playerGeneralId,
    )!;
    const minionAfter = Object.values(next.board).find(
      (e) => e.entityId === ("ent_player_minion" as unknown as EntityId),
    )!;

    // From the Seer's perspective, "enemy_general" is the player's
    // general. Damage lands normally — no protection for side 0.
    expect(playerGeneralAfter.card.currentHealth).toBe(
      playerGeneralBefore.card.currentHealth - 3,
    );
    expect(minionAfter.card.currentHealth).toBe(minionBefore.card.currentHealth);
  });
});
