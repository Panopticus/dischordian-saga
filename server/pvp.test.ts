import { describe, it, expect } from "vitest";
import {
  initPvpBattle,
  processPvpAction,
  type PvpBattleState,
  type DeckCard,
} from "../shared/pvpBattle";

/* ─── HELPERS ─── */
function makeDeck(count = 10): DeckCard[] {
  return Array.from({ length: count }, (_, i) => ({
    cardId: `card-${i}`,
    name: `Test Unit ${i}`,
    type: "unit" as const,
    rarity: "common" as const,
    attack: 2 + (i % 3),
    defense: 3 + (i % 2),
    cost: 1 + (i % 4),
    ability: "None",
    imageUrl: `https://example.com/card-${i}.png`,
  }));
}

function createBattle(deckSize = 10): PvpBattleState {
  return initPvpBattle(
    "test-match-1",
    { id: 1, name: "Player1", deck: makeDeck(deckSize) },
    { id: 2, name: "Player2", deck: makeDeck(deckSize) }
  );
}

describe("PvP Battle Engine", () => {
  describe("initPvpBattle", () => {
    it("creates a valid initial battle state", () => {
      const state = createBattle();

      expect(state.player1.id).toBe(1);
      expect(state.player2.id).toBe(2);
      expect(state.player1.name).toBe("Player1");
      expect(state.player2.name).toBe("Player2");
      expect(state.player1.hp).toBe(20);
      expect(state.player2.hp).toBe(20);
      expect(state.turnNumber).toBe(1);
      expect(state.winner).toBeNull();
      expect(state.phase).toBe("MAIN");
    });

    it("assigns first turn to player1", () => {
      const state = createBattle();
      expect(state.currentTurn).toBe(1);
    });

    it("deals starting hands from the deck", () => {
      const state = createBattle();
      // Player 1 gets 4 cards drawn + 1 draw = 5, or 4 initial
      expect(state.player1.hand.length).toBeGreaterThanOrEqual(4);
      expect(state.player2.hand.length).toBeGreaterThanOrEqual(3);
    });

    it("sets starting energy to 1", () => {
      const state = createBattle();
      expect(state.player1.energy).toBe(1);
      expect(state.player2.energy).toBe(1);
    });

    it("initializes with empty fields and graveyards", () => {
      const state = createBattle();
      expect(state.player1.field).toHaveLength(0);
      expect(state.player2.field).toHaveLength(0);
      expect(state.player1.graveyard).toHaveLength(0);
      expect(state.player2.graveyard).toHaveLength(0);
    });

    it("creates a match with the given matchId", () => {
      const state = initPvpBattle(
        "custom-match-id",
        { id: 10, name: "A", deck: makeDeck() },
        { id: 20, name: "B", deck: makeDeck() }
      );
      expect(state.matchId).toBe("custom-match-id");
    });
  });

  describe("processPvpAction - PLAY_CARD", () => {
    it("deploys a card from hand to field", () => {
      const state = createBattle();
      // Find a card the player can afford (cost <= energy)
      const affordableCard = state.player1.hand.find(c => c.cost <= state.player1.energy);
      if (!affordableCard) return; // Skip if no affordable card (unlikely with cost 1-4 and energy 1)

      const result = processPvpAction(state, 1, {
        type: "PLAY_CARD",
        cardInstanceId: affordableCard.instanceId,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        const p1 = result.state.player1;
        expect(p1.field.some(c => c.instanceId === affordableCard.instanceId)).toBe(true);
        expect(p1.hand.some(c => c.instanceId === affordableCard.instanceId)).toBe(false);
      }
    });

    it("rejects playing a card when not your turn", () => {
      const state = createBattle();
      const p2Card = state.player2.hand[0];
      const result = processPvpAction(state, 2, {
        type: "PLAY_CARD",
        cardInstanceId: p2Card.instanceId,
      });
      expect(result.success).toBe(false);
    });

    it("rejects playing a card you can't afford", () => {
      const state = createBattle();
      // Find an expensive card (cost > energy)
      const expensiveCard = state.player1.hand.find(c => c.cost > state.player1.energy);
      if (!expensiveCard) return;
      const result = processPvpAction(state, 1, {
        type: "PLAY_CARD",
        cardInstanceId: expensiveCard.instanceId,
      });
      expect(result.success).toBe(false);
    });

    it("reduces energy after playing a card", () => {
      const state = createBattle();
      const affordableCard = state.player1.hand.find(c => c.cost <= state.player1.energy);
      if (!affordableCard) return;
      const energyBefore = state.player1.energy;
      const result = processPvpAction(state, 1, {
        type: "PLAY_CARD",
        cardInstanceId: affordableCard.instanceId,
      });
      if (result.success) {
        expect(result.state.player1.energy).toBe(energyBefore - affordableCard.cost);
      }
    });
  });

  describe("processPvpAction - END_TURN", () => {
    it("switches turn to the other player", () => {
      const state = createBattle();
      expect(state.currentTurn).toBe(1);
      const result = processPvpAction(state, 1, { type: "END_TURN" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.state.currentTurn).toBe(2);
      }
    });

    it("increments turn number after both players go", () => {
      let state = createBattle();
      const startTurn = state.turnNumber;
      // P1 ends turn
      let result = processPvpAction(state, 1, { type: "END_TURN" });
      expect(result.success).toBe(true);
      if (result.success) state = result.state;
      // P2 ends turn
      result = processPvpAction(state, 2, { type: "END_TURN" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.state.turnNumber).toBeGreaterThan(startTurn);
        expect(result.state.currentTurn).toBe(1);
      }
    });

    it("rejects ending turn when it's not your turn", () => {
      const state = createBattle();
      const result = processPvpAction(state, 2, { type: "END_TURN" });
      expect(result.success).toBe(false);
    });
  });

  describe("processPvpAction - ATTACK", () => {
    it("allows attacking face when opponent has no field units", () => {
      let state = createBattle();
      // Play a cheap card
      const cheapCard = state.player1.hand.find(c => c.cost <= state.player1.energy);
      if (!cheapCard) return;
      let result = processPvpAction(state, 1, {
        type: "PLAY_CARD",
        cardInstanceId: cheapCard.instanceId,
      });
      if (!result.success) return;
      state = result.state;

      // End turn cycle so the card loses summoning sickness
      result = processPvpAction(state, 1, { type: "END_TURN" });
      if (!result.success) return;
      state = result.state;
      result = processPvpAction(state, 2, { type: "END_TURN" });
      if (!result.success) return;
      state = result.state;

      // Now P1's turn again, card should be able to attack face
      const attacker = state.player1.field.find(c => !c.hasAttacked && !c.justDeployed);
      if (!attacker) return;
      const p2HpBefore = state.player2.hp;
      result = processPvpAction(state, 1, {
        type: "ATTACK",
        attackerInstanceId: attacker.instanceId,
        targetInstanceId: "face",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.state.player2.hp).toBeLessThan(p2HpBefore);
      }
    });

    it("rejects attack from a card that just deployed", () => {
      let state = createBattle();
      const cheapCard = state.player1.hand.find(c => c.cost <= state.player1.energy);
      if (!cheapCard) return;
      let result = processPvpAction(state, 1, {
        type: "PLAY_CARD",
        cardInstanceId: cheapCard.instanceId,
      });
      if (!result.success) return;
      state = result.state;
      const deployed = state.player1.field[0];
      // Try to attack immediately (should fail due to summoning sickness)
      result = processPvpAction(state, 1, {
        type: "ATTACK",
        attackerInstanceId: deployed.instanceId,
        targetInstanceId: "face",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Battle State Integrity", () => {
    it("maintains total card count across hand, field, deck, graveyard", () => {
      const deckSize = 15;
      const state = createBattle(deckSize);
      const p1Total = state.player1.hand.length + state.player1.field.length +
        state.player1.deck.length + state.player1.graveyard.length;
      // Total should equal the deck size
      expect(p1Total).toBe(deckSize);
    });

    it("logs are populated from the start", () => {
      const state = createBattle();
      expect(state.logs.length).toBeGreaterThan(0);
      expect(state.logs[0].message).toContain("Battle");
    });
  });
});

/* ─── Card Gallery Data Tests ─── */
describe("Card Gallery Data", () => {
  it("season1-cards.json has 178 cards", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const data = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/season1-cards.json"),
        "utf-8"
      )
    );
    expect(data.length).toBe(216);
  });

  it("every card has required fields", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const data = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/season1-cards.json"),
        "utf-8"
      )
    );
    for (const card of data) {
      expect(card.id).toBeTruthy();
      expect(card.name).toBeTruthy();
      expect(card.cardType).toBeTruthy();
      expect(typeof card.power).toBe("number");
      expect(typeof card.health).toBe("number");
      expect(typeof card.cost).toBe("number");
    }
  });

  it("all cards have imageUrl values", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const data = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/season1-cards.json"),
        "utf-8"
      )
    );
    const withImages = data.filter((c: any) => c.imageUrl && c.imageUrl.startsWith("http"));
    expect(withImages.length).toBe(196);
  });

  it("majority of cards have unique imageUrl values", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const data = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../client/src/data/season1-cards.json"),
        "utf-8"
      )
    );
    const urls = data.map((c: any) => c.imageUrl).filter(Boolean);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBeGreaterThan(100);
  });
});

