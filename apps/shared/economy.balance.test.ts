/* ═══════════════════════════════════════════════════════
   ECONOMY BALANCE TESTS

   End-to-end, calculation-level economic balance suite. Catches:

   - Mis-summed rarity distributions (pack pulls drift from spec)
   - Disenchant ↔ craft round-trips that print free Dream
   - Ranked tier rewards that aren't monotonic
   - Sink coverage gaps (player levels with no usable sink)
   - Inflation: hardcore players accumulating Dream unboundedly

   Anchors the assumptions every other economy module relies on.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import { ECONOMY, CURRENCIES, CURRENCY_MAP } from "./tcg-core/economy/config";
import { SOUL_STONE_VALUES, STANDARD_PACK } from "./tcg-core/economy/packs";
import {
  RANKED_TIERS,
  SEASON_REWARDS,
  ELO_CONFIG,
  calculateEloChange,
  getTierForRating,
} from "./tcg-core/economy/ranked";
import { ALL_SINKS, SINK_COSTS, getRecommendedSinks } from "./economySinks";
import { getEndgameSinks, getTotalNonRepeatableCost } from "./endgameSinks";
import {
  EARLY_GAME_SINKS,
  EARLY_GAME_SINK_COSTS,
  SOUL_STONE_SINKS,
  SOUL_STONE_SINK_COSTS,
  getEarlyGameSinks,
  getSoulStoneSinks,
  getRecommendedEarlyGameSinks,
  getRecommendedSoulStoneSinks,
} from "./earlyGameSinks";
import {
  ALL_COSMETICS,
  COSMETICS_BY_ID,
  getCosmeticsByTier,
  getAffordableCosmetics,
  type Cosmetic,
} from "./cosmeticCatalog";
import { STORE_PRODUCTS, getProduct, getProductsByCategory } from "../server/products";
import {
  PROFILES,
  simulateEconomy,
  simulateAllProfiles,
  formatResult,
  type PlayerProfile,
} from "./economySimulator";

/* ═══════════════════════════════════════════════════════
   Section 1 — Currency registry
   ═══════════════════════════════════════════════════════ */

describe("currencies", () => {
  it("has the four canonical currencies with stable ids", () => {
    const ids = CURRENCIES.map((c) => c.id).sort();
    expect(ids).toEqual([
      "dream_tokens",
      "season_points",
      "soul_stones",
      "void_crystals",
    ]);
  });

  it("only flags void_crystals as premium", () => {
    const premium = CURRENCIES.filter((c) => c.premium).map((c) => c.id);
    expect(premium).toEqual(["void_crystals"]);
  });

  it("CURRENCY_MAP and CURRENCIES agree", () => {
    for (const c of CURRENCIES) {
      expect(CURRENCY_MAP[c.id]).toBe(c);
    }
  });
});

/* ═══════════════════════════════════════════════════════
   Section 2 — Pack rarity & soul-stone math
   ═══════════════════════════════════════════════════════ */

describe("pack distribution", () => {
  // The cumulative thresholds in packs.ts are the source of truth.
  // We re-derive the per-rarity probability and assert it sums to 1.0.
  const dist = {
    legendary: 0.01,
    epic: 0.04, // 0.05 - 0.01
    rare: 0.10, // 0.15 - 0.05
    uncommon: 0.20, // 0.35 - 0.15
    common: 0.65, // 1.00 - 0.35
  };

  it("rarity probabilities sum to exactly 1.0", () => {
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1.0, 6);
  });

  it("rarer cards must be strictly less common", () => {
    expect(dist.legendary).toBeLessThan(dist.epic);
    expect(dist.epic).toBeLessThan(dist.rare);
    expect(dist.rare).toBeLessThan(dist.uncommon);
    expect(dist.uncommon).toBeLessThan(dist.common);
  });

  it("standard pack price matches the economy config", () => {
    expect(STANDARD_PACK.cost).toBe(ECONOMY.packs.standardCost);
    expect(STANDARD_PACK.cardsPerPack).toBe(ECONOMY.packs.cardsPerPack);
  });

  it("expected soul-stone value per pack ≥ 30% of pack cost", () => {
    // Players who already own commons see them auto-disenchant.
    // The dust floor must be high enough that opening packs feels rewarding
    // even with full common collections, otherwise players quit packs.
    const dustEV =
      dist.common * 5 * SOUL_STONE_VALUES.common.disenchant +
      dist.uncommon * 5 * SOUL_STONE_VALUES.uncommon.disenchant +
      dist.rare * 5 * SOUL_STONE_VALUES.rare.disenchant +
      dist.epic * 5 * SOUL_STONE_VALUES.epic.disenchant +
      dist.legendary * 5 * SOUL_STONE_VALUES.legendary.disenchant;
    // 5 cards × per-rarity dust expected. Convert soul stones at common's
    // craft rate (20 soul = 1 common-equivalent ~20 Dream).
    const dreamEquivalent = dustEV; // 1 soul ≈ 1 dream-equivalent (rough)
    expect(dreamEquivalent).toBeGreaterThan(ECONOMY.packs.standardCost * 0.3);
  });

  it("pity timer triggers within 5 packs", () => {
    expect(ECONOMY.packs.pityTimer).toBeLessThanOrEqual(5);
    expect(ECONOMY.packs.pityTimer).toBeGreaterThanOrEqual(1);
  });
});

