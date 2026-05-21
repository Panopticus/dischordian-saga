import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_TOMA_FLAGCALLER_RIRI: HeroTarget = {
  "id": "sergeant_toma_flagcaller_riri",
  "name": "Sergeant Toma Flagcaller",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Sergeant Toma Flagcaller served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to hold a cell of the Crucible's lattice."
  ]
};
