/**
 * Card loader + Zod schema tests.
 *
 * Tests the loader's validation path with both happy-path (a minimal
 * valid card) and failure-path (each class of schema error) inputs.
 * Also smoke-loads the real ALL_CARD_DEFINITIONS barrel to make sure
 * every authored card passes validation.
 */
import { describe, it, expect } from "vitest";
import {
  buildCardRegistry,
  assertCardsPresent,
  CardRegistryLoadError,
  ALL_CARD_DEFINITIONS,
  cardDefinitionSchema,
} from "../../index";

describe("card loader — valid inputs", () => {
  it("builds a registry from the real barrel", () => {
    const reg = buildCardRegistry(ALL_CARD_DEFINITIONS);
    expect(reg.listAll().length).toBe(ALL_CARD_DEFINITIONS.length);
    // The three hand-authored reference cards must be present.
    assertCardsPresent(reg, ["s1_char_018", "s1_char_002", "s1_song_061"]);
  });

  it("registry get/has lookups are stable", () => {
    const reg = buildCardRegistry(ALL_CARD_DEFINITIONS);
    const antiquarian = reg.get("s1_char_018");
    expect(antiquarian).toBeDefined();
    expect(antiquarian?.name).toBe("The Antiquarian");
    expect(reg.has("s1_char_018")).toBe(true);
    expect(reg.has("not_real")).toBe(false);
    expect(reg.get("not_real")).toBeUndefined();
  });

  it("registry is frozen — mutation attempts throw or fail silently", () => {
    const reg = buildCardRegistry(ALL_CARD_DEFINITIONS);
    // We can't reassign registry methods (Object.freeze) and listAll
    // returns a frozen array.
    const all = reg.listAll();
    expect(Object.isFrozen(all)).toBe(true);
  });

  it("accepts a minimal valid unit", () => {
    const minimal = {
      id: "test_minimal_unit",
      name: "Test Unit",
      faction: "neutral",
      cardType: "unit",
      rarity: "common",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywords: [],
      abilities: [],
      art: "test://art",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    const reg = buildCardRegistry([minimal]);
    expect(reg.has("test_minimal_unit")).toBe(true);
  });

  it("accepts a minimal valid spell", () => {
    const spell = {
      id: "test_minimal_spell",
      name: "Test Spell",
      faction: "neutral",
      cardType: "spell",
      rarity: "common",
      cost: 1,
      keywords: [],
      abilities: [
        {
          id: "t",
          trigger: { kind: "on_cast" },
          effect: {
            op: "deal_damage",
            amount: { kind: "const", value: 1 },
            to: { kind: "enemy_general" },
          },
        },
      ],
      art: "test://art",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    const reg = buildCardRegistry([spell]);
    expect(reg.has("test_minimal_spell")).toBe(true);
  });
});

describe("card loader — schema failure paths", () => {
  it("rejects unit without baseStats", () => {
    const bad = {
      id: "bad_unit",
      name: "Bad",
      faction: "neutral",
      cardType: "unit",
      rarity: "common",
      cost: 1,
      keywords: [],
      abilities: [],
      art: "x",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    expect(() => buildCardRegistry([bad])).toThrowError(CardRegistryLoadError);
  });

  it("rejects spell that declares baseStats", () => {
    const bad = {
      id: "bad_spell",
      name: "Bad",
      faction: "neutral",
      cardType: "spell",
      rarity: "common",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywords: [],
      abilities: [],
      art: "x",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    expect(() => buildCardRegistry([bad])).toThrow();
  });

  it("rejects duplicate card ids", () => {
    const card = {
      id: "dup_test",
      name: "Dup",
      faction: "neutral",
      cardType: "unit",
      rarity: "common",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywords: [],
      abilities: [],
      art: "x",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    expect(() => buildCardRegistry([card, card])).toThrowError(
      /duplicate card id/
    );
  });

  it("rejects duplicate ability ids within a card", () => {
    const card = {
      id: "dup_ability",
      name: "Dup Ability",
      faction: "neutral",
      cardType: "unit",
      rarity: "common",
      cost: 2,
      baseStats: { power: 1, health: 2 },
      keywords: [],
      abilities: [
        {
          id: "a1",
          trigger: { kind: "on_deploy" },
          effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
        },
        {
          id: "a1", // duplicate
          trigger: { kind: "on_death" },
          effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
        },
      ],
      art: "x",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    expect(() => buildCardRegistry([card])).toThrowError(/duplicate ability id/);
  });

  it("rejects typo in id casing (schema requires snake_case)", () => {
    const bad = {
      id: "BadCasing",
      name: "Bad",
      faction: "neutral",
      cardType: "unit",
      rarity: "common",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywords: [],
      abilities: [],
      art: "x",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    expect(() => buildCardRegistry([bad])).toThrow();
  });

  it("rejects unknown fields (typo-catch)", () => {
    const bad = {
      id: "typo_unit",
      name: "Typo",
      faction: "neutral",
      cardType: "unit",
      rarity: "common",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywordz: [], // typo: should be `keywords`
      keywords: [],
      abilities: [],
      art: "x",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    expect(() => buildCardRegistry([bad])).toThrow();
  });

  it("rejects invalid rulesVersion format", () => {
    const bad = {
      id: "bad_version",
      name: "Bad",
      faction: "neutral",
      cardType: "unit",
      rarity: "common",
      cost: 1,
      baseStats: { power: 1, health: 1 },
      keywords: [],
      abilities: [],
      art: "x",
      flavorText: "",
      rulesVersion: "1.0", // missing patch
    };
    expect(() => buildCardRegistry([bad])).toThrow();
  });

  it("assertCardsPresent throws on missing ids", () => {
    const reg = buildCardRegistry(ALL_CARD_DEFINITIONS);
    expect(() => assertCardsPresent(reg, ["s1_char_018", "not_real"])).toThrow(
      /not_real/
    );
  });
});

describe("card loader — effect tree recursion", () => {
  it("validates a deeply nested sequence -> if -> foreach effect", () => {
    const card = {
      id: "recursive_test",
      name: "Recursive",
      faction: "neutral",
      cardType: "spell",
      rarity: "rare",
      cost: 3,
      keywords: [],
      abilities: [
        {
          id: "t",
          trigger: { kind: "on_cast" },
          effect: {
            op: "sequence",
            steps: [
              {
                op: "if",
                cond: { kind: "self_damaged" },
                then: {
                  op: "foreach",
                  over: { kind: "all", filter: { controller: "opponent" } },
                  do: {
                    op: "deal_damage",
                    amount: { kind: "const", value: 1 },
                    to: { kind: "it" },
                  },
                },
                else: {
                  op: "draw",
                  amount: { kind: "const", value: 1 },
                  who: "self",
                },
              },
              {
                op: "heal",
                amount: { kind: "const", value: 2 },
                to: { kind: "friendly_general" },
              },
            ],
          },
        },
      ],
      art: "x",
      flavorText: "",
      rulesVersion: "1.0.0",
    };
    expect(() => cardDefinitionSchema.parse(card)).not.toThrow();
  });
});
