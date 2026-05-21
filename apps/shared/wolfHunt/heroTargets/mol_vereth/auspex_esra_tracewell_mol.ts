import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_ESRA_TRACEWELL_MOL: HeroTarget = {
  "id": "auspex_esra_tracewell_mol",
  "name": "Auspex Esra Tracewell",
  "classKey": "oracle",
  "corruptorLord": "mol_vereth",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Auspex Esra Tracewell served the League as a auspice keeper on the Witness Council before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to hold a cell of the Crucible's lattice."
  ]
};
