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
   TIER 8: YIN/YANG NARRATOR + DISCHORDIA CYCLE HANDLERS
   "The Witnessing" — Elara/Human bond, Light/Dark meter,
   Two Witnesses Meet milestones.
   ═══════════════════════════════════════════════════════ */

export interface NarratorBondChangedEvent extends RippleEvent {
  narrator: "elara" | "human" | "lyra_vox";
  newBond: number;
  delta: number;
  trigger: string;
}

export interface NarratorDismissedEvent extends RippleEvent {
  narrator: "elara" | "human";
  method: "give_me_space" | "prefer_other" | "silence";
  roomId: string;
}

export interface NarratorTrustTierEvent extends RippleEvent {
  narrator: "elara" | "human";
  newTier: 0 | 20 | 40 | 60 | 80;
}

export interface TwoWitnessesMilestoneEvent extends RippleEvent {
  tier: 40 | 60 | 80;
}

export interface LightDarkEnergyEvent extends RippleEvent {
  amount: number;
  source: string;
  sector?: string;
}

// ── NARRATOR BOND CHANGED ──
on("narrator_bond_changed", async (ev) => {
  const { userId, narrator, delta } = ev as NarratorBondChangedEvent;
  if (delta > 0) {
    await pressureService.increment(userId, "trustGains", Math.abs(delta), `narrator_${narrator}_bond_up`);
  } else if (delta < 0) {
    await pressureService.increment(userId, "betrayals", Math.abs(delta), `narrator_${narrator}_bond_down`);
  }
});

// ── NARRATOR DISMISSED ──
on("narrator_dismissed", async (ev) => {
  const { userId, narrator, method } = ev as NarratorDismissedEvent;
  // Hard / silence dismissals carry the heaviest pressure — they reveal
  // a player's emotional state on the Ark.
  const weight = method === "give_me_space" ? 1 : method === "prefer_other" ? 3 : 4;
  await pressureService.increment(userId, "betrayals", weight, `dismiss_${narrator}_${method}`);
});

// ── NARRATOR TRUST TIER ADVANCED ──
on("narrator_trust_tier_advanced", async (ev) => {
  const { userId, narrator, newTier } = ev as NarratorTrustTierEvent;
  await pressureService.increment(userId, "loreDiscoveries", newTier / 10, `narrator_${narrator}_tier_${newTier}`);
  const db = await getDb();
  if (!db) return;
  const messages: Record<number, string> = {
    20: `${narrator === "elara" ? "Elara" : "The Human"} speaks more openly now. The Professional tier has been reached.`,
    40: `${narrator === "elara" ? "Elara" : "The Human"} has begun to tell the honest version of things. Tier: Honest.`,
    60: `${narrator === "elara" ? "Elara" : "The Human"} has allowed themselves to be seen. Tier: Vulnerable.`,
    80: `${narrator === "elara" ? "Elara" : "The Human"} is Devoted. The Two Witnesses Meet is near.`,
  };
  const message = messages[newTier];
  if (message) {
    await db.insert(notifications).values({
      userId,
      type: "companion_milestone",
      title: "A NARRATOR CROSSES A THRESHOLD",
      message,
    }).catch(() => {});
  }
});

// ── TWO WITNESSES MILESTONES ──
on("two_witnesses_remember", async (ev) => {
  const { userId } = ev as TwoWitnessesMilestoneEvent;
  await pressureService.increment(userId, "loreDiscoveries", 25, "two_witnesses_remember");
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "TWO WITNESSES REMEMBER",
    message: "Elara and The Human have filled eight plaques in the Memorial Corridor. The rest are waiting.",
  }).catch(() => {});
});

on("silence_of_two_witnesses", async (ev) => {
  const { userId } = ev as TwoWitnessesMilestoneEvent;
  await pressureService.increment(userId, "loreDiscoveries", 50, "silence_of_two_witnesses");
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "THE SILENCE OF TWO WITNESSES",
    message: "Neither narrator is speaking. The Ark's Light/Dark meter has frozen for twenty-four hours. The Antiquarian is writing something in his Chronicle that he will not show you until later.",
  }).catch(() => {});
});

on("two_witnesses_meet", async (ev) => {
  const { userId } = ev as TwoWitnessesMilestoneEvent;
  await pressureService.increment(userId, "loreDiscoveries", 100, "two_witnesses_meet");
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title: "THE TWO WITNESSES MEET",
    message: "They are looking at each other across the Memorial Corridor. They are asking you to decide something. This is the most important moment in your Act 1.",
  }).catch(() => {});
});

// ── LIGHT / DARK ENERGY ──
on("light_energy_gained", async (ev) => {
  const { userId, amount } = ev as LightDarkEnergyEvent;
  await pressureService.increment(userId, "healingDone", Math.min(10, Math.ceil(amount / 20)), "light_energy");
});

