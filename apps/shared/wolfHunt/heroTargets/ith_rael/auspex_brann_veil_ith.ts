import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_BRANN_VEIL_ITH: HeroTarget = {
  "id": "auspex_brann_veil_ith",
  "name": "Auspex Brann Veil",
  "classKey": "oracle",
  "corruptorLord": "ith_rael",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Auspex Brann Veil served the League as a auspice keeper on the Witness Council before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses her to scout the threshold rooms."
  ]
};
