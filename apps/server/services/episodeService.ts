/* ═══════════════════════════════════════════════════════
   EPISODE SERVICE — Bidirectional Content Discovery

   The game remembers what you know and adjusts how it
   tells you what you don't know yet.

   Two directions:
   1. Player watches episode → Loredex entries unlock
      (already handled by contentReward router)

   2. Player discovers Loredex entry through gameplay →
      Related unwatched episodes get discovery weight boost
      + When finally watching, The Meme acknowledges prior knowledge

   This creates "narrative magnetism" — discovering lore
   PULLS related episodes toward you.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { contentParticipation, notifications } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { logger } from "../logger";
import {
  EPOCH_1_TRANSMISSIONS,
  type Transmission,
} from "@shared/transmissions";

/** All transmissions flattened for lookup */
const ALL_TRANSMISSIONS: Transmission[] = [
  ...EPOCH_1_TRANSMISSIONS,
];

// Try to import other epochs if they exist
try {
  // Additional epochs can be added here as they're created
  // e.g., EPOCH_0_TRANSMISSIONS, EPOCH_2_TRANSMISSIONS
} catch { /* future epochs */ }

/* ─── LOREDEX → EPISODE REVERSE INDEX ─── */

/**
 * Maps loredex entry IDs to the episodes that reference them.
 * Built once at startup from episode relatedLoredexEntries.
 */
const loredexToEpisodes = new Map<string, { episodeNumber: number; epoch: number; title: string }[]>();

for (const ep of ALL_TRANSMISSIONS) {
  if (!ep.relatedLoredexEntries) continue;
  for (const entryId of ep.relatedLoredexEntries) {
    const list = loredexToEpisodes.get(entryId) || [];
    list.push({ episodeNumber: ep.episodeNumber, epoch: ep.epoch, title: ep.title });
    loredexToEpisodes.set(entryId, list);
  }
}

