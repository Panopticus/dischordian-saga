/* ═══════════════════════════════════════════════════════
   THE LIVING ARK — Room Event System
   Three pillars: Daily Brief, Quarantine, Signal Hunt
   Plus: CoNexus Tomes, music triggers, NPC encounters.
   ═══════════════════════════════════════════════════════ */

export type RoomId = "cryo_bay" | "medical_bay" | "bridge" | "archives" | "comms_array" | "observation_deck" | "armory" | "engineering" | "trade_hub" | "cargo_bay" | "trophy_room" | "captains_quarters";
export type EventType = "npc_conversation" | "signal_fragment" | "quarantine" | "tome_discovered" | "music_transmission" | "lore_discovery" | "army_recruit" | "trade_opportunity" | "doom_scroll_news" | "pod_activity" | "system_anomaly" | "stargazing" | "diagnostic_scan" | "research_complete" | "boss_challenge" | "draft_open" | "guild_war_update";

export interface RoomEvent { id: string; roomId: RoomId; type: EventType; title: string; description: string; npcId?: string; song?: string; minTrust?: number; minAct?: number; reward?: { dream?: number; xp?: number; cardId?: string; material?: string; trust?: number }; repeating: boolean; priority: number; }

export interface RoomDef { id: RoomId; name: string; deck: string; primaryNPC: string | null; features: string[]; defaultTome: string | null; discoverySong: string | null; }

export const ROOMS: Record<RoomId, RoomDef> = {
  cryo_bay: { id: "cryo_bay", name: "Cryo Bay", deck: "Deck 1", primaryNPC: null, features: ["character_sheet", "army_recruitment", "pod_mysteries"], defaultTome: "welcome-to-celebration", discoverySong: "Seeds of Inception" },
  medical_bay: { id: "medical_bay", name: "Medical Bay", deck: "Deck 1", primaryNPC: "the_source", features: ["citizen_stats", "diagnostics", "class_mastery"], defaultTome: "the-necromancers-lair", discoverySong: "The Prisoner" },
  bridge: { id: "bridge", name: "Bridge", deck: "Deck 2", primaryNPC: "elara", features: ["conspiracy_board", "quests", "guild_hall", "daily_brief"], defaultTome: "mechronis-academy", discoverySong: "Building the Architect" },
  archives: { id: "archives", name: "Archives", deck: "Deck 2", primaryNPC: "the_antiquarian", features: ["loredex_search", "codex", "lore_quiz"], defaultTome: "the-detective", discoverySong: "The Book of Daniel 2.0" },
  comms_array: { id: "comms_array", name: "Comms Array", deck: "Deck 3", primaryNPC: "the_human", features: ["transmissions", "watch_saga", "signal_intercept"], defaultTome: "kaels-revenge", discoverySong: "To Be the Human" },
  observation_deck: { id: "observation_deck", name: "Observation Deck", deck: "Deck 3", primaryNPC: null, features: ["discography", "music_player", "stargazing"], defaultTome: "the-enigmas-lament", discoverySong: "The Queen of Truth" },
  armory: { id: "armory", name: "Armory", deck: "Deck 4", primaryNPC: "agent_zero", features: ["fight_game", "chess", "dischordia", "terminus_swarm"], defaultTome: "agent-zero-foundation", discoverySong: "It Ain't Illegal" },
  engineering: { id: "engineering", name: "Engineering Bay", deck: "Deck 4", primaryNPC: "shadow_tongue", features: ["crafting", "research_lab", "card_fusion"], defaultTome: "the-engineer-foundation", discoverySong: "Virtual Reality" },
  trade_hub: { id: "trade_hub", name: "Trade Hub", deck: "Deck 5", primaryNPC: "adjudicator_locke", features: ["trade_empire", "marketplace", "diplomacy"], defaultTome: "the-politicians-reign", discoverySong: "Governance Hub" },
  cargo_bay: { id: "cargo_bay", name: "Cargo Bay", deck: "Deck 5", primaryNPC: null, features: ["collection", "inventory", "draft_tournament"], defaultTome: "iron-lion-foundation", discoverySong: null },
  trophy_room: { id: "trophy_room", name: "Trophy Room", deck: "Deck 6", primaryNPC: null, features: ["achievements", "titles", "battle_pass"], defaultTome: "the-ninth-blood-and-shadows", discoverySong: "Judgment Day" },
  captains_quarters: { id: "captains_quarters", name: "Captain's Quarters", deck: "Deck 6", primaryNPC: null, features: ["companion_hub", "morality_census"], defaultTome: "building-the-architect", discoverySong: "Lip Service" },
};

