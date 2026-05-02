/* ═══════════════════════════════════════════════════════
   OUTBREAK ROUTER — Awakening Protocol V2 Server Logic

   Manages the viral outbreak onboarding sequence:
   phase progression, component collection, crew cloning,
   morality choices, and room unlock gating.

   During outbreak: rooms unlock in narrative order only.
   After outbreak: all remaining rooms open for free exploration.

   Integrates with:
   - rpgSystems.applyMoralityChoice (Wave 1)
   - pressureService (Wave 1)
   - petEvolution (Wave 3) — bond actions during Observation Deck
   - battlePassXp (Wave 4) — outbreak completion = huge XP
   - ark router — room unlock logic respects outbreak phase
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { logger } from "../logger";
import { grantCardReward } from "../services/cardRewardService";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress, userArkProgress, notifications } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import {
  OUTBREAK_PHASE_ORDER, RESEARCH_COMPONENTS, OUTBREAK_MORALITY_CHOICES,
  CREW_CLONING_EVENTS, OUTBREAK_ROOM_ORDER, POST_OUTBREAK_ROOMS,
  OUTBREAK_CINEMATICS, OUTBREAK_FLAGS, DEFAULT_OUTBREAK_STATE,
  canAdvancePhase, getOutbreakMoralityTotal, getCureSpeech,
  type OutbreakPhase, type OutbreakState,
} from "@shared/awakeningProtocol";
import { pressureService } from "../services/pressureService";
import { ripple } from "../services/rippleEngine";
import { battlePassXp } from "../services/battlePassXp";

/** Get or create outbreak state from userProgress.gameData */
async function getOutbreakState(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number): Promise<{ state: OutbreakState; progressId: number | null }> {
  const [progress] = await db.select().from(userProgress)
    .where(eq(userProgress.userId, userId)).limit(1);

  if (!progress) return { state: { ...DEFAULT_OUTBREAK_STATE }, progressId: null };

  const gd = (progress.gameData as Record<string, unknown>) ?? {};
  const outbreak = gd.outbreakState as OutbreakState | undefined;
  return { state: outbreak ?? { ...DEFAULT_OUTBREAK_STATE }, progressId: progress.id };
}

async function saveOutbreakState(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, progressId: number | null, state: OutbreakState) {
  if (!progressId) {
    // Create progress record
    await db.insert(userProgress).values({
      userId,
      xp: 0, level: 1, points: 0,
      gameData: { outbreakState: state },
    });
    return;
  }

  const [progress] = await db.select().from(userProgress)
    .where(eq(userProgress.id, progressId)).limit(1);
  const gd = (progress?.gameData as Record<string, unknown>) ?? {};

  await db.update(userProgress)
    .set({ gameData: { ...gd, outbreakState: state } })
    .where(eq(userProgress.id, progressId));
}

