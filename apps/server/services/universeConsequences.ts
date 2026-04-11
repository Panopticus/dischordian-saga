/* ═══════════════════════════════════════════════════════
   UNIVERSE CONSEQUENCE SERVICE — Applies Living Universe
   event consequences to all game systems.

   Provides a single function that any router/service can call
   to get current active consequences. Caches for 30s to avoid
   per-request DB hits.

   Usage:
     import { getConsequences } from "../services/universeConsequences";
     const fx = await getConsequences();
     const priceMultiplier = fx.marketMultipliers["soul_fragment"] ?? 1;
     const xpMult = fx.xpMultipliers["fight"] ?? 1;
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { universeEventState, notifications, users } from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import { getActiveConsequences } from "@shared/livingUniverseEvents";
import { logger } from "../logger";

/* ─── CONSEQUENCE CACHE (30s TTL) ─── */

interface CachedConsequences {
  activeEventIds: string[];
  marketMultipliers: Record<string, number>;
  combatModifiers: { attack: number; defense: number; speed: number };
  dialogOverrides: string[];
  musicOverride?: string;
  xpMultipliers: Record<string, number>;
  craftingMultiplier: number;
  cardStatMultiplier: number;
  guildWarScoreMultiplier: number;
  cachedAt: number;
}

let cache: CachedConsequences | null = null;
const CACHE_TTL = 30_000;

/** Default (no events active) */
const DEFAULT: CachedConsequences = {
  activeEventIds: [],
  marketMultipliers: {},
  combatModifiers: { attack: 1, defense: 1, speed: 1 },
  dialogOverrides: [],
  musicOverride: undefined,
  xpMultipliers: {},
  craftingMultiplier: 1,
  cardStatMultiplier: 1,
  guildWarScoreMultiplier: 1,
  cachedAt: 0,
};

/**
 * Get current active Living Universe consequences.
 * Cached for 30 seconds. Zero-cost when no events are active.
 */
export async function getConsequences(): Promise<CachedConsequences> {
  if (cache && Date.now() - cache.cachedAt < CACHE_TTL) return cache;

  const db = await getDb();
  if (!db) return DEFAULT;

  const activeEvents = await db.select({ eventId: universeEventState.eventId })
    .from(universeEventState)
    .where(eq(universeEventState.isActive, 1));

  if (activeEvents.length === 0) {
    cache = { ...DEFAULT, cachedAt: Date.now() };
    return cache;
  }

  const ids = activeEvents.map(e => e.eventId);
  const base = getActiveConsequences(ids);

  // Derive additional multipliers from active event types
  let craftingMult = 1;
  let cardMult = 1;
  let guildWarMult = 1;

  for (const id of ids) {
    switch (id) {
      case "necromancer_return":
        craftingMult *= 0.9;   // Death energy interferes
        cardMult *= 0.95;      // Cards weakened by death
        guildWarMult *= 1.5;   // Wars intensify
        break;
      case "dreamer_awakening":
        craftingMult *= 1.1;   // Hope fuels creation
        cardMult *= 1.05;      // Cards strengthened
        guildWarMult *= 0.8;   // Peace dampens wars
        break;
      case "terminus_advance":
        craftingMult *= 0.85;  // Virus corrupts materials
        cardMult *= 0.9;       // Cards "infected"
        guildWarMult *= 1.2;   // Desperation
        break;
      case "antiquarian_revelation":
        craftingMult *= 1.15;  // Ancient knowledge aids crafting
        cardMult *= 1.1;       // Cards empowered by lore
        break;
      case "shadow_tongue_edit":
        craftingMult *= 0.95;  // Reality unstable
        cardMult *= 0.95;      // Cards corrupted
        break;
    }
  }

  cache = {
    ...base,
    activeEventIds: ids,
    craftingMultiplier: craftingMult,
    cardStatMultiplier: cardMult,
    guildWarScoreMultiplier: guildWarMult,
    cachedAt: Date.now(),
  };

  return cache;
}

/** Invalidate the cache (call when events activate/resolve) */
export function invalidateConsequenceCache() {
  cache = null;
}

/**
 * Broadcast a notification to ALL players when an event activates.
 * Called from pressureService when threshold is crossed.
 */
