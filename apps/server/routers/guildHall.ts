/**
 * Guild Hall Router — Upgrade tiers, unlock rooms, place decorations.
 *
 * Persists state on the `guilds` table via `hallTier` + `hallData` JSON
 * columns (added in migration 0038). Upgrade + decoration costs are paid
 * from `treasuryDream`, the primary guild currency pool.
 *
 * Canonical tier/room/decoration catalogs live in shared/guildHall.ts —
 * this router imports them rather than redefining constants locally.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { guilds, guildMembers, bossMastery, guildWarContributions, userProgress } from "../../db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
import {
  HALL_TIERS, HALL_ROOMS, GUILD_DECORATIONS,
  getHallTier, getRoomsForTier, getUpgradeCost,
  getAllPerks, getTotalPassiveBonuses,
} from "../../shared/guildHall";

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

/** The shape stored in guilds.hallData. */
interface HallData {
  unlockedRooms: string[];
  decorations: { roomId: string; decoId: string; x: number; y: number }[];
}

const DEFAULT_HALL: HallData = {
  unlockedRooms: HALL_ROOMS.filter((r) => r.tierRequired === 1).map((r) => r.id),
  decorations: [],
};

/** Look up a decoration's cost from the canonical catalog. */
function getDecoCost(decoId: string): { dream: number; credits: number } | null {
  const deco = GUILD_DECORATIONS.find((d) => d.id === decoId);
  if (!deco) return null;
  return {
    dream: deco.cost.dream ?? 0,
    credits: deco.cost.credits ?? 0,
  };
}

async function getGuildForMember(userId: number) {
  const db = await getDb();
  if (!db) dbUnavailable();
  const membership = await db.select().from(guildMembers)
    .where(eq(guildMembers.userId, userId)).limit(1);
  if (!membership[0]) return null;
  const guild = await db.select().from(guilds)
    .where(eq(guilds.id, membership[0].guildId)).limit(1);
  return { guild: guild[0] ?? null, role: membership[0].role };
}

/**
 * Resolve a decoration's `unlockRequirement` string against the guild's
 * current state. Returns `{ unlocked: true }` for decorations with no
 * requirement or with a requirement the guild has satisfied, otherwise
 * a `{ unlocked: false, reason }` object suitable for returning to the
 * client.
 *
 * Known requirement tokens (defined in shared/guildHall.ts):
 *   - "win_guild_war"        — guild has participated in ≥1 war (proxied
 *                              via a guildWarContribution row existing).
 *   - "first_guild_war"      — same as above.
 *   - "guild_sentinel_kill"  — any member has killed Sentinel Prime ≥1.
 *   - "guild_wyrm_kill"      — any member has killed the Chrono Wyrm ≥1.
 *   - "guild_void_kill_10"   — members' Void Leviathan kills sum to ≥10.
 *   - "tier_5"               — guild hall is at tier 5.
 *   - "antiquarian_trust_60" — any member has Antiquarian trust ≥60.
 */
