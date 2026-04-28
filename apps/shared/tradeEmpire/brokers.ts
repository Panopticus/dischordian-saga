// apps/shared/tradeEmpire/brokers.ts
//
// Brokers — typed counterparty NPCs in the Trade Empire system.
// Per the priority plan §Stage 1+ Phase 2: extends Trade Empire from
// "5-trigger-surface, NPC-stub-heavy" into the canonical vehicle that
// brings every priority-roster character out.
//
// Currently shipped Trade Empire missions reference broker NPCs only
// through the loose `offeredBy` text field. Brokers entity type wraps
// that into a typed counterparty that:
//   - links to the unified NPC registry (apps/shared/npcs/registry.ts)
//   - declares signature presence (sector + room)
//   - declares which missions / contracts the broker offers
//   - declares engagement personality (hidden-clauses, fine-print, etc.)

import type { NpcKey } from "../npcs/types";

/**
 * Canonical broker keys. Phase 2 ships 6 brokers (one per major
 * priority-roster integration point); Phase 3 may extend with secondary
 * brokers per character bible §5 mechanical hooks.
 */
export type BrokerKey =
  | "broker_locke"                  // Adjudicator Locke — New Babylon contractual broker
  | "broker_nilmorg_severance"      // Nilmorg — DMC Severance Prize / clone-economy broker
  | "broker_degen_casino"           // The Degen — Antiquarian-aligned casino data-source broker
  | "broker_antiquarian_archive"    // Daniel Cross / The Antiquarian — Archive research broker
  | "broker_independent_freeport"   // Independent traders — generic freeport broker (faction-neutral)
  | "broker_thaloria_quietwork";    // Hierophant-adjacent — Thaloria sector "quiet missions" broker

/**
 * Broker engagement style. Drives the dialog-trigger surface (per the
 * priority plan §Phase 2 contract-signing scenes) and the way hidden
 * clauses surface during contract negotiation.
 */
export type BrokerEngagementStyle =
  /** Locke canon: every contract has fine-print; player can audit on signing. */
  | "fine_print"
  /** Nilmorg canon: institutional precision; "don't thank me" canonical refusal; closed accounts post-delivery. */
  | "institutional"
  /** Degen canon: casino-aleatory; missions calibrated by player's recent gambling pattern. */
  | "aleatory"
  /** Antiquarian canon: "desks do not run"; attribution canonical; bibliographic precision. */
  | "bibliographic"
  /** Independent canon: faction-neutral; barter; no hidden clauses; minimal personality. */
  | "barter"
  /** Hierophant canon: quiet missions; combat negative-trust; avoidance positive-trust; ceremony-aware. */
  | "ceremony_aware";

/**
 * Where a broker physically operates within the Trade Empire UI.
 * Bibles establish primary rooms; brokers extend that with sector
 * presence so players can canonically encounter them in-world.
 */
export interface BrokerPresence {
  /** Primary sector id (per tradeEmpire.ts GALACTIC_MAP). */
  sectorId: string;
  /** Optional sub-room id (per ship-rooms / sector-rooms). */
  roomId?: string;
  /** First-visit cinematic id (sector_first_entered ripple handler). */
  arrivalCinematicId?: string;
}

/**
 * A typed counterparty NPC offering missions / contracts in Trade Empire.
 */
export interface BrokerDef {
  brokerKey: BrokerKey;
  /** Human-readable label rendered in mission UIs. */
  name: string;
  /** Linked priority-roster NPC (drives voice / trust / dialog). */
  npcKey: NpcKey;
  /** Faction the broker is canonically aligned with (or "independent"). */
  factionId: string;
  /** Engagement style — drives dialog-trigger surfaces. */
  engagementStyle: BrokerEngagementStyle;
  /** Where the broker operates. */
  presence: BrokerPresence;
  /** Mission ids this broker offers (subset of STARTER_MISSIONS or class-exclusive). */
  offersMissions: ReadonlyArray<string>;
  /** Multi-stage contract template ids (Phase 2 contracts.ts). */
  offersContracts?: ReadonlyArray<string>;
  /**
   * Canonical refusal shape — brokers who decline gratitude / recognition
   * (Nilmorg's "don't thank me"; Locke's professional distance; etc.).
   * Signals to dialog renderers which refusal-line to surface.
   */
  refusalShape?: "decline_gratitude" | "professional_distance" | "ceremony_required";
  /** Optional canonical first-meeting flag (set on first engagement). */
  firstMeetingFlag?: string;
  /** Optional metadata (free-form bible-asserted fields). */
  metadata?: Readonly<Record<string, string>>;
}

// --- Canonical broker registry --------------------------------------------

