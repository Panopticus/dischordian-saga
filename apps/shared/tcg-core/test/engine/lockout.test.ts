/**
 * §5.5 Warlord three-move lockout tests.
 *
 * Pure-helper unit tests + reducer-integration tests against the real
 * card registry (the Three Moves card is in ALL_CARD_DEFINITIONS as
 * of PR #62; the lockout intercept reads its defId by name).
 */
import { describe, it, expect } from "vitest";
import { produce } from "immer";
import type { Draft } from "immer";
import {
  buildBareState,
  makeCardInstance,
  emptyRegistry,
} from "../fixtures/stateBuilder";
import {
  THREE_MOVES_CARD_DEF_ID,
  LOCKOUT_DURATION_TURNS,
  LOCKOUT_NARROW_TO,
  partitionLockedHand,
  activateLockout,
  reevaluateLockout,
  tickLockout,
  isCardLocked,
} from "../../engine/lockout";
import type { CardDefinition, CardInstance } from "../../types/Card";
import type { GameState, CardRegistry } from "../../types/GameState";
import type { GameEvent } from "../../types/Event";

/* ──────────────────────────────────────────────────────────────────── */
/*  Helpers                                                              */
/* ──────────────────────────────────────────────────────────────────── */

/**
 * Minimal card registry over a small map. Tests construct a few
 * stubbed CardDefinitions and feed them through the lockout helpers
 * without depending on the full ALL_CARD_DEFINITIONS array.
 */
function makeRegistry(defs: CardDefinition[]): CardRegistry {
  const map = new Map(defs.map((d) => [String(d.id), d]));
  return {
    get: (id: string) => map.get(id),
    has: (id: string) => map.has(id),
    listAll: () => defs,
  };
}

/** Quick stub CardDefinition. Only fields the lockout heuristic reads. */
function stubDef(opts: {
  id: string;
  faction: CardDefinition["faction"];
  cardType?: CardDefinition["cardType"];
  cost?: number;
  rarity?: CardDefinition["rarity"];
  keywords?: CardDefinition["keywords"];
  abilities?: CardDefinition["abilities"];
  flavorText?: string;
}): CardDefinition {
  return {
    id: opts.id as CardDefinition["id"],
    name: opts.id,
    faction: opts.faction,
    cardType: opts.cardType ?? "unit",
    rarity: opts.rarity ?? "common",
    cost: opts.cost ?? 3,
    baseStats: opts.cardType === "spell" ? undefined : { power: 2, health: 3 },
    keywords: opts.keywords ?? [],
    abilities: opts.abilities ?? [],
    art: "/test.webp",
    flavorText: opts.flavorText ?? "",
    rulesVersion: "1.0.0",
  };
}

/** Push a list of CardInstances into player 0's hand. */
function withHand(state: GameState, hand: CardInstance[]): GameState {
  return {
    ...state,
    players: [
      { ...state.players[0], hand },
      state.players[1],
    ],
  };
}

/** Produce a draft, run a mutator, return the new state + collected events. */
function mutate(
  state: GameState,
  fn: (draft: Draft<GameState>, events: GameEvent[]) => void,
): { state: GameState; events: GameEvent[] } {
  const events: GameEvent[] = [];
  const next = produce(state, (draft) => fn(draft, events));
  return { state: next, events };
}

/* ──────────────────────────────────────────────────────────────────── */
/*  partitionLockedHand                                                 */
/* ──────────────────────────────────────────────────────────────────── */

