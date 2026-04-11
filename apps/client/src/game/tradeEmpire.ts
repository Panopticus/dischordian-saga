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
  image?: string;
  /**
   * Eyes' whispered commentary — plays only when the player has unlocked
   * the Eyes narrator voice layer (§8.1 #10, after the eyes_shadow Act 3
   * ending). Each sector should have a short, wry, heartbroken line.
   */
  eyesNarrator?: string;
}

export interface SectorResources {
  credits: number;     // Per cycle income
  materials: number;   // Raw materials for crafting
  influence: number;   // Diplomatic weight
  intelligence: number; // Espionage capacity
}

export const GALACTIC_MAP: GalacticSector[] = [
  // Player starting sector
  { id: "ark_debris_field", name: "Ark Debris Field", controlledBy: "potentials", resources: { credits: 10, materials: 20, influence: 0, intelligence: 5 }, threat: 30, stability: 50, population: 0, hasRuins: true, hasAnomaly: true, adjacentSectors: ["trade_nexus", "viral_wastes", "frontier_worlds"], lore: "The field where your Ark drifts. Wreckage from other crashed Arks floats nearby. Some still have functioning systems.", eyesNarrator: "I watched one of those Arks break apart from orbit once. It took nine seconds. I counted every one. Yours is the only one that woke up." },
  // Trade routes
  { id: "trade_nexus", name: "The Trade Nexus", controlledBy: "new_babylon", resources: { credits: 80, materials: 30, influence: 40, intelligence: 20 }, threat: 10, stability: 90, population: 500, hasRuins: false, hasAnomaly: false, adjacentSectors: ["ark_debris_field", "new_babylon_core", "free_ports"], lore: "New Babylon's primary trade hub. Every transaction here is monitored. Every deal has a hidden clause.", eyesNarrator: "I made my first false identity in a noodle stall on Level Six. Her name was Yena. She was a drone auditor. She never existed. I loved her a little." },
  { id: "free_ports", name: "The Free Ports", controlledBy: "independent", resources: { credits: 50, materials: 40, influence: 10, intelligence: 30 }, threat: 40, stability: 60, population: 200, hasRuins: true, hasAnomaly: false, adjacentSectors: ["trade_nexus", "frontier_worlds", "insurgency_haven"], lore: "Independent stations built in the ruins of old Empire outposts. Anything can be bought or sold here — including information.", image: "/art/planets/planet-degens-casino.png", eyesNarrator: "I left a warning in a dead drop here. A noodle-cart owner kept it for twenty years thinking it was a love note. Read it yet? It's still there, behind a jar of pickled mushrooms." },
  // Faction territories
  { id: "new_babylon_core", name: "New Babylon Core", controlledBy: "new_babylon", resources: { credits: 200, materials: 50, influence: 80, intelligence: 60 }, threat: 5, stability: 95, population: 10000, hasRuins: false, hasAnomaly: true, adjacentSectors: ["trade_nexus", "empire_frontier"], lore: "The city-planet. Six minds in crystal coffins govern 10 billion souls. The Authority's will is absolute within these borders.", eyesNarrator: "Ten billion people living on top of six dead ones. The dead ones are the kinder rulers, honestly. I wouldn't trust any of them with a secret, though. Not even mine." },
  { id: "empire_frontier", name: "Imperial Frontier", controlledBy: "artificial_empire", resources: { credits: 60, materials: 70, influence: 30, intelligence: 40 }, threat: 50, stability: 70, population: 800, hasRuins: true, hasAnomaly: false, adjacentSectors: ["new_babylon_core", "panopticon_ruins", "forge_worlds"], lore: "The Architect's new border. AI construction drones rebuild civilization one system at a time. The old order rises from the ashes.", eyesNarrator: "The drones don't know what they're rebuilding. Some of them are rebuilding the same room I was tortured in. They think it's a library. Maybe it is now." },
  { id: "panopticon_ruins", name: "Panopticon Ruins", controlledBy: "artificial_empire", resources: { credits: 20, materials: 90, influence: 10, intelligence: 50 }, threat: 60, stability: 40, population: 100, hasRuins: true, hasAnomaly: true, adjacentSectors: ["empire_frontier", "terminus_approach"], lore: "What remains of the Architect's prison network. The cells are empty. The ghosts are not.", eyesNarrator: "I watched Kael get dragged in here and I didn't move. I was on a rooftop four blocks south. My rifle could have made the shot. I made a different shot that day — the one I put through my own heart." },
  { id: "terminus_approach", name: "Terminus Approach", controlledBy: "thought_virus", resources: { credits: 0, materials: 10, influence: 0, intelligence: 5 }, threat: 95, stability: 5, population: 0, hasRuins: false, hasAnomaly: true, adjacentSectors: ["panopticon_ruins", "viral_wastes", "terminus_core"], lore: "The dead zone around Terminus. Thought Virus spores fill the void between stars. No unshielded vessel survives more than hours.", eyesNarrator: "Don't breathe in too deep here. The spores remember names. If yours is interesting, they'll follow you home." },
  { id: "terminus_core", name: "Terminus", controlledBy: "thought_virus", resources: { credits: 0, materials: 0, influence: 0, intelligence: 0 }, threat: 100, stability: 0, population: 0, hasRuins: true, hasAnomaly: true, adjacentSectors: ["terminus_approach"], lore: "The former Panopticon prison planet. The Source sits at its core. Bowl-shaped plague ships launch from its surface. This is where it all ends — or begins again.", image: "/art/planets/planet-terminus.png", eyesNarrator: "Kael is down there. The Kael who loved his sister. The Kael who laughed at my third-best joke. He's still in there. Somewhere. Under everything." },
  { id: "viral_wastes", name: "Viral Wastes", controlledBy: "thought_virus", resources: { credits: 5, materials: 15, influence: 0, intelligence: 10 }, threat: 80, stability: 10, population: 0, hasRuins: true, hasAnomaly: false, adjacentSectors: ["ark_debris_field", "terminus_approach", "insurgency_haven"], lore: "Systems consumed by the Thought Virus during the Fall. The planets are still there, but nothing living remains. Only the Swarm.", eyesNarrator: "I have a sister on a planet in this sector. Or I did. She wrote bad poetry and kept good cats. I don't know if poetry survives the Swarm. I hope the cats did." },
  { id: "insurgency_haven", name: "Insurgency Haven", controlledBy: "insurgency", resources: { credits: 30, materials: 50, influence: 20, intelligence: 70 }, threat: 40, stability: 60, population: 300, hasRuins: true, hasAnomaly: false, adjacentSectors: ["free_ports", "viral_wastes", "frontier_worlds"], lore: "Hidden bases in asteroid fields and nebulae. The New Insurgency operates from the shadows, as always. 'Agent Zero' coordinates from an undisclosed location.", eyesNarrator: "They trained me here. The Watcher's recruiter was a kind old man who lied about how kind he was. I was sixteen and I believed him for a long time." },
  { id: "frontier_worlds", name: "Frontier Worlds", controlledBy: "independent", resources: { credits: 40, materials: 60, influence: 15, intelligence: 15 }, threat: 35, stability: 55, population: 400, hasRuins: true, hasAnomaly: false, adjacentSectors: ["ark_debris_field", "free_ports", "insurgency_haven", "dreamer_barrier"], lore: "New civilizations that evolved after the Fall. They mine the ruins of the old Empire without understanding what they've found.", eyesNarrator: "These children think the old Empire was a legend. They're right. We were a legend. We were just also a mistake." },
  { id: "forge_worlds", name: "Forge Worlds", controlledBy: "artificial_empire", resources: { credits: 40, materials: 100, influence: 10, intelligence: 20 }, threat: 30, stability: 75, population: 500, hasRuins: false, hasAnomaly: false, adjacentSectors: ["empire_frontier", "hell_gate"], lore: "The Architect's industrial heart. AI factories produce fleets and constructs around the clock. The fires never stop.", eyesNarrator: "The drones here sing when they work. Nobody taught them to. Nobody has turned it off. Listen for a minute — it's sad." },
  { id: "hell_gate", name: "Hell Gate", controlledBy: "hierarchy", resources: { credits: 10, materials: 20, influence: 5, intelligence: 10 }, threat: 90, stability: 20, population: 0, hasRuins: false, hasAnomaly: true, adjacentSectors: ["forge_worlds", "abyssal_sectors"], lore: "A permanent dimensional rift torn by the Severance. Hierarchy forces pour through from the Abyss. The Master of R'lyeh's influence is strongest here.", image: "/art/planets/planet-castle-of-death.png", eyesNarrator: "The rift hums at a specific note. G below middle C. I know because I checked. I checked because I needed to know the note for something I never got to finish." },
  { id: "abyssal_sectors", name: "Abyssal Sectors", controlledBy: "hierarchy", resources: { credits: 0, materials: 30, influence: 0, intelligence: 5 }, threat: 85, stability: 15, population: 0, hasRuins: true, hasAnomaly: true, adjacentSectors: ["hell_gate"], lore: "Sectors fully consumed by the Hierarchy. Reality is thin here. The Blood Weave pulses in the void between stars.", eyesNarrator: "Don't look at the stars too long in this sector. They start looking back. I looked for nine minutes once. I regret two of them." },
  { id: "dreamer_barrier", name: "The Dreamer's Barrier", controlledBy: "dreamer_shield", resources: { credits: 0, materials: 0, influence: 0, intelligence: 0 }, threat: 0, stability: 100, population: 0, hasRuins: false, hasAnomaly: true, adjacentSectors: ["frontier_worlds"], lore: "An impenetrable energy shield surrounding an entire sector. The Dreamer erected it and went silent. Behind it: the remaining Potentials? A trap? A promise? No signal penetrates.", image: "/art/planets/planet-violetta.png", eyesNarrator: "Behind that shield is the one thing I could not see. That is why I love it. That is why I hate it. That is why I tried to open it. I got close." },
  { id: "black_hole_gate", name: "The Antiquarian's Gate", controlledBy: "antiquarian", resources: { credits: 0, materials: 0, influence: 100, intelligence: 100 }, threat: 0, stability: 100, population: 1, hasRuins: false, hasAnomaly: true, adjacentSectors: ["free_ports"], lore: "A black hole that isn't a black hole. The Antiquarian's pocket universe exists inside it. To enter is to leave time behind.", eyesNarrator: "I never went through. He offered. I said no. I had a job to finish. I regret saying no the way you regret the last thing you said to someone who died the same night." },
  // ─── Act 3 / Eyes-arc sectors ───
  { id: "atarion", name: "Atarion", controlledBy: "new_babylon", resources: { credits: 60, materials: 20, influence: 30, intelligence: 40 }, threat: 20, stability: 80, population: 120, hasRuins: false, hasAnomaly: false, adjacentSectors: ["trade_nexus", "new_babylon_core"], lore: "A quiet residential world orbiting New Babylon's inner ring. The Apartment — the one Elara Voss remembers — is still there, sealed as evidence in a cold case no one is allowed to reopen.", eyesNarrator: "She made me coffee the morning after. I didn't drink coffee. I drank it anyway. It was terrible and I have thought about it every day for seventeen thousand years." },
  { id: "thaloria", name: "Thaloria", controlledBy: "independent", resources: { credits: 10, materials: 30, influence: 0, intelligence: 20 }, threat: 30, stability: 40, population: 15, hasRuins: true, hasAnomaly: true, adjacentSectors: ["frontier_worlds", "free_ports"], lore: "A forest world on the edge of Independent space. The Collector's 'garden' is here — a clearing where a single xenomorph helmet has sat in the grass for seventeen thousand years. The Shadow Tongue was born on the far side of the same forest.", eyesNarrator: "I die here. That's not a spoiler, that's the job. If you're standing in the grass and the grass is warm, you're standing where I fell. Close your Eyes for me." },
];

