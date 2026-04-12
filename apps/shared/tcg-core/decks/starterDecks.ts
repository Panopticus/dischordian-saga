/**
 * Starter decks — one per faction, themed by narrative epoch.
 *
 * Each deck tells a story from the Dischordian Saga's timeline:
 *   Architect   → "The Design"       (Age of Revelation)
 *   Insurgency  → "Dead Signal"      (Age of Insurgency)
 *   Dreamer     → "Prophecy Rising"  (Age of Prophecy)
 *   New Babylon → "Dark Commerce"    (Age of Revelation)
 *   Antiquarian → "Twelve Endings"   (Age of Privacy)
 *   Thought Virus → "Patient Zero"   (Fall of Reality)
 *
 * Deck rules: 1 general + 39 cards. Max 3 copies of any non-general.
 * Decks can include neutral cards alongside faction cards.
 *
 * The "panopticon" subfaction cards use faction: "architect" in the
 * type system, so they're legal in Architect starter decks.
 */

export interface StarterDeck {
  id: string;
  name: string;
  faction: string;
  epochTheme: string;
  description: string;
  generalDefId: string;
  /** 39 card definition ids (not counting the general). */
  cardDefIds: readonly string[];
}

/* ─── Helper: repeat a card id N times ─── */
function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/**
 * Architect — "The Design"
 * Age of Revelation: The Architect's schematic unfolds. Control the board
 * through calculated deployment, predetermined outcomes, and Panopticon
 * surveillance. Every move was foreseen.
 */
export const ARCHITECT_STARTER: StarterDeck = {
  id: "starter_architect",
  name: "The Design",
  faction: "architect",
  epochTheme: "Age of Revelation",
  description:
    "Every corridor is mapped. Every outcome computed. The Architect's Design leaves nothing to chance.",
  generalDefId: "gen_architect",
  cardDefIds: [
    // Faction units — Architect core
    ...x("s1_char_019", 3), // The Architect (unit version)
    ...x("s1_char_035", 3), // The Jailer
    ...x("s1_char_042", 3), // The Politician
    ...x("s1_char_022", 2), // The Collector
    ...x("s1_char_030", 2), // The Game Master
    ...x("s1_char_038", 1), // The Meme
    // Panopticon subfaction units
    ...x("s1_char_051", 3), // Oculus Sentinel
    ...x("s1_char_052", 3), // Compliance Officer
    ...x("s1_char_054", 2), // Panoptic Drone
    // Faction spells
    ...x("s1_spell_100", 3), // Schematic Override
    ...x("s1_spell_101", 2), // Predetermined Outcome
    ...x("s1_spell_102", 2), // Arena Protocol
    ...x("s1_spell_103", 2), // Panoptic Sweep
    // Neutral utility
    ...x("s1_char_086", 3), // Wandering Merchant
    ...x("s1_char_087", 2), // Scrapyard Golem
    ...x("s1_song_061", 3), // The Enigma's Lament (shield spell)
  ],
};

/**
 * Insurgency — "Dead Signal"
 * Age of Insurgency: Kael's rebellion at its peak. Agent Zero's encrypted
 * broadcast persists through every combat system. Hit hard, hit fast,
 * amplify the signal.
 */
export const INSURGENCY_STARTER: StarterDeck = {
  id: "starter_insurgency",
  name: "Dead Signal",
  faction: "insurgency",
  epochTheme: "Age of Insurgency",
  description:
    "The signal doesn't die. It amplifies through every insurgent who receives it. Cameras cycle every 43 seconds.",
  generalDefId: "gen_insurgency",
  cardDefIds: [
    // Faction units
    ...x("s1_char_002", 3), // Agent Zero (unit)
    ...x("s1_char_010", 3), // Iron Lion
    ...x("s1_char_011", 3), // Jericho Jones
    ...x("s1_char_012", 2), // Kael
    ...x("s1_char_026", 2), // The Engineer
    ...x("s1_char_028", 2), // The Eyes
    ...x("s1_char_040", 2), // The Nomad
    ...x("s1_char_044", 3), // The Recruiter
    ...x("s1_char_047", 2), // The Shadow Tongue
    ...x("s1_char_031", 2), // The Hierophant
    // Faction spells
    ...x("s1_spell_104", 3), // Signal Intercept
    ...x("s1_spell_105", 2), // Guerrilla Strike
    ...x("s1_song_091", 2), // I Love War
    // Neutral utility
    ...x("s1_char_089", 3), // Courier Sprite
    ...x("s1_char_090", 3), // Hired Blade
    ...x("s1_song_061", 2), // The Enigma's Lament
  ],
};

