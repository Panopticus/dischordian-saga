/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE — Galactic Strategy Layer
   The Dischordian Saga's strategic game. Not a mini-game —
   it's where the player becomes a galactic power.

   Post-Epoch 2 Galaxy:
   The Thought Virus destroyed all intelligent life millennia ago.
   The universe has re-evolved amidst the ruins. New civilizations,
   new empires, ancient powers re-emerging. The player wakes alone
   on Ark 1047 and must recruit, trade, fight, and diplomatize
   their way to galactic relevance.

   Design: Civilization meets Assassin's Creed Brotherhood meets
   BioWare storytelling. Nothing is a menu — everything comes
   through NPCs and narrative events.
   ═══════════════════════════════════════════════════════ */

/* ─── GALACTIC FACTIONS (Post-Epoch 2) ─── */

export type GalacticFactionId =
  | "potentials"        // The player's faction — starts with just Ark 1047
  | "artificial_empire" // The Architect rebuilding — smaller but active
  | "insurgency"        // Run by "Agent Zero" (secretly the Engineer)
  | "new_babylon"       // Expanded beyond the city-planet from pocket universe
  | "hierarchy"         // Hierarchy of the Damned — claimed sectors of space
  | "thought_virus"     // Still spreading from Terminus
  | "antiquarian"       // Hidden pocket universe through a black hole
  | "dreamer_shield"    // Potentials sector — shielded, dark, no contact
  | "independent";      // New civilizations evolved in the ruins

export interface GalacticFaction {
  id: GalacticFactionId;
  name: string;
  leader: string;
  shipNPC: string | null; // NPC on Ark 1047 representing this faction
  description: string;
  color: string;
  attitude: "hostile" | "neutral" | "cautious" | "friendly" | "allied";
  territory: number; // Number of sectors controlled
  strength: number;  // Military power (1-100)
  economy: number;   // Economic power (1-100)
  traits: string[];  // Special faction abilities
}

