/* ═══════════════════════════════════════════════════════
   MEMORY ENERGY — Act 2 crafting currency

   The diegetic fuel the Engineer's Bench burns every time it
   forges a card. Per §6.2 of the witnessing proposal the bench
   "will not turn away — it will only wait" when the reserve runs
   dry; the authored `outOfMemoryEnergy` line points the player
   at the Trade Empire as the sustainable answer. This module is
   the thin ledger that makes the pinch real: 15 starting units,
   cap 50 pre-Trade-Empire, cap 200 post.

   Earn rates are tuned for the pinch to land roughly after the
   player's fourth or fifth craft — enough to feel the resource,
   not so little that Act 2 stalls. All numbers exported as named
   constants so content designers can tune without touching code
   consumers.

   Pure module. No React, no server imports. Mirrors the shape of
   apps/shared/narratorBond.ts so hooks and reducers can read it
   the same way.
   ═══════════════════════════════════════════════════════ */

export const MEMORY_ENERGY_MIN = 0;
export const MEMORY_ENERGY_CAP_BASE = 50;
export const MEMORY_ENERGY_CAP_TRADE_EMPIRE = 200;
export const MEMORY_ENERGY_STARTING = 15;

/** Rarity-indexed craft costs. Matches the rarity ids in craftingData.ts. */
export const MEMORY_ENERGY_COSTS = {
  common: 3,
  uncommon: 6,
  rare: 10,
  epic: 18,
  legendary: 30,
  mythic: 50,
} as const;

export type MemoryEnergyRarity = keyof typeof MEMORY_ENERGY_COSTS;

/** Sources that grant Memory Energy during gameplay. */
export type MemoryEnergyEarnSource =
  | "cardBattleWin"
  | "chessWin"
  | "arenaWin"
  | "recordingDiscovery"
  | "dailyBriefClaim"
  | "dev";

export const MEMORY_ENERGY_EARN_RATES: Record<MemoryEnergyEarnSource, number> = {
  cardBattleWin: 2,
  chessWin: 1,
  arenaWin: 3,
  recordingDiscovery: 10,
  dailyBriefClaim: 1,
  dev: 0,
};

/** Clamp an arbitrary number to [0, cap]. Non-finite → 0. */
export function clampMemoryEnergy(value: number, cap: number): number {
  const max = Number.isFinite(cap) && cap > 0 ? cap : MEMORY_ENERGY_CAP_BASE;
  if (!Number.isFinite(value)) return MEMORY_ENERGY_MIN;
  if (value < MEMORY_ENERGY_MIN) return MEMORY_ENERGY_MIN;
  if (value > max) return max;
  return value;
}

/**
 * Apply a delta (positive or negative) to the current Memory Energy,
 * clamped to [0, cap]. Returns the new value.
 */
export function adjustMemoryEnergy(
  current: number,
  delta: number,
  cap: number,
): number {
  const base = Number.isFinite(current) ? current : MEMORY_ENERGY_MIN;
  return clampMemoryEnergy(base + delta, cap);
}

/**
 * Compute the Memory Energy cap from narrative flags. The Trade Empire
 * unlock (which fires atomically with `act_2_complete`) lifts the cap
 * from 50 → 200. This is the release valve the §6.2 framing line
 * points at explicitly.
 */
export function computeMemoryEnergyCap(
  flags: Record<string, unknown> | null | undefined,
): number {
  if (!flags) return MEMORY_ENERGY_CAP_BASE;
  if (flags.trade_empire_unlocked === true) {
    return MEMORY_ENERGY_CAP_TRADE_EMPIRE;
  }
  return MEMORY_ENERGY_CAP_BASE;
}

/**
 * Get the Memory Energy cost for a recipe by rarity. Falls back to
 * the common cost if the rarity tag is unrecognized so crafts never
 * silently skip the currency check.
 */
export function getMemoryEnergyCostForRarity(
  rarity: string | null | undefined,
): number {
  if (!rarity) return MEMORY_ENERGY_COSTS.common;
  if ((rarity as MemoryEnergyRarity) in MEMORY_ENERGY_COSTS) {
    return MEMORY_ENERGY_COSTS[rarity as MemoryEnergyRarity];
  }
  return MEMORY_ENERGY_COSTS.common;
}

/**
 * Can the player afford a craft at this cost?
 */
export function canAffordMemoryEnergy(
  current: number,
  cost: number,
): boolean {
  return Number.isFinite(current) && current >= cost;
}

/**
 * Apply an earn event at the configured rate for the given source.
 * Returns { next, delta } so callers can animate the HUD.
 */
export function earnMemoryEnergy(
  source: MemoryEnergyEarnSource,
  current: number,
  cap: number,
  overrideDelta?: number,
): { next: number; delta: number } {
  const delta =
    typeof overrideDelta === "number" && Number.isFinite(overrideDelta)
      ? overrideDelta
      : MEMORY_ENERGY_EARN_RATES[source] ?? 0;
  const next = adjustMemoryEnergy(current, delta, cap);
  return { next, delta: next - (Number.isFinite(current) ? current : 0) };
}
