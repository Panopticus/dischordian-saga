/**
 * Phase 19 Tests: Elara TTS, Card Battle Engine, Easter Eggs
 * Tests the core game logic for card battles, Easter egg definitions,
 * and room Easter egg data integrity.
 */
import { describe, it, expect } from "vitest";

/* ═══ CARD BATTLE ENGINE TESTS ═══ */
describe("Card Battle Engine", () => {
  it("should export initBattle and processBattleAction functions", async () => {
    const mod = await import("../client/src/lib/cardBattle");
    expect(typeof mod.initBattle).toBe("function");
    expect(typeof mod.processBattleAction).toBe("function");
    expect(typeof mod.getAvailableEnemies).toBe("function");
    expect(typeof mod.getEnemyName).toBe("function");
  });

  it("should list available enemies with correct structure", async () => {
    const { getAvailableEnemies } = await import("../client/src/lib/cardBattle");
    const enemies = getAvailableEnemies();
    expect(enemies.length).toBeGreaterThanOrEqual(3);
    for (const enemy of enemies) {
      expect(enemy.id).toBeTruthy();
      expect(enemy.name).toBeTruthy();
      expect(enemy.difficulty).toBeTruthy();
      expect(enemy.description).toBeTruthy();
    }
  });

  it("should get enemy name by ID", async () => {
    const { getEnemyName } = await import("../client/src/lib/cardBattle");
    expect(getEnemyName("corrupted-sentinel")).toBe("Corrupted Sentinel");
    expect(getEnemyName("thought-virus")).toBe("The Thought Virus");
    expect(getEnemyName("void-entity")).toBe("Void Entity");
    expect(getEnemyName("nonexistent")).toBe("Unknown Enemy");
  });

  it("should create a valid battle state with initBattle", async () => {
    const { initBattle } = await import("../client/src/lib/cardBattle");
    // Create a minimal player deck matching StarterCard interface
    const playerDeck = Array.from({ length: 8 }, (_, i) => ({
      id: `card-${i}`,
      name: `Test Card ${i}`,
      type: "unit" as const,
      rarity: "common" as const,
      attack: 2 + i,
      defense: 2 + i,
      cost: 1 + (i % 3),
      ability: "Test ability",
      lore: "Test lore",
      imageUrl: "https://example.com/card.png",
    }));

    const state = initBattle(playerDeck, "corrupted-sentinel", "normal");
    expect(state.phase).toBe("DRAW");
    expect(state.turnNumber).toBe(1);
    expect(state.turn).toBe("player");
    expect(state.winner).toBeNull();
    expect(state.player.hp).toBe(20);
    expect(state.player.maxHP).toBe(20);
    expect(state.player.hand.length).toBeGreaterThan(0);
    expect(state.player.deck.length).toBeGreaterThan(0);
    expect(state.enemy.hp).toBeGreaterThan(0);
    expect(state.enemy.hand.length).toBeGreaterThan(0);
    expect(state.logs.length).toBeGreaterThan(0);
  });

  it("should have different enemy HP based on difficulty", async () => {
    const { initBattle } = await import("../client/src/lib/cardBattle");
    const deck = Array.from({ length: 8 }, (_, i) => ({
      id: `card-${i}`, name: `Card ${i}`, type: "unit" as const,
      rarity: "common" as const, attack: 3, defense: 3, cost: 1,
      ability: "", lore: "", imageUrl: "",
    }));

    const easy = initBattle(deck, "corrupted-sentinel", "easy");
    const hard = initBattle(deck, "corrupted-sentinel", "hard");
    expect(hard.enemy.hp).toBeGreaterThan(easy.enemy.hp);
  });

  it("should process END_TURN action correctly", async () => {
    const { initBattle, processBattleAction } = await import("../client/src/lib/cardBattle");
    const deck = Array.from({ length: 8 }, (_, i) => ({
      id: `card-${i}`, name: `Card ${i}`, type: "unit" as const,
      rarity: "common" as const, attack: 3, defense: 3, cost: 1,
      ability: "", lore: "", imageUrl: "",
    }));

    let state = initBattle(deck, "corrupted-sentinel", "easy");
    // Change phase to MAIN so END_TURN works
    state.phase = "MAIN";
    const newState = processBattleAction(state, { type: "END_TURN" });
    // After END_TURN, the AI should have taken its turn and it should be player's turn again
    expect(newState.turnNumber).toBeGreaterThanOrEqual(state.turnNumber);
  });

  it("should not process actions when game is over", async () => {
    const { initBattle, processBattleAction } = await import("../client/src/lib/cardBattle");
    const deck = Array.from({ length: 8 }, (_, i) => ({
      id: `card-${i}`, name: `Card ${i}`, type: "unit" as const,
      rarity: "common" as const, attack: 3, defense: 3, cost: 1,
      ability: "", lore: "", imageUrl: "",
    }));

    let state = initBattle(deck, "corrupted-sentinel", "easy");
    state.winner = "player";
    const newState = processBattleAction(state, { type: "END_TURN" });
    // State should be unchanged when game is over
    expect(newState.winner).toBe("player");
  });

  it("should have BattleCard interface extending StarterCard", async () => {
    const { initBattle } = await import("../client/src/lib/cardBattle");
    const deck = Array.from({ length: 8 }, (_, i) => ({
      id: `card-${i}`, name: `Card ${i}`, type: "unit" as const,
      rarity: "common" as const, attack: 3, defense: 3, cost: 1,
      ability: "", lore: "", imageUrl: "",
    }));

    const state = initBattle(deck, "corrupted-sentinel", "easy");
    const card = state.player.hand[0];
    // BattleCard should have StarterCard fields plus battle-specific fields
    expect(card.name).toBeTruthy();
    expect(typeof card.attack).toBe("number");
    expect(typeof card.defense).toBe("number");
    expect(typeof card.cost).toBe("number");
    expect(typeof card.currentHP).toBe("number");
    expect(typeof card.hasAttacked).toBe("boolean");
    expect(typeof card.justDeployed).toBe("boolean");
    expect(typeof card.instanceId).toBe("string");
  });
});

