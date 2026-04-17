/**
 * §4.9 Seer silent re-route tests (spec §3.1).
 *
 * Targeted tests on resolveTargetRef / resolveTargetSelector for the
 * pending-future re-route behavior. The re-route is silent — no event
 * is emitted — so these tests assert via returned entity ids.
 */
import { describe, it, expect } from "vitest";
import type { Draft } from "immer";
import {
  resolveTargetRef,
  resolveTargetSelector,
} from "../../engine/targeting";
import { buildBareState, makeCardInstance } from "../fixtures/stateBuilder";
import type { BoardEntity, GameState } from "../../types/GameState";
import { posKey } from "../../types/GameState";
import type { ExecCtx } from "../../engine/execCtx";
import type { EntityId } from "../../types/Ids";
import type { TargetRef } from "../../types/Effect";
import type { TargetSelector } from "../../types/Targeting";

/** Shortcut to place an enemy (side 1) unit on the board. */
function placeEnemyUnit(
  state: GameState,
  entityId: string,
  defId: string,
  row: number,
  col: number,
  stats?: { health?: number; power?: number },
): GameState {
  const brandedId = entityId as unknown as EntityId;
  const card = makeCardInstance(entityId, defId, 1);
  if (stats?.health !== undefined) card.currentHealth = stats.health;
  if (stats?.power !== undefined) card.currentPower = stats.power;
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

function baseCtx(overrides: Partial<ExecCtx> = {}): ExecCtx {
  return {
    sourceEntityId: undefined,
    actorSide: 0,
    it: undefined,
    previousTarget: undefined,
    triggerSourceId: undefined,
    triggerVictimId: undefined,
    ...overrides,
  } as ExecCtx;
}

describe("§4.9 silent re-route — resolveTargetRef", () => {
  it("swaps enemy_general for an alternate enemy unit when a pending future is baked", () => {
    let s = buildBareState();
    s.seerProphecy = { pending: { cardDefId: "future_card", turnIndex: 2 }, playsPerformed: 0 };
    s = placeEnemyUnit(s, "ent_alt_1", "s1_char_004_ambassador_veron", 2, 5);
    const seerGeneralId = s.players[1].generalEntityId;
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx(), s);
    expect(ids).toEqual(["ent_alt_1" as unknown as EntityId]);
    expect(ids).not.toContain(seerGeneralId);
  });

  it("leaves enemy_general untouched when no pending future is baked", () => {
    let s = buildBareState();
    s = placeEnemyUnit(s, "ent_alt_1", "s1_char_004_ambassador_veron", 2, 5);
    const seerGeneralId = s.players[1].generalEntityId;
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx(), s);
    expect(ids).toEqual([seerGeneralId]);
  });

  it("leaves enemy_general untouched when seerProphecy exists but has no pending", () => {
    let s = buildBareState();
    s.seerProphecy = { pending: null, playsPerformed: 0 };
    s = placeEnemyUnit(s, "ent_alt_1", "s1_char_004_ambassador_veron", 2, 5);
    const seerGeneralId = s.players[1].generalEntityId;
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx(), s);
    expect(ids).toEqual([seerGeneralId]);
  });

  it("leaves enemy_general untouched when the actor is the Seer (side 1)", () => {
    // The Seer's own effects never re-route — only the player's do.
    let s = buildBareState();
    s.seerProphecy = { pending: { cardDefId: "future_card", turnIndex: 2 }, playsPerformed: 0 };
    s = placeEnemyUnit(s, "ent_alt_1", "s1_char_004_ambassador_veron", 2, 5);
    const p0GeneralId = s.players[0].generalEntityId;
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx({ actorSide: 1 }), s);
    // From the Seer's perspective, "enemy_general" is the player's
    // general — no re-route applies. (The re-route only protects the
    // Seer's own general from player-side targeting.)
    expect(ids).toEqual([p0GeneralId]);
  });

  it("falls through (no swap) when no alternate enemy unit exists", () => {
    const s = buildBareState();
    s.seerProphecy = { pending: { cardDefId: "future_card", turnIndex: 2 }, playsPerformed: 0 };
    const seerGeneralId = s.players[1].generalEntityId;
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx(), s);
    // No alternates on the board — spec is silent on this edge case;
    // we leave the list as-is rather than invent an entity.
    expect(ids).toEqual([seerGeneralId]);
  });

  it("does not touch friendly_general or self refs (re-route is enemy-general only)", () => {
    let s = buildBareState();
    s.seerProphecy = { pending: { cardDefId: "future_card", turnIndex: 2 }, playsPerformed: 0 };
    s = placeEnemyUnit(s, "ent_alt_1", "s1_char_004_ambassador_veron", 2, 5);
    const friendly: TargetRef = { kind: "friendly_general" };
    const ids = resolveTargetRef(friendly, baseCtx(), s);
    expect(ids).toEqual([s.players[0].generalEntityId]);
  });
});

