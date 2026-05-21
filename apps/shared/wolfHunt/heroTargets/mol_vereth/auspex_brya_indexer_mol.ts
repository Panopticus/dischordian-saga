import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_BRYA_INDEXER_MOL: HeroTarget = {
  "id": "auspex_brya_indexer_mol",
  "name": "Auspex Brya Indexer",
  "classKey": "oracle",
  "corruptorLord": "mol_vereth",
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
    "Reads the engagement's celestial alignment before committing.",
    "Steps out of tempo for a count and returns inside the guard.",
    "Indexes the engagement against an unseen calendar."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Auspex Brya Indexer served the League as a auspice keeper on the Witness Council before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to drive a substantive operation against League material."
  ]
};
