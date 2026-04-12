/* ═══════════════════════════════════════════════════════
   CLASS TRADE ACCESS

   Maps each of the five Potential classes to:
     • Their exclusive Trade Empire sectors
     • Their exclusive mission chain stubs (spec §5.1)
     • Their exclusive mechanics (Oracle futures, Spy covers)

   Mission defs here are metadata-only — the full chapter dialog
   lives in apps/shared/questlineClass*.ts (Batch E).
   ═══════════════════════════════════════════════════════ */

import type { CharClass, Species } from "./characterCreationImpact";

/** Sectors each class is allowed to enter. */
export const CLASS_SECTOR_ACCESS: Record<CharClass, string[]> = {
  engineer: [
    "research_corridor_alpha",
    "research_corridor_beta",
    "research_corridor_gamma",
  ],
  oracle: ["probability_market_hub"],
  assassin: ["syndicate_route_prime"],
  soldier: ["command_post_iron"],
  spy: ["intelligence_exchange_nightline"],
};

/** A lightweight mission definition — richer dialog lives in Batch E. */
export interface ClassMissionDef {
  id: string;
  class: CharClass;
  title: string;
  loreHook: string;
  targetSectorId: string;
  /** Flag that unlocks this mission. */
  unlockFlag?: string;
  /** Flag set on completion. */
  completionFlag: string;
  /** Ripple contribution source this mission awards on completion. */
  unityContribution?: string;
}

