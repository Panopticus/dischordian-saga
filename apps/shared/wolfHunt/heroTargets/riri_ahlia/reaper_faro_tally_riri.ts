import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_FARO_TALLY_RIRI: HeroTarget = {
  "id": "reaper_faro_tally_riri",
  "name": "Reaper Faro Tally",
  "classKey": "assassin",
  "corruptorLord": "riri_ahlia",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "exact_quietus",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "shadow_weapon",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    }
  ],
  "tells": [
    "Leaves a coin behind for every kill, weighted by market value."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Reaper Faro Tally served the League as a retrieval specialist in the League's quiet branch before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to scout the threshold rooms."
  ]
};
