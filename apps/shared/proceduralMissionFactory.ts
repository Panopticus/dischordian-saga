/* ═══════════════════════════════════════════════════════
   PROCEDURAL MISSION FACTORY — generalized from
   collectorsWorkMissions for crew dispatch beyond breeding.

   Generates `CrewMissionTemplate` rows on the fly so the
   Army router and Trade router can consume them through
   the existing crewMissions.resolveMission() pipeline
   instead of running parallel resolution code paths.

   Each generated mission optionally references one Loredex
   entry — completing the mission unlocks the entry,
   providing the connective reward layer between gameplay
   and the world's text canon.
   ═══════════════════════════════════════════════════════ */

import type {
  CrewMissionTemplate,
  CrewMissionReward,
} from "./crewPersistence";

export type MissionDifficultyBand =
  | "routine"
  | "challenging"
  | "dangerous"
  | "suicidal";

/** Source surface that requested this mission. Drives flavor + reward
 *  composition. The Army router → "army"; Trade router → "trade";
 *  any narrative arc that needs a generated dispatch can use "story". */
export type MissionSource = "army" | "trade" | "story";

export interface MissionFactoryContext {
  /** Stable id used for caching/dedupe. Recommended:
   *  `${source}.${factionKey}.${difficulty}.${seed}`. */
  id: string;
  /** Source router. */
  source: MissionSource;
  /** Faction key (e.g. "coda", "insurgency", "thaloria_in_exile",
   *  "syndicate_of_death"). Drives sectorId + flavor text. */
  factionKey: string;
  /** Difficulty band. Drives reward magnitude + casualty risk. */
  difficulty: MissionDifficultyBand;
  /** Optional archetype affinity. If provided, members of this
   *  archetype get a roleBonus equivalent on assignment. Used to
   *  surface "personal" missions for specific apprentices. */
  archetypeAffinity?: string;
  /** Optional NPC affinity. If provided, the missions narrative
   *  hooks the named NPC (e.g. "vex_solene" gets Coda Reveal flavor). */
  npcAffinity?: string;
  /** Optional Loredex entry id. Awarded on completion. */
  loredexEntryId?: string;
  /** Optional bloodline / family line affinity for narrative hooks. */
  bloodlineKey?: string;
  /** Numeric seed for any per-instance variation (rng tie-breaker). */
  seed: number;
}

const BAND_DEFAULTS: Record<MissionDifficultyBand, {
  baseSuccessChance: number;
  durationHours: number;
  minCrew: number;
  maxCrew: number;
  reward: CrewMissionReward;
  failureReward?: CrewMissionReward;
}> = {
  routine: {
    baseSuccessChance: 0.88,
    durationHours: 6,
    minCrew: 1,
    maxCrew: 2,
    reward: { salvage: 80, materials: 30, xp: 20 },
  },
  challenging: {
    baseSuccessChance: 0.72,
    durationHours: 10,
    minCrew: 2,
    maxCrew: 3,
    reward: { dream: 120, influence: 30, xp: 40 },
    failureReward: { dream: 20, xp: 10 },
  },
  dangerous: {
    baseSuccessChance: 0.55,
    durationHours: 18,
    minCrew: 2,
    maxCrew: 4,
    reward: { dream: 220, materials: 80, voidCrystals: 4, xp: 90 },
    failureReward: { dream: 30, xp: 15 },
  },
  suicidal: {
    baseSuccessChance: 0.30,
    durationHours: 30,
    minCrew: 3,
    maxCrew: 5,
    reward: { dream: 600, voidCrystals: 12, materials: 200, xp: 250 },
    failureReward: { dream: 60, xp: 40 },
  },
};

/** Faction → flavor strings indexed by difficulty. Pulled from the
 *  surrounding lore corpus where possible. Where a faction isn't
 *  explicitly listed we fall back to generic. */
