import { describe, it, expect } from "vitest";
import {
  ENGAGEMENT_STATE_VERSION,
  ZERO_PAYOUTS,
  createDefaultEngagementState,
  creditPayout,
  debitPayout,
  ensureEngagementState,
  ensurePendingPayouts,
  getApprenticeState,
  upsertApprenticeState,
} from "./engagementPersistence";

describe("engagementPersistence — defaults", () => {
  it("createDefaultEngagementState returns an empty, well-formed state", () => {
    const s = createDefaultEngagementState();
    expect(s.version).toBe(ENGAGEMENT_STATE_VERSION);
    expect(s.bloodlineWitnesses).toEqual([]);
    expect(s.vexCommissions).toEqual([]);
    expect(s.vexLastMissionCount).toBe(0);
    expect(s.gameMastersByApprentice).toEqual([]);
    expect(s.engineerJournal.pagesUnlocked).toEqual([]);
    expect(s.engineerJournal.chaptersCompleted).toEqual([]);
    expect(s.engineerJournal.equippedChapter).toBeNull();
    expect(s.lockeCompletedEntryIds).toEqual([]);
    expect(s.lockePendingPayouts).toEqual(ZERO_PAYOUTS);
  });
});

describe("engagementPersistence — pending payouts", () => {
  it("ensurePendingPayouts returns zeros for nullish input", () => {
    expect(ensurePendingPayouts(null)).toEqual(ZERO_PAYOUTS);
    expect(ensurePendingPayouts(undefined)).toEqual(ZERO_PAYOUTS);
    expect(ensurePendingPayouts("nope")).toEqual(ZERO_PAYOUTS);
  });

  it("ensurePendingPayouts preserves valid kinds and zeros invalid ones", () => {
    const out = ensurePendingPayouts({
      crew_xp: 75,
      mechronis_approval: 12,
      trade_reputation: -5,             // negative → 0
      celebration_bond: NaN,            // non-finite → 0
      army_recruitment: "wrong" as never, // non-numeric → 0
    });
    expect(out.crew_xp).toBe(75);
    expect(out.mechronis_approval).toBe(12);
    expect(out.trade_reputation).toBe(0);
    expect(out.celebration_bond).toBe(0);
    expect(out.army_recruitment).toBe(0);
  });

  it("ensurePendingPayouts floors fractional inputs", () => {
    const out = ensurePendingPayouts({ crew_xp: 7.9 });
    expect(out.crew_xp).toBe(7);
  });

  it("creditPayout adds to the kind's accumulator", () => {
    const next = creditPayout(ZERO_PAYOUTS, "mechronis_approval", 12);
    expect(next.mechronis_approval).toBe(12);
    expect(next.crew_xp).toBe(0);
  });

  it("creditPayout is a no-op for non-positive amounts", () => {
    expect(creditPayout(ZERO_PAYOUTS, "crew_xp", 0)).toBe(ZERO_PAYOUTS);
    expect(creditPayout(ZERO_PAYOUTS, "crew_xp", -5)).toBe(ZERO_PAYOUTS);
  });

  it("debitPayout subtracts and clamps at zero", () => {
    const after = debitPayout({ ...ZERO_PAYOUTS, crew_xp: 30 }, "crew_xp", 12);
    expect(after.crew_xp).toBe(18);
    const overshoot = debitPayout({ ...ZERO_PAYOUTS, crew_xp: 5 }, "crew_xp", 999);
    expect(overshoot.crew_xp).toBe(0);
  });

  it("debitPayout is a no-op for non-positive amounts", () => {
    const start = { ...ZERO_PAYOUTS, crew_xp: 30 };
    expect(debitPayout(start, "crew_xp", 0)).toBe(start);
    expect(debitPayout(start, "crew_xp", -1)).toBe(start);
  });

  it("creditPayout / debitPayout do not mutate the input", () => {
    const start = { ...ZERO_PAYOUTS, crew_xp: 10 };
    creditPayout(start, "crew_xp", 5);
    debitPayout(start, "crew_xp", 3);
    expect(start.crew_xp).toBe(10);
  });
});

