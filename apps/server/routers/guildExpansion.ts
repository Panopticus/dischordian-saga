/* ═══════════════════════════════════════════════════════
   GUILD EXPANSION ROUTER — Perks, Quests, Banners, Stash
   Tier 4 surface. Builds on existing guild* tables.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  guilds,
  guildMembers,
  guildPerks as guildPerksTable,
  guildUnlockedPerks,
  guildQuestProgress,
  guildCosmetics,
  guildStash,
  guildStashLog,
  userTitles,
} from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  GUILD_PERKS,
  getGuildPerk,
  getQualifyingPerks,
} from "@shared/guildPerks/perkDefinitions";
import {
  GUILD_QUESTS,
  getGuildQuest,
  questTarget,
} from "@shared/guildQuests/questDefinitions";
import {
  GUILD_BANNERS,
  getGuildBanner,
  STARTER_BANNER_KEY,
  validateMotto,
} from "@shared/guildCosmetics/bannerCatalog";
import { logger } from "../logger";

/** Lookup helper: find the user's guild + their role. */
async function getUserGuildContext(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const memberRows = await db
    .select()
    .from(guildMembers)
    .where(eq(guildMembers.userId, userId))
    .limit(1);
  if (!memberRows[0]) return null;
  const guildRows = await db
    .select()
    .from(guilds)
    .where(eq(guilds.id, memberRows[0].guildId))
    .limit(1);
  if (!guildRows[0]) return null;
  return {
    guild: guildRows[0],
    member: memberRows[0],
    role: memberRows[0].role,
  };
}

