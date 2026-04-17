import { describe, it, expect } from "vitest";
import {
  DEFAULT_PROPHECY_TURN_COUNT,
  bakeSeerFuture,
  consumeSeerFuture,
  deriveSeerOutcome,
  initSeerProphecyState,
  playerDeckUnlocksWinnablePath,
  prophecyTurnCount,
} from "./seerProphecy";
import {
  BURNT_CARD_PLACEHOLDER_ID,
  SEER_OUTCOME_FLAGS,
  SEER_STAFF_WITNESSED_FLAG,
  ACT1_CYCLE_B_COMPLETE_FLAG,
} from "../types/SeerProphecy";

describe("seerProphecy — constants + flag registry", () => {
  it("default turn count is 6 (spec §4)", () => {
    expect(DEFAULT_PROPHECY_TURN_COUNT).toBe(6);
  });

  it("burnt-card id matches the schema reservation", () => {
    expect(BURNT_CARD_PLACEHOLDER_ID).toBe("burnt_card_placeholder");
  });

  it("outcome flag names are stable (Acts 2+ codex reads)", () => {
    expect(SEER_OUTCOME_FLAGS.defeated).toBe("act1_seer_visit_defeated");
    expect(SEER_OUTCOME_FLAGS.scripted_loss).toBe(
      "act1_seer_visit_scripted_loss",
    );
    expect(SEER_OUTCOME_FLAGS.fled).toBe("act1_seer_visit_fled");
  });

  it("staff-witnessed and cycle-B flag names are stable", () => {
    expect(SEER_STAFF_WITNESSED_FLAG).toBe("act1_seer_staff_witnessed");
    expect(ACT1_CYCLE_B_COMPLETE_FLAG).toBe("act1_cycle_b_complete");
  });
});

describe("seerProphecy — initSeerProphecyState", () => {
  it("starts with no pending and 0 plays", () => {
    expect(initSeerProphecyState()).toEqual({
      pending: null,
      playsPerformed: 0,
    });
  });
});

describe("seerProphecy — prophecyTurnCount", () => {
  it("honors configured values >= 1", () => {
    expect(prophecyTurnCount({ turnCount: 8 })).toBe(8);
  });

  it("floors fractional values", () => {
    expect(prophecyTurnCount({ turnCount: 7.9 })).toBe(7);
  });

  it("falls back to default for NaN/Infinity/sub-1", () => {
    expect(prophecyTurnCount({})).toBe(6);
    expect(prophecyTurnCount({ turnCount: 0 })).toBe(6);
    expect(prophecyTurnCount({ turnCount: -3 })).toBe(6);
    expect(prophecyTurnCount({ turnCount: Number.NaN })).toBe(6);
  });
});

describe("seerProphecy — bakeSeerFuture", () => {
  it("bakes a pending play on an empty state", () => {
    const s = initSeerProphecyState();
    const s1 = bakeSeerFuture(s, "s1_prophet_card", 3);
    expect(s1.pending).toEqual({
      cardDefId: "s1_prophet_card",
      turnIndex: 3,
    });
  });

  it("no-ops when pending is already set (spec §3.1 invariant)", () => {
    let s = initSeerProphecyState();
    s = bakeSeerFuture(s, "card_a", 3);
    const s2 = bakeSeerFuture(s, "card_b", 4);
    expect(s2).toBe(s); // same reference — no overwrite
    expect(s2.pending?.cardDefId).toBe("card_a");
  });

  it("rejects empty cardDefId + invalid turns as no-ops", () => {
    const s = initSeerProphecyState();
    expect(bakeSeerFuture(s, "", 3)).toBe(s);
    expect(bakeSeerFuture(s, "c", 0)).toBe(s);
    expect(bakeSeerFuture(s, "c", Number.NaN)).toBe(s);
  });
});

