import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_ORYN_RANKS_MOL: HeroTarget = {
  "id": "sergeant_oryn_ranks_mol",
  "name": "Sergeant Oryn Ranks",
  "classKey": "soldier",
  "corruptorLord": "mol_garath",
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
    "Sergeant Oryn Ranks served the League as a ranking officer in the League's standing line before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to hold a cell of the Crucible's lattice."
  ]
};
