import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_FAOLAN_HOLLOWAY_MOL: HeroTarget = {
  "id": "reaper_faolan_holloway_mol",
  "name": "Reaper Faolan Holloway",
  "classKey": "assassin",
  "corruptorLord": "mol_vereth",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "harvest_pace",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "veil_step",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "cathedral_resonance",
      "category": "assassin",
      "severity": 3
    }
  ],
  "tells": [
    "Takes the dead's last memory along with the life."
  ],
  "lairLocation": "trustee_archive",
  "briefingHints": [
    "Reaper Faolan Holloway served the League as a retrieval specialist in the League's quiet branch before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to drive a substantive operation against League material."
  ]
};
