/* ═══════════════════════════════════════════════════════
   WOLF-HUNT ROUTER — Antiquarian contracts the Wolf

   Endpoints:
     - getHuntProgress: aggregate dossier-resolution stats +
       crucible meters + active mission ref.
     - getAvailableTargets: dossiers the Antiquarian has
       cleared for hunting (every non-resolved target).
     - startMission(targetId): open a new mission instance;
       fails if one is already active.
     - getMissionState: the active mission state + briefing.
     - submitChoice(action): drive the mission reducer.
     - concedeMission: abandon the active mission (escaped
       outcome).
     - playBossCard / takeLieutenantTurn: drive the boss
       reducer during a boss-fight engagement.

   Persistence: JSON-blob in userProgress.gameData.wolfHunt
   (apps/server/services/wolfHuntStore.ts). Narrative flags
   the reducer requests are written to
   userProgress.gameData.narrativeFlags.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  loadWolfHuntStore,
  saveWolfHuntStore,
  writeWolfHuntFlags,
} from "../services/wolfHuntStore";
import {
  loadCrewState,
  saveCrewState,
  addCrewMemberToState,
} from "../services/crewState";
import {
  ALL_HERO_TARGETS,
  getHeroTarget,
  emptyMissionState,
  reduceMission,
  emptyBossState,
  reduceBossFight,
  briefMission,
  eventsFromMission,
  applyEventsToMeters,
  isGoodEndingReached,
  isBadEndingReached,
  WOLF_HUNT_ARC_AVAILABLE_FLAG,
  WOLF_HUNT_ARC_COMPLETE_TRIGGER_FLAG,
  WOLF_HUNT_ARC_FAILURE_TRIGGER_FLAG,
  WOLF_HUNT_LYCOS_FIRST_DEATH_FLAG,
  WOLF_HUNT_PAUSED_AT_TARGET_FLAG_PREFIX,
  lieutenantDefeatedFlag,
  lordFullyHarvestedFlag,
  killsCountFlag,
  type WolfHuntAction,
  type ReducerEffect,
  type WolfHuntMissionState,
  type WolfCardId,
  CORE_HIERARCHY_LORD_IDS,
} from "../../shared/wolfHunt";

const wolfActionSchema = z.union([
  z.object({ kind: z.literal("advance_from_briefing") }),
  z.object({
    kind: z.literal("approach_choice"),
    choiceKey: z.enum(["stealth", "social", "tactical", "abort"]),
    riskGradeOverride: z.number().min(0).max(1).optional(),
  }),
  z.object({
    kind: z.literal("engagement_choice"),
    choiceKey: z.enum(["hunt", "restraint", "mercy", "withdraw"]),
    riskGradeOverride: z.number().min(0).max(1).optional(),
  }),
  z.object({ kind: z.literal("aftermath_close") }),
]);

const KILL_MILESTONES = [10, 25, 50, 100, 200, 250] as const;

function killCount(mission: WolfHuntMissionState[]): number {
  return mission.filter((m) => m.outcome === "killed").length;
}

function buildFlagMutations(
  effects: ReadonlyArray<ReducerEffect>,
): Record<string, boolean | string> {
  const mutations: Record<string, boolean | string> = {};
  for (const e of effects) {
    if (e.kind === "write_flag") {
      mutations[e.flag] = e.value;
    }
  }
  return mutations;
}

async function applyMissionEffects(
  userId: number,
  state: WolfHuntMissionState,
  effects: ReadonlyArray<ReducerEffect>,
): Promise<void> {
  const flagMutations = buildFlagMutations(effects);

  // Terminal mission: emit Living Universe events, mutate meters,
  // archive to pastMissions, evaluate milestone flags.
  if (state.outcome) {
    const store = await loadWolfHuntStore(userId);
    const livingEvents = eventsFromMission(state);
    const nextMeters = applyEventsToMeters(store.meters, livingEvents);
    const past = [...store.pastMissions, state];
    const resolvedIds = [...store.resolvedTargetIds, state.targetId];

    // Per-event flag writes (lord lieutenant + lord fully harvested).
    for (const ev of livingEvents) {
      if (ev.kind === "lord_lieutenant_defeated") {
        flagMutations[lieutenantDefeatedFlag(ev.corruptorLord)] = true;
      }
    }
    // Lord fully-harvested check: 25 heroes in that lord's cohort all resolved.
    for (const lordId of CORE_HIERARCHY_LORD_IDS) {
      const cohort = ALL_HERO_TARGETS.filter((h) => h.corruptorLord === lordId);
      const resolvedInLord = cohort.filter((h) =>
        resolvedIds.includes(h.id),
      ).length;
      if (resolvedInLord >= cohort.length) {
        flagMutations[lordFullyHarvestedFlag(lordId)] = true;
      }
    }
    // Kill-count milestones.
    const kc = killCount(past);
    for (const m of KILL_MILESTONES) {
      if (kc >= m) flagMutations[killsCountFlag(m)] = true;
    }
    // Lycos death tracking.
    if (state.outcome === "lycos_died") {
      flagMutations[WOLF_HUNT_LYCOS_FIRST_DEATH_FLAG] = true;
      flagMutations[`${WOLF_HUNT_PAUSED_AT_TARGET_FLAG_PREFIX}${state.targetId}`] = true;
      // Open a resurrection quest by writing the canonical npc_death flag.
      flagMutations["npc_death:lycos"] = true;
    }
    // Arc-end triggers + Lycos recruitment (C-pivot.C.3 / D3).
    // Lycos joins the crew on EITHER good or bad ending — the dark
    // path bonds him through the failure rather than locking him out.
    const goodEnd = isGoodEndingReached(nextMeters);
    const badEnd = isBadEndingReached(nextMeters);
    if (goodEnd) {
      flagMutations[WOLF_HUNT_ARC_COMPLETE_TRIGGER_FLAG] = true;
    }
    if (badEnd) {
      flagMutations[WOLF_HUNT_ARC_FAILURE_TRIGGER_FLAG] = true;
    }
    if (goodEnd || badEnd) {
      flagMutations["lycos_recruited"] = true;
      const crew = await loadCrewState(userId);
      if (crew && !crew.roster.members.some((m) => m.id === "lycos")) {
        const lycosMember = {
          id: "lycos",
          name: "Lycos",
          nickname: "The Wolf",
          species: "human" as const,
          gender: "male" as const,
          bloodlineId: "lycos" as never,
          generation: 1,
          parentIds: null,
          children: [],
          geneticTraits: [],
          role: "security" as const,
          stats: {
            resilience: 85,
            intellect: 70,
            reflexes: 90,
            empathy: 55,
            immunity: 75,
            adaptability: 80,
          } as never,
          morale: badEnd ? 35 : 60,
          health: 90,
          loyalty: goodEnd ? 75 : 55,
          status: "active" as const,
          age: 0,
          maxAge: 999,
          missionHistory: [],
          relationships: {},
          birthCycle: 0,
          productionPath: "recruited" as const,
        };
        const nextCrew = addCrewMemberToState(crew, lycosMember as never);
        await saveCrewState(userId, nextCrew);
      }
    }

    await saveWolfHuntStore(userId, {
      activeMission: null,
      activeBossFight: null,
      pastMissions: past,
      meters: nextMeters,
      resolvedTargetIds: resolvedIds,
    });
  } else {
    // In-progress — just persist the mission state, possibly opening a boss fight.
    const store = await loadWolfHuntStore(userId);
    let bossState = store.activeBossFight;
    const startBoss = effects.find((e) => e.kind === "start_boss_fight");
    if (startBoss && startBoss.kind === "start_boss_fight") {
      bossState = emptyBossState(state.id, startBoss.targetId, state.lycosHealth);
    }
    await saveWolfHuntStore(userId, {
      ...store,
      activeMission: state,
      activeBossFight: bossState,
    });
  }

  if (Object.keys(flagMutations).length > 0) {
    await writeWolfHuntFlags(userId, flagMutations);
  }
}

export const wolfHuntRouter = router({
  getHuntProgress: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const store = await loadWolfHuntStore(ctx.user.id);
    return {
      meters: store.meters,
      activeMissionId: store.activeMission?.id ?? null,
      activeTargetId: store.activeMission?.targetId ?? null,
      resolvedCount: store.resolvedTargetIds.length,
      totalTargets: ALL_HERO_TARGETS.length,
      lieutenantsDefeated: store.pastMissions.filter((m) => {
        const t = ALL_HERO_TARGETS.find((h) => h.id === m.targetId);
        return t?.isBossLieutenant && m.outcome === "killed";
      }).length,
    };
  }),

  getAvailableTargets: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const store = await loadWolfHuntStore(ctx.user.id);
    const resolved = new Set(store.resolvedTargetIds);
    return ALL_HERO_TARGETS.filter((t) => !resolved.has(t.id)).map((t) => ({
      id: t.id,
      name: t.name,
      classKey: t.classKey,
      corruptorLord: t.corruptorLord,
      threatTier: t.threatTier,
      isBossLieutenant: t.isBossLieutenant,
      lairLocation: t.lairLocation,
    }));
  }),

  startMission: protectedProcedure
    .input(z.object({ targetId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const store = await loadWolfHuntStore(ctx.user.id);
      if (store.activeMission) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "a mission is already active; conclude it before starting another",
        });
      }
      // Validate target exists + is not already resolved.
      let target;
      try {
        target = getHeroTarget(input.targetId);
      } catch {
        throw new TRPCError({ code: "NOT_FOUND", message: "unknown target" });
      }
      if (store.resolvedTargetIds.includes(input.targetId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "this dossier is already closed",
        });
      }
      const missionId = `wh_${ctx.user.id}_${Date.now()}`;
      const state = emptyMissionState(
        missionId,
        ctx.user.id,
        target.id,
        Date.now(),
      );
      await saveWolfHuntStore(ctx.user.id, {
        ...store,
        activeMission: state,
        activeBossFight: null,
      });
      return { missionId, target };
    }),

  getMissionState: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const store = await loadWolfHuntStore(ctx.user.id);
    if (!store.activeMission) {
      return { mission: null, briefing: null, target: null, bossFight: null };
    }
    const target = getHeroTarget(store.activeMission.targetId);
    const briefing = briefMission(target, {
      leagueStrength: store.meters.league_strength,
      releasePressure: store.meters.release_pressure,
      hierarchyInfluence: store.meters.hierarchy_influence,
    });
    return {
      mission: store.activeMission,
      briefing,
      target,
      bossFight: store.activeBossFight,
    };
  }),

  submitChoice: protectedProcedure
    .input(z.object({ action: wolfActionSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const store = await loadWolfHuntStore(ctx.user.id);
      if (!store.activeMission) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "no active mission",
        });
      }
      const out = reduceMission(store.activeMission, input.action as WolfHuntAction, {
        releasePressure: store.meters.release_pressure,
        now: Date.now(),
      });
      await applyMissionEffects(ctx.user.id, out.state, out.effects);
      return { ok: true, outcome: out.state.outcome ?? null };
    }),

  concedeMission: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const store = await loadWolfHuntStore(ctx.user.id);
    if (!store.activeMission) return { ok: true };
    const out = reduceMission(
      store.activeMission,
      { kind: "approach_choice", choiceKey: "abort" },
      {
        releasePressure: store.meters.release_pressure,
        now: Date.now(),
      },
    );
    await applyMissionEffects(ctx.user.id, out.state, out.effects);
    return { ok: true };
  }),

  playBossCard: protectedProcedure
    .input(
      z.object({
        card: z.enum(["hunt", "restraint", "mercy", "memory_of_the_medic"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const store = await loadWolfHuntStore(ctx.user.id);
      if (!store.activeMission || !store.activeBossFight) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "no active boss fight",
        });
      }
      let bossState = reduceBossFight(store.activeBossFight, {
        kind: "play_wolf_card",
        card: input.card as WolfCardId,
      });
      // Immediately run the lieutenant's reply unless terminal.
      if (!bossState.outcome) {
        bossState = reduceBossFight(bossState, { kind: "take_lieutenant_turn" });
      }

      if (bossState.outcome) {
        // Resolve the boss fight back to the mission reducer.
        const out = reduceMission(
          store.activeMission,
          { kind: "boss_fight_resolved", result: bossState.outcome },
          { releasePressure: store.meters.release_pressure, now: Date.now() },
        );
        await applyMissionEffects(ctx.user.id, out.state, out.effects);
        return { bossState, missionOutcome: out.state.outcome ?? null };
      } else {
        await saveWolfHuntStore(ctx.user.id, {
          ...store,
          activeBossFight: bossState,
        });
        return { bossState, missionOutcome: null };
      }
    }),
});
