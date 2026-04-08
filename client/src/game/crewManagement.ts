/* ═══════════════════════════════════════════════════════
   CREW MANAGEMENT — Roles, Danger, Bonuses & Lives

   The Ark needs a crew to function. Not menus — people.
   They fill roles, provide bonuses, form relationships,
   go on missions, get hurt, have children, and die.

   Every empty role is a penalty. Every full role is a bonus.
   Every death is a name on the memorial wall in the Trophy Room.

   Design: Total War family trees + XCOM soldier attachment +
   FTL crew management + Dwarf Fortress losing-is-fun.
   ═══════════════════════════════════════════════════════ */

import type { GeneticStat, BloodlineId, CrewSpecies } from "./crewGenetics";

export type RoomId = "cryo_bay" | "medical_bay" | "bridge" | "archives" | "comms_array" | "observation_deck" | "armory" | "engineering" | "trade_hub" | "cargo_bay" | "trophy_room" | "captains_quarters";

/* ─── CREW ROLES ─── */

export type CrewRoleId = "navigator" | "engineer" | "medic" | "security" | "trader" | "scientist" | "comms_officer" | "quartermaster";

export interface CrewRoleBonus {
  stat: string;
  value: number;
  percent: boolean;
  description: string;
}

export interface CrewRoleDef {
  id: CrewRoleId;
  name: string;
  assignedRoom: RoomId;
  description: string;
  statRequirements: { primary: GeneticStat; secondary: GeneticStat };
  bonuses: CrewRoleBonus[];
  emptyPenalty: string;
}

export const CREW_ROLES: Record<CrewRoleId, CrewRoleDef> = {
  navigator: {
    id: "navigator", name: "Navigator", assignedRoom: "bridge",
    description: "Charts courses through debris fields and hostile territory. A good navigator is the difference between arriving and not.",
    statRequirements: { primary: "intellect", secondary: "reflexes" },
    bonuses: [
      { stat: "trade_route_efficiency", value: 10, percent: true, description: "+10% trade route efficiency" },
      { stat: "sensor_range", value: 15, percent: true, description: "+15% sensor range" },
    ],
    emptyPenalty: "No navigator: trade routes take 25% longer. Sensor range halved.",
  },
  engineer: {
    id: "engineer", name: "Engineer", assignedRoom: "engineering",
    description: "Keeps the Ark from falling apart. Literally. The ship is old, damaged, and held together by code and stubbornness.",
    statRequirements: { primary: "intellect", secondary: "resilience" },
    bonuses: [
      { stat: "crafting_success", value: 12, percent: true, description: "+12% crafting success" },
      { stat: "repair_speed", value: 20, percent: true, description: "+20% repair speed" },
      { stat: "malfunction_chance", value: -15, percent: true, description: "-15% malfunction chance" },
    ],
    emptyPenalty: "No engineer: malfunctions double. Crafting fails 25% more often.",
  },
  medic: {
    id: "medic", name: "Medic", assignedRoom: "medical_bay",
    description: "Manages the Medical Bay, cloning pods, and quarantine protocols. When the Thought Virus stirs, the medic is the first line.",
    statRequirements: { primary: "intellect", secondary: "empathy" },
    bonuses: [
      { stat: "healing_rate", value: 25, percent: true, description: "+25% healing rate" },
      { stat: "quarantine_resistance", value: 15, percent: true, description: "+15% quarantine resistance" },
      { stat: "incubator_success", value: 10, percent: true, description: "+10% incubator success rate" },
    ],
    emptyPenalty: "No medic: injuries take twice as long to heal. Incubator malfunction chance +20%.",
  },
  security: {
    id: "security", name: "Security Officer", assignedRoom: "armory",
    description: "Runs the Armory, coordinates defense, and keeps the crew from killing each other. The last job description is harder than it sounds.",
    statRequirements: { primary: "resilience", secondary: "reflexes" },
    bonuses: [
      { stat: "defense_rating", value: 15, percent: true, description: "+15% defense rating" },
      { stat: "boarding_resistance", value: 20, percent: true, description: "+20% boarding resistance" },
      { stat: "terminus_swarm_bonus", value: 8, percent: true, description: "+8% Terminus Swarm performance" },
    ],
    emptyPenalty: "No security: boarding defense halved. Mutiny chance increased.",
  },
  trader: {
    id: "trader", name: "Trader", assignedRoom: "trade_hub",
    description: "Manages the Trade Hub, negotiates with factions, and ensures every deal favors the Ark. Locke respects competence.",
    statRequirements: { primary: "empathy", secondary: "adaptability" },
    bonuses: [
      { stat: "trade_income", value: 15, percent: true, description: "+15% trade income" },
      { stat: "marketplace_prices", value: 8, percent: true, description: "+8% better marketplace prices" },
      { stat: "diplomacy_bonus", value: 10, percent: true, description: "+10% diplomacy effectiveness" },
    ],
    emptyPenalty: "No trader: trade income -20%. Faction deals always at worst terms.",
  },
  scientist: {
    id: "scientist", name: "Scientist", assignedRoom: "archives",
    description: "Lives in the Archives. Cross-references everything. The Antiquarian approves. Everyone else finds them unnerving.",
    statRequirements: { primary: "intellect", secondary: "adaptability" },
    bonuses: [
      { stat: "research_speed", value: 20, percent: true, description: "+20% research speed" },
      { stat: "lore_discovery", value: 12, percent: true, description: "+12% lore discovery rate" },
      { stat: "signal_detection", value: 10, percent: true, description: "+10% signal detection" },
    ],
    emptyPenalty: "No scientist: research halted. Signal fragments harder to decode.",
  },
  comms_officer: {
    id: "comms_officer", name: "Comms Officer", assignedRoom: "comms_array",
    description: "Monitors the Comms Array, filters transmissions, and tries to make sense of The Human's substrate whispers. Not an easy posting.",
    statRequirements: { primary: "empathy", secondary: "intellect" },
    bonuses: [
      { stat: "transmission_intercept", value: 15, percent: true, description: "+15% transmission intercept chance" },
      { stat: "diplomatic_range", value: 20, percent: true, description: "+20% diplomatic contact range" },
      { stat: "signal_clarity", value: 10, percent: true, description: "+10% signal clarity" },
    ],
    emptyPenalty: "No comms officer: miss 30% of transmissions. Diplomatic range limited to adjacent sectors.",
  },
  quartermaster: {
    id: "quartermaster", name: "Quartermaster", assignedRoom: "cargo_bay",
    description: "Manages supplies, rations, and salvage. The unglamorous job that keeps everyone alive. They know where everything is. Everything.",
    statRequirements: { primary: "adaptability", secondary: "resilience" },
    bonuses: [
      { stat: "storage_capacity", value: 20, percent: true, description: "+20% storage capacity" },
      { stat: "salvage_yield", value: 15, percent: true, description: "+15% salvage yield" },
      { stat: "resource_efficiency", value: 10, percent: true, description: "+10% resource efficiency" },
    ],
    emptyPenalty: "No quartermaster: lose 15% of gathered resources to waste. Storage overflow risk.",
  },
};

