import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { generateDoomStories, refreshDoomStories } from "./doomScroll";
import { z } from "zod";
import { getDb } from "./db";
import { userAchievements, userProgress, arkThemes } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { cardGameRouter } from "./routers/cardGame";
import { arkRouter } from "./routers/ark";
import { trophyRouter } from "./routers/trophy";
import { tradeWarsRouter } from "./routers/tradeWars";
import { citizenRouter } from "./routers/citizen";
import { craftingRouter } from "./routers/crafting";
import { storeRouter } from "./routers/store";
import { elaraRouter } from "./routers/elara";
import { lyricsRouter } from "./routers/lyrics";
import { gameStateRouter } from "./routers/gameState";
import { cardChallengeRouter } from "./routers/cardChallenge";
import { adminRouter } from "./routers/admin";
import { contentRewardRouter } from "./routers/contentReward";
import { fightLeaderboardRouter } from "./routers/fightLeaderboard";
import { nftRouter } from "./routers/nft";
import { pvpRouter } from "./routers/pvp";
import { draftRouter } from "./routers/draft";
import { tradingRouter } from "./routers/trading";
import { cardAchievementsRouter } from "./routers/cardAchievements";
import { discoveryRouter } from "./routers/discovery";
import { contentAdminRouter } from "./routers/contentAdmin";
import { warMapRouter } from "./routers/warMap";
import { contentApiRouter } from "./routers/contentApi";
import { moralityLeaderboardRouter } from "./routers/moralityLeaderboard";
import { companionRouter } from "./routers/companion";
import { marketplaceRouter } from "./routers/marketplace";
import { dailyQuestsRouter } from "./routers/dailyQuests";
import { marketAchievementsRouter } from "./routers/marketAchievements";
import { notificationRouter } from "./routers/notificationRouter";
import { guildRouter } from "./routers/guild";
import { battlePassRouter } from "./routers/battlePass";
import { inventoryRouter } from "./routers/inventory";
import { guildWarsRouter } from "./routers/guildWars";
import { chessRouter } from "./routers/chess";
import { terminusSwarmRouter } from "./routers/terminusSwarm";
import { questProgressRouter } from "./routers/questProgress";
import { classMasteryRouter } from "./routers/classMastery";
import { rpgSystemsRouter } from "./routers/rpgSystems";
import { syndicateWorldRouter } from "./routers/syndicateWorld";
import { spaceStationRouter } from "./routers/spaceStation";
import { towerDefenseRouter } from "./routers/towerDefense";
import { prestigeQuestRouter } from "./routers/prestigeQuests";
import { seasonalEventsRouter } from "./routers/seasonalEvents";
import { replaySystemRouter } from "./routers/replaySystem";
import { personalQuartersRouter } from "./routers/personalQuarters";
import { friendlyChallengesRouter } from "./routers/friendlyChallenges";
import { coopRaidsRouter } from "./routers/coopRaids";
import { bossMasteryRouter } from "./routers/bossMastery";
import { cosmeticShopRouter } from "./routers/cosmeticShop";
import { donationSystemRouter } from "./routers/donationSystem";
import { socialFeaturesRouter } from "./routers/socialFeatures";
import { loreJournalRouter } from "./routers/loreJournal";

