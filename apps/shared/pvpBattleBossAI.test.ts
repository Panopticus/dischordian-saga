/**
 * pvpBattleBossAI tests — verifies the boss heuristic chooses
 * sensible actions on simple PvpBattleState fixtures.
 */
import { describe, it, expect } from "vitest";
import { chooseBossAction, planBossTurn } from "./pvpBattleBossAI";
import { initPvpBattle, processPvpAction, type DeckCard } from "./pvpBattle";

const HUMAN_ID = 1;
const BOSS_ID = -1_000_000;

function deck(n: number, costBase = 1): DeckCard[] {
  return Array.from({ length: n }, (_, i) => ({
    cardId: `test_card_${i}`,
    name: `Test Card ${i}`,
    type: "unit",
    rarity: "common",
    attack: 2 + (i % 3),
    defense: 3 + (i % 3),
    cost: costBase + (i % 4),
    ability: "",
    imageUrl: "",
  }));
}

describe("chooseBossAction", () => {
  it("ends turn when nothing playable and no attackers", () => {
    const state = initPvpBattle("m", { id: HUMAN_ID, name: "Human", deck: deck(8, 5) }, { id: BOSS_ID, name: "Boss", deck: deck(8, 5) });
    // Boss has cost-5+ cards but only 1 energy → none affordable.
    // Boss has no field units → no attackers.
    state.currentTurn = BOSS_ID;
    const decision = chooseBossAction(state, BOSS_ID);
    expect(decision.action.type).toBe("END_TURN");
  });

  it("plays the most-expensive affordable card from hand", () => {
    const state = initPvpBattle("m", { id: HUMAN_ID, name: "Human", deck: deck(8, 1) }, { id: BOSS_ID, name: "Boss", deck: deck(8, 1) });
    // Force boss to have 5 energy so multiple cards are affordable.
    const boss = state.player1.id === BOSS_ID ? state.player1 : state.player2;
    boss.energy = 5;
    state.currentTurn = BOSS_ID;
    const decision = chooseBossAction(state, BOSS_ID);
    expect(decision.action.type).toBe("PLAY_CARD");
    if (decision.action.type === "PLAY_CARD") {
      const played = boss.hand.find((c) => c.instanceId === decision.action.cardInstanceId);
      expect(played).toBeDefined();
      // Should be the highest-cost affordable card.
      const maxAffordableCost = Math.max(...boss.hand.filter((c) => c.cost <= 5).map((c) => c.cost));
      expect(played?.cost).toBe(maxAffordableCost);
    }
  });

  it("attacks face when no enemy minions on board", () => {
    const state = initPvpBattle("m", { id: HUMAN_ID, name: "Human", deck: deck(8, 1) }, { id: BOSS_ID, name: "Boss", deck: deck(8, 1) });
    const boss = state.player1.id === BOSS_ID ? state.player1 : state.player2;
    // Inject a board minion that's ready to attack.
    boss.field.push({
      instanceId: "boss-attacker-1",
      cardId: "boss_attacker",
      name: "Boss Attacker",
      type: "unit",
      rarity: "common",
      attack: 3,
      defense: 4,
      cost: 2,
      ability: "",
      imageUrl: "",
      currentHP: 4,
      hasAttacked: false,
      justDeployed: false,
      tempAttackMod: 0,
      tempDefenseMod: 0,
    });
    boss.energy = 0; // No more cards playable.
    state.currentTurn = BOSS_ID;
    const decision = chooseBossAction(state, BOSS_ID);
    expect(decision.action.type).toBe("ATTACK");
    if (decision.action.type === "ATTACK") {
      expect(decision.action.attackerInstanceId).toBe("boss-attacker-1");
      expect(decision.action.targetInstanceId).toBe("face");
    }
  });

  it("prefers killing the lowest-HP enemy minion over face", () => {
    const state = initPvpBattle("m", { id: HUMAN_ID, name: "Human", deck: deck(8, 1) }, { id: BOSS_ID, name: "Boss", deck: deck(8, 1) });
    const boss = state.player1.id === BOSS_ID ? state.player1 : state.player2;
    const human = state.player1.id === HUMAN_ID ? state.player1 : state.player2;
    boss.field.push({
      instanceId: "boss-attacker-1",
      cardId: "boss_attacker",
      name: "Boss Attacker", type: "unit", rarity: "common",
      attack: 5, defense: 5, cost: 2, ability: "", imageUrl: "",
      currentHP: 5, hasAttacked: false, justDeployed: false,
      tempAttackMod: 0, tempDefenseMod: 0,
    });
    human.field.push({
      instanceId: "human-tough", cardId: "human_tough", name: "Tough", type: "unit", rarity: "common",
      attack: 3, defense: 6, cost: 2, ability: "", imageUrl: "",
      currentHP: 6, hasAttacked: true, justDeployed: false,
      tempAttackMod: 0, tempDefenseMod: 0,
    });
    human.field.push({
      instanceId: "human-fragile", cardId: "human_fragile", name: "Fragile", type: "unit", rarity: "common",
      attack: 2, defense: 1, cost: 1, ability: "", imageUrl: "",
      currentHP: 1, hasAttacked: true, justDeployed: false,
      tempAttackMod: 0, tempDefenseMod: 0,
    });
    boss.energy = 0;
    state.currentTurn = BOSS_ID;
    const decision = chooseBossAction(state, BOSS_ID);
    expect(decision.action.type).toBe("ATTACK");
    if (decision.action.type === "ATTACK") {
      expect(decision.action.targetInstanceId).toBe("human-fragile");
    }
  });

  it("delayMs is positive between actions, smaller before END_TURN", () => {
    const state = initPvpBattle("m", { id: HUMAN_ID, name: "Human", deck: deck(8, 5) }, { id: BOSS_ID, name: "Boss", deck: deck(8, 5) });
    state.currentTurn = BOSS_ID;
    const endDecision = chooseBossAction(state, BOSS_ID);
    expect(endDecision.delayMs).toBeGreaterThan(0);
    expect(endDecision.delayMs).toBeLessThan(1000);
  });
});

describe("planBossTurn", () => {
  it("terminates on END_TURN", () => {
    const state = initPvpBattle("m", { id: HUMAN_ID, name: "Human", deck: deck(8, 5) }, { id: BOSS_ID, name: "Boss", deck: deck(8, 5) });
    state.currentTurn = BOSS_ID;
    const actions = planBossTurn(state, BOSS_ID, (s, a) => {
      const r = processPvpAction(s, BOSS_ID, a);
      return r.success ? r.state : s;
    });
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[actions.length - 1].type).toBe("END_TURN");
  });

  it("respects the maxActions safety cap", () => {
    const state = initPvpBattle("m", { id: HUMAN_ID, name: "Human", deck: deck(8, 1) }, { id: BOSS_ID, name: "Boss", deck: deck(8, 1) });
    state.currentTurn = BOSS_ID;
    // Force a hostile simulate that never advances energy or hand,
    // so the heuristic keeps wanting to play but the state never
    // changes — cap should kick in.
    const actions = planBossTurn(state, BOSS_ID, (s) => s, 5);
    expect(actions.length).toBeLessThanOrEqual(6); // 5 actions + forced END_TURN
    expect(actions[actions.length - 1].type).toBe("END_TURN");
  });
});
