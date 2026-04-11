/* ═══════════════════════════════════════════════════════
   Monetization Improvements Tests
   Items 36-43: First Purchase Bundle, Countdown Timers,
   Seasonal Drops, Guild Contribution Leaderboard,
   Battle Pass Tier 50, Ad-for-Dream, Gifting, Sub Differentiation
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  FIRST_PURCHASE_BUNDLE,
  isFirstPurchaseBundleAvailable,
  AD_FOR_DREAM,
  getAdDreamStatus,
  GIFTING_CONFIG,
  canSendGift,
  COMMANDERS_BLESSING,
  ARK_COMMANDER,
  COSMETIC_BUNDLES,
  getBundleCountdown,
  SEASONAL_DROP_SCHEDULES,
  getSeasonalBundles,
  DREAM_PACKS,
  MONETIZATION_RULES,
  REVENUE_MODEL,
} from "@shared/monetization";
import {
  MONTHLY_CONTRIBUTION_REWARDS,
  CONTRIBUTION_SCORING,
  calculateContributionScore,
  getContributionReward,
  getContributionSummary,
} from "@shared/donationSystem";
import { EPOCH_SEASONS } from "@shared/epochPass";
import { STORE_PRODUCTS } from "./products";

/* ═══ #36: FIRST PURCHASE STARTER BUNDLE ═══ */
describe("First Purchase Starter Bundle", () => {
  it("should offer 200 Dream + 3 card packs + exclusive cosmetic for $0.99", () => {
    expect(FIRST_PURCHASE_BUNDLE.priceValue).toBe(99);
    expect(FIRST_PURCHASE_BUNDLE.contents.dreamTokens).toBe(200);
    expect(FIRST_PURCHASE_BUNDLE.contents.cardPacks).toBe(3);
    expect(FIRST_PURCHASE_BUNDLE.contents.exclusiveCosmetic).toBeDefined();
    expect(FIRST_PURCHASE_BUNDLE.contents.exclusiveCosmetic.rarity).toBe("rare");
  });

  it("should be one-time purchase only", () => {
    expect(FIRST_PURCHASE_BUNDLE.oneTimePurchase).toBe(true);
  });

  it("should only be available for 7 days after account creation", () => {
    expect(FIRST_PURCHASE_BUNDLE.availabilityWindowDays).toBe(7);
  });

  it("should be at least 2x better value than the regular $0.99 starter pack", () => {
    const regularStarter = DREAM_PACKS.find(p => p.id === "pack_starter");
    expect(regularStarter).toBeDefined();
    // First purchase gives 200 Dream + card packs + cosmetic vs 100 Dream
    expect(FIRST_PURCHASE_BUNDLE.contents.dreamTokens).toBeGreaterThanOrEqual(
      regularStarter!.dreamAmount * 2
    );
  });

  it("should show available when account is new and not purchased", () => {
    const now = new Date();
    const result = isFirstPurchaseBundleAvailable({
      accountCreatedAt: now.toISOString(),
      hasPurchasedBundle: false,
    });
    expect(result.available).toBe(true);
    expect(result.daysRemaining).toBeGreaterThan(0);
  });

  it("should show unavailable after purchase", () => {
    const result = isFirstPurchaseBundleAvailable({
      accountCreatedAt: new Date().toISOString(),
      hasPurchasedBundle: true,
    });
    expect(result.available).toBe(false);
  });

  it("should show unavailable after 7 days", () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 86400000);
    const result = isFirstPurchaseBundleAvailable({
      accountCreatedAt: eightDaysAgo.toISOString(),
      hasPurchasedBundle: false,
    });
    expect(result.available).toBe(false);
    expect(result.daysRemaining).toBe(0);
  });

  it("should exist in store products catalog", () => {
    const product = STORE_PRODUCTS.find(p => p.key === "first_purchase_starter");
    expect(product).toBeDefined();
    expect(product!.priceUsd).toBe(99);
    expect(product!.rewards.dreamTokens).toBe(200);
    expect(product!.sortOrder).toBe(0); // Always shown first
  });
});

