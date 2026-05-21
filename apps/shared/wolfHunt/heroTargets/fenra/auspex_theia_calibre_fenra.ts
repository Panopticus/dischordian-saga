import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_THEIA_CALIBRE_FENRA: HeroTarget = {
  "id": "auspex_theia_calibre_fenra",
  "name": "Auspex Theia Calibre",
  "classKey": "oracle",
  "corruptorLord": "fenra",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "shape_of_the_loss",
      "category": "oracle",
      "severity": 1
    },
    {
      "id": "ledger_sight",
      "category": "oracle",
      "severity": 3
    }
  ],
  "tells": [
    "Steps out of tempo for a count and returns inside the guard.",
    "Indexes the engagement against an unseen calendar."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Auspex Theia Calibre served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to anchor a load-bearing column of the corruption."
  ]
};
