/**
 * Guild Hall Buffs — server helper.
 *
 * Given a userId, fetch the user's guild, current hall tier, and placed
 * decorations, then resolve them into a stat → percent map using the
 * shared `getGuildHallStatBonuses` helper. Returns `null` if the user
 * is not in a guild.
 *
 * Consumers apply the result via `hallStatMultiplier(bonuses, "xp")`
 * at the point of calculation — see routers/guildWars.ts for an
 * example call site.
 */
import { eq } from "drizzle-orm";
import { guilds, guildMembers } from "../../db/schema";
import { getDb } from "../db";
import {
  getGuildHallStatBonuses,
  hallStatMultiplier,
} from "../../shared/guildHall";

export { hallStatMultiplier };

interface HallData {
  unlockedRooms: string[];
  decorations: { roomId: string; decoId: string; x: number; y: number }[];
}

/** Returns the stat → percent bonuses for the guild the user belongs to,
 *  or `null` if they are not in a guild (or the DB is unavailable). */
export async function getGuildHallBuffs(
  userId: number,
): Promise<Record<string, number> | null> {
  const db = await getDb();
  if (!db) return null;

  const membership = await db
    .select({ guildId: guildMembers.guildId })
    .from(guildMembers)
    .where(eq(guildMembers.userId, userId))
    .limit(1);
  if (!membership[0]) return null;

  const guild = await db
    .select({ hallTier: guilds.hallTier, hallData: guilds.hallData })
    .from(guilds)
    .where(eq(guilds.id, membership[0].guildId))
    .limit(1);
  if (!guild[0]) return null;

  const hallData = (guild[0].hallData as HallData | null) ?? { unlockedRooms: [], decorations: [] };
  return getGuildHallStatBonuses(guild[0].hallTier, hallData.decorations);
}