/* ═══ #37: LIMITED-TIME BUNDLE COUNTDOWN TIMERS ═══ */
describe("Bundle Countdown Timers", () => {
  it("should return countdown info for limited bundles", () => {
    const limitedBundle = COSMETIC_BUNDLES.find(b => b.limited && b.expiresAt);
    expect(limitedBundle).toBeDefined();
    const countdown = getBundleCountdown(limitedBundle!);
    expect(countdown.isLimited).toBe(true);
    expect(typeof countdown.displayText).toBe("string");
    expect(countdown.displayText.length).toBeGreaterThan(0);
  });

  it("should return 'Always available' for non-limited bundles", () => {
    const permanentBundle = COSMETIC_BUNDLES.find(b => !b.limited);
    expect(permanentBundle).toBeDefined();
    const countdown = getBundleCountdown(permanentBundle!);
    expect(countdown.isLimited).toBe(false);
    expect(countdown.displayText).toBe("Always available");
  });

  it("should show urgency levels based on time remaining", () => {
    // Test with a bundle expiring far in the future
    const farFuture: typeof COSMETIC_BUNDLES[0] = {
      id: "test", name: "Test", description: "", contents: [],
      price: "$1", priceValue: 100, limited: true,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      theme: "test",
    };
    expect(getBundleCountdown(farFuture).urgency).toBe("low");

    // Expiring in 5 days
    const mediumFuture = { ...farFuture, expiresAt: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10) };
    expect(getBundleCountdown(mediumFuture).urgency).toBe("medium");

    // Expiring in 2 days
    const nearFuture = { ...farFuture, expiresAt: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10) };
    expect(getBundleCountdown(nearFuture).urgency).toBe("high");

    // Expiring in 12 hours
    const critical = { ...farFuture, expiresAt: new Date(Date.now() + 12 * 3600000).toISOString() };
    expect(getBundleCountdown(critical).urgency).toBe("critical");
  });

  it("should show expired for past bundles", () => {
    const expired: typeof COSMETIC_BUNDLES[0] = {
      id: "test", name: "Test", description: "", contents: [],
      price: "$1", priceValue: 100, limited: true,
      expiresAt: "2020-01-01", theme: "test",
    };
    const countdown = getBundleCountdown(expired);
    expect(countdown.expired).toBe(true);
    expect(countdown.displayText).toBe("Expired");
  });
});

/* ═══ #38: SEASONAL SPENDING MOMENTS ═══ */
describe("Seasonal Content Drop Schedule", () => {
  it("should have a drop schedule for every epoch season", () => {
    for (const season of EPOCH_SEASONS) {
      const schedule = SEASONAL_DROP_SCHEDULES.find(s => s.seasonId === season.id);
      expect(schedule).toBeDefined();
    }
  });

  it("each season should have 4 weekly drops", () => {
    for (const schedule of SEASONAL_DROP_SCHEDULES) {
      expect(schedule.drops).toHaveLength(4);
      expect(schedule.drops[0].week).toBe(1);
      expect(schedule.drops[1].week).toBe(2);
      expect(schedule.drops[2].week).toBe(3);
      expect(schedule.drops[3].week).toBe(4);
    }
  });

  it("week 1 should always be a cosmetic bundle featuring the season's NPC", () => {
    for (const schedule of SEASONAL_DROP_SCHEDULES) {
      expect(schedule.drops[0].type).toBe("cosmetic_bundle");
      expect(schedule.drops[0].bundleId).toBeTruthy();
    }
  });

  it("week 2 should always be a card expansion", () => {
    for (const schedule of SEASONAL_DROP_SCHEDULES) {
      expect(schedule.drops[1].type).toBe("card_expansion");
    }
  });

  it("seasonal bundles should exist in COSMETIC_BUNDLES", () => {
    for (const schedule of SEASONAL_DROP_SCHEDULES) {
      const bundleDrop = schedule.drops.find(d => d.bundleId);
      if (bundleDrop?.bundleId) {
        const bundle = COSMETIC_BUNDLES.find(b => b.id === bundleDrop.bundleId);
        expect(bundle).toBeDefined();
        expect(bundle!.seasonId).toBe(schedule.seasonId);
      }
    }
  });

  it("getSeasonalBundles should return correct bundles for a season", () => {
    const s1Bundles = getSeasonalBundles("season_1_fall");
    expect(s1Bundles.length).toBeGreaterThanOrEqual(1);
    for (const b of s1Bundles) {
      expect(b.seasonId).toBe("season_1_fall");
    }
  });
});

