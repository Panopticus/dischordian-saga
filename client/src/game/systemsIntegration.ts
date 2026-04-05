/* ═══════════════════════════════════════════════════════
   SYSTEMS INTEGRATION HUB — Connects "orphaned" systems
   into live game state.

   The audit identified several large systems that were
   designed but never imported. This file wires them in
   so they actually affect gameplay.

   Instead of deleting these systems, we CONNECT them.
   ═══════════════════════════════════════════════════════ */

import { getAllActiveBonuses, TRUST_COMBAT_BONUSES, getAvailableKeepsakes, KEEPSAKE_TRINKETS, getCurrentEpisode, NARRATIVE_EPISODES, getCombatNarration, ANTIQUARIAN_COMBAT_NARRATION } from "./narrativeSystems";
import { getTrustBonuses } from "./narrativeSystems";
import { getRenownLevel, RENOWN_LEVELS, LIMIT_BREAKS, NPC_SUMMONS, calculateThreatLevel } from "./progressionSystems";
import { AUGMENTATIONS } from "./investigationSystems";
import { getAvailableMoralityEquipment, MORALITY_EQUIPMENT } from "./persistentWorld";
import { BREADCRUMB_CHAINS, EQUIPMENT_NARRATIVES, getEquipmentNarrative, BOSS_MECHANICS, SOUL_STAKE_CONFIG, calculateStakePayout, LIVING_CONSEQUENCES, getActiveConsequences } from "./explorationSystems";
import { getExtinctRace, EXTINCT_RACES, getRemnantsByGameMode } from "./extinctRaces";
import { PET_EVOLUTIONS, getEvolutionStage, calculateMoralityDissonance, DEFAULT_PET_BOND } from "./petBonding";
import { ARENA_STORY_MODES, getNextStory, getAvailableFighters, COLLECTORS_ARENA_LORE } from "./arenaWorldLore";
import { processDeath, getSoulStatus, DEFAULT_SOUL_STATE, RESURRECTION_UNLOCKS } from "./deathAndResurrection";
import { calculatePullRarity, PITY_CONFIG, CARD_VARIANTS } from "./cardGameDepth";

/* ─── EXPORTS: Single-point access for all connected systems ─── */

export const ConnectedSystems = {
  // Trust combat bonuses — now affect actual combat
  trustBonuses: {
    getAll: getAllActiveBonuses,
    getForNPC: getTrustBonuses,
    definitions: TRUST_COMBAT_BONUSES,
  },

  // Keepsake trinkets — passive bonuses from NPCs at trust 50+
  keepsakes: {
    getAvailable: getAvailableKeepsakes,
    definitions: KEEPSAKE_TRINKETS,
  },

  episodes: {
    getCurrent: getCurrentEpisode,
    all: NARRATIVE_EPISODES,
  },

  combatNarration: {
    getLine: getCombatNarration,
    all: ANTIQUARIAN_COMBAT_NARRATION,
  },

  // Renown system — 7 levels from Unknown to Eternal
  renown: {
    getLevel: getRenownLevel,
    levels: RENOWN_LEVELS,
  },

  // Class Limit Breaks — FF-style ultimates
  limitBreaks: LIMIT_BREAKS,

  // NPC Summons — call NPCs as combat assists at trust 80+
  npcSummons: NPC_SUMMONS,

  // Augmentations — Cyberpunk cyberware slots
  augmentations: AUGMENTATIONS,

  moralityEquipment: {
    getAvailable: getAvailableMoralityEquipment,
    all: MORALITY_EQUIPMENT,
  },

  threatLevels: {
    calculate: calculateThreatLevel,
  },

  breadcrumbs: BREADCRUMB_CHAINS,

  // Equipment narratives — items as storytelling
  equipmentNarratives: {
    get: getEquipmentNarrative,
    all: EQUIPMENT_NARRATIVES,
  },

  // Room boss mechanics — each boss tests room's mechanic
  bossMechanics: BOSS_MECHANICS,

  // Soul Stakes — wager Dream tokens on matches
  soulStakes: {
    config: SOUL_STAKE_CONFIG,
    calculatePayout: calculateStakePayout,
  },

  // Living consequences — ship visually changes from choices
  consequences: {
    getActive: getActiveConsequences,
    all: LIVING_CONSEQUENCES,
  },

  // Extinct races — discoverable through all game modes
  extinctRaces: {
    get: getExtinctRace,
    getByGameMode: getRemnantsByGameMode,
    all: EXTINCT_RACES,
  },

  // Pet bonding
  pets: {
    evolutions: PET_EVOLUTIONS,
    getEvolutionStage,
    calculateMoralityDissonance,
    defaultBond: DEFAULT_PET_BOND,
  },

  // Arena story modes — Prisoner → Warlord → Iron Lion → Agent Zero
  arenaStories: {
    all: ARENA_STORY_MODES,
    getNext: getNextStory,
    getAvailableFighters,
    lore: COLLECTORS_ARENA_LORE,
  },

  // Death & Resurrection — community Necromancer meter
  death: {
    process: processDeath,
    getStatus: getSoulStatus,
    defaultState: DEFAULT_SOUL_STATE,
    unlocks: RESURRECTION_UNLOCKS,
  },

  // TCG enhancements — pity timer, variants, milestones
  tcg: {
    calculatePullRarity,
    pityConfig: PITY_CONFIG,
    variants: CARD_VARIANTS,
  },
};

