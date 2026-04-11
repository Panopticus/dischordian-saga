/* ═══════════════════════════════════════════════════════
   BOSS ABILITIES — Passive effect executors, arena hazards,
   and phase modifiers for the boss battle engine.

   Each boss has a unique passive (keyed by boss id) that
   mutates battle state when it triggers. Each boss room has
   an environmental hazard tied to its lore. Phase modifiers
   scale boss power as HP drops.
   ═══════════════════════════════════════════════════════ */
import type { BattleCard, BattlePlayer, BattleState } from "./cardBattle";

/* ─── BOSS EVENTS (for UI animations) ─── */
export interface BossEvent {
  kind:
    | "passive"
    | "hazard"
    | "phase"
    | "damage"
    | "heal"
    | "summon"
    | "buff"
    | "debuff"
    | "steal";
  actor: "boss" | "arena" | "system";
  message: string;
  /** instanceId, "player", or "boss" */
  target?: string;
  amount?: number;
  timestamp: number;
  /** Monotonic counter so React keys are stable */
  seq: number;
}

let eventSeq = 0;
export function nextEventSeq(): number {
  eventSeq++;
  return eventSeq;
}

/* ─── ABILITY CONTEXT ─── */
export interface BossAbilityContext {
  state: BattleState;
  /** The boss's BattlePlayer (state.enemy). */
  boss: BattlePlayer;
  /** The player's BattlePlayer (state.player). */
  player: BattlePlayer;
  log: (actor: "boss" | "system" | "enemy", message: string) => void;
  event: (e: Omit<BossEvent, "timestamp" | "seq">) => void;
}

export type BossPassiveEffect = (ctx: BossAbilityContext) => void;

/* ─── HELPERS ─── */
function randFrom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeBossInstanceId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function cloneAsFreshUnit(template: BattleCard, idPrefix: string, currentHP?: number): BattleCard {
  return {
    ...template,
    currentHP: currentHP ?? template.defense,
    hasAttacked: false,
    justDeployed: true,
    tempAttackMod: 0,
    tempDefenseMod: 0,
    instanceId: makeBossInstanceId(idPrefix),
  };
}

/* ═══════════════════════════════════════════════════════
   BOSS PASSIVE EFFECTS
   Keyed by boss id (from bossEncounters.ts)
   ═══════════════════════════════════════════════════════ */