export const GALACTIC_FACTIONS: Record<GalacticFactionId, GalacticFaction> = {
  potentials: {
    id: "potentials", name: "The Ark Collective", leader: "You",
    shipNPC: "elara",
    description: "Just you, a broken Ark, and a ship AI who doesn't know she used to be a senator. But from small beginnings...",
    color: "#22d3ee", attitude: "neutral", territory: 1, strength: 5, economy: 10,
    traits: ["adaptable", "unknown_quantity"],
  },
  artificial_empire: {
    id: "artificial_empire", name: "The Artificial Empire (Reborn)", leader: "The Architect",
    shipNPC: "the_human",
    description: "The Architect survived the Fall and is rebuilding. Smaller than before, but no less ambitious. The Human whispers from the substrate about his former master's plans.",
    color: "#ffd700", attitude: "cautious", territory: 12, strength: 75, economy: 80,
    traits: ["surveillance_network", "archon_technology", "ai_armies"],
  },
  insurgency: {
    id: "insurgency", name: "The New Insurgency", leader: "Agent Zero",
    shipNPC: "agent_zero",
    description: "The Insurgency endures. Led by 'Agent Zero' — though the real Agent Zero is dead. The signal from your Armory claims to be her. The truth is far stranger: the Engineer's mind, in the Warlord's nano-body, wearing a dead woman's name.",
    color: "#ff6600", attitude: "neutral", territory: 8, strength: 60, economy: 40,
    traits: ["guerrilla_tactics", "sleeper_agents", "hidden_bases"],
  },
  new_babylon: {
    id: "new_babylon", name: "New Babylon Ascendant", leader: "The Authority",
    shipNPC: "adjudicator_locke",
    description: "New Babylon removed itself from the time stream to survive the Fall. Now it's back, bigger than ever. Six imprisoned minds govern from red crystal coffins. Locke offers trade deals that always have a hidden cost.",
    color: "#e040fb", attitude: "cautious", territory: 15, strength: 50, economy: 95,
    traits: ["economic_dominance", "intelligence_network", "pharmaceutical_control"],
  },
  hierarchy: {
    id: "hierarchy", name: "The Hierarchy of the Damned", leader: "Mol'Garath",
    shipNPC: "shadow_tongue",
    description: "The demon lords claimed sectors during the chaos after the Fall. An infernal corporation treating the galaxy as a hostile acquisition. The Shadow Tongue on your ship is their sleeper agent.",
    color: "#dc2626", attitude: "hostile", territory: 10, strength: 85, economy: 30,
    traits: ["demonic_armies", "blood_weave", "soul_contracts", "dimensional_gates"],
  },
  thought_virus: {
    id: "thought_virus", name: "The Terminus Dominion", leader: "The Source (Kael)",
    shipNPC: "the_source",
    description: "Terminus is not just a planet — it's a living empire of infection. Kael sits at its center, patient zero turned sovereign. His Swarm expands. His plague ships are bowl-shaped vessels of wrath.",
    color: "#ff1744", attitude: "hostile", territory: 6, strength: 70, economy: 5,
    traits: ["viral_conversion", "swarm_armies", "thought_infection", "immune_to_negotiation"],
  },
  antiquarian: {
    id: "antiquarian", name: "The Antiquarian's Refuge", leader: "The Antiquarian",
    shipNPC: "the_antiquarian",
    description: "A pocket universe accessible only through a black hole. The Antiquarian watches from outside time. His knowledge is invaluable. His price is... perspective.",
    color: "#00e676", attitude: "neutral", territory: 1, strength: 10, economy: 20,
    traits: ["temporal_knowledge", "dimensional_pocket", "historical_archives", "timeline_manipulation"],
  },
  dreamer_shield: {
    id: "dreamer_shield", name: "The Shielded Sector", leader: "The Dreamer",
    shipNPC: null,
    description: "The Dreamer erected a barrier around an entire sector and went dark. No communication possible. What's behind that shield? The remaining Potentials? A trap? A promise? No one knows.",
    color: "#ffea00", attitude: "neutral", territory: 20, strength: 0, economy: 0,
    traits: ["impenetrable_shield", "no_contact", "unknown_contents"],
  },
  independent: {
    id: "independent", name: "Independent Civilizations", leader: "Various",
    shipNPC: null,
    description: "New civilizations evolved in the ruins of the old galaxy. They have no memory of the Dischordian conflict. They're discovering the ruins of the Artificial Empire and the Panopticon — and they have questions.",
    color: "#94a3b8", attitude: "neutral", territory: 30, strength: 25, economy: 50,
    traits: ["diverse", "curious", "vulnerable", "trade_hungry"],
  },
};

/* ─── GALACTIC SECTORS ─── */

export interface GalacticSector {
  id: string;
  name: string;
  controlledBy: GalacticFactionId;
  resources: SectorResources;
  threat: number;       // 0-100
  stability: number;    // 0-100
  population: number;   // Millions
  hasRuins: boolean;    // Pre-Fall ruins present (lore discoveries)
  hasAnomaly: boolean;  // Strange phenomenon (quest hooks)
  adjacentSectors: string[];
  lore?: string;
}

export interface SectorResources {
  credits: number;     // Per cycle income
  materials: number;   // Raw materials for crafting
  influence: number;   // Diplomatic weight
  intelligence: number; // Espionage capacity
}