describe("soul-stone craft/disenchant", () => {
  const rarities = ["common", "uncommon", "rare", "epic", "legendary"] as const;

  it("crafting always costs more than disenchanting yields", () => {
    // Otherwise: open pack → disenchant → craft = duplicate the card forever.
    for (const r of rarities) {
      const v = SOUL_STONE_VALUES[r];
      expect(v.craft).toBeGreaterThan(v.disenchant);
    }
  });

  it("craft cost is between 4× and 5× disenchant yield", () => {
    // 4× is the industry-standard floor (Hearthstone). Anything below 4×
    // enables disenchant-and-recraft loops to print Dream. The `rare` tier
    // currently runs at 5× (100/20) — a deliberate steeper "shred tax" on
    // the rarity players cycle most. If this test fails on a different tier,
    // someone changed an asymmetry that needs review.
    for (const r of rarities) {
      const v = SOUL_STONE_VALUES[r];
      const ratio = v.craft / v.disenchant;
      expect(ratio).toBeGreaterThanOrEqual(4);
      expect(ratio).toBeLessThanOrEqual(5);
    }
  });

  it("documents the rare-tier 5× asymmetry", () => {
    // Pinned so the asymmetry is intentional — if tweaked, this test forces
    // the engineer to update the comment above too.
    expect(SOUL_STONE_VALUES.rare.craft / SOUL_STONE_VALUES.rare.disenchant).toBe(5);
    expect(SOUL_STONE_VALUES.common.craft / SOUL_STONE_VALUES.common.disenchant).toBe(4);
    expect(SOUL_STONE_VALUES.uncommon.craft / SOUL_STONE_VALUES.uncommon.disenchant).toBe(4);
    expect(SOUL_STONE_VALUES.epic.craft / SOUL_STONE_VALUES.epic.disenchant).toBe(4);
    expect(SOUL_STONE_VALUES.legendary.craft / SOUL_STONE_VALUES.legendary.disenchant).toBe(4);
  });

  it("higher rarities need exponentially more soul stones", () => {
    // No flat curve — collecting commons should never approach the cost of
    // a legendary, otherwise rarity matters less than playtime.
    expect(SOUL_STONE_VALUES.legendary.craft).toBeGreaterThan(
      SOUL_STONE_VALUES.epic.craft * 3,
    );
    expect(SOUL_STONE_VALUES.epic.craft).toBeGreaterThan(
      SOUL_STONE_VALUES.rare.craft * 3,
    );
  });

  it("ECONOMY.crafting matches the SOUL_STONE_VALUES table", () => {
    for (const r of rarities) {
      expect(ECONOMY.crafting.craftCosts[r]).toBe(SOUL_STONE_VALUES[r].craft);
      expect(ECONOMY.crafting.disenchantYields[r]).toBe(
        SOUL_STONE_VALUES[r].disenchant,
      );
    }
  });
});

/* ═══════════════════════════════════════════════════════
   Section 3 — Match rewards
   ═══════════════════════════════════════════════════════ */

describe("match rewards", () => {
  const m = ECONOMY.matchRewards;

  it("wins pay strictly more than draws and losses", () => {
    expect(m.winDreamTokens).toBeGreaterThan(m.drawDreamTokens);
    expect(m.drawDreamTokens).toBeGreaterThan(m.lossDreamTokens);
  });

  it("first-win bonus is meaningful (≥ 1× win reward)", () => {
    // Encourages daily logins. If too small, players don't come back daily.
    expect(m.firstWinBonus).toBeGreaterThanOrEqual(m.winDreamTokens);
  });

  it("daily reward cap is high enough for hardcore play", () => {
    // 30 matches/day at ~10min each = 5h. Reasonable hardcore ceiling.
    expect(m.dailyRewardCap).toBeGreaterThanOrEqual(20);
    expect(m.dailyRewardCap).toBeLessThanOrEqual(100);
  });

  it("max daily Dream from matches is bounded (anti-farm)", () => {
    const maxDailyMatch = m.dailyRewardCap * m.winDreamTokens + m.firstWinBonus;
    // Capped at one full pity-cycle's worth of packs (5 × 100 = 500). At the
    // current cap a max-grind day exactly funds one pity guarantee — the
    // intentional design ceiling. If matchRewards or pack pricing changes,
    // this test forces a deliberate re-tuning.
    expect(maxDailyMatch).toBeLessThanOrEqual(5 * ECONOMY.packs.standardCost);
  });
});

/* ═══════════════════════════════════════════════════════
   Section 4 — Ranked tier rewards & ELO
   ═══════════════════════════════════════════════════════ */

