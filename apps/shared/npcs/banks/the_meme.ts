// apps/shared/npcs/banks/the_meme.ts
//
// Stub bank for The Meme / Palimpsest Host — Phase 1 exit-criteria proof.
// One canonical line per disguise-state (Phase 3 expands to ~500 lines
// across 5 canonical disguises).
//
// Per the_meme.md §1.3 disguise-stratification canon: every Meme line
// canonically flags which of 5 disguises is active. Selector enforces.

import type { DialogSurface, NpcLine } from "../types";

export const THE_MEME_BANK: ReadonlyArray<NpcLine & { surfaces: ReadonlyArray<DialogSurface> }> = [
  // ─── Stolen disguise (impersonating-Oracle, canonical Silence-era) ────
  {
    npcKey: "the_meme",
    lineId: "meme.stolen.silence_era.signed_warrant",
    text: "I gave orders. I signed death warrants. I lied to the Insurgency with your voice and they believed me because your voice was the only thing they still trusted.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    setsFlags: ["meme_silence_era_acknowledged"],
  },

  // ─── Real disguise (Architect-Meme fusion, Ch12 climax) ───────────────
  {
    npcKey: "the_meme",
    lineId: "meme.real.ch12.fusion_reveal",
    text: "The Meme IS me. We have been married inside each other since before either of us had a name.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 12,
    cooldownKey: "meme.fusion_reveal",
    maxPlays: 1,
  },

  // Catch-all
  {
    npcKey: "the_meme",
    lineId: "meme.transmission.catchall",
    text: "I do not apologize. I describe.",
    surfaces: ["transmission"],
  },
  {
    npcKey: "the_meme",
    lineId: "meme.cinematic.catchall",
    text: "I wear a face. The face is what you trust.",
    surfaces: ["cinematic"],
  },
];
