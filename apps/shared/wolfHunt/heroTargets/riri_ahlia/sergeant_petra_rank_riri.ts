import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_PETRA_RANK_RIRI: HeroTarget = {
  "id": "sergeant_petra_rank_riri",
  "name": "Sergeant Petra Rank",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "unmaking_command",
      "category": "soldier",
      "severity": 3
    }
  ],
  "tells": [
    "Plants a standard the cohort regroups around.",
    "Bleeds chairman-black when struck."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Sergeant Petra Rank served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to drive a substantive operation against League material."
  ]
};
