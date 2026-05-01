/* ═══════════════════════════════════════════════════════
   THE LIVING ARK — Room Event System
   Three pillars: Daily Brief, Quarantine, Signal Hunt
   Plus: CoNexus Tomes, music triggers, NPC encounters.
   ═══════════════════════════════════════════════════════ */

export type RoomId = "cryo_bay" | "medical_bay" | "bridge" | "archives" | "comms_array" | "observation_deck" | "armory" | "engineering" | "trade_hub" | "cargo_bay" | "trophy_room" | "captains_quarters" | "corridor" | "galley" | "briefing_room" | "mess_hall";
export type EventType = "npc_conversation" | "signal_fragment" | "quarantine" | "tome_discovered" | "music_transmission" | "lore_discovery" | "army_recruit" | "trade_opportunity" | "doom_scroll_news" | "pod_activity" | "system_anomaly" | "stargazing" | "diagnostic_scan" | "research_complete" | "boss_challenge" | "draft_open" | "guild_war_update" | "crew_cloning" | "crew_danger" | "crew_activity" | "bloodline_event" | "incubator_ready";

export interface RoomEvent { id: string; roomId: RoomId; type: EventType; title: string; description: string; npcId?: string; song?: string; minTrust?: number; minAct?: number; reward?: { dream?: number; xp?: number; cardId?: string; material?: string; trust?: number }; repeating: boolean; priority: number; }

export interface RoomDef { id: RoomId; name: string; deck: string; primaryNPC: string | null; features: string[]; defaultTome: string | null; discoverySong: string | null; }

export const ROOMS: Record<RoomId, RoomDef> = {
  cryo_bay: { id: "cryo_bay", name: "Cryo Bay", deck: "Deck 1", primaryNPC: null, features: ["character_sheet", "army_recruitment", "pod_mysteries", "crew_cloning", "incubator_pods", "genetic_archive"], defaultTome: "welcome-to-celebration", discoverySong: "Seeds of Inception" },
  medical_bay: { id: "medical_bay", name: "Medical Bay", deck: "Deck 1", primaryNPC: "the_source", features: ["citizen_stats", "diagnostics", "class_mastery", "combat_sim"], defaultTome: "the-necromancers-lair", discoverySong: "The Prisoner" },
  bridge: { id: "bridge", name: "Bridge", deck: "Deck 2", primaryNPC: "elara", features: ["conspiracy_board", "quests", "guild_hall", "daily_brief", "architects_gambit"], defaultTome: "mechronis-academy", discoverySong: "Building the Architect" },
  archives: { id: "archives", name: "Archives", deck: "Deck 2", primaryNPC: "the_antiquarian", features: ["loredex_search", "codex", "lore_quiz", "dischordia"], defaultTome: "the-detective", discoverySong: "The Book of Daniel 2.0" },
  comms_array: { id: "comms_array", name: "Comms Array", deck: "Deck 3", primaryNPC: "the_human", features: ["transmissions", "watch_saga", "signal_intercept"], defaultTome: "kaels-revenge", discoverySong: "To Be the Human" },
  observation_deck: { id: "observation_deck", name: "Observation Deck", deck: "Deck 3", primaryNPC: null, features: ["discography", "music_player", "stargazing"], defaultTome: "the-enigmas-lament", discoverySong: "The Queen of Truth" },
  armory: { id: "armory", name: "Armory", deck: "Deck 4", primaryNPC: "agent_zero", features: ["terminus_swarm", "pvp_arena", "weapons_cache"], defaultTome: "agent-zero-foundation", discoverySong: "It Ain't Illegal" },
  engineering: { id: "engineering", name: "Engineering Bay", deck: "Deck 4", primaryNPC: "shadow_tongue", features: ["crafting", "research_lab", "card_fusion"], defaultTome: "the-engineer-foundation", discoverySong: "Virtual Reality" },
  trade_hub: { id: "trade_hub", name: "Trade Hub", deck: "Deck 5", primaryNPC: "adjudicator_locke", features: ["trade_empire", "marketplace", "diplomacy"], defaultTome: "the-politicians-reign", discoverySong: "Governance Hub" },
  cargo_bay: { id: "cargo_bay", name: "Cargo Bay", deck: "Deck 5", primaryNPC: null, features: ["collection", "inventory", "draft_tournament"], defaultTome: "iron-lion-foundation", discoverySong: null },
  trophy_room: { id: "trophy_room", name: "Trophy Room", deck: "Deck 6", primaryNPC: null, features: ["achievements", "titles", "battle_pass"], defaultTome: "the-ninth-blood-and-shadows", discoverySong: "Judgment Day" },
  captains_quarters: { id: "captains_quarters", name: "Captain's Quarters", deck: "Deck 6", primaryNPC: null, features: ["companion_hub", "morality_census"], defaultTome: "building-the-architect", discoverySong: "Lip Service" },
  // Prelude-only rooms — reachable only during narrativeAct === 0.
  // Minimal descriptors; full game UI doesn't render these post-Prelude.
  corridor: { id: "corridor", name: "Corridor", deck: "Deck 1", primaryNPC: null, features: ["breath_beat_pacing"], defaultTome: null, discoverySong: null },
  galley: { id: "galley", name: "Galley", deck: "Deck 2", primaryNPC: null, features: ["galley_hearth"], defaultTome: null, discoverySong: null },
  briefing_room: { id: "briefing_room", name: "Briefing Room", deck: "Deck 2", primaryNPC: null, features: ["kael_contingency_memo", "empty_chair"], defaultTome: null, discoverySong: null },
  mess_hall: { id: "mess_hall", name: "Mess Hall", deck: "Deck 2", primaryNPC: null, features: ["prince_archive", "sepia_flashback"], defaultTome: null, discoverySong: null },
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
    if (r === "cryo_bay") ev.push({ id: "crew_clone", roomId: r, type: "crew_cloning", title: "Incubator ready", description: "A cloning pod has completed its cycle. New crew member awaiting activation.", reward: { xp: 30 }, repeating: true, priority: 7 });
    if (r === "cryo_bay") ev.push({ id: "bloodline", roomId: r, type: "bloodline_event", title: "Bloodline milestone", description: "A new generation has been born. The genetic legacy continues.", reward: { xp: 25, dream: 15 }, repeating: true, priority: 6 });
    if (r === "engineering") ev.push({ id: "research", roomId: r, type: "research_complete", title: "Research ready", description: "Blueprint synthesized.", reward: { xp: 25 }, repeating: true, priority: 5 });
    if (r === "medical_bay") ev.push({ id: "diag", roomId: r, type: "diagnostic_scan", title: "Diagnostic available", description: "Elara wants to run your scan.", npcId: "elara", reward: { xp: 10, trust: 1 }, repeating: true, priority: 7 });
  }
  return ev;
}

