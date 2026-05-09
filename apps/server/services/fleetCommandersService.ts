/* ═══════════════════════════════════════════════════════
   FLEET COMMANDERS SERVICE — §8.5 Trade Fleets as Companions.

   Per-user 3-slot fleet roster. Slots are assigned to a
   companion who provides a trait that modifies mission
   rewards and §8.8 Piracy defense rolls.

   In-memory state (Map keyed by userId). Phase D persists in
   memory only; a tradeFleetCommanders DB table is the
   follow-up. Tests pin the data shape and trait-application
   math without needing the DB.
   ═══════════════════════════════════════════════════════ */

import {
  FLEET_COMMANDER_TRAITS,
  MAX_FLEET_SLOTS,
  type FleetAssignment,
  type FleetCommanderTrait,
} from "@shared/tradeEmpire/fleetCommanders";

const fleetsByUser = new Map<number, FleetAssignment[]>();

export function listFleets(userId: number): ReadonlyArray<FleetAssignment> {
  return fleetsByUser.get(userId) ?? [];
}

export function getFleetForSlot(
  userId: number,
  slot: number,
): FleetAssignment | null {
  return listFleets(userId).find(f => f.fleetSlot === slot) ?? null;
}

export function assignCommander(
  userId: number,
  slot: number,
  commanderKey: string,
): { ok: true } | { ok: false; error: string } {
  if (slot < 1 || slot > MAX_FLEET_SLOTS) {
    return { ok: false, error: `slot must be 1..${MAX_FLEET_SLOTS}` };
  }
  if (!FLEET_COMMANDER_TRAITS[commanderKey]) {
    return { ok: false, error: `unknown commanderKey ${commanderKey}` };
  }
  const cur = [...(fleetsByUser.get(userId) ?? [])];
  // Filter out an existing slot assignment.
  const without = cur.filter(f => f.fleetSlot !== slot);
  // Each commander can only command one slot.
  const withoutCommander = without.filter(f => f.commanderKey !== commanderKey);
  withoutCommander.push({ fleetSlot: slot, commanderKey, assignedAt: Date.now() });
  fleetsByUser.set(userId, withoutCommander);
  return { ok: true };
}

export function unassignSlot(userId: number, slot: number): void {
  const cur = fleetsByUser.get(userId);
  if (!cur) return;
  fleetsByUser.set(userId, cur.filter(f => f.fleetSlot !== slot));
}

/**
 * Apply the assigned fleet's reward modifiers to a mission outcome.
 * Returns the modified reward bag. If `fleetSlot` is null, returns
 * the input unchanged.
 */
export interface RewardBag {
  dream: number;
  influence: number;
  salvage?: number;
}

export function applyFleetRewards(
  userId: number,
  fleetSlot: number | null,
  base: RewardBag,
): { rewards: RewardBag; commander: FleetCommanderTrait | null } {
  if (fleetSlot === null) return { rewards: base, commander: null };
  const fleet = getFleetForSlot(userId, fleetSlot);
  if (!fleet) return { rewards: base, commander: null };
  const trait = FLEET_COMMANDER_TRAITS[fleet.commanderKey];
  if (!trait) return { rewards: base, commander: null };
  const rewards: RewardBag = {
    dream: base.dream,
    influence: base.influence + trait.intelBonus,
    salvage: Math.round((base.salvage ?? 0) * trait.salvageMultiplier),
  };
  return { rewards, commander: trait };
}

/**
 * Compute the §8.8 raid-defense roll bonus for the user's fleet.
 * Returns the highest defenseBonus across assigned commanders.
 * A fleet with multiple slots compounds: highest bonus wins
 * (don't stack — stacking would trivialise piracy).
 */
export function getFleetDefenseBonus(userId: number): number {
  const fleets = listFleets(userId);
  let best = 0;
  for (const f of fleets) {
    const trait = FLEET_COMMANDER_TRAITS[f.commanderKey];
    if (!trait) continue;
    if (trait.defenseBonus > best) best = trait.defenseBonus;
  }
  return best;
}

/** Test hook. */
export function _resetFleetState(): void {
  fleetsByUser.clear();
}
