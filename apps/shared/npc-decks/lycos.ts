// apps/shared/npc-decks/lycos.ts
//
// Lycos / The Wolf — Thought Virus faction (post-resurrection
// hunter, consumed by the Virus pre-resurrection).
//
// Composition rationale (per apps/shared/npcs/bibles/lycos.md):
//   - General: gen_thought_virus. Lycos was infected on Thaloria
//     (§2.2); the Judge killed him (§2.3); he was resurrected in
//     the Crucible as the Wolf (§2.4). The thought_virus faction
//     anchors the consumption-and-after canon.
//   - coreMemories (33): Thought Virus roster — hosts, carriers,
//     swarms, viral packs. Each card reads as a contract the Wolf
//     has accepted; the Antiquarian writes them short.
//   - inheritedFragments (3): canon-implied prior victims.
//     The Judge (his canonical killer), the Antiquarian (the one
//     who writes the contracts), and a Potential the Wolf has
//     already hunted in Anara.
//   - advantageCards (3): three secret-weapon cards.
//   - challengeMotive (3): what the Wolf wants.
//   - perspectiveAspects (3): judges_killing / wolf_tasking /
//     ballot_foreclosure. The third touches the bible's §4 canon
//     — the Wolf's ballot-death foreclosure.

import type { NpcDeck } from "./_template";

export const LYCOS_DECK: NpcDeck = {
  npcKey: "lycos",
  general: "gen_thought_virus",
  coreMemories: [
    "s1_char_032", // The Host (his canonical pre-resurrection form)
    "s1_char_032",
    "s1_char_049", // The Source
    "s1_char_049",
    "s1_char_070", // Patient Zero
    "s1_char_070",
    "s1_char_071", // Neural Parasite
    "s1_char_072", // Memetic Carrier
    "s1_char_072",
    "s1_char_073", // Cognitive Blight
    "s1_char_074", // Vector Swarm
    "s1_char_074",
    "s1_char_075", // Plague Herald
    "s1_char_076", // Synaptic Horror
    "s1_char_077", // Mind Rot Drone
    "s1_char_113", // Terminus Sovereign
    "s1_char_114", // Viral Vector
    "s1_char_114",
    "s1_char_115", // Consumed Host
    "s1_char_115",
    "s1_char_116", // Neural Plague Carrier
    "s1_char_200", // Cortex Ravager
    "s1_blast_004", // Pyre Swarm
    "s1_pack_022", // Viral Bloom
    "s1_pack_023", // Infected Drone
    "s1_pack_024", // Plague Architect
    "s1_pack_025", // Corruption Wave
    "s1_pack_026", // Neural Hive
    "s1_pack_027", // Terminus Dreadnought
    "s1_pack_028", // Spore Cloud
    "s1_resurrect_002", // Persistent Strain (his Crucible-form)
    "s1_resurrect_002",
    "s1_reward_boss_source",
  ],
  inheritedFragments: [
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_036", // The Judge (his canonical killer)
      flavorOverride:
        "The execution under authority. The Wolf does not contest the authority; he contests only the silence afterward.",
    },
    {
      fromNpcId: "the_antiquarian",
      cardDefId: "s1_char_018", // The Antiquarian
      flavorOverride:
        "The contract-writer. The Wolf carries the file because the file is the contract.",
    },
    {
      fromNpcId: "potential",
      cardDefId: "s1_char_049", // The Source (a hunted Hero)
      flavorOverride:
        "One of the 250 Heroes the Antiquarian placed in Anara. The Wolf has filed the kill. The matrix records the partial completion.",
    },
  ],
  advantageCards: [
    {
      cardDefId: "s1_pack_027", // Terminus Dreadnought (gated —
      // the Wolf's largest contracted instrument)
      gatedByAspect: "lycos:judges_killing",
      replacement: "s1_pack_023", // Infected Drone (revealed —
      // smaller, more procedural)
    },
    {
      cardDefId: "s1_char_113", // Terminus Sovereign (gated —
      // the apparatus the Antiquarian's hunting-contracts run
      // through)
      gatedByAspect: "lycos:wolf_tasking",
      replacement: "s1_char_075", // Plague Herald (revealed)
    },
    {
      cardDefId: "s1_char_200", // Cortex Ravager (gated — the
      // ballot-foreclosure instrument, the largest thing the
      // Wolf still has in motion before the ballot)
      gatedByAspect: "lycos:ballot_foreclosure",
      replacement: "s1_char_077", // Mind Rot Drone (revealed)
    },
  ],
  challengeMotive: [
    "s1_char_036", // The Judge (his killer)
    "s1_char_018", // The Antiquarian (his contract-writer)
    "s1_char_049", // The Source (one of the Anara Heroes)
  ],
  perspectiveAspects: [
    {
      id: "lycos:judges_killing",
      label: "What the Judge's execution actually closed",
    },
    {
      id: "lycos:wolf_tasking",
      label: "Why the Antiquarian writes the contracts short",
    },
    {
      id: "lycos:ballot_foreclosure",
      label: "What the ballot forecloses if the Wolf is sacrificed",
    },
  ],
};
