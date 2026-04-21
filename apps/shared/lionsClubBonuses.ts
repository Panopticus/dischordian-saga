/* ═══════════════════════════════════════════════════════
   IRON CLAD LION BONUS MECHANICS

   Central resolver that reads a player's active DGRS Lions
   Club membership and returns effective multipliers, access
   flags, and cosmetics. Consumers call these helpers at
   resolution time so stale state never leaks through:
   membership lapse is detected lazily from expiresIso.

   Bonus types:
     1. 2× multiplier on every Order of the Dreamer tier
        effect magnitude
     2. Flat charity-action bonus (+10% default) for
        gift-exchange / aid-quest rewards
     3. Access gates for Iron Clad Lions faction dialog,
        quests, and craft recipes
     4. Cosmetics — lion crest, gold name color, chat badge
   ═══════════════════════════════════════════════════════ */

import type { DreamerEffect } from "./dreamerOrder";
import {
  type LionsClubMembership,
  isMembershipActive,
} from "./lionsClub";

/** Context passed into every resolver. */
export interface LionsClubEffectContext {
  membership: LionsClubMembership | null;
  nowIso: string;
}

/** Default +10% bump on charity-themed rewards for active members. */
export const LION_CHARITY_ACTION_BONUS_PCT = 0.1;

/** Iron Clad Lion multiplier applied to Dreamer tier effect magnitudes. */
export const LION_DREAMER_EFFECT_MULTIPLIER = 2;

/** Canonical cosmetic identifiers the profile page reads. */
export const LION_NAME_COLOR_HEX = "#c9a94b"; // heirloom gold
export const LION_CHAT_BADGE_ID = "iron-clad-lion-active";

function isActiveLion(ctx: LionsClubEffectContext): boolean {
  return isMembershipActive(ctx.membership, ctx.nowIso);
}

/**
 * Return the Dreamer effect's resolved magnitude. Non-member or
 * lapsed member: pass through unchanged. Active Lion: doubled.
 * Zero magnitudes stay zero (0 × 2 === 0).
 */
export function resolveDreamerEffectMagnitude(
  effect: DreamerEffect,
  ctx: LionsClubEffectContext,
): number {
  if (!isActiveLion(ctx)) return effect.magnitude;
  return effect.magnitude * LION_DREAMER_EFFECT_MULTIPLIER;
}

/**
 * Charity-action bonus percentage (0..1). 0 for non-members.
 * Callers multiply this against the base reward to get the bump.
 */
export function resolveCharityActionBonus(
  ctx: LionsClubEffectContext,
): number {
  return isActiveLion(ctx) ? LION_CHARITY_ACTION_BONUS_PCT : 0;
}

/** Gate: members-only dialog arcs with Iron Clad Lions NPCs. */
export function canAccessIronCladLionsDialog(
  ctx: LionsClubEffectContext,
): boolean {
  return isActiveLion(ctx);
}

/** Gate: members-only faction questlines. */
export function canAccessIronCladLionsQuests(
  ctx: LionsClubEffectContext,
): boolean {
  return isActiveLion(ctx);
}

/**
 * Gate: craft recipes scoped to active membership. The recipeId
 * parameter is forward-looking — the default policy is "any
 * Iron Clad Lions recipe is members-only," but the resolver
 * accepts the id so specific recipes can be exempted later.
 */
export function canCraftIronCladLionsRecipe(
  _recipeId: string,
  ctx: LionsClubEffectContext,
): boolean {
  return isActiveLion(ctx);
}

export interface LionsClubCosmetics {
  showLionCrest: boolean;
  nameColorHex: string | null;
  chatBadgeId: string | null;
}

/** Cosmetics for the profile header / chat line. Inactive members
 *  fall through to the default skin. */
export function resolveLionsClubCosmetics(
  ctx: LionsClubEffectContext,
): LionsClubCosmetics {
  if (!isActiveLion(ctx)) {
    return { showLionCrest: false, nameColorHex: null, chatBadgeId: null };
  }
  return {
    showLionCrest: true,
    nameColorHex: LION_NAME_COLOR_HEX,
    chatBadgeId: LION_CHAT_BADGE_ID,
  };
}
