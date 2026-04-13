/* ═══════════════════════════════════════════════════════
   EXTINCT ALIEN RACES — Remnants of the Previous Universe

   The universe was built upon the ruins of the one before it.
   The Thought Virus didn't just destroy civilizations — it erased
   entire species from existence. But echoes remain: artifacts,
   architecture, DNA fragments in the Collector's archive,
   and whispers in the substrate.

   5 extinct races discoverable through exploration, diplomacy,
   and expansion. Each could become a playable faction in future
   expansions once the Resurrection Protocols are applied to
   their preserved DNA.

   Lore integration: discoverable through ALL game modes.
   ═══════════════════════════════════════════════════════ */

export interface ExtinctRace {
  id: string;
  name: string;
  homeworld: string;
  era: string;
  /** How they were destroyed */
  extinction: string;
  /** What remains */
  remnants: RaceRemnant[];
  /** Appearance/aesthetic */
  aesthetic: string;
  /** Their unique technology/ability */
  uniqueTrait: string;
  /** Which game modes contain their artifacts */
  discoverableIn: string[];
  /** Future expansion potential */
  expansionPotential: string;
  /** Visual palette */
  palette: { primary: string; secondary: string; glow: string };
}

export interface RaceRemnant {
  id: string;
  type: "artifact" | "architecture" | "dna" | "signal" | "language" | "art";
  name: string;
  description: string;
  /** Where it can be found */
  foundIn: string;
  /** What discovering it reveals */
  revelation: string;
}