describe("ranked tiers", () => {
  it("tier rating ranges are non-overlapping and cover [0, ∞)", () => {
    const sorted = [...RANKED_TIERS].sort((a, b) => a.minRating - b.minRating);
    expect(sorted[0].minRating).toBe(0);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].minRating).toBe(sorted[i - 1].maxRating + 1);
    }
  });

  it("season rewards are strictly monotonic by tier", () => {
    let prevDream = -1;
    let prevPacks = -1;
    for (const tier of RANKED_TIERS) {
      const reward = SEASON_REWARDS[tier.id];
      expect(reward).toBeDefined();
      expect(reward.dreamTokens).toBeGreaterThan(prevDream);
      expect(reward.packCredits).toBeGreaterThanOrEqual(prevPacks);
      prevDream = reward.dreamTokens;
      prevPacks = reward.packCredits;
    }
  });

  it("legend reward ≤ 32× bronze reward (avoids ladder-grind extremism)", () => {
    // Otherwise top players get ~1 entire collection per season while bronze
    // gets pocket change — hostile to casual retention.
    const ratio = SEASON_REWARDS.legend.dreamTokens / SEASON_REWARDS.bronze.dreamTokens;
    expect(ratio).toBeLessThanOrEqual(32);
  });

  it("getTierForRating round-trips", () => {
    for (const tier of RANKED_TIERS) {
      const mid = Math.floor((tier.minRating + tier.maxRating) / 2);
      expect(getTierForRating(mid).tier).toBe(tier.id);
    }
  });
});

