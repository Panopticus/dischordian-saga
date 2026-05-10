/* ═══════════════════════════════════════════════════════
   D12 LORE SCAFFOLDS — combined test suite for the lore
   modules that frame the missing systems in fiction.

   Modules covered:
     - lockeTradeMissionGating.ts   (D12.2)
     - ironLionBroadcasts.ts         (D12.3)
     - degenTrustGating.ts           (D12.4)
     - resurrectionistBreedingGate.ts (D12.5)

   D12.1 (conspiracyBoardRevelations) has its own dedicated
   test file. D12.6 (DLC fresh-ink) reuses the existing
   antiquarianLoredexBridges shape and is exercised there.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import {
  TRADE_MISSION_GATES,
  getGatesForBand,
  getNextGate,
} from "./lockeTradeMissionGating";
import {
  IRON_LION_BROADCASTS,
  getIronLionBroadcast,
  ironLionBroadcastsHeard,
  pendingIronLionBroadcast,
} from "./ironLionBroadcasts";
import {
  DEGEN_TRUST_CAP,
  DEGEN_TRUST_GATES,
  DMC_ENTRY_TRUST,
  DMC_REVEAL_TRUST,
  applyPazaakWin,
  dmcEntryUnlocked,
  dmcRumorUnlocked,
  gatesForTrust,
} from "./degenTrustGating";
import {
  RESURRECTIONIST_WAKE_CREW_COUNT,
  getResurrectionistLine,
  podStateForGate,
} from "./resurrectionistBreedingGate";

/* ─── lockeTradeMissionGating ─── */

describe("lockeTradeMissionGating (D12.2)", () => {
  it("declares six gates spanning Prospect → Adjudicated", () => {
    expect(TRADE_MISSION_GATES).toHaveLength(6);
  });

  it("intake placeholder is available at Prospect (the entry band)", () => {
    const gates = getGatesForBand("Prospect");
    expect(gates.map((g) => g.systemId)).toContain("intake_placeholder");
  });

  it("Casino unlocks at Client", () => {
    expect(getGatesForBand("Prospect").map((g) => g.systemId)).not.toContain(
      "casino",
    );
    expect(getGatesForBand("Client").map((g) => g.systemId)).toContain(
      "casino",
    );
  });

  it("Bounty Board + Kelvara wreck unlock at Partner", () => {
    const ids = getGatesForBand("Partner").map((g) => g.systemId);
    expect(ids).toContain("kelvara_wreck_run");
    expect(ids).toContain("bounty_board");
  });

  it("Real mission loop is the Adjudicated-only capstone", () => {
    expect(getGatesForBand("Insider").map((g) => g.systemId)).not.toContain(
      "real_mission_loop",
    );
    expect(
      getGatesForBand("Adjudicated").map((g) => g.systemId),
    ).toContain("real_mission_loop");
  });

  it("getNextGate returns the next-band gate from any band below the cap", () => {
    expect(getNextGate("Prospect")?.systemId).toBe("casino");
    expect(getNextGate("Client")?.systemId).toBe("kelvara_wreck_run");
    expect(getNextGate("Adjudicated")).toBeUndefined();
  });

  it("every gate has substantive in-fiction rationale copy", () => {
    for (const g of TRADE_MISSION_GATES) {
      expect(g.rationale.trim().length).toBeGreaterThan(80);
      expect(g.label.trim().length).toBeGreaterThan(0);
    }
  });
});

/* ─── ironLionBroadcasts ─── */

