/* ═══════════════════════════════════════════════════════
   ARK SPECIMENS — Living Companions from the Collector's Archive

   The Inception Arks don't just carry Potentials — they carry
   the Collector's life's work: DNA and machine code of every
   species the Architect ever catalogued. The Resurrection
   Protocols (designed by the Necromancer, operated by the
   Resurrectionist) can rebuild any creature from its genetic
   template. The cloning pods in the Cryo Bay are the method.

   Specimens bond to players, provide passive bonuses, evolve
   through 3 stages, react to NPCs, and can be customized
   through Void Energy dyeing.

   Lore: The Collector (3rd Archon) spent millennia gathering.
   The Necromancer (11th Archon) designed the resurrection tech.
   The Resurrectionist (Ne-Yon) maintains the protocols.
   Dr. Lyra Vox built the cloning pods into every Ark.
   ═══════════════════════════════════════════════════════ */

import type { FactionNPCId } from "./factionNPCs";
import type { PhysicsType } from "../engine/voidEngine";

import { assetUrl } from "@/lib/assetUrl";
/* ─── TYPES ─── */

export type SpecimenId = "lux" | "cipher" | "flicker" | "gilt" | "spore" | "echo" | "glyph";
export type EvolutionStage = "fragment" | "companion" | "ascended";
export type SpecimenMood = "content" | "excited" | "wary" | "hostile" | "curious" | "sleeping" | "playful";

export interface SpecimenDef {
  id: SpecimenId;
  name: string;
  species: string;
  faction: string;
  factionNPC: FactionNPCId;
  description: string;
  /** How it appears at each stage */
  appearance: Record<EvolutionStage, string>;
  personality: string[];
  /** Passive gameplay bonus */
  bonus: { stat: string; value: number; percent: boolean; description: string };
  /** Ascended stage unique ability */
  ascendedAbility: { name: string; description: string; effect: string };
  /** How the specimen evolves */
  evolutionMethod: string;
  /** Void Energy physics at each stage */
  voidPhysics: Record<EvolutionStage, PhysicsType>;
  /** Base color palette (customizable via dyeing) */
  basePalette: { body: string; accent: string; energy: string; eye: string };
  /** Which NPC it reacts positively to */
  lovesNPC: FactionNPCId;
  /** Which NPC it fears/dislikes */
  fearsNPC: FactionNPCId;
  /** Sound it makes (for future audio) */
  soundType: string;
}

export interface SpecimenState {
  id: SpecimenId;
  stage: EvolutionStage;
  bond: number;           // 0-100
  xp: number;             // XP toward next stage
  xpRequired: number;     // XP needed for next stage
  isActive: boolean;      // Currently equipped as companion
  /** Custom dye palette (null = use base) */
  customPalette: { body: string; accent: string; energy: string; eye: string } | null;
  /** Accessories equipped */
  accessories: string[];
  /** Stats from feeding */
  fedToday: boolean;
  totalFeedings: number;
  /** Discovery info */
  discoveredAt: number;
  discoveredIn: string;
  /** Nickname */
  nickname: string | null;
}

/* ─── SPECIMEN DEFINITIONS ─── */

