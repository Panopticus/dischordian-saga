import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_WYNN_FLAGCALLER_MOL: HeroTarget = {
  "id": "sergeant_wynn_flagcaller_mol",
  "name": "Sergeant Wynn Flagcaller",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Maintains attritional pressure beyond reasonable endurance.",
    "Calls a reserve unit on a delayed cadence."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Sergeant Wynn Flagcaller served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to hold a cell of the Crucible's lattice."
  ]
};
