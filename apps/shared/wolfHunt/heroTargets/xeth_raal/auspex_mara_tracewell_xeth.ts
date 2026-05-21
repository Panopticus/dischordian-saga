import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_MARA_TRACEWELL_XETH: HeroTarget = {
  "id": "auspex_mara_tracewell_xeth",
  "name": "Auspex Mara Tracewell",
  "classKey": "oracle",
  "corruptorLord": "xeth_raal",
  "threatTier": 2,
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
    }
  ],
  "tells": [
    "Names every promise the hunter has made aloud.",
    "Compounds the cost of the hunter's repeated choices.",
    "Names the next four moves before the first."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Auspex Mara Tracewell served the League as a auspice keeper on the Witness Council before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to hold a cell of the Crucible's lattice."
  ]
};
