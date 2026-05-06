import { describe, it, expect } from "vitest";
import { rollSkillCheck, deriveSkillStats } from "./dialogSkillCheck";

describe("rollSkillCheck", () => {
  it("returns roll in [1, 100]", () => {
    let minRoll = 100;
    let maxRoll = 1;
    for (let i = 0; i < 200; i++) {
      const r = rollSkillCheck(0, 0);
      minRoll = Math.min(minRoll, r.roll);
      maxRoll = Math.max(maxRoll, r.roll);
      expect(r.roll).toBeGreaterThanOrEqual(1);
      expect(r.roll).toBeLessThanOrEqual(100);
    }
    // Sanity: across 200 rolls we should see the full range
    expect(maxRoll - minRoll).toBeGreaterThan(50);
  });

  it("computes total = roll + playerStat", () => {
    const r = rollSkillCheck(20, 50, () => 0); // floor(0*100)+1 = 1 → roll=1
    expect(r.roll).toBe(1);
    expect(r.total).toBe(21);
  });

  it("passes when total >= threshold", () => {
    // Force roll=100 (rng() just below 1 → floor((1-eps)*100)+1 = 100)
    const r = rollSkillCheck(0, 100, () => 0.999);
    expect(r.roll).toBe(100);
    expect(r.passed).toBe(true);
  });

  it("fails when total < threshold", () => {
    // Force roll=1, threshold=100, no stat boost
    const r = rollSkillCheck(0, 100, () => 0);
    expect(r.passed).toBe(false);
  });

  it("uses a seedable rng deterministically", () => {
    let i = 0;
    const seq = [0.1, 0.5, 0.9];
    const rng = () => seq[i++ % seq.length];
    const a = rollSkillCheck(0, 50, rng);
    i = 0; // reset
    const b = rollSkillCheck(0, 50, rng);
    expect(a).toEqual(b);
  });

  it("playerStat directly contributes to passed-ness", () => {
    // Same rng → roll fixed → adding stat must monotonically push toward pass
    const fixedRoll = () => 0.5; // → roll=51
    const lowStat = rollSkillCheck(10, 80, fixedRoll);
    const highStat = rollSkillCheck(40, 80, fixedRoll);
    expect(lowStat.passed).toBe(false); // 51 + 10 = 61, < 80
    expect(highStat.passed).toBe(true); // 51 + 40 = 91, >= 80
  });
});

describe("deriveSkillStats", () => {
  it("uses default 5/5/5 for missing attributes", () => {
    const s = deriveSkillStats(null);
    expect(s.charisma).toBe(50); // 5*10
    expect(s.strength).toBe(50);
    expect(s.willpower).toBe(50);
    expect(s.intelligence).toBe(50); // 5*8 + 5*2
    expect(s.perception).toBe(50); // 5*6 + 5*4
    expect(s.agility).toBe(50); // 5*5 + 5*5
  });

  it("scales with provided attributes", () => {
    const s = deriveSkillStats({ attrAttack: 10, attrDefense: 0, attrVitality: 0 });
    expect(s.strength).toBe(100);
    expect(s.charisma).toBe(0);
    expect(s.willpower).toBe(0);
  });

  it("intelligence weights attack heavier than defense", () => {
    const high = deriveSkillStats({ attrAttack: 10, attrDefense: 0, attrVitality: 0 });
    const low = deriveSkillStats({ attrAttack: 0, attrDefense: 10, attrVitality: 0 });
    expect(high.intelligence).toBe(80); // 10*8 + 0*2
    expect(low.intelligence).toBe(20); // 0*8 + 10*2
    expect(high.intelligence).toBeGreaterThan(low.intelligence);
  });

  it("returns the same six skill keys regardless of input", () => {
    const keys = Object.keys(deriveSkillStats({ attrAttack: 1, attrDefense: 1, attrVitality: 1 })).sort();
    expect(keys).toEqual([
      "agility",
      "charisma",
      "intelligence",
      "perception",
      "strength",
      "willpower",
    ]);
  });
});