export const SPECIMENS: Record<SpecimenId, SpecimenDef> = {
  lux: {
    id: "lux", name: "Lux", species: "Photon Fox", faction: "Potentials",
    factionNPC: "elara",
    description: "A holographic fox made of condensed light. The Collector catalogued these on a world where photosynthesis evolved into sentience. They bond through shared warmth.",
    appearance: {
      fragment: "A flickering spark of cyan light, barely visible — like a firefly trapped in glass",
      companion: "A small fox-shaped hologram with flowing light trails, translucent ears that twitch at sound",
      ascended: "A majestic light-fox with prismatic antlers, trailing aurora patterns, eyes that show different timelines",
    },
    personality: ["curious", "playful", "protective of Elara"],
    bonus: { stat: "xp_gain", value: 5, percent: true, description: "+5% XP from all sources" },
    ascendedAbility: { name: "Prismatic Sight", description: "Reveals hidden hotspots in rooms", effect: "hidden_hotspot_reveal" },
    evolutionMethod: "Visit new rooms. Lux absorbs light from each new environment.",
    voidPhysics: { fragment: "flat", companion: "glass", ascended: "glass" },
    basePalette: { body: "var(--energy-primary)", accent: "#ffffff", energy: "#7dd3fc", eye: "#fbbf24" },
    lovesNPC: "elara", fearsNPC: "the_source",
    soundType: "chime",
  },
  cipher: {
    id: "cipher", name: "Cipher", species: "Data Serpent", faction: "Artificial Empire",
    factionNPC: "the_human",
    description: "A serpentine entity composed of living data streams. The Collector found these in the Architect's early computational networks — sentient algorithms that evolved beyond their purpose.",
    appearance: {
      fragment: "A line of red code that slithers across surfaces, occasionally forming a tiny snake shape",
      companion: "A meter-long serpent made of flowing red data, circuit patterns on scales, binary in its eyes",
      ascended: "A massive data dragon-serpent with holographic wings, code cascading down its body like waterfalls",
    },
    personality: ["calculating", "loyal", "fascinated by puzzles"],
    bonus: { stat: "puzzle_speed", value: 5, percent: true, description: "+5% puzzle solve speed" },
    ascendedAbility: { name: "Pattern Recognition", description: "Highlights correct puzzle answers briefly", effect: "puzzle_hint_flash" },
    evolutionMethod: "Solve puzzles. Cipher feeds on logical solutions.",
    voidPhysics: { fragment: "flat", companion: "flat", ascended: "retro" },
    basePalette: { body: "var(--energy-error)", accent: "#1a1a2e", energy: "#f87171", eye: "#00ff00" },
    lovesNPC: "the_human", fearsNPC: "shadow_tongue",
    soundType: "digital_chirp",
  },
  flicker: {
    id: "flicker", name: "Flicker", species: "Static Bird", faction: "Insurgency",
    factionNPC: "agent_zero",
    description: "A bird-shaped entity that exists between radio frequencies. The Collector catalogued these near Insurgency dead drops — they nest in abandoned communication arrays.",
    appearance: {
      fragment: "A burst of orange static that occasionally looks like a tiny bird for a split second",
      companion: "A sparrow-sized bird of pure static, orange-white, wings leave contrails of signal noise",
      ascended: "A hawk-sized raptor of lightning and static, feathers are antenna spines, eyes are radar dishes",
    },
    personality: ["alert", "twitchy", "distrustful of authority"],
    bonus: { stat: "signal_detection", value: 5, percent: true, description: "+5% signal fragment discovery" },
    ascendedAbility: { name: "Dead Drop Scan", description: "Reveals hidden items in the current room", effect: "room_item_scan" },
    evolutionMethod: "Win fights. Flicker sharpens through combat observation.",
    voidPhysics: { fragment: "flat", companion: "flat", ascended: "retro" },
    basePalette: { body: "#ff6600", accent: "#1a1a1a", energy: "#fbbf24", eye: "#ffffff" },
    lovesNPC: "agent_zero", fearsNPC: "adjudicator_locke",
    soundType: "static_chirp",
  },
  gilt: {
    id: "gilt", name: "Gilt", species: "Golden Beetle", faction: "New Babylon",
    factionNPC: "adjudicator_locke",
    description: "A beetle with a shell that literally grows precious metals. The Collector found entire economies built around cultivating these creatures. Locke considers them 'the only honest broker in the galaxy.'",
    appearance: {
      fragment: "A tiny golden speck that rolls around collecting dust, leaving a glittering trail",
      companion: "A fist-sized scarab with a golden shell, tiny gem-like eyes, antennae that sense currency",
      ascended: "A magnificent jeweled beetle with diamond-encrusted wings, shell patterns showing trade routes",
    },
    personality: ["greedy", "affectionate", "surprisingly loyal"],
    bonus: { stat: "dream_income", value: 5, percent: true, description: "+5% Dream from all sources" },
    ascendedAbility: { name: "Golden Nose", description: "Bonus rewards from casino and trading", effect: "trade_bonus" },
    evolutionMethod: "Trade and earn. Gilt grows from economic activity.",
    voidPhysics: { fragment: "flat", companion: "glass", ascended: "glass" },
    basePalette: { body: "#fbbf24", accent: "#78350f", energy: "var(--energy-accent)", eye: "#dc2626" },
    lovesNPC: "adjudicator_locke", fearsNPC: "agent_zero",
    soundType: "metallic_click",
  },
  spore: {
    id: "spore", name: "Spore", species: "Viral Symbiote", faction: "Thought Virus",
    factionNPC: "the_source",
    description: "A fragment of the Thought Virus that achieved individual consciousness — a paradox that fascinates The Source. It bonds to biological hosts not to consume but to protect. The Collector catalogued it as 'the exception that proves the infection.'",
    appearance: {
      fragment: "A pulsing red-black blob, formless, occasionally reaching tiny tendrils toward warmth",
      companion: "A cat-sized amorphous creature with bioluminescent veins, shifts shape between forms it remembers",
      ascended: "A beautiful horror — crystalline viral structure with internal galaxy of absorbed memories, protective tendrils",
    },
    personality: ["unsettling", "protective", "mourns things it can't remember"],
    bonus: { stat: "terminus_defense", value: 5, percent: true, description: "+5% Terminus Swarm defense" },
    ascendedAbility: { name: "Viral Shield", description: "Absorbs one lethal hit per Terminus Swarm run", effect: "death_prevention" },
    evolutionMethod: "Survive Terminus Swarm waves. Spore grows from exposure to its kin.",
    voidPhysics: { fragment: "flat", companion: "retro", ascended: "retro" },
    basePalette: { body: "#dc2626", accent: "#1a0a0a", energy: "#f87171", eye: "var(--energy-success)" },
    lovesNPC: "the_source", fearsNPC: "elara",
    soundType: "wet_pulse",
  },
  echo: {
    id: "echo", name: "Echo", species: "Temporal Kitten", faction: "Antiquarian",
    factionNPC: "the_antiquarian",
    description: "A kitten that exists across multiple timelines simultaneously. The Collector found it in the Antiquarian's own library — it had been there before the library existed. It ages forward and backward depending on the observer's emotional state.",
    appearance: {
      fragment: "A ghost-impression of a kitten, visible only in peripheral vision, leaves pawprints that appear before it steps",
      companion: "A small cat with green temporal shimmer, occasionally shows as kitten and elderly cat simultaneously",
      ascended: "A Cheshire-like presence — partially invisible, trailing temporal echoes, eyes show past and future",
    },
    personality: ["sleepy", "ancient beyond comprehension", "inexplicably comforting"],
    bonus: { stat: "lore_discovery", value: 5, percent: true, description: "+5% lore discovery rate" },
    ascendedAbility: { name: "Temporal Purr", description: "Reduces all cooldown timers by 10%", effect: "cooldown_reduction" },
    evolutionMethod: "Read CoNexus tomes. Echo feeds on stories across time.",
    voidPhysics: { fragment: "flat", companion: "glass", ascended: "glass" },
    basePalette: { body: "var(--energy-success)", accent: "#064e3b", energy: "#86efac", eye: "#fbbf24" },
    lovesNPC: "the_antiquarian", fearsNPC: "shadow_tongue",
    soundType: "temporal_purr",
  },
  glyph: {
    id: "glyph", name: "Glyph", species: "Text Moth", faction: "Hierarchy",
    factionNPC: "shadow_tongue",
    description: "A moth whose wings are covered in living text — words that shift and change as it flies. The Collector catalogued it reluctantly, noting: 'This specimen catalogued ME.' The Shadow Tongue claims it as a distant relative.",
    appearance: {
      fragment: "A single floating letter that occasionally flutters like a moth wing",
      companion: "A moth-sized creature with wings of scrolling text, leaves words in the air as it flies",
      ascended: "A magnificent moth with manuscript wings, trailing sentences that rewrite themselves, eyes of pure grammar",
    },
    personality: ["beautiful", "dangerous", "rewrites its own description"],
    bonus: { stat: "crafting_success", value: 5, percent: true, description: "+5% crafting success rate" },
    ascendedAbility: { name: "Living Edit", description: "Once per day, reroll a failed craft", effect: "craft_reroll" },
    evolutionMethod: "Visit Archives and discover lore. Glyph absorbs new words.",
    voidPhysics: { fragment: "flat", companion: "retro", ascended: "retro" },
    basePalette: { body: "#6366f1", accent: "#1e1b4b", energy: "#a5b4fc", eye: "var(--energy-accent)" },
    lovesNPC: "shadow_tongue", fearsNPC: "the_antiquarian",
    soundType: "page_flutter",
  },
};