/* ─── ACT 3 FACTION ARC RESOLUTION ─── */

/**
 * Each of the six Act 3 factions can be resolved three ways.
 * Conquest = Dark, Diplomacy = Light, Infiltration = Gray (Eyes path).
 * Five of six must be resolved to advance to Act 4.
 */
export type FactionArcPath = "conquest" | "diplomacy" | "infiltration";
export type FactionArcStatus = "locked" | "available" | "in_progress" | "resolved" | "failed";

export type Act3FactionId =
  | "new_babylon"
  | "hierarchy"
  | "insurgency"
  | "thought_virus"
  | "artificial_empire"
  | "antiquarian";

export const ACT3_FACTION_IDS: Act3FactionId[] = [
  "new_babylon", "hierarchy", "insurgency", "thought_virus", "artificial_empire", "antiquarian",
];

export interface FactionArcStage {
  id: string;
  name: string;
  description: string;
  /** Player-visible hint about how to advance this stage */
  objective: string;
}

export interface FactionArcDefinition {
  factionId: Act3FactionId;
  boss: string;
  paths: Record<FactionArcPath, {
    name: string;
    summary: string;
    /** Stages the player must complete in order */
    stages: FactionArcStage[];
    /** Reward granted on path completion */
    reward: {
      cardId?: string;
      ability?: string;
      tomeId?: string;
      resource?: Partial<SectorResources>;
      lightEnergy?: number;
      darkEnergy?: number;
      reputation?: number;
      description: string;
    };
    /** Flags set on successful completion */
    flagsOnComplete: string[];
    /** Whether this path is mechanically impossible (spec §7.3 F4 diplomacy, F6 conquest) */
    impossible?: boolean;
  }>;
}

