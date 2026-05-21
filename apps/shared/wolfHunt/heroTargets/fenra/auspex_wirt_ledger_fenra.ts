import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_WIRT_LEDGER_FENRA: HeroTarget = {
  "id": "auspex_wirt_ledger_fenra",
  "name": "Auspex Wirt Ledger",
  "classKey": "oracle",
  "corruptorLord": "fenra",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Compounds the cost of the hunter's repeated choices.",
    "Names the next four moves before the first."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Auspex Wirt Ledger served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to drive a substantive operation against League material."
  ]
};
