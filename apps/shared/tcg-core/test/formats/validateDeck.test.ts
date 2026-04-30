/**
 * Deck validation tests.
 *
 * Exercises validateDeck against the STANDARD_S1 format with real and
 * synthetic card registries. Covers every validation rule: general
 * check, deck size, copy limit, faction lock, unknown cards, banlist.
 */
import { describe, it, expect } from "vitest";
import {
  validateDeck,
  STANDARD_S1,
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
} from "../../index";
import type { Format, DeckInput, CardDefinition, CardRegistry } from "../../index";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

/** Build a deck of `count` copies of a filler id + a general. */
function makeDeck(
  generalDefId: string,
  fillerId: string,
  count: number
): DeckInput {
  return {
    generalDefId,
    cardDefIds: Array.from({ length: count }, () => fillerId),
  };
}

/** A mini registry with a known general + a few cards for testing. */
function buildTestRegistry(): CardRegistry {
  const defs: CardDefinition[] = [
    {
      id: "gen_test" as any,
      name: "Test General",
      faction: "architect",
      cardType: "general",
      rarity: "legendary",
      cost: 0,
      baseStats: { power: 2, health: 25 },
      keywords: [],
      abilities: [],
      art: "test://art",
      flavorText: "",
      rulesVersion: "1.1.0",
    },
    {
      id: "card_a" as any,
      name: "Card A",
      faction: "architect",
      cardType: "unit",
      rarity: "common",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywords: [],
      abilities: [],
      art: "test://art",
      flavorText: "",
      rulesVersion: "1.1.0",
    },
    {
      id: "card_n" as any,
      name: "Neutral Card",
      faction: "neutral",
      cardType: "spell",
      rarity: "common",
      cost: 1,
      keywords: [],
      abilities: [],
      art: "test://art",
      flavorText: "",
      rulesVersion: "1.1.0",
    },
    {
      id: "card_enemy" as any,
      name: "Enemy Faction Card",
      faction: "dreamer",
      cardType: "unit",
      rarity: "common",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywords: [],
      abilities: [],
      art: "test://art",
      flavorText: "",
      rulesVersion: "1.1.0",
    },
    {
      id: "card_spy_only" as any,
      name: "Spy-only Card",
      faction: "architect",
      cardType: "unit",
      rarity: "uncommon",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywords: [],
      abilities: [],
      art: "test://art",
      flavorText: "",
      rulesVersion: "1.1.0",
      characterClass: "spy",
    },
  ];
  return buildCardRegistry(defs);
}

const testFormat: Format = {
  id: "test_format",
  name: "Test",
  deckSize: 5, // general + 4 cards (small for testing)
  copyLimit: 2,
  factionLock: "strict",
  allowedSets: [],
  banlist: [],
};

describe("validateDeck", () => {
  it("accepts a valid deck", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_n", "card_n"],
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("rejects deck with wrong size (too small)", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      { generalDefId: "gen_test", cardDefIds: ["card_a", "card_a"] },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "wrong_deck_size")).toBe(true);
  });

  it("rejects deck with wrong size (too large)", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_n", "card_n", "card_a"],
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "wrong_deck_size")).toBe(true);
  });

  it("rejects exceeding copy limit", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_a", "card_n"], // 3 copies, limit is 2
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "copy_limit_exceeded")).toBe(true);
    expect(result.issues.find((i) => i.code === "copy_limit_exceeded")!.cardId).toBe("card_a");
  });

  it("rejects cross-faction card under strict faction lock", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_n", "card_enemy"], // dreamer card in architect deck
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "faction_mismatch")).toBe(true);
    expect(result.issues.find((i) => i.code === "faction_mismatch")!.cardId).toBe("card_enemy");
  });

  it("allows neutral cards in any faction deck", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_n", "card_n", "card_a", "card_a"],
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(true);
  });

  it("rejects unknown card ids", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_n", "not_real"],
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "unknown_card")).toBe(true);
    expect(result.issues.find((i) => i.code === "unknown_card")!.cardId).toBe("not_real");
  });

  it("rejects unknown general", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "not_a_general",
        cardDefIds: ["card_a", "card_a", "card_n", "card_n"],
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "invalid_general")).toBe(true);
  });

  it("rejects non-general card used as general", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "card_a", // unit, not general
        cardDefIds: ["card_a", "card_n", "card_n", "card_n"],
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "invalid_general")).toBe(true);
  });

  it("rejects banned cards", () => {
    const reg = buildTestRegistry();
    const bannedFormat: Format = { ...testFormat, banlist: ["card_a"] };
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_n", "card_n", "card_n"],
      },
      bannedFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "banned_card")).toBe(true);
  });

  it("rejects banned general", () => {
    const reg = buildTestRegistry();
    const bannedFormat: Format = { ...testFormat, banlist: ["gen_test"] };
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_n", "card_n"],
      },
      bannedFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "banned_card")).toBe(true);
  });

  it("collects multiple issues at once", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "not_a_general",
        cardDefIds: ["card_a", "card_a", "card_a"], // wrong size + copy limit
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThanOrEqual(2);
  });

  it("allows any faction when factionLock is 'none'", () => {
    const reg = buildTestRegistry();
    const openFormat: Format = { ...testFormat, factionLock: "none" };
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_n", "card_enemy", "card_enemy"],
      },
      openFormat,
      reg
    );
    expect(result.valid).toBe(true);
  });

  /* ─── Class restriction (Phase B8) ─── */

  it("rejects class-restricted cards when ownerClass mismatches", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_spy_only", "card_n"],
        ownerClass: "soldier",
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(false);
    const mismatch = result.issues.find((i) => i.code === "class_mismatch");
    expect(mismatch).toBeDefined();
    expect(mismatch?.cardId).toBe("card_spy_only");
  });

  it("allows class-restricted cards when ownerClass matches", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_spy_only", "card_n"],
        ownerClass: "spy",
      },
      testFormat,
      reg
    );
    expect(result.valid).toBe(true);
  });

  it("skips the class check entirely when ownerClass is omitted (backward compat)", () => {
    const reg = buildTestRegistry();
    const result = validateDeck(
      {
        generalDefId: "gen_test",
        cardDefIds: ["card_a", "card_a", "card_spy_only", "card_n"],
      },
      testFormat,
      reg
    );
    // No class_mismatch issue should appear
    expect(result.issues.find((i) => i.code === "class_mismatch")).toBeUndefined();
  });
});
