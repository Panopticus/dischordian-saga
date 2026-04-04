/* ═══════════════════════════════════════════════════════
   ARK EVENT HANDLER — Bridges Living Ark events to ALL game systems

   When a daily brief event fires, this handler:
   - NPC conversations → adjusts trust, triggers dialog, sets callbacks
   - Signal fragments → sets narrative flags, hints at Terminus Swarm
   - Quarantines → awards resources, progresses quest counters
   - Tome discoveries → unlocks CoNexus games, awards cards
   - Music transmissions → sets flags, triggers music player
   - Trade opportunities → sets Trade Empire mission flags
   - Boss challenges → sets combat flags
   - System anomalies → progresses Shadow Tongue discovery
   - Stargazing → Elara trust + morality reflection
   - Pod activity → hints at cryo mysteries
   - Research complete → awards crafting materials
   - Diagnostic scan → awards XP + Elara trust

   Every event also awards resources from the unified economy.
   ═══════════════════════════════════════════════════════ */

import type { RoomEvent, EventType, RoomId } from "./livingArk";
import type { FactionNPCId } from "./factionNPCs";

/* ─── EVENT RESULT ─── */

export interface ArkEventResult {
  /** Trust changes for NPCs */
  trustChanges: { npcId: string; delta: number }[];
  /** Narrative flags to set */
  flagsToSet: string[];
  /** Resources to award */
  resources: { dream?: number; salvage?: number; voidCrystals?: number; xp?: number };
  /** Cards to award */
  cardReward?: string;
  /** Equipment drop (item ID from equipmentData) */
  equipmentDrop?: string;
  /** Crafting materials */
  materials?: { id: string; amount: number }[];
  /** Quest progress signals */
  questSignals: string[];
  /** Navigation hint — suggest a game mode to the player */
  gameHint?: { game: "terminus" | "fight" | "chess" | "dischordia" | "trade_empire"; route: string; label: string };
  /** NPC dialog to trigger */
  npcDialog?: { npcId: FactionNPCId; sceneType: "first_contact" | "conversation" | "revelation" };
  /** Music to play */
  musicTrigger?: string;
  /** Toast message */
  toast: { title: string; description: string; type: "info" | "success" | "warning" };
}

/* ─── EQUIPMENT DROP TABLES (per room) ─── */

const ROOM_DROP_TABLE: Partial<Record<RoomId, { items: string[]; chance: number }>> = {
  armory: { items: ["scrap_helm", "arena_vest", "fighters_band", "collectors_blade"], chance: 0.25 },
  engineering: { items: ["void_helm", "circuit_vest", "data_lens", "phase_blade"], chance: 0.15 },
  cargo_bay: { items: ["traders_helm", "merchants_coat", "fortune_charm"], chance: 0.20 },
  medical_bay: { items: ["scrap_helm", "arena_vest"], chance: 0.10 },
  trophy_room: { items: ["warlords_pauldron", "oracle_eye", "void_shard_ring"], chance: 0.10 },
};

/* ─── MATERIAL DROP TABLES (per event type) ─── */

const EVENT_MATERIALS: Partial<Record<EventType, { id: string; amount: number }[]>> = {
  quarantine: [{ id: "viral_ichor", amount: 10 }, { id: "salvage_scrap", amount: 25 }],
  research_complete: [{ id: "neural_core", amount: 1 }, { id: "circuit_board", amount: 3 }],
  signal_fragment: [{ id: "signal_shard", amount: 1 }],
  system_anomaly: [{ id: "corrupted_data", amount: 2 }],
  boss_challenge: [{ id: "champion_token", amount: 1 }],
};

/* ─── MAIN HANDLER ─── */

