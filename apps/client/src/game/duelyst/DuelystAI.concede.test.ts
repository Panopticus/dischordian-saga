/**
 * PR-4 — AI concede behaviour on severe disadvantage.
 *
 * Unit tests around `getAIActions(state, { allowConcede })`. The AI
 * must NEVER concede when `allowConcede` is false/omitted (sparring
 * + PvP contract); it MUST concede when allowed AND outclassed.
 *
 * Outclassed = AI general at ≤15% HP AND opponent board has ≥10
 * attack across units + their general.
 */
import { describe, it, expect } from "vitest";
import { getAIActions } from "./DuelystAI";
import type { DuelystGameState, BoardUnit } from "./types";

function mkUnit(overrides: Partial<BoardUnit> & Pick<BoardUnit, "id" | "owner">): BoardUnit {
  return {
    id: overrides.id,
    owner: overrides.owner,
    card: overrides.card ?? ({
      id: "stub",
      name: "Stub",
      faction: "architect",
      cardType: "unit",
      manaCost: 2,
      attack: 2,
      health: 3,
      rarity: "common",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any),
    row: overrides.row ?? 0,
    col: overrides.col ?? 0,
    currentAttack: overrides.currentAttack ?? 2,
    currentHealth: overrides.currentHealth ?? 3,
    maxHealth: overrides.maxHealth ?? 3,
    hasMoved: false,
    hasAttacked: false,
    actionsRemaining: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeKeywords: new Set() as any,
    buffs: [],
    isGeneral: overrides.isGeneral ?? false,
    isStunned: false,
    forcefieldActive: false,
  };
}

function mkState(board: BoardUnit[], currentPlayer: 0 | 1 = 1): DuelystGameState {
  const boardMap = new Map<string, BoardUnit>();
  for (const u of board) boardMap.set(u.id, u);
  return {
    currentPlayer,
    board: boardMap,
    players: [
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hand: [] as any,
        mana: 5,
        maxMana: 5,
        deck: [],
        graveyard: [],
        replaceUsed: false,
        bloodbornUsed: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hand: [] as any,
        mana: 5,
        maxMana: 5,
        deck: [],
        graveyard: [],
        replaceUsed: false,
        bloodbornUsed: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe("AI concede behavior (PR-4)", () => {
  it("never concedes when allowConcede is omitted (sparring default)", () => {
    const aiGen = mkUnit({
      id: "ai_gen",
      owner: 1,
      isGeneral: true,
      currentHealth: 2,
      maxHealth: 25,
    });
    const playerAttacker = mkUnit({
      id: "p_atk",
      owner: 0,
      currentAttack: 12,
    });
    const state = mkState([aiGen, playerAttacker]);
    const actions = getAIActions(state);
    expect(actions.some((a) => a.type === "concede")).toBe(false);
  });

  it("never concedes when allowConcede is explicitly false", () => {
    const aiGen = mkUnit({
      id: "ai_gen",
      owner: 1,
      isGeneral: true,
      currentHealth: 2,
      maxHealth: 25,
    });
    const playerAttacker = mkUnit({
      id: "p_atk",
      owner: 0,
      currentAttack: 12,
    });
    const state = mkState([aiGen, playerAttacker]);
    const actions = getAIActions(state, { allowConcede: false });
    expect(actions.some((a) => a.type === "concede")).toBe(false);
  });

  it("concedes when outclassed AND allowConcede is true", () => {
    const aiGen = mkUnit({
      id: "ai_gen",
      owner: 1,
      isGeneral: true,
      currentHealth: 2, // 2/25 = 8% — below the 15% threshold
      maxHealth: 25,
    });
    const playerAttacker = mkUnit({
      id: "p_atk",
      owner: 0,
      currentAttack: 12, // exceeds the 10-attack threshold
    });
    const state = mkState([aiGen, playerAttacker]);
    const actions = getAIActions(state, { allowConcede: true });
    expect(actions).toEqual([{ type: "concede" }]);
  });

  it("does NOT concede when general HP is above 15% even with lethal on board", () => {
    const aiGen = mkUnit({
      id: "ai_gen",
      owner: 1,
      isGeneral: true,
      currentHealth: 10, // 10/25 = 40% — above threshold
      maxHealth: 25,
    });
    const playerAttacker = mkUnit({
      id: "p_atk",
      owner: 0,
      currentAttack: 15,
    });
    const state = mkState([aiGen, playerAttacker]);
    const actions = getAIActions(state, { allowConcede: true });
    expect(actions.some((a) => a.type === "concede")).toBe(false);
  });

  it("does NOT concede when low HP but opponent has negligible board pressure", () => {
    const aiGen = mkUnit({
      id: "ai_gen",
      owner: 1,
      isGeneral: true,
      currentHealth: 2,
      maxHealth: 25,
    });
    const weakUnit = mkUnit({
      id: "p_weak",
      owner: 0,
      currentAttack: 3, // total 3, well under the 10-threshold
    });
    const state = mkState([aiGen, weakUnit]);
    const actions = getAIActions(state, { allowConcede: true });
    expect(actions.some((a) => a.type === "concede")).toBe(false);
  });

  it("sums attack across multiple opponent units to hit the threshold", () => {
    const aiGen = mkUnit({
      id: "ai_gen",
      owner: 1,
      isGeneral: true,
      currentHealth: 2,
      maxHealth: 25,
    });
    // Four small units that together meet the 10-attack threshold.
    const units = [
      mkUnit({ id: "u1", owner: 0, currentAttack: 3 }),
      mkUnit({ id: "u2", owner: 0, currentAttack: 3 }),
      mkUnit({ id: "u3", owner: 0, currentAttack: 3 }),
      mkUnit({ id: "u4", owner: 0, currentAttack: 3 }),
    ];
    const state = mkState([aiGen, ...units]);
    const actions = getAIActions(state, { allowConcede: true });
    expect(actions).toEqual([{ type: "concede" }]);
  });
});

describe("DuelystGameUI — AI concede plumbing (PR-4)", () => {
  const fs = require("fs");
  const path = require("path");
  const uiSrc = fs.readFileSync(
    path.resolve(__dirname, "DuelystGameUI.tsx"),
    "utf-8",
  );

  it("passes allowConcede: !!encounter to getAIActions", () => {
    expect(uiSrc).toMatch(/allowConcede:\s*!!encounter/);
  });

  it("logs the concede with the encounter name when it fires", () => {
    expect(uiSrc).toMatch(/action\.type === "concede"/);
    expect(uiSrc).toContain("withdraws from the match");
  });

  it("displays opponent general HP with /maxHealth suffix", () => {
    expect(uiSrc).toMatch(/opponentGen\?\.currentHealth[\s\S]*opponentGen\?\.maxHealth/);
  });
});
