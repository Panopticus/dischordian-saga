import { describe, it, expect } from "vitest";
import {
  scoreBiddingWar,
  isForbiddenPledge,
  BIDDING_WAR_FACTIONS,
  BIDDING_WAR_PASS_MIN_SUBHOUSES,
  BIDDING_WAR_MAX_CARDS_PER_SUBHOUSE,
  BIDDING_WAR_MULTIPLIER_CAP,
  type BiddingWarPledge,
  type BiddingWarFaction,
  type PledgeAlignment,
} from "./biddingWar";

function pledge(
  subHouseId: string,
  faction: BiddingWarFaction,
  alignment: PledgeAlignment = "neutral",
  cardIds: readonly string[] = [`card_${subHouseId}_001`],
): BiddingWarPledge {
  return { subHouseId, faction, alignment, cardIds };
}

/** Build a passing submission: one sub-house per faction = 5 sub-houses,
 *  plus one extra to hit the ≥6 threshold. */
function passingPledges(): BiddingWarPledge[] {
  return [
    pledge("subhouse_architect_01", "architect"),
    pledge("subhouse_dreamer_01", "dreamer"),
    pledge("subhouse_insurgency_01", "insurgency"),
    pledge("subhouse_new_babylon_01", "new_babylon"),
    pledge("subhouse_antiquarian_01", "antiquarian"),
    pledge("subhouse_architect_02", "architect"),
  ];
}

/* ─── GUARD-RAILS ─── */

describe("isForbiddenPledge — guard-rail", () => {
  it("blocks Locke's named card", () => {
    expect(isForbiddenPledge("s1_char_001_adjudicar_locke")).toBe(true);
  });

  it("blocks Locke's reward + imprint variants", () => {
    expect(isForbiddenPledge("s1_reward_companion_locke")).toBe(true);
    expect(isForbiddenPledge("imprint/locke")).toBe(true);
  });

  it("blocks the three ballot candidates with playable cards", () => {
    expect(isForbiddenPledge("s1_char_106_wraith_calder")).toBe(true);
    expect(isForbiddenPledge("s1_char_003_akai_shi")).toBe(true);
    expect(isForbiddenPledge("imprint/akai_shi")).toBe(true);
  });

  it("blocks future cards via substring patterns (vex_solene, lycos)", () => {
    expect(isForbiddenPledge("s2_char_999_vex_solene_maestro")).toBe(true);
    expect(isForbiddenPledge("s2_char_999_lycos_pack_alpha")).toBe(true);
    expect(isForbiddenPledge("imprint/vex_solène")).toBe(true);
  });

  it("does NOT block ordinary card ids", () => {
    expect(isForbiddenPledge("s1_char_055_random_npc")).toBe(false);
    expect(isForbiddenPledge("s1_spell_dawn_breaks")).toBe(false);
  });
});

describe("scoreBiddingWar — guard-rail fail", () => {
  it("fails if a forbidden card is in any pledge", () => {
    const pledges = [
      ...passingPledges(),
      pledge("subhouse_x", "architect", "neutral", ["s1_char_001_adjudicar_locke"]),
    ];
    const e = scoreBiddingWar({ pledges });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/The Antiquarian refuses/);
    expect(e.penalties?.factionMultipliers).toEqual({
      architect: 1.0,
      dreamer: 1.0,
      insurgency: 1.0,
      new_babylon: 1.0,
      antiquarian: 1.0,
    });
  });

  it("fails if a sub-house receives more than 3 cards (single pledge)", () => {
    const pledges = [
      pledge("subhouse_greedy", "architect", "neutral", ["c1", "c2", "c3", "c4"]),
      ...passingPledges(),
    ];
    const e = scoreBiddingWar({ pledges });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/cannot accept more than 3/);
  });

  it("fails if a sub-house receives more than 3 cards (multiple pledges, same sub-house)", () => {
    const pledges = [
      pledge("subhouse_x", "architect", "neutral", ["c1", "c2"]),
      pledge("subhouse_x", "architect", "neutral", ["c3", "c4"]),
      ...passingPledges(),
    ];
    const e = scoreBiddingWar({ pledges });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/cannot accept more than 3/);
  });
});

/* ─── PASS / FAIL THRESHOLDS ─── */

describe("scoreBiddingWar — pass / fail rules", () => {
  it("passes with one sub-house per faction (5) + 1 extra (6 total)", () => {
    const e = scoreBiddingWar({ pledges: passingPledges() });
    expect(e.passed).toBe(true);
    expect(e.reason).toMatch(/all 5 factions/i);
  });

  it("fails with < 6 sub-houses even when all 5 factions covered", () => {
    const pledges = [
      pledge("subhouse_architect_01", "architect"),
      pledge("subhouse_dreamer_01", "dreamer"),
      pledge("subhouse_insurgency_01", "insurgency"),
      pledge("subhouse_new_babylon_01", "new_babylon"),
      pledge("subhouse_antiquarian_01", "antiquarian"),
    ];
    const e = scoreBiddingWar({ pledges });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/5 sub-houses across 5 faction\(s\)/);
  });

  it("fails when one faction is missing entirely (even with > 6 sub-houses)", () => {
    const pledges = [
      pledge("a1", "architect"),
      pledge("a2", "architect"),
      pledge("d1", "dreamer"),
      pledge("d2", "dreamer"),
      pledge("i1", "insurgency"),
      pledge("i2", "insurgency"),
      pledge("n1", "new_babylon"),
      // antiquarian missing
    ];
    const e = scoreBiddingWar({ pledges });
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/4 faction\(s\)/);
  });

  it("applies baseline multipliers on any fail (no faction empty)", () => {
    const e = scoreBiddingWar({ pledges: [pledge("a1", "architect")] });
    expect(e.passed).toBe(false);
    for (const f of BIDDING_WAR_FACTIONS) {
      expect(e.penalties?.factionMultipliers?.[f]).toBe(1.0);
    }
  });
});

