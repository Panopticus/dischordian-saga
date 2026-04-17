import { describe, it, expect } from "vitest";
import {
  DEFAULT_EARLIEST_OFFER_TURN,
  acceptGift,
  declineGift,
  earliestOfferTurn,
  initProgrammerGiftState,
  isGiftPending,
  isGiftResolved,
  offerGift,
} from "./programmerGift";
import {
  PROGRAMMER_GIFT_ACCEPTED_FLAG,
  type ProgrammerGiftState,
} from "../types/ProgrammerGift";

describe("programmerGift — constants + flag", () => {
  it("default earliest-offer turn is 3 (two legitimate plays first)", () => {
    expect(DEFAULT_EARLIEST_OFFER_TURN).toBe(3);
  });

  it("canonical campaign flag name is stable", () => {
    expect(PROGRAMMER_GIFT_ACCEPTED_FLAG).toBe("act1_programmer_gift_accepted");
  });
});

describe("programmerGift — initProgrammerGiftState", () => {
  it("opens in not_offered status", () => {
    expect(initProgrammerGiftState()).toEqual({ status: "not_offered" });
  });

  it("ignores the config shape — initial status is always not_offered", () => {
    expect(initProgrammerGiftState({ earliestOfferTurn: 5 })).toEqual({
      status: "not_offered",
    });
  });
});

describe("programmerGift — earliestOfferTurn", () => {
  it("returns the default when config is empty or missing", () => {
    expect(earliestOfferTurn()).toBe(3);
    expect(earliestOfferTurn({})).toBe(3);
  });

  it("returns the configured turn when finite and >= 1", () => {
    expect(earliestOfferTurn({ earliestOfferTurn: 5 })).toBe(5);
    expect(earliestOfferTurn({ earliestOfferTurn: 1 })).toBe(1);
  });

  it("floors fractional values", () => {
    expect(earliestOfferTurn({ earliestOfferTurn: 4.9 })).toBe(4);
  });

  it("falls back to default for NaN/Infinity/sub-1 values", () => {
    expect(earliestOfferTurn({ earliestOfferTurn: Number.NaN })).toBe(3);
    expect(
      earliestOfferTurn({ earliestOfferTurn: Number.POSITIVE_INFINITY }),
    ).toBe(3);
    expect(earliestOfferTurn({ earliestOfferTurn: 0 })).toBe(3);
    expect(earliestOfferTurn({ earliestOfferTurn: -5 })).toBe(3);
  });
});

describe("programmerGift — isGiftPending / isGiftResolved", () => {
  it("pending only when status is offered", () => {
    expect(isGiftPending({ status: "not_offered" })).toBe(false);
    expect(isGiftPending({ status: "offered" })).toBe(true);
    expect(isGiftPending({ status: "accepted" })).toBe(false);
    expect(isGiftPending({ status: "declined" })).toBe(false);
  });

  it("resolved when status is accepted or declined", () => {
    expect(isGiftResolved({ status: "not_offered" })).toBe(false);
    expect(isGiftResolved({ status: "offered" })).toBe(false);
    expect(isGiftResolved({ status: "accepted" })).toBe(true);
    expect(isGiftResolved({ status: "declined" })).toBe(true);
  });
});