function fb(s: number): RoomEvent { return { id: `fb_${s}`, roomId: "bridge", type: "lore_discovery", title: "New data fragment", description: "Check the Bridge.", repeating: true, priority: 1 }; }

/* ═══════════════════════════════════════════════════════
   ROOM STATE EVOLUTION — Rooms change based on player actions
   ═══════════════════════════════════════════════════════ */

export interface RoomVisualState {
  visualTier: number; // 0=default, 1=decorated, 2=upgraded, 3=masterwork
  damageLevel: number; // 0=pristine, 1=scuffed, 2=damaged, 3=critical
  crewPresent: string[]; // NPC IDs of assigned crew
  decorations: string[]; // Decoration IDs
}

/** Visual descriptors that change based on room state */
const ROOM_VISUAL_DESCRIPTORS: Record<RoomId, Record<number, { description: string; features: string[] }>> = {
  engineering: {
    0: { description: "Sparse workbenches with basic tools.", features: [] },
    1: { description: "New tool racks line the walls. A hum of recent activity.", features: ["tool_rack"] },
    2: { description: "Upgraded fabrication unit glows in the corner. Organized chaos.", features: ["tool_rack", "fabricator_v2"] },
    3: { description: "A master forge. Holographic blueprints rotate above every surface.", features: ["tool_rack", "fabricator_v2", "holo_blueprints", "master_anvil"] },
  },
  armory: {
    0: { description: "Standard weapons cache. Functional.", features: [] },
    1: { description: "Battle-scarred walls tell stories. Extra weapon mounts installed.", features: ["extra_mounts"] },
    2: { description: "Combat simulation holograms flicker. The walls bear quarantine marks.", features: ["extra_mounts", "combat_holo"] },
    3: { description: "A warrior's sanctum. Every surface tells a story of survival.", features: ["extra_mounts", "combat_holo", "trophy_wall", "sentinel_post"] },
  },
  bridge: {
    0: { description: "The captain's chair awaits. Standard displays.", features: [] },
    1: { description: "Conspiracy board taking shape. Star charts updated.", features: ["conspiracy_pins"] },
    2: { description: "Intelligence feeds stream across multiple screens. The board is complex.", features: ["conspiracy_pins", "multi_screen"] },
    3: { description: "A command center worthy of a fleet admiral. Every NPC has a comm channel.", features: ["conspiracy_pins", "multi_screen", "fleet_comm", "war_table"] },
  },
  archives: {
    0: { description: "Dusty shelves. Most records encrypted.", features: [] },
    1: { description: "Several tomes unlocked. The Antiquarian's presence lingers.", features: ["unlocked_shelf"] },
    2: { description: "Cross-referenced lore displays. Timeline visualization active.", features: ["unlocked_shelf", "timeline_viz"] },
    3: { description: "A living library. Seven-dimensional records pulse with knowledge.", features: ["unlocked_shelf", "timeline_viz", "dimensional_index", "antiquarian_desk"] },
  },
  cryo_bay: {
    0: { description: "Rows of pods. Most dark.", features: [] },
    1: { description: "Some pods show activity. Genetic archive partially decoded.", features: ["active_pods"] },
    2: { description: "Incubator pods online. Crew cloning operational.", features: ["active_pods", "incubator"] },
    3: { description: "A genesis chamber. Life stirs in every direction.", features: ["active_pods", "incubator", "genetic_lab", "bloodline_tree"] },
  },
  medical_bay: {
    0: { description: "Basic diagnostics. Quarantine protocols ready.", features: [] },
    1: { description: "Enhanced scanning equipment. Viral containment improved.", features: ["enhanced_scanner"] },
    2: { description: "Full neural diagnostic suite. The Source's monitoring station active.", features: ["enhanced_scanner", "neural_suite"] },
    3: { description: "A hospital that heals bodies and minds. Even the virus respects these walls.", features: ["enhanced_scanner", "neural_suite", "healing_array", "source_monitor"] },
  },
  comms_array: {
    0: { description: "Static on most channels.", features: [] },
    1: { description: "Signal boosters installed. The Human's frequency is clearer.", features: ["signal_boost"] },
    2: { description: "Multi-band receivers online. Intercepting transmissions from the Two Witnesses.", features: ["signal_boost", "multi_band"] },
    3: { description: "A listening post that hears the galaxy breathe.", features: ["signal_boost", "multi_band", "deep_space_array", "witness_channel"] },
  },
  observation_deck: {
    0: { description: "A viewport into the void.", features: [] },
    1: { description: "Star charts mounted. A favorite stargazing spot.", features: ["star_charts"] },
    2: { description: "Discography playback system installed. Music fills the space.", features: ["star_charts", "music_system"] },
    3: { description: "A cathedral of stars and sound. Elara's favorite place on the ship.", features: ["star_charts", "music_system", "constellation_map", "elara_memorial"] },
  },
  trade_hub: {
    0: { description: "Basic trading terminal.", features: [] },
    1: { description: "Market feeds streaming. Locke's office taking shape.", features: ["market_feeds"] },
    2: { description: "Diplomacy suite active. Multiple faction channels.", features: ["market_feeds", "diplomacy_suite"] },
    3: { description: "New Babylon in miniature. Every deal in the sector flows through here.", features: ["market_feeds", "diplomacy_suite", "auction_house", "locke_throne"] },
  },
  cargo_bay: {
    0: { description: "Containers and crates. Mostly sealed.", features: [] },
    1: { description: "Inventory system online. Draft tournament staging area set up.", features: ["inventory_system"] },
    2: { description: "Collection displays installed. Rare finds showcased.", features: ["inventory_system", "display_cases"] },
    3: { description: "A museum and marketplace. Every item has a story.", features: ["inventory_system", "display_cases", "vault", "curator_desk"] },
  },
  trophy_room: {
    0: { description: "Empty pedestals. Waiting for achievements.", features: [] },
    1: { description: "First trophies displayed. Battle pass progress visible.", features: ["trophy_pedestals"] },
    2: { description: "Achievement wall growing. Title display cases full.", features: ["trophy_pedestals", "achievement_wall"] },
    3: { description: "A hall of legends. Your journey written in gold.", features: ["trophy_pedestals", "achievement_wall", "legend_hall", "eternal_flame"] },
  },
  captains_quarters: {
    0: { description: "Spartan quarters. A bunk and a terminal.", features: [] },
    1: { description: "Personal touches appearing. Companion photos on the wall.", features: ["companion_photos"] },
    2: { description: "Morality census station active. The room reflects your choices.", features: ["companion_photos", "morality_display"] },
    3: { description: "A home at the edge of forever. Every companion has left their mark.", features: ["companion_photos", "morality_display", "legacy_wall", "programmers_terminal"] },
  },
  // Prelude-only rooms — only tier 0 is meaningful; other tiers repeat it
  // because these rooms don't persist past the Prelude.
  corridor: {
    0: { description: "A short curved corridor. Emergency floor strips pulse cyan.", features: [] },
    1: { description: "A short curved corridor. Emergency floor strips pulse cyan.", features: [] },
    2: { description: "A short curved corridor. Emergency floor strips pulse cyan.", features: [] },
    3: { description: "A short curved corridor. Emergency floor strips pulse cyan.", features: [] },
  },
  galley: {
    0: { description: "A small crew galley. A coffee mug sits abandoned on the counter.", features: [] },
    1: { description: "A small crew galley. A coffee mug sits abandoned on the counter.", features: [] },
    2: { description: "A small crew galley. A coffee mug sits abandoned on the counter.", features: [] },
    3: { description: "A small crew galley. A coffee mug sits abandoned on the counter.", features: [] },
  },
  briefing_room: {
    0: { description: "A briefing room with seven chairs. The eighth is empty and askew.", features: [] },
    1: { description: "A briefing room with seven chairs. The eighth is empty and askew.", features: [] },
    2: { description: "A briefing room with seven chairs. The eighth is empty and askew.", features: [] },
    3: { description: "A briefing room with seven chairs. The eighth is empty and askew.", features: [] },
  },
  mess_hall: {
    0: { description: "A small mess hall. The Prince's archive shelf is dim with age.", features: [] },
    1: { description: "A small mess hall. The Prince's archive shelf is dim with age.", features: [] },
    2: { description: "A small mess hall. The Prince's archive shelf is dim with age.", features: [] },
    3: { description: "A small mess hall. The Prince's archive shelf is dim with age.", features: [] },
  },
};

