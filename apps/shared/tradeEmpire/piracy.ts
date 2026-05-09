// apps/shared/tradeEmpire/piracy.ts
//
// §8.8 Piracy. Three pirate factions × two captains each, raid roll
// math, defense and tribute resolution. Pure data + helpers; the
// runtime sits in apps/server/services/piracyService.ts.

export type PirateFactionKey = "free_lance" | "dredges" | "spore_picks";

export interface PirateCaptain {
  captainKey: string;
  faction: PirateFactionKey;
  name: string;
  blurb: string;
}

export interface PirateFactionDef {
  factionKey: PirateFactionKey;
  name: string;
  blurb: string;
  /** Per-tick raid roll probability against eligible routes. */
  raidProbability: number;
  /** Sectors this faction prefers to operate in (loose match). */
  preferredSectors: ReadonlyArray<string>;
  /** Captains belonging to this faction. */
  captains: ReadonlyArray<string>;
}

export const PIRATE_FACTIONS: Readonly<Record<PirateFactionKey, PirateFactionDef>> = {
  free_lance: {
    factionKey: "free_lance",
    name: "Free Lance",
    blurb: "Opportunistic, broadly profit-motivated. Raids when the spread looks favourable.",
    raidProbability: 0.08,
    preferredSectors: ["free_port_alpha", "free_port_beta", "frontier_worlds"],
    captains: ["captain_freelance_morrow", "captain_freelance_thaad"],
  },
  dredges: {
    factionKey: "dredges",
    name: "The Dredges",
    blurb: "Politically motivated; anti-Authority piracy with stencilled sigils.",
    raidProbability: 0.12,
    preferredSectors: ["trade_nexus", "new_babylon_core"],
    captains: ["captain_dredges_korvath", "captain_dredges_vela"],
  },
  spore_picks: {
    factionKey: "spore_picks",
    name: "Spore Picks",
    blurb: "Thought-Virus aligned; raid for the Sovereign's Circle as much as for plunder.",
    raidProbability: 0.15,
    preferredSectors: ["viral_wastes", "panopticon_ruins"],
    captains: ["captain_sporepicks_orsel", "captain_sporepicks_kareen"],
  },
};

export const PIRATE_CAPTAINS: Readonly<Record<string, PirateCaptain>> = {
  captain_freelance_morrow: {
    captainKey: "captain_freelance_morrow",
    faction: "free_lance",
    name: "Captain Morrow",
    blurb: "Charming opportunist; the kind of friend you don't lend money to.",
  },
  captain_freelance_thaad: {
    captainKey: "captain_freelance_thaad",
    faction: "free_lance",
    name: "Captain Thaad",
    blurb: "Broker-pirate; treats raiding as a profession.",
  },
  captain_dredges_korvath: {
    captainKey: "captain_dredges_korvath",
    faction: "dredges",
    name: "Captain Korvath",
    blurb: "Anti-Authority doctrine in jacket form. Inverted Authority crests, gilt buttons.",
  },
  captain_dredges_vela: {
    captainKey: "captain_dredges_vela",
    faction: "dredges",
    name: "Captain Vela",
    blurb: "Comms specialist; revolution as a hobby.",
  },
  captain_sporepicks_orsel: {
    captainKey: "captain_sporepicks_orsel",
    faction: "spore_picks",
    name: "Captain Orsel",
    blurb: "Half-converted; the captain is, technically, still saying yes.",
  },
  captain_sporepicks_kareen: {
    captainKey: "captain_sporepicks_kareen",
    faction: "spore_picks",
    name: "Captain Kareen",
    blurb: "Polite stage of becoming a problem.",
  },
};

/** Routes are raidable above this run count. */
export const RAID_ELIGIBLE_RUN_COUNT = 10;
/** OR above this saturation. */
export const RAID_ELIGIBLE_SATURATION = 120;
/** Tribute fraction (of accumulated route value) to wave off a raid. */
export const RAID_TRIBUTE_FRACTION = 0.25;
/** Number of subsequent missions on this route that yield 0 reward
 *  if the player fails / declines to act on the raid. */
export const RAID_LOSS_MISSIONS = 3;

export interface RaidEligibilityInputs {
  runCount: number;
  saturation: number;
}

export function isRouteRaidable(input: RaidEligibilityInputs): boolean {
  return (
    input.runCount >= RAID_ELIGIBLE_RUN_COUNT
    || input.saturation >= RAID_ELIGIBLE_SATURATION
  );
}

/**
 * Pure helper: roll a raid against a route. Returns the pirate
 * faction that hit, or null if no raid this tick. RNG injected for
 * tests.
 */
export function rollRaid(
  input: RaidEligibilityInputs & { sectorId: string },
  rng: () => number = Math.random,
): { faction: PirateFactionKey; captainKey: string } | null {
  if (!isRouteRaidable(input)) return null;
  // Per-faction roll. Each faction's preferred-sector check biases
  // the roll: if the route is in a preferred sector, full
  // probability; otherwise half. This keeps Spore Picks from
  // raiding Free Ports lanes constantly.
  const candidates: Array<{ faction: PirateFactionKey; effective: number }> = [];
  for (const def of Object.values(PIRATE_FACTIONS)) {
    const inPreferred = def.preferredSectors.includes(input.sectorId);
    const effective = def.raidProbability * (inPreferred ? 1 : 0.5);
    candidates.push({ faction: def.factionKey, effective });
  }
  // Single roll across all factions; pick the highest-rolling that
  // beats its own threshold.
  let chosen: PirateFactionKey | null = null;
  let bestExcess = 0;
  for (const c of candidates) {
    const r = rng();
    const excess = c.effective - r; // positive = passed
    if (excess > 0 && excess > bestExcess) {
      bestExcess = excess;
      chosen = c.faction;
    }
  }
  if (!chosen) return null;
  const def = PIRATE_FACTIONS[chosen];
  const captainKey = def.captains[Math.floor(rng() * def.captains.length)];
  return { faction: chosen, captainKey };
}

/**
 * Defense roll: combine fleet defenseBonus and a base 0.3 chance.
 * Result range: 0.3..0.9 typically. Pure; RNG injected.
 */
export function defenseRoll(
  fleetDefenseBonus: number,
  rng: () => number = Math.random,
): { defended: boolean; threshold: number; roll: number } {
  const threshold = Math.min(0.9, 0.3 + fleetDefenseBonus);
  const roll = rng();
  return { defended: roll < threshold, threshold, roll };
}