export const CLASS_EXCLUSIVE_MISSIONS: Record<CharClass, ClassMissionDef[]> = {
  engineer: [
    {
      id: "mission_engineer_shared_lab",
      class: "engineer",
      title: "The Shared Lab",
      loreHook:
        "Dr. Loth and Theorist Praxis-4 have been arguing productively for nineteen years. They need a neutral Engineer to deliver the corrected protocol 7 water-resonance frequency the Engineer left behind.",
      targetSectorId: "research_corridor_alpha",
      completionFlag: "engineer_shared_lab_complete",
      unityContribution: "questline_cross_faction_research",
    },
    {
      id: "mission_engineer_dischordia_deck_forging",
      class: "engineer",
      title: "Forging the Next Deck",
      loreHook:
        "The master schematic for the Dischordian Deck's neural lattice lives only in the Engineer's private folder. The bench will teach you how to improve it.",
      targetSectorId: "research_corridor_beta",
      unlockFlag: "engineer_shared_lab_complete",
      completionFlag: "engineer_deck_forging_complete",
    },
  ],
  oracle: [
    {
      id: "mission_oracle_antiquarian_invitation",
      class: "oracle",
      title: "The Antiquarian Wants to Talk",
      loreHook:
        "The Antiquarian has been watching every Oracle for five Ages. He has an offer he has never extended before: historical records of what other Oracles chose, and what it cost them.",
      targetSectorId: "black_hole_gate",
      completionFlag: "oracle_antiquarian_met",
    },
    {
      id: "mission_oracle_loaded_dice",
      class: "oracle",
      title: "Loaded Dice",
      loreHook:
        "The Probability Accord's trading division has identified you as a probability-critical influencer. They want to hire you as a futures consultant. The mission is whether working for them is cooperation or co-option.",
      targetSectorId: "probability_market_hub",
      completionFlag: "oracle_loaded_dice_complete",
      unityContribution: "questline_mediation",
    },
  ],
  assassin: [
    {
      id: "mission_assassin_eyes_network",
      class: "assassin",
      title: "The Eyes' Network Contacts You",
      loreHook:
        "The reconstructed Eyes' Network has identified you as Series 7-Omicron — the conscience variant. They want a new center. They want it to be you.",
      targetSectorId: "syndicate_route_prime",
      completionFlag: "assassin_eyes_network_contacted",
    },
    {
      id: "mission_assassin_syndicate_catalogue",
      class: "assassin",
      title: "What the Syndicate Collects",
      loreHook:
        "The Syndicate of Death has been cataloguing the Collector's original Garden specimens. Not to harm them — to protect them from factions who would exploit them.",
      targetSectorId: "syndicate_route_prime",
      unlockFlag: "assassin_eyes_network_contacted",
      completionFlag: "assassin_syndicate_catalogue_complete",
    },
  ],
  soldier: [
    {
      id: "mission_soldier_iron_lion_broadcast",
      class: "soldier",
      title: "Iron Lion's Broadcast",
      loreHook:
        "A seventeen-thousand-year-old broadcast, soldier to soldier. It reached you first on your channel. Iron Lion knew there would be more soldiers after him.",
      targetSectorId: "command_post_iron",
      completionFlag: "soldier_iron_lion_broadcast_heard",
    },
    {
      id: "mission_soldier_generals_dilemma",
      class: "soldier",
      title: "The General's Dilemma",
      loreHook:
        "Commander Seris-Fen and General Axis-9 have been running secret joint operations. You have discovered it. Expose it and destabilize both factions, or protect it and let the fragile cooperation continue.",
      targetSectorId: "command_post_iron",
      unlockFlag: "soldier_iron_lion_broadcast_heard",
      completionFlag: "soldier_generals_dilemma_resolved",
      unityContribution: "questline_third_path",
    },
  ],
  spy: [
    {
      id: "mission_spy_locke_preempt",
      class: "spy",
      title: "What Locke Knows",
      loreHook:
        "Adjudicator Locke recognized your lineage before you said a word. She wants to trade — your secret for hers. Eleven thousand years of Surveillance Coordinator Senne, behind one eye patch.",
      targetSectorId: "new_babylon_core",
      completionFlag: "spy_locke_preempt_complete",
    },
    {
      id: "mission_spy_eyes_drop_points",
      class: "spy",
      title: "The Eyes' Drop Points",
      loreHook:
        "The recovered Eyes' Network contains intelligence The Eyes gathered before her death. Some of it implicates factions that currently don't know she had it.",
      targetSectorId: "intelligence_exchange_nightline",
      unlockFlag: "spy_locke_preempt_complete",
      completionFlag: "spy_eyes_drop_points_recovered",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   ORACLE FUTURES — 3 cycles ahead
   ═══════════════════════════════════════════════════════ */

export type FuturesCommodity = "credits" | "materials" | "influence" | "intelligence";

export interface FuturesContract {
  sectorId: string;
  commodity: FuturesCommodity;
  /** 1-3 trade cycles ahead; bounded by PROBABILITY_FUTURES_WINDOW. */
  cyclesAhead: 1 | 2 | 3;
  /** Projected price in credits at contract settlement. */
  projectedPrice: number;
  /** Strike price — what the Oracle pays now. */
  strikePrice: number;
}

/* ═══════════════════════════════════════════════════════
   SPY COVER IDENTITIES
   ═══════════════════════════════════════════════════════ */

export interface CoverIdentity {
  id: string;
  name: string;
  disguiseAsSpecies: Species;
  /** Hours the cover remains active before automatic decay. */
  durationHours: number;
  /** 0-100 — higher = harder to blow */
  durability: number;
  /** Difficulty of the detection check when the Spy interacts with a faction NPC. */
  detectionCheckDifficulty: number;
  /** Short flavor string shown when the cover activates. */
  activationFlavor: string;
}

export const SPY_COVER_IDENTITIES: CoverIdentity[] = [
  {
    id: "cover_demagi_earth_broker",
    name: "Earth-Broker (DeMagi)",
    disguiseAsSpecies: "demagi",
    durationHours: 48,
    durability: 70,
    detectionCheckDifficulty: 12,
    activationFlavor:
      "You carry a soil-sampler kit and respond to 'Earth-speaker' like it's a second name. Assembly protocols accept you as a minor field broker.",
  },
  {
    id: "cover_quarchon_probability_courier",
    name: "Probability Courier (Quarchon)",
    disguiseAsSpecies: "quarchon",
    durationHours: 48,
    durability: 65,
    detectionCheckDifficulty: 14,
    activationFlavor:
      "Your comms now emit a distributed probability signature. Accord protocols accept you as a junior courier. Do not accept offers to 'rejoin the mesh.'",
  },
  {
    id: "cover_neyon_bridge_observer",
    name: "Bridge Observer (Ne-Yon)",
    disguiseAsSpecies: "neyon",
    durationHours: 72,
    durability: 85,
    detectionCheckDifficulty: 10,
    activationFlavor:
      "You are bridged. Both species grant you tolerance but not trust. This is the safest cover and the loneliest.",
  },
];

/** Convenience lookup: can a CharClass access sector `id`? */
export function classCanEnterSector(
  characterClass: CharClass | undefined,
  sectorId: string,
  extraFlags: Record<string, boolean> = {},
  // Re-exported sector list avoids a circular import.
  sectors: { id: string; accessRequirement?: { class?: string | string[]; species?: string | string[]; flag?: string } }[],
): boolean {
  const sector = sectors.find((s) => s.id === sectorId);
  if (!sector) return false;
  const req = sector.accessRequirement;
  if (!req) return true;
  if (req.flag && !extraFlags[req.flag]) return false;
  if (req.class) {
    const allowed = Array.isArray(req.class) ? req.class : [req.class];
    if (!characterClass || !allowed.includes(characterClass)) return false;
  }
  return true;
}
