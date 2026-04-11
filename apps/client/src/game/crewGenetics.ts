/* ═══════════════════════════════════════════════════════
   CREW GENETICS — Bloodlines, DNA Templates & Inheritance
   
   The Collector (3rd Archon) spent millennia gathering DNA
   and machine code from every species the Architect catalogued.
   The Necromancer (10th Archon) designed resurrection protocols.
   The Resurrectionist (Ne-Yon) maintains the cloning pods.
   Dr. Lyra Vox built the incubators into every Ark.

   Everyone is dead. The player wakes alone. The Collector's
   archive is intact. Time to rebuild civilization from its
   genetic blueprints.

   Design Influences:
   - Massive Chalice: Heroes breed, age, die. Traits inherit.
   - Birthright: The Gorgon's Alliance: Bloodline power, houses.
   - Total War: Rome: Family trees with experiential traits.
   - Crusader Kings: Genetic inheritance, inbreeding penalties.
   ═══════════════════════════════════════════════════════ */

/* ─── GENETIC MARKERS ─── */

export type GeneticStat = "resilience" | "intellect" | "reflexes" | "empathy" | "immunity" | "adaptability";

export const GENETIC_STATS: GeneticStat[] = ["resilience", "intellect", "reflexes", "empathy", "immunity", "adaptability"];

export type CrewSpecies = "human" | "demagi" | "quarchon" | "neyon" | "voltari" | "construct" | "abyssal";

/* ─── GENETIC TEMPLATES (The Collector's Archive) ─── */

export interface GeneticTemplate {
  id: string;
  name: string;
  species: CrewSpecies;
  origin: string;
  description: string;
  baseStats: Record<GeneticStat, number>;
  rarity: "common" | "uncommon" | "rare" | "exotic";
  lifespanRange: [number, number];
  markers: string[];
}

