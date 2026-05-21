import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_KYNAN_CALIBRE_XETH: HeroTarget = {
  "id": "scribe_kynan_calibre_xeth",
  "name": "Scribe Kynan Calibre",
  "classKey": "oracle",
  "corruptorLord": "xeth_raal",
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
    "Steps out of tempo for a count and returns inside the guard."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Scribe Kynan Calibre served the League as a auspice keeper on the Witness Council before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to anchor a load-bearing column of the corruption."
  ]
};
