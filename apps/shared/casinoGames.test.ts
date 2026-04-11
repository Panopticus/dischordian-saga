/* ═══════════════════════════════════════════════════════
   Tests for the server-authoritative casino game engine.
   Uses seeded RNG so all assertions are deterministic.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  createRng, playVoidSlots, playEntropyDice, playNebulaPoker,
  playQuantumRoulette, playPazaak21, playHighLow, playScratchCard,
  playLiarsDice, playDreamRoulette, playCardBattlersGauntlet,
  playFactionWarBet, playVoidBingo, playVoidCase,
  evaluatePokerHand,
  rollCraps, spinWheel, vipLevelFor, vipWinBonus, validateBet,
  MAX_DAILY_WAGER, GAME_LIMITS,
  splitJackpotPool, JACKPOT_SEED_FRACTION, JACKPOT_MIN_SEED,
  rewardsForAchievement, getCasinoCosmetic,
  CASINO_ACHIEVEMENT_REWARDS, CASINO_COSMETIC_CATALOG,
} from "./casinoGames";

describe("createRng", () => {
  it("is deterministic for identical seeds", () => {
    const a = createRng("seed-1");
    const b = createRng("seed-1");
    expect(a()).toBe(b());
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it("produces different sequences for different seeds", () => {
    const a = createRng("seed-1");
    const b = createRng("seed-2");
    expect(a()).not.toBe(b());
  });

  it("returns values in [0, 1)", () => {
    const rng = createRng("test");
    for (let i = 0; i < 1000; i++) {
      const n = rng();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });
});

describe("validateBet", () => {
  it("rejects unknown games", () => {
    expect(validateBet("not_a_game", 10).ok).toBe(false);
  });
  it("rejects bets below the minimum", () => {
    const r = validateBet("void_slots", 1);
    expect(r.ok).toBe(false);
  });
  it("rejects bets above the maximum", () => {
    const r = validateBet("void_slots", 10_000);
    expect(r.ok).toBe(false);
  });
  it("accepts bets within range", () => {
    expect(validateBet("void_slots", 50).ok).toBe(true);
  });
  it("accepts zero-bet free games", () => {
    expect(validateBet("void_bingo", 0).ok).toBe(true);
    expect(validateBet("dischordian_mahjong", 0).ok).toBe(true);
  });
});

describe("playVoidSlots", () => {
  it("produces 3 reels", () => {
    const rng = createRng("slots");
    const r = playVoidSlots(10, rng);
    const reels = (r.detail as { reels: string[] }).reels;
    expect(reels).toHaveLength(3);
  });

  it("has the correct payout when all symbols match 'degen' (jackpot)", () => {
    // Find a seed that produces all-degen by scanning
    let seed = 0;
    let found = false;
    while (!found && seed < 100_000) {
      const r = playVoidSlots(10, createRng(`seed-${seed}`));
      if (r.jackpot) { found = true; break; }
      seed++;
    }
    expect(found).toBe(true);
  });

  it("returns non-negative payout", () => {
    for (let i = 0; i < 100; i++) {
      const r = playVoidSlots(10, createRng(`slot-${i}`));
      expect(r.payout).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("playEntropyDice", () => {
  it("wins on an accurate prediction", () => {
    // Find a seed that rolls 7
    for (let i = 0; i < 1000; i++) {
      const rng = createRng(`dice-${i}`);
      const r = playEntropyDice(10, "exact", rng);
      const total = (r.detail as { total: number }).total;
      if (total === 7) {
        expect(r.won).toBe(true);
        expect(r.payout).toBe(50);
        return;
      }
    }
    throw new Error("Expected to roll a 7 at least once in 1000 attempts.");
  });

  it("loses on a missed prediction", () => {
    for (let i = 0; i < 1000; i++) {
      const rng = createRng(`dice-${i}`);
      const r = playEntropyDice(10, "exact", rng);
      const total = (r.detail as { total: number }).total;
      if (total !== 7) {
        expect(r.won).toBe(false);
        expect(r.payout).toBe(0);
        return;
      }
    }
  });
});

describe("evaluatePokerHand", () => {
  it("detects a royal flush", () => {
    expect(
      evaluatePokerHand([
        { rank: 10, suit: "spades" },
        { rank: 11, suit: "spades" },
        { rank: 12, suit: "spades" },
        { rank: 13, suit: "spades" },
        { rank: 14, suit: "spades" },
      ]),
    ).toBe("royal_flush");
  });

  it("detects a flush", () => {
    expect(
      evaluatePokerHand([
        { rank: 2, suit: "hearts" },
        { rank: 5, suit: "hearts" },
        { rank: 9, suit: "hearts" },
        { rank: 11, suit: "hearts" },
        { rank: 13, suit: "hearts" },
      ]),
    ).toBe("flush");
  });

  it("detects a full house", () => {
    expect(
      evaluatePokerHand([
        { rank: 5, suit: "hearts" },
        { rank: 5, suit: "spades" },
        { rank: 5, suit: "clubs" },
        { rank: 9, suit: "hearts" },
        { rank: 9, suit: "diamonds" },
      ]),
    ).toBe("full_house");
  });

  it("detects a pair", () => {
    expect(
      evaluatePokerHand([
        { rank: 2, suit: "hearts" },
        { rank: 2, suit: "spades" },
        { rank: 5, suit: "clubs" },
        { rank: 9, suit: "hearts" },
        { rank: 13, suit: "diamonds" },
      ]),
    ).toBe("pair");
  });

  it("detects a straight", () => {
    expect(
      evaluatePokerHand([
        { rank: 5, suit: "hearts" },
        { rank: 6, suit: "spades" },
        { rank: 7, suit: "clubs" },
        { rank: 8, suit: "hearts" },
        { rank: 9, suit: "diamonds" },
      ]),
    ).toBe("straight");
  });
});

describe("playNebulaPoker", () => {
  it("returns a 5-card hand", () => {
    const rng = createRng("poker");
    const r = playNebulaPoker(25, [], rng);
    const hand = (r.detail as { hand: unknown[] }).hand;
    expect(hand).toHaveLength(5);
  });

  it("replaces discarded cards", () => {
    const rng = createRng("poker2");
    const r = playNebulaPoker(25, [0, 1, 2], rng);
    const detail = r.detail as { initial: unknown[]; hand: unknown[] };
    // At least one position should differ from the initial deal
    const changed = detail.hand.some((c, i) => c !== detail.initial[i]);
    expect(changed).toBe(true);
  });
});

describe("playQuantumRoulette", () => {
  it("returns a valid landed faction", () => {
    const r = playQuantumRoulette(25, "straight", ["architect"], createRng("rlt"));
    const landed = (r.detail as { landed: string }).landed;
    expect([
      "architect", "insurgency", "new_babylon",
      "thought_virus", "antiquarian", "hierarchy",
    ]).toContain(landed);
  });
});

describe("playPazaak21", () => {
  it("never produces a negative payout", () => {
    for (let i = 0; i < 50; i++) {
      const r = playPazaak21(25, 18, createRng(`pazaak-${i}`));
      expect(r.payout).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("playHighLow", () => {
  it("breaks chain on wrong guess", () => {
    const r = playHighLow(10, ["high", "high", "high"], createRng("hl"));
    const chain = (r.detail as { chain: number }).chain;
    expect(chain).toBeGreaterThanOrEqual(0);
    expect(chain).toBeLessThanOrEqual(10);
  });
});

describe("playScratchCard", () => {
  it("returns exactly 9 panels", () => {
    const r = playScratchCard(createRng("scratch"));
    expect((r.detail as { panels: unknown[] }).panels).toHaveLength(9);
  });

  it("scratches exactly 3 panels", () => {
    const r = playScratchCard(createRng("scratch2"));
    expect((r.detail as { scratched: unknown[] }).scratched).toHaveLength(3);
  });
});

describe("playLiarsDice", () => {
  it("returns 10 total dice", () => {
    const r = playLiarsDice(20, "trust", createRng("liars"));
    const d = r.detail as { playerDice: number[]; npcDice: number[] };
    expect(d.playerDice).toHaveLength(5);
    expect(d.npcDice).toHaveLength(5);
  });
});

describe("playDreamRoulette", () => {
  it("completes in 1-6 rounds", () => {
    for (let i = 0; i < 20; i++) {
      const r = playDreamRoulette(25, createRng(`dr-${i}`));
      const rounds = (r.detail as { rounds: number }).rounds;
      expect(rounds).toBeGreaterThanOrEqual(1);
      expect(rounds).toBeLessThanOrEqual(6);
    }
  });
});

describe("playCardBattlersGauntlet", () => {
  it("ends at 2 wins for either side", () => {
    for (let i = 0; i < 20; i++) {
      const r = playCardBattlersGauntlet(30, createRng(`gauntlet-${i}`));
      const d = r.detail as { playerWins: number; degenWins: number };
      expect(Math.max(d.playerWins, d.degenWins)).toBe(2);
    }
  });
});

describe("playFactionWarBet", () => {
  it("pays out at odds multiplier when won", () => {
    // Find a winning seed
    for (let i = 0; i < 1000; i++) {
      const r = playFactionWarBet(10, 2.5, createRng(`fwb-${i}`));
      if (r.won) {
        expect(r.payout).toBe(25);
        return;
      }
    }
    throw new Error("Expected at least one winning bet in 1000 attempts.");
  });
});

describe("playVoidBingo", () => {
  it("produces a 25-tile card", () => {
    const r = playVoidBingo(createRng("bingo"));
    expect((r.detail as { card: unknown[] }).card).toHaveLength(25);
  });
});

describe("playVoidCase", () => {
  it("triggers pity after 20 cases", () => {
    const r = playVoidCase(100, 20, createRng("vc"));
    expect(r.pityTriggered).toBe(true);
    expect(["rare", "epic", "legendary", "mythic"]).toContain(r.tier);
  });

  it("returns a defined tier", () => {
    const r = playVoidCase(100, 0, createRng("vc2"));
    expect(["common", "uncommon", "rare", "epic", "legendary", "mythic"]).toContain(r.tier);
  });
});

describe("rollCraps", () => {
  it("produces totals in [2, 12]", () => {
    for (let i = 0; i < 100; i++) {
      const r = rollCraps(createRng(`craps-${i}`));
      expect(r.total).toBeGreaterThanOrEqual(2);
      expect(r.total).toBeLessThanOrEqual(12);
    }
  });

  it("maps 7 to blessed", () => {
    for (let i = 0; i < 1000; i++) {
      const r = rollCraps(createRng(`craps-${i}`));
      if (r.total === 7) {
        expect(r.outcome).toBe("blessed");
        return;
      }
    }
  });

  it("maps 12 to miracle with bonuses", () => {
    for (let i = 0; i < 2000; i++) {
      const r = rollCraps(createRng(`miracle-${i}`));
      if (r.total === 12) {
        expect(r.outcome).toBe("miracle");
        expect(r.bonusFestiveTokens).toBeGreaterThan(0);
        expect(r.bonusGiftBoxes).toBeGreaterThan(0);
        return;
      }
    }
  });

  it("maps 2 to hierarchy_claims", () => {
    for (let i = 0; i < 2000; i++) {
      const r = rollCraps(createRng(`snake-${i}`));
      if (r.total === 2) {
        expect(r.outcome).toBe("hierarchy_claims");
        return;
      }
    }
  });
});

describe("spinWheel", () => {
  it("always returns a valid prize", () => {
    const prizes = [
      { id: "a", prizeType: "tokens", amount: 10, rarity: "common" as const, weight: 0.5 },
      { id: "b", prizeType: "tokens", amount: 50, rarity: "rare" as const, weight: 0.3 },
      { id: "c", prizeType: "jackpot", amount: 500, rarity: "legendary" as const, weight: 0.2 },
    ];
    for (let i = 0; i < 100; i++) {
      const winner = spinWheel(prizes, createRng(`wheel-${i}`));
      expect(prizes).toContain(winner);
    }
  });

  it("respects weight distribution over many trials", () => {
    const prizes = [
      { id: "common", prizeType: "tokens", amount: 1, rarity: "common" as const, weight: 0.9 },
      { id: "rare",   prizeType: "tokens", amount: 1, rarity: "rare"   as const, weight: 0.1 },
    ];
    let commonHits = 0;
    const trials = 10_000;
    for (let i = 0; i < trials; i++) {
      const w = spinWheel(prizes, createRng(`dist-${i}`));
      if (w.id === "common") commonHits++;
    }
    // Expect ~90% common within 5% tolerance
    const ratio = commonHits / trials;
    expect(ratio).toBeGreaterThan(0.85);
    expect(ratio).toBeLessThan(0.95);
  });
});

describe("VIP tiers", () => {
  it("promotes at threshold", () => {
    expect(vipLevelFor(0)).toBe(0);
    expect(vipLevelFor(499)).toBe(0);
    expect(vipLevelFor(500)).toBe(1);
    expect(vipLevelFor(2000)).toBe(2);
    expect(vipLevelFor(10_000)).toBe(3);
    expect(vipLevelFor(50_000)).toBe(4);
    expect(vipLevelFor(200_000)).toBe(5);
  });

  it("applies win bonus per tier", () => {
    expect(vipWinBonus(0)).toBe(1);
    expect(vipWinBonus(1)).toBeCloseTo(1.05);
    expect(vipWinBonus(5)).toBeCloseTo(1.25);
  });
});

describe("GAME_LIMITS coverage", () => {
  it("has limits for every playable game", () => {
    const games = [
      "void_slots", "entropy_dice", "nebula_poker", "quantum_roulette",
      "pazaak_21", "high_low", "scratch_cards",
      "void_blackjack_tournament", "liars_dice", "faction_war_betting",
      "dream_roulette", "card_battlers_gauntlet", "void_bingo",
      "void_cases", "dischordian_mahjong",
    ];
    for (const g of games) {
      expect(GAME_LIMITS[g]).toBeDefined();
    }
  });
});

describe("MAX_DAILY_WAGER constant", () => {
  it("is a positive integer", () => {
    expect(MAX_DAILY_WAGER).toBeGreaterThan(0);
    expect(Number.isInteger(MAX_DAILY_WAGER)).toBe(true);
  });
});

describe("CASINO_COSMETIC_CATALOG", () => {
  it("registers every reward id referenced by CASINO_ACHIEVEMENT_REWARDS", () => {
    for (const ids of Object.values(CASINO_ACHIEVEMENT_REWARDS)) {
      for (const id of ids) {
        expect(getCasinoCosmetic(id)).toBeDefined();
      }
    }
  });

  it("every catalog entry has a non-empty label and valid slot", () => {
    const validSlots = new Set(["title", "chip", "card_back", "table_felt", "companion", "loredex"]);
    for (const [id, meta] of Object.entries(CASINO_COSMETIC_CATALOG)) {
      expect(meta.id).toBe(id);
      expect(meta.label.length).toBeGreaterThan(0);
      expect(validSlots.has(meta.slot)).toBe(true);
    }
  });

  it("rewardsForAchievement returns an empty array for unknown ids", () => {
    expect(rewardsForAchievement("no_such_achievement")).toEqual([]);
  });

  it("rewardsForAchievement returns at least one id for degens_chosen", () => {
    expect(rewardsForAchievement("degens_chosen").length).toBeGreaterThan(0);
  });
});

describe("splitJackpotPool", () => {
  it("returns zeros for an empty pool", () => {
    expect(splitJackpotPool(0)).toEqual({ payout: 0, retained: 0 });
  });

  it("retains at least JACKPOT_MIN_SEED on small pools", () => {
    const { payout, retained } = splitJackpotPool(150);
    expect(retained).toBe(JACKPOT_MIN_SEED);
    expect(payout).toBe(50);
  });

  it("retains ~20% of large pools and pays out the rest", () => {
    const { payout, retained } = splitJackpotPool(10_000);
    expect(retained).toBe(2_000);
    expect(payout).toBe(8_000);
    expect(retained / 10_000).toBeCloseTo(JACKPOT_SEED_FRACTION, 5);
  });

  it("payout + retained always equals the original balance (non-negative case)", () => {
    for (const balance of [200, 500, 1234, 9_999, 100_000]) {
      const { payout, retained } = splitJackpotPool(balance);
      expect(payout + retained).toBe(balance);
      expect(payout).toBeGreaterThanOrEqual(0);
      expect(retained).toBeGreaterThanOrEqual(JACKPOT_MIN_SEED);
    }
  });
});
