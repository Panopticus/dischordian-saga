// apps/shared/tradeEmpire/fleetCommanders.ts
//
// §8.5 Trade Fleets as Companions. Per-companion fleet bonuses + the
// trait-driven defense roll for §8.8 Piracy raids. Pure data + helpers;
// the runtime sits in apps/server/services/fleetCommandersService.ts.

import type { NpcKey } from "../npcs/types";

export interface FleetCommanderTrait {
  /** The companion who commands the fleet. */
  companionKey: NpcKey;
  /** Display name on the Map tab roster. */
  displayName: string;
  /** Mission reward salvage modifier (e.g. 1.25 = +25%). */
  salvageMultiplier: number;
  /** Mission reward intel modifier (flat add to influence). */
  intelBonus: number;
  /** Defense bonus against pirate raids (0..1; added to roll). */
  defenseBonus: number;
  /** Whether this companion refuses combat-positive missions. */
  refusesCombat: boolean;
  /** Brief flavour the post-mission dialog routes through. */
  voiceFlavour: string;
}

export const FLEET_COMMANDER_TRAITS: Readonly<Record<string, FleetCommanderTrait>> = {
  patch: {
    companionKey: "the_human", // Placeholder until Patch's NpcKey lands.
    displayName: "Patch",
    salvageMultiplier: 1.25,
    intelBonus: 0,
    defenseBonus: 0.0,
    refusesCombat: false,
    voiceFlavour: "engineer-yellow patch-it-back-together; the fleet that fixes itself",
  },
  zephyr_9: {
    companionKey: "the_human", // Placeholder until Zephyr-9's NpcKey lands.
    displayName: "Zephyr-9",
    salvageMultiplier: 1.0,
    intelBonus: 12,
    defenseBonus: 0.30,
    refusesCombat: false,
    voiceFlavour: "intelligence-cyan listen-before-you-speak; the fleet that overhears",
  },
  little_one: {
    companionKey: "the_human", // Placeholder until Little One's NpcKey lands.
    displayName: "Little One",
    salvageMultiplier: 1.0,
    intelBonus: 0,
    defenseBonus: 0.60,
    refusesCombat: true,
    voiceFlavour: "stealth-violet arrive-without-being-announced; the fleet that disappears",
  },
};

export type FleetCommanderKey = keyof typeof FLEET_COMMANDER_TRAITS;

export function allFleetCommanderKeys(): ReadonlyArray<string> {
  return Object.keys(FLEET_COMMANDER_TRAITS);
}

export function getFleetCommander(key: string): FleetCommanderTrait | undefined {
  return FLEET_COMMANDER_TRAITS[key];
}

export interface FleetAssignment {
  /** 1, 2, or 3. */
  fleetSlot: number;
  commanderKey: string;
  assignedAt: number;
}

export const MAX_FLEET_SLOTS = 3;

export function validateFleetCommanderRegistry(): ReadonlyArray<string> {
  const errors: string[] = [];
  for (const [k, def] of Object.entries(FLEET_COMMANDER_TRAITS)) {
    if (def.salvageMultiplier <= 0) {
      errors.push(`${k}: salvageMultiplier must be positive`);
    }
    if (def.defenseBonus < 0 || def.defenseBonus > 1) {
      errors.push(`${k}: defenseBonus must be in [0, 1]`);
    }
    if (!def.displayName) {
      errors.push(`${k}: displayName required`);
    }
  }
  return errors;
}