on("dark_energy_gained", async (ev) => {
  const { userId, amount } = ev as LightDarkEnergyEvent;
  await pressureService.increment(userId, "deaths", Math.min(10, Math.ceil(amount / 20)), "dark_energy");
});

on("sector_state_changed", async (ev) => {
  const { userId, newState } = ev as RippleEvent & { sector: string; oldState: string; newState: string };
  if (newState === "reclaimed") {
    await pressureService.increment(userId, "exploration", 10, "sector_reclaimed");
  } else if (newState === "consumed") {
    await pressureService.increment(userId, "deaths", 10, "sector_consumed");
  }
});

on("vortex_proximity_increased", async (ev) => {
  const { userId, newLevel } = ev as RippleEvent & { newLevel: number };
  // Once the drum crosses 50, it becomes audible — that's worth noting.
  if (newLevel >= 50 && newLevel < 55) {
    const db = await getDb();
    if (!db) return;
    await db.insert(notifications).values({
      userId,
      type: "lore_event",
      title: "A DRUM IN THE DEEP SKY",
      message: "Something is moving at the edges of the galaxy. The Antiquarian has started listening to the walls.",
    }).catch(() => {});
  }
});

// ── SLIDESHOW COMPLETED ──
on("slideshow_completed", async (ev) => {
  const { userId, slideshowId } = ev as RippleEvent & { slideshowId: string };
  await pressureService.increment(userId, "loreDiscoveries", 8, `slideshow_${slideshowId}`);
});

/* ═══════════════════════════════════════════════════════
   TIER 9: THE GALACTIC DANCE HANDLERS
   Voltari transmissions, faction first contacts, unity votes.
   See docs/design/THE_GALACTIC_DANCE.md.
   ═══════════════════════════════════════════════════════ */

export interface VoltariTransmissionEvent extends RippleEvent {
  /** Which word arrived: "awake" | "remember" | "before" | "you" | "coordinate" */
  word: string;
  /** Decoding state — how much has been understood? */
  decoded: boolean;
}

export interface FactionFirstContactEvent extends RippleEvent {
  factionId: string;
  npcId: string;
  outcome: "warm" | "cautious" | "hostile" | "transactional";
}

export interface UnityVoteEvent extends RippleEvent {
  voteId: string;
  choice: string;
  /** Is this the "generous" response to Voltari? */
  generous?: boolean;
}

// ── VOLTARI TRANSMISSION RECEIVED ──
on("voltari_transmission_received", async (ev) => {
  const { userId, word } = ev as VoltariTransmissionEvent;
  await pressureService.increment(userId, "loreDiscoveries", 12, `voltari_${word}`);
  const db = await getDb();
  if (!db) return;
  const titleByWord: Record<string, string> = {
    awake: "A WORD IN THE STORM",
    remember: "THE EYES MOUTH A WORD",
    before: "A SIGNAL IN WHITE NOISE",
    you: "THE SENTENCE ASSEMBLES",
    coordinate: "THE VOLTARI SHARE A COORDINATE",
  };
  const messages: Record<string, string> = {
    awake: "A single syllable compressed to 47 petabytes. Every being who looks at it understands: AWAKE.",
    remember: "The Eyes' surveillance screens mouthed it. REMEMBER.",
    before: "Someone has been hiding a signal in the white noise for two months. BEFORE.",
    you: "The grammar is ambiguous in every language. YOU. That is either accidental or the most important thing about it.",
    coordinate: "Not a word. A coordinate. Inside the shield. Where the Dreamer is waiting.",
  };
  const title = titleByWord[word] ?? "VOLTARI TRANSMISSION";
  const message = messages[word] ?? "The Voltari have transmitted.";
  await db.insert(notifications).values({
    userId,
    type: "lore_event",
    title,
    message,
  }).catch(() => {});
});

// ── FACTION FIRST CONTACT ──
on("faction_first_contact", async (ev) => {
  const { userId, factionId, outcome } = ev as FactionFirstContactEvent;
  await pressureService.increment(userId, "loreDiscoveries", 10, `first_contact_${factionId}`);
  // Warm outcomes build trust; hostile outcomes build betrayal pressure.
  if (outcome === "warm") {
    await pressureService.increment(userId, "trustGains", 5, `first_contact_warm_${factionId}`);
  } else if (outcome === "hostile") {
    await pressureService.increment(userId, "betrayals", 5, `first_contact_hostile_${factionId}`);
  }
});

// ── UNITY VOTE CAST ──
on("unity_vote_cast", async (ev) => {
  const { userId, voteId, generous } = ev as UnityVoteEvent;
  await pressureService.increment(userId, "loreDiscoveries", 4, `unity_vote_${voteId}`);
  if (generous) {
    // The ~37% gesture — the Voltari have been looking for this.
    await pressureService.increment(userId, "trustGains", 10, "unity_vote_generous");
  }
});

/* ═══════════════════════════════════════════════════════
   EXPORT — Single public interface
   ═══════════════════════════════════════════════════════ */

export const ripple = {
  emit,
  on,
};
