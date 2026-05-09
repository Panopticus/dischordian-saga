/* ═══════════════════════════════════════════════════════
   EDICTS SERVICE — §8.9 of the Trade Empire merge spec.

   Reads the active edict for a user (seasonally scoped via
   tradeEdicts table; issued via empireFeelService.issueEdict)
   and applies its mechanical bonus to caller-supplied
   payloads. Currently honours:

     - mission_credit_bonus_pct → multiplies mission reward
     - mission_influence_bonus  → flat add to influence reward

   Other bonus kinds (defense_wave_intensity_mult, disenchant
   dream multiplier, demand probability reduction) are read by
   their own consumer paths.

   The expensive part of "active edict" is the DB read; this
   service caches the per-user resolved edict for a short TTL
   so reward calls don't hit the DB on every mission.
   ═══════════════════════════════════════════════════════ */

import { getActiveEdict } from "./empireFeelService";
import type { EdictDef } from "@shared/tradeEmpire/edicts";

/** TTL for the per-user active edict cache (ms). Short — edicts only
 *  change at issuance (player action) or season turn. */
const CACHE_TTL_MS = 60 * 1000;

interface CacheEntry {
  edict: EdictDef | null;
  expiresAt: number;
}

const cache = new Map<number, CacheEntry>();

async function resolveActiveEdict(userId: number): Promise<EdictDef | null> {
  const now = Date.now();
  const hit = cache.get(userId);
  if (hit && hit.expiresAt > now) return hit.edict;
  const edict = await getActiveEdict(userId);
  cache.set(userId, { edict, expiresAt: now + CACHE_TTL_MS });
  return edict;
}

/**
 * Apply the active edict's reward modifier (if any) to the running
 * mission reward multiplier. Pass-through if no edict is active or
 * the bonus kind doesn't affect mission credits.
 *
 * Returns a Promise so callers can await; the cache makes repeat
 * calls in the same request cheap.
 */
export async function applyEdictModifier(
  baseMultiplier: number,
  userId: number,
): Promise<number> {
  const edict = await resolveActiveEdict(userId);
  if (!edict) return baseMultiplier;
  if (edict.bonus.kind === "mission_credit_bonus_pct") {
    return baseMultiplier * (1 + edict.bonus.pct / 100);
  }
  return baseMultiplier;
}

/**
 * Apply the active edict's flat influence-bonus to a base influence
 * value. Used by paths that grant influence as a separate currency
 * (so the credit modifier doesn't double-apply).
 */
export async function applyEdictInfluenceBonus(
  baseInfluence: number,
  userId: number,
): Promise<number> {
  const edict = await resolveActiveEdict(userId);
  if (!edict) return baseInfluence;
  if (edict.bonus.kind === "mission_influence_bonus") {
    return baseInfluence + edict.bonus.amount;
  }
  return baseInfluence;
}

/**
 * Read whether the active edict suppresses defense wave intensity.
 * Returns the multiplier (1.0 = no effect). §8.9 spec: defense_wave_
 * intensity_mult bonus.
 */
export async function getDefenseWaveIntensityMult(userId: number): Promise<number> {
  const edict = await resolveActiveEdict(userId);
  if (!edict) return 1.0;
  if (edict.bonus.kind === "defense_wave_intensity_mult") {
    return edict.bonus.mult;
  }
  return 1.0;
}

/**
 * Read whether the active edict reduces a sub-house's demand
 * probability. Returns 0.0..1.0 — the multiplier the demand-
 * generation path should apply to that sub-house's per-tick roll.
 */
export async function getDemandProbabilityMultiplier(
  userId: number,
  houseKey: string,
): Promise<number> {
  const edict = await resolveActiveEdict(userId);
  if (!edict) return 1.0;
  if (
    edict.bonus.kind === "demand_probability_reduction_pct" &&
    edict.bonus.targetHouse === houseKey
  ) {
    return Math.max(0, 1 - edict.bonus.pct / 100);
  }
  return 1.0;
}

/** Test hook — clear the cache. */
export function _clearEdictCache(): void {
  cache.clear();
}