/** Get visual description for a room based on its state */
export function getRoomVisualDescription(roomId: RoomId, state: RoomVisualState): { description: string; features: string[]; damageNote?: string; crewNote?: string } {
  const tierDescriptors = ROOM_VISUAL_DESCRIPTORS[roomId];
  const tier = tierDescriptors?.[Math.min(state.visualTier, 3)] ?? tierDescriptors?.[0];
  const base = tier ?? { description: ROOMS[roomId].name, features: [] };

  let damageNote: string | undefined;
  if (state.damageLevel === 1) damageNote = "Minor scuffing visible on walls and floor.";
  else if (state.damageLevel === 2) damageNote = "Structural damage from recent quarantine. Repairs needed.";
  else if (state.damageLevel === 3) damageNote = "Critical damage. Emergency systems active. The room is barely holding.";

  let crewNote: string | undefined;
  if (state.crewPresent.length > 0) {
    crewNote = `Crew members active: ${state.crewPresent.length}. The room feels alive with purpose.`;
  }

  return { ...base, damageNote, crewNote };
}

/* ═══════════════════════════════════════════════════════
   CROSS-ROOM EVENT CHAINS — Events ripple across rooms
   ═══════════════════════════════════════════════════════ */

export interface CrossRoomAlert {
  sourceRoom: RoomId;
  targetRoom: RoomId;
  alertType: string;
  title: string;
  description: string;
  urgency: "low" | "medium" | "high";
}

