// apps/shared/npc-decks/wraith_calder.ts
//
// Wraith Calder → the Hierophant — Insurgency-faction NPC deck.
//
// Composition rationale (per apps/shared/npcs/bibles/wraith_calder.md):
//   - General: gen_insurgency (Agent Zero). The pre-rite Wraith ran
//     with the Wolf alongside Zero; the bible §1 anchors the cell-
//     veteran register that frames the duel.
//   - coreMemories (33): Insurgency curve — cell decoys, signal
//     operatives, guerrilla cells, Iron Lion. The "Don't mourn me if
//     I drop. I'll be back" voice runs through the deck.
//   - inheritedFragments (3): canon-implied prior victories. Wraith
//     died seven times in the Arena before the rite that made him the
//     Hierophant — the bible holds those as the deaths of "potentials
//     he was meant to be." Each fragment is a card he carried out of
//     a prior body. Includes the Antiquarian (the bible §2.4 ties
//     Wraith into the Epoch 2 corruption chain).
//   - advantageCards (3): three secret-weapon cards gated by the
//     three perspective aspects. Learning each aspect strips the
//     advantage and substitutes a weaker revealed card.
//   - challengeMotive (3): what the Hierophant wants from the player.
//     Cards that touch the Insurgency canon Wraith was once central
//     to.
//   - perspectiveAspects (3): patience_earned / counting_as_confession
//     / system_is_inside_us. Map to the three soul-tells the bible
//     §1.1 calls out as preserved across the transformation.

import type { NpcDeck } from "./_template";

export const WRAITH_CALDER_DECK: NpcDeck = {
  npcKey: "wraith_calder",
  general: "gen_insurgency",
  coreMemories: [
    // Wraith's own card x3 — the seven-deaths veteran.
    "s1_char_106",
    "s1_char_106",
    "s1_char_106",
    // The Hierophant card (his post-rite self) x2 — a Highlander
    // echo of his own future bleeding into the deck.
    "s1_char_031",
    "s1_char_031",
    // Insurgency leadership.
    "s1_char_002", // Agent Zero
    "s1_char_002",
    "s1_char_010", // Iron Lion
    "s1_char_010",
    "s1_char_011", // Jericho Jones
    "s1_char_012", // Kael
    "s1_char_026", // The Engineer
    "s1_char_028", // The Eyes
    "s1_char_040", // The Nomad
    "s1_char_044", // The Recruiter
    "s1_char_105", // Iron Lion variant
    "s1_char_107", // Signal Operative
    "s1_char_107",
    "s1_char_108", // Guerrilla Cell
    "s1_char_108",
    "s1_char_202", // Saboteur
    // Curve fillers.
    "s1_curve_004", // Cell Decoy
    "s1_curve_004",
    "s1_curve_009", // Trench Sergeant
    "s1_curve_009",
    // Spells / packs — the cell's reach.
    "s1_pack_005", // Cell Runner
    "s1_pack_008", // Dead Signal Burst
    "s1_pack_009", // Covert Operative
    "s1_pack_010", // Signal Repeater
    "s1_pack_011", // Insurgent Commander
    "s1_pack_012", // Rebel Arsenal
    "s1_pack_013", // Liberation Protocol
    "s1_pack_014", // Agent Zero Reborn
  ],
  inheritedFragments: [
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_047", // The Shadow Tongue
      flavorOverride:
        "Taken from a Potential who tried to outlast the Shadow Tongue with patience. He could not. Wraith kept the memory.",
    },
    {
      fromNpcId: "the_antiquarian",
      cardDefId: "s1_char_018", // The Antiquarian
      flavorOverride:
        "A debt from Epoch 2 — when the chronology problem first declared itself. The Hierophant has not closed this ledger.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_resurrect_003", // Ghost Cell Runner
      flavorOverride:
        "Seven deaths and a body that kept getting up. The runner is whoever Wraith was the third time he died.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_pack_014", // Agent Zero Reborn — Wraith's
      // tactical-mentor secret weapon (the doctrine he uses when the
      // player doesn't yet understand what patience cost him)
      gatedByAspect: "wraith_calder:patience_earned",
      replacement: "s1_curve_009", // Trench Sergeant (revealed,
      // workmanlike; he no longer hides behind the mentor mask once
      // you've seen his counted deaths)
    },
    {
      cardDefId: "s1_pack_013", // Liberation Protocol — the
      // architectural secret-weapon doctrine ("break it carefully")
      gatedByAspect: "wraith_calder:system_is_inside_us",
      replacement: "s1_pack_008", // Dead Signal Burst (revealed,
      // smaller scope — he stops trying to break the room when
      // you've understood the system is already inside)
    },
    {
      cardDefId: "s1_pack_011", // Insurgent Commander — the
      // unflinching count ("three hundred and forty-seven thousand
      // remaining")
      gatedByAspect: "wraith_calder:counting_as_confession",
      replacement: "s1_curve_004", // Cell Decoy (revealed,
      // unwilling to keep counting once the player names the
      // confession)
    },
  ],
  challengeMotive: [
    // Cards the Hierophant wants from the player.
    "s1_char_002", // Agent Zero (the cell's living memory)
    "s1_char_031", // The Hierophant himself (the soul-mirror)
    "s1_pack_013", // Liberation Protocol (the doctrine he is
    // unwilling to author from inside the chamber)
  ],
  perspectiveAspects: [
    {
      id: "wraith_calder:patience_earned",
      label: "What seven deaths taught him",
    },
    {
      id: "wraith_calder:counting_as_confession",
      label: "Why the number always matters",
    },
    {
      id: "wraith_calder:system_is_inside_us",
      label: "Where the corruption actually lives",
    },
  ],
};