export const BOSS_PASSIVE_EFFECTS: Record<string, BossPassiveEffect> = {
  /* ─── The Watcher — All-Seeing Eye ─── */
  "boss-watcher": ({ state, player, log, event }) => {
    const card = randFrom(player.hand);
    if (card) {
      log("boss", `ALL-SEEING EYE: ${card.name} lies in your hand. The Watcher sees all.`);
      event({
        kind: "passive",
        actor: "boss",
        message: `Revealed: ${card.name}`,
        target: card.instanceId,
      });
    }
    // Panoptic dread — player takes 1 HP damage from being observed
    state.player.hp = Math.max(0, state.player.hp - 1);
    log("system", `Panoptic dread drains 1 HP from you.`);
    event({
      kind: "damage",
      actor: "boss",
      message: "-1 HP",
      amount: 1,
      target: "player",
    });
  },

  /* ─── The Game Master — Rule Changer ─── */
  "boss-game-master": ({ boss, player, log, event }) => {
    const allUnits = [...boss.field, ...player.field];
    const target = randFrom(allUnits);
    if (!target) return;
    const oldAtk = target.attack + target.tempAttackMod;
    const oldDef = target.currentHP;
    // Swap: new attack = old defense, new current HP = old attack (min 1)
    const newAtkMod = Math.max(0, oldDef) - target.attack;
    target.tempAttackMod = newAtkMod;
    target.currentHP = Math.max(1, oldAtk);
    log("boss", `RULE CHANGER: ${target.name}'s stats swapped! (${oldAtk}/${oldDef} → ${oldDef}/${oldAtk})`);
    event({
      kind: "passive",
      actor: "boss",
      message: `${target.name} swapped`,
      target: target.instanceId,
    });
  },

  /* ─── The Meme — Shapeshifter ─── */
  "boss-meme": ({ boss, player, log, event }) => {
    const source = randFrom(player.field);
    if (!source) return;
    // Pick the weakest boss unit to shapeshift (makes it strongest)
    const sorted = [...boss.field].sort(
      (a, b) => (a.attack + a.tempAttackMod) - (b.attack + b.tempAttackMod)
    );
    const target = sorted[0];
    if (!target) return;
    const sourceAtk = source.attack + source.tempAttackMod;
    const sourceHP = source.currentHP;
    target.tempAttackMod = Math.max(target.tempAttackMod, sourceAtk - target.attack);
    target.currentHP = Math.max(target.currentHP, sourceHP);
    log("boss", `SHAPESHIFTER: ${target.name} copies ${source.name} (${sourceAtk}/${sourceHP}).`);
    event({
      kind: "passive",
      actor: "boss",
      message: `${target.name} copied ${source.name}`,
      target: target.instanceId,
    });
  },

  /* ─── The Collector — Hoarder ─── */
  "boss-collector": ({ boss, player, log, event }) => {
    if (player.graveyard.length === 0) return;
    // Steal the strongest unit in player's graveyard
    const stealable = player.graveyard.filter(c => c.type === "unit");
    if (stealable.length === 0) return;
    stealable.sort((a, b) => (b.attack + b.defense) - (a.attack + a.defense));
    const stolen = stealable[0];
    player.graveyard = player.graveyard.filter(c => c.instanceId !== stolen.instanceId);
    if (boss.field.length < 5) {
      boss.field.push(cloneAsFreshUnit(stolen, "stolen"));
      log("boss", `HOARDER: The Collector claims ${stolen.name} from your graveyard!`);
      event({
        kind: "steal",
        actor: "boss",
        message: `Stolen: ${stolen.name}`,
        target: "boss",
      });
    } else {
      boss.graveyard.push(cloneAsFreshUnit(stolen, "stolen"));
      log("boss", `HOARDER: The Collector catalogs ${stolen.name}.`);
      event({
        kind: "steal",
        actor: "boss",
        message: `Catalogued: ${stolen.name}`,
        target: "boss",
      });
    }
  },

  /* ─── The Necromancer — Undying Legion ─── */
  "boss-necromancer": ({ boss, log, event }) => {
    if (boss.field.length >= 5) return;
    const fallen = boss.graveyard.filter(c => c.type === "unit");
    if (fallen.length === 0) return;
    // Pick the strongest fallen unit
    fallen.sort((a, b) => (b.attack + b.defense) - (a.attack + a.defense));
    const revived = fallen[0];
    boss.graveyard = boss.graveyard.filter(c => c.instanceId !== revived.instanceId);
    const undead = cloneAsFreshUnit(revived, "revived", 1);
    undead.justDeployed = false; // can attack immediately
    undead.hasAttacked = true; // but not this turn
    boss.field.push(undead);
    log("boss", `UNDYING LEGION: ${revived.name} rises from death with 1 HP!`);
    event({
      kind: "summon",
      actor: "boss",
      message: `Revived: ${revived.name}`,
      target: undead.instanceId,
    });
  },

  /* ─── The Warlord — War Machine ─── */
  "boss-warlord": ({ boss, log, event }) => {
    if (boss.field.length === 0) return;
    boss.field.forEach(u => {
      u.tempAttackMod += 1;
    });
    log("boss", `WAR MACHINE: The Warlord's units gain +1 attack!`);
    event({
      kind: "buff",
      actor: "boss",
      message: "+1 ATK all",
      target: "boss",
    });
  },

  /* ─── The Source — Reality Warp ─── */
  "boss-source": ({ boss, player, log, event }) => {
    const allUnits = [...boss.field, ...player.field];
    const target = randFrom(allUnits);
    if (!target) return;
    // Randomly transform: -2..+3 attack shift, random HP tweak
    const atkDelta = Math.floor(Math.random() * 6) - 2;
    const hpDelta = Math.floor(Math.random() * 3) - 1;
    target.tempAttackMod += atkDelta;
    target.currentHP = Math.max(1, target.currentHP + hpDelta);
    log("boss", `REALITY WARP: ${target.name} shifts (${atkDelta >= 0 ? "+" : ""}${atkDelta} ATK, ${hpDelta >= 0 ? "+" : ""}${hpDelta} HP).`);
    event({
      kind: "passive",
      actor: "boss",
      message: `${target.name} warped`,
      target: target.instanceId,
    });
  },

  /* ─── The Architect — Grand Design ─── */
  "boss-architect": ({ boss, log, event }) => {
    boss.maxEnergy = Math.min(15, boss.maxEnergy + 1);
    boss.energy = Math.min(boss.maxEnergy, boss.energy + 1);
    log("boss", `GRAND DESIGN: The Architect's plan unfolds. Max energy: ${boss.maxEnergy}.`);
    event({
      kind: "buff",
      actor: "boss",
      message: `+1 max energy`,
      target: "boss",
    });
  },
};