const NPC_NAMES: Record<string, string> = { elara: "Elara", the_human: "The Human", agent_zero: "Agent Zero", adjudicator_locke: "Adjudicator Locke", the_source: "The Source", the_antiquarian: "The Antiquarian", shadow_tongue: "????" };

export function generateDailyBrief(daySeed: number, act: number, trust: number, completed: Set<string>) {
  const pool = buildPool(act, completed);
  const gp = pool.filter(e => ["boss_challenge", "draft_open", "trade_opportunity", "research_complete", "army_recruit"].includes(e.type));
  const st = pool.filter(e => ["signal_fragment", "lore_discovery", "tome_discovered", "music_transmission", "system_anomaly"].includes(e.type));
  const rl = pool.filter(e => ["npc_conversation", "stargazing", "diagnostic_scan", "pod_activity"].includes(e.type));
  const pick = (a: RoomEvent[], s: number) => { a.sort((x, y) => y.priority - x.priority); return a[s % Math.max(1, Math.min(5, a.length))] || fb(s); };
  return { gameplay: pick(gp, daySeed), story: pick(st, daySeed * 7 + 3), relationship: pick(rl, daySeed * 13 + 7) };
}

function buildPool(act: number, completed: Set<string>): RoomEvent[] {
  const ev: RoomEvent[] = [];
  for (const [rid, rm] of Object.entries(ROOMS)) {
    const r = rid as RoomId;
    if (rm.primaryNPC) ev.push({ id: `npc_${r}`, roomId: r, type: "npc_conversation", title: `${NPC_NAMES[rm.primaryNPC] || "Someone"} wants to speak`, description: `Dialog in ${rm.name}.`, npcId: rm.primaryNPC, reward: { trust: 3, xp: 15 }, repeating: true, priority: 8 });
    if (r === "observation_deck") ev.push({ id: "stargaze", roomId: r, type: "stargazing", title: "Elara is at the viewport", description: "She seems reflective.", npcId: "elara", song: "The Enigma's Lament", reward: { trust: 2, xp: 10 }, repeating: true, priority: 9 });
    if (rm.defaultTome && !completed.has(`tome_${rm.defaultTome}`)) ev.push({ id: `tome_${r}`, roomId: r, type: "tome_discovered", title: `Tome in ${rm.name}`, description: "Antiquarian's Library reveals a volume.", reward: { xp: 50, dream: 30 }, repeating: false, priority: 6 });
    if (rm.discoverySong && !completed.has(`music_${r}`)) ev.push({ id: `music_${r}`, roomId: r, type: "music_transmission", title: `"${rm.discoverySong}" intercepted`, description: "Transmission from the Two Witnesses.", song: rm.discoverySong, reward: { xp: 20 }, repeating: false, priority: 5 });
    if (act >= 1 && ["comms_array", "bridge", "archives", "engineering"].includes(r)) ev.push({ id: `signal_${r}`, roomId: r, type: "signal_fragment", title: `Signal in ${rm.name}`, description: "Encrypted fragment.", npcId: "the_human", reward: { xp: 25 }, repeating: true, priority: 7, minAct: 1 });
    if (act >= 2 && ["archives", "bridge", "comms_array"].includes(r)) ev.push({ id: `anomaly_${r}`, roomId: r, type: "system_anomaly", title: `Corruption in ${rm.name}`, description: "Records being rewritten.", npcId: "shadow_tongue", reward: { xp: 20 }, repeating: true, priority: 6, minAct: 2 });
    if (r === "armory") ev.push({ id: "boss", roomId: r, type: "boss_challenge", title: "Challenge available", description: "New opponent.", reward: { xp: 40, dream: 25 }, repeating: true, priority: 5 });
    if (r === "cargo_bay") ev.push({ id: "draft", roomId: r, type: "draft_open", title: "Draft open", description: "Build from random cards.", reward: { xp: 30, dream: 20 }, repeating: true, priority: 4 });
    if (r === "trade_hub") ev.push({ id: "trade", roomId: r, type: "trade_opportunity", title: "Market shift", description: "Locke has a proposition.", npcId: "adjudicator_locke", reward: { dream: 15 }, repeating: true, priority: 5 });
    if (r === "cryo_bay") ev.push({ id: "pod", roomId: r, type: "pod_activity", title: "Pod anomaly", description: "Cryo pod showed activity.", reward: { xp: 20 }, repeating: true, priority: 6 });
    if (r === "engineering") ev.push({ id: "research", roomId: r, type: "research_complete", title: "Research ready", description: "Blueprint synthesized.", reward: { xp: 25 }, repeating: true, priority: 5 });
    if (r === "medical_bay") ev.push({ id: "diag", roomId: r, type: "diagnostic_scan", title: "Diagnostic available", description: "Elara wants to run your scan.", npcId: "elara", reward: { xp: 10, trust: 1 }, repeating: true, priority: 7 });
  }
  return ev;
}