export const BROKER_REGISTRY: Readonly<Record<BrokerKey, BrokerDef>> = {
  broker_locke: {
    brokerKey: "broker_locke",
    name: "Adjudicator Locke",
    npcKey: "adjudicator_locke",
    factionId: "new_babylon",
    engagementStyle: "fine_print",
    presence: {
      sectorId: "trade_nexus",
      roomId: "authoritys_ledger",
      arrivalCinematicId: "trade_nexus.first_visit.welcome_to_the_authoritys_ledger",
    },
    offersMissions: ["locke_trade_proposal", "vox_corridor"],
    offersContracts: [
      "locke.retainer_baseline",
      "locke.exclusive_dealings",
      "locke.audit_clause",
    ],
    refusalShape: "professional_distance",
    firstMeetingFlag: "broker_locke_first_meeting",
    metadata: {
      hiddenClausesCanon:
        "every contract has fine print; player can audit on signing per Locke bible §1.4",
      keepsake: "Trade Coin (Partner-band unlock)",
    },
  },

  broker_nilmorg_severance: {
    brokerKey: "broker_nilmorg_severance",
    name: "Nilmorg, SVP Kinetic Acquisition",
    npcKey: "nilmorg",
    factionId: "hierarchy",
    engagementStyle: "institutional",
    presence: {
      sectorId: "the_trench",
      roomId: "nilmorgs_platform",
      arrivalCinematicId: "trench.first_visit.bones_are_fresh",
    },
    offersMissions: [],
    offersContracts: [
      "severance.clone_body_contract",
      "severance.signature_archive_contract",
      "severance.prize_body_contract",
    ],
    refusalShape: "decline_gratitude",
    firstMeetingFlag: "broker_nilmorg_first_meeting",
    metadata: {
      bridge: "DMC ↔ Trade Empire (per OCB severance_prize_paid event)",
      canonicalRefusal: "Don't thank me.",
      seasonalGate: "requires Severance Prize claimed for current season",
    },
  },

  broker_degen_casino: {
    brokerKey: "broker_degen_casino",
    name: "The Degen",
    npcKey: "the_degen",
    factionId: "antiquarian",
    engagementStyle: "aleatory",
    presence: {
      sectorId: "degens_casino",
      roomId: "casino_floor",
      arrivalCinematicId: "casino.first_visit.your_recent_play_suggests",
    },
    offersMissions: [],
    offersContracts: [
      "degen.gambling_retainer",
      "degen.pattern_bet",
      "degen.casino_debt",
    ],
    refusalShape: "professional_distance",
    firstMeetingFlag: "broker_degen_first_meeting",
    metadata: {
      missionCalibration: "weighted by recent casino-play pattern",
      neYonDomain: "gambling",
    },
  },

  broker_antiquarian_archive: {
    brokerKey: "broker_antiquarian_archive",
    name: "Daniel Cross / The Antiquarian",
    npcKey: "the_seer",
    factionId: "antiquarian",
    engagementStyle: "bibliographic",
    presence: {
      sectorId: "antiquarian_archive",
      roomId: "shelves",
      arrivalCinematicId: "archive.first_visit.desks_do_not_run",
    },
    offersMissions: ["antiquarian_invitation"],
    offersContracts: [
      "antiquarian.provenance_run",
      "antiquarian.archive_recovery",
      "antiquarian.attribution_audit",
      // Oracle futures sub-family — class-locked at router via purchaseFutures.
      "antiquarian.futures_call",
      "antiquarian.futures_put",
      "antiquarian.futures_spread",
    ],
    refusalShape: "ceremony_required",
    firstMeetingFlag: "broker_antiquarian_first_meeting",
    metadata: {
      canon: "desks do not run (loreAchievements.ts:410-415)",
      attributionCanon: "bibliographic precision; attribution is canonical metadata",
      shelfCanon:
        "Programmer's-shelf categorisation per Seer bible §4.6; player who reaches Witnessed band is canonically a shelf-mate",
    },
  },

  broker_independent_freeport: {
    brokerKey: "broker_independent_freeport",
    name: "Free Ports Coalition",
    npcKey: "the_human", // Placeholder — Free Port traders don't have a roster slot; routes through Human as substrate-detective
    factionId: "independent",
    engagementStyle: "barter",
    presence: {
      sectorId: "free_port_alpha",
      roomId: "trader_market",
    },
    offersMissions: ["salvage_debris", "contact_free_ports"],
    offersContracts: [
      "independent.bulk_haul",
      "independent.split_share",
      "independent.rare_mineral_run",
    ],
    metadata: {
      note: "Faction-neutral barter; minimal personality; no hidden clauses",
    },
  },

  broker_thaloria_quietwork: {
    brokerKey: "broker_thaloria_quietwork",
    name: "Thaloria Council of Harmony (intermediary)",
    npcKey: "wraith_calder",
    factionId: "thaloria",
    engagementStyle: "ceremony_aware",
    presence: {
      sectorId: "thaloria",
      roomId: "council_antechamber",
      arrivalCinematicId: "thaloria.first_visit.quiet_work_is_canonical",
    },
    offersMissions: [],
    offersContracts: [
      "thaloria.name_recovery",
      "thaloria.archive_retrieval",
      "thaloria.diplomatic_facilitation",
    ],
    refusalShape: "ceremony_required",
    firstMeetingFlag: "broker_thaloria_first_meeting",
    metadata: {
      missionStyle: "canonically quiet (diplomacy / archive / name-recovery)",
      combatRule: "combat-positive missions = negative Hierophant trust",
      avoidanceRule: "non-combat completion = +2 Hierophant trust",
      gateCondition: "post-rite (post_arena revealStage); pre-rite cannot engage",
    },
  },
} as const;

// --- Helpers --------------------------------------------------------------

/** All registered broker keys. */
export function allBrokerKeys(): ReadonlyArray<BrokerKey> {
  return Object.keys(BROKER_REGISTRY) as BrokerKey[];
}

/** Resolve broker by their linked NpcKey (one broker per NPC convention). */
export function brokerForNpc(npcKey: NpcKey): BrokerDef | undefined {
  return Object.values(BROKER_REGISTRY).find(b => b.npcKey === npcKey);
}

/** Resolve brokers operating in a given sector. */
export function brokersInSector(sectorId: string): ReadonlyArray<BrokerDef> {
  return Object.values(BROKER_REGISTRY).filter(b => b.presence.sectorId === sectorId);
}

/** Validate a broker key string. */
export function isKnownBrokerKey(key: string): key is BrokerKey {
  return key in BROKER_REGISTRY;
}
