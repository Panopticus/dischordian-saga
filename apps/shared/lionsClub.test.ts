import { describe, expect, it } from "vitest";

import {
  DGRS_CHAPTER_ID,
  DGRS_LIONS_CLUB_MEMBERSHIP_ID,
  ENGINEER_NOTE_LIONS_CLUB,
  LCIF_HONOR_DONATION_USD,
  LCI_ANNUAL_BASE_USD,
  LCI_ANNUAL_PRORATED_USD,
  type LionsClubMembership,
  type RentalGateCandidate,
  calculateMembershipChargeUsd,
  calculateMembershipExpiryIso,
  calculateProratedDuesUsd,
  canEquipRentalPiece,
  findActiveMembershipForOrg,
  isMembershipActive,
} from "./lionsClub";

/** Build an active DGRS Lions Club membership for the tests. */
function buildMembership(
  overrides: Partial<LionsClubMembership> = {},
): LionsClubMembership {
  return {
    applicationId: "app-1",
    citizenId: "citizen-1",
    chapterId: DGRS_CHAPTER_ID,
    status: "active",
    joinedIso: "2026-07-01T00:00:00Z",
    expiresIso: "2027-06-30T23:59:59Z",
    duesPaidUsd: 100,
    lcifHonorPaidUsd: LCIF_HONOR_DONATION_USD,
    linkedEntitlements: [],
    ...overrides,
  };
}

describe("calculateProratedDuesUsd", () => {
  it("charges the $100 ceiling when joining on July 1 (12 months until next June 30)", () => {
    const due = calculateProratedDuesUsd("2026-07-01T00:00:00Z");
    expect(due).toBe(LCI_ANNUAL_BASE_USD + LCI_ANNUAL_PRORATED_USD);
    expect(due).toBe(100);
  });

  it("charges only the $35 base when joining on June 30 the year before renewal day (0 months left)", () => {
    const due = calculateProratedDuesUsd("2026-06-30T00:00:00Z");
    // Same-day June 30 pushes to next year's June 30 = 12 months.
    expect(due).toBe(100);
  });

  it("prorates partial years — March 31 join pays roughly $51.25", () => {
    const due = calculateProratedDuesUsd("2026-03-31T00:00:00Z");
    // 3 months until June 30 → $35 + 65/12*3 = $51.25
    expect(due).toBeGreaterThan(50);
    expect(due).toBeLessThan(53);
  });

  it("never dips below the flat $35 base", () => {
    const almostRenewal = calculateProratedDuesUsd("2026-06-29T23:00:00Z");
    expect(almostRenewal).toBeGreaterThanOrEqual(LCI_ANNUAL_BASE_USD);
  });
});

describe("calculateMembershipChargeUsd", () => {
  it("always adds the flat $25 LCIF honor donation on top of prorated dues", () => {
    const q = calculateMembershipChargeUsd("2026-07-01T00:00:00Z");
    expect(q.duesUsd).toBe(100);
    expect(q.lcifHonorDonationUsd).toBe(25);
    expect(q.totalUsd).toBe(125);
  });

  it("keeps the honor-donation constant across join dates", () => {
    const a = calculateMembershipChargeUsd("2026-02-15T00:00:00Z");
    const b = calculateMembershipChargeUsd("2026-10-10T00:00:00Z");
    expect(a.lcifHonorDonationUsd).toBe(25);
    expect(b.lcifHonorDonationUsd).toBe(25);
  });
});

describe("calculateMembershipExpiryIso", () => {
  it("resolves the next June 30 after a mid-year join", () => {
    const iso = calculateMembershipExpiryIso("2026-03-15T00:00:00Z");
    expect(iso.startsWith("2026-06-30")).toBe(true);
  });

  it("rolls to the following year for a July join", () => {
    const iso = calculateMembershipExpiryIso("2026-07-01T00:00:00Z");
    expect(iso.startsWith("2027-06-30")).toBe(true);
  });
});

