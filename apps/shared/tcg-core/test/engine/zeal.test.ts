/**
 * Zeal keyword runtime tests — Phase H2.
 *
 * Engine handler is `effectivePowerWithZeal` (combat.ts:259+),
 * applied at attack + retaliation damage calc. The bonus is +1 power
 * while the unit is king-adjacent to its owner's general; it falls
 * off the moment the general moves out of reach.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import { effectivePowerWithZeal } from "../../engine/combat";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";
import type { EntityId } from "../../types/Ids";

describe("zeal keyword", () => {
  it("does not buff a unit lacking the keyword", () => {
    const TGT = "u1" as EntityId;
    const s = placeUnit(buildBareState({ seed: "z-no-kw" }), TGT, "tok_x", 0, 1, 1);
    const unit = s.board["1,1"];
    expect(unit).toBeDefined();
    expect(unit!.card.activeKeywords.includes("zeal")).toBe(false);
    expect(effectivePowerWithZeal(s, unit!)).toBe(unit!.card.currentPower);
  });

  it("does not buff a zealous unit when no general is adjacent", () => {
    const TGT = "u2" as EntityId;
    let s = placeUnit(buildBareState({ seed: "z-no-adj" }), TGT, "tok_x", 0, 3, 4);
    // Promote to zealous.
    s = produce(s, (draft) => {
      const cell = draft.board["3,4"];
      if (cell) cell.card.activeKeywords = ["zeal"];
    });
    const unit = s.board["3,4"]!;
    expect(effectivePowerWithZeal(s, unit)).toBe(unit.card.currentPower);
  });

  it("buffs +1 when adjacent to friendly general", () => {
    const TGT = "u3" as EntityId;
    // buildBareState seeds a player-0 general somewhere. Find it and
    // place the zealous unit one tile away.
    const s0 = buildBareState({ seed: "z-yes-adj" });
    const general = Object.values(s0.board).find(
      (e) => e.isGeneral && e.card.owner === 0,
    )!;
    expect(general).toBeDefined();
    const r = general.row;
    const c = general.col;
    // Place adjacent — same row, col+1 (the bare board has space there).
    const targetRow = r;
    let s = placeUnit(s0, TGT, "tok_x", 0, targetRow, c + 1);
    s = produce(s, (draft) => {
      const cell = draft.board[`${targetRow},${c + 1}`];
      if (cell) cell.card.activeKeywords = ["zeal"];
    });
    const unit = s.board[`${targetRow},${c + 1}`]!;
    const base = unit.card.currentPower;
    expect(effectivePowerWithZeal(s, unit)).toBe(base + 1);
  });

  it("ignores enemy generals (no cross-side zeal)", () => {
    const TGT = "u4" as EntityId;
    const s0 = buildBareState({ seed: "z-enemy-adj" });
    const enemyGeneral = Object.values(s0.board).find(
      (e) => e.isGeneral && e.card.owner === 1,
    )!;
    expect(enemyGeneral).toBeDefined();
    let s = placeUnit(
      s0,
      TGT,
      "tok_x",
      0,
      enemyGeneral.row,
      enemyGeneral.col === 0 ? 1 : enemyGeneral.col - 1,
    );
    s = produce(s, (draft) => {
      const cell = draft.board[
        `${enemyGeneral.row},${enemyGeneral.col === 0 ? 1 : enemyGeneral.col - 1}`
      ];
      if (cell) cell.card.activeKeywords = ["zeal"];
    });
    const unit = s.board[
      `${enemyGeneral.row},${enemyGeneral.col === 0 ? 1 : enemyGeneral.col - 1}`
    ]!;
    expect(effectivePowerWithZeal(s, unit)).toBe(unit.card.currentPower);
  });
});