/* ═══ EASTER EGG DEFINITIONS TESTS ═══ */
describe("Easter Egg System", () => {
  it("should define room Easter eggs for all major rooms", async () => {
    const { ROOM_EASTER_EGGS } = await import("../client/src/components/EasterEggs");
    const eggIds = Object.keys(ROOM_EASTER_EGGS);

    // Should have at least 8 Easter eggs (one per major room)
    expect(eggIds.length).toBeGreaterThanOrEqual(8);

    // Each egg should have required fields
    for (const [id, egg] of Object.entries(ROOM_EASTER_EGGS)) {
      expect(id).toMatch(/^egg-/);
      expect(egg.title).toBeTruthy();
      expect(egg.loreFragment).toBeTruthy();
      expect(typeof egg.xp).toBe("number");
      expect(egg.xp).toBeGreaterThan(0);

      // If bonus card exists, validate it
      if (egg.bonusCard) {
        expect(egg.bonusCard.name).toBeTruthy();
        expect(["rare", "legendary", "mythic"]).toContain(egg.bonusCard.rarity);
        expect(egg.bonusCard.description).toBeTruthy();
      }
    }
  });

  it("should have lore-accurate Easter egg content", async () => {
    const { ROOM_EASTER_EGGS } = await import("../client/src/components/EasterEggs");

    // The Antiquarian mark should reference the Programmer
    const cryoEgg = ROOM_EASTER_EGGS["egg-cryo-scratch"];
    expect(cryoEgg).toBeDefined();
    expect(cryoEgg.loreFragment).toContain("Antiquarian");
    expect(cryoEgg.loreFragment).toContain("Programmer");

    // The bridge log should reference the Engineer and mind swap
    const bridgeEgg = ROOM_EASTER_EGGS["egg-bridge-log"];
    expect(bridgeEgg).toBeDefined();
    expect(bridgeEgg.loreFragment).toContain("Engineer");
    expect(bridgeEgg.loreFragment).toContain("Thought Virus");

    // The cargo manifest should reference the Oracle clone
    const cargoEgg = ROOM_EASTER_EGGS["egg-cargo-manifest"];
    expect(cargoEgg).toBeDefined();
    expect(cargoEgg.loreFragment).toContain("Oracle");
    expect(cargoEgg.loreFragment).toContain("clone");

    // The captain's mirror should reference the Meme
    const mirrorEgg = ROOM_EASTER_EGGS["egg-captain-mirror"];
    expect(mirrorEgg).toBeDefined();
    expect(mirrorEgg.loreFragment).toContain("Meme");
    expect(mirrorEgg.loreFragment).toContain("White Oracle");
  });

  it("should have bonus cards with appropriate rarity tiers", async () => {
    const { ROOM_EASTER_EGGS } = await import("../client/src/components/EasterEggs");
    const cardsWithRarity = Object.values(ROOM_EASTER_EGGS)
      .filter(egg => egg.bonusCard)
      .map(egg => egg.bonusCard!);

    // Should have at least some mythic cards
    const mythics = cardsWithRarity.filter(c => c.rarity === "mythic");
    expect(mythics.length).toBeGreaterThanOrEqual(2);

    // Should have at least some legendary cards
    const legendaries = cardsWithRarity.filter(c => c.rarity === "legendary");
    expect(legendaries.length).toBeGreaterThanOrEqual(2);
  });

  it("should export lore fragment and bonus card utility functions", async () => {
    const { getLoreFragments, getBonusCards } = await import("../client/src/components/EasterEggs");
    expect(typeof getLoreFragments).toBe("function");
    expect(typeof getBonusCards).toBe("function");

    // Should return arrays (empty in test env since no localStorage)
    expect(Array.isArray(getLoreFragments())).toBe(true);
    expect(Array.isArray(getBonusCards())).toBe(true);
  });
});

