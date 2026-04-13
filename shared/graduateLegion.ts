/* ═══════════════════════════════════════════════════════
   THE GRADUATE LEGION

   Apprentices don't stop being useful after the trial. Every
   survivor can be deployed in 6 different roles. This gives
   players a reason to keep recruiting even after finding
   their favorite companion.

   Roles:
     1. COMPANION (1 slot)  — on-ship, daily bond, personal quests
     2. CRYO_VAULT (2 slots) — frozen, stored for future deployment
     3. ARMY_LEADER         — commands troops in Army Management
     4. TRADE_ENVOY         — runs Trade Empire routes/colonies
     5. TOWER_CAPTAIN       — deploys to Tower Defense rounds
     6. SACRIFICED (dead)   — killed for dark rewards
     7. RELATIONSHIP_GIFT   — consumed to boost NPC trust

   "The one you love stays on the ship. The rest go to work —
    or become work."
   ═══════════════════════════════════════════════════════ */

import type { Apprentice, ApprenticeArchetype, Rarity } from "./apprentices";

export type GraduateRole =
  | "companion"
  | "cryo_vault"
  | "army_leader"
  | "trade_envoy"
  | "tower_captain"
  | "sacrificed"
  | "relationship_gift";

export interface GraduateAssignment {
  apprenticeId: string;
  role: GraduateRole;
  /** When assigned */
  assignedAt: number;
  /** Role-specific payload */
  payload?: {
    /** For army/trade/tower: where deployed */
    deploymentId?: string;
    /** For relationship_gift: which NPC was boosted */
    giftedTo?: string;
    /** For sacrificed: what the player got */
    sacrificeReward?: string;
  };
}

/* ─── SLOT LIMITS ─── */

export const SLOT_LIMITS = {
  companion: 1,
  cryo_vault: 2,
  army_leader: 3,    // up to 3 armies simultaneously
  trade_envoy: 2,
  tower_captain: 1,
} as const;

/* ─── ROLE BONUS COMPUTATION ─── */

export interface RoleBonus {
  target: string;
  value: number;
  label: string;
}

/**
 * Bonuses granted to the player when an apprentice is deployed in a role.
 * Scales with rarity + stats + archetype primary stat.
 */
export function computeRoleBonus(app: Apprentice, role: GraduateRole): RoleBonus[] {
  const rarityMult = rarityMultiplier(app.rarity);
  const bonuses: RoleBonus[] = [];

  switch (role) {
    case "army_leader": {
      // Strength-primary archetypes = damage, Charisma = morale
      const strengthBonus = Math.floor(app.stats.strength * 0.5 * rarityMult);
      const charismaBonus = Math.floor(app.stats.charisma * 0.5 * rarityMult);
      bonuses.push(
        { target: "army_damage", value: strengthBonus, label: `+${strengthBonus}% army damage` },
        { target: "army_morale", value: charismaBonus, label: `+${charismaBonus}% troop morale` },
      );
      // Archetype-specific squad ability
      const squadAbility = ARCHETYPE_SQUAD_ABILITIES[app.archetype];
      if (squadAbility) {
        bonuses.push({ target: "squad_ability", value: 1, label: squadAbility });
      }
      break;
    }
    case "trade_envoy": {
      const intBonus = Math.floor(app.stats.intelligence * 0.4 * rarityMult);
      const chaBonus = Math.floor(app.stats.charisma * 0.6 * rarityMult);
      bonuses.push(
        { target: "trade_profit", value: chaBonus, label: `+${chaBonus}% trade profit margins` },
        { target: "faction_rep_gain", value: intBonus, label: `+${intBonus}% faction reputation gains` },
      );
      break;
    }
    case "tower_captain": {
      const agiBonus = Math.floor(app.stats.agility * 0.4 * rarityMult);
      const intBonus = Math.floor(app.stats.intelligence * 0.4 * rarityMult);
      bonuses.push(
        { target: "tower_fire_rate", value: agiBonus, label: `+${agiBonus}% tower fire rate` },
        { target: "tower_build_cost", value: -intBonus, label: `-${intBonus}% tower build cost` },
      );
      // Archetype-specific tower boost
      const towerBoost = ARCHETYPE_TOWER_BOOSTS[app.archetype];
      if (towerBoost) {
        bonuses.push({ target: "tower_special", value: 1, label: towerBoost });
      }
      break;
    }
    case "companion": {
      // Companion bonuses come from getActiveLoyaltyBonus in apprentices.ts
      break;
    }
    case "cryo_vault": {
      // No active bonus — just preserved
      break;
    }
  }

  return bonuses;
}

function rarityMultiplier(rarity: Rarity): number {
  return { common: 1.0, uncommon: 1.25, rare: 1.5, epic: 2.0, mythic: 3.0 }[rarity];
}

/* ─── ARCHETYPE SQUAD ABILITIES (Army Leader role) ─── */