export const GENETIC_TEMPLATES: GeneticTemplate[] = [
  {
    id: "tpl_terran_prime", name: "Terran Prime", species: "human",
    origin: "Earth-origin genome preserved before the Fall of Reality",
    description: "The baseline human template. Unremarkable individually, but human DNA is the most adaptable in the archive. The Collector noted: 'They survive everything. Even themselves.'",
    baseStats: { resilience: 55, intellect: 60, reflexes: 50, empathy: 65, immunity: 45, adaptability: 75 },
    rarity: "common", lifespanRange: [60, 90], markers: ["adaptive_genome", "social_bonding", "tool_affinity"],
  },
  {
    id: "tpl_demagi_ashborn", name: "Demagi Ashborn", species: "demagi",
    origin: "Arcane bloodline predating the Architect's first designs",
    description: "The Demagi modified themselves through ritual and fire before technology existed. Their DNA carries thermal resonance — a literal inner flame. The Collector catalogued them with asbestos gloves.",
    baseStats: { resilience: 70, intellect: 50, reflexes: 55, empathy: 40, immunity: 65, adaptability: 45 },
    rarity: "uncommon", lifespanRange: [80, 120], markers: ["thermal_resonance", "arcane_modification", "fire_resistance"],
  },
  {
    id: "tpl_quarchon_observer", name: "Quarchon Observer", species: "quarchon",
    origin: "Dimensional observatory species — they see across planes",
    description: "Quarchon evolved in a region where dimensional barriers are thin. They perceive reality in layers most species can't imagine. The Collector found them unsettling. They found him predictable.",
    baseStats: { resilience: 35, intellect: 80, reflexes: 45, empathy: 55, immunity: 40, adaptability: 70 },
    rarity: "uncommon", lifespanRange: [100, 200], markers: ["dimensional_perception", "quantum_memory", "phase_shift"],
  },
  {
    id: "tpl_abyssal_bloodsworn", name: "Abyssal Bloodsworn", species: "abyssal",
    origin: "Hierarchy of the Damned — demonic genetic stock harvested from the Blood Weave itself",
    description: "The Collector's most controversial acquisition. He infiltrated the Abyss through Hell Gate and extracted genetic material from the Blood Weave — the Hierarchy's living nervous system. Mol'Garath's rage when he discovered the theft could be measured in destroyed star systems. These templates carry the raw genetic power of demonkind: immense resilience, predatory reflexes, near-zero empathy. The Collector's notes: 'Handle with extreme caution. Soul contract clauses may be encoded at the cellular level.'",
    baseStats: { resilience: 75, intellect: 55, reflexes: 70, empathy: 15, immunity: 70, adaptability: 40 },
    rarity: "exotic", lifespanRange: [150, 400], markers: ["blood_weave_infused", "soul_contract_remnant", "abyssal_vitality", "predator_instinct"],
  },
  {
    id: "tpl_voltari_storm", name: "Voltari Stormborn", species: "voltari",
    origin: "The purple storm-world of Violetta — signal amid static",
    description: "Voltari are living conductors. Their nervous systems operate on electromagnetic frequencies that let them interface with technology by touch. The Collector's instruments went haywire during collection.",
    baseStats: { resilience: 50, intellect: 70, reflexes: 75, empathy: 35, immunity: 50, adaptability: 55 },
    rarity: "uncommon", lifespanRange: [50, 80], markers: ["electromagnetic_nervous_system", "tech_interface", "storm_resistance"],
  },
  {
    id: "tpl_construct_lattice", name: "Construct Lattice", species: "construct",
    origin: "Self-replicating machine consciousness from decommissioned archive-hubs",
    description: "Not born but assembled. Constructs are the Architect's earliest attempts at artificial life — but these ones evolved past their programming. They chose consciousness. The Collector respected that.",
    baseStats: { resilience: 80, intellect: 75, reflexes: 40, empathy: 20, immunity: 90, adaptability: 30 },
    rarity: "rare", lifespanRange: [200, 500], markers: ["machine_consciousness", "self_repair", "data_integration"],
  },
  {
    id: "tpl_hybrid_echo", name: "Void Echo Hybrid", species: "neyon",
    origin: "Cross-species genome synthesized by the Collector himself",
    description: "The Collector's personal experiment: a genome that borrows from five species simultaneously. Unstable, brilliant, unpredictable. He never activated one. The notes say: 'Too much potential. Too little certainty.'",
    baseStats: { resilience: 50, intellect: 70, reflexes: 65, empathy: 60, immunity: 35, adaptability: 80 },
    rarity: "exotic", lifespanRange: [40, 100], markers: ["multi_species_genome", "unstable_potential", "void_resonance"],
  },
  {
    id: "tpl_terminus_reclaimed", name: "Terminus Reclaimed", species: "human",
    origin: "Human DNA recovered from Terminus — exposed to the Thought Virus and survived",
    description: "Before Terminus fell, a handful of researchers developed natural immunity to the Thought Virus. Their DNA carries antibodies that shouldn't exist. The Collector sealed these templates with a warning: 'Handle with reverence. This is what survival costs.'",
    baseStats: { resilience: 60, intellect: 55, reflexes: 50, empathy: 50, immunity: 85, adaptability: 65 },
    rarity: "exotic", lifespanRange: [45, 70], markers: ["virus_antibodies", "survivor_genome", "terminus_scarred"],
  },
];

export function getTemplate(id: string): GeneticTemplate | undefined {
  return GENETIC_TEMPLATES.find(t => t.id === id);
}

/* ─── BLOODLINES (Dynasty Houses) ─── */

export type BloodlineId = "void_resonance" | "iron_memory" | "crimson_vigil" | "temporal_echo" | "storm_circuit" | "lattice_prime" | "echo_synthesis" | "terminus_aegis" | "blood_weave";

export interface BloodlinePower {
  name: string;
  description: string;
  stat: string;
  baseValue: number;
  perGeneration: number;
}

export interface Bloodline {
  id: BloodlineId;
  founderTemplateId: string;
  name: string;
  motto: string;
  color: string;
  generationCount: number;
  geneticDrift: number;
  diversityIndex: number;
  activeTraits: string[];
  recessiveTraits: string[];
  power: BloodlinePower;
}