export const appRouter = router({
  system: systemRouter,
  cardGame: cardGameRouter,
  ark: arkRouter,
  trophy: trophyRouter,
  tradeWars: tradeWarsRouter,
  citizen: citizenRouter,
  crafting: craftingRouter,
  store: storeRouter,
  elara: elaraRouter,
  lyrics: lyricsRouter,
  gameState: gameStateRouter,
  cardChallenge: cardChallengeRouter,
  admin: adminRouter,
  contentReward: contentRewardRouter,
  fightLeaderboard: fightLeaderboardRouter,
  nft: nftRouter,
  pvp: pvpRouter,
  draft: draftRouter,
  trading: tradingRouter,
  cardAchievements: cardAchievementsRouter,
  discovery: discoveryRouter,
  contentAdmin: contentAdminRouter,
  warMap: warMapRouter,
  contentApi: contentApiRouter,
  moralityLeaderboard: moralityLeaderboardRouter,
  companion: companionRouter,
  marketplace: marketplaceRouter,
  quests: dailyQuestsRouter,
  marketAchievements: marketAchievementsRouter,
  notifications: notificationRouter,
  guild: guildRouter,
  battlePass: battlePassRouter,
  inventory: inventoryRouter,
  guildWars: guildWarsRouter,
  chess: chessRouter,
  terminusSwarm: terminusSwarmRouter,
  questProgress: questProgressRouter,
  classMastery: classMasteryRouter,
  rpg: rpgSystemsRouter,
  syndicateWorld: syndicateWorldRouter,
  spaceStation: spaceStationRouter,
  towerDefense: towerDefenseRouter,
  prestigeQuest: prestigeQuestRouter,
  seasonalEvents: seasonalEventsRouter,
  replay: replaySystemRouter,
  personalQuarters: personalQuartersRouter,
  friendlyChallenge: friendlyChallengesRouter,
  coopRaid: coopRaidsRouter,
  bossMastery: bossMasteryRouter,
  cosmeticShop: cosmeticShopRouter,
  donation: donationSystemRouter,
  social: socialFeaturesRouter,
  loreJournal: loreJournalRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Doom Scroll news feed
  doomScroll: router({
    getStories: publicProcedure
      .input(z.object({ count: z.number().min(1).max(30).optional() }).optional())
      .query(async ({ input }) => {
        const count = input?.count ?? 12;
        return generateDoomStories(count);
      }),
    refresh: publicProcedure
      .input(z.object({ count: z.number().min(1).max(30).optional() }).optional())
      .mutation(async ({ input }) => {
        const count = input?.count ?? 12;
        return refreshDoomStories(count);
      }),
  }),

  // Gamification - save/load progress
  gamification: router({
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .limit(1);
      return rows[0] || null;
    }),

    saveProgress: protectedProcedure
      .input(
        z.object({
          xp: z.number(),
          level: z.number(),
          points: z.number(),
          title: z.string().optional(),
          progressData: z.record(z.string(), z.unknown()).optional(),
          gameData: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        const existing = await db
          .select()
          .from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(userProgress)
            .set({
              xp: input.xp,
              level: input.level,
              points: input.points,
              title: input.title,
              progressData: input.progressData as Record<string, unknown>,
              gameData: input.gameData as Record<string, unknown>,
            })
            .where(eq(userProgress.userId, ctx.user.id));
        } else {
          await db.insert(userProgress).values({
            userId: ctx.user.id,
            xp: input.xp,
            level: input.level,
            points: input.points,
            title: input.title,
            progressData: input.progressData as Record<string, unknown>,
            gameData: input.gameData as Record<string, unknown>,
          });
        }
        return { success: true };
      }),

    getAchievements: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, ctx.user.id));
    }),

    unlockAchievement: protectedProcedure
      .input(z.object({ achievementId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        const existing = await db
          .select()
          .from(userAchievements)
          .where(
            and(
              eq(userAchievements.userId, ctx.user.id),
              eq(userAchievements.achievementId, input.achievementId)
            )
          )
          .limit(1);
        if (existing.length > 0) return { success: true, alreadyUnlocked: true };

        await db.insert(userAchievements).values({
          userId: ctx.user.id,
          achievementId: input.achievementId,
        });
        return { success: true, alreadyUnlocked: false };
      }),

    // Ark theme management
    getTheme: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db
        .select()
        .from(arkThemes)
        .where(eq(arkThemes.userId, ctx.user.id))
        .limit(1);
      return rows[0] || null;
    }),

    setTheme: protectedProcedure
      .input(z.object({ themeId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        const existing = await db
          .select()
          .from(arkThemes)
          .where(eq(arkThemes.userId, ctx.user.id))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(arkThemes)
            .set({ themeId: input.themeId })
            .where(eq(arkThemes.userId, ctx.user.id));
        } else {
          await db.insert(arkThemes).values({
            userId: ctx.user.id,
            themeId: input.themeId,
          });
        }
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
