import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_NYX_SABLE: HeroTarget = {
  id: "reaper_nyx_sable",
  name: "Reaper Nyx Sable",
  classKey: "assassin",
  corruptorLord: "drael_mon",
  threatTier: 5,
  isBossLieutenant: true,
  powerSet: [
    { id: "soul_taxis", category: "assassin", severity: 3 },
    { id: "harvest_pace", category: "assassin", severity: 3 },
    { id: "veil_step", category: "assassin", severity: 2 },
    { id: "memorial_taking", category: "assassin", severity: 2 },
  ],
  tells: [
    "Counts down the souls owed before striking — always in fives.",
    "Leaves a coin behind for every kill, weighted by the soul's market value.",
    "Drael'Mon's harvest sigil flickers under her ribs when she's hungry.",
  ],
  lairLocation: "corrupters_orchard",
  briefingHints: [
    "Was the League's lead retrieval specialist — extracted bodies and souls from impossible jurisdictions.",
    "Drael'Mon corrupted her by paying her for the souls she already brought him.",
    "Now harvests on his behalf. The Crucible's orchard is full of her fruit.",
  ],
};