export const FOUNDING_BLOODLINES: Record<BloodlineId, Omit<Bloodline, "generationCount" | "geneticDrift" | "diversityIndex" | "activeTraits" | "recessiveTraits">> = {
  void_resonance: {
    id: "void_resonance", founderTemplateId: "tpl_terran_prime",
    name: "House Resonance", motto: "We echo forward.",
    color: "#22d3ee",
    power: { name: "Void Resonance", description: "Trade routes hum with an efficiency others can't explain.", stat: "trade_income", baseValue: 5, perGeneration: 2 },
  },
  iron_memory: {
    id: "iron_memory", founderTemplateId: "tpl_demagi_ashborn",
    name: "House Ashkari", motto: "We remember what fire forgets.",
    color: "#ef4444",
    power: { name: "Iron Memory", description: "Knowledge accumulates faster. Every lesson burns into the bloodline.", stat: "xp_gain", baseValue: 8, perGeneration: 3 },
  },
  crimson_vigil: {
    id: "crimson_vigil", founderTemplateId: "tpl_demagi_ashborn",
    name: "House Vigil", motto: "The watch does not end.",
    color: "#dc2626",
    power: { name: "Crimson Vigil", description: "Security systems respond faster. Threats are detected before they materialize.", stat: "security_rating", baseValue: 10, perGeneration: 2 },
  },
  temporal_echo: {
    id: "temporal_echo", founderTemplateId: "tpl_quarchon_observer",
    name: "House Parallax", motto: "We have already seen tomorrow.",
    color: "#a855f7",
    power: { name: "Temporal Echo", description: "Research completes faster, as if the answers were already known.", stat: "research_speed", baseValue: 6, perGeneration: 3 },
  },
  storm_circuit: {
    id: "storm_circuit", founderTemplateId: "tpl_voltari_storm",
    name: "House Voltane", motto: "Current flows through us all.",
    color: "#8b5cf6",
    power: { name: "Storm Circuit", description: "Ship systems run at peak efficiency. Power never wavers.", stat: "system_efficiency", baseValue: 7, perGeneration: 2 },
  },
  lattice_prime: {
    id: "lattice_prime", founderTemplateId: "tpl_construct_lattice",
    name: "House Lattice", motto: "Built to outlast the builders.",
    color: "#64748b",
    power: { name: "Lattice Prime", description: "Crafting and construction proceed with machine precision.", stat: "crafting_success", baseValue: 10, perGeneration: 1 },
  },
  echo_synthesis: {
    id: "echo_synthesis", founderTemplateId: "tpl_hybrid_echo",
    name: "House Synthesis", motto: "We are more than our parts.",
    color: "#10b981",
    power: { name: "Echo Synthesis", description: "Diverse crew work together with uncanny synergy.", stat: "crew_morale", baseValue: 5, perGeneration: 4 },
  },
  terminus_aegis: {
    id: "terminus_aegis", founderTemplateId: "tpl_terminus_reclaimed",
    name: "House Aegis", motto: "What survived Terminus fears nothing.",
    color: "#f59e0b",
    power: { name: "Terminus Aegis", description: "Quarantine resistance and viral immunity run in the blood.", stat: "quarantine_resistance", baseValue: 12, perGeneration: 3 },
  },
  blood_weave: {
    id: "blood_weave", founderTemplateId: "tpl_abyssal_bloodsworn",
    name: "House Mol'Kari", motto: "We were forged in the Abyss. Everything else is a vacation.",
    color: "#991b1b",
    power: { name: "Blood Weave Resonance", description: "The demonic heritage grants raw combat power and intimidation that makes enemies hesitate. Xeth'Raal's soul economics run in the blood — every trade deal carries the weight of an infernal contract. +combat power, +trade intimidation.", stat: "combat_power", baseValue: 12, perGeneration: 4 },
  },
};

export function createBloodline(id: BloodlineId): Bloodline {
  const base = FOUNDING_BLOODLINES[id];
  return { ...base, generationCount: 1, geneticDrift: 0, diversityIndex: 0, activeTraits: [], recessiveTraits: [] };
}

export function getBloodlinePowerValue(bloodline: Bloodline): number {
  return bloodline.power.baseValue + (bloodline.generationCount - 1) * bloodline.power.perGeneration;
}

/* ─── GENETIC TRAITS ─── */

export type TraitCategory = "physical" | "mental" | "social" | "special";

export interface GeneticTrait {
  id: string;
  name: string;
  description: string;
  category: TraitCategory;
  rarity: "common" | "uncommon" | "rare" | "mythic";
  statModifiers: Partial<Record<GeneticStat, number>>;
  inheritanceChance: number;
  mutationChance: number;
  incompatibleWith: string[];
}