function fb(s: number): RoomEvent { return { id: `fb_${s}`, roomId: "bridge", type: "lore_discovery", title: "New data fragment", description: "Check the Bridge.", repeating: true, priority: 1 }; }

export interface QuarantineEvent { roomId: RoomId; severity: "low" | "medium" | "high"; hoursRemaining: number; spreadTo: RoomId[]; reward: { salvage: number; viralIchor: number; dream: number }; }

export function generateQuarantines(weekSeed: number): QuarantineEvent[] {
  const t: RoomId[] = ["cryo_bay", "medical_bay", "bridge", "archives", "comms_array", "engineering"];
  const n = 2 + (weekSeed % 2);
  return Array.from({ length: n }, (_, i) => ({ roomId: t[(weekSeed * (i + 1) * 7) % t.length], severity: (i === 0 ? "high" : "medium") as "high" | "medium", hoursRemaining: 24, spreadTo: t.filter((_, j) => j !== (weekSeed * (i + 1) * 7) % t.length).slice(0, 2) as RoomId[], reward: { salvage: 50 + i * 25, viralIchor: 10 + i * 5, dream: 15 + i * 10 } }));
}

export interface MusicTrigger { song: string; condition: string; room?: RoomId; npc?: string; flag?: string }
export const MUSIC_TRIGGERS: MusicTrigger[] = [
  { song: "Seeds of Inception", condition: "first_cryo_visit", room: "cryo_bay" },
  { song: "To Be the Human", condition: "human_first_contact", npc: "the_human" },
  { song: "The Prisoner", condition: "medical_quarantine", room: "medical_bay" },
  { song: "Building the Architect", condition: "captain_log_decoded", room: "bridge" },
  { song: "Kael's Revenge", condition: "ark_stolen_discovered", room: "comms_array" },
  { song: "The Enigma's Lament", condition: "first_stargazing", room: "observation_deck" },
  { song: "It Ain't Illegal", condition: "agent_zero_contact", npc: "agent_zero" },
  { song: "The Last Stand", condition: "iron_lion_lore", room: "armory" },
  { song: "Virtual Reality", condition: "shadow_tongue_found", npc: "shadow_tongue" },
  { song: "Governance Hub", condition: "locke_contact", npc: "adjudicator_locke" },
  { song: "The Source (Reprise)", condition: "source_contact", npc: "the_source" },
  { song: "Silence in Heaven", condition: "antiquarian_reveal", npc: "the_antiquarian" },
  { song: "We Are Not Okay", condition: "elara_senate_memory", flag: "elara_senate_memory" },
  { song: "The Two Witnesses", condition: "witnesses_discovered" },
  { song: "Worthy", condition: "act_3_scroll" },
  { song: "Hypnotized", condition: "malkia_identity" },
  { song: "Family Tree", condition: "game_complete", room: "captains_quarters" },
];

