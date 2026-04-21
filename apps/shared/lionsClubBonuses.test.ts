import { describe, expect, it } from "vitest";

import type { DreamerEffect } from "./dreamerOrder";
import {
  DGRS_CHAPTER_ID,
  LCIF_HONOR_DONATION_USD,
  type LionsClubMembership,
} from "./lionsClub";
import {
  LION_CHARITY_ACTION_BONUS_PCT,
  LION_CHAT_BADGE_ID,
  LION_NAME_COLOR_HEX,
  canAccessIronCladLionsDialog,
  canAccessIronCladLionsQuests,
  canCraftIronCladLionsRecipe,
  resolveCharityActionBonus,
  resolveDreamerEffectMagnitude,
  resolveLionsClubCosmetics,
} from "./lionsClubBonuses";

const NOW = "2026-09-15T00:00:00Z";

function activeMembership(
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

const xpEffect: DreamerEffect = {
  id: "dreamer-t3-xp-boost",
  label: "+3% global XP",
  magnitude: 0.03,
  kind: "xp-multiplier",
};

const zeroEffect: DreamerEffect = {
  id: "dreamer-t-zero",
  label: "no-op",
  magnitude: 0,
  kind: "xp-multiplier",
};

describe("resolveDreamerEffectMagnitude", () => {
  it("doubles the magnitude for an active Lion", () => {
    const m = activeMembership();
    expect(
      resolveDreamerEffectMagnitude(xpEffect, { membership: m, nowIso: NOW }),
    ).toBeCloseTo(0.06);
  });

  it("passes through unchanged for a non-member", () => {
    expect(
      resolveDreamerEffectMagnitude(xpEffect, {
        membership: null,
        nowIso: NOW,
      }),
    ).toBeCloseTo(0.03);
  });

  it("passes through unchanged for a lapsed membership", () => {
    const m = activeMembership({ expiresIso: "2026-06-30T23:59:59Z" });
    expect(
      resolveDreamerEffectMagnitude(xpEffect, { membership: m, nowIso: NOW }),
    ).toBeCloseTo(0.03);
  });

  it("keeps a zero magnitude at zero under the multiplier", () => {
    const m = activeMembership();
    expect(
      resolveDreamerEffectMagnitude(zeroEffect, { membership: m, nowIso: NOW }),
    ).toBe(0);
  });

  it("passes through for a revoked membership", () => {
    const m = activeMembership({ status: "revoked" });
    expect(
      resolveDreamerEffectMagnitude(xpEffect, { membership: m, nowIso: NOW }),
    ).toBeCloseTo(0.03);
  });
});

describe("resolveCharityActionBonus", () => {
  it("returns 0 for a non-member", () => {
    expect(
      resolveCharityActionBonus({ membership: null, nowIso: NOW }),
    ).toBe(0);
  });

  it("returns the configured bonus for an active Lion", () => {
    expect(
      resolveCharityActionBonus({
        membership: activeMembership(),
        nowIso: NOW,
      }),
    ).toBe(LION_CHARITY_ACTION_BONUS_PCT);
  });

  it("returns 0 for a lapsed membership", () => {
    expect(
      resolveCharityActionBonus({
        membership: activeMembership({ expiresIso: "2026-06-30T23:59:59Z" }),
        nowIso: NOW,
      }),
    ).toBe(0);
  });
});

describe("access gates", () => {
  it("block non-members from dialog, quests, and recipes", () => {
    const ctx = { membership: null, nowIso: NOW };
    expect(canAccessIronCladLionsDialog(ctx)).toBe(false);
    expect(canAccessIronCladLionsQuests(ctx)).toBe(false);
    expect(canCraftIronCladLionsRecipe("any-recipe", ctx)).toBe(false);
  });

  it("allow active members through every gate", () => {
    const ctx = { membership: activeMembership(), nowIso: NOW };
    expect(canAccessIronCladLionsDialog(ctx)).toBe(true);
    expect(canAccessIronCladLionsQuests(ctx)).toBe(true);
    expect(canCraftIronCladLionsRecipe("any-recipe", ctx)).toBe(true);
  });
});

describe("resolveLionsClubCosmetics", () => {
  it("returns an empty cosmetic bundle for a non-member", () => {
    const c = resolveLionsClubCosmetics({ membership: null, nowIso: NOW });
    expect(c.showLionCrest).toBe(false);
    expect(c.nameColorHex).toBeNull();
    expect(c.chatBadgeId).toBeNull();
  });

  it("returns the gold cosmetics for an active Lion", () => {
    const c = resolveLionsClubCosmetics({
      membership: activeMembership(),
      nowIso: NOW,
    });
    expect(c.showLionCrest).toBe(true);
    expect(c.nameColorHex).toBe(LION_NAME_COLOR_HEX);
    expect(c.chatBadgeId).toBe(LION_CHAT_BADGE_ID);
  });
});
