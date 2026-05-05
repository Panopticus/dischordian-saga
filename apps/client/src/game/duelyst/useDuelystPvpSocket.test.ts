/**
 * Tests for the duelyst-pvp socket reducer + the hook's public surface.
 *
 * The hook's React/WebSocket plumbing is exercised end-to-end by an
 * E2E follow-up; here we hammer the pure `applyServerMessage` reducer
 * (every server-message type → expected state transition) and source-
 * scan the hook file to lock down the structural contract — outbound
 * message envelopes, cleanup on unmount, idempotent reset.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { applyServerMessage, type UseDuelystPvpSocketState } from "./useDuelystPvpSocket";

const INITIAL: UseDuelystPvpSocketState = {
  phase: "idle",
  queuePosition: null,
  playersInQueue: null,
  matchId: null,
  mySide: null,
  opponentName: null,
  opponentFaction: null,
  gameState: null,
  isYourTurn: false,
  matchResult: null,
  opponentDisconnected: false,
  errors: [],
  connected: false,
};

describe("applyServerMessage — protocol parsing", () => {
  it("QUEUE_JOINED sets phase + position", () => {
    const next = applyServerMessage(INITIAL, { type: "QUEUE_JOINED", position: 4 });
    expect(next.phase).toBe("queue");
    expect(next.queuePosition).toBe(4);
  });

  it("QUEUE_UPDATE merges position + playersInQueue without resetting phase", () => {
    const after = applyServerMessage(INITIAL, { type: "QUEUE_JOINED", position: 1 });
    const updated = applyServerMessage(after, {
      type: "QUEUE_UPDATE", position: 2, playersInQueue: 7,
    });
    expect(updated.phase).toBe("queue");
    expect(updated.queuePosition).toBe(2);
    expect(updated.playersInQueue).toBe(7);
  });

  it("MATCH_FOUND records opponent + side", () => {
    const next = applyServerMessage(INITIAL, {
      type: "MATCH_FOUND",
      matchId: "m_abc",
      opponentName: "Foe",
      opponentFaction: "insurgency",
      yourSide: 1,
    });
    expect(next.phase).toBe("match_found");
    expect(next.matchId).toBe("m_abc");
    expect(next.mySide).toBe(1);
    expect(next.opponentName).toBe("Foe");
    expect(next.opponentFaction).toBe("insurgency");
  });

  it("MATCH_FOUND tolerates an unexpected yourSide value", () => {
    const next = applyServerMessage(INITIAL, {
      type: "MATCH_FOUND",
      matchId: "m_abc",
      opponentName: "Foe",
      opponentFaction: "insurgency",
      yourSide: 99,
    });
    expect(next.mySide).toBeNull();
  });

  it("GAME_STATE transitions to playing and tracks isYourTurn", () => {
    const next = applyServerMessage(INITIAL, {
      type: "GAME_STATE",
      state: { phase: "playing", turnNumber: 3 },
      isYourTurn: true,
    });
    expect(next.phase).toBe("playing");
    expect(next.isYourTurn).toBe(true);
    expect(next.gameState).toEqual({ phase: "playing", turnNumber: 3 });
  });

  it("OPPONENT_DISCONNECTED flips a flag without changing phase", () => {
    const playing = applyServerMessage(INITIAL, {
      type: "GAME_STATE", state: {}, isYourTurn: false,
    });
    const next = applyServerMessage(playing, { type: "OPPONENT_DISCONNECTED" });
    expect(next.opponentDisconnected).toBe(true);
    expect(next.phase).toBe("playing");
  });

  it("MATCH_RESULT transitions to ended with the result + ELO change", () => {
    const next = applyServerMessage(INITIAL, {
      type: "MATCH_RESULT", result: "win", eloChange: 15,
    });
    expect(next.phase).toBe("ended");
    expect(next.matchResult).toEqual({ result: "win", eloChange: 15 });
  });

  it("MATCH_RESULT clamps an unexpected result to draw", () => {
    const next = applyServerMessage(INITIAL, {
      type: "MATCH_RESULT", result: "marshmallows", eloChange: -3,
    });
    expect(next.matchResult).toEqual({ result: "draw", eloChange: -3 });
  });

  it("ERROR appends to errors and never throws", () => {
    const next = applyServerMessage(INITIAL, { type: "ERROR", message: "no slot" });
    expect(next.errors).toEqual(["no slot"]);
  });

  it("ERROR with no message uses a fallback string", () => {
    const next = applyServerMessage(INITIAL, { type: "ERROR" });
    expect(next.errors).toEqual(["Server error"]);
  });

  it("PONG is a no-op", () => {
    const next = applyServerMessage(INITIAL, { type: "PONG" });
    expect(next).toBe(INITIAL);
  });

  it("unknown message types do not throw", () => {
    expect(() =>
      applyServerMessage(INITIAL, { type: "FUTURE_FEATURE", payload: 123 }),
    ).not.toThrow();
  });
});

/* ─── Hook structural contract ─── */

const src = fs.readFileSync(path.resolve(__dirname, "useDuelystPvpSocket.ts"), "utf-8");

describe("useDuelystPvpSocket — outbound envelopes", () => {
  it("connects to /api/duelyst-pvp", () => {
    expect(src).toContain("/api/duelyst-pvp");
  });

  it("sends JOIN_QUEUE on socket open with the matchmaking payload", () => {
    expect(src).toContain('type: "JOIN_QUEUE"');
    expect(src).toContain("userId: user.id");
    expect(src).toContain("userName: user.name");
    expect(src).toContain("faction: input.faction");
    expect(src).toContain("deckCardIds: input.deckCardIds");
  });

  it("wraps actions in GAME_ACTION", () => {
    expect(src).toContain('type: "GAME_ACTION"');
  });

  it("exposes leaveQueue and surrender that send the right envelope", () => {
    expect(src).toContain('type: "LEAVE_QUEUE"');
    expect(src).toContain('type: "SURRENDER"');
  });
});

describe("useDuelystPvpSocket — lifecycle", () => {
  it("cleans up the socket on unmount", () => {
    expect(src).toMatch(/useEffect\([\s\S]+?return\s*\(\)\s*=>\s*\{\s*cleanup\(\)/);
  });

  it("delegates parsing to the pure reducer", () => {
    expect(src).toContain("applyServerMessage(s, msg)");
  });

  it("resets state when leaveQueue or reset are called", () => {
    expect(src).toContain("setState(INITIAL_STATE);");
  });
});
