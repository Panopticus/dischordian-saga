import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { generateDoomStories, refreshDoomStories } from "./doomScroll";
import { z } from "zod";
import { getDb } from "./db";
import { userAchievements, userProgress } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { cardGameRouter } from "./routers/cardGame";
import { arkRouter } from "./routers/ark";
import { trophyRouter } from "./routers/trophy";
import { tradeWarsRouter } from "./routers/tradeWars";
import { citizenRouter } from "./routers/citizen";
import { medbayRouter } from "./routers/medbay";
import { craftingRouter } from "./routers/crafting";
import { memoryEnergyRouter } from "./routers/memoryEnergy";
import { storeRouter } from "./routers/store";
import { elaraRouter } from "./routers/elara";
import { lyricsRouter } from "./routers/lyrics";
import { gameStateRouter } from "./routers/gameState";
import { cardChallengeRouter } from "./routers/cardChallenge";
import { adminRouter } from "./routers/admin";
import { contentRewardRouter } from "./routers/contentReward";
import { transmissionsRouter } from "./routers/transmissions";
import { fightLeaderboardRouter } from "./routers/fightLeaderboard";
import { essenceHarvestRouter } from "./routers/essenceHarvest";
import { pvpRouter } from "./routers/pvp";
import { titlesRouter } from "./routers/titles";
import { competitiveRouter } from "./routers/competitive";
import { conspiracyRouter } from "./routers/conspiracy";
import { guildExpansionRouter } from "./routers/guildExpansion";
import { tier5PvpRouter } from "./routers/tier5Pvp";
import { apprenticeTrialRouter } from "./routers/apprenticeTrial";
import { pvpModerationRouter } from "./routers/pvpModeration";
import { pvpTelemetryRouter } from "./routers/pvpTelemetry";
import { partyRouter } from "./routers/party";
import { coopCardRouter } from "./routers/coopCard";
import { cadesIceRouter } from "./routers/cadesIce";
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
import { bonusObjectivesRouter } from "./routers/bonusObjectives";
import { vortexIncursionRouter } from "./routers/vortexIncursion";
import { marketAchievementsRouter } from "./routers/marketAchievements";
import { notificationRouter } from "./routers/notificationRouter";
import { guildRouter } from "./routers/guild";
import { chatRouter } from "./routers/chat";
import { battlePassRouter } from "./routers/battlePass";
import { inventoryRouter } from "./routers/inventory";
import { guildWarsRouter } from "./routers/guildWars";
import { chessRouter } from "./routers/chess";
import { chessClimbRouter } from "./routers/chessClimb";
import { chessSideGateRouter } from "./routers/chessSideGate";
import { chessPuzzleRouter } from "./routers/chessPuzzle";
import { playerProfileRouter } from "./routers/playerProfile";
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
import { pvpRankingRouter } from "./routers/pvpRanking";
import { personalQuartersRouter } from "./routers/personalQuarters";
import { friendlyChallengesRouter } from "./routers/friendlyChallenges";
import { coopRaidsRouter } from "./routers/coopRaids";
import { bossMasteryRouter } from "./routers/bossMastery";
import { cosmeticShopRouter } from "./routers/cosmeticShop";
import { donationSystemRouter } from "./routers/donationSystem";
import { socialFeaturesRouter } from "./routers/socialFeatures";
import { loreJournalRouter } from "./routers/loreJournal";
import { promoCodesRouter } from "./routers/promoCodes";
import { architectConsoleRouter } from "./routers/architectConsole";
import { potentialIdentityRouter } from "./routers/potentialIdentity";
import { potentialFactionsRouter } from "./routers/potentialFactions";
import { epochWitnessRouter } from "./routers/epochWitness";
import { eidolonBondRouter } from "./routers/eidolonBond";
import { npcRouter } from "./routers/npc";
import { tradeContractsRouter } from "./routers/tradeContracts";
import { techTreeRouter } from "./routers/techTree";
import { masteryTreeRouter } from "./routers/masteryTree";
import { guildHallRouter } from "./routers/guildHall";
import { guildContractsRouter } from "./routers/guildContracts";
import { tradeEmpireRouter } from "./routers/tradeEmpire";
import { petBattlesRouter } from "./routers/petBattles";
import { seedDataRouter } from "./routers/seedData";
import { analyticsRouter } from "./routers/analytics";
import { settingsRouter } from "./routers/settings";
import { dailyBriefRouter } from "./routers/dailyBrief";
import { prestigeRouter } from "./routers/prestige";
import { graduateLegionRouter } from "./routers/graduateLegion";
import { outbreakRouter } from "./routers/outbreak";
import { communityCodexRouter } from "./routers/communityCodex";
import { performanceRouter } from "./routers/performance";
import { deadMansCircuitRouter } from "./routers/deadMansCircuit";
import { livingUniverseRouter } from "./routers/livingUniverse";
import { palimpsestRouter } from "./routers/palimpsest";
import { thoughtVirusRouter } from "./routers/thoughtVirus";
import { casinoRouter } from "./routers/casino";
import { christmasInJulyRouter } from "./routers/christmasInJuly";
import { dischordiaCycleRouter } from "./routers/dischordiaCycle";
import { crewRouter } from "./routers/crew";
import { storyModeRouter } from "./routers/storyMode";
import { tutorialRouter } from "./routers/tutorial";
import { collectionRouter } from "./routers/collection";
import { engineerLogsRouter } from "./routers/engineerLogs";
import { fnord23Router } from "./routers/fnord23";
import { oracleDeckRouter } from "./routers/oracleDeck";
import { imprintsRouter } from "./routers/imprints";
import { factionsRouter } from "./routers/factions";
import { celebrationRouter } from "./routers/celebration";
import { crossGameThreadsRouter } from "./routers/crossGameThreads";
import { arkThemesRouter } from "./routers/arkThemes";
import { announcementsRouter } from "./routers/announcements";
import { playerResetRouter } from "./routers/playerReset";
import { mysteriesRouter } from "./routers/mysteries";
import { engagementRouter } from "./routers/engagement";
import { dreamerVisionsRouter } from "./routers/dreamerVisions";
import { dreamerAwarenessRouter } from "./routers/dreamerAwareness";
import { dreamerFragmentsRouter } from "./routers/dreamerFragments";
import { architectDossierRouter } from "./routers/architectDossier";

