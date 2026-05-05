/**
 * Structural tests for DuelystMatchmakingPage. Source-scan style —
 * verifies that the page composes the previously-orphan duelystWs
 * correctly: hook usage, phase routing, faction-driven JOIN_QUEUE
 * payload, in-match action handlers, and end-of-match return path.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "DuelystMatchmakingPage.tsx"),
  "utf-8",
);

describe("DuelystMatchmakingPage — composition", () => {
  it("uses the duelyst-pvp socket hook", () => {
    expect(src).toContain('from "@/game/duelyst/useDuelystPvpSocket"');
    expect(src).toContain("useDuelystPvpSocket");
  });

  it("pulls the player from useAuth so anonymous users get the gate", () => {
    expect(src).toContain('from "@/_core/hooks/useAuth"');
    expect(src).toContain("SignInGate");
  });

  it("imports the canonical Duelyst faction registry + starter decks", () => {
    expect(src).toContain('from "@/game/duelyst/types"');
    expect(src).toContain("STARTER_DECK_MAP");
  });
});

describe("DuelystMatchmakingPage — phase routing", () => {
  it("renders LobbyPhase by default and routes the other 4 phases", () => {
    expect(src).toContain("LobbyPhase");
    expect(src).toContain('sock.phase === "queue"');
    expect(src).toContain('sock.phase === "match_found" || sock.phase === "playing"');
    expect(src).toContain('sock.phase === "ended"');
  });

  it("each phase has a focused sub-component", () => {
    expect(src).toContain("function QueuePhase");
    expect(src).toContain("function PlayingPhase");
    expect(src).toContain("function EndedPhase");
  });
});

describe("DuelystMatchmakingPage — JOIN_QUEUE payload", () => {
  it("hands the picked faction's starter deck to the hook", () => {
    expect(src).toContain("STARTER_DECK_MAP[f]");
    expect(src).toContain("deckCardIds: deck.cardDefIds");
  });

  it("queues with empty heat modifiers (Heat-0 v1)", () => {
    expect(src).toContain("heatModifiers: []");
  });
});

describe("DuelystMatchmakingPage — in-match controls", () => {
  it("End Turn sends the legacy end_turn action", () => {
    expect(src).toContain('sock.sendAction({ type: "end_turn" })');
  });

  it("Surrender confirms then calls sock.surrender", () => {
    expect(src).toContain("sock.surrender()");
    expect(src).toContain("Surrender this match?");
  });

  it("End Turn is disabled when it isn't the player's turn", () => {
    expect(src).toMatch(/disabled=\{!sock\.isYourTurn[\s\S]{0,40}\}/);
  });
});

describe("DuelystMatchmakingPage — match end + lobby return", () => {
  it("EndedPhase resets the hook to return to lobby", () => {
    expect(src).toContain("sock.reset()");
  });

  it("renders win/loss/draw outcomes", () => {
    expect(src).toContain("VICTORY");
    expect(src).toContain("DEFEAT");
    expect(src).toContain("DRAW");
  });
});