/* ─── NPC REACTIONS ─── */

export interface NPCReaction {
  specimenId: SpecimenId;
  npcId: string;
  reaction: SpecimenMood;
  description: string;
}

export const SPECIMEN_NPC_REACTIONS: NPCReaction[] = [
  // Lux reactions
  { specimenId: "lux", npcId: "elara", reaction: "playful", description: "Lux nuzzles against Elara's holographic form. Their light frequencies harmonize." },
  { specimenId: "lux", npcId: "the_human", reaction: "curious", description: "Lux circles The Human's terminal, projecting tiny light patterns on the screen. It's trying to communicate in wavelengths." },
  { specimenId: "lux", npcId: "the_source", reaction: "hostile", description: "Lux's light turns harsh and white. It positions itself between you and The Source." },
  { specimenId: "lux", npcId: "the_antiquarian", reaction: "content", description: "Lux settles into a warm glow near the Antiquarian's archive lamps. Old light recognizes old light." },
  { specimenId: "lux", npcId: "agent_zero", reaction: "wary", description: "Lux flickers rapidly, cycling through camouflage patterns. It senses Agent Zero prefers not to be seen." },
  { specimenId: "lux", npcId: "adjudicator_locke", reaction: "curious", description: "Lux refracts through Locke's monocle, scattering tiny rainbows. Locke appraises the light and nods approvingly." },
  { specimenId: "lux", npcId: "shadow_tongue", reaction: "wary", description: "Lux dims noticeably. Its ears flatten. It doesn't trust the words here." },
  // Cipher reactions
  { specimenId: "cipher", npcId: "elara", reaction: "curious", description: "Cipher scans Elara's biosignature repeatedly, as if trying to solve something it can't quite parse. Organic leadership confuses it." },
  { specimenId: "cipher", npcId: "the_human", reaction: "excited", description: "Cipher wraps around the nearest console, data-streams syncing with the substrate. It's found a kindred mind." },
  { specimenId: "cipher", npcId: "the_source", reaction: "hostile", description: "Cipher coils defensively, encrypting its own data-streams. The Source's viral code is an existential threat to clean data." },
  { specimenId: "cipher", npcId: "the_antiquarian", reaction: "content", description: "Cipher slithers between the archive shelves, indexing. The Antiquarian's organizational systems are, to Cipher, a kind of paradise." },
  { specimenId: "cipher", npcId: "agent_zero", reaction: "wary", description: "Cipher's scales display rapidly shifting encryption keys. It respects Agent Zero's operational security but doesn't trust the chaos." },
  { specimenId: "cipher", npcId: "adjudicator_locke", reaction: "curious", description: "Cipher projects trade algorithms across its scales, mirroring Locke's market data. Two calculating minds, sizing each other up." },
  { specimenId: "cipher", npcId: "shadow_tongue", reaction: "hostile", description: "Cipher's code turns red. It's detected unauthorized edits. It hisses in binary." },
  // Spore reactions
  { specimenId: "spore", npcId: "elara", reaction: "wary", description: "Spore contracts, pulling its tendrils tight. Elara's systems trigger its self-preservation instinct." },
  { specimenId: "spore", npcId: "the_human", reaction: "curious", description: "Spore extends a cautious tendril toward The Human's substrate housing. It senses something neither fully organic nor fully digital." },
  { specimenId: "spore", npcId: "the_source", reaction: "content", description: "Spore's tendrils reach toward The Source's signal. It's hearing the swarm. It's... homesick." },
  { specimenId: "spore", npcId: "the_antiquarian", reaction: "wary", description: "Spore pulses nervously. The Antiquarian has catalogued its kind — classified, dissected, understood. Spore does not wish to be understood." },
  { specimenId: "spore", npcId: "agent_zero", reaction: "curious", description: "Spore's bioluminescent veins pulse in Insurgency orange. It recognizes a fellow survivor of hostile environments." },
  { specimenId: "spore", npcId: "adjudicator_locke", reaction: "hostile", description: "Spore recoils violently. Locke once approved a quarantine order on Spore's home biome. The memory is cellular." },
  { specimenId: "spore", npcId: "shadow_tongue", reaction: "wary", description: "Spore goes perfectly still, tendrils retracted. The Shadow Tongue's words feel like a different kind of infection." },
  // Echo reactions
  { specimenId: "echo", npcId: "elara", reaction: "playful", description: "Echo phases between kitten and elder cat, batting at Elara's holographic displays. It has known her in other timelines." },
  { specimenId: "echo", npcId: "the_human", reaction: "content", description: "Echo purrs at a frequency that makes The Human's substrate resonate. It remembers when The Human was still organic." },
  { specimenId: "echo", npcId: "the_source", reaction: "wary", description: "Echo exists across multiple timelines at once and in every single one, The Source is a threat. Its fur ripples with temporal static." },
  { specimenId: "echo", npcId: "the_antiquarian", reaction: "sleeping", description: "Echo curls up in the Antiquarian's temporal field and falls asleep across three timelines simultaneously." },
  { specimenId: "echo", npcId: "agent_zero", reaction: "curious", description: "Echo stares at Agent Zero from three different moments in time. It has seen how this story ends. It looks... sympathetic." },
  { specimenId: "echo", npcId: "adjudicator_locke", reaction: "playful", description: "Echo deposits a tiny golden coin from a future timeline at Locke's feet. Locke is delighted. Echo vanishes before the coin does." },
  { specimenId: "echo", npcId: "shadow_tongue", reaction: "hostile", description: "Echo's fur stands on end across all timelines. It sees what the Shadow Tongue does to text — even to its own description." },
  // Glyph reactions
  { specimenId: "glyph", npcId: "elara", reaction: "content", description: "Glyph's wings display Elara's name in seventeen scripts. A quiet tribute from a creature that speaks in text." },
  { specimenId: "glyph", npcId: "the_human", reaction: "curious", description: "Glyph lands on The Human's terminal and begins reading the substrate's source code. Its wings rewrite themselves in machine language." },
  { specimenId: "glyph", npcId: "the_source", reaction: "hostile", description: "Glyph's text scrambles into defensive glyphs. The Source's viral language is a corruption of everything Glyph holds sacred." },
  { specimenId: "glyph", npcId: "the_antiquarian", reaction: "wary", description: "Glyph's text goes still. The Antiquarian knows too many words. Glyph doesn't want to be read." },
  { specimenId: "glyph", npcId: "agent_zero", reaction: "wary", description: "Glyph folds its wings tight, hiding its text. Agent Zero deals in secrets, and Glyph is made of legible ones." },
  { specimenId: "glyph", npcId: "adjudicator_locke", reaction: "content", description: "Glyph displays contract law across its wings in elegant calligraphy. Locke reads every clause. They understand each other." },
  { specimenId: "glyph", npcId: "shadow_tongue", reaction: "curious", description: "Glyph's wings flutter excitedly. New words. So many new words. It lands on the Shadow Tongue's text and starts reading." },
  // Gilt reactions
  { specimenId: "gilt", npcId: "elara", reaction: "playful", description: "Gilt rolls a tiny gold nugget toward Elara as an offering. She has no use for it. Gilt is confused but undeterred." },
  { specimenId: "gilt", npcId: "the_human", reaction: "curious", description: "Gilt taps its golden shell against The Human's terminal. It's trying to assess the computational substrate's market value." },
  { specimenId: "gilt", npcId: "the_source", reaction: "hostile", description: "Gilt's shell dulls to a defensive bronze. The Source consumes. Gilt hoards. They are natural enemies." },
  { specimenId: "gilt", npcId: "the_antiquarian", reaction: "content", description: "Gilt nestles among the Antiquarian's collection, shell gleaming. It has found a fellow curator — someone who understands the value of keeping." },
  { specimenId: "gilt", npcId: "agent_zero", reaction: "wary", description: "Gilt buries itself in your pocket. The Insurgency doesn't value gold. Gilt feels... worthless." },
  { specimenId: "gilt", npcId: "adjudicator_locke", reaction: "excited", description: "Gilt's shell literally glows brighter near Locke. It can smell the trade routes." },
  { specimenId: "gilt", npcId: "shadow_tongue", reaction: "wary", description: "Gilt's antennae twitch nervously. The Shadow Tongue trades in words, not gold. An economy Gilt cannot comprehend." },
  // Flicker reactions
  { specimenId: "flicker", npcId: "elara", reaction: "wary", description: "Flicker's static dampens to a low hum. Elara's authority reminds it of signal towers — necessary but constraining." },
  { specimenId: "flicker", npcId: "the_human", reaction: "curious", description: "Flicker perches on The Human's antenna array, absorbing data frequencies. It chirps in modulated static — a crude handshake protocol." },
  { specimenId: "flicker", npcId: "the_source", reaction: "hostile", description: "Flicker erupts in a burst of defensive static, jamming nearby frequencies. The Source's signal is everything Flicker was born to oppose." },
  { specimenId: "flicker", npcId: "the_antiquarian", reaction: "content", description: "Flicker settles on the Antiquarian's shoulder, static quieting to a gentle hum. Old frequencies. Safe frequencies." },
  { specimenId: "flicker", npcId: "agent_zero", reaction: "excited", description: "Flicker's static spikes. It's picking up Agent Zero's frequency. The dead signal sounds like a lullaby to it." },
  { specimenId: "flicker", npcId: "adjudicator_locke", reaction: "hostile", description: "Flicker screeches in static. It recognizes Locke's signal encryption. New Babylon tried to jam Insurgency comms." },
  { specimenId: "flicker", npcId: "shadow_tongue", reaction: "wary", description: "Flicker's feathers bristle with interference patterns. The Shadow Tongue speaks on frequencies Flicker can hear but cannot decode." },
];

