/* ═══════════════════════════════════════════════════════
   NEMESIS RECRUIT ELIGIBILITY (Phase K8.1)

   Per dreamer-canon (2026-05-13):
     - Base recruit chance: 8%
     - If the player's apprentice has betrayed them: 35%
     - Modifiers (multiplicative, on top of base):
         · archetypeCompatibility ≥ 8/10 → ×1.5
         · mercyFlagsAtHighGrudge ≥ 3   → ×2.0
         · politicianTicDecodedCount ≥ 6 → ×1.2
     - Final rate capped at 60% — even maximally-eligible
       players aren't guaranteed.

   Pure function. Phase K8.2 dialog tree gates on the
   `eligible` flag returned here.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import { NEMESIS_ARCHETYPE_BEHAVIORS } from "./nemesisArchetypes";

export interface RecruitEligibilityInput {
  /** Player's currently-trained apprentice archetype. */
  playerArchetype: ApprenticeArchetype;
  /** The Nemesis's archetype. */
  nemesisArchetype: ApprenticeArchetype;
  /** True if the player's own apprentice has reached
   *  betrayal stage 3 (declaration). */
  hasApprenticeBetrayed: boolean;
  /** Count of explicit mercy choices the player has made
   *  while the Nemesis was at grudge tier ≥ 4. */
  mercyFlagsAtHighGrudge: number;
  /** Count of unique Politician-tics the player has
   *  decoded across all Nemeses. */
  politicianTicDecodedCount: number;
}

export interface RecruitEligibilityResult {
  /** Whether a recruit-roll should be offered at the next
   *  encounter. Eligibility ≠ guaranteed recruit — the
   *  finalRate is the actual probability. */
  eligible: boolean;
  /** Base rate (8% or 35%). */
  baseRate: number;
  /** Multipliers actually applied. */
  modifiers: {
    archetypeCompatibilityBonus: number;
    mercyAtHighGrudgeBonus: number;
    politicianTicDecodedBonus: number;
  };
  /** Final probability the recruit-dialog will succeed
   *  if rolled (already capped at 60%). */
  finalRate: number;
  /** Human-readable rationale — for debugging + telemetry. */
  rationale: string;
}

export const BASE_RECRUIT_RATE = 0.08;
export const APPRENTICE_BETRAYAL_RECRUIT_RATE = 0.35;
export const RECRUIT_RATE_CEILING = 0.60;

export const HIGH_COMPATIBILITY_THRESHOLD = 8;
export const HIGH_COMPAT_MULTIPLIER = 1.5;

export const MERCY_THRESHOLD = 3;
export const MERCY_MULTIPLIER = 2.0;

export const TIC_DECODE_THRESHOLD = 6;
export const TIC_DECODE_MULTIPLIER = 1.2;

/** Pure function — given inputs, returns the eligibility
 *  decision + final probability. */
export function evaluateRecruitEligibility(
  input: RecruitEligibilityInput,
): RecruitEligibilityResult {
  const baseRate = input.hasApprenticeBetrayed
    ? APPRENTICE_BETRAYAL_RECRUIT_RATE
    : BASE_RECRUIT_RATE;

  const nemesisBehavior = NEMESIS_ARCHETYPE_BEHAVIORS[input.nemesisArchetype];
  const compatibilityScore = nemesisBehavior?.recruitAffinityVector[input.playerArchetype] ?? 3;

  const archetypeCompatibilityBonus =
    compatibilityScore >= HIGH_COMPATIBILITY_THRESHOLD ? HIGH_COMPAT_MULTIPLIER : 1.0;
  const mercyAtHighGrudgeBonus =
    input.mercyFlagsAtHighGrudge >= MERCY_THRESHOLD ? MERCY_MULTIPLIER : 1.0;
  const politicianTicDecodedBonus =
    input.politicianTicDecodedCount >= TIC_DECODE_THRESHOLD ? TIC_DECODE_MULTIPLIER : 1.0;

  const rawRate =
    baseRate * archetypeCompatibilityBonus * mercyAtHighGrudgeBonus * politicianTicDecodedBonus;
  const finalRate = Math.min(RECRUIT_RATE_CEILING, rawRate);

  // Eligibility: any non-zero rate means the dialog tree
  // can OFFER the choice; the actual roll is at K8.2.
  const eligible = finalRate > 0;

  const rationale =
    `base=${baseRate.toFixed(2)}` +
    `${input.hasApprenticeBetrayed ? " (apprentice-betrayed)" : ""}` +
    ` × compat=${archetypeCompatibilityBonus.toFixed(2)} (score ${compatibilityScore})` +
    ` × mercy=${mercyAtHighGrudgeBonus.toFixed(2)} (count ${input.mercyFlagsAtHighGrudge})` +
    ` × tics=${politicianTicDecodedBonus.toFixed(2)} (count ${input.politicianTicDecodedCount})` +
    ` = ${rawRate.toFixed(3)}` +
    `${rawRate > RECRUIT_RATE_CEILING ? ` (capped to ${RECRUIT_RATE_CEILING})` : ""}`;

  return {
    eligible,
    baseRate,
    modifiers: {
      archetypeCompatibilityBonus,
      mercyAtHighGrudgeBonus,
      politicianTicDecodedBonus,
    },
    finalRate,
    rationale,
  };
}

/** Roll the eligibility result against a 0..1 RNG draw.
 *  Returns true iff the recruit succeeds. */
export function rollRecruit(
  result: RecruitEligibilityResult,
  rng01: number,
): boolean {
  return rng01 < result.finalRate;
}
