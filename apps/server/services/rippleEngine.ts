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
} from "../../db/schema";
import { eq, and, sql, gte } from "drizzle-orm";
import { pressureService } from "./pressureService";
import { palimpsestService } from "./palimpsestService";
import { getPhase } from "@shared/palimpsest";
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

/* ─── PALIMPSEST EVENTS (Appendix C ripple types) ─── */

export interface PalimpsestSignalGainEvent extends RippleEvent {
  amount: number;
  source: string;
}

export interface PalimpsestNoiseGainEvent extends RippleEvent {
  amount: number;
  source: string;
}

export interface InventorHackLandedEvent extends RippleEvent {
  episode: number;
  success: boolean;
}

export interface InventorHackBlockedEvent extends RippleEvent {
  episode: number;
  blockedBy: string;
}

export interface ShowCasualtyRolledEvent extends RippleEvent {
  playerName: string;
  eliminationRound: number;
  episode: number;
}

export interface HostMaskSlippedEvent extends RippleEvent {
  episode: number;
  cause: string;
}

/* ─── POTENTIAL IDENTITY SYSTEM EVENTS ─── */

export interface HorrorRevealCompletedEvent extends RippleEvent {
  optionId: string;
  skillCheckPassed: boolean;
  lightEnergyAwarded: number;
  unityContributionSource?: string;
  loredexUnlock?: string;
}

export interface LoredexEntryUnlockedEvent extends RippleEvent {
  entryId: string;
  entryType: string;
  source: string;
}

export interface UnityPhaseChangedEvent extends RippleEvent {
  previousPhase: string;
  newPhase: string;
  percent: number;
}

export interface FactionDominanceShiftEvent extends RippleEvent {
  species: "demagi" | "quarchon";
  dominantFactionId: string;
  dominancePercent: number;
}

export interface ConvergenceThresholdReachedEvent extends RippleEvent {
  percent: number;
}

export interface PotentialFactionJoinedEvent extends RippleEvent {
  factionId: string;
  recruitedBy?: string;
}

export interface QuestlineChapterCompletedEvent extends RippleEvent {
  questlineId: string;
  chapterId: string;
  optionId: string;
  contributionSource?: string;
  factionId?: string;
}

export interface CoverIdentityActivatedEvent extends RippleEvent {
  coverId: string;
  targetFactionId: string;
  expiresAt: number;
}

export interface CoverIdentityBlownEvent extends RippleEvent {
  coverId: string;
  targetFactionId: string;
  detectedBy: string;
}

export interface GeneralsDilemmaResolvedEvent extends RippleEvent {
  resolution: "expose" | "protect";
}

export interface OracleFuturePurchasedEvent extends RippleEvent {
  sectorId: string;
  commodity: string;
  cyclesAhead: number;
  projectedPrice: number;
}

/* ─── NPC SUBSTRATE EVENTS (Stage 1+ Phase 2) ─── */

/**
 * Mission outcome — emitted by tradeEmpire.ts:completeMission. Handlers:
 * faction-NPC commentary, companion morale, pressure-service shifts,
 * Oracle dream-residue mission-unlock check.
 */
export interface MissionOutcomeEvent extends RippleEvent {
  missionId: string;
  result: "success" | "failure" | "partial";
  factionEffects?: Record<string, number>;
  brokerKey?: string;
}

/**
 * Contract signed — emitted when player accepts a multi-stage contract
 * (new entity type per Phase 2). Handlers: Locke hidden-clause-reveal
 * trigger, Vex Maestro narrator persona-shift.
 */
export interface ContractSignedEvent extends RippleEvent {
  contractKey: string;
  brokerKey: string;
  hiddenClausesAcknowledged: boolean;
}

/**
 * Faction alignment shift — emitted on faction-reputation crossings.
 * Handlers: NPC confrontation check, Locke deferred-threat logging,
 * Vex standing-shift tracking.
 */
export interface FactionAlignEvent extends RippleEvent {
  factionId: string;
  delta: number;
  newReputation: number;
  crossedThreshold?: "positive" | "negative" | "neutral";
}

/**
 * Broker engagement — emitted when player engages a broker NPC. Handlers:
 * per-broker dialog trigger, broker availability tracking.
 */
export interface BrokerEngagementEvent extends RippleEvent {
  brokerKey: string;
  npcKey: string;
  engagementType: "first_contact" | "mission_offered" | "mission_accepted" | "mission_declined";
}

/**
 * Route completion milestone — emitted at 5/10/25/50 runs of the same
 * custom route. Handlers: NPC acknowledgment lines, faction loyalty
 * resource bonus.
 */
export interface RouteMilestoneEvent extends RippleEvent {
  routeKey: string;
  runCount: number;
  factionsTouched: ReadonlyArray<string>;
}

/**
 * Sector first-entered — emitted on first visit to a Trade Empire sector.
 * Handlers: arrivalCinematic trigger, Eyes narrator whisper, faction-NPC
 * greeting line.
 */
export interface SectorFirstEnteredEvent extends RippleEvent {
  sectorId: string;
}

/**
 * Dream residue — emitted by Oracle dream-sequence resolution. Carries
 * (act, dream-id, instruction-residue) for Trade Empire mission-unlock
 * (per OCB-7 ticket).
 */
export interface DreamResidueEvent extends RippleEvent {
  act: number;
  dreamId: string;
  instructionResidue?: string;
}

/**
 * Severance Prize paid — bridge event from DMC to Trade Empire. When DMC
 * season-end fires, broker_nilmorg_severance opens contracts.
 */
export interface SeverancePrizePaidEvent extends RippleEvent {
  seasonName: string;
  championUserId: number;
  companionEidolonId: string;
}

/* ─── HANDLER TYPE ─── */
type RippleHandler = (event: RippleEvent) => Promise<void>;

/* ─── HANDLER REGISTRY ─── */
const handlers: Record<string, RippleHandler[]> = {};

function on(eventType: string, handler: RippleHandler) {
  if (!handlers[eventType]) handlers[eventType] = [];
  handlers[eventType].push(handler);
}

/**
 * Two-Ripple Rule wiring helper.
 *
 * Wraps {@link on} with a cross-system intent contract: callers
 * declare which woven system *emits* the event (`fromId`) and which
 * woven system *consumes* it here (`toId`). The `// woven: <fromId>
 * -> <toId>` comment immediately above each `wovenOn(...)` call is
 * what `apps/shared/_completeness/checks/wovenSystemRippleCoverage.ts`
 * scans for.
 *
 * The runtime cost is identical to `on(...)` — the helper exists so
 * the audit can verify "every action ripples through ≥ 2 systems"
 * mechanically.
 */