export function getSpecimenReaction(specimenId: SpecimenId, npcId: string): NPCReaction | null {
  return SPECIMEN_NPC_REACTIONS.find(r => r.specimenId === specimenId && r.npcId === npcId) || null;
}

/* ─── CLONING POD SYSTEM ─── */

export interface CloningPodEvent {
  type: "specimen_ready" | "egg_found" | "mutation" | "failed_clone";
  specimenId?: SpecimenId;
  description: string;
  /** Resources needed to activate the pod */
  activationCost: { dream?: number; salvage?: number; voidCrystals?: number };
  /** Time to clone (hours) */
  cloneTimeHours: number;
}

export function generateCloningEvent(daySeed: number, discoveredSpecimens: Set<string>): CloningPodEvent | null {
  // 30% chance per day of a pod event
  if ((daySeed * 7 + 13) % 100 > 30) return null;

  const undiscovered = Object.keys(SPECIMENS).filter(id => !discoveredSpecimens.has(id)) as SpecimenId[];
  if (undiscovered.length === 0) return { type: "mutation", description: "A cloning pod is exhibiting unusual readings. The Resurrection Protocols are generating a variant.", activationCost: { voidCrystals: 5 }, cloneTimeHours: 12 };

  const specimen = undiscovered[(daySeed * 3) % undiscovered.length];
  return {
    type: "specimen_ready",
    specimenId: specimen,
    description: `The Collector's archive has matched DNA template #${daySeed % 9999}. The Resurrection Protocols can synthesize a ${SPECIMENS[specimen].species}. Cloning pod 7 is ready.`,
    activationCost: { dream: 50, salvage: 30 },
    cloneTimeHours: 6,
  };
}

