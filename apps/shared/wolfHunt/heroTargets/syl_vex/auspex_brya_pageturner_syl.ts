import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_BRYA_PAGETURNER_SYL: HeroTarget = {
  "id": "auspex_brya_pageturner_syl",
  "name": "Auspex Brya Pageturner",
  "classKey": "oracle",
  "corruptorLord": "syl_vex",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Compounds the cost of the hunter's repeated choices.",
    "Names the next four moves before the first."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Auspex Brya Pageturner served the League as a auspice keeper on the Witness Council before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to drive a substantive operation against League material."
  ]
};