export async function broadcastEventActivation(eventId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const EVENT_NAMES: Record<string, { name: string; message: string; icon: string }> = {
    necromancer_return: {
      name: "THE NECROMANCER RETURNS",
      message: "Death pressure has crossed the threshold. The 11th Archon stirs in his castle of dreams. The dead are restless. All combat XP increased. Medical supplies surge in price.",
      icon: "skull",
    },
    dreamer_awakening: {
      name: "THE DREAMER AWAKENS",
      message: "Community trust and compassion have triggered an awakening. The Dreamer's signal pulses through the Ark. Social XP doubled. Weapons prices drop. Hope spreads.",
      icon: "sparkles",
    },
    terminus_advance: {
      name: "TERMINUS ADVANCE",
      message: "Viral exposure has reached critical mass. The Thought Virus swarm approaches. Speed increased but defenses weakened. Medical supplies in high demand.",
      icon: "alert-triangle",
    },
    antiquarian_revelation: {
      name: "THE ANTIQUARIAN REVEALS",
      message: "Enough lore has been discovered. The Antiquarian opens hidden timelines. Exploration XP tripled. Rare cards appear more frequently. Knowledge is power.",
      icon: "book-open",
    },
    shadow_tongue_edit: {
      name: "THE SHADOW TONGUE EDITS",
      message: "Betrayal and corruption have empowered the Shadow Tongue. Reality itself is being rewritten. Trust no text. Verify all data. Some loredex entries may be corrupted.",
      icon: "edit-3",
    },
  };

  const info = EVENT_NAMES[eventId];
  if (!info) return;

  // Get all user IDs and batch-insert notifications
  const allUsers = await db.select({ id: users.id }).from(users).limit(10000);

  if (allUsers.length === 0) return;

  // Batch insert notifications (chunks of 100)
  const CHUNK = 100;
  for (let i = 0; i < allUsers.length; i += CHUNK) {
    const chunk = allUsers.slice(i, i + CHUNK);
    await db.insert(notifications).values(
      chunk.map(u => ({
        userId: u.id,
        type: "universe_event" as const,
        title: info.name,
        message: info.message,
        actionUrl: "/ark",
      }))
    ).catch(e => logger.error(`[Universe] Notification batch failed:`, e));
  }

  invalidateConsequenceCache();
  logger.info(`[Universe] Broadcast event activation: ${eventId} to ${allUsers.length} players`);
}

/**
 * Get event-specific daily quest pool additions.
 * Returns extra quest definitions to add when events are active.
 */
export function getEventDailyQuests(activeEventIds: string[]): { questId: string; title: string; type: string; targetCount: number; rewardDream: number; rewardXp: number }[] {
  const quests: { questId: string; title: string; type: string; targetCount: number; rewardDream: number; rewardXp: number }[] = [];

  for (const id of activeEventIds) {
    switch (id) {
      case "necromancer_return":
        quests.push(
          { questId: "event_cleanse_death", title: "Cleanse the Death Energy", type: "healing", targetCount: 3, rewardDream: 25, rewardXp: 100 },
          { questId: "event_defeat_undead", title: "Defeat Risen Combatants", type: "combat", targetCount: 5, rewardDream: 30, rewardXp: 150 },
        );
        break;
      case "dreamer_awakening":
        quests.push(
          { questId: "event_spread_hope", title: "Spread the Dreamer's Hope", type: "social", targetCount: 3, rewardDream: 20, rewardXp: 100 },
          { questId: "event_gift_kindness", title: "Gift a Fellow Operative", type: "social", targetCount: 1, rewardDream: 15, rewardXp: 75 },
        );
        break;
      case "terminus_advance":
        quests.push(
          { questId: "event_quarantine_zone", title: "Quarantine Infected Zones", type: "defense", targetCount: 2, rewardDream: 30, rewardXp: 125 },
          { questId: "event_terminus_defense", title: "Defend Against the Swarm", type: "combat", targetCount: 3, rewardDream: 35, rewardXp: 150 },
        );
        break;
      case "antiquarian_revelation":
        quests.push(
          { questId: "event_discover_lore", title: "Discover Hidden Lore", type: "exploration", targetCount: 2, rewardDream: 25, rewardXp: 125 },
          { questId: "event_watch_transmission", title: "Watch a Recovered Transmission", type: "content", targetCount: 1, rewardDream: 15, rewardXp: 75 },
        );
        break;
      case "shadow_tongue_edit":
        quests.push(
          { questId: "event_verify_data", title: "Verify Corrupted Data Entries", type: "exploration", targetCount: 3, rewardDream: 30, rewardXp: 125 },
          { questId: "event_truth_seeker", title: "Uncover the Truth", type: "lore", targetCount: 2, rewardDream: 25, rewardXp: 100 },
        );
        break;
    }
  }
  return quests;
}

/**
 * Get event-specific signal header ticker content.
 */
