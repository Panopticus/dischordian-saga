/* ═══════════════════════════════════════════════════════
   CREW TICK PIPELINE — Pure functions

   The same per-query tick logic the server router runs,
   but extracted to a pure-function module so it can be
   unit tested without a DB connection or trpc context.

   The server router imports these and calls them in the
   same order (incubator → missions → aging → ambient feed).
   ═══════════════════════════════════════════════════════ */

import type {
  CrewState,
  SerializedCrewMember,
  SerializedPod,
  SerializedFeedEntry,
} from "./crewPersistence";
import { trimFeed } from "./crewPersistence";
import { CREW_BALANCE } from "./crewBalance";
import { resolveMission, pickLastWords } from "./crewMissions";
import { generateAmbientFeedBatch } from "./crewAmbientFeed";

/* ─── POD TICK ─── */

export function tickIncubator(
  state: CrewState,
  now: number,
  rng: () => number = Math.random,
): CrewState {
  if (state.lastTickAt === 0) {
    return { ...state, lastTickAt: now };
  }
  const hoursElapsed = (now - state.lastTickAt) / (1000 * 60 * 60);
  if (hoursElapsed <= 0) return { ...state, lastTickAt: now };

  let malfunctionCount = state.incubator.malfunctionCount;
  const pods: SerializedPod[] = state.incubator.pods.map(pod => {
    if (pod.status !== "gestating") return pod;
    const remaining = pod.timeRemainingHours - hoursElapsed;
    if (remaining <= 0) {
      return { ...pod, status: "ready", timeRemainingHours: 0 };
    }
    const chance =
      (100 - pod.geneticIntegrity) *
      0.002 *
      Math.min(hoursElapsed, 6) *
      CREW_BALANCE.incubatorMalfunctionMultiplier;
    if (rng() < chance) {
      malfunctionCount += 1;
      return {
        ...pod,
        status: "malfunction",
        timeRemainingHours: remaining,
        geneticIntegrity: Math.max(
          CREW_BALANCE.incubatorIntegrityFloor,
          pod.geneticIntegrity - 10,
        ),
      };
    }
    return { ...pod, timeRemainingHours: remaining };
  });

  return {
    ...state,
    incubator: { ...state.incubator, pods, malfunctionCount },
    lastTickAt: now,
  };
}

/* ─── AGING TICK ─── */

export function tickAging(state: CrewState, now: number): CrewState {
  if (state.lastAgingTickAt === 0) {
    return { ...state, lastAgingTickAt: now };
  }
  const elapsed = now - state.lastAgingTickAt;
  const yearsPassed = Math.floor(elapsed / CREW_BALANCE.realMsPerCrewYear);
  if (yearsPassed <= 0) return state;

  const members: SerializedCrewMember[] = [];
  const newlyDeceased: SerializedCrewMember[] = [];
  let totalLost = state.roster.totalLost;

  for (const m of state.roster.members) {
    if (m.status === "dead") {
      members.push(m);
      continue;
    }
    const newAge = m.age + yearsPassed;
    if (newAge >= m.maxAge) {
      const dead: SerializedCrewMember = {
        ...m,
        age: newAge,
        status: "dead",
        health: 0,
        deathRecord: {
          cycle: newAge,
          cause: "Natural cellular expiration",
          lastWords: pickLastWords(m.name.length + newAge),
        },
      };
      newlyDeceased.push(dead);
      totalLost += 1;
      continue;
    }
    members.push({ ...m, age: newAge });
  }

  return {
    ...state,
    roster: {
      ...state.roster,
      members,
      deceased: [...state.roster.deceased, ...newlyDeceased],
      totalLost,
    },
    lastAgingTickAt: state.lastAgingTickAt + yearsPassed * CREW_BALANCE.realMsPerCrewYear,
  };
}

/* ─── MISSION TICK ─── */

export function applyRelationshipDeltas(
  members: SerializedCrewMember[],
  survivorIds: string[],
  lostIds: string[],
): SerializedCrewMember[] {
  if (survivorIds.length < 2) return members;
  const survivorSet = new Set(survivorIds);
  const winDelta = CREW_BALANCE.relationshipDeltaPerSharedMission;
  const lossDelta = CREW_BALANCE.relationshipDeltaOnSharedLoss;
  return members.map(m => {
    if (!survivorSet.has(m.id)) return m;
    const relationships = { ...m.relationships };
    for (const other of survivorIds) {
      if (other === m.id) continue;
      relationships[other] = Math.max(-100, Math.min(100, (relationships[other] ?? 0) + winDelta));
    }
    if (lostIds.length > 0) {
      for (const other of survivorIds) {
        if (other === m.id) continue;
        relationships[other] = Math.max(
          -100,
          Math.min(100, (relationships[other] ?? 0) + lossDelta),
        );
      }
    }
    return { ...m, relationships };
  });
}

