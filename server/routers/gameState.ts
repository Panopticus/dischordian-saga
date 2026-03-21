/* ═══════════════════════════════════════════════════════
   GAME STATE ROUTER — Server-side save/load for Inception Ark
   Persists full game state to DB for cross-device play.
   Also provides leaderboard data.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress, users } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

// Schema for the game state that gets saved
const gameStateSchema = z.object({
  phase: z.string(),
  awakeningStep: z.string(),
  characterChoices: z.object({
    species: z.string().nullable(),
    characterClass: z.string().nullable(),
    alignment: z.string().nullable(),
    element: z.string().nullable(),
    name: z.string(),
    attrAttack: z.number(),
    attrDefense: z.number(),
    attrVitality: z.number(),
  }),
  characterCreated: z.boolean(),
  rooms: z.record(z.string(), z.object({
    id: z.string(),
    unlocked: z.boolean(),
    visited: z.boolean(),
    visitCount: z.number(),
    itemsFound: z.array(z.string()),
    elaraDialogSeen: z.boolean(),
  })),
  currentRoomId: z.string().nullable(),
  itemsCollected: z.array(z.string()),
  achievementsEarned: z.array(z.string()),
  elaraDialogHistory: z.array(z.string()),
  totalRoomsUnlocked: z.number(),
  totalItemsFound: z.number(),
  narrativeFlags: z.record(z.string(), z.boolean()),
  claimedQuestRewards: z.array(z.string()).optional(),
  completedGames: z.array(z.string()).optional(),
  collectedCards: z.array(z.string()).optional(),
  loreAchievements: z.array(z.string()).optional(),
  conexusXp: z.number().optional(),
  activeDeck: z.array(z.string()).optional(),
  // Crafting system persistence
  craftingSkills: z.record(z.string(), z.number()).optional(),
  craftingXp: z.record(z.string(), z.number()).optional(),
  craftingMaterials: z.record(z.string(), z.number()).optional(),
  craftedItems: z.array(z.string()).optional(),
  craftingLog: z.array(z.object({
    recipeId: z.string(),
    timestamp: z.number(),
  }).passthrough()).optional(),
  // Morality system persistence
  moralityScore: z.number().optional(),
  moralityChoices: z.array(z.object({
    choiceId: z.string(),
    value: z.number(),
    timestamp: z.number(),
  }).passthrough()).optional(),
  // Tutorial & morality unlocks persistence
  completedTutorials: z.array(z.string()).optional(),
  moralityUnlocks: z.array(z.string()).optional(),
  discoveredTransmissions: z.array(z.string()).optional(),
  // Equipment persistence
  equippedItems: z.record(z.string(), z.string().nullable()).optional(),
  inventoryItems: z.array(z.string()).optional(),
});

// Stats that get stored alongside game state for leaderboard queries
const statsSchema = z.object({
  roomsUnlocked: z.number(),
  totalRooms: z.number(),
  puzzlesSolved: z.number(),
  totalPuzzles: z.number(),
  easterEggsFound: z.number(),
  totalEasterEggs: z.number(),
  battlesWon: z.number(),
  battlesPlayed: z.number(),
  cardsCollected: z.number(),
  totalCards: z.number(),
  completionPercent: z.number(),
  rank: z.string(),
});

export const gameStateRouter = router({
  /**
   * Load game state from server.
   * Returns null if no saved state exists.
   */
  load: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id))
      .limit(1);
    if (!rows[0]) return null;
    const row = rows[0];
    return {
      gameState: row.gameData as Record<string, unknown> | null,
      stats: row.progressData as Record<string, unknown> | null,
      savedAt: row.updatedAt?.toISOString() ?? null,
    };
  }),

  /**
   * Save game state to server.
   * Upserts into userProgress.gameData.
   */
  save: protectedProcedure
    .input(z.object({
      gameState: gameStateSchema,
      stats: statsSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const existing = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .limit(1);

      const gameData = input.gameState as unknown as Record<string, unknown>;
      const progressData = input.stats as unknown as Record<string, unknown>;

      if (existing.length > 0) {
        await db
          .update(userProgress)
          .set({
            gameData,
            progressData,
            xp: input.stats.completionPercent * 10, // XP from completion
            level: Math.max(1, Math.floor(input.stats.completionPercent / 10)),
            title: input.stats.rank,
          })
          .where(eq(userProgress.userId, ctx.user.id));
      } else {
        await db.insert(userProgress).values({
          userId: ctx.user.id,
          gameData,
          progressData,
          xp: input.stats.completionPercent * 10,
          level: Math.max(1, Math.floor(input.stats.completionPercent / 10)),
          title: input.stats.rank,
        });
      }
      return { success: true };
    }),

  /**
   * Leaderboard — top players by completion, battles, or Easter eggs.
   */
  leaderboard: publicProcedure
    .input(z.object({
      sortBy: z.enum(["completion", "battles", "easterEggs", "rooms"]).default("completion"),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const sortBy = input?.sortBy ?? "completion";
      const limit = input?.limit ?? 50;

      // Get all users with progress data
      const rows = await db
        .select({
          userId: userProgress.userId,
          userName: users.name,
          progressData: userProgress.progressData,
          gameData: userProgress.gameData,
          title: userProgress.title,
          xp: userProgress.xp,
          level: userProgress.level,
          updatedAt: userProgress.updatedAt,
        })
        .from(userProgress)
        .innerJoin(users, eq(userProgress.userId, users.id))
        .limit(limit * 2); // Get extra to filter

      // Parse and sort
      const entries = rows
        .map(row => {
          const stats = (row.progressData ?? {}) as Record<string, unknown>;
          const gameData = (row.gameData ?? {}) as Record<string, unknown>;
          const charChoices = (gameData.characterChoices ?? {}) as Record<string, unknown>;
          return {
            userId: row.userId,
            userName: row.userName ?? "Unknown Operative",
            title: row.title ?? "Recruit",
            level: row.level ?? 1,
            xp: row.xp ?? 0,
            species: (charChoices.species as string) ?? null,
            characterClass: (charChoices.characterClass as string) ?? null,
            completionPercent: (stats.completionPercent as number) ?? 0,
            roomsUnlocked: (stats.roomsUnlocked as number) ?? 0,
            totalRooms: (stats.totalRooms as number) ?? 10,
            battlesWon: (stats.battlesWon as number) ?? 0,
            battlesPlayed: (stats.battlesPlayed as number) ?? 0,
            easterEggsFound: (stats.easterEggsFound as number) ?? 0,
            totalEasterEggs: (stats.totalEasterEggs as number) ?? 10,
            cardsCollected: (stats.cardsCollected as number) ?? 0,
            puzzlesSolved: (stats.puzzlesSolved as number) ?? 0,
            rank: (stats.rank as string) ?? "Unranked",
            lastActive: row.updatedAt?.toISOString() ?? null,
          };
        })
        .filter(e => e.completionPercent > 0 || e.roomsUnlocked > 0); // Only show active players

      // Sort by the requested metric
      switch (sortBy) {
        case "battles":
          entries.sort((a, b) => b.battlesWon - a.battlesWon || b.completionPercent - a.completionPercent);
          break;
        case "easterEggs":
          entries.sort((a, b) => b.easterEggsFound - a.easterEggsFound || b.completionPercent - a.completionPercent);
          break;
        case "rooms":
          entries.sort((a, b) => b.roomsUnlocked - a.roomsUnlocked || b.completionPercent - a.completionPercent);
          break;
        default:
          entries.sort((a, b) => b.completionPercent - a.completionPercent || b.xp - a.xp);
      }

      return entries.slice(0, limit).map((e, i) => ({ ...e, rank_position: i + 1 }));
    }),
});
