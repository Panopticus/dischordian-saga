/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — Crew holiday bonus computation

   Cross-references a player's `CrewState` against the
   bloodline / role holiday bonus tables and returns the
   aggregate bonuses that the xmas_july router uses when
   resolving gift sends, wheel spins, and craps rolls.

   Kept in `apps/shared` so both the server router and any
   future client preview panel can import the same math.
   ═══════════════════════════════════════════════════════ */
import type { CrewState, BloodlineId, CrewRoleId } from "./crewPersistence";

interface BonusEffect {
  tokenMultiplier?: number;
  giftBonusTokens?: number;
  wheelLuckBonus?: number;
  crapsLuckBonus?: number;
}

const BLOODLINE_BONUSES: Record<BloodlineId, BonusEffect> = {
  void_resonance: { giftBonusTokens: 2 },
  iron_memory: { tokenMultiplier: 0.10 },
  crimson_vigil: { wheelLuckBonus: 0.05 },
  temporal_echo: { crapsLuckBonus: 0.05 },
  storm_circuit: { giftBonusTokens: 1 },
  lattice_prime: { giftBonusTokens: 1 },
  echo_synthesis: { tokenMultiplier: 0.10 },
  terminus_aegis: { tokenMultiplier: 0.05, giftBonusTokens: 1 },
  blood_weave: { giftBonusTokens: 3 },
};

const ROLE_BONUSES: Record<CrewRoleId, BonusEffect> = {
  trader: { giftBonusTokens: 1 },            // 4-token gift box discount, modeled as +1 token rebate
  quartermaster: { giftBonusTokens: 1 },     // instant delivery — rebate as bonus token
  comms_officer: { tokenMultiplier: 0.05 },
  medic: { giftBonusTokens: 1 },             // free daily candy cane — rebate as bonus token
  security: { wheelLuckBonus: 0.03 },
  scientist: { crapsLuckBonus: 0.03 },
  navigator: { giftBonusTokens: 2 },         // cross-server bonus
  engineer: { wheelLuckBonus: 0.02 },        // +1 free spin/day — modeled as wheel luck
};

export interface CrewHolidayBonus {
  tokenMultiplier: number;
  giftBonusTokens: number;
  wheelLuckBonus: number;
  crapsLuckBonus: number;
  sourceBloodlines: BloodlineId[];
  sourceRoles: CrewRoleId[];
  /** Ids of crew members that contributed. Used for feed attribution. */
  contributingMemberIds: string[];
}

export const EMPTY_HOLIDAY_BONUS: CrewHolidayBonus = {
  tokenMultiplier: 0,
  giftBonusTokens: 0,
  wheelLuckBonus: 0,
  crapsLuckBonus: 0,
  sourceBloodlines: [],
  sourceRoles: [],
  contributingMemberIds: [],
};

/** Aggregate the best holiday bonus across all of a player's active
 *  crew members. Rules:
 *    - Each bloodline contributes once (duplicate members of the
 *      same bloodline don't stack).
 *    - Each role contributes once, and only from members with
 *      status === "active".
 *    - Multipliers stack additively (10% + 10% = +20% total).
 *    - Flat bonuses stack additively. */
export function computeCrewHolidayBonus(state: CrewState | undefined): CrewHolidayBonus {
  if (!state) return { ...EMPTY_HOLIDAY_BONUS };
  const seenBloodlines = new Set<BloodlineId>();
  const seenRoles = new Set<CrewRoleId>();
  const memberIds: string[] = [];
  let tokenMultiplier = 0;
  let giftBonusTokens = 0;
  let wheelLuckBonus = 0;
  let crapsLuckBonus = 0;

  const members = state.roster?.members ?? [];
  for (const member of members) {
    if (member.status !== "active") continue;
    let contributed = false;
    if (!seenBloodlines.has(member.bloodlineId)) {
      const bloodlineBonus = BLOODLINE_BONUSES[member.bloodlineId];
      if (bloodlineBonus) {
        seenBloodlines.add(member.bloodlineId);
        tokenMultiplier += bloodlineBonus.tokenMultiplier ?? 0;
        giftBonusTokens += bloodlineBonus.giftBonusTokens ?? 0;
        wheelLuckBonus += bloodlineBonus.wheelLuckBonus ?? 0;
        crapsLuckBonus += bloodlineBonus.crapsLuckBonus ?? 0;
        contributed = true;
      }
    }
    if (member.role && !seenRoles.has(member.role)) {
      const roleBonus = ROLE_BONUSES[member.role];
      if (roleBonus) {
        seenRoles.add(member.role);
        tokenMultiplier += roleBonus.tokenMultiplier ?? 0;
        giftBonusTokens += roleBonus.giftBonusTokens ?? 0;
        wheelLuckBonus += roleBonus.wheelLuckBonus ?? 0;
        crapsLuckBonus += roleBonus.crapsLuckBonus ?? 0;
        contributed = true;
      }
    }
    if (contributed) memberIds.push(member.id);
  }

  return {
    tokenMultiplier,
    giftBonusTokens,
    wheelLuckBonus,
    crapsLuckBonus,
    sourceBloodlines: Array.from(seenBloodlines),
    sourceRoles: Array.from(seenRoles),
    contributingMemberIds: memberIds,
  };
}

/** Convenience: apply token-earning bonuses to a base value. */
export function applyTokenBonuses(base: number, bonus: CrewHolidayBonus): number {
  const multiplied = Math.round(base * (1 + bonus.tokenMultiplier));
  return multiplied + bonus.giftBonusTokens;
}
