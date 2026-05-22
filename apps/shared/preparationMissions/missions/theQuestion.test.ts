import { describe, it, expect } from "vitest";
import {
  scoreTheQuestion,
  generateTheQuestionDeck,
  type WitnessCard,
  type WitnessRecord,
  type TheQuestionSubmission,
} from "./theQuestion";

/* ─── SCORING ─── */

const baseline = (over: Partial<TheQuestionSubmission> = {}): TheQuestionSubmission => ({
  verdictDelta: 0,
  turnsPlayed: 7,
  ...over,
});

describe("scoreTheQuestion", () => {
  it("passes with a positive delta (answer: yes)", () => {
    const e = scoreTheQuestion(baseline({ verdictDelta: 4 }));
    expect(e.passed).toBe(true);
    expect(e.rewards?.humanConfessionWeight).toBe(1.5);
    expect(e.reason).toMatch(/Yes/);
  });

  it("passes with a negative delta (answer: no)", () => {
    const e = scoreTheQuestion(baseline({ verdictDelta: -3 }));
    expect(e.passed).toBe(true);
    expect(e.rewards?.humanConfessionWeight).toBe(1.5);
    expect(e.reason).toMatch(/No/);
  });

  it("fails on exact neutral (verdictDelta === 0)", () => {
    const e = scoreTheQuestion(baseline({ verdictDelta: 0 }));
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/didn't commit/);
    expect(e.penalties?.humanConfessionWeight).toBe(1.0);
  });

  it("fails when turnsPlayed !== 7", () => {
    const e6 = scoreTheQuestion(baseline({ verdictDelta: 4, turnsPlayed: 6 }));
    expect(e6.passed).toBe(false);
    expect(e6.reason).toMatch(/7 turns/);

    const e8 = scoreTheQuestion(baseline({ verdictDelta: 4, turnsPlayed: 8 }));
    expect(e8.passed).toBe(false);
  });

  it("fails on non-finite verdictDelta", () => {
    const e = scoreTheQuestion(baseline({ verdictDelta: Number.NaN }));
    expect(e.passed).toBe(false);
    expect(e.reason).toMatch(/finite/);
  });
});

/* ─── DECK GENERATION ─── */

function card(id: string, ...categories: string[]): WitnessCard {
  return { id, trialCategories: categories };
}

const CONFESSION_FALLBACK: readonly WitnessCard[] = Array.from({ length: 15 }, (_, i) =>
  card(`fallback_confession_${String(i).padStart(2, "0")}`, "confession"),
);

const ANY_FALLBACK: readonly WitnessCard[] = Array.from({ length: 15 }, (_, i) =>
  card(`fallback_any_${String(i).padStart(2, "0")}`, "narrative"),
);

describe("generateTheQuestionDeck — algorithm", () => {
  it("produces exactly 20 cards when both pools are sufficient", () => {
    const record: WitnessRecord = Array.from({ length: 50 }, (_, i) =>
      card(`hist_${i}`, i % 2 === 0 ? "confession" : "narrative"),
    );
    const deck = generateTheQuestionDeck(record, {
      fallbackConfessionPool: CONFESSION_FALLBACK,
      fallbackAnyPool: ANY_FALLBACK,
    });
    expect(deck.cards.length).toBe(20);
    expect(deck.confessionCount).toBeGreaterThanOrEqual(10);
  });

  it("backfills confession slots from fallback when history is short on confession", () => {
    const record: WitnessRecord = Array.from({ length: 30 }, (_, i) =>
      card(`narr_${i}`, "narrative"), // no confession in history
    );
    const deck = generateTheQuestionDeck(record, {
      fallbackConfessionPool: CONFESSION_FALLBACK,
      fallbackAnyPool: ANY_FALLBACK,
    });
    expect(deck.cards.length).toBe(20);
    expect(deck.confessionCount).toBe(10);
    expect(deck.usedFallback).toBe(true);
  });

  it("is deterministic for identical inputs", () => {
    const record: WitnessRecord = Array.from({ length: 30 }, (_, i) =>
      card(`hist_${i}`, i % 3 === 0 ? "confession" : "narrative"),
    );
    const a = generateTheQuestionDeck(record, {
      fallbackConfessionPool: CONFESSION_FALLBACK,
      fallbackAnyPool: ANY_FALLBACK,
    });
    const b = generateTheQuestionDeck(record, {
      fallbackConfessionPool: CONFESSION_FALLBACK,
      fallbackAnyPool: ANY_FALLBACK,
    });
    expect(a.cards.map((c) => c.id)).toEqual(b.cards.map((c) => c.id));
  });

  it("ranks by play frequency (most-played picked first)", () => {
    const popular = card("popular_confession", "confession");
    const rare = card("rare_confession", "confession");
    // popular appears 10×, rare 1×
    const record: WitnessRecord = [
      ...Array(10).fill(popular),
      rare,
      // Filler so the deck fills out
      ...Array.from({ length: 30 }, (_, i) => card(`narr_${i}`, "narrative")),
    ];
    const deck = generateTheQuestionDeck(record, {
      fallbackConfessionPool: [],
      fallbackAnyPool: [],
    });
    const ids = deck.cards.map((c) => c.id);
    expect(ids.indexOf("popular_confession")).toBeLessThan(ids.indexOf("rare_confession"));
  });

  it("when history is empty, the deck is composed entirely from fallback pools", () => {
    const deck = generateTheQuestionDeck([], {
      fallbackConfessionPool: CONFESSION_FALLBACK,
      fallbackAnyPool: ANY_FALLBACK,
    });
    expect(deck.cards.length).toBe(20);
    expect(deck.confessionCount).toBe(10);
    expect(deck.usedFallback).toBe(true);
  });

  it("when both history and pools are empty, returns a partial deck and reports the gap", () => {
    const deck = generateTheQuestionDeck([], {});
    expect(deck.cards.length).toBe(0);
    expect(deck.confessionCount).toBe(0);
    expect(deck.usedFallback).toBe(false);
  });
});

/* ─── PROPERTY TEST: 1,000 RANDOMIZED RECORDS ─── */

/** Tiny deterministic RNG (mulberry32) so the property test is
 *  reproducible across CI runs. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("generateTheQuestionDeck — property test (1,000 randomized records)", () => {
  it("always produces a 20-card deck with ≥10 confession cards when fallback pools are present", () => {
    const rand = mulberry32(0xc0ffee);
    const allCategories = ["confession", "narrative", "evidence", "reactive", "defensive"];

    for (let i = 0; i < 1000; i++) {
      // Random history: 0..40 cards, mixed categories.
      const historySize = Math.floor(rand() * 41);
      const record: WitnessRecord = Array.from({ length: historySize }, (_, j) => {
        const cat = allCategories[Math.floor(rand() * allCategories.length)];
        // Card id pulled from a finite pool so dedup + ranking matter.
        const cardIdx = Math.floor(rand() * 25);
        return card(`hist_${cardIdx}`, cat);
      });

      const deck = generateTheQuestionDeck(record, {
        fallbackConfessionPool: CONFESSION_FALLBACK,
        fallbackAnyPool: ANY_FALLBACK,
      });

      // Invariant 1: exactly 20 cards.
      expect(deck.cards.length).toBe(20);
      // Invariant 2: ≥10 confession cards.
      expect(deck.confessionCount).toBeGreaterThanOrEqual(10);
      // Invariant 3: no duplicate card ids.
      const ids = deck.cards.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
