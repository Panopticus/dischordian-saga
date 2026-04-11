/* ═══════════════════════════════════════════════════════
   CREW PERSISTENCE — Shared State Shape & Helpers

   A single serializable blob that holds everything about
   the player's crew: roster, bloodlines, incubator pods,
   missions, and the activity feed. Lives under
   userProgress.gameData.crew, following the same pattern
   as tradeEmpire.

   This module is imported by both the server (tRPC crew
   router) and the client (CrewRosterPage). It keeps its
   own copy of structural types to avoid cross-package
   imports — the client-side crewGenetics/crewManagement
   files define the authoritative runtime types; this
   file mirrors the serialized shape.
   ═══════════════════════════════════════════════════════ */

/* ─── MIRRORED TYPES (serializable subset) ─── */

export type GeneticStat =
  | "resilience"
  | "intellect"
  | "reflexes"
  | "empathy"
  | "immunity"
  | "adaptability";

export type CrewSpecies =
  | "human"
  | "demagi"
  | "quarchon"
  | "neyon"
  | "voltari"
  | "construct"
  | "abyssal";

export type BloodlineId =
  | "void_resonance"
  | "iron_memory"
  | "crimson_vigil"
  | "temporal_echo"
  | "storm_circuit"
  | "lattice_prime"
  | "echo_synthesis"
  | "terminus_aegis"
  | "blood_weave";

export type CrewRoleId =
  | "navigator"
  | "engineer"
  | "medic"
  | "security"
  | "trader"
  | "scientist"
  | "comms_officer"
  | "quartermaster";

export type CrewStatus =
  | "active"
  | "injured"
  | "sick"
  | "missing"
  | "dead"
  | "incubating"
  | "on_mission";

export type Gender = "female" | "male" | "non-binary";

export type PodStatus = "empty" | "gestating" | "ready" | "malfunction";

export interface SerializedCrewMember {
  id: string;
  name: string;
  nickname: string | null;
  species: CrewSpecies;
  gender: Gender;
  bloodlineId: BloodlineId;
  generation: number;
  parentIds: [string, string] | null;
  children: string[];
  geneticTraits: string[];
  role: CrewRoleId | null;
  stats: Record<GeneticStat, number>;
  morale: number;
  health: number;
  loyalty: number;
  status: CrewStatus;
  age: number;
  maxAge: number;
  missionHistory: string[];
  relationships: Record<string, number>;
  deathRecord?: { cycle: number; cause: string; lastWords: string };
  birthCycle: number;
  /** Founder flag — the first member of a bloodline, set at hatch time. */
  isFounder?: boolean;
  /** Optional portrait override — id of a named-NPC visual DNA entry
   *  (see apps/shared/characterVisualDNA.ts) to use instead of the
   *  procedural CrewPortrait. Used for named bootstrap founders and
   *  future narrative-significant crew. */
  portraitOverrideId?: string;
}

export interface SerializedBloodline {
  id: BloodlineId;
  founderTemplateId: string;
  name: string;
  motto: string;
  color: string;
  generationCount: number;
  geneticDrift: number;
  diversityIndex: number;
  activeTraits: string[];
  recessiveTraits: string[];
  power: {
    name: string;
    description: string;
    stat: string;
    baseValue: number;
    perGeneration: number;
  };
}

export interface SerializedPod {
  id: number;
  status: PodStatus;
  templateId: string | null;
  bloodlineId: BloodlineId | null;
  generation: number;
  parentIds: [string, string] | null;
  timeRemainingHours: number;
  totalTimeHours: number;
  geneticIntegrity: number;
  traits: string[];
}

export interface SerializedFeedEntry {
  id: string;
  timestamp: number;
  roomId: string;
  category: string;
  text: string;
  severity: "info" | "warning" | "alert" | "critical";
  crewMemberId?: string;
  foreshadows?: string;
  playerActionRef?: string;
  actionable: boolean;
}

/* ─── MISSION STATE ─── */

export type CrewMissionDifficulty = "routine" | "challenging" | "dangerous" | "suicidal";
export type CrewMissionStatus = "dispatched" | "succeeded" | "failed" | "lost";

export interface CrewMissionReward {
  dream?: number;
  salvage?: number;
  materials?: number;
  influence?: number;
  voidCrystals?: number;
  xp?: number;
  loreFragmentId?: string;
}

export interface CrewMissionTemplate {
  id: string;
  name: string;
  sectorId: string;
  description: string;
  difficulty: CrewMissionDifficulty;
  durationHours: number;
  minCrew: number;
  maxCrew: number;
  preferredRole: CrewRoleId | null;
  baseSuccessChance: number;
  reward: CrewMissionReward;
  failureReward?: CrewMissionReward;
}

export interface CrewMissionState {
  id: string;
  templateId: string;
  name: string;
  sectorId: string;
  description: string;
  difficulty: CrewMissionDifficulty;
  assignedCrewIds: string[];
  dispatchedAt: number;
  completesAt: number;
  successChance: number;
  preferredRole: CrewRoleId | null;
  reward: CrewMissionReward;
  failureReward?: CrewMissionReward;
  status: CrewMissionStatus;
  resolution?: {
    resolvedAt: number;
    success: boolean;
    narrative: string;
    casualties: string[];
    injured: string[];
    survived: string[];
    rewardGranted: CrewMissionReward;
  };
}

export interface CrewMissionStats {
  totalDispatched: number;
  totalSucceeded: number;
  totalFailed: number;
  totalCasualties: number;
}

