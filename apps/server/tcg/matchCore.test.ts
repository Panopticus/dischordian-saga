/**
 * matchCore unit tests.
 *
 * Covers the pure-function surface used by duelystWs.ts to talk to the
 * tcg-core reducer: faction resolution, MatchConfig construction, seed
 * generation, client action translation, state serialization, and win
 * reason mapping.
 */
import { describe, it, expect } from "vitest";
import {
  resolveFaction,
  buildMatchConfig,
  generateMatchSeed,
  translateClientAction,
  serializeForClient,
  endReasonFromWinReason,
  createServerMatchState,
  serverCardRegistry,
} from "./matchCore";
import { hashState, reduce, createPlayerId } from "../../shared/tcg-core";

describe("resolveFaction", () => {
  it("accepts every valid faction and returns a generalDefId", () => {
    const valid = [
      "architect",
      "dreamer",
      "insurgency",
      "new_babylon",
      "antiquarian",
      "thought_virus",
    ];
    for (const f of valid) {
      const r = resolveFaction(f);
      expect(r).not.toBeNull();
      expect(r!.faction).toBe(f);
      expect(r!.generalDefId).toBe(`gen_${f}`);
    }
  });

  it("rejects 'neutral' and unknown factions", () => {
    expect(resolveFaction("neutral")).toBeNull();
    expect(resolveFaction("")).toBeNull();
    expect(resolveFaction("ARCHITECT")).toBeNull();
    expect(resolveFaction("not_a_faction")).toBeNull();
  });
});

describe("buildMatchConfig", () => {
  it("constructs a MatchConfig from a well-formed join input", () => {
    const r = buildMatchConfig({
      userId: 7,
      faction: "architect",
      deckCardIds: ["c1", "c2", "c3"],
    });
    expect(r.error).toBeUndefined();
    expect(r.config).toBeDefined();
    expect(r.config!.userId).toBe(7);
    expect(r.config!.faction).toBe("architect");
    expect(r.config!.generalDefId).toBe("gen_architect");
    expect(r.config!.deckCardDefIds).toEqual(["c1", "c2", "c3"]);
  });

  it("rejects unknown factions with a structured error", () => {
    const r = buildMatchConfig({
      userId: 1,
      faction: "neutral",
      deckCardIds: ["a"],
    });
    expect(r.error).toMatch(/unknown faction/);
    expect(r.config).toBeUndefined();
  });

  it("rejects empty or invalid deckCardIds arrays", () => {
    expect(
      buildMatchConfig({ userId: 1, faction: "architect", deckCardIds: [] }).error
    ).toMatch(/non-empty/);
    expect(
      buildMatchConfig({
        userId: 1,
        faction: "architect",
        deckCardIds: ["ok", "" as string],
      }).error
    ).toMatch(/non-empty strings/);
  });
});

describe("generateMatchSeed", () => {
  it("is stable regardless of player id order", () => {
    expect(generateMatchSeed("m1", 10, 20)).toBe(generateMatchSeed("m1", 20, 10));
  });

  it("differs across match ids even with the same players", () => {
    expect(generateMatchSeed("m1", 1, 2)).not.toBe(generateMatchSeed("m2", 1, 2));
  });
});

