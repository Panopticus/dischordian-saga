/**
 * Flanking keyword runtime tests — plan §C1.
 *
 * Engine handlers: `isFlanking` (predicate) and
 * `effectiveAttackPower` (composes effectivePower + flanking
 * bonus when the attacker has the keyword and a non-attacker
 * ally is king-adjacent to the target).
 *
 * Reference: XCOM-style positional pressure. The bonus does
 * NOT stack — multiple ally flankers grant the same +N as one.
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import { effectiveAttackPower, effectivePower, isFlanking } from "../../engine/combat";
import { buildBareState, placeUnit } from "../fixtures/stateBuilder";
import type { EntityId } from "../../types/Ids";

function withFlanking(s: ReturnType<typeof buildBareState>, key: string) {
  return produce(s, (draft) => {
    const cell = draft.board[key];
    if (cell) cell.card.activeKeywords = ["flanking"];
  });
}

describe("flanking — isFlanking predicate", () => {
  it("false when only the attacker is adjacent to the target", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-solo" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(isFlanking(s, att, tgt)).toBe(false);
  });

  it("true when an ally other than the attacker is also adjacent to the target", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    const F = "ally" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-pair" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    s = placeUnit(s, F, "tok_pack", 0, 2, 4); // ally king-adjacent to target on the other side
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(isFlanking(s, att, tgt)).toBe(true);
  });

  it("ignores the attacker itself when scanning target's neighbours", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-self" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(isFlanking(s, att, tgt)).toBe(false);
  });

  it("ignores enemy units adjacent to the target", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    const E = "enemy" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-enemy" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    s = placeUnit(s, E, "tok_pack", 1, 2, 4);
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(isFlanking(s, att, tgt)).toBe(false);
  });

  it("counts diagonal allies (king-adjacent, not orthogonal-only)", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    const F = "diag" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-diag" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    s = placeUnit(s, F, "tok_pack", 0, 3, 4); // diagonal to target
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(isFlanking(s, att, tgt)).toBe(true);
  });
});

describe("flanking — effectiveAttackPower bonus", () => {
  it("equals effectivePower when the attacker lacks the keyword", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    const F = "ally" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-nokey" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    s = placeUnit(s, F, "tok_pack", 0, 2, 4);
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(effectiveAttackPower(s, att, tgt)).toBe(effectivePower(s, att));
  });

  it("equals effectivePower when the keyword is present but no ally is flanking", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-noalign" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    s = withFlanking(s, "2,2");
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(effectiveAttackPower(s, att, tgt)).toBe(effectivePower(s, att));
  });

  it("adds +2 when keyword + ally flank conditions are both met", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    const F = "ally" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-bonus" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    s = placeUnit(s, F, "tok_pack", 0, 2, 4);
    s = withFlanking(s, "2,2");
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(effectiveAttackPower(s, att, tgt)).toBe(effectivePower(s, att) + 2);
  });

  it("does NOT stack — two flanking allies grant the same +2 as one", () => {
    const A = "att" as EntityId;
    const T = "tgt" as EntityId;
    const F1 = "ally1" as EntityId;
    const F2 = "ally2" as EntityId;
    let s = placeUnit(buildBareState({ seed: "f-stack" }), A, "tok_pack", 0, 2, 2);
    s = placeUnit(s, T, "tok_pack", 1, 2, 3);
    s = placeUnit(s, F1, "tok_pack", 0, 2, 4);
    s = placeUnit(s, F2, "tok_pack", 0, 3, 4);
    s = withFlanking(s, "2,2");
    const att = s.board["2,2"]!;
    const tgt = s.board["2,3"]!;
    expect(effectiveAttackPower(s, att, tgt)).toBe(effectivePower(s, att) + 2);
  });
});
