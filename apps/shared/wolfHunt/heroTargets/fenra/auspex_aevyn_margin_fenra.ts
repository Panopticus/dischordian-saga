import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_AEVYN_MARGIN_FENRA: HeroTarget = {
  "id": "auspex_aevyn_margin_fenra",
  "name": "Auspex Aevyn Margin",
  "classKey": "oracle",
  "corruptorLord": "fenra",
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
    "Names the next four moves before the first.",
    "Recites the hunter's vows back to him at unhelpful moments.",
    "Describes the hunter's eventual loss aloud, then attempts it."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Auspex Aevyn Margin served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to anchor a load-bearing column of the corruption."
  ]
};
