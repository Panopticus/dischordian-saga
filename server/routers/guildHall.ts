/**
 * Guild Hall Router — Upgrade tiers, unlock rooms, place decorations.
 *
 * Extends the existing guild router with hall management.
 * Guild hall state stored in guilds table (hallTier, hallData JSON).
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { guilds, guildMembers } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Hall tier costs (Dream from guild treasury)
const TIER_COSTS = [0, 0, 500, 2000, 5000, 15000]; // index = tier to upgrade TO
const MAX_ROOMS = [0, 2, 4, 7, 10, 12];

// Room tier requirements
const ROOM_TIER: Record<string, number> = {
  main_hall: 1, mess_hall: 1,
  war_room: 2, training_ground: 2,
  armory_vault: 3, research_wing: 3, trophy_gallery: 3,
  guild_vault: 4, guild_shop: 4, diplomatic_chamber: 4,
  oracle_pool: 5, portal_chamber: 5,
};

// Decoration costs
const DECO_COSTS: Record<string, { dream?: number; credits?: number }> = {
  guild_standard: { dream: 10 }, faction_banner_empire: { dream: 25 },
  faction_banner_insurgency: { dream: 25 }, command_table: { dream: 50 },
  war_planning_board: { dream: 75 }, guild_throne: { dream: 200 },
  meditation_cushions: { dream: 15 }, lounge_couch: { dream: 40 },
  holographic_fire: { dream: 30 }, neon_guild_sign: { dream: 45 },
  void_lantern: { dream: 80 }, crystal_chandelier: { dream: 150 },
  comms_terminal: { dream: 35 }, research_console: { dream: 60 },
  surveillance_array: { credits: 500 }, fallen_memorial: { dream: 20 },
  origin_plaque: { dream: 5 }, war_chronicle: { dream: 40 },
  antiquarian_globe: { dream: 500 }, architects_blueprint: { dream: 250 },
  dreamers_tapestry: { dream: 350 }, portal_generator: { dream: 300 },
};

interface HallData {
  unlockedRooms: string[];
  decorations: { roomId: string; decoId: string; x: number; y: number }[];
}

const DEFAULT_HALL: HallData = { unlockedRooms: ["main_hall", "mess_hall"], decorations: [] };

async function getGuildForMember(userId: number) {
  const db = getDb();
  const membership = await db.select().from(guildMembers)
    .where(eq(guildMembers.userId, userId)).limit(1);
  if (!membership[0]) return null;
  const guild = await db.select().from(guilds)
    .where(eq(guilds.id, membership[0].guildId)).limit(1);
  return guild[0] ?? null;
}

export const guildHallRouter = router({
  getHallState: protectedProcedure.query(async ({ ctx }) => {
    const guild = await getGuildForMember(ctx.user.id);
    if (!guild) return null;
    const hallData = (guild as any).hallData as HallData ?? DEFAULT_HALL;
    const hallTier = (guild as any).hallTier as number ?? 1;
    return { hallTier, ...hallData, treasury: (guild as any).treasury ?? 0 };
  }),

  upgradeTier: protectedProcedure.mutation(async ({ ctx }) => {
    const guild = await getGuildForMember(ctx.user.id);
    if (!guild) return { success: false, error: "Not in a guild" };

    // Check leadership
    const db = getDb();
    const membership = await db.select().from(guildMembers)
      .where(and(eq(guildMembers.userId, ctx.user.id), eq(guildMembers.guildId, guild.id)))
      .limit(1);
    if (membership[0]?.role !== "leader" && membership[0]?.role !== "officer") {
      return { success: false, error: "Only leaders/officers can upgrade" };
    }

    const currentTier = (guild as any).hallTier ?? 1;
    const nextTier = currentTier + 1;
    if (nextTier > 5) return { success: false, error: "Already max tier" };

    const cost = TIER_COSTS[nextTier];
    const treasury = (guild as any).treasury ?? 0;
    if (treasury < cost) {
      return { success: false, error: `Need ${cost} Dream in treasury, have ${treasury}` };
    }

    // Auto-unlock rooms for new tier
    const hallData = (guild as any).hallData as HallData ?? DEFAULT_HALL;
    const newRooms = Object.entries(ROOM_TIER)
      .filter(([_, tier]) => tier <= nextTier)
      .map(([roomId]) => roomId);
    hallData.unlockedRooms = [...new Set([...hallData.unlockedRooms, ...newRooms])];

    await db.update(guilds)
      .set({
        hallTier: nextTier,
        treasury: treasury - cost,
        hallData: hallData,
      } as any)
      .where(eq(guilds.id, guild.id));

    return { success: true, newTier: nextTier, unlockedRooms: hallData.unlockedRooms };
  }),

  placeDecoration: protectedProcedure
    .input(z.object({
      roomId: z.string(),
      decoId: z.string(),
      x: z.number().min(0),
      y: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const guild = await getGuildForMember(ctx.user.id);
      if (!guild) return { success: false, error: "Not in a guild" };

      const hallData = (guild as any).hallData as HallData ?? DEFAULT_HALL;
      if (!hallData.unlockedRooms.includes(input.roomId)) {
        return { success: false, error: "Room not unlocked" };
      }

      const cost = DECO_COSTS[input.decoId];
      if (!cost) return { success: false, error: "Unknown decoration" };

      const treasury = (guild as any).treasury ?? 0;
      const dreamCost = cost.dream ?? 0;
      if (treasury < dreamCost) {
        return { success: false, error: `Need ${dreamCost} Dream, treasury has ${treasury}` };
      }

      hallData.decorations.push({
        roomId: input.roomId,
        decoId: input.decoId,
        x: input.x,
        y: input.y,
      });

      const db = getDb();
      await db.update(guilds)
        .set({
          treasury: treasury - dreamCost,
          hallData: hallData,
        } as any)
        .where(eq(guilds.id, guild.id));

      return { success: true, remainingTreasury: treasury - dreamCost };
    }),

  removeDecoration: protectedProcedure
    .input(z.object({ roomId: z.string(), decoId: z.string(), x: z.number(), y: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const guild = await getGuildForMember(ctx.user.id);
      if (!guild) return { success: false, error: "Not in a guild" };

      const hallData = (guild as any).hallData as HallData ?? DEFAULT_HALL;
      const idx = hallData.decorations.findIndex(
        d => d.roomId === input.roomId && d.decoId === input.decoId && d.x === input.x && d.y === input.y
      );
      if (idx === -1) return { success: false, error: "Decoration not found" };

      hallData.decorations.splice(idx, 1);

      const db = getDb();
      await db.update(guilds)
        .set({ hallData: hallData } as any)
        .where(eq(guilds.id, guild.id));

      return { success: true };
    }),
});