export const outbreakRouter = router({
  /** Get current outbreak state */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return DEFAULT_OUTBREAK_STATE;
    const { state } = await getOutbreakState(db, ctx.user.id);
    return state;
  }),

  /** Advance to the next outbreak phase */
  advancePhase: protectedProcedure
    .input(z.object({
      targetPhase: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const { state, progressId } = await getOutbreakState(db, ctx.user.id);
      const target = input.targetPhase as OutbreakPhase;

      if (!canAdvancePhase(state, target)) {
        throw new Error(`Cannot advance from ${state.phase} to ${target}`);
      }

      state.phase = target;

      // Set start time on first real phase
      if (target === "COMPANION_EMERGENCE" && !state.startedAt) {
        state.startedAt = new Date().toISOString();
      }

      // Unlock corresponding room during outbreak phases
      const roomPhaseMap: Record<string, string> = {
        QUARANTINE_SEALED: "medical_bay",
        ENGINEERING: "engineering",
        BRIDGE: "bridge",
        COMMS_ARRAY: "comms_array",
        ARMORY: "armory",
        OBSERVATION_DECK: "observation_deck",
      };
      const roomToUnlock = roomPhaseMap[target];
      if (roomToUnlock) {
        await unlockRoom(db, ctx.user.id, roomToUnlock);
      }

      // Mark cinematic as played for this phase
      const cinematic = OUTBREAK_CINEMATICS.find(c => c.phase === target);
      if (cinematic && !state.cinematicsPlayed.includes(cinematic.id)) {
        state.cinematicsPlayed.push(cinematic.id);
      }

      await saveOutbreakState(db, ctx.user.id, progressId, state);

      return { success: true, phase: state.phase, cinematic: cinematic ?? null };
    }),

  /** Collect a research component (after completing a room's challenge) */
  collectComponent: protectedProcedure
    .input(z.object({ componentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const component = RESEARCH_COMPONENTS.find(c => c.id === input.componentId);
      if (!component) throw new Error("Unknown component");

      const { state, progressId } = await getOutbreakState(db, ctx.user.id);
      if (state.componentsCollected.includes(input.componentId)) {
        return { success: true, alreadyCollected: true };
      }

      state.componentsCollected.push(input.componentId);
      await saveOutbreakState(db, ctx.user.id, progressId, state);

      // Pressure: exploration/lore discovery
      await pressureService.increment(ctx.user.id, "exploration", 5, `outbreak_component_${input.componentId}`);

      await db.insert(notifications).values({
        userId: ctx.user.id,
        type: "outbreak_component",
        title: `Component Collected: ${component.name}`,
        message: `${component.description}. ${state.componentsCollected.length}/5 components on the Research Board.`,
      });

      return {
        success: true,
        componentName: component.name,
        totalCollected: state.componentsCollected.length,
        allCollected: state.componentsCollected.length >= RESEARCH_COMPONENTS.length,
      };
    }),

  /** Make a morality choice during the outbreak */
  makeChoice: protectedProcedure
    .input(z.object({
      choiceId: z.string(),
      choice: z.enum(["a", "b", "c"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const choiceDef = OUTBREAK_MORALITY_CHOICES.find(c => c.id === input.choiceId);
      if (!choiceDef) throw new Error("Unknown choice");

      if (input.choice === "c" && !choiceDef.choiceC) {
        throw new Error(`Choice "${input.choiceId}" does not offer option C`);
      }

      const { state, progressId } = await getOutbreakState(db, ctx.user.id);
      if (state.moralityChoicesMade[input.choiceId]) {
        return { success: true, alreadyChosen: true };
      }

      state.moralityChoicesMade[input.choiceId] = input.choice;

      const chosen =
        input.choice === "a"
          ? choiceDef.choiceA
          : input.choice === "b"
            ? choiceDef.choiceB
            : choiceDef.choiceC!;

      // Set narrative flag
      const gd = await getGameData(db, ctx.user.id);
      const flags = (gd.narrativeFlags as Record<string, boolean>) ?? {};
      flags[chosen.flag] = true;

      await saveOutbreakState(db, ctx.user.id, progressId, state);
      await saveNarrativeFlags(db, ctx.user.id, flags);

      // Ripple: morality choice event handles pressure + morality-specific effects
      await ripple.emit("morality_choice", { userId: ctx.user.id, delta: chosen.moralityDelta, source: `outbreak_choice_${input.choiceId}` });

      // Check for crew cloning triggered by this choice
      const crewEvents = CREW_CLONING_EVENTS.filter(e =>
        e.conditionChoiceId === input.choiceId &&
        ((input.choice === "a" && e.condition === "choice_a") ||
         (input.choice === "b" && e.condition === "choice_b"))
      );

      const clonedCrew: string[] = [];
      for (const event of crewEvents) {
        if (!state.crewCloned.includes(event.id)) {
          state.crewCloned.push(event.id);
          clonedCrew.push(event.crewType);
          await db.insert(notifications).values({
            userId: ctx.user.id,
            type: "crew_cloned",
            title: `Crew Member: ${event.crewType}`,
            message: event.trait
              ? `${event.crewType} joined your crew with trait: ${event.trait.name} — ${event.trait.description}`
              : `${event.crewType} joined your crew.`,
          });
        }
      }

      // Save updated crew list
      await saveOutbreakState(db, ctx.user.id, progressId, state);

      return {
        success: true,
        chosenLabel: chosen.label,
        moralityDelta: chosen.moralityDelta,
        flag: chosen.flag,
        crewCloned: clonedCrew,
      };
    }),

  /** Clone automatic crew (non-choice-gated crew) */
  cloneAutomaticCrew: protectedProcedure
    .input(z.object({ phase: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const { state, progressId } = await getOutbreakState(db, ctx.user.id);

      const autoEvents = CREW_CLONING_EVENTS.filter(e =>
        e.phase === input.phase && e.condition === "automatic" && !state.crewCloned.includes(e.id)
      );

      const cloned: string[] = [];
      for (const event of autoEvents) {
        state.crewCloned.push(event.id);
        cloned.push(event.crewType);
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "crew_cloned",
          title: `Crew Member: ${event.crewType}`,
          message: `${event.crewType} cloned and deployed to ${event.room}.`,
        });
      }

      await saveOutbreakState(db, ctx.user.id, progressId, state);
      return { success: true, crewCloned: cloned };
    }),

  /** Set tutorial mode preference */
  setTutorialMode: protectedProcedure
    .input(z.object({ mode: z.enum(["full", "minimal"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const { state, progressId } = await getOutbreakState(db, ctx.user.id);
      state.tutorialMode = input.mode;

      const gd = await getGameData(db, ctx.user.id);
      const flags = (gd.narrativeFlags as Record<string, boolean>) ?? {};
      flags[input.mode === "full" ? OUTBREAK_FLAGS.tutorial_mode_full : OUTBREAK_FLAGS.tutorial_mode_minimal] = true;

      await saveOutbreakState(db, ctx.user.id, progressId, state);
      await saveNarrativeFlags(db, ctx.user.id, flags);

      return { success: true, mode: input.mode };
    }),

  /** Complete the outbreak — deploy vaccine, open the Ark */
  complete: protectedProcedure
    .input(z.object({
      companionSpecies: z.string().optional(),
      playerName: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const { state, progressId } = await getOutbreakState(db, ctx.user.id);

      if (state.componentsCollected.length < RESEARCH_COMPONENTS.length) {
        throw new Error("Not all components collected");
      }

      // Calculate duration
      const startTime = state.startedAt ? new Date(state.startedAt).getTime() : Date.now();
      const durationMinutes = Math.round((Date.now() - startTime) / 60000);

      state.phase = "COMPLETED";
      state.completedAt = new Date().toISOString();
      state.durationMinutes = durationMinutes;

      // Set master flag
      const gd = await getGameData(db, ctx.user.id);
      const flags = (gd.narrativeFlags as Record<string, boolean>) ?? {};
      flags[OUTBREAK_FLAGS.outbreak_completed] = true;
      flags[`outbreak_morality_total_${getOutbreakMoralityTotal(state)}`] = true;
      flags[`outbreak_duration_minutes_${durationMinutes}`] = true;
      flags[`crew_count_${state.crewCloned.length}`] = true;

      await saveOutbreakState(db, ctx.user.id, progressId, state);
      await saveNarrativeFlags(db, ctx.user.id, flags);

      // Unlock all post-outbreak rooms
      for (const roomId of POST_OUTBREAK_ROOMS) {
        await unlockRoom(db, ctx.user.id, roomId);
      }

      // Pressure: outbreak completion = major exploration + healing
      await pressureService.increment(ctx.user.id, "exploration", 50, "outbreak_completed");
      await pressureService.increment(ctx.user.id, "healingDone", 25, "outbreak_vaccine_deployed");

      // Battle pass XP: outbreak completion is a big milestone
      await battlePassXp.awardRaw(ctx.user.id, 200).catch(() => {});

      // Generate Elara's cure speech
      const speech = getCureSpeech(
        state,
        input.companionSpecies ?? "companion",
        input.playerName ?? "Operative",
        durationMinutes,
      );

      await db.insert(notifications).values({
        userId: ctx.user.id,
        type: "outbreak_completed",
        title: "The Ark Is Saved",
        message: speech,
      });

      // Grant card reward for outbreak protocol completion
      try {
        await grantCardReward(ctx.user.id, "outbreak_protocol");
      } catch (e) {
        logger.warn("Failed to grant outbreak protocol card reward", e);
      }

      logger.info(`[Outbreak] User ${ctx.user.id} completed outbreak in ${durationMinutes} minutes, crew: ${state.crewCloned.length}`);

      return {
        success: true,
        durationMinutes,
        crewCount: state.crewCloned.length,
        moralityTotal: getOutbreakMoralityTotal(state),
        speech,
        roomsUnlocked: POST_OUTBREAK_ROOMS,
      };
    }),

  /** Check if a room can be entered during outbreak (respects phase order) */
  canEnterRoom: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { allowed: true, reason: null };

      const { state } = await getOutbreakState(db, ctx.user.id);

      // If outbreak completed, all rooms are accessible
      if (state.phase === "COMPLETED" || state.phase === "ARK_OPEN") {
        return { allowed: true, reason: null };
      }

      // During outbreak, only unlocked rooms are accessible
      const phaseIdx = OUTBREAK_PHASE_ORDER.indexOf(state.phase);
      const roomIdx = OUTBREAK_ROOM_ORDER.indexOf(input.roomId);

      // Cryo Bay always accessible
      if (input.roomId === "cryo_bay") return { allowed: true, reason: null };

      // Post-outbreak rooms blocked during outbreak
      if (POST_OUTBREAK_ROOMS.includes(input.roomId)) {
        return { allowed: false, reason: "This area is under viral quarantine. Complete the outbreak containment first." };
      }

      // Check if this room's phase has been reached
      if (roomIdx === -1) return { allowed: true, reason: null }; // Unknown room, allow

      // Medical bay accessible from QUARANTINE_SEALED onwards
      if (input.roomId === "medical_bay" && phaseIdx >= OUTBREAK_PHASE_ORDER.indexOf("QUARANTINE_SEALED")) {
        return { allowed: true, reason: null };
      }

      // Other outbreak rooms accessible when their phase is reached
      const roomPhaseMap: Record<string, string> = {
        engineering: "ENGINEERING",
        bridge: "BRIDGE",
        comms_array: "COMMS_ARRAY",
        armory: "ARMORY",
        observation_deck: "OBSERVATION_DECK",
      };
      const requiredPhase = roomPhaseMap[input.roomId];
      if (requiredPhase) {
        const requiredIdx = OUTBREAK_PHASE_ORDER.indexOf(requiredPhase as OutbreakPhase);
        if (phaseIdx >= requiredIdx) return { allowed: true, reason: null };
        return { allowed: false, reason: "The corridor to this area is still contaminated. Collect the previous component first." };
      }

      return { allowed: true, reason: null };
    }),
});

/* ─── HELPER FUNCTIONS ─── */

async function unlockRoom(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, roomId: string) {
  const existing = await db.select().from(userArkProgress)
    .where(and(eq(userArkProgress.userId, userId), eq(userArkProgress.roomId, roomId)))
    .limit(1);

  if (existing[0]) {
    if (!existing[0].isUnlocked) {
      await db.update(userArkProgress)
        .set({ isUnlocked: 1 })
        .where(eq(userArkProgress.id, existing[0].id));
    }
  } else {
    await db.insert(userArkProgress).values({
      userId, roomId, isUnlocked: 1, visitCount: 0,
    });
  }
}

async function getGameData(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number): Promise<Record<string, unknown>> {
  const [progress] = await db.select().from(userProgress)
    .where(eq(userProgress.userId, userId)).limit(1);
  return (progress?.gameData as Record<string, unknown>) ?? {};
}

async function saveNarrativeFlags(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, flags: Record<string, boolean>) {
  const [progress] = await db.select().from(userProgress)
    .where(eq(userProgress.userId, userId)).limit(1);
  if (!progress) return;
  const gd = (progress.gameData as Record<string, unknown>) ?? {};
  await db.update(userProgress)
    .set({ gameData: { ...gd, narrativeFlags: flags } })
    .where(eq(userProgress.id, progress.id));
}