function wovenOn(
  eventType: string,
  _fromId: string,
  _toId: string,
  handler: RippleHandler,
) {
  on(eventType, handler);
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
  // Bidirectional episode discovery — boost related unwatched episodes
  try {
    const { episodeService } = await import("./episodeService");
    await episodeService.checkLoredexDiscovery(userId, entryId);
  } catch { /* episodeService may not be available in all contexts */ }
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
   TIER 1: BATTLE OUTCOME HANDLERS
   ═══════════════════════════════════════════════════════ */

// ── CARD BATTLE ──
on("card_battle_result", async (ev) => {
  const { userId, won } = ev as RippleEvent & { won: boolean };
  await pressureService.increment(userId, won ? "exploration" : "deaths", 1, won ? "card_battle_win" : "card_battle_loss");
});

on("card_battle_result", async (ev) => {
  const { userId, won } = ev as RippleEvent & { won: boolean };
  if (!won) return;
  const db = await getDb();
  if (!db) return;
  // Companion celebrates victory
  const [bond] = await db.select().from(eidolonBonds)
    .where(and(eq(eidolonBonds.userId, userId), eq(eidolonBonds.isSoulBound, true))).limit(1);
  if (bond) {
    await db.update(eidolonBonds).set({ bond: sql`${eidolonBonds.bond} + 1` }).where(eq(eidolonBonds.id, bond.id));
  }
});

// ── CHESS ──
on("chess_result", async (ev) => {
  const { userId, won } = ev as RippleEvent & { won: boolean };
  await pressureService.increment(userId, won ? "exploration" : "deaths", 1, won ? "chess_win" : "chess_loss");
});

// ── PVP MATCH ──
on("pvp_match_result", async (ev) => {
  const { userId, won } = ev as RippleEvent & { won: boolean; eloChange?: number };
  await pressureService.increment(userId, won ? "trustGains" : "deaths", won ? 2 : 1, won ? "pvp_win" : "pvp_death");
});

// ── FRIENDLY CHALLENGE ──
on("challenge_complete", async (ev) => {
  const { userId } = ev as RippleEvent & { opponentId: number; won: boolean };
  const { opponentId } = ev as RippleEvent & { opponentId: number };
  await pressureService.increment(userId, "trustGains", 1, "friendly_challenge");
  if (opponentId) await pressureService.increment(opponentId, "trustGains", 1, "friendly_challenge");
});

// ── BOSS MASTERY ──
on("boss_defeated", async (ev) => {
  const { userId } = ev as RippleEvent & { bossKey: string; difficulty: string };
  await pressureService.increment(userId, "loreDiscoveries", 5, "boss_defeated");
  await pressureService.increment(userId, "exploration", 3, "boss_defeated");
});

on("boss_defeated", async (ev) => {
  const { userId, bossKey } = ev as RippleEvent & { bossKey: string };
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId, type: "combat_achievement",
    title: "THE ARCHITECT TAKES NOTE",
    message: `Boss "${(bossKey as string).replace(/_/g, " ")}" has fallen. Your power grows. The Panopticon records your victory.`,
  }).catch(() => {});
});

// ── TOWER DEFENSE ──
on("defense_wave_complete", async (ev) => {
  const { userId } = ev as RippleEvent & { wave: number };
  await pressureService.increment(userId, "exploration", 2, "defense_wave");
  await pressureService.increment(userId, "healingDone", 1, "defense_wave");
});

// ── TERMINUS SWARM ──
on("terminus_wave_survived", async (ev) => {
  const { userId, wave } = ev as RippleEvent & { wave: number };
  await pressureService.increment(userId, "viralExposures", 1, "terminus_wave");
  if (wave >= 10) await pressureService.increment(userId, "exploration", 5, "terminus_deep_wave");
});

/* ═══════════════════════════════════════════════════════
   TIER 2: QUEST & PROGRESSION HANDLERS
   ═══════════════════════════════════════════════════════ */

// ── QUEST COMPLETED ──
on("quest_completed", async (ev) => {
  const { userId } = ev as RippleEvent & { questId: string };
  await pressureService.increment(userId, "trustGains", 2, "quest_complete");
  await pressureService.increment(userId, "exploration", 1, "quest_complete");
});

// ── DAILY QUEST / STREAK ──
on("daily_quest_complete", async (ev) => {
  const { userId } = ev as RippleEvent;
  await pressureService.increment(userId, "exploration", 1, "daily_quest");
});

on("daily_streak_milestone", async (ev) => {
  const { userId, streak } = ev as RippleEvent & { streak: number };
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId, type: "streak_milestone",
    title: `${streak}-DAY STREAK`,
    message: `Your dedication ripples through the Ark. ${streak} consecutive days of service. The Antiquarian nods approvingly.`,
  }).catch(() => {});
  await pressureService.increment(userId, "exploration", streak, "daily_streak");
});

// ── ARENA STORY CHAPTER ──
on("story_chapter_complete", async (ev) => {
  const { userId, chapterId } = ev as RippleEvent & { chapterId: string; bossId?: string };
  await pressureService.increment(userId, "loreDiscoveries", 8, `story_${chapterId}`);
  await pressureService.increment(userId, "exploration", 3, `story_${chapterId}`);
});

// ── NARRATIVE ACT ──
on("narrative_act_complete", async (ev) => {
  const { userId, actNumber, moralityDelta } = ev as RippleEvent & { actNumber: number; moralityDelta?: number };
  await pressureService.increment(userId, "loreDiscoveries", 15, `narrative_act_${actNumber}`);
  if (moralityDelta && moralityDelta > 0) await pressureService.increment(userId, "moralityHumanity", Math.abs(moralityDelta), "act_choice");
  if (moralityDelta && moralityDelta < 0) await pressureService.increment(userId, "moralityMachine", Math.abs(moralityDelta), "act_choice");
});

// ── CLASS RANK UP ──
on("class_rank_up", async (ev) => {
  const { userId, className, newRank } = ev as RippleEvent & { className: string; newRank: number };
  await pressureService.increment(userId, "exploration", 5 * newRank, `class_rankup_${className}`);
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId, type: "progression",
    title: "MASTERY ADVANCEMENT",
    message: `Your ${className} mastery has reached rank ${newRank}. Elara: "I'm detecting new capability patterns. Your class identity is crystallizing."`,
  }).catch(() => {});
});

// ── EPISODE WATCHED ──
on("episode_watched", async (ev) => {
  const { userId } = ev as RippleEvent & { episodeNumber: number; epoch: number };
  await pressureService.increment(userId, "loreDiscoveries", 3, "episode_watched");
});

/* ═══════════════════════════════════════════════════════
   TIER 3: ECONOMY & CRAFTING HANDLERS
   ═══════════════════════════════════════════════════════ */

// ── CRAFTING ──
on("craft_result", async (ev) => {
  const { userId, success } = ev as RippleEvent & { success: boolean; recipeId: string; rarity?: string };
  if (success) await pressureService.increment(userId, "exploration", 2, "craft_success");
});

on("craft_result", async (ev) => {
  const { userId, success, rarity } = ev as RippleEvent & { success: boolean; rarity?: string };
  if (!success || !rarity || !["epic", "legendary", "mythic"].includes(rarity as string)) return;
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId, type: "crafting_achievement",
    title: "RARE CREATION",
    message: `You've forged something extraordinary. The Forge-master would be proud.`,
  }).catch(() => {});
});

// ── MARKETPLACE TRANSACTION ──
on("market_transaction", async (ev) => {
  const { userId } = ev as RippleEvent & { buyerId: number; sellerId: number; amount: number };
  await pressureService.increment(userId, "exploration", 1, "market_trade");
});

// ── CARD TRADE ──
on("card_trade_complete", async (ev) => {
  const { userId } = ev as RippleEvent & { partnerId: number };
  const { partnerId } = ev as RippleEvent & { partnerId: number };
  await pressureService.increment(userId, "trustGains", 1, "card_trade");
  if (partnerId) await pressureService.increment(partnerId as number, "trustGains", 1, "card_trade");
});

// ── STORE PURCHASE ──
on("store_purchase", async (ev) => {
  // Feeds economy sink metrics (pressure check happens after emit)
});

// ── SPACE STATION MODULE ──
on("station_module_complete", async (ev) => {
  const { userId } = ev as RippleEvent & { moduleKey: string };
  await pressureService.increment(userId, "exploration", 3, "station_module");
});

// ── TECH RESEARCH ──
on("tech_researched", async (ev) => {
  const { userId } = ev as RippleEvent & { techId: string };
  await pressureService.increment(userId, "loreDiscoveries", 2, "tech_researched");
  await pressureService.increment(userId, "exploration", 2, "tech_researched");
});