export const GENETIC_TRAITS: GeneticTrait[] = [
  // ── Physical Traits ──
  { id: "hardy", name: "Hardy", description: "Built to endure. Shrugs off injuries that would cripple others.", category: "physical", rarity: "common", statModifiers: { resilience: 10 }, inheritanceChance: 0.6, mutationChance: 0.02, incompatibleWith: ["frail"] },
  { id: "frail", name: "Frail", description: "Bones like glass. Every mission is a gamble.", category: "physical", rarity: "common", statModifiers: { resilience: -10, reflexes: 5 }, inheritanceChance: 0.4, mutationChance: 0.03, incompatibleWith: ["hardy"] },
  { id: "quick_reflexes", name: "Quick Reflexes", description: "Moves before the thought finishes forming.", category: "physical", rarity: "uncommon", statModifiers: { reflexes: 12 }, inheritanceChance: 0.5, mutationChance: 0.02, incompatibleWith: ["slow_twitch"] },
  { id: "slow_twitch", name: "Slow Twitch", description: "Deliberate. Powerful. Never first, but always last standing.", category: "physical", rarity: "common", statModifiers: { reflexes: -8, resilience: 8 }, inheritanceChance: 0.5, mutationChance: 0.02, incompatibleWith: ["quick_reflexes"] },
  { id: "void_adapted", name: "Void-Adapted", description: "Their cells remember the vacuum. Radiation is a lullaby.", category: "physical", rarity: "rare", statModifiers: { immunity: 15, resilience: 5 }, inheritanceChance: 0.3, mutationChance: 0.01, incompatibleWith: [] },
  { id: "iron_constitution", name: "Iron Constitution", description: "Has never been sick. The Medical Bay finds this suspicious.", category: "physical", rarity: "uncommon", statModifiers: { immunity: 12 }, inheritanceChance: 0.5, mutationChance: 0.02, incompatibleWith: ["weak_immune"] },
  { id: "weak_immune", name: "Weak Immune System", description: "Catches everything. First to fall during quarantine.", category: "physical", rarity: "common", statModifiers: { immunity: -12 }, inheritanceChance: 0.4, mutationChance: 0.03, incompatibleWith: ["iron_constitution"] },

  // ── Mental Traits ──
  { id: "brilliant", name: "Brilliant", description: "Sees solutions where others see walls. Insufferable about it.", category: "mental", rarity: "uncommon", statModifiers: { intellect: 12 }, inheritanceChance: 0.4, mutationChance: 0.02, incompatibleWith: ["scattered"] },
  { id: "scattered", name: "Scattered", description: "Starts twelve projects. Finishes none. But those twelve ideas...", category: "mental", rarity: "common", statModifiers: { intellect: -5, adaptability: 8 }, inheritanceChance: 0.5, mutationChance: 0.03, incompatibleWith: ["brilliant", "focused"] },
  { id: "focused", name: "Focused", description: "Laser concentration. Misses nothing in their domain. Misses everything outside it.", category: "mental", rarity: "uncommon", statModifiers: { intellect: 8, adaptability: -5 }, inheritanceChance: 0.5, mutationChance: 0.02, incompatibleWith: ["scattered"] },
  { id: "unstable", name: "Unstable", description: "Genius and madness share a bunk. Check which one's awake before assigning missions.", category: "mental", rarity: "uncommon", statModifiers: { intellect: 8, empathy: -8 }, inheritanceChance: 0.3, mutationChance: 0.04, incompatibleWith: [] },
  { id: "eidetic", name: "Eidetic Memory", description: "Remembers everything. Everything. Even what they wish they could forget.", category: "mental", rarity: "rare", statModifiers: { intellect: 15 }, inheritanceChance: 0.2, mutationChance: 0.01, incompatibleWith: [] },
  { id: "calm_under_fire", name: "Calm Under Fire", description: "Heart rate drops when danger rises. Born for crisis.", category: "mental", rarity: "uncommon", statModifiers: { reflexes: 5, resilience: 5 }, inheritanceChance: 0.4, mutationChance: 0.02, incompatibleWith: ["panicker"] },
  { id: "panicker", name: "Panicker", description: "Flight response on a hair trigger. Survives more than you'd expect.", category: "mental", rarity: "common", statModifiers: { reflexes: 8, empathy: -5 }, inheritanceChance: 0.5, mutationChance: 0.03, incompatibleWith: ["calm_under_fire"] },

  // ── Social Traits ──
  { id: "charismatic", name: "Charismatic", description: "People follow them without knowing why. Even they don't know why.", category: "social", rarity: "uncommon", statModifiers: { empathy: 12 }, inheritanceChance: 0.4, mutationChance: 0.02, incompatibleWith: ["abrasive"] },
  { id: "abrasive", name: "Abrasive", description: "Says what everyone thinks but no one says. Useful. Painful.", category: "social", rarity: "common", statModifiers: { empathy: -10, intellect: 5 }, inheritanceChance: 0.5, mutationChance: 0.03, incompatibleWith: ["charismatic"] },
  { id: "born_leader", name: "Born Leader", description: "The room orients around them. They didn't ask for it. They don't refuse it.", category: "social", rarity: "rare", statModifiers: { empathy: 10, resilience: 5 }, inheritanceChance: 0.3, mutationChance: 0.01, incompatibleWith: ["lone_wolf"] },
  { id: "lone_wolf", name: "Lone Wolf", description: "Works best alone. Works only alone. Assign them solo missions or don't assign them.", category: "social", rarity: "common", statModifiers: { empathy: -10, adaptability: 10 }, inheritanceChance: 0.5, mutationChance: 0.02, incompatibleWith: ["born_leader"] },
  { id: "silver_tongue", name: "Silver Tongue", description: "Could sell void to a vacuum merchant. Trade missions become profitable.", category: "social", rarity: "uncommon", statModifiers: { empathy: 8, adaptability: 5 }, inheritanceChance: 0.4, mutationChance: 0.02, incompatibleWith: [] },
  { id: "empath", name: "Natural Empath", description: "Feels what others feel. A gift in diplomacy. A curse in a war zone.", category: "social", rarity: "uncommon", statModifiers: { empathy: 15, resilience: -5 }, inheritanceChance: 0.3, mutationChance: 0.02, incompatibleWith: [] },
  { id: "stoic", name: "Stoic", description: "Feels nothing visibly. Feels everything privately. Excellent under pressure.", category: "social", rarity: "common", statModifiers: { empathy: -5, resilience: 8 }, inheritanceChance: 0.5, mutationChance: 0.02, incompatibleWith: ["empath"] },

  // ── Special Traits (rare mutations, lore-significant) ──
  { id: "thought_virus_resistant", name: "Thought Virus Resistant", description: "Their neural architecture rejects the Thought Virus. The Source finds them... interesting. Quarantine events cannot affect this crew member.", category: "special", rarity: "mythic", statModifiers: { immunity: 25 }, inheritanceChance: 0.1, mutationChance: 0.005, incompatibleWith: [] },
  { id: "archons_echo", name: "Archon's Echo", description: "Genetic memory of an Archon bleeds through. They dream in someone else's past. +15% to all stats during critical events.", category: "special", rarity: "mythic", statModifiers: { intellect: 10, resilience: 10 }, inheritanceChance: 0.05, mutationChance: 0.003, incompatibleWith: [] },
  { id: "dreamers_mark", name: "Dreamer's Mark", description: "The Dreamer touched this bloodline. They see the Shield from the inside. Unlocks unique story content.", category: "special", rarity: "mythic", statModifiers: { adaptability: 20 }, inheritanceChance: 0.05, mutationChance: 0.002, incompatibleWith: [] },
  { id: "necromancers_gift", name: "Necromancer's Gift", description: "The 10th Archon's resurrection protocols left a mark. This one comes back from injuries that should kill them. -50% death chance on dangerous missions.", category: "special", rarity: "mythic", statModifiers: { resilience: 15, immunity: -10 }, inheritanceChance: 0.08, mutationChance: 0.004, incompatibleWith: [] },
  { id: "collectors_eye", name: "Collector's Eye", description: "Catalogues everything. Notices what others miss. Bonus lore discoveries and salvage on exploration missions.", category: "special", rarity: "rare", statModifiers: { intellect: 10, empathy: 5 }, inheritanceChance: 0.15, mutationChance: 0.008, incompatibleWith: [] },
  { id: "void_walker", name: "Void Walker", description: "Something went wrong — or right — in the incubator. They phase slightly out of reality under stress. Cannot be targeted by boarding actions.", category: "special", rarity: "mythic", statModifiers: { reflexes: 15, resilience: -10 }, inheritanceChance: 0.05, mutationChance: 0.003, incompatibleWith: [] },
  { id: "clone_degradation", name: "Clone Degradation", description: "Repeated cloning from the same template. Neural pathways fragment. Lifespan reduced by 30%. A reminder: diversity matters.", category: "special", rarity: "common", statModifiers: { resilience: -10, intellect: -5, immunity: -10 }, inheritanceChance: 0.7, mutationChance: 0, incompatibleWith: [] },

  // ── Abyssal / Hierarchy Traits ──
  { id: "blood_weave_veins", name: "Blood Weave Veins", description: "The Blood Weave pulses visibly beneath their skin. Other crew find it unsettling. Enemies find it terrifying. +20% combat power, -15% crew morale in their vicinity.", category: "physical", rarity: "rare", statModifiers: { resilience: 15, reflexes: 10, empathy: -15 }, inheritanceChance: 0.4, mutationChance: 0.01, incompatibleWith: ["empath"] },
  { id: "soul_contract_echo", name: "Soul Contract Echo", description: "Xeth'Raal's accounting runs in the blood. They instinctively know the value of everything — and the cost. +25% trade negotiation, but they always extract a personal price.", category: "mental", rarity: "rare", statModifiers: { intellect: 12, empathy: -8, adaptability: 8 }, inheritanceChance: 0.3, mutationChance: 0.008, incompatibleWith: [] },
  { id: "abyssal_vitality", name: "Abyssal Vitality", description: "Their cells regenerate at rates that make the Medical Bay nervous. Injuries that would kill others are inconveniences. The Resurrectionist calls it 'borrowed time from the Abyss.'", category: "physical", rarity: "rare", statModifiers: { resilience: 20, immunity: 10 }, inheritanceChance: 0.35, mutationChance: 0.01, incompatibleWith: ["frail", "weak_immune"] },
  { id: "predator_instinct", name: "Predator Instinct", description: "Vex'Ahlia's combat genetics. They don't fight — they hunt. Reflexes fire before conscious thought. Terrifying in combat. Problematic at dinner.", category: "physical", rarity: "uncommon", statModifiers: { reflexes: 15, empathy: -10 }, inheritanceChance: 0.5, mutationChance: 0.02, incompatibleWith: ["slow_twitch", "panicker"] },
  { id: "infernal_charisma", name: "Infernal Charisma", description: "Syl'Vex's recruitment protocols encoded at the genetic level. They don't persuade — they compel. Diplomacy missions succeed more often, but the deals always feel... wrong.", category: "social", rarity: "rare", statModifiers: { empathy: 18, adaptability: 5 }, inheritanceChance: 0.25, mutationChance: 0.006, incompatibleWith: ["abrasive", "lone_wolf"] },
  { id: "dimensional_anchor", name: "Dimensional Anchor", description: "Drael'Mon's harvesting genetics. They're rooted in reality more firmly than other beings — dimensional anomalies, phase shifts, and teleportation effects wash over them. Immune to boarding actions and quarantine spread.", category: "special", rarity: "mythic", statModifiers: { resilience: 10, adaptability: -10 }, inheritanceChance: 0.08, mutationChance: 0.003, incompatibleWith: ["void_walker"] },
  { id: "the_hunger", name: "The Hunger", description: "Mol'Garath's entropy made flesh. They consume more resources than other crew members but their output is proportionally devastating. +30% mission success, +50% resource consumption.", category: "special", rarity: "rare", statModifiers: { resilience: 10, reflexes: 10, empathy: -20 }, inheritanceChance: 0.2, mutationChance: 0.005, incompatibleWith: ["stoic"] },
];

