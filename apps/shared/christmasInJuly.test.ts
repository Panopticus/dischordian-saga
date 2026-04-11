import { describe, it, expect } from "vitest";
import {
  CHRISTMAS_EVENT_CONFIG, CHRISTMAS_EVENT_KEY,
  CHRISTMAS_WHEEL_PRIZES, CHRISTMAS_MILESTONES, CHRISTMAS_DAILY_CHALLENGES,
  GIFT_TYPES,
} from "./christmasInJuly";
import { spinWheel, rollCraps, createRng } from "./casinoGames";

describe("Christmas in July event config", () => {
  it("has a stable event key", () => {
    expect(CHRISTMAS_EVENT_KEY).toBe("christmas_in_july_2026");
    expect(CHRISTMAS_EVENT_CONFIG.eventKey).toBe(CHRISTMAS_EVENT_KEY);
  });

  it("runs for 14 days", () => {
    const start = new Date(CHRISTMAS_EVENT_CONFIG.startDate).getTime();
    const end = new Date(CHRISTMAS_EVENT_CONFIG.endDate).getTime();
    const daysApprox = (end - start) / (24 * 60 * 60 * 1000);
    expect(daysApprox).toBeGreaterThan(13);
    expect(daysApprox).toBeLessThan(15);
    expect(CHRISTMAS_EVENT_CONFIG.durationDays).toBe(14);
  });

  it("donates 10% to LCIF", () => {
    expect(CHRISTMAS_EVENT_CONFIG.lcifPercentage).toBe(0.10);
  });
});

describe("wheel prizes", () => {
  it("has weights that sum close to 1", () => {
    const sum = CHRISTMAS_WHEEL_PRIZES.reduce((s, p) => s + p.weight, 0);
    expect(sum).toBeGreaterThan(0.99);
    expect(sum).toBeLessThan(1.01);
  });

  it("has unique ids", () => {
    const ids = CHRISTMAS_WHEEL_PRIZES.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("spinWheel returns a prize with valid id", () => {
    const ids = new Set(CHRISTMAS_WHEEL_PRIZES.map(p => p.id));
    for (let i = 0; i < 100; i++) {
      const prize = spinWheel(CHRISTMAS_WHEEL_PRIZES, createRng(`xmas-${i}`));
      expect(ids.has(prize.id)).toBe(true);
    }
  });

  it("has a jackpot with legendary rarity", () => {
    const jackpot = CHRISTMAS_WHEEL_PRIZES.find(p => p.prizeType === "jackpot");
    expect(jackpot).toBeDefined();
    expect(jackpot?.rarity).toBe("legendary");
  });
});

describe("community milestones", () => {
  it("has ascending thresholds", () => {
    for (let i = 1; i < CHRISTMAS_MILESTONES.length; i++) {
      expect(CHRISTMAS_MILESTONES[i].threshold).toBeGreaterThan(CHRISTMAS_MILESTONES[i - 1].threshold);
    }
  });

  it("has ascending LCIF donations", () => {
    for (let i = 1; i < CHRISTMAS_MILESTONES.length; i++) {
      expect(CHRISTMAS_MILESTONES[i].lcifDonation).toBeGreaterThan(CHRISTMAS_MILESTONES[i - 1].lcifDonation);
    }
  });

  it("has 5 milestones", () => {
    expect(CHRISTMAS_MILESTONES).toHaveLength(5);
  });
});

describe("daily challenges", () => {
  it("has exactly 14 days", () => {
    expect(CHRISTMAS_DAILY_CHALLENGES).toHaveLength(14);
  });

  it("days are sequential 1-14", () => {
    CHRISTMAS_DAILY_CHALLENGES.forEach((c, i) => {
      expect(c.day).toBe(i + 1);
    });
  });

  it("all challenges reward at least 10 festive tokens", () => {
    for (const c of CHRISTMAS_DAILY_CHALLENGES) {
      expect(c.rewardTokens).toBeGreaterThanOrEqual(10);
    }
  });
});

describe("gift types", () => {
  it("has exactly 4 gift types", () => {
    expect(GIFT_TYPES).toHaveLength(4);
  });
  it("includes gift_box", () => {
    expect(GIFT_TYPES).toContain("gift_box");
  });
});

describe("rollCraps wires into event expectations", () => {
  it("7 blesses the stone", () => {
    for (let i = 0; i < 500; i++) {
      const r = rollCraps(createRng(`blessed-${i}`));
      if (r.total === 7) {
        expect(r.outcome).toBe("blessed");
        expect(r.bonusFestiveTokens).toBe(0);
        expect(r.bonusSoulStones).toBe(0);
        return;
      }
    }
  });
});
