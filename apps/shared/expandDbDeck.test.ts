/**
 * Deck-shape bridge tests. Protects the `{ cardId, quantity }[]`
 * ↔ `cardDefIds: string[]` conversion used by the DeckPickerModal
 * and any future deck save/load code.
 */
import { describe, it, expect } from "vitest";
import {
  compactDeckToDbEntries,
  expandDbDeckToCardDefIds,
} from "./expandDbDeck";

describe("expandDbDeckToCardDefIds", () => {
  it("expands entries to a flat list with each card repeated N times", () => {
    expect(
      expandDbDeckToCardDefIds([
        { cardId: "s1_char_001", quantity: 3 },
        { cardId: "s1_spell_200", quantity: 2 },
      ]),
    ).toEqual([
      "s1_char_001",
      "s1_char_001",
      "s1_char_001",
      "s1_spell_200",
      "s1_spell_200",
    ]);
  });

  it("returns empty array on null / empty input", () => {
    expect(expandDbDeckToCardDefIds(null)).toEqual([]);
    expect(expandDbDeckToCardDefIds(undefined)).toEqual([]);
    expect(expandDbDeckToCardDefIds([])).toEqual([]);
  });

  it("skips malformed rows (missing cardId)", () => {
    expect(
      expandDbDeckToCardDefIds([
        { cardId: "", quantity: 2 },
        { cardId: "good_card", quantity: 1 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { cardId: null as any, quantity: 3 },
      ]),
    ).toEqual(["good_card"]);
  });

  it("skips rows with non-positive or non-integer quantities", () => {
    expect(
      expandDbDeckToCardDefIds([
        { cardId: "zero", quantity: 0 },
        { cardId: "negative", quantity: -1 },
        { cardId: "fractional", quantity: 1.5 },
        { cardId: "ok", quantity: 2 },
      ]),
    ).toEqual(["ok", "ok"]);
  });
});

describe("compactDeckToDbEntries", () => {
  it("collapses a flat list into count-per-card entries in first-appearance order", () => {
    expect(
      compactDeckToDbEntries([
        "s1_char_001",
        "s1_char_001",
        "s1_spell_200",
        "s1_char_001",
      ]),
    ).toEqual([
      { cardId: "s1_char_001", quantity: 3 },
      { cardId: "s1_spell_200", quantity: 1 },
    ]);
  });

  it("returns empty list on empty input", () => {
    expect(compactDeckToDbEntries([])).toEqual([]);
  });

  it("round-trips expand → compact stably", () => {
    const original = [
      { cardId: "card_a", quantity: 3 },
      { cardId: "card_b", quantity: 2 },
      { cardId: "card_c", quantity: 1 },
    ];
    const flat = expandDbDeckToCardDefIds(original);
    const back = compactDeckToDbEntries(flat);
    expect(back).toEqual(original);
  });

  it("ignores empty ids in compact", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(compactDeckToDbEntries(["", null as any, "a", "a"])).toEqual([
      { cardId: "a", quantity: 2 },
    ]);
  });
});