async function isDecorationUnlocked(
  requirement: string | undefined,
  guildId: number,
  hallTier: number,
): Promise<{ unlocked: true } | { unlocked: false; reason: string }> {
  if (!requirement) return { unlocked: true };
  const db = await getDb();
  if (!db) dbUnavailable();

  switch (requirement) {
    case "tier_5":
      return hallTier >= 5
        ? { unlocked: true }
        : { unlocked: false, reason: "Requires Tier 5 (Sanctum) hall" };

    case "win_guild_war":
    case "first_guild_war": {
      const rows = await db
        .select({ id: guildWarContributions.id })
        .from(guildWarContributions)
        .where(eq(guildWarContributions.guildId, guildId))
        .limit(1);
      return rows.length > 0
        ? { unlocked: true }
        : { unlocked: false, reason: "Requires participation in a guild war" };
    }

    case "guild_sentinel_kill":
    case "guild_wyrm_kill":
    case "guild_void_kill_10": {
      const bossKey =
        requirement === "guild_sentinel_kill" ? "panopticon_sentinel"
        : requirement === "guild_wyrm_kill" ? "chrono_wyrm"
        : "void_leviathan";
      const minKills = requirement === "guild_void_kill_10" ? 10 : 1;
      // Sum kills across all guild members for the target boss.
      const members = await db
        .select({ userId: guildMembers.userId })
        .from(guildMembers)
        .where(eq(guildMembers.guildId, guildId));
      if (members.length === 0) {
        return { unlocked: false, reason: "No guild members" };
      }
      const kills = await db
        .select({ kills: bossMastery.kills })
        .from(bossMastery)
        .where(and(
          inArray(bossMastery.userId, members.map((m) => m.userId)),
          eq(bossMastery.bossKey, bossKey),
        ));
      const total = kills.reduce((acc, k) => acc + (k.kills ?? 0), 0);
      return total >= minKills
        ? { unlocked: true }
        : { unlocked: false, reason: `Requires ${minKills}× ${bossKey} guild kills (have ${total})` };
    }

    case "antiquarian_trust_60": {
      // Any member with Antiquarian trust ≥60 unlocks the item for the guild.
      const members = await db
        .select({ userId: guildMembers.userId })
        .from(guildMembers)
        .where(eq(guildMembers.guildId, guildId));
      if (members.length === 0) {
        return { unlocked: false, reason: "No guild members" };
      }
      const progressRows = await db
        .select({ progressData: userProgress.progressData })
        .from(userProgress)
        .where(and(
          inArray(userProgress.userId, members.map((m) => m.userId)),
          eq(userProgress.franchiseId, "dischordian-saga"),
        ));
      const met = progressRows.some((row) => {
        const pd = (row.progressData ?? {}) as Record<string, unknown>;
        const npcTrust = (pd.npcTrust as Record<string, number> | undefined) ?? {};
        return (npcTrust.antiquarian ?? 0) >= 60;
      });
      return met
        ? { unlocked: true }
        : { unlocked: false, reason: "Requires a guild member with Antiquarian trust ≥60" };
    }

    default:
      // Unknown requirement tokens fail closed — better to be strict than
      // accidentally unlock things by typo.
      return { unlocked: false, reason: `Unknown unlock requirement: ${requirement}` };
  }
}