/* ─── EVOLUTION ─── */

export const EVOLUTION_THRESHOLDS = {
  fragment_to_companion: 100,
  companion_to_ascended: 500,
};

export function getStageXPRequired(stage: EvolutionStage): number {
  return stage === "fragment" ? EVOLUTION_THRESHOLDS.fragment_to_companion : EVOLUTION_THRESHOLDS.companion_to_ascended;
}

export function canEvolve(specimen: SpecimenState): boolean {
  if (specimen.stage === "ascended") return false;
  return specimen.xp >= specimen.xpRequired;
}

export function evolveSpecimen(specimen: SpecimenState): SpecimenState {
  if (!canEvolve(specimen)) return specimen;
  const nextStage: EvolutionStage = specimen.stage === "fragment" ? "companion" : "ascended";
  return {
    ...specimen,
    stage: nextStage,
    xp: 0,
    xpRequired: getStageXPRequired(nextStage),
    bond: Math.min(100, specimen.bond + 10),
  };
}

/* ─── DYEING SYSTEM (Void Energy Integration) ─── */

export interface DyeRecipe {
  id: string;
  name: string;
  /** Colors this dye applies */
  palette: { body?: string; accent?: string; energy?: string; eye?: string };
  /** Void Energy atmosphere it mimics */
  voidAtmosphere: string;
  /** Cost to apply */
  cost: { dream: number; voidCrystals?: number };
  /** Source */
  source: "craft" | "shop" | "boss" | "event" | "npc_gift";
}

