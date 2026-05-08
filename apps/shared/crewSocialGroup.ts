/* ═══════════════════════════════════════════════════════
   CREW SOCIAL GROUP — "How well everyone gets along."

   Tracks the crew + recruited NPCs as one social group:
    - cohesionScore (mean pairwise relationship, -100..+100)
    - weather (hostile|tense|warm|bonded|family)
    - openTensions (pairs requiring mediation)
    - knownBonds (pairs over close-bond threshold)

   Recomputed on every relationship-graph mutation. Surfaces
   in the Commons UI as a weather badge and a global combat
   cohesion multiplier.
   ═══════════════════════════════════════════════════════ */

import type { SerializedCrewMember } from "./crewPersistence";
import { CREW_BALANCE } from "./crewBalance";

export type CommonsWeather =
  | "hostile"
  | "tense"
  | "warm"
  | "bonded"
  | "family";

export interface CrewSocialGroup {
  cohesionScore: number;
  weather: CommonsWeather;
  openTensions: SocialTension[];
  knownBonds: KnownBond[];
  lastSceneRolledAt: number;
}

export interface SocialTension {
  /** Pair of memberKeys whose relationship is below rivalry threshold. */
  memberKeyA: string;
  memberKeyB: string;
  /** ms when the tension was first observed. */
  observedAt: number;
  /** Has the player mediated this tension? */
  mediated?: boolean;
}

export interface KnownBond {
  memberKeyA: string;
  memberKeyB: string;
  /** "friend" | "rival" | "lover" | "mentor" — derived from relationship
   *  + romance state. */
  kind: "friend" | "rival" | "lover" | "mentor";
}

export const DEFAULT_SOCIAL_GROUP: CrewSocialGroup = {
  cohesionScore: 0,
  weather: "warm",
  openTensions: [],
  knownBonds: [],
  lastSceneRolledAt: 0,
};

/** Compute the mean of all pairwise relationship scores. Returns 0 if
 *  fewer than 2 members. Pure. */
export function computeCohesion(
  members: SerializedCrewMember[],
): number {
  if (members.length < 2) return 0;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i].relationships?.[members[j].id] ?? 0;
      const b = members[j].relationships?.[members[i].id] ?? 0;
      total += (a + b) / 2;
      pairs++;
    }
  }
  return pairs > 0 ? total / pairs : 0;
}

/** Derive the weather label from cohesion score. */
export function deriveWeather(score: number): CommonsWeather {
  if (score <= -40) return "hostile";
  if (score <= -10) return "tense";
  if (score < 30) return "warm";
  if (score < 60) return "bonded";
  return "family";
}

/** Re-derive the social group state from the current crew member set.
 *  Pure. Caller persists. */
export function recomputeSocialGroup(args: {
  members: SerializedCrewMember[];
  prev?: CrewSocialGroup;
  now?: number;
}): CrewSocialGroup {
  const { members, prev, now = Date.now() } = args;
  const score = computeCohesion(members);
  const weather = deriveWeather(score);
  const tensions: SocialTension[] = [];
  const bonds: KnownBond[] = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i].relationships?.[members[j].id] ?? 0;
      const b = members[j].relationships?.[members[i].id] ?? 0;
      const avg = (a + b) / 2;
      if (avg <= CREW_BALANCE.rivalryThreshold) {
        const exists = prev?.openTensions.find(
          (t) =>
            (t.memberKeyA === members[i].id && t.memberKeyB === members[j].id) ||
            (t.memberKeyA === members[j].id && t.memberKeyB === members[i].id),
        );
        tensions.push({
          memberKeyA: members[i].id,
          memberKeyB: members[j].id,
          observedAt: exists?.observedAt ?? now,
          mediated: exists?.mediated,
        });
      }
      if (avg >= CREW_BALANCE.closeBondThreshold) {
        bonds.push({
          memberKeyA: members[i].id,
          memberKeyB: members[j].id,
          kind: "friend",
        });
      }
    }
  }
  return {
    cohesionScore: Math.round(score),
    weather,
    openTensions: tensions,
    knownBonds: bonds,
    lastSceneRolledAt: prev?.lastSceneRolledAt ?? 0,
  };
}

/** Combat cohesion multiplier for mission success. Maps weather to a
 *  global ±10% modifier on top of per-pair cohesion bonuses. */
export const WEATHER_MULTIPLIER: Record<CommonsWeather, number> = {
  hostile: 0.9,
  tense: 0.95,
  warm: 1.0,
  bonded: 1.05,
  family: 1.1,
};