/** Generate cross-room alerts from a completed event */
export function getCrossRoomAlerts(eventType: EventType, sourceRoom: RoomId): CrossRoomAlert[] {
  const alerts: CrossRoomAlert[] = [];

  if (eventType === "quarantine") {
    if (sourceRoom === "medical_bay") {
      alerts.push(
        { sourceRoom, targetRoom: "engineering", alertType: "containment", title: "Containment Protocol Active", description: "Medical Bay quarantine may compromise Engineering ventilation.", urgency: "high" },
        { sourceRoom, targetRoom: "cryo_bay", alertType: "containment", title: "Cryo Bay Alert", description: "Viral contamination spreading. Cryo pods entering protective mode.", urgency: "medium" },
      );
    }
    if (sourceRoom === "engineering") {
      alerts.push(
        { sourceRoom, targetRoom: "bridge", alertType: "system_alert", title: "Bridge Systems Warning", description: "Engineering contamination affecting ship-wide systems.", urgency: "high" },
      );
    }
  }

  if (eventType === "signal_fragment") {
    if (sourceRoom === "comms_array") {
      alerts.push(
        { sourceRoom, targetRoom: "bridge", alertType: "intel_update", title: "Conspiracy Board Update", description: "New signal data from Comms. Bridge conspiracy board has new connections.", urgency: "low" },
      );
    }
    if (sourceRoom === "bridge" || sourceRoom === "archives") {
      alerts.push(
        { sourceRoom, targetRoom: "comms_array", alertType: "signal_trace", title: "Signal Trace Available", description: "Partial coordinates decoded. Comms Array can attempt triangulation.", urgency: "medium" },
      );
    }
  }

  if (eventType === "system_anomaly") {
    alerts.push(
      { sourceRoom, targetRoom: "archives", alertType: "data_corruption", title: "Archive Corruption Detected", description: "System anomaly spreading to historical records. The Shadow Tongue is busy.", urgency: "high" },
      { sourceRoom, targetRoom: "bridge", alertType: "log_tampering", title: "Ship Logs Compromised", description: "Records being rewritten. Verify all recent entries.", urgency: "medium" },
    );
  }

  if (eventType === "tome_discovered") {
    alerts.push(
      { sourceRoom, targetRoom: "captains_quarters", alertType: "lore_resonance", title: "Captain's Log Updated", description: "New tome knowledge auto-catalogued in Captain's Quarters.", urgency: "low" },
    );
    if (sourceRoom === "archives") {
      alerts.push(
        { sourceRoom, targetRoom: "observation_deck", alertType: "star_lore", title: "Star Chart Update", description: "Tome references celestial coordinates. Observation Deck can verify.", urgency: "low" },
      );
    }
  }

  if (eventType === "crew_cloning" || eventType === "crew_activity") {
    alerts.push(
      { sourceRoom: "cryo_bay", targetRoom: "bridge", alertType: "crew_manifest", title: "Crew Manifest Updated", description: "New crew member activated. Bridge records updated.", urgency: "low" },
    );
  }

  return alerts;
}

