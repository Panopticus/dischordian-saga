import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_GIDA_ENDSIGN_ITH: HeroTarget = {
  "id": "reaper_gida_endsign_ith",
  "name": "Reaper Gida Endsign",
  "classKey": "assassin",
  "corruptorLord": "ith_rael",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Reaper Gida Endsign served the League as a retrieval specialist in the League's quiet branch before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to hold a cell of the Crucible's lattice."
  ]
};
