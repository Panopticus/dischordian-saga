/**
 * Server-side deck-composition validator tests.
 */
import { describe, it, expect } from "vitest";
import {
  FORMAT_MAX_CARDS,
  FORMAT_MAX_COPIES,
  validateDbDeckComposition,
  type DbDeckCardEntry,
} from "./validateDbDeckComposition";

describe("validateDbDeckComposition", () => {
  it("rejects empty / null / undefined deck", () => {
    expect(validateDbDeckComposition(null).ok).toBe(false);
    expect(validateDbDeckComposition(undefined).ok).toBe(false);
    expect(validateDbDeckComposition([]).ok).toBe(false);
  });

  it("accepts a minimal legal deck", () => {
    const deck: DbDeckCardEntry[] = [
      { cardId: "s1_char_001", quantity: 3 },
      { cardId: "s1_spell_200", quantity: 2 },
    ];
    expect(validateDbDeckComposition(deck)).toEqual({ ok: true });
  });

  it("rejects blank cardId", () => {
    expect(
      validateDbDeckComposition([{ cardId: "", quantity: 2 }]).ok,
    ).toBe(false);
  });

  it("rejects non-positive quantity", () => {
    expect(
      validateDbDeckComposition([{ cardId: "x", quantity: 0 }]).ok,
    ).toBe(false);
    expect(
      validateDbDeckComposition([{ cardId: "x", quantity: -1 }]).ok,
    ).toBe(false);
  });

  it("rejects non-integer quantity", () => {
    expect(
      validateDbDeckComposition([{ cardId: "x", quantity: 1.5 }]).ok,
    ).toBe(false);
  });

  it("rejects quantity over FORMAT_MAX_COPIES", () => {
    expect(
      validateDbDeckComposition([
        { cardId: "x", quantity: FORMAT_MAX_COPIES + 1 },
      ]).ok,
    ).toBe(false);
  });

  it("rejects duplicate rows for the same cardId", () => {
    const result = validateDbDeckComposition([
      { cardId: "x", quantity: 2 },
      { cardId: "x", quantity: 2 },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/duplicate/);
  });

  it("rejects total over FORMAT_MAX_CARDS", () => {
    const deck: DbDeckCardEntry[] = Array.from({ length: 11 }, (_, i) => ({
      cardId: `card_${i}`,
      quantity: 4,
    }));
    const result = validateDbDeckComposition(deck);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/max/);
  });

  it("accepts exactly FORMAT_MAX_CARDS total", () => {
    const deck: DbDeckCardEntry[] = Array.from({ length: 10 }, (_, i) => ({
      cardId: `card_${i}`,
      quantity: 4,
    }));
    expect(deck.reduce((a, b) => a + b.quantity, 0)).toBe(FORMAT_MAX_CARDS);
    expect(validateDbDeckComposition(deck).ok).toBe(true);
  });

  it("surfaces descriptive error messages", () => {
    const r = validateDbDeckComposition([{ cardId: "bad", quantity: 5 }]);
    if (!r.ok) {
      expect(r.error).toMatch(/bad/);
      expect(r.error).toMatch(/copy limit/);
    } else {
      throw new Error("expected failure");
    }
  });
});
