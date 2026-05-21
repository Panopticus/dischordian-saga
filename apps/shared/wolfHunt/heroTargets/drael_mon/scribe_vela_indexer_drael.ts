import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_VELA_INDEXER_DRAEL: HeroTarget = {
  "id": "scribe_vela_indexer_drael",
  "name": "Scribe Vela Indexer",
  "classKey": "oracle",
  "corruptorLord": "drael_mon",
  "threatTier": 3,
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
    },
    {
      "id": "ledger_sight",
      "category": "oracle",
      "severity": 3
    }
  ],
  "tells": [
    "Reads the engagement's celestial alignment before committing."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Scribe Vela Indexer served the League as a auspice keeper on the Witness Council before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses her to drive a substantive operation against League material."
  ]
};