describe("ironLionBroadcasts (D12.3)", () => {
  it("ships exactly seven broadcasts (one per Cades mission)", () => {
    expect(IRON_LION_BROADCASTS).toHaveLength(7);
  });

  it("broadcasts are paired with missions M1..M7 in order", () => {
    const pairs = IRON_LION_BROADCASTS.map((b) => b.pairedMission);
    expect(pairs).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("sequenceIndex is monotonic 1..7", () => {
    expect(IRON_LION_BROADCASTS.map((b) => b.sequenceIndex)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it("every transcript is substantial in-fiction copy", () => {
    for (const b of IRON_LION_BROADCASTS) {
      expect(b.transcript.trim().length).toBeGreaterThan(120);
    }
  });

  it("seen flags are unique and do not collide with unlock flags", () => {
    const seens = IRON_LION_BROADCASTS.map((b) => b.seenFlag);
    const unlocks = IRON_LION_BROADCASTS.map((b) => b.unlockFlag);
    expect(new Set(seens).size).toBe(seens.length);
    for (const seen of seens) expect(unlocks).not.toContain(seen);
  });

  it("getIronLionBroadcast resolves by id", () => {
    expect(getIronLionBroadcast("iron_lion_broadcast_7")?.pairedMission).toBe(7);
    expect(getIronLionBroadcast("nonexistent")).toBeUndefined();
  });

  it("pendingIronLionBroadcast returns the first triggered-but-unseen broadcast", () => {
    expect(pendingIronLionBroadcast(new Set())).toBeNull();
    const flags = new Set(["act_4_complete"]);
    expect(pendingIronLionBroadcast(flags)?.id).toBe("iron_lion_broadcast_1");
    flags.add("iron_lion_broadcast_1_seen");
    expect(pendingIronLionBroadcast(flags)).toBeNull();
  });

  it("ironLionBroadcastsHeard counts seen flags", () => {
    expect(ironLionBroadcastsHeard(new Set())).toBe(0);
    expect(
      ironLionBroadcastsHeard(
        new Set(["iron_lion_broadcast_1_seen", "iron_lion_broadcast_3_seen"]),
      ),
    ).toBe(2);
  });
});

/* ─── degenTrustGating ─── */

describe("degenTrustGating (D12.4)", () => {
  it("declares three gates: back-room, DMC rumor, DMC entry pass", () => {
    expect(DEGEN_TRUST_GATES.map((g) => g.systemId)).toEqual([
      "casino_back_room",
      "dmc_rumor",
      "dmc_entry_pass",
    ]);
  });

  it("DMC reveal threshold is below entry threshold", () => {
    expect(DMC_REVEAL_TRUST).toBeLessThan(DMC_ENTRY_TRUST);
    expect(DMC_ENTRY_TRUST).toBeLessThan(DEGEN_TRUST_CAP);
  });

  it("applyPazaakWin advances trust and caps at DEGEN_TRUST_CAP", () => {
    let s = { trust: DEGEN_TRUST_CAP - 1, pazaakWins: 0, casinoVisits: 0 };
    s = applyPazaakWin(s);
    expect(s.trust).toBe(DEGEN_TRUST_CAP);
    s = applyPazaakWin(s);
    expect(s.trust).toBe(DEGEN_TRUST_CAP); // capped
    expect(s.pazaakWins).toBe(2);
  });

  it("dmcRumorUnlocked / dmcEntryUnlocked respect their thresholds", () => {
    const below = { trust: 4, pazaakWins: 4, casinoVisits: 4 };
    const reveal = { trust: 5, pazaakWins: 5, casinoVisits: 5 };
    const entry = { trust: 8, pazaakWins: 8, casinoVisits: 8 };
    expect(dmcRumorUnlocked(below)).toBe(false);
    expect(dmcRumorUnlocked(reveal)).toBe(true);
    expect(dmcEntryUnlocked(reveal)).toBe(false);
    expect(dmcEntryUnlocked(entry)).toBe(true);
  });

  it("gatesForTrust returns the cumulative met gates", () => {
    expect(gatesForTrust(0).map((g) => g.systemId)).toEqual([]);
    expect(gatesForTrust(5).map((g) => g.systemId)).toEqual([
      "casino_back_room",
      "dmc_rumor",
    ]);
    expect(gatesForTrust(10).map((g) => g.systemId)).toEqual([
      "casino_back_room",
      "dmc_rumor",
      "dmc_entry_pass",
    ]);
  });
});

/* ─── resurrectionistBreedingGate ─── */

describe("resurrectionistBreedingGate (D12.5)", () => {
  it("threshold is 12 crew", () => {
    expect(RESURRECTIONIST_WAKE_CREW_COUNT).toBe(12);
  });

  it("podStateForGate returns sealed → thawing → awake correctly", () => {
    expect(podStateForGate({ crewCount: 0, hasMet: false })).toBe("sealed");
    expect(podStateForGate({ crewCount: 11, hasMet: false })).toBe("sealed");
    expect(podStateForGate({ crewCount: 12, hasMet: false })).toBe("thawing");
    expect(podStateForGate({ crewCount: 20, hasMet: false })).toBe("thawing");
    expect(podStateForGate({ crewCount: 20, hasMet: true })).toBe("awake");
  });

  it("getResurrectionistLine returns substantive copy for each state", () => {
    for (const state of ["sealed", "thawing", "awake"] as const) {
      const line = getResurrectionistLine(state);
      expect(line.state).toBe(state);
      expect(line.copy.trim().length).toBeGreaterThan(80);
    }
  });
});