export const EXTINCT_RACES: ExtinctRace[] = [
  {
    id: "crystallans",
    name: "The Crystallans",
    homeworld: "Prisma-7 (shattered)",
    era: "Late Empire (~16,800 A.A.)",
    extinction: "Their entire civilization was made of living crystal — sentient mineral networks that had existed since before the Architect himself. They thrived through every Age until the Thought Virus era. The Virus couldn't infect them directly (silicon, not carbon), so The Source's plague ships resonated their crystal lattice at frequencies that shattered consciousness itself. An ancient species, outliving empires, extinguished by sound.",
    remnants: [
      { id: "crystal_shard_1", type: "artifact", name: "Singing Shard", description: "A fragment of Crystallan consciousness. It hums when other crystals are nearby.", foundIn: "Terminus Swarm wave 20+ drops", revelation: "The Crystallans communicated through harmonic resonance. Their entire language was music." },
      { id: "crystal_arch", type: "architecture", name: "Crystallan Arch", description: "A doorway made of fused crystal found in the Ark's deepest deck.", foundIn: "Hidden room unlock at Prestige 2", revelation: "The Crystallans built the dimensional bridges BEFORE the Architect. He copied their work." },
      { id: "crystal_dna", type: "dna", name: "Crystallan DNA Template", description: "Silicon-based genetic code. Not carbon. Not digital. Something else entirely.", foundIn: "Cloning pod rare event", revelation: "The Resurrection Protocols can rebuild them. But they'd awaken in a universe that destroyed theirs." },
    ],
    aesthetic: "Geometric crystal formations, prismatic light, resonant harmonics. Their technology looked like stained glass windows that computed.",
    uniqueTrait: "Harmonic Technology — weapons, shields, and communication all based on sound frequencies. Their ships were instruments.",
    discoverableIn: ["terminus_swarm", "exploration", "cloning_pods", "archives"],
    expansionPotential: "Playable faction with sound-based card mechanics. Units buff each other through harmonic chains.",
    palette: { primary: "#b9f2ff", secondary: "#7dd3fc", glow: "#bae6fd" },
  },
  {
    id: "weave_born",
    name: "The Weave-Born",
    homeworld: "Thaloria (corrupted)",
    era: "Age of Privacy (~14,000 A.A.)",
    extinction: "The Shadow Tongue corrupted their language — and since their biology WAS language (living text organisms), the corruption was extinction. The Blood Weave was The Advocate's attempt to save them. It failed.",
    remnants: [
      { id: "weave_text", type: "language", name: "Living Sentence", description: "A fragment of Weave-Born consciousness. The words rearrange themselves when read.", foundIn: "Archives anomaly events", revelation: "The Weave-Born didn't speak — they WERE speech. Each individual was a living narrative." },
      { id: "weave_art", type: "art", name: "The Last Poem", description: "A Weave-Born artwork. Reading it changes the reader. Slightly. Permanently.", foundIn: "Shadow Tongue trust 60 gift", revelation: "The Shadow Tongue didn't just destroy them. He EDITED them. He considers it his greatest work." },
      { id: "weave_dna", type: "dna", name: "Linguistic DNA", description: "Genetic code written in grammar, not nucleotides.", foundIn: "Cloning pod rare event + Antiquarian trust 50", revelation: "The Resurrectionist has been trying to rebuild them for millennia. Every attempt becomes poetry instead of life." },
    ],
    aesthetic: "Living manuscripts, text that breathes, books that bleed. Their cities were libraries that wrote themselves.",
    uniqueTrait: "Narrative Biology — they could rewrite reality by editing their own genetic text. The ultimate expression of language as power.",
    discoverableIn: ["archives", "shadow_tongue_trust", "card_packs", "cloning_pods"],
    expansionPotential: "Playable faction with text-manipulation card mechanics. Spells that rewrite opponent's cards temporarily.",
    palette: { primary: "#6366f1", secondary: "#a5b4fc", glow: "#c7d2fe" },
  },
  {
    id: "void_singers",
    name: "The Void Singers",
    homeworld: "The Space Between (dimensionless)",
    era: "Pre-Foundation (~10,000 A.A.)",
    extinction: "They existed in the spaces between dimensions — the void between realities. When the Architect built the Panopticon and sealed dimensional barriers, they were trapped between walls that were never supposed to close. They starved in the dark between worlds.",
    remnants: [
      { id: "void_song", type: "signal", name: "The Void Frequency", description: "A signal from nowhere. Between radio bands. Between dimensions. Between existence and absence.", foundIn: "Comms Array signal fragments at 50+ collected", revelation: "The Void Singers aren't fully dead. They're trapped. The signal is a cry for help from beings who exist between the walls of reality." },
      { id: "void_crystal_natural", type: "artifact", name: "Natural Void Crystal", description: "Void Crystals aren't manufactured. They're Void Singer tears — crystallized grief from beings trapped between dimensions.", foundIn: "Discovery after collecting 100 Void Crystals", revelation: "Every Void Crystal in the economy is a fragment of Void Singer suffering. The entire resource system runs on their grief." },
    ],
    aesthetic: "Transparent, dimensionless, visible only through gravitational lensing. Their 'buildings' were folds in spacetime.",
    uniqueTrait: "Dimensional Phasing — existed in multiple dimensions simultaneously. Could move through solid matter by stepping 'sideways' through reality.",
    discoverableIn: ["comms_array", "observation_deck", "void_crystal_lore", "star_chart"],
    expansionPotential: "Playable faction with phasing mechanics. Units can pass through obstacles. Cards exist in two states simultaneously (quantum superposition).",
    palette: { primary: "#1e1b4b", secondary: "#4338ca", glow: "#6366f1" },
  },
  {
    id: "voltari",
    name: "The Voltari",
    homeworld: "Violetta (purple planet, living electrical storm)",
    era: "Present Day (ACTIVE — first contact in progress)",
    extinction: "NOT extinct. Hidden. The only known non-human race still alive in the galaxy. They survived the Thought Virus by existing as pure electrical consciousness — the Virus cannot infect pure charge. They live inside a planet-wide living storm that has raged for 2 million years. They don't appear to be aware of other species.",
    remnants: [
      { id: "voltari_signal", type: "signal", name: "The Violetta Frequency", description: "A rhythmic electromagnetic pulse from a purple planet in the Outer Rim. Pattern suggests intent. Translation: unknown.", foundIn: "Comms Array deep scan events", revelation: "The signal isn't natural. It's LANGUAGE. An entire civilization is speaking. Nobody speaks back because nobody can decode it." },
      { id: "voltari_fragment", type: "language", name: "Translation Fragment", description: "Partial decoding of the Violetta signal. A single word takes weeks of community effort to decode.", foundIn: "Community Translation Project (coop)", revelation: "The Voltari don't use nouns. Their language is verbs and relationships. 'Tree' doesn't exist. 'The-thing-that-grows-reaching-upward-in-company-with-others' does." },
      { id: "voltari_artifact", type: "artifact", name: "Crystallized Lightning Fragment", description: "A solidified piece of Voltari body chemistry. Hums in electromagnetic fields.", foundIn: "First successful trade exchange", revelation: "The Voltari gave this as a gift. They can trade. They WANT to trade. They just needed someone to learn their language first." },
    ],
    aesthetic: "Pure electrical beings. Visible only as lightning given form — shifting geometries of plasma and charge. Their storm-world Violetta glows purple from constant discharge. Their architecture is SHAPED LIGHTNING that holds form for centuries.",
    uniqueTrait: "Electrical Consciousness — their minds exist as standing wave patterns in atmospheric ionization. They think in frequencies, not symbols. They communicate through PATTERN, not words.",
    discoverableIn: ["comms_array", "observation_deck", "community_translation_project", "trade_empire"],
    expansionPotential: "FIRST playable non-human faction. Translated via community effort. Unique mechanics: units communicate in patterns (visual rhythms), combat through frequency manipulation, units can merge/split during play.",
    palette: { primary: "#6d28d9", secondary: "#a855f7", glow: "#c4b5fd" },
  },
  {
    id: "echo_minds",
    name: "The Echo Minds",
    homeworld: "Tempus (time-locked)",
    era: "Unknown (exist across all eras simultaneously)",
    extinction: "They didn't die — they're time-locked. The Antiquarian accidentally froze them when he first learned to manipulate time. An entire species suspended in a single moment, unable to experience the next second. He's been trying to free them ever since.",
    remnants: [
      { id: "echo_fossil", type: "artifact", name: "Temporal Fossil", description: "A creature frozen mid-thought. Not dead. Not alive. Waiting for a next moment that never comes.", foundIn: "Antiquarian trust 70 gift", revelation: "Echo the Temporal Kitten is an Echo Mind. The only one the Antiquarian managed to unstick from time. That's why it exists across multiple timelines — it's overcompensating for millennia of stasis." },
      { id: "echo_signal", type: "signal", name: "The Frozen Scream", description: "A signal that repeats. Not on a loop — frozen on a single transmission that never completes.", foundIn: "Star Chart puzzle hidden constellation", revelation: "The Antiquarian's greatest shame. The Programmer's first mistake. An entire species, paying the price for someone learning to be god." },
    ],
    aesthetic: "Beings of pure temporal energy — they look like afterimages of motion frozen in amber. Their cities are moments that never end.",
    uniqueTrait: "Temporal Consciousness — experienced all of time simultaneously. Could see past, present, and future as one unified field.",
    discoverableIn: ["observation_deck", "antiquarian_trust", "star_chart", "prestige_content"],
    expansionPotential: "Playable faction with time-manipulation mechanics. Can 'undo' opponent's last action once per match. Cards that act in the future.",
    palette: { primary: "#064e3b", secondary: "#10b981", glow: "#6ee7b7" },
  },
];

export function getExtinctRace(id: string): ExtinctRace | undefined {
  return EXTINCT_RACES.find(r => r.id === id);
}

export function getRemnantsByGameMode(gameMode: string): RaceRemnant[] {
  const remnants: RaceRemnant[] = [];
  for (const race of EXTINCT_RACES) {
    if (race.discoverableIn.includes(gameMode)) {
      remnants.push(...race.remnants);
    }
  }
  return remnants;
}

/** Total discoverable remnants across all races */
export const TOTAL_REMNANTS = EXTINCT_RACES.reduce((sum, r) => sum + r.remnants.length, 0);
