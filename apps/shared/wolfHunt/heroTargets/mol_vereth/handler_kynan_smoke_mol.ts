import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_KYNAN_SMOKE_MOL: HeroTarget = {
  "id": "handler_kynan_smoke_mol",
  "name": "Handler Kynan Smoke",
  "classKey": "spy",
  "corruptorLord": "mol_vereth",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "consent_extraction",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "long_listen",
      "category": "spy",
      "severity": 2
    },
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
      "id": "whisper_inheritance",
      "category": "spy",
      "severity": 3
    }
  ],
  "tells": [
    "Knows the hunter's name in a register he has not used since boyhood.",
    "Plants a false rumour that returns as accepted truth.",
    "Carries a cobalt thread visible only when she laughs."
  ],
  "lairLocation": "trustee_archive",
  "briefingHints": [
    "Handler Kynan Smoke served the League as a long-listen officer in the League's counter-intelligence before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to anchor a load-bearing column of the corruption."
  ]
};
