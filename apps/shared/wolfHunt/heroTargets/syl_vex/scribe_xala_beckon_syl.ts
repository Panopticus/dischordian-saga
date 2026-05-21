import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_XALA_BECKON_SYL: HeroTarget = {
  "id": "scribe_xala_beckon_syl",
  "name": "Scribe Xala Beckon",
  "classKey": "oracle",
  "corruptorLord": "syl_vex",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "default_reckoning",
      "category": "oracle",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Reads the engagement's celestial alignment before committing."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Scribe Xala Beckon served the League as a auspice keeper on the Witness Council before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to drive a substantive operation against League material."
  ]
};