describe("§4.9 silent re-route — tuned sacrifice selection", () => {
  it("picks the lowest-health candidate when multiple enemies are present", () => {
    let s = buildBareState();
    s.seerProphecy = { pending: { cardDefId: "future_card", turnIndex: 2 }, playsPerformed: 0 };
    s = placeEnemyUnit(s, "ent_beefy", "s1_char_004_ambassador_veron", 2, 5, { health: 10 });
    s = placeEnemyUnit(s, "ent_weak", "s1_char_004_ambassador_veron", 2, 6, { health: 2 });
    s = placeEnemyUnit(s, "ent_mid", "s1_char_004_ambassador_veron", 2, 7, { health: 5 });
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx(), s);
    expect(ids).toEqual(["ent_weak" as unknown as EntityId]);
  });

  it("tie-breaks health ties by lowest power", () => {
    let s = buildBareState();
    s.seerProphecy = { pending: { cardDefId: "future_card", turnIndex: 2 }, playsPerformed: 0 };
    s = placeEnemyUnit(s, "ent_hitter", "s1_char_004_ambassador_veron", 2, 5, { health: 3, power: 8 });
    s = placeEnemyUnit(s, "ent_weakling", "s1_char_004_ambassador_veron", 2, 6, { health: 3, power: 1 });
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx(), s);
    expect(ids).toEqual(["ent_weakling" as unknown as EntityId]);
  });

  it("de-prioritizes a candidate whose defId matches the pending future (canon protection)", () => {
    let s = buildBareState();
    s.seerProphecy = {
      pending: { cardDefId: "s1_char_086_wandering_merchant", turnIndex: 2 },
      playsPerformed: 0,
    };
    // Both candidates have the same health; the one that matches the
    // pending future's defId is protected even at equal sacrifice cost.
    s = placeEnemyUnit(s, "ent_pending_match", "s1_char_086_wandering_merchant", 2, 5, { health: 2 });
    s = placeEnemyUnit(s, "ent_other", "s1_char_004_ambassador_veron", 2, 6, { health: 2 });
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx(), s);
    // Expect ent_other — the pending-future match is deferred.
    expect(ids).toEqual(["ent_other" as unknown as EntityId]);
  });

  it("falls back to the pending-future match when it's the only option", () => {
    let s = buildBareState();
    s.seerProphecy = {
      pending: { cardDefId: "s1_char_086_wandering_merchant", turnIndex: 2 },
      playsPerformed: 0,
    };
    s = placeEnemyUnit(s, "ent_only", "s1_char_086_wandering_merchant", 2, 5, { health: 2 });
    const ref: TargetRef = { kind: "enemy_general" };
    const ids = resolveTargetRef(ref, baseCtx(), s);
    // No other enemy — re-route still lands on the pending match
    // (better than landing on the general).
    expect(ids).toEqual(["ent_only" as unknown as EntityId]);
  });

  it("deterministic — same inputs always yield the same candidate", () => {
    let s = buildBareState();
    s.seerProphecy = { pending: { cardDefId: "future_card", turnIndex: 2 }, playsPerformed: 0 };
    // Three candidates with identical stats — should tiebreak by id.
    s = placeEnemyUnit(s, "ent_c", "s1_char_004_ambassador_veron", 2, 5, { health: 3, power: 3 });
    s = placeEnemyUnit(s, "ent_a", "s1_char_004_ambassador_veron", 2, 6, { health: 3, power: 3 });
    s = placeEnemyUnit(s, "ent_b", "s1_char_004_ambassador_veron", 2, 7, { health: 3, power: 3 });
    const ref: TargetRef = { kind: "enemy_general" };
    const first = resolveTargetRef(ref, baseCtx(), s);
    const second = resolveTargetRef(ref, baseCtx(), s);
    expect(first).toEqual(second);
    // Lex-smallest id wins the three-way tie.
    expect(first).toEqual(["ent_a" as unknown as EntityId]);
  });
});

describe("§4.9 silent re-route — resolveTargetSelector", () => {
  it("'all' selector with the Seer's general in the result swaps it for an alternate", () => {
    let s = buildBareState();
    s.seerProphecy = { pending: { cardDefId: "future_card", turnIndex: 2 }, playsPerformed: 0 };
    s = placeEnemyUnit(s, "ent_alt_1", "s1_char_004_ambassador_veron", 2, 5);
    const seerGeneralId = s.players[1].generalEntityId;
    const sel: TargetSelector = {
      kind: "all",
      filter: { controller: "opponent" },
    };
    const ids = resolveTargetSelector(sel, baseCtx(), s);
    expect(ids).not.toContain(seerGeneralId);
    expect(ids).toContain("ent_alt_1" as unknown as EntityId);
  });

  it("'all' selector passes through unchanged when no pending future", () => {
    let s = buildBareState();
    s = placeEnemyUnit(s, "ent_alt_1", "s1_char_004_ambassador_veron", 2, 5);
    const seerGeneralId = s.players[1].generalEntityId;
    const sel: TargetSelector = {
      kind: "all",
      filter: { controller: "opponent" },
    };
    const ids = resolveTargetSelector(sel, baseCtx(), s);
    expect(ids).toContain(seerGeneralId);
    expect(ids).toContain("ent_alt_1" as unknown as EntityId);
  });
});
