import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_WREN_CALIBRE_DRAEL: HeroTarget = {
  "id": "auspex_wren_calibre_drael",
  "name": "Auspex Wren Calibre",
  "classKey": "oracle",
  "corruptorLord": "drael_mon",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    }
  ],
  "tells": [
    "Steps out of tempo for a count and returns inside the guard.",
    "Indexes the engagement against an unseen calendar."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Wren Calibre served the League as a auspice keeper on the Witness Council before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses her to anchor a load-bearing column of the corruption."
  ]
};
