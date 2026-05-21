import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_BRANN_WATCH_FENRA: HeroTarget = {
  "id": "scribe_brann_watch_fenra",
  "name": "Scribe Brann Watch",
  "classKey": "oracle",
  "corruptorLord": "fenra",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Scribe Brann Watch served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to scout the threshold rooms."
  ]
};
