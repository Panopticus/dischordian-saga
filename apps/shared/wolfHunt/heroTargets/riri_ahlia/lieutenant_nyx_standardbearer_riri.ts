import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_NYX_STANDARDBEARER_RIRI: HeroTarget = {
  "id": "lieutenant_nyx_standardbearer_riri",
  "name": "Lieutenant Nyx Standardbearer",
  "classKey": "soldier",
  "corruptorLord": "riri_ahlia",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Reorders his guard formation mid-fight — the formation is the attack.",
    "Refuses to retreat from a structured engagement.",
    "Plants a standard the cohort regroups around."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Lieutenant Nyx Standardbearer served the League as a ranking officer in the League's standing line before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to scout the threshold rooms."
  ]
};
