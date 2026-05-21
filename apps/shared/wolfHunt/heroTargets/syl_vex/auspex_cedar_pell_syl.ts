import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_CEDAR_PELL_SYL: HeroTarget = {
  "id": "auspex_cedar_pell_syl",
  "name": "Auspex Cedar Pell",
  "classKey": "oracle",
  "corruptorLord": "syl_vex",
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
    "Names the next four moves before the first.",
    "Recites the hunter's vows back to him at unhelpful moments.",
    "Describes the hunter's eventual loss aloud, then attempts it."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Cedar Pell served the League as a auspice keeper on the Witness Council before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to anchor a load-bearing column of the corruption."
  ]
};
