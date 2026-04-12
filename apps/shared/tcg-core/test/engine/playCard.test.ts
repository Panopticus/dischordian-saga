/**
 * End-to-end play_card tests through the real reducer.
 *
 * Exercises the full deploy/spell pipeline against a real match state,
 * with the default trigger runner installed (so on_deploy abilities
 * actually fire and mutate board state).
 *
 * Covers:
 *  - Unit deploy adjacent to general → on_deploy triggers fire (counter
 *    appears via interpreter)
 *  - Deploy away from any friendly → tile_not_adjacent refunded
 *  - Deploy onto occupied tile → refunded
 *  - Insufficient mana → insufficient_mana, no hand/mana mutation
 *  - Out-of-bounds hand index → hand_index_out_of_bounds
 *  - Spell with with_target + add_counter → target gains counter
 */
import { describe, it, expect } from "vitest";
import {
  createMatchState,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  reduce,
  posKey,
  BOARD_HEIGHT,
} from "../../index";
import type { Action, GameState, MatchConfig } from "../../index";
import type { CardInstance } from "../../types/Card";
import { produce } from "immer";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

function buildConfig(
  userId: number,
  faction: MatchConfig["faction"],
  generalDefId: string,
  deckCardDefIds: string[]
): MatchConfig {
  return {
    userId: userId as MatchConfig["userId"],
    faction,
    generalDefId,
    deckCardDefIds,
  };
}

function freshMatch(seed = "play-card", p1Deck?: string[], p2Deck?: string[]): GameState {
  const defaultDeck = Array.from({ length: 39 }, (_, i) => `filler_${i}`);
  const p1 = buildConfig(1, "architect", "gen_architect", p1Deck ?? defaultDeck);
  const p2 = buildConfig(2, "dreamer", "gen_dreamer", p2Deck ?? defaultDeck);
  let s = createMatchState({ matchId: "pc", seed, p1, p2, registry });
  // Skip mulligan so we're in playing phase with mana = 3 for P0.
  s = reduce(s, { kind: "finish_mulligan", actor: 0, seq: 1 }, registry).state;
  s = reduce(s, { kind: "finish_mulligan", actor: 1, seq: 2 }, registry).state;
  return s;
}

/**
 * Surgery: insert a specific card definition id into P0's hand at
 * index 0. Replaces whatever opening-hand card was at that slot. Used
 * so tests don't have to rely on what randomly ends up in hand.
 */
function giveCardToHand(
  state: GameState,
  side: 0 | 1,
  defId: string,
  entityId: string,
  opts: Partial<Pick<CardInstance, "currentPower" | "currentHealth" | "maxHealth">> = {}
): GameState {
  return produce(state, (draft) => {
    const def = registry.get(defId);
    if (!def) throw new Error(`no card def: ${defId}`);
    const card: CardInstance = {
      entityId: entityId as CardInstance["entityId"],
      defId: defId as CardInstance["defId"],
      owner: side,
      currentPower: opts.currentPower ?? def.baseStats?.power ?? 0,
      currentHealth: opts.currentHealth ?? def.baseStats?.health ?? 1,
      maxHealth: opts.maxHealth ?? def.baseStats?.health ?? 1,
      counters: {},
      activeKeywords: def.keywords ? [...def.keywords] : [],
      buffs: [],
      flags: {},
    };
    // Overwrite hand index 0 so tests have a known handIndex to play.
    draft.players[side].hand = [card, ...draft.players[side].hand.slice(1)];
    // Give plenty of mana.
    draft.players[side].mana = 9;
    draft.players[side].maxMana = 9;
  });
}

