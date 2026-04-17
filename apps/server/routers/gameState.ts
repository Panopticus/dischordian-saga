/* ═══════════════════════════════════════════════════════
   GAME STATE ROUTER — Server-side save/load for Inception Ark
   Persists full game state to DB for cross-device play.
   Also provides leaderboard data.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { logger } from "../logger";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress, users, contentParticipation } from "../../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

// Schema for the game state that gets saved.
//
// NOTE: `.passthrough()` is important. The client sends an extra
// `_clientState` field under `gameState` containing a flat bag of
// critical localStorage keys (dischordia ELO, card upgrades,
// equipment state, trade empire state, terminus high water mark,
// loredex discovery sets, cinematics seen, active specimen, etc.).
// Those keys are persisted per-player so they survive a browser
// clear or device switch (Task 2.1). Without .passthrough() zod
// would strip `_clientState` before it reaches userProgress.gameData
// and every one of those localStorage keys would be silently lost
// on every save.
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
  // Wave 1 — unified "both narrators" bond (§14.1 milestones at 40/60/80).
  // Optional so older clients that predate the field round-trip cleanly;
  // the derived-value fallback in shared/narratorBond.ts handles reads.
  narratorBond: z.number().optional(),
  // Wave 1 — canonical Year One Calendar month (1..12). Optional for
  // pre-field saves; the flag-scan fallback in shared/yearOneMonth.ts
  // reads `year_one_month_N_opened` when the field is absent.
  yearOneMonth: z.number().optional(),
  // Wave 1 — army recruitment counter. Gates Acts 6 (5+) and 7 (15+)
  // per shared/armyRecruitment.ts thresholds. Optional — passthrough
  // handled pre-field saves but the explicit field documents the
  // validation contract.
  armyRecruitmentMissionsCompleted: z.array(z.string()).optional(),
  // Wave 1 — prestige (§15 P3). Typed replacement for the old
  // `(prev as any).prestige` hack on GameContext. The baseline is
  // the carryover result from applyPrestigeCarryover() at the last
  // prestige event; null on saves that have never prestiged.
  prestigeLevel: z.number().optional(),
  prestigeBaseline: z.object({
    loredexEntries: z.number(),
    bondPeakMemories: z.number(),
    narratorDominanceEnergy: z.number(),
    dischordiaCards: z.number(),
    witnessingMilestones: z.number(),
    memorableMoments: z.number(),
  }).nullable().optional(),
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
  // Client-side state bag (see note above).
  _clientState: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

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

    // Hydrate transmissionsWatched from the server-side source of truth
    // (contentParticipation.contentType = "transmission"). This handles
    // cross-device sync: a player who watched Ep 2 on device A will see
    // it as watched on device B on login, even if the last persisted
    // gameData snapshot predates that watch.
    let gameData = row.gameData as Record<string, unknown> | null;
    try {
      const watchedRows = await db
        .select({ contentId: contentParticipation.contentId })
        .from(contentParticipation)
        .where(
          and(
            eq(contentParticipation.userId, ctx.user.id),
            eq(contentParticipation.contentType, "transmission"),
            eq(contentParticipation.completed, 1),
          ),
        );
      if (watchedRows.length > 0) {
        const serverWatched = watchedRows.map(r => r.contentId);
        const existing = (gameData?.transmissionsWatched as string[] | undefined) ?? [];
        const merged = Array.from(new Set([...existing, ...serverWatched]));
        gameData = { ...(gameData ?? {}), transmissionsWatched: merged };
      }
    } catch (err) {
      logger.error("[GameState.load] Failed to hydrate transmissionsWatched:", err);
    }

    return {
      gameState: gameData,
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
      // Award civil skill XP for entity discovery (lore + perception)
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(ctx.user.id, "discover_entity").catch(e => logger.error("[GameState] Civil XP award failed:", e));

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

  /* ─── CADES FPS STATE ─── */

  getCadesData: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) dbUnavailable();
    const rows = await db.select().from(userProgress).where(eq(userProgress.userId, ctx.user.id));
    if (!rows.length) return { loopCount: 0, awarenessLevel: 0, bestTimeHeld: 0, canonAchieved: false, scenariosCompleted: [] as string[], ironLionContacted: false, gmContactLevel: 0, thoughtbornContacted: false, openChannelChoice: "" };
    const state = rows[0].gameData as Record<string, unknown> | null;
    const cades = (state?.cades ?? {}) as Record<string, unknown>;
    return {
      loopCount: (cades.loopCount as number) ?? 0,
      awarenessLevel: (cades.awarenessLevel as number) ?? 0,
      bestTimeHeld: (cades.bestTimeHeld as number) ?? 0,
      canonAchieved: (cades.canonAchieved as boolean) ?? false,
      scenariosCompleted: (cades.scenariosCompleted as string[]) ?? [],
      ironLionContacted: (cades.ironLionContacted as boolean) ?? false,
      gmContactLevel: (cades.gmContactLevel as number) ?? 0,
      thoughtbornContacted: (cades.thoughtbornContacted as boolean) ?? false,
      openChannelChoice: (cades.openChannelChoice as string) ?? "",
    };
  }),

  saveCadesResult: protectedProcedure
    .input(z.record(z.string(), z.unknown()))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
    if (!db) dbUnavailable();
      const rows = await db.select().from(userProgress).where(eq(userProgress.userId, ctx.user.id));
      if (!rows.length) return { ok: false };
      const state = (rows[0].gameData as Record<string, unknown>) ?? {};
      const cades = ((state.cades ?? {}) as Record<string, unknown>);

      // Merge results
      if (input.mode === "last_stand") {
        cades.loopCount = (input.loop_count as number) ?? cades.loopCount ?? 0;
        cades.awarenessLevel = (input.awareness_level as number) ?? cades.awarenessLevel ?? 0;
        const timeHeld = (input.time_held as number) ?? 0;
        cades.bestTimeHeld = Math.max((cades.bestTimeHeld as number) ?? 0, timeHeld);
        if (input.canon_achieved) cades.canonAchieved = true;
        if (input.iron_lion_contacted) cades.ironLionContacted = true;
        if (typeof input.open_channel_choice === "string" && input.open_channel_choice.length > 0) {
          cades.openChannelChoice = input.open_channel_choice;
        }
      }
      if (input.mode === "ship_defense") {
        if (input.thoughtborn_contacted) cades.thoughtbornContacted = true;
      }
      if (input.mode === "historical_incursions") {
        const existing = (cades.scenariosCompleted as string[]) ?? [];
        const completed = (input.scenarios_total_completed as string[]) ?? [];
        cades.scenariosCompleted = [...new Set([...existing, ...completed])];
        // Accept both `gm_contact_level` (from CADES_GM_CONTACT postMessage)
        // and `game_masters_contact_level` (from CADES_RESULT payload).
        const newLevel =
          (input.gm_contact_level as number) ??
          (input.game_masters_contact_level as number) ??
          0;
        cades.gmContactLevel = Math.max((cades.gmContactLevel as number) ?? 0, newLevel);
      }

      state.cades = cades;
      await db.update(userProgress).set({ gameData: state }).where(eq(userProgress.userId, ctx.user.id));
      return { ok: true };
    }),
});
