import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_HEKLA_READS_XETH: HeroTarget = {
  "id": "scribe_hekla_reads_xeth",
  "name": "Scribe Hekla Reads",
  "classKey": "oracle",
  "corruptorLord": "xeth_raal",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    }
  ],
  "tells": [
    "Recites the hunter's vows back to him at unhelpful moments."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Scribe Hekla Reads served the League as a auspice keeper on the Witness Council before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to scout the threshold rooms."
  ]
};