const FACTION_FLAVOR: Record<string, Partial<Record<MissionDifficultyBand, {
  name: string;
  description: string;
  sectorId: string;
  preferredRole: string;
}>>> = {
  coda: {
    routine: {
      name: "Coda Sweep — Acoustic Verification",
      description:
        "Vex Solène's Maestro line wants a routine sweep of their Coda venue's acoustic relay. Quiet work; Locke calls it 'the violin maintenance.'",
      sectorId: "coda_venue",
      preferredRole: "engineer",
    },
    challenging: {
      name: "Coda Reveal — Off-Cadence Insertion",
      description:
        "Vex Solène needs a Reveal-cadence mission run between scheduled performances. Off-tempo. Risky for the line. Pays in influence.",
      sectorId: "coda_venue",
      preferredRole: "comms_officer",
    },
    dangerous: {
      name: "Coda Recovery — The Reveal That Failed",
      description:
        "The Coda's last Reveal cadence ended badly. The recordings are still in the venue. Recover them. Some of them are the player.",
      sectorId: "coda_venue",
      preferredRole: "security",
    },
  },
  insurgency: {
    routine: {
      name: "Iron-Cadre Drill — Patrol Runs",
      description:
        "The Insurgency's new Iron-Clad Lion is training. They need a routine patrol. Don't be late.",
      sectorId: "heart_of_time",
      preferredRole: "security",
    },
    challenging: {
      name: "Cadre Operation — Syndicate Counter-Move",
      description:
        "Wraith Calder couldn't finish this in life. Jericho Jones is finishing it now. The crew is along for the ride.",
      sectorId: "thaloria_outskirts",
      preferredRole: "security",
    },
    dangerous: {
      name: "Iron-Lion Confrontation — Direct Engagement",
      description:
        "The Syndicate of Death is moving on Jericho. Cadre formation, direct engagement, no fallback.",
      sectorId: "thaloria_central",
      preferredRole: "security",
    },
  },
  syndicate_of_death: {
    challenging: {
      name: "Syndicate Reconnaissance — The Quiet Door",
      description:
        "The Syndicate's protocols still leak. Find one of the leak points, photograph the door, leave nothing.",
      sectorId: "syndicate_perimeter",
      preferredRole: "navigator",
    },
    dangerous: {
      name: "Syndicate Theft — Resurrection Protocols Echo",
      description:
        "An echo of Wraith Calder's old theft. The Syndicate has new protocols. Bring back enough to read the new pattern.",
      sectorId: "syndicate_inner",
      preferredRole: "scientist",
    },
    suicidal: {
      name: "Syndicate Inner Sanctum — The Final Run",
      description:
        "The Syndicate's deepest chamber. No survivors expected. Locke advises against. The crew volunteers anyway.",
      sectorId: "syndicate_sanctum",
      preferredRole: "security",
    },
  },
  thaloria_in_exile: {
    routine: {
      name: "Daily-Names Ceremony — Pre-Rite Logistics",
      description:
        "The Hierophant's daily ceremony needs supplies. A quiet errand. The crew member assigned will be asked, gently, about their name.",
      sectorId: "thaloria_in_exile",
      preferredRole: "trader",
    },
    challenging: {
      name: "Hierophant's Letter — Antiquarian Collaboration",
      description:
        "Wraith Calder wants a letter delivered to the Antiquarian. The letter has three margin notes that match the Antiquarian's ep2-04 entry.",
      sectorId: "thaloria_courier_route",
      preferredRole: "comms_officer",
    },
  },
};

const GENERIC_FLAVOR: Record<MissionDifficultyBand, {
  name: string;
  description: string;
  sectorId: string;
  preferredRole: string;
}> = {
  routine: {
    name: "Sector Sweep — Quiet Run",
    description:
      "A routine perimeter sweep. Locke files these under 'training,' and the crew calls them 'the easy ones.' They aren't always.",
    sectorId: "outer_perimeter",
    preferredRole: "navigator",
  },
  challenging: {
    name: "Mid-Tier Operation — Coordinated Strike",
    description:
      "A mid-tier op, real stakes. Multiple crew, coordinated dispatch, recovery extraction at endpoint.",
    sectorId: "mid_perimeter",
    preferredRole: "security",
  },
  dangerous: {
    name: "Deep Insertion — Casualty Risk Acknowledged",
    description:
      "A deep-insertion op. Medical Bay says no. The brief asks the crew to consider whether they have anyone to come back to.",
    sectorId: "inner_perimeter",
    preferredRole: "security",
  },
  suicidal: {
    name: "Glory Run — The Long Drop",
    description:
      "Probably-lethal. The reward is legend or memorial. The crew volunteers anyway. The Resurrectionist used to say these were his favorite. He is not here to comment now.",
    sectorId: "long_drop",
    preferredRole: "navigator",
  },
};

/** Generate a single CrewMissionTemplate from the given context. Pure;
 *  the caller persists/dispatches. */
export function generateMission(
  ctx: MissionFactoryContext,
): CrewMissionTemplate {
  const band = BAND_DEFAULTS[ctx.difficulty];
  const factionFlavor =
    FACTION_FLAVOR[ctx.factionKey]?.[ctx.difficulty];
  const flavor = factionFlavor ?? GENERIC_FLAVOR[ctx.difficulty];

  const reward: CrewMissionReward = {
    ...band.reward,
    ...(ctx.loredexEntryId ? { loreFragmentId: ctx.loredexEntryId } : {}),
  };

  return {
    id: ctx.id,
    name: flavor.name,
    sectorId: flavor.sectorId,
    description: flavor.description,
    difficulty: ctx.difficulty,
    durationHours: band.durationHours,
    minCrew: band.minCrew,
    maxCrew: band.maxCrew,
    preferredRole: flavor.preferredRole as CrewMissionTemplate["preferredRole"],
    baseSuccessChance: band.baseSuccessChance,
    reward,
    failureReward: band.failureReward,
  };
}

/** Build a deterministic id for a generated mission. */
export function missionFactoryId(
  source: MissionSource,
  factionKey: string,
  difficulty: MissionDifficultyBand,
  seed: number,
): string {
  return `${source}.${factionKey}.${difficulty}.${seed}`;
}
