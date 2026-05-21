import type { HeroTarget } from "../../types/HeroTarget";

export const CAPTAIN_KYNAN_HOLDFAST_SYL: HeroTarget = {
  "id": "captain_kynan_holdfast_syl",
  "name": "Captain Kynan Holdfast",
  "classKey": "soldier",
  "corruptorLord": "syl_vex",
  "threatTier": 4,
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
    },
    {
      "id": "unmaking_command",
      "category": "soldier",
      "severity": 3
    }
  ],
  "tells": [
    "Salutes an empty seat to her right before every order.",
    "Reorders his guard formation mid-fight — the formation is the attack."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Captain Kynan Holdfast served the League as a ranking officer in the League's standing line before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to anchor a load-bearing column of the corruption."
  ]
};