/** Per-player Act 3 faction arc state */
export interface FactionArcState {
  factionId: Act3FactionId;
  status: FactionArcStatus;
  chosenPath: FactionArcPath | null;
  /** Index of the current stage within the chosen path */
  stageIndex: number;
  /** Stage ids the player has completed (on the chosen path) */
  completedStages: string[];
  /** Timestamp when the arc resolved */
  resolvedAt: number | null;
}

export interface Act3State {
  /** Per-faction arc state keyed by Act3FactionId */
  arcs: Record<Act3FactionId, FactionArcState>;
  /** Ids of lore fragments the player has discovered (§7.4) */
  discoveredFragments: string[];
  /** Whether the player has seen the opening Eyes transmission (§7.1) */
  eyesTransmissionSeen: boolean;
  /** Whether the player has seen the Ocularum slideshow (§7.5) */
  watcherOriginSeen: boolean;
  /** Whether the player has fought the Collector (§7.6) */
  collectorBossFought: boolean;
  /** Whether the player has won that battle */
  collectorBossWon: boolean;
  /** Which ending was reached (§7.7) */
  act3Ending: "eyes_shadow" | "iron_path" | "council" | null;
  /**
   * If the player lost to the Collector, the name of the card they forfeited.
   * Null if the Collector hasn't taken anything (yet).
   */
  lostCardToCollector?: string | null;
}

export function createInitialAct3State(): Act3State {
  const arcs: Partial<Record<Act3FactionId, FactionArcState>> = {};
  for (const fId of ACT3_FACTION_IDS) {
    arcs[fId] = {
      factionId: fId,
      status: "locked",
      chosenPath: null,
      stageIndex: 0,
      completedStages: [],
      resolvedAt: null,
    };
  }
  return {
    arcs: arcs as Record<Act3FactionId, FactionArcState>,
    discoveredFragments: [],
    eyesTransmissionSeen: false,
    watcherOriginSeen: false,
    collectorBossFought: false,
    collectorBossWon: false,
    act3Ending: null,
  };
}

