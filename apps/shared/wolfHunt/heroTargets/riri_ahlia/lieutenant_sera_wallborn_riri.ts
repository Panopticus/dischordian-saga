import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_SERA_WALLBORN_RIRI: HeroTarget = {
  "id": "lieutenant_sera_wallborn_riri",
  "name": "Lieutenant Sera Wallborn",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
  "threatTier": 1,
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
    }
  ],
  "tells": [
    "Issues orders in a register only the corrupted obey."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Lieutenant Sera Wallborn served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to scout the threshold rooms."
  ]
};
