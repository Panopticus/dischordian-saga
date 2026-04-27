// apps/shared/tradeEmpire/cargo.ts
//
// Trade Empire CargoItem types — Phase 2.1a per the canonical plan
// "Cargo Holds: typed cargo with mass, volume, perishable, contraband,
// attribution" canon. Replaces the canonical-abstract SectorResources
// frame with canonical-typed cargo per cargo-category.
//
// Canonical "attribution" canon per Antiquarian's "desks do not run"
// (broker §canon at brokers.ts:43, 191-192): cargo canonically carries
// chain-of-custody metadata. The Antiquarian canonically audits
// attribution; Locke canonically files the audit; Nilmorg canonically
// signs the canonical-paperwork; Vex canonically routes Coda
// commerce against the canonical-attribution-record.
//
// 11 canonical cargo-categories spanning the saga's economic surface
// — each canonical-category canonical-bridges to ≥1 broker and/or
// canonical-system (DMC / TCG / Authority / Antiquarian archives).

import type { BrokerKey } from "./brokers";

// --- Canonical cargo categories ----------------------------------------

/**
 * Canonical 11 cargo-category enum — every Trade Empire cargo-shipment
 * canonically declares one canonical-category.
 */
export type CargoCategory =
  | "clone_body" // Nilmorg severance commodity (DMC bridge)
  | "signature_archive" // Nilmorg signature trade
  | "prize_body" // DMC severance prize body (post-Severance ceremony)
  | "tcg_cards" // TCG card-pack shipment
  | "research_data" // canonical-archive shipment (Antiquarian)
  | "civic_supplies" // canonical-faction logistics (Coalition / Hierarchy / Ark)
  | "rare_minerals" // canonical-extraction commodity (Independent freeport)
  | "data_cores" // canonical-information commodity
  | "quantum_relics" // canonical-Antiquarian-archive shipment
  | "refugees" // canonical-Insurgency-extraction
  | "bookkeeping_records"; // canonical-Locke-Authority paperwork

/**
 * Canonical CargoAttribution per Antiquarian "desks do not run" canon.
 * Cargo canonically carries chain-of-custody metadata — originator,
 * signatories, attribution stance.
 */
export interface CargoAttribution {
  /** Canonical originator key (NPC / broker / faction). */
  originatorKey: string;
  /** Canonical originator's canonical-role. */
  originatorRole: "broker" | "faction" | "npc" | "unattributed";
  /**
   * Canonical signatory chain — every entity that canonical-signed
   * the canonical-attribution-record. Empty array = no signatures
   * (canonical-deliberately-blank or canonical-yet-to-be-signed).
   */
  signatories: ReadonlyArray<string>;
  /**
   * Optional canonical-canonical-record reference (e.g.,
   * "antiquarian.archive.shelf-7.row-12") for canonical lookup.
   */
  recordReference?: string;
  /**
   * Canonical attribution stance per Antiquarian §canon:
   *   "complete" — canonical-full canonical-chain-of-custody on file
   *   "partial" — canonical-some canonical-signatures missing
   *   "deliberately_blank" — canonical-Nilmorg-style canonical-refusal
   *     to canonical-attribute (canonical-institutional-precision canon)
   */
  attributionStanceCanon: "complete" | "partial" | "deliberately_blank";
}

/**
 * Canonical CargoItem — every Trade Empire shipment canonically
 * declares mass / volume / perishable / contraband / attribution.
 */
