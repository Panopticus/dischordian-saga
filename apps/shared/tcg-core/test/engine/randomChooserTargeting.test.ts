/**
 * Single-target chooser: "random" tests.
 *
 * Verifies that resolveTargetSelector picks deterministically from the
 * filtered candidate set when given an Rng, and that omitting the Rng
 * still yields the candidate list (used by `target_exists` existence
 * checks).
 */
import { describe, it, expect } from "vitest";
import { resolveTargetSelector } from "../../engine/targeting";
import { buildBareState, makeCardInstance } from "../fixtures/stateBuilder";
import { posKey } from "../../types/GameState";
import type { BoardEntity, GameState } from "../../types/GameState";
import type { ExecCtx } from "../../engine/execCtx";
import type { EntityId } from "../../types/Ids";
import type { TargetSelector } from "../../types/Targeting";
import { createRng } from "../../engine/rng";

function placeUnit(
  state: GameState,
  entityId: string,
  defId: string,
  side: 0 | 1,
  row: number,
  col: number,
): GameState {
  const card = makeCardInstance(entityId, defId, side);
  const entity: BoardEntity = {
    entityId: entityId as unknown as EntityId,
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
    chooseIndex: undefined,
    playerChosenTargetId: undefined,
    ...overrides,
  };
}

describe("single-target chooser: 'random'", () => {
  it("returns one entityId from the filtered candidate set", () => {
    let s = buildBareState();
    s = placeUnit(s, "ent_a", "s1_char_004_ambassador_veron", 1, 1, 3);
    s = placeUnit(s, "ent_b", "s1_char_004_ambassador_veron", 1, 1, 4);
    s = placeUnit(s, "ent_c", "s1_char_004_ambassador_veron", 1, 1, 5);

    const sel: TargetSelector = {
      kind: "single",
      filter: { controller: "opponent" },
      chooser: "random",
    };
    const rng = createRng("seed-1");
    const ids = resolveTargetSelector(sel, baseCtx(), s, rng);

    expect(ids).toHaveLength(1);
    const id = ids[0] as unknown as string;
    // The Seer general (general_p1) is a side-1 entity and also matches
    // the "controller: opponent" filter; the picked id must be one of
    // the four valid candidates.
    expect(["ent_a", "ent_b", "ent_c", "general_p1"]).toContain(id);
  });

  it("is deterministic — same seed yields the same pick", () => {
    let s = buildBareState();
    s = placeUnit(s, "ent_a", "s1_char_004_ambassador_veron", 1, 1, 3);
    s = placeUnit(s, "ent_b", "s1_char_004_ambassador_veron", 1, 1, 4);
    s = placeUnit(s, "ent_c", "s1_char_004_ambassador_veron", 1, 1, 5);

    const sel: TargetSelector = {
      kind: "single",
      filter: { controller: "opponent" },
      chooser: "random",
    };
    const first = resolveTargetSelector(sel, baseCtx(), s, createRng("seed-X"));
    const second = resolveTargetSelector(sel, baseCtx(), s, createRng("seed-X"));
    expect(first).toEqual(second);
  });

  it("returns [] when no entity matches the filter", () => {
    // Bare state has only the two generals; filter to friendly minions
    // (controller=self) excluding the source entity → no match.
    const s = buildBareState();
    const sel: TargetSelector = {
      kind: "single",
      filter: { controller: "self", except: "self" },
      chooser: "random",
    };
    const rng = createRng("seed-empty");
    const ids = resolveTargetSelector(
      sel,
      baseCtx({ sourceEntityId: s.players[0].generalEntityId }),
      s,
      rng,
    );
    expect(ids).toEqual([]);
  });

  it("returns the full candidate list when no rng is provided (existence-check semantics)", () => {
    let s = buildBareState();
    s = placeUnit(s, "ent_a", "s1_char_004_ambassador_veron", 1, 1, 3);
    s = placeUnit(s, "ent_b", "s1_char_004_ambassador_veron", 1, 1, 4);

    const sel: TargetSelector = {
      kind: "single",
      filter: { controller: "opponent" },
      chooser: "random",
    };
    const ids = resolveTargetSelector(sel, baseCtx(), s);
    // Two placed units + the Seer general all match controller:opponent.
    expect(ids.length).toBeGreaterThanOrEqual(2);
    const idStrings = ids.map((x) => x as unknown as string);
    expect(idStrings).toContain("ent_a");
    expect(idStrings).toContain("ent_b");
  });

  it("respects the unit filter when picking", () => {
    let s = buildBareState();
    s = placeUnit(s, "ent_friendly", "s1_char_004_ambassador_veron", 0, 1, 3);
    s = placeUnit(s, "ent_enemy", "s1_char_004_ambassador_veron", 1, 1, 4);

    const sel: TargetSelector = {
      kind: "single",
      filter: { controller: "opponent" },
      chooser: "random",
    };
    const rng = createRng("seed-filter");
    const ids = resolveTargetSelector(sel, baseCtx(), s, rng);

    expect(ids).toHaveLength(1);
    // Friendly unit must never be picked.
    expect(ids[0] as unknown as string).not.toBe("ent_friendly");
  });

  it("still throws UnsupportedSelectorError for chooser: 'opponent'", () => {
    let s = buildBareState();
    s = placeUnit(s, "ent_a", "s1_char_004_ambassador_veron", 1, 1, 3);

    const sel: TargetSelector = {
      kind: "single",
      filter: { controller: "opponent" },
      chooser: "opponent",
    };
    expect(() => resolveTargetSelector(sel, baseCtx(), s)).toThrow(
      /single-target chooser 'opponent' not yet implemented/,
    );
  });
});
