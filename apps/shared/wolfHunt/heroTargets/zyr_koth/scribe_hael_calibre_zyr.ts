import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_HAEL_CALIBRE_ZYR: HeroTarget = {
  "id": "scribe_hael_calibre_zyr",
  "name": "Scribe Hael Calibre",
  "classKey": "oracle",
  "corruptorLord": "zyr_koth",
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
    "Steps out of tempo for a count and returns inside the guard."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Scribe Hael Calibre served the League as a auspice keeper on the Witness Council before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to anchor a load-bearing column of the corruption."
  ]
};
