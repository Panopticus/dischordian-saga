import { describe, it, expect } from "vitest";
import {
  allLedgerEntries,
  availableLedgerEntries,
  bandSatisfies,
  checkLedgerEligibility,
  executeLedgerEntry,
  getLedgerEntry,
  tierToRequiredBand,
  type LedgerEligibilityInput,
} from "./lockeConfidentialLedger";

const RICH_PARTNER: LedgerEligibilityInput = {
  band: "Partner",
  reputation: 1000,
  completedEntryIds: [],
};

describe("lockeConfidentialLedger — catalog", () => {
  it("ships at least one contract per cross-system payout kind", () => {
    const kinds = new Set(allLedgerEntries().map(e => e.payout.kind));
    expect(kinds).toContain("crew_xp");
    expect(kinds).toContain("army_recruitment");
    expect(kinds).toContain("celebration_bond");
    expect(kinds).toContain("mechronis_approval");
    expect(kinds).toContain("trade_reputation");
  });

  it("every entry carries a non-trivial pitch and fine print", () => {
    for (const e of allLedgerEntries()) {
      expect(e.pitch.length).toBeGreaterThan(40);
      expect(e.finePrint.length).toBeGreaterThan(20);
    }
  });

  it("entry ids are unique and namespaced", () => {
    const ids = allLedgerEntries().map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith("locke.ledger.")).toBe(true);
  });

  it("getLedgerEntry resolves by id", () => {
    const first = allLedgerEntries()[0];
    expect(getLedgerEntry(first.id)).toEqual(first);
    expect(getLedgerEntry("nope")).toBeUndefined();
  });

  it("tier 3 entries always declare a prerequisite", () => {
    const tier3 = allLedgerEntries().filter(e => e.tier === 3);
    for (const e of tier3) expect(e.prerequisite).toBeDefined();
  });
});

describe("lockeConfidentialLedger — band ladder", () => {
  it("Counterparty satisfies Counterparty; Partner satisfies both", () => {
    expect(bandSatisfies("Counterparty", "Counterparty")).toBe(true);
    expect(bandSatisfies("Partner", "Counterparty")).toBe(true);
    expect(bandSatisfies("Partner", "Partner")).toBe(true);
  });

  it("Stranger satisfies nothing above Stranger", () => {
    expect(bandSatisfies("Stranger", "Counterparty")).toBe(false);
    expect(bandSatisfies("Stranger", "Partner")).toBe(false);
  });

  it("Counterparty does not satisfy Partner", () => {
    expect(bandSatisfies("Counterparty", "Partner")).toBe(false);
  });

  it("tier 1 is Counterparty, tiers 2-3 are Partner", () => {
    expect(tierToRequiredBand(1)).toBe("Counterparty");
    expect(tierToRequiredBand(2)).toBe("Partner");
    expect(tierToRequiredBand(3)).toBe("Partner");
  });
});

describe("lockeConfidentialLedger — eligibility", () => {
  const tier1 = allLedgerEntries().find(e => e.tier === 1)!;
  const tier3 = allLedgerEntries().find(e => e.tier === 3)!;

  it("approves a fully-qualified Partner", () => {
    expect(checkLedgerEligibility(tier1, RICH_PARTNER).eligible).toBe(true);
  });

  it("rejects a Stranger on a Counterparty contract", () => {
    const r = checkLedgerEligibility(tier1, { ...RICH_PARTNER, band: "Stranger" });
    expect(r).toEqual({ eligible: false, reason: "trust_band_too_low" });
  });

  it("rejects when reputation is below the cost", () => {
    const r = checkLedgerEligibility(tier1, { ...RICH_PARTNER, reputation: 0 });
    expect(r).toEqual({ eligible: false, reason: "insufficient_reputation" });
  });

  it("rejects a tier-3 contract when the prerequisite isn't completed", () => {
    const r = checkLedgerEligibility(tier3, RICH_PARTNER);
    expect(r).toEqual({ eligible: false, reason: "prerequisite_not_completed" });
  });

  it("approves a tier-3 contract once the prerequisite is in completedEntryIds", () => {
    const r = checkLedgerEligibility(tier3, {
      ...RICH_PARTNER,
      completedEntryIds: [tier3.prerequisite!],
    });
    expect(r.eligible).toBe(true);
  });

  it("rejects re-running an already-completed contract", () => {
    const r = checkLedgerEligibility(tier1, {
      ...RICH_PARTNER,
      completedEntryIds: [tier1.id],
    });
    expect(r).toEqual({ eligible: false, reason: "already_completed" });
  });
});

describe("lockeConfidentialLedger — availableLedgerEntries", () => {
  it("lists exactly the eligible contracts for the player's state", () => {
    const newPlayer: LedgerEligibilityInput = {
      band: "Counterparty",
      reputation: 500,
      completedEntryIds: [],
    };
    const available = availableLedgerEntries(newPlayer);
    // All tier 1s should be in; no tier 2 or 3.
    expect(available.every(e => e.tier === 1)).toBe(true);
    expect(available.length).toBeGreaterThan(0);
  });

  it("expands as trust + completion grow", () => {
    const partnerWithProgress: LedgerEligibilityInput = {
      band: "Partner",
      reputation: 500,
      completedEntryIds: ["locke.ledger.crew_charter"],
    };
    const available = availableLedgerEntries(partnerWithProgress);
    // crew_charter is now done (excluded), but cross-reference (which
    // depends on it) should be in.
    expect(available.find(e => e.id === "locke.ledger.crew_charter")).toBeUndefined();
    expect(available.find(e => e.id === "locke.ledger.crossreference")).toBeDefined();
  });
});

describe("lockeConfidentialLedger — executeLedgerEntry", () => {
  const tier1 = allLedgerEntries().find(e => e.tier === 1)!;

  it("debits reputation by exactly the contract cost", () => {
    const r = executeLedgerEntry(tier1, RICH_PARTNER);
    expect(r.reputationAfter).toBe(RICH_PARTNER.reputation - tier1.reputationCost);
  });

  it("never lets reputation go negative even if the caller skips eligibility", () => {
    const r = executeLedgerEntry(tier1, { ...RICH_PARTNER, reputation: 0 });
    expect(r.reputationAfter).toBe(0);
  });

  it("appends the contract id to the completed ledger", () => {
    const r = executeLedgerEntry(tier1, RICH_PARTNER);
    expect(r.completedEntryIdsAfter).toContain(tier1.id);
  });

  it("does not double-append if the id is somehow already present", () => {
    const r = executeLedgerEntry(tier1, {
      ...RICH_PARTNER,
      completedEntryIds: [tier1.id],
    });
    expect(r.completedEntryIdsAfter.filter(id => id === tier1.id).length).toBe(1);
  });

  it("returns the contract's payout verbatim", () => {
    const r = executeLedgerEntry(tier1, RICH_PARTNER);
    expect(r.payout).toEqual(tier1.payout);
  });

  it("returns a non-empty Locke close line", () => {
    const r = executeLedgerEntry(tier1, RICH_PARTNER);
    expect(r.closeLine.length).toBeGreaterThan(20);
  });
});