describe("partitionLockedHand", () => {
  it("locks the top-2 most-favorable non-insurgency cards", () => {
    const defs = [
      stubDef({ id: "a_low", faction: "architect", cost: 9 }), // unaffordable, low score
      stubDef({ id: "a_mid", faction: "architect", cost: 2 }), // affordable, mid score
      stubDef({
        id: "a_high",
        faction: "architect",
        cost: 1,
        keywords: ["rush", "celerity"],
      }), // affordable + offensive keywords → high score
      stubDef({ id: "n_mid", faction: "neutral", cost: 2 }),
    ];
    const reg = makeRegistry(defs);
    const hand = [
      makeCardInstance("e1", "a_low", 0),
      makeCardInstance("e2", "a_mid", 0),
      makeCardInstance("e3", "a_high", 0),
      makeCardInstance("e4", "n_mid", 0),
    ];
    const state = withHand(buildBareState(), hand);
    const result = partitionLockedHand(
      hand,
      reg,
      state.players[0],
      state.board,
      0,
    );
    expect(result.locked).toHaveLength(LOCKOUT_NARROW_TO);
    // a_high is most favorable; one of the affordable mid-score cards
    // (a_mid or n_mid) follows. a_low is unaffordable → least favorable
    // → unlocked.
    expect(result.locked).toContain("e3");
    expect(result.playable).toContain("e1");
  });

  it("leaves all insurgency cards playable regardless of score", () => {
    const defs = [
      stubDef({
        id: "ins_strong",
        faction: "insurgency",
        cost: 1,
        keywords: ["rush", "celerity", "blast"],
      }),
      stubDef({ id: "arch_weak", faction: "architect", cost: 9 }),
      stubDef({ id: "neut_weak", faction: "neutral", cost: 9 }),
    ];
    const reg = makeRegistry(defs);
    const hand = [
      makeCardInstance("ins", "ins_strong", 0),
      makeCardInstance("aw", "arch_weak", 0),
      makeCardInstance("nw", "neut_weak", 0),
    ];
    const state = withHand(buildBareState(), hand);
    const result = partitionLockedHand(
      hand,
      reg,
      state.players[0],
      state.board,
      0,
    );
    // Insurgency immune → always playable.
    expect(result.playable).toContain("ins");
    // The two non-immune cards are both candidates for lock; with
    // narrowTo=2, both end up locked (since they're the "top 2 of 2").
    expect(result.locked).toEqual(expect.arrayContaining(["aw", "nw"]));
  });

  it("treats unknown defIds as immune (defensive default)", () => {
    const reg = makeRegistry([
      stubDef({ id: "known", faction: "architect", cost: 2 }),
    ]);
    const hand = [
      makeCardInstance("u", "totally_unknown", 0),
      makeCardInstance("k", "known", 0),
    ];
    const state = withHand(buildBareState(), hand);
    const result = partitionLockedHand(
      hand,
      reg,
      state.players[0],
      state.board,
      0,
    );
    expect(result.playable).toContain("u");
  });

  it("locks zero cards when the non-immune set is empty", () => {
    const defs = [
      stubDef({ id: "ins_a", faction: "insurgency" }),
      stubDef({ id: "ins_b", faction: "insurgency" }),
    ];
    const reg = makeRegistry(defs);
    const hand = [
      makeCardInstance("a", "ins_a", 0),
      makeCardInstance("b", "ins_b", 0),
    ];
    const state = withHand(buildBareState(), hand);
    const result = partitionLockedHand(
      hand,
      reg,
      state.players[0],
      state.board,
      0,
    );
    expect(result.locked).toEqual([]);
    expect(result.playable).toEqual(["a", "b"]);
  });

  it("breaks score ties deterministically by entityId", () => {
    // All four cards score identically; sort tiebreak should pin
    // entityIds "a" and "b" as the two locked, leaving "c" and "d"
    // playable.
    const def = stubDef({ id: "vanilla", faction: "architect", cost: 2 });
    const reg = makeRegistry([def]);
    const hand = [
      makeCardInstance("a", "vanilla", 0),
      makeCardInstance("b", "vanilla", 0),
      makeCardInstance("c", "vanilla", 0),
      makeCardInstance("d", "vanilla", 0),
    ];
    const state = withHand(buildBareState(), hand);
    const result = partitionLockedHand(
      hand,
      reg,
      state.players[0],
      state.board,
      0,
    );
    expect(result.locked.slice().sort()).toEqual(["a", "b"]);
  });
});

/* ──────────────────────────────────────────────────────────────────── */
/*  activateLockout / reevaluateLockout / tickLockout                   */
/* ──────────────────────────────────────────────────────────────────── */