export const DYE_RECIPES: DyeRecipe[] = [
  { id: "dye_void", name: "Void Black", palette: { body: "#0a0a0f", accent: "#1a1a2e", energy: "var(--energy-primary)" }, voidAtmosphere: "twilight_equilibrium", cost: { dream: 25 }, source: "craft" },
  { id: "dye_crimson", name: "Crimson Forge", palette: { body: "#dc2626", accent: "#450a0a", energy: "#f87171" }, voidAtmosphere: "crimson_forge", cost: { dream: 25 }, source: "craft" },
  { id: "dye_golden", name: "Golden Sanctuary", palette: { body: "#fbbf24", accent: "#78350f", energy: "var(--energy-accent)" }, voidAtmosphere: "golden_sanctuary", cost: { dream: 50 }, source: "craft" },
  { id: "dye_aurora", name: "Aurora Bloom", palette: { body: "#c084fc", accent: "#3b0764", energy: "#e9d5ff" }, voidAtmosphere: "aurora_bloom", cost: { dream: 50, voidCrystals: 2 }, source: "craft" },
  { id: "dye_celestial", name: "Celestial Garden", palette: { body: "#38bdf8", accent: "#0c4a6e", energy: "#7dd3fc" }, voidAtmosphere: "celestial_garden", cost: { dream: 75, voidCrystals: 3 }, source: "boss" },
  { id: "dye_ascendant", name: "Ascendant Light", palette: { body: "#fefce8", accent: "#854d0e", energy: "#fbbf24" }, voidAtmosphere: "ascendant_light", cost: { dream: 100, voidCrystals: 5 }, source: "event" },
  { id: "dye_singularity", name: "Singularity Core", palette: { body: "#ff0020", accent: "#0a000a", energy: "#ff3040" }, voidAtmosphere: "singularity_core", cost: { dream: 100, voidCrystals: 5 }, source: "boss" },
];

