import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_XALA_TWO_HANDS_MOL: HeroTarget = {
  "id": "handler_xala_two_hands_mol",
  "name": "Handler Xala Two-Hands",
  "classKey": "spy",
  "corruptorLord": "mol_garath",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "shadow_tongue_handle",
      "category": "spy",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Handler Xala Two-Hands served the League as a long-listen officer in the League's counter-intelligence before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to drive a substantive operation against League material."
  ]
};
