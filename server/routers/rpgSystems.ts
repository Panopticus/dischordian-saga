/**
 * RPG SYSTEMS ROUTER
 * ──────────────────
 * Handles all 8 RPG recommendation systems:
 * 1. Synergy Bonuses
 * 2. Branching Mastery Paths
 * 3. Citizen Talents
 * 4. Civil Skills
 * 5. Elemental Combos
 * 6. Companion Synergies
 * 7. Prestige Classes
 * 8. Achievement Traits
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  citizenCharacters, classMastery, masteryBranches,
  citizenTalentSelections, civilSkillProgress,
  prestigeProgress, achievementTraitProgress,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Shared modules
import type { CitizenData } from "../../shared/citizenTraits";
import {
  resolveSynergies, getSynergyEffectsForSystem, countSynergies,
} from "../../shared/synergyBonuses";
import {
  CLASS_BRANCHES, getClassBranches, getPerksWithBranch,
  type CharacterClass, type MasteryPath,
} from "../../shared/classMastery";
import {
  CITIZEN_TALENTS, getTalentsAtMilestone, getAvailableTalents,
  getTalentSlots, canSelectTalent, getNextTalentMilestone,
  TALENT_MILESTONES, type TalentMilestone,
} from "../../shared/citizenTalents";
import {
  CIVIL_SKILLS, getCivilSkillLevel, getCivilSkillProgress,
  getActiveBonuses, getNextBonus, calculateCivilSkillXp,
  CIVIL_SKILL_XP_CURVE, MAX_CIVIL_SKILL_LEVEL,
} from "../../shared/civilSkills";
import {
  resolveElementalCombo, getCombosForElement, getCombosForSystem,
  ELEMENTAL_COMBOS, getElementAdvantages, type Element,
} from "../../shared/elementalCombos";
import {
  resolveCompanionBonuses, getSynergySummary,
  calculateSynergyScore, getSynergyTier,
  type CompanionId,
} from "../../shared/companionSynergies";
import {
  PRESTIGE_CLASSES, meetsPrestigeRequirements, getPrestigeRank,
  getPrestigePerks, getPrestigeClassesForBaseClass, PRESTIGE_RANKS,
  type PrestigeClassKey, type PrestigeRank,
} from "../../shared/prestigeClasses";
import {
  ACHIEVEMENT_TRAITS, getTraitSlots, isTraitUnlocked,
  getTraitProgress, MAX_TRAIT_SLOTS, TRAIT_TIER_INFO,
} from "../../shared/achievementTraits";

/* ═══════════════════════════════════════════════════════
   HELPER — Get user's primary citizen
   ═══════════════════════════════════════════════════════ */

async function getUserCitizen(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const chars = await db
    .select()
    .from(citizenCharacters)
    .where(and(eq(citizenCharacters.userId, userId), eq(citizenCharacters.isPrimary, 1)))
    .limit(1);
  return chars[0] || null;
}

/* ═══════════════════════════════════════════════════════
   ROUTER
   ═══════════════════════════════════════════════════════ */

