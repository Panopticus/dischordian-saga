// apps/shared/npc-decks/akai_shi.ts
//
// Akai Shi / The Red Death — New Babylon-faction NPC deck.
//
// Composition rationale (per apps/shared/npcs/bibles/akai_shi.md):
//   - General: gen_new_babylon. Akai Shi's card sits in the new
//     Babylon faction (s1_char_003 — Stealth, Pierce). The faction
//     fits her time-eliminator operational frame post-resurrection.
//   - coreMemories (33): New Babylon roster — assassins, enforcers,
//     authority cards — that mechanically express the Red Death's
//     surgical post-resurrection register. The Spire Assassin / Iron
//     Decree backbone reads as her time-displaced operating geometry.
//   - inheritedFragments (3): canon-implied prior kills. The
//     Necromancer she ended (canonical kill inside the Matrix of
//     Dreams, bible §2.4), the Wolf / Lycos arc-cousin's parallel
//     consumption, and a Potential whose dissolution she could not
//     prevent before her own.
//   - advantageCards (3): three secret-weapon cards. Learning each
//     aspect reveals what's underneath the Red Death's operational
//     mask.
//   - challengeMotive (3): what the Red Death wants from the
//     player's collection.
//   - perspectiveAspects (3): tense_drift / matrix_killing /
//     mercy_killing. Each maps to a §1 cadence rule or §2 history
//     beat.

import type { NpcDeck } from "./_template";

export const AKAI_SHI_DECK: NpcDeck = {
  npcKey: "akai_shi",
  general: "gen_new_babylon",
  coreMemories: [
    // Akai Shi's own card x3 — Stealth, Pierce, the Red Death.
    "s1_char_003",
    "s1_char_003",
    "s1_char_003",
    // New Babylon authority structure — her operational frame.
    "s1_char_001", // Adjudicator Locke
    "s1_char_020", // The Authority
    "s1_char_078", // Governor Thane
    "s1_char_079", // Citadel Guardian
    "s1_char_079",
    "s1_char_080", // District Enforcer
    "s1_char_080",
    "s1_char_081", // Tribunal Magistrate
    "s1_char_082", // Spire Assassin (the canonical assassin card)
    "s1_char_082",
    "s1_char_082",
    "s1_char_083", // Propaganda Herald
    "s1_char_084", // Iron Decree
    "s1_char_084",
    "s1_char_085", // Sector Warden
    "s1_char_085",
    "s1_char_117", // Senator Voss
    "s1_char_118", // Trade Enforcer
    "s1_char_119", // Syndicate Broker
    "s1_char_120", // Crystal Archive Guard
    // Curve filler.
    "s1_curve_005", // Compliance Watcher
    "s1_curve_005",
    "s1_curve_010", // Sector Magistrate
    "s1_curve_010",
    // Spells / packs — the surgical instruments.
    "s1_pack_029", // Hostile Takeover
    "s1_pack_030", // Syndicate Enforcer
    "s1_pack_032", // Market Crash
    "s1_pack_034", // Locke's Inner Circle
    "s1_pack_035", // Trade Embargo
    "s1_blast_005", // Audit Artillery
  ],
  inheritedFragments: [
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_047", // The Shadow Tongue
      flavorOverride:
        "A Necromancer-adjacent canon she ended inside the Matrix of Dreams. She does not boast the kill. She files it.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_017", // The Advocate
      flavorOverride:
        "Pre-Fall ally. The Advocate's reality-reshaping work and Akai Shi's healing work were canonically complementary. She kept the trace.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_045", // The Resurrectionist
      flavorOverride:
        "The protocol-class she was resurrected through. She does not name the mechanism; she carries the trace.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_char_066", // Fenra the Moon Tyrant — the
      // tense-displaced operator card; Red Death fields it when
      // the player hasn't yet noticed her tenses drift
      gatedByAspect: "akai_shi:tense_drift",
      replacement: "s1_curve_010", // Sector Magistrate (revealed —
      // a single-tense operative, no time-displacement)
    },
    {
      cardDefId: "s1_pack_seed_fighter", // The Red Death itself (the
      // imprint card) — her signature surgical move when the player
      // hasn't yet asked about the Matrix kill
      gatedByAspect: "akai_shi:matrix_killing",
      replacement: "s1_char_082", // Spire Assassin (revealed —
      // workmanlike kill instead of cosmic-class kill)
    },
    {
      cardDefId: "s1_pack_031", // Crystal Senator — the dissolution
      // canon; she fields a piece of the pre-resurrection
      // Virus-consumption when the player hasn't yet named the
      // mercy-killing arc
      gatedByAspect: "akai_shi:mercy_killing",
      replacement: "s1_curve_005", // Compliance Watcher (revealed —
      // present-tense workmanlike instead of past-tense wound)
    },
  ],
  challengeMotive: [
    // What the Red Death wants from the player.
    "s1_char_003", // Akai Shi (the mirror)
    "s1_char_047", // The Shadow Tongue (the Necromancer-adjacent
    // canon she ended)
    "s1_char_045", // The Resurrectionist (the protocol her body
    // was rebuilt through)
  ],
  perspectiveAspects: [
    {
      id: "akai_shi:tense_drift",
      label: "Why her tenses move mid-sentence",
    },
    {
      id: "akai_shi:matrix_killing",
      label: "What she ended inside the Matrix of Dreams",
    },
    {
      id: "akai_shi:mercy_killing",
      label: "Whose mercy made the resurrection possible",
    },
  ],
};