export function processArkEvent(event: RoomEvent, daySeed: number): ArkEventResult {
  const result: ArkEventResult = {
    trustChanges: [],
    flagsToSet: [],
    resources: {},
    questSignals: [],
    toast: { title: event.title, description: event.description, type: "info" },
  };

  // Base rewards from event definition
  if (event.reward) {
    if (event.reward.dream) result.resources.dream = event.reward.dream;
    if (event.reward.xp) result.resources.xp = event.reward.xp;
    if (event.reward.cardId) result.cardReward = event.reward.cardId;
    if (event.reward.trust && event.npcId) {
      result.trustChanges.push({ npcId: event.npcId, delta: event.reward.trust });
    }
  }

  // Type-specific handling
  switch (event.type) {
    case "npc_conversation":
      handleNpcConversation(event, result);
      break;
    case "signal_fragment":
      handleSignalFragment(event, result);
      break;
    case "quarantine":
      handleQuarantine(event, result);
      break;
    case "tome_discovered":
      handleTomeDiscovered(event, result);
      break;
    case "music_transmission":
      handleMusicTransmission(event, result);
      break;
    case "trade_opportunity":
      handleTradeOpportunity(event, result);
      break;
    case "boss_challenge":
      handleBossChallenge(event, result);
      break;
    case "system_anomaly":
      handleSystemAnomaly(event, result);
      break;
    case "stargazing":
      handleStargazing(event, result);
      break;
    case "pod_activity":
      handlePodActivity(event, result);
      break;
    case "research_complete":
      handleResearchComplete(event, result);
      break;
    case "diagnostic_scan":
      handleDiagnosticScan(event, result);
      break;
    case "draft_open":
      handleDraftOpen(event, result);
      break;
    case "army_recruit":
      handleArmyRecruit(event, result);
      break;
    default:
      break;
  }

  // Equipment drop roll (per room)
  const dropTable = ROOM_DROP_TABLE[event.roomId];
  if (dropTable && seededRandom(daySeed + event.id.length) < dropTable.chance) {
    const idx = Math.floor(seededRandom(daySeed * 7 + event.id.length) * dropTable.items.length);
    result.equipmentDrop = dropTable.items[idx];
  }

  // Material drops (per event type)
  const mats = EVENT_MATERIALS[event.type];
  if (mats) {
    result.materials = mats;
  }

  // Quest progress signals (generic)
  result.questSignals.push(`ark_event_${event.type}`);
  result.questSignals.push(`ark_room_${event.roomId}`);
  if (event.npcId) result.questSignals.push(`ark_npc_${event.npcId}`);

  return result;
}

/* ─── TYPE-SPECIFIC HANDLERS ─── */

function handleNpcConversation(event: RoomEvent, result: ArkEventResult) {
  if (!event.npcId) return;
  const npcId = event.npcId as FactionNPCId;

  // Open NPC dialog
  result.npcDialog = { npcId, sceneType: "conversation" };

  // Trust gain (already from reward, but add conversation bonus)
  result.trustChanges.push({ npcId: event.npcId, delta: 2 });

  // Set discovery flag
  result.flagsToSet.push(`npc_discovered_${event.npcId}`);
  result.flagsToSet.push(`ark_conversation_${event.npcId}_${new Date().toDateString()}`);

  // Quest signals
  result.questSignals.push("npc_conversation_complete");
  result.questSignals.push(`npc_${event.npcId}_talked`);

  result.toast = {
    title: `${event.title}`,
    description: `Trust with ${event.npcId.replace(/_/g, " ")} increased`,
    type: "success",
  };
}

function handleSignalFragment(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("signal_fragment_found");
  result.flagsToSet.push(`signal_${event.roomId}`);

  // Hint at Terminus Swarm
  result.gameHint = {
    game: "terminus",
    route: "/terminus-swarm",
    label: "The signal traces to Terminus. Investigate through the Swarm defense grid.",
  };

  // Human trust for picking up signals
  result.trustChanges.push({ npcId: "the_human", delta: 2 });

  result.resources.xp = (result.resources.xp || 0) + 15;
  result.questSignals.push("signal_fragment_collected");

  result.toast = {
    title: "Signal Fragment Decrypted",
    description: "The Human's frequency grows stronger. Terminus beckons.",
    type: "warning",
  };
}