export function tickMissions(state: CrewState, now: number): CrewState {
  let next = state;
  for (const mission of state.missions) {
    if (mission.status !== "dispatched") continue;
    if (now < mission.completesAt) continue;

    const assigned = next.roster.members.filter(m => mission.assignedCrewIds.includes(m.id));
    if (assigned.length === 0) {
      next = {
        ...next,
        missions: next.missions.map(x =>
          x.id === mission.id ? { ...x, status: "lost" as const } : x,
        ),
      };
      continue;
    }
    const resolved = resolveMission(mission, assigned, now + mission.name.length);

    const updatedMembers: SerializedCrewMember[] = [];
    const deceased: SerializedCrewMember[] = [];
    let totalLost = next.roster.totalLost;
    for (const m of next.roster.members) {
      if (!mission.assignedCrewIds.includes(m.id)) {
        updatedMembers.push(m);
        continue;
      }
      if (resolved.resolution?.casualties.includes(m.id)) {
        deceased.push({
          ...m,
          status: "dead" as const,
          health: 0,
          deathRecord: {
            cycle: m.age,
            cause: `Lost during ${mission.name}`,
            lastWords: pickLastWords(now + m.name.length),
          },
        });
        totalLost += 1;
        continue;
      }
      if (resolved.resolution?.injured.includes(m.id)) {
        updatedMembers.push({
          ...m,
          status: "injured",
          health: Math.max(10, m.health - 30),
          morale: Math.max(0, m.morale - 10),
          missionHistory: [...m.missionHistory, mission.id],
        });
        continue;
      }
      updatedMembers.push({
        ...m,
        status: "active",
        morale: Math.min(100, m.morale + (resolved.resolution?.success ? 12 : 4)),
        loyalty: Math.min(100, m.loyalty + (resolved.resolution?.success ? 6 : 2)),
        missionHistory: [...m.missionHistory, mission.id],
      });
    }

    const survivorIds =
      resolved.resolution?.survived ??
      updatedMembers
        .filter(m => mission.assignedCrewIds.includes(m.id))
        .map(m => m.id);
    const casualtyIds = resolved.resolution?.casualties ?? [];
    const withBonds = applyRelationshipDeltas(updatedMembers, survivorIds, casualtyIds);

    const feedEntry: SerializedFeedEntry = {
      id: `mission-resolved-${mission.id}`,
      timestamp: now,
      roomId: "bridge",
      category: "security",
      text: resolved.resolution?.narrative ?? "Mission returned.",
      severity: resolved.resolution?.success ? "info" : "alert",
      actionable: false,
    };

    next = {
      ...next,
      missions: next.missions.map(x => (x.id === mission.id ? resolved : x)),
      roster: {
        ...next.roster,
        members: withBonds,
        deceased: [...next.roster.deceased, ...deceased],
        totalLost,
      },
      missionStats: {
        totalDispatched: next.missionStats.totalDispatched,
        totalSucceeded: next.missionStats.totalSucceeded + (resolved.resolution?.success ? 1 : 0),
        totalFailed: next.missionStats.totalFailed + (resolved.resolution?.success ? 0 : 1),
        totalCasualties:
          next.missionStats.totalCasualties + (resolved.resolution?.casualties.length ?? 0),
      },
      feed: trimFeed([...next.feed, feedEntry]),
      feedUnreadCount: next.feedUnreadCount + 1,
    };
  }
  return next;
}

/* ─── AMBIENT FEED TICK ─── */

export function tickAmbientFeed(state: CrewState, now: number): CrewState {
  if (state.roster.members.length === 0) return state;
  if (now - state.feedLastGenerated < CREW_BALANCE.ambientFeedTickMs) return state;
  const active = state.roster.members.filter(m => m.status === "active");
  if (active.length === 0) return state;
  const batch = generateAmbientFeedBatch(
    active.map(m => m.name),
    Math.floor(now / CREW_BALANCE.ambientFeedTickMs),
    now,
  );
  if (batch.length === 0) return state;
  return {
    ...state,
    feed: trimFeed([...state.feed, ...batch]),
    feedLastGenerated: now,
    feedUnreadCount: state.feedUnreadCount + batch.length,
  };
}

/* ─── COMBINED PIPELINE ─── */

export function applyTick(
  state: CrewState,
  now: number = Date.now(),
  rng?: () => number,
): CrewState {
  let next = tickIncubator(state, now, rng);
  next = tickMissions(next, now);
  next = tickAging(next, now);
  next = tickAmbientFeed(next, now);
  return next;
}
