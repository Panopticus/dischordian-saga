import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_ELEN_MARGIN_RIRI: HeroTarget = {
  "id": "auspex_elen_margin_riri",
  "name": "Auspex Elen Margin",
  "classKey": "oracle",
  "corruptorLord": "riri_ahlia",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "lunatic_compass",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "phase_displacement",
      "category": "oracle",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Names the next four moves before the first.",
    "Recites the hunter's vows back to him at unhelpful moments.",
    "Describes the hunter's eventual loss aloud, then attempts it."
  ],
  "lairLocation": "tasking_yards",
  "briefingHints": [
    "Auspex Elen Margin served the League as a auspice keeper on the Witness Council before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses her to anchor a load-bearing column of the corruption."
  ]
};
