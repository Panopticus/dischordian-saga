/* ═══════════════════════════════════════════════════════
   BOSS BATTLE ENGINE — Extends cardBattle with:
   • Phase transitions (HP-gated) with stat scaling
   • Passive ability execution from bossAbilities.ts
   • Arena hazards tied to boss rooms
   • Boss-specific AI post-processing (phase-aware)
   • Mastery bonus consumption (damage / defense reduction)
   • UI event queue for animations
   ═══════════════════════════════════════════════════════ */
import type { StarterCard } from "@/components/StarterDeckViewer";
import type { BattleState, BattleAction, BattleCard } from "./cardBattle";
import { initBattle, processBattleAction } from "./cardBattle";
import type { BossEncounter } from "@/data/bossEncounters";
import {
  type BossEvent,
  nextEventSeq,
  getBossPassiveEffect,
  getArenaHazard,
  applyPhaseModifier,
  getEffectivePassiveFrequency,
  PHASE_MODIFIERS,
} from "./bossAbilities";

export interface BossMasteryBonuses {
  bossDamageMultiplier: number;
  bossDefenseReduction: number;
  lootQualityMultiplier: number;
  masteryXpMultiplier: number;
}

const DEFAULT_BONUSES: BossMasteryBonuses = {
  bossDamageMultiplier: 1,
  bossDefenseReduction: 0,
  lootQualityMultiplier: 1,
  masteryXpMultiplier: 1,
};