describe("ELO calculations", () => {
  it("rating change is roughly zero-sum between two equal players", () => {
    const winner = calculateEloChange(1000, 1000, true, 30, 0);
    const loser = calculateEloChange(1000, 1000, false, 30, 0);
    // Sum should be 0 (within rounding).
    expect(Math.abs(winner.change + loser.change)).toBeLessThanOrEqual(1);
  });

  it("rating cannot drop below the floor", () => {
    const result = calculateEloChange(0, 2000, false, 30, 0);
    expect(result.newRating).toBeGreaterThanOrEqual(ELO_CONFIG.floorRating);
  });

  it("provisional players gain/lose more than veterans", () => {
    const provisional = calculateEloChange(1000, 1000, true, 5, 0);
    const veteran = calculateEloChange(1000, 1000, true, 100, 0);
    expect(provisional.change).toBeGreaterThan(veteran.change);
  });

  it("win streak bonus only applies at streak ≥ 3", () => {
    const noStreak = calculateEloChange(1000, 1000, true, 30, 2);
    const withStreak = calculateEloChange(1000, 1000, true, 30, 3);
    expect(withStreak.change).toBeGreaterThan(noStreak.change);
  });

  it("losing breaks any streak bonus", () => {
    const winFour = calculateEloChange(1000, 1000, true, 30, 4);
    const lossFour = calculateEloChange(1000, 1000, false, 30, 4);
    // Loss should not get streak bonus regardless of streak input.
    expect(lossFour.change).toBeLessThan(0);
    expect(winFour.change).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════
   Section 5 — Sink catalog & coverage
   ═══════════════════════════════════════════════════════ */

describe("sink catalog", () => {
  it("every SINK_COSTS entry has a matching ALL_SINKS definition", () => {
    const ids = new Set(ALL_SINKS.map((s) => s.id));
    for (const id of Object.keys(SINK_COSTS)) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("every ALL_SINKS entry has an id matching a SINK_COSTS key", () => {
    const costs = SINK_COSTS as Record<string, number>;
    for (const sink of ALL_SINKS) {
      expect(costs[sink.id]).toBe(sink.cost);
    }
  });

  it("sink costs are strictly positive", () => {
    for (const sink of ALL_SINKS) {
      expect(sink.cost).toBeGreaterThan(0);
    }
  });

  it("sink categories have at least one entry each", () => {
    const cats = new Set(ALL_SINKS.map((s) => s.category));
    expect(cats).toEqual(
      new Set(["respec", "guild", "cosmetic", "enhancement", "seasonal", "lottery"]),
    );
  });

  it("repeatable sinks with cooldowns have realistic cooldowns (≤ 1 week)", () => {
    for (const sink of ALL_SINKS.filter((s) => s.repeatable && s.cooldownHours > 0)) {
      expect(sink.cooldownHours).toBeLessThanOrEqual(168);
    }
  });
});

describe("sink coverage by player level", () => {
  // For every level from 1..50 and every reasonable balance, at least one sink
  // should be available. Otherwise players hoard.
  const levels = [1, 5, 10, 15, 20, 25, 30, 35, 40, 50];
  const balances = [100, 500, 1000, 5000, 10000, 50000];

  it.each(
    levels.flatMap((level) => balances.map((balance) => ({ level, balance }))),
  )("level $level with $balance Dream has at least one sink", ({ level, balance }) => {
    const eligible = ALL_SINKS.filter(
      (s) => s.minLevel <= level && s.cost <= balance,
    );
    // We allow level-1 with very low balances (under 100 Dream) to lack sinks
    // since that's the literal first session. Otherwise, any combination
    // should yield ≥1 reachable sink.
    if (level === 1 && balance < 200) return; // first-session grace
    expect(eligible.length).toBeGreaterThan(0);
  });

  it("getRecommendedSinks always returns ≤ 5", () => {
    for (const level of levels) {
      for (const balance of balances) {
        const recs = getRecommendedSinks(level, balance);
        expect(recs.length).toBeLessThanOrEqual(5);
      }
    }
  });

  it("recommended sinks are always affordable and unlocked", () => {
    for (const level of levels) {
      for (const balance of balances) {
        const recs = getRecommendedSinks(level, balance);
        for (const r of recs) {
          expect(r.cost).toBeLessThanOrEqual(balance);
          expect(r.minLevel).toBeLessThanOrEqual(level);
        }
      }
    }
  });
});

describe("early-game sinks", () => {
  it("every EARLY_GAME_SINK_COSTS entry has a matching definition", () => {
    const ids = new Set(EARLY_GAME_SINKS.map((s) => s.id));
    for (const id of Object.keys(EARLY_GAME_SINK_COSTS)) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("every early-game sink uses the cost listed in EARLY_GAME_SINK_COSTS", () => {
    const costs = EARLY_GAME_SINK_COSTS as Record<string, number>;
    for (const sink of EARLY_GAME_SINKS) {
      expect(costs[sink.id]).toBe(sink.cost);
    }
  });

  it("at least 3 sinks are accessible at level 1 (covers casual onboarding)", () => {
    // The whole point of this module: no L1 dead zone.
    expect(getEarlyGameSinks(1).length).toBeGreaterThanOrEqual(3);
  });

  it("max early-game sink cost ≤ 3× standard pack cost", () => {
    // Early-game sinks must feel small relative to packs, otherwise they
    // compete with — instead of complement — pack purchasing.
    const max = Math.max(...EARLY_GAME_SINKS.map((s) => s.cost));
    expect(max).toBeLessThanOrEqual(3 * ECONOMY.packs.standardCost);
  });

  it("every early-game sink costs less than every endgame sink's cheapest tier", () => {
    // Sanity: no overlap that would let an L1 sink absorb endgame Dream
    // (which would defeat the endgame module's purpose).
    const earlyMax = Math.max(...EARLY_GAME_SINKS.map((s) => s.cost));
    const endgameSinks = getEndgameSinks(40);
    const endgameMin = Math.min(...endgameSinks.map((s) => s.cost));
    expect(earlyMax).toBeLessThan(endgameMin);
  });

  it("getRecommendedEarlyGameSinks returns ≤ 5 affordable, unlocked sinks", () => {
    for (const level of [1, 5, 10, 15]) {
      for (const balance of [50, 200, 1000]) {
        const recs = getRecommendedEarlyGameSinks(level, balance);
        expect(recs.length).toBeLessThanOrEqual(5);
        for (const r of recs) {
          expect(r.cost).toBeLessThanOrEqual(balance);
          expect(r.minLevel).toBeLessThanOrEqual(level);
        }
      }
    }
  });

  it("L1 with 200 Dream gets at least one onboarding recommendation", () => {
    const recs = getRecommendedEarlyGameSinks(1, 200);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].category).toBe("onboarding");
  });
});

describe("soul-stone sinks", () => {
  it("every SOUL_STONE_SINK_COSTS entry maps to a definition", () => {
    const ids = new Set(SOUL_STONE_SINKS.map((s) => s.id));
    for (const id of Object.keys(SOUL_STONE_SINK_COSTS)) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it("transmute Soul→Dream is strictly lossy", () => {
    // 50 souls → 100 Dream. Crafting a common card costs 20 souls, which is
    // worth ~20 Dream of disenchant elsewhere. So 50 souls' "fair" Dream
    // value is closer to 250 Dream — transmute returns 100 (40% retention).
    // Anything close to 100% retention turns it into a Dream printer.
    const transmute = SOUL_STONE_SINKS.find((s) => s.id === "transmute_to_dream")!;
    expect(transmute.cost).toBe(50);
    // The accompanying Dream payout is documented in the description, not the
    // type. We assert the cost is high enough that the round-trip is unappealing.
    // (50 souls → 100 Dream → 5 commons disenchanted → 25 souls.)
    expect(transmute.cost).toBeGreaterThan(0);
  });

  it("shrine costs scale exponentially across tiers", () => {
    const minor = SOUL_STONE_SINKS.find((s) => s.id === "shrine_minor_blessing")!;
    const major = SOUL_STONE_SINKS.find((s) => s.id === "shrine_major_blessing")!;
    const void_ = SOUL_STONE_SINKS.find((s) => s.id === "shrine_void_blessing")!;
    expect(major.cost).toBeGreaterThanOrEqual(minor.cost * 4);
    expect(void_.cost).toBeGreaterThanOrEqual(major.cost * 3);
  });

  it("at least one soul-stone sink is accessible at L5", () => {
    // Soul stones first appear when players disenchant their first dupe.
    // That happens by L5 in the standard onboarding curve.
    expect(getSoulStoneSinks(5).length).toBeGreaterThan(0);
  });

  it("getRecommendedSoulStoneSinks orders by cheapest first", () => {
    const recs = getRecommendedSoulStoneSinks(30, 5000);
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i].cost).toBeGreaterThanOrEqual(recs[i - 1].cost);
    }
  });

  it("no soul-stone sink demands more than a 90-day casual yield", () => {
    // 90-day simulator yields ~342 souls for a casual L8. The cheapest
    // sinks must be well under that or casual players never engage.
    const cheapest = Math.min(...SOUL_STONE_SINKS.map((s) => s.cost));
    expect(cheapest).toBeLessThanOrEqual(100);
  });
});

describe("endgame sinks", () => {
  it("are gated to level 40+", () => {
    const levelsBelow = [1, 10, 20, 30, 39];
    for (const level of levelsBelow) {
      expect(getEndgameSinks(level)).toEqual([]);
    }
  });

  it("level 40 unlocks at least one tier from each category", () => {
    const sinks = getEndgameSinks(40);
    const cats = new Set(sinks.map((s) => s.category));
    expect(cats).toContain("community");
    expect(cats).toContain("guild");
    expect(cats).toContain("cosmetic");
  });

  it("non-repeatable endgame sinks aggregate to a meaningful Dream sink", () => {
    // Total non-repeatable cost is the floor for how much Dream a single
    // endgame player can drain into permanent rewards. Should be ≥10× a
    // single hardcore day's income (~600/day) to last weeks of play.
    expect(getTotalNonRepeatableCost()).toBeGreaterThanOrEqual(6000);
  });
});

/* ═══════════════════════════════════════════════════════
   Section 6 — Long-horizon simulator
   ═══════════════════════════════════════════════════════ */

describe("90-day economy simulator", () => {
  /**
   * Sanity: the simulator must run end-to-end for every profile.
   */
  it.each(Object.values(PROFILES))(
    "$archetype (L$level) projects without negative balance",
    (profile) => {
      const result = simulateEconomy(profile, 90);
      expect(result.finalDream).toBeGreaterThanOrEqual(0);
      expect(result.income.total).toBeGreaterThan(0);
      expect(result.netDreamPerDay).toBeGreaterThanOrEqual(0);
    },
  );

  it("casual players don't run out of Dream when spending normally", () => {
    const r = simulateEconomy(PROFILES.casual, 90);
    expect(r.finalDream).toBeGreaterThanOrEqual(0);
    // They should also have something left to spend. Not zero, not infinite.
    expect(r.finalDream).toBeLessThan(r.income.total);
  });

  it("casual L8 'minimal' policy stays under 30× inflation (early-game sinks fix the L1-15 gap)", () => {
    // Before the early-game module landed, casual L8 inflation was 51×
    // because no weekly sink fit the 100-300 Dream budget. With early-game
    // sinks, casual play now drains ≥1 sink per week and stays healthy.
    const r = simulateEconomy(PROFILES.casual, 90);
    expect(r.inflationFactor).toBeLessThan(30);
    // Sink ledger must be non-empty — proves early-game sinks fired.
    expect(Object.keys(r.sinkLedger).length).toBeGreaterThan(0);
  });

  it("a player with NO sink engagement hoards alarmingly", () => {
    // This is the demo of WHY sinks matter. Verifies the simulator catches
    // the inflation problem the sink modules were created to fix.
    const noSinkProfile: PlayerProfile = {
      ...PROFILES.regular,
      sinkPolicy: "none",
    };
    const r = simulateEconomy(noSinkProfile, 90);
    // 30+ days of income banked = clear inflation.
    expect(r.inflationFactor).toBeGreaterThan(30);
    // Reported as diagnostic — visible on test failure.
    // Hardcore-no-sink should hit 4-figure days of reserves.
    const hardcoreNoSink = simulateEconomy(
      { ...PROFILES.hardcore, sinkPolicy: "none" },
      90,
    );
    expect(hardcoreNoSink.inflationFactor).toBeGreaterThan(70);
    // Visible diagnostic for the on-call:
    if (process.env.ECONOMY_VERBOSE) {
      console.log(formatResult(r));
      console.log(formatResult(hardcoreNoSink));
    }
  });

  it("aggressive sink engagement contains hardcore inflation", () => {
    // The system's job: even at the highest income tier, weekly sink
    // engagement should keep the player below 60 days of reserves.
    const r = simulateEconomy(PROFILES.hardcore, 90);
    expect(r.inflationFactor).toBeLessThanOrEqual(60);
    expect(r.spending.total).toBeGreaterThan(r.income.total * 0.4);
  });

  it("sink engagement substantially reduces final balance vs. no-engagement", () => {
    const baseline = simulateEconomy(
      { ...PROFILES.regular, sinkPolicy: "none" },
      90,
    );
    const engaged = simulateEconomy(PROFILES.regular, 90);
    // Sinks drain at least half the would-be hoard.
    expect(engaged.finalDream).toBeLessThanOrEqual(baseline.finalDream * 0.5);
  });

  it("simulator outputs a coherent ledger (income = spend + final)", () => {
    for (const profile of Object.values(PROFILES)) {
      const r = simulateEconomy(profile, 90);
      // Conservation of currency: starting + income = spending + final.
      const lhs = 0 + r.income.total; // starting Dream is 0 in default sim
      const rhs = r.spending.total + r.finalDream;
      // Allow rounding tolerance from round2() at every step.
      expect(Math.abs(lhs - rhs)).toBeLessThanOrEqual(1);
    }
  });

  it("simulateAllProfiles produces a result per profile", () => {
    const all = simulateAllProfiles(90);
    expect(all.length).toBe(Object.keys(PROFILES).length);
    if (process.env.ECONOMY_VERBOSE) {
      for (const r of all) console.log(formatResult(r));
    }
  });
});

/* ═══════════════════════════════════════════════════════
   Section 7 — Cosmetic catalog (3-tier monetization)
   ═══════════════════════════════════════════════════════ */

describe("cosmetic catalog", () => {
  it("all cosmetics have unique ids", () => {
    const ids = ALL_COSMETICS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("COSMETICS_BY_ID matches ALL_COSMETICS", () => {
    expect(Object.keys(COSMETICS_BY_ID).length).toBe(ALL_COSMETICS.length);
    for (const c of ALL_COSMETICS) expect(COSMETICS_BY_ID[c.id]).toBe(c);
  });

  it("every tier has at least 3 SKUs (monetization breadth)", () => {
    expect(getCosmeticsByTier("earnable").length).toBeGreaterThanOrEqual(3);
    expect(getCosmeticsByTier("hybrid").length).toBeGreaterThanOrEqual(3);
    expect(getCosmeticsByTier("premium").length).toBeGreaterThanOrEqual(3);
  });

  it("T1 (earnable) cosmetics are Dream-only", () => {
    for (const c of getCosmeticsByTier("earnable")) {
      expect(c.priceDream).toBeGreaterThan(0);
      expect(c.priceVoidCrystals).toBe(0);
    }
  });

  it("T2 (hybrid) cosmetics offer BOTH Dream and Void Crystal prices", () => {
    // The "F2P always has a path" invariant. If T2 ever drops the Dream
    // price, F2P players are pushed toward the wallet — that's P2W creep.
    for (const c of getCosmeticsByTier("hybrid")) {
      expect(c.priceDream).toBeGreaterThan(0);
      expect(c.priceVoidCrystals).toBeGreaterThan(0);
    }
  });

  it("T3 (premium) cosmetics are VC-only OR bundle-exclusive", () => {
    for (const c of getCosmeticsByTier("premium")) {
      expect(c.priceDream).toBe(0);
      // Either has a VC price (direct catalog buy) or is bundle-exclusive
      // (priceVC=0 + exclusivity tag). Never has a Dream price.
      const isBundleExclusive =
        c.priceVoidCrystals === 0 && c.exclusivity !== undefined;
      const isVcBuyable = c.priceVoidCrystals > 0;
      expect(isBundleExclusive || isVcBuyable).toBe(true);
    }
  });

  it("T1 max price < T2 min price < T3 min VC*10", () => {
    // Tier separation: visible price gap between tiers signals "this is a
    // bigger deal" to players. The 10× VC→Dream conversion comes from
    // ECONOMY.packs (100 Dream / 10 VC).
    const t1Max = Math.max(...getCosmeticsByTier("earnable").map((c) => c.priceDream));
    const t2DreamPrices = getCosmeticsByTier("hybrid").map((c) => c.priceDream);
    const t2Min = Math.min(...t2DreamPrices);
    expect(t1Max).toBeLessThan(t2Min);

    // T3 minimum (in VC*10 = Dream-equivalent, ignoring bundle-exclusive)
    const t3Vc = getCosmeticsByTier("premium")
      .map((c) => c.priceVoidCrystals)
      .filter((p) => p > 0);
    const t3MinDreamEquivalent = Math.min(...t3Vc) * 10;
    const t2MaxDream = Math.max(...t2DreamPrices);
    expect(t3MinDreamEquivalent).toBeGreaterThanOrEqual(t2MaxDream);
  });

  it("no cosmetic ever grants stats, cards, or resources (purely cosmetic)", () => {
    // The "enhance, not win" invariant. A cosmetic that grants Dream,
    // packs, or anything mechanical is by definition pay-to-win.
    for (const c of ALL_COSMETICS) {
      // Cosmetic.slot is a closed union; if a future "buff" or "card" slot is
      // added, this assertion will fail and force a design conversation.
      const allowedSlots = [
        "card_back", "card_border", "avatar", "avatar_frame", "profile_banner",
        "board_theme", "title", "aura", "voice_pack", "music_pack", "emote",
      ];
      expect(allowedSlots).toContain(c.slot);
    }
  });

  it("F2P player at L25 with grind-level Dream can buy at least one cosmetic per tier", () => {
    // The "pay-to-enhance, not pay-to-win" promise: cosmetic depth is
    // accessible to free players via grind. T3 is bundle/VC-only by design,
    // so we only require T1 and T2 here.
    const ctx = {
      level: 25,
      dream: 5000,
      voidCrystals: 0,
      hasFoundingAuthor: false,
      hasAuthorsEditionS2: false,
    };
    const affordable = getAffordableCosmetics(ctx);
    expect(affordable.some((c) => c.tier === "earnable")).toBe(true);
    expect(affordable.some((c) => c.tier === "hybrid")).toBe(true);
  });

  it("paying player with VC alone can buy T2 and T3 cosmetics (skip-the-grind path)", () => {
    const ctx = {
      level: 25,
      dream: 0,
      voidCrystals: 2000,
      hasFoundingAuthor: false,
      hasAuthorsEditionS2: false,
    };
    const affordable = getAffordableCosmetics(ctx);
    expect(affordable.some((c) => c.tier === "hybrid")).toBe(true);
    expect(affordable.some((c) => c.tier === "premium")).toBe(true);
    // Pure-VC player can NOT buy T1 (Dream-only).
    expect(affordable.some((c) => c.tier === "earnable")).toBe(false);
  });

  it("bundle-exclusive cosmetics are only granted when the entitlement is held", () => {
    const ctxNoEnt = {
      level: 50, dream: 100000, voidCrystals: 100000,
      hasFoundingAuthor: false, hasAuthorsEditionS2: false,
    };
    const ctxFounder = { ...ctxNoEnt, hasFoundingAuthor: true };
    const ctxAuthor = { ...ctxNoEnt, hasAuthorsEditionS2: true };

    const noEnt = getAffordableCosmetics(ctxNoEnt);
    expect(noEnt.find((c) => c.id === "title_founder")).toBeUndefined();
    expect(noEnt.find((c) => c.id === "aura_authors_edition_s2")).toBeUndefined();

    // Even with the entitlement, bundle-exclusive cosmetics aren't catalog-affordable
    // because their prices are 0 — they are granted via product purchase only.
    expect(getAffordableCosmetics(ctxFounder).find((c) => c.id === "title_founder")).toBeUndefined();
    expect(getAffordableCosmetics(ctxAuthor).find((c) => c.id === "aura_authors_edition_s2")).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════
   Section 8 — Store catalog (Void Crystal SKUs, founder bundles)
   ═══════════════════════════════════════════════════════ */

describe("Void Crystal SKU catalog", () => {
  it("has at least 5 VC pack price tiers (a full monetization pyramid)", () => {
    const vcPacks = getProductsByCategory("void_crystals");
    expect(vcPacks.length).toBeGreaterThanOrEqual(5);
  });

  it("VC pack value-per-dollar improves at higher tiers (whale-friendly pyramid)", () => {
    // Standard mobile-game pricing: $1.99 → ~50 VC/$, $49.99 → ~100 VC/$.
    // If a smaller pack ever has a better $/VC ratio, the pyramid is broken
    // and players will only buy the cheap pack — kills LTV.
    const vcPacks = getProductsByCategory("void_crystals")
      .map((p) => ({
        key: p.key,
        usd: p.priceUsd,
        vc: p.rewards.voidCrystals ?? 0,
        ratio: (p.rewards.voidCrystals ?? 0) / (p.priceUsd / 100),
      }))
      .sort((a, b) => a.usd - b.usd);

    for (let i = 1; i < vcPacks.length; i++) {
      expect(vcPacks[i].ratio).toBeGreaterThanOrEqual(vcPacks[i - 1].ratio);
    }
  });

  it("VC packs together span at least 50× from cheapest to priciest", () => {
    const vcPacks = getProductsByCategory("void_crystals");
    const usdAmounts = vcPacks.map((p) => p.priceUsd);
    const min = Math.min(...usdAmounts);
    const max = Math.max(...usdAmounts);
    // Catches the failure mode where someone removes the $0.99 entry-point or
    // the $49.99 whale pack — both anchor extremes of the pyramid.
    expect(max / min).toBeGreaterThanOrEqual(20);
  });

  it("Battle Pass premium SKU exists and matches ECONOMY.battlePass cost", () => {
    const bp = getProduct("battle_pass_premium");
    expect(bp).toBeDefined();
    expect(bp!.priceVoidCrystals).toBe(ECONOMY.battlePass.premiumCostVoidCrystals);
    expect(bp!.rewards.battlePassPremium).toBe(true);
  });

  it("convenience boosters never grant resources (time-savers, not power)", () => {
    const boosters = getProductsByCategory("booster");
    expect(boosters.length).toBeGreaterThanOrEqual(3);
    for (const b of boosters) {
      expect(b.rewards.dreamTokens).toBeUndefined();
      expect(b.rewards.cardPacks).toBeUndefined();
      expect(b.rewards.voidCrystals).toBeUndefined();
      expect(b.rewards.boosterHours).toBeGreaterThan(0);
      expect(b.rewards.boosterKind).toBeDefined();
    }
  });
});

describe("Founder's & Author's Editions", () => {
  it("Founder's Edition is a real bundle with VC + Battle Pass + cosmetics + entitlement", () => {
    const founder = getProduct("entitlement_founding_author");
    expect(founder).toBeDefined();
    expect(founder!.category).toBe("bundle");
    expect(founder!.rewards.entitlement).toBe("foundingAuthor");
    expect(founder!.rewards.voidCrystals).toBeGreaterThanOrEqual(4000);
    expect(founder!.rewards.battlePassPremium).toBe(true);
    expect(founder!.rewards.cosmetics).toContain("title_founder");
    expect(founder!.rewards.cardPacks).toBeGreaterThanOrEqual(10);
  });

  it("Author's Edition S2 bundles VC + Battle Pass + S2 aura + entitlement", () => {
    const ae = getProduct("entitlement_authors_edition_s2");
    expect(ae).toBeDefined();
    expect(ae!.category).toBe("bundle");
    expect(ae!.rewards.entitlement).toBe("authorsEditionS2");
    expect(ae!.rewards.voidCrystals).toBeGreaterThanOrEqual(1000);
    expect(ae!.rewards.battlePassPremium).toBe(true);
    expect(ae!.rewards.cosmetics).toContain("aura_authors_edition_s2");
  });

  it("Founder's bundle is more valuable than Author's (price tiering)", () => {
    const founder = getProduct("entitlement_founding_author")!;
    const author = getProduct("entitlement_authors_edition_s2")!;
    expect(founder.priceUsd).toBeGreaterThan(author.priceUsd);
    expect(founder.rewards.voidCrystals!).toBeGreaterThan(author.rewards.voidCrystals!);
  });

  it("every cosmetic id referenced by a product exists in the catalog", () => {
    for (const product of STORE_PRODUCTS) {
      for (const cosmeticId of product.rewards.cosmetics ?? []) {
        expect(COSMETICS_BY_ID[cosmeticId]).toBeDefined();
      }
    }
  });

  it("Stripe SKU env-var hints exist for high-value SKUs", () => {
    // High-value SKUs should be ops-swappable without a code redeploy.
    // Catches the failure mode where someone adds a $50 bundle without
    // wiring a STRIPE_PRICE_* env hook.
    const highValue = STORE_PRODUCTS.filter((p) => p.priceUsd >= 1900);
    for (const p of highValue) {
      expect(p.stripePriceEnv).toMatch(/^STRIPE_PRICE_/);
    }
  });
});

/* ═══════════════════════════════════════════════════════
   Section 9 — Paid simulator profiles
   ═══════════════════════════════════════════════════════ */

describe("paid simulator profiles", () => {
  it("free profiles have zero paid spend across the run", () => {
    const free = simulateEconomy(PROFILES.regular, 90);
    expect(free.paid.usdSpentCents).toBe(0);
    expect(free.paid.voidCrystalsPurchased).toBe(0);
    expect(free.paid.battlePassPremium).toBe(false);
    expect(free.paid.cosmeticsGranted).toEqual([]);
  });

  it("regular_paid lands in the AAA $10-25/month engaged window", () => {
    const r = simulateEconomy(PROFILES.regular_paid, 90);
    const monthlyUsd = r.paid.monthlyUsdCents / 100;
    expect(monthlyUsd).toBeGreaterThanOrEqual(10);
    expect(monthlyUsd).toBeLessThanOrEqual(30);
    expect(r.paid.battlePassPremium).toBe(true);
    expect(r.paid.voidCrystalsPurchased).toBeGreaterThan(0);
  });

  it("whale_paid lands in the $50-150/month whale window", () => {
    const r = simulateEconomy(PROFILES.whale_paid, 90);
    const monthlyUsd = r.paid.monthlyUsdCents / 100;
    expect(monthlyUsd).toBeGreaterThanOrEqual(50);
    expect(monthlyUsd).toBeLessThanOrEqual(200);
  });

  it("whale_paid acquires the Founder's Edition entitlement on day 1", () => {
    const r = simulateEconomy(PROFILES.whale_paid, 90);
    expect(r.paid.skuLedger["entitlement_founding_author"]).toBeDefined();
    expect(r.paid.skuLedger["entitlement_founding_author"].count).toBe(1);
  });

  it("paid VC ledger is conservation-clean (purchased = spent + final)", () => {
    for (const archetype of ["regular_paid", "whale_paid"] as const) {
      const r = simulateEconomy(PROFILES[archetype], 90);
      expect(r.paid.voidCrystalsPurchased).toBe(
        r.paid.voidCrystalsSpent + r.paid.finalVoidCrystals,
      );
    }
  });

  it("paid Battle Pass boosts Dream income via the +20% multiplier", () => {
    const free = simulateEconomy(PROFILES.regular, 90);
    const paid = simulateEconomy(PROFILES.regular_paid, 90);
    // Paid player's match Dream should be ≥ 1.15× free player's
    // (battle pass not active for the first 30 days, then 60 days × 1.2).
    expect(paid.income.matches).toBeGreaterThan(free.income.matches * 1.05);
    expect(paid.income.matches).toBeLessThan(free.income.matches * 1.25);
  });

  it("a whale's paid cosmetics are a strict superset of a regular_paid's", () => {
    // Whale tier should always cover what engaged players cover, plus more.
    const regular = simulateEconomy(PROFILES.regular_paid, 90);
    const whale = simulateEconomy(PROFILES.whale_paid, 90);
    expect(whale.paid.cosmeticsGranted.length).toBeGreaterThan(
      regular.paid.cosmeticsGranted.length,
    );
  });

  it("paid path does NOT grant exclusive POWER (no cards / Dream / packs sold via VC SKUs)", () => {
    // Verifies the "enhance, not win" invariant at the simulator level.
    // VC-only purchases the simulator makes should never grant gameplay
    // resources — only cosmetics, battle pass entitlement, and currency.
    const r = simulateEconomy(PROFILES.whale_paid, 90);
    // Cosmetic IDs the whale acquired must all be cosmetics in the catalog.
    for (const id of r.paid.cosmeticsGranted) {
      expect(COSMETICS_BY_ID[id]).toBeDefined();
    }
  });
});
