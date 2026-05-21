import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_CYRIL_ENDSIGN_DRAEL: HeroTarget = {
  "id": "reaper_cyril_endsign_drael",
  "name": "Reaper Cyril Endsign",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "shadow_weapon",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "veil_step",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Hums a load-bearing frequency mid-strike.",
    "Speaks the hunter's own blood-type back at him as a curse."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Reaper Cyril Endsign served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to hold a cell of the Crucible's lattice."
  ]
};