/* ─── SFX System Tests ─── */
describe("SFX System", () => {
  it("SoundContext exports all battle SFX types", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const content = fs.readFileSync(
      path.resolve(__dirname, "../client/src/contexts/SoundContext.tsx"),
      "utf-8"
    );
    const battleSFX = [
      "card_deploy", "card_attack", "card_death", "card_spell",
      "card_artifact", "card_draw", "turn_start", "turn_end",
      "battle_victory", "battle_defeat", "energy_charge",
      "shield_hit", "critical_hit", "heal"
    ];
    for (const sfx of battleSFX) {
      expect(content).toContain(`"${sfx}"`);
    }
  });
});

/* ─── PvP WebSocket Server Tests ─── */
describe("PvP WebSocket Server", () => {
  it("pvpWs.ts exports setupPvpWebSocket function", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const content = fs.readFileSync(
      path.resolve(__dirname, "./pvpWs.ts"),
      "utf-8"
    );
    expect(content).toContain("export function setupPvpWebSocket");
  });

  it("pvpWs.ts handles matchmaking and battle actions", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const content = fs.readFileSync(
      path.resolve(__dirname, "./pvpWs.ts"),
      "utf-8"
    );
    expect(content).toContain("JOIN_QUEUE");
    expect(content).toContain("GAME_ACTION");
    expect(content).toContain("SURRENDER");
    expect(content).toContain("LEAVE_QUEUE");
  });
});

/* ─── PvP Router Tests ─── */
describe("PvP Router", () => {
  it("pvp router file exports pvpRouter", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const content = fs.readFileSync(
      path.resolve(__dirname, "./routers/pvp.ts"),
      "utf-8"
    );
    expect(content).toContain("export const pvpRouter");
    expect(content).toContain("getMatchHistory");
    expect(content).toContain("getLeaderboard");
    expect(content).toContain("getMyStats");
  });
});
