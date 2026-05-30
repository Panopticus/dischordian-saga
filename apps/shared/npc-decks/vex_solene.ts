// apps/shared/npc-decks/vex_solene.ts
//
// Vex Solène — Eyes of Reality / Maestro of the Coda.
//
// Composition rationale (per apps/shared/npcs/bibles/vex_solene.md):
//   - General: gen_new_babylon. Vex publicly fronts as a New
//     Babylon-aligned contract operative (the Hitman face from §3.1).
//     The faction frames the deck's syndicate / contract aesthetic;
//     her Maestro role bleeds through the inherited fragments.
//   - coreMemories (33): New Babylon contract operatives, magistrates,
//     enforcers — the public commercial layer of her work. Spire
//     Assassin / Debt Collector / Syndicate Enforcer carry the
//     hitman aesthetic; the lockesInnerCircle pack is a thematic
//     echo of her Coda inner-circle structure.
//   - inheritedFragments (3): the canon-implied Coda commissions.
//     Engineer (the Second Chair pattern source), Antiquarian (the
//     Epoch 2 contract she did not take), and a Potential filed
//     out of her ledger.
//   - advantageCards (3): three secret-weapon cards. Each gated by
//     one of the perspective aspects — when you don't yet know
//     Vex's frame, she fields the contract-precise option; once
//     you've seen what's underneath, the deck reveals a less
//     surgical alternative.
//   - challengeMotive (3): what the Eyes of Reality wants from
//     the player's collection.
//   - perspectiveAspects (3): counted_audience (knows-how-many-
//     rooms), inherited_mission (the Engineer's card without his
//     memories), diplomat_underneath (hitman face / diplomat
//     behind).

import type { NpcDeck } from "./_template";

export const VEX_SOLENE_DECK: NpcDeck = {
  npcKey: "vex_solene",
  general: "gen_new_babylon",
  coreMemories: [
    // Vex's own card x3 — the Taskmaster register; commissioner of
    // contracts.
    "s1_char_061",
    "s1_char_061",
    "s1_char_061",
    // New Babylon authority architecture — the rooms she counts.
    "s1_char_001", // Adjudicator Locke
    "s1_char_020", // The Authority
    "s1_char_078", // Governor Thane
    "s1_char_078",
    "s1_char_079", // Citadel Guardian
    "s1_char_079",
    "s1_char_080", // District Enforcer
    "s1_char_080",
    "s1_char_081", // Tribunal Magistrate
    "s1_char_082", // Spire Assassin (the canonical hitman card)
    "s1_char_082",
    "s1_char_082",
    "s1_char_083", // Propaganda Herald
    "s1_char_084", // Iron Decree
    "s1_char_085", // Sector Warden
    "s1_char_117", // Senator Voss
    "s1_char_118", // Trade Enforcer
    "s1_char_118",
    "s1_char_119", // Syndicate Broker
    // Curve filler — magistrates + watchers.
    "s1_curve_005", // Compliance Watcher
    "s1_curve_005",
    "s1_curve_010", // Sector Magistrate
    "s1_curve_010",
    // Spells / packs — contract instruments.
    "s1_pack_029", // Hostile Takeover
    "s1_pack_030", // Syndicate Enforcer
    "s1_pack_032", // Market Crash
    "s1_pack_033", // Debt Collector
    "s1_pack_034", // Locke's Inner Circle (echoes Coda structure)
    "s1_pack_035", // Trade Embargo
    "s1_blast_005", // Audit Artillery
  ],
  inheritedFragments: [
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_026", // The Engineer
      flavorOverride:
        "His pattern, modeled. Not a memory of him — the closest a Coda chair will ever sit to the man it was built from.",
    },
    {
      fromNpcId: "the_antiquarian",
      cardDefId: "s1_char_018", // The Antiquarian
      flavorOverride:
        "A contract she declined in Epoch 2. The Coda's ledger still has the offer marked open.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_002", // Agent Zero
      flavorOverride:
        "The callsign she accepted from the Insurgency. The body that wore it before her does not have a file. She kept the card.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_char_066", // Fenra the Moon Tyrant
      // — surveillance-state power play; the Maestro who
      // canonically knows-how-many-rooms holds this as her
      // secret weapon
      gatedByAspect: "vex_solene:counted_audience",
      replacement: "s1_char_117", // Senator Voss (revealed — once
      // you've named the counted-audience frame, she opens with a
      // less surgical contractor)
    },
    {
      cardDefId: "s1_char_120", // Crystal Archive Guard
      // — the Engineer's intellect carried-without-his-memories
      // canon, the deepest cut she can field
      gatedByAspect: "vex_solene:inherited_mission",
      replacement: "s1_curve_010", // Sector Magistrate (revealed —
      // once the player names what she has and doesn't have, she
      // stops drawing on the inherited tools)
    },
    {
      cardDefId: "s1_pack_seed_fighter", // Akai Shi, the Red Death
      // — diplomat by cadence, hitman by commission; this is the
      // contract she runs when the player thinks she's just the
      // hitman
      gatedByAspect: "vex_solene:diplomat_underneath",
      replacement: "s1_curve_005", // Compliance Watcher (revealed —
      // workmanlike instead of decisive)
    },
  ],
  challengeMotive: [
    // What the Eyes of Reality wants from the player.
    "s1_char_026", // The Engineer (the man she models the Second
    // Chair on)
    "s1_char_002", // Agent Zero (the callsign she inherited)
    "s1_char_061", // Vex herself (the mirror)
  ],
  perspectiveAspects: [
    {
      id: "vex_solene:counted_audience",
      label: "How many rooms she's actually counting",
    },
    {
      id: "vex_solene:inherited_mission",
      label: "Whose mission she carries without his memories",
    },
    {
      id: "vex_solene:diplomat_underneath",
      label: "What's underneath the Hitman face",
    },
  ],
};
