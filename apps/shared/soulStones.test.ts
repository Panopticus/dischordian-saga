import { describe, expect, it } from "vitest";
import {
  corruptSoulStone,
  purifySoulStone,
  summonDemonCrewMember,
  summonDemonPet,
  breakDemonBond,
  DEMON_PET_SUMMON_COST,
  type SoulStoneCounts,
} from "./soulStones";

const stones = (
  violet: number,
  red: number,
  gold = 0,
): SoulStoneCounts => ({
  violetCount: violet,
  redCount: red,
  goldCount: gold,
});

describe("soul-stone basics", () => {
  it("corrupt: violet → red 1:1", () => {
    expect(corruptSoulStone(stones(1, 0))).toEqual(stones(0, 1));
  });
  it("corrupt: returns null with no violet", () => {
    expect(corruptSoulStone(stones(0, 5))).toBeNull();
  });
  it("purify: violet → gold 1:1", () => {
    expect(purifySoulStone(stones(1, 0, 0))).toEqual(stones(0, 0, 1));
  });
  it("summonDemonPet still returns a placeholder for back-compat", () => {
    const result = summonDemonPet(stones(0, DEMON_PET_SUMMON_COST));
    expect(result).not.toBeNull();
    expect(result?.petPlaceholder).toBe("demon_pet");
    expect(result?.newCounts.redCount).toBe(0);
  });
});

describe("summonDemonCrewMember (unified roster)", () => {
  it("returns null when red stones < cost", () => {
    const result = summonDemonCrewMember(stones(5, DEMON_PET_SUMMON_COST - 1), {
      boundStoneId: "stone-a",
      userId: "user-1",
    });
    expect(result).toBeNull();
  });

  it("spends DEMON_PET_SUMMON_COST red stones and produces a crew member", () => {
    const result = summonDemonCrewMember(stones(0, DEMON_PET_SUMMON_COST), {
      boundStoneId: "stone-a",
      userId: "user-1",
    });
    expect(result).not.toBeNull();
    expect(result!.redSpent).toBe(DEMON_PET_SUMMON_COST);
    expect(result!.newCounts.redCount).toBe(0);
    expect(result!.member.productionPath).toBe("summoned");
    expect(result!.member.boundStoneId).toBe("stone-a");
    expect(result!.member.bloodlineId).toBe("blood_weave");
    expect(result!.member.species).toBe("abyssal");
    expect(["heretic", "revenant", "oracle"]).toContain(
      result!.member.archetype,
    );
    expect(result!.member.corruption).toBeGreaterThanOrEqual(30);
    expect(result!.member.corruption).toBeLessThanOrEqual(60);
    expect(result!.member.biography?.length).toBeGreaterThan(0);
    expect(result!.loredexUnlock).toMatch(/^demon_lineage_/);
  });

  it("is deterministic for the same (userId, stoneId) seed", () => {
    const a = summonDemonCrewMember(stones(0, DEMON_PET_SUMMON_COST), {
      boundStoneId: "stone-zeta",
      userId: "user-pinned",
      now: 1000,
    });
    const b = summonDemonCrewMember(stones(0, DEMON_PET_SUMMON_COST), {
      boundStoneId: "stone-zeta",
      userId: "user-pinned",
      now: 1000,
    });
    expect(a!.member.archetype).toBe(b!.member.archetype);
    expect(a!.member.name).toBe(b!.member.name);
    expect(a!.member.stats).toEqual(b!.member.stats);
  });

  it("differs across stoneId values for the same user", () => {
    const a = summonDemonCrewMember(stones(0, DEMON_PET_SUMMON_COST), {
      boundStoneId: "stone-x",
      userId: "user-2",
      now: 100,
    });
    const b = summonDemonCrewMember(stones(0, DEMON_PET_SUMMON_COST), {
      boundStoneId: "stone-y",
      userId: "user-2",
      now: 100,
    });
    // Same name+archetype is possible by chance, but stats should diverge
    // for two independent seed inputs in a 6-d 0..100 space.
    expect(a!.member.stats).not.toEqual(b!.member.stats);
  });

  it("sample 24 seeds — every roll yields a valid demon archetype + corruption band", () => {
    for (let i = 0; i < 24; i++) {
      const res = summonDemonCrewMember(stones(0, DEMON_PET_SUMMON_COST), {
        boundStoneId: `stone-${i}`,
        userId: `u-${i}`,
        now: i,
      });
      expect(res).not.toBeNull();
      expect(["heretic", "revenant", "oracle"]).toContain(
        res!.member.archetype,
      );
      expect(res!.member.corruption).toBeGreaterThanOrEqual(30);
      expect(res!.member.corruption).toBeLessThanOrEqual(60);
      Object.values(res!.member.stats).forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(100);
      });
    }
  });
});

describe("breakDemonBond (purification fork)", () => {
  it("martyred: archetype shifts, stats decay 12, corruption resets, stoneId cleared", () => {
    const summoned = summonDemonCrewMember(stones(0, DEMON_PET_SUMMON_COST), {
      boundStoneId: "stone-pure",
      userId: "user-3",
      seed: 12345,
    })!;
    const before = summoned.member;
    const result = breakDemonBond(before, "martyred");
    expect(result.outcome).toBe("martyred");
    if (result.outcome !== "martyred") return;
    expect(result.member.archetype).toBe("martyr");
    expect(result.member.corruption).toBe(0);
    expect(result.member.boundStoneId).toBeUndefined();
    expect(result.member.stats.intellect).toBe(
      Math.max(1, before.stats.intellect - 12),
    );
    // Biography appended, not replaced.
    expect(result.member.biography!.length).toBeGreaterThan(
      before.biography!.length,
    );
  });

  it("fled: returns just the memberId", () => {
    const summoned = summonDemonCrewMember(stones(0, DEMON_PET_SUMMON_COST), {
      boundStoneId: "stone-flee",
      userId: "user-4",
    })!;
    const result = breakDemonBond(summoned.member, "fled");
    expect(result.outcome).toBe("fled");
    if (result.outcome !== "fled") return;
    expect(result.memberId).toBe(summoned.member.id);
  });
});
