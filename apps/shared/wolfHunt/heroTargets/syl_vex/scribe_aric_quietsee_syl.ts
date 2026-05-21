import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_ARIC_QUIETSEE_SYL: HeroTarget = {
  "id": "scribe_aric_quietsee_syl",
  "name": "Scribe Aric Quietsee",
  "classKey": "oracle",
  "corruptorLord": "syl_vex",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "interest_compounder",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "default_reckoning",
      "category": "oracle",
      "severity": 2
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
    }
  ],
  "tells": [
    "Names every promise the hunter has made aloud."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Scribe Aric Quietsee served the League as a auspice keeper on the Witness Council before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to hold a cell of the Crucible's lattice."
  ]
};
