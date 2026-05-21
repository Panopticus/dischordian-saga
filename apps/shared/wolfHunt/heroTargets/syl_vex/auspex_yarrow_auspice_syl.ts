import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_YARROW_AUSPICE_SYL: HeroTarget = {
  "id": "auspex_yarrow_auspice_syl",
  "name": "Auspex Yarrow Auspice",
  "classKey": "oracle",
  "corruptorLord": "syl_vex",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "tidal_prediction",
      "category": "oracle",
      "severity": 3
    },
    {
      "id": "celestial_indexing",
      "category": "oracle",
      "severity": 3
    },
    {
      "id": "lunatic_compass",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "phase_displacement",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "vow_reading",
      "category": "oracle",
      "severity": 1
    }
  ],
  "tells": [
    "Steps out of tempo for a count and returns inside the guard.",
    "Indexes the engagement against an unseen calendar."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Yarrow Auspice served the League as a auspice keeper on the Witness Council before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to anchor a load-bearing column of the corruption."
  ]
};
