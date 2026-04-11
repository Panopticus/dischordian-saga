import { z } from "zod";
import { logger } from "../logger";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { arkRooms, userArkProgress } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { grantMaterials } from "../services/craftingMaterials";
import { rollExplorationDrops, dropsToMaterialMap } from "../../shared/lootDrops";

export const arkRouter = router({
  // Get all rooms (public map overview)
  getRooms: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(arkRooms).orderBy(arkRooms.deckLevel, arkRooms.gridY, arkRooms.gridX);
  }),

  // Get user's ark progress
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(userArkProgress)
      .where(eq(userArkProgress.userId, ctx.user.id));
  }),

  // Visit a room (unlock if requirements met)
  visitRoom: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Get room info
      const room = await db
        .select()
        .from(arkRooms)
        .where(eq(arkRooms.roomId, input.roomId))
        .limit(1);

      if (!room[0]) return { success: false, message: "Room not found" };

      // Check/create user progress for this room
      const progress = await db
        .select()
        .from(userArkProgress)
        .where(and(
          eq(userArkProgress.userId, ctx.user.id),
          eq(userArkProgress.roomId, input.roomId)
        ))
        .limit(1);

      if (progress[0]) {
        // Already visited, increment count
        await db
          .update(userArkProgress)
          .set({
            visitCount: sql`${userArkProgress.visitCount} + 1`,
            lastVisitedAt: new Date(),
          })
          .where(eq(userArkProgress.id, progress[0].id));

        return { success: true, room: room[0], firstVisit: false };
      }

      // First visit — check if locked
      if (room[0].isLocked) {
        // Check unlock requirements
        const req = room[0].unlockRequirement as any;
        if (req) {
          // For now, check if user has visited required rooms
          if (req.requiredRooms) {
            const visitedRooms = await db
              .select()
              .from(userArkProgress)
              .where(and(
                eq(userArkProgress.userId, ctx.user.id),
                eq(userArkProgress.isUnlocked, 1)
              ));
            const visitedIds = new Set(visitedRooms.map(r => r.roomId));
            const allMet = (req.requiredRooms as string[]).every(id => visitedIds.has(id));
            if (!allMet) {
              return { success: false, message: "Requirements not met. Explore more of the Ark first." };
            }
          }
        }
      }

      // Unlock and visit
      await db.insert(userArkProgress).values({
        userId: ctx.user.id,
        roomId: input.roomId,
        isUnlocked: 1,
        visitCount: 1,
        firstVisitedAt: new Date(),
        lastVisitedAt: new Date(),
      });

      // Award civil skill XP for room exploration (perception + lore)
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(ctx.user.id, "explore_room").catch(e => logger.error("[Ark] Civil XP award failed:", e));

      // ── Crafting material drops on first visit ──
      // Roll the exploration loot table once per new room and credit the
      // result to the player's crafting inventory. Repeat visits don't drop.
      const drops = rollExplorationDrops();
      const materialDrops = dropsToMaterialMap(drops);
      if (Object.keys(materialDrops).length > 0) {
        grantMaterials(ctx.user.id, materialDrops).catch(() => {});
      }

      return { success: true, room: room[0], firstVisit: true, materialDrops };
    }),

  // Get a specific room's details
  getRoom: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db
        .select()
        .from(arkRooms)
        .where(eq(arkRooms.roomId, input.roomId))
        .limit(1);
      return rows[0] ?? null;
    }),
});
