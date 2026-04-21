/* ═══════════════════════════════════════════════════════
   CHRISTMAS-IN-JULY ↔ ORDER OF THE DREAMER BRIDGE

   Pure mapping: a CiJ donation $ amount produces both
     1. a CiJ event-exclusive trophy (if the amount hits
        a donor-tier threshold AND the event is live)
     2. a credit to the Order of the Dreamer ladder
        (year-round, same dollars)

   Iron Clad Lion members get their Dreamer level credit
   at the standard rate — the 2× Iron Clad Lion boost in
   lionsClubBonuses.ts applies to the tier EFFECT
   magnitudes, not to the level count itself.

   The $25 / $50 / $100 CiJ donor trophies are ONLY
   available during the event window. A player's existing
   Dreamer level does NOT retroactively grant them.
   ═══════════════════════════════════════════════════════ */

import {
  type DreamerProfile,
  calculateLevelFromTotalUsd,
  trophiesNewlyCrossed,
} from "@shared/dreamerOrder";

import { FESTIVE_REWARDS, type FestiveReward } from "./festiveRewards";

export interface CijDonationOutcome {
  /** Event-exclusive CiJ trophy id if a threshold was crossed and
   *  the event window was live at donation time; otherwise null. */
  cijTrophyId: string | null;
  /** How many Dreamer levels gained (integer). */
  dreamerLevelsGained: number;
  /** Newly unlocked Dreamer trophy ids from this donation. */
  dreamerTrophiesNewlyUnlocked: readonly string[];
  /** Newly unlocked Dreamer badge ids from this donation. */
  dreamerBadgesNewlyUnlocked: readonly string[];
  /** Dreamer level after crediting this donation. */
  newDreamerLevel: number;
  /** Total LCIF dollars after crediting this donation. */
  newTotalLcifDonatedUsd: number;
}

/** Donor-tier trophies from FESTIVE_REWARDS, sorted from largest to
 *  smallest threshold so threshold matching picks the highest eligible. */
const DONOR_TIER_TROPHIES: readonly FestiveReward[] = FESTIVE_REWARDS.filter(
  (r): r is FestiveReward & { donorUsdThreshold: number } =>
    r.type === "trophy" &&
    r.eventWindowExclusive === true &&
    typeof r.donorUsdThreshold === "number",
).sort(
  (a, b) => (b.donorUsdThreshold ?? 0) - (a.donorUsdThreshold ?? 0),
);

/** Highest donor-tier trophy id whose threshold is met by `usd`. */
function resolveCijTrophyForDonation(usd: number): string | null {
  for (const trophy of DONOR_TIER_TROPHIES) {
    if (usd >= (trophy.donorUsdThreshold ?? 0)) return trophy.id;
  }
  return null;
}

export interface CreditDonationInput {
  usd: number;
  /** The CiJ trophy gate: true only while the event is live. */
  eventWindowIsLive: boolean;
  /** The player's current Dreamer profile (or a freshly empty one). */
  profile: DreamerProfile;
}

/**
 * Applies a CiJ donation dollar-amount to a Dreamer profile and
 * produces the reward outcome. Pure — does NOT mutate `profile`.
 *
 * The caller is responsible for persisting the new profile state
 * (currentLevel / totalLcifDonatedUsd / unlockedTrophyIds /
 * unlockedBadgeIds) from this function's return values.
 */
export function creditCijDonation(
  input: CreditDonationInput,
): CijDonationOutcome {
  const { usd, eventWindowIsLive, profile } = input;

  const safeUsd = Number.isFinite(usd) && usd > 0 ? usd : 0;

  const prevLevel = profile.currentLevel;
  const newTotalUsd = profile.totalLcifDonatedUsd + safeUsd;
  const newLevel = calculateLevelFromTotalUsd(newTotalUsd);
  const { trophies, badges } = trophiesNewlyCrossed(prevLevel, newLevel);

  const cijTrophyId = eventWindowIsLive
    ? resolveCijTrophyForDonation(safeUsd)
    : null;

  return {
    cijTrophyId,
    dreamerLevelsGained: Math.max(0, newLevel - prevLevel),
    dreamerTrophiesNewlyUnlocked: trophies,
    dreamerBadgesNewlyUnlocked: badges,
    newDreamerLevel: newLevel,
    newTotalLcifDonatedUsd: newTotalUsd,
  };
}
