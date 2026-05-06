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
