/* ═══════════════════════════════════════════════════════
   DISCOVERY ROUTER — KOTOR-style progressive unlock system
   Maps Ark room discoveries to app feature unlocks.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { featureUnlocks, userArkProgress, arkRooms, userProgress } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

/* ─── ROOM → FEATURE MAPPING ─── */
const ROOM_FEATURE_MAP: Record<string, string[]> = {
  // Bridge = Command center → unlocks main dashboard, console
  bridge: ["command_bridge", "ark_console"],
  // Quarters = Personal space → unlocks profile, character sheet, citizen ID
  quarters: ["operative_dossier", "character_sheet", "citizen_id"],
  // Armory = Combat → unlocks fight, battle arena, PVP
  armory: ["combat_sim", "battle_arena", "pvp_arena"],
  // Lab = Research → unlocks research lab, crafting
  lab: ["research_lab", "crafting"],
  // Hangar = Ships → unlocks trade empire
  hangar: ["trade_empire"],
  // Observation = Lore viewing → unlocks conspiracy board, timelines, codex
  observation: ["conspiracy_board", "character_timeline", "era_timeline", "codex"],
  // Trophy = Collection → unlocks trophy room, card gallery
  trophy: ["trophy_room", "card_gallery"],
  // Training = Games → unlocks card game, deck builder, lore quiz
  training: ["card_game", "deck_builder", "lore_quiz"],
  // Market = Commerce → unlocks store, potentials
  market: ["requisitions", "potentials"],
  // Comms = Media → unlocks watch, discography, doom scroll
  comms: ["watch_show", "discography", "saga_timeline"],
  // Cargo = Database → unlocks database search
  cargo: ["database"],
  // Medbay = Healing → unlocks favorites/mission briefing
  medbay: ["mission_briefing"],
  // Engine = Power → unlocks leaderboard
  engine: ["leaderboard"],
  // Brig = Secrets → unlocks simulation hub
  brig: ["simulation_hub"],
  // Secret = Hidden features
  secret: ["explore_ark"],
  // Trade Wars sector
  tradewars: ["trade_empire"],
};

/* ─── DEFAULT FEATURES (always unlocked) ─── */
const DEFAULT_FEATURES = ["command_bridge", "ark_console", "database", "explore_ark"];

/* ─── FEATURE → NAV PATH MAPPING ─── */
export const FEATURE_PATH_MAP: Record<string, string> = {
  command_bridge: "/",
  ark_console: "/console",
  watch_show: "/watch",
  discography: "/discography",
  saga_timeline: "/saga-timeline",
  database: "/search",
  conspiracy_board: "/board",
  character_timeline: "/character-timeline",
  era_timeline: "/timeline",
  codex: "/codex",
  simulation_hub: "/games",
  card_game: "/cards/play",
  trade_empire: "/trade-empire",
  combat_sim: "/fight",
  explore_ark: "/ark",
  lore_quiz: "/quiz",
  battle_arena: "/battle",
  pvp_arena: "/pvp",
  card_gallery: "/card-gallery",
  deck_builder: "/deck-builder",
  research_lab: "/research-lab",
  trophy_room: "/trophy",
  operative_dossier: "/profile",
  leaderboard: "/leaderboard",
  citizen_id: "/create-citizen",
  character_sheet: "/character-sheet",
  requisitions: "/store",
  mission_briefing: "/favorites",
  potentials: "/potentials",
  crafting: "/research-lab",
};