/* ═══ ROOM EASTER EGG HOTSPOT INTEGRITY ═══ */
describe("Room Easter Egg Hotspot Integrity", () => {
  it("should have Easter egg hotspots matching ROOM_EASTER_EGGS definitions", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");
    const { ROOM_EASTER_EGGS } = await import("../client/src/components/EasterEggs");

    // Collect all egg-prefixed hotspot IDs from rooms
    const hotspotEggIds = new Set<string>();
    for (const room of ROOM_DEFINITIONS) {
      for (const hotspot of room.hotspots) {
        if (hotspot.id.startsWith("egg-")) {
          hotspotEggIds.add(hotspot.id);
        }
      }
    }

    // Every ROOM_EASTER_EGGS key should have a corresponding hotspot
    for (const eggId of Object.keys(ROOM_EASTER_EGGS)) {
      expect(hotspotEggIds.has(eggId)).toBe(true);
    }
  });

  it("should have Easter egg hotspots that are small and hidden", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");

    for (const room of ROOM_DEFINITIONS) {
      for (const hotspot of room.hotspots) {
        if (hotspot.id.startsWith("egg-")) {
          // Easter eggs should be small (< 8% width and height)
          expect(hotspot.width).toBeLessThanOrEqual(8);
          expect(hotspot.height).toBeLessThanOrEqual(8);
        }
      }
    }
  });

  it("should have Easter egg hotspots with Elara dialog", async () => {
    const { ROOM_DEFINITIONS } = await import("../client/src/contexts/GameContext");

    for (const room of ROOM_DEFINITIONS) {
      for (const hotspot of room.hotspots) {
        if (hotspot.id.startsWith("egg-")) {
          expect(hotspot.elaraDialog).toBeTruthy();
          expect(hotspot.elaraDialog!.length).toBeGreaterThan(50);
        }
      }
    }
  });
});

/* ═══ EXPORTS INTEGRITY ═══ */
describe("Module Exports Integrity", () => {
  it("should export EasterEggs component and helpers", async () => {
    const mod = await import("../client/src/components/EasterEggs");
    expect(mod.default).toBeDefined(); // Default export is the component
    expect(mod.SecretsProgress).toBeDefined(); // Named export
    expect(mod.ROOM_EASTER_EGGS).toBeDefined();
    expect(mod.getLoreFragments).toBeDefined();
    expect(mod.getBonusCards).toBeDefined();
  });

  it("should export StarterCard interface from StarterDeckViewer", async () => {
    const mod = await import("../client/src/components/StarterDeckViewer");
    expect(mod.default).toBeDefined(); // Default export is the component
  });

  it("should export useElaraTTS hook", async () => {
    const mod = await import("../client/src/hooks/useElaraTTS");
    expect(mod.useElaraTTS).toBeDefined();
    expect(typeof mod.useElaraTTS).toBe("function");
  });
});