/* ═══════════════════════════════════════════════════════
   CREW PRESENCE SYSTEM — Crew NPCs populate rooms
   after the Crew Awakening cutscene
   ═══════════════════════════════════════════════════════ */

export interface CrewMember {
  id: string;
  name: string;
  role: "engineer" | "soldier" | "medic" | "scientist" | "diplomat" | "archivist";
  defaultRoom: RoomId;
  dialogLines: string[];
}

/** Default crew that can appear after Crew Awakening */
export const DEFAULT_CREW: CrewMember[] = [
  { id: "crew_eng_1", name: "Vex", role: "engineer", defaultRoom: "engineering", dialogLines: ["The fabricator's running hot today.", "Another blueprint ready, Captain.", "Engineering holds. Barely."] },
  { id: "crew_eng_2", name: "Torque", role: "engineer", defaultRoom: "engineering", dialogLines: ["These systems weren't built for this.", "I've patched the ventilation. Again.", "The Shadow Tongue left something in the code."] },
  { id: "crew_sol_1", name: "Rax", role: "soldier", defaultRoom: "armory", dialogLines: ["The Swarm's getting closer.", "I trained under Agent Zero. Once.", "Weapons are charged and ready."] },
  { id: "crew_sol_2", name: "Kira", role: "soldier", defaultRoom: "armory", dialogLines: ["The Arena doesn't forgive hesitation.", "I've seen things in the Terminus feed...", "Ready for whatever comes through that door."] },
  { id: "crew_med_1", name: "Dr. Syl", role: "medic", defaultRoom: "medical_bay", dialogLines: ["Vital signs are... interesting.", "The viral readings concern me.", "The Source watches through the diagnostics."] },
  { id: "crew_sci_1", name: "Lumen", role: "scientist", defaultRoom: "archives", dialogLines: ["The Antiquarian left notes in the margins.", "Timeline cross-reference complete.", "Some records resist decryption. They fight back."] },
  { id: "crew_dip_1", name: "Neri", role: "diplomat", defaultRoom: "trade_hub", dialogLines: ["Locke's prices are... creative.", "The factions are shifting allegiances.", "New Babylon sends its regards. And its invoices."] },
  { id: "crew_arc_1", name: "Scroll", role: "archivist", defaultRoom: "comms_array", dialogLines: ["The Human's signal is strongest at 0300.", "I've catalogued the transmissions.", "The Two Witnesses broadcast on a frequency we don't have."] },
];

