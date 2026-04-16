/**
 * Scripted-action queue + §5.5 Warlord Zero encounter integration test.
 *
 * Drives a full match through `reduce()` from createMatchState through
 * the Warlord's third turn, asserting that the scripted-action queue
 * fires the Three Moves cast on schedule, the lockout activates, the
 * player's hand narrows on their next turn, and the lockout cleanly
 * ticks down to zero by global turn 6.
 *
 * This is the end-to-end exercise of the §5.5 lockout that PR #63's
 * unit tests left untested — they cover engine pieces in isolation;
 * this covers the encounter wire-up.
 */
import { describe, it, expect } from "vitest";
import {
  createMatchState,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  reduce,
  type Action,
  type GameState,
  type MatchConfig,
} from "../../index";
import { THREE_MOVES_CARD_DEF_ID } from "../../engine/lockout";
import { initEncounter } from "../../story/encounter";
import { CHAPTER_MAP } from "../../story/chapters";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

function buildConfig(userId: number, generalDefId: string): MatchConfig {
  return {
    userId: userId as MatchConfig["userId"],
    faction: "neutral",
    generalDefId,
    deckCardDefIds: Array.from({ length: 39 }, (_, i) => `${userId}_${i}`),
  };
}

/** Take a state through mulligan into the playing phase. */
function startPlaying(state: GameState): GameState {
  let s = state;
  for (const actor of [0, 1] as const) {
    const r = reduce(
      s,
      { kind: "finish_mulligan", actor, seq: 0 } as Action,
      registry,
    );
    expect(r.error).toBeUndefined();
    s = r.state;
  }
  return s;
}

/** End the active player's turn, returning the new state + collected events. */
function endTurn(state: GameState): { state: GameState; events: readonly unknown[] } {
  const r = reduce(
    state,
    { kind: "end_turn", actor: state.currentPlayer, seq: 0 } as Action,
    registry,
  );
  expect(r.error).toBeUndefined();
  return { state: r.state, events: r.events };
}

