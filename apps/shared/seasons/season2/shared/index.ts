/* Shared Season 2 patches — apply to all 24 variants. */
import type { PatchModule } from "../types";

export const SHARED_PATCH: PatchModule = {
  id: "shared",
  dialogOverrides: {
    "new_babylon.mission_board.greeting":
      "The mission board files itself now. Locke's quill is on the floor where the bench used to be.",
  },
  loredexPatches: {
    locke: {
      status: "in_memoriam",
      inMemoriamLine: "She filed the world. She did not file herself.",
      rewritePastTense: true,
    },
  },
  cardUnlocks: [],
  crossArcRipples: [
    "new_babylon_mission_board_unstaffed",
    "necromancer_extended_cooldown",
    "prelude_tutorial_preserved",
    "rules_version_bump_3_0_0",
    "memorial_codex_entries_added",
  ],
};