export const guildHallRouter = router({
  /** Full hall state for the current user's guild. */
  getHallState: protectedProcedure.query(async ({ ctx }) => {
    const result = await getGuildForMember(ctx.user.id);
    if (!result?.guild) return null;
    const { guild } = result;

    const hallData = (guild.hallData as HallData | null) ?? DEFAULT_HALL;
    const hallTier = guild.hallTier;
    const tierDef = getHallTier(hallTier);
    const availableRooms = getRoomsForTier(hallTier);
    const nextUpgradeCost = hallTier < 5 ? getUpgradeCost(hallTier) : null;
    const activePerks = getAllPerks(hallTier);
    const passiveBonuses = getTotalPassiveBonuses(hallData.decorations.map((d) => d.decoId));

    return {
      hallTier,
      tierDef,
      unlockedRooms: hallData.unlockedRooms,
      decorations: hallData.decorations,
      treasuryDream: guild.treasuryDream,
      treasuryCredits: guild.treasuryCredits,
      nextUpgradeCost,
      availableRooms,
      allRooms: HALL_ROOMS,
      allDecorations: GUILD_DECORATIONS,
      allTiers: HALL_TIERS,
      activePerks,
      passiveBonuses,
      myRole: result.role,
    };
  }),

  /** Upgrade the guild hall to the next tier. Leader/officer only. */
  upgradeTier: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) dbUnavailable();
    const result = await getGuildForMember(ctx.user.id);
    if (!result?.guild) return { success: false as const, error: "Not in a guild" };
    const { guild, role } = result;

    if (role !== "leader" && role !== "officer") {
      return { success: false as const, error: "Only leaders/officers can upgrade" };
    }

    const currentTier = guild.hallTier;
    const nextTier = currentTier + 1;
    if (nextTier > 5) return { success: false as const, error: "Already max tier" };

    const cost = getUpgradeCost(currentTier);
    if (guild.treasuryDream < cost) {
      return { success: false as const, error: `Need ${cost} Dream in treasury, have ${guild.treasuryDream}` };
    }

    // Auto-unlock all rooms whose tier requirement is met by the new tier.
    const hallData: HallData = (guild.hallData as HallData | null) ?? { ...DEFAULT_HALL };
    const newRooms = HALL_ROOMS.filter((r) => r.tierRequired <= nextTier).map((r) => r.id);
    hallData.unlockedRooms = Array.from(new Set([...hallData.unlockedRooms, ...newRooms]));

    await db.update(guilds)
      .set({
        hallTier: nextTier,
        treasuryDream: guild.treasuryDream - cost,
        hallData,
      })
      .where(eq(guilds.id, guild.id));

    return { success: true as const, newTier: nextTier, unlockedRooms: hallData.unlockedRooms };
  }),

  /** Place a decoration in a hall room. Any member can place. */
  placeDecoration: protectedProcedure
    .input(z.object({
      roomId: z.string(),
      decoId: z.string(),
      x: z.number().min(0),
      y: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const result = await getGuildForMember(ctx.user.id);
      if (!result?.guild) return { success: false as const, error: "Not in a guild" };
      const { guild } = result;

      const hallData: HallData = (guild.hallData as HallData | null) ?? { ...DEFAULT_HALL };
      if (!hallData.unlockedRooms.includes(input.roomId)) {
        return { success: false as const, error: "Room not unlocked" };
      }

      const room = HALL_ROOMS.find((r) => r.id === input.roomId);
      if (!room) return { success: false as const, error: "Unknown room" };

      // Enforce decoration slot capacity.
      const existingInRoom = hallData.decorations.filter((d) => d.roomId === input.roomId).length;
      if (existingInRoom >= room.decorationSlots) {
        return { success: false as const, error: `Room has no free decoration slots (${room.decorationSlots} max)` };
      }

      const deco = GUILD_DECORATIONS.find((d) => d.id === input.decoId);
      if (!deco) return { success: false as const, error: "Unknown decoration" };

      // Unlock gating — decorations with an `unlockRequirement` have to be
      // earned via guild activity (war wins, boss kills, hall tier, NPC trust).
      const unlockCheck = await isDecorationUnlocked(deco.unlockRequirement, guild.id, guild.hallTier);
      if (!unlockCheck.unlocked) {
        return { success: false as const, error: unlockCheck.reason };
      }

      const cost = getDecoCost(input.decoId);
      if (!cost) return { success: false as const, error: "Unknown decoration" };
      if (guild.treasuryDream < cost.dream) {
        return { success: false as const, error: `Need ${cost.dream} Dream, treasury has ${guild.treasuryDream}` };
      }
      if (guild.treasuryCredits < cost.credits) {
        return { success: false as const, error: `Need ${cost.credits} credits, treasury has ${guild.treasuryCredits}` };
      }

      hallData.decorations.push({
        roomId: input.roomId,
        decoId: input.decoId,
        x: input.x,
        y: input.y,
      });

      await db.update(guilds)
        .set({
          treasuryDream: guild.treasuryDream - cost.dream,
          treasuryCredits: guild.treasuryCredits - cost.credits,
          hallData,
        })
        .where(eq(guilds.id, guild.id));

      return {
        success: true as const,
        remainingDream: guild.treasuryDream - cost.dream,
        remainingCredits: guild.treasuryCredits - cost.credits,
      };
    }),

  /** Remove a decoration. Leader/officer only (placement is free to any, but removal is locked to avoid griefing). */
  removeDecoration: protectedProcedure
    .input(z.object({ roomId: z.string(), decoId: z.string(), x: z.number(), y: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const result = await getGuildForMember(ctx.user.id);
      if (!result?.guild) return { success: false as const, error: "Not in a guild" };
      if (result.role !== "leader" && result.role !== "officer") {
        return { success: false as const, error: "Only leaders/officers can remove decorations" };
      }
      const { guild } = result;

      const hallData: HallData = (guild.hallData as HallData | null) ?? { ...DEFAULT_HALL };
      const idx = hallData.decorations.findIndex(
        (d) => d.roomId === input.roomId && d.decoId === input.decoId && d.x === input.x && d.y === input.y
      );
      if (idx === -1) return { success: false as const, error: "Decoration not found" };

      hallData.decorations.splice(idx, 1);

      await db.update(guilds)
        .set({ hallData })
        .where(eq(guilds.id, guild.id));

      return { success: true as const };
    }),
});