/* ─── MULTIPLIER MATH ─── */

describe("scoreBiddingWar — multiplier math on pass", () => {
  it("baseline pass yields 1.2× per faction (one neutral sub-house each)", () => {
    const e = scoreBiddingWar({ pledges: passingPledges() });
    expect(e.passed).toBe(true);
    // architect has 2 neutral pledges = 2.0 contribution × 0.2 = 0.4 → 1.4
    expect(e.rewards?.factionMultipliers?.architect).toBeCloseTo(1.4);
    expect(e.rewards?.factionMultipliers?.dreamer).toBeCloseTo(1.2);
    expect(e.rewards?.factionMultipliers?.insurgency).toBeCloseTo(1.2);
    expect(e.rewards?.factionMultipliers?.new_babylon).toBeCloseTo(1.2);
    expect(e.rewards?.factionMultipliers?.antiquarian).toBeCloseTo(1.2);
  });

  it("aligned pledges count 1.5× weight", () => {
    const pledges: BiddingWarPledge[] = [
      pledge("a1", "architect", "aligned"),
      pledge("d1", "dreamer"),
      pledge("i1", "insurgency"),
      pledge("n1", "new_babylon"),
      pledge("aq1", "antiquarian"),
      pledge("aq2", "antiquarian"),
    ];
    const e = scoreBiddingWar({ pledges });
    expect(e.passed).toBe(true);
    // architect: 1 aligned = 1.5 contribution × 0.2 = 0.3 → 1.3
    expect(e.rewards?.factionMultipliers?.architect).toBeCloseTo(1.3);
  });

  it("hostile pledges count 0.5× weight", () => {
    const pledges: BiddingWarPledge[] = [
      pledge("a1", "architect", "hostile"),
      pledge("d1", "dreamer"),
      pledge("i1", "insurgency"),
      pledge("n1", "new_babylon"),
      pledge("aq1", "antiquarian"),
      pledge("aq2", "antiquarian"),
    ];
    const e = scoreBiddingWar({ pledges });
    expect(e.passed).toBe(true);
    // architect: 1 hostile = 0.5 contribution × 0.2 = 0.1 → 1.1
    expect(e.rewards?.factionMultipliers?.architect).toBeCloseTo(1.1);
  });

  it("caps multipliers at 3.0× for absurdly large pledge counts", () => {
    const pledges: BiddingWarPledge[] = [];
    // 24 aligned pledges to architect — way past the cap
    for (let i = 0; i < 24; i++) {
      pledges.push(pledge(`arch_${i}`, "architect", "aligned"));
    }
    pledges.push(pledge("d1", "dreamer"));
    pledges.push(pledge("i1", "insurgency"));
    pledges.push(pledge("n1", "new_babylon"));
    pledges.push(pledge("aq1", "antiquarian"));
    const e = scoreBiddingWar({ pledges });
    expect(e.passed).toBe(true);
    expect(e.rewards?.factionMultipliers?.architect).toBe(BIDDING_WAR_MULTIPLIER_CAP);
  });

  it("collects all pledged card ids for Season-2-week-1 return", () => {
    const e = scoreBiddingWar({
      pledges: [
        pledge("a1", "architect", "neutral", ["c1", "c2"]),
        pledge("d1", "dreamer", "neutral", ["c3"]),
        pledge("i1", "insurgency"),
        pledge("n1", "new_babylon"),
        pledge("aq1", "antiquarian"),
        pledge("aq2", "antiquarian"),
      ],
    });
    expect(e.passed).toBe(true);
    expect(e.rewards?.pledgedCardIds).toContain("c1");
    expect(e.rewards?.pledgedCardIds).toContain("c2");
    expect(e.rewards?.pledgedCardIds).toContain("c3");
  });
});

/* ─── CONSTANTS SANITY ─── */

describe("Bidding War constants are sensible", () => {
  it("threshold ≤ total factions count", () => {
    expect(BIDDING_WAR_FACTIONS.length).toBe(5);
    expect(BIDDING_WAR_PASS_MIN_SUBHOUSES).toBeGreaterThanOrEqual(
      BIDDING_WAR_FACTIONS.length,
    );
  });

  it("max cards per sub-house is positive", () => {
    expect(BIDDING_WAR_MAX_CARDS_PER_SUBHOUSE).toBe(3);
  });
});