export interface CargoItem {
  /** Globally-unique cargo definition id. */
  cargoId: string;
  /** Canonical cargo-category. */
  category: CargoCategory;
  /** Display name. */
  name: string;
  /** Lore-context for the cargo (typically 1–2 sentences). */
  loreContext: string;
  /**
   * Canonical-mass in canonical-units. 1.0 = standard cargo unit
   * (canonical-faction-logistics baseline). Varies per category:
   * clone-body ~12.0; signature-archive ~0.05; refugees ~75.0 per
   * canonical-passenger-hold; bookkeeping-records ~3.0 per ledger.
   */
  mass: number;
  /**
   * Canonical-volume in canonical-units. 1.0 = standard cargo unit.
   * Volume canonically constrains canonical-cargo-hold capacity
   * independently of canonical-mass.
   */
  volume: number;
  /**
   * Canonical-perishable canon: cargo canonically degrades over
   * time. Engine canonically applies canonical-degradation per
   * shelfLifeHours.
   */
  perishable: boolean;
  /**
   * Canonical-shelf-life in canonical-hours. Only canonical-meaningful
   * when perishable === true. Engine canonically marks cargo as
   * canonical-spoiled at hour-zero unless canonical-delivered.
   */
  shelfLifeHours?: number;
  /**
   * Canonical-contraband canonical: cargo canonically canonical-
   * illegal canonical-by-default. Engine canonical-applies
   * canonical-faction-jurisdiction reputation deltas on canonical-
   * detection.
   */
  contraband: boolean;
  /**
   * Optional canonical per-faction contraband override map. If
   * present, canonical-overrides the canonical-default contraband
   * boolean per canonical-faction. Example: clone-body canonically
   * legal in canonical-Hierarchy, contraband elsewhere.
   */
  contrabandPerFaction?: Readonly<Record<string, boolean>>;
  /**
   * Canonical-attribution per Antiquarian's "desks do not run" canon.
   */
  attribution: CargoAttribution;
  /**
   * Optional canonical-broker-origin for cargo originating from a
   * canonical-broker contract.
   */
  brokerOrigin?: BrokerKey;
  /**
   * Optional canonical-destination sector. If absent, cargo is
   * canonical-destination-flexible.
   */
  destinationSector?: string;
  /**
   * Optional canonical-reward-factor (multiplier on canonical-contract
   * reward at canonical-delivery). Default 1.0.
   */
  rewardFactor?: number;
}

// --- Canonical cargo registry ------------------------------------------

/**
 * Canonical CARGO_REGISTRY — canonical-seeded canonical-cargo-items.
 * Phase 2.1a ships canonical-anchor cargo per canonical-category;
 * additional canonical-templates ship in subsequent canonical-Phase-2
 * sub-chunks as cross-system bridges canonically activate.
 */
