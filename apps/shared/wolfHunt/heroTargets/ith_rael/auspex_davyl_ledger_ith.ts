import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_DAVYL_LEDGER_ITH: HeroTarget = {
  "id": "auspex_davyl_ledger_ith",
  "name": "Auspex Davyl Ledger",
  "classKey": "oracle",
  "corruptorLord": "ith_rael",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "default_reckoning",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "tidal_prediction",
      "category": "oracle",
      "severity": 3
    },
    {
      "id": "celestial_indexing",
      "category": "oracle",
      "severity": 3
    },
    {
      "id": "lunatic_compass",
      "category": "oracle",
      "severity": 2
    }
  ],
  "tells": [
    "Compounds the cost of the hunter's repeated choices.",
    "Names the next four moves before the first."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Davyl Ledger served the League as a auspice keeper on the Witness Council before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses her to drive a substantive operation against League material."
  ]
};