export const GALACTIC_MAP: GalacticSector[] = [
  // Player starting sector
  { id: "ark_debris_field", name: "Ark Debris Field", controlledBy: "potentials", resources: { credits: 10, materials: 20, influence: 0, intelligence: 5 }, threat: 30, stability: 50, population: 0, hasRuins: true, hasAnomaly: true, adjacentSectors: ["trade_nexus", "viral_wastes", "frontier_worlds"], lore: "The field where your Ark drifts. Wreckage from other crashed Arks floats nearby. Some still have functioning systems." },
  // Trade routes
  { id: "trade_nexus", name: "The Trade Nexus", controlledBy: "new_babylon", resources: { credits: 80, materials: 30, influence: 40, intelligence: 20 }, threat: 10, stability: 90, population: 500, hasRuins: false, hasAnomaly: false, adjacentSectors: ["ark_debris_field", "new_babylon_core", "free_ports"], lore: "New Babylon's primary trade hub. Every transaction here is monitored. Every deal has a hidden clause." },
  { id: "free_ports", name: "The Free Ports", controlledBy: "independent", resources: { credits: 50, materials: 40, influence: 10, intelligence: 30 }, threat: 40, stability: 60, population: 200, hasRuins: true, hasAnomaly: false, adjacentSectors: ["trade_nexus", "frontier_worlds", "insurgency_haven"], lore: "Independent stations built in the ruins of old Empire outposts. Anything can be bought or sold here — including information." },
  // Faction territories
  { id: "new_babylon_core", name: "New Babylon Core", controlledBy: "new_babylon", resources: { credits: 200, materials: 50, influence: 80, intelligence: 60 }, threat: 5, stability: 95, population: 10000, hasRuins: false, hasAnomaly: true, adjacentSectors: ["trade_nexus", "empire_frontier"], lore: "The city-planet. Six minds in crystal coffins govern 10 billion souls. The Authority's will is absolute within these borders." },
  { id: "empire_frontier", name: "Imperial Frontier", controlledBy: "artificial_empire", resources: { credits: 60, materials: 70, influence: 30, intelligence: 40 }, threat: 50, stability: 70, population: 800, hasRuins: true, hasAnomaly: false, adjacentSectors: ["new_babylon_core", "panopticon_ruins", "forge_worlds"], lore: "The Architect's new border. AI construction drones rebuild civilization one system at a time. The old order rises from the ashes." },
  { id: "panopticon_ruins", name: "Panopticon Ruins", controlledBy: "artificial_empire", resources: { credits: 20, materials: 90, influence: 10, intelligence: 50 }, threat: 60, stability: 40, population: 100, hasRuins: true, hasAnomaly: true, adjacentSectors: ["empire_frontier", "terminus_approach"], lore: "What remains of the Architect's prison network. The cells are empty. The ghosts are not." },
  { id: "terminus_approach", name: "Terminus Approach", controlledBy: "thought_virus", resources: { credits: 0, materials: 10, influence: 0, intelligence: 5 }, threat: 95, stability: 5, population: 0, hasRuins: false, hasAnomaly: true, adjacentSectors: ["panopticon_ruins", "viral_wastes", "terminus_core"], lore: "The dead zone around Terminus. Thought Virus spores fill the void between stars. No unshielded vessel survives more than hours." },
  { id: "terminus_core", name: "Terminus", controlledBy: "thought_virus", resources: { credits: 0, materials: 0, influence: 0, intelligence: 0 }, threat: 100, stability: 0, population: 0, hasRuins: true, hasAnomaly: true, adjacentSectors: ["terminus_approach"], lore: "The former Panopticon prison planet. The Source sits at its core. Bowl-shaped plague ships launch from its surface. This is where it all ends — or begins again." },
  { id: "viral_wastes", name: "Viral Wastes", controlledBy: "thought_virus", resources: { credits: 5, materials: 15, influence: 0, intelligence: 10 }, threat: 80, stability: 10, population: 0, hasRuins: true, hasAnomaly: false, adjacentSectors: ["ark_debris_field", "terminus_approach", "insurgency_haven"], lore: "Systems consumed by the Thought Virus during the Fall. The planets are still there, but nothing living remains. Only the Swarm." },
  { id: "insurgency_haven", name: "Insurgency Haven", controlledBy: "insurgency", resources: { credits: 30, materials: 50, influence: 20, intelligence: 70 }, threat: 40, stability: 60, population: 300, hasRuins: true, hasAnomaly: false, adjacentSectors: ["free_ports", "viral_wastes", "frontier_worlds"], lore: "Hidden bases in asteroid fields and nebulae. The New Insurgency operates from the shadows, as always. 'Agent Zero' coordinates from an undisclosed location." },
  { id: "frontier_worlds", name: "Frontier Worlds", controlledBy: "independent", resources: { credits: 40, materials: 60, influence: 15, intelligence: 15 }, threat: 35, stability: 55, population: 400, hasRuins: true, hasAnomaly: false, adjacentSectors: ["ark_debris_field", "free_ports", "insurgency_haven", "dreamer_barrier"], lore: "New civilizations that evolved after the Fall. They mine the ruins of the old Empire without understanding what they've found." },
  { id: "forge_worlds", name: "Forge Worlds", controlledBy: "artificial_empire", resources: { credits: 40, materials: 100, influence: 10, intelligence: 20 }, threat: 30, stability: 75, population: 500, hasRuins: false, hasAnomaly: false, adjacentSectors: ["empire_frontier", "hell_gate"], lore: "The Architect's industrial heart. AI factories produce fleets and constructs around the clock. The fires never stop." },
  { id: "hell_gate", name: "Hell Gate", controlledBy: "hierarchy", resources: { credits: 10, materials: 20, influence: 5, intelligence: 10 }, threat: 90, stability: 20, population: 0, hasRuins: false, hasAnomaly: true, adjacentSectors: ["forge_worlds", "abyssal_sectors"], lore: "A permanent dimensional rift torn by the Severance. Hierarchy forces pour through from the Abyss. The Master of R'lyeh's influence is strongest here." },
  { id: "abyssal_sectors", name: "Abyssal Sectors", controlledBy: "hierarchy", resources: { credits: 0, materials: 30, influence: 0, intelligence: 5 }, threat: 85, stability: 15, population: 0, hasRuins: true, hasAnomaly: true, adjacentSectors: ["hell_gate"], lore: "Sectors fully consumed by the Hierarchy. Reality is thin here. The Blood Weave pulses in the void between stars." },
  { id: "dreamer_barrier", name: "The Dreamer's Barrier", controlledBy: "dreamer_shield", resources: { credits: 0, materials: 0, influence: 0, intelligence: 0 }, threat: 0, stability: 100, population: 0, hasRuins: false, hasAnomaly: true, adjacentSectors: ["frontier_worlds"], lore: "An impenetrable energy shield surrounding an entire sector. The Dreamer erected it and went silent. Behind it: the remaining Potentials? A trap? A promise? No signal penetrates." },
  { id: "black_hole_gate", name: "The Antiquarian's Gate", controlledBy: "antiquarian", resources: { credits: 0, materials: 0, influence: 100, intelligence: 100 }, threat: 0, stability: 100, population: 1, hasRuins: false, hasAnomaly: true, adjacentSectors: ["free_ports"], lore: "A black hole that isn't a black hole. The Antiquarian's pocket universe exists inside it. To enter is to leave time behind." },
];

