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

  /* ─── EXPANSION UNLOCKS — CADES / DEAD MAN'S CIRCUIT / STORY MODE ───
     These tie the expansion Loredex entries into the transmission
     system. Each unlock fires the first time the player watches the
     matching transmission OR the first time the in-game trigger is
     hit (see cadesNarrativeIntegration.ts and DMC server routes). */

  // CADES UNIT DISCOVERY — fires when The Human whispers in Medical Bay (Act 5+)
  // Also unlocked by ep0-4 "The Last Stand of the Iron Lion" if present.
  {
    transmissionId: "ep0-4",
    entityIds: [
      "entity_iron_lion_imprint",
      "location_bridge_of_kael",
    ],
    discoveryLabel: "Iron Lion's last stand — preserved",
  },

  // CADES Three-Mode Tutorial — The Human explains the unit
  // In-game hook: cadesDiscovered flag set (cadesNarrativeIntegration.ts CADES_DISCOVERY_WHISPER)
  {
    transmissionId: "cades-discovery",
    entityIds: [
      "concept_cades_unit",
      "entity_iron_lion_imprint",
      "location_bridge_of_kael",
    ],
    discoveryLabel: "The CADES Unit reveals itself",
  },

  // Historical Incursions — Game Masters first contact
  // In-game hook: game_masters_contact_level >= 1 (GameMode.gd)
  {
    transmissionId: "cades-gm-contact-1",
    entityIds: [
      "faction_game_masters_cult",
      "location_matrix_anchor_point_7",
    ],
    discoveryLabel: "The Game Masters make contact",
  },

  // Game Masters final offer — reveals the Goggles and the Wager
  // In-game hook: game_masters_contact_level >= 4
  {
    transmissionId: "cades-gm-contact-4",
    entityIds: [
      "concept_goggles_of_game_master",
      "concept_the_wager",
      "event_game_masters_offer",
    ],
    discoveryLabel: "The Goggles, the Wager, the Offer",
  },

  // Iron Lion's Signal — triggered by cades_awareness_level >= 3
  // (consciousness-imprint anomaly detected)
  {
    transmissionId: "cades-awareness-3",
    entityIds: [
      "concept_iron_lion_signal",
    ],
    discoveryLabel: "The imprint is asking questions",
  },

  // The Open Channel — canonical 3:47:00 + Open Channel kept ready
  // In-game hook: cades_iron_lion_contacted flag
  {
    transmissionId: "cades-open-channel",
    entityIds: [
      "event_iron_lion_contact",
    ],
    discoveryLabel: "Iron Lion spoke to you",
  },

  // Thoughtborn arrive — Ship Defense Observation Deck breach
  // In-game hook: cades_thoughtborn_contacted flag
  {
    transmissionId: "cades-thoughtborn",
    entityIds: [
      "faction_thoughtborn",
      "entity_thoughtborn_pilgrim",
    ],
    discoveryLabel: "The Thoughtborn heard the signal",
  },

  // Ship Defense — the other two factions
  // In-game hook: cades_breach_contact flag
  {
    transmissionId: "cades-breach",
    entityIds: [
      "faction_reclamation",
      "entity_reclamation_enforcer",
      "faction_salvagers",
      "entity_salvager_captain",
    ],
    discoveryLabel: "Ark 1047 is breached",
  },

  // DEAD MAN'S CIRCUIT — season opens
  // In-game hook: first entry into /dead-mans-circuit during an active season
  {
    transmissionId: "dmc-season-1",
    entityIds: [
      "location_dead_mans_circuit",
      "location_the_trench",
      "entity_nilmorg",
      "concept_wired_clones",
    ],
    discoveryLabel: "The Circuit opens",
  },

  // DMC — first clone death
  {
    transmissionId: "dmc-first-death",
    entityIds: [
      "location_bone_lane",
      "concept_neural_splice",
    ],
    discoveryLabel: "The Bone Lane grows",
  },

  // DMC — first season win
  // In-game hook: finishPosition === 1 at season end
  {
    transmissionId: "dmc-first-win",
    entityIds: [
      "concept_severance_prize",
      "event_dmc_season_opens",
    ],
    discoveryLabel: "The Severance Prize is paid",
  },

  // DMC — Warlord's Bet side quest completion
  {
    transmissionId: "dmc-warlord-bet",
    entityIds: [
      "event_warlord_bet",
    ],
    discoveryLabel: "The Warlord lost her wager",
  },

  // STORY MODE — Narrative Act 6 (The Human's Confession)
  // In-game hook: narrative_act_complete event with actNumber >= 6
  {
    transmissionId: "act6-confession",
    entityIds: [
      "event_human_confession",
      "concept_the_watcher_hidden",
    ],
    discoveryLabel: "The Human confesses — the war is a cover",
  },

  // MECHRONIS / CELEBRATION — Mascoteers and Professors
  // In-game hook: first visit to Mechronis Academy common room
  {
    transmissionId: "mechronis-first-visit",
    entityIds: [
      "faction_mechronis_professors",
    ],
    discoveryLabel: "The Faculty gathers",
  },
  {
    transmissionId: "celebration-first-visit",
    entityIds: [
      "faction_mascoteers",
    ],
    discoveryLabel: "Welcome to Celebration",
  },
];

/** Get Loredex entries to unlock for a given transmission */
export function getLoredexUnlocksForTransmission(transmissionId: string): TransmissionLoredexUnlock | null {
  return TRANSMISSION_LOREDEX_UNLOCKS.find(u => u.transmissionId === transmissionId) || null;
}
