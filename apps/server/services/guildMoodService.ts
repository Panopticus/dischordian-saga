/* ═══════════════════════════════════════════════════════
   GUILD MOOD SERVICE — per-guild four-horsemen banner

   Derives a guild's collective mood as the mean of its members'
   personal worldMoodService.forPlayer() readings. Surfaced on
   the Guild Hall page as a "Banner Reading" — a guild whose
   members are deep in War mode literally flies a red banner.

   Cached 60s in process. Pure derivation, never writes.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { worldMoodService } from "./worldMoodService";
import {
  composeWorldMood,
  sumContributions,
  type WorldMood,
} from "@shared/worldMood";
import { logger } from "../logger";

const CACHE_TTL_MS = 60_000;

interface CacheEntry {
  mood: WorldMood;
  expiresAt: number;
}

const cache = new Map<number, CacheEntry>();

function getCached(guildId: number): WorldMood | null {
  const e = cache.get(guildId);
  if (!e) return null;
  if (Date.now() >= e.expiresAt) {
    cache.delete(guildId);
    return null;
  }
  return e.mood;
}

function setCached(guildId: number, mood: WorldMood): void {
  cache.set(guildId, { mood, expiresAt: Date.now() + CACHE_TTL_MS });
}

/**
 * Compose the per-guild banner reading. Returns a neutral mood
 * (all axes at 0; dominantAxis defaults to conquest by tie-break)
 * if the guild has no members or the DB is unavailable.
 */
async function forGuild(guildId: number): Promise<WorldMood> {
  const cached = getCached(guildId);
  if (cached) return cached;

  const db = await getDb();
  if (!db) {
    return composeWorldMood({});
  }

  try {
    const { guildMembers } = await import("../../db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db
      .select({ userId: guildMembers.userId })
      .from(guildMembers)
      .where(eq(guildMembers.guildId, guildId));
    if (rows.length === 0) {
      const mood = composeWorldMood({});
      setCached(guildId, mood);
      return mood;
    }

    const moods = await Promise.all(
      rows.map((r) =>
        worldMoodService
          .forPlayer(r.userId)
          .catch(() => composeWorldMood({})),
      ),
    );

    // Mean across axes. Cast each mood to a contribution part and
    // divide the sum by member count.
    const summed = sumContributions(
      moods.map((m) => ({
        conquest: m.conquest,
        war: m.war,
        famine: m.famine,
        death: m.death,
      })),
    );
    const n = moods.length;
    const mean = composeWorldMood({
      conquest: (summed.conquest ?? 0) / n,
      war: (summed.war ?? 0) / n,
      famine: (summed.famine ?? 0) / n,
      death: (summed.death ?? 0) / n,
    });
    setCached(guildId, mean);
    return mean;
  } catch (err) {
    logger.error(`[guildMood] forGuild(${guildId}) failed:`, err);
    return composeWorldMood({});
  }
}

export const guildMoodService = {
  forGuild,
  /** Test-seam: clear the in-process cache. */
  _clearCache() {
    cache.clear();
  },
};
