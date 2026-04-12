/**
 * Replay tests.
 *
 * Validates that replayMatch reproduces a match deterministically from
 * its seed + action log, and that verifyReplay detects hash mismatches.
 */
import { describe, it, expect } from "vitest";
import { replayMatch, verifyReplay } from "../../replay/replay";
import {
  createMatchState,
  reduce,
  hashState,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  RULES_VERSION,
} from "../../index";
import type { Action, MatchConfig } from "../../index";
import { PlayerId } from "../../types/Ids";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

function buildConfig(id: number, faction: string): MatchConfig {
  return {
    userId: PlayerId(id),
    faction: faction as MatchConfig["faction"],
    generalDefId: `gen_${faction}`,
    deckCardDefIds: Array.from({ length: 39 }, (_, i) => `fill_${id}_${i}`),
  };
}

const p1 = buildConfig(1, "architect");
const p2 = buildConfig(2, "dreamer");

describe("replayMatch", () => {
  it("reproduces the exact final state hash from a scripted action sequence", () => {
    // Play a scripted match via the live reducer.
    const actions: Action[] = [
      { kind: "finish_mulligan", actor: 0, seq: 1 },
      { kind: "finish_mulligan", actor: 1, seq: 2 },
      { kind: "end_turn", actor: 0, seq: 3 },
      { kind: "end_turn", actor: 1, seq: 4 },
      { kind: "end_turn", actor: 0, seq: 5 },
      { kind: "concede", actor: 1, seq: 6 },
    ];
    let live = createMatchState({
      matchId: "replay-test",
      seed: "replay-seed",
      p1,
      p2,
      registry,
    });
    for (const a of actions) {
      const r = reduce(live, a, registry);
      if (!r.error) live = r.state;
    }
    const liveHash = hashState(live);

    // Replay from the same seed + action log.
    const result = replayMatch({
      matchId: "replay-test",
      seed: "replay-seed",
      rulesVersion: RULES_VERSION,
      actions,
      p1Config: p1,
      p2Config: p2,
      registry,
    });

    expect(result.ok).toBe(true);
    expect(result.finalStateHash).toBe(liveHash);
    expect(result.steps.length).toBe(actions.length);
    expect(result.errorCount).toBe(0);
    expect(result.versionCompatible).toBe(true);
    expect(result.finalState.phase).toBe("ended");
    expect(result.finalState.winner).toBe(0);
  });

  it("records step-by-step state + events for timeline scrubbing", () => {
    const actions: Action[] = [
      { kind: "finish_mulligan", actor: 0, seq: 1 },
      { kind: "finish_mulligan", actor: 1, seq: 2 },
      { kind: "end_turn", actor: 0, seq: 3 },
    ];
    const result = replayMatch({
      matchId: "steps-test",
      seed: "steps-seed",
      rulesVersion: RULES_VERSION,
      actions,
      p1Config: p1,
      p2Config: p2,
      registry,
    });
    expect(result.steps.length).toBe(3);
    // Each step should have events (mulligan/turn transitions emit events)
    for (const step of result.steps) {
      expect(step.events.length).toBeGreaterThan(0);
      expect(step.error).toBeUndefined();
    }
    // Step 2 (end_turn) should show P1 as current player
    expect(result.steps[2].stateAfter.currentPlayer).toBe(1);
  });

  it("handles invalid actions gracefully (records error, continues)", () => {
    const actions: Action[] = [
      { kind: "finish_mulligan", actor: 0, seq: 1 },
      { kind: "finish_mulligan", actor: 1, seq: 2 },
      // Wrong actor — P1 tries to act on P0's turn
      { kind: "end_turn", actor: 1, seq: 3 },
      // Correct actor
      { kind: "end_turn", actor: 0, seq: 4 },
    ];
    const result = replayMatch({
      matchId: "err-test",
      seed: "err-seed",
      rulesVersion: RULES_VERSION,
      actions,
      p1Config: p1,
      p2Config: p2,
      registry,
    });
    expect(result.ok).toBe(false);
    expect(result.errorCount).toBe(1);
    expect(result.steps[2].error).toMatch(/not_your_turn/);
    // The valid action after the error still applies
    expect(result.steps[3].error).toBeUndefined();
  });

  it("same seed + actions always produce identical hashes (determinism proof)", () => {
    const actions: Action[] = [
      { kind: "finish_mulligan", actor: 0, seq: 1 },
      { kind: "finish_mulligan", actor: 1, seq: 2 },
      { kind: "end_turn", actor: 0, seq: 3 },
      { kind: "end_turn", actor: 1, seq: 4 },
    ];
    const a = replayMatch({
      matchId: "det",
      seed: "same",
      rulesVersion: RULES_VERSION,
      actions,
      p1Config: p1,
      p2Config: p2,
      registry,
    });
    const b = replayMatch({
      matchId: "det",
      seed: "same",
      rulesVersion: RULES_VERSION,
      actions,
      p1Config: p1,
      p2Config: p2,
      registry,
    });
    expect(a.finalStateHash).toBe(b.finalStateHash);
  });
});

describe("verifyReplay", () => {
  it("returns true when hash matches", () => {
    const actions: Action[] = [
      { kind: "finish_mulligan", actor: 0, seq: 1 },
      { kind: "finish_mulligan", actor: 1, seq: 2 },
      { kind: "concede", actor: 0, seq: 3 },
    ];
    const result = replayMatch({
      matchId: "v1",
      seed: "verify",
      rulesVersion: RULES_VERSION,
      actions,
      p1Config: p1,
      p2Config: p2,
      registry,
    });
    expect(
      verifyReplay(
        {
          matchId: "v1",
          seed: "verify",
          rulesVersion: RULES_VERSION,
          actions,
          p1Config: p1,
          p2Config: p2,
          registry,
        },
        result.finalStateHash
      )
    ).toBe(true);
  });

  it("returns false when hash doesn't match", () => {
    const actions: Action[] = [
      { kind: "finish_mulligan", actor: 0, seq: 1 },
      { kind: "finish_mulligan", actor: 1, seq: 2 },
    ];
    expect(
      verifyReplay(
        {
          matchId: "v2",
          seed: "verify2",
          rulesVersion: RULES_VERSION,
          actions,
          p1Config: p1,
          p2Config: p2,
          registry,
        },
        "0000000000000000" // wrong hash
      )
    ).toBe(false);
  });
});
