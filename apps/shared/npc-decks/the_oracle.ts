// apps/shared/npc-decks/the_oracle.ts
//
// The Oracle — Dreamer-faction. The Prisoner-Oracle archetype.
//
// Composition rationale (per apps/shared/npcs/bibles/the_oracle.md):
//   - General: gen_dreamer. The Oracle IS the Dreamer general's
//     in-fiction identity (gen_dreamer = "The Oracle" per
//     gen_dreamer.ts). The Oracle's bench-and-Bench canon shares
//     ontological space with the Seer; the bible §1.1 distinguishes
//     them by surface (dream_substrate vs memory_residue).
//   - coreMemories (33): Dreamer roster — vision-keepers, dream
//     anchors, prophecy carriers. The Oracle's deck reads as
//     densely-prophetic by faction.
//   - inheritedFragments (3): canon-implied prior dreamers. The
//     Architect's design (the Oracle was canonically captured by
//     the Collector — bible §3), Insurgency-aligned Oracle, and a
//     Potential whose dream the Oracle filed.
//   - advantageCards (3): three secret-weapon cards.
//   - challengeMotive (3): what the Oracle wants.
//   - perspectiveAspects (3): dream_substrate / memory_residue /
//     cinematic_exception. Each maps to a §1.1 surface canon.

import type { NpcDeck } from "./_template";

export const THE_ORACLE_DECK: NpcDeck = {
  npcKey: "the_oracle",
  general: "gen_dreamer",
  coreMemories: [
    "s1_char_041", // The Oracle (the Insurgency variant)
    "s1_char_041",
    "s1_char_041",
    "s1_char_005", // Destiny
    "s1_char_014", // Nythera
    "s1_char_017", // The Advocate
    "s1_char_017",
    "s1_char_025", // The Dreamer
    "s1_char_025",
    "s1_char_027", // The Enigma
    "s1_char_029", // The Forgotten
    "s1_char_029",
    "s1_char_034", // The Inventor
    "s1_char_037", // The Knowledge
    "s1_char_045", // The Resurrectionist
    "s1_char_046", // The Seer (her parallel)
    "s1_char_109", // The Enigma variant
    "s1_char_110", // Prophecy Keeper
    "s1_char_111", // Vision Walker
    "s1_char_111",
    "s1_char_112", // Reality Anchor
    "s1_char_203", // Astral Warden
    "s1_curve_003", // Glimmer Wisp
    "s1_curve_008", // Vision Anchor
    "s1_curve_008",
    "s1_pack_006", // Dream Choir
    "s1_pack_015", // Probability Surge
    "s1_pack_016", // Vision Weaver
    "s1_pack_017", // Fate's Edge
    "s1_pack_018", // Dream Sentinel
    "s1_pack_019", // Oracle's Wrath
    "s1_pack_020", // Prophecy Incarnate
    "s1_pack_021", // Starlight Familiar
  ],
  inheritedFragments: [
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_022", // The Collector (its captor)
      flavorOverride:
        "The architect of her imprisonment. She carries the file as one carries the room one was held in.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_046", // The Seer (its parallel)
      flavorOverride:
        "The bench and the dream-substrate. The Seer's shelf and the Oracle's substrate are not the same shelf.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_pack_id_oracle_prisoner",
      flavorOverride:
        "The Prisoner-form she was filed under for centuries. The form does not leave when the prisoner does.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_pack_id_oracle_ascended", // gated — the
      // Ascended-form. Fielded when the player hasn't yet named
      // the dream-substrate canon.
      gatedByAspect: "the_oracle:dream_substrate",
      replacement: "s1_pack_id_oracle_prophet",
    },
    {
      cardDefId: "s1_pack_019", // Oracle's Wrath (gated — the
      // memory-residue instrument)
      gatedByAspect: "the_oracle:memory_residue",
      replacement: "s1_pack_006", // Dream Choir (revealed)
    },
    {
      cardDefId: "s1_pack_020", // Prophecy Incarnate (gated —
      // the cinematic-exception instrument)
      gatedByAspect: "the_oracle:cinematic_exception",
      replacement: "s1_pack_016", // Vision Weaver (revealed)
    },
  ],
  challengeMotive: [
    "s1_char_041", // The Oracle (the mirror)
    "s1_char_022", // The Collector (her captor)
    "s1_pack_id_oracle_prisoner", // her Prisoner-form
  ],
  perspectiveAspects: [
    {
      id: "the_oracle:dream_substrate",
      label: "How the dream-substrate carries the vision",
    },
    {
      id: "the_oracle:memory_residue",
      label: "What residues memory leaves in the substrate",
    },
    {
      id: "the_oracle:cinematic_exception",
      label: "Why the cinematic exception breaks the rule",
    },
  ],
};