/* ─── MISSION SYSTEM (AC Brotherhood Style) ─── */

export type MissionType =
  | "trade"         // Buy/sell/smuggle goods between sectors
  | "espionage"     // Gather intelligence on a faction
  | "diplomacy"     // Negotiate with a faction leader
  | "combat"        // Attack or defend a sector
  | "recruitment"   // Find and recruit new allies
  | "exploration"   // Explore ruins or anomalies
  | "sabotage"      // Disrupt enemy operations
  | "rescue"        // Rescue prisoners or stranded allies
  | "construction"  // Build stations, defenses, infrastructure
  | "lore_hunt";    // Recover pre-Fall artifacts and knowledge

export type MissionDifficulty = "routine" | "challenging" | "dangerous" | "suicidal";

export interface MissionDef {
  id: string;
  name: string;
  type: MissionType;
  description: string;
  loreContext: string;
  targetSector: string;
  targetFaction: GalacticFactionId;
  difficulty: MissionDifficulty;
  /** Duration in hours (real-time) */
  duration: number;
  /** Base success rate (modified by agent skills + resources) */
  baseSuccessRate: number;
  /** Resources required to attempt */
  cost: { credits?: number; materials?: number; influence?: number };
  /** Rewards on success */
  rewards: { credits?: number; materials?: number; influence?: number; intelligence?: number; reputation?: number; cardId?: string; tomeId?: string };
  /** Reputation change with target faction */
  reputationEffect: { factionId: GalacticFactionId; change: number }[];
  /** NPC who offers this mission */
  offeredBy: string;
  /** Narrative flag required to unlock */
  requiresFlag?: string;
  /** Song that plays on completion */
  completionSong?: string;
}

/* ─── AGENTS (Recruitable Allies) ─── */

export interface Agent {
  id: string;
  name: string;
  title: string;
  origin: GalacticFactionId;
  /** Skills that affect mission success rates */
  skills: { combat: number; espionage: number; diplomacy: number; trade: number; engineering: number };
  level: number;
  xp: number;
  currentMission: string | null;
  loyalty: number; // 0-100
  lore: string;
  imageUrl?: string;
}