export interface TomePlacement { tomeId: string; roomId: RoomId; method: "exploration" | "trust" | "quest" | "game" | "npc_gift"; trustReq?: { npc: string; min: number }; flagReq?: string; cardReward?: string; }
export const TOME_PLACEMENTS: TomePlacement[] = [
  { tomeId: "welcome-to-celebration", roomId: "cryo_bay", method: "exploration", cardReward: "the-architect" },
  { tomeId: "the-necromancers-lair", roomId: "medical_bay", method: "exploration", cardReward: "the-necromancer" },
  { tomeId: "mechronis-academy", roomId: "bridge", method: "exploration", cardReward: "the-human" },
  { tomeId: "the-detective", roomId: "archives", method: "exploration", cardReward: "the-detective" },
  { tomeId: "kaels-revenge", roomId: "comms_array", method: "exploration", cardReward: "kael" },
  { tomeId: "the-enigmas-lament", roomId: "observation_deck", method: "exploration", cardReward: "the-enigma" },
  { tomeId: "agent-zero-foundation", roomId: "armory", method: "exploration", cardReward: "agent-zero" },
  { tomeId: "the-engineer-foundation", roomId: "engineering", method: "exploration", cardReward: "the-engineer" },
  { tomeId: "the-politicians-reign", roomId: "trade_hub", method: "exploration", cardReward: "the-politician" },
  { tomeId: "iron-lion-foundation", roomId: "cargo_bay", method: "exploration", cardReward: "iron-lion" },
  { tomeId: "the-ninth-blood-and-shadows", roomId: "trophy_room", method: "exploration", cardReward: "the-shadow-tongue" },
  { tomeId: "building-the-architect", roomId: "captains_quarters", method: "exploration", cardReward: "the-programmer" },
  { tomeId: "eyes-of-the-watcher", roomId: "bridge", method: "trust", trustReq: { npc: "elara", min: 40 }, cardReward: "the-eyes" },
  { tomeId: "the-oracle", roomId: "archives", method: "trust", trustReq: { npc: "the_antiquarian", min: 30 }, cardReward: "the-oracle" },
  { tomeId: "dischordian-logic", roomId: "comms_array", method: "trust", trustReq: { npc: "the_human", min: 50 }, cardReward: "the-dreamer" },
  { tomeId: "terminus-swarm", roomId: "armory", method: "game", flagReq: "terminus_wave_10", cardReward: "the-source" },
  { tomeId: "the-host", roomId: "medical_bay", method: "quest", flagReq: "quarantine_5", cardReward: "the-host" },
  { tomeId: "rise-of-the-neyons", roomId: "observation_deck", method: "trust", trustReq: { npc: "elara", min: 60 }, cardReward: "the-dreamer" },
  { tomeId: "the-brotherhood-ocularum", roomId: "armory", method: "npc_gift", trustReq: { npc: "agent_zero", min: 40 }, cardReward: "iron-lion" },
  { tomeId: "sanctuary-lost", roomId: "trade_hub", method: "npc_gift", trustReq: { npc: "adjudicator_locke", min: 40 }, cardReward: "the-authority" },
  { tomeId: "planet-of-the-wolf", roomId: "engineering", method: "trust", trustReq: { npc: "shadow_tongue", min: 30 }, cardReward: "the-wolf" },
  { tomeId: "the-blood-weave-gates-of-hell", roomId: "trophy_room", method: "quest", flagReq: "hierarchy_discovered", cardReward: "the-advocate" },
  { tomeId: "awaken-the-clone", roomId: "medical_bay", method: "trust", trustReq: { npc: "the_source", min: 40 }, cardReward: "the-white-oracle" },
];
