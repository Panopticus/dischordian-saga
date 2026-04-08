/* ═══════════════════════════════════════════════════════
   THE RIPPLE ENGINE — Cross-System Event Propagation

   Every action ripples through at least 2 systems.
   Central pub/sub event bus that routes game events to
   multiple systems simultaneously.

   Usage from any router:
     import { ripple } from "../services/rippleEngine";
     await ripple.emit("combat_death", { userId, ... });

   The engine maintains a registry of handlers per event.
   Each handler processes one cross-system consequence.
   This keeps ripple logic CENTRALIZED instead of scattered.
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import {
  notifications,
  eidolonBonds,
  companionRelationships,
  guildWarContributions,
  guildMembers,
  contentParticipation,
} from "../../drizzle/schema";
import { eq, and, sql, gte } from "drizzle-orm";
import { pressureService } from "./pressureService";
import { logger } from "../logger";

/* ─── EVENT TYPES ─── */

export interface RippleEvent {
  userId: number;
  [key: string]: unknown;
}

export interface CombatDeathEvent extends RippleEvent {
  cause: string;
  gameMode: string;
  companionActive?: boolean;
  inGuildWar?: boolean;
  guildWarId?: number;
}

export interface NPCTrustEvent extends RippleEvent {
  npcId: string;
  newTrust: number;
  amount: number;
}

export interface MoralityChoiceEvent extends RippleEvent {
  delta: number; // positive = humanity, negative = machine
  source: string;
}

export interface CompanionEvolvedEvent extends RippleEvent {
  eidolonId: string;
  newStage: string;
  bond: number;
}

export interface CompanionDiedEvent extends RippleEvent {
  eidolonId: string;
  name: string;
  cause: string;
  wasSoulBound: boolean;
  bond: number;
}

export interface PrestigeResetEvent extends RippleEvent {
  newTier: number;
  companionId?: string;
}

export interface GiftSentEvent extends RippleEvent {
  recipientId: number;
  giftType: string;
  amount: number;
}

export interface LoredexDiscoveryEvent extends RippleEvent {
  entryId: string;
  entryType: string;
}

export interface GovernanceVoteEvent extends RippleEvent {
  voteId: string;
  optionNumber: number;
}

export interface SeasonalParticipationEvent extends RippleEvent {
  eventKey: string;
  contribution: number;
}

/* ─── HANDLER TYPE ─── */
type RippleHandler = (event: RippleEvent) => Promise<void>;

/* ─── HANDLER REGISTRY ─── */
const handlers: Record<string, RippleHandler[]> = {};

function on(eventType: string, handler: RippleHandler) {
  if (!handlers[eventType]) handlers[eventType] = [];
  handlers[eventType].push(handler);
}

/* ─── CORE EMIT FUNCTION ─── */

async function emit(eventType: string, event: RippleEvent): Promise<void> {
  const eventHandlers = handlers[eventType];
  if (!eventHandlers || eventHandlers.length === 0) return;

  // Run all handlers concurrently — each is independent
  const results = await Promise.allSettled(
    eventHandlers.map(handler => handler(event))
  );

  // Log any failures without crashing
  for (const result of results) {
    if (result.status === "rejected") {
      logger.error(`[Ripple] Handler failed for "${eventType}":`, result.reason);
    }
  }

  // After all ripples, check if any pressure threshold was crossed
  try {
    await pressureService.checkThresholds();
  } catch (e) {
    logger.error("[Ripple] Threshold check failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════
   HANDLER REGISTRATIONS — Each game event's consequences
   ═══════════════════════════════════════════════════════ */

// ── COMBAT DEATH ──
on("combat_death", async (ev) => {
  const { userId, cause, gameMode } = ev as CombatDeathEvent;
  await pressureService.increment(userId, "deaths", 1, `${gameMode}_death`);
});

on("combat_death", async (ev) => {
  const { userId, companionActive } = ev as CombatDeathEvent;
  if (!companionActive) return;
  const db = await getDb();
  if (!db) return;
  // Active companion takes bond damage on player death
  const [bond] = await db.select().from(eidolonBonds)
    .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.isSoulBound, true)))
    .limit(1);
  if (bond) {
    await db.update(eidolonBonds)
      .set({ bond: sql`GREATEST(0, ${eidolonBonds.bond} - 2)` })
      .where(eq(eidolonBonds.id, bond.id));
  }
});

on("combat_death", async (ev) => {
  const { userId, inGuildWar, guildWarId } = ev as CombatDeathEvent;
  if (!inGuildWar || !guildWarId) return;
  const db = await getDb();
  if (!db) return;
  // Death in guild war penalizes guild score
  const [membership] = await db.select().from(guildMembers)
    .where(eq(guildMembers.userId, userId)).limit(1);
  if (membership) {
    await db.update(guildWarContributions)
      .set({ points: sql`GREATEST(0, ${guildWarContributions.points} - 5)` })
      .where(and(
        eq(guildWarContributions.guildId, membership.guildId),
        eq(guildWarContributions.warId, guildWarId),
      ));
  }
});

