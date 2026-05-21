import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_YAEL_PAGETURNER_VARKUL: HeroTarget = {
  "id": "auspex_yael_pageturner_varkul",
  "name": "Auspex Yael Pageturner",
  "classKey": "oracle",
  "corruptorLord": "varkul",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Compounds the cost of the hunter's repeated choices.",
    "Names the next four moves before the first."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Auspex Yael Pageturner served the League as a auspice keeper on the Witness Council before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses her to drive a substantive operation against League material."
  ]
};
