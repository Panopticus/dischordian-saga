/* ═══════════════════════════════════════════════════════
   BIDDING WAR — Mission 5 (Week 5)
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3 mission detail

   Twenty-four Trade Empire sub-houses meet on neutral
   ground. The player trades card-faction strength for
   pledges, building a coalition that multiplies their card-
   faction power at the Nexus Trial.

   Pass:   pledges from ≥6 distinct sub-houses, with ≥1 per
           card faction (5 covered factions).
   Reward: factionMultipliers per faction = clamp(1.0 +
           0.2 × alignment-weighted pledge count, 1.0, 3.0)
   Fail:   factionMultipliers stay at baseline 1.0×.

   Guard-rails (per the plan):
     - Pledging Locke's card or any second-death ballot
       candidate's card is forbidden. The Antiquarian
       explicitly refuses. The scorer fails the mission
       and reports which forbidden card triggered it.
   ═══════════════════════════════════════════════════════ */

import type { MissionEvaluation } from "../registry";

/** The five "covered" card factions the Bidding War scores against.
 *  Mirrors the main-faction subset of `FACTIONS` in
 *  apps/shared/tcg-core/cards/schema.ts — special factions (neutral,
 *  thought_virus, panopticon, hierarchy_of_damned) are NOT covered. */
export const BIDDING_WAR_FACTIONS = [
  "architect",
  "dreamer",
  "insurgency",
  "new_babylon",
  "antiquarian",
] as const;

export type BiddingWarFaction = (typeof BIDDING_WAR_FACTIONS)[number];

/** Per-pledge alignment of the sub-house to the player's Trade
 *  Empire path. Affects the pledge's contribution weight. */
export type PledgeAlignment = "aligned" | "neutral" | "hostile";

const ALIGNMENT_WEIGHT: Record<PledgeAlignment, number> = {
  aligned: 1.5,
  neutral: 1.0,
  hostile: 0.5,
};

/** Card ids the Antiquarian explicitly refuses to broker. Pledging
 *  any of these fails the mission outright. Includes Locke (fixed
 *  canon, the Necromancer's price) and the four second-death ballot
 *  candidates whose names are still in contention.
 *
 *  Lycos and Vex Solène don't have playable cards yet (NPC bibles
 *  only); their npc-key patterns are listed below so when their
 *  cards land they're picked up automatically.
 */
export const FORBIDDEN_PLEDGE_CARD_IDS: ReadonlySet<string> = new Set([
  "s1_char_001_adjudicar_locke",
  "s1_reward_companion_locke",
  "s1_pack_034_lockes_inner_circle",
  "imprint/locke",
  "s1_char_106_wraith_calder",
  "s1_char_003_akai_shi",
  "imprint/akai_shi",
]);

/** Substring patterns that ALSO trigger the forbidden-pledge rule.
 *  Catches future card ids that land for Vex Solène / Lycos / etc.
 *  without requiring an explicit list update. */
export const FORBIDDEN_PLEDGE_PATTERNS: readonly string[] = [
  "vex_solene",
  "vex_solène",
  "lycos",
  "wraith_calder",
  "akai_shi",
  "adjudicar_locke",
  "companion_locke",
];

/** True iff the card id is forbidden from being pledged. */
export function isForbiddenPledge(cardId: string): boolean {
  if (FORBIDDEN_PLEDGE_CARD_IDS.has(cardId)) return true;
  const lower = cardId.toLowerCase();
  return FORBIDDEN_PLEDGE_PATTERNS.some((p) => lower.includes(p));
}

/* ─── SUBMISSION ─── */

export interface BiddingWarPledge {
  /** Sub-house id receiving the pledge. */
  subHouseId: string;
  /** Card ids the player pledged. Each card is removed from the
   *  player's deck for the duration of the Trial and returned in
   *  Season 2 week 1. */
  cardIds: readonly string[];
  /** The card-faction the sub-house counts toward. */
  faction: BiddingWarFaction;
  /** Alignment of the sub-house to the player's Trade Empire path. */
  alignment: PledgeAlignment;
}

export interface BiddingWarSubmission {
  pledges: readonly BiddingWarPledge[];
}

/** Minimum distinct sub-houses pledged for pass. */
export const BIDDING_WAR_PASS_MIN_SUBHOUSES = 6;
/** Maximum cards a single sub-house will accept. */
export const BIDDING_WAR_MAX_CARDS_PER_SUBHOUSE = 3;
/** Multiplier cap (per the plan's "3.0× near-impossible"). */
export const BIDDING_WAR_MULTIPLIER_CAP = 3.0;
/** Multiplier floor (baseline). */
export const BIDDING_WAR_MULTIPLIER_FLOOR = 1.0;
/** Per-pledge contribution to the faction multiplier. */
export const BIDDING_WAR_PER_PLEDGE_STEP = 0.2;

