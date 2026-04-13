/**
 * createMatchState tests.
 *
 * Validates the shape of the initial GameState produced by the match
 * initializer, plus its determinism guarantee (same inputs → identical
 * state hash).
 */
import { describe, it, expect } from "vitest";
import {
  createMatchState,
  buildCardRegistry,
  hashState,
  ALL_CARD_DEFINITIONS,
  RULES_VERSION,
  posKey,
  BOARD_HEIGHT,
  MULLIGAN_HAND_SIZE,
  STARTING_MANA,
} from "../../index";
import type { MatchConfig } from "../../index";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

// Build a deck of only "unknown" def ids. Those mint placeholder
// CardInstances (0/1) — the init function is lenient about unknown ids,
// since format validation happens upstream.
function buildTestDeck(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}_${i}`);
}

const p1Config: MatchConfig = {
  userId: 1 as MatchConfig["userId"],
  faction: "architect",
  generalDefId: "gen_architect",
  deckCardDefIds: buildTestDeck("p1_card", 39),
};
const p2Config: MatchConfig = {
  userId: 2 as MatchConfig["userId"],
  faction: "dreamer",
  generalDefId: "gen_dreamer",
  deckCardDefIds: buildTestDeck("p2_card", 39),
};

describe("createMatchState", () => {
  it("places both generals at canonical positions", () => {
    const s = createMatchState({
      matchId: "m-1",
      seed: "init-seed",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    const mid = Math.floor(BOARD_HEIGHT / 2);
    expect(s.board[posKey(mid, 0)]).toBeDefined();
    expect(s.board[posKey(mid, 8)]).toBeDefined();
    expect(s.board[posKey(mid, 0)].isGeneral).toBe(true);
    expect(s.board[posKey(mid, 8)].isGeneral).toBe(true);
  });

  it("deals MULLIGAN_HAND_SIZE cards per player", () => {
    const s = createMatchState({
      matchId: "m-2",
      seed: "init-seed",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    expect(s.players[0].hand.length).toBe(MULLIGAN_HAND_SIZE);
    expect(s.players[1].hand.length).toBe(MULLIGAN_HAND_SIZE);
    // Decks are drawn down by the opening hand.
    expect(s.players[0].deck.length).toBe(39 - MULLIGAN_HAND_SIZE);
    expect(s.players[1].deck.length).toBe(39 - MULLIGAN_HAND_SIZE);
  });

  it("starts in mulligan phase with starting mana and no winner", () => {
    const s = createMatchState({
      matchId: "m-3",
      seed: "init-seed",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    expect(s.phase).toBe("mulligan");
    expect(s.players[0].mana).toBe(STARTING_MANA);
    expect(s.players[0].maxMana).toBe(STARTING_MANA);
    expect(s.winner).toBeNull();
    expect(s.turnNumber).toBe(1);
    expect(s.currentPlayer).toBe(0);
  });

  it("stamps the current rules version", () => {
    const s = createMatchState({
      matchId: "m-4",
      seed: "init-seed",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    expect(s.rulesVersion).toBe(RULES_VERSION);
  });

  it("mints distinct entity ids and persists nextEntityCounter", () => {
    const s = createMatchState({
      matchId: "m-5",
      seed: "init-seed",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    const ids = new Set<string>();
    for (const entity of Object.values(s.board)) ids.add(entity.entityId);
    for (const card of s.players[0].hand) ids.add(card.entityId);
    for (const card of s.players[0].deck) ids.add(card.entityId);
    for (const card of s.players[1].hand) ids.add(card.entityId);
    for (const card of s.players[1].deck) ids.add(card.entityId);
    // 2 generals + 39*2 deck cards = 80 distinct entity ids.
    expect(ids.size).toBe(80);
    // Counter advanced past the highest minted id.
    expect(s.nextEntityCounter).toBeGreaterThan(80);
  });

  it("same seed + configs → identical state hash (determinism)", () => {
    const a = createMatchState({
      matchId: "m-det",
      seed: "same-seed",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    const b = createMatchState({
      matchId: "m-det",
      seed: "same-seed",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    expect(hashState(a)).toBe(hashState(b));
  });

  it("different seeds → different state hashes (RNG drives shuffle)", () => {
    const a = createMatchState({
      matchId: "m-det2",
      seed: "alpha",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    const b = createMatchState({
      matchId: "m-det2",
      seed: "beta",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    expect(hashState(a)).not.toBe(hashState(b));
  });

  it("uses registry baseStats when available", () => {
    // Real card s1_char_018 (Antiquarian) is in the registry with 5/6.
    const s = createMatchState({
      matchId: "m-reg",
      seed: "reg-seed",
      p1: {
        ...p1Config,
        deckCardDefIds: ["s1_char_018", ...p1Config.deckCardDefIds.slice(1)],
      },
      p2: p2Config,
      registry,
    });
    const ant = [...s.players[0].hand, ...s.players[0].deck].find(
      (c) => c.defId === "s1_char_018"
    );
    if (ant) {
      expect(ant.currentPower).toBe(5);
      expect(ant.maxHealth).toBe(6);
    }
  });

  /* ─────────────── Starting bonuses (E7) ─────────────── */

  it("startingBonuses.extraMana adds to STARTING_MANA and maxMana", () => {
    const s = createMatchState({
      matchId: "m-bonus-mana",
      seed: "init-seed",
      p1: {
        ...p1Config,
        startingBonuses: { extraMana: 2 },
      },
      p2: p2Config,
      registry,
    });
    expect(s.players[0].mana).toBe(STARTING_MANA + 2);
    expect(s.players[0].maxMana).toBe(STARTING_MANA + 2);
    expect(s.players[1].mana).toBe(STARTING_MANA);
  });

  it("startingBonuses.extraCards enlarges the opening hand", () => {
    const s = createMatchState({
      matchId: "m-bonus-cards",
      seed: "init-seed",
      p1: {
        ...p1Config,
        startingBonuses: { extraCards: 2 },
      },
      p2: p2Config,
      registry,
    });
    expect(s.players[0].hand.length).toBe(MULLIGAN_HAND_SIZE + 2);
    expect(s.players[1].hand.length).toBe(MULLIGAN_HAND_SIZE);
  });

  it("startingBonuses.extraGeneralHp bumps the general's HP", () => {
    const s = createMatchState({
      matchId: "m-bonus-hp",
      seed: "init-seed",
      p1: {
        ...p1Config,
        startingBonuses: { extraGeneralHp: 5 },
      },
      p2: p2Config,
      registry,
    });
    const p1General = [...Object.values(s.board)].find((e) => e.isGeneral && e.card.owner === 0);
    const p2General = [...Object.values(s.board)].find((e) => e.isGeneral && e.card.owner === 1);
    expect(p1General?.card.currentHealth).toBeGreaterThan(
      p2General?.card.currentHealth ?? 0,
    );
    expect((p1General?.card.currentHealth ?? 0) - (p2General?.card.currentHealth ?? 0)).toBe(5);
  });

  it("startingBonuses values are clamped to prevent abuse", () => {
    const s = createMatchState({
      matchId: "m-bonus-clamp",
      seed: "init-seed",
      p1: {
        ...p1Config,
        startingBonuses: {
          extraMana: 99,
          extraCards: 99,
          extraGeneralHp: 99,
        },
      },
      p2: p2Config,
      registry,
    });
    // Clamps: mana +3, cards +2, hp +10
    expect(s.players[0].mana).toBe(STARTING_MANA + 3);
    expect(s.players[0].hand.length).toBe(MULLIGAN_HAND_SIZE + 2);
    const p1General = [...Object.values(s.board)].find((e) => e.isGeneral && e.card.owner === 0);
    const p2General = [...Object.values(s.board)].find((e) => e.isGeneral && e.card.owner === 1);
    const delta = (p1General?.card.currentHealth ?? 0) - (p2General?.card.currentHealth ?? 0);
    expect(delta).toBe(10);
  });

  it("omitted startingBonuses yields identical state to the no-bonus path", () => {
    const noBonus = createMatchState({
      matchId: "m-no-bonus",
      seed: "init-seed",
      p1: p1Config,
      p2: p2Config,
      registry,
    });
    const emptyBonus = createMatchState({
      matchId: "m-no-bonus",
      seed: "init-seed",
      p1: { ...p1Config, startingBonuses: {} },
      p2: { ...p2Config, startingBonuses: {} },
      registry,
    });
    // Same hashes → no-op when all bonus fields are undefined.
    expect(hashState(noBonus)).toBe(hashState(emptyBonus));
  });
});
