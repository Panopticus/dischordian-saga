import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_JUREL_INDEXER_XETH: HeroTarget = {
  "id": "auspex_jurel_indexer_xeth",
  "name": "Auspex Jurel Indexer",
  "classKey": "oracle",
  "corruptorLord": "xeth_raal",
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
    "Reads the engagement's celestial alignment before committing.",
    "Steps out of tempo for a count and returns inside the guard.",
    "Indexes the engagement against an unseen calendar."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Auspex Jurel Indexer served the League as a auspice keeper on the Witness Council before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to drive a substantive operation against League material."
  ]
};