export const discoveryRouter = router({
  /* ─── GET USER'S UNLOCKED FEATURES ─── */
  getUnlocks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { features: DEFAULT_FEATURES, isNewUser: true };

    const unlocks = await db
      .select()
      .from(featureUnlocks)
      .where(eq(featureUnlocks.userId, ctx.user.id));

    if (unlocks.length === 0) {
      // New user — grant default features
      for (const feature of DEFAULT_FEATURES) {
        await db.insert(featureUnlocks).values({
          userId: ctx.user.id,
          featureKey: feature,
          unlockedVia: "default",
        });
      }
      return { features: DEFAULT_FEATURES, isNewUser: true };
    }

    return {
      features: unlocks.map(u => u.featureKey),
      isNewUser: false,
    };
  }),

  /* ─── UNLOCK A FEATURE ─── */
  unlockFeature: protectedProcedure
    .input(z.object({
      featureKey: z.string(),
      via: z.enum(["ark_room", "achievement", "level", "purchase", "admin"]),
      sourceId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Check if already unlocked
      const existing = await db
        .select()
        .from(featureUnlocks)
        .where(and(
          eq(featureUnlocks.userId, ctx.user.id),
          eq(featureUnlocks.featureKey, input.featureKey)
        ))
        .limit(1);

      if (existing.length > 0) return { success: true, alreadyUnlocked: true };

      await db.insert(featureUnlocks).values({
        userId: ctx.user.id,
        featureKey: input.featureKey,
        unlockedVia: input.via,
        sourceId: input.sourceId,
      });

      return { success: true, alreadyUnlocked: false };
    }),

  /* ─── UNLOCK FEATURES FOR A ROOM VISIT ─── */
  unlockFromRoom: protectedProcedure
    .input(z.object({ roomType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { unlocked: [] };

      const features = ROOM_FEATURE_MAP[input.roomType] ?? [];
      const newlyUnlocked: string[] = [];

      for (const feature of features) {
        const existing = await db
          .select()
          .from(featureUnlocks)
          .where(and(
            eq(featureUnlocks.userId, ctx.user.id),
            eq(featureUnlocks.featureKey, feature)
          ))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(featureUnlocks).values({
            userId: ctx.user.id,
            featureKey: feature,
            unlockedVia: "ark_room",
            sourceId: input.roomType,
          });
          newlyUnlocked.push(feature);
        }
      }

      return { unlocked: newlyUnlocked };
    }),

  /* ─── GET DISCOVERY PROGRESS ─── */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalFeatures: 0, unlockedFeatures: 0, percentage: 0, roomsVisited: 0, totalRooms: 0 };

    const allFeatureKeys = Object.values(ROOM_FEATURE_MAP).flat();
    const uniqueFeatures = Array.from(new Set([...allFeatureKeys, ...DEFAULT_FEATURES]));

    const [unlockCount] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${featureUnlocks.featureKey})` })
      .from(featureUnlocks)
      .where(eq(featureUnlocks.userId, ctx.user.id));

    const [roomCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userArkProgress)
      .where(and(
        eq(userArkProgress.userId, ctx.user.id),
        eq(userArkProgress.isUnlocked, 1)
      ));

    const [totalRoomCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(arkRooms);

    const unlockedCount = Number(unlockCount?.count ?? 0);
    const totalFeatures = uniqueFeatures.length;

    return {
      totalFeatures,
      unlockedFeatures: unlockedCount,
      percentage: totalFeatures > 0 ? Math.round((unlockedCount / totalFeatures) * 100) : 0,
      roomsVisited: Number(roomCount?.count ?? 0),
      totalRooms: Number(totalRoomCount?.count ?? 0),
    };
  }),

  /* ─── UNLOCK ALL FEATURES (admin) ─── */
  unlockAll: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false };

    // Check if admin
    if (ctx.user.role !== "admin") return { success: false };

    const allFeatures = Array.from(new Set([
      ...Object.values(ROOM_FEATURE_MAP).flat(),
      ...DEFAULT_FEATURES,
    ]));

    for (const feature of allFeatures) {
      const existing = await db
        .select()
        .from(featureUnlocks)
        .where(and(
          eq(featureUnlocks.userId, ctx.user.id),
          eq(featureUnlocks.featureKey, feature)
        ))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(featureUnlocks).values({
          userId: ctx.user.id,
          featureKey: feature,
          unlockedVia: "admin",
        });
      }
    }

    return { success: true };
  }),
});