// ── NPC TRUST GAINED ──
on("npc_trust_gained", async (ev) => {
  const { userId, amount } = ev as NPCTrustEvent;
  await pressureService.increment(userId, "trustGains", amount, "npc_trust_gain");
});

on("npc_trust_gained", async (ev) => {
  const { userId, npcId, newTrust } = ev as NPCTrustEvent;
  const db = await getDb();
  if (!db) return;
  // Casino breadcrumb when Locke trust crosses 30
  if (npcId === "adjudicator_locke" && newTrust >= 30 && newTrust - (ev as NPCTrustEvent).amount < 30) {
    await db.insert(notifications).values({
      userId,
      type: "feature_hint",
      title: "Locke's Invitation",
      message: "Locke slides a chip across the table. 'There's a place on the Edge of the Shield. Tell them I sent you.' The Degen's Casino is now accessible.",
      actionUrl: "/casino",
    });
  }
});

// ── MORALITY CHOICE ──
on("morality_choice", async (ev) => {
  const { userId, delta, source } = ev as MoralityChoiceEvent;
  if (delta > 0) {
    await pressureService.increment(userId, "moralityHumanity", Math.abs(delta), source);
  } else if (delta < 0) {
    await pressureService.increment(userId, "moralityMachine", Math.abs(delta), source);
  }
});

// ── COMPANION EVOLVED ──
on("companion_evolved", async (ev) => {
  const { userId } = ev as CompanionEvolvedEvent;
  await pressureService.increment(userId, "trustGains", 10, "companion_evolution");
});

on("companion_evolved", async (ev) => {
  const { userId, eidolonId, newStage } = ev as CompanionEvolvedEvent;
  const db = await getDb();
  if (!db) return;
  // Bonus bond XP on evolution
  await db.update(eidolonBonds)
    .set({ xp: sql`${eidolonBonds.xp} + 50` })
    .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.eidolonId, eidolonId)));
});

// ── COMPANION DIED ──
on("companion_died", async (ev) => {
  const { userId, bond } = ev as CompanionDiedEvent;
  // Strong pressure — scales with bond level
  const pressure = Math.min(100, 25 + Math.floor(bond / 10));
  await pressureService.increment(userId, "deaths", pressure, "companion_death");
});

on("companion_died", async (ev) => {
  const { userId, name, wasSoulBound } = ev as CompanionDiedEvent;
  if (!wasSoulBound) return;
  const db = await getDb();
  if (!db) return;
  // Soul-bound death triggers lore event notification
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "The Bond Severed",
    message: `The soul-bond with ${name} has been broken. The Necromancer stirs. Somewhere in the void, a new thread of death-code begins to compile.`,
    actionUrl: "/companions",
  });
  // Extra lore pressure from soul-bound death
  await pressureService.increment(userId, "loreDiscoveries", 5, "soulbond_severed");
});

// ── PRESTIGE RESET ──
on("prestige_reset", async (ev) => {
  const { userId, newTier } = ev as PrestigeResetEvent;
  await pressureService.increment(userId, "loreDiscoveries", 50, `prestige_tier_${newTier}`);
  await pressureService.increment(userId, "exploration", 25, `prestige_tier_${newTier}`);
});

// ── GIFT SENT ──
on("gift_sent", async (ev) => {
  const { userId, recipientId } = ev as GiftSentEvent;
  await pressureService.increment(userId, "trustGains", 2, "gift_sent");

  const db = await getDb();
  if (!db) return;
  // Both sender and receiver get companion bond bonus
  for (const uid of [userId, recipientId]) {
    const [bond] = await db.select().from(eidolonBonds)
      .where(and(eq(eidolonBonds.userId, uid), eq(eidolonBonds.isSoulBound, true)))
      .limit(1);
    if (bond) {
      await db.update(eidolonBonds)
        .set({ bond: sql`${eidolonBonds.bond} + 1` })
        .where(eq(eidolonBonds.id, bond.id));
    }
  }
});

// ── LOREDEX ENTRY DISCOVERED ──
on("loredex_entry_discovered", async (ev) => {
  const { userId } = ev as LoredexDiscoveryEvent;
  await pressureService.increment(userId, "loreDiscoveries", 3, "loredex_entry");
});

on("loredex_entry_discovered", async (ev) => {
  const { userId, entryId } = ev as LoredexDiscoveryEvent;
  // Check for bidirectional episode unlock boost
  // (Handled by episodeService.checkLoredexDiscovery — called separately)
  // This handler just ensures the pressure is recorded
});

// ── GOVERNANCE VOTE ──
on("governance_vote_cast", async (ev) => {
  const { userId } = ev as GovernanceVoteEvent;
  await pressureService.increment(userId, "loreDiscoveries", 3, "governance_vote");
});

// ── SEASONAL EVENT PARTICIPATION ──
on("seasonal_event_participation", async (ev) => {
  const { userId, contribution } = ev as SeasonalParticipationEvent;
  await pressureService.increment(userId, "exploration", Math.min(10, contribution), "seasonal_participation");
});

/* ═══════════════════════════════════════════════════════
   EXPORT — Single public interface
   ═══════════════════════════════════════════════════════ */

export const ripple = {
  emit,
  on,
};
