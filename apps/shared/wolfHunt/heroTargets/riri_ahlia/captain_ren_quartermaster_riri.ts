import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_REN_QUARTERMASTER_RIRI: HeroTarget = {
  "id": "captain_ren_quartermaster_riri",
  "name": "Captain Ren Quartermaster",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
  "threatTier": 4,
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
      "id": "unmaking_command",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "rank_compulsion",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Bleeds chairman-black when struck.",
    "Issues orders in a register only the corrupted obey.",
    "Maintains attritional pressure beyond reasonable endurance."
  ],
  "lairLocation": "tasking_yards",
  "briefingHints": [
    "Captain Ren Quartermaster served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to anchor a load-bearing column of the corruption."
  ]
};