const ARCHETYPE_SQUAD_ABILITIES: Record<ApprenticeArchetype, string> = {
  zealot: "Faith Charge: squad ignores morale penalties for 1 battle",
  ghost: "Shadow Deploy: squad ambushes instead of frontal assault",
  scholar: "Strategic Intel: reveal enemy squad composition before engagement",
  revenant: "Death's Refusal: squad revives at 25% after first wipe",
  artisan: "Field Fortifications: +30% defense in defensive stances",
  oracle: "Battle Foresight: reroll one bad dice roll per engagement",
  wanderer: "Forced March: squad moves 2x speed on campaign map",
  martyr: "Human Shield: squad takes 20% damage meant for player units",
  heretic: "Propaganda: convert one enemy unit per battle",
  jester: "Morale Break: demoralize enemy squad, -20% their damage",
  sentinel: "Unbreakable Line: squad cannot rout",
  prodigal: "Last Stand: +50% damage when squad below 30% health",
};

/* ─── ARCHETYPE TOWER BOOSTS (Tower Defense role) ─── */

const ARCHETYPE_TOWER_BOOSTS: Record<ApprenticeArchetype, string> = {
  zealot: "All towers +15% damage while you have lives remaining",
  ghost: "Unlock Shadow Towers (invisible, first-strike)",
  scholar: "Enemies revealed further out, +2 tile detection range",
  revenant: "Destroyed towers refund 50% cost",
  artisan: "Tower build time -30%",
  oracle: "Next wave preview shows enemy types",
  wanderer: "Mobile tower slot (can be repositioned mid-wave)",
  martyr: "Towers absorb 1 enemy hit before taking damage",
  heretic: "Convert 1 enemy per wave to fight for you",
  jester: "Enemies occasionally walk wrong direction",
  sentinel: "+25% tower health",
  prodigal: "Last tower standing gets +100% damage",
};

/* ─── SACRIFICE REWARDS ─── */

export interface SacrificeReward {
  corruptionGain: number;
  reward: string;
  narrativeFlag?: string;
}

/**
 * Killing an apprentice for dark power. Scales with rarity.
 * Mythic sacrifice = unique narrative branch.
 */
export function computeSacrificeReward(app: Apprentice): SacrificeReward {
  switch (app.rarity) {
    case "common":
      return { corruptionGain: 5, reward: "50 Dream · 500 XP · Minor Dark Shard" };
    case "uncommon":
      return { corruptionGain: 10, reward: "120 Dream · 1,200 XP · Dark Shard" };
    case "rare":
      return { corruptionGain: 20, reward: "300 Dream · 3,000 XP · Greater Dark Shard · +1 dark skill" };
    case "epic":
      return { corruptionGain: 35, reward: "800 Dream · 8,000 XP · Epic Dark Artifact · unique forbidden ability" };
    case "mythic":
      return {
        corruptionGain: 60,
        reward: "2,000 Dream · 20,000 XP · Mythic Dark Artifact · secret Necromancer quest · Architect's personal notice",
        narrativeFlag: "sacrificed_mythic_apprentice",
      };
  }
}

/* ─── RELATIONSHIP GIFT VALUES ─── */

/**
 * Giving an apprentice as a gift to an NPC. Strong trust boost,
 * but morally and mechanically expensive (you lose the apprentice).
 */
export function computeGiftTrustBoost(app: Apprentice): number {
  const base = { common: 10, uncommon: 20, rare: 30, epic: 40, mythic: 60 }[app.rarity];
  // Bond with apprentice before gifting increases how much they value the gesture
  const bondBonus = Math.floor(app.bond * 0.1);
  return base + bondBonus;
}

/* ─── ROSTER STATE ─── */

export interface LegionRoster {
  /** Current assignments */
  assignments: GraduateAssignment[];
  /** Graduates waiting in the Vault (alive, not yet assigned) */
  unassigned: string[];
  /** History of sacrificed apprentices */
  sacrificedHistory: { id: string; name: string; rarity: Rarity; at: number }[];
}

export const EMPTY_ROSTER: LegionRoster = {
  assignments: [],
  unassigned: [],
  sacrificedHistory: [],
};

/* ─── ROSTER QUERIES ─── */

export function getAssignmentsByRole(roster: LegionRoster, role: GraduateRole): GraduateAssignment[] {
  return roster.assignments.filter(a => a.role === role);
}

export function getSlotUsage(roster: LegionRoster, role: keyof typeof SLOT_LIMITS): { used: number; max: number } {
  return {
    used: getAssignmentsByRole(roster, role).length,
    max: SLOT_LIMITS[role],
  };
}

export function canAssign(roster: LegionRoster, role: GraduateRole): boolean {
  if (role === "sacrificed" || role === "relationship_gift") return true; // no slot limits
  const limit = SLOT_LIMITS[role as keyof typeof SLOT_LIMITS];
  if (limit === undefined) return true;
  return getAssignmentsByRole(roster, role).length < limit;
}

/* ─── TOTAL DEPLOYED BONUSES ─── */

export function getAllActiveDeploymentBonuses(
  roster: LegionRoster,
  apprentices: Record<string, Apprentice>,
): RoleBonus[] {
  const all: RoleBonus[] = [];
  for (const asn of roster.assignments) {
    if (asn.role === "cryo_vault" || asn.role === "sacrificed" || asn.role === "relationship_gift") continue;
    const app = apprentices[asn.apprenticeId];
    if (!app) continue;
    all.push(...computeRoleBonus(app, asn.role));
  }
  return all;
}