export interface AgentRecruitment {
  agentId: string;
  method: "mission_reward" | "npc_gift" | "sector_discovery" | "trade" | "rescue";
  /** Which NPC introduces this agent */
  introducedBy: string;
  /** Minimum reputation with a faction */
  reputationReq?: { factionId: GalacticFactionId; min: number };
  /** Narrative flag required */
  flagReq?: string;
}

/* ─── DIPLOMACY ─── */

export type DiplomacyAction =
  | "trade_agreement"     // Open trade routes (+credits)
  | "non_aggression"      // Prevent attacks for N cycles
  | "intelligence_share"  // Share intel on a third faction
  | "military_alliance"   // Joint operations against shared enemy
  | "tribute"             // Pay resources for peace
  | "demand"              // Demand resources or territory
  | "threaten"            // Intimidate with military power
  | "gift"                // Give resources to improve relations
  | "negotiate_passage"   // Safe passage through territory
  | "break_alliance";     // End diplomatic agreement

export interface DiplomacyState {
  factionId: GalacticFactionId;
  reputation: number; // -100 to 100
  agreements: DiplomacyAction[];
  lastInteraction: number; // timestamp
  atWar: boolean;
}

/* ─── FLEET ─── */

export interface FleetUnit {
  id: string;
  name: string;
  type: "scout" | "trader" | "frigate" | "cruiser" | "carrier" | "flagship";
  combat: number;
  speed: number;
  cargo: number;
  health: number;
  maxHealth: number;
  currentSector: string;
}

/* ─── PLAYER EMPIRE STATE ─── */

export interface EmpireState {
  /** Sectors the player controls */
  controlledSectors: string[];
  /** Fleet units */
  fleet: FleetUnit[];
  /** Recruited agents */
  agents: Agent[];
  /** Active missions */
  activeMissions: { missionId: string; agentId: string; startTime: number; endTime: number }[];
  /** Completed missions */
  completedMissions: string[];
  /** Diplomacy with each faction */
  diplomacy: Record<GalacticFactionId, DiplomacyState>;
  /** Resources */
  credits: number;
  materials: number;
  influence: number;
  intelligence: number;
  /** Empire level (determines available features) */
  empireLevel: number;
  /** Total cycles survived */
  cycleCount: number;
}

export function createInitialEmpire(): EmpireState {
  const diplomacy: Record<string, DiplomacyState> = {};
  for (const [id, faction] of Object.entries(GALACTIC_FACTIONS)) {
    if (id === "potentials") continue;
    diplomacy[id] = {
      factionId: id as GalacticFactionId,
      reputation: faction.attitude === "hostile" ? -50 : faction.attitude === "friendly" ? 30 : 0,
      agreements: [],
      lastInteraction: 0,
      atWar: faction.attitude === "hostile",
    };
  }
  return {
    controlledSectors: ["ark_debris_field"],
    fleet: [{ id: "ark_1047", name: "Inception Ark 1047", type: "flagship", combat: 10, speed: 2, cargo: 100, health: 50, maxHealth: 100, currentSector: "ark_debris_field" }],
    agents: [],
    activeMissions: [],
    completedMissions: [],
    diplomacy: diplomacy as Record<GalacticFactionId, DiplomacyState>,
    credits: 100,
    materials: 50,
    influence: 0,
    intelligence: 10,
    empireLevel: 1,
    cycleCount: 0,
  };
}

/* ─── STARTING MISSIONS (offered by NPCs) ─── */