export function getRoleDef(id: CrewRoleId): CrewRoleDef {
  return CREW_ROLES[id];
}

/* ─── CREW MEMBER ─── */

export type CrewStatus = "active" | "injured" | "sick" | "missing" | "dead" | "incubating" | "on_mission";
export type Gender = "female" | "male" | "non-binary";

export interface CrewMember {
  id: string;
  name: string;
  nickname: string | null;
  species: CrewSpecies;
  gender: Gender;
  bloodlineId: BloodlineId;
  generation: number;
  parentIds: [string, string] | null;
  children: string[];
  geneticTraits: string[];
  role: CrewRoleId | null;
  stats: Record<GeneticStat, number>;
  morale: number;
  health: number;
  loyalty: number;
  status: CrewStatus;
  age: number;
  maxAge: number;
  missionHistory: string[];
  relationships: Record<string, number>;
  deathRecord?: { cycle: number; cause: string; lastWords: string };
  birthCycle: number;
}

/* ─── NAME GENERATION ─── */

const CREW_NAMES: Record<CrewSpecies, { female: string[]; male: string[]; unisex: string[] }> = {
  human: {
    female: ["Ada", "Kira", "Mira", "Senna", "Tamsin", "Vera", "Yuki", "Zara", "Lena", "Freya", "Nadia", "Iris"],
    male: ["Aren", "Cass", "Dorian", "Ellis", "Kaius", "Marek", "Ronan", "Tobias", "Silas", "Orion", "Dane", "Jace"],
    unisex: ["Ari", "Blake", "Quinn", "Rowan", "Sage", "Wren", "Ash", "Lior"],
  },
  demagi: {
    female: ["Aethra", "Cinder", "Emberiel", "Flamora", "Pyrra", "Solace", "Vesta", "Ashara"],
    male: ["Ashkar", "Brand", "Embersong", "Pyros", "Vulcan", "Ignar", "Solarion", "Kael-Ash"],
    unisex: ["Ash", "Ember", "Flame", "Ignis", "Spark", "Char"],
  },
  quarchon: {
    female: ["Axiom-7", "Core-9", "Echo-11", "Matrix-3", "Prime-5", "Vector-8", "Phase-2"],
    male: ["Binary-2", "Delta-6", "Logic-4", "Node-1", "Query-12", "Sigma-10", "Null-7"],
    unisex: ["Cipher", "Datum", "Void-0", "Zeta-13", "Flux", "Helix"],
  },
  neyon: {
    female: ["Between-Songs", "Harmony-Bind", "Meridian", "Third-Voice", "Threshold-Daughter"],
    male: ["Bridge-Between", "Echo-Twin", "Lintel", "Mirror-Son", "Threshold-Walker"],
    unisex: ["Between", "Hinge", "Liminal", "Neither", "Seam", "Half-Light"],
  },
  voltari: {
    female: ["Arc-Singer", "Current-Mother", "Static-Weaver", "Stormcrown", "Violet-Pulse"],
    male: ["Arc-Bearer", "Lightning-Father", "Surge-Carrier", "Thunder-Tongue", "Bolt-Son"],
    unisex: ["Flash", "Glyph", "Pulse", "Resonance", "Signal", "Jolt"],
  },
  construct: {
    female: ["Archive-Unit", "Custodian-9", "Keeper-Alpha", "Lattice-Prime", "Sentinel-Hex"],
    male: ["Archivist", "Custos", "Guardian-Mk4", "Keeper", "Warden-3", "Module-7"],
    unisex: ["Frame", "Lattice", "Mesh", "Module", "Unit", "Core"],
  },
};