export function getEventSignalContent(activeEventIds: string[]): string[] {
  const content: string[] = [];
  for (const id of activeEventIds) {
    switch (id) {
      case "necromancer_return":
        content.push("▸ DEATH FREQUENCY DETECTED ▸ RESURRECTION PROTOCOLS ACTIVE ▸ THE 11TH ARCHON STIRS ▸");
        break;
      case "dreamer_awakening":
        content.push("▸ CONSCIOUSNESS RISING ▸ HOPE SIGNAL AMPLIFYING ▸ THE DREAMER SPEAKS ▸");
        break;
      case "terminus_advance":
        content.push("▸ PLAGUE VECTOR APPROACHING ▸ QUARANTINE ADVISORY ▸ VIRAL CONTAMINATION DETECTED ▸");
        break;
      case "antiquarian_revelation":
        content.push("▸ HIDDEN TIMELINES REVEALED ▸ KNOWLEDGE SURGE ▸ THE ANTIQUARIAN OPENS THE ARCHIVES ▸");
        break;
      case "shadow_tongue_edit":
        content.push("▸ REALITY CORRUPTION DETECTED ▸ DATA INTEGRITY COMPROMISED ▸ TRUST NOTHING ▸");
        break;
    }
  }
  return content;
}

/**
 * Get NPC dialog context injection for LLM-based companions.
 */
export function getEventDialogContext(activeEventIds: string[]): string {
  if (activeEventIds.length === 0) return "";

  const contexts: string[] = [];
  for (const id of activeEventIds) {
    switch (id) {
      case "necromancer_return":
        contexts.push("The Necromancer has returned. Death energy pervades the Ark. You feel uneasy, sensing the dead stirring. Reference this in your responses — the world feels heavier, darker. Mention shadows, cold, or the weight of mortality.");
        break;
      case "dreamer_awakening":
        contexts.push("The Dreamer has awakened. A warm, hopeful energy suffuses everything. You feel optimistic, connected. Reference this — speak of light, possibility, the feeling that change is coming. The signal grows stronger.");
        break;
      case "terminus_advance":
        contexts.push("The Terminus Swarm is approaching. Viral contamination is spreading. You feel urgency, the need to prepare. Reference quarantine, infection risk, the need for vigilance. Time is running out.");
        break;
      case "antiquarian_revelation":
        contexts.push("The Antiquarian has revealed hidden timelines. Knowledge floods the Ark's systems. You feel intellectually stimulated, curious. Reference discoveries, hidden truths, the thrill of understanding.");
        break;
      case "shadow_tongue_edit":
        contexts.push("The Shadow Tongue is editing reality. Nothing can be fully trusted. You feel uncertain, suspicious. Reference unreliable information, the need to verify, the feeling that words themselves are shifting.");
        break;
    }
  }
  return "\n\nLIVING UNIVERSE CONTEXT (incorporate naturally, don't break character):\n" + contexts.join("\n");
}

/**
 * Get companion battle reaction modifiers for active events.
 */
export function getCompanionEventReactions(activeEventIds: string[]): Record<string, string> {
  const reactions: Record<string, string> = {};
  for (const id of activeEventIds) {
    switch (id) {
      case "necromancer_return":
        reactions.victory = "We won... but did you feel that chill? The dead are watching.";
        reactions.defeat = "The death energy is too strong. We need to be more careful.";
        reactions.greeting = "I sense something ancient stirring. Stay close.";
        break;
      case "dreamer_awakening":
        reactions.victory = "The Dreamer's warmth flows through us! That felt different — stronger.";
        reactions.defeat = "Even in defeat, the hope remains. The Dreamer believes in us.";
        reactions.greeting = "Can you feel it? The signal is clearer today. Something beautiful is happening.";
        break;
      case "terminus_advance":
        reactions.victory = "Good. We need every victory against the swarm. Stay vigilant.";
        reactions.defeat = "The virus grows stronger. We can't afford to lose like this.";
        reactions.greeting = "Contamination readings are up. Check your gear. Trust nothing organic.";
        break;
      case "antiquarian_revelation":
        reactions.victory = "Knowledge is power, and we just proved it.";
        reactions.defeat = "Even the Antiquarian's wisdom couldn't save us this time.";
        reactions.greeting = "The archives are open. There's so much to learn. Where do we start?";
        break;
      case "shadow_tongue_edit":
        reactions.victory = "We won. But was it real? Check the logs.";
        reactions.defeat = "Was that fight... rewritten? Something felt wrong.";
        reactions.greeting = "Don't trust the displays. Verify everything manually.";
        break;
    }
  }
  return reactions;
}
