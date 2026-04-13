/* ═══════════════════════════════════════════════════════
   GRADUATE LEGION ROUTER — Deploy graduated apprentices

   Graduated apprentices fill 7 roles that provide real
   mechanical bonuses to army, trade, tower defense, etc.

   Integrates with:
   - shared/graduateLegion.ts (computeRoleBonus, SLOT_LIMITS, canAssign)
   - pressureService (deployments feed dreamer pressure)
   - battlePassXp (deployment grants battle pass XP)
   - notifications (community milestone alerts)
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { logger } from "../logger";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { graduateDeployments, notifications } from "../../drizzle/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import {
  computeRoleBonus, SLOT_LIMITS, computeSacrificeReward, computeGiftTrustBoost,
  type GraduateRole,
} from "@shared/graduateLegion";
import type { Apprentice, ApprenticeArchetype, Rarity } from "@shared/apprentices";
import { pressureService } from "../services/pressureService";
import { battlePassXp } from "../services/battlePassXp";

const DEPLOYABLE_ROLES: GraduateRole[] = ["army_leader", "trade_envoy", "tower_captain", "companion", "cryo_vault"];
const CONSUMABLE_ROLES: GraduateRole[] = ["sacrificed", "relationship_gift"];

export const graduateLegionRouter = router({
  /** Deploy a graduated apprentice to a role */
  deploy: protectedProcedure
    .input(z.object({
      graduateId: z.string(),
      graduateName: z.string(),
      archetype: z.string(),
      rarity: z.string(),
      role: z.enum(["army_leader", "trade_envoy", "tower_captain", "companion", "cryo_vault"]),
      /** Apprentice stats for bonus computation */
      stats: z.object({
        strength: z.number(),
        intelligence: z.number(),
        agility: z.number(),
        charisma: z.number(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check slot availability
      const existing = await db.select().from(graduateDeployments)
        .where(and(
          eq(graduateDeployments.userId, ctx.user.id),
          eq(graduateDeployments.role, input.role),
          eq(graduateDeployments.active, true),
        ));

      const limit = SLOT_LIMITS[input.role as keyof typeof SLOT_LIMITS];
      if (limit !== undefined && existing.length >= limit) {
        throw new Error(`No ${input.role} slots available (${existing.length}/${limit})`);
      }

      // Check graduate isn't already deployed
      const alreadyDeployed = await db.select().from(graduateDeployments)
        .where(and(
          eq(graduateDeployments.userId, ctx.user.id),
          eq(graduateDeployments.graduateId, input.graduateId),
          eq(graduateDeployments.active, true),
        ))
        .limit(1);

      if (alreadyDeployed[0]) {
        throw new Error(`Graduate ${input.graduateName} is already deployed as ${alreadyDeployed[0].role}`);
      }

      // Compute bonuses
      const fakeApprentice: Apprentice = {
        id: input.graduateId,
        name: input.graduateName,
        archetype: input.archetype as ApprenticeArchetype,
        rarity: input.rarity as Rarity,
        stats: input.stats,
        bond: 100, // Graduated = max bond used for computation
        gender: "non-binary",
        race: "human",
        combatClass: "soldier",
        corruption: 0,
        isCorrupted: false,
        loyalty: 100,
        injuries: 0,
        daysSinceCelebration: 0,
        celebrationResults: [],
        personalityTraits: [],
        backstory: "",
      };
      const bonuses = computeRoleBonus(fakeApprentice, input.role);

      // Insert deployment
      await db.insert(graduateDeployments).values({
        userId: ctx.user.id,
        graduateId: input.graduateId,
        graduateName: input.graduateName,
        archetype: input.archetype,
        rarity: input.rarity,
        role: input.role,
        bonuses,
      });

      // Pressure: deployment = organization = hope → feeds Dreamer
      await pressureService.increment(ctx.user.id, "trustGains", 5, `graduate_deploy_${input.role}`);

      // Battle pass XP
      battlePassXp.awardRaw(ctx.user.id, 25).catch(() => {});

      // Check community milestones
      await checkCommunityMilestones(db);

      logger.info(`[GraduateLegion] ${input.graduateName} deployed as ${input.role} by user ${ctx.user.id}`);

      return {
        success: true,
        role: input.role,
        bonuses,
        message: `${input.graduateName} deployed as ${input.role.replace(/_/g, " ")}.`,
      };
    }),

  /** Sacrifice a graduate for dark power */
  sacrifice: protectedProcedure
    .input(z.object({
      graduateId: z.string(),
      graduateName: z.string(),
      archetype: z.string(),
      rarity: z.string(),
      bond: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const fakeApp = {
        id: input.graduateId,
        name: input.graduateName,
        archetype: input.archetype as ApprenticeArchetype,
        rarity: input.rarity as Rarity,
        bond: input.bond,
        stats: { strength: 5, intelligence: 5, agility: 5, charisma: 5 },
      } as Apprentice;

      const reward = computeSacrificeReward(fakeApp);

      // Record as sacrificed deployment
      await db.insert(graduateDeployments).values({
        userId: ctx.user.id,
        graduateId: input.graduateId,
        graduateName: input.graduateName,
        archetype: input.archetype,
        rarity: input.rarity,
        role: "sacrificed",
        active: false,
        bonuses: [],
        payload: { reward: reward.reward, corruptionGain: reward.corruptionGain, narrativeFlag: reward.narrativeFlag },
      });

      // Pressure: sacrifice = betrayal → feeds Shadow Tongue / Grand Edit
      await pressureService.increment(ctx.user.id, "betrayals", reward.corruptionGain, "apprentice_sacrifice");
      // Also feeds Necromancer (death)
      await pressureService.increment(ctx.user.id, "deaths", 10, "apprentice_sacrifice");

      await db.insert(notifications).values({
        userId: ctx.user.id,
        type: "apprentice_sacrificed",
        title: `${input.graduateName} was sacrificed`,
        message: `The darkness accepts the offering. ${reward.reward}`,
      });

      return { success: true, reward };
    }),

  /** Gift a graduate to an NPC for trust boost */
  gift: protectedProcedure
    .input(z.object({
      graduateId: z.string(),
      graduateName: z.string(),
      archetype: z.string(),
      rarity: z.string(),
      bond: z.number(),
      npcId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const fakeApp = {
        id: input.graduateId,
        name: input.graduateName,
        archetype: input.archetype as ApprenticeArchetype,
        rarity: input.rarity as Rarity,
        bond: input.bond,
        stats: { strength: 5, intelligence: 5, agility: 5, charisma: 5 },
      } as Apprentice;

      const trustBoost = computeGiftTrustBoost(fakeApp);

      await db.insert(graduateDeployments).values({
        userId: ctx.user.id,
        graduateId: input.graduateId,
        graduateName: input.graduateName,
        archetype: input.archetype,
        rarity: input.rarity,
        role: "relationship_gift",
        active: false,
        bonuses: [],
        payload: { giftedTo: input.npcId, trustBoost },
      });

      // Pressure: gifting = trust gain → feeds Dreamer
      await pressureService.increment(ctx.user.id, "trustGains", trustBoost, `apprentice_gift_${input.npcId}`);

      return { success: true, npcId: input.npcId, trustBoost };
    }),

  /** Recall a deployed graduate (deactivate deployment, remove bonuses) */
  recall: protectedProcedure
    .input(z.object({ deploymentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const [deployment] = await db.select().from(graduateDeployments)
        .where(and(
          eq(graduateDeployments.id, input.deploymentId),
          eq(graduateDeployments.userId, ctx.user.id),
          eq(graduateDeployments.active, true),
        ))
        .limit(1);

      if (!deployment) throw new Error("Deployment not found or already recalled");

      await db.update(graduateDeployments)
        .set({ active: false, recalledAt: new Date() })
        .where(eq(graduateDeployments.id, input.deploymentId));

      return {
        success: true,
        recalled: { id: deployment.id, name: deployment.graduateName, role: deployment.role },
      };
    }),

  /** List all active deployments for the player */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(graduateDeployments)
      .where(and(
        eq(graduateDeployments.userId, ctx.user.id),
        eq(graduateDeployments.active, true),
      ))
      .orderBy(desc(graduateDeployments.deployedAt));
  }),

  /** Get deployment history (all, including recalled/sacrificed) */
  history: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(graduateDeployments)
      .where(eq(graduateDeployments.userId, ctx.user.id))
      .orderBy(desc(graduateDeployments.deployedAt));
  }),

  /** Get available slots per role */
  getAvailableSlots: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return {};

    const slots: Record<string, { used: number; max: number; available: number }> = {};

    for (const role of DEPLOYABLE_ROLES) {
      const limit = SLOT_LIMITS[role as keyof typeof SLOT_LIMITS];
      if (limit === undefined) continue;

      const count = await db.select({ count: sql<number>`COUNT(*)`.as("count") })
        .from(graduateDeployments)
        .where(and(
          eq(graduateDeployments.userId, ctx.user.id),
          eq(graduateDeployments.role, role),
          eq(graduateDeployments.active, true),
        ));

      const used = Number(count[0]?.count) || 0;
      slots[role] = { used, max: limit, available: limit - used };
    }

    return slots;
  }),

  /** Get aggregated bonuses from all active deployments */
  getActiveBonuses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const deployments = await db.select().from(graduateDeployments)
      .where(and(
        eq(graduateDeployments.userId, ctx.user.id),
        eq(graduateDeployments.active, true),
      ));

    const allBonuses: { target: string; value: number; label: string; source: string }[] = [];
    for (const d of deployments) {
      const bonuses = d.bonuses ?? [];
      for (const b of bonuses) {
        allBonuses.push({ ...b, source: `${d.graduateName} (${d.role.replace(/_/g, " ")})` });
      }
    }

    return allBonuses;
  }),

  /** Community stats — total deployments server-wide */
  communityStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalDeployments: 0, byRole: {} };

    const total = await db.select({ count: sql<number>`COUNT(*)`.as("count") })
      .from(graduateDeployments)
      .where(eq(graduateDeployments.active, true));

    const byRole = await db.select({
      role: graduateDeployments.role,
      count: sql<number>`COUNT(*)`.as("count"),
    }).from(graduateDeployments)
      .where(eq(graduateDeployments.active, true))
      .groupBy(graduateDeployments.role);

    const roleMap: Record<string, number> = {};
    for (const r of byRole) roleMap[r.role] = Number(r.count);

    return { totalDeployments: Number(total[0]?.count) || 0, byRole: roleMap };
  }),
});

