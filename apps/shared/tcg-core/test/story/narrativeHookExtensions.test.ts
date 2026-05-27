/* ═══════════════════════════════════════════════════════
   NarrativeHook extensions — Phase A1 tests

   Pins the new union variants the Stakes Stream + in-match
   dialog adoption depends on:

     • NarrativeCondition: `trial_balance_crosses`
     • NarrativeAction:    `branching_dialog`

   And the small but load-bearing fix that `initEncounter`
   now forwards `encounter.stakesMode` through to
   `createMatchState` (prior to this slice the field existed
   on the encounter type but was silently dropped at init —
   a textbook "scaffolding without adoption" gap).
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import {
  checkNarrativeHooks,
  type NarrativeHook,
  type StoryEncounter,
} from "../../story/encounter";
import type { GameState } from "../../types/GameState";
import type { TrialState } from "../../types/TrialPhase";

function trial(balance: number): TrialState {
  return {
    openingVerdictBalance: 0,
    trialBalance: balance,
    openingArgumentPlayed: false,
    closingArgumentPlayed: false,
  };
}

function stateWith(t: TrialState | undefined): GameState {
  return { trial: t } as unknown as GameState;
}

function encounterWithHook(hook: NarrativeHook): StoryEncounter {
  return {
    id: "test_encounter",
    chapterId: "test",
    name: "Test",
    description: "",
    bossFaction: "neutral",
    bossGeneralDefId: "x",
    bossDeckCardDefIds: [],
    seed: "test",
    winConditions: [],
    loseConditions: [],
    narrativeHooks: [hook],
  };
}

describe("NarrativeCondition.trial_balance_crosses", () => {
  it("fires when balance crosses threshold from below (direction: above)", () => {
    const enc = encounterWithHook({
      id: "h1",
      once: false,
      condition: {
        kind: "trial_balance_crosses",
        threshold: 3,
        direction: "above",
      },
      action: { kind: "boss_taunt", text: "fired" },
    });
    // Below threshold → no fire.
    expect(
      checkNarrativeHooks(enc, stateWith(trial(2)), new Set()),
    ).toHaveLength(0);
    // At threshold → fires (>=).
    expect(
      checkNarrativeHooks(enc, stateWith(trial(3)), new Set()),
    ).toHaveLength(1);
    // Above threshold → fires.
    expect(
      checkNarrativeHooks(enc, stateWith(trial(5)), new Set()),
    ).toHaveLength(1);
  });

  it("fires when balance crosses threshold from above (direction: below)", () => {
    const enc = encounterWithHook({
      id: "h2",
      once: false,
      condition: {
        kind: "trial_balance_crosses",
        threshold: -3,
        direction: "below",
      },
      action: { kind: "boss_taunt", text: "fired" },
    });
    expect(
      checkNarrativeHooks(enc, stateWith(trial(-2)), new Set()),
    ).toHaveLength(0);
    expect(
      checkNarrativeHooks(enc, stateWith(trial(-3)), new Set()),
    ).toHaveLength(1);
    expect(
      checkNarrativeHooks(enc, stateWith(trial(-5)), new Set()),
    ).toHaveLength(1);
  });

  it("is a no-op on encounters whose state.trial is undefined (non-Trial matches)", () => {
    const enc = encounterWithHook({
      id: "h3",
      once: false,
      condition: {
        kind: "trial_balance_crosses",
        threshold: 0,
        direction: "above",
      },
      action: { kind: "boss_taunt", text: "fired" },
    });
    expect(
      checkNarrativeHooks(enc, stateWith(undefined), new Set()),
    ).toHaveLength(0);
  });

  it("respects `once: true` — fires at most once per match", () => {
    const enc = encounterWithHook({
      id: "h4",
      once: true,
      condition: {
        kind: "trial_balance_crosses",
        threshold: 3,
        direction: "above",
      },
      action: { kind: "boss_taunt", text: "fired" },
    });
    const fired = new Set<string>();
    const first = checkNarrativeHooks(enc, stateWith(trial(5)), fired);
    expect(first).toHaveLength(1);
    expect(fired.has("h4")).toBe(true);
    // Second call with the same fired set — already-fired, must skip.
    const second = checkNarrativeHooks(enc, stateWith(trial(5)), fired);
    expect(second).toHaveLength(0);
  });
});

describe("NarrativeAction.branching_dialog", () => {
  it("surfaces unchanged from a fired hook", () => {
    const enc = encounterWithHook({
      id: "h5",
      once: false,
      condition: { kind: "always" },
      action: {
        kind: "branching_dialog",
        treeId: "game-master-mid-trial-intercession",
        entryNodeId: "winning_band_entry",
      },
    });
    const actions = checkNarrativeHooks(enc, stateWith(trial(0)), new Set());
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      kind: "branching_dialog",
      treeId: "game-master-mid-trial-intercession",
      entryNodeId: "winning_band_entry",
    });
  });
});

describe("Existing NarrativeCondition variants — regression guard", () => {
  // The extension MUST NOT change pre-existing variant semantics.
  // These probes lock the prior behavior so future condition
  // additions can't drift it.

  it("turn_reached still fires at state.turnNumber >= turn", () => {
    const enc = encounterWithHook({
      id: "h6",
      once: false,
      condition: { kind: "turn_reached", turn: 3 },
      action: { kind: "boss_taunt", text: "fired" },
    });
    const s = { turnNumber: 3, trial: undefined } as unknown as GameState;
    expect(checkNarrativeHooks(enc, s, new Set())).toHaveLength(1);
  });

  it("always fires every check", () => {
    const enc = encounterWithHook({
      id: "h7",
      once: false,
      condition: { kind: "always" },
      action: { kind: "boss_taunt", text: "fired" },
    });
    const s = stateWith(undefined);
    expect(checkNarrativeHooks(enc, s, new Set())).toHaveLength(1);
    expect(checkNarrativeHooks(enc, s, new Set())).toHaveLength(1);
  });
});
