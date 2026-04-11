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
});

/* ═══════════════════════════════════════════════════════
   EXPORT — Single public interface
   ═══════════════════════════════════════════════════════ */

export const ripple = {
  emit,
  on,
};