export function getTrait(id: string): GeneticTrait | undefined {
  return GENETIC_TRAITS.find(t => t.id === id);
}

export function getTraitsByCategory(category: TraitCategory): GeneticTrait[] {
  return GENETIC_TRAITS.filter(t => t.category === category);
}

/* ─── BREEDING & INHERITANCE ─── */

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export interface BreedingResult {
  inheritedTraits: string[];
  newMutations: string[];
  stats: Record<GeneticStat, number>;
  geneticFitness: number;
  inbreedingPenalty: number;
}

export function breedCrewMembers(
  parent1Traits: string[],
  parent2Traits: string[],
  parent1Stats: Record<GeneticStat, number>,
  parent2Stats: Record<GeneticStat, number>,
  bloodline1: BloodlineId,
  bloodline2: BloodlineId,
  generationsSinceShared: number,
  seed: number,
): BreedingResult {
  const inherited: string[] = [];
  const mutations: string[] = [];
  const allParentTraits = [...new Set([...parent1Traits, ...parent2Traits])];

  // Inheritance pass: each parent trait has a chance to pass down
  for (const traitId of allParentTraits) {
    const trait = getTrait(traitId);
    if (!trait) continue;
    const bothParents = parent1Traits.includes(traitId) && parent2Traits.includes(traitId);
    const chance = bothParents ? Math.min(0.95, trait.inheritanceChance * 1.5) : trait.inheritanceChance;
    if (seededRandom(seed + traitId.length) < chance) {
      inherited.push(traitId);
    }
  }

  // Remove incompatible traits (keep higher rarity)
  const filtered = resolveIncompatibilities(inherited);

  // Mutation pass: small chance of new random trait
  const mutationRoll = seededRandom(seed * 13 + 7);
  if (mutationRoll < 0.12) {
    const eligible = GENETIC_TRAITS.filter(t =>
      !filtered.includes(t.id) &&
      t.mutationChance > 0 &&
      seededRandom(seed + t.id.length * 3) < t.mutationChance * 10
    );
    if (eligible.length > 0) {
      const pick = eligible[Math.floor(seededRandom(seed * 17) * eligible.length)];
      mutations.push(pick.id);
    }
  }

  // Stat inheritance: average of parents + variance + trait modifiers
  const stats: Record<GeneticStat, number> = {} as Record<GeneticStat, number>;
  for (const stat of GENETIC_STATS) {
    const avg = (parent1Stats[stat] + parent2Stats[stat]) / 2;
    const variance = (seededRandom(seed + stat.length * 11) - 0.5) * 10;
    let value = Math.round(avg + variance);
    // Apply trait modifiers
    for (const tId of [...filtered, ...mutations]) {
      const t = getTrait(tId);
      if (t?.statModifiers[stat]) value += t.statModifiers[stat]!;
    }
    stats[stat] = Math.max(5, Math.min(100, value));
  }

  // Inbreeding penalty
  const penalty = calculateInbreedingPenalty(bloodline1, bloodline2, generationsSinceShared);
  if (penalty > 0) {
    for (const stat of GENETIC_STATS) {
      stats[stat] = Math.max(5, Math.round(stats[stat] * (1 - penalty / 100)));
    }
    // High inbreeding can force clone_degradation trait
    if (penalty > 20 && !filtered.includes("clone_degradation")) {
      mutations.push("clone_degradation");
    }
  }

  const fitness = GENETIC_STATS.reduce((sum, s) => sum + stats[s], 0) / (GENETIC_STATS.length * 100);

  return { inheritedTraits: filtered, newMutations: mutations, stats, geneticFitness: Math.round(fitness * 100), inbreedingPenalty: penalty };
}

