import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_FAOLAN_PAGETURNER_XETH: HeroTarget = {
  "id": "auspex_faolan_pageturner_xeth",
  "name": "Auspex Faolan Pageturner",
  "classKey": "oracle",
  "corruptorLord": "xeth_raal",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "contract_recall",
      "category": "oracle",
      "severity": 3
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
    },
    {
      "id": "tidal_prediction",
      "category": "oracle",
      "severity": 3
    }
  ],
  "tells": [
    "Compounds the cost of the hunter's repeated choices.",
    "Names the next four moves before the first."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Auspex Faolan Pageturner served the League as a auspice keeper on the Witness Council before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to drive a substantive operation against League material."
  ]
};
