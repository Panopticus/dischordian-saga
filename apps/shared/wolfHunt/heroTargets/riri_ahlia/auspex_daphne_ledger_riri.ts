import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_DAPHNE_LEDGER_RIRI: HeroTarget = {
  "id": "auspex_daphne_ledger_riri",
  "name": "Auspex Daphne Ledger",
  "classKey": "oracle",
  "corruptorLord": "riri_ahlia",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "celestial_indexing",
      "category": "oracle",
      "severity": 3
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
    },
    {
      "id": "vow_reading",
      "category": "oracle",
      "severity": 1
    }
  ],
  "tells": [
    "Compounds the cost of the hunter's repeated choices.",
    "Names the next four moves before the first."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Auspex Daphne Ledger served the League as a auspice keeper on the Witness Council before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses her to drive a substantive operation against League material."
  ]
};
