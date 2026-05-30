// apps/shared/npc-decks/adjudicator_locke.ts
//
// Adjudicator Locke — New Babylon Special Case Manager.
//
// Composition rationale (per apps/shared/npcs/bibles/adjudicator_locke.md):
//   - General: gen_new_babylon. Locke IS the institutional form of
//     New Babylon's survival; her deck IS the syndicate machinery.
//   - coreMemories (33): every authority/enforcer/magistrate that
//     represents her broader operating apparatus — the bench
//     behind the bench. Locke runs more than one room.
//   - inheritedFragments (3): the deals that left a price.
//     The Authority itself (her org chart), the Detective (her
//     pre-Locke identity per bible §2.1), and a Potential whose
//     contract she filed and never closed.
//   - advantageCards (3): three secret-weapon cards. Each is the
//     instrument she fields when the player hasn't yet named the
//     frame she's operating in.
//   - challengeMotive (3): what Locke wants to commission from the
//     player's collection.
//   - perspectiveAspects (3): price_naming / deniable_authority /
//     eyepatch_unmaking. The third touches the bible's protected
//     mystery (the deal that cost her the eye) — Locke does not
//     answer it; the player NAMING the unmaking is the perspective,
//     not Locke explaining it.

import type { NpcDeck } from "./_template";

export const ADJUDICATOR_LOCKE_DECK: NpcDeck = {
  npcKey: "adjudicator_locke",
  general: "gen_new_babylon",
  coreMemories: [
    "s1_char_001", // Adjudicator Locke (herself)
    "s1_char_001",
    "s1_char_001",
    "s1_char_020", // The Authority
    "s1_char_020",
    "s1_char_078", // Governor Thane
    "s1_char_078",
    "s1_char_079", // Citadel Guardian
    "s1_char_080", // District Enforcer
    "s1_char_081", // Tribunal Magistrate
    "s1_char_081",
    "s1_char_083", // Propaganda Herald
    "s1_char_084", // Iron Decree
    "s1_char_084",
    "s1_char_085", // Sector Warden
    "s1_char_117", // Senator Voss
    "s1_char_117",
    "s1_char_118", // Trade Enforcer
    "s1_char_118",
    "s1_char_119", // Syndicate Broker
    "s1_char_120", // Crystal Archive Guard
    "s1_curve_005", // Compliance Watcher
    "s1_curve_005",
    "s1_curve_010", // Sector Magistrate
    "s1_curve_010",
    "s1_pack_029", // Hostile Takeover
    "s1_pack_030", // Syndicate Enforcer
    "s1_pack_031", // Crystal Senator
    "s1_pack_032", // Market Crash
    "s1_pack_033", // Debt Collector
    "s1_pack_034", // Locke's Inner Circle (canonical)
    "s1_pack_035", // Trade Embargo
    "s1_blast_005", // Audit Artillery
  ],
  inheritedFragments: [
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_024", // The Detective
      flavorOverride:
        "The identity she retired into Locke. The file remains open in her ledger as a closed account.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_066", // Fenra the Moon Tyrant
      flavorOverride:
        "A contract Locke routed and did not close personally. The Authority remembers who brokered the routing.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_082", // Spire Assassin
      flavorOverride:
        "A contractor whose handshake Locke notarised before the contractor became permanent inventory.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_pack_034", // Locke's Inner Circle (gated —
      // the canonical inner-circle card; she fields it when the
      // player hasn't yet named her pricing frame)
      gatedByAspect: "adjudicator_locke:price_naming",
      replacement: "s1_pack_033", // Debt Collector (revealed —
      // smaller, more transactional)
    },
    {
      cardDefId: "s1_char_020", // The Authority (gated — she
      // fields the institutional apparatus when the player
      // hasn't yet named her deniability)
      gatedByAspect: "adjudicator_locke:deniable_authority",
      replacement: "s1_char_119", // Syndicate Broker (revealed —
      // mid-level operative, deniability stripped)
    },
    {
      cardDefId: "s1_char_066", // Fenra the Moon Tyrant (gated —
      // the eyepatch-monument; Locke fields the contract that
      // cost the eye when the player hasn't named it yet)
      gatedByAspect: "adjudicator_locke:eyepatch_unmaking",
      replacement: "s1_curve_010", // Sector Magistrate (revealed —
      // procedural workmanlike; the price-without-the-monument)
    },
  ],
  challengeMotive: [
    "s1_char_001", // Locke (the mirror)
    "s1_char_024", // The Detective (her own retired identity)
    "s1_pack_034", // Locke's Inner Circle (the apparatus)
  ],
  perspectiveAspects: [
    {
      id: "adjudicator_locke:price_naming",
      label: "Whose price she's actually naming",
    },
    {
      id: "adjudicator_locke:deniable_authority",
      label: "How deniability becomes power",
    },
    {
      id: "adjudicator_locke:eyepatch_unmaking",
      label: "What the eyepatch was the receipt for",
    },
  ],
  // Locke notes prior contracts. Every NPC you've defeated raises
  // the price; the Authority responds by fielding heavier inventory.
  // Thresholds are 1 / 3 / 5 — small, medium, full-roster respect.
  crossMemoryUpgrades: [
    {
      weakerCardDefId: "s1_curve_005", // Compliance Watcher
      strongerCardDefId: "s1_char_081", // Tribunal Magistrate
      threshold: 1,
    },
    {
      weakerCardDefId: "s1_curve_010", // Sector Magistrate
      strongerCardDefId: "s1_pack_034", // Locke's Inner Circle
      threshold: 3,
    },
    {
      weakerCardDefId: "s1_pack_033", // Debt Collector
      strongerCardDefId: "s1_char_066", // Fenra the Moon Tyrant
      threshold: 5,
    },
  ],
};