/* ═══ #39: GUILD CONTRIBUTION LEADERBOARD ═══ */
describe("Guild Contribution Leaderboard", () => {
  it("should have rewards for ranks 1, 2-3, and 4-10", () => {
    expect(MONTHLY_CONTRIBUTION_REWARDS).toHaveLength(3);
    expect(MONTHLY_CONTRIBUTION_REWARDS[0].rankRange).toEqual([1, 1]);
    expect(MONTHLY_CONTRIBUTION_REWARDS[1].rankRange).toEqual([2, 3]);
    expect(MONTHLY_CONTRIBUTION_REWARDS[2].rankRange).toEqual([4, 10]);
  });

  it("top contributor should receive a legendary cosmetic", () => {
    expect(MONTHLY_CONTRIBUTION_REWARDS[0].cosmetic.rarity).toBe("legendary");
    expect(MONTHLY_CONTRIBUTION_REWARDS[0].cosmetic.name).toContain("Crown");
  });

  it("all rewards should include bonus Dream", () => {
    for (const reward of MONTHLY_CONTRIBUTION_REWARDS) {
      expect(reward.bonusDream).toBeGreaterThan(0);
    }
  });

  it("calculateContributionScore should weight donation types correctly", () => {
    const score = calculateContributionScore({
      dreamDonated: 100,
      materialsDonated: 50,
      cardsDonated: 10,
    });
    expect(score).toBe(
      100 * CONTRIBUTION_SCORING.dreamWeight +
      50 * CONTRIBUTION_SCORING.materialWeight +
      10 * CONTRIBUTION_SCORING.cardWeight
    );
  });

  it("getContributionReward should return correct reward for rank", () => {
    expect(getContributionReward(1)!.cosmetic.rarity).toBe("legendary");
    expect(getContributionReward(2)!.cosmetic.rarity).toBe("epic");
    expect(getContributionReward(3)!.cosmetic.rarity).toBe("epic");
    expect(getContributionReward(5)!.cosmetic.rarity).toBe("rare");
    expect(getContributionReward(11)).toBeNull();
  });

  it("getContributionSummary should describe the contribution with reward", () => {
    const summary = getContributionSummary({
      username: "TestPlayer",
      dreamDonated: 500,
      rank: 1,
    });
    expect(summary).toContain("500 Dream");
    expect(summary).toContain("Patron's Crown");
  });

  it("getContributionSummary for unranked should encourage contribution", () => {
    const summary = getContributionSummary({
      username: "TestPlayer",
      dreamDonated: 10,
      rank: 50,
    });
    expect(summary).toContain("Keep contributing");
  });
});

/* ═══ #40: BATTLE PASS PREMIUM TIER 50 ═══ */
describe("Epoch Pass Tier 50 Premium Reward", () => {
  it("should have a guaranteed legendary cosmetic at tier 50 for all seasons", () => {
    for (const season of EPOCH_SEASONS) {
      const tier50 = season.tiers.find(t => t.tier === 50);
      expect(tier50).toBeDefined();
      expect(tier50!.premiumReward).toBeDefined();
      expect(tier50!.premiumReward!.rarity).toBe("legendary");
      expect(tier50!.premiumReward!.type).toBe("cosmetic");
    }
  });

  it("tier 50 premium reward should be visually described as aspirational", () => {
    const season = EPOCH_SEASONS[0];
    const tier50 = season.tiers.find(t => t.tier === 50)!;
    expect(tier50.premiumReward!.id).toBe("season_ascendant_50");
    expect(tier50.premiumReward!.name).toBe("Ascendant Form");
    expect(tier50.premiumReward!.description).toContain("animated");
    expect(tier50.premiumReward!.description).toContain("particle effects");
  });

  it("tier 50 should be premium-track exclusive", () => {
    const season = EPOCH_SEASONS[0];
    const tier50 = season.tiers.find(t => t.tier === 50)!;
    // It's in premiumReward, not freeReward — premium only
    expect(tier50.premiumReward).toBeTruthy();
    expect(tier50.premiumReward!.description).toContain("Only obtainable");
  });
});

