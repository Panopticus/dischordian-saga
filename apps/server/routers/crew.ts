/**
 * CREW ROUTER
 * ──────────────────────────────────────────────────
 * Cloning, breeding, bloodlines, incubator pods,
 * crew missions, memorial wall, activity feed.
 *
 * State stored in userProgress.gameData.crew under the
 * dischordian-saga franchise, matching the tradeEmpire
 * pattern. The client does the heavy lifting for genetic
 * math (see apps/client/src/game/crewGenetics.ts) — this
 * router just persists and resolves time-gated events
 * (pod gestation ticks, mission completions, aging).
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import {
  ensureCrewState,
  createDefaultCrewState,
  trimFeed,
  MAX_CREW_CAPACITY,
  MAX_INCUBATOR_PODS,
  type CrewState,
  type SerializedCrewMember,
  type SerializedPod,
  type SerializedBloodline,
  type SerializedFeedEntry,
  type PendingOffspring,
  type CrewMissionState,
  type BloodlineId,
} from "../../shared/crewPersistence";
import {
  CREW_MISSION_TEMPLATES,
  getMissionTemplate,
  calculateMissionSuccess,
  resolveMission,
  pickLastWords,
} from "../../shared/crewMissions";
import { generateAmbientFeedBatch } from "../../shared/crewAmbientFeed";
import { CREW_BALANCE } from "../../shared/crewBalance";

const FRANCHISE = "dischordian-saga";

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

async function loadState(userId: number): Promise<CrewState> {
  const db = await getDb();
  if (!db) dbUnavailable();
  const rows = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)))
    .limit(1);
  const gameData = (rows[0]?.gameData as any) ?? {};
  return ensureCrewState(gameData.crew);
}

async function saveState(userId: number, state: CrewState): Promise<void> {
  const db = await getDb();
  if (!db) dbUnavailable();
  const rows = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)))
    .limit(1);
  const existing = (rows[0]?.gameData as any) ?? {};
  const next = { ...existing, crew: state };
  if (rows.length > 0) {
    await db
      .update(userProgress)
      .set({ gameData: next })
      .where(and(eq(userProgress.userId, userId), eq(userProgress.franchiseId, FRANCHISE)));
  } else {
    await db.insert(userProgress).values({
      userId,
      franchiseId: FRANCHISE,
      xp: 0,
      level: 1,
      points: 0,
      gameData: next,
    });
  }
}

/* ─── POD TICK: advance gestation, settle malfunctions ─── */