/* ─── SCORING ─── */

/**
 * Score a Bidding War submission. Pure / deterministic.
 *
 * Validation order — guard-rails fire first:
 *   1. Forbidden pledge → fail with `forbidden_pledge` reason.
 *   2. Sub-house over the 3-card cap → fail with `oversized_pledge`.
 *   3. Computes per-faction multipliers and checks pass criteria.
 */
export function scoreBiddingWar(
  submission: BiddingWarSubmission,
): MissionEvaluation {
  // 1. Forbidden-pledge guard-rail. The Antiquarian refuses.
  for (const pledge of submission.pledges) {
    for (const cardId of pledge.cardIds) {
      if (isForbiddenPledge(cardId)) {
        return {
          passed: false,
          reason: `The Antiquarian refuses: card "${cardId}" cannot be pledged at the Council.`,
          penalties: { factionMultipliers: makeBaselineMultipliers() },
        };
      }
    }
  }

  // 2. Per-sub-house card-count cap.
  const cardCountBySubHouse = new Map<string, number>();
  for (const pledge of submission.pledges) {
    const current = cardCountBySubHouse.get(pledge.subHouseId) ?? 0;
    const next = current + pledge.cardIds.length;
    if (next > BIDDING_WAR_MAX_CARDS_PER_SUBHOUSE) {
      return {
        passed: false,
        reason: `Sub-house "${pledge.subHouseId}" cannot accept more than ${BIDDING_WAR_MAX_CARDS_PER_SUBHOUSE} cards.`,
        penalties: { factionMultipliers: makeBaselineMultipliers() },
      };
    }
    cardCountBySubHouse.set(pledge.subHouseId, next);
  }

  // 3. Compute per-faction pledge contribution (alignment-weighted).
  const contributionByFaction = new Map<BiddingWarFaction, number>();
  const subHousesByFaction = new Map<BiddingWarFaction, Set<string>>();
  for (const pledge of submission.pledges) {
    const weight = ALIGNMENT_WEIGHT[pledge.alignment];
    contributionByFaction.set(
      pledge.faction,
      (contributionByFaction.get(pledge.faction) ?? 0) + weight,
    );
    const seen = subHousesByFaction.get(pledge.faction) ?? new Set<string>();
    seen.add(pledge.subHouseId);
    subHousesByFaction.set(pledge.faction, seen);
  }

  const distinctSubHouses = cardCountBySubHouse.size;
  const factionsCovered = subHousesByFaction.size;

  if (
    distinctSubHouses < BIDDING_WAR_PASS_MIN_SUBHOUSES ||
    factionsCovered < BIDDING_WAR_FACTIONS.length
  ) {
    return {
      passed: false,
      reason: `Secured ${distinctSubHouses} sub-houses across ${factionsCovered} faction(s); need ≥${BIDDING_WAR_PASS_MIN_SUBHOUSES} sub-houses across all ${BIDDING_WAR_FACTIONS.length} factions.`,
      penalties: { factionMultipliers: makeBaselineMultipliers() },
    };
  }

  // Pass. Compute the multiplier per faction.
  const factionMultipliers: Record<string, number> = {};
  for (const faction of BIDDING_WAR_FACTIONS) {
    const contribution = contributionByFaction.get(faction) ?? 0;
    const raw = BIDDING_WAR_MULTIPLIER_FLOOR + contribution * BIDDING_WAR_PER_PLEDGE_STEP;
    factionMultipliers[faction] = Math.min(BIDDING_WAR_MULTIPLIER_CAP, raw);
  }

  // Collect pledged card ids for the Season 2 week 1 return.
  const pledgedCardIds: string[] = [];
  for (const pledge of submission.pledges) {
    for (const id of pledge.cardIds) pledgedCardIds.push(id);
  }

  return {
    passed: true,
    reason: `Coalition secured: ${distinctSubHouses} sub-houses across all ${BIDDING_WAR_FACTIONS.length} factions.`,
    rewards: {
      factionMultipliers,
      pledgedCardIds,
    },
  };
}

function makeBaselineMultipliers(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const f of BIDDING_WAR_FACTIONS) m[f] = BIDDING_WAR_MULTIPLIER_FLOOR;
  return m;
}