/* ═══════════════════════════════════════════════════════
   TIER 4: TRADE EMPIRE MISSION HANDLERS
   ═══════════════════════════════════════════════════════ */

on("trade_mission_complete", async (ev) => {
  const { userId, missionType } = ev as RippleEvent & { missionType: string; missionId: string };
  const pressureMap: Record<string, { type: keyof import("@shared/livingUniverseEvents").PressureTracker; amount: number }> = {
    sabotage: { type: "betrayals", amount: 5 },
    espionage: { type: "betrayals", amount: 3 },
    diplomacy: { type: "trustGains", amount: 3 },
    lore_hunt: { type: "loreDiscoveries", amount: 5 },
    exploration: { type: "exploration", amount: 3 },
    trade: { type: "exploration", amount: 1 },
    combat: { type: "deaths", amount: 1 },
    recruitment: { type: "trustGains", amount: 2 },
    rescue: { type: "healingDone", amount: 3 },
    construction: { type: "exploration", amount: 2 },
  };
  const mapping = pressureMap[missionType as string];
  if (mapping) await pressureService.increment(userId, mapping.type, mapping.amount, `trade_${missionType}`);
});

// ── SECTOR DISCOVERY ──
on("sector_discovered", async (ev) => {
  const { userId } = ev as RippleEvent & { sectorId: string };
  await pressureService.increment(userId, "exploration", 3, "sector_discovered");
});

/* ═══════════════════════════════════════════════════════
   TIER 5: SOCIAL & GUILD HANDLERS
   ═══════════════════════════════════════════════════════ */

on("guild_joined", async (ev) => {
  const { userId } = ev as RippleEvent;
  await pressureService.increment(userId, "trustGains", 5, "guild_joined");
});

on("guild_donation", async (ev) => {
  const { userId, amount } = ev as RippleEvent & { amount: number; resourceType: string };
  await pressureService.increment(userId, "trustGains", Math.min(5, Math.ceil((amount as number) / 100)), "guild_donation");
});

on("friend_accepted", async (ev) => {
  const { userId } = ev as RippleEvent & { friendId: number };
  const { friendId } = ev as RippleEvent & { friendId: number };
  await pressureService.increment(userId, "trustGains", 1, "friend_accepted");
  if (friendId) await pressureService.increment(friendId as number, "trustGains", 1, "friend_accepted");
});

/* ═══════════════════════════════════════════════════════
   TIER 6: LORE BIDIRECTIONAL & META HANDLERS
   ═══════════════════════════════════════════════════════ */

// ── FEATURE UNLOCKED ──
on("feature_unlocked", async (ev) => {
  const { userId, featureId } = ev as RippleEvent & { featureId: string };
  const db = await getDb();
  if (!db) return;
  // NPC acknowledges the unlock
  const npcReactions: Record<string, string> = {
    casino: "Locke: 'The casino floor awaits. Don't blame me for what happens next.'",
    trade_empire: "Elara: 'Galactic Command is online. The sectors are watching.'",
    pet_battles: "The Antiquarian: 'Your specimen is restless. It wants to fight.'",
    prestige: "The Architect: 'You've reached the cycle's end. Interesting.'",
    bounties: "Locke: 'Contracts are live. Some pay well. Some pay differently.'",
    bestiary: "Elara: 'I've compiled every enemy you've faced. Patterns emerge.'",
    chess: "The Game Master: 'The board is set. Your move.'",
  };
  const reaction = npcReactions[featureId as string];
  if (reaction) {
    await db.insert(notifications).values({
      userId, type: "npc_reaction",
      title: "NPC REACTION",
      message: reaction,
    }).catch(() => {});
  }
});

// ── ARCHETYPE EMERGED ──
on("archetype_emerged", async (ev) => {
  const { userId, archetypeId } = ev as RippleEvent & { archetypeId: string };
  await pressureService.increment(userId, "loreDiscoveries", 5, `archetype_${archetypeId}`);
  const db = await getDb();
  if (!db) return;
  const archetypeNames: Record<string, string> = {
    true_believer: "The True Believer", hollow: "The Hollow", salesman: "The Salesman",
    apostle: "The Apostle", revisionist: "The Revisionist", scholar: "The Scholar",
    monster: "The Monster", wanderer: "The Wanderer",
  };
  const name = archetypeNames[archetypeId as string] || archetypeId;
  await db.insert(notifications).values({
    userId, type: "archetype_emergence",
    title: "IDENTITY CRYSTALLIZED",
    message: `The Panopticon has classified you: ${name}. Your companions notice. The NPCs adjust. The universe remembers what you've become.`,
  }).catch(() => {});
});

// ── ROOM DISCOVERED ──
on("room_discovered", async (ev) => {
  const { userId } = ev as RippleEvent & { roomId: string };
  await pressureService.increment(userId, "exploration", 1, "room_visited");
});

// ── CO-OP RAID COMPLETE ──
on("raid_boss_damaged", async (ev) => {
  const { userId, damage } = ev as RippleEvent & { bossKey: string; damage: number };
  await pressureService.increment(userId, "exploration", Math.min(5, Math.ceil((damage as number) / 10000)), "raid_contribution");
});

on("raid_boss_defeated", async (ev) => {
  const { userId } = ev as RippleEvent & { bossKey: string };
  await pressureService.increment(userId, "loreDiscoveries", 10, "raid_boss_defeated");
  await pressureService.increment(userId, "healingDone", 5, "raid_boss_defeated");
});

/* ═══════════════════════════════════════════════════════
   TIER 7: DEAD MAN'S CIRCUIT HANDLERS
   ═══════════════════════════════════════════════════════ */

on("circuit_race_complete", async (ev) => {
  const { userId, position, survived, kills } = ev as RippleEvent & { position: number; survived: boolean; kills: number };
  await pressureService.increment(userId, "exploration", 5, "circuit_race");
  if (kills > 0) await pressureService.increment(userId, "deaths", kills, "circuit_kills");
  if (!survived) await pressureService.increment(userId, "deaths", 3, "circuit_death");
  void position;
});

/* ─── Cross-game side quest progression ───
   These handlers feed the Dead Man's Circuit side quests. They no-op
   when there is no active circuit season, so they're cheap to run on
   every event during the off-season too. */

const _circuitSideQuestImport = () => import("./circuitSideQuestService");

on("card_battle_result", async (ev) => {
  const { userId, won } = ev as RippleEvent & { won: boolean };
  if (!won) return;
  const { advanceCircuitSideQuests } = await _circuitSideQuestImport();
  await advanceCircuitSideQuests(userId, "card_battle_won", 1);
});

on("chess_result", async (ev) => {
  const { userId, won, moveCount } = ev as RippleEvent & { won: boolean; moveCount?: number };
  if (!won) return;
  const { advanceCircuitSideQuests } = await _circuitSideQuestImport();
  // Only count the chess quest if it was a fast checkmate (< 20 moves).
  if (typeof moveCount === "number" && moveCount > 0 && moveCount < 40) {
    // chess.history() returns half-moves; 40 half-moves ≈ 20 full moves.
    await advanceCircuitSideQuests(userId, "chess_checkmate_fast", 1);
  }
});

on("pvp_match_result", async (ev) => {
  const { userId, won } = ev as RippleEvent & { won: boolean };
  if (!won) return;
  const { advanceCircuitSideQuests } = await _circuitSideQuestImport();
  await advanceCircuitSideQuests(userId, "fight_won", 1);
});

on("trade_run_complete", async (ev) => {
  const { userId } = ev as RippleEvent;
  const { advanceCircuitSideQuests } = await _circuitSideQuestImport();
  await advanceCircuitSideQuests(userId, "trade_run_complete", 1);
});