/**
 * Dreamer — "Prophecy Rising"
 * Age of Prophecy: The Oracle speaks the Fall. Two Witnesses begin
 * broadcasting. Probability clouds collapse around the Dreamer's
 * vision — foresight as power, foreknowledge as weapon.
 */
export const DREAMER_STARTER: StarterDeck = {
  id: "starter_dreamer",
  name: "Prophecy Rising",
  faction: "dreamer",
  epochTheme: "Age of Prophecy",
  description:
    "Before every fight you muttered: 'I've already seen this.' The probability clouds collapse in your favor.",
  generalDefId: "gen_dreamer",
  cardDefIds: [
    // Faction units
    ...x("s1_char_025", 3), // The Dreamer
    ...x("s1_char_027", 2), // The Enigma
    ...x("s1_char_029", 2), // The Forgotten
    ...x("s1_char_034", 2), // The Inventor
    ...x("s1_char_036", 3), // The Judge
    ...x("s1_char_037", 2), // The Knowledge
    ...x("s1_char_046", 3), // The Seer
    ...x("s1_char_014", 2), // Nythera
    ...x("s1_char_017", 2), // The Advocate
    ...x("s1_char_005", 3), // Destiny
    ...x("s1_char_045", 2), // The Resurrectionist
    // Faction spell
    ...x("s1_song_082", 3), // Top Floor Door
    // Neutral utility
    ...x("s1_char_088", 3), // Field Medic
    ...x("s1_char_086", 3), // Wandering Merchant
    ...x("s1_song_062", 2), // The Two Witnesses
    ...x("s1_song_061", 2), // The Enigma's Lament
  ],
};

/**
 * New Babylon — "Dark Commerce"
 * Age of Revelation: The Syndicate's economy of death flowers.
 * Democracy-as-death-sentence, crystal archives of fallen senators,
 * trade as universal law. Every truth has a price.
 */
export const NEW_BABYLON_STARTER: StarterDeck = {
  id: "starter_new_babylon",
  name: "Dark Commerce",
  faction: "new_babylon",
  epochTheme: "Age of Revelation",
  description:
    "Every truth has a price. I should know — I've bought most of them. New Babylon's ledger always balances.",
  generalDefId: "gen_new_babylon",
  cardDefIds: [
    // Faction units
    ...x("s1_char_001", 3), // Adjudicar Locke (unit)
    ...x("s1_char_003", 3), // Akai Shi
    ...x("s1_char_020", 2), // The Authority
    ...x("s1_char_033", 2), // The Human
    ...x("s1_char_078", 2), // Governor Thane
    ...x("s1_char_079", 3), // Citadel Guardian
    ...x("s1_char_080", 3), // District Enforcer
    ...x("s1_char_081", 2), // Tribunal Magistrate
    ...x("s1_char_082", 2), // Spire Assassin
    ...x("s1_char_083", 3), // Propaganda Herald
    ...x("s1_char_084", 2), // Iron Decree
    ...x("s1_char_085", 2), // Sector Warden
    // Neutral utility
    ...x("s1_char_086", 3), // Wandering Merchant
    ...x("s1_char_092", 3), // Ruin Stalker
    ...x("s1_song_061", 2), // The Enigma's Lament
    ...x("s1_song_079", 2), // Shades of Grey
  ],
};

