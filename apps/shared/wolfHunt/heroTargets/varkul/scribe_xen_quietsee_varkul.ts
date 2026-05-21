import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_XEN_QUIETSEE_VARKUL: HeroTarget = {
  "id": "scribe_xen_quietsee_varkul",
  "name": "Scribe Xen Quietsee",
  "classKey": "oracle",
  "corruptorLord": "varkul",
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
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Scribe Xen Quietsee served the League as a auspice keeper on the Witness Council before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses her to hold a cell of the Crucible's lattice."
  ]
};
