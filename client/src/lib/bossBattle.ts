/* ═══════════════════════════════════════════════════════
   BOSS BATTLE ENGINE - Extends cardBattle with boss mechanics
   ═══════════════════════════════════════════════════════ */
import type { StarterCard } from "@/components/StarterDeckViewer";
import type { BattleState, BattleAction, BattleCard } from "./cardBattle";
import { initBattle, processBattleAction } from "./cardBattle";
import type { BossEncounter } from "@/data/bossEncounters";

export interface BossBattleState extends BattleState {
  bossId: string;
  bossName: string;
  bossImage: string;
  bossPassive: { name: string; description: string; triggerEveryNTurns: number };
  bossPhase: number;
  bossDialog: string | null;
  passiveTriggeredThisTurn: boolean;
}

let bossInstanceCounter = 0;

function toBossBattleCard(card: Omit<StarterCard, "id">, idPrefix: string): BattleCard {
  bossInstanceCounter++;
  return {
    ...card,
    id: `${idPrefix}-${bossInstanceCounter}`,
    imageUrl: card.imageUrl || "",
    currentHP: card.defense,
    hasAttacked: false,
    justDeployed: true,
    tempAttackMod: 0,
    tempDefenseMod: 0,
    instanceId: `boss-inst-${Date.now()}-${bossInstanceCounter}`,
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initBossBattle(
  playerDeck: StarterCard[],
  boss: BossEncounter
): BossBattleState {
  const difficultyMap: Record<string, BattleState["difficulty"]> = {
    easy: "easy",
    normal: "normal",
    hard: "hard",
    legendary: "hard",
  };

  const baseState = initBattle(playerDeck, "corrupted-sentinel", difficultyMap[boss.difficulty] || "hard");

  const bossDeck = boss.deck.map((c, i) => toBossBattleCard(c, `boss-${i}`));
  const shuffled = shuffleArray(bossDeck);
  const hand = shuffled.splice(0, Math.min(4, shuffled.length));

  const bossState: BossBattleState = {
    ...baseState,
    enemy: {
      hp: boss.hp,
      maxHP: boss.hp,
      energy: 2,
      maxEnergy: 2,
      hand,
      field: [],
      deck: shuffled,
      graveyard: [],
    },
    bossId: boss.id,
    bossName: boss.name,
    bossImage: boss.image,
    bossPassive: boss.passiveAbility,
    bossPhase: 1,
    bossDialog: boss.taunt,
    passiveTriggeredThisTurn: false,
    logs: [
      { turn: 1, actor: "system", message: `BOSS BATTLE: ${boss.name} appears!`, timestamp: Date.now() },
      { turn: 1, actor: "enemy", message: `"${boss.taunt}"`, timestamp: Date.now() },
    ],
  };

  return bossState;
}

export function processBossAction(state: BossBattleState, action: BattleAction): BossBattleState {
  const newState = { ...processBattleAction(state, action) } as BossBattleState;

  newState.bossId = state.bossId;
  newState.bossName = state.bossName;
  newState.bossImage = state.bossImage;
  newState.bossPassive = state.bossPassive;
  newState.bossPhase = state.bossPhase;
  newState.bossDialog = null;
  newState.passiveTriggeredThisTurn = false;

  const hpPercent = newState.enemy.hp / newState.enemy.maxHP;
  if (hpPercent <= 0.33 && state.bossPhase < 3) {
    newState.bossPhase = 3;
    newState.bossDialog = "You think you have won? THIS IS MY FINAL FORM!";
    newState.enemy.maxEnergy = Math.min(10, newState.enemy.maxEnergy + 2);
    newState.logs.push({ turn: newState.turnNumber, actor: "system", message: "BOSS ENTERS PHASE 3! Energy surges!", timestamp: Date.now() });
  } else if (hpPercent <= 0.66 && state.bossPhase < 2) {
    newState.bossPhase = 2;
    newState.bossDialog = "Impressive... but I am far from finished.";
    newState.enemy.maxEnergy = Math.min(10, newState.enemy.maxEnergy + 1);
    newState.logs.push({ turn: newState.turnNumber, actor: "system", message: "BOSS ENTERS PHASE 2! Power increases!", timestamp: Date.now() });
  }

  if (action.type === "END_TURN" && state.bossPassive.triggerEveryNTurns > 0) {
    if (newState.turnNumber % state.bossPassive.triggerEveryNTurns === 0) {
      newState.passiveTriggeredThisTurn = true;
      newState.logs.push({
        turn: newState.turnNumber,
        actor: "enemy",
        message: `PASSIVE: ${state.bossPassive.name} - ${state.bossPassive.description}`,
        timestamp: Date.now(),
      });
    }
  }

  return newState;
}

export function checkBossPassive(state: BossBattleState): boolean {
  if (!state.bossPassive || state.bossPassive.triggerEveryNTurns === 0) return false;
  return state.turnNumber % state.bossPassive.triggerEveryNTurns === 0;
}
