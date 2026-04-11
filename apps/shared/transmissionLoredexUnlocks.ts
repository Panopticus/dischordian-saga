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
];

/** Get Loredex entries to unlock for a given transmission */
export function getLoredexUnlocksForTransmission(transmissionId: string): TransmissionLoredexUnlock | null {
  return TRANSMISSION_LOREDEX_UNLOCKS.find(u => u.transmissionId === transmissionId) || null;
}
