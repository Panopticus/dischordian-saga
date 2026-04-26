// apps/shared/npcs/banks/the_game_master.ts
//
// Stub bank for The Game Master — Phase 1 exit-criteria proof.
// Game Master is canonically thin-by-design (~250 lines per Phase 3).
// Three identity-stratification states: Archon / Cult / dead_AI.
//
// Per the_game_master.md identity-stratification canon: every Game Master
// line canonically flags which of 3 forms is active. Game Master uses
// presence-bands (Faint/Loud/Overwhelming), not bond-trust meters.

import type { DialogSurface, NpcLine } from "../types";

export const THE_GAME_MASTER_BANK: ReadonlyArray<NpcLine & { surfaces: ReadonlyArray<DialogSurface> }> = [
  // ─── Archon form, pre-Authority-Trial witness-mode ────────────────────
  {
    npcKey: "the_game_master",
    lineId: "game_master.archon.pre_trial.beautiful_box",
    text: "You have built a beautiful box. The only thing I am going to do is open it in front of everybody.",
    surfaces: ["cinematic", "match"],
    requiresRevealStage: "Archon",
    cooldownKey: "game_master.witness_mode_intro",
    maxPlays: 1,
    setsPublicFlags: ["game_master_witnessed_player"],
  },

  // ─── Catch-all ────────────────────────────────────────────────────────
  {
    npcKey: "the_game_master",
    lineId: "game_master.match.catchall",
    text: "Every move enters the public record.",
    surfaces: ["match"],
  },
  {
    npcKey: "the_game_master",
    lineId: "game_master.cinematic.catchall",
    text: "I am here to witness. Not to play.",
    surfaces: ["cinematic"],
  },
];