/** Get crew members present in a room based on assigned crew + defaults */
export function getCrewInRoom(roomId: RoomId, assignedCrew: string[], crewAwakened: boolean): CrewMember[] {
  if (!crewAwakened) return [];

  const inRoom: CrewMember[] = [];

  for (const crew of DEFAULT_CREW) {
    // Check if explicitly assigned to this room, or in their default room
    if (assignedCrew.includes(crew.id) || (crew.defaultRoom === roomId && !assignedCrew.length)) {
      inRoom.push(crew);
    }
  }

  return inRoom;
}

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

// Every CoNexus game has exactly one TomePlacement. The placement decides
// where the Antiquarian's tome physically appears on the Ark (and how the
// player earns the right to open it). IDs MUST match ConexusGame.id in
// apps/client/src/data/conexusGames.ts — drift here silently breaks the
// "Antiquarian's Library" discoverability check.
export const TOME_PLACEMENTS: TomePlacement[] = [
  // ─── The Foundation (origin stories of the Archons) ──────────────────
  { tomeId: "rise-of-the-neyons",       roomId: "observation_deck", method: "trust",       trustReq: { npc: "elara", min: 60 },               cardReward: "the-dreamer" },
  { tomeId: "iron-lion-foundation",     roomId: "cargo_bay",        method: "exploration",                                                    cardReward: "iron-lion" },
  { tomeId: "agent-zero-foundation",    roomId: "armory",           method: "exploration",                                                    cardReward: "agent-zero" },
  { tomeId: "eyes-of-the-watcher",      roomId: "bridge",           method: "trust",       trustReq: { npc: "elara", min: 40 },               cardReward: "the-eyes" },
  { tomeId: "the-engineer-foundation",  roomId: "engineering",      method: "exploration",                                                    cardReward: "the-engineer" },
  { tomeId: "the-oracle-foundation",    roomId: "archives",         method: "trust",       trustReq: { npc: "antiquarian", min: 30 },         cardReward: "the-oracle" },

  // ─── The Age of Privacy (surveillance, secret societies) ─────────────
  { tomeId: "brotherhood-ocularum",     roomId: "armory",           method: "npc_gift",    trustReq: { npc: "agent_zero", min: 40 },          cardReward: "iron-lion" },
  { tomeId: "building-the-architect",   roomId: "captains_quarters",method: "exploration",                                                    cardReward: "the-programmer" },
  { tomeId: "the-experiment",           roomId: "medical_bay",      method: "quest",       flagReq: "diagnostic_completed",                   cardReward: "the-warden" },
  { tomeId: "the-deployment",           roomId: "comms_array",      method: "quest",       flagReq: "panopticon_signal_traced",               cardReward: "the-authority" },

  // ─── Haven: Sundown Bazaar (New Babylon, Season 2) ───────────────────
  { tomeId: "civil-war-sundown",        roomId: "trade_hub",        method: "quest",       flagReq: "bazaar_factions_briefed",                cardReward: "the-collector" },
  { tomeId: "eternal-night",            roomId: "observation_deck", method: "quest",       flagReq: "stargazing_3",                           cardReward: "akai-shi" },
  { tomeId: "sunbreak-protocol",        roomId: "engineering",      method: "trust",       trustReq: { npc: "shadow_tongue", min: 50 },       cardReward: "the-inventor" },
  { tomeId: "circuit-of-ashes",         roomId: "comms_array",      method: "trust",       trustReq: { npc: "the_human", min: 30 },           cardReward: "the-meme" },
  { tomeId: "veil-of-blood",            roomId: "medical_bay",      method: "quest",       flagReq: "viral_ichor_stockpiled",                 cardReward: "varkul-the-blood-lord" },
  { tomeId: "grave-secrets",            roomId: "archives",         method: "quest",       flagReq: "detective_case_opened",                  cardReward: "the-detective" },
  { tomeId: "echoes-of-the-tenebrous",  roomId: "engineering",      method: "trust",       trustReq: { npc: "shadow_tongue", min: 30 },       cardReward: "the-shadow-tongue" },

  // ─── Fall of Reality (Prequel — main saga's beating heart) ───────────
  { tomeId: "baron-heart-of-time",      roomId: "trophy_room",      method: "trust",       trustReq: { npc: "antiquarian", min: 60 },         cardReward: "the-collector" },
  { tomeId: "necromancers-lair",        roomId: "medical_bay",      method: "exploration",                                                    cardReward: "the-necromancer" },
  { tomeId: "welcome-to-celebration",   roomId: "cryo_bay",         method: "exploration",                                                    cardReward: "the-architect" },
  { tomeId: "mechronis-academy",        roomId: "bridge",           method: "exploration",                                                    cardReward: "the-human" },
  { tomeId: "enigmas-lament",           roomId: "observation_deck", method: "exploration",                                                    cardReward: "the-enigma" },
  { tomeId: "dischordian-logic",        roomId: "comms_array",      method: "trust",       trustReq: { npc: "the_human", min: 50 },           cardReward: "the-dreamer" },
  { tomeId: "politicians-reign",        roomId: "trade_hub",        method: "exploration",                                                    cardReward: "the-politician" },
  { tomeId: "the-detective",            roomId: "archives",         method: "exploration",                                                    cardReward: "the-detective" },
  { tomeId: "myths-dreams-workshop",    roomId: "captains_quarters",method: "trust",       trustReq: { npc: "antiquarian", min: 40 },         cardReward: "the-dreamer" },
  { tomeId: "sanctuary-lost",           roomId: "trade_hub",        method: "npc_gift",    trustReq: { npc: "locke", min: 40 },               cardReward: "the-authority" },
  { tomeId: "blood-weave-gates-of-hell",roomId: "trophy_room",      method: "quest",       flagReq: "hierarchy_discovered",                   cardReward: "the-advocate" },
  { tomeId: "kaels-revenge",            roomId: "comms_array",      method: "exploration",                                                    cardReward: "kael" },

  // ─── Age of Potentials (post-Fall, the Ark crew's present) ───────────
  { tomeId: "awaken-the-clone",         roomId: "medical_bay",      method: "trust",       trustReq: { npc: "source", min: 40 },              cardReward: "the-white-oracle" },
  { tomeId: "brushstroke-of-the-empire",roomId: "captains_quarters",method: "quest",       flagReq: "act_5_started",                          cardReward: "the-dreamer" },
  { tomeId: "civil-war-samsara-rising", roomId: "armory",           method: "quest",       flagReq: "terminus_wave_10",                       cardReward: "samsara" },
  { tomeId: "seeds-of-inception",       roomId: "cryo_bay",         method: "quest",       flagReq: "crew_awakened",                          cardReward: "the-architect" },
  { tomeId: "terminus-swarm",           roomId: "armory",           method: "game",        flagReq: "terminus_wave_10",                       cardReward: "the-source" },
  { tomeId: "the-host",                 roomId: "medical_bay",      method: "quest",       flagReq: "quarantine_5",                           cardReward: "the-host" },
  { tomeId: "planet-of-the-wolf",       roomId: "engineering",      method: "trust",       trustReq: { npc: "shadow_tongue", min: 30 },       cardReward: "the-wolf" },

  // ─── Visions (multiverse standalones — gated by deepest progression) ─
  { tomeId: "npc-uprising",             roomId: "trophy_room",      method: "quest",       flagReq: "act_6_started",                          cardReward: "the-meme" },
  { tomeId: "yakuza-the-prince",        roomId: "trade_hub",        method: "quest",       flagReq: "yakuza_intro",                           cardReward: "jericho-jones" },
  { tomeId: "whispers-of-madness",      roomId: "observation_deck", method: "trust",       trustReq: { npc: "antiquarian", min: 70 },         cardReward: "the-silence" },
  { tomeId: "nightmare-of-oz",          roomId: "captains_quarters",method: "trust",       trustReq: { npc: "antiquarian", min: 50 },         cardReward: "the-forgotten" },
  { tomeId: "the-ninth-blood-shadows",  roomId: "trophy_room",      method: "exploration",                                                    cardReward: "the-shadow-tongue" },
];
