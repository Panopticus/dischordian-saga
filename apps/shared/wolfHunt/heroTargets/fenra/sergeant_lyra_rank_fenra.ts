import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_LYRA_RANK_FENRA: HeroTarget = {
  "id": "sergeant_lyra_rank_fenra",
  "name": "Sergeant Lyra Rank",
  "classKey": "soldier",
  "corruptorLord": "fenra",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "rank_compulsion",
      "category": "soldier",
      "severity": 3
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
    },
    {
      "id": "seven_dimension_siege",
      "category": "soldier",
      "severity": 3
    }
  ],
  "tells": [
    "Plants a standard the cohort regroups around.",
    "Bleeds chairman-black when struck."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Sergeant Lyra Rank served the League as a ranking officer in the League's standing line before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to drive a substantive operation against League material."
  ]
};
