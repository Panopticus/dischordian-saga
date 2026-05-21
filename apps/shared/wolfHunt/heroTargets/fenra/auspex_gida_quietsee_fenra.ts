import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_GIDA_QUIETSEE_FENRA: HeroTarget = {
  "id": "auspex_gida_quietsee_fenra",
  "name": "Auspex Gida Quietsee",
  "classKey": "oracle",
  "corruptorLord": "fenra",
  "threatTier": 2,
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
    }
  ],
  "tells": [
    "Names every promise the hunter has made aloud.",
    "Compounds the cost of the hunter's repeated choices.",
    "Names the next four moves before the first."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Auspex Gida Quietsee served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to hold a cell of the Crucible's lattice."
  ]
};
