/* ═══════════════════════════════════════════════════════
   CREW MISSIONS — Trade Empire Dispatch

   Mission templates you can send crew on. Each mission
   has a preferred role, a difficulty, a duration, and a
   base success chance that gets modified by the assigned
   crew's stats, morale, and role fit.

   "Send them somewhere dangerous for glory. They may not
    come back. That's the trade."
      — Adjudicator Locke

   Design: AC Brotherhood assassin dispatch + XCOM squad
   risk + Massive Chalice expedition narrative.
   ═══════════════════════════════════════════════════════ */

import type {
  CrewMissionTemplate,
  CrewMissionReward,
  CrewMissionState,
  SerializedCrewMember,
} from "./crewPersistence";
import { CREW_BALANCE } from "./crewBalance";
import { tagsForTemplate } from "./proceduralMissionFactory";

/** Sector → faction key mapping. Used by the tag decorator below to
 *  surface faction:* tags on every hand-authored CrewMissionTemplate.
 *  Sectors not listed in the map fall back to "neutral" — the
 *  sub-task validators ignore neutral-faction tags. */
const SECTOR_FACTION: Record<string, string> = {
  debris_belt: "neutral",
  silent_waypoint: "architect",
  outer_station: "trader_outpost",
  violet_trench: "voltari",
  lesser_hub: "trader_outpost",
  red_perimeter: "thought_virus",
  hellgate_fringe: "hierarchy",
  violet_static: "voltari",
  collector_annex: "collector",
  the_trench: "outer_perimeter",
};

/* ─── TEMPLATES ─── */

/** Decorate a hand-authored template with the standard procedural tag
 *  set so personal-quest sub-tasks (`mission_tag_complete`) work
 *  uniformly across procedurally-generated and hand-authored missions. */
function decorate(template: CrewMissionTemplate): CrewMissionTemplate {
  const factionKey = SECTOR_FACTION[template.sectorId] ?? "neutral";
  return {
    ...template,
    tags: tagsForTemplate({
      factionKey,
      difficulty: template.difficulty,
    }),
  };
}

