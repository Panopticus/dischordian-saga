/**
 * PRESTIGE QUEST ROUTER — Quest chains that unlock prestige classes
 * ─────────────────────────────────────────────────────────────────
 * Track progress through multi-step quest chains.
 * Civil skills, talents, and achievement traits all affect quest progression.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  prestigeQuestProgress, citizenCharacters, classMastery,
  civilSkillProgress, citizenTalentSelections, achievementTraitProgress,
  prestigeProgress,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import {
  PRESTIGE_QUEST_CHAINS, canStartPrestigeQuest, canSkipStep, getQuestXpMultiplier,
} from "../../shared/prestigeQuests";

/* ═══ RPG STATS LOADER ═══ */
async function getUserRpgStats(userId: number) {
  const db = await getDb();
  if (!db) return { characterClass: "", classRank: 0, citizenLevel: 1, talents: [] as string[], achievementTraits: [] as string[], civilSkills: {} as Record<string, number> };
  const [citizen] = await db.select().from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1))).limit(1);
  const [mastery] = await db.select().from(classMastery).where(eq(classMastery.userId, userId)).limit(1);
  const skillRows = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, userId));
  const civilSkillMap: Record<string, number> = {};
  for (const row of skillRows) civilSkillMap[row.skillKey] = row.level;
  const talentRows = await db.select().from(citizenTalentSelections).where(eq(citizenTalentSelections.userId, userId));
  const talentKeys = talentRows.map(t => t.talentKey);
  const [traits] = await db.select().from(achievementTraitProgress).where(eq(achievementTraitProgress.userId, userId)).limit(1);

  return {
    characterClass: citizen?.characterClass || "",
    classRank: mastery?.masteryRank || 0,
    citizenLevel: citizen?.level || 1,
    talents: talentKeys,
    achievementTraits: (traits?.equippedTraits as string[]) || [],
    civilSkills: civilSkillMap,
  };
}

