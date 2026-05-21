import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_GWYN_PELL_XETH: HeroTarget = {
  "id": "auspex_gwyn_pell_xeth",
  "name": "Auspex Gwyn Pell",
  "classKey": "oracle",
  "corruptorLord": "xeth_raal",
  "threatTier": 4,
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
      "id": "tidal_prediction",
      "category": "oracle",
      "severity": 3
    },
    {
      "id": "celestial_indexing",
      "category": "oracle",
      "severity": 3
    },
    {
      "id": "lunatic_compass",
      "category": "oracle",
      "severity": 2
    }
  ],
  "tells": [
    "Names the next four moves before the first.",
    "Recites the hunter's vows back to him at unhelpful moments.",
    "Describes the hunter's eventual loss aloud, then attempts it."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Auspex Gwyn Pell served the League as a auspice keeper on the Witness Council before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to anchor a load-bearing column of the corruption."
  ]
};