const RAW_CREW_MISSION_TEMPLATES: CrewMissionTemplate[] = [
  // ── Routine (low risk, low reward) ──
  {
    id: "mission_salvage_sweep",
    name: "Salvage Sweep — Debris Belt",
    sectorId: "debris_belt",
    description:
      "A tumbling pre-Fall freighter drifted into sensor range. Nothing hostile, nothing rare. Just slow, quiet work in vacuum suits.",
    difficulty: "routine",
    durationHours: 6,
    minCrew: 1,
    maxCrew: 2,
    preferredRole: "quartermaster",
    baseSuccessChance: 0.90,
    reward: { salvage: 80, materials: 40, xp: 20 },
    failureReward: { salvage: 20, xp: 5 },
  },
  {
    id: "mission_beacon_survey",
    name: "Beacon Survey — Silent Waypoint",
    sectorId: "silent_waypoint",
    description:
      "An automated Architect beacon has stopped reporting. Probably a stuck servo. Probably.",
    difficulty: "routine",
    durationHours: 4,
    minCrew: 1,
    maxCrew: 2,
    preferredRole: "scientist",
    baseSuccessChance: 0.88,
    reward: { dream: 40, xp: 15 },
  },

  // ── Challenging (real stakes) ──
  {
    id: "mission_market_run",
    name: "Market Run — Outer Station",
    sectorId: "outer_station",
    description:
      "Adjudicator Locke needs a pickup from an outer station. The locals call themselves 'traders.' Their weapons disagree.",
    difficulty: "challenging",
    durationHours: 10,
    minCrew: 2,
    maxCrew: 3,
    preferredRole: "trader",
    baseSuccessChance: 0.75,
    reward: { dream: 120, influence: 30, xp: 40 },
    failureReward: { dream: 20, xp: 10 },
  },
  {
    id: "mission_void_crystal_dive",
    name: "Void Crystal Dive — The Violet Trench",
    sectorId: "violet_trench",
    description:
      "Voltari-space trench with known crystal deposits. Strong EM interference. Any engineer worth their tools can get in and out.",
    difficulty: "challenging",
    durationHours: 12,
    minCrew: 2,
    maxCrew: 3,
    preferredRole: "engineer",
    baseSuccessChance: 0.70,
    reward: { voidCrystals: 6, materials: 50, xp: 50 },
    failureReward: { voidCrystals: 1 },
  },
  {
    id: "mission_diplomatic_envoy",
    name: "Diplomatic Envoy — Lesser Hub",
    sectorId: "lesser_hub",
    description:
      "A minor faction wants to open relations. They respect competence. They punish awkwardness.",
    difficulty: "challenging",
    durationHours: 8,
    minCrew: 1,
    maxCrew: 2,
    preferredRole: "comms_officer",
    baseSuccessChance: 0.72,
    reward: { influence: 60, dream: 40, xp: 35 },
  },

  // ── Dangerous (casualty risk) ──
  {
    id: "mission_terminus_scavenge",
    name: "Terminus Scavenge — The Red Perimeter",
    sectorId: "red_perimeter",
    description:
      "Thought-virus residue saturates the zone. The salvage is incredible. The Medical Bay says no. You have to decide.",
    difficulty: "dangerous",
    durationHours: 18,
    minCrew: 2,
    maxCrew: 4,
    preferredRole: "security",
    baseSuccessChance: 0.55,
    reward: { salvage: 220, materials: 120, voidCrystals: 4, xp: 90, loreFragmentId: "terminus_cache_01" },
    failureReward: { salvage: 30, xp: 15 },
    cost: { dream: 40, materials: 30 },
  },
  {
    id: "mission_abyssal_extraction",
    name: "Abyssal Extraction — Hell Gate Fringe",
    sectorId: "hellgate_fringe",
    description:
      "Something the Hierarchy left behind. Getting it out cleanly is dangerous. Mol'Garath may notice. He tends to.",
    difficulty: "dangerous",
    durationHours: 20,
    minCrew: 3,
    maxCrew: 4,
    preferredRole: "security",
    baseSuccessChance: 0.50,
    reward: { dream: 260, influence: 80, voidCrystals: 5, xp: 100 },
    failureReward: { dream: 40, xp: 20 },
    cost: { dream: 50, voidCrystals: 1 },
  },
  {
    id: "mission_signal_trace",
    name: "Signal Trace — The Violet Static",
    sectorId: "violet_static",
    description:
      "A Voltari signal has been repeating for 2 million years. It just changed. Someone needs to go listen.",
    difficulty: "dangerous",
    durationHours: 16,
    minCrew: 2,
    maxCrew: 3,
    preferredRole: "comms_officer",
    baseSuccessChance: 0.52,
    reward: { dream: 180, xp: 85, loreFragmentId: "voltari_signal_shift" },
    failureReward: { dream: 20, xp: 10 },
  },

  // ── Suicidal (probably-lethal glory runs) ──
  {
    id: "mission_archon_vault",
    name: "Archon Vault — The Collector's Annex",
    sectorId: "collector_annex",
    description:
      "A sealed chamber the Collector left behind. Nothing that has gone in has come out. The Resurrectionist recommends 'volunteers with finished business.'",
    difficulty: "suicidal",
    durationHours: 30,
    minCrew: 3,
    maxCrew: 5,
    preferredRole: "scientist",
    baseSuccessChance: 0.30,
    reward: { dream: 600, voidCrystals: 12, materials: 200, xp: 250, loreFragmentId: "collector_annex_key" },
    failureReward: { dream: 60, xp: 40 },
    cost: { dream: 100, voidCrystals: 2 },
  },
  {
    id: "mission_deadmans_circuit_glory",
    name: "Dead Man's Circuit — Glory Run",
    sectorId: "the_trench",
    description:
      "A clone seat on the Dead Man's Circuit grid. Win: legend. Lose: vacuum-frozen memorial pin. The crew volunteers anyway.",
    difficulty: "suicidal",
    durationHours: 24,
    minCrew: 1,
    maxCrew: 1,
    preferredRole: "navigator",
    baseSuccessChance: 0.25,
    reward: { dream: 500, influence: 200, xp: 300 },
    failureReward: { influence: 20 },
    cost: { dream: 80 },
  },
];

/** Tag-decorated template list — every entry routed through
 *  proceduralMissionFactory.tagsForTemplate. */
export const CREW_MISSION_TEMPLATES: CrewMissionTemplate[] =
  RAW_CREW_MISSION_TEMPLATES.map(decorate);

export function getMissionTemplate(id: string): CrewMissionTemplate | undefined {
  return CREW_MISSION_TEMPLATES.find(t => t.id === id);
}

/* ─── SUCCESS CALCULATION ─── */

