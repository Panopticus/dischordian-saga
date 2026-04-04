/* ═══════════════════════════════════════════════════════
   THE LIVING ARK — Room Event System

   The Ark is not a menu of features. It is a living ship
   where things HAPPEN. Every day, events spawn in rooms.
   Every visit builds relationships. Every discovery reveals
   more of the truth about Ark 1047, Elara, The Human, and
   the war that brought everyone here.

   Three interlocking systems drive room revisits:

   1. ELARA'S DAILY BRIEF — 3 rooms marked each day
      (1 relationship, 1 gameplay, 1 story)

   2. SHADOW TONGUE CORRUPTION — Random rooms get "infected"
      with linguistic corruption that must be quarantined

   3. THE HUMAN'S SIGNAL TRAIL — Encrypted fragments hidden
      across rooms, each revealing a piece of the truth

   Plus: CoNexus Tomes hidden in rooms, discoverable through
   exploration, trust, and game completion.
   ═══════════════════════════════════════════════════════ */

export type ArkRoom =
  | "cryo_bay" | "medical_bay" | "bridge" | "archives"
  | "comms_array" | "observation_deck" | "armory" | "engineering"
  | "trade_hub" | "cargo_bay" | "trophy_room" | "captains_quarters";

export const ALL_ROOMS: ArkRoom[] = [
  "cryo_bay", "medical_bay", "bridge", "archives",
  "comms_array", "observation_deck", "armory", "engineering",
  "trade_hub", "cargo_bay", "trophy_room", "captains_quarters",
];

export type RoomEventType =
  | "relationship" | "gameplay" | "story" | "corruption"
  | "signal_fragment" | "tome_discovery" | "npc_contact"
  | "quarantine" | "music_trigger" | "memory_flash";

export interface RoomEvent {
  id: string;
  room: ArkRoom;
  type: RoomEventType;
  title: string;
  description: string;
  npc?: string;
  minTrust?: number;
  requireFlags?: string[];
  setsFlags?: string[];
  trustChange?: { npc: string; amount: number };
  rewards?: { dream?: number; salvage?: number; xp?: number; cardPack?: string };
  songTrigger?: string;
  tomeUnlock?: string;
  completed: boolean;
  expiresAt: number;
  priority: number;
}

/* ─── DAILY BRIEF ─── */

export function generateDailyBrief(
  dayNumber: number, elaraTrust: number, humanTrust: number,
  flags: Record<string, boolean>, npcs: string[],
): RoomEvent[] {
  const events: RoomEvent[] = [];
  const used = new Set<ArkRoom>();

  const rel = pickEvent(RELATIONSHIP_POOL, dayNumber, used, elaraTrust);
  if (rel) { events.push({ ...rel, id: `rel_${dayNumber}`, completed: false, expiresAt: Date.now() + 86400000 }); used.add(rel.room); }

  const game = pickEvent(GAMEPLAY_POOL, dayNumber * 3, used);
  if (game) { events.push({ ...game, id: `game_${dayNumber}`, completed: false, expiresAt: Date.now() + 86400000 }); used.add(game.room); }

  const story = pickEvent(STORY_POOL.filter(e => !e.requireFlags || e.requireFlags.every(f => flags[f])), dayNumber * 7, used, humanTrust);
  if (story) { events.push({ ...story, id: `story_${dayNumber}`, completed: false, expiresAt: Date.now() + 86400000 }); }

  return events;
}

function pickEvent(pool: Omit<RoomEvent, "id" | "completed" | "expiresAt">[], seed: number, used: Set<ArkRoom>, trust?: number): Omit<RoomEvent, "id" | "completed" | "expiresAt"> | null {
  const eligible = pool.filter(e => !used.has(e.room) && (!e.minTrust || (trust ?? 0) >= e.minTrust));
  return eligible.length > 0 ? eligible[seed % eligible.length] : null;
}

/* ─── EVENT POOLS ─── */