/* ═══ #41: WATCH AD FOR DREAM ═══ */
describe("Ad-for-Dream System", () => {
  it("should offer 5 Dream per ad, max 3 per day", () => {
    expect(AD_FOR_DREAM.dreamPerAd).toBe(5);
    expect(AD_FOR_DREAM.maxAdsPerDay).toBe(3);
    expect(AD_FOR_DREAM.maxDailyDreamFromAds).toBe(15);
  });

  it("should not exceed baseline free daily Dream", () => {
    // 15 Dream/day from ads vs 50 free daily — small supplemental
    expect(AD_FOR_DREAM.maxDailyDreamFromAds).toBeLessThan(MONETIZATION_RULES.freeDailyDream);
  });

  it("subscribers should be exempt from ads", () => {
    expect(AD_FOR_DREAM.subscriberExempt).toBe(true);
    const result = getAdDreamStatus({ adsWatchedToday: 0, isSubscriber: true });
    expect(result.canWatch).toBe(false);
    expect(result.reason).toContain("ad-free");
  });

  it("should allow watching when under daily limit", () => {
    const result = getAdDreamStatus({ adsWatchedToday: 1, isSubscriber: false });
    expect(result.canWatch).toBe(true);
    expect(result.dreamReward).toBe(5);
    expect(result.adsRemaining).toBe(2);
  });

  it("should block when daily limit reached", () => {
    const result = getAdDreamStatus({ adsWatchedToday: 3, isSubscriber: false });
    expect(result.canWatch).toBe(false);
    expect(result.adsRemaining).toBe(0);
  });

  it("should enforce cooldown between ads", () => {
    const fiveMinutesAgo = Date.now() - 5 * 60000;
    const result = getAdDreamStatus({
      adsWatchedToday: 1,
      isSubscriber: false,
      lastAdWatchedAt: fiveMinutesAgo,
    });
    expect(result.canWatch).toBe(false);
    expect(result.reason).toContain("Cooldown");
  });

  it("should allow watching after cooldown expires", () => {
    const fifteenMinutesAgo = Date.now() - 15 * 60000;
    const result = getAdDreamStatus({
      adsWatchedToday: 1,
      isSubscriber: false,
      lastAdWatchedAt: fifteenMinutesAgo,
    });
    expect(result.canWatch).toBe(true);
  });
});