/* ─── COMMUNITY MILESTONES ─── */

const MILESTONES = [
  { threshold: 100, flag: "legion_milestone_100", title: "The Legion Rises", message: "100 graduates deployed across the fleet. The Ark grows stronger." },
  { threshold: 500, flag: "legion_milestone_500", title: "Legion Rising", message: "500 graduates serve across the galaxy. A force to be reckoned with." },
  { threshold: 1000, flag: "legion_milestone_1000", title: "The Human Speaks", message: "1,000 graduates. The Human's signal strengthens: 'You're building something worth protecting.'" },
];

async function checkCommunityMilestones(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  const [total] = await db.select({ count: sql<number>`COUNT(*)`.as("count") })
    .from(graduateDeployments)
    .where(eq(graduateDeployments.active, true));

  const count = Number(total?.count) || 0;

  for (const milestone of MILESTONES) {
    // Check if we just crossed this threshold (count - 1 was below, count is at or above)
    // Simple approach: we only trigger if count equals the threshold exactly
    // (in practice, a more robust deduplication would use a separate milestones table)
    if (count === milestone.threshold) {
      // Record pressure: milestone = community achievement
      await pressureService.increment(0, "trustGains", 25, milestone.flag).catch(() => {});
      logger.info(`[GraduateLegion] Community milestone reached: ${milestone.title} (${count} deployments)`);
    }
  }
}
