/**
 * Transmission → Loredex Entry Mapping
 *
 * Each episode unlocks specific Loredex entries when watched for the first time.
 * These entries correspond to characters, locations, and concepts introduced in that episode.
 * The entries are revealed via the DiscoveryNotification system after the Meme's outro.
 */

export interface TransmissionLoredexUnlock {
  /** Transmission ID (e.g., "ep1-0") */
  transmissionId: string;
  /** Loredex entity IDs to unlock */
  entityIds: string[];
  /** Label shown in the discovery notification */
  discoveryLabel: string;
}

export const TRANSMISSION_LOREDEX_UNLOCKS: TransmissionLoredexUnlock[] = [
  {
    transmissionId: "ep1-0", // In the Beginning
    entityIds: ["entity_2", "entity_1", "entity_3"], // Architect, Programmer, CoNexus
    discoveryLabel: "The Architect's origin revealed",
  },
  {
    transmissionId: "ep1-1", // Awakenings 1.0
    entityIds: ["entity_66", "entity_79"], // Antiquarian, Nythera (Potentials)
    discoveryLabel: "The Potentials awaken",
  },
  {
    transmissionId: "ep1-2", // A Destructive Potential
    entityIds: ["entity_67"], // Destiny (ship AI) + Violetta reference
    discoveryLabel: "A purple planet watches",
  },
  {
    transmissionId: "ep1-3", // The Terminus Swarm
    entityIds: ["entity_70", "entity_68"], // Terminus, Terminus Swarm
    discoveryLabel: "Terminus revealed",
  },
  {
    transmissionId: "ep1-4", // The Fall
    entityIds: ["entity_89"], // Thought Virus
    discoveryLabel: "The Thought Virus spreads",
  },
  {
    transmissionId: "ep1-5", // The Outbreak
    entityIds: ["entity_55"], // The Source
    discoveryLabel: "The Source detected",
  },
  {
    transmissionId: "ep1-6", // The Source
    entityIds: ["entity_49", "entity_26"], // Kael, The Recruiter
    discoveryLabel: "Kael's identity revealed",
  },
  {
    transmissionId: "ep1-7", // The Decision
    entityIds: [], // No new entities — moral choice episode
    discoveryLabel: "A Faustian bargain offered",
  },
  {
    transmissionId: "ep1-8", // The Arrival
    entityIds: ["entity_29", "entity_69"], // Thaloria, The City
    discoveryLabel: "A crystalline city discovered",
  },
  {
    transmissionId: "ep1-9", // Illuminated Shadows
    entityIds: ["entity_8"], // Hierarchy of the Damned
    discoveryLabel: "Ancient horrors witnessed",
  },
  {
    transmissionId: "ep1-10", // The Helmet
    entityIds: ["entity_6"], // The Collector
    discoveryLabel: "The Collector reborn",
  },
  {
    transmissionId: "ep1-11", // The City (Oracle reveal)
    entityIds: ["entity_50", "entity_44"], // The Oracle, Council of Harmony
    discoveryLabel: "The Oracle speaks",
  },
  {
    transmissionId: "ep1-12", // The Return
    entityIds: ["entity_56", "entity_59"], // The Jailer, The White Oracle
    discoveryLabel: "The Oracle's history unfolds",
  },
  {
    transmissionId: "ep1-13", // Wyrmwood
    entityIds: ["entity_58"], // The Hierophant
    discoveryLabel: "The Temple of Truth entered",
  },
  {
    transmissionId: "ep1-14", // The Hunt
    entityIds: [], // Combat episode, no new entities
    discoveryLabel: "The Collector hunted",
  },
  {
    transmissionId: "ep1-15", // The Beginning of the End
    entityIds: ["entity_76", "entity_54"], // The Host, The Enigma
    discoveryLabel: "The virus breaches the city",
  },
  {
    transmissionId: "ep1-16", // Memento Dischordia
    entityIds: ["entity_5"], // The Meme
    discoveryLabel: "Epoch 1 complete — The Meme remembers",
  },

  // ─── EPOCH ZERO (Deep Archive) UNLOCKS ───

  {
    transmissionId: "ep0-1", // The Prison Planet
    entityIds: ["entity_118"], // The Breaking Point concept
    discoveryLabel: "A fractured signal — two voices, one choice",
  },
  {
    transmissionId: "ep0-4", // Iron Lion's Last Stand
    entityIds: ["entity_129", "entity_130"], // Forge World, Shadow Realm
    discoveryLabel: "The war fronts revealed — forge and shadow",
  },
  {
    transmissionId: "ep0-8", // Late Night with the Meme
    entityIds: ["entity_106"], // Malkia Ukweli
    discoveryLabel: "The Queen of Truth unmasked",
  },
  {
    transmissionId: "ep0-12", // The Detective
    entityIds: ["entity_134"], // The Comms Array
    discoveryLabel: "The Human's domain discovered",
  },

  // ─── GAMEPLAY SYSTEM UNLOCKS ───

  {
    transmissionId: "system_cryo_awakening", // First cryo bay visit
    entityIds: ["entity_117"], // Resurrection Protocols
    discoveryLabel: "You died. You returned. Now you understand why.",
  },
  {
    transmissionId: "system_eidolon_bond", // First eidolon bond
    entityIds: ["entity_109", "entity_110", "entity_111", "entity_112", "entity_113", "entity_114"], // All 6 eidolons
    discoveryLabel: "The Eidolons awaken — choose your anchor",
  },
  {
    transmissionId: "system_first_strand", // First strand contract completed
    entityIds: ["entity_115", "entity_116"], // Strand Contracts, Phantom Crew
    discoveryLabel: "You are not alone in the Arks",
  },
  {
    transmissionId: "system_necromancer_event", // Necromancer Returns event activates
    entityIds: ["entity_120", "entity_125", "entity_126"], // Event + both factions
    discoveryLabel: "The dead stir — choose your allegiance",
  },
  {
    transmissionId: "system_dreamer_event", // Dreamer Awakens event activates
    entityIds: ["entity_121"], // Dreamer Awakens
    discoveryLabel: "Hope is not a metaphor — it has a pulse",
  },
  {
    transmissionId: "system_terminus_event", // Terminus Advance event activates
    entityIds: ["entity_122"], // Terminus Advance
    discoveryLabel: "Terminus draws closer",
  },
  {
    transmissionId: "system_antiquarian_event", // Antiquarian Revelation event activates
    entityIds: ["entity_123"], // Antiquarian's Revelation
    discoveryLabel: "The timelines converge — hidden truths emerge",
  },
  {
    transmissionId: "system_grand_edit_event", // Grand Edit event activates
    entityIds: ["entity_124"], // The Grand Edit
    discoveryLabel: "The words are changing. Trust nothing you read.",
  },
  {
    transmissionId: "system_celebration_visit", // First Project Celebration visit
    entityIds: ["entity_127"], // The Mascoteers
    discoveryLabel: "Welcome to Celebration — where dreams don't always shine",
  },
  {
    transmissionId: "system_mechronis_visit", // First Mechronis Academy visit
    entityIds: ["entity_128"], // The Mechronis Faculty
    discoveryLabel: "Class is in session. The professors believe they are gods.",
  },
  {
    transmissionId: "system_guild_capital", // First guild capital established
    entityIds: ["entity_131", "entity_132", "entity_133"], // Crystal Spire, Void Nexus, Eden Prime
    discoveryLabel: "New worlds to claim — the Syndicate expands",
  },
  {
    transmissionId: "system_observation_deck", // First Observation Deck visit
    entityIds: ["entity_135"], // Observation Deck
    discoveryLabel: "The stars have messages. Look closer.",
  },
  {
    transmissionId: "system_pressure_threshold", // First Living Universe pressure threshold crossed
    entityIds: ["entity_119"], // The Pressure System
    discoveryLabel: "The universe is listening to what you do",
  },
  {
    transmissionId: "system_arena_entry", // First Arena match
    entityIds: ["entity_105"], // Collector Clone-007
    discoveryLabel: "The Arena Master greets you — he is not his progenitor",
  },
  {
    transmissionId: "system_trade_empire", // Trade Empire first contact with special NPCs
    entityIds: ["entity_107", "entity_108"], // The Philosopher, Tyrant King
    discoveryLabel: "The traders of the void — wisdom and force",
  },
];

/** Get Loredex entries to unlock for a given transmission */
export function getLoredexUnlocksForTransmission(transmissionId: string): TransmissionLoredexUnlock | null {
  return TRANSMISSION_LOREDEX_UNLOCKS.find(u => u.transmissionId === transmissionId) || null;
}