describe("isMembershipActive", () => {
  it("reports null/undefined as inactive", () => {
    expect(isMembershipActive(null, "2026-07-02T00:00:00Z")).toBe(false);
    expect(isMembershipActive(undefined, "2026-07-02T00:00:00Z")).toBe(false);
  });

  it("is active when now < expires, even if status is a stale 'lapsed' flag", () => {
    const m = buildMembership({ status: "lapsed" });
    expect(isMembershipActive(m, "2026-07-02T00:00:00Z")).toBe(true);
  });

  it("is inactive when now >= expires", () => {
    const m = buildMembership({ expiresIso: "2026-06-30T23:59:59Z" });
    expect(isMembershipActive(m, "2026-07-01T00:00:00Z")).toBe(false);
  });

  it("is inactive when status is revoked regardless of dates", () => {
    const m = buildMembership({ status: "revoked" });
    expect(isMembershipActive(m, "2026-07-02T00:00:00Z")).toBe(false);
  });

  it("is inactive for a pending membership that has not been approved", () => {
    const m = buildMembership({ status: "pending" });
    expect(isMembershipActive(m, "2026-07-02T00:00:00Z")).toBe(false);
  });
});

describe("findActiveMembershipForOrg", () => {
  it("returns the first active membership for the DGRS Lions Club org", () => {
    const m = buildMembership();
    const found = findActiveMembershipForOrg(
      [m],
      DGRS_LIONS_CLUB_MEMBERSHIP_ID,
      "2026-07-02T00:00:00Z",
    );
    expect(found).toBe(m);
  });

  it("returns null if no membership matches the requested org", () => {
    const found = findActiveMembershipForOrg(
      [buildMembership()],
      "some-other-club",
      "2026-07-02T00:00:00Z",
    );
    expect(found).toBeNull();
  });
});

describe("canEquipRentalPiece", () => {
  const rentalPiece: RentalGateCandidate = {
    id: "iron-clad-lions-ceremonial-head",
    name: "Iron Lion Mask",
    isRental: true,
    membershipId: DGRS_LIONS_CLUB_MEMBERSHIP_ID,
  };

  it("lets non-rental pieces equip without any membership check", () => {
    const decision = canEquipRentalPiece(
      { id: "regular-helm" },
      [],
      "2026-07-02T00:00:00Z",
    );
    expect(decision.allowed).toBe(true);
  });

  it("lets rental pieces equip when the member has an active matching membership", () => {
    const decision = canEquipRentalPiece(
      rentalPiece,
      [buildMembership()],
      "2026-07-02T00:00:00Z",
    );
    expect(decision.allowed).toBe(true);
  });

  it("blocks rental pieces when the player has no membership at all", () => {
    const decision = canEquipRentalPiece(
      rentalPiece,
      [],
      "2026-07-02T00:00:00Z",
    );
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.code).toBe("rental-missing-membership");
      expect(decision.reason).toContain("DGRS Lions Club");
    }
  });

  it("blocks rental pieces when the membership has expired (lazy lapse check)", () => {
    const decision = canEquipRentalPiece(
      rentalPiece,
      [buildMembership({ expiresIso: "2026-06-30T23:59:59Z" })],
      "2026-07-02T00:00:00Z",
    );
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.code).toBe("rental-membership-expired");
      expect(decision.reason).toContain("lapsed on 2026-06-30");
    }
  });

  it("blocks rental pieces when the membership is explicitly revoked", () => {
    const decision = canEquipRentalPiece(
      rentalPiece,
      [buildMembership({ status: "revoked" })],
      "2026-07-02T00:00:00Z",
    );
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.code).toBe("rental-membership-revoked");
    }
  });

  it("rejects malformed rental pieces that declare isRental but no membershipId", () => {
    const decision = canEquipRentalPiece(
      { id: "bad", isRental: true },
      [buildMembership()],
      "2026-07-02T00:00:00Z",
    );
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.code).toBe("rental-malformed-piece");
    }
  });
});

describe("ENGINEER_NOTE_LIONS_CLUB", () => {
  it("explicitly frames membership as real LCI, not a fiction", () => {
    expect(ENGINEER_NOTE_LIONS_CLUB).toContain("real Lion");
    expect(ENGINEER_NOTE_LIONS_CLUB).toContain("Lions Clubs International");
  });

  it("mentions the 25-dollar LCIF honor donation", () => {
    expect(ENGINEER_NOTE_LIONS_CLUB).toContain("Twenty-five");
    expect(ENGINEER_NOTE_LIONS_CLUB).toContain("LCIF");
  });
});
