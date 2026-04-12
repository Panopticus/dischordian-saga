/* ═══════════════════════════════════════════════════════
   PRESTIGE NARRATIVE SERVICE — Schedules NPC acknowledgments

   Called by prestige.execute after the reset completes.
   Queues dialog triggers, creates chronicle entries, and
   fires companion comfort gestures.

   Uses notifications table for deferred triggers (player
   sees them when visiting the relevant room/NPC).
   Uses narrativeFlags in gameState for one-time-per-tier gating.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { notifications, loreJournalEntries } from "../../db/schema";
import { logger } from "../logger";
import {
  getImmediateDialogs,
  getDeferredDialogs,
  getPrestigeDialogsForTier,
  getCompanionPrestigeReaction,
  type PrestigeDialog,
} from "@shared/prestigeDialogs";

/**
 * Called after prestige.execute completes. Schedules all NPC acknowledgments.
 */
export async function onPrestigeComplete(
  userId: number,
  newTier: number,
  companionId?: string,
): Promise<{
  immediateDialogs: PrestigeDialog[];
  deferredCount: number;
  chronicleCreated: boolean;
  companionReaction: string | null;
}> {
  const db = await getDb();
  if (!db) {
    return { immediateDialogs: [], deferredCount: 0, chronicleCreated: false, companionReaction: null };
  }

  // 1. Immediate dialogs (Elara re-awakening)
  const immediate = getImmediateDialogs(newTier);
  for (const dialog of immediate) {
    await db.insert(notifications).values({
      userId,
      type: "prestige_dialog",
      title: `Elara — Prestige ${newTier}`,
      message: dialog.text,
    }).catch(e => logger.error("[PrestigeNarrative] Immediate dialog failed:", e));
  }

  // 2. Deferred dialogs (queued as notifications with room context)
  const deferred = getDeferredDialogs(newTier);
  let deferredCount = 0;
  for (const dialog of deferred) {
    await db.insert(notifications).values({
      userId,
      type: "prestige_deferred_dialog",
      title: `${dialog.npcId.replace(/_/g, " ")} — Prestige Acknowledgment`,
      message: dialog.text,
      actionUrl: dialog.triggerRoom ? `/ark?room=${dialog.triggerRoom}` : undefined,
    }).catch(e => logger.error("[PrestigeNarrative] Deferred dialog failed:", e));
    deferredCount++;
  }

  // 3. Antiquarian Chronicle entry (passive discovery in Archives)
  let chronicleCreated = false;
  const antiquarianDialogs = getPrestigeDialogsForTier(newTier)
    .filter(d => d.npcId === "the_antiquarian");

  for (const dialog of antiquarianDialogs) {
    await db.insert(loreJournalEntries).values({
      userId,
      title: dialog.speakerOverride || `Chronicle: Prestige ${newTier}`,
      content: dialog.text,
      category: "chronicle",
      wordCount: dialog.text.split(/\s+/).length,
      xpEarned: 0,
      published: true,
    }).catch(e => logger.error("[PrestigeNarrative] Chronicle entry failed:", e));
    chronicleCreated = true;
  }

  // 4. Meme broadcast commentary (queued as notification).
  // actionUrl takes the player to the Transmission Inbox on click;
  // the NotificationBell also triggers the prestige Meme VO line.
  const memeDialogs = getPrestigeDialogsForTier(newTier)
    .filter(d => d.npcId === "the_meme");
  for (const dialog of memeDialogs) {
    await db.insert(notifications).values({
      userId,
      type: "meme_broadcast",
      title: dialog.speakerOverride || "The Meme — Late Night",
      message: dialog.text,
      actionUrl: "/transmissions",
    }).catch(e => logger.error("[PrestigeNarrative] Meme broadcast failed:", e));
  }

  // 5. Conditional NPC dialogs (Necromancer, Degen — store for later delivery)
  const conditionalDialogs = getPrestigeDialogsForTier(newTier)
    .filter(d => d.trigger === "conditional");
  for (const dialog of conditionalDialogs) {
    await db.insert(notifications).values({
      userId,
      type: "prestige_conditional_dialog",
      title: `${dialog.npcId.replace(/_/g, " ")} — Awaiting Encounter`,
      message: dialog.text,
      actionUrl: dialog.npcId, // Store NPC ID for delivery check
    }).catch(e => logger.error("[PrestigeNarrative] Conditional dialog failed:", e));
  }

  // 6. Companion comfort gesture
  let companionReaction: string | null = null;
  if (companionId) {
    const reaction = getCompanionPrestigeReaction(companionId);
    if (reaction) {
      companionReaction = reaction.description;
      await db.insert(notifications).values({
        userId,
        type: "companion_prestige_gesture",
        title: `${companionId} — Prestige Moment`,
        message: reaction.description,
      }).catch(e => logger.error("[PrestigeNarrative] Companion gesture failed:", e));
    }
  }

  logger.info(`[PrestigeNarrative] Tier ${newTier} for user ${userId}: ${immediate.length} immediate, ${deferredCount} deferred, chronicle=${chronicleCreated}`);

  return {
    immediateDialogs: immediate,
    deferredCount,
    chronicleCreated,
    companionReaction,
  };
}
