import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_KARIS_RANKS_RIRI: HeroTarget = {
  "id": "sergeant_karis_ranks_riri",
  "name": "Sergeant Karis Ranks",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Sergeant Karis Ranks served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to hold a cell of the Crucible's lattice."
  ]
};
