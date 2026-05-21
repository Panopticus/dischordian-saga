import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_IOHN_FLAGCALLER_SYL: HeroTarget = {
  "id": "sergeant_iohn_flagcaller_syl",
  "name": "Sergeant Iohn Flagcaller",
  "classKey": "soldier",
  "corruptorLord": "syl_vex",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "attritional_will",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "flag_authority",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    }
  ],
  "tells": [
    "Maintains attritional pressure beyond reasonable endurance.",
    "Calls a reserve unit on a delayed cadence.",
    "Salutes an empty seat to her right before every order."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Sergeant Iohn Flagcaller served the League as a ranking officer in the League's standing line before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to hold a cell of the Crucible's lattice."
  ]
};
