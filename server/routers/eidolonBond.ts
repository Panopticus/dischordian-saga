/* ═══════════════════════════════════════════════════════
   EIDOLON BOND ROUTER — Soul Bond, Memorial & Community
   Tracks Eidolon companion bonds, memorial wall, and
   community-wide statistics.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eidolonBonds, eidolonMemorial, dreamBalance } from "../../drizzle/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { petEvolution } from "../services/petEvolution";
import { companionDeath } from "../services/companionDeath";
import { pressureService } from "../services/pressureService";

export const eidolonBondRouter = router({
  /* ─── GET MY BOND (protected) ─── */
  getMyBond: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const rows = await db
      .select()
      .from(eidolonBonds)
      .where(
        and(
          eq(eidolonBonds.userId, ctx.user.id),
          eq(eidolonBonds.isSoulBound, true),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }),

  /* ─── INTERACT (protected) — daily interaction ─── */
  interact: protectedProcedure
    .input(
      z.object({
        action: z.enum(["feed", "talk", "train", "gift", "meditate"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      // Find the user's soul-bound Eidolon
      const rows = await db
        .select()
        .from(eidolonBonds)
        .where(
          and(
            eq(eidolonBonds.userId, ctx.user.id),
            eq(eidolonBonds.isSoulBound, true),
          ),
        )
        .limit(1);

      const bond = rows[0];
      if (!bond) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No soul-bound Eidolon found",
        });
      }

      if (bond.health === "dead") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your Eidolon has perished. Visit the memorial.",
        });
      }

      // Each action grants different bond/xp
      const rewards: Record<string, { bond: number; xp: number }> = {
        feed: { bond: 2, xp: 10 },
        talk: { bond: 3, xp: 5 },
        train: { bond: 1, xp: 20 },
        gift: { bond: 5, xp: 8 },
        meditate: { bond: 4, xp: 15 },
      };

      const reward = rewards[input.action];

      await db
        .update(eidolonBonds)
        .set({
          bond: sql`${eidolonBonds.bond} + ${reward.bond}`,
          xp: sql`${eidolonBonds.xp} + ${reward.xp}`,
          lastInteraction: new Date(),
          lastFed: input.action === "feed" ? new Date() : bond.lastFed,
        })
        .where(eq(eidolonBonds.id, bond.id));

      // Evolution XP: bond actions grant evolution XP at 50% rate
      const evoXp = Math.floor(reward.bond * 0.5) + (input.action === "train" ? 5 : input.action === "feed" ? 5 : 2);
      const evoResult = await petEvolution.addEidolonEvolutionXp(ctx.user.id, evoXp, `eidolon_${input.action}`);

      // Pressure: trust gains feed the Dreamer
      pressureService.increment(ctx.user.id, "trustGains", reward.bond, `eidolon_${input.action}`).catch(() => {});

      return {
        success: true,
        action: input.action,
        bondGained: reward.bond,
        xpGained: reward.xp,
        evolutionXpGained: evoXp,
        evolved: evoResult.evolved,
        newStage: evoResult.newStage,
      };
    }),

  /* ─── FEED SOUL STONE (protected) — Hierarchy/Dreamer evolution ─── */
  feedSoulStone: protectedProcedure
    .input(
      z.object({
        stoneState: z.enum(["violet", "red", "gold"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const rows = await db
        .select()
        .from(eidolonBonds)
        .where(
          and(
            eq(eidolonBonds.userId, ctx.user.id),
            eq(eidolonBonds.isSoulBound, true),
          ),
        )
        .limit(1);

      const bond = rows[0];
      if (!bond)
        throw new TRPCError({ code: "NOT_FOUND", message: "No soul-bound Eidolon found" });

      if (bond.health === "dead")
        throw new TRPCError({ code: "BAD_REQUEST", message: "Your Eidolon has perished." });

      if (input.stoneState === "red") {
        const newRedCount = bond.redStonesAbsorbed + 1;
        const shouldEvolve = newRedCount >= 10 && bond.transformState === "normal";

        await db
          .update(eidolonBonds)
          .set({
            redStonesAbsorbed: newRedCount,
            xp: sql`${eidolonBonds.xp} + 20`,
            ...(shouldEvolve
              ? { transformState: "hierarchy_evolved" as const, rarity: "legendary" as const }
              : {}),
          })
          .where(eq(eidolonBonds.id, bond.id));

        if (shouldEvolve) {
          return {
            success: true,
            evolved: true,
            transformState: "hierarchy_evolved" as const,
            newRarity: "legendary" as const,
            redStonesAbsorbed: newRedCount,
            narrative: `The stone dissolves into crimson fire. Your Eidolon screams — not in pain, but in recognition. The Hierarchy's mark blazes across its form. When the light fades, it is changed. Larger. Darker. Its eyes burn with foxfire green. The Necromancer watches from the shadows: "Ten souls consumed. The Hierarchy has noticed your pet. They've promoted it. Whether that's a gift or a collar depends on your perspective."`,
          };
        }

        return {
          success: true,
          evolved: false,
          transformState: bond.transformState,
          redStonesAbsorbed: newRedCount,
          narrative: newRedCount <= 3
            ? "The red stone sinks into your Eidolon like a drop of blood into water. It shivers. Its eyes flash crimson for a moment. The corruption spreads — slowly, beautifully, like ink in milk."
            : newRedCount <= 6
              ? "Another soul consumed. Your Eidolon absorbs the corruption with something that looks disturbingly like hunger. The Hierarchy's mark is growing visible on its form — a faint corporate sigil, burning beneath the skin."
              : "The stone barely touches your Eidolon before it's absorbed. The hunger is ravenous now. Dark veins trace across its body like circuitry. The Necromancer says nothing, but his glasses glow brighter.",
        };
      }

      if (input.stoneState === "gold") {
        const newGoldCount = bond.goldFragmentsAbsorbed + 1;
        const shouldAscend = newGoldCount >= 10 && bond.transformState === "normal";

        await db
          .update(eidolonBonds)
          .set({
            goldFragmentsAbsorbed: newGoldCount,
            xp: sql`${eidolonBonds.xp} + 15`,
            ...(shouldAscend
              ? { transformState: "dreamer_evolved" as const, rarity: "mythic" as const }
              : {}),
          })
          .where(eq(eidolonBonds.id, bond.id));

        if (shouldAscend) {
          return {
            success: true,
            evolved: true,
            transformState: "dreamer_evolved" as const,
            newRarity: "mythic" as const,
            goldFragmentsAbsorbed: newGoldCount,
            narrative: `The golden fragment dissolves into pure light. Your Eidolon rises — not flying, ascending. The Dreamer's resonance fills the room like a chord struck on a cosmic instrument. When the light fades, your companion is transformed. Not larger — luminous. Not darker — radiant. Its form shimmers with golden fractals, and for a moment, you hear a melody. The Antiquarian writes: "The Dreamer's light has found a new vessel. Not a tool. Not a weapon. A song."`,
          };
        }

        return {
          success: true,
          evolved: false,
          transformState: bond.transformState,
          goldFragmentsAbsorbed: newGoldCount,
          narrative: newGoldCount <= 3
            ? "The golden fragment dissolves gently into your Eidolon. A soft warmth spreads through its form. For a moment, it glows — not with power, but with something quieter. Something patient."
            : newGoldCount <= 6
              ? "Another fragment of purified light joins the others. Your Eidolon's form softens at the edges — not weaker, more refined. Like a rough stone becoming a lens. The Dreamer's frequency hums in its core."
              : "The light enters without resistance. Your Eidolon has become a vessel for something it was always meant to carry. Golden motes orbit its form like tiny stars. The Antiquarian watches with visible hope.",
        };
      }

      // Violet — neutral, minor bond boost
      await db
        .update(eidolonBonds)
        .set({
          bond: sql`LEAST(${eidolonBonds.bond} + 1, 100)`,
          xp: sql`${eidolonBonds.xp} + 5`,
        })
        .where(eq(eidolonBonds.id, bond.id));

      return {
        success: true,
        evolved: false,
        transformState: bond.transformState,
        narrative: "The violet stone dissolves into your Eidolon. It absorbs something — but what? The stone's potential was uncommitted. Neither corrupt nor pure. A question without an answer. Your bond deepens by a fraction.",
      };
    }),

  /* ─── GET MEMORIAL (public) — paginated memorial wall ─── */
  getMemorial: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { entries: [], total: 0 };

      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      const entries = await db
        .select()
        .from(eidolonMemorial)
        .orderBy(desc(eidolonMemorial.daysActive))
        .limit(limit)
        .offset(offset);

      const countRows = await db
        .select({ count: sql<number>`count(*)` })
        .from(eidolonMemorial);

      return {
        entries,
        total: countRows[0]?.count ?? 0,
      };
    }),

  /* ─── ADD FLOWER (protected) — costs 1 Dream ─── */
  addFlower: protectedProcedure
    .input(z.object({ memorialId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      // Check memorial exists
      const memRows = await db
        .select()
        .from(eidolonMemorial)
        .where(eq(eidolonMemorial.id, input.memorialId))
        .limit(1);

      if (!memRows[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Memorial entry not found",
        });
      }

      // Check user has at least 1 Dream
      const balanceRows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);

      const balance = balanceRows[0];
      if (!balance || balance.dreamTokens < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need at least 1 Dream to leave a flower",
        });
      }

      // Deduct 1 Dream and add flower
      await db
        .update(dreamBalance)
        .set({
          dreamTokens: sql`${dreamBalance.dreamTokens} - 1`,
        })
        .where(eq(dreamBalance.userId, ctx.user.id));

      await db
        .update(eidolonMemorial)
        .set({
          flowers: sql`${eidolonMemorial.flowers} + 1`,
        })
        .where(eq(eidolonMemorial.id, input.memorialId));

      return { success: true };
    }),

  /* ─── GET COMMUNITY STATS (public) ─── */
  getCommunityStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db)
      return {
        totalBonds: 0,
        totalDeaths: 0,
        longestActiveDays: 0,
        mostFlowers: 0,
      };

    const bondStats = await db
      .select({
        totalBonds: sql<number>`count(*)`,
        totalDeaths: sql<number>`sum(${eidolonBonds.deathCount})`,
      })
      .from(eidolonBonds);

    const longestRows = await db
      .select({ daysActive: eidolonMemorial.daysActive })
      .from(eidolonMemorial)
      .orderBy(desc(eidolonMemorial.daysActive))
      .limit(1);

    const flowerRows = await db
      .select({ flowers: eidolonMemorial.flowers })
      .from(eidolonMemorial)
      .orderBy(desc(eidolonMemorial.flowers))
      .limit(1);

    return {
      totalBonds: bondStats[0]?.totalBonds ?? 0,
      totalDeaths: bondStats[0]?.totalDeaths ?? 0,
      longestActiveDays: longestRows[0]?.daysActive ?? 0,
      mostFlowers: flowerRows[0]?.flowers ?? 0,
    };
  }),

  /* ─── GET BOND TITLES (protected) — titles earned by bond duration ─── */
  getBondTitles: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { titles: [], currentTitle: null };

    const rows = await db
      .select()
      .from(eidolonBonds)
      .where(
        and(
          eq(eidolonBonds.userId, ctx.user.id),
          eq(eidolonBonds.isSoulBound, true),
        ),
      )
      .limit(1);

    const bond = rows[0];
    if (!bond) return { titles: [], currentTitle: null };

    // Calculate days since binding
    const daysBound = Math.floor(
      (Date.now() - new Date(bond.boundAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    const titleThresholds = [
      { days: 1, title: "Bonded" },
      { days: 7, title: "Kindred Spirit" },
      { days: 30, title: "Soul Keeper" },
      { days: 90, title: "Eternal Guardian" },
      { days: 180, title: "Mythic Resonance" },
      { days: 365, title: "Transcendent Bond" },
    ];

    const earned = titleThresholds.filter((t) => daysBound >= t.days);
    const currentTitle = earned.length > 0 ? earned[earned.length - 1].title : null;

    return {
      titles: earned.map((t) => t.title),
      currentTitle,
      daysBound,
    };
  }),

  /** Bind a specimen as the player's soul-bound eidolon (first-time setup) */
  bindSpecimen: protectedProcedure
    .input(z.object({
      eidolonId: z.string().min(1).max(64),
      nickname: z.string().max(64).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Check if player already has a soul-bound eidolon
      const [existing] = await db.select().from(eidolonBonds)
        .where(and(eq(eidolonBonds.userId, ctx.user.id), eq(eidolonBonds.isSoulBound, true)))
        .limit(1);

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "You already have a soul-bound eidolon" });
      }

      await db.insert(eidolonBonds).values({
        userId: ctx.user.id,
        eidolonId: input.eidolonId,
        bond: 10,
        level: 1,
        xp: 0,
        stage: "fragment",
        rarity: "common",
        health: "healthy",
        injury: 0,
        deathCount: 0,
        isResonant: false,
        isSoulBound: true,
        nickname: input.nickname || null,
        memories: [],
        unlockedSkills: [],
        skillPoints: 0,
        missionsShared: 0,
        questsCompleted: [],
        moralityDissonance: 0,
        redStonesAbsorbed: 0,
        goldFragmentsAbsorbed: 0,
        transformState: "normal",
      });

      return { success: true, eidolonId: input.eidolonId };
    }),

  /** Get all eidolons for a player (not just soul-bound) */
  getMyCollection: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(eidolonBonds)
      .where(eq(eidolonBonds.userId, ctx.user.id));
  }),

  /** Get evolution progress for soul-bound eidolon */
  getEvolutionProgress: protectedProcedure.query(async ({ ctx }) => {
    return petEvolution.getEidolonProgress(ctx.user.id);
  }),

  /** Kill companion — marks dead, creates spectral form, feeds Necromancer */
  kill: protectedProcedure
    .input(z.object({
      cause: z.enum(["combat", "severing", "sacrifice", "death_hook", "strain_symbiosis"]),
      context: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return companionDeath.killCompanion(ctx.user.id, input.cause, input.context);
    }),

  /** Resurrect companion — requires Necromancer Holocron or quest */
  resurrect: protectedProcedure
    .input(z.object({
      method: z.enum(["holocron", "quest", "admin"]),
    }))
    .mutation(async ({ ctx, input }) => {
      return companionDeath.resurrect(ctx.user.id, input.method);
    }),

  /** Check if companion is spectral */
  isSpectral: protectedProcedure.query(async ({ ctx }) => {
    return { spectral: await companionDeath.isSpectral(ctx.user.id) };
  }),

  /** Get spectral bonus for a game system */
  getSpectralBonus: protectedProcedure
    .input(z.object({ gameSystem: z.string() }))
    .query(async ({ ctx, input }) => {
      const bonus = await companionDeath.getSpectralBonus(ctx.user.id, input.gameSystem);
      return { system: input.gameSystem, bonusPercent: bonus };
    }),
});
