// apps/shared/npc-decks/the_seer.ts
//
// The Seer — Dreamer-faction NPC deck.
//
// Composition rationale (per apps/shared/npcs/bibles/the_seer.md):
//   - General: gen_dreamer (The Oracle). The Seer's bench-and-
//     probability-table register sits inside the Dreamer faction's
//     prophetic-vision archetype.
//   - coreMemories (33): Dreamer roster — the Seer herself, the
//     Dreamer, the Forgotten, the Knowledge — plus prophecy-side
//     spells (probability surge, prophecy incarnate, oracle's wrath)
//     that mechanically express the "probability table" voice.
//   - inheritedFragments (3): canon-implied prior teaching beats.
//     The Antiquarian (§4.9 "the Programmer's category" shelf),
//     the Architect (the bench Mechronis was built from), and a
//     Potential the Seer waited out.
//   - advantageCards (3): three secret-weapon cards gated by the
//     three perspective aspects. Learning each strips one of the
//     Seer's prophecy-overhead tools.
//   - challengeMotive (3): what the Seer wants from the player's
//     collection.
//   - perspectiveAspects (3): probability_table / asymmetric_kindness
//     / waiting_as_register. Each maps to a §1.4 voice tell.

import type { NpcDeck } from "./_template";

export const THE_SEER_DECK: NpcDeck = {
  npcKey: "the_seer",
  general: "gen_dreamer",
  coreMemories: [
    // The Seer's own card x3 — bench-and-staff register.
    "s1_char_046",
    "s1_char_046",
    "s1_char_046",
    // Dreamer roster — the categories on her shelves.
    "s1_char_005", // Destiny (the only word she does not say)
    "s1_char_005",
    "s1_char_014", // Nythera
    "s1_char_017", // The Advocate (her pre-Fall ally)
    "s1_char_017",
    "s1_char_025", // The Dreamer
    "s1_char_025",
    "s1_char_027", // The Enigma
    "s1_char_029", // The Forgotten
    "s1_char_029",
    "s1_char_034", // The Inventor
    "s1_char_037", // The Knowledge
    "s1_char_037",
    "s1_char_045", // The Resurrectionist
    "s1_char_109", // The Enigma (variant)
    "s1_char_110", // Prophecy Keeper
    "s1_char_110",
    "s1_char_111", // Vision Walker
    "s1_char_111",
    "s1_char_112", // Reality Anchor
    "s1_char_203", // Astral Warden
    // Curve.
    "s1_curve_003", // Glimmer Wisp
    "s1_curve_003",
    "s1_curve_008", // Vision Anchor
    "s1_curve_008",
    // Spells / packs — probability-table tools.
    "s1_pack_015", // Probability Surge
    "s1_pack_015",
    "s1_pack_016", // Vision Weaver
    "s1_pack_018", // Dream Sentinel
    "s1_pack_020", // Prophecy Incarnate
  ],
  inheritedFragments: [
    {
      fromNpcId: "the_antiquarian",
      cardDefId: "s1_char_018", // The Antiquarian
      flavorOverride:
        "The Programmer's category. A specific shelf. She has filed him here for longer than he has been the file.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_034", // The Inventor (different surface)
      flavorOverride:
        "A Potential who built a tool the Seer was already waiting for. She accepted the gift in advance.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_112", // Reality Anchor
      flavorOverride:
        "An anchor she set down before the player learned she was going to. She does not call this prophecy.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_pack_017", // Fate's Edge — prophecy-overhead
      // full-payload card; the Seer hides behind it when the
      // player hasn't yet asked her to redact the table
      gatedByAspect: "the_seer:probability_table_redaction",
      replacement: "s1_pack_021", // Starlight Familiar (revealed —
      // smaller, plainer, less prophecy-flavored)
    },
    {
      cardDefId: "s1_pack_019", // Oracle's Wrath — the asymmetric-
      // kindness card; the Seer plays it when the player hasn't
      // named the asymmetry
      gatedByAspect: "the_seer:asymmetric_kindness",
      replacement: "s1_pack_006", // Dream Choir (revealed — gentler,
      // the kindness offered without the wrath)
    },
    {
      cardDefId: "s1_pack_id_oracle_prophet", // The Oracle Prophet —
      // the waiting-as-register card; she fields the Prophet
      // when the player hasn't seen that waiting is the move
      gatedByAspect: "the_seer:waiting_as_register",
      replacement: "s1_pack_id_oracle_ascended", // The Ascended
      // (revealed — different version of the same shelf)
    },
  ],
  challengeMotive: [
    // What the Seer wants from the player.
    "s1_char_046", // The Seer (the mirror)
    "s1_char_018", // The Antiquarian (the Programmer's shelf)
    "s1_pack_017", // Fate's Edge (the prophecy-overhead doctrine)
  ],
  perspectiveAspects: [
    {
      id: "the_seer:probability_table_redaction",
      label: "Which column she'd let you redact",
    },
    {
      id: "the_seer:asymmetric_kindness",
      label: "Whose kindness her futures rank by",
    },
    {
      id: "the_seer:waiting_as_register",
      label: "Why waiting is her favourite move",
    },
  ],
};