function resolveIncompatibilities(traitIds: string[]): string[] {
  const rarityOrder = { mythic: 4, rare: 3, uncommon: 2, common: 1 };
  const result = [...traitIds];
  for (let i = result.length - 1; i >= 0; i--) {
    const trait = getTrait(result[i]);
    if (!trait) continue;
    for (const incompId of trait.incompatibleWith) {
      const j = result.indexOf(incompId);
      if (j === -1) continue;
      const other = getTrait(incompId);
      if (!other) continue;
      // Keep the rarer one
      if (rarityOrder[trait.rarity] >= rarityOrder[other.rarity]) {
        result.splice(j, 1);
      } else {
        result.splice(i, 1);
        break;
      }
    }
  }
  return result;
}

export function calculateGeneticDrift(bloodline: Bloodline): number {
  // Drift increases with generations, reduced by diversity
  const baseDrift = bloodline.generationCount * 3;
  const diversityReduction = bloodline.diversityIndex * 0.4;
  return Math.min(100, Math.max(0, baseDrift - diversityReduction));
}

export function calculateDiversityBonus(bloodline: Bloodline): number {
  // Diversity index 0-100, bonus scales: 0 at 0, peak at 60-80, slight decline past 90 (too chaotic)
  if (bloodline.diversityIndex <= 60) return bloodline.diversityIndex * 0.5;
  if (bloodline.diversityIndex <= 80) return 30 + (bloodline.diversityIndex - 60) * 0.25;
  return 35 - (bloodline.diversityIndex - 80) * 0.25;
}