/* ─── HELPER: Get all gameplay bonuses currently affecting player ─── */

export interface ActiveBonusSummary {
  source: string;
  bonus: string;
  value: number;
}

export function getAllActiveGameplayBonuses(
  elaraTrust: number,
  humanTrust: number,
  npcTrust: Record<string, number>,
  equippedKeepsakes: string[],
  activeAugmentations: string[],
  prestige: number,
): ActiveBonusSummary[] {
  const bonuses: ActiveBonusSummary[] = [];

  // Trust-based combat bonuses
  const trustBonuses = getAllActiveBonuses(npcTrust, elaraTrust, humanTrust);
  for (const tb of trustBonuses) {
    for (const b of tb.bonuses) {
      bonuses.push({
        source: `${tb.npcId} trust`,
        bonus: b.description,
        value: b.value,
      });
    }
  }

  // Keepsake trinket bonuses
  for (const keepsakeId of equippedKeepsakes) {
    const k = KEEPSAKE_TRINKETS.find((x: any) => x.id === keepsakeId);
    if (k) bonuses.push({ source: k.name, bonus: k.bonus.stat, value: k.bonus.value });
  }

  // Augmentation bonuses
  for (const augId of activeAugmentations) {
    const aug = AUGMENTATIONS.find(x => x.id === augId);
    if (aug) {
      for (const b of aug.bonuses) {
        bonuses.push({ source: aug.name, bonus: b.stat, value: b.value });
      }
    }
  }

  // Prestige multipliers
  if (prestige > 0) {
    bonuses.push({ source: `Prestige ${prestige}`, bonus: "XP multiplier", value: prestige * 10 });
    bonuses.push({ source: `Prestige ${prestige}`, bonus: "Resource multiplier", value: prestige * 5 });
  }

  return bonuses;
}

/* ─── HELPER: Check if player is near any system unlock ─── */

export function getRelevantSystemReminders(
  level: number,
  elaraTrust: number,
  roomsUnlocked: number,
): string[] {
  const reminders: string[] = [];

  if (level >= 23 && level < 25) {
    reminders.push("You're close to Prestige eligibility (level 25). Consider your current run.");
  }
  if (elaraTrust >= 35 && elaraTrust < 40) {
    reminders.push("Elara is about to share something important (trust 40).");
  }
  if (roomsUnlocked === 6) {
    reminders.push("You've explored 6 rooms. The Ark has 12. Half remains.");
  }

  return reminders;
}