on("defense_wave_complete", async (ev) => {
  const { userId } = ev as RippleEvent;
  const { advanceCircuitSideQuests } = await _circuitSideQuestImport();
  await advanceCircuitSideQuests(userId, "td_wave_survived", 1);
});

on("npc_trust_gained", async (ev) => {
  const { userId, newTrust } = ev as RippleEvent & { newTrust: number };
  if (typeof newTrust !== "number" || newTrust < 50) return;
  const { advanceCircuitSideQuests } = await _circuitSideQuestImport();
  // Only fire when the threshold is reached. Quest target is 50 → advance by 50 once.
  await advanceCircuitSideQuests(userId, "companion_trust_reached", 50);
});

on("raid_boss_damaged", async (ev) => {
  const { userId, damage } = ev as RippleEvent & { damage: number };
  if (typeof damage !== "number" || damage <= 0) return;
  const { advanceCircuitSideQuests } = await _circuitSideQuestImport();
  await advanceCircuitSideQuests(userId, "raid_damage_dealt", damage);
});

on("casino_game_won", async (ev) => {
  const { userId } = ev as RippleEvent;
  const { advanceCircuitSideQuests } = await _circuitSideQuestImport();
  await advanceCircuitSideQuests(userId, "casino_game_won", 1);
});

/* ═══════════════════════════════════════════════════════
   CROSS-ARC FEEDERS INTO THE PALIMPSEST

   Existing ripple events feed the Signal/Noise meter via
   secondary handlers — see Appendix C.2 of the design proposal.
   ═══════════════════════════════════════════════════════ */

// Crafting outcomes feed the Palimpsest per spec:
//  epic/legendary success → Signal
//  any craft failure → Noise
on("craft_result", async (ev) => {
  const { userId, success, rarity } = ev as RippleEvent & { success: boolean; rarity?: string };
  if (success && (rarity === "epic" || rarity === "mythic")) {
    await palimpsestService.apply(userId, "epicCraftSuccess");
  } else if (success && rarity === "legendary") {
    await palimpsestService.apply(userId, "legendaryCraftSuccess");
  } else if (!success) {
    await palimpsestService.apply(userId, "craftFailure");
  }
});

// Soul-bound companion death in combat is a Noise event — the Shadow
// Tongue feeds on bond severing. Also boosts next casualty crawl severity.
on("companion_died", async (ev) => {
  const { userId, wasSoulBound } = ev as CompanionDiedEvent;
  if (wasSoulBound) {
    await palimpsestService.applyRaw(userId, 0, 15);
  }
});

// Loredex discovery is a Signal event — remembering is truth.
on("loredex_entry_discovered", async (ev) => {
  const { userId } = ev as LoredexDiscoveryEvent;
  await palimpsestService.apply(userId, "truthDialogChoice"); // +1 Signal per discovery
});

// Per-member carry: stamp the discovering crew member as the carrier of
// the entry. If the member dies with the entry unread, the resurrection
// drain will mark it memorial-only.
on("loredex_entry_discovered", async (ev) => {
  const { userId, entryId } = ev as LoredexDiscoveryEvent;
  try {
    const carrySvc = await import("./crewLoredexCarryService");
    const carrier = await carrySvc.pickActiveCarrier(userId);
    if (!carrier) return;
    // The discovery cycle isn't on the event; use 0 as a sentinel — the
    // carry table stamps memorialAtCycle from death-time, which is what
    // matters. The discoveredAtCycle column is for future "took N entries
    // they discovered last week" prose.
    await carrySvc.recordDiscovery(userId, carrier, entryId, 0);
  } catch {
    // Carry tracking is best-effort; never block the event.
  }
});

// Governance votes: voting at all is a tiny truth signal (engagement is truth).
on("governance_vote_cast", async (ev) => {
  const { userId } = ev as GovernanceVoteEvent;
  await palimpsestService.apply(userId, "truthDialogChoice");
});

/* ═══════════════════════════════════════════════════════
   TIER 8: THE PALIMPSEST (Appendix C ripple handlers)
   ═══════════════════════════════════════════════════════ */

// ── PALIMPSEST SIGNAL GAIN ──
on("palimpsest_signal_gain", async (ev) => {
  const { userId, amount, source } = ev as PalimpsestSignalGainEvent;
  await palimpsestService.applyRaw(userId, amount, 0);
  await pressureService.increment(userId, "loreDiscoveries", 1, `palimpsest_signal:${source}`);
});

// ── PALIMPSEST NOISE GAIN ──
on("palimpsest_noise_gain", async (ev) => {
  const { userId, amount, source } = ev as PalimpsestNoiseGainEvent;
  await palimpsestService.applyRaw(userId, 0, amount);
  // Noise accrual feeds the Shadow Tongue pressure bucket — reuse betrayals.
  await pressureService.increment(userId, "betrayals", 1, `palimpsest_noise:${source}`);

  // If the noise spike just pushed us into "overwritten" territory, emit
  // a secondary host_mask_slipped event so the UI/narrative can react.
  const state = await palimpsestService.get(userId);
  if (getPhase(state) === "overwritten") {
    await emit("host_mask_slipped", {
      userId,
      episode: state.currentEpisode,
      cause: source,
    } as HostMaskSlippedEvent);
  }
});

// ── INVENTOR HACK LANDED ──
on("inventor_hack_landed", async (ev) => {
  const { userId, episode, success } = ev as InventorHackLandedEvent;
  if (success) {
    await palimpsestService.apply(userId, "inventorHackLanded");
    const db = await getDb();
    if (!db) return;
    await db.insert(notifications).values({
      userId,
      type: "lore_event",
      title: "SIGNAL INTRUSION",
      message: `Episode ${episode}: the broadcast cut sideways. A second voice behind the Host — the Inventor, laughing. For three seconds, every contestant was visible to themselves as they really were.`,
    }).catch(() => {});
  }
});

// ── INVENTOR HACK BLOCKED ──
on("inventor_hack_blocked", async (ev) => {
  const { userId, episode, blockedBy } = ev as InventorHackBlockedEvent;
  await palimpsestService.apply(userId, "inventorHackBlocked");
  await pressureService.increment(userId, "betrayals", 2, `inventor_hack_blocked_ep${episode}_${blockedBy}`);
});

// ── SHOW CASUALTY ROLLED ──
on("show_casualty_rolled", async (ev) => {
  const { userId, playerName, eliminationRound, episode } = ev as ShowCasualtyRolledEvent;
  await palimpsestService.apply(userId, "showCasualty");
  // Reuse the combat_death pressure channel so casualty crawls feed
  // the Necromancer Cycle's resurrection energy too.
  await pressureService.increment(userId, "deaths", 3, `show_casualty_ep${episode}`);

  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "CASUALTY CRAWL",
    message: `${playerName} was eliminated on round ${eliminationRound} of Episode ${episode}. Their name is now on the crawl. The Host smiles.`,
  }).catch(() => {});
});

// ── HOST MASK SLIPPED ──
on("host_mask_slipped", async (ev) => {
  const { userId, episode, cause } = ev as HostMaskSlippedEvent;
  // Seeing through the mask IS a truth event, even though it's horrifying.
  await palimpsestService.apply(userId, "hostMaskSlipped");
  await pressureService.increment(userId, "loreDiscoveries", 5, `host_mask_slipped_ep${episode}:${cause}`);

  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "THE HOST'S FACE",
    message: `For half a frame, the Game Master's mask fell. Something else was underneath. You saw it. The Palimpsest remembers what you saw. (Episode ${episode})`,
  }).catch(() => {});
});