describe("seerProphecy — consumeSeerFuture", () => {
  it("consumes the pending play when its turn arrives", () => {
    let s = initSeerProphecyState();
    s = bakeSeerFuture(s, "card_a", 3);
    const result = consumeSeerFuture(s, 3);
    expect(result.consumed).toEqual({ cardDefId: "card_a", turnIndex: 3 });
    expect(result.next.pending).toBeNull();
    expect(result.next.playsPerformed).toBe(1);
  });

  it("no-op when the pending play isn't for the current turn", () => {
    let s = initSeerProphecyState();
    s = bakeSeerFuture(s, "card_a", 5);
    const result = consumeSeerFuture(s, 3);
    expect(result.consumed).toBeNull();
    expect(result.next).toBe(s);
  });

  it("no-op when nothing is pending", () => {
    const s = initSeerProphecyState();
    const result = consumeSeerFuture(s, 3);
    expect(result.consumed).toBeNull();
    expect(result.next).toBe(s);
  });

  it("after consume + bake, playsPerformed accumulates across turns", () => {
    let s = initSeerProphecyState();
    s = bakeSeerFuture(s, "a", 2);
    s = consumeSeerFuture(s, 2).next;
    s = bakeSeerFuture(s, "b", 4);
    s = consumeSeerFuture(s, 4).next;
    expect(s.playsPerformed).toBe(2);
  });
});

describe("seerProphecy — playerDeckUnlocksWinnablePath", () => {
  it("true when the deck contains the burnt-card placeholder", () => {
    expect(
      playerDeckUnlocksWinnablePath([
        "s1_char_001",
        BURNT_CARD_PLACEHOLDER_ID,
        "s1_char_002",
      ]),
    ).toBe(true);
  });

  it("false for a normal deck (no burnt-card)", () => {
    expect(playerDeckUnlocksWinnablePath(["s1_char_001", "s1_char_002"])).toBe(
      false,
    );
  });

  it("false for an empty deck", () => {
    expect(playerDeckUnlocksWinnablePath([])).toBe(false);
  });
});

describe("seerProphecy — deriveSeerOutcome (§5 priority rules)", () => {
  it("conceded → fled (overrides combat + prophecy state)", () => {
    expect(
      deriveSeerOutcome({
        conceded: true,
        seerGeneralKilled: true,
        winnablePathUnlocked: true,
        playsPerformed: 6,
        turnCount: 6,
      }),
    ).toBe("fled");
  });

  it("seer general killed + burnt-card in deck → defeated", () => {
    expect(
      deriveSeerOutcome({
        conceded: false,
        seerGeneralKilled: true,
        winnablePathUnlocked: true,
        playsPerformed: 4,
        turnCount: 6,
      }),
    ).toBe("defeated");
  });

  it("seer general killed WITHOUT burnt-card → still canonical scripted_loss after full sequence", () => {
    // Winnable path only unlocks when the burnt card is in the deck.
    // A player who somehow kills the Seer's general without the
    // burnt-card doesn't get "defeated" — the prophecy still stands.
    expect(
      deriveSeerOutcome({
        conceded: false,
        seerGeneralKilled: true,
        winnablePathUnlocked: false,
        playsPerformed: 6,
        turnCount: 6,
      }),
    ).toBe("scripted_loss");
  });

  it("prophecy sequence completed → scripted_loss", () => {
    expect(
      deriveSeerOutcome({
        conceded: false,
        seerGeneralKilled: false,
        winnablePathUnlocked: false,
        playsPerformed: 6,
        turnCount: 6,
      }),
    ).toBe("scripted_loss");
  });

  it("null when match is still mid-progress (not terminal)", () => {
    expect(
      deriveSeerOutcome({
        conceded: false,
        seerGeneralKilled: false,
        winnablePathUnlocked: false,
        playsPerformed: 3,
        turnCount: 6,
      }),
    ).toBeNull();
  });

  it("winnable-path unlock without killing the general is still non-terminal mid-match", () => {
    // Having the burnt card in the deck doesn't by itself win the
    // match — the player still has to defeat the Seer's general.
    expect(
      deriveSeerOutcome({
        conceded: false,
        seerGeneralKilled: false,
        winnablePathUnlocked: true,
        playsPerformed: 3,
        turnCount: 6,
      }),
    ).toBeNull();
  });
});
