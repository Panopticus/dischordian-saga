import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_CYRIL_TRACEWELL_RIRI: HeroTarget = {
  "id": "scribe_cyril_tracewell_riri",
  "name": "Scribe Cyril Tracewell",
  "classKey": "oracle",
  "corruptorLord": "riri_ahlia",
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
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Scribe Cyril Tracewell served the League as a auspice keeper on the Witness Council before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses her to hold a cell of the Crucible's lattice."
  ]
};
