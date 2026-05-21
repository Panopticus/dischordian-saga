import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_XANTO_VEIL_DRAEL: HeroTarget = {
  "id": "auspex_xanto_veil_drael",
  "name": "Auspex Xanto Veil",
  "classKey": "oracle",
  "corruptorLord": "drael_mon",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Indexes the engagement against an unseen calendar.",
    "Names every promise the hunter has made aloud.",
    "Compounds the cost of the hunter's repeated choices."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Auspex Xanto Veil served the League as a auspice keeper on the Witness Council before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses her to scout the threshold rooms."
  ]
};
