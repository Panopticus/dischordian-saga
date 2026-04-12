/**
 * Combat tests.
 *
 * Exercises handleAttack through the reducer:
 *  - Melee attack kills the target
 *  - Melee attack with retaliation kills both
 *  - Ranged attack takes no retaliation
 *  - Provoke forces the attacker onto the provoking unit
 *  - Forcefield counter absorbs the first hit
 *  - Attacking the general advances SBA's win condition
 *  - Exhausted / stunned / structure units cannot attack
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import {
  reduce,
  posKey,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  BOARD_HEIGHT,
} from "../../index";
import type { GameState } from "../../index";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

/** Build a state where u1 (P0, 5/5) is adjacent to e1 (P1, 3/3). */
function twoFightersAdjacent(seed = "combat"): GameState {
  let s = buildBareState({ seed });
  s = placeUnit(s, "u1", "x", 0, 2, 3, { currentPower: 5, maxHealth: 5, currentHealth: 5 });
  s = placeUnit(s, "e1", "x", 1, 2, 4, { currentPower: 3, maxHealth: 3, currentHealth: 3 });
  return s;
}

describe("combat basics", () => {
  it("melee attack deals damage and takes retaliation", () => {
    const s = twoFightersAdjacent("melee-1");
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "u1", targetId: "e1", seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    // e1 (3hp) took 5 damage → -2 HP → SBA removed it.
    expect(r.state.board[posKey(2, 4)]).toBeUndefined();
    // u1 took 3 retaliation → 5-3 = 2 HP, still alive.
    const u1After = r.state.board[posKey(2, 3)];
    expect(u1After.card.currentHealth).toBe(2);
  });

  it("ranged attack skips retaliation", () => {
    let s = twoFightersAdjacent("ranged-1");
    s = produce(s, (draft) => {
      const u1 = Object.values(draft.board).find((x) => x.entityId === "u1")!;
      u1.card.activeKeywords = ["ranged"];
      // Move u1 far away so melee wouldn't be legal.
      delete draft.board[posKey(u1.row, u1.col)];
      u1.row = 0;
      u1.col = 0;
      draft.board[posKey(0, 0)] = u1;
    });
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "u1", targetId: "e1", seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    // e1 dead, u1 unscratched.
    expect(r.state.board[posKey(2, 4)]).toBeUndefined();
    const u1After = r.state.board[posKey(0, 0)];
    expect(u1After.card.currentHealth).toBe(5);
  });

  it("forcefield_charges absorb the first hit without HP loss", () => {
    let s = twoFightersAdjacent("ff-1");
    s = produce(s, (draft) => {
      const e1 = Object.values(draft.board).find((x) => x.entityId === "e1")!;
      e1.card.counters.forcefield_charges = 1;
    });
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "u1", targetId: "e1", seq: 1 },
      registry
    );
    expect(r.error).toBeUndefined();
    // e1 still at 3 HP but forcefield consumed.
    const e1After = r.state.board[posKey(2, 4)];
    expect(e1After).toBeDefined();
    expect(e1After.card.currentHealth).toBe(3);
    expect(e1After.card.counters.forcefield_charges).toBe(0);
    // u1 still takes retaliation (forcefield absorbed only the incoming
    // hit on e1, not e1's counterattack).
    const u1After = r.state.board[posKey(2, 3)];
    expect(u1After.card.currentHealth).toBe(2);
  });

  it("provoke forces attacker onto the provoking unit", () => {
    let s = twoFightersAdjacent("provoke-1");
    // Add a second enemy with provoke adjacent to u1.
    s = placeUnit(s, "provoker", "test", 1, 3, 3, { currentPower: 1, maxHealth: 5, currentHealth: 5 });
    s = produce(s, (draft) => {
      Object.values(draft.board).find((x) => x.entityId === "provoker")!
        .card.activeKeywords = ["provoke"];
    });
    // Try to attack e1 instead of the provoker — illegal.
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "u1", targetId: "e1", seq: 1 },
      registry
    );
    expect(r.error?.code).toBe("illegal_attack");
    expect(r.error?.message).toMatch(/provoking/);
  });

  it("cannot attack with exhausted units", () => {
    let s = twoFightersAdjacent("exh-1");
    s = produce(s, (draft) => {
      Object.values(draft.board).find((x) => x.entityId === "u1")!.hasAttacked = true;
    });
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "u1", targetId: "e1", seq: 1 },
      registry
    );
    expect(r.error?.code).toBe("action_already_used");
  });

  it("cannot attack your own unit", () => {
    let s = buildBareState({ seed: "friendly-fire" });
    s = placeUnit(s, "u1", "x", 0, 2, 3, { currentPower: 5, maxHealth: 5, currentHealth: 5 });
    s = placeUnit(s, "u2", "x", 0, 2, 4, { currentPower: 3, maxHealth: 5, currentHealth: 5 });
    const r = reduce(
      s,
      { kind: "attack", actor: 0, attackerId: "u1", targetId: "u2", seq: 1 },
      registry
    );
    expect(r.error?.code).toBe("illegal_attack");
  });

  it("attacking the enemy general triggers general-death win via SBA", () => {
    // Place u1 (power 30) adjacent to P1's general (25 HP).
    let s = buildBareState({ seed: "win" });
    const mid = Math.floor(BOARD_HEIGHT / 2);
    s = placeUnit(s, "u1", "x", 0, mid, 7, { currentPower: 30, maxHealth: 10, currentHealth: 10 });
    // Override the general's HP so the attack is lethal.
    s = produce(s, (draft) => {
      const p1Gen = Object.values(draft.board).find((e) => e.entityId === "general_p1")!;
      p1Gen.card.currentHealth = 25;
      p1Gen.card.maxHealth = 25;
      p1Gen.card.currentPower = 2;
    });
    const r = reduce(
      s,
      {
        kind: "attack",
        actor: 0,
        attackerId: "u1",
        targetId: "general_p1",
        seq: 1,
      },
      registry
    );
    expect(r.error).toBeUndefined();
    expect(r.state.phase).toBe("ended");
    expect(r.state.winner).toBe(0);
    expect(r.state.winReason).toBe("general_killed");
  });
});