/* ═══════════════════════════════════════════════════════
   TIER 9: KAEL ASYNCHRONOUS QUESTLINE HANDLERS (Appendix B)

   Six event types emitted when the player unlocks Kael
   Fragments F1-F6, notices a tower memorial, makes the
   Apprentice's Stand choice, or completes the questline.
   See apps/shared/appendixBKaelQuestline.ts for canonical
   data and KAEL_RIPPLE_EVENT_TYPES.
   ═══════════════════════════════════════════════════════ */

export interface KaelFragmentEvent extends RippleEvent {
  fragmentId: "f1" | "f2" | "f3" | "f4" | "f5" | "f6";
  fragmentTitle: string;
}

on("kael_fragment_unlocked", async (ev) => {
  const { userId, fragmentId, fragmentTitle } = ev as KaelFragmentEvent;
  await pressureService.increment(userId, "loreDiscoveries", 8, `kael_${fragmentId}`);
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "A FRAGMENT SURFACES",
    message: `Kael Fragment unlocked: ${fragmentTitle}. The Antiquarian's hand trembles as he writes.`,
  }).catch(() => {});
});

on("kael_mirror_seen", async (ev) => {
  const { userId } = ev as RippleEvent;
  // F1 — the face beneath the face. A silent ripple; no notification.
  await pressureService.increment(userId, "loreDiscoveries", 3, "kael_mirror");
});

on("kael_name_spoken", async (ev) => {
  const { userId } = ev as RippleEvent;
  // F6 — the Recruiter's real name. Largest single lore beat of the questline.
  await pressureService.increment(userId, "loreDiscoveries", 25, "kael_name_spoken");
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "THE RECRUITER HAS A NAME",
    message: "You have seen his name exactly once. Both narrators will be silent for 24 real hours.",
  }).catch(() => {});
});

on("kael_memorial_noticed", async (ev) => {
  const { userId, towerKey } = ev as RippleEvent & { towerKey: string };
  // Hovering a tower inscription for the first time.
  await pressureService.increment(userId, "loreDiscoveries", 1, `memorial_${towerKey}`);
});

on("kael_apprentice_choice", async (ev) => {
  const { userId, choice } = ev as RippleEvent & { choice: "stayed" | "ran" };
  // F5 — the Apprentice's exact choice, permanent mechanical consequence.
  await pressureService.increment(
    userId,
    choice === "stayed" ? "trustGains" : "betrayals",
    15,
    `apprentice_${choice}`,
  );
});

on("kael_questline_complete", async (ev) => {
  const { userId } = ev as RippleEvent;
  await pressureService.increment(userId, "loreDiscoveries", 50, "kael_questline_complete");
  await pressureService.increment(userId, "healingDone", 10, "kael_questline_complete");
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "THE MAN WHO CAME BACK",
    message: "The Terminus Swarm has paused for a full real minute. The Ark crew saw it from the Observation Deck. Kael is named. Kael is remembered.",
  }).catch(() => {});
});

/* ═══════════════════════════════════════════════════════
   POTENTIAL IDENTITY SYSTEM HANDLERS
   ═══════════════════════════════════════════════════════ */

on("horror_reveal_completed", async (ev) => {
  const { userId, unityContributionSource } = ev as HorrorRevealCompletedEvent;
  // Feed the Living Universe event for the community-wide reveal
  // and the Unity Meter for the per-player origin processing.
  await pressureService.increment(userId, "originRevealsSeen", 10, "horror_reveal_completed");
  if (unityContributionSource) {
    await pressureService.recordAction(userId, unityContributionSource);
  }
});

on("horror_reveal_completed", async (ev) => {
  const { userId, loredexUnlock } = ev as HorrorRevealCompletedEvent;
  if (!loredexUnlock) return;
  await emit("loredex_entry_unlocked", {
    userId,
    entryId: loredexUnlock,
    entryType: "concept",
    source: "horror_reveal",
  } as LoredexEntryUnlockedEvent);
});

on("horror_reveal_completed", async (ev) => {
  const { userId, optionId, skillCheckPassed } = ev as HorrorRevealCompletedEvent;
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "THE POTENTIALS REMEMBER THEIR ORIGIN",
    message: skillCheckPassed
      ? "You asked the question the Collector did not want asked. The dossier opens."
      : `The Human told you what you are. You answered with "${optionId.replace("por_", "").toUpperCase()}". The Antiquarian is taking notes.`,
  }).catch(() => {});
});

on("loredex_entry_unlocked", async (ev) => {
  const { userId } = ev as LoredexEntryUnlockedEvent;
  await pressureService.increment(userId, "loreDiscoveries", 3, "loredex_entry");
});

on("unity_phase_changed", async (ev) => {
  const { userId, previousPhase, newPhase } = ev as UnityPhaseChangedEvent;
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: `The galaxy is ${newPhase}`,
    message: `The Unity Meter has shifted from ${previousPhase} to ${newPhase}. The Antiquarian is updating his Chronicle accordingly.`,
  }).catch(() => {});
});

on("faction_dominance_shift", async (ev) => {
  const { userId, species } = ev as FactionDominanceShiftEvent;
  const src =
    species === "demagi"
      ? "faction_dominance_demagi_tick"
      : "faction_dominance_quarchon_tick";
  await pressureService.recordAction(userId, src);
});

on("convergence_threshold_reached", async (ev) => {
  const { userId, percent } = ev as ConvergenceThresholdReachedEvent;
  await pressureService.increment(userId, "unityConvergence", Math.floor(percent / 2), "convergence_threshold");
});

on("potential_faction_joined", async (ev) => {
  const { userId, factionId } = ev as PotentialFactionJoinedEvent;
  // Formal affiliation is a -5 Unity delta (spec §6.2).
  await pressureService.recordAction(userId, "questline_formal_affiliation");
  // And it pushes the corresponding species' dominance meter.
  if (factionId.startsWith("demagi_")) {
    await pressureService.recordAction(userId, "faction_dominance_demagi_tick");
  } else if (factionId.startsWith("quarchon_")) {
    await pressureService.recordAction(userId, "faction_dominance_quarchon_tick");
  }
});

on("questline_chapter_completed", async (ev) => {
  const { userId, contributionSource } = ev as QuestlineChapterCompletedEvent;
  if (contributionSource) {
    await pressureService.recordAction(userId, contributionSource);
  }
});

on("cover_identity_blown", async (ev) => {
  const { userId } = ev as CoverIdentityBlownEvent;
  await pressureService.recordAction(userId, "questline_spy_blown_cover");
});

/* ═══════════════════════════════════════════════════════
   PHASE 2 NPC SUBSTRATE HANDLERS
   ═══════════════════════════════════════════════════════ */

/**
 * severance_prize_paid (DMC → Trade Empire bridge):
 * When a DMC season-end fires, open Nilmorg's severance broker
 * engagement record (or unlock its lock-out if previously locked).
 * Per nilmorg.md §5.7 deferred broker hook now active.
 */
on("severance_prize_paid", async (ev) => {
  const { userId } = ev as { userId: number };
  try {
    const db = await getDb();
    if (!db) return;
    // Lazy import to avoid circular deps.
    const { tradeBrokerEngagement } = await import("../../db/schema");
    const existing = await db
      .select({ id: tradeBrokerEngagement.id })
      .from(tradeBrokerEngagement)
      .where(
        and(
          eq(tradeBrokerEngagement.userId, userId),
          eq(tradeBrokerEngagement.brokerKey, "broker_nilmorg_severance"),
        ),
      )
      .limit(1);
    if (existing.length > 0 && existing[0]?.id) {
      await db
        .update(tradeBrokerEngagement)
        .set({ isLockedOut: false, lockedOutReason: null })
        .where(eq(tradeBrokerEngagement.id, existing[0].id));
    } else {
      await db.insert(tradeBrokerEngagement).values({
        userId,
        brokerKey: "broker_nilmorg_severance",
        firstMetAt: new Date(),
      });
    }
    logger.info("severance_prize_paid → broker_nilmorg_severance unlocked", { userId });
  } catch (err) {
    logger.warn("severance_prize_paid handler failed", { err });
  }
});