export const prestigeQuestRouter = router({
  /* ─── GET ALL QUEST CHAINS ─── */
  getQuestChains: protectedProcedure.query(async ({ ctx }) => {
    const rpgStats = await getUserRpgStats(ctx.user.id);
    return PRESTIGE_QUEST_CHAINS.map(chain => {
      const eligibility = canStartPrestigeQuest(chain, {
        characterClass: rpgStats.characterClass,
        classRank: rpgStats.classRank,
        citizenLevel: rpgStats.citizenLevel,
      });
      return {
        ...chain,
        canStart: eligibility.canStart,
        lockReason: eligibility.reason,
      };
    });
  }),

  /* ─── GET MY QUEST PROGRESS ─── */
  getMyProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(prestigeQuestProgress)
      .where(eq(prestigeQuestProgress.userId, ctx.user.id));
  }),

  /* ─── START QUEST CHAIN ─── */
  startQuest: protectedProcedure
    .input(z.object({ questChainKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const chain = PRESTIGE_QUEST_CHAINS.find(q => q.key === input.questChainKey);
      if (!chain) return { success: false, error: "Invalid quest chain" };

      const rpgStats = await getUserRpgStats(ctx.user.id);
      const eligibility = canStartPrestigeQuest(chain, {
        characterClass: rpgStats.characterClass,
        classRank: rpgStats.classRank,
        citizenLevel: rpgStats.citizenLevel,
      });
      if (!eligibility.canStart) return { success: false, error: eligibility.reason };

      // Check not already started
      const existing = await db.select().from(prestigeQuestProgress)
        .where(and(
          eq(prestigeQuestProgress.userId, ctx.user.id),
          eq(prestigeQuestProgress.questChainKey, input.questChainKey),
        )).limit(1);
      if (existing.length > 0) return { success: false, error: "Quest already started" };

      // Check if first step can be skipped by talent
      const firstStep = chain.steps[0];
      const skipped: string[] = [];
      if (firstStep && canSkipStep(firstStep, rpgStats.talents)) {
        skipped.push(firstStep.stepId);
      }

      await db.insert(prestigeQuestProgress).values({
        userId: ctx.user.id,
        questChainKey: input.questChainKey,
        currentStep: skipped.length > 0 ? 1 : 0,
        completedSteps: skipped.length > 0 ? skipped : [],
        skippedSteps: skipped,
        stepProgress: {},
      });

      return { success: true, skippedSteps: skipped };
    }),

  /* ─── ADVANCE QUEST STEP ─── */
  advanceStep: protectedProcedure
    .input(z.object({
      questChainKey: z.string(),
      stepId: z.string(),
      progressValue: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [progress] = await db.select().from(prestigeQuestProgress)
        .where(and(
          eq(prestigeQuestProgress.userId, ctx.user.id),
          eq(prestigeQuestProgress.questChainKey, input.questChainKey),
        )).limit(1);
      if (!progress) return { success: false, error: "Quest not started" };
      if (progress.status !== "in_progress") return { success: false, error: "Quest not in progress" };

      const chain = PRESTIGE_QUEST_CHAINS.find(q => q.key === input.questChainKey);
      if (!chain) return { success: false, error: "Invalid quest chain" };

      const completedSteps = (progress.completedSteps || []) as string[];
      if (completedSteps.includes(input.stepId)) return { success: false, error: "Step already completed" };

      const step = chain.steps.find(s => s.stepId === input.stepId);
      if (!step) return { success: false, error: "Invalid step" };

      const rpgStats = await getUserRpgStats(ctx.user.id);

      // Check civil skill requirements
      if (step.requirement.civilSkill) {
        const skillLevel = rpgStats.civilSkills[step.requirement.civilSkill.skill] || 0;
        if (skillLevel < step.requirement.civilSkill.level) {
          return {
            success: false,
            error: `Requires ${step.requirement.civilSkill.skill} level ${step.requirement.civilSkill.level} (you have ${skillLevel})`,
          };
        }
      }

      // Check if can be skipped by talent
      if (canSkipStep(step, rpgStats.talents)) {
        const newCompleted = [...completedSteps, input.stepId];
        const newSkipped = [...((progress.skippedSteps || []) as string[]), input.stepId];
        const newStepIndex = Math.min(progress.currentStep + 1, chain.steps.length - 1);

        const isComplete = newCompleted.length >= chain.steps.length;

        await db.update(prestigeQuestProgress)
          .set({
            completedSteps: newCompleted,
            skippedSteps: newSkipped,
            currentStep: newStepIndex,
            status: isComplete ? "completed" : "in_progress",
            completedAt: isComplete ? new Date() : undefined,
          })
          .where(eq(prestigeQuestProgress.id, progress.id));

        if (isComplete) {
          await unlockPrestigeClass(ctx.user.id, chain);
        }

        return { success: true, skipped: true, isComplete };
      }

      // Track progress for count-based steps
      if (step.requirement.count) {
        const stepProg = (progress.stepProgress || {}) as Record<string, number>;
        const current = (stepProg[input.stepId] || 0) + (input.progressValue || 1);
        stepProg[input.stepId] = current;

        if (current < step.requirement.count) {
          await db.update(prestigeQuestProgress)
            .set({ stepProgress: stepProg })
            .where(eq(prestigeQuestProgress.id, progress.id));
          return { success: true, progress: current, target: step.requirement.count, isComplete: false };
        }
      }

      // Step completed
      const newCompleted = [...completedSteps, input.stepId];
      const newStepIndex = Math.min(progress.currentStep + 1, chain.steps.length - 1);
      const isComplete = newCompleted.length >= chain.steps.length;

      // Apply XP multiplier from achievement traits
      const xpMult = getQuestXpMultiplier(rpgStats.achievementTraits);
      const xpEarned = Math.floor((step.rewards.xp || 0) * xpMult);

      await db.update(prestigeQuestProgress)
        .set({
          completedSteps: newCompleted,
          currentStep: newStepIndex,
          status: isComplete ? "completed" : "in_progress",
          completedAt: isComplete ? new Date() : undefined,
        })
        .where(eq(prestigeQuestProgress.id, progress.id));

      if (isComplete) {
        await unlockPrestigeClass(ctx.user.id, chain);
      }

      return { success: true, xpEarned, isComplete };
    }),

  /* ─── ABANDON QUEST ─── */
  abandonQuest: protectedProcedure
    .input(z.object({ questChainKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      await db.update(prestigeQuestProgress)
        .set({ status: "abandoned" })
        .where(and(
          eq(prestigeQuestProgress.userId, ctx.user.id),
          eq(prestigeQuestProgress.questChainKey, input.questChainKey),
        ));

      return { success: true };
    }),
});

/* ═══ HELPER: Unlock prestige class on quest completion ═══ */
async function unlockPrestigeClass(
  userId: number,
  chain: (typeof PRESTIGE_QUEST_CHAINS)[number]
) {
  const db = await getDb();
  if (!db) return;

  // Check if already has this prestige class
  const existing = await db.select().from(prestigeProgress)
    .where(and(
      eq(prestigeProgress.userId, userId),
      eq(prestigeProgress.prestigeClassKey, chain.completionReward.prestigeClass),
    )).limit(1);

  if (existing.length === 0) {
    await db.insert(prestigeProgress).values({
      userId,
      prestigeClassKey: chain.completionReward.prestigeClass,
      prestigeXp: chain.completionReward.xp,
      prestigeRank: 1,
      unlockedPerks: [],
    });
  }
}