describe("engagementPersistence — ensureEngagementState", () => {
  it("returns defaults for nullish input", () => {
    expect(ensureEngagementState(null)).toEqual(createDefaultEngagementState());
    expect(ensureEngagementState(undefined)).toEqual(createDefaultEngagementState());
  });

  it("returns defaults for non-object input", () => {
    expect(ensureEngagementState("nonsense")).toEqual(createDefaultEngagementState());
    expect(ensureEngagementState(42)).toEqual(createDefaultEngagementState());
  });

  it("preserves the version field at the canonical value", () => {
    const out = ensureEngagementState({ version: 9999 });
    expect(out.version).toBe(ENGAGEMENT_STATE_VERSION);
  });

  it("recovers from a partial blob (missing fields default in)", () => {
    const out = ensureEngagementState({
      vexCommissions: [],
      lockeCompletedEntryIds: ["locke.ledger.crew_charter"],
    });
    expect(out.bloodlineWitnesses).toEqual([]);
    expect(out.lockeCompletedEntryIds).toEqual(["locke.ledger.crew_charter"]);
    expect(out.lockePendingPayouts).toEqual(ZERO_PAYOUTS);
  });

  it("preserves a populated payout accumulator on round-trip", () => {
    const out = ensureEngagementState({
      lockePendingPayouts: { mechronis_approval: 12, crew_xp: 75 },
    });
    expect(out.lockePendingPayouts.mechronis_approval).toBe(12);
    expect(out.lockePendingPayouts.crew_xp).toBe(75);
    expect(out.lockePendingPayouts.celebration_bond).toBe(0);
  });

  it("rejects mistyped fields and replaces them with defaults", () => {
    const out = ensureEngagementState({
      bloodlineWitnesses: "wrong" as unknown as never,
      vexLastMissionCount: "ten" as unknown as never,
    });
    expect(out.bloodlineWitnesses).toEqual([]);
    expect(out.vexLastMissionCount).toBe(0);
  });
});

describe("engagementPersistence — apprentice helpers", () => {
  it("getApprenticeState returns an empty record for an unknown apprentice", () => {
    const state = createDefaultEngagementState();
    const r = getApprenticeState(state, "ap_001");
    expect(r.apprenticeId).toBe("ap_001");
    expect(r.redeemedDays).toEqual([]);
    expect(r.heldBoonDays).toEqual([]);
  });

  it("getApprenticeState returns the existing record when present", () => {
    const state = {
      ...createDefaultEngagementState(),
      gameMastersByApprentice: [
        { apprenticeId: "ap_002", redeemedDays: [7], heldBoonDays: [7] as const },
      ] as never,
    };
    const r = getApprenticeState(state, "ap_002");
    expect(r.redeemedDays).toEqual([7]);
  });

  it("upsertApprenticeState inserts a new record when absent", () => {
    const state = createDefaultEngagementState();
    const next = upsertApprenticeState(state, {
      apprenticeId: "ap_003",
      redeemedDays: [14],
      heldBoonDays: [14],
    });
    expect(next.length).toBe(1);
    expect(next[0].apprenticeId).toBe("ap_003");
  });

  it("upsertApprenticeState replaces an existing record by id", () => {
    const state = {
      ...createDefaultEngagementState(),
      gameMastersByApprentice: [
        { apprenticeId: "ap_004", redeemedDays: [7], heldBoonDays: [7] },
      ] as never,
    };
    const next = upsertApprenticeState(state, {
      apprenticeId: "ap_004",
      redeemedDays: [7, 14],
      heldBoonDays: [7, 14],
    });
    expect(next.length).toBe(1);
    expect(next[0].redeemedDays).toEqual([7, 14]);
  });

  it("upsertApprenticeState leaves other apprentices untouched", () => {
    const state = {
      ...createDefaultEngagementState(),
      gameMastersByApprentice: [
        { apprenticeId: "ap_a", redeemedDays: [7], heldBoonDays: [7] },
        { apprenticeId: "ap_b", redeemedDays: [14], heldBoonDays: [14] },
      ] as never,
    };
    const next = upsertApprenticeState(state, {
      apprenticeId: "ap_a",
      redeemedDays: [7, 21],
      heldBoonDays: [7, 21],
    });
    expect(next.length).toBe(2);
    expect(next.find(a => a.apprenticeId === "ap_a")?.redeemedDays).toEqual([7, 21]);
    expect(next.find(a => a.apprenticeId === "ap_b")?.redeemedDays).toEqual([14]);
  });
});
