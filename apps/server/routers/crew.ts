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
  canBootstrapCrew,
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
  pickLastWords,
} from "../../shared/crewMissions";
import { CREW_BALANCE } from "../../shared/crewBalance";
import { applyTick as sharedApplyTick } from "../../shared/crewTick";
import { syncCrewStateToTables } from "./crewTableSync";

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
  // Best-effort projection into native tables for cross-user queries.
  // Fire-and-forget — the JSON blob is authoritative.
  void syncCrewStateToTables(userId, state);
}

/* ─── FULL TICK (applied on every major query/mutation)
       Delegates to the shared pure pipeline (apps/shared/crewTick.ts)
       so the same logic is used in tests and in the request handlers. ─── */

function applyTick(state: CrewState): CrewState {
  return sharedApplyTick(state);
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
      const incoming = input.member as unknown as SerializedCrewMember;
      if (state.roster.members.length >= MAX_CREW_CAPACITY) {
        return { success: false, error: "Crew roster at max capacity" };
      }
      // First living member of a bloodline is flagged as the founder.
      const blHasMembers = state.roster.members.some(
        m => m.bloodlineId === incoming.bloodlineId,
      );
      const member: SerializedCrewMember = {
        ...incoming,
        isFounder: !blHasMembers,
      };

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
    .input(
      z.object({
        memberId: z.string(),
        survived: z.boolean(),
        finishPosition: z.number().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const state = applyTick(await loadState(ctx.user.id));
      const member = state.roster.members.find(m => m.id === input.memberId);
      if (!member) return { success: false, error: "Member not found" };
      if (input.survived) {
        const isPodium = (input.finishPosition ?? 99) <= 3;
        const isWin = input.finishPosition === 1;
        const moraleBoost = isWin ? 35 : isPodium ? 25 : 20;
        const narrative = isWin
          ? `${member.name} WON the Dead Man's Circuit. Nilmorg paid out in full. The mess hall will not be quiet tonight.`
          : isPodium
            ? `${member.name} finished on the podium (P${input.finishPosition}). Locke filed a trade report. The crew noticed.`
            : `${member.name} returned from the Dead Man's Circuit. Still breathing. Still wanted.`;
        const next: CrewState = {
          ...state,
          roster: {
            ...state.roster,
            members: state.roster.members.map(m =>
              m.id === input.memberId
                ? { ...m, status: "active" as const, morale: Math.min(100, m.morale + moraleBoost) }
                : m,
            ),
          },
          feed: trimFeed([
            ...state.feed,
            {
              id: `dmc-return-${member.id}-${Date.now()}`,
              timestamp: Date.now(),
              roomId: "trophy_room",
              category: isWin ? "player_echo" : "security",
              text: narrative,
              severity: isWin ? "info" : "info",
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

  /* ─── Bootstrap: seed one starter crew member when the Ark first wakes ───
     Called by the CrewRosterPage when the roster is empty and the system
     is unlocked. Rotates between three "first-breath" variants the
     Collector's archive preserved for exactly this moment. */
  bootstrap: protectedProcedure.mutation(async ({ ctx }) => {
    const state = await loadState(ctx.user.id);
    const guard = canBootstrapCrew(state);
    if (!guard.ok) {
      return { success: false, error: guard.error };
    }

    // Three variants, rolled deterministically from the user id so the same
    // player always gets the same first-breath companion.
    const variants: Array<{
      member: Omit<SerializedCrewMember, "id" | "isFounder" | "birthCycle">;
      bloodline: SerializedBloodline;
      introLine: string;
    }> = [
      {
        member: {
          name: "Vale Resonance",
          nickname: "the First",
          species: "human",
          gender: "non-binary",
          bloodlineId: "void_resonance",
          generation: 1,
          parentIds: null,
          children: [],
          geneticTraits: ["hardy", "calm_under_fire"],
          role: null,
          stats: {
            resilience: 62,
            intellect: 68,
            reflexes: 55,
            empathy: 70,
            immunity: 52,
            adaptability: 78,
          },
          morale: 80,
          health: 100,
          loyalty: 60,
          status: "active",
          age: 24,
          maxAge: 82,
          missionHistory: [],
          relationships: {},
        },
        bloodline: {
          id: "void_resonance",
          founderTemplateId: "tpl_terran_prime",
          name: "House Resonance",
          motto: "We echo forward.",
          color: "#22d3ee",
          generationCount: 1,
          geneticDrift: 0,
          diversityIndex: 0,
          activeTraits: ["hardy", "calm_under_fire"],
          recessiveTraits: [],
          power: {
            name: "Void Resonance",
            description: "Trade routes hum with an efficiency others can't explain.",
            stat: "trade_income",
            baseValue: 5,
            perGeneration: 2,
          },
        },
        introLine:
          `Cryo Bay: Vale Resonance stirred in Pod 01. They were listed in the archive as "the first willing volunteer." Elara knew their name before they opened their eyes.`,
      },
      {
        member: {
          name: "Kesh Vigil",
          nickname: "the Watcher",
          species: "demagi",
          gender: "female",
          bloodlineId: "crimson_vigil",
          generation: 1,
          parentIds: null,
          children: [],
          geneticTraits: ["iron_constitution", "focused"],
          role: null,
          stats: {
            resilience: 75,
            intellect: 55,
            reflexes: 62,
            empathy: 45,
            immunity: 70,
            adaptability: 48,
          },
          morale: 72,
          health: 100,
          loyalty: 55,
          status: "active",
          age: 31,
          maxAge: 105,
          missionHistory: [],
          relationships: {},
        },
        bloodline: {
          id: "crimson_vigil",
          founderTemplateId: "tpl_demagi_ashborn",
          name: "House Vigil",
          motto: "The watch does not end.",
          color: "#dc2626",
          generationCount: 1,
          geneticDrift: 0,
          diversityIndex: 0,
          activeTraits: ["iron_constitution", "focused"],
          recessiveTraits: [],
          power: {
            name: "Crimson Vigil",
            description:
              "Security systems respond faster. Threats are detected before they materialize.",
            stat: "security_rating",
            baseValue: 10,
            perGeneration: 2,
          },
        },
        introLine:
          `Cryo Bay: Kesh Vigil opened her eyes in Pod 01 and immediately asked where the weapons were. Elara told her. Kesh approved.`,
      },
      {
        member: {
          name: "Cipher Parallax",
          nickname: "the Observer",
          species: "quarchon",
          gender: "non-binary",
          bloodlineId: "temporal_echo",
          generation: 1,
          parentIds: null,
          children: [],
          geneticTraits: ["eidetic", "brilliant"],
          role: null,
          stats: {
            resilience: 40,
            intellect: 82,
            reflexes: 50,
            empathy: 58,
            immunity: 45,
            adaptability: 72,
          },
          morale: 68,
          health: 100,
          loyalty: 50,
          status: "active",
          age: 42,
          maxAge: 160,
          missionHistory: [],
          relationships: {},
        },
        bloodline: {
          id: "temporal_echo",
          founderTemplateId: "tpl_quarchon_observer",
          name: "House Parallax",
          motto: "We have already seen tomorrow.",
          color: "#a855f7",
          generationCount: 1,
          geneticDrift: 0,
          diversityIndex: 0,
          activeTraits: ["eidetic", "brilliant"],
          recessiveTraits: [],
          power: {
            name: "Temporal Echo",
            description:
              "Research completes faster, as if the answers were already known.",
            stat: "research_speed",
            baseValue: 6,
            perGeneration: 3,
          },
        },
        introLine:
          `Cryo Bay: Cipher Parallax rose from Pod 01 mid-sentence, as if they'd been talking the whole time. Elara caught the second half: "...so the course is already plotted."`,
      },
    ];

    const variant = variants[ctx.user.id % variants.length];
    const founderId = `crew-bootstrap-${Date.now()}`;
    const founder: SerializedCrewMember = {
      ...variant.member,
      id: founderId,
      birthCycle: 0,
      isFounder: true,
    };

    const next: CrewState = {
      ...state,
      roster: {
        ...state.roster,
        members: [founder],
        totalCloned: state.roster.totalCloned + 1,
        generationRecord: 1,
      },
      bloodlines: {
        ...state.bloodlines,
        [variant.bloodline.id]: variant.bloodline,
      },
      firstCrewMemberBorn: true,
      feed: trimFeed([
        ...state.feed,
        {
          id: `bootstrap-${founderId}`,
          timestamp: Date.now(),
          roomId: "cryo_bay",
          category: "crew_life",
          text: variant.introLine,
          severity: "info",
          actionable: false,
        },
      ]),
      feedUnreadCount: state.feedUnreadCount + 1,
    };
    await saveState(ctx.user.id, next);
    return { success: true, founder };
  }),

  /* ─── Dev/testing: reset crew state ─── */
  resetCrew: protectedProcedure.mutation(async ({ ctx }) => {
    await saveState(ctx.user.id, createDefaultCrewState());
    return { success: true };
  }),
});

export { MAX_CREW_CAPACITY, MAX_INCUBATOR_PODS };