describe("play_card — units", () => {
  it("deploys the Antiquarian and fires its on_deploy ability through the queue", () => {
    let s = freshMatch("unit-1");
    s = giveCardToHand(s, 0, "s1_char_018", "ant_play");
    const mid = Math.floor(BOARD_HEIGHT / 2);
    // P0 general is at (mid, 0). Deploy the Antiquarian at (mid, 1) —
    // adjacent, empty.
    const r = reduce(
      s,
      {
        kind: "play_card",
        actor: 0,
        handIndex: 0,
        row: mid,
        col: 1,
        seq: 3,
      },
      registry
    );
    expect(r.error).toBeUndefined();

    // Unit is on the board.
    const deployed = r.state.board[posKey(mid, 1)];
    expect(deployed).toBeDefined();
    expect(deployed.card.defId).toBe("s1_char_018");
    // on_deploy ran via the fixed-point loop: forcefield_charges counter
    // is present.
    expect(deployed.card.counters.forcefield_charges).toBe(4);

    // Mana was spent.
    expect(r.state.players[0].mana).toBe(9 - 5);
    // Card left hand.
    expect(r.state.players[0].hand.some((c) => c.entityId === "ant_play")).toBe(false);
  });

  it("rejects deploy to non-adjacent tile with refund", () => {
    let s = freshMatch("unit-2");
    s = giveCardToHand(s, 0, "s1_char_018", "ant_fail");
    // Deploy far from any friendly.
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, row: 0, col: 5, seq: 3 },
      registry
    );
    expect(r.error).toBeDefined();
    expect(r.error?.code).toBe("out_of_range");
    // Refund: card still in hand, mana untouched.
    expect(r.state.players[0].hand[0].entityId).toBe("ant_fail");
    expect(r.state.players[0].mana).toBe(9);
  });

  it("rejects deploy onto occupied tile with refund", () => {
    let s = freshMatch("unit-3");
    s = giveCardToHand(s, 0, "s1_char_018", "ant_occ");
    const mid = Math.floor(BOARD_HEIGHT / 2);
    // Tile (mid, 0) is already occupied by the general.
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, row: mid, col: 0, seq: 3 },
      registry
    );
    expect(r.error).toBeDefined();
    // Card still in hand.
    expect(r.state.players[0].hand[0].entityId).toBe("ant_occ");
    expect(r.state.players[0].mana).toBe(9);
  });

  it("rejects with insufficient_mana when the player can't afford the cost", () => {
    let s = freshMatch("unit-4");
    s = giveCardToHand(s, 0, "s1_char_018", "ant_poor");
    // Drop mana to 3, below the cost of 5.
    s = produce(s, (draft) => {
      draft.players[0].mana = 3;
    });
    const mid = Math.floor(BOARD_HEIGHT / 2);
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, row: mid, col: 1, seq: 3 },
      registry
    );
    expect(r.error?.code).toBe("insufficient_mana");
    expect(r.state.players[0].hand[0].entityId).toBe("ant_poor");
    expect(r.state.players[0].mana).toBe(3);
  });

  it("rejects out-of-bounds hand index", () => {
    const s = freshMatch("unit-5");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 99, row: 0, col: 0, seq: 3 },
      registry
    );
    expect(r.error?.code).toBe("hand_index_out_of_bounds");
  });

  it("rejects play from the non-active player", () => {
    let s = freshMatch("unit-6");
    s = giveCardToHand(s, 1, "s1_char_018", "ant_wrong");
    const mid = Math.floor(BOARD_HEIGHT / 2);
    const r = reduce(
      s,
      { kind: "play_card", actor: 1, handIndex: 0, row: mid, col: 7, seq: 3 },
      registry
    );
    expect(r.error?.code).toBe("not_your_turn");
  });
});

describe("play_card — spells", () => {
  it("casts Enigma's Lament on a friendly target and adds 2 forcefield_charges", () => {
    let s = freshMatch("spell-1");
    // Need a friendly target unit for the with_target selector.
    // Place a cheap unit next to the general first, then give the spell.
    s = giveCardToHand(s, 0, "s1_char_018", "ant_tgt");
    const mid = Math.floor(BOARD_HEIGHT / 2);
    s = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, row: mid, col: 1, seq: 3 },
      registry
    ).state;
    // The Antiquarian is now on (mid, 1). Give P0 the spell.
    s = giveCardToHand(s, 0, "s1_song_061", "lament");
    // Cast the spell targeting the Antiquarian.
    const r = reduce(
      s,
      {
        kind: "play_card",
        actor: 0,
        handIndex: 0,
        targetEntityId: "ant_tgt",
        seq: 5,
      },
      registry
    );
    expect(r.error).toBeUndefined();
    const ant = r.state.board[posKey(mid, 1)];
    // Already had 4 from on_deploy; spell adds 2 → 6.
    expect(ant.card.counters.forcefield_charges).toBe(6);
    // Mana spent: 1 for spell.
    expect(r.state.players[0].mana).toBe(9 - 1);
    // Spell routed to graveyard.
    expect(r.state.players[0].graveyard.some((c) => c.entityId === "lament")).toBe(
      true
    );
  });

  it("no-op on spell cast without a target (doesn't crash)", () => {
    let s = freshMatch("spell-2");
    s = giveCardToHand(s, 0, "s1_song_061", "lament_orphan");
    const r = reduce(
      s,
      { kind: "play_card", actor: 0, handIndex: 0, seq: 3 },
      registry
    );
    // Still legal — spell resolves, nothing changes, still goes to graveyard.
    expect(r.error).toBeUndefined();
    expect(r.state.players[0].graveyard.some((c) => c.entityId === "lament_orphan")).toBe(
      true
    );
  });
});