function tickIncubator(state: CrewState, now: number): CrewState {
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
    // Malfunction chance scales with low integrity and elapsed time
    const chance =
      (100 - pod.geneticIntegrity) *
      0.002 *
      Math.min(hoursElapsed, 6) *
      CREW_BALANCE.incubatorMalfunctionMultiplier;
    if (Math.random() < chance) {
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

/* ─── AMBIENT FEED TICK: generate ambient entries every N hours ─── */

function tickAmbientFeed(state: CrewState, now: number): CrewState {
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

/* ─── AGING TICK: configurable crew-years per real millisecond ─── */

const REAL_MS_PER_CREW_YEAR = CREW_BALANCE.realMsPerCrewYear;

function tickAging(state: CrewState, now: number): CrewState {
  if (state.lastAgingTickAt === 0) {
    return { ...state, lastAgingTickAt: now };
  }
  const elapsed = now - state.lastAgingTickAt;
  const yearsPassed = Math.floor(elapsed / REAL_MS_PER_CREW_YEAR);
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
      // Death by old age
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
    lastAgingTickAt: state.lastAgingTickAt + yearsPassed * REAL_MS_PER_CREW_YEAR,
  };
}

/* ─── RELATIONSHIP UPDATES ─── */

/**
 * Mutate survivor members in-place so every pair that survived a mission
 * together nudges their relationship scores. Losses nudge the survivors'
 * bonds a bit more (trauma bonding).
 */
function applyRelationshipDeltas(
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
    // Trauma-bond with other survivors when anyone was lost
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

/* ─── MISSION TICK: auto-resolve missions whose timer elapsed ─── */

function tickMissions(state: CrewState, now: number): CrewState {
  let next = state;
  for (const mission of state.missions) {
    if (mission.status !== "dispatched") continue;
    if (now < mission.completesAt) continue;

    const assigned = next.roster.members.filter(m => mission.assignedCrewIds.includes(m.id));
    if (assigned.length === 0) {
      // Crew all gone; mark lost
      next = {
        ...next,
        missions: next.missions.map(x =>
          x.id === mission.id ? { ...x, status: "lost" } : x,
        ),
      };
      continue;
    }
    const resolved = resolveMission(mission, assigned, now + mission.name.length);

    // Apply casualties / injuries to the roster
    const updatedMembers: SerializedCrewMember[] = [];
    const deceased: SerializedCrewMember[] = [];
    let totalLost = next.roster.totalLost;
    for (const m of next.roster.members) {
      if (!mission.assignedCrewIds.includes(m.id)) {
        updatedMembers.push(m);
        continue;
      }
      if (resolved.resolution?.casualties.includes(m.id)) {
        const dead = {
          ...m,
          status: "dead" as const,
          health: 0,
          deathRecord: {
            cycle: m.age,
            cause: `Lost during ${mission.name}`,
            lastWords: pickLastWords(now + m.name.length),
          },
        };
        deceased.push(dead);
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
      // Survived cleanly
      updatedMembers.push({
        ...m,
        status: "active",
        morale: Math.min(100, m.morale + (resolved.resolution?.success ? 12 : 4)),
        loyalty: Math.min(100, m.loyalty + (resolved.resolution?.success ? 6 : 2)),
        missionHistory: [...m.missionHistory, mission.id],
      });
    }

    // Bump relationships for the crew who survived this mission together
    const survivorIds =
      resolved.resolution?.survived ??
      updatedMembers
        .filter(m => mission.assignedCrewIds.includes(m.id))
        .map(m => m.id);
    const casualtyIds = resolved.resolution?.casualties ?? [];
    const withBonds = applyRelationshipDeltas(updatedMembers, survivorIds, casualtyIds);

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
    };

    // Push a feed entry for the resolution
    next = {
      ...next,
      feed: trimFeed([
        ...next.feed,
        {
          id: `mission-resolved-${mission.id}`,
          timestamp: now,
          roomId: "bridge",
          category: "security",
          text: resolved.resolution?.narrative ?? "Mission returned.",
          severity: resolved.resolution?.success ? "info" : "alert",
          actionable: false,
        },
      ]),
      feedUnreadCount: next.feedUnreadCount + 1,
    };
  }
  return next;
}

/* ─── FULL TICK (applied on every major query/mutation) ─── */

function applyTick(state: CrewState): CrewState {
  const now = Date.now();
  let next = tickIncubator(state, now);
  next = tickMissions(next, now);
  next = tickAging(next, now);
  next = tickAmbientFeed(next, now);
  return next;
}

/* ═══ ROUTER ═══ */

export const crewRouter = router({
  getState: protectedProcedure.query(async ({ ctx }) => {
    const state = await loadState(ctx.user.id);
    const ticked = applyTick(state);
    if (ticked !== state) await saveState(ctx.user.id, ticked);
    return ticked;
  }),

  /* ─── Bloodline founding ─── */
  foundBloodline: protectedProcedure
    .input(
      z.object({
        bloodlineId: z.string(),
        bloodline: z.record(z.string(), z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = await loadState(ctx.user.id);
      if (state.bloodlines[input.bloodlineId as BloodlineId]) {
        return { success: false, error: "Bloodline already founded" };
      }
      const next: CrewState = {
        ...state,
        bloodlines: {
          ...state.bloodlines,
          [input.bloodlineId]: input.bloodline as unknown as SerializedBloodline,
        },
        crewSystemUnlocked: true,
      };
      await saveState(ctx.user.id, next);
      return { success: true };
    }),

  /* ─── Start incubation in a pod ─── */
  startIncubation: protectedProcedure
    .input(
      z.object({
        podId: z.number(),
        templateId: z.string(),
        bloodlineId: z.string(),
        generation: z.number().min(1),
        parentIds: z.tuple([z.string(), z.string()]).nullable(),
        rarityHours: z.number().min(1),
        traits: z.array(z.string()),
        pendingOffspringId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const pod = state.incubator.pods.find(p => p.id === input.podId);
      if (!pod) return { success: false, error: "Pod not found" };
      if (pod.status !== "empty") {
        return { success: false, error: "Pod is not empty" };
      }
      const generationPenalty = Math.max(0, (input.generation - 1) * 0.5);
      const totalTime = input.rarityHours + generationPenalty;
      const updatedPod: SerializedPod = {
        ...pod,
        status: "gestating",
        templateId: input.templateId,
        bloodlineId: input.bloodlineId as BloodlineId,
        generation: input.generation,
        parentIds: input.parentIds,
        timeRemainingHours: totalTime,
        totalTimeHours: totalTime,
        geneticIntegrity: Math.max(50, 100 - input.generation * 3),
        traits: input.traits,
      };
      // Remove pending offspring if one consumed
      const pendingOffspring = input.pendingOffspringId
        ? state.pendingOffspring.filter(p => p.id !== input.pendingOffspringId)
        : state.pendingOffspring;
      const next: CrewState = {
        ...state,
        incubator: {
          ...state.incubator,
          pods: state.incubator.pods.map(p => (p.id === input.podId ? updatedPod : p)),
        },
        pendingOffspring,
      };
      await saveState(ctx.user.id, next);
      return { success: true, pod: updatedPod };
    }),

  repairPod: protectedProcedure
    .input(z.object({ podId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const pod = state.incubator.pods.find(p => p.id === input.podId);
      if (!pod) return { success: false, error: "Pod not found" };
      if (pod.status !== "malfunction") {
        return { success: false, error: "Pod is not in malfunction" };
      }
      const repaired: SerializedPod = {
        ...pod,
        status: "gestating",
        timeRemainingHours: pod.timeRemainingHours + 2,
      };
      const next: CrewState = {
        ...state,
        incubator: {
          ...state.incubator,
          pods: state.incubator.pods.map(p => (p.id === input.podId ? repaired : p)),
        },
      };
      await saveState(ctx.user.id, next);
      return { success: true };
    }),

  cancelIncubation: protectedProcedure
    .input(z.object({ podId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const pod = state.incubator.pods.find(p => p.id === input.podId);
      if (!pod) return { success: false, error: "Pod not found" };
      const cleared: SerializedPod = {
        id: pod.id,
        status: "empty",
        templateId: null,
        bloodlineId: null,
        generation: 1,
        parentIds: null,
        timeRemainingHours: 0,
        totalTimeHours: 0,
        geneticIntegrity: 100,
        traits: [],
      };
      const next: CrewState = {
        ...state,
        incubator: {
          ...state.incubator,
          pods: state.incubator.pods.map(p => (p.id === input.podId ? cleared : p)),
        },
      };
      await saveState(ctx.user.id, next);
      return { success: true };
    }),

  /* ─── Hatch a ready pod: add a new crew member ─── */
  hatchPod: protectedProcedure
    .input(
      z.object({
        podId: z.number(),
        member: z.record(z.string(), z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const pod = state.incubator.pods.find(p => p.id === input.podId);
      if (!pod) return { success: false, error: "Pod not found" };
      if (pod.status !== "ready") {
        return { success: false, error: "Pod is not ready to hatch" };
      }
      const member = input.member as unknown as SerializedCrewMember;
      if (state.roster.members.length >= MAX_CREW_CAPACITY) {
        return { success: false, error: "Crew roster at max capacity" };
      }

      const cleared: SerializedPod = {
        id: pod.id,
        status: "empty",
        templateId: null,
        bloodlineId: null,
        generation: 1,
        parentIds: null,
        timeRemainingHours: 0,
        totalTimeHours: 0,
        geneticIntegrity: 100,
        traits: [],
      };

      // Bump bloodline generation
      const bl = state.bloodlines[member.bloodlineId];
      const updatedBloodlines = bl
        ? {
            ...state.bloodlines,
            [member.bloodlineId]: {
              ...bl,
              generationCount: Math.max(bl.generationCount, member.generation),
            },
          }
        : state.bloodlines;

      // Link child to parents' children arrays
      const linkedMembers = state.roster.members.map(m => {
        if (!member.parentIds) return m;
        if (m.id === member.parentIds[0] || m.id === member.parentIds[1]) {
          return { ...m, children: [...m.children, member.id] };
        }
        return m;
      });

      const next: CrewState = {
        ...state,
        incubator: {
          ...state.incubator,
          pods: state.incubator.pods.map(p => (p.id === input.podId ? cleared : p)),
          totalCloned: state.incubator.totalCloned + 1,
        },
        roster: {
          ...state.roster,
          members: [...linkedMembers, member],
          totalCloned: state.roster.totalCloned + 1,
          generationRecord: Math.max(state.roster.generationRecord, member.generation),
        },
        bloodlines: updatedBloodlines,
        firstCrewMemberBorn: true,
        generation2Reached: state.generation2Reached || member.generation >= 2,
        feed: trimFeed([
          ...state.feed,
          {
            id: `hatched-${member.id}`,
            timestamp: Date.now(),
            roomId: "cryo_bay",
            category: "crew_life",
            text: `Cryo Bay: ${member.name} has completed incubation. Elara is present for the first breath.`,
            severity: "info",
            actionable: false,
          },
        ]),
        feedUnreadCount: state.feedUnreadCount + 1,
      };
      await saveState(ctx.user.id, next);
      return { success: true, member, generation: member.generation };
    }),

  /* ─── Assign a role ─── */
  assignRole: protectedProcedure
    .input(z.object({ memberId: z.string(), role: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const member = state.roster.members.find(m => m.id === input.memberId);
      if (!member) return { success: false, error: "Member not found" };
      // Un-assign any other member currently holding that role
      const next: CrewState = {
        ...state,
        roster: {
          ...state.roster,
          members: state.roster.members.map(m => {
            if (m.id === input.memberId) return { ...m, role: input.role as any };
            if (input.role && m.role === input.role) return { ...m, role: null };
            return m;
          }),
        },
      };
      await saveState(ctx.user.id, next);
      return { success: true };
    }),

  /* ─── Record a breeding result (client computes genetics) ─── */
  recordOffspring: protectedProcedure
    .input(
      z.object({
        pending: z.record(z.string(), z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const pending = input.pending as unknown as PendingOffspring;
      const next: CrewState = {
        ...state,
        pendingOffspring: [...state.pendingOffspring, pending],
      };
      await saveState(ctx.user.id, next);
      return { success: true };
    }),

  dismissOffspring: protectedProcedure
    .input(z.object({ offspringId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await loadState(ctx.user.id);
      const next: CrewState = {
        ...state,
        pendingOffspring: state.pendingOffspring.filter(p => p.id !== input.offspringId),
      };
      await saveState(ctx.user.id, next);
      return { success: true };
    }),

  /* ─── Missions ─── */
  getMissionTemplates: protectedProcedure.query(async () => {
    return CREW_MISSION_TEMPLATES;
  }),

  dispatchMission: protectedProcedure
    .input(
      z.object({
        templateId: z.string(),
        crewIds: z.array(z.string()).min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const template = getMissionTemplate(input.templateId);
      if (!template) return { success: false, error: "Unknown mission template" };
      const state = applyTick(await loadState(ctx.user.id));
      const active = state.missions.filter(m => m.status === "dispatched");
      if (active.length >= CREW_BALANCE.maxConcurrentMissions) {
        return {
          success: false,
          error: `Maximum ${CREW_BALANCE.maxConcurrentMissions} active crew missions`,
        };
      }
      const assigned = state.roster.members.filter(m => input.crewIds.includes(m.id));
      if (assigned.length < template.minCrew) {
        return { success: false, error: `Mission needs at least ${template.minCrew} crew` };
      }
      if (assigned.length > template.maxCrew) {
        return { success: false, error: `Mission allows at most ${template.maxCrew} crew` };
      }
      if (assigned.some(m => m.status !== "active")) {
        return { success: false, error: "All selected crew must be active" };
      }
      const successChance = calculateMissionSuccess(template, assigned);
      const now = Date.now();
      const mission: CrewMissionState = {
        id: `crewmission-${now}-${Math.floor(Math.random() * 100000)}`,
        templateId: template.id,
        name: template.name,
        sectorId: template.sectorId,
        description: template.description,
        difficulty: template.difficulty,
        assignedCrewIds: input.crewIds,
        dispatchedAt: now,
        completesAt: now + template.durationHours * 60 * 60 * 1000,
        successChance,
        preferredRole: template.preferredRole,
        reward: template.reward,
        failureReward: template.failureReward,
        status: "dispatched",
      };

      // Mark crew as on_mission
      const members = state.roster.members.map(m =>
        input.crewIds.includes(m.id) ? { ...m, status: "on_mission" as const } : m,
      );

      const next: CrewState = {
        ...state,
        missions: [...state.missions, mission],
        missionStats: {
          ...state.missionStats,
          totalDispatched: state.missionStats.totalDispatched + 1,
        },
        roster: { ...state.roster, members },
      };
      await saveState(ctx.user.id, next);
      return { success: true, mission };
    }),

  acknowledgeMission: protectedProcedure
    .input(z.object({ missionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = await loadState(ctx.user.id);
      const next: CrewState = {
        ...state,
        missions: state.missions.filter(m => m.id !== input.missionId),
      };
      await saveState(ctx.user.id, next);
      return { success: true };
    }),

  /* ─── DMC bridge: mark a crew member as sent to Dead Man's Circuit ─── */
  sendToDeadMansCircuit: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const member = state.roster.members.find(m => m.id === input.memberId);
      if (!member) return { success: false, error: "Member not found" };
      if (member.status !== "active") return { success: false, error: "Member not active" };
      const next: CrewState = {
        ...state,
        dmcClonesSent: state.dmcClonesSent + 1,
        roster: {
          ...state.roster,
          members: state.roster.members.map(m =>
            m.id === input.memberId ? { ...m, status: "on_mission" } : m,
          ),
        },
        feed: trimFeed([
          ...state.feed,
          {
            id: `dmc-dispatch-${member.id}-${Date.now()}`,
            timestamp: Date.now(),
            roomId: "trade_hub",
            category: "security",
            text: `${member.name} has accepted a clone seat at the Dead Man's Circuit. The crew assembled at the airlock. No one spoke.`,
            severity: "alert",
            actionable: false,
          },
        ]),
        feedUnreadCount: state.feedUnreadCount + 1,
      };
      await saveState(ctx.user.id, next);
      return { success: true, designation: `DMC-${member.name.toUpperCase()}-${state.dmcClonesSent + 1}` };
    }),

  resolveDeadMansCircuit: protectedProcedure
    .input(z.object({ memberId: z.string(), survived: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const member = state.roster.members.find(m => m.id === input.memberId);
      if (!member) return { success: false, error: "Member not found" };
      if (input.survived) {
        const next: CrewState = {
          ...state,
          roster: {
            ...state.roster,
            members: state.roster.members.map(m =>
              m.id === input.memberId
                ? { ...m, status: "active" as const, morale: Math.min(100, m.morale + 20) }
                : m,
            ),
          },
          feed: trimFeed([
            ...state.feed,
            {
              id: `dmc-return-${member.id}-${Date.now()}`,
              timestamp: Date.now(),
              roomId: "trade_hub",
              category: "security",
              text: `${member.name} returned from the Dead Man's Circuit. Still breathing. Still wanted.`,
              severity: "info",
              actionable: false,
            },
          ]),
          feedUnreadCount: state.feedUnreadCount + 1,
        };
        await saveState(ctx.user.id, next);
        return { success: true, survived: true };
      }
      // Did not survive
      const deceased = {
        ...member,
        status: "dead" as const,
        health: 0,
        deathRecord: {
          cycle: member.age,
          cause: "Lost on the Dead Man's Circuit",
          lastWords: pickLastWords(Date.now()),
        },
      };
      const next: CrewState = {
        ...state,
        dmcClonesLost: state.dmcClonesLost + 1,
        roster: {
          ...state.roster,
          members: state.roster.members.filter(m => m.id !== input.memberId),
          deceased: [...state.roster.deceased, deceased],
          totalLost: state.roster.totalLost + 1,
        },
        feed: trimFeed([
          ...state.feed,
          {
            id: `dmc-loss-${member.id}-${Date.now()}`,
            timestamp: Date.now(),
            roomId: "trophy_room",
            category: "ominous",
            text: `${member.name} did not return from the Dead Man's Circuit. Their name has been added to the memorial wall.`,
            severity: "alert",
            actionable: false,
          },
        ]),
        feedUnreadCount: state.feedUnreadCount + 1,
      };
      await saveState(ctx.user.id, next);
      return { success: true, survived: false };
    }),

  /* ─── Feed management ─── */
  pushFeedEntry: protectedProcedure
    .input(
      z.object({
        entry: z.record(z.string(), z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = await loadState(ctx.user.id);
      const entry = input.entry as unknown as SerializedFeedEntry;
      const next: CrewState = {
        ...state,
        feed: trimFeed([...state.feed, entry]),
        feedUnreadCount: state.feedUnreadCount + 1,
      };
      await saveState(ctx.user.id, next);
      return { success: true };
    }),

  markFeedRead: protectedProcedure.mutation(async ({ ctx }) => {
    const state = await loadState(ctx.user.id);
    const next: CrewState = { ...state, feedUnreadCount: 0 };
    await saveState(ctx.user.id, next);
    return { success: true };
  }),

  /* ─── Dev/testing: reset crew state ─── */
  resetCrew: protectedProcedure.mutation(async ({ ctx }) => {
    await saveState(ctx.user.id, createDefaultCrewState());
    return { success: true };
  }),
});

export { MAX_CREW_CAPACITY, MAX_INCUBATOR_PODS };