export function calculateMissionSuccess(
  template: CrewMissionTemplate,
  assignedCrew: SerializedCrewMember[],
): number {
  if (assignedCrew.length < template.minCrew) return 0;
  // Average of stat total / max + role fit bonus + morale/loyalty
  const statAvg =
    assignedCrew.reduce((sum, m) => {
      const total =
        m.stats.resilience +
        m.stats.intellect +
        m.stats.reflexes +
        m.stats.empathy +
        m.stats.immunity +
        m.stats.adaptability;
      return sum + total / 600;
    }, 0) / assignedCrew.length;
  const moraleAvg =
    assignedCrew.reduce((sum, m) => sum + m.morale / 100, 0) / assignedCrew.length;
  // Role fit bonus
  const hasPreferred = template.preferredRole
    ? assignedCrew.some(m => m.role === template.preferredRole)
    : false;
  const roleBonus = hasPreferred ? 0.12 : 0;
  // Squad-size bonus: extra bodies help a little, but not infinitely
  const sizeBonus = Math.min(0.08, (assignedCrew.length - template.minCrew) * 0.03);
  // Squad cohesion bonus: mean pairwise relationship score ∈ [-100, 100]
  // contributes up to ±10% (hostile squads suffer, bonded squads excel).
  const cohesionBonus = calculateSquadCohesionBonus(assignedCrew);
  const raw =
    template.baseSuccessChance +
    (statAvg - 0.5) * 0.30 +
    (moraleAvg - 0.5) * 0.10 +
    roleBonus +
    sizeBonus +
    cohesionBonus;
  return Math.max(0.05, Math.min(CREW_BALANCE.missionSuccessCap[template.difficulty], raw));
}

/**
 * Returns a bonus in [-0.10, +0.10] based on the mean pairwise relationship
 * score among the assigned crew. Positive bonds → positive bonus; hostile
 * squads → penalty. Singleton squads return 0.
 */
export function calculateSquadCohesionBonus(crew: SerializedCrewMember[]): number {
  if (crew.length < 2) return 0;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < crew.length; i++) {
    for (let j = i + 1; j < crew.length; j++) {
      const a = crew[i].relationships?.[crew[j].id] ?? 0;
      const b = crew[j].relationships?.[crew[i].id] ?? 0;
      total += (a + b) / 2;
      pairs += 1;
    }
  }
  if (pairs === 0) return 0;
  const meanScore = total / pairs; // -100 .. +100
  return Math.max(-0.10, Math.min(0.10, meanScore / 1000));
}

/**
 * Detect rival pairs in a squad — pairs whose mutual relationship score is
 * at or below CREW_BALANCE.rivalryThreshold. Returns an array of
 * [memberA, memberB] tuples for UI display.
 */
export function findRivalPairs(
  crew: SerializedCrewMember[],
): Array<[SerializedCrewMember, SerializedCrewMember]> {
  const pairs: Array<[SerializedCrewMember, SerializedCrewMember]> = [];
  for (let i = 0; i < crew.length; i++) {
    for (let j = i + 1; j < crew.length; j++) {
      const a = crew[i].relationships?.[crew[j].id] ?? 0;
      const b = crew[j].relationships?.[crew[i].id] ?? 0;
      const avg = (a + b) / 2;
      if (avg <= CREW_BALANCE.rivalryThreshold) {
        pairs.push([crew[i], crew[j]]);
      }
    }
  }
  return pairs;
}

/**
 * Detect close bonds — mirror of findRivalPairs for UI purposes. Used to
 * surface friendly pairings as a cohesion boost.
 */
export function findCloseBondPairs(
  crew: SerializedCrewMember[],
): Array<[SerializedCrewMember, SerializedCrewMember]> {
  const pairs: Array<[SerializedCrewMember, SerializedCrewMember]> = [];
  for (let i = 0; i < crew.length; i++) {
    for (let j = i + 1; j < crew.length; j++) {
      const a = crew[i].relationships?.[crew[j].id] ?? 0;
      const b = crew[j].relationships?.[crew[i].id] ?? 0;
      const avg = (a + b) / 2;
      if (avg >= CREW_BALANCE.closeBondThreshold) {
        pairs.push([crew[i], crew[j]]);
      }
    }
  }
  return pairs;
}

/* ─── CASUALTY RESOLUTION ─── */

const DEATH_CHANCE = CREW_BALANCE.missionDeathChance;
const INJURY_CHANCE = CREW_BALANCE.missionInjuryChance;

