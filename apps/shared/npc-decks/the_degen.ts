// apps/shared/npc-decks/the_degen.ts
//
// The Degen — pilot NPC deck for the dialog → duel → harvest loop.
//
// Composition rationale (per apps/shared/npcs/bibles/the_degen.md):
//   - General: gen_dreamer ("The Oracle") — the Degen runs the Casino
//     under the same Ne-Yon-#8 imprint family the Oracle anchors.
//   - coreMemories (33): Dreamer-faction units + spells + the three
//     authored Casino-themed reward cards (poker / vip / high_roller).
//   - inheritedFragments (3): canon-implied Degen victories. The
//     bible §3 references the Antiquarian Shelfmate canon plus two
//     unnamed potentials the Degen filed out of the ledger.
//   - advantageCards (3): three secret-weapon cards gated by the
//     three perspective aspects. Learning each aspect strips that
//     card out and substitutes a thematically-revealed weaker card.
//   - challengeMotive (3): what the Degen wants from the player.
//     Surfaced by opening-line conditionals; on player-loss, one
//     is taken until rematch win.
//   - perspectiveAspects (3): risk_addiction / lonely_void /
//     bet_against_god. Each set by exactly one dialog choice in
//     perspective_gathering.ts via `sets: "the_degen:<aspect>"`.
//
// Deck math: 33 coreMemories + 3 inheritedFragments + 3 advantageCards
//   = 39 (Duelyst format size). The deck is exactly 39 in every
//   aspect-permutation because each advantage card has a 1:1
//   replacement; the count is invariant under buildNpcDeck's swap.

import type { NpcDeck } from "./_template";

export const THE_DEGEN_DECK: NpcDeck = {
  npcKey: "the_degen",
  general: "gen_dreamer",
  coreMemories: [
    // Dreamer-faction core (curve + reach). 33 cards.
    "s1_char_023", // The Degen (the card; reflects the Degen at the table)
    "s1_char_023",
    "s1_char_023",
    "s1_char_005", // Destiny
    "s1_char_005",
    "s1_char_014", // Nythera
    "s1_char_014",
    "s1_char_017", // The Advocate
    "s1_char_017",
    "s1_char_025", // The Dreamer
    "s1_char_025",
    "s1_char_027", // The Enigma (s1_char_027)
    "s1_char_034", // The Inventor
    "s1_char_034",
    "s1_char_037", // The Knowledge
    "s1_char_037",
    "s1_curve_003", // Glimmer Wisp (curve filler)
    "s1_curve_003",
    "s1_curve_008", // Vision Anchor
    "s1_curve_008",
    "s1_pack_006", // Dream Choir
    "s1_pack_006",
    "s1_pack_015", // Probability Surge
    "s1_pack_015",
    "s1_pack_016", // Vision Weaver
    "s1_pack_017", // Fate's Edge
    "s1_pack_018", // Dream Sentinel
    "s1_pack_019", // Oracle's Wrath
    "s1_pack_020", // Prophecy Incarnate
    "s1_pack_021", // Starlight Familiar
    // Casino-themed cards (the Degen's lived ledger).
    "s1_reward_casino_poker",
    "s1_reward_casino_vip",
    "s1_reward_casino_high_roller",
  ],
  inheritedFragments: [
    {
      fromNpcId: "potential",
      cardDefId: "s1_reward_casino_jackpot",
      flavorOverride:
        "This memory came to him from a potential the ledger no longer names. The jackpot, the silence after, the file closing.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_reward_casino_dice",
      flavorOverride:
        "Entropy Roll, taken from a Dreamer who came to the table thinking the math was the friend.",
    },
    {
      fromNpcId: "the_antiquarian",
      cardDefId: "s1_char_018", // The Antiquarian
      flavorOverride:
        "Filed under Shelfmates. A long-ago debt the ledger keeps in the Degen's tray.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_char_036", // The Judge (gated; secret-weapon ruling)
      gatedByAspect: "the_degen:risk_addiction",
      replacement: "s1_char_109", // The Enigma (revealed; weaker tempo)
    },
    {
      cardDefId: "s1_char_045", // The Resurrectionist (gated)
      gatedByAspect: "the_degen:lonely_void",
      replacement: "s1_char_029", // The Forgotten (revealed; thematic)
    },
    {
      cardDefId: "s1_char_046", // The Seer (gated; foreknowledge)
      gatedByAspect: "the_degen:bet_against_god",
      replacement: "s1_char_110", // Prophecy Keeper (revealed)
    },
  ],
  challengeMotive: [
    // What the Degen wants from the player's collection.
    "s1_char_018", // The Antiquarian (the Shelfmate canon)
    "s1_char_023", // The Degen (mirror — the player's read of him)
    "s1_reward_casino_jackpot", // The jackpot the player hasn't claimed
  ],
  perspectiveAspects: [
    {
      id: "the_degen:risk_addiction",
      label: "Why he can't sit out a hand",
    },
    {
      id: "the_degen:lonely_void",
      label: "What he's actually betting against",
    },
    {
      id: "the_degen:bet_against_god",
      label: "The wager the ledger never closes",
    },
  ],
};
