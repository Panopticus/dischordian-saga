/**
 * Pack keyword runtime tests — Phase H3.
 *
 * Engine handler is `packBonus` (combat.ts), composed into
 * `effectivePower`. Bonus = +1 per other allied unit on the board with
 * the same defId (excluding the pack unit itself + generals).
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import { effectivePower } from "../../engine/combat";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";
import type { EntityId } from "../../types/Ids";

function withPack(s: ReturnType<typeof buildBareState>, key: string) {
  return produce(s, (draft) => {
    const cell = draft.board[key];
    if (cell) cell.card.activeKeywords = ["pack"];
  });
}

describe("pack keyword", () => {
  it("returns base power with no allies of the same defId", () => {
    const A = "a" as EntityId;
    let s = placeUnit(buildBareState({ seed: "p-solo" }), A, "tok_pack", 0, 1, 1);
    s = withPack(s, "1,1");
    const unit = s.board["1,1"]!;
    expect(effectivePower(s, unit)).toBe(unit.card.currentPower);
  });

  it("adds +1 per ally of the same defId on the same side", () => {
    const A = "a" as EntityId;
    const B = "b" as EntityId;
    const C = "c" as EntityId;
    let s = placeUnit(buildBareState({ seed: "p-trio" }), A, "tok_pack", 0, 1, 1);
    s = placeUnit(s, B, "tok_pack", 0, 1, 3);
    s = placeUnit(s, C, "tok_pack", 0, 2, 2);
    s = withPack(s, "1,1");
    s = withPack(s, "1,3");
    s = withPack(s, "2,2");
    const unit = s.board["1,1"]!;
    expect(effectivePower(s, unit)).toBe(unit.card.currentPower + 2);
  });

  it("ignores enemy copies of the same defId", () => {
    const A = "a" as EntityId;
    const B = "b" as EntityId;
    let s = placeUnit(buildBareState({ seed: "p-enemy" }), A, "tok_pack", 0, 1, 1);
    s = placeUnit(s, B, "tok_pack", 1, 4, 4);
    s = withPack(s, "1,1");
    s = withPack(s, "4,4");
    const unit = s.board["1,1"]!;
    expect(effectivePower(s, unit)).toBe(unit.card.currentPower);
  });

  it("ignores allies with a different defId", () => {
    const A = "a" as EntityId;
    const B = "b" as EntityId;
    let s = placeUnit(buildBareState({ seed: "p-mixed" }), A, "tok_pack", 0, 1, 1);
    s = placeUnit(s, B, "tok_other", 0, 1, 3);
    s = withPack(s, "1,1");
    const unit = s.board["1,1"]!;
    expect(effectivePower(s, unit)).toBe(unit.card.currentPower);
  });
});