const LAST_WORDS = [
  "Tell them I didn't hesitate.",
  "The stars look different from here.",
  "Was I... useful?",
  "Don't clone me again. Let this one be the last.",
  "I saw something out there. Something beautiful.",
  "The Collector was right about us.",
  "Take care of the others. They need you more than I did.",
  "I had a dream last night. It was warm.",
  "Promise me you'll keep the lights on in the observation deck.",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function resolveMission(
  mission: CrewMissionState,
  assignedCrew: SerializedCrewMember[],
  seed: number = Date.now(),
): CrewMissionState {
  const success = seededRandom(seed * 13) < mission.successChance;
  const casualties: string[] = [];
  const injured: string[] = [];
  const survived: string[] = [];

  for (const [idx, member] of assignedCrew.entries()) {
    const deathRoll = seededRandom(seed + idx * 31);
    const injuryRoll = seededRandom(seed + idx * 37 + 11);
    // Success reduces casualty rates; dangerous role traits help
    const hasRezGift = member.geneticTraits.includes("necromancers_gift");
    const deathMod = (success ? 0.5 : 1.2) * (hasRezGift ? 0.5 : 1);
    const baseDeath = DEATH_CHANCE[mission.difficulty] * deathMod;
    const baseInjury = INJURY_CHANCE[mission.difficulty] * (success ? 0.7 : 1.1);

    if (deathRoll < baseDeath) {
      casualties.push(member.id);
    } else if (injuryRoll < baseInjury) {
      injured.push(member.id);
    } else {
      survived.push(member.id);
    }
  }

  const rewardGranted: CrewMissionReward = success
    ? mission.reward
    : mission.failureReward ?? {};

  const narrative = buildNarrative(mission, assignedCrew, success, casualties, injured);

  return {
    ...mission,
    status: success
      ? "succeeded"
      : casualties.length >= assignedCrew.length
        ? "lost"
        : "failed",
    resolution: {
      resolvedAt: Date.now(),
      success,
      narrative,
      casualties,
      injured,
      survived,
      rewardGranted,
    },
  };
}

function buildNarrative(
  mission: CrewMissionState,
  crew: SerializedCrewMember[],
  success: boolean,
  casualties: string[],
  injured: string[],
): string {
  const crewNames = crew.map(m => m.name);
  const castList = crewNames.slice(0, 3).join(", ") + (crewNames.length > 3 ? "…" : "");
  if (success && casualties.length === 0 && injured.length === 0) {
    return `${castList} returned clean from ${mission.name}. Locke was impressed. She won't say it.`;
  }
  if (success && casualties.length === 0) {
    return `${castList} completed ${mission.name}. The medical bay is busy. Nobody's name on the memorial wall tonight.`;
  }
  if (success && casualties.length > 0) {
    const deadNames = crew.filter(c => casualties.includes(c.id)).map(c => c.name).join(", ");
    return `${mission.name} succeeded — at a cost. ${deadNames} did not return. The mission brief will be filed under 'victories.' The crew know better.`;
  }
  if (!success && casualties.length === 0) {
    return `${castList} aborted ${mission.name}. Everyone came home. Nothing else did.`;
  }
  if (!success && casualties.length > 0 && casualties.length < crew.length) {
    const deadNames = crew.filter(c => casualties.includes(c.id)).map(c => c.name).join(", ");
    return `${mission.name} went wrong. ${deadNames} didn't make it back. The survivors won't talk about it.`;
  }
  return `Total loss. ${castList} did not return from ${mission.name}. Elara has begun the memorial preparations.`;
}

export function pickLastWords(seed: number): string {
  return LAST_WORDS[Math.floor(seededRandom(seed * 97) * LAST_WORDS.length)];
}

/** Pick the best-fit role for a crew member based on their highest stat.
 *  Returns a role id string that the caller can use to auto-assign a
 *  freshly hatched founder during bootstrap or onboarding flows. */
export function pickBestFitRole(member: SerializedCrewMember): string {
  const stats = member.stats;
  // Map of primary stat → role id (mirrors CREW_ROLES in crewManagement.ts).
  const roleByPrimaryStat: Record<string, string> = {
    intellect: "scientist",
    resilience: "security",
    reflexes: "navigator",
    empathy: "trader",
    immunity: "medic",
    adaptability: "quartermaster",
  };
  let bestStat: keyof typeof stats = "intellect";
  let bestValue = -1;
  for (const s of Object.keys(stats) as Array<keyof typeof stats>) {
    if (stats[s] > bestValue) {
      bestValue = stats[s];
      bestStat = s;
    }
  }
  return roleByPrimaryStat[bestStat] ?? "engineer";
}