export const appRouter = router({
  collection: collectionRouter,
  system: systemRouter,
  cardGame: cardGameRouter,
  ark: arkRouter,
  trophy: trophyRouter,
  tradeWars: tradeWarsRouter,
  citizen: citizenRouter,
  medbay: medbayRouter,
  crafting: craftingRouter,
  memoryEnergy: memoryEnergyRouter,
  store: storeRouter,
  elara: elaraRouter,
  lyrics: lyricsRouter,
  gameState: gameStateRouter,
  cardChallenge: cardChallengeRouter,
  admin: adminRouter,
  contentReward: contentRewardRouter,
  transmissions: transmissionsRouter,
  fightLeaderboard: fightLeaderboardRouter,
  essenceHarvest: essenceHarvestRouter,
  pvp: pvpRouter,
  titles: titlesRouter,
  competitive: competitiveRouter,
  conspiracy: conspiracyRouter,
  guildExpansion: guildExpansionRouter,
  tier5Pvp: tier5PvpRouter,
  apprenticeTrial: apprenticeTrialRouter,
  pvpModeration: pvpModerationRouter,
  pvpTelemetry: pvpTelemetryRouter,
  party: partyRouter,
  coopCard: coopCardRouter,
  cadesIce: cadesIceRouter,
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
  bonusObjectives: bonusObjectivesRouter,
  vortexIncursion: vortexIncursionRouter,
  marketAchievements: marketAchievementsRouter,
  notifications: notificationRouter,
  guild: guildRouter,
  chat: chatRouter,
  battlePass: battlePassRouter,
  inventory: inventoryRouter,
  guildWars: guildWarsRouter,
  chess: chessRouter,
  chessClimb: chessClimbRouter,
  chessSideGate: chessSideGateRouter,
  chessPuzzle: chessPuzzleRouter,
  playerProfile: playerProfileRouter,
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
  pvpRanking: pvpRankingRouter,
  personalQuarters: personalQuartersRouter,
  friendlyChallenge: friendlyChallengesRouter,
  coopRaid: coopRaidsRouter,
  bossMastery: bossMasteryRouter,
  cosmeticShop: cosmeticShopRouter,
  donation: donationSystemRouter,
  social: socialFeaturesRouter,
  loreJournal: loreJournalRouter,
  promoCodes: promoCodesRouter,
  architectConsole: architectConsoleRouter,
  potentialIdentity: potentialIdentityRouter,
  potentialFactions: potentialFactionsRouter,
  epochWitness: epochWitnessRouter,
  eidolonBond: eidolonBondRouter,
  npc: npcRouter,
  tradeContracts: tradeContractsRouter,
  techTree: techTreeRouter,
  masteryTree: masteryTreeRouter,
  guildHall: guildHallRouter,
  guildContracts: guildContractsRouter,
  tradeEmpire: tradeEmpireRouter,
  petBattles: petBattlesRouter,
  seedData: seedDataRouter,
  analytics: analyticsRouter,
  settings: settingsRouter,
  dailyBrief: dailyBriefRouter,
  prestige: prestigeRouter,
  graduateLegion: graduateLegionRouter,
  outbreak: outbreakRouter,
  communityCodex: communityCodexRouter,
  performance: performanceRouter,
  deadMansCircuit: deadMansCircuitRouter,
  livingUniverse: livingUniverseRouter,
  mysteries: mysteriesRouter,
  palimpsest: palimpsestRouter,
  thoughtVirus: thoughtVirusRouter,
  casino: casinoRouter,
  christmasInJuly: christmasInJulyRouter,
  dischordiaCycle: dischordiaCycleRouter,
  crew: crewRouter,
  storyMode: storyModeRouter,
  tutorial: tutorialRouter,
  engineerLogs: engineerLogsRouter,
  fnord23: fnord23Router,
  oracleDeck: oracleDeckRouter,
  imprints: imprintsRouter,
  factions: factionsRouter,
  celebration: celebrationRouter,
  engagement: engagementRouter,
  dreamerVisions: dreamerVisionsRouter,
  dreamerAwareness: dreamerAwarenessRouter,
  dreamerFragments: dreamerFragmentsRouter,
  architectDossier: architectDossierRouter,
  crossGameThreads: crossGameThreadsRouter,
  arkThemes: arkThemesRouter,
  announcements: announcementsRouter,
  playerReset: playerResetRouter,
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

    // Ark theme management moved to routers/arkThemes.ts
    // (appRouter.arkThemes.get / arkThemes.set). The inline
    // gamification.getTheme / gamification.setTheme pair was
    // never referenced by client code; this extraction closes
    // docs/design/FULL-PROJECT-AUDIT.md's "arkThemes accessed
    // inline" finding.
  }),
});

export type AppRouter = typeof appRouter;