function pickCrewName(species: CrewSpecies, gender: Gender, seed: number): string {
  const pool = CREW_NAMES[species];
  const src = gender === "female" ? pool.female : gender === "male" ? pool.male : pool.unisex;
  return src[Math.floor((Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000)) * src.length)];
}

/* ─── SPECIES LIFESPANS ─── */

const SPECIES_LIFESPAN: Record<CrewSpecies, [number, number]> = {
  human: [60, 90],
  demagi: [80, 120],
  quarchon: [100, 200],
  neyon: [70, 150],
  voltari: [50, 80],
  construct: [200, 500],
};

/* ─── CREW GENERATION ─── */

export function generateCrewMember(
  templateId: string,
  bloodlineId: BloodlineId,
  generation: number,
  currentCycle: number,
  stats: Record<GeneticStat, number>,
  traits: string[],
  species: CrewSpecies,
  parentIds?: [string, string],
): CrewMember {
  const seed = Date.now() + Math.floor(Math.random() * 100000);
  const gender: Gender = (["female", "male", "non-binary"] as const)[seed % 3];
  const lifeRange = SPECIES_LIFESPAN[species];
  const maxAge = lifeRange[0] + Math.floor((Math.sin(seed * 7) * 10000 - Math.floor(Math.sin(seed * 7) * 10000)) * (lifeRange[1] - lifeRange[0]));

  return {
    id: `crew-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name: pickCrewName(species, gender, seed),
    nickname: null,
    species,
    gender,
    bloodlineId,
    generation,
    parentIds: parentIds || null,
    children: [],
    geneticTraits: traits,
    role: null,
    stats,
    morale: 70,
    health: 100,
    loyalty: 50,
    status: "active",
    age: 0,
    maxAge,
    missionHistory: [],
    relationships: {},
    birthCycle: currentCycle,
  };
}

/* ─── CREW ROSTER ─── */

export interface CrewRoster {
  members: CrewMember[];
  maxCapacity: number;
  deceased: CrewMember[];
  totalCloned: number;
  totalLost: number;
  generationRecord: number;
}

export const DEFAULT_CREW_ROSTER: CrewRoster = {
  members: [],
  maxCapacity: 12,
  deceased: [],
  totalCloned: 0,
  totalLost: 0,
  generationRecord: 1,
};

export function getActiveCrew(roster: CrewRoster): CrewMember[] {
  return roster.members.filter(m => m.status === "active");
}

export function getCrewByRole(roster: CrewRoster, role: CrewRoleId): CrewMember | undefined {
  return roster.members.find(m => m.role === role && m.status === "active");
}

export function getCrewByBloodline(roster: CrewRoster, bloodlineId: BloodlineId): CrewMember[] {
  return roster.members.filter(m => m.bloodlineId === bloodlineId);
}

export function getUnfilledRoles(roster: CrewRoster): CrewRoleId[] {
  const filled = new Set(roster.members.filter(m => m.role && m.status === "active").map(m => m.role!));
  return (Object.keys(CREW_ROLES) as CrewRoleId[]).filter(r => !filled.has(r));
}

/* ─── ROLE FITNESS ─── */

export function calculateRoleFitness(member: CrewMember, roleId: CrewRoleId): number {
  const role = CREW_ROLES[roleId];
  const primary = member.stats[role.statRequirements.primary] / 100;
  const secondary = member.stats[role.statRequirements.secondary] / 100;
  return Math.round((primary * 0.65 + secondary * 0.35) * 100);
}

/* ─── BONUS CALCULATION ─── */

export interface AggregatedBonuses {
  bonuses: Record<string, number>;
  penalties: string[];
  overallEfficiency: number;
}

export function calculateCrewBonuses(roster: CrewRoster): AggregatedBonuses {
  const bonuses: Record<string, number> = {};
  const penalties: string[] = [];
  let filledCount = 0;

  for (const [roleId, roleDef] of Object.entries(CREW_ROLES)) {
    const assigned = getCrewByRole(roster, roleId as CrewRoleId);
    if (!assigned) {
      penalties.push(roleDef.emptyPenalty);
      continue;
    }
    filledCount++;
    const fitness = calculateRoleFitness(assigned, roleId as CrewRoleId) / 100;
    const moraleMultiplier = assigned.morale / 100;
    const effectiveness = fitness * moraleMultiplier;

    for (const bonus of roleDef.bonuses) {
      const scaledValue = bonus.value * effectiveness;
      bonuses[bonus.stat] = (bonuses[bonus.stat] || 0) + scaledValue;
    }
  }

  const totalRoles = Object.keys(CREW_ROLES).length;
  const overallEfficiency = Math.round((filledCount / totalRoles) * 100);

  return { bonuses, penalties, overallEfficiency };
}

/* ─── DANGER SYSTEM ─── */

export type DangerType = "mission_casualty" | "quarantine_infection" | "thought_virus_exposure" | "boarding_action" | "system_malfunction" | "mutiny" | "genetic_degradation" | "old_age";

export interface DangerEvent {
  id: string;
  type: DangerType;
  severity: "minor" | "serious" | "critical" | "fatal";
  targetCrewIds: string[];
  description: string;
  playerChoices: DangerChoice[];
  outcome?: DangerOutcome;
}

export interface DangerChoice {
  label: string;
  description: string;
  cost?: { dream?: number; salvage?: number; materials?: number };
  successChance: number;
  sacrificeCrewId?: string;
}

export interface DangerOutcome {
  survived: boolean;
  description: string;
  healthChange: number;
  moraleChange: number;
  traitGained?: string;
  crewLost?: string[];
}

interface DangerTemplate {
  type: DangerType;
  severity: "minor" | "serious" | "critical" | "fatal";
  description: string;
  choices: Omit<DangerChoice, "sacrificeCrewId">[];
}

const DANGER_TEMPLATES: DangerTemplate[] = [
  { type: "quarantine_infection", severity: "serious",
    description: "Quarantine breach in the Medical Bay. [CREW_NAME] was exposed to corrupted cryo fluid. The Thought Virus fragments are active.",
    choices: [
      { label: "Full quarantine protocol", description: "Seal the Medical Bay. 48-hour lockdown. Safe but slow.", successChance: 0.95, cost: { dream: 30 } },
      { label: "Experimental treatment", description: "The Source suggests an... unconventional approach. Risky but fast.", successChance: 0.60 },
      { label: "Let their immune system fight it", description: "Some survive the Virus on their own. Most don't.", successChance: 0.35 },
    ],
  },
  { type: "boarding_action", severity: "critical",
    description: "Terminus plague drones have latched onto Deck 4. [CREW_NAME] is closest to the breach point.",
    choices: [
      { label: "Send security team", description: "Standard response. Effective if you have a Security Officer.", successChance: 0.80, cost: { salvage: 40 } },
      { label: "Vent the deck", description: "Open the airlocks. Kills the drones. Risks [CREW_NAME].", successChance: 0.90 },
      { label: "Negotiate via The Source", description: "The Source can speak to the swarm. The cost is... influence.", successChance: 0.50 },
    ],
  },
  { type: "system_malfunction", severity: "minor",
    description: "Power conduit rupture near Engineering. [CREW_NAME] caught in the discharge. Minor burns, major pride damage.",
    choices: [
      { label: "Medical attention", description: "Standard treatment. They'll be fine in a day.", successChance: 0.98, cost: { dream: 10 } },
      { label: "Walk it off", description: "They're tough. Probably.", successChance: 0.85 },
    ],
  },
  { type: "thought_virus_exposure", severity: "critical",
    description: "[CREW_NAME] accessed a corrupted data terminal in the Archives. Their eyes went red for 3.7 seconds. They say they're fine. The Source says otherwise.",
    choices: [
      { label: "Immediate neural purge", description: "Painful. Effective. May cause memory loss.", successChance: 0.85, cost: { dream: 50, salvage: 30 } },
      { label: "Quarantine and monitor", description: "Watch for symptoms. If it's early-stage, natural immunity might hold.", successChance: 0.55 },
      { label: "Ask The Source for help", description: "He knows the Virus intimately. His help always has a price.", successChance: 0.70 },
    ],
  },
  { type: "mission_casualty", severity: "fatal",
    description: "Mission to [SECTOR] went wrong. [CREW_NAME]'s shuttle lost contact 6 hours ago. Last transmission: heavy damage, life support failing.",
    choices: [
      { label: "Launch rescue mission", description: "Risk another crew member to save them. Time is critical.", successChance: 0.65, cost: { materials: 60, dream: 40 } },
      { label: "Send a drone", description: "Slower, safer for the rest of the crew. But slower.", successChance: 0.40, cost: { materials: 30 } },
      { label: "Mark as MIA", description: "Sometimes you have to accept the loss. They might still come back. Probably won't.", successChance: 0.15 },
    ],
  },
  { type: "mutiny", severity: "serious",
    description: "[CREW_NAME] has been speaking against your leadership in the mess hall. Morale is dropping. Three others are listening.",
    choices: [
      { label: "Address the crew directly", description: "Show leadership. Speak honestly. Risk being challenged.", successChance: 0.75 },
      { label: "Private conversation", description: "Find out what's really wrong. Sometimes complaints have merit.", successChance: 0.85 },
      { label: "Confine to quarters", description: "End the dissent. Create a martyr. Your call.", successChance: 0.95 },
    ],
  },
  { type: "genetic_degradation", severity: "serious",
    description: "[CREW_NAME]'s latest medical scan shows accelerated cellular decay. Their genetic template is degrading. The Resurrectionist warned about over-cloning from the same stock.",
    choices: [
      { label: "Gene therapy", description: "Expensive but can slow the degradation. Not cure it.", successChance: 0.70, cost: { dream: 80 } },
      { label: "Accept and reassign", description: "Move them to a less demanding role. They have time left. Not as much.", successChance: 1.0 },
      { label: "Consult the Resurrectionist", description: "There may be experimental options. Ne-Yon's experiments don't always end well.", successChance: 0.50 },
    ],
  },
  { type: "old_age", severity: "fatal",
    description: "[CREW_NAME] collapsed during their shift. The medical scan is clear: natural cellular expiration. They've lived a full life by their species' standards. They're asking for you.",
    choices: [
      { label: "Go to them", description: "Be there at the end. It matters.", successChance: 0.0 },
      { label: "Send Elara", description: "You have responsibilities. She'll represent you well.", successChance: 0.0 },
    ],
  },
  { type: "quarantine_infection", severity: "minor",
    description: "[CREW_NAME] showed mild fever and disorientation after proximity to Pod 47-B. Probably nothing. The Human disagrees.",
    choices: [
      { label: "Standard medical check", description: "Routine. Quick. Reassuring.", successChance: 0.95, cost: { dream: 5 } },
      { label: "Ignore it", description: "People get fevers. It's a ship, not a hospital. Oh wait.", successChance: 0.80 },
    ],
  },
  { type: "system_malfunction", severity: "critical",
    description: "Life support failure on Deck 3. [CREW_NAME] and [CREW_NAME] are trapped. O2 reserves: 4 hours.",
    choices: [
      { label: "Emergency repair team", description: "Send the engineer. Fast response, risky for the repair crew.", successChance: 0.85, cost: { materials: 50 } },
      { label: "Reroute from Deck 1", description: "Buy time. Less O2 for the rest of the ship. Buys 8 more hours.", successChance: 0.70 },
      { label: "Vent and bypass", description: "Sacrifice the section. Save the ship. Lose the crew.", successChance: 1.0 },
    ],
  },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateDangerEvent(roster: CrewRoster, daySeed: number): DangerEvent | null {
  const active = getActiveCrew(roster);
  if (active.length === 0) return null;

  // 25% chance per day of a danger event
  if (seededRandom(daySeed * 11 + 3) > 0.25) return null;

  const template = DANGER_TEMPLATES[Math.floor(seededRandom(daySeed * 7) * DANGER_TEMPLATES.length)];
  const target = active[Math.floor(seededRandom(daySeed * 13) * active.length)];
  const secondTarget = active.filter(m => m.id !== target.id)[0];

  let desc = template.description
    .replace("[CREW_NAME]", target.name)
    .replace("[SECTOR]", "the Viral Wastes");
  if (secondTarget) {
    desc = desc.replace("[CREW_NAME]", secondTarget.name);
  }

  return {
    id: `danger-${daySeed}-${template.type}`,
    type: template.type,
    severity: template.severity,
    targetCrewIds: [target.id, ...(secondTarget && desc.includes(secondTarget.name) ? [secondTarget.id] : [])],
    description: desc,
    playerChoices: template.choices.map(c => ({ ...c })),
  };
}

/* ─── MISSION INTEGRATION ─── */

export type MissionDifficulty = "routine" | "challenging" | "dangerous" | "suicidal";

const DEATH_CHANCE: Record<MissionDifficulty, number> = {
  routine: 0.01,
  challenging: 0.05,
  dangerous: 0.15,
  suicidal: 0.35,
};

export function assessMissionRisk(member: CrewMember, difficulty: MissionDifficulty): { deathChance: number; injuryChance: number; miaChance: number } {
  const baseDeath = DEATH_CHANCE[difficulty];
  const statAvg = Object.values(member.stats).reduce((s, v) => s + v, 0) / 6 / 100;
  const traitProtection = member.geneticTraits.includes("necromancers_gift") ? 0.5 : 1.0;
  const deathChance = Math.max(0.005, baseDeath * (1 - statAvg * 0.5) * traitProtection);
  const injuryChance = deathChance * 2;
  const miaChance = deathChance * 0.5;
  return { deathChance: Math.round(deathChance * 1000) / 1000, injuryChance: Math.round(injuryChance * 1000) / 1000, miaChance: Math.round(miaChance * 1000) / 1000 };
}

const LAST_WORDS = [
  "Tell them I didn't hesitate.",
  "The stars look different from here.",
  "I always knew it would be a Tuesday.",
  "Was I... useful?",
  "Don't clone me again. Let this one be the last.",
  "I saw something out there. Something beautiful.",
  "The Collector was right about us.",
  "Take care of the others. They need you more than I did.",
  "I had a dream last night. It was warm.",
  "Promise me you'll keep the lights on in the observation deck.",
];

export function resolveMissionReturn(member: CrewMember, success: boolean, difficulty: MissionDifficulty, seed: number): CrewMember {
  const risk = assessMissionRisk(member, difficulty);
  const roll = seededRandom(seed);

  if (roll < risk.deathChance) {
    return {
      ...member,
      status: "dead",
      health: 0,
      deathRecord: {
        cycle: member.age,
        cause: `Lost during ${difficulty} mission`,
        lastWords: LAST_WORDS[Math.floor(seededRandom(seed * 17) * LAST_WORDS.length)],
      },
    };
  }

  if (roll < risk.deathChance + risk.miaChance) {
    return { ...member, status: "missing", morale: Math.max(0, member.morale - 30) };
  }

  if (roll < risk.deathChance + risk.miaChance + risk.injuryChance) {
    return {
      ...member,
      status: "injured",
      health: Math.max(10, member.health - 20 - Math.floor(seededRandom(seed * 23) * 30)),
      morale: Math.max(0, member.morale - 10),
      missionHistory: [...member.missionHistory, `mission-${seed}`],
    };
  }

  // Success: gain XP equivalent (morale + loyalty boost)
  return {
    ...member,
    morale: Math.min(100, member.morale + (success ? 15 : 5)),
    loyalty: Math.min(100, member.loyalty + (success ? 8 : 2)),
    missionHistory: [...member.missionHistory, `mission-${seed}`],
  };
}