const RELATIONSHIP_POOL: Omit<RoomEvent, "id" | "completed" | "expiresAt">[] = [
  { room: "observation_deck", type: "relationship", title: "Stargazing with Elara", description: "Elara wants to show you something in the stars.", npc: "elara", priority: 10, trustChange: { npc: "elara", amount: 3 }, songTrigger: "silence_in_heaven" },
  { room: "bridge", type: "relationship", title: "Morning Briefing", description: "Elara has her daily report ready.", npc: "elara", priority: 8, trustChange: { npc: "elara", amount: 2 } },
  { room: "cryo_bay", type: "relationship", title: "Pod Status Check", description: "Changes in the cryo pod readings.", npc: "elara", priority: 7, trustChange: { npc: "elara", amount: 2 } },
  { room: "medical_bay", type: "relationship", title: "Neural Scan", description: "Elara wants to monitor your adaptation.", npc: "elara", priority: 6, trustChange: { npc: "elara", amount: 2 } },
  { room: "observation_deck", type: "memory_flash", title: "Elara's Memory", description: "Something is surfacing from Elara's past.", npc: "elara", minTrust: 30, priority: 12, trustChange: { npc: "elara", amount: 5 } },
  { room: "archives", type: "relationship", title: "Research Together", description: "Elara found something in the old records.", npc: "elara", priority: 7, trustChange: { npc: "elara", amount: 3 } },
];

const GAMEPLAY_POOL: Omit<RoomEvent, "id" | "completed" | "expiresAt">[] = [
  { room: "armory", type: "gameplay", title: "Arena Challenge", description: "A combat challenge has been issued.", priority: 7, rewards: { dream: 15, xp: 25 } },
  { room: "engineering", type: "gameplay", title: "Research Project", description: "A data fragment needs decryption.", priority: 6, rewards: { dream: 10, salvage: 50 } },
  { room: "cargo_bay", type: "gameplay", title: "Supply Crate", description: "New supplies in the cargo bay.", priority: 8, rewards: { cardPack: "season1" } },
  { room: "trade_hub", type: "gameplay", title: "Trade Opportunity", description: "A rare trading window.", priority: 5, rewards: { dream: 20 } },
  { room: "trophy_room", type: "gameplay", title: "Milestone Reached", description: "An achievement is ready to claim.", priority: 6, rewards: { xp: 50 } },
  { room: "armory", type: "gameplay", title: "Chess Challenge", description: "An opponent awaits at the board.", priority: 6, rewards: { dream: 15 } },
];

const STORY_POOL: Omit<RoomEvent, "id" | "completed" | "expiresAt">[] = [
  { room: "comms_array", type: "signal_fragment", title: "Substrate Signal", description: "A structured signal from below.", npc: "the_human", priority: 10, requireFlags: ["act_1_complete"], trustChange: { npc: "the_human", amount: 3 } },
  { room: "armory", type: "npc_contact", title: "Insurgency Broadcast", description: "Someone is using Agent Zero's frequency.", npc: "agent_zero", priority: 9, requireFlags: ["act_1_complete"] },
  { room: "trade_hub", type: "npc_contact", title: "New Babylon Signal", description: "Adjudicator Locke is making contact.", npc: "adjudicator_locke", priority: 8 },
  { room: "medical_bay", type: "npc_contact", title: "Viral Anomaly", description: "The Source is manifesting through medical systems.", npc: "the_source", priority: 9, minTrust: 20, songTrigger: "the_source_reprise" },
  { room: "archives", type: "npc_contact", title: "Temporal Echo", description: "Records from the future appearing.", npc: "the_antiquarian", priority: 8 },
  { room: "archives", type: "corruption", title: "Text Corruption", description: "Ship logs rewriting in real time.", npc: "shadow_tongue", priority: 10, rewards: { dream: 25, xp: 30 } },
  { room: "comms_array", type: "music_trigger", title: "Intercepted Song", description: "A musical broadcast from across the void.", priority: 6, songTrigger: "to_be_the_human" },
  { room: "cryo_bay", type: "tome_discovery", title: "Ancient Tome", description: "A CoNexus story crystal found.", priority: 7, tomeUnlock: "welcome-to-celebration", rewards: { xp: 50 } },
  { room: "observation_deck", type: "music_trigger", title: "The Two Witnesses", description: "A transmission from Malkia Ukweli.", priority: 9, songTrigger: "the_two_witnesses" },
];

/* ─── SHADOW TONGUE CORRUPTION ─── */

export interface CorruptionEvent {
  room: ArkRoom;
  severity: "minor" | "moderate" | "severe";
  spreadTimer: number;
  quarantineType: "cipher" | "word_restore" | "sequence" | "purge";
}

