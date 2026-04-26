// apps/shared/npcs/banks/the_oracle.ts
//
// Stub bank for The Oracle — Phase 1 exit-criteria proof.
// One canonical cinematic-exception line (Ch5 introduction-of-self) plus
// one dream-substrate line (Wary-band pre-Ch5 unattributed dream).
//
// Per the_oracle.md §1.5 substrate-test: every Oracle line operates only
// through dream_sequence / memory_residue / cinematic-exception channels.
// Phase 3 expands to ~88 lines spanning all three channels.

import type { DialogSurface, NpcLine } from "../types";

export const THE_ORACLE_BANK: ReadonlyArray<NpcLine & { surfaces: ReadonlyArray<DialogSurface> }> = [
  // ─── Cinematic-exception / Ch5 introduction-of-self (canonical) ────────
  {
    npcKey: "the_oracle",
    lineId: "oracle.cinematic.ch5.introduction_of_self",
    text:
      "I am going to speak to you for the first time. " +
      "You have been hearing my voice underneath Elara's for eleven chapters without knowing. " +
      "I am sorry for the deception. I needed you to choose me instead of remember me.",
    surfaces: ["cinematic"],
    requiresRevealStage: "cinematic_exception",
    cooldownKey: "oracle.ch5_introduction",
    maxPlays: 1,
    setsFlags: ["oracle_revealed_via_ch5_cinematic"],
  },

  // ─── Dream-substrate / Wary band / Act 1 (pre-Ch5 unattributed dream) ─
  {
    npcKey: "the_oracle",
    lineId: "oracle.dream.act1.wary.chair_was_warm",
    text:
      "The chair was warm. The window was open. " +
      "Underneath the room you are about to walk into, " +
      "something is waiting that you do not yet know is waiting for you.",
    surfaces: ["dream_sequence"],
    minAct: 1,
    maxAct: 4,
    requiresTrustBand: "Wary",
    requiresRevealStage: "dream_substrate",
  },

  // Catch-all
  {
    npcKey: "the_oracle",
    lineId: "oracle.dream.catchall",
    text: "Underneath. Something underneath the room you are walking into.",
    surfaces: ["dream_sequence"],
    requiresRevealStage: "dream_substrate",
  },
  {
    npcKey: "the_oracle",
    lineId: "oracle.cinematic.catchall",
    text: "I am here. Underneath.",
    surfaces: ["cinematic"],
  },
];
