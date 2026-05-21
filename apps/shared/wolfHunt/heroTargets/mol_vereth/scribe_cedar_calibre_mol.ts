import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_CEDAR_CALIBRE_MOL: HeroTarget = {
  "id": "scribe_cedar_calibre_mol",
  "name": "Scribe Cedar Calibre",
  "classKey": "oracle",
  "corruptorLord": "mol_vereth",
  "threatTier": 4,
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
      "id": "ledger_sight",
      "category": "oracle",
      "severity": 3
    },
    {
      "id": "contract_recall",
      "category": "oracle",
      "severity": 3
    },
    {
      "id": "interest_compounder",
      "category": "oracle",
      "severity": 2
    }
  ],
  "tells": [
    "Steps out of tempo for a count and returns inside the guard."
  ],
  "lairLocation": "trustee_archive",
  "briefingHints": [
    "Scribe Cedar Calibre served the League as a auspice keeper on the Witness Council before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to anchor a load-bearing column of the corruption."
  ]
};
