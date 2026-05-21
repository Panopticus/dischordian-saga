import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_AEVYN_CALIBRE_ITH: HeroTarget = {
  "id": "auspex_aevyn_calibre_ith",
  "name": "Auspex Aevyn Calibre",
  "classKey": "oracle",
  "corruptorLord": "ith_rael",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "ledger_sight",
      "category": "oracle",
      "severity": 3
    },
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
    "Steps out of tempo for a count and returns inside the guard.",
    "Indexes the engagement against an unseen calendar."
  ],
  "lairLocation": "rylloh_galleries",
  "briefingHints": [
    "Auspex Aevyn Calibre served the League as a auspice keeper on the Witness Council before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses her to anchor a load-bearing column of the corruption."
  ]
};
