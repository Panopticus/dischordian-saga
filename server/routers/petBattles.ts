/* ═══════════════════════════════════════════════════════
   PET BATTLES — Server Router
   Persists pet roster, battle results, rewards, and injuries.
   The client runs the battle simulation; the server validates
   and stores the outcome, grants rewards, and tracks injuries.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { playerPets, petBattleHistory, userProgress } from "../../drizzle/schema";
import { eq, and, sql, desc, isNull, lte } from "drizzle-orm";
import { companionCombat } from "../services/companionCombat";
import { petEvolution } from "../services/petEvolution";
import { pressureService } from "../services/pressureService";
import { battlePassXp } from "../services/battlePassXp";
import { applyPrestigeBonuses } from "../services/prestigeMultiplier";
import { checkFeatureFlag } from "../middleware/featureFlag";

export const petBattlesRouter = router({
  /** Get player's full pet roster */
  getMyPets: protectedProcedure.use(checkFeatureFlag("pet_battles")).query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(playerPets)
      .where(eq(playerPets.userId, ctx.user.id));
  }),

  /** Acquire a new pet (from specimen collection, quest reward, etc.) */
  acquirePet: protectedProcedure
    .input(z.object({
      petId: z.string().min(1).max(64),
      species: z.string().min(1).max(64),
      name: z.string().min(1).max(128),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Check if player already has this pet
      const existing = await db
        .select()
        .from(playerPets)
        .where(and(eq(playerPets.userId, ctx.user.id), eq(playerPets.petId, input.petId)));

      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "You already have this pet" });
      }

      await db.insert(playerPets).values({
        userId: ctx.user.id,
        petId: input.petId,
        species: input.species,
        name: input.name,
        evolutionStage: 1,
        bond: 0,
        skillPoints: 0,
        currentHp: 50,
        maxHp: 50,
        unlockedMoves: [],
        wins: 0,
        losses: 0,
        kills: 0,
      });

      return { success: true, petId: input.petId };
    }),

  /** Check if a pet is battle-ready (not injured) */
  canFight: protectedProcedure
    .input(z.object({ petId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { canFight: false, reason: "Database unavailable" };

      const [pet] = await db
        .select()
        .from(playerPets)
        .where(and(eq(playerPets.userId, ctx.user.id), eq(playerPets.petId, input.petId)));

      if (!pet) return { canFight: false, reason: "Pet not found" };
      if (pet.injuredUntil && new Date(pet.injuredUntil) > new Date()) {
        return { canFight: false, reason: "Pet is recovering from injuries", recoversAt: pet.injuredUntil };
      }
      if (pet.currentHp <= 0) {
        return { canFight: false, reason: "Pet has no HP — needs healing" };
      }
      return { canFight: true, pet };
    }),

  /** Submit battle result — validates and persists outcome + rewards */
  submitBattleResult: protectedProcedure
    .input(z.object({
      petId: z.string().min(1),
      opponentSpecies: z.string().min(1),
      arenaTier: z.string().min(1),
      won: z.boolean(),
      rounds: z.number().int().min(1).max(20),
      perfectVictory: z.boolean(),
      battleLog: z.array(z.object({
        round: z.number(),
        turn: z.string(),
        action: z.string(),
        damage: z.number().optional(),
        effect: z.string().optional(),
        critical: z.boolean().optional(),
        flavor: z.string(),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Fetch the pet
      const [pet] = await db
        .select()
        .from(playerPets)
        .where(and(eq(playerPets.userId, ctx.user.id), eq(playerPets.petId, input.petId)));

      if (!pet) throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });

      // Calculate rewards
      const bondGain = input.won ? (input.perfectVictory ? 8 : 5) : 1;
      const skillGain = input.won ? (input.perfectVictory ? 2 : 1) : 0;
      const dreamReward = input.won ? 20 + input.rounds * 5 : 5;
      const xpReward = input.won ? 50 + input.rounds * 10 : 15;
      const injury = input.won
        ? (input.perfectVictory ? 0 : Math.min(40, input.rounds * 5))
        : 60 + input.rounds * 5;

      // Calculate injury recovery time (1 minute per injury point for gameplay)
      const injuredUntil = injury > 0
        ? new Date(Date.now() + injury * 60_000)
        : null;

      // Update pet stats
      const newHp = Math.max(0, pet.currentHp - injury);
      await db
        .update(playerPets)
        .set({
          bond: sql`${playerPets.bond} + ${bondGain}`,
          skillPoints: sql`${playerPets.skillPoints} + ${skillGain}`,
          wins: input.won ? sql`${playerPets.wins} + 1` : pet.wins,
          losses: input.won ? pet.losses : sql`${playerPets.losses} + 1`,
          kills: input.won ? sql`${playerPets.kills} + 1` : pet.kills,
          currentHp: newHp,
          injuredUntil,
        })
        .where(and(eq(playerPets.userId, ctx.user.id), eq(playerPets.petId, input.petId)));

      // Record battle history
      await db.insert(petBattleHistory).values({
        userId: ctx.user.id,
        petId: input.petId,
        opponentSpecies: input.opponentSpecies,
        arenaTier: input.arenaTier,
        won: input.won,
        rounds: input.rounds,
        perfectVictory: input.perfectVictory,
        bondGain,
        dreamEarned: dreamReward,
        xpEarned: xpReward,
        injuryDealt: injury,
        battleLog: input.battleLog as any,
      });

      // Get companion combat bonus for pet battles
      const companionBonus = await companionCombat.getCombatBonus(ctx.user.id);
      // Companion bond amplifies pet battle XP reward
      const companionXpBoost = companionBonus.attack > 0 ? Math.round(xpReward * companionBonus.attack / 100) : 0;
      const preMultXp = xpReward + companionXpBoost;

      // Apply prestige multipliers on top of the companion-boosted XP.
      // Non-prestiged players get the same number back (tier: 0).
      const prestige = await applyPrestigeBonuses(ctx.user.id, { xp: preMultXp });
      const totalXp = prestige.xp;

      // Grant XP + Dream tokens to player progress
      await db
        .update(userProgress)
        .set({
          xp: sql`${userProgress.xp} + ${totalXp}`,
        })
        .where(eq(userProgress.userId, ctx.user.id));

      // Evolution XP: winning grants +20, losing grants +5
      const evoXp = input.won ? 20 : 5;
      const evoResult = await petEvolution.addPetEvolutionXp(ctx.user.id, input.petId, evoXp);

      // Also feed Eidolon evolution XP (bond action at 50% rate)
      petEvolution.addEidolonEvolutionXp(ctx.user.id, Math.floor(bondGain * 0.5), "pet_battle").catch(() => {});

      // Pressure: pet battle loss feeds Necromancer
      if (!input.won) {
        pressureService.recordAction(ctx.user.id, "pet_death").catch(() => {});
      }

      // Battle pass XP: every pet battle
      battlePassXp.award(ctx.user.id, "pet_battle").catch(() => {});

      return {
        success: true,
        rewards: { bondGain, skillPoints: skillGain, dream: dreamReward, xp: totalXp, injury },
        petStatus: { currentHp: newHp, injuredUntil, bond: pet.bond + bondGain },
        companionBonus: companionBonus.attack > 0 ? {
          description: companionCombat.formatBreakdown(companionBonus),
          xpBoost: companionXpBoost,
        } : null,
        prestigeBonus: prestige.tier > 0 ? {
          tier: prestige.tier,
          xpMultiplier: prestige.multipliers.xp,
          preMultXp,
        } : null,
        evolution: evoResult.evolved ? { newStage: evoResult.newStage } : null,
      };
    }),

  /** Get battle history for a pet */
  getBattleHistory: protectedProcedure
    .input(z.object({
      petId: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(petBattleHistory.userId, ctx.user.id)];
      if (input.petId) conditions.push(eq(petBattleHistory.petId, input.petId));

      return db
        .select()
        .from(petBattleHistory)
        .where(and(...conditions))
        .orderBy(desc(petBattleHistory.foughtAt))
        .limit(input.limit);
    }),

  /** Heal a pet (costs dream tokens, or wait for natural recovery) */
  healPet: protectedProcedure
    .input(z.object({ petId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [pet] = await db
        .select()
        .from(playerPets)
        .where(and(eq(playerPets.userId, ctx.user.id), eq(playerPets.petId, input.petId)));

      if (!pet) throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
      if (pet.currentHp >= pet.maxHp) {
        return { success: true, message: "Pet is already at full health" };
      }

      // Heal costs 10 dream tokens
      await db
        .update(playerPets)
        .set({ currentHp: pet.maxHp, injuredUntil: null })
        .where(and(eq(playerPets.userId, ctx.user.id), eq(playerPets.petId, input.petId)));

      return { success: true, message: "Pet fully healed", currentHp: pet.maxHp };
    }),

  /** Evolve a pet (requires bond threshold) */
  evolvePet: protectedProcedure
    .input(z.object({ petId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [pet] = await db
        .select()
        .from(playerPets)
        .where(and(eq(playerPets.userId, ctx.user.id), eq(playerPets.petId, input.petId)));

      if (!pet) throw new TRPCError({ code: "NOT_FOUND" });
      if (pet.evolutionStage >= 3) throw new TRPCError({ code: "BAD_REQUEST", message: "Pet is fully evolved" });

      const bondRequired = pet.evolutionStage === 1 ? 30 : 70;
      if (pet.bond < bondRequired) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Need ${bondRequired} bond (have ${pet.bond})` });
      }

      const newStage = (pet.evolutionStage + 1) as 1 | 2 | 3;
      const stageBonus = { 1: 1.0, 2: 1.25, 3: 1.5 }[newStage];
      const newMaxHp = Math.floor(50 * stageBonus * (1 + pet.bond * 0.005));

      await db
        .update(playerPets)
        .set({
          evolutionStage: newStage,
          maxHp: newMaxHp,
          currentHp: newMaxHp,
          injuredUntil: null,
        })
        .where(and(eq(playerPets.userId, ctx.user.id), eq(playerPets.petId, input.petId)));

      return { success: true, newStage, newMaxHp };
    }),
});