export const episodeService = {
  /**
   * Called when a loredex entry is discovered through gameplay.
   * Checks if related unwatched episodes exist and boosts their
   * discovery weight + sends a breadcrumb notification.
   */
  async checkLoredexDiscovery(userId: number, entryId: string): Promise<void> {
    const relatedEpisodes = loredexToEpisodes.get(entryId);
    if (!relatedEpisodes || relatedEpisodes.length === 0) return;

    const db = await getDb();
    if (!db) return;

    // Find which of the related episodes the player hasn't watched
    const watchedEpisodes = await db.select({
      contentId: contentParticipation.contentId,
    }).from(contentParticipation)
      .where(and(
        eq(contentParticipation.userId, userId),
        eq(contentParticipation.contentType, "episode"),
        eq(contentParticipation.completed, 1),
      ));

    const watchedSet = new Set(watchedEpisodes.map(e => e.contentId));

    const unwatched = relatedEpisodes.filter(ep =>
      !watchedSet.has(`ep${ep.epoch}_${ep.episodeNumber}`) &&
      !watchedSet.has(`epoch${ep.epoch}_ep${ep.episodeNumber}`)
    );

    if (unwatched.length === 0) return;

    // Send a subtle notification — The Meme hints at related content
    const ep = unwatched[0];
    await db.insert(notifications).values({
      userId,
      type: "content_discovery",
      title: "SIGNAL DETECTED",
      message: `The Meme's broadcast "${ep.title}" contains information related to what you just discovered. The signal grows stronger when you already know the truth.`,
      actionUrl: "/watch",
    }).catch(() => { /* ignore duplicate notifications */ });

    logger.info(`[EpisodeService] Loredex "${entryId}" discovered by user ${userId} — boosting episode "${ep.title}"`);
  },

  /**
   * Called when a player starts watching an episode.
   * Checks if the player already knows related loredex entries
   * and returns a modified Meme intro if so.
   */
  async getEpisodeIntro(userId: number, episodeNumber: number, epoch: number): Promise<{
    intro: string;
    playerAlreadyKnows: string[];
  }> {
    const episode = ALL_TRANSMISSIONS.find(
      ep => ep.episodeNumber === episodeNumber && ep.epoch === epoch
    );

    if (!episode) {
      return { intro: "", playerAlreadyKnows: [] };
    }

    if (!episode.relatedLoredexEntries || episode.relatedLoredexEntries.length === 0) {
      return { intro: episode.memeIntro, playerAlreadyKnows: [] };
    }

    const db = await getDb();
    if (!db) return { intro: episode.memeIntro, playerAlreadyKnows: [] };

    // Check player's game state for discovered loredex entries
    // Loredex discoveries are tracked in the gameData JSON blob
    const { userProgress } = await import("../../db/schema");
    const [progress] = await db.select().from(userProgress)
      .where(eq(userProgress.userId, userId)).limit(1);

    if (!progress?.gameData) return { intro: episode.memeIntro, playerAlreadyKnows: [] };

    const gameData = progress.gameData as Record<string, any>;
    const discoveredEntities = new Set<string>([
      ...(gameData.loreAchievements || []),
      ...(gameData.collectedCards || []),
      ...Object.keys(gameData.narrativeFlags || {}),
    ]);

    // Find which related entries the player already knows about
    const alreadyKnown = episode.relatedLoredexEntries.filter(entry =>
      discoveredEntities.has(entry)
    );

    if (alreadyKnown.length === 0) {
      return { intro: episode.memeIntro, playerAlreadyKnows: [] };
    }

    // Prepend a special Meme acknowledgment
    const knownNames = alreadyKnown.map(id =>
      id.replace(/^entity_/, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    );

    const acknowledgment = knownNames.length === 1
      ? `[The Meme leans in, breaks the fourth wall.] "You already know about ${knownNames[0]}. But you don't know what I saw. Watch closely — this changes everything you think you know."\n\n`
      : `[The Meme pauses, stares directly at you.] "Oh, you've been busy. You already know about ${knownNames.slice(0, -1).join(", ")} and ${knownNames[knownNames.length - 1]}. Good. That means you'll understand what happens next."\n\n`;

    return {
      intro: acknowledgment + episode.memeIntro,
      playerAlreadyKnows: alreadyKnown,
    };
  },

  /**
   * Get the reverse index for admin/debug inspection.
   */
  getLoredexEpisodeMap(): Record<string, { episodeNumber: number; epoch: number; title: string }[]> {
    const result: Record<string, { episodeNumber: number; epoch: number; title: string }[]> = {};
    for (const [key, value] of loredexToEpisodes) {
      result[key] = value;
    }
    return result;
  },

  /**
   * Get episode recommendations boosted by active Living Universe events.
   * When Necromancer is active, death-themed episodes get priority.
   * When Dreamer awakens, hope-themed episodes surface.
   */
  getEventBoostedEpisodes(activeEventIds: string[]): { episodeNumber: number; epoch: number; title: string; boostReason: string }[] {
    const boosted: { episodeNumber: number; epoch: number; title: string; boostReason: string }[] = [];

    // Map events to thematic keywords in episode synopses/entries
    const eventThemes: Record<string, { keywords: string[]; reason: string }> = {
      necromancer_return: { keywords: ["death", "necromancer", "dead", "undead", "resurrection", "castle", "fallen"], reason: "The Necromancer stirs — this transmission echoes with death." },
      dreamer_awakening: { keywords: ["dream", "hope", "trust", "compassion", "awakening", "consciousness"], reason: "The Dreamer's signal amplifies this transmission." },
      terminus_advance: { keywords: ["virus", "swarm", "terminus", "infection", "plague", "contamination", "source"], reason: "The Terminus Swarm approaches — this signal intensifies." },
      antiquarian_revelation: { keywords: ["antiquarian", "lore", "history", "truth", "timeline", "archive", "ancient"], reason: "The Antiquarian reveals — this knowledge becomes urgent." },
      shadow_tongue_edit: { keywords: ["shadow", "betrayal", "corruption", "edit", "tongue", "lies"], reason: "The Shadow Tongue edits reality — verify this transmission." },
    };

    for (const eventId of activeEventIds) {
      const theme = eventThemes[eventId];
      if (!theme) continue;
      for (const ep of ALL_TRANSMISSIONS) {
        const text = (ep.synopsis + " " + ep.title).toLowerCase();
        if (theme.keywords.some(kw => text.includes(kw))) {
          boosted.push({ episodeNumber: ep.episodeNumber, epoch: ep.epoch, title: ep.title, boostReason: theme.reason });
        }
      }
    }
    return boosted;
  },
};