/* ─── BREEDING REQUEST (pending decision) ─── */

export interface PendingOffspring {
  id: string;
  parent1Id: string;
  parent2Id: string;
  parent1Name: string;
  parent2Name: string;
  createdAt: number;
  bloodlineId: BloodlineId;
  generation: number;
  stats: Record<GeneticStat, number>;
  inheritedTraits: string[];
  newMutations: string[];
  geneticFitness: number;
  inbreedingPenalty: number;
  reviewed: boolean;
}

/* ─── ROMANCE ─── */

export interface CrewRomance {
  id: string;
  memberAId: string;
  memberBId: string;
  declaredAt: number;
  status: "courtship" | "partnered" | "estranged" | "ended";
}

/* ─── CREW STATE (the root blob) ─── */

export interface CrewState {
  version: number;
  roster: {
    members: SerializedCrewMember[];
    maxCapacity: number;
    deceased: SerializedCrewMember[];
    totalCloned: number;
    totalLost: number;
    generationRecord: number;
  };
  bloodlines: Partial<Record<BloodlineId, SerializedBloodline>>;
  incubator: {
    pods: SerializedPod[];
    totalCloned: number;
    malfunctionCount: number;
  };
  feed: SerializedFeedEntry[];
  feedLastGenerated: number;
  feedUnreadCount: number;
  missions: CrewMissionState[];
  missionStats: CrewMissionStats;
  pendingOffspring: PendingOffspring[];
  romances: CrewRomance[];
  lastTickAt: number;
  lastAgingTickAt: number;
  firstCrewMemberBorn: boolean;
  crewSystemUnlocked: boolean;
  generation2Reached: boolean;
  dmcClonesSent: number;
  dmcClonesLost: number;
}

export const CREW_STATE_VERSION = 1;
export const MAX_CREW_CAPACITY = 12;
export const MAX_INCUBATOR_PODS = 6;
export const MAX_FEED_ENTRIES = 80;

export function createDefaultCrewState(): CrewState {
  return {
    version: CREW_STATE_VERSION,
    roster: {
      members: [],
      maxCapacity: MAX_CREW_CAPACITY,
      deceased: [],
      totalCloned: 0,
      totalLost: 0,
      generationRecord: 1,
    },
    bloodlines: {},
    incubator: {
      pods: Array.from({ length: MAX_INCUBATOR_PODS }, (_, i) => ({
        id: i + 1,
        status: "empty" as PodStatus,
        templateId: null,
        bloodlineId: null,
        generation: 1,
        parentIds: null,
        timeRemainingHours: 0,
        totalTimeHours: 0,
        geneticIntegrity: 100,
        traits: [],
      })),
      totalCloned: 0,
      malfunctionCount: 0,
    },
    feed: [],
    feedLastGenerated: 0,
    feedUnreadCount: 0,
    missions: [],
    missionStats: {
      totalDispatched: 0,
      totalSucceeded: 0,
      totalFailed: 0,
      totalCasualties: 0,
    },
    pendingOffspring: [],
    romances: [],
    lastTickAt: 0,
    lastAgingTickAt: 0,
    firstCrewMemberBorn: false,
    crewSystemUnlocked: false,
    generation2Reached: false,
    dmcClonesSent: 0,
    dmcClonesLost: 0,
  };
}

/* ─── VALIDATION / MIGRATION ─── */

export function ensureCrewState(raw: unknown): CrewState {
  const defaults = createDefaultCrewState();
  if (!raw || typeof raw !== "object") return defaults;
  const incoming = raw as Partial<CrewState>;
  return {
    ...defaults,
    ...incoming,
    roster: { ...defaults.roster, ...(incoming.roster ?? {}) },
    incubator: { ...defaults.incubator, ...(incoming.incubator ?? {}) },
    missionStats: { ...defaults.missionStats, ...(incoming.missionStats ?? {}) },
    romances: incoming.romances ?? [],
    version: CREW_STATE_VERSION,
  };
}

/* ─── QUERIES ─── */

export function countActiveCrew(state: CrewState): number {
  return state.roster.members.filter(m => m.status === "active").length;
}

export function hasGeneration2(state: CrewState): boolean {
  return state.generation2Reached || state.roster.members.some(m => m.generation >= 2);
}

export function getEligibleParents(state: CrewState): SerializedCrewMember[] {
  return state.roster.members.filter(m => m.status === "active");
}

export function findMember(state: CrewState, memberId: string): SerializedCrewMember | undefined {
  return state.roster.members.find(m => m.id === memberId);
}

export function trimFeed(entries: SerializedFeedEntry[]): SerializedFeedEntry[] {
  if (entries.length <= MAX_FEED_ENTRIES) return entries;
  return entries.slice(entries.length - MAX_FEED_ENTRIES);
}

/** Returns true if crew.bootstrap should be allowed to run. The mutation
 *  requires the crew system to be unlocked AND a roster that has never
 *  held a member (living or dead). Used by the router's bootstrap
 *  procedure and unit tests. */
export function canBootstrapCrew(state: CrewState): { ok: true } | { ok: false; error: string } {
  if (!state.crewSystemUnlocked) {
    return { ok: false, error: "crew system not unlocked" };
  }
  if (state.roster.members.length > 0 || state.roster.deceased.length > 0) {
    return { ok: false, error: "already bootstrapped" };
  }
  return { ok: true };
}
