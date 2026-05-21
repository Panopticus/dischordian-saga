import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_JUREL_FOUNDLING_MOL: HeroTarget = {
  "id": "handler_jurel_foundling_mol",
  "name": "Handler Jurel Foundling",
  "classKey": "spy",
  "corruptorLord": "mol_vereth",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "mirror_argument",
      "category": "spy",
      "severity": 3
    },
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
    }
  ],
  "tells": [
    "Argues the hunter into his opposite without raising the voice.",
    "Knows the hunter's name in a register he has not used since boyhood."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Handler Jurel Foundling served the League as a long-listen officer in the League's counter-intelligence before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to drive a substantive operation against League material."
  ]
};