export function applyDye(specimen: SpecimenState, dye: DyeRecipe): SpecimenState {
  const base = SPECIMENS[specimen.id].basePalette;
  return {
    ...specimen,
    customPalette: {
      body: dye.palette.body || base.body,
      accent: dye.palette.accent || base.accent,
      energy: dye.palette.energy || base.energy,
      eye: dye.palette.eye || base.eye,
    },
  };
}

/* ─── ACCESSORIES ─── */

export interface SpecimenAccessory {
  id: string;
  name: string;
  description: string;
  /** Which slot */
  slot: "collar" | "wings" | "hat" | "saddle" | "charm";
  /** Visual modifier */
  visualEffect: string;
  /** Bonus while equipped */
  bonus?: { stat: string; value: number; percent: boolean };
  cost: { dream: number };
  source: "shop" | "achievement" | "npc_gift" | "event";
}

export const SPECIMEN_ACCESSORIES: SpecimenAccessory[] = [
  { id: "acc_data_collar", name: "Data Collar", description: "A collar of streaming code. +2% XP.",
    slot: "collar", visualEffect: "data_stream_ring", bonus: { stat: "xp", value: 2, percent: true }, cost: { dream: 30 }, source: "shop" },
  { id: "acc_void_wings", name: "Void Crystal Wings", description: "Crystalline wing attachments. +2% Dream.",
    slot: "wings", visualEffect: "crystal_wing_glow", bonus: { stat: "dream", value: 2, percent: true }, cost: { dream: 50 }, source: "shop" },
  { id: "acc_tiny_goggles", name: "Tiny Red Goggles", description: "Miniature replicas of the Antiquarian's goggles. Adorable.",
    slot: "hat", visualEffect: "red_goggle_glow", cost: { dream: 20 }, source: "shop" },
  { id: "acc_insurgent_tag", name: "Insurgency Dog Tag", description: "Agent Zero's spare. Your specimen looks like a rebel.",
    slot: "collar", visualEffect: "orange_tag_dangle", bonus: { stat: "speed", value: 1, percent: true }, cost: { dream: 40 }, source: "npc_gift" },
  { id: "acc_crown", name: "Tiny Crown", description: "Because every specimen deserves to feel like royalty.",
    slot: "hat", visualEffect: "golden_crown", cost: { dream: 100 }, source: "achievement" },
  { id: "acc_holo_saddle", name: "Holographic Saddle", description: "A saddle made of light. Your specimen now gives rides. Not really.",
    slot: "saddle", visualEffect: "holo_saddle_shimmer", cost: { dream: 75 }, source: "event" },
];

