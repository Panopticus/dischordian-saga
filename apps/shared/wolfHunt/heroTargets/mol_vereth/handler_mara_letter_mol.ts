import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_MARA_LETTER_MOL: HeroTarget = {
  "id": "handler_mara_letter_mol",
  "name": "Handler Mara Letter",
  "classKey": "spy",
  "corruptorLord": "mol_vereth",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "named_signal",
      "category": "spy",
      "severity": 1
    },
    {
      "id": "rumor_seed",
      "category": "spy",
      "severity": 1
    },
    {
      "id": "patient_subversion",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "shadow_tongue_handle",
      "category": "spy",
      "severity": 2
    }
  ],
  "tells": [
    "Carries a cobalt thread visible only when she laughs.",
    "Extracts agreement under reasonable framing."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Handler Mara Letter served the League as a long-listen officer in the League's counter-intelligence before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to hold a cell of the Crucible's lattice."
  ]
};
