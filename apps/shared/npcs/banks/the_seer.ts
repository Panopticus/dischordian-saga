// apps/shared/npcs/banks/the_seer.ts
//
// Stub bank for The Seer — Phase 1 exit-criteria proof.
// One canonical line drawn from her bible §6.1 (Cold register / Wary band /
// Act 3, full prophecy-overhead). Demonstrates the cross-time pre-recording
// canon: every Seer line is canonically a recording made before sealing,
// scheduled to fire at the moment she foresaw.
//
// Per the_seer.md §§1.5, 2.3 voice-gate canon. Phase 3 expands to ~500
// lines spanning Cold / Warm / Confidant registers across Acts 1-7.

import type { DialogSurface, NpcLine } from "../types";

export const THE_SEER_BANK: ReadonlyArray<NpcLine & { surfaces: ReadonlyArray<DialogSurface> }> = [
  // ─── Cold register / Wary band / Act 3 ─────────────────────────────────
  {
    npcKey: "the_seer",
    lineId: "seer.transmission.act3.cold.eleven_versions",
    text:
      "There were eleven versions of the next four turns. You have just chosen one of them. " +
      "The version you chose is, in three of the eleven, the one I would have wanted you to choose " +
      "if I had a wanting that ranked above the seeing. The seeing did not endorse the wanting. " +
      "I am noting both, in the order they occurred to me. The waiting continues.",
    surfaces: ["transmission"],
    minAct: 3,
    requiresTrustBand: "Wary",
    cooldownKey: "seer.cold_baseline",
    setsFlags: ["seer_first_cold_transmission_received"],
  },

  // Catch-all (silent-fail contract): a default line for any (the_seer,
  // transmission) call without specific gating. Phase 3 will expand.
  {
    npcKey: "the_seer",
    lineId: "seer.transmission.catchall",
    text: "The waiting is the Seer's favourite register. She has not raised her staff in your presence.",
    surfaces: ["transmission"],
  },
];
