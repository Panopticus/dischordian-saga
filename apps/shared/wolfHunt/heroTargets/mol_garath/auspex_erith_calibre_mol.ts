import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_ERITH_CALIBRE_MOL: HeroTarget = {
  "id": "auspex_erith_calibre_mol",
  "name": "Auspex Erith Calibre",
  "classKey": "oracle",
  "corruptorLord": "mol_garath",
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
  "lairLocation": "unmakers_court",
  "briefingHints": [
    "Auspex Erith Calibre served the League as a auspice keeper on the Witness Council before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses her to anchor a load-bearing column of the corruption."
  ]
};