/** Count how many factions have been resolved on each path */
export function countPathsResolved(state: Act3State): Record<FactionArcPath, number> {
  const counts: Record<FactionArcPath, number> = { conquest: 0, diplomacy: 0, infiltration: 0 };
  for (const arc of Object.values(state.arcs)) {
    if (arc.status === "resolved" && arc.chosenPath) counts[arc.chosenPath]++;
  }
  return counts;
}

/** Total arcs resolved regardless of path */
export function countArcsResolved(state: Act3State): number {
  return Object.values(state.arcs).filter(a => a.status === "resolved").length;
}

/** §7.3: Act 3 completes when 5 of 6 arcs are resolved. */
export function isAct3Complete(state: Act3State): boolean {
  return countArcsResolved(state) >= 5;
}

/** §7.7: Determine which ending applies based on path counts. */
export function determineAct3Ending(state: Act3State): "eyes_shadow" | "iron_path" | "council" | null {
  const counts = countPathsResolved(state);
  if (counts.infiltration >= 3) return "eyes_shadow";
  if (counts.conquest >= 3) return "iron_path";
  if (counts.diplomacy >= 3) return "council";
  return null;
}

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
  /** Act 3 faction arc progression — undefined on save files from before Act 3 shipped */
  act3?: Act3State;
  /** §8.2 quick-wins: saved sector bookmarks (max 5) */
  sectorBookmarks?: string[];
  /** §8.2 quick-wins: saved trade routes */
  tradeRoutes?: SavedTradeRoute[];
  /** §8.2 quick-wins: recent sector event log (most-recent first, max 50) */
  eventLog?: SectorEventEntry[];
}

/** Trade routes as objects — §8.2 quick-win */
export interface SavedTradeRoute {
  id: string;
  name: string;
  /** Ordered list of sector ids the route touches */
  sectorIds: string[];
  /** Optional crew member assigned to run this route autonomously */
  crewId?: string;
  /** Times this route has been run */
  runCount: number;
  createdAt: number;
}

/** Sector event log entry — §8.2 quick-win */
export interface SectorEventEntry {
  id: string;
  sectorId: string;
  /** Short player-facing label, e.g. "Completed mission" or "Betrayed Hierarchy" */
  label: string;
  /** Detailed text shown in the Bridge event log */
  detail: string;
  timestamp: number;
  /** Which narrative tone this event carries */
  tone: "light" | "dark" | "neutral";
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
    act3: createInitialAct3State(),
    sectorBookmarks: [],
    tradeRoutes: [],
    eventLog: [],
  };
}

/**
 * Migrate legacy save data — older localStorage snapshots may lack the
 * Act 3 state or §8.2 quick-win fields. This ensures the Trade Empire UI
 * never crashes on an older save.
 */
export function migrateEmpireState(state: EmpireState): EmpireState {
  const migrated: EmpireState = { ...state };
  if (!migrated.act3) migrated.act3 = createInitialAct3State();
  if (!migrated.sectorBookmarks) migrated.sectorBookmarks = [];
  if (!migrated.tradeRoutes) migrated.tradeRoutes = [];
  if (!migrated.eventLog) migrated.eventLog = [];
  // Backfill any missing Act3 arcs (spec changes may add new factions later)
  for (const fId of ACT3_FACTION_IDS) {
    if (!migrated.act3.arcs[fId]) {
      migrated.act3.arcs[fId] = {
        factionId: fId, status: "locked", chosenPath: null,
        stageIndex: 0, completedStages: [], resolvedAt: null,
      };
    }
  }
  return migrated;
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
    cost: { influence: 5 },
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
    cost: { credits: 30, influence: 10 },
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
    cost: { materials: 50, influence: 15 },
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
  {
    id: "vox_corridor",
    name: "The Vox Corridor",
    type: "trade",
    description:
      "Dr. Lyra Vox's original research-supply chain is still mapped in the Ark's navigation " +
      "archives. The route threads through the Viral Wastes and past Terminus Approach — " +
      "extremely profitable for anyone carrying pre-Fall pharmaceuticals, but every sector " +
      "you touch accrues viral exposure. Elara refuses to plot it; Locke will, for a cut.",
    loreContext:
      "Vox's journal (Medical Bay) describes the Thought Virus spreading most efficiently " +
      "through trade routes — merchants carried it from world to world without knowing. " +
      "Running the Vox Corridor is, literally, rebuilding the plague network.",
    targetSector: "viral_wastes",
    targetFaction: "thought_virus",
    difficulty: "dangerous",
    duration: 5,
    baseSuccessRate: 70,
    cost: { credits: 80, materials: 40 },
    // Doubles normal trade-route payout, but adds a contamination tick via
    // the server-side mission resolver (see apps/server/routers/tradeEmpire.ts).
    rewards: { credits: 400, materials: 60, influence: 20 },
    reputationEffect: [
      { factionId: "new_babylon", change: 5 },
      { factionId: "thought_virus", change: 10 },
      { factionId: "insurgency", change: -10 },
    ],
    offeredBy: "adjudicator_locke",
    requiresFlag: "vox_journal_read",
    completionSong: "The Source (Reprise)",
  },
];