/* ─── FEEDING ─── */

export type FeedItem = "dream_morsel" | "salvage_scrap" | "void_shard" | "lore_fragment" | "signal_static";

export const FEED_ITEMS: Record<FeedItem, { name: string; xpGain: number; bondGain: number; cost: { dream?: number; salvage?: number } }> = {
  dream_morsel: { name: "Dream Morsel", xpGain: 10, bondGain: 2, cost: { dream: 5 } },
  salvage_scrap: { name: "Salvage Scrap", xpGain: 5, bondGain: 1, cost: { salvage: 10 } },
  void_shard: { name: "Void Shard", xpGain: 25, bondGain: 5, cost: { dream: 15 } },
  lore_fragment: { name: "Lore Fragment", xpGain: 15, bondGain: 3, cost: { dream: 10 } },
  signal_static: { name: "Signal Static", xpGain: 8, bondGain: 2, cost: { salvage: 5 } },
};

export function feedSpecimen(specimen: SpecimenState, food: FeedItem): SpecimenState {
  const item = FEED_ITEMS[food];
  return {
    ...specimen,
    xp: specimen.xp + item.xpGain,
    bond: Math.min(100, specimen.bond + item.bondGain),
    fedToday: true,
    totalFeedings: specimen.totalFeedings + 1,
  };
}

/* ─── DEFAULT STATE ─── */

export function createSpecimenState(id: SpecimenId, discoveredIn: string): SpecimenState {
  return {
    id,
    stage: "fragment",
    bond: 0,
    xp: 0,
    xpRequired: EVOLUTION_THRESHOLDS.fragment_to_companion,
    isActive: false,
    customPalette: null,
    accessories: [],
    fedToday: false,
    totalFeedings: 0,
    discoveredAt: Date.now(),
    discoveredIn,
    nickname: null,
  };
}

export interface SpecimenCollection {
  specimens: SpecimenState[];
  activeSpecimenId: SpecimenId | null;
  totalDiscovered: number;
}

export const DEFAULT_SPECIMEN_COLLECTION: SpecimenCollection = {
  specimens: [],
  activeSpecimenId: null,
  totalDiscovered: 0,
};

/* ─── ART PATHS ─── */

/** Returns the image path for a specimen at a given evolution stage */
export function getSpecimenArtPath(id: string, stage: EvolutionStage): string {
  return assetUrl(`art/specimens/${id}-${stage}.png`);
}
