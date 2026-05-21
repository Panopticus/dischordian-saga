import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_YARROW_POSTMASTER_MOL: HeroTarget = {
  "id": "listener_yarrow_postmaster_mol",
  "name": "Listener Yarrow Postmaster",
  "classKey": "spy",
  "corruptorLord": "mol_garath",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "cobalt_conversion",
      "category": "spy",
      "severity": 3
    },
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
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "unmakers_court",
  "briefingHints": [
    "Listener Yarrow Postmaster served the League as a long-listen officer in the League's counter-intelligence before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to anchor a load-bearing column of the corruption."
  ]
};
