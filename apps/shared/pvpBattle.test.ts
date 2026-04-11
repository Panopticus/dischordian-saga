import { describe, it, expect } from "vitest";
import { getRankTier, getRankDivision, getRankDisplay } from "./pvpBattle";

describe("rank tiers", () => {
  it("maps ELO to the right base tier", () => {
    expect(getRankTier(500)).toBe("bronze");
    expect(getRankTier(1200)).toBe("silver");
    expect(getRankTier(1400)).toBe("gold");
    expect(getRankTier(1600)).toBe("platinum");
    expect(getRankTier(1800)).toBe("diamond");
    expect(getRankTier(2000)).toBe("master");
    expect(getRankTier(2200)).toBe("grandmaster");
  });
});

describe("rank divisions", () => {
  it("splits a tier into III → II → I as ELO climbs", () => {
    expect(getRankDivision(1400)).toBe("III");
    expect(getRankDivision(1466)).toBe("II");
    expect(getRankDivision(1531)).toBe("I");
  });

  it("hides divisions for master-plus tiers", () => {
    expect(getRankDivision(2000)).toBe("—");
    expect(getRankDivision(2500)).toBe("—");
  });

  it("handles tier boundaries correctly", () => {
    // Just inside gold
    expect(getRankDivision(1400)).toBe("III");
    // One below platinum but still gold I
    expect(getRankDivision(1599)).toBe("I");
    // Exactly at platinum floor → platinum III
    expect(getRankDivision(1600)).toBe("III");
  });

  it("bronze divisions anchor at ELO 0", () => {
    expect(getRankDivision(0)).toBe("III");
    expect(getRankDivision(70)).toBe("II");
    expect(getRankDivision(140)).toBe("I");
  });
});

describe("rank display", () => {
  it("formats combined tier + division", () => {
    expect(getRankDisplay(1400)).toBe("gold III");
    expect(getRankDisplay(1499)).toBe("gold II");
    expect(getRankDisplay(1800)).toBe("diamond III");
  });

  it("drops the division suffix for master tiers", () => {
    expect(getRankDisplay(2000)).toBe("master");
    expect(getRankDisplay(2500)).toBe("grandmaster");
  });
});