export interface BossBattleState extends BattleState {
  bossId: string;
  bossName: string;
  bossImage: string;
  bossRoomId: string;
  bossPassive: {
    name: string;
    description: string;
    triggerEveryNTurns: number;
  };
  bossPhase: number;
  bossDialog: string | null;
  passiveTriggeredThisTurn: boolean;
  /** UI event queue for animations (damage popups, phase flashes, etc.) */
  pendingEvents: BossEvent[];
  /** Flag set when a phase transition JUST happened — drives cutscene overlay. */
  phaseJustChanged: boolean;
  /** Arena hazard for this boss's room, or null if none. */
  arenaHazard: {
    id: string;
    name: string;
    description: string;
    triggerEveryNTurns: number;
  } | null;
  hazardTriggeredThisTurn: boolean;
  /** Mastery bonuses applied to this battle. */
  mastery: BossMasteryBonuses;
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

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
export function initBossBattle(
  playerDeck: StarterCard[],
  boss: BossEncounter,
  masteryBonuses: BossMasteryBonuses = DEFAULT_BONUSES,
): BossBattleState {
  const difficultyMap: Record<string, BattleState["difficulty"]> = {
    easy: "easy",
    normal: "normal",
    hard: "hard",
    legendary: "hard",
  };

  const baseState = initBattle(
    playerDeck,
    "corrupted-sentinel",
    difficultyMap[boss.difficulty] || "hard",
  );

  const bossDeck = boss.deck.map((c, i) => toBossBattleCard(c, `boss-${i}`));
  const shuffled = shuffleArray(bossDeck);
  const hand = shuffled.splice(0, Math.min(4, shuffled.length));

  // Apply mastery bonuses to HP pools
  // Damage multiplier: boss starts with proportionally lower HP
  const effectiveBossHp = Math.max(
    5,
    Math.round(boss.hp / Math.max(0.5, masteryBonuses.bossDamageMultiplier)),
  );
  // Defense reduction: player gets proportionally more HP (extra cushion)
  const playerHpBonus = Math.round(
    baseState.player.maxHP * Math.min(0.5, masteryBonuses.bossDefenseReduction),
  );
  baseState.player.hp += playerHpBonus;
  baseState.player.maxHP += playerHpBonus;

  const hazard = getArenaHazard(boss.roomId);

  const bossState: BossBattleState = {
    ...baseState,
    enemy: {
      hp: effectiveBossHp,
      maxHP: effectiveBossHp,
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
    bossRoomId: boss.roomId,
    bossPassive: boss.passiveAbility,
    bossPhase: 1,
    bossDialog: boss.taunt,
    passiveTriggeredThisTurn: false,
    pendingEvents: [],
    phaseJustChanged: false,
    arenaHazard: hazard
      ? {
          id: hazard.id,
          name: hazard.name,
          description: hazard.description,
          triggerEveryNTurns: hazard.triggerEveryNTurns,
        }
      : null,
    hazardTriggeredThisTurn: false,
    mastery: masteryBonuses,
    logs: [
      {
        turn: 1,
        actor: "system",
        message: `BOSS BATTLE: ${boss.name} appears!`,
        timestamp: Date.now(),
      },
      {
        turn: 1,
        actor: "enemy",
        message: `"${boss.taunt}"`,
        timestamp: Date.now(),
      },
    ],
  };

  if (hazard) {
    bossState.logs.push({
      turn: 1,
      actor: "system",
      message: `ARENA HAZARD: ${hazard.name} — ${hazard.description}`,
      timestamp: Date.now(),
    });
  }

  if (playerHpBonus > 0) {
    bossState.logs.push({
      turn: 1,
      actor: "system",
      message: `Mastery bonus: +${playerHpBonus} HP (defense reduction).`,
      timestamp: Date.now(),
    });
  }

  return bossState;
}

/* ═══════════════════════════════════════════════════════
   INTERNAL HELPERS (mutating — for post-base-engine passes)
   ═══════════════════════════════════════════════════════ */
function pushLog(
  state: BossBattleState,
  actor: "boss" | "system" | "enemy" | "player",
  message: string,
): void {
  state.logs.push({
    turn: state.turnNumber,
    actor: actor === "boss" ? "enemy" : actor,
    message,
    timestamp: Date.now(),
  });
}

function pushEvent(
  state: BossBattleState,
  partial: Omit<BossEvent, "timestamp" | "seq">,
): void {
  state.pendingEvents.push({
    ...partial,
    timestamp: Date.now(),
    seq: nextEventSeq(),
  });
}

function makeAbilityContext(state: BossBattleState) {
  return {
    state,
    boss: state.enemy,
    player: state.player,
    log: (actor: "boss" | "system" | "enemy", msg: string) => pushLog(state, actor, msg),
    event: (e: Omit<BossEvent, "timestamp" | "seq">) => pushEvent(state, e),
  };
}

/** Remove dead units after passive/hazard effects mutate HP. */
function reapDeadUnits(state: BossBattleState): void {
  for (const who of ["player", "enemy"] as const) {
    const p = who === "player" ? state.player : state.enemy;
    const dead = p.field.filter(c => c.currentHP <= 0);
    if (dead.length === 0) continue;
    p.field = p.field.filter(c => c.currentHP > 0);
    dead.forEach(c => {
      p.graveyard.push(c);
      pushLog(state, "system", `${c.name} is destroyed!`);
    });
  }
  if (state.player.hp <= 0 && !state.winner) {
    state.winner = "enemy";
    state.phase = "GAME_OVER";
    pushLog(state, "system", "You have been defeated...");
  } else if (state.enemy.hp <= 0 && !state.winner) {
    state.winner = "player";
    state.phase = "GAME_OVER";
    pushLog(state, "system", "Victory! The boss has been vanquished!");
  }
}

/* ═══════════════════════════════════════════════════════
   PHASE TRANSITIONS
   ═══════════════════════════════════════════════════════ */
function checkAndApplyPhaseTransition(
  state: BossBattleState,
  prevPhase: number,
): void {
  const hpPercent = state.enemy.maxHP > 0 ? state.enemy.hp / state.enemy.maxHP : 1;
  let targetPhase = prevPhase;
  if (hpPercent <= 0.33) targetPhase = 3;
  else if (hpPercent <= 0.66) targetPhase = 2;
  else targetPhase = 1;

  if (targetPhase <= prevPhase) return;

  // Cascade through phases so we don't skip buffs if boss takes massive damage
  for (let p = prevPhase + 1; p <= targetPhase; p++) {
    const mod = PHASE_MODIFIERS[p];
    if (!mod) continue;
    applyPhaseModifier(state.enemy, p);
    state.bossPhase = p;
    state.phaseJustChanged = true;
    state.bossDialog = mod.defaultDialog || state.bossDialog;
    pushLog(
      state,
      "system",
      `═══ BOSS ENTERS PHASE ${p} ═══ ATK+${mod.bossAttackBonus}, DEF+${mod.bossDefenseBonus}, +${mod.bossEnergyBonus} max energy`,
    );
    if (mod.defaultDialog) {
      pushLog(state, "boss", `"${mod.defaultDialog}"`);
    }
    pushEvent(state, {
      kind: "phase",
      actor: "system",
      message: `PHASE ${p}`,
      amount: p,
    });
  }
}

/* ═══════════════════════════════════════════════════════
   PASSIVE / HAZARD EXECUTION
   ═══════════════════════════════════════════════════════ */
function runPassive(state: BossBattleState): void {
  const effect = getBossPassiveEffect(state.bossId);
  if (!effect) {
    // Fallback: log the description so the player knows SOMETHING happened
    pushLog(state, "boss", `PASSIVE: ${state.bossPassive.name} — ${state.bossPassive.description}`);
    pushEvent(state, {
      kind: "passive",
      actor: "boss",
      message: state.bossPassive.name,
    });
    return;
  }
  pushLog(state, "boss", `═══ PASSIVE: ${state.bossPassive.name} ═══`);
  effect(makeAbilityContext(state));
  state.passiveTriggeredThisTurn = true;
}

function runHazard(state: BossBattleState): void {
  if (!state.arenaHazard) return;
  const hazard = getArenaHazard(state.bossRoomId);
  if (!hazard) return;
  pushLog(state, "system", `═══ ARENA: ${hazard.name} ═══`);
  hazard.effect(makeAbilityContext(state));
  state.hazardTriggeredThisTurn = true;
}

/* ═══════════════════════════════════════════════════════
   BOSS-SPECIFIC AI ENHANCEMENTS
   Runs AFTER the base cardBattle engine has executed the
   enemy turn. Adds phase-aware aggression, summons, and
   boss-theme decisions.
   ═══════════════════════════════════════════════════════ */
function enhanceBossAi(state: BossBattleState): void {
  if (state.winner) return;
  const enemy = state.enemy;
  const player = state.player;

  // Phase 2+: if boss field is empty but it has units in hand it couldn't afford,
  // give it a small energy refund so it can deploy something (the Grand Design).
  if (state.bossPhase >= 2 && enemy.field.length === 0 && enemy.hand.length > 0) {
    const cheapest = enemy.hand
      .filter(c => c.type === "unit")
      .sort((a, b) => a.cost - b.cost)[0];
    if (cheapest && cheapest.cost > enemy.energy) {
      enemy.energy = cheapest.cost;
      pushLog(state, "system", `${state.bossName} channels phase power and summons forth!`);
    }
  }

  // Phase 3: if the boss is still losing, grant a single "rage swing" — boss units
  // that can attack gain +1 attack until end of next turn.
  if (state.bossPhase === 3 && enemy.field.length > 0) {
    const playerTotal = player.field.reduce(
      (s, c) => s + (c.attack + c.tempAttackMod) + c.currentHP,
      0,
    );
    const bossTotal = enemy.field.reduce(
      (s, c) => s + (c.attack + c.tempAttackMod) + c.currentHP,
      0,
    );
    if (bossTotal < playerTotal) {
      enemy.field.forEach(u => {
        u.tempAttackMod += 1;
      });
      pushLog(state, "system", `${state.bossName} unleashes desperate fury! Boss units +1 ATK.`);
      pushEvent(state, {
        kind: "buff",
        actor: "boss",
        message: "Desperate fury +1 ATK",
        target: "boss",
      });
    }
  }

  // Theme-specific reinforcement for Necromancer: auto-revive at low graveyard
  if (
    state.bossId === "boss-necromancer" &&
    enemy.field.length < 3 &&
    enemy.graveyard.length >= 2 &&
    state.turnNumber % 2 === 0
  ) {
    const candidate = enemy.graveyard
      .filter(c => c.type === "unit")
      .sort((a, b) => (b.attack + b.defense) - (a.attack + a.defense))[0];
    if (candidate) {
      enemy.graveyard = enemy.graveyard.filter(c => c.instanceId !== candidate.instanceId);
      enemy.field.push({
        ...candidate,
        currentHP: Math.max(1, Math.floor(candidate.defense / 2)),
        hasAttacked: true,
        justDeployed: false,
        tempAttackMod: 0,
        tempDefenseMod: 0,
        instanceId: `ai-revive-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      });
      pushLog(state, "boss", `The Necromancer whispers — ${candidate.name} stirs on the field.`);
      pushEvent(state, {
        kind: "summon",
        actor: "boss",
        message: `Necro-revive: ${candidate.name}`,
        target: "boss",
      });
    }
  }
}

/* ═══════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════ */
export function processBossAction(
  state: BossBattleState,
  action: BattleAction,
): BossBattleState {
  // Run base card battle action. Note: base engine deep-clones state, so the
  // returned object is a safe-to-mutate copy (without boss-specific fields).
  const baseNext = processBattleAction(state, action);
  const newState: BossBattleState = {
    ...baseNext,
    bossId: state.bossId,
    bossName: state.bossName,
    bossImage: state.bossImage,
    bossRoomId: state.bossRoomId,
    bossPassive: state.bossPassive,
    bossPhase: state.bossPhase,
    bossDialog: null,
    passiveTriggeredThisTurn: false,
    pendingEvents: [],
    phaseJustChanged: false,
    arenaHazard: state.arenaHazard,
    hazardTriggeredThisTurn: false,
    mastery: state.mastery,
  };

  // Carry over phaseJustChanged momentarily? No — we want it reset each action so
  // the UI only flashes the cutscene on the turn a phase is entered.

  const prevPhase = state.bossPhase;

  // 1. Apply HP-based phase transitions (which buff boss stats)
  checkAndApplyPhaseTransition(newState, prevPhase);

  // 2. On END_TURN: maybe trigger passive & arena hazard
  if (action.type === "END_TURN" && !newState.winner) {
    const effectiveFreq = getEffectivePassiveFrequency(
      state.bossPassive.triggerEveryNTurns,
      newState.bossPhase,
    );
    if (effectiveFreq > 0 && newState.turnNumber % effectiveFreq === 0) {
      runPassive(newState);
    }
    const hazard = newState.arenaHazard;
    if (hazard && newState.turnNumber % hazard.triggerEveryNTurns === 0) {
      runHazard(newState);
    }
    // 3. Phase-aware AI enhancement
    enhanceBossAi(newState);
    // 4. Clean up any deaths caused by passives/hazards/ai
    reapDeadUnits(newState);
    // 5. Re-check phase transition in case passive/hazard dropped boss HP
    checkAndApplyPhaseTransition(newState, newState.bossPhase);
  }

  return newState;
}

export function checkBossPassive(state: BossBattleState): boolean {
  if (!state.bossPassive || state.bossPassive.triggerEveryNTurns === 0) return false;
  const effective = getEffectivePassiveFrequency(
    state.bossPassive.triggerEveryNTurns,
    state.bossPhase,
  );
  return state.turnNumber % effective === 0;
}

/* ═══════════════════════════════════════════════════════
   DYNAMIC LOOT — mastery-scaled reward generation
   ═══════════════════════════════════════════════════════ */
export interface ScaledRewards {
  xp: number;
  dreamTokens: number;
  materials: { id: string; quantity: number }[];
  bonusCardDrop: boolean;
  lootQualityMultiplier: number;
  masteryXpMultiplier: number;
  tier: "standard" | "rare" | "epic" | "mythic";
}

export function computeScaledRewards(
  boss: BossEncounter,
  bonuses: BossMasteryBonuses,
  fightDurationSeconds: number,
): ScaledRewards {
  const lootMult = Math.max(0.5, bonuses.lootQualityMultiplier);
  const xpMult = Math.max(0.5, bonuses.masteryXpMultiplier);

  // Determine tier from combined multiplier
  let tier: ScaledRewards["tier"] = "standard";
  const combined = lootMult * xpMult;
  if (combined >= 2.0) tier = "mythic";
  else if (combined >= 1.5) tier = "epic";
  else if (combined >= 1.2) tier = "rare";

  // Speed bonus — finish fast, get extra XP (caps at +25%)
  const speedBonus =
    fightDurationSeconds > 0 && fightDurationSeconds < 120
      ? Math.min(0.25, (120 - fightDurationSeconds) / 480)
      : 0;

  const baseXp = boss.rewards.xp;
  const baseTokens = boss.rewards.dreamTokens;

  const scaledXp = Math.round(baseXp * xpMult * (1 + speedBonus));
  const scaledTokens = Math.round(baseTokens * lootMult);

  // Material drops scale with loot tier
  const materials: ScaledRewards["materials"] = [
    { id: "void_catalyst", quantity: Math.max(1, Math.round(2 * lootMult)) },
    { id: "dream_shard", quantity: Math.max(1, Math.round(3 * lootMult)) },
    { id: "neural_thread", quantity: Math.max(1, Math.round(1 * lootMult)) },
  ];

  if (tier === "epic" || tier === "mythic") {
    materials.push({ id: "boss_essence", quantity: tier === "mythic" ? 3 : 1 });
  }
  if (tier === "mythic") {
    materials.push({ id: "rare_catalyst", quantity: 2 });
  }

  // Bonus legendary card drop at mythic tier or with loot mult > 1.75
  const bonusCardDrop = tier === "mythic" || lootMult >= 1.75;

  return {
    xp: scaledXp,
    dreamTokens: scaledTokens,
    materials,
    bonusCardDrop,
    lootQualityMultiplier: lootMult,
    masteryXpMultiplier: xpMult,
    tier,
  };
}