describe("scripted actions: drainScriptedActions integration", () => {
  it("force-plays Three Moves on Warlord turn 3, activating the lockout", () => {
    // Build a match where p2 (Warlord side, side 1) has Three Moves
    // in their deck and a scripted action fires it on global turn 3.
    const p1 = buildConfig(1, "gen_architect");
    const p2: MatchConfig = {
      ...buildConfig(2, "gen_architect"),
      // Put Three Moves at index 0 of the unshuffled deck so it's
      // findable in deck even before the scripted-action drain
      // lifts it into hand. The remaining 38 are filler defIds.
      deckCardDefIds: [
        THREE_MOVES_CARD_DEF_ID,
        ...Array.from({ length: 38 }, (_, i) => `2_${i}`),
      ],
    };

    const initial = createMatchState({
      matchId: "scripted-int",
      seed: "scripted-test",
      p1,
      p2,
      registry,
      scriptedActions: [
        {
          kind: "force_play_card",
          globalTurn: 3,
          side: 1,
          cardDefId: THREE_MOVES_CARD_DEF_ID,
        },
      ],
    });

    let s = startPlaying(initial);
    expect(s.lockout).toBeUndefined();

    // turn 1: P0 ends → P1 (turnNumber stays 1)
    s = endTurn(s).state;
    expect(s.currentPlayer).toBe(1);
    expect(s.turnNumber).toBe(1);
    expect(s.lockout).toBeUndefined();

    // turn 1→2: P1 ends → P0 (turnNumber → 2)
    s = endTurn(s).state;
    expect(s.currentPlayer).toBe(0);
    expect(s.turnNumber).toBe(2);
    expect(s.lockout).toBeUndefined();

    // turn 2: P0 ends → P1 (turnNumber stays 2)
    s = endTurn(s).state;
    expect(s.currentPlayer).toBe(1);
    expect(s.turnNumber).toBe(2);

    // turn 2→3: P1 ends → P0 (turnNumber → 3)
    s = endTurn(s).state;
    expect(s.currentPlayer).toBe(0);
    expect(s.turnNumber).toBe(3);

    // turn 3: P0 ends → P1 (turnNumber stays 3, Warlord's third turn).
    // The drain on this transition should fire the scripted action.
    const { state: turn3WarlordState, events } = endTurn(s);
    s = turn3WarlordState;
    expect(s.currentPlayer).toBe(1);
    expect(s.turnNumber).toBe(3);
    // Scripted action fired event must be in the timeline.
    expect(
      events.some(
        (e) =>
          (e as { type?: string }).type === "scripted_action_fired" &&
          (e as { cardDefId?: string }).cardDefId === THREE_MOVES_CARD_DEF_ID,
      ),
    ).toBe(true);
    // Lockout must be active, targeting the player (side 0).
    expect(s.lockout).toBeDefined();
    expect(s.lockout!.targetSide).toBe(0);
    expect(s.lockout!.turnsRemaining).toBe(3);
    expect(s.lockout!.witnessed).toBe(true);
  });

  it("ticks the lockout to zero across the player's three locked turns", () => {
    const p2: MatchConfig = {
      ...buildConfig(2, "gen_architect"),
      deckCardDefIds: [
        THREE_MOVES_CARD_DEF_ID,
        ...Array.from({ length: 38 }, (_, i) => `2_${i}`),
      ],
    };
    const initial = createMatchState({
      matchId: "scripted-tick",
      seed: "tick-test",
      p1: buildConfig(1, "gen_architect"),
      p2,
      registry,
      scriptedActions: [
        {
          kind: "force_play_card",
          globalTurn: 3,
          side: 1,
          cardDefId: THREE_MOVES_CARD_DEF_ID,
        },
      ],
    });

    let s = startPlaying(initial);
    // Race through to the Warlord's turn 3 (the cast point).
    for (let i = 0; i < 5; i++) s = endTurn(s).state;
    expect(s.currentPlayer).toBe(1);
    expect(s.turnNumber).toBe(3);
    expect(s.lockout).toBeDefined();
    expect(s.lockout!.turnsRemaining).toBe(3);

    // Player turn 4 (P0). End it → tick to 2.
    s = endTurn(s).state; // P1 ends → P0 (turnNumber 4)
    expect(s.currentPlayer).toBe(0);
    expect(s.turnNumber).toBe(4);
    expect(s.lockout!.turnsRemaining).toBe(3); // not yet ticked
    s = endTurn(s).state; // P0 ends → tick → P1
    expect(s.currentPlayer).toBe(1);
    expect(s.lockout!.turnsRemaining).toBe(2);

    // Player turn 5: tick to 1.
    s = endTurn(s).state; // P1 ends → P0 (turnNumber 5)
    s = endTurn(s).state; // P0 ends → tick → P1
    expect(s.lockout!.turnsRemaining).toBe(1);

    // Player turn 6: tick to 0 → lockout cleared.
    s = endTurn(s).state; // P1 ends → P0 (turnNumber 6)
    const { state: cleared, events } = endTurn(s); // P0 ends → tick → cleared
    expect(cleared.lockout).toBeUndefined();
    expect(
      events.some((e) => (e as { type?: string }).type === "warlord_lockout_ended"),
    ).toBe(true);
  });

  it("emits scripted_action_skipped when the card isn't in deck or hand", () => {
    const initial = createMatchState({
      matchId: "scripted-miss",
      seed: "miss-test",
      p1: buildConfig(1, "gen_architect"),
      p2: buildConfig(2, "gen_architect"),
      registry,
      scriptedActions: [
        {
          kind: "force_play_card",
          globalTurn: 3,
          side: 1,
          cardDefId: "nonexistent_card_id",
        },
      ],
    });

    let s = startPlaying(initial);
    let lastEvents: readonly unknown[] = [];
    for (let i = 0; i < 5; i++) {
      const r = endTurn(s);
      s = r.state;
      lastEvents = r.events;
    }
    expect(s.currentPlayer).toBe(1);
    expect(s.turnNumber).toBe(3);
    expect(
      lastEvents.some(
        (e) =>
          (e as { type?: string }).type === "scripted_action_skipped" &&
          (e as { reason?: string }).reason === "card_not_in_hand_or_deck",
      ),
    ).toBe(true);
    // No lockout because Three Moves never played.
    expect(s.lockout).toBeUndefined();
  });
});

describe("§5.5 chapter wiring: chWarlordZeroFirst", () => {
  it("registered in CHAPTER_MAP with the lockout scripted action", () => {
    const enc = CHAPTER_MAP["ch_warlord_zero_first"];
    expect(enc).toBeDefined();
    expect(enc.scriptedActions).toBeDefined();
    expect(enc.scriptedActions!.length).toBe(1);
    const sa = enc.scriptedActions![0];
    expect(sa.kind).toBe("force_play_card");
    if (sa.kind === "force_play_card") {
      expect(sa.cardDefId).toBe(THREE_MOVES_CARD_DEF_ID);
      expect(sa.globalTurn).toBe(3);
      expect(sa.side).toBe(1);
    }
    // Three Moves is in the deck so the drain can find it.
    expect(enc.bossDeckCardDefIds).toContain(THREE_MOVES_CARD_DEF_ID);
  });

  it("initEncounter forwards scriptedActions onto the GameState", () => {
    const enc = CHAPTER_MAP["ch_warlord_zero_first"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "architect",
      playerGeneralDefId: "gen_architect",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    expect(init.gameState.scriptedActions).toBeDefined();
    expect(init.gameState.scriptedActions!.length).toBe(1);
  });
});
