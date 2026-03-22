/**
 * COOPERATIVE PvE RAIDS ROUTER
 * ──────────────────────────────────────────────────
 * Weekly boss encounters, contribution tracking, RPG-scaled damage.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  coopRaids, raidContributions,
  citizenCharacters, classMastery, civilSkillProgress, prestigeProgress,
  guildMembers,
} from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  RAID_BOSSES, resolveRaidBonuses,
  type RaidDifficulty,
} from "../../shared/coopRaids";

export const coopRaidsRouter = router({
  /** Get active raids */
  getActiveRaids: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    return db.select().from(coopRaids)
      .where(eq(coopRaids.status, "active"))
      .orderBy(desc(coopRaids.startsAt));
  }),

  /** Get raid details with contributions */
  getRaidDetails: protectedProcedure
    .input(z.object({ raidId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [raid] = await db.select().from(coopRaids).where(eq(coopRaids.id, input.raidId));
      if (!raid) return null;

      const contributions = await db.select().from(raidContributions)
        .where(eq(raidContributions.raidId, input.raidId))
        .orderBy(desc(raidContributions.contributionScore));

      const [myContribution] = await db.select().from(raidContributions)
        .where(and(eq(raidContributions.raidId, input.raidId), eq(raidContributions.userId, ctx.user.id)));

      const bossDef = RAID_BOSSES.find(b => b.key === raid.bossKey);

      return { raid, contributions, myContribution: myContribution || null, bossDef: bossDef || null };
    }),

  /** Start a new raid (guild leader) */
  startRaid: protectedProcedure
    .input(z.object({
      bossKey: z.string(),
      difficulty: z.string().default("normal"),
      guildId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const boss = RAID_BOSSES.find(b => b.key === input.bossKey);
      if (!boss) throw new Error("Boss not found");

      const diff = (input.difficulty || "normal") as RaidDifficulty;
      const maxHp = boss.hp[diff] || boss.hp.normal;

      const endsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const [result] = await db.insert(coopRaids).values({
        bossKey: input.bossKey,
        difficulty: input.difficulty,
        guildId: input.guildId ?? null,
        currentHp: maxHp,
        maxHp,
        status: "active",
        endsAt,
      }).$returningId();

      return { raidId: result.id, bossName: boss.name, maxHp };
    }),

  /** Deal damage to boss */
  dealDamage: protectedProcedure
    .input(z.object({ raidId: z.number(), role: z.string().default("dps") }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [raid] = await db.select().from(coopRaids).where(eq(coopRaids.id, input.raidId));
      if (!raid || raid.status !== "active") throw new Error("Raid not active");

      // Get RPG stats for damage calculation
      const [char] = await db.select().from(citizenCharacters).where(eq(citizenCharacters.userId, ctx.user.id));
      const classRows = await db.select().from(classMastery).where(eq(classMastery.userId, ctx.user.id));
      const civilSkills = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, ctx.user.id));
      const prestRows = await db.select().from(prestigeProgress).where(eq(prestigeProgress.userId, ctx.user.id));

      const skillMap: Record<string, number> = {};
      for (const s of civilSkills) skillMap[s.skillKey] = s.level;
      const classMap: Record<string, number> = {};
      for (const c of classRows) classMap[c.characterClass] = c.masteryRank;

      const bonuses = resolveRaidBonuses({
        characterClass: char?.characterClass,
        species: char?.species,
        classRank: classMap[char?.characterClass || ""] || 0,
        civilSkills: skillMap,
        prestigeClass: prestRows[0]?.prestigeClassKey,
        bossElement: RAID_BOSSES.find(b => b.key === raid.bossKey)?.element,
      });
      // Base damage is 100-300 scaled by bonuses
      const baseDmg = 100 + Math.floor(Math.random() * 200);
      const damage = { totalDamage: Math.floor(baseDmg * bonuses.damageMultiplier), sources: bonuses.sources };

      const newHp = Math.max(0, raid.currentHp - damage.totalDamage);

      // Update raid HP
      await db.update(coopRaids)
        .set({
          currentHp: newHp,
          ...(newHp === 0 ? { status: "completed", completedAt: new Date() } : {}),
        })
        .where(eq(coopRaids.id, input.raidId));

      // Upsert contribution
      const [existing] = await db.select().from(raidContributions)
        .where(and(eq(raidContributions.raidId, input.raidId), eq(raidContributions.userId, ctx.user.id)));

      if (existing) {
        await db.update(raidContributions)
          .set({
            damageDealt: existing.damageDealt + damage.totalDamage,
            contributionScore: existing.contributionScore + damage.totalDamage,
            role: input.role,
          })
          .where(eq(raidContributions.id, existing.id));
      } else {
        await db.insert(raidContributions).values({
          raidId: input.raidId,
          userId: ctx.user.id,
          damageDealt: damage.totalDamage,
          contributionScore: damage.totalDamage,
          role: input.role,
        });
      }

      return {
        damage: damage.totalDamage,
        sources: damage.sources,
        bossHpRemaining: newHp,
        bossDefeated: newHp === 0,
      };
    }),

  /** Claim loot after raid completion */
  claimLoot: protectedProcedure
    .input(z.object({ raidId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [raid] = await db.select().from(coopRaids).where(eq(coopRaids.id, input.raidId));
      if (!raid || raid.status !== "completed") throw new Error("Raid not completed");

      const [contribution] = await db.select().from(raidContributions)
        .where(and(eq(raidContributions.raidId, input.raidId), eq(raidContributions.userId, ctx.user.id)));
      if (!contribution) throw new Error("No contribution found");
      if (contribution.lootClaimed) throw new Error("Loot already claimed");

      await db.update(raidContributions)
        .set({ lootClaimed: true })
        .where(eq(raidContributions.id, contribution.id));

      // Calculate loot based on contribution percentage
      const allContributions = await db.select().from(raidContributions)
        .where(eq(raidContributions.raidId, input.raidId));
      const totalScore = allContributions.reduce((sum, c) => sum + c.contributionScore, 0);
      const sharePercent = totalScore > 0 ? contribution.contributionScore / totalScore : 0;

      const boss = RAID_BOSSES.find(b => b.key === raid.bossKey);
      const baseXp = 500;
      const baseCurrency = 200;

      return {
        xpEarned: Math.floor(baseXp * sharePercent * 3),
        currencyEarned: Math.floor(baseCurrency * sharePercent * 3),
        sharePercent: Math.round(sharePercent * 100),
        contributionRank: allContributions.filter(c => c.contributionScore > contribution.contributionScore).length + 1,
      };
    }),

  /** Get available bosses */
  getAvailableBosses: publicProcedure.query(async () => {
    return RAID_BOSSES;
  }),
});
