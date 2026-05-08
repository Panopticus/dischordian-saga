/**
 * Armor system + pierce + ignore_armor_3 keyword tests.
 *
 * Plan §"Realistic checklist" #1 — closes the only blocked-on-
 * armor-system entries in KEYWORD_BEHAVIOR_EXEMPT.
 *
 * Each test exercises one shape of the soak math:
 *   armor=0  → all damage to HP (regression guard)
 *   armor>0  → soak before HP
 *   pierce → fraction of damage skips armor
 *   ignore_armor_3 → flat reduction in armor's effective absorption
 *   pierce + ignore_armor_3 → both reductions apply
 *
 * Combat wiring is exercised through the live reducer
 * (`reduce(state, { kind: "attack", … })`); no direct calls into
 * applyCombatDamage. State construction uses the existing
 * fixtures/stateBuilder helpers that ship with `armor: 0` default.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import {
  reduce,
  posKey,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
} from "../../index";
import type { Action, GameState } from "../../index";
import type { Keyword } from "../../types/Card";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

function tagKeywords(s: GameState, entityId: string, kws: Keyword[]): GameState {
  return produce(s, (draft) => {
    const ent = Object.values(draft.board).find((e) => e.entityId === entityId);
    if (!ent) throw new Error(`tagKeywords: ${entityId} not on board`);
    ent.card.activeKeywords = kws;
  });
}

function setArmor(s: GameState, entityId: string, armor: number): GameState {
  return produce(s, (draft) => {
    const ent = Object.values(draft.board).find((e) => e.entityId === entityId);
    if (!ent) throw new Error(`setArmor: ${entityId} not on board`);
    ent.card.armor = armor;
  });
}

/** u1 (P0) at (2,3) attacks e1 (P1) at (2,4). u1: power 4 hp 10. e1: power 1 hp 10. */
function adjacent(seed = "armor"): GameState {
  let s = buildBareState({ seed });
  s = placeUnit(s, "u1", "x", 0, 2, 3, {
    currentPower: 4,
    maxHealth: 10,
    currentHealth: 10,
  });
  s = placeUnit(s, "e1", "x", 1, 2, 4, {
    currentPower: 1,
    maxHealth: 10,
    currentHealth: 10,
  });
  return s;
}

const ATTACK = (): Action => ({
  kind: "attack",
  actor: 0,
  attackerId: "u1",
  targetId: "e1",
  seq: 1,
});

describe("armor — soak before HP", () => {
  it("armor=0 → all damage hits HP (regression guard for the no-armor case)", () => {
    const s = adjacent("ar-0");
    const r = reduce(s, ATTACK(), registry);
    expect(r.error).toBeUndefined();
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    expect(e1?.card.armor).toBe(0);
    expect(e1?.card.currentHealth).toBe(6); // 10 - 4 = 6
  });

  it("armor=5 absorbs the whole 4-damage swing; HP untouched", () => {
    let s = adjacent("ar-1");
    s = setArmor(s, "e1", 5);
    const r = reduce(s, ATTACK(), registry);
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    expect(e1?.card.armor).toBe(1); // 5 - 4
    expect(e1?.card.currentHealth).toBe(10);
  });

  it("armor=2 soaks 2; HP takes the remaining 2", () => {
    let s = adjacent("ar-2");
    s = setArmor(s, "e1", 2);
    const r = reduce(s, ATTACK(), registry);
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    expect(e1?.card.armor).toBe(0);
    expect(e1?.card.currentHealth).toBe(8); // 10 - 2
  });
});

describe("pierce — fraction of damage skips armor", () => {
  it("pierce attacker: 50% of damage bypasses armor entirely", () => {
    // u1: power 4. pierce → bypassDamage = floor(4 * 0.5) = 2.
    // armorInteract = 4 - 2 = 2. effectiveArmor = 5 (no flat ignore).
    // armorSoak = min(2, 5) = 2. armor afterwards = 5 - 2 = 3.
    // hpDamage = (2 - 2) + 2 = 2.
    let s = adjacent("pi-1");
    s = setArmor(s, "e1", 5);
    s = tagKeywords(s, "u1", ["pierce"]);
    const r = reduce(s, ATTACK(), registry);
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    expect(e1?.card.armor).toBe(3);
    expect(e1?.card.currentHealth).toBe(8);
  });

  it("pierce vs no armor: math collapses to plain damage", () => {
    let s = adjacent("pi-2");
    s = tagKeywords(s, "u1", ["pierce"]);
    const r = reduce(s, ATTACK(), registry);
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    expect(e1?.card.currentHealth).toBe(6);
  });
});

describe("ignore_armor_3 — flat reduction in absorption", () => {
  it("ignore_armor_3 vs armor=2: armor reduced to 0 effective; full damage hits HP", () => {
    let s = adjacent("ia-1");
    s = setArmor(s, "e1", 2);
    s = tagKeywords(s, "u1", ["ignore_armor_3"]);
    const r = reduce(s, ATTACK(), registry);
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    // effectiveArmor = max(0, 2 - 3) = 0; armorSoak = 0;
    // hpDamage = 4. armor stays at 2 (nothing was actually consumed).
    expect(e1?.card.armor).toBe(2);
    expect(e1?.card.currentHealth).toBe(6);
  });

  it("ignore_armor_3 vs armor=5: 2 effective armor soaks 2, HP takes 2", () => {
    let s = adjacent("ia-2");
    s = setArmor(s, "e1", 5);
    s = tagKeywords(s, "u1", ["ignore_armor_3"]);
    const r = reduce(s, ATTACK(), registry);
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    // effectiveArmor = max(0, 5 - 3) = 2; armorSoak = min(4, 2) = 2;
    // hpDamage = 4 - 2 = 2; armor afterwards = 5 - 2 = 3.
    expect(e1?.card.armor).toBe(3);
    expect(e1?.card.currentHealth).toBe(8);
  });
});

describe("pierce + ignore_armor_3 stack", () => {
  it("both keywords apply: bypass + flat-reduce compose", () => {
    // u1: power 4; pierce → bypass = 2; armorInteract = 2.
    // armor=5; ignore_armor_3 → effectiveArmor = max(0, 5 - 3) = 2.
    // armorSoak = min(2, 2) = 2. armor afterwards = 5 - 2 = 3.
    // hpDamage = (2 - 2) + 2 = 2.
    let s = adjacent("pi-ia");
    s = setArmor(s, "e1", 5);
    s = tagKeywords(s, "u1", ["pierce", "ignore_armor_3"]);
    const r = reduce(s, ATTACK(), registry);
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    expect(e1?.card.armor).toBe(3);
    expect(e1?.card.currentHealth).toBe(8);
  });
});

describe("forcefield + armor — forcefield wins (absorbs the entire swing first)", () => {
  it("forcefield_charges absorbs the swing before armor is even consulted", () => {
    let s = adjacent("ff-arm");
    s = setArmor(s, "e1", 5);
    s = produce(s, (draft) => {
      const ent = Object.values(draft.board).find((e) => e.entityId === "e1")!;
      ent.card.counters.forcefield_charges = 1;
    });
    const r = reduce(s, ATTACK(), registry);
    const e1 = Object.values(r.state.board).find((e) => e.entityId === "e1");
    // Forcefield consumed; armor and HP both untouched.
    expect(e1?.card.counters.forcefield_charges).toBe(0);
    expect(e1?.card.armor).toBe(5);
    expect(e1?.card.currentHealth).toBe(10);
  });
});
