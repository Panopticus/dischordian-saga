import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_YOREK_TRACEWELL_DRAEL: HeroTarget = {
  "id": "scribe_yorek_tracewell_drael",
  "name": "Scribe Yorek Tracewell",
  "classKey": "oracle",
  "corruptorLord": "drael_mon",
  "threatTier": 2,
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
      "id": "lunatic_compass",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "phase_displacement",
      "category": "oracle",
      "severity": 2
    }
  ],
  "tells": [
    "Names every promise the hunter has made aloud."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Scribe Yorek Tracewell served the League as a auspice keeper on the Witness Council before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses her to hold a cell of the Crucible's lattice."
  ]
};
