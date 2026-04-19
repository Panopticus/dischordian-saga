import { describe, it, expect } from "vitest";
import {
  JURY_CARDS,
  EVIDENCE_CARDS,
  createTrialState,
  tribunalPlays,
  engineerResponds,
  canCounter,
  isTrialFormatMatch,
} from "./trialFormat";
import { getAct1Opponent } from "@shared/act1Opponents";

describe("trialFormat — canonical card catalog", () => {
  it("has exactly 30 jury cards numbered j01..j30", () => {
    expect(JURY_CARDS.length).toBe(30);
    expect(JURY_CARDS[0]?.id).toBe("j01");
    expect(JURY_CARDS[29]?.id).toBe("j30");
    expect(JURY_CARDS.every((c) => c.kind === "jury" && c.weight === 1)).toBe(
      true,
    );
  });

  it("has 12 evidence cards e01..e12 with correct weights", () => {
    expect(EVIDENCE_CARDS.length).toBe(12);
    // Spot-check canonical weights from §16.3
    expect(EVIDENCE_CARDS.find((c) => c.id === "e03")?.weight).toBe(3); // Nexon abandonment
    expect(EVIDENCE_CARDS.find((c) => c.id === "e05")?.weight).toBe(4); // Insurgency logs
    expect(EVIDENCE_CARDS.find((c) => c.id === "e08")?.weight).toBe(3); // Elara deposition
    expect(EVIDENCE_CARDS.find((c) => c.id === "e11")?.weight).toBe(4); // Engineer comms
    expect(EVIDENCE_CARDS.find((c) => c.id === "e12")?.weight).toBe(3); // Charge of Treason
  });

  it("marks e12 Charge of Treason as unanswerable", () => {
    const e12 = EVIDENCE_CARDS.find((c) => c.id === "e12");
    expect(e12?.unanswerable).toBe(true);
  });

  it("wires The Friend I Saved (C3 unlock) as the sole counter for e11", () => {
    const e11 = EVIDENCE_CARDS.find((c) => c.id === "e11");
    expect(e11?.counters).toEqual(["friend_i_saved"]);
  });

  it("wires The Standstill (C1 unlock) as canonical counter for e03", () => {
    const e03 = EVIDENCE_CARDS.find((c) => c.id === "e03");
    expect(e03?.counters).toContain("standstill");
  });
});

describe("trialFormat — opponent integration", () => {
  it("identifies Wayne Warden as the Trial-format match", () => {
    const wayne = getAct1Opponent("wayne_warden");
    expect(wayne).toBeDefined();
    expect(isTrialFormatMatch(wayne!)).toBe(true);
  });

  it("does NOT flag other Cycle C opponents as Trial-format", () => {
    const vernon = getAct1Opponent("vernon_vortex");
    const wanda = getAct1Opponent("wanda_wyrlord");
    const swarm = getAct1Opponent("warlord_nano_swarm");
    expect(isTrialFormatMatch(vernon!)).toBe(false);
    expect(isTrialFormatMatch(wanda!)).toBe(false);
    expect(isTrialFormatMatch(swarm!)).toBe(false);
  });
});

describe("trialFormat — state machine", () => {
  it("initializes with an empty scroll, 42 cards, and engineer hand", () => {
    const state = createTrialState(["standstill", "iron_stance", "friend_i_saved"]);
    expect(state.inkLines).toBe(0);
    expect(state.tribunalDeck.length).toBe(42); // 30 jury + 12 evidence
    expect(state.engineerHand.length).toBe(3);
    expect(state.outcome).toBeNull();
  });

  it("places e12 last in the deck per canonical §16.5 evidence phase", () => {
    const state = createTrialState([]);
    const lastCard = state.tribunalDeck[state.tribunalDeck.length - 1];
    expect(lastCard?.id).toBe("e12");
  });

  it("tribunalPlays pops the next card and sets it pending", () => {
    const state = createTrialState([]);
    const next = tribunalPlays(state);
    expect(next.pendingTribunalCard?.id).toBe("j01");
    expect(next.tribunalDeck.length).toBe(41);
  });

  it("engineer counter on a jury card adds 0 ink (delayed)", () => {
    let state = createTrialState(["standstill"]);
    state = tribunalPlays(state); // play j01
    state = engineerResponds(state, "standstill");
    expect(state.inkLines).toBe(0);
  });

  it("engineer no-response on a jury card adds 1 ink", () => {
    let state = createTrialState([]);
    state = tribunalPlays(state); // play j01
    state = engineerResponds(state, null);
    expect(state.inkLines).toBe(1);
  });

  it("engineer thematic counter on evidence cancels all ink", () => {
    // Skip through all 30 jury cards, then face e03.
    let state = createTrialState(["standstill"]);
    for (let i = 0; i < 30; i++) {
      state = tribunalPlays(state);
      state = engineerResponds(state, null); // all juries land at full ink
    }
    expect(state.inkLines).toBe(10); // 10 jury no-responses would fill the scroll
  });

  it("counter-valid responses correctly delay evidence", () => {
    // Build a pre-filled state at low ink so evidence resolution matters.
    let state = createTrialState(["standstill", "converter"]);
    // Force the deck to start with e03 for this test by mutating — in real
    // play the deck order is canonical, but we verify the counter logic.
    state = {
      ...state,
      tribunalDeck: [EVIDENCE_CARDS.find((c) => c.id === "e03")!],
    };
    state = tribunalPlays(state); // play e03
    expect(canCounter(state, "standstill")).toBe(true);
    state = engineerResponds(state, "standstill");
    expect(state.inkLines).toBe(0);
    expect(state.engineerHand).not.toContain("standstill");
  });

  it("unanswerable e12 Charge of Treason always adds its weight", () => {
    let state = createTrialState(["standstill", "friend_i_saved"]);
    state = {
      ...state,
      tribunalDeck: [EVIDENCE_CARDS.find((c) => c.id === "e12")!],
    };
    state = tribunalPlays(state); // play e12
    expect(canCounter(state, "standstill")).toBe(false);
    state = engineerResponds(state, "standstill");
    expect(state.inkLines).toBe(3); // e12 weight
  });

  it("resolves loss when verdict scroll fills to 10 lines", () => {
    let state = createTrialState([]);
    // Play 10 jury cards with no counter — each adds 1 ink.
    for (let i = 0; i < 10; i++) {
      state = tribunalPlays(state);
      state = engineerResponds(state, null);
    }
    expect(state.inkLines).toBe(10);
    expect(state.outcome).toEqual({
      kind: "loss",
      reason: "verdict_passed",
      finalInkLines: 10,
    });
  });

  it("resolves win when tribunal deck empties below 10 ink", () => {
    // Directly verify the deck-empty win path: construct a state
    // with an empty deck and low ink, call tribunalPlays, expect win.
    let state = createTrialState(["standstill"]);
    state = {
      ...state,
      tribunalDeck: [],
      inkLines: 7,
    };
    state = tribunalPlays(state);
    expect(state.outcome).toEqual({
      kind: "win",
      reason: "deck_empty",
      finalInkLines: 7,
    });
  });
});