export const CARGO_REGISTRY: Readonly<Record<string, CargoItem>> = {
  // ─── clone_body ────────────────────────────────────────────────

  "clone_body.severance_tier": {
    cargoId: "clone_body.severance_tier",
    category: "clone_body",
    name: "Severance-Tier Clone Body (Sealed)",
    loreContext:
      "A sealed canonical-clone-body container from Nilmorg's DMC " +
      "platform. Canonical-fresh, canonical-splice-tagged, canonical-" +
      "signed. The canonical-container does canonical-not canonical-" +
      "open in transit. The canonical-recipient is canonical-not " +
      "canonical-named.",
    mass: 12.0,
    volume: 8.0,
    perishable: true,
    shelfLifeHours: 72,
    contraband: false,
    contrabandPerFaction: {
      coalition: true,
      ark: true,
      hierarchy: false,
    },
    attribution: {
      originatorKey: "nilmorg",
      originatorRole: "broker",
      signatories: ["nilmorg", "dmc.platform.witness_protocol"],
      recordReference: "dmc.severance.ledger",
      attributionStanceCanon: "deliberately_blank",
    },
    brokerOrigin: "broker_nilmorg_severance",
    rewardFactor: 1.5,
  },

  // ─── signature_archive ─────────────────────────────────────────

  "signature_archive.quartz_tablet": {
    cargoId: "signature_archive.quartz_tablet",
    category: "signature_archive",
    name: "Quartz Signature Tablet",
    loreContext:
      "A canonical-quartz tablet inscribed with canonical-Nilmorg-" +
      "platform signatures from the canonical-three-most-recent " +
      "canonical-Severance ceremonies. The canonical-tablet is " +
      "canonical-archive-grade; canonical-collectors canonical-pay.",
    mass: 0.05,
    volume: 0.02,
    perishable: false,
    contraband: false,
    attribution: {
      originatorKey: "nilmorg",
      originatorRole: "broker",
      signatories: [
        "nilmorg",
        "dmc.platform.signatory_log",
      ],
      recordReference: "dmc.signature.archive.q-series",
      attributionStanceCanon: "complete",
    },
    brokerOrigin: "broker_nilmorg_severance",
    rewardFactor: 1.2,
  },

  // ─── prize_body ────────────────────────────────────────────────

  "prize_body.severance_winner": {
    cargoId: "prize_body.severance_winner",
    category: "prize_body",
    name: "Severance-Prize Body (Awakened)",
    loreContext:
      "A canonical-clone-body that has canonical-completed the " +
      "canonical-Severance Protocol — a canonical-soul-fragment has " +
      "canonical-installed. The canonical-recipient is the canonical-" +
      "season-winner; the canonical-delivery is canonical-the canonical-" +
      "ceremony's canonical-final canonical-step.",
    mass: 75.0,
    volume: 50.0,
    perishable: false,
    contraband: false,
    attribution: {
      originatorKey: "nilmorg",
      originatorRole: "broker",
      signatories: [
        "nilmorg",
        "dmc.severance.ceremony_log",
        "dmc.season.winner_log",
      ],
      recordReference: "dmc.severance.ceremony.delivered",
      attributionStanceCanon: "complete",
    },
    brokerOrigin: "broker_nilmorg_severance",
    rewardFactor: 2.0,
  },

  // ─── tcg_cards ─────────────────────────────────────────────────

  "tcg_cards.standard_pack": {
    cargoId: "tcg_cards.standard_pack",
    category: "tcg_cards",
    name: "Standard TCG Card-Pack Shipment",
    loreContext:
      "A canonical-shipment of canonical-standard TCG card-packs " +
      "for canonical-distribution to canonical-faction-aligned " +
      "outlets. Canonical-low-margin, canonical-high-volume.",
    mass: 0.5,
    volume: 1.0,
    perishable: false,
    contraband: false,
    attribution: {
      originatorKey: "tcg.distribution.canonical_pipeline",
      originatorRole: "faction",
      signatories: ["tcg.distribution.canonical_pipeline"],
      attributionStanceCanon: "complete",
    },
    rewardFactor: 0.8,
  },

  // ─── research_data ─────────────────────────────────────────────

  "research_data.antiquarian_dataset": {
    cargoId: "research_data.antiquarian_dataset",
    category: "research_data",
    name: "Antiquarian Research Dataset",
    loreContext:
      "A canonical-dataset commissioned by the canonical-Antiquarian " +
      "for canonical-archive expansion. The canonical-attribution " +
      "is canonical-complete — the canonical-Antiquarian canonical-" +
      "files canonical-rigorously.",
    mass: 0.1,
    volume: 0.05,
    perishable: false,
    contraband: false,
    attribution: {
      originatorKey: "the_antiquarian",
      originatorRole: "npc",
      signatories: [
        "the_antiquarian",
        "antiquarian.archive.shelf_log",
      ],
      recordReference: "antiquarian.archive.research_dataset.v1",
      attributionStanceCanon: "complete",
    },
    brokerOrigin: "broker_antiquarian_archive",
    rewardFactor: 1.3,
  },

  // ─── civic_supplies ────────────────────────────────────────────

  "civic_supplies.faction_logistics": {
    cargoId: "civic_supplies.faction_logistics",
    category: "civic_supplies",
    name: "Faction Civic Supplies",
    loreContext:
      "Canonical-standard canonical-faction-logistics shipment. " +
      "Canonical-medical, canonical-food, canonical-replacement-parts. " +
      "Canonical-low-glamour, canonical-high-canonical-impact.",
    mass: 50.0,
    volume: 100.0,
    perishable: true,
    shelfLifeHours: 168, // canonical 7-day shelf-life
    contraband: false,
    attribution: {
      originatorKey: "faction.logistics.canonical_pipeline",
      originatorRole: "faction",
      signatories: ["faction.logistics.canonical_pipeline"],
      attributionStanceCanon: "complete",
    },
    rewardFactor: 1.0,
  },

  // ─── rare_minerals ─────────────────────────────────────────────

  "rare_minerals.freeport_extraction": {
    cargoId: "rare_minerals.freeport_extraction",
    category: "rare_minerals",
    name: "Freeport Mineral Extraction",
    loreContext:
      "Canonical-extracted minerals from canonical-Independent " +
      "Freeport canonical-claim. The canonical-attribution is " +
      "canonical-partial — the canonical-Freeport canonical-files " +
      "canonical-loosely.",
    mass: 200.0,
    volume: 75.0,
    perishable: false,
    contraband: false,
    attribution: {
      originatorKey: "independent.freeport",
      originatorRole: "faction",
      signatories: ["independent.freeport"],
      attributionStanceCanon: "partial",
    },
    brokerOrigin: "broker_independent_freeport",
    rewardFactor: 1.4,
  },

  // ─── data_cores ────────────────────────────────────────────────

  "data_cores.encrypted_payload": {
    cargoId: "data_cores.encrypted_payload",
    category: "data_cores",
    name: "Encrypted Data-Core Payload",
    loreContext:
      "Canonical-encrypted data-core. The canonical-payload is " +
      "canonical-time-sensitive; the canonical-decryption-key " +
      "canonical-arrives at canonical-destination. Canonical-Authority " +
      "canonical-flags canonical-encrypted payloads as canonical-" +
      "contraband canonical-by-default.",
    mass: 0.2,
    volume: 0.1,
    perishable: true,
    shelfLifeHours: 24,
    contraband: true,
    contrabandPerFaction: {
      coalition: true,
      hierarchy: true,
      ark: false,
      insurgency: false,
    },
    attribution: {
      originatorKey: "unattributed",
      originatorRole: "unattributed",
      signatories: [],
      attributionStanceCanon: "deliberately_blank",
    },
    rewardFactor: 1.8,
  },

  // ─── quantum_relics ────────────────────────────────────────────

  "quantum_relics.archive_shipment": {
    cargoId: "quantum_relics.archive_shipment",
    category: "quantum_relics",
    name: "Quantum Relic Archive Shipment",
    loreContext:
      "Canonical-quantum-relics for canonical-Antiquarian archive. " +
      "Canonical-fragile, canonical-attribution-canonical, canonical-" +
      "high-value. The canonical-Antiquarian canonical-files canonical-" +
      "every canonical-signature.",
    mass: 2.0,
    volume: 1.5,
    perishable: false,
    contraband: false,
    attribution: {
      originatorKey: "the_antiquarian",
      originatorRole: "npc",
      signatories: [
        "the_antiquarian",
        "antiquarian.archive.quantum_log",
      ],
      recordReference: "antiquarian.archive.quantum_relic.batch_seal",
      attributionStanceCanon: "complete",
    },
    brokerOrigin: "broker_antiquarian_archive",
    rewardFactor: 1.6,
  },

  // ─── refugees ──────────────────────────────────────────────────

  "refugees.insurgency_extraction": {
    cargoId: "refugees.insurgency_extraction",
    category: "refugees",
    name: "Insurgency Refugee Extraction",
    loreContext:
      "Canonical-Insurgency canonical-extraction-cargo: canonical-" +
      "refugees from canonical-occupied-territory. The canonical-" +
      "attribution is canonical-deliberately-blank — canonical-" +
      "naming canonical-endangers the canonical-passengers.",
    mass: 75.0,
    volume: 100.0,
    perishable: true,
    shelfLifeHours: 96, // canonical 4-day passenger-hold tolerance
    contraband: true,
    contrabandPerFaction: {
      coalition: false,
      ark: false,
      hierarchy: true,
      insurgency: false,
    },
    attribution: {
      originatorKey: "insurgency.canonical_extraction_cell",
      originatorRole: "faction",
      signatories: [],
      attributionStanceCanon: "deliberately_blank",
    },
    rewardFactor: 1.5,
  },

  // ─── bookkeeping_records ───────────────────────────────────────

  "bookkeeping_records.authority_ledger": {
    cargoId: "bookkeeping_records.authority_ledger",
    category: "bookkeeping_records",
    name: "Authority Ledger Shipment",
    loreContext:
      "Canonical-Authority canonical-bookkeeping-records — canonical-" +
      "Locke's canonical-files canonical-archived for canonical-" +
      "long-term canonical-retention. The canonical-attribution is " +
      "canonical-complete; the canonical-paperwork is canonical-clean.",
    mass: 3.0,
    volume: 1.0,
    perishable: false,
    contraband: false,
    attribution: {
      originatorKey: "adjudicator_locke",
      originatorRole: "broker",
      signatories: [
        "adjudicator_locke",
        "authority.archive.canonical_log",
      ],
      recordReference: "authority.archive.locke.ledger.v-current",
      attributionStanceCanon: "complete",
    },
    brokerOrigin: "broker_locke",
    rewardFactor: 1.1,
  },
};

