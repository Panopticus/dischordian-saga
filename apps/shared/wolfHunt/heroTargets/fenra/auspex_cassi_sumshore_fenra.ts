import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_CASSI_SUMSHORE_FENRA: HeroTarget = {
  "id": "auspex_cassi_sumshore_fenra",
  "name": "Auspex Cassi Sumshore",
  "classKey": "oracle",
  "corruptorLord": "fenra",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
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
      "id": "interest_compounder",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "default_reckoning",
      "category": "oracle",
      "severity": 2
    }
  ],
  "tells": [
    "Describes the hunter's eventual loss aloud, then attempts it.",
    "Reads the engagement's celestial alignment before committing."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Auspex Cassi Sumshore served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to hold a cell of the Crucible's lattice."
  ]
};
