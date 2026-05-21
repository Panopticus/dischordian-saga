import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_ZOFIA_FOREWRIGHT_SYL: HeroTarget = {
  "id": "auspex_zofia_forewright_syl",
  "name": "Auspex Zofia Forewright",
  "classKey": "oracle",
  "corruptorLord": "syl_vex",
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
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Zofia Forewright served the League as a auspice keeper on the Witness Council before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to scout the threshold rooms."
  ]
};