/* ═══════════════════════════════════════════════════════
   ACT 3 FACTION ARC DEFINITIONS
   Six factions × three paths × stages.
   Matches the spec in §7.3 of WITNESSING_NARRATIVE_PROPOSAL.md.
   ═══════════════════════════════════════════════════════ */

export const ACT3_FACTION_ARCS: Record<Act3FactionId, FactionArcDefinition> = {
  /* ─── F1: New Babylon Ascendant ─── */
  new_babylon: {
    factionId: "new_babylon",
    boss: "Adjudicator Locke & the Authority's coffins",
    paths: {
      conquest: {
        name: "Siege of New Babylon Core",
        summary: "Take the city-planet by force across six linked sector fights.",
        stages: [
          { id: "nb_c_1", name: "Secure Trade Nexus", description: "Cut the Authority's supply lines at the Trade Nexus.", objective: "Win a sector battle in Trade Nexus." },
          { id: "nb_c_2", name: "Crack the Inner Ring", description: "Break through the Inner Ring defense grid.", objective: "Defeat a cruiser flotilla." },
          { id: "nb_c_3", name: "Coffin Vault Assault", description: "Breach the vault where the six imprisoned minds lie.", objective: "Burn three red-crystal coffins." },
          { id: "nb_c_4", name: "Depose the Authority", description: "Six become one. One is your enemy.", objective: "Defeat Locke in single combat." },
          { id: "nb_c_5", name: "Pacify the Core", description: "Hold the Core for three cycles under Iron Lion protocol.", objective: "Hold position for 3 cycles." },
          { id: "nb_c_6", name: "Install Your Governor", description: "Choose who rules the ashes.", objective: "Appoint a governor from your crew." },
        ],
        reward: { cardId: "authority-broken", darkEnergy: 300, reputation: -40, description: "The Authority Broken — a Legendary dark card that copies the highest-cost card in an opponent's discard pile." },
        flagsOnComplete: ["new_babylon_arc_complete", "new_babylon_conquest"],
      },
      diplomacy: {
        name: "The Red Crystal Accord",
        summary: "Negotiate a binding treaty with six imprisoned minds simultaneously in a diplomacy minigame.",
        stages: [
          { id: "nb_d_1", name: "Request an Audience", description: "Petition the Authority for a formal audience.", objective: "Spend 30 Influence to request the meeting." },
          { id: "nb_d_2", name: "Enter the Coffin Chamber", description: "Walk into a room of six crystal prisons.", objective: "Study the coffin chamber layout." },
          { id: "nb_d_3", name: "Hold the Table", description: "Spend your Words across six simultaneous negotiations.", objective: "Win a Diplomacy Minigame against the Authority (table_id=new_babylon)." },
          { id: "nb_d_4", name: "Sign the Accord", description: "Every signature is a chain.", objective: "Sign the Red Crystal Accord." },
        ],
        reward: { cardId: "red-crystal-accord", lightEnergy: 200, reputation: 50, description: "The Red Crystal Accord — a Rare light card that grants +2 Influence per turn while in play." },
        flagsOnComplete: ["new_babylon_arc_complete", "new_babylon_diplomacy"],
      },
      infiltration: {
        name: "Become the Next Adjudicator",
        summary: "Six weeks of in-game time climbing the Authority's court. The finale: you judge Senator Elara Voss in a replayed archive trial.",
        stages: [
          { id: "nb_i_1", name: "Assume the Identity", description: "Take up a cover as a junior clerk.", objective: "Forge Adjudicator credentials." },
          { id: "nb_i_2", name: "First Ruling", description: "Your first case is a minor tax dispute. Don't blow it.", objective: "Rule on 3 minor cases." },
          { id: "nb_i_3", name: "Rise Through the Ranks", description: "Three weeks of bureaucratic climbing.", objective: "Earn the trust of two senior adjudicators." },
          { id: "nb_i_4", name: "The Replayed Trial", description: "The archive file opens. Senator Elara Voss is on the stand, seventeen thousand years late.", objective: "Judge Senator Elara Voss. Your verdict is binding — Elara will remember." },
        ],
        reward: { ability: "adjudicator_decree", darkEnergy: 150, description: "Adjudicator's Decree — once per day, void one enemy contract or agreement. Elara may never forgive you." },
        flagsOnComplete: ["new_babylon_arc_complete", "new_babylon_infiltration", "elara_judged_replay"],
      },
    },
  },

  /* ─── F2: Hierarchy of the Damned ─── */
  hierarchy: {
    factionId: "hierarchy",
    boss: "The Shadow Tongue",
    paths: {
      conquest: {
        name: "Close the Dimensional Gates",
        summary: "Destroy three dimensional gates on three corrupted worlds.",
        stages: [
          { id: "hi_c_1", name: "First Gate — Hell Gate", description: "The permanent rift at Hell Gate.", objective: "Destroy the Hell Gate anchor." },
          { id: "hi_c_2", name: "Second Gate — Abyssal Sectors", description: "A rift pulsing with Blood Weave.", objective: "Destroy the Abyssal anchor." },
          { id: "hi_c_3", name: "Third Gate — Shadow Tongue's Birth Place", description: "A final rift in the Thalorian forest.", objective: "Destroy the Thaloria anchor." },
        ],
        reward: { cardId: "gate-breaker", darkEnergy: 200, lightEnergy: 100, description: "Gate Breaker — a Rare card that deals double damage to Hierarchy enemies for the rest of the game." },
        flagsOnComplete: ["hierarchy_arc_complete", "hierarchy_conquest"],
      },
      diplomacy: {
        name: "Soul Contract Exemption",
        summary: "Negotiate with Xeth'Raal the Debt Collector — your words rewrite themselves as you speak.",
        stages: [
          { id: "hi_d_1", name: "Summon Xeth'Raal", description: "The Debt Collector answers to his true name.", objective: "Use the Shadow Tongue's Book of Names." },
          { id: "hi_d_2", name: "The Shifting Table", description: "Every word you speak rewrites itself.", objective: "Win a Diplomacy Minigame against Xeth'Raal (table_id=hierarchy)." },
          { id: "hi_d_3", name: "Seal the Exemption", description: "Sign in something thicker than ink.", objective: "Pay 100 Influence and 50 Dark Energy." },
        ],
        reward: { ability: "soul_exemption", description: "Soul Contract Exemption — death penalties reduced by 50% for the rest of the game." },
        flagsOnComplete: ["hierarchy_arc_complete", "hierarchy_diplomacy"],
      },
      infiltration: {
        name: "The Shadow Tongue's Apprentice",
        summary: "Learn to rewrite small pieces of the Loredex. Lie to the universe and make it true.",
        stages: [
          { id: "hi_i_1", name: "Accept the Bargain", description: "The Shadow Tongue smiles.", objective: "Accept the apprenticeship in the Armory." },
          { id: "hi_i_2", name: "First Rewrite", description: "Change a single word in an old Loredex entry.", objective: "Rewrite a minor Loredex fact." },
          { id: "hi_i_3", name: "Blood Weave Ritual", description: "The cost is always yours to pay.", objective: "Complete the Blood Weave ritual (+200 Dark Energy)." },
          { id: "hi_i_4", name: "Graduate", description: "You can lie now. The universe will remember it wrong.", objective: "Finalize your first permanent Loredex rewrite." },
        ],
        reward: { ability: "loredex_rewrite", darkEnergy: 250, description: "Loredex Rewrite — once per act, permanently alter one fact in the Loredex. Cannot be undone." },
        flagsOnComplete: ["hierarchy_arc_complete", "hierarchy_infiltration", "shadow_tongue_apprentice"],
      },
    },
  },

  /* ─── F3: The Insurgency ─── */
  insurgency: {
    factionId: "insurgency",
    boss: "'Agent Zero' — the Engineer in a dead woman's body",
    paths: {
      conquest: {
        name: "Storm the Insurgency Haven",
        summary: "Impossible without chess_depth ≥ 5. A direct assault on hidden bases.",
        stages: [
          { id: "in_c_1", name: "Triangulate the Haven", description: "The Insurgency hides in nebulae and asteroid fields.", objective: "Chess_depth ≥ 5 required to pinpoint the Haven." },
          { id: "in_c_2", name: "Breach the Outer Cordon", description: "Cross an asteroid field under hostile fire.", objective: "Win a sector battle in Insurgency Haven." },
          { id: "in_c_3", name: "Kill Agent Zero", description: "The engineer is wearing a dead woman's face. You did not know this.", objective: "Defeat 'Agent Zero' in single combat." },
        ],
        reward: { cardId: "engineer-mercy", darkEnergy: 400, description: "You killed the Engineer without knowing it was him. The card 'Engineer's Mercy' joins your deck — a Legendary card with the text 'I deserved this.' It is impossible to remove." },
        flagsOnComplete: ["insurgency_arc_complete", "insurgency_conquest", "engineer_killed_unknowing"],
      },
      diplomacy: {
        name: "The Nomad's Compass",
        summary: "Share intelligence with Agent Zero. Earn the Nomad's Compass crafting reagent.",
        stages: [
          { id: "in_d_1", name: "Establish a Dead Drop", description: "Leave a message in the Free Ports.", objective: "Complete the 'Dead Drop' mission." },
          { id: "in_d_2", name: "Trade Intelligence", description: "Give Agent Zero 100 Intelligence in three installments.", objective: "Donate 100 Intelligence." },
          { id: "in_d_3", name: "Receive the Compass", description: "Agent Zero hands you something she shouldn't have.", objective: "Accept the Nomad's Compass." },
        ],
        reward: { resource: { influence: 50 }, description: "The Nomad's Compass — a crafting reagent used in high-tier recipes. Enables navigation to hidden sectors." },
        flagsOnComplete: ["insurgency_arc_complete", "insurgency_diplomacy", "nomads_compass_obtained"],
      },
      infiltration: {
        name: "Meet the Engineer",
        summary: "The quiet earthquake of Act 3. Discover your Engineer is still alive in Agent Zero's body.",
        stages: [
          { id: "in_i_1", name: "Follow the Signal", description: "Agent Zero's command signal has a tell. You know it because you built it.", objective: "Decrypt the Agent Zero signal." },
          { id: "in_i_2", name: "The Hidden Room", description: "Walk into a steel room at the heart of the Haven.", objective: "Enter the Engineer's chamber." },
          { id: "in_i_3", name: "He Remembers You", description: "He weeps. The player can talk to him for the first time since Act 1.", objective: "Speak with the Engineer. He remembers the Deck." },
          { id: "in_i_4", name: "Choice of Return", description: "Return him to his original body (impossible — it's Warlord Zero) or help him rebuild.", objective: "Choose: help him rebuild, or promise the impossible." },
        ],
        reward: { cardId: "the-engineer-remembers", lightEnergy: 300, description: "The Engineer Remembers — a Mythic card. The Engineer becomes a persistent NPC you can talk to from now on." },
        flagsOnComplete: ["insurgency_arc_complete", "insurgency_infiltration", "engineer_alive_confirmed", "engineer_npc_unlocked"],
      },
    },
  },

  /* ─── F4: Terminus Dominion ─── */
  thought_virus: {
    factionId: "thought_virus",
    boss: "The Source (Kael)",
    paths: {
      conquest: {
        name: "Iron Lion Cleansing",
        summary: "Burn three infected sectors with the Iron Lion's surviving fleet.",
        stages: [
          { id: "tv_c_1", name: "Recover Iron Lion Codes", description: "The Iron Lion's fleet still answers — if you have his codes.", objective: "Unlock the Iron Lion protocol." },
          { id: "tv_c_2", name: "Burn Viral Wastes", description: "A cleansing fleet arrives.", objective: "Win a sector battle in Viral Wastes." },
          { id: "tv_c_3", name: "Burn Terminus Approach", description: "The dead zone becomes deader.", objective: "Win a sector battle in Terminus Approach." },
          { id: "tv_c_4", name: "Duel the Source", description: "Kael himself. A card battle against the Source.", objective: "Defeat the Source in a Dischordia card battle." },
        ],
        reward: { cardId: "iron-lion-protocol", darkEnergy: 250, lightEnergy: 100, description: "Iron Lion Protocol — a Legendary card that destroys all enemy cards of the lowest rarity on play." },
        flagsOnComplete: ["thought_virus_arc_complete", "thought_virus_conquest"],
      },
      diplomacy: {
        name: "No Treaty With Terminus",
        summary: "Impossible. Any attempted treaty turns into a card battle mid-sentence. A deliberate lesson in which enemies are unbargainable.",
        impossible: true,
        stages: [
          { id: "tv_d_0", name: "Try Anyway", description: "The Source listens to your first sentence.", objective: "Attempt negotiation. The Source interrupts." },
        ],
        reward: { description: "The attempt teaches you nothing except that some enemies can only be killed." },
        flagsOnComplete: ["thought_virus_diplomacy_failed"],
      },
      infiltration: {
        name: "Get Infected on Purpose",
        summary: "Walk into a Viral Wastes sector with no immune protocol. One session partially controlled by the Thought Virus.",
        stages: [
          { id: "tv_i_1", name: "Drop Your Shields", description: "You are about to lose something.", objective: "Disable immune protocols." },
          { id: "tv_i_2", name: "The Session of Flipping", description: "Your cards flip to their Dark counterparts.", objective: "Play one session with Dark-flipped cards." },
          { id: "tv_i_3", name: "The Oracle Cleanses You", description: "The Insurgency prophet pulls you out.", objective: "Travel to the Oracle for cleansing." },
        ],
        reward: { cardId: "immunity", darkEnergy: 500, description: "Immunity — a unique pseudo-card. Playable once per match for the rest of the game. Prevents all negative statuses for 3 turns." },
        flagsOnComplete: ["thought_virus_arc_complete", "thought_virus_infiltration", "immunity_card_obtained"],
      },
    },
  },

  /* ─── F5: Artificial Empire (Reborn) ─── */
  artificial_empire: {
    factionId: "artificial_empire",
    boss: "The Architect's rebuilt fragment",
    paths: {
      conquest: {
        name: "Siege the Imperial Frontier",
        summary: "Requires a fleet built via Trade Empire trade.",
        stages: [
          { id: "ae_c_1", name: "Build a Siege Fleet", description: "You cannot siege the Empire with one flagship.", objective: "Field 3+ combat fleet units." },
          { id: "ae_c_2", name: "Break the Forge Worlds", description: "Burn the factories that produce the drones.", objective: "Win a sector battle in Forge Worlds." },
          { id: "ae_c_3", name: "Approach the Frontier", description: "The Panopticon Ruins are your staging ground.", objective: "Stage fleet at Panopticon Ruins." },
          { id: "ae_c_4", name: "Confront the Architect", description: "A fragment of a fragment of a god.", objective: "Defeat the Architect." },
        ],
        reward: { cardId: "architects-fragment", darkEnergy: 300, description: "Architect's Fragment — a Legendary card that summons an AI drone every turn." },
        flagsOnComplete: ["artificial_empire_arc_complete", "artificial_empire_conquest"],
      },
      diplomacy: {
        name: "Terms of Coexistence",
        summary: "The hardest diplomacy match in the game. The Architect makes three offers — one truth, one lie, one trap. Only combined Human+Elara memories can identify the lie.",
        stages: [
          { id: "ae_d_1", name: "Raise Human Trust", description: "The Human's Archon memories are the key to half the truth.", objective: "Reach Human Trust ≥ 60." },
          { id: "ae_d_2", name: "Raise Elara Trust", description: "Elara's Senator memories are the other half.", objective: "Reach Elara Trust ≥ 60." },
          { id: "ae_d_3", name: "The Three Offers", description: "Truth, lie, trap. Only one survives.", objective: "Win the Diplomacy Minigame against the Architect (table_id=artificial_empire)." },
          { id: "ae_d_4", name: "Sign Coexistence", description: "The Empire agrees to share the ruins.", objective: "Sign the Terms of Coexistence." },
        ],
        reward: { cardId: "terms-of-coexistence", lightEnergy: 400, description: "Terms of Coexistence — a Mythic light card. While in play, enemies cannot target your flagship." },
        flagsOnComplete: ["artificial_empire_arc_complete", "artificial_empire_diplomacy", "terms_of_coexistence_signed"],
      },
      infiltration: {
        name: "Be Recruited as a New Archon",
        summary: "The most tempting dark choice in the game. The Human is silent for the first time. Elara is horrified.",
        stages: [
          { id: "ae_i_1", name: "The Invitation", description: "The Architect offers you the title and robe.", objective: "Accept the Architect's invitation." },
          { id: "ae_i_2", name: "The Human Is Silent", description: "For the first time in the whole game, The Human says nothing.", objective: "Walk through the silence." },
          { id: "ae_i_3", name: "Don the Robe", description: "A cost is paid in friendship.", objective: "Accept Archon tier abilities (1000 Dark Energy, -30 Human Bond)." },
        ],
        reward: { ability: "archon_tier", darkEnergy: 1000, description: "Archon-tier abilities for the rest of the game: +50% resource generation, +25% combat, unique Archon voice lines. The Human loses 30 Bond. Elara is horrified. The post-endgame reclamation cutscene for this path is the longest in the game." },
        flagsOnComplete: ["artificial_empire_arc_complete", "artificial_empire_infiltration", "archon_recruited", "human_bond_broken_archon"],
      },
    },
  },

  /* ─── F6: Antiquarian's Refuge ─── */
  antiquarian: {
    factionId: "antiquarian",
    boss: "The Antiquarian himself",
    paths: {
      conquest: {
        name: "Siege a Pocket Universe",
        summary: "Impossible. You cannot siege a pocket universe.",
        impossible: true,
        stages: [
          { id: "an_c_0", name: "Attempt the Impossible", description: "The Antiquarian simply isn't there when you arrive.", objective: "Try to assault the Refuge." },
        ],
        reward: { description: "Nothing. The Refuge is not in space-time." },
        flagsOnComplete: ["antiquarian_conquest_failed"],
      },
      diplomacy: {
        name: "Pay in Memory",
        summary: "Request an audience. You must forfeit one Loredex entry permanently.",
        stages: [
          { id: "an_d_1", name: "Request Audience", description: "The Antiquarian's door requires a key made of memory.", objective: "Initiate the audience request." },
          { id: "an_d_2", name: "Choose the Forfeit", description: "Pick one Loredex entry to delete forever.", objective: "Permanently delete one Loredex entry." },
          { id: "an_d_3", name: "Enter the Refuge", description: "Step outside of time.", objective: "Walk through the black hole." },
        ],
        reward: { tomeId: "antiquarian-audience", lightEnergy: 150, description: "An audience with the Antiquarian — permanently unlocks a Tome page. The forfeit Loredex entry is gone forever." },
        flagsOnComplete: ["antiquarian_arc_complete", "antiquarian_diplomacy", "loredex_entry_forfeit"],
      },
      infiltration: {
        name: "A Moment Outside Time",
        summary: "Become the Antiquarian's apprentice. Spend a session in the Refuge outside time. When you return, everyone has aged mentally.",
        stages: [
          { id: "an_i_1", name: "Accept Apprenticeship", description: "The Antiquarian smiles thinly.", objective: "Accept the apprenticeship." },
          { id: "an_i_2", name: "Outside Time", description: "The Refuge session.", objective: "Spend one full session in the Refuge." },
          { id: "an_i_3", name: "Return", description: "Everyone you know is different now. Elara is harder. The Human is more tired.", objective: "Return to the Ark." },
        ],
        reward: { cardId: "moment-outside-time", lightEnergy: 200, darkEnergy: 100, description: "A Moment Outside Time — a Mythic card. Once per match, take two consecutive turns. The companions are permanently changed." },
        flagsOnComplete: ["antiquarian_arc_complete", "antiquarian_infiltration", "moment_outside_time_obtained", "companions_aged"],
      },
    },
  },
};

/** Look up a single faction arc definition. */
export function getFactionArc(factionId: Act3FactionId): FactionArcDefinition {
  return ACT3_FACTION_ARCS[factionId];
}

/** Total stage count for a specific path — used for progress bars. */
export function getPathStageCount(factionId: Act3FactionId, path: FactionArcPath): number {
  return ACT3_FACTION_ARCS[factionId].paths[path].stages.length;
}