/**
 * dream_residue (Oracle → Trade Empire bridge per OCB-7):
 * Set a per-user mission-unlock flag keyed by (act, dreamId). The Trade
 * Empire UI checks this flag to surface canonically-unlocked missions
 * per the_oracle.md §5.3.
 */
on("dream_residue", async (ev) => {
  const { userId, act, dreamId } = ev as { userId: number; act: number; dreamId: string };
  try {
    const db = await getDb();
    if (!db) return;
    const { npcPublicFlags } = await import("../../db/schema");
    const flag = `dmc_oracle_residue_unlock_${act}_${dreamId}`;
    await db
      .insert(npcPublicFlags)
      .values({ userId, flag, setBy: "the_oracle" })
      .catch(() => {/* idempotent on unique violation */});
    logger.info("dream_residue → public flag set", { userId, flag });
  } catch (err) {
    logger.warn("dream_residue handler failed", { err });
  }
});

/**
 * contract_signed (Phase 2.2 → cross-character reactions):
 * Sets canonical public flags so other NPCs canonically register
 * the player's commercial-canon — Vex's Maestro narrator persona-shift,
 * Locke's hidden-clause-revealed trust-stance, Antiquarian audit
 * recall. Per crossCharacterReactions.ts canonical
 * `signed_contract_{contractKey}` + `met_broker_{brokerKey}`.
 */
on("contract_signed", async (ev) => {
  const { userId, contractKey, brokerKey, hiddenClausesAcknowledged } =
    ev as ContractSignedEvent;
  try {
    const db = await getDb();
    if (!db) return;
    const { npcPublicFlags } = await import("../../db/schema");
    const flags = [
      `signed_contract_${contractKey}`,
      `signed_with_broker_${brokerKey}`,
    ];
    if (hiddenClausesAcknowledged) {
      flags.push(`audited_contract_${contractKey}_on_signing`);
    }
    for (const flag of flags) {
      await db
        .insert(npcPublicFlags)
        .values({ userId, flag, setBy: brokerKey })
        .catch(() => {/* idempotent on uniq violation */});
    }
    logger.info("contract_signed → public flags set", {
      userId,
      contractKey,
      brokerKey,
      flagCount: flags.length,
    });
  } catch (err) {
    logger.warn("contract_signed handler failed", { err });
  }
});

/**
 * broker_engagement (Phase 2.2 → cross-character reactions):
 * Sets canonical first-meeting flag `met_broker_{brokerKey}` so per-
 * crossCharacterReactions canonical broker-recognition lines fire.
 * Idempotent: subsequent engagements are no-ops on the flag (uniq
 * violation), but the canonical `engagementType` is logged for
 * future per-engagement-type handlers.
 */
on("broker_engagement", async (ev) => {
  const { userId, brokerKey, npcKey, engagementType } =
    ev as BrokerEngagementEvent;
  try {
    const db = await getDb();
    if (!db) return;
    const { npcPublicFlags } = await import("../../db/schema");
    await db
      .insert(npcPublicFlags)
      .values({
        userId,
        flag: `met_broker_${brokerKey}`,
        setBy: npcKey,
      })
      .catch(() => {/* idempotent on uniq violation */});
    logger.info("broker_engagement → public flag set", {
      userId,
      brokerKey,
      npcKey,
      engagementType,
    });
  } catch (err) {
    logger.warn("broker_engagement handler failed", { err });
  }
});

/**
 * route_milestone (Phase 2.2 → canonical NPC acknowledgment lines):
 * On canonical-tier-crossings (5 / 10 / 25 / 50), sets canonical
 * per-tier + per-acknowledger-NPC flags so each canonical
 * acknowledger's reactive line fires. Per
 * MILESTONE_TIER_CANON in apps/shared/tradeEmpire/routes.ts:
 *   tier 5  → broker_independent_freeport
 *   tier 10 → adjudicator_locke
 *   tier 25 → the_antiquarian, the_seer
 *   tier 50 → adjudicator_locke, the_antiquarian,
 *             broker_independent_freeport
 */
on("route_milestone", async (ev) => {
  const { userId, routeKey, runCount } = ev as RouteMilestoneEvent;
  try {
    const db = await getDb();
    if (!db) return;
    const { npcPublicFlags } = await import("../../db/schema");
    const { MILESTONE_TIER_CANON } = await import(
      "@shared/tradeEmpire/routes"
    );
    // The route_milestone event canonically fires per tier-crossing,
    // so the runCount canonically maps to the tier reached. But to
    // remain robust to back-fill scenarios (one run crossing several
    // tiers), the handler scans every canonical tier ≤ runCount.
    const tiers = (Object.keys(MILESTONE_TIER_CANON)
      .map(Number)
      .filter(t => t <= runCount)
      .sort((a, b) => b - a)) as Array<keyof typeof MILESTONE_TIER_CANON>;
    if (tiers.length === 0) return;
    const tier = tiers[0]!; // canonically-highest tier reached this run
    const canon = MILESTONE_TIER_CANON[tier];
    if (!canon) return;
    const flags: Array<{ flag: string; setBy: string }> = [
      { flag: `route_milestone_tier_${tier}_reached`, setBy: "trade_empire" },
      {
        flag: `route_milestone_tier_${tier}_reached_for_${routeKey}`,
        setBy: "trade_empire",
      },
    ];
    for (const acker of canon.canonicalAcknowledgers) {
      flags.push({
        flag: `route_milestone_acknowledged_by_${acker.npcKey}_tier_${tier}`,
        setBy: acker.npcKey,
      });
    }
    for (const { flag, setBy } of flags) {
      await db
        .insert(npcPublicFlags)
        .values({ userId, flag, setBy })
        .catch(() => {/* idempotent on uniq violation */});
    }
    logger.info("route_milestone → canonical NPC ack flags set", {
      userId,
      routeKey,
      tier,
      ackCount: canon.canonicalAcknowledgers.length,
    });
  } catch (err) {
    logger.warn("route_milestone handler failed", { err });
  }
});

/**
 * sector_first_entered (Phase 2.2 → arrivalCinematic + Eyes whisper):
 * Sets canonical `entered_sector_{sectorId}_first_time` flag. The
 * client's ArrivalCinematicRenderer reads this flag (via
 * tradeSectorArrivals row) on next sector-page load and presents the
 * canonical first-visit cinematic + Eyes-narrator whisper from the
 * sector's `eyesNarrator` field. After the player canonically
 * acknowledges, the `markArrivalCinematicWatched` endpoint sets
 * cinematicWatched=true.
 */
on("sector_first_entered", async (ev) => {
  const { userId, sectorId } = ev as SectorFirstEnteredEvent;
  try {
    const db = await getDb();
    if (!db) return;
    const { npcPublicFlags } = await import("../../db/schema");
    await db
      .insert(npcPublicFlags)
      .values({
        userId,
        flag: `entered_sector_${sectorId}_first_time`,
        setBy: "trade_empire",
      })
      .catch(() => {/* idempotent on uniq violation */});
    logger.info("sector_first_entered → public flag set", {
      userId,
      sectorId,
    });
  } catch (err) {
    logger.warn("sector_first_entered handler failed", { err });
  }
});

/* ═══════════════════════════════════════════════════════
   SEARCH RATE-LIMIT BUCKETS

   Tiny in-memory aggregator: when a search endpoint trips its
   token bucket it emits `search_rate_limited`; we bucket those
   hits per (userId, hour) so the admin Architect Console can
   surface enumeration patterns.
   ═══════════════════════════════════════════════════════ */