describe("translateClientAction", () => {
  it("translates move", () => {
    const r = translateClientAction(
      { type: "move", unitId: "u1", toRow: 2, toCol: 5 },
      0,
      1
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.action).toEqual({
        kind: "move",
        actor: 0,
        entityId: "u1",
        toRow: 2,
        toCol: 5,
        seq: 1,
      });
    }
  });

  it("translates attack", () => {
    const r = translateClientAction(
      { type: "attack", attackerId: "a", targetId: "b" },
      1,
      42
    );
    expect(r.ok).toBe(true);
    if (r.ok && r.action.kind === "attack") {
      expect(r.action.attackerId).toBe("a");
      expect(r.action.targetId).toBe("b");
      expect(r.action.seq).toBe(42);
      expect(r.action.actor).toBe(1);
    }
  });

  it("translates play_card with optional row/col/targetId", () => {
    const r = translateClientAction(
      { type: "play_card", cardIndex: 2, row: 1, col: 4, targetId: "t" },
      0,
      3
    );
    expect(r.ok).toBe(true);
    if (r.ok && r.action.kind === "play_card") {
      expect(r.action.handIndex).toBe(2);
      expect(r.action.row).toBe(1);
      expect(r.action.col).toBe(4);
      expect(r.action.targetEntityId).toBe("t");
    }
  });

  it("translates end_turn + concede + finish_mulligan", () => {
    expect(translateClientAction({ type: "end_turn" }, 0, 1).ok).toBe(true);
    expect(translateClientAction({ type: "concede" }, 0, 1).ok).toBe(true);
    expect(translateClientAction({ type: "finish_mulligan" }, 1, 1).ok).toBe(true);
  });

  it("rejects malformed payloads", () => {
    expect(translateClientAction(null, 0, 1).ok).toBe(false);
    expect(translateClientAction({}, 0, 1).ok).toBe(false);
    expect(translateClientAction({ type: "move" }, 0, 1).ok).toBe(false);
    expect(translateClientAction({ type: "unknown_kind" }, 0, 1).ok).toBe(false);
  });

  it("translates bloodborn_spell with optional target coords", () => {
    const r = translateClientAction(
      { type: "bloodborn_spell", targetRow: 3, targetCol: 4 },
      0,
      1
    );
    expect(r.ok).toBe(true);
    if (r.ok && r.action.kind === "bloodborn_spell") {
      expect(r.action.row).toBe(3);
      expect(r.action.col).toBe(4);
    }
  });

  it("translates mulligan with index validation", () => {
    const r = translateClientAction(
      { type: "mulligan", replaceIndices: [0, 2, 4] },
      0,
      1
    );
    expect(r.ok).toBe(true);
    if (r.ok && r.action.kind === "mulligan") {
      expect(r.action.replaceIndices).toEqual([0, 2, 4]);
    }
  });
});

describe("serializeForClient", () => {
  it("marks isYourTurn true when side matches currentPlayer", () => {
    const s = createServerMatchState({
      matchId: "m",
      p1: {
        userId: createPlayerId(1),
        faction: "architect",
        generalDefId: "gen_architect",
        deckCardDefIds: ["a", "b", "c"],
      },
      p2: {
        userId: createPlayerId(2),
        faction: "dreamer",
        generalDefId: "gen_dreamer",
        deckCardDefIds: ["x", "y", "z"],
      },
    });
    // Phase is "mulligan" — both players can act so isYourTurn is true
    // only for the side equal to currentPlayer (which is 0 by default).
    const forP0 = serializeForClient(s, 0);
    const forP1 = serializeForClient(s, 1);
    expect(forP0.isYourTurn).toBe(true);
    expect(forP1.isYourTurn).toBe(false);
  });

  it("marks isYourTurn false when phase is ended", () => {
    let s = createServerMatchState({
      matchId: "m",
      p1: {
        userId: createPlayerId(1),
        faction: "architect",
        generalDefId: "gen_architect",
        deckCardDefIds: ["a", "b"],
      },
      p2: {
        userId: createPlayerId(2),
        faction: "dreamer",
        generalDefId: "gen_dreamer",
        deckCardDefIds: ["x", "y"],
      },
    });
    // Concede to end the match.
    s = reduce(
      s,
      { kind: "concede", actor: 0, seq: 1 },
      serverCardRegistry
    ).state;
    expect(s.phase).toBe("ended");
    const forP0 = serializeForClient(s, 0);
    expect(forP0.isYourTurn).toBe(false);
  });
});

describe("endReasonFromWinReason", () => {
  it("maps every engine win reason to a client-visible string", () => {
    expect(endReasonFromWinReason("general_killed")).toBe("game_over");
    expect(endReasonFromWinReason("surrender")).toBe("surrender");
    expect(endReasonFromWinReason("disconnect_forfeit")).toBe("disconnect");
    expect(endReasonFromWinReason("turn_limit")).toBe("turn_limit");
    expect(endReasonFromWinReason(null)).toBe("game_over");
  });
});

describe("createServerMatchState", () => {
  it("produces identical state hashes for the same (matchId, players)", () => {
    const args = {
      matchId: "stable",
      p1: {
        userId: createPlayerId(1),
        faction: "architect" as const,
        generalDefId: "gen_architect",
        deckCardDefIds: ["a", "b", "c", "d", "e"],
      },
      p2: {
        userId: createPlayerId(2),
        faction: "dreamer" as const,
        generalDefId: "gen_dreamer",
        deckCardDefIds: ["v", "w", "x", "y", "z"],
      },
    };
    const a = createServerMatchState(args);
    const b = createServerMatchState(args);
    expect(hashState(a)).toBe(hashState(b));
  });
});