function handleQuarantine(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("quarantine_encountered");
  const count = parseInt(localStorage.getItem("quarantine_count") || "0") + 1;
  localStorage.setItem("quarantine_count", String(count));

  if (count >= 5) result.flagsToSet.push("quarantine_5");

  // Resources
  result.resources.salvage = (result.resources.salvage || 0) + 50;
  result.resources.dream = (result.resources.dream || 0) + 15;

  // Hint at fight game — clear the quarantine!
  result.gameHint = {
    game: "fight",
    route: "/fight",
    label: "Combat simulation available. Train to resist the contamination.",
  };

  // Source trust (virus-related events)
  result.trustChanges.push({ npcId: "the_source", delta: 1 });

  result.questSignals.push("quarantine_cleared");
  result.questSignals.push(`quarantine_${event.roomId}`);

  result.toast = {
    title: "Quarantine Contained",
    description: `+50 Salvage, +15 Dream. Viral contamination in ${event.roomId.replace(/_/g, " ")} contained.`,
    type: "warning",
  };
}

function handleTomeDiscovered(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push(`tome_${event.roomId}`);
  result.flagsToSet.push("tome_discovered");

  // Antiquarian trust for finding tomes
  result.trustChanges.push({ npcId: "the_antiquarian", delta: 3 });

  result.resources.xp = (result.resources.xp || 0) + 50;
  result.resources.dream = (result.resources.dream || 0) + 30;

  // Trigger Antiquarian dialog
  result.npcDialog = { npcId: "the_antiquarian", sceneType: "conversation" };

  result.questSignals.push("tome_found");

  result.toast = {
    title: "Tome Discovered",
    description: "The Antiquarian's Library reveals a new volume. +50 XP, +30 Dream.",
    type: "success",
  };
}

function handleMusicTransmission(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push(`music_${event.roomId}`);
  if (event.song) {
    result.musicTrigger = event.song;
    result.flagsToSet.push(`music_heard_${event.song.toLowerCase().replace(/\s+/g, "_")}`);
  }

  result.resources.xp = (result.resources.xp || 0) + 20;

  result.toast = {
    title: `"${event.song}" Intercepted`,
    description: "Transmission from the Two Witnesses. The scripture speaks through music.",
    type: "info",
  };
}

function handleTradeOpportunity(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("trade_opportunity_available");

  // Locke trust for engaging with trade
  result.trustChanges.push({ npcId: "adjudicator_locke", delta: 2 });

  // Hint at Trade Empire
  result.gameHint = {
    game: "trade_empire",
    route: "/trade-empire",
    label: "Locke has a proposition. Open Trade Empire to negotiate.",
  };

  result.npcDialog = { npcId: "adjudicator_locke", sceneType: "conversation" };

  result.resources.dream = (result.resources.dream || 0) + 15;
  result.questSignals.push("trade_opportunity_seen");

  result.toast = {
    title: "Market Shift Detected",
    description: "Adjudicator Locke has a proposition. Visit the Trade Hub.",
    type: "info",
  };
}

function handleBossChallenge(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("boss_challenge_available");

  // Hint at fight game
  result.gameHint = {
    game: "fight",
    route: "/fight",
    label: "A new challenger awaits in the Armory combat simulator.",
  };

  // Agent Zero trust for combat engagement
  result.trustChanges.push({ npcId: "agent_zero", delta: 1 });

  result.resources.xp = (result.resources.xp || 0) + 40;
  result.resources.dream = (result.resources.dream || 0) + 25;
  result.questSignals.push("boss_challenge_accepted");

  result.toast = {
    title: "Challenge Available",
    description: "New opponent in the combat simulator. +40 XP, +25 Dream.",
    type: "success",
  };
}