// --- Helper functions --------------------------------------------------

/**
 * Look up a canonical-CargoItem by canonicalId. Returns undefined if
 * the canonicalId is canonical-not-registered.
 */
export function getCargoItem(cargoId: string): CargoItem | undefined {
  return CARGO_REGISTRY[cargoId];
}

/**
 * Filter canonical-cargo-items by canonical-category.
 */
export function getCargoByCategory(
  category: CargoCategory,
): ReadonlyArray<CargoItem> {
  return Object.values(CARGO_REGISTRY).filter(
    (c) => c.category === category,
  );
}

/**
 * Filter canonical-cargo-items by canonical-broker-origin.
 */
export function getCargoByBroker(
  brokerKey: BrokerKey,
): ReadonlyArray<CargoItem> {
  return Object.values(CARGO_REGISTRY).filter(
    (c) => c.brokerOrigin === brokerKey,
  );
}

/**
 * Canonical-contraband check per canonical-faction-jurisdiction.
 * Returns true if the canonical-cargo is canonical-contraband in the
 * canonical-faction's canonical-jurisdiction. Falls back to the
 * canonical-default contraband boolean if no per-faction override
 * exists.
 */
export function isCargoContrabandInFaction(
  cargo: CargoItem,
  factionKey: string,
): boolean {
  const override = cargo.contrabandPerFaction?.[factionKey];
  if (override !== undefined) return override;
  return cargo.contraband;
}