/* ═══════════════════════════════════════════════════════
   ARENA HAZARDS — Environmental effects tied to boss rooms
   ═══════════════════════════════════════════════════════ */
export interface ArenaHazard {
  id: string;
  roomId: string;
  name: string;
  description: string;
  triggerEveryNTurns: number;
  effect: (ctx: BossAbilityContext) => void;
}

export const ARENA_HAZARDS: Record<string, ArenaHazard> = {
  "medical-bay": {
    id: "viral-mist",
    roomId: "medical-bay",
    name: "Viral Mist",
    description: "Toxic spores in the Medical Bay deal 1 damage to all units every 3 turns.",
    triggerEveryNTurns: 3,
    effect: ({ boss, player, log, event }) => {
      [...boss.field, ...player.field].forEach(u => {
        u.currentHP -= 1;
      });
      log("system", `ARENA: Viral Mist deals 1 damage to all units.`);
      event({
        kind: "hazard",
        actor: "arena",
        message: "Viral Mist (-1 all)",
        amount: 1,
      });
    },
  },

  "bridge": {
    id: "holo-static",
    roomId: "bridge",
    name: "Holographic Static",
    description: "Bridge holograms flicker — every 3 turns, all spells lose 1 power.",
    triggerEveryNTurns: 3,
    effect: ({ boss, player, log, event }) => {
      [...boss.hand, ...player.hand]
        .filter(c => c.type === "spell")
        .forEach(c => {
          c.tempAttackMod = Math.max(-c.attack + 1, c.tempAttackMod - 1);
        });
      log("system", `ARENA: Holographic Static drains 1 power from spells in hand.`);
      event({
        kind: "hazard",
        actor: "arena",
        message: "Holo Static",
      });
    },
  },

  "archives": {
    id: "info-overload",
    roomId: "archives",
    name: "Information Overload",
    description: "The Archives force both sides to discard a card every 4 turns.",
    triggerEveryNTurns: 4,
    effect: ({ boss, player, log, event }) => {
      if (boss.hand.length > 0) {
        const discard = boss.hand.shift()!;
        boss.graveyard.push(discard);
      }
      if (player.hand.length > 0) {
        const discard = player.hand.shift()!;
        player.graveyard.push(discard);
      }
      log("system", `ARENA: Information Overload — both sides discard a card.`);
      event({
        kind: "hazard",
        actor: "arena",
        message: "Information Overload",
      });
    },
  },

  "comms-array": {
    id: "signal-static",
    roomId: "comms-array",
    name: "Signal Static",
    description: "Communications are jammed — every 3 turns, all field units lose 1 attack.",
    triggerEveryNTurns: 3,
    effect: ({ boss, player, log, event }) => {
      [...boss.field, ...player.field].forEach(u => {
        u.tempAttackMod = Math.max(-u.attack, u.tempAttackMod - 1);
      });
      log("system", `ARENA: Signal Static garbles commands (-1 ATK to all).`);
      event({
        kind: "hazard",
        actor: "arena",
        message: "Signal Static (-1 ATK)",
      });
    },
  },

  "observation-deck": {
    id: "lingering-dread",
    roomId: "observation-deck",
    name: "Lingering Dread",
    description: "Nightmares seep from the Observation Deck — player loses 2 HP every 3 turns.",
    triggerEveryNTurns: 3,
    effect: ({ state, log, event }) => {
      state.player.hp = Math.max(0, state.player.hp - 2);
      log("system", `ARENA: Lingering Dread drains 2 HP from you.`);
      event({
        kind: "hazard",
        actor: "arena",
        message: "Lingering Dread (-2 HP)",
        amount: 2,
        target: "player",
      });
    },
  },

  "engineering": {
    id: "sparking-machinery",
    roomId: "engineering",
    name: "Sparking Machinery",
    description: "Broken conduits arc wildly — every 3 turns, deal 2 damage to a random unit.",
    triggerEveryNTurns: 3,
    effect: ({ boss, player, log, event }) => {
      const allUnits = [...boss.field, ...player.field];
      const target = randFrom(allUnits);
      if (target) {
        target.currentHP -= 2;
        log("system", `ARENA: Sparking Machinery strikes ${target.name} for 2.`);
        event({
          kind: "hazard",
          actor: "arena",
          message: `Sparks (${target.name} -2)`,
          amount: 2,
          target: target.instanceId,
        });
      }
    },
  },

  "cargo-hold": {
    id: "entropy-surge",
    roomId: "cargo-hold",
    name: "Entropy Surge",
    description: "Raw creative chaos randomizes unit stats every 2 turns.",
    triggerEveryNTurns: 2,
    effect: ({ boss, player, log, event }) => {
      [...boss.field, ...player.field].forEach(u => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1..+1
        u.tempAttackMod += delta;
      });
      log("system", `ARENA: Entropy Surge randomizes unit attack values.`);
      event({
        kind: "hazard",
        actor: "arena",
        message: "Entropy Surge",
      });
    },
  },

  "captains-quarters": {
    id: "perfect-order",
    roomId: "captains-quarters",
    name: "Perfect Order",
    description: "The Architect's room bends to the grand design — boss gains +1 max energy every 3 turns.",
    triggerEveryNTurns: 3,
    effect: ({ boss, log, event }) => {
      boss.maxEnergy = Math.min(15, boss.maxEnergy + 1);
      log("system", `ARENA: Perfect Order expands the boss's energy cap to ${boss.maxEnergy}.`);
      event({
        kind: "hazard",
        actor: "arena",
        message: `Perfect Order (+1 max energy)`,
      });
    },
  },
};