export const rpgSystemsRouter = router({

  /* ─── 1. SYNERGY BONUSES ─── */
  getSynergyBonuses: protectedProcedure.query(async ({ ctx }) => {
    const citizen = await getUserCitizen(ctx.user.id);
    if (!citizen) return null;

    const citizenData: CitizenData = {
      species: citizen.species as CitizenData["species"],
      characterClass: citizen.characterClass as CitizenData["characterClass"],
      alignment: citizen.alignment as CitizenData["alignment"],
      element: citizen.element as CitizenData["element"],
      attrAttack: citizen.attrAttack ?? 1,
      attrDefense: citizen.attrDefense ?? 1,
      attrVitality: citizen.attrVitality ?? 1,
      classLevel: citizen.classLevel ?? 1,
      level: citizen.level ?? 1,
    };

    const synergies = resolveSynergies(citizenData);
    const counts = countSynergies(citizenData);

    return { synergies, counts };
  }),

  /* ─── 2. BRANCHING MASTERY PATHS ─── */
  getMasteryBranches: protectedProcedure.query(async ({ ctx }) => {
    const citizen = await getUserCitizen(ctx.user.id);
    if (!citizen) return null;

    const db = await getDb();
    if (!db) return null;

    const characterClass = citizen.characterClass as CharacterClass;
    const branching = getClassBranches(characterClass);

    // Check if user has already chosen a branch
    const existing = await db
      .select()
      .from(masteryBranches)
      .where(and(
        eq(masteryBranches.userId, ctx.user.id),
        eq(masteryBranches.characterClass, characterClass),
      ))
      .limit(1);

    // Get mastery rank
    const masteryRow = await db
      .select()
      .from(classMastery)
      .where(and(
        eq(classMastery.userId, ctx.user.id),
        eq(classMastery.characterClass, characterClass),
      ))
      .limit(1);

    const masteryRank = masteryRow[0]?.masteryRank ?? 0;
    const canChoose = masteryRank >= 3 && !existing[0];

    return {
      characterClass,
      masteryRank,
      canChoose,
      chosenBranch: existing[0]?.branchKey || null,
      pathA: {
        ...branching.pathA,
        isChosen: existing[0]?.branchKey === branching.pathA.pathKey,
      },
      pathB: {
        ...branching.pathB,
        isChosen: existing[0]?.branchKey === branching.pathB.pathKey,
      },
    };
  }),

  chooseMasteryBranch: protectedProcedure
    .input(z.object({ branchKey: z.enum(["path_a", "path_b"]) }))
    .mutation(async ({ ctx, input }) => {
      const citizen = await getUserCitizen(ctx.user.id);
      if (!citizen) throw new Error("No citizen character found");

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const characterClass = citizen.characterClass as CharacterClass;

      // Verify rank 3+
      const masteryRow = await db
        .select()
        .from(classMastery)
        .where(and(
          eq(classMastery.userId, ctx.user.id),
          eq(classMastery.characterClass, characterClass),
        ))
        .limit(1);

      if (!masteryRow[0] || masteryRow[0].masteryRank < 3) {
        throw new Error("Must reach mastery rank 3 to choose a branch");
      }

      // Check not already chosen
      const existing = await db
        .select()
        .from(masteryBranches)
        .where(and(
          eq(masteryBranches.userId, ctx.user.id),
          eq(masteryBranches.characterClass, characterClass),
        ))
        .limit(1);

      if (existing[0]) throw new Error("Branch already chosen for this class");

      const branching = getClassBranches(characterClass);
      const branch = input.branchKey === "path_a" ? branching.pathA : branching.pathB;

      await db.insert(masteryBranches).values({
        userId: ctx.user.id,
        characterClass,
        branchKey: input.branchKey,
      });

      return { success: true, branchKey: input.branchKey, branchName: branch.name };
    }),

  /* ─── 3. CITIZEN TALENTS ─── */
  getTalentStatus: protectedProcedure.query(async ({ ctx }) => {
    const citizen = await getUserCitizen(ctx.user.id);
    if (!citizen) return null;

    const db = await getDb();
    if (!db) return null;

    const citizenLevel = citizen.level ?? 1;
    const availableMilestones = getAvailableTalents(citizenLevel);
    const slots = getTalentSlots(citizenLevel);
    const nextMilestone = getNextTalentMilestone(citizenLevel);

    // Get selected talents
    const selected = await db
      .select()
      .from(citizenTalentSelections)
      .where(eq(citizenTalentSelections.userId, ctx.user.id));

    const selectedKeys = selected.map(s => s.talentKey);
    const selectedByMilestone = Object.fromEntries(
      selected.map(s => [s.milestoneLevel, s.talentKey])
    );

    // For each milestone, determine available talents
    const milestoneData = availableMilestones.map(m => {
      const chosen = selectedByMilestone[m.milestone];
      return {
        level: m.milestone,
        unlocked: citizenLevel >= m.milestone,
        chosen,
        chosenTalent: chosen ? CITIZEN_TALENTS.find(t => t.key === chosen) : null,
        availableTalents: m.talents.filter(t =>
          !selectedKeys.includes(t.key) || t.key === chosen
        ),
      };
    });

    return {
      citizenLevel,
      totalTalents: selected.length,
      maxSlots: slots,
      nextMilestone,
      milestones: milestoneData,
      selectedTalents: selected.map(s => {
        const talent = CITIZEN_TALENTS.find(t => t.key === s.talentKey);
        return { ...s, talent };
      }),
    };
  }),

  selectTalent: protectedProcedure
    .input(z.object({ milestoneLevel: z.number(), talentKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const citizen = await getUserCitizen(ctx.user.id);
      if (!citizen) throw new Error("No citizen character found");

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const citizenLevel = citizen.level ?? 1;
      if (citizenLevel < input.milestoneLevel) {
        throw new Error(`Must reach level ${input.milestoneLevel} to select this talent`);
      }

      // Check not already selected for this milestone
      const existing = await db
        .select()
        .from(citizenTalentSelections)
        .where(and(
          eq(citizenTalentSelections.userId, ctx.user.id),
          eq(citizenTalentSelections.milestoneLevel, input.milestoneLevel),
        ))
        .limit(1);

      if (existing[0]) throw new Error("Talent already selected for this milestone");

      // Validate talent key
      const talent = CITIZEN_TALENTS.find(t => t.key === input.talentKey);
      if (!talent) throw new Error("Invalid talent key");

      // Check talent is available for this milestone
      if (!canSelectTalent(
        talent, citizenLevel,
        citizen.characterClass || undefined,
        citizen.species || undefined
      )) {
        throw new Error("Talent not available for your character");
      }

      await db.insert(citizenTalentSelections).values({
        userId: ctx.user.id,
        talentKey: input.talentKey,
        milestoneLevel: input.milestoneLevel,
      });

      return { success: true, talentKey: input.talentKey, talentName: talent.name };
    }),

  /* ─── 4. CIVIL SKILLS ─── */
  getCivilSkills: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const progress = await db
      .select()
      .from(civilSkillProgress)
      .where(eq(civilSkillProgress.userId, ctx.user.id));

    const progressMap = Object.fromEntries(
      progress.map(p => [p.skillKey, p])
    );

    return CIVIL_SKILLS.map(skill => {
      const p = progressMap[skill.key];
      const totalXp = p?.xp ?? 0;
      const progressInfo = getCivilSkillProgress(totalXp);
      const bonuses = getActiveBonuses(skill.key, progressInfo.level);
      const next = getNextBonus(skill.key, progressInfo.level);

      return {
        ...skill,
        level: progressInfo.level,
        xp: totalXp,
        xpProgress: progressInfo.progress,
        xpCurrent: progressInfo.current,
        xpNext: progressInfo.next,
        actionsPerformed: p?.actionsPerformed ?? 0,
        activeBonuses: bonuses,
        nextBonus: next,
        maxLevel: progressInfo.level >= MAX_CIVIL_SKILL_LEVEL,
      };
    });
  }),

  awardCivilSkillXp: protectedProcedure
    .input(z.object({ action: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const xpGains = calculateCivilSkillXp(input.action);
      if (Object.keys(xpGains).length === 0) return { awarded: {} };

      const results: Record<string, { awarded: number; newLevel: number; levelUp: boolean }> = {};

      for (const [skillKey, xpGain] of Object.entries(xpGains)) {
        // Get or create progress
        const existing = await db
          .select()
          .from(civilSkillProgress)
          .where(and(
            eq(civilSkillProgress.userId, ctx.user.id),
            eq(civilSkillProgress.skillKey, skillKey),
          ))
          .limit(1);

        const currentXp = existing[0]?.xp ?? 0;
        const currentLevel = existing[0]?.level ?? 1;
        const newXp = currentXp + xpGain;
        const newLevel = getCivilSkillLevel(newXp);
        const levelUp = newLevel > currentLevel;

        if (existing[0]) {
          await db
            .update(civilSkillProgress)
            .set({
              xp: newXp,
              level: newLevel,
              actionsPerformed: (existing[0].actionsPerformed ?? 0) + 1,
            })
            .where(eq(civilSkillProgress.id, existing[0].id));
        } else {
          await db.insert(civilSkillProgress).values({
            userId: ctx.user.id,
            skillKey,
            xp: xpGain,
            level: getCivilSkillLevel(xpGain),
            actionsPerformed: 1,
          });
        }

        results[skillKey] = { awarded: xpGain, newLevel, levelUp };
      }

      return { awarded: results };
    }),

  /* ─── 5. ELEMENTAL COMBOS ─── */
  getElementalCombos: protectedProcedure.query(async ({ ctx }) => {
    const citizen = await getUserCitizen(ctx.user.id);
    if (!citizen) return null;

    const playerElement = citizen.element as Element;
    const combos = getCombosForElement(playerElement);
    const advantages = getElementAdvantages(playerElement);

    return {
      playerElement,
      combos,
      advantages,
      allCombos: ELEMENTAL_COMBOS,
    };
  }),

  resolveCombo: protectedProcedure
    .input(z.object({
      element1: z.enum(["earth", "fire", "water", "air", "space", "time", "probability", "reality"]),
      element2: z.enum(["earth", "fire", "water", "air", "space", "time", "probability", "reality"]),
      system: z.enum(["card_game", "fight", "guild_war", "chess", "trade_empire"]),
    }))
    .query(({ input }) => {
      return resolveElementalCombo(input.element1, input.element2, input.system);
    }),

  /* ─── 6. COMPANION SYNERGIES ─── */
  getCompanionSynergy: protectedProcedure
    .input(z.object({ companionId: z.enum(["elara", "the_human"]) }))
    .query(async ({ ctx, input }) => {
      const citizen = await getUserCitizen(ctx.user.id);
      if (!citizen) return null;

      const citizenData = {
        species: citizen.species as CitizenData["species"],
        characterClass: citizen.characterClass as CitizenData["characterClass"],
        element: citizen.element as CitizenData["element"],
        alignment: citizen.alignment as CitizenData["alignment"],
      };

      // Default values — frontend can pass morality/relationship for full calculation
      const morality = 0;
      const relationshipLevel = 0;

      return getSynergySummary(input.companionId, citizenData, morality, relationshipLevel);
    }),

  getCompanionSynergyFull: protectedProcedure
    .input(z.object({
      companionId: z.enum(["elara", "the_human"]),
      morality: z.number(),
      relationshipLevel: z.number(),
      system: z.enum(["card_game", "trade_empire", "fight", "chess", "guild_war", "quest", "all"]),
    }))
    .query(async ({ ctx, input }) => {
      const citizen = await getUserCitizen(ctx.user.id);
      if (!citizen) return null;

      const citizenData = {
        species: citizen.species as CitizenData["species"],
        characterClass: citizen.characterClass as CitizenData["characterClass"],
        element: citizen.element as CitizenData["element"],
        alignment: citizen.alignment as CitizenData["alignment"],
      };

      return resolveCompanionBonuses(
        input.companionId, citizenData, input.morality,
        input.relationshipLevel, input.system
      );
    }),

  /* ─── 7. PRESTIGE CLASSES ─── */
  getPrestigeStatus: protectedProcedure.query(async ({ ctx }) => {
    const citizen = await getUserCitizen(ctx.user.id);
    if (!citizen) return null;

    const db = await getDb();
    if (!db) return null;

    const characterClass = citizen.characterClass as CharacterClass;
    const citizenLevel = citizen.level ?? 1;

    // Get all mastery ranks
    const masteryRows = await db
      .select()
      .from(classMastery)
      .where(eq(classMastery.userId, ctx.user.id));

    const classRanks: Record<string, number> = {};
    masteryRows.forEach(r => {
      classRanks[r.characterClass] = r.masteryRank;
    });

    // Get active prestige class
    const activePrestige = await db
      .select()
      .from(prestigeProgress)
      .where(eq(prestigeProgress.userId, ctx.user.id))
      .limit(1);

    // Get available prestige classes for this character
    const availableClasses = getPrestigeClassesForBaseClass(characterClass);

    return {
      citizenLevel,
      characterClass,
      classRanks,
      activePrestige: activePrestige[0] ? {
        ...activePrestige[0],
        prestigeClass: PRESTIGE_CLASSES.find(p => p.key === activePrestige[0].prestigeClassKey),
        rank: getPrestigeRank(activePrestige[0].prestigeXp) as PrestigeRank,
        perks: getPrestigePerks(
          activePrestige[0].prestigeClassKey as PrestigeClassKey,
          getPrestigeRank(activePrestige[0].prestigeXp) as PrestigeRank
        ),
      } : null,
      availableClasses: availableClasses.map(pc => ({
        ...pc,
        requirements: meetsPrestigeRequirements(pc.key, citizenLevel, classRanks, []),
      })),
    };
  }),

  selectPrestigeClass: protectedProcedure
    .input(z.object({
      prestigeClassKey: z.enum([
        "chronomancer", "warlord", "shadow_broker", "technomancer",
        "blade_dancer", "architect_prime", "void_walker",
        "iron_prophet", "phantom_engineer", "war_oracle",
      ]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check not already selected
      const existing = await db
        .select()
        .from(prestigeProgress)
        .where(eq(prestigeProgress.userId, ctx.user.id))
        .limit(1);

      if (existing[0]) throw new Error("Prestige class already selected");

      // Validate prestige class exists
      const pc = PRESTIGE_CLASSES.find(p => p.key === input.prestigeClassKey);
      if (!pc) throw new Error("Invalid prestige class");

      await db.insert(prestigeProgress).values({
        userId: ctx.user.id,
        prestigeClassKey: input.prestigeClassKey,
        prestigeXp: 0,
        prestigeRank: 0,
        unlockedPerks: [],
      });

      return { success: true, prestigeClass: pc.name };
    }),

  /* ─── 8. ACHIEVEMENT TRAITS ─── */
  getAchievementTraits: protectedProcedure.query(async ({ ctx }) => {
    const citizen = await getUserCitizen(ctx.user.id);
    const citizenLevel = citizen?.level ?? 1;

    const db = await getDb();
    if (!db) return null;

    // Get or create progress
    let progress = await db
      .select()
      .from(achievementTraitProgress)
      .where(eq(achievementTraitProgress.userId, ctx.user.id))
      .limit(1);

    if (!progress[0]) {
      await db.insert(achievementTraitProgress).values({
        userId: ctx.user.id,
        counters: {},
        unlockedTraits: [],
        equippedTraits: [],
      });
      progress = await db
        .select()
        .from(achievementTraitProgress)
        .where(eq(achievementTraitProgress.userId, ctx.user.id))
        .limit(1);
    }

    const row = progress[0]!;
    const counters = (row.counters as Record<string, number>) || {};
    const unlockedKeys = (row.unlockedTraits as string[]) || [];
    const equippedKeys = (row.equippedTraits as string[]) || [];
    const slots = getTraitSlots(citizenLevel);

    return {
      citizenLevel,
      slots,
      maxSlots: MAX_TRAIT_SLOTS,
      equippedTraits: equippedKeys.map(k => ACHIEVEMENT_TRAITS.find(t => t.key === k)).filter(Boolean),
      unlockedTraits: unlockedKeys.map(k => ACHIEVEMENT_TRAITS.find(t => t.key === k)).filter(Boolean),
      allTraits: ACHIEVEMENT_TRAITS.map(t => ({
        ...t,
        unlocked: unlockedKeys.includes(t.key),
        equipped: equippedKeys.includes(t.key),
        progress: getTraitProgress(t.key, counters),
      })),
      tierInfo: TRAIT_TIER_INFO,
    };
  }),

  equipTrait: protectedProcedure
    .input(z.object({ traitKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const citizen = await getUserCitizen(ctx.user.id);
      const citizenLevel = citizen?.level ?? 1;
      const slots = getTraitSlots(citizenLevel);

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const progress = await db
        .select()
        .from(achievementTraitProgress)
        .where(eq(achievementTraitProgress.userId, ctx.user.id))
        .limit(1);

      if (!progress[0]) throw new Error("No trait progress found");

      const unlockedKeys = (progress[0].unlockedTraits as string[]) || [];
      const equippedKeys = (progress[0].equippedTraits as string[]) || [];

      if (!unlockedKeys.includes(input.traitKey)) throw new Error("Trait not unlocked");
      if (equippedKeys.includes(input.traitKey)) throw new Error("Trait already equipped");
      if (equippedKeys.length >= slots) throw new Error("No available trait slots");

      const newEquipped = [...equippedKeys, input.traitKey];
      await db
        .update(achievementTraitProgress)
        .set({ equippedTraits: newEquipped })
        .where(eq(achievementTraitProgress.id, progress[0].id));

      return { success: true, equippedTraits: newEquipped };
    }),

  unequipTrait: protectedProcedure
    .input(z.object({ traitKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const progress = await db
        .select()
        .from(achievementTraitProgress)
        .where(eq(achievementTraitProgress.userId, ctx.user.id))
        .limit(1);

      if (!progress[0]) throw new Error("No trait progress found");

      const equippedKeys = (progress[0].equippedTraits as string[]) || [];
      const newEquipped = equippedKeys.filter(k => k !== input.traitKey);

      await db
        .update(achievementTraitProgress)
        .set({ equippedTraits: newEquipped })
        .where(eq(achievementTraitProgress.id, progress[0].id));

      return { success: true, equippedTraits: newEquipped };
    }),

  /** Increment an achievement counter (called by other game systems) */
  incrementCounter: protectedProcedure
    .input(z.object({ counter: z.string(), amount: z.number().default(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      let progress = await db
        .select()
        .from(achievementTraitProgress)
        .where(eq(achievementTraitProgress.userId, ctx.user.id))
        .limit(1);

      if (!progress[0]) {
        await db.insert(achievementTraitProgress).values({
          userId: ctx.user.id,
          counters: { [input.counter]: input.amount },
          unlockedTraits: [],
          equippedTraits: [],
        });
        progress = await db
          .select()
          .from(achievementTraitProgress)
          .where(eq(achievementTraitProgress.userId, ctx.user.id))
          .limit(1);
      }

      const row = progress[0]!;
      const counters = { ...((row.counters as Record<string, number>) || {}) };
      counters[input.counter] = (counters[input.counter] || 0) + input.amount;

      // Check for newly unlocked traits
      const oldUnlocked = (row.unlockedTraits as string[]) || [];
      const newlyUnlocked: string[] = [];

      for (const trait of ACHIEVEMENT_TRAITS) {
        if (oldUnlocked.includes(trait.key)) continue;
        if (isTraitUnlocked(trait.key, counters)) {
          newlyUnlocked.push(trait.key);
        }
      }

      const allUnlocked = [...oldUnlocked, ...newlyUnlocked];

      await db
        .update(achievementTraitProgress)
        .set({ counters, unlockedTraits: allUnlocked })
        .where(eq(achievementTraitProgress.id, row.id));

      return {
        counter: input.counter,
        newValue: counters[input.counter],
        newlyUnlocked: newlyUnlocked.map(k => ACHIEVEMENT_TRAITS.find(t => t.key === k)).filter(Boolean),
      };
    }),
});
