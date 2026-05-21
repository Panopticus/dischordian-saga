import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_WIRA_FOREWRIGHT_VARKUL: HeroTarget = {
  "id": "auspex_wira_forewright_varkul",
  "name": "Auspex Wira Forewright",
  "classKey": "oracle",
  "corruptorLord": "varkul",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Auspex Wira Forewright served the League as a auspice keeper on the Witness Council before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses her to scout the threshold rooms."
  ]
};
