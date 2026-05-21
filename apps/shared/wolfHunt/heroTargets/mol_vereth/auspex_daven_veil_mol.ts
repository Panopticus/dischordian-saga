import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_DAVEN_VEIL_MOL: HeroTarget = {
  "id": "auspex_daven_veil_mol",
  "name": "Auspex Daven Veil",
  "classKey": "oracle",
  "corruptorLord": "mol_vereth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "default_reckoning",
      "category": "oracle",
      "severity": 2
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
    }
  ],
  "tells": [
    "Indexes the engagement against an unseen calendar.",
    "Names every promise the hunter has made aloud."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Auspex Daven Veil served the League as a auspice keeper on the Witness Council before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to scout the threshold rooms."
  ]
};