/**
 * Canonical-shelf-life remaining check. Returns the canonical-fraction
 * of canonical-shelf-life remaining (0.0 = canonical-spoiled, 1.0 =
 * canonical-fresh). Returns 1.0 for non-perishable cargo.
 */
export function cargoShelfLifeRemaining(
  cargo: CargoItem,
  hoursElapsedSinceLoaded: number,
): number {
  if (!cargo.perishable || !cargo.shelfLifeHours) return 1.0;
  const remaining = 1.0 - hoursElapsedSinceLoaded / cargo.shelfLifeHours;
  return Math.max(0.0, Math.min(1.0, remaining));
}

/**
 * Canonical-attribution-completeness check. Returns true if the
 * canonical-attribution is canonical-complete (canonical-Antiquarian-
 * audit-ready). Returns false for canonical-partial or canonical-
 * deliberately-blank attribution.
 */
export function isAttributionCanonicallyComplete(cargo: CargoItem): boolean {
  return cargo.attribution.attributionStanceCanon === "complete";
}

/**
 * All canonical-cargo-categories canonically-shipping in the
 * canonical-CARGO_REGISTRY.
 */
export const ALL_CARGO_CATEGORIES: ReadonlyArray<CargoCategory> = [
  "clone_body",
  "signature_archive",
  "prize_body",
  "tcg_cards",
  "research_data",
  "civic_supplies",
  "rare_minerals",
  "data_cores",
  "quantum_relics",
  "refugees",
  "bookkeeping_records",
];