describe("programmerGift — offerGift", () => {
  it("transitions not_offered → offered when currentTurn clears the gate", () => {
    const next = offerGift({ status: "not_offered" }, 3);
    expect(next.status).toBe("offered");
    expect(next.offeredOnTurn).toBe(3);
  });

  it("respects the configured earliest-offer turn", () => {
    const configured = offerGift({ status: "not_offered" }, 4, {
      earliestOfferTurn: 5,
    });
    expect(configured.status).toBe("not_offered"); // too early
    const later = offerGift({ status: "not_offered" }, 5, {
      earliestOfferTurn: 5,
    });
    expect(later.status).toBe("offered");
  });

  it("no-op before the earliest-offer turn", () => {
    const state: ProgrammerGiftState = { status: "not_offered" };
    const next = offerGift(state, 2);
    expect(next).toBe(state); // same reference — no churn
  });

  it("no-op if already offered (doesn't bump offeredOnTurn)", () => {
    const state: ProgrammerGiftState = {
      status: "offered",
      offeredOnTurn: 3,
    };
    const next = offerGift(state, 7);
    expect(next).toBe(state);
  });

  it("no-op if already resolved", () => {
    const accepted: ProgrammerGiftState = {
      status: "accepted",
      offeredOnTurn: 3,
      resolvedOnTurn: 4,
    };
    expect(offerGift(accepted, 9)).toBe(accepted);
    const declined: ProgrammerGiftState = {
      status: "declined",
      offeredOnTurn: 3,
      resolvedOnTurn: 5,
    };
    expect(offerGift(declined, 9)).toBe(declined);
  });
});

describe("programmerGift — acceptGift / declineGift", () => {
  it("accepts an offered gift and stamps resolvedOnTurn", () => {
    const offered: ProgrammerGiftState = {
      status: "offered",
      offeredOnTurn: 3,
    };
    const next = acceptGift(offered, 5);
    expect(next.status).toBe("accepted");
    expect(next.offeredOnTurn).toBe(3);
    expect(next.resolvedOnTurn).toBe(5);
  });

  it("declines an offered gift and stamps resolvedOnTurn", () => {
    const offered: ProgrammerGiftState = {
      status: "offered",
      offeredOnTurn: 3,
    };
    const next = declineGift(offered, 6);
    expect(next.status).toBe("declined");
    expect(next.offeredOnTurn).toBe(3);
    expect(next.resolvedOnTurn).toBe(6);
  });

  it("no-op if the gift was never offered (can't shortcut the flow)", () => {
    const state: ProgrammerGiftState = { status: "not_offered" };
    expect(acceptGift(state, 3)).toBe(state);
    expect(declineGift(state, 3)).toBe(state);
  });

  it("no-op if already resolved (terminal)", () => {
    const accepted: ProgrammerGiftState = {
      status: "accepted",
      offeredOnTurn: 3,
      resolvedOnTurn: 5,
    };
    expect(acceptGift(accepted, 9)).toBe(accepted);
    expect(declineGift(accepted, 9)).toBe(accepted);
    const declined: ProgrammerGiftState = {
      status: "declined",
      offeredOnTurn: 3,
      resolvedOnTurn: 6,
    };
    expect(acceptGift(declined, 9)).toBe(declined);
    expect(declineGift(declined, 9)).toBe(declined);
  });
});

describe("programmerGift — end-to-end flow", () => {
  it("offer → accept: full happy path", () => {
    let s = initProgrammerGiftState();
    expect(isGiftPending(s)).toBe(false);
    // Can't offer before turn 3
    s = offerGift(s, 2);
    expect(s.status).toBe("not_offered");
    // Offer lands on turn 3
    s = offerGift(s, 3);
    expect(s.status).toBe("offered");
    expect(isGiftPending(s)).toBe(true);
    // Player accepts
    s = acceptGift(s, 4);
    expect(s.status).toBe("accepted");
    expect(isGiftResolved(s)).toBe(true);
    expect(s.offeredOnTurn).toBe(3);
    expect(s.resolvedOnTurn).toBe(4);
  });

  it("offer → decline: match continues under standard rules", () => {
    let s = initProgrammerGiftState();
    s = offerGift(s, 3);
    s = declineGift(s, 3);
    expect(s.status).toBe("declined");
    expect(isGiftResolved(s)).toBe(true);
  });

  it("re-offers after acceptance are no-ops (terminal state)", () => {
    let s = initProgrammerGiftState();
    s = offerGift(s, 3);
    s = acceptGift(s, 3);
    const again = offerGift(s, 5);
    expect(again).toBe(s);
  });
});