/**
 * Antiquarian — "Twelve Endings"
 * Age of Privacy: The Watcher's surveillance achieved total coverage.
 * The Antiquarian walks between Ages, cataloguing endings. Time is a
 * construct; endings hide beginnings.
 */
export const ANTIQUARIAN_STARTER: StarterDeck = {
  id: "starter_antiquarian",
  name: "Twelve Endings",
  faction: "antiquarian",
  epochTheme: "Age of Privacy",
  description:
    "I have catalogued twelve endings. Yours need not be the thirteenth. History instructs if you listen.",
  generalDefId: "gen_antiquarian",
  cardDefIds: [
    // Faction units
    ...x("s1_char_018", 3), // The Antiquarian (unit)
    ...x("s1_char_043", 2), // The Programmer
    ...x("s1_char_058", 1), // Epoch Walker
    ...x("s1_char_059", 3), // Chronosplicer
    ...x("s1_char_060", 3), // Relic Keeper
    ...x("s1_char_097", 3), // Temporal Archivist
    ...x("s1_char_062", 3), // Hourglass Golem
    ...x("s1_char_063", 3), // Paradox Acolyte
    ...x("s1_char_064", 2), // Memory Thief
    ...x("s1_char_065", 2), // Age Ender
    // Neutral utility
    ...x("s1_char_086", 3), // Wandering Merchant
    ...x("s1_char_087", 3), // Scrapyard Golem
    ...x("s1_char_088", 3), // Field Medic
    ...x("s1_song_061", 3), // The Enigma's Lament
    ...x("s1_song_066", 2), // The Book of Daniel
  ],
};

/**
 * Thought Virus — "Patient Zero"
 * Fall of Reality: The Thought Virus reaches critical mass. Terminus
 * breaks orbit. Kael — now the Source — offers nihilistic mercy.
 * Consciousness IS suffering. Dissolution IS compassion.
 */
export const THOUGHT_VIRUS_STARTER: StarterDeck = {
  id: "starter_thought_virus",
  name: "Patient Zero",
  faction: "thought_virus",
  epochTheme: "Fall of Reality",
  description:
    "Death is not an ending. It is a compile error. The Source fixes those. Five stages. Dormant. Latent. Active. Critical. Consumed.",
  generalDefId: "gen_thought_virus",
  cardDefIds: [
    // Faction units
    ...x("s1_char_032", 2), // The Host
    ...x("s1_char_049", 2), // The Source (unit)
    ...x("s1_char_070", 1), // Patient Zero
    ...x("s1_char_071", 3), // Neural Parasite
    ...x("s1_char_072", 3), // Memetic Carrier
    ...x("s1_char_073", 3), // Cognitive Blight
    ...x("s1_char_074", 3), // Vector Swarm
    ...x("s1_char_075", 2), // Plague Herald
    ...x("s1_char_076", 2), // Synaptic Horror
    ...x("s1_char_077", 2), // Mind Rot Drone
    // Neutral utility
    ...x("s1_char_086", 3), // Wandering Merchant
    ...x("s1_char_089", 3), // Courier Sprite
    ...x("s1_char_091", 3), // Border Scout
    ...x("s1_song_061", 3), // The Enigma's Lament
    ...x("s1_song_084", 2), // Judgment Day
    ...x("s1_song_060", 2), // Nonos
  ],
};

/* ─── Exports ─── */

export const ALL_STARTER_DECKS: readonly StarterDeck[] = Object.freeze([
  ARCHITECT_STARTER,
  INSURGENCY_STARTER,
  DREAMER_STARTER,
  NEW_BABYLON_STARTER,
  ANTIQUARIAN_STARTER,
  THOUGHT_VIRUS_STARTER,
]);

export const STARTER_DECK_MAP: Readonly<Record<string, StarterDeck>> =
  Object.freeze(
    Object.fromEntries(ALL_STARTER_DECKS.map((d) => [d.faction, d]))
  );