describe("lockout lifecycle", () => {
  it("activateLockout sets target side + emits witness event", () => {
    const state = buildBareState();
    const { state: next, events } = mutate(state, (draft, evs) => {
      activateLockout(draft, 0, evs);
    });
    expect(next.lockout).toBeDefined();
    expect(next.lockout!.targetSide).toBe(0);
    expect(next.lockout!.turnsRemaining).toBe(LOCKOUT_DURATION_TURNS);
    expect(next.lockout!.witnessed).toBe(true);
    expect(events.find((e) => e.type === "architect_reality_edit_witnessed")).toBeDefined();
    expect(events.find((e) => e.type === "warlord_lockout_started")).toBeDefined();
  });

  it("reevaluateLockout populates playable/locked from current hand", () => {
    const defs = [
      stubDef({ id: "a", faction: "architect", cost: 9 }),
      stubDef({ id: "b", faction: "architect", cost: 1 }),
      stubDef({ id: "i", faction: "insurgency" }),
    ];
    const reg = makeRegistry(defs);
    const hand = [
      makeCardInstance("e1", "a", 0),
      makeCardInstance("e2", "b", 0),
      makeCardInstance("e3", "i", 0),
    ];
    const state0 = withHand(buildBareState(), hand);
    const { state: state1 } = mutate(state0, (draft, evs) => {
      activateLockout(draft, 0, evs);
    });
    const { state: state2, events } = mutate(state1, (draft, evs) => {
      reevaluateLockout(draft, 0, reg, evs);
    });
    expect(state2.lockout!.playableEntityIds.length + state2.lockout!.lockedEntityIds.length).toBe(3);
    expect(state2.lockout!.playableEntityIds).toContain("e3"); // insurgency immune
    expect(events.find((e) => e.type === "warlord_lockout_re_evaluated")).toBeDefined();
  });

  it("tickLockout decrements and clears at 0", () => {
    const state0 = buildBareState();
    const { state: state1 } = mutate(state0, (draft, evs) => {
      activateLockout(draft, 0, evs);
    });
    const { state: state2 } = mutate(state1, (d, e) => tickLockout(d, 0, e));
    expect(state2.lockout!.turnsRemaining).toBe(2);
    const { state: state3 } = mutate(state2, (d, e) => tickLockout(d, 0, e));
    expect(state3.lockout!.turnsRemaining).toBe(1);
    const { state: state4, events: ev4 } = mutate(state3, (d, e) =>
      tickLockout(d, 0, e),
    );
    expect(state4.lockout).toBeUndefined();
    expect(ev4.find((e) => e.type === "warlord_lockout_ended")).toBeDefined();
  });

  it("tickLockout no-op when no lockout is active", () => {
    const state = buildBareState();
    const { state: next, events } = mutate(state, (d, e) => tickLockout(d, 0, e));
    expect(next.lockout).toBeUndefined();
    expect(events).toHaveLength(0);
  });
});

/* ──────────────────────────────────────────────────────────────────── */
/*  isCardLocked                                                        */
/* ──────────────────────────────────────────────────────────────────── */

describe("isCardLocked", () => {
  it("returns false when no lockout is active", () => {
    expect(isCardLocked({ lockout: undefined }, "any", 0)).toBe(false);
  });

  it("returns true only on the target side's locked entityIds", () => {
    const state: Pick<GameState, "lockout"> = {
      lockout: {
        targetSide: 0,
        turnsRemaining: 3,
        playableEntityIds: ["p1"],
        lockedEntityIds: ["L1", "L2"],
        witnessed: true,
      },
    };
    expect(isCardLocked(state, "L1", 0)).toBe(true);
    expect(isCardLocked(state, "p1", 0)).toBe(false);
    // Other side plays freely even during the lockout.
    expect(isCardLocked(state, "L1", 1)).toBe(false);
  });
});

/* ──────────────────────────────────────────────────────────────────── */
/*  Integration: Three Moves cast through the real reducer              */
/* ──────────────────────────────────────────────────────────────────── */

describe("integration: Three Moves cast", () => {
  it("Three Moves cast initializes lockout state targeting opponent", async () => {
    // Use the real registry from the index — the warlord card is in it
    // as of PR #62. The reducer + matchstate plumbing is the same.
    const { ALL_CARD_DEFINITIONS, buildCardRegistry, createMatchState, reduce } = await import(
      "../../index"
    );
    const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

    // Build a match where p1 (Warlord side) has Three Moves on top of
    // hand. We override hand directly post-construction since
    // createMatchState would shuffle.
    const cfg = (userId: number, faction: string, gen: string) => ({
      userId: userId as 1,
      faction: faction as "architect" | "dreamer",
      generalDefId: gen,
      deckCardDefIds: Array.from({ length: 39 }, (_, i) => `filler_${i}`),
    });
    const initial = createMatchState({
      matchId: "lockout-int",
      seed: "x",
      p1: cfg(1, "architect", "gen_architect"),
      p2: cfg(2, "architect", "gen_architect"),
      registry,
    });

    // Inject Three Moves into p1's hand at index 0; give p1 enough mana.
    const threeMovesCard = makeCardInstance(
      "tm_card",
      THREE_MOVES_CARD_DEF_ID,
      1,
    );
    const state = {
      ...initial,
      currentPlayer: 1 as const,
      players: [
        initial.players[0],
        {
          ...initial.players[1],
          hand: [threeMovesCard],
          mana: 9,
        },
      ] as GameState["players"],
      phase: "playing" as const,
    };

    const result = reduce(
      state,
      { kind: "play_card", actor: 1, handIndex: 0, seq: 0 },
      registry,
    );
    expect(result.error).toBeUndefined();
    expect(result.state.lockout).toBeDefined();
    // Cast by side 1 → lockout targets side 0.
    expect(result.state.lockout!.targetSide).toBe(0);
    expect(
      result.events.find((e) => e.type === "architect_reality_edit_witnessed"),
    ).toBeDefined();
  });
});