function handleSystemAnomaly(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("system_anomaly_detected");
  result.flagsToSet.push(`anomaly_${event.roomId}`);

  // Shadow Tongue discovery progression
  result.trustChanges.push({ npcId: "shadow_tongue", delta: 2 });
  result.flagsToSet.push("shadow_tongue_evidence");

  // Hint at investigating archives
  result.gameHint = {
    game: "chess",
    route: "/chess",
    label: "The anomaly patterns mirror game theory. The Architect's Gambit may reveal the logic.",
  };

  result.resources.xp = (result.resources.xp || 0) + 20;
  result.questSignals.push("anomaly_investigated");

  result.toast = {
    title: "System Anomaly",
    description: "Records are being rewritten in real-time. Something is in the code.",
    type: "warning",
  };
}

function handleStargazing(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("stargazing_complete");

  // Elara trust for personal moments
  result.trustChanges.push({ npcId: "elara", delta: 3 });

  result.npcDialog = { npcId: "elara", sceneType: "conversation" };

  result.resources.xp = (result.resources.xp || 0) + 10;
  result.questSignals.push("stargazing_session");

  if (event.song) result.musicTrigger = event.song;

  result.toast = {
    title: "Stargazing with Elara",
    description: "93,847 sunrises. And she shared this one with you.",
    type: "success",
  };
}

function handlePodActivity(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("pod_activity_detected");

  result.resources.xp = (result.resources.xp || 0) + 20;
  result.questSignals.push("pod_mystery_progressed");

  result.toast = {
    title: "Pod Activity Detected",
    description: "A cryo pod showed signs of internal activity. Someone — or something — is stirring.",
    type: "warning",
  };
}

function handleResearchComplete(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("research_complete");

  // Shadow Tongue trust (engineering is their room)
  result.trustChanges.push({ npcId: "shadow_tongue", delta: 1 });

  // Hint at crafting
  result.gameHint = {
    game: "terminus",
    route: "/terminus-swarm",
    label: "New turret blueprint synthesized. Deploy in Terminus Swarm.",
  };

  result.resources.xp = (result.resources.xp || 0) + 25;
  result.resources.salvage = (result.resources.salvage || 0) + 30;
  result.questSignals.push("research_completed");

  result.toast = {
    title: "Research Complete",
    description: "Blueprint synthesized in Engineering. +25 XP, +30 Salvage.",
    type: "success",
  };
}

function handleDiagnosticScan(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("diagnostic_complete");

  // Elara trust for letting her scan you
  result.trustChanges.push({ npcId: "elara", delta: 1 });

  result.resources.xp = (result.resources.xp || 0) + 10;
  result.questSignals.push("diagnostic_scan_complete");

  result.toast = {
    title: "Diagnostic Complete",
    description: "Neural patterns nominal. Elara's scan reveals nothing... suspicious.",
    type: "info",
  };
}

function handleDraftOpen(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("draft_available");

  result.gameHint = {
    game: "dischordia",
    route: "/dischordia",
    label: "Draft tournament open. Build a deck from random packs in Dischordia.",
  };

  result.resources.xp = (result.resources.xp || 0) + 30;
  result.resources.dream = (result.resources.dream || 0) + 20;
  result.questSignals.push("draft_entered");

  result.toast = {
    title: "Draft Tournament Open",
    description: "Cargo Bay is hosting a draft. Build from random cards. +30 XP, +20 Dream.",
    type: "success",
  };
}

function handleArmyRecruit(event: RoomEvent, result: ArkEventResult) {
  result.flagsToSet.push("army_recruit_available");
  result.resources.xp = (result.resources.xp || 0) + 15;
  result.questSignals.push("army_recruit_available");

  result.toast = {
    title: "Recruitment Opportunity",
    description: "A new operative is available for recruitment in the Cryo Bay.",
    type: "info",
  };
}

/* ─── UTILITY ─── */

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
