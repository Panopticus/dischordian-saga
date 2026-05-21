import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_JORAH_TRACEWELL_ZYR: HeroTarget = {
  "id": "auspex_jorah_tracewell_zyr",
  "name": "Auspex Jorah Tracewell",
  "classKey": "oracle",
  "corruptorLord": "zyr_koth",
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
    "Auspex Jorah Tracewell served the League as a auspice keeper on the Witness Council before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to hold a cell of the Crucible's lattice."
  ]
};