export function generateCorruptionEvent(dayNumber: number): CorruptionEvent | null {
  if (dayNumber % 7 !== 1 && dayNumber % 7 !== 3 && dayNumber % 7 !== 5) return null;
  const rooms: ArkRoom[] = ["archives", "bridge", "comms_array", "medical_bay", "engineering"];
  const types: CorruptionEvent["quarantineType"][] = ["cipher", "word_restore", "sequence", "purge"];
  return {
    room: rooms[dayNumber % rooms.length],
    severity: dayNumber % 3 === 0 ? "severe" : dayNumber % 2 === 0 ? "moderate" : "minor",
    spreadTimer: 24,
    quarantineType: types[dayNumber % types.length],
  };
}

/* ─── SIGNAL FRAGMENTS ─── */

export function generateSignalFragments(weekNumber: number): { room: ArkRoom; sequenceNumber: number }[] {
  const sets: ArkRoom[][] = [
    ["comms_array", "bridge", "engineering"],
    ["archives", "medical_bay", "observation_deck"],
    ["armory", "comms_array", "archives"],
  ];
  return sets[weekNumber % sets.length].map((room, i) => ({ room, sequenceNumber: i + 1 }));
}

/* ─── CONEXUS TOME PLACEMENTS ─── */

export interface TomePlacement {
  tomeId: string;
  room: ArkRoom;
  unlockMethod: "exploration" | "trust" | "game_completion" | "story_event";
  requirement: string;
  discovered: boolean;
}

export const TOME_PLACEMENTS: TomePlacement[] = [
  { tomeId: "welcome-to-celebration", room: "cryo_bay", unlockMethod: "exploration", requirement: "Visit Cryo Bay 3 times", discovered: false },
  { tomeId: "the-detective", room: "archives", unlockMethod: "trust", requirement: "Elara trust 30+", discovered: false },
  { tomeId: "iron-lion-foundation", room: "armory", unlockMethod: "game_completion", requirement: "Win 5 arena fights", discovered: false },
  { tomeId: "mechronis-academy", room: "bridge", unlockMethod: "trust", requirement: "Human trust 20+", discovered: false },
  { tomeId: "kaels-revenge", room: "comms_array", unlockMethod: "story_event", requirement: "Discover Ark theft", discovered: false },
  { tomeId: "the-engineer-foundation", room: "engineering", unlockMethod: "exploration", requirement: "Visit Engineering 5 times", discovered: false },
  { tomeId: "the-necromancers-lair", room: "medical_bay", unlockMethod: "story_event", requirement: "Discover blood evidence", discovered: false },
  { tomeId: "the-enigmas-lament", room: "observation_deck", unlockMethod: "trust", requirement: "Elara trust 50+", discovered: false },
  { tomeId: "the-politicians-reign", room: "trade_hub", unlockMethod: "trust", requirement: "Locke trust 20+", discovered: false },
  { tomeId: "the-ninth", room: "engineering", unlockMethod: "story_event", requirement: "Discover the Shadow Tongue", discovered: false },
  { tomeId: "agent-zero-foundation", room: "armory", unlockMethod: "story_event", requirement: "Investigate Zero's signal", discovered: false },
  { tomeId: "terminus-swarm", room: "comms_array", unlockMethod: "game_completion", requirement: "Reach wave 10", discovered: false },
];

/* ─── ROOM INDICATORS ─── */

export interface RoomIndicator {
  room: ArkRoom;
  eventType: RoomEventType;
  color: string;
  urgent: boolean;
  tooltip: string;
}

export function getRoomIndicators(events: RoomEvent[], corruption: CorruptionEvent | null): RoomIndicator[] {
  const indicators: RoomIndicator[] = [];
  for (const e of events) {
    if (e.completed) continue;
    indicators.push({
      room: e.room, eventType: e.type,
      color: e.type === "relationship" ? "#22d3ee" : e.type === "gameplay" ? "#fbbf24" :
             e.type === "story" ? "#a78bfa" : e.type === "corruption" ? "#6366f1" :
             e.type === "signal_fragment" ? "#f87171" : e.type === "tome_discovery" ? "#00e676" :
             e.type === "music_trigger" ? "#ff8c00" : e.type === "memory_flash" ? "#22d3ee" : "#94a3b8",
      urgent: false, tooltip: e.title,
    });
  }
  if (corruption) {
    indicators.push({
      room: corruption.room, eventType: "corruption",
      color: "#6366f1", urgent: corruption.severity === "severe",
      tooltip: `Shadow Tongue Corruption — ${corruption.severity}`,
    });
  }
  return indicators;
}
