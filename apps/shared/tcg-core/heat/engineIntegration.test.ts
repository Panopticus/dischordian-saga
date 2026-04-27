/**
 * Heat Phase 2 — engine integration + producer wiring (#1).
 *
 * Phase 1 (PR #238) shipped the modifier registry as pure data.
 * This phase plumbs it through the engine: createMatchState
 * validates the caller-supplied id list and persists it on
 * GameState.heatModifiers so the canonical state hash includes
 * the modifier set. Two matches with the same actions but
 * different heat configs hash differently — they're functionally
 * different runs and a Heat-5 replay must not be hash-confused
 * with a Heat-0 replay.
 *
 * Coverage:
 *
 *   1. createMatchState defaults heatModifiers to [] when the opt
 *      isn't passed (heat-agnostic story / tutorial / AI matches).
 *   2. Valid modifier ids round-trip onto GameState in declaration
 *      order.
 *   3. Misconfiguration (unknown / duplicate / over-cap) throws
 *      with the validateHeatConfig reason embedded.
 *   4. hashState distinguishes Heat-0 from Heat-N otherwise-
 *      identical states.
 *   5. duelystWs.mergeHeatModifiers unions the two queue lock-ins
 *      with duplicates dropped, preserving order.
 *   6. Static-analysis on the duelystWs wiring so the field can't
 *      silently disappear from the JOIN_QUEUE path.
 */
import { describe, it, expect } from "vitest";
import {
  createMatchState,
  hashState,
  HEAT_MODIFIERS,
  buildCardRegistry,
} from "@shared/tcg-core";

const TEST_REGISTRY = buildCardRegistry([], { allowEmpty: true });

// Minimal MatchConfig pair — buildMatchConfig requires non-empty
// deckCardIds even under skipValidation, so use single placeholder
// ids the engine treats as unknown vanilla cards (matchCore.ts §82
// has the canonical pattern).
function makeFixture(heatModifiers?: readonly string[]) {
  // The engine's MatchConfig type uses branded ids; cast through
  // unknown matches the production server-side pattern in
  // duelystWs.ts where matchCore.buildMatchConfig produces the brand.
  const p1 = {
    userId: 100,
    faction: "insurgency",
    generalDefId: "gen_insurgency",
    deckCardDefIds: ["placeholder_card_a"],
  } as unknown as Parameters<typeof createMatchState>[0]["p1"];
  const p2 = {
    userId: 200,
    faction: "architect",
    generalDefId: "gen_architect",
    deckCardDefIds: ["placeholder_card_b"],
  } as unknown as Parameters<typeof createMatchState>[0]["p2"];
  return createMatchState({
    matchId: "heat-test-match",
    seed: "stable-seed",
    p1,
    p2,
    registry: TEST_REGISTRY,
    heatModifiers,
  });
}

describe("createMatchState — heatModifiers plumbing", () => {
  it("defaults to [] when the opt is undefined (heat-agnostic init)", () => {
    const state = makeFixture(undefined);
    expect(state.heatModifiers).toEqual([]);
  });

  it("defaults to [] when an empty array is passed", () => {
    const state = makeFixture([]);
    expect(state.heatModifiers).toEqual([]);
  });

  it("round-trips a single valid modifier id", () => {
    const id = HEAT_MODIFIERS[0].id;
    const state = makeFixture([id]);
    expect(state.heatModifiers).toEqual([id]);
  });

  it("round-trips multiple modifiers in declaration order", () => {
    const ids = [HEAT_MODIFIERS[0].id, HEAT_MODIFIERS[2].id];
    const state = makeFixture(ids);
    expect(state.heatModifiers).toEqual(ids);
  });

  it("throws on unknown id with the validator's reason embedded", () => {
    expect(() => makeFixture(["nope-not-a-real-modifier"])).toThrow(
      /unknown-modifier/,
    );
  });

  it("throws on duplicate modifier", () => {
    const id = HEAT_MODIFIERS[0].id;
    expect(() => makeFixture([id, id])).toThrow(/duplicate-modifier/);
  });

  it("throws on over-cap stack (registry total cost > MAX_HEAT_LEVEL=12)", () => {
    // The starter registry totals to 15 cost; MAX_HEAT_LEVEL is 12,
    // so passing every modifier overflows the cap.
    const allIds = HEAT_MODIFIERS.map((m) => m.id);
    expect(() => makeFixture(allIds)).toThrow(/exceeds-cap/);
  });
});

describe("hashState — heat-config sensitivity", () => {
  it("distinguishes Heat-0 from Heat-N otherwise-identical states", () => {
    const heat0 = makeFixture([]);
    const heat1 = makeFixture([HEAT_MODIFIERS[0].id]);
    expect(hashState(heat0)).not.toBe(hashState(heat1));
  });

  it("two states with the same modifier set in different order hash differently", () => {
    // Modifier order is meaningful — the validator preserves it, and
    // a future Phase-3 selection UI may surface order-dependent
    // effects. Lock the discrimination in now.
    const a = makeFixture([HEAT_MODIFIERS[0].id, HEAT_MODIFIERS[2].id]);
    const b = makeFixture([HEAT_MODIFIERS[2].id, HEAT_MODIFIERS[0].id]);
    expect(hashState(a)).not.toBe(hashState(b));
  });

  it("two states with the SAME heat config hash identically (determinism)", () => {
    const a = makeFixture([HEAT_MODIFIERS[0].id]);
    const b = makeFixture([HEAT_MODIFIERS[0].id]);
    expect(hashState(a)).toBe(hashState(b));
  });
});

// duelystWs producer wiring tests live in apps/server/heatWiring.test.ts
// (the shared/tcg-core directory is forbidden from importing server-only
// modules).