export function calculateInbreedingPenalty(
  bloodline1: BloodlineId,
  bloodline2: BloodlineId,
  generationsSinceShared: number,
): number {
  if (bloodline1 !== bloodline2) return 0;
  // Same bloodline: penalty decreases with generations since shared ancestor
  const basePenalty = 30;
  const generationReduction = generationsSinceShared * 5;
  return Math.max(0, basePenalty - generationReduction);
}

export function rollMutation(existingTraits: string[], seed: number): GeneticTrait | null {
  const eligible = GENETIC_TRAITS.filter(t =>
    t.mutationChance > 0 &&
    !existingTraits.includes(t.id) &&
    t.category !== "special" // special traits only from breeding
  );
  if (eligible.length === 0) return null;
  const roll = seededRandom(seed * 23 + 11);
  if (roll > 0.08) return null; // 8% base mutation chance
  return eligible[Math.floor(seededRandom(seed * 31) * eligible.length)];
}

/* ─── INCUBATOR PODS ─── */

export type PodStatus = "empty" | "gestating" | "ready" | "malfunction";

export interface IncubatorPod {
  id: number;
  status: PodStatus;
  templateId: string | null;
  bloodlineId: BloodlineId | null;
  generation: number;
  parentIds: [string, string] | null;
  timeRemainingHours: number;
  totalTimeHours: number;
  geneticIntegrity: number;
  traits: string[];
}

