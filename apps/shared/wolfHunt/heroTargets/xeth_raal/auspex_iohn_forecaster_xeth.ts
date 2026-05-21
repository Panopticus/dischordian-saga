import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_IOHN_FORECASTER_XETH: HeroTarget = {
  "id": "auspex_iohn_forecaster_xeth",
  "name": "Auspex Iohn Forecaster",
  "classKey": "oracle",
  "corruptorLord": "xeth_raal",
  "threatTier": 2,
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
      "id": "interest_compounder",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "default_reckoning",
      "category": "oracle",
      "severity": 2
    }
  ],
  "tells": [
    "Describes the hunter's eventual loss aloud, then attempts it.",
    "Reads the engagement's celestial alignment before committing."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Iohn Forecaster served the League as a auspice keeper on the Witness Council before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to hold a cell of the Crucible's lattice."
  ]
};
