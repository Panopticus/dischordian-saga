import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_ONEK_LISTENER_MOL: HeroTarget = {
  "id": "listener_onek_listener_mol",
  "name": "Listener Onek Listener",
  "classKey": "spy",
  "corruptorLord": "mol_vereth",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "whisper_inheritance",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "thaloria_dialect",
      "category": "spy",
      "severity": 3
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
    },
    {
      "id": "cobalt_conversion",
      "category": "spy",
      "severity": 3
    }
  ],
  "tells": [
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "trustee_archive",
  "briefingHints": [
    "Listener Onek Listener served the League as a long-listen officer in the League's counter-intelligence before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to anchor a load-bearing column of the corruption."
  ]
};