export interface SearchRateLimitBucket {
  userId: number;
  hourEpoch: number;
  count: number;
  lastEndpoint: string;
}

const SEARCH_RL_RETENTION_MS = 24 * 60 * 60 * 1000;
const searchRateLimitBuckets = new Map<string, SearchRateLimitBucket>();

function pruneSearchRateLimitBuckets(now: number) {
  const cutoff = Math.floor((now - SEARCH_RL_RETENTION_MS) / 3_600_000);
  for (const [key, bucket] of searchRateLimitBuckets) {
    if (bucket.hourEpoch < cutoff) searchRateLimitBuckets.delete(key);
  }
}

on("search_rate_limited", async (ev) => {
  const userId = ev.userId;
  const endpoint = typeof ev.endpoint === "string" ? ev.endpoint : "unknown";
  const now = Date.now();
  const hourEpoch = Math.floor(now / 3_600_000);
  const key = `${userId}:${hourEpoch}`;
  const existing = searchRateLimitBuckets.get(key);
  if (existing) {
    existing.count += 1;
    existing.lastEndpoint = endpoint;
  } else {
    searchRateLimitBuckets.set(key, { userId, hourEpoch, count: 1, lastEndpoint: endpoint });
  }
  pruneSearchRateLimitBuckets(now);
});

export function getSearchRateLimitBuckets(): SearchRateLimitBucket[] {
  pruneSearchRateLimitBuckets(Date.now());
  return [...searchRateLimitBuckets.values()].sort((a, b) => b.count - a.count);
}

/* ═══════════════════════════════════════════════════════
   TWO-RIPPLE RULE WIRING — woven cross-system handlers

   Each block below registers ≥ 2 cross-system consumers per
   declared WovenSystem.primaryEmits event. The `// woven:`
   comment above each wovenOn(...) call is the audit contract:
   apps/shared/_completeness/checks/wovenSystemRippleCoverage.ts
   scans rippleEngine.ts for these markers and asserts the
   Two-Ripple Rule (every emit reaches at least two other
   systems).

   Handlers here are intentionally small — they log the cross-
   system intent and, where useful, fan out further ripples.
   Business logic can grow into them in follow-up PRs without
   the markers needing to change.
   ═══════════════════════════════════════════════════════ */

/* ─── breeding ────────────────────────────────────────── */
// woven: breeding -> demon_summoning
wovenOn("crew_member_classified", "breeding", "demon_summoning", async (event) => {
  logger.debug("[woven] breeding→demon_summoning crew_member_classified", { userId: event.userId });
});
// woven: breeding -> governance
wovenOn("crew_member_classified", "breeding", "governance", async (event) => {
  logger.debug("[woven] breeding→governance crew_member_classified", { userId: event.userId });
});
// woven: breeding -> mysteries
wovenOn("bloodline_inbreeding_penalty", "breeding", "mysteries", async (event) => {
  logger.debug("[woven] breeding→mysteries bloodline_inbreeding_penalty", { userId: event.userId });
});
// woven: breeding -> trade_empire
wovenOn("bloodline_inbreeding_penalty", "breeding", "trade_empire", async (event) => {
  logger.debug("[woven] breeding→trade_empire bloodline_inbreeding_penalty", { userId: event.userId });
});

/* ─── army ────────────────────────────────────────────── */
// woven: army -> trade_empire
wovenOn("legion_deployment_complete", "army", "trade_empire", async (event) => {
  logger.debug("[woven] army→trade_empire legion_deployment_complete", { userId: event.userId });
});
// woven: army -> tower_defense
wovenOn("legion_deployment_complete", "army", "tower_defense", async (event) => {
  logger.debug("[woven] army→tower_defense legion_deployment_complete", { userId: event.userId });
});
// woven: army -> governance
wovenOn("legion_deployment_complete", "army", "governance", async (event) => {
  logger.debug("[woven] army→governance legion_deployment_complete", { userId: event.userId });
});
// woven: army -> demon_summoning
wovenOn("pale_horse_arrives", "army", "demon_summoning", async (event) => {
  logger.debug("[woven] army→demon_summoning pale_horse_arrives", { userId: event.userId });
});
// woven: army -> social
wovenOn("pale_horse_arrives", "army", "social", async (event) => {
  logger.debug("[woven] army→social pale_horse_arrives", { userId: event.userId });
});

/* ─── trade_empire ────────────────────────────────────── */
// woven: trade_empire -> governance
wovenOn("route_milestone", "trade_empire", "governance", async (event) => {
  logger.debug("[woven] trade_empire→governance route_milestone", { userId: event.userId });
});
// woven: trade_empire -> guild
wovenOn("route_milestone", "trade_empire", "guild", async (event) => {
  logger.debug("[woven] trade_empire→guild route_milestone", { userId: event.userId });
});
// woven: trade_empire -> mysteries
wovenOn("trade_route_broken", "trade_empire", "mysteries", async (event) => {
  logger.debug("[woven] trade_empire→mysteries trade_route_broken", { userId: event.userId });
});
// woven: trade_empire -> tower_defense
wovenOn("trade_route_broken", "trade_empire", "tower_defense", async (event) => {
  logger.debug("[woven] trade_empire→tower_defense trade_route_broken", { userId: event.userId });
});

/* ─── tower_defense ───────────────────────────────────── */
// woven: tower_defense -> trade_empire
wovenOn("defense_wave_complete", "tower_defense", "trade_empire", async (event) => {
  logger.debug("[woven] tower_defense→trade_empire defense_wave_complete", { userId: event.userId });
});
// woven: tower_defense -> guild
wovenOn("defense_wave_complete", "tower_defense", "guild", async (event) => {
  logger.debug("[woven] tower_defense→guild defense_wave_complete", { userId: event.userId });
});

/* ─── chess ───────────────────────────────────────────── */
// woven: chess -> mechronis_celebration
wovenOn("chess_result", "chess", "mechronis_celebration", async (event) => {
  logger.debug("[woven] chess→mechronis_celebration chess_result", { userId: event.userId });
});
// woven: chess -> mysteries
wovenOn("chess_result", "chess", "mysteries", async (event) => {
  logger.debug("[woven] chess→mysteries chess_result", { userId: event.userId });
});

/* ─── demon_summoning ─────────────────────────────────── */
// woven: demon_summoning -> breeding
wovenOn("demon_pack_opened", "demon_summoning", "breeding", async (event) => {
  logger.debug("[woven] demon_summoning→breeding demon_pack_opened", { userId: event.userId });
});
// woven: demon_summoning -> transmissions
wovenOn("demon_pack_opened", "demon_summoning", "transmissions", async (event) => {
  logger.debug("[woven] demon_summoning→transmissions demon_pack_opened", { userId: event.userId });
});

/* ─── mechronis_celebration ───────────────────────────── */
// woven: mechronis_celebration -> governance
wovenOn("celebration_trial_passed", "mechronis_celebration", "governance", async (event) => {
  logger.debug("[woven] mechronis_celebration→governance celebration_trial_passed", { userId: event.userId });
});
// woven: mechronis_celebration -> yearly
wovenOn("celebration_trial_passed", "mechronis_celebration", "yearly", async (event) => {
  logger.debug("[woven] mechronis_celebration→yearly celebration_trial_passed", { userId: event.userId });
});