export const guildExpansionRouter = router({
  /* ─── PERKS ─────────────────────────────────────────── */
  getPerkCatalog: publicProcedure.query(() =>
    GUILD_PERKS.map((p) => ({
      perkKey: p.perkKey,
      name: p.name,
      description: p.description,
      bonusType: p.bonusType,
      magnitude: p.magnitude,
      requiredHallTier: p.requiredHallTier,
      requiredXp: p.requiredXp,
      factionAlignment: p.factionAlignment,
      iconKey: p.iconKey,
      flavorText: p.flavorText,
    })),
  ),

  getMyGuildPerks: protectedProcedure.query(async ({ ctx }) => {
    const ctxg = await getUserGuildContext(ctx.user.id);
    if (!ctxg) return { unlocked: [], qualifying: [], guild: null };
    const db = await getDb();
    if (!db) return { unlocked: [], qualifying: [], guild: null };
    const unlockedRows = await db
      .select()
      .from(guildUnlockedPerks)
      .where(eq(guildUnlockedPerks.guildId, ctxg.guild.id));
    const unlockedKeys = unlockedRows.map((r) => r.perkKey);
    const qualifying = getQualifyingPerks(
      ctxg.guild.level ?? 1,
      ctxg.guild.xp ?? 0,
      ctxg.guild.faction as "empire" | "insurgency" | "neutral" | undefined,
    );
    return {
      unlocked: unlockedKeys,
      qualifying: qualifying.map((p) => p.perkKey),
      guild: { id: ctxg.guild.id, name: ctxg.guild.name, level: ctxg.guild.level, xp: ctxg.guild.xp },
    };
  }),

  unlockGuildPerk: protectedProcedure
    .input(z.object({ perkKey: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const ctxg = await getUserGuildContext(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      if (ctxg.role !== "leader" && ctxg.role !== "officer") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Officers + leaders only" });
      }
      const perk = getGuildPerk(input.perkKey);
      if (!perk) throw new TRPCError({ code: "NOT_FOUND", message: "Unknown perk" });
      if ((ctxg.guild.level ?? 1) < perk.requiredHallTier) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Hall tier too low" });
      }
      if ((ctxg.guild.xp ?? 0) < perk.requiredXp) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Guild XP too low" });
      }
      if (perk.factionAlignment && ctxg.guild.faction !== perk.factionAlignment) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Faction alignment mismatch" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .insert(guildUnlockedPerks)
        .values({ guildId: ctxg.guild.id, perkKey: input.perkKey })
        .onDuplicateKeyUpdate({ set: { unlockedAt: sql`unlocked_at` } });
      logger.info("guild_perk_unlocked", "guildExpansion", {
        guildId: ctxg.guild.id,
        perkKey: input.perkKey,
        unlockedBy: ctx.user.id,
      });
      return { ok: true };
    }),

  /* ─── QUESTS ─────────────────────────────────────────── */
  getQuestCatalog: publicProcedure.query(() =>
    GUILD_QUESTS.map((q) => ({
      questKey: q.questKey,
      scope: q.scope,
      name: q.name,
      description: q.description,
      target: questTarget(q.condition),
      rewards: q.rewards,
      iconKey: q.iconKey,
    })),
  ),

  getMyGuildQuests: protectedProcedure.query(async ({ ctx }) => {
    const ctxg = await getUserGuildContext(ctx.user.id);
    if (!ctxg) return [];
    const db = await getDb();
    if (!db) return [];
    const progressRows = await db
      .select()
      .from(guildQuestProgress)
      .where(eq(guildQuestProgress.guildId, ctxg.guild.id));
    const progressByKey = new Map(progressRows.map((p) => [p.questKey, p]));
    return GUILD_QUESTS.map((q) => {
      const p = progressByKey.get(q.questKey);
      return {
        questKey: q.questKey,
        scope: q.scope,
        name: q.name,
        description: q.description,
        progress: p?.progress ?? 0,
        target: questTarget(q.condition),
        completedAt: p?.completedAt ?? null,
        rewardClaimed: (p?.rewardClaimed ?? 0) === 1,
        rewards: q.rewards,
        iconKey: q.iconKey,
      };
    });
  }),

  claimQuestReward: protectedProcedure
    .input(z.object({ questKey: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const ctxg = await getUserGuildContext(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      if (ctxg.role !== "leader" && ctxg.role !== "officer") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Officers + leaders only" });
      }
      const def = getGuildQuest(input.questKey);
      if (!def) throw new TRPCError({ code: "NOT_FOUND" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(guildQuestProgress)
        .where(
          and(
            eq(guildQuestProgress.guildId, ctxg.guild.id),
            eq(guildQuestProgress.questKey, input.questKey),
          ),
        )
        .limit(1);
      if (!rows[0]) throw new TRPCError({ code: "BAD_REQUEST", message: "Quest not active" });
      if (!rows[0].completedAt) throw new TRPCError({ code: "BAD_REQUEST", message: "Quest not complete" });
      if (rows[0].rewardClaimed === 1) throw new TRPCError({ code: "BAD_REQUEST", message: "Already claimed" });
      await db
        .update(guildQuestProgress)
        .set({ rewardClaimed: 1 })
        .where(eq(guildQuestProgress.id, rows[0].id));

      // Apply rewards inline.
      if (def.rewards.guildXp || def.rewards.treasuryDream || def.rewards.treasuryCredits) {
        await db
          .update(guilds)
          .set({
            xp: sql`xp + ${def.rewards.guildXp ?? 0}`,
            treasuryDream: sql`treasury_dream + ${def.rewards.treasuryDream ?? 0}`,
            treasuryCredits: sql`treasury_credits + ${def.rewards.treasuryCredits ?? 0}`,
          })
          .where(eq(guilds.id, ctxg.guild.id));
      }
      if (def.rewards.bannerKey) {
        await unlockBannerForGuild(ctxg.guild.id, def.rewards.bannerKey);
      }
      // Tier 4: if quest has an explicit titleKey reward, grant it
      // directly to every contributing guild member. (Some quests
      // pre-grant a tier-1 title that the player wouldn't otherwise
      // qualify for via standard event progression.)
      if (def.rewards.titleKey) {
        const memberRows = await db
          .select({ userId: guildMembers.userId })
          .from(guildMembers)
          .where(eq(guildMembers.guildId, ctxg.guild.id));
        for (const m of memberRows) {
          await db
            .insert(userTitles)
            .values({ userId: m.userId, titleKey: def.rewards.titleKey })
            .onDuplicateKeyUpdate({ set: { earnedAt: sql`earned_at` } })
            .catch(() => { /* idempotent */ });
        }
      }
      return { ok: true, rewards: def.rewards };
    }),

  /* ─── COSMETICS (banner / motto / emblem) ───────────── */
  getMyGuildCosmetics: protectedProcedure.query(async ({ ctx }) => {
    const ctxg = await getUserGuildContext(ctx.user.id);
    if (!ctxg) return null;
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(guildCosmetics)
      .where(eq(guildCosmetics.guildId, ctxg.guild.id))
      .limit(1);
    if (!rows[0]) {
      // Initialise on first read.
      await db.insert(guildCosmetics).values({
        guildId: ctxg.guild.id,
        bannerKey: STARTER_BANNER_KEY,
        unlockedBanners: [STARTER_BANNER_KEY],
      });
      return {
        bannerKey: STARTER_BANNER_KEY,
        mottoText: null,
        emblemKey: null,
        unlockedBanners: [STARTER_BANNER_KEY],
      };
    }
    return {
      bannerKey: rows[0].bannerKey ?? STARTER_BANNER_KEY,
      mottoText: rows[0].mottoText,
      emblemKey: rows[0].emblemKey,
      unlockedBanners: rows[0].unlockedBanners ?? [STARTER_BANNER_KEY],
    };
  }),

  setBanner: protectedProcedure
    .input(z.object({ bannerKey: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const ctxg = await getUserGuildContext(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      if (ctxg.role !== "leader" && ctxg.role !== "officer") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Officers + leaders only" });
      }
      if (!getGuildBanner(input.bannerKey)) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Unknown banner" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(guildCosmetics)
        .where(eq(guildCosmetics.guildId, ctxg.guild.id))
        .limit(1);
      const unlocked = rows[0]?.unlockedBanners ?? [STARTER_BANNER_KEY];
      if (!unlocked.includes(input.bannerKey)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Banner not unlocked" });
      }
      await db
        .insert(guildCosmetics)
        .values({
          guildId: ctxg.guild.id,
          bannerKey: input.bannerKey,
          unlockedBanners: unlocked,
        })
        .onDuplicateKeyUpdate({ set: { bannerKey: input.bannerKey } });
      return { ok: true };
    }),

  setMotto: protectedProcedure
    .input(z.object({ motto: z.string().max(80) }))
    .mutation(async ({ ctx, input }) => {
      const ctxg = await getUserGuildContext(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      if (ctxg.role !== "leader") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Leaders only" });
      }
      const validation = validateMotto(input.motto);
      if (!validation.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Invalid motto: ${validation.reason}` });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .insert(guildCosmetics)
        .values({
          guildId: ctxg.guild.id,
          mottoText: input.motto,
          bannerKey: STARTER_BANNER_KEY,
          unlockedBanners: [STARTER_BANNER_KEY],
        })
        .onDuplicateKeyUpdate({ set: { mottoText: input.motto } });
      return { ok: true };
    }),

  /* ─── STASH ──────────────────────────────────────────── */
  listStash: protectedProcedure.query(async ({ ctx }) => {
    const ctxg = await getUserGuildContext(ctx.user.id);
    if (!ctxg) return [];
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(guildStash)
      .where(eq(guildStash.guildId, ctxg.guild.id));
  }),

  depositToStash: protectedProcedure
    .input(z.object({
      itemType: z.string().min(1).max(32),
      itemKey: z.string().min(1).max(96),
      quantity: z.number().int().min(1).max(99999),
    }))
    .mutation(async ({ ctx, input }) => {
      const ctxg = await getUserGuildContext(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Slot key is itemType:itemKey so identical items stack.
      const slotKey = `${input.itemType}:${input.itemKey}`;
      await db
        .insert(guildStash)
        .values({
          guildId: ctxg.guild.id,
          slotKey,
          itemType: input.itemType,
          itemKey: input.itemKey,
          quantity: input.quantity,
          depositorUserId: ctx.user.id,
        })
        .onDuplicateKeyUpdate({
          set: { quantity: sql`quantity + ${input.quantity}` },
        });
      await db.insert(guildStashLog).values({
        guildId: ctxg.guild.id,
        userId: ctx.user.id,
        action: "deposit",
        itemType: input.itemType,
        itemKey: input.itemKey,
        quantity: input.quantity,
      });
      return { ok: true };
    }),

  withdrawFromStash: protectedProcedure
    .input(z.object({
      slotKey: z.string().min(1).max(64),
      quantity: z.number().int().min(1).max(99999),
    }))
    .mutation(async ({ ctx, input }) => {
      const ctxg = await getUserGuildContext(ctx.user.id);
      if (!ctxg) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const rows = await db
        .select()
        .from(guildStash)
        .where(
          and(
            eq(guildStash.guildId, ctxg.guild.id),
            eq(guildStash.slotKey, input.slotKey),
          ),
        )
        .limit(1);
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Slot empty" });
      if (rows[0].quantity < input.quantity) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient quantity" });
      }
      const remaining = rows[0].quantity - input.quantity;
      if (remaining === 0) {
        await db.delete(guildStash).where(eq(guildStash.id, rows[0].id));
      } else {
        await db
          .update(guildStash)
          .set({ quantity: remaining })
          .where(eq(guildStash.id, rows[0].id));
      }
      await db.insert(guildStashLog).values({
        guildId: ctxg.guild.id,
        userId: ctx.user.id,
        action: "withdraw",
        itemType: rows[0].itemType,
        itemKey: rows[0].itemKey,
        quantity: input.quantity,
      });
      return { ok: true };
    }),

  getStashLog: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(200).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const ctxg = await getUserGuildContext(ctx.user.id);
      if (!ctxg) return [];
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(guildStashLog)
        .where(eq(guildStashLog.guildId, ctxg.guild.id))
        .orderBy(desc(guildStashLog.at))
        .limit(input?.limit ?? 50);
    }),

  /* ─── BANNERS catalog ──────────────────────────────── */
  getBannerCatalog: publicProcedure.query(() =>
    GUILD_BANNERS.map((b) => ({
      bannerKey: b.bannerKey,
      name: b.name,
      description: b.description,
      source: b.source,
      factionAlignment: b.factionAlignment,
      iconKey: b.iconKey,
      accentColor: b.accentColor,
    })),
  ),
});

/** Internal: unlock a banner for a guild (idempotent). Used by quest
 *  reward flow + guild-war resolution + conspiracy first-solve. */
async function unlockBannerForGuild(guildId: number, bannerKey: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const rows = await db
    .select()
    .from(guildCosmetics)
    .where(eq(guildCosmetics.guildId, guildId))
    .limit(1);
  if (!rows[0]) {
    await db.insert(guildCosmetics).values({
      guildId,
      bannerKey: STARTER_BANNER_KEY,
      unlockedBanners: [STARTER_BANNER_KEY, bannerKey],
    });
    return;
  }
  const current = rows[0].unlockedBanners ?? [STARTER_BANNER_KEY];
  if (current.includes(bannerKey)) return;
  await db
    .update(guildCosmetics)
    .set({ unlockedBanners: [...current, bannerKey] })
    .where(eq(guildCosmetics.id, rows[0].id));
}

export { unlockBannerForGuild };
