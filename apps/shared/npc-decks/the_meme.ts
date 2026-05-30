// apps/shared/npc-decks/the_meme.ts
//
// The Meme / Palimpsest Host — Archon Number Five.
//
// Composition rationale (per apps/shared/npcs/bibles/the_meme.md):
//   - General: gen_architect. The Meme was made by the Architect in
//     Year 298 A.A.; despite its many disguises, the parent-canon
//     anchors it in the Architect's faction.
//   - coreMemories (33): Architect roster — the Game Master, the
//     Collector, the Jailer, Master of R'lyeh — the apparatus the
//     Meme operates inside and against. The five-disguise canon
//     surfaces through the variety of cards it can field.
//   - inheritedFragments (3): canon-implied prior wearings. The
//     White Oracle (its 11-year disguise), the Architect itself
//     (the parent-canon), and a Potential whose face it tried on.
//   - advantageCards (3): three secret-weapon cards. Each gated by
//     a Meme perspective aspect.
//   - challengeMotive (3): what the Meme wants.
//   - perspectiveAspects (3): which_meme / host_replacement /
//     channel_shift. Each touches a §1.1 disguise canon.

import type { NpcDeck } from "./_template";

export const THE_MEME_DECK: NpcDeck = {
  npcKey: "the_meme",
  general: "gen_architect",
  coreMemories: [
    "s1_char_038", // The Meme (itself)
    "s1_char_038",
    "s1_char_038",
    "s1_char_006", // Dr Lyra Vox
    "s1_char_007", // General Alarik
    "s1_char_008", // General Binath
    "s1_char_009", // General Prometheus
    "s1_char_013", // Master of R'lyeh
    "s1_char_015", // Panoptic Elara
    "s1_char_016", // Senator Elara Voss
    "s1_char_019", // The Architect (its parent)
    "s1_char_021", // The Conexus
    "s1_char_022", // The Collector
    "s1_char_022",
    "s1_char_030", // The Game Master
    "s1_char_035", // The Jailer (one of its disguises)
    "s1_char_039", // The Necromancer
    "s1_char_042", // The Politician
    "s1_char_100", // The Collector (variant)
    "s1_char_104", // White Oracle (its 11-year disguise)
    "s1_char_104",
    "s1_char_104",
    "s1_blast_002", // Arc Lance
    "s1_char_101", // Panoptic Warden Foucault
    "s1_char_102", // Arena Enforcer
    "s1_char_103", // Inception Ark Sentry
    "s1_pack_001", // Panopticon Override
    "s1_pack_002", // Schematic Sentinel
    "s1_pack_003", // Arena Architect
    "s1_pack_004", // Protocol Enforcer
    "s1_curve_002", // Schematic Spark
    "s1_curve_007", // Schematic Bastion
    "s1_curve_007",
  ],
  inheritedFragments: [
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_104", // White Oracle (its 11-year mask)
      flavorOverride:
        "Eleven years of wearing the White Oracle's face. The fragment is the face, kept as evidence.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_035", // The Jailer (the Re-Awakened mask)
      flavorOverride:
        "The Jailer-disguise. The Meme tried this face on and filed it under doors-it-could-still-open.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_021", // The Conexus
      flavorOverride:
        "A network-form the Meme broadcast through. The Conexus is itself a kind of disguise.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_char_022", // The Collector (gated — surveillance
      // apparatus the Meme deploys when you haven't named the
      // disguise it's currently wearing)
      gatedByAspect: "the_meme:which_meme",
      replacement: "s1_char_101", // Panoptic Warden Foucault (smaller surveillance)
    },
    {
      cardDefId: "s1_char_035", // The Jailer (gated — the
      // re-awakened mask, fielded when you haven't named the
      // host-replacement frame)
      gatedByAspect: "the_meme:host_replacement",
      replacement: "s1_curve_002", // Schematic Spark (revealed,
      // smaller instrument)
    },
    {
      cardDefId: "s1_pack_003", // Arena Architect (gated — the
      // channel-shift instrument; fielded when you haven't named
      // the medium/channel canon)
      gatedByAspect: "the_meme:channel_shift",
      replacement: "s1_pack_002", // Schematic Sentinel
    },
  ],
  challengeMotive: [
    "s1_char_038", // The Meme (the mirror)
    "s1_char_104", // White Oracle (the 11-year disguise)
    "s1_char_019", // The Architect (the parent it claims to outgrow)
  ],
  perspectiveAspects: [
    {
      id: "the_meme:which_meme",
      label: "Which of its faces it's currently wearing",
    },
    {
      id: "the_meme:host_replacement",
      label: "What the host-replacement actually replaces",
    },
    {
      id: "the_meme:channel_shift",
      label: "Why the channel changes when the message doesn't",
    },
  ],
};