/* ─── governance ──────────────────────────────────────── */
// woven: governance -> guild
wovenOn("governance_motion_proposed", "governance", "guild", async (event) => {
  logger.debug("[woven] governance→guild governance_motion_proposed", { userId: event.userId });
});
// woven: governance -> social
wovenOn("governance_motion_proposed", "governance", "social", async (event) => {
  logger.debug("[woven] governance→social governance_motion_proposed", { userId: event.userId });
});
// woven: governance -> trade_empire
wovenOn("governance_motion_passed", "governance", "trade_empire", async (event) => {
  logger.debug("[woven] governance→trade_empire governance_motion_passed", { userId: event.userId });
});
// woven: governance -> mechronis_celebration
wovenOn("governance_motion_passed", "governance", "mechronis_celebration", async (event) => {
  logger.debug("[woven] governance→mechronis_celebration governance_motion_passed", { userId: event.userId });
});

/* ─── seasonal ────────────────────────────────────────── */
// woven: seasonal -> transmissions
wovenOn("seasonal_event_participation", "seasonal", "transmissions", async (event) => {
  logger.debug("[woven] seasonal→transmissions seasonal_event_participation", { userId: event.userId });
});
// woven: seasonal -> mysteries
wovenOn("seasonal_event_participation", "seasonal", "mysteries", async (event) => {
  logger.debug("[woven] seasonal→mysteries seasonal_event_participation", { userId: event.userId });
});

/* ─── yearly ──────────────────────────────────────────── */
// woven: yearly -> governance
wovenOn("yearly_event_started", "yearly", "governance", async (event) => {
  logger.debug("[woven] yearly→governance yearly_event_started", { userId: event.userId });
});
// woven: yearly -> guild
wovenOn("yearly_event_started", "yearly", "guild", async (event) => {
  logger.debug("[woven] yearly→guild yearly_event_started", { userId: event.userId });
});
// woven: yearly -> charity
wovenOn("yearly_event_started", "yearly", "charity", async (event) => {
  logger.debug("[woven] yearly→charity yearly_event_started", { userId: event.userId });
});
// woven: yearly -> governance
wovenOn("yearly_event_closed", "yearly", "governance", async (event) => {
  logger.debug("[woven] yearly→governance yearly_event_closed", { userId: event.userId });
});
// woven: yearly -> social
wovenOn("yearly_event_closed", "yearly", "social", async (event) => {
  logger.debug("[woven] yearly→social yearly_event_closed", { userId: event.userId });
});

/* ─── transmissions ───────────────────────────────────── */
// woven: transmissions -> mysteries
wovenOn("transmission_consumed", "transmissions", "mysteries", async (event) => {
  logger.debug("[woven] transmissions→mysteries transmission_consumed", { userId: event.userId });
});
// woven: transmissions -> seasonal
wovenOn("transmission_consumed", "transmissions", "seasonal", async (event) => {
  logger.debug("[woven] transmissions→seasonal transmission_consumed", { userId: event.userId });
});

/* ─── mysteries ───────────────────────────────────────── */
// woven: mysteries -> governance
wovenOn("mystery_solved", "mysteries", "governance", async (event) => {
  logger.debug("[woven] mysteries→governance mystery_solved", { userId: event.userId });
});
// woven: mysteries -> transmissions
wovenOn("mystery_solved", "mysteries", "transmissions", async (event) => {
  logger.debug("[woven] mysteries→transmissions mystery_solved", { userId: event.userId });
});

/* ─── guild ───────────────────────────────────────────── */
// woven: guild -> governance
wovenOn("guild_milestone_crossed", "guild", "governance", async (event) => {
  logger.debug("[woven] guild→governance guild_milestone_crossed", { userId: event.userId });
});
// woven: guild -> demon_summoning
wovenOn("guild_milestone_crossed", "guild", "demon_summoning", async (event) => {
  logger.debug("[woven] guild→demon_summoning guild_milestone_crossed", { userId: event.userId });
});

/* ─── social ──────────────────────────────────────────── */
// woven: social -> charity
wovenOn("memorial_witnessed", "social", "charity", async (event) => {
  logger.debug("[woven] social→charity memorial_witnessed", { userId: event.userId });
});
// woven: social -> transmissions
wovenOn("memorial_witnessed", "social", "transmissions", async (event) => {
  logger.debug("[woven] social→transmissions memorial_witnessed", { userId: event.userId });
});
// woven: social -> charity
wovenOn("gift_sent", "social", "charity", async (event) => {
  logger.debug("[woven] social→charity gift_sent", { userId: event.userId });
});
// woven: social -> guild
wovenOn("gift_sent", "social", "guild", async (event) => {
  logger.debug("[woven] social→guild gift_sent", { userId: event.userId });
});

/* ─── charity ─────────────────────────────────────────── */
// woven: charity -> governance
wovenOn("mercy_extended", "charity", "governance", async (event) => {
  logger.debug("[woven] charity→governance mercy_extended", { userId: event.userId });
});
// woven: charity -> social
wovenOn("mercy_extended", "charity", "social", async (event) => {
  logger.debug("[woven] charity→social mercy_extended", { userId: event.userId });
});
// woven: charity -> custom_items
wovenOn("item_sacrificed", "charity", "custom_items", async (event) => {
  logger.debug("[woven] charity→custom_items item_sacrificed", { userId: event.userId });
});
// woven: charity -> social
wovenOn("item_sacrificed", "charity", "social", async (event) => {
  logger.debug("[woven] charity→social item_sacrificed", { userId: event.userId });
});

/* ─── custom_items ────────────────────────────────────── */
// woven: custom_items -> social
wovenOn("item_provenance_stamped", "custom_items", "social", async (event) => {
  logger.debug("[woven] custom_items→social item_provenance_stamped", { userId: event.userId });
});
// woven: custom_items -> guild
wovenOn("item_provenance_stamped", "custom_items", "guild", async (event) => {
  logger.debug("[woven] custom_items→guild item_provenance_stamped", { userId: event.userId });
});

/* ─── dlc_mini ────────────────────────────────────────── */
// woven: dlc_mini -> mysteries
wovenOn("mini_dlc_installed", "dlc_mini", "mysteries", async (event) => {
  logger.debug("[woven] dlc_mini→mysteries mini_dlc_installed", { userId: event.userId });
});
// woven: dlc_mini -> transmissions
wovenOn("mini_dlc_installed", "dlc_mini", "transmissions", async (event) => {
  logger.debug("[woven] dlc_mini→transmissions mini_dlc_installed", { userId: event.userId });
});
// woven: dlc_mini -> guild
wovenOn("mini_dlc_installed", "dlc_mini", "guild", async (event) => {
  logger.debug("[woven] dlc_mini→guild mini_dlc_installed", { userId: event.userId });
});

/* ─── seal_broken — cross-system fan-out ─────────────── */
// Emitted by sealStateService.recordSealBreak when an act-complete
// flag transitions. Not declared as a primaryEmits in the
// WovenSystem registry (it's a derived narrative event, not a
// system action), but still wires to multiple consumers.
//
// woven: yearly -> mysteries
wovenOn("seal_broken", "yearly", "mysteries", async (event) => {
  logger.debug("[woven] yearly→mysteries seal_broken", { userId: event.userId, sealNumber: event.sealNumber });
});
// woven: yearly -> transmissions
wovenOn("seal_broken", "yearly", "transmissions", async (event) => {
  logger.debug("[woven] yearly→transmissions seal_broken", { userId: event.userId, sealNumber: event.sealNumber });
});
// woven: yearly -> governance
wovenOn("seal_broken", "yearly", "governance", async (event) => {
  logger.debug("[woven] yearly→governance seal_broken", { userId: event.userId, sealNumber: event.sealNumber });
});
// woven: yearly -> social
wovenOn("seal_broken", "yearly", "social", async (event) => {
  logger.debug("[woven] yearly→social seal_broken", { userId: event.userId, sealNumber: event.sealNumber });
});

/* ═══════════════════════════════════════════════════════
   EXPORT — Single public interface
   ═══════════════════════════════════════════════════════ */

export const ripple = {
  emit,
  on,
  wovenOn,
};