/* ═══════════════════════════════════════════════════════
   PHASE MODIFIERS — Stat scaling and behavior per phase
   ═══════════════════════════════════════════════════════ */
export interface PhaseModifier {
  phase: number;
  /** Permanent attack buff applied to boss units when phase is entered. */
  bossAttackBonus: number;
  /** Permanent defense buff applied to boss units when phase is entered. */
  bossDefenseBonus: number;
  /** Max-energy increase applied when phase is entered. */
  bossEnergyBonus: number;
  /** HP restored to boss on phase transition (phase heal). */
  bossHpHeal: number;
  /** Subtracted from passive triggerEveryNTurns (minimum 1). */
  passiveFrequencyMod: number;
  /** Background gradient class for the battle screen. */
  bgFromClass: string;
  /** Fallback dialog when boss encounter doesn't supply its own. */
  defaultDialog: string;
}

export const PHASE_MODIFIERS: Record<number, PhaseModifier> = {
  1: {
    phase: 1,
    bossAttackBonus: 0,
    bossDefenseBonus: 0,
    bossEnergyBonus: 0,
    bossHpHeal: 0,
    passiveFrequencyMod: 0,
    bgFromClass: "from-slate-900/20",
    defaultDialog: "",
  },
  2: {
    phase: 2,
    bossAttackBonus: 1,
    bossDefenseBonus: 1,
    bossEnergyBonus: 1,
    bossHpHeal: 0,
    passiveFrequencyMod: 0,
    bgFromClass: "from-purple-900/20",
    defaultDialog: "Impressive... but I am far from finished.",
  },
  3: {
    phase: 3,
    bossAttackBonus: 2,
    bossDefenseBonus: 1,
    bossEnergyBonus: 2,
    bossHpHeal: 0,
    passiveFrequencyMod: 1,
    bgFromClass: "from-red-900/20",
    defaultDialog: "You think you have won? THIS IS MY FINAL FORM!",
  },
};

export function applyPhaseModifier(boss: BattlePlayer, phase: number): void {
  const mod = PHASE_MODIFIERS[phase];
  if (!mod) return;
  boss.field.forEach(u => {
    u.tempAttackMod += mod.bossAttackBonus;
    u.tempDefenseMod += mod.bossDefenseBonus;
    u.currentHP += mod.bossDefenseBonus; // defense buff also heals
  });
  boss.maxEnergy = Math.min(15, boss.maxEnergy + mod.bossEnergyBonus);
  boss.hp = Math.min(boss.maxHP, boss.hp + mod.bossHpHeal);
}

export function getEffectivePassiveFrequency(basePassive: number, phase: number): number {
  const mod = PHASE_MODIFIERS[phase];
  if (!mod) return basePassive;
  return Math.max(1, basePassive - mod.passiveFrequencyMod);
}

/* ═══════════════════════════════════════════════════════
   LOOKUP HELPERS
   ═══════════════════════════════════════════════════════ */
export function getBossPassiveEffect(bossId: string): BossPassiveEffect | null {
  return BOSS_PASSIVE_EFFECTS[bossId] || null;
}

export function getArenaHazard(roomId: string): ArenaHazard | null {
  return ARENA_HAZARDS[roomId] || null;
}