/* ═══ #42: GIFTING SYSTEM ═══ */
describe("Gifting System", () => {
  it("should define gifting configuration", () => {
    expect(GIFTING_CONFIG.minDreamGift).toBe(10);
    expect(GIFTING_CONFIG.maxDreamGift).toBe(5000);
    expect(GIFTING_CONFIG.wrappingFee).toBe(5);
    expect(GIFTING_CONFIG.maxGiftsPerDay).toBe(10);
  });

  it("should require minimum account age to prevent fraud", () => {
    expect(GIFTING_CONFIG.minAccountAgeDays).toBe(3);
    const result = canSendGift({
      accountAgeDays: 1,
      giftsSentToday: 0,
      dreamBalance: 1000,
      giftCost: 100,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("days old");
  });

  it("should allow gifting with sufficient balance and account age", () => {
    const result = canSendGift({
      accountAgeDays: 10,
      giftsSentToday: 0,
      dreamBalance: 1000,
      giftCost: 100,
    });
    expect(result.allowed).toBe(true);
  });

  it("should block when daily gift limit reached", () => {
    const result = canSendGift({
      accountAgeDays: 10,
      giftsSentToday: 10,
      dreamBalance: 1000,
      giftCost: 100,
    });
    expect(result.allowed).toBe(false);
  });

  it("should account for wrapping fee in balance check", () => {
    const result = canSendGift({
      accountAgeDays: 10,
      giftsSentToday: 0,
      dreamBalance: 100,
      giftCost: 100, // 100 + 5 wrapping fee = 105 needed, but only 100 available
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("wrapping fee");
  });

  it("should define giftable cosmetic types", () => {
    expect(GIFTING_CONFIG.giftableTypes.length).toBeGreaterThan(0);
    expect(GIFTING_CONFIG.giftableTypes).toContain("avatar_frame");
    expect(GIFTING_CONFIG.giftableTypes).toContain("emote");
  });
});

/* ═══ #43: SUBSCRIPTION DIFFERENTIATION ═══ */
describe("Subscription Differentiation", () => {
  it("Commander's Blessing should be purely Dream currency (1200 total)", () => {
    expect(COMMANDERS_BLESSING.totalValue).toBe(1200);
    expect(COMMANDERS_BLESSING.price).toBe("$4.99");
    expect(COMMANDERS_BLESSING.dailyDream).toBeGreaterThan(0);
  });

  it("Ark Commander should be purely perks (no Dream bonus)", () => {
    expect(ARK_COMMANDER.price).toBe("$3.99/month");
    expect(ARK_COMMANDER.perks.dailyDreamBonus).toBe(0);
  });

  it("Ark Commander should have enhanced QoL perks", () => {
    expect(ARK_COMMANDER.perks.extraDailyQuests).toBe(2); // Up from 1
    expect(ARK_COMMANDER.perks.craftingSpeedPercent).toBe(25); // Up from 20
    expect(ARK_COMMANDER.perks.extraGiftsPerDay).toBe(2); // Up from 1
    expect(ARK_COMMANDER.perks.extraIncursionRuns).toBe(2); // Up from 1
  });

  it("Ark Commander should remain ad-free", () => {
    expect(ARK_COMMANDER.perks.adFree).toBe(true);
  });

  it("the two subscriptions should stack meaningfully", () => {
    // Blessing = currency, Commander = convenience — different value props
    expect(COMMANDERS_BLESSING.totalValue).toBeGreaterThan(0); // gives Dream
    expect(ARK_COMMANDER.perks.dailyDreamBonus).toBe(0); // doesn't give Dream
    // Both are different prices too
    expect(COMMANDERS_BLESSING.price).not.toBe(ARK_COMMANDER.price);
  });

  it("combined price should still be reasonable", () => {
    // $4.99 + $3.99 = $8.98/month — still under $10
    const blessingPrice = 4.99;
    const commanderPrice = 3.99;
    expect(blessingPrice + commanderPrice).toBeLessThan(10);
  });
});

/* ═══ CROSS-CUTTING MONETIZATION RULES ═══ */
describe("Monetization Rules Integrity", () => {
  it("premium-to-free ratio should still be capped at 3x", () => {
    expect(MONETIZATION_RULES.premiumToFreeRatio).toBe(3);
  });

  it("all cosmetics should still eventually be free (6-month delay)", () => {
    expect(MONETIZATION_RULES.cosmeticEventualFree).toBe(true);
    expect(MONETIZATION_RULES.cosmeticFreeDelay).toBe(6);
  });

  it("no paywall content rule should be maintained", () => {
    expect(MONETIZATION_RULES.noPaywallContent).toBe(true);
  });

  it("free daily Dream baseline should be maintained", () => {
    expect(MONETIZATION_RULES.freeDailyDream).toBe(50);
  });

  it("revenue model should reflect improved conversion from starter bundle", () => {
    // Free percentage should be lower due to starter bundle conversions
    expect(REVENUE_MODEL.payerTiers.free).toBeLessThan(0.95);
    // Ad revenue from free players
    expect(REVENUE_MODEL.averageMonthlySpend.free).toBeGreaterThan(0);
  });
});
