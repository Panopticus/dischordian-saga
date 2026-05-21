import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_DAVYL_BECKON_FENRA: HeroTarget = {
  "id": "auspex_davyl_beckon_fenra",
  "name": "Auspex Davyl Beckon",
  "classKey": "oracle",
  "corruptorLord": "fenra",
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
    "Reads the engagement's celestial alignment before committing.",
    "Steps out of tempo for a count and returns inside the guard.",
    "Indexes the engagement against an unseen calendar."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Davyl Beckon served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to drive a substantive operation against League material."
  ]
};