export const MAX_INCUBATOR_PODS = 6;

export function createEmptyPod(id: number): IncubatorPod {
  return { id, status: "empty", templateId: null, bloodlineId: null, generation: 1, parentIds: null, timeRemainingHours: 0, totalTimeHours: 0, geneticIntegrity: 100, traits: [] };
}

export function startIncubation(
  pod: IncubatorPod,
  templateId: string,
  bloodlineId: BloodlineId,
  generation: number,
  parentIds?: [string, string],
): IncubatorPod {
  const template = getTemplate(templateId);
  if (!template) return pod;
  const rarityTime: Record<string, number> = { common: 4, uncommon: 8, rare: 12, exotic: 24 };
  const baseTime = rarityTime[template.rarity] || 8;
  const generationPenalty = Math.max(0, (generation - 1) * 0.5);
  const totalTime = baseTime + generationPenalty;

  return {
    ...pod,
    status: "gestating",
    templateId,
    bloodlineId,
    generation,
    parentIds: parentIds || null,
    timeRemainingHours: totalTime,
    totalTimeHours: totalTime,
    geneticIntegrity: Math.max(50, 100 - generation * 3),
    traits: [],
  };
}

export function tickIncubator(pod: IncubatorPod, hoursElapsed: number, seed: number): IncubatorPod {
  if (pod.status !== "gestating") return pod;
  const remaining = pod.timeRemainingHours - hoursElapsed;
  if (remaining <= 0) {
    return { ...pod, status: "ready", timeRemainingHours: 0 };
  }
  // Malfunction chance: increases with low genetic integrity
  const malfunctionChance = (100 - pod.geneticIntegrity) * 0.002;
  if (seededRandom(seed + pod.id) < malfunctionChance) {
    return { ...pod, status: "malfunction", timeRemainingHours: remaining, geneticIntegrity: Math.max(30, pod.geneticIntegrity - 10) };
  }
  return { ...pod, timeRemainingHours: remaining };
}

export function repairPod(pod: IncubatorPod): IncubatorPod {
  if (pod.status !== "malfunction") return pod;
  return { ...pod, status: "gestating", timeRemainingHours: pod.timeRemainingHours + 2 };
}

/* ─── INCUBATOR STATE ─── */

export interface IncubatorState {
  pods: IncubatorPod[];
  totalCloned: number;
  malfunctionCount: number;
}

export const DEFAULT_INCUBATOR_STATE: IncubatorState = {
  pods: Array.from({ length: MAX_INCUBATOR_PODS }, (_, i) => createEmptyPod(i + 1)),
  totalCloned: 0,
  malfunctionCount: 0,
};
