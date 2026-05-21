import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_ERITH_AUSPICE_FENRA: HeroTarget = {
  "id": "scribe_erith_auspice_fenra",
  "name": "Scribe Erith Auspice",
  "classKey": "oracle",
  "corruptorLord": "fenra",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Scribe Erith Auspice served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to anchor a load-bearing column of the corruption."
  ]
};
