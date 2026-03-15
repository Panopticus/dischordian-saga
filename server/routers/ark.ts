import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { arkRooms, userArkProgress } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

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

      return { success: true, room: room[0], firstVisit: true };
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