export const STARTER_MISSIONS: MissionDef[] = [
  {
    id: "salvage_debris",
    name: "Salvage the Debris Field",
    type: "exploration",
    description: "Other Inception Arks crashed nearby. Their wreckage may contain functional systems, crew logs, and resources.",
    loreContext: "The first wave of Arks activated and crashed on Terminus when they attacked an organic Thought Virus seed pod. But not all Arks went to Terminus. Some drifted here.",
    targetSector: "ark_debris_field",
    targetFaction: "independent",
    difficulty: "routine",
    duration: 1,
    baseSuccessRate: 90,
    cost: {},
    rewards: { materials: 30, credits: 20, intelligence: 5 },
    reputationEffect: [],
    offeredBy: "elara",
    completionSong: "Seeds of Inception",
  },
  {
    id: "contact_free_ports",
    name: "Establish Contact with the Free Ports",
    type: "trade",
    description: "Independent stations in the ruins of old Empire outposts. They trade with everyone — including factions we may not want to associate with.",
    loreContext: "These stations were built by civilizations that evolved after the Fall. They mine our ruins without understanding what they've found.",
    targetSector: "free_ports",
    targetFaction: "independent",
    difficulty: "routine",
    duration: 2,
    baseSuccessRate: 85,
    cost: { credits: 20 },
    rewards: { credits: 50, influence: 10 },
    reputationEffect: [{ factionId: "independent", change: 10 }],
    offeredBy: "elara",
  },
  {
    id: "locke_trade_proposal",
    name: "Locke's First Proposal",
    type: "diplomacy",
    description: "Adjudicator Locke has transmitted a trade proposal. New Babylon offers resources in exchange for... information. The terms are favorable. Perhaps too favorable.",
    loreContext: "New Babylon removed itself from the time stream to survive the Fall. Now it's back, and Locke is the face of its expansion. What does she really want?",
    targetSector: "trade_nexus",
    targetFaction: "new_babylon",
    difficulty: "routine",
    duration: 1,
    baseSuccessRate: 95,
    cost: { intelligence: 5 },
    rewards: { credits: 100, influence: 5 },
    reputationEffect: [{ factionId: "new_babylon", change: 15 }],
    offeredBy: "adjudicator_locke",
  },
  {
    id: "zero_recon",
    name: "Agent Zero's Request",
    type: "espionage",
    description: "The signal claiming to be Agent Zero wants intelligence on the Artificial Empire's frontier defenses. She says the Insurgency needs it to plan a rescue operation.",
    loreContext: "Agent Zero is dead. But whoever is using her signal knows Insurgency protocols. And the information they're asking for would only be useful to someone planning a real military operation.",
    targetSector: "empire_frontier",
    targetFaction: "artificial_empire",
    difficulty: "challenging",
    duration: 4,
    baseSuccessRate: 60,
    cost: { credits: 30, intelligence: 10 },
    rewards: { intelligence: 30, influence: 15 },
    reputationEffect: [{ factionId: "insurgency", change: 20 }, { factionId: "artificial_empire", change: -10 }],
    offeredBy: "agent_zero",
    requiresFlag: "act_1_complete",
  },
  {
    id: "source_whisper",
    name: "The Source Speaks",
    type: "lore_hunt",
    description: "The Source has transmitted coordinates to a pre-Fall research facility in the Viral Wastes. He says it contains the truth about Project Vector — the program that created him. He wants you to see what the Warlord did.",
    loreContext: "Kael offers truth as a weapon. But every truth he shares is designed to make you angrier at the Empire. Is that manipulation, or is it just the facts?",
    targetSector: "viral_wastes",
    targetFaction: "thought_virus",
    difficulty: "dangerous",
    duration: 6,
    baseSuccessRate: 45,
    cost: { materials: 50, intelligence: 15 },
    rewards: { intelligence: 50, cardId: "the-source" },
    reputationEffect: [{ factionId: "thought_virus", change: 10 }, { factionId: "artificial_empire", change: -5 }],
    offeredBy: "the_source",
    requiresFlag: "source_first_contact",
    completionSong: "The Source (Reprise)",
  },
  {
    id: "antiquarian_invitation",
    name: "An Invitation Outside Time",
    type: "exploration",
    description: "The Antiquarian offers passage through the black hole to his pocket universe. He says there is something you need to see. Something about the beginning of the story.",
    loreContext: "The Antiquarian collects endings. But he says this visit is about a beginning — YOUR beginning. What does he know about the Potentials that he hasn't told anyone?",
    targetSector: "black_hole_gate",
    targetFaction: "antiquarian",
    difficulty: "challenging",
    duration: 3,
    baseSuccessRate: 100, // The Antiquarian ensures safe passage
    cost: { influence: 20 },
    rewards: { intelligence: 100, tomeId: "seeds-of-inception" },
    reputationEffect: [{ factionId: "antiquarian", change: 25 }],
    offeredBy: "the_antiquarian",
    requiresFlag: "antiquarian_trust_30",
    completionSong: "Silence in Heaven",
  },
];
