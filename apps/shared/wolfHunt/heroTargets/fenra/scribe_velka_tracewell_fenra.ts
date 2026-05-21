import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_VELKA_TRACEWELL_FENRA: HeroTarget = {
  "id": "scribe_velka_tracewell_fenra",
  "name": "Scribe Velka Tracewell",
  "classKey": "oracle",
  "corruptorLord": "fenra",
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
  "lairLocation": "antechamber",
  "briefingHints": [
    "Scribe Velka Tracewell served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to hold a cell of the Crucible's lattice."
  ]
};
